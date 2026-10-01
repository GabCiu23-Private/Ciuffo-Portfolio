<?php
declare(strict_types=1);
require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';
try {
    $key=analyticsSanitizeString($_GET['site_key']??null,160)??analyticsDefaultSiteKey(); $db=analyticsDbForSite($key); $report=analyticsBuildReport($db,$key,7);
    $site=analyticsFindSite($db,$key); $report['monitoring']=analyticsMonitoringSummary($db,(int)$site['id']); $report['dashboard_url']=analyticsEnv('DASHBOARD_URL','/Dashboard/');
    analyticsJsonResponse($report);
} catch(Throwable $exception){analyticsErrorResponse($exception,'Errore nel report settimanale.');}
