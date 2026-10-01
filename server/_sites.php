<?php
declare(strict_types=1);

function analyticsSiteRegistry(): array
{
    static $registry;
    if (is_array($registry)) return $registry;
    $config = require __DIR__ . '/config/sites.php';
    $registry = is_array($config) ? $config : [];
    return $registry;
}

function analyticsConfiguredSites(): array
{
    $sites = analyticsSiteRegistry()['sites'] ?? [];
    return is_array($sites) ? $sites : [];
}

function analyticsDefaultSiteKey(): string
{
    $configured = analyticsSiteRegistry()['default_site_key'] ?? null;
    if (is_string($configured) && isset(analyticsConfiguredSites()[$configured])) return $configured;
    foreach (analyticsConfiguredSites() as $siteKey => $site) {
        if (is_array($site) && ($site['enabled'] ?? false)) return (string) $siteKey;
    }
    throw new RuntimeException('Nessun sito analytics configurato.');
}

function analyticsSiteConfig(string $siteKey): ?array
{
    $config = analyticsConfiguredSites()[$siteKey] ?? null;
    return is_array($config) ? $config : null;
}

function analyticsDatabaseKeyForSite(string $siteKey): string
{
    $config = analyticsSiteConfig($siteKey);
    $databaseKey = is_array($config) ? ($config['database_key'] ?? 'default') : 'default';
    return preg_match('/^[A-Za-z0-9_]+$/', (string) $databaseKey) ? (string) $databaseKey : 'default';
}
