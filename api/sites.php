<?php
declare(strict_types=1);
// Retired endpoint: reporting and server jobs moved to the unified dashboard.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
http_response_code(410);
echo json_encode(['ok' => false, 'message' => 'Endpoint ritirato.']);
exit;


require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_ingest.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    analyticsJsonResponse(['ok' => false, 'message' => 'Metodo non consentito.'], 405);
}

try {
    $scopes=analyticsRequireReportAccess();
    $sites = [];
    foreach (analyticsConfiguredSites() as $siteKey => $config) {
        if (!is_array($config) || !($config['enabled'] ?? false)) continue;
        $sites[(string) $siteKey] = [
            'site_key' => (string) ($config['site_key'] ?? $siteKey),
            'name' => (string) ($config['name'] ?? $siteKey),
            'domain' => isset($config['domain']) ? (string) $config['domain'] : null,
        ];
    }

    $statement = analyticsDbForSite(analyticsDefaultSiteKey())->query(
        'SELECT site_key, name, domain FROM sites WHERE enabled = TRUE ORDER BY name ASC, site_key ASC'
    );
    foreach ($statement->fetchAll() as $site) {
        $key = (string) $site['site_key'];
        $sites[$key] ??= [
            'site_key' => $key,
            'name' => (string) $site['name'],
            'domain' => $site['domain'] !== null ? (string) $site['domain'] : null,
        ];
    }
    if(!in_array('*',$scopes,true))$sites=array_filter($sites,static fn(array $site):bool=>in_array($site['site_key'],$scopes,true));
    uasort($sites, static fn (array $left, array $right): int => [$left['name'], $left['site_key']] <=> [$right['name'], $right['site_key']]);

    analyticsJsonResponse(['ok' => true, 'sites' => array_values($sites)]);
} catch (Throwable $exception) {
    analyticsErrorResponse($exception, 'Errore nel caricamento dei siti analytics.');
}
