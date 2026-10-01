<?php
declare(strict_types=1);
require dirname(__DIR__) . '/server/_bootstrap.php';
require dirname(__DIR__) . '/server/_metrics.php';
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') analyticsJsonResponse(['ok'=>false,'message'=>'Metodo non consentito.'], 405);
try {
    $siteKey = analyticsSanitizeString($_GET['site_key'] ?? null, 160) ?? 'ciuffo_portfolio';
    $days = max(1, min((int)($_GET['days'] ?? 7), 366));
    analyticsJsonResponse(analyticsBuildReport(analyticsDb(), $siteKey, $days, analyticsSanitizeString($_GET['since'] ?? null, 32), analyticsSanitizeString($_GET['until'] ?? null, 32)));
} catch (Throwable $exception) { analyticsErrorResponse($exception, 'Errore nel caricamento del report analytics.'); }
