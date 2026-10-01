<?php
declare(strict_types=1);

require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
$secret = analyticsEnv('CRON_SECRET');
$authorization = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
if ($secret === null || !hash_equals('Bearer ' . $secret, $authorization)) analyticsJsonResponse(['ok' => false, 'message' => 'Non autorizzato.'], 401);

function analyticsEnsureAlertTable(PDO $db): void
{
    $db->exec("CREATE TABLE IF NOT EXISTS alert_notifications (
        id BIGSERIAL PRIMARY KEY,
        site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
        alert_key VARCHAR(160) NOT NULL,
        fingerprint VARCHAR(255) NOT NULL,
        state VARCHAR(32) NOT NULL DEFAULT 'active',
        last_sent_at TIMESTAMPTZ,
        resolved_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (site_id, alert_key)
    )");
}

function analyticsAlertState(PDO $db, int $siteId, string $key): ?array
{
    $query = $db->prepare('SELECT * FROM alert_notifications WHERE site_id = :site_id AND alert_key = :alert_key LIMIT 1');
    $query->execute([':site_id' => $siteId, ':alert_key' => $key]);
    $row = $query->fetch();
    return $row ?: null;
}

function analyticsAlertCandidate(PDO $db, int $siteId, string $key, string $fingerprint, string $severity, string $title, string $detail): ?array
{
    $state = analyticsAlertState($db, $siteId, $key);
    if ($state && $state['state'] === 'active' && $state['fingerprint'] === $fingerprint) return null;
    return ['db' => $db, 'site_id' => $siteId, 'key' => $key, 'fingerprint' => $fingerprint, 'severity' => $severity, 'title' => $title, 'detail' => $detail];
}

function analyticsAlertRecovery(PDO $db, int $siteId, string $key, string $title, string $detail): ?array
{
    $state = analyticsAlertState($db, $siteId, $key);
    if (!$state || $state['state'] !== 'active') return null;
    return ['db' => $db, 'site_id' => $siteId, 'key' => $key, 'title' => $title, 'detail' => $detail];
}

