<?php
declare(strict_types=1);

function analyticsEnv(string $key, ?string $fallback = null): ?string
{
    static $loaded = false;
    if (!$loaded) {
        $loaded = true;
        analyticsLoadDotEnv();
    }
    $value = getenv($key);
    return $value === false || trim($value) === '' ? $fallback : trim($value);
}

function analyticsLoadDotEnv(): void
{
    $files = [
        dirname(__DIR__, 2) . '/.env',
        dirname(__DIR__) . '/.env',
    ];
    foreach ($files as $file) {
        if (!is_readable($file)) continue;
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) continue;
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            if ($key === '' || getenv($key) !== false) continue;
            if (strlen($value) >= 2 && (($value[0] === '"' && $value[-1] === '"') || ($value[0] === "'" && $value[-1] === "'"))) {
                $value = substr($value, 1, -1);
            }
            putenv($key . '=' . $value);
        }
    }
}

function analyticsDbForSite(string $siteKey): PDO
{
    static $connections = [];
    $databaseKey = function_exists('analyticsDatabaseKeyForSite') ? analyticsDatabaseKeyForSite($siteKey) : 'default';
    if (isset($connections[$databaseKey]) && $connections[$databaseKey] instanceof PDO) return $connections[$databaseKey];
    $url = analyticsEnv($databaseKey === 'default' ? 'DATABASE_URL' : 'DATABASE_URL_' . strtoupper($databaseKey));
    if ($url === null) throw new RuntimeException('DATABASE_URL non configurata.');
    $parts = parse_url($url);
    if ($parts === false || empty($parts['host']) || empty($parts['path'])) throw new RuntimeException('DATABASE_URL non valida.');
    parse_str((string) ($parts['query'] ?? ''), $query);
    $dsn = 'pgsql:host=' . $parts['host'] . ';dbname=' . ltrim($parts['path'], '/');
    if (isset($parts['port'])) $dsn .= ';port=' . (int) $parts['port'];
    $sslMode = !empty($query['sslmode']) ? (string) $query['sslmode'] : 'require';
    $dsn .= ';sslmode=' . preg_replace('/[^a-z_]/i', '', $sslMode);
    $dsn .= ';connect_timeout=8';
    $connections[$databaseKey] = new PDO($dsn, isset($parts['user']) ? urldecode($parts['user']) : null, isset($parts['pass']) ? urldecode($parts['pass']) : null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $connections[$databaseKey];
}

function analyticsDb(): PDO
{
    $siteKey = function_exists('analyticsDefaultSiteKey') ? analyticsDefaultSiteKey() : 'default';
    return analyticsDbForSite($siteKey);
}

function analyticsDbTransactionForSite(string $siteKey, callable $callback): mixed
{
    $db = analyticsDbForSite($siteKey);
    $db->beginTransaction();
    try {
        $result = $callback($db);
        $db->commit();
        return $result;
    } catch (Throwable $exception) {
        if ($db->inTransaction()) $db->rollBack();
        throw $exception;
    }
}

function analyticsDbTransaction(callable $callback): mixed
{
    $siteKey = function_exists('analyticsDefaultSiteKey') ? analyticsDefaultSiteKey() : 'default';
    return analyticsDbTransactionForSite($siteKey, $callback);
}
