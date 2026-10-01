<?php
declare(strict_types=1);
require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
try {
    $key = analyticsSanitizeString($_GET['site_key'] ?? null, 160) ?? analyticsDefaultSiteKey();
    $siteConfig = analyticsSiteConfig($key);
    if (!is_array($siteConfig)) analyticsJsonResponse(['ok'=>false,'message'=>'Sito non configurato.'], 404);
    $db = analyticsDbForSite($key); $siteId = analyticsUpsertSite($db, $key, analyticsSanitizeString($siteConfig['name'] ?? null, 255), analyticsSanitizeString($siteConfig['domain'] ?? null, 2048));
    $checks = analyticsRunMonitoringChecks($db, $siteId, $siteConfig);
    analyticsJsonResponse(['ok'=>true,'site_key'=>$key,'generated_at'=>gmdate('c'),'checks'=>$checks,'recent_failures'=>analyticsRecentFailures($db,$siteId)]);
} catch(Throwable $exception){analyticsErrorResponse($exception,'Errore nel monitoring.');}
function analyticsRecentFailures(PDO $db,int $siteId):array{$s=$db->prepare("SELECT check_name,status,http_status,latency_ms,checked_at FROM monitoring_checks WHERE site_id=:site_id AND status='offline' ORDER BY checked_at DESC LIMIT 10");$s->execute([':site_id'=>$siteId]);return $s->fetchAll();}