try {
    $alerts = []; $recoveries = [];
    foreach (analyticsConfiguredSites() as $siteKey => $siteConfig) {
        if (!is_array($siteConfig) || !($siteConfig['enabled'] ?? false)) continue;
        $siteKey = (string) $siteKey; $db = analyticsDbForSite($siteKey); analyticsEnsureAlertTable($db);
        $siteId = analyticsUpsertSite($db, $siteKey, analyticsSanitizeString($siteConfig['name'] ?? null, 255), analyticsSanitizeString($siteConfig['domain'] ?? null, 2048));
        $siteName = (string) ($siteConfig['name'] ?? $siteKey);
        $checks = analyticsRunMonitoringChecks($db, $siteId, $siteConfig);
        $allOffline = $checks !== [] && count(array_filter($checks, static fn(array $check): bool => $check['status'] === 'offline')) === count($checks);
        $allOnline = $checks !== [] && count(array_filter($checks, static fn(array $check): bool => $check['status'] === 'online')) === count($checks);
        if ($allOffline) $alerts[] = analyticsAlertCandidate($db, $siteId, 'site_down', 'offline', 'critical', $siteName . ' non raggiungibile', 'Il check tecnico non riceve una risposta valida.');
        elseif ($allOnline) $recoveries[] = analyticsAlertRecovery($db, $siteId, 'site_down', $siteName . ' nuovamente online', 'Il check tecnico è rientrato.');

        $now = new DateTimeImmutable('now', analyticsTimezone()); $current = analyticsMetricSet($db, $siteId, $now->modify('-24 hours'), $now); $previous = analyticsMetricSet($db, $siteId, $now->modify('-48 hours'), $now->modify('-24 hours'));
        if ($previous['visitors'] >= 10 && $current['visitors'] <= max(1, $previous['visitors'] * .5)) $alerts[] = analyticsAlertCandidate($db, $siteId, 'traffic_drop', 'threshold', 'warning', $siteName . ': traffico in forte calo', 'Visitatori ultime 24h: ' . $current['visitors'] . ' contro ' . $previous['visitors'] . ' nelle 24h precedenti.');
        elseif ($previous['visitors'] >= 10 && $current['visitors'] > $previous['visitors'] * .5) $recoveries[] = analyticsAlertRecovery($db, $siteId, 'traffic_drop', $siteName . ': traffico rientrato', 'Il traffico è tornato sopra la soglia di attenzione.');
        if ($previous['conversions'] >= 3 && $current['conversions'] <= max(0, $previous['conversions'] * .5)) $alerts[] = analyticsAlertCandidate($db, $siteId, 'conversion_anomaly', 'threshold', 'warning', $siteName . ': conversioni anomale', 'Conversioni ultime 24h: ' . $current['conversions'] . ' contro ' . $previous['conversions'] . ' nelle 24h precedenti.');
        elseif ($previous['conversions'] >= 3 && $current['conversions'] > $previous['conversions'] * .5) $recoveries[] = analyticsAlertRecovery($db, $siteId, 'conversion_anomaly', $siteName . ': conversioni rientrate', 'Il volume di conversioni è tornato sopra la soglia di attenzione.');
    }
    $alerts = array_values(array_filter($alerts)); $recoveries = array_values(array_filter($recoveries));
    if ($alerts === [] && $recoveries === []) analyticsJsonResponse(['ok' => true, 'sent' => false, 'reason' => 'Nessun nuovo alert.']);
    $token = analyticsEnv('TELEGRAM_BOT_TOKEN'); $chatId = analyticsEnv('TELEGRAM_CHAT_ID');
    if ($token === null || $chatId === null) analyticsJsonResponse(['ok' => false, 'message' => 'Telegram non configurato.'], 503);
    $lines = ['🚨 <b>Ciuffo Analytics — Alert</b>', ''];
    foreach ($alerts as $alert) $lines[] = ($alert['severity'] === 'critical' ? '🔴 ' : '🟠 ') . '<b>' . htmlspecialchars($alert['title'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</b>' . "\n" . htmlspecialchars($alert['detail'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    foreach ($recoveries as $recovery) $lines[] = '✅ <b>' . htmlspecialchars($recovery['title'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</b>' . "\n" . htmlspecialchars($recovery['detail'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $curl = curl_init('https://api.telegram.org/bot' . rawurlencode($token) . '/sendMessage'); curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query(['chat_id'=>$chatId, 'text'=>implode("\n\n", $lines), 'parse_mode'=>'HTML', 'disable_web_page_preview'=>'true']), CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>8]);
    $response = curl_exec($curl); $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE); $error = curl_error($curl) ?: null; curl_close($curl);
    if ($error !== null || $status < 200 || $status >= 300) { error_log('[Ciuffo Analytics] Telegram alert invio fallito.'); analyticsJsonResponse(['ok'=>false,'message'=>'Invio Telegram fallito.'],502); }
    foreach ($alerts as $alert) $alert['db']->prepare("INSERT INTO alert_notifications (site_id, alert_key, fingerprint, state, last_sent_at, updated_at) VALUES (:site_id,:alert_key,:fingerprint,'active',NOW(),NOW()) ON CONFLICT (site_id,alert_key) DO UPDATE SET fingerprint=EXCLUDED.fingerprint,state='active',last_sent_at=NOW(),resolved_at=NULL,updated_at=NOW()")->execute([':site_id'=>$alert['site_id'],':alert_key'=>$alert['key'],':fingerprint'=>$alert['fingerprint']]);
    foreach ($recoveries as $recovery) $recovery['db']->prepare("UPDATE alert_notifications SET state='resolved',resolved_at=NOW(),updated_at=NOW() WHERE site_id=:site_id AND alert_key=:alert_key")->execute([':site_id'=>$recovery['site_id'],':alert_key'=>$recovery['key']]);
    error_log('[Ciuffo Analytics] Telegram alert inviato.'); analyticsJsonResponse(['ok'=>true,'sent'=>true,'alerts'=>count($alerts),'recoveries'=>count($recoveries),'sent_at'=>gmdate('c')]);
} catch (Throwable $exception) { analyticsErrorResponse($exception, 'Errore nella valutazione degli alert Telegram.'); }
