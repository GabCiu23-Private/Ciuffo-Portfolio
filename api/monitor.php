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
    $insert = $db->prepare('INSERT INTO monitoring_checks (site_id, check_name, check_type, target_url, status, http_status, latency_ms, details, checked_at) VALUES (:site_id,:name,:type,:url,:status,:http,:latency,CAST(:details AS jsonb),NOW())'); $checks=[];
    foreach (($siteConfig['checks'] ?? []) as $check) {
        $url=analyticsSanitizeString($check['url'] ?? null,2048); if($url===null)continue; $started=microtime(true);$statusCode=0;$curlError=null;
        if(function_exists('curl_init')){$curl=curl_init($url);curl_setopt_array($curl,[CURLOPT_NOBODY=>true,CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_TIMEOUT=>8,CURLOPT_USERAGENT=>'Ciuffo-Analytics-monitor/1.0']);curl_exec($curl);$statusCode=(int)curl_getinfo($curl,CURLINFO_HTTP_CODE);$curlError=curl_error($curl)?:null;}else{$headers=@get_headers($url);$statusCode=$headers&&isset($headers[0])&&preg_match('/\s(\d{3})\s/',$headers[0],$matches)?(int)$matches[1]:0;}
        $latency=(int)round((microtime(true)-$started)*1000);$status=$statusCode>=200&&$statusCode<400?'online':'offline';$details=['url'=>$url];if($curlError)$details['error']=$curlError;
        $insert->execute([':site_id'=>$siteId,':name'=>analyticsSanitizeString($check['name']??null,255)??$url,':type'=>'http',':url'=>$url,':status'=>$status,':http'=>$statusCode?:null,':latency'=>$latency,':details'=>json_encode($details,JSON_UNESCAPED_SLASHES)]);
        $checks[]=['name'=>$check['name']??$url,'detail'=>$url.($statusCode?' · HTTP '.$statusCode:' · Nessuna risposta dal check HTTP.'),'status'=>$status,'http_status'=>$statusCode?:null,'latency_ms'=>$latency,'checked_at'=>gmdate('c')];
    }
    analyticsJsonResponse(['ok'=>true,'site_key'=>$key,'generated_at'=>gmdate('c'),'checks'=>$checks,'recent_failures'=>analyticsRecentFailures($db,$siteId)]);
} catch(Throwable $exception){analyticsErrorResponse($exception,'Errore nel monitoring.');}
function analyticsRecentFailures(PDO $db,int $siteId):array{$s=$db->prepare("SELECT check_name,status,http_status,latency_ms,checked_at FROM monitoring_checks WHERE site_id=:site_id AND status='offline' ORDER BY checked_at DESC LIMIT 10");$s->execute([':site_id'=>$siteId]);return $s->fetchAll();}
