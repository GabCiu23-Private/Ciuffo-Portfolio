<?php
declare(strict_types=1);
require dirname(__DIR__) . '/server/_bootstrap.php';

$raw = getenv('DATABASE_URL');
$parsed = is_string($raw) ? parse_url(trim($raw)) : false;
analyticsJsonResponse([
    'ok' => true,
    'has_database_url' => is_string($raw) && $raw !== '',
    'length' => is_string($raw) ? strlen($raw) : 0,
    'prefix' => is_string($raw) ? substr($raw, 0, 12) : null,
    'host' => is_array($parsed) ? ($parsed['host'] ?? null) : null,
    'path_present' => is_array($parsed) && !empty($parsed['path']),
]);
