<?php
declare(strict_types=1);

require dirname(__DIR__) . '/server/_bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    analyticsJsonResponse(['ok' => false, 'message' => 'Metodo non consentito.'], 405);
}

try {
    $statement = analyticsDb()->query(
        'SELECT site_key, name, domain FROM sites WHERE enabled = TRUE ORDER BY name ASC, site_key ASC'
    );
    $sites = array_map(static fn (array $site): array => [
        'site_key' => (string) $site['site_key'],
        'name' => (string) $site['name'],
        'domain' => $site['domain'] !== null ? (string) $site['domain'] : null,
    ], $statement->fetchAll());

    analyticsJsonResponse(['ok' => true, 'sites' => $sites]);
} catch (Throwable $exception) {
    analyticsErrorResponse($exception, 'Errore nel caricamento dei siti analytics.');
}
