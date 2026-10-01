<?php
declare(strict_types=1);

require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$secret = analyticsEnv('CRON_SECRET');
$authorization = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
if ($secret === null || !hash_equals('Bearer ' . $secret, $authorization)) {
    analyticsJsonResponse(['ok' => false, 'message' => 'Non autorizzato.'], 401);
}

try {
    $siteKey = analyticsSanitizeString($_GET['site_key'] ?? null, 160) ?? analyticsDefaultSiteKey();
    $db = analyticsDbForSite($siteKey);
    $report = analyticsBuildReport($db, $siteKey, 7);
    $site = analyticsFindSite($db, $siteKey);
    $monitoring = analyticsMonitoringSummary($db, (int) $site['id']);
    $dashboardUrl = analyticsEnv('DASHBOARD_URL', 'https://ciuffo-analytics-dashboard.vercel.app');
    $metrics = $report['metrics'];
    $change = static fn(array $metric): string => $metric['change'] === null ? 'n/d' : (($metric['change'] >= 0 ? '+' : '') . round((float) $metric['change']) . '%');
    $lines = [
        '📊 <b>Ciuffo Portfolio — Report settimanale</b>',
        '',
        'Visitatori: <b>' . number_format((float) $metrics['visitors']['value'], 0, ',', '.') . '</b> (' . $change($metrics['visitors']) . ')',
        'Sessioni: <b>' . number_format((float) $metrics['sessions']['value'], 0, ',', '.') . '</b> (' . $change($metrics['sessions']) . ')',
        'Pageview: <b>' . number_format((float) $metrics['pageviews']['value'], 0, ',', '.') . '</b> (' . $change($metrics['pageviews']) . ')',
        'Engagement: <b>' . round((float) $metrics['engagement']['value']) . '%</b>',
        'Conversioni: <b>' . number_format((float) $metrics['conversions']['value'], 0, ',', '.') . '</b>',
        '',
        !empty($report['attention']) ? '⚠️ <b>' . count($report['attention']) . ' elementi da controllare</b>' : '✅ Nessun problema rilevante',
        '✅ Monitoring: <b>' . (($monitoring['status'] ?? '') === 'online' ? 'OK' : 'attenzione') . '</b>',
        '',
        'Dashboard: ' . htmlspecialchars((string) $dashboardUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
    ];
    $token = analyticsEnv('TELEGRAM_BOT_TOKEN');
    $chatId = analyticsEnv('TELEGRAM_CHAT_ID');
    if ($token === null || $chatId === null) analyticsJsonResponse(['ok' => false, 'message' => 'Telegram non configurato.'], 503);
    $url = 'https://api.telegram.org/bot' . rawurlencode($token) . '/sendMessage';
    $curl = curl_init($url);
    curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query(['chat_id' => $chatId, 'text' => implode("\n", $lines), 'parse_mode' => 'HTML', 'disable_web_page_preview' => 'true']), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
    $response = curl_exec($curl); $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE); $error = curl_error($curl) ?: null;
    if ($error !== null || $status < 200 || $status >= 300) { error_log('[Ciuffo Analytics] Telegram invio fallito.'); analyticsJsonResponse(['ok' => false, 'message' => 'Invio Telegram fallito.'], 502); }
    error_log('[Ciuffo Analytics] Telegram report inviato.');
    analyticsJsonResponse(['ok' => true, 'sent_at' => gmdate('c')]);
} catch (Throwable $exception) { analyticsErrorResponse($exception, 'Errore nella generazione del report Telegram.'); }
