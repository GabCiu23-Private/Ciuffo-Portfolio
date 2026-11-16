<?php
declare(strict_types=1);
// Legacy collector retired: use the central collector with explicit consent.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
http_response_code(410);
echo json_encode(['ok' => false, 'message' => 'Endpoint ritirato.']);
exit;

require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';
require dirname(__DIR__) . '/server/_ingest.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') analyticsJsonResponse(['ok'=>false,'message'=>'Metodo non consentito.'], 405);

try {
    $payload = analyticsReadJsonInput();
    [$siteKey,$siteConfig,$events]=analyticsPrepareIngest($payload,$_SERVER['HTTP_ORIGIN']??'');
    analyticsConsumeRate(analyticsDbForSite($siteKey),$siteKey,$_SERVER['REMOTE_ADDR']??'unknown',count($events));
    $sitePayload=['name'=>$siteConfig['name'],'domain'=>$siteConfig['domain']];

    $saved = analyticsDbTransactionForSite($siteKey, static function(PDO $db) use ($events, $siteKey, $sitePayload): int {
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
