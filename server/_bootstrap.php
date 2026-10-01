<?php
declare(strict_types=1);

require_once __DIR__ . '/_db.php';

function analyticsApplyCors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = array_values(array_filter(array_map('trim', explode(',', analyticsEnv('ANALYTICS_ALLOWED_ORIGINS', '') ?? ''))));
    if ($origin !== '' && in_array($origin, $allowed, true)) header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Vary: Origin');
}
analyticsApplyCors();

function analyticsJsonResponse(array $payload, int $statusCode = 200): never
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function analyticsReadJsonInput(): array
{
    $decoded = json_decode((string) file_get_contents('php://input'), true);
    return is_array($decoded) ? $decoded : [];
}

function analyticsSanitizeString(mixed $value, int $maxLength = 255): ?string
{
    if ($value === null || is_array($value) || is_object($value)) return null;
    $value = trim((string) $value);
    if ($value === '') return null;
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength) : substr($value, 0, $maxLength);
}

function analyticsSanitizeValue(mixed $value, int $depth = 0): mixed
{
    if ($depth > 3) return null;
    if ($value === null || is_bool($value) || is_int($value) || is_float($value)) return $value;
    if (is_string($value)) return analyticsSanitizeString($value, 500);
    if (!is_array($value)) return null;
    $result = [];
    foreach ($value as $key => $item) {
        $key = analyticsSanitizeString((string) $key, 80);
        if ($key !== null) $result[$key] = analyticsSanitizeValue($item, $depth + 1);
    }
    return $result;
}

function analyticsNormalizeTimestamp(mixed $value): string
{
    $value = analyticsSanitizeString($value, 64);
    if ($value === null) return gmdate('c');
    try { return (new DateTimeImmutable($value))->format(DateTimeInterface::ATOM); }
    catch (Throwable) { return gmdate('c'); }
}

function analyticsSanitizeEvent(array $event): ?array
{
    $name = analyticsSanitizeString($event['event_name'] ?? null, 100);
    if ($name === null) return null;
    return [
        'event_id' => analyticsSanitizeString($event['event_id'] ?? $event['id'] ?? null, 160) ?? bin2hex(random_bytes(16)),
        'site_key' => analyticsSanitizeString($event['site_key'] ?? null, 160),
        'site_id' => analyticsSanitizeString($event['site_id'] ?? null, 160),
        'page_id' => analyticsSanitizeString($event['page_id'] ?? null, 255),
        'page_name' => analyticsSanitizeString($event['page_name'] ?? null, 255),
        'visitor_id' => analyticsSanitizeString($event['visitor_id'] ?? null, 160),
        'session_id' => analyticsSanitizeString($event['session_id'] ?? null, 160),
        'event_name' => $name,
        'event_value' => analyticsSanitizeString($event['event_value'] ?? null, 500),
        'metadata' => analyticsSanitizeValue($event['metadata'] ?? null),
        'occurred_at' => analyticsNormalizeTimestamp($event['occurred_at'] ?? $event['timestamp'] ?? null),
        'page_url' => analyticsSanitizeString($event['page_url'] ?? null, 2048),
        'page_path' => analyticsSanitizeString($event['page_path'] ?? null, 1024),
        'referrer' => analyticsSanitizeString($event['referrer'] ?? null, 2048),
        'utm_source' => analyticsSanitizeString($event['utm_source'] ?? null, 160),
        'utm_medium' => analyticsSanitizeString($event['utm_medium'] ?? null, 160),
        'utm_campaign' => analyticsSanitizeString($event['utm_campaign'] ?? null, 160),
        'utm_term' => analyticsSanitizeString($event['utm_term'] ?? null, 160),
        'utm_content' => analyticsSanitizeString($event['utm_content'] ?? null, 160),
        'tracking_version' => analyticsSanitizeString($event['tracking_version'] ?? null, 64),
        'viewport_width' => is_numeric($event['viewport_width'] ?? null) ? (int) $event['viewport_width'] : null,
        'viewport_height' => is_numeric($event['viewport_height'] ?? null) ? (int) $event['viewport_height'] : null,
        'screen_width' => is_numeric($event['screen_width'] ?? null) ? (int) $event['screen_width'] : null,
        'screen_height' => is_numeric($event['screen_height'] ?? null) ? (int) $event['screen_height'] : null,
        'device_type' => analyticsSanitizeString($event['device_type'] ?? null, 32),
        'browser' => analyticsSanitizeString($event['browser'] ?? null, 64),
        'os' => analyticsSanitizeString($event['os'] ?? null, 64),
        'language' => analyticsSanitizeString($event['language'] ?? null, 32),
        'timezone' => analyticsSanitizeString($event['timezone'] ?? null, 80),
    ];
}

function analyticsSanitizeEvents(mixed $events): array
{
    if (!is_array($events)) return [];
    $result = [];
    foreach ($events as $event) if (is_array($event) && ($normalized = analyticsSanitizeEvent($event)) !== null) $result[] = $normalized;
    return $result;
}

function analyticsErrorResponse(Throwable $exception, string $message): never
{
    error_log('[Ciuffo Analytics] ' . $exception->getMessage());
    $payload = ['ok' => false, 'message' => $message];
    if (analyticsEnv('APP_ENV', 'production') === 'development') $payload['detail'] = $exception->getMessage();
    analyticsJsonResponse($payload, 500);
}
