<?php
declare(strict_types=1);
require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') analyticsJsonResponse(['ok'=>false,'message'=>'Metodo non consentito.'], 405);

try {
    $payload = analyticsReadJsonInput();
    $events = analyticsSanitizeEvents($payload['events'] ?? null);
    if ($events === []) analyticsJsonResponse(['ok'=>false,'message'=>'Nessun evento valido ricevuto.'], 422);
    $sitePayload = is_array($payload['site'] ?? null) ? $payload['site'] : [];
    $siteKey = analyticsSanitizeString($sitePayload['site_key'] ?? null, 160);
    foreach ($events as $event) $siteKey = $siteKey ?: analyticsSanitizeString($event['site_key'] ?? null, 160);
    if ($siteKey === null) analyticsJsonResponse(['ok'=>false,'message'=>'site_key obbligatorio.'], 422);
    foreach ($events as $event) if (($event['site_key'] ?? null) !== null && $event['site_key'] !== $siteKey) analyticsJsonResponse(['ok'=>false,'message'=>'Tutti gli eventi del batch devono usare lo stesso site_key.'], 422);

    $saved = analyticsDbTransaction(static function(PDO $db) use ($events, $siteKey, $sitePayload): int {
        $siteId = analyticsUpsertSite($db, $siteKey, analyticsSanitizeString($sitePayload['name'] ?? null, 255), analyticsSanitizeString($sitePayload['domain'] ?? null, 2048));
        $pages = [];
        $insert = $db->prepare(<<<'SQL'
INSERT INTO analytics_events (event_id, site_id, page_id, visitor_id, session_id, event_name, event_value, page_url, page_path, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, tracking_version, viewport_width, viewport_height, screen_width, screen_height, device_type, browser, os, language, timezone, metadata, occurred_at)
VALUES (:event_id, :site_id, :page_id, :visitor_id, :session_id, :event_name, :event_value, :page_url, :page_path, :referrer, :utm_source, :utm_medium, :utm_campaign, :utm_term, :utm_content, :tracking_version, :viewport_width, :viewport_height, :screen_width, :screen_height, :device_type, :browser, :os, :language, :timezone, CAST(:metadata AS jsonb), :occurred_at)
ON CONFLICT (event_id) DO NOTHING
SQL);
        $saved = 0;
        foreach ($events as $event) {
            $pageKey = $event['page_id'] ?: ($event['page_path'] ?: null);
            $pageId = null;
            if ($pageKey !== null) $pageId = $pages[(string)$pageKey] ??= analyticsUpsertPage($db, $siteId, $event);
            $metadata = $event['metadata'] === null ? null : json_encode($event['metadata'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $insert->execute([':event_id'=>$event['event_id'],':site_id'=>$siteId,':page_id'=>$pageId,':visitor_id'=>$event['visitor_id'],':session_id'=>$event['session_id'],':event_name'=>$event['event_name'],':event_value'=>$event['event_value'],':page_url'=>$event['page_url'],':page_path'=>$event['page_path'],':referrer'=>$event['referrer'],':utm_source'=>$event['utm_source'],':utm_medium'=>$event['utm_medium'],':utm_campaign'=>$event['utm_campaign'],':utm_term'=>$event['utm_term'],':utm_content'=>$event['utm_content'],':tracking_version'=>$event['tracking_version'],':viewport_width'=>$event['viewport_width'],':viewport_height'=>$event['viewport_height'],':screen_width'=>$event['screen_width'],':screen_height'=>$event['screen_height'],':device_type'=>$event['device_type'],':browser'=>$event['browser'],':os'=>$event['os'],':language'=>$event['language'],':timezone'=>$event['timezone'],':metadata'=>$metadata,':occurred_at'=>$event['occurred_at']]);
            $saved += $insert->rowCount();
        }
        return $saved;
    });
    analyticsJsonResponse(['ok'=>true,'inserted'=>$saved,'saved_events'=>$saved,'received_events'=>count($events),'received_at'=>gmdate('c')]);
} catch (Throwable $exception) { analyticsErrorResponse($exception, 'Errore nel salvataggio degli analytics.'); }
