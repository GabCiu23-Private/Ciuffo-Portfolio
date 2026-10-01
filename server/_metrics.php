<?php
declare(strict_types=1);

function analyticsTimezone(): DateTimeZone
{
    try { return new DateTimeZone(analyticsEnv('APP_TIMEZONE', 'Europe/Rome') ?? 'Europe/Rome'); }
    catch (Throwable) { return new DateTimeZone('UTC'); }
}

function analyticsPeriods(?string $sinceRaw, ?string $untilRaw, int $days = 7): array
{
    $tz = analyticsTimezone();
    $days = max(1, min($days, 366));
    $until = $untilRaw ? new DateTimeImmutable($untilRaw . ' 00:00:00', $tz) : new DateTimeImmutable('tomorrow', $tz);
    $since = $sinceRaw ? new DateTimeImmutable($sinceRaw . ' 00:00:00', $tz) : $until->modify('-' . $days . ' days');
    if ($until <= $since) $until = $since->modify('+' . $days . ' days');
    $length = $since->diff($until)->days ?: $days;
    return ['since' => $since, 'until' => $until, 'previous_since' => $since->modify('-' . $length . ' days'), 'previous_until' => $since, 'days' => $length, 'timezone' => $tz];
}

function analyticsFindSite(PDO $db, string $siteKey): ?array
{
    $statement = $db->prepare('SELECT * FROM sites WHERE site_key = :site_key AND enabled = TRUE LIMIT 1');
    $statement->execute([':site_key' => $siteKey]);
    $site = $statement->fetch();
    return $site ?: null;
}

function analyticsUpsertSite(PDO $db, string $siteKey, ?string $name = null, ?string $domain = null): int
{
    $statement = $db->prepare(
        'INSERT INTO sites (site_key, name, domain) VALUES (:site_key, :name, :domain)
         ON CONFLICT (site_key) DO UPDATE SET updated_at = NOW(), name = COALESCE(NULLIF(EXCLUDED.name, \'Analytics site\'), sites.name)
         RETURNING id'
    );
    $statement->execute([':site_key' => $siteKey, ':name' => $name ?: 'Analytics site', ':domain' => $domain]);
    return (int) $statement->fetchColumn();
}

function analyticsUpsertPage(PDO $db, int $siteId, array $event): ?int
{
    $pagePath = analyticsSanitizeString($event['page_path'] ?? null, 1024);
    $key = analyticsSanitizeString($event['page_id'] ?? null, 255) ?? $pagePath;
    if ($key === null) return null;

    // Production keeps page paths unique per site. Use that identity whenever
    // the tracker provides one; page_key remains the fallback for API clients
    // that only send a logical page id.
    $statement = $db->prepare($pagePath !== null
        ? 'INSERT INTO pages (site_id, page_key, page_path, page_name) VALUES (:site_id, :page_key, :page_path, :page_name)
           ON CONFLICT (site_id, page_path) DO UPDATE SET page_key = EXCLUDED.page_key,
             page_name = COALESCE(EXCLUDED.page_name, pages.page_name), updated_at = NOW() RETURNING id'
        : 'INSERT INTO pages (site_id, page_key, page_path, page_name) VALUES (:site_id, :page_key, :page_path, :page_name)
           ON CONFLICT (site_id, page_key) DO UPDATE SET page_path = COALESCE(EXCLUDED.page_path, pages.page_path),
             page_name = COALESCE(EXCLUDED.page_name, pages.page_name), updated_at = NOW() RETURNING id'
    );
    $statement->execute([':site_id' => $siteId, ':page_key' => $key, ':page_path' => $pagePath, ':page_name' => $event['page_name'] ?? $key]);
    return (int) $statement->fetchColumn();
}

function analyticsMetricSet(PDO $db, int $siteId, DateTimeImmutable $since, DateTimeImmutable $until): array
{
    $sql = <<<'SQL'
SELECT
 COUNT(DISTINCT visitor_id) FILTER (WHERE NULLIF(visitor_id, '') IS NOT NULL) AS visitors,
 COUNT(DISTINCT session_id) FILTER (WHERE NULLIF(session_id, '') IS NOT NULL) AS sessions,
 COUNT(*) FILTER (WHERE LOWER(event_name) IN ('pageview', 'page_view')) AS pageviews,
 COUNT(*) FILTER (WHERE LOWER(event_name) IN ('cta_click', 'cta_clicked')) AS cta_clicks,
 COUNT(*) FILTER (WHERE LOWER(event_name) IN ('form_submit', 'form_submitted', 'conversion', 'thank_you_view')) AS conversions,
 COUNT(DISTINCT session_id) FILTER (WHERE NULLIF(session_id, '') IS NOT NULL AND LOWER(event_name) IN ('scroll_50','scroll_75','scroll_100','cta_click','cta_clicked','form_start','conversion','form_submit','form_submitted')) AS engaged_sessions,
 AVG(CASE WHEN LOWER(event_name) = 'page_time' AND event_value ~ '^[0-9]+(\\.[0-9]+)?$' THEN event_value::numeric / 1000 END) AS avg_time
FROM analytics_events
WHERE site_id = :site_id AND occurred_at >= :since AND occurred_at < :until
SQL;
    $statement = $db->prepare($sql);
    $statement->execute([':site_id' => $siteId, ':since' => $since->format(DateTimeInterface::ATOM), ':until' => $until->format(DateTimeInterface::ATOM)]);
    $metric = $statement->fetch() ?: [];
    $returning = $db->prepare(
        'SELECT COUNT(DISTINCT current_events.visitor_id) FROM analytics_events current_events
         WHERE current_events.site_id = :site_id AND NULLIF(current_events.visitor_id, \'\') IS NOT NULL
           AND current_events.occurred_at >= :since AND current_events.occurred_at < :until
           AND EXISTS (SELECT 1 FROM analytics_events previous_events WHERE previous_events.site_id = current_events.site_id
             AND previous_events.visitor_id = current_events.visitor_id AND previous_events.occurred_at < :since)'
    );
    $returning->execute([':site_id' => $siteId, ':since' => $since->format(DateTimeInterface::ATOM), ':until' => $until->format(DateTimeInterface::ATOM)]);
    $metric['returning_visitors'] = (int) $returning->fetchColumn();
    foreach (['visitors','sessions','pageviews','cta_clicks','conversions','engaged_sessions'] as $key) $metric[$key] = (int) ($metric[$key] ?? 0);
    $metric['avg_time'] = $metric['avg_time'] === null ? 0 : round((float) $metric['avg_time'], 1);
    $metric['engagement'] = $metric['sessions'] > 0 ? round($metric['engaged_sessions'] / $metric['sessions'] * 100, 1) : 0;
    return $metric;
}

function analyticsMetric(string $field, array $current, array $previous): array
{
    $value = (float) ($current[$field] ?? 0); $old = (float) ($previous[$field] ?? 0);
    return ['value' => $value == (int) $value ? (int) $value : $value, 'previous' => $old == (int) $old ? (int) $old : $old, 'change' => $old > 0 ? round(($value - $old) / $old * 100, 1) : null];
}

function analyticsTrend(PDO $db, int $siteId, DateTimeImmutable $since, DateTimeImmutable $until): array
{
    $tz = analyticsTimezone()->getName();
    $sql = "WITH days AS (SELECT generate_series((:start::timestamptz AT TIME ZONE '$tz')::date, ((:end::timestamptz - interval '1 microsecond') AT TIME ZONE '$tz')::date, interval '1 day')::date AS day), grouped AS (
      SELECT (occurred_at AT TIME ZONE '$tz')::date AS day, COUNT(DISTINCT visitor_id) FILTER (WHERE NULLIF(visitor_id,'') IS NOT NULL) visitors,
      COUNT(DISTINCT session_id) FILTER (WHERE NULLIF(session_id,'') IS NOT NULL) sessions,
      COUNT(*) FILTER (WHERE LOWER(event_name) IN ('pageview','page_view')) pageviews
      FROM analytics_events WHERE site_id = :site_id AND occurred_at >= :start_event AND occurred_at < :end_event GROUP BY 1)
      SELECT days.day, COALESCE(grouped.visitors,0) visitors, COALESCE(grouped.sessions,0) sessions, COALESCE(grouped.pageviews,0) pageviews FROM days LEFT JOIN grouped USING(day) ORDER BY days.day";
    $statement = $db->prepare($sql);
    $params = [':start' => $since->format(DateTimeInterface::ATOM), ':end' => $until->format(DateTimeInterface::ATOM), ':site_id' => $siteId, ':start_event' => $since->format(DateTimeInterface::ATOM), ':end_event' => $until->format(DateTimeInterface::ATOM)];
    $statement->execute($params);
    return array_map(static fn(array $row): array => ['date' => $row['day'], 'label' => (new DateTimeImmutable($row['day']))->format('d/m'), 'visitors' => (int) $row['visitors'], 'sessions' => (int) $row['sessions'], 'pageviews' => (int) $row['pageviews']], $statement->fetchAll());
}

function analyticsPages(PDO $db, int $siteId, DateTimeImmutable $since, DateTimeImmutable $until, DateTimeImmutable $previousSince, DateTimeImmutable $previousUntil): array
{
    $query = static function (PDO $db, int $siteId, DateTimeImmutable $from, DateTimeImmutable $to): array {
        $statement = $db->prepare("SELECT COALESCE(NULLIF(page_path,''), '/') page_path,
          COUNT(*) FILTER (WHERE LOWER(event_name) IN ('pageview','page_view')) pageviews,
          COUNT(DISTINCT visitor_id) FILTER (WHERE NULLIF(visitor_id,'') IS NOT NULL) visitors,
          COUNT(DISTINCT session_id) FILTER (WHERE NULLIF(session_id,'') IS NOT NULL) sessions,
          COUNT(*) FILTER (WHERE LOWER(event_name) IN ('cta_click','cta_clicked')) cta_clicks,
          COUNT(*) FILTER (WHERE LOWER(event_name) IN ('form_submit','form_submitted','conversion','thank_you_view')) conversions,
          COUNT(DISTINCT session_id) FILTER (WHERE NULLIF(session_id,'') IS NOT NULL AND LOWER(event_name) IN ('scroll_50','scroll_75','scroll_100','cta_click','cta_clicked','form_start','conversion','form_submit','form_submitted')) engaged_sessions,
          AVG(CASE WHEN LOWER(event_name)='page_time' AND event_value ~ '^[0-9]+(\\.[0-9]+)?$' THEN event_value::numeric / 1000 END) avg_time
          FROM analytics_events WHERE site_id=:site_id AND occurred_at >= :since AND occurred_at < :until GROUP BY 1 ORDER BY pageviews DESC");
        $statement->execute([':site_id'=>$siteId, ':since'=>$from->format(DateTimeInterface::ATOM), ':until'=>$to->format(DateTimeInterface::ATOM)]);
        return $statement->fetchAll();
    };
    $current = $query($db, $siteId, $since, $until); $previous = [];
    foreach ($query($db, $siteId, $previousSince, $previousUntil) as $row) $previous[$row['page_path']] = $row;
    return array_map(static function (array $row) use ($previous): array {
        $old = (int) ($previous[$row['page_path']]['pageviews'] ?? 0); $pageviews = (int) $row['pageviews']; $sessions = (int) $row['sessions'];
        return ['page_path'=>$row['page_path'], 'pageviews'=>$pageviews, 'visitors'=>(int)$row['visitors'], 'sessions'=>$sessions, 'avg_time'=>$row['avg_time'] === null ? 0 : round((float)$row['avg_time'],1), 'engagement'=>$sessions ? round((int)$row['engaged_sessions']/$sessions*100,1) : 0, 'cta_clicks'=>(int)$row['cta_clicks'], 'conversions'=>(int)$row['conversions'], 'previous_pageviews'=>$old, 'change'=>$old ? round(($pageviews-$old)/$old*100,1) : null];
    }, $current);
}

function analyticsSources(PDO $db, int $siteId, DateTimeImmutable $since, DateTimeImmutable $until): array
{
    $statement = $db->prepare("WITH sessions AS (SELECT session_id, MAX(NULLIF(utm_source,'')) utm_source, MAX(NULLIF(utm_medium,'')) utm_medium, MAX(NULLIF(referrer,'')) referrer FROM analytics_events WHERE site_id=:site_id AND occurred_at>=:since AND occurred_at<:until AND NULLIF(session_id,'') IS NOT NULL GROUP BY session_id)
      SELECT CASE WHEN utm_source IS NOT NULL OR utm_medium IS NOT NULL THEN 'campaign' WHEN referrer IS NULL THEN 'direct' WHEN referrer ~* '(google|bing|yahoo|duckduckgo)' THEN 'organic' WHEN referrer ~* '(facebook|instagram|linkedin|twitter|tiktok|youtube)' THEN 'social' ELSE 'referral' END label, COUNT(*) value FROM sessions GROUP BY 1 ORDER BY value DESC");
    $statement->execute([':site_id'=>$siteId, ':since'=>$since->format(DateTimeInterface::ATOM), ':until'=>$until->format(DateTimeInterface::ATOM)]);
    return array_map(static fn(array $row): array => ['label'=>$row['label'], 'value'=>(int)$row['value']], $statement->fetchAll());
}

function analyticsDevices(PDO $db, int $siteId, DateTimeImmutable $since, DateTimeImmutable $until): array
{
    $statement = $db->prepare("WITH sessions AS (SELECT session_id, MAX(NULLIF(visitor_id,'')) visitor_id, MAX(NULLIF(device_type,'')) device_type,
      BOOL_OR(LOWER(event_name) IN ('scroll_50','scroll_75','scroll_100','cta_click','cta_clicked','form_start','conversion','form_submit','form_submitted')) engaged,
      BOOL_OR(LOWER(event_name) IN ('form_submit','form_submitted','conversion','thank_you_view')) converted FROM analytics_events WHERE site_id=:site_id AND occurred_at>=:since AND occurred_at<:until AND NULLIF(session_id,'') IS NOT NULL GROUP BY session_id)
      SELECT LOWER(COALESCE(device_type,'other')) label, COUNT(DISTINCT visitor_id) visitors, COUNT(*) sessions, COUNT(*) FILTER(WHERE engaged) engaged, COUNT(*) FILTER(WHERE converted) conversions FROM sessions GROUP BY 1 ORDER BY visitors DESC");
    $statement->execute([':site_id'=>$siteId, ':since'=>$since->format(DateTimeInterface::ATOM), ':until'=>$until->format(DateTimeInterface::ATOM)]);
    return array_values(array_map(static function(array $row): array { $sessions=(int)$row['sessions']; return ['label'=>ucfirst($row['label']), 'visitors'=>(int)$row['visitors'], 'sessions'=>$sessions, 'engagement'=>$sessions?round((int)$row['engaged']/$sessions*100,1):0, 'conversions'=>(int)$row['conversions']]; }, array_filter($statement->fetchAll(), static fn(array $row): bool => in_array($row['label'], ['desktop','mobile','tablet'], true))));
}

function analyticsAttention(array $current, array $previous, array $pages, array $devices): array
{
    $alerts = [];
    $drop = static function (string $type, string $title, string $detail, float $currentValue, float $previousValue, float $threshold, int $minimum = 5) use (&$alerts): void {
        if ($previousValue >= $minimum && $currentValue < $previousValue * (1 - $threshold)) $alerts[] = ['type'=>$type, 'severity'=>'warning', 'title'=>$title, 'detail'=>$detail, 'current'=>$currentValue, 'previous'=>$previousValue, 'change'=>round(($currentValue-$previousValue)/$previousValue*100,1)];
    };
    $drop('pageviews','Pageview in calo','I pageview sono diminuiti rispetto al periodo precedente.', $current['pageviews'], $previous['pageviews'], .25);
    $drop('engagement','Engagement in calo','La quota di sessioni ingaggiate è diminuita.', $current['engagement'], $previous['engagement'], .20, 10);
    $drop('cta_clicks','CTA in calo','I click sulle CTA sono diminuiti rispetto al periodo precedente.', $current['cta_clicks'], $previous['cta_clicks'], .25);
    foreach ($pages as $page) if (($page['pageviews'] ?? 0) >= 5 && ($page['change'] ?? 0) <= -25) $alerts[] = ['type'=>'page_drop','severity'=>'warning','title'=>'Pagina in calo: ' . $page['page_path'], 'detail'=>'Pageview in calo di ' . abs((int)$page['change']) . '% rispetto al periodo precedente.', 'current'=>$page['pageviews'], 'previous'=>$page['previous_pageviews'], 'change'=>$page['change']];
    $desktop = $mobile = null; foreach ($devices as $device) { if ($device['label']==='Desktop') $desktop=$device; if ($device['label']==='Mobile') $mobile=$device; }
    if ($desktop && $mobile && $mobile['sessions'] >= 10 && $mobile['engagement'] <= $desktop['engagement'] * .7) $alerts[] = ['type'=>'mobile_engagement','severity'=>'warning','title'=>'Engagement mobile debole','detail'=>'L’engagement mobile è molto inferiore a quello desktop.', 'current'=>$mobile['engagement'], 'previous'=>$desktop['engagement'], 'change'=>round($mobile['engagement']-$desktop['engagement'],1)];
    return $alerts;
}

function analyticsMonitoringSummary(PDO $db, int $siteId): array
{
    $statement = $db->prepare("SELECT DISTINCT ON (check_name) check_name, status, http_status, latency_ms, target_url, details, checked_at FROM monitoring_checks WHERE site_id=:site_id ORDER BY check_name, checked_at DESC");
    $statement->execute([':site_id'=>$siteId]);
    return array_map(static fn(array $row): array => ['name'=>$row['check_name'], 'status'=>$row['status'], 'http_status'=>$row['http_status']===null?null:(int)$row['http_status'], 'latency_ms'=>$row['latency_ms']===null?null:(int)$row['latency_ms'], 'detail'=>$row['target_url'] ? $row['target_url'] . ($row['http_status'] ? ' · HTTP ' . $row['http_status'] : '') : null, 'checked_at'=>$row['checked_at'], 'details'=>$row['details'] ? json_decode($row['details'], true) : null], $statement->fetchAll());
}

function analyticsRunMonitoringChecks(PDO $db, int $siteId, array $siteConfig): array
{
    $insert = $db->prepare('INSERT INTO monitoring_checks (site_id, check_name, check_type, target_url, status, http_status, latency_ms, details, checked_at) VALUES (:site_id,:name,:type,:url,:status,:http,:latency,CAST(:details AS jsonb),NOW())');
    $checks = [];
    foreach (($siteConfig['checks'] ?? []) as $check) {
        $url = analyticsSanitizeString($check['url'] ?? null, 2048);
        if ($url === null) continue;
        $started = microtime(true); $statusCode = 0; $curlError = null;
        if (function_exists('curl_init')) {
            $curl = curl_init($url);
            curl_setopt_array($curl, [CURLOPT_NOBODY => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 8, CURLOPT_USERAGENT => 'Ciuffo-Analytics-monitor/1.0']);
            curl_exec($curl); $statusCode = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE); $curlError = curl_error($curl) ?: null;
        } else {
            $headers = @get_headers($url);
            $statusCode = $headers && isset($headers[0]) && preg_match('/\s(\d{3})\s/', $headers[0], $matches) ? (int) $matches[1] : 0;
        }
        $latency = (int) round((microtime(true) - $started) * 1000); $status = $statusCode >= 200 && $statusCode < 400 ? 'online' : 'offline'; $details = ['url' => $url];
        if ($curlError) $details['error'] = $curlError;
        $name = analyticsSanitizeString($check['name'] ?? null, 255) ?? $url;
        $insert->execute([':site_id'=>$siteId, ':name'=>$name, ':type'=>'http', ':url'=>$url, ':status'=>$status, ':http'=>$statusCode ?: null, ':latency'=>$latency, ':details'=>json_encode($details, JSON_UNESCAPED_SLASHES)]);
        $checks[] = ['name'=>$name, 'detail'=>$url . ($statusCode ? ' · HTTP ' . $statusCode : ' · Nessuna risposta dal check HTTP.'), 'status'=>$status, 'http_status'=>$statusCode ?: null, 'latency_ms'=>$latency, 'checked_at'=>gmdate('c')];
    }
    return $checks;
}

function analyticsBuildReport(PDO $db, string $siteKey, int $days = 7, ?string $sinceRaw = null, ?string $untilRaw = null): array
{
    $site = analyticsFindSite($db, $siteKey);
    if ($site === null) throw new RuntimeException('Sito non trovato o disabilitato.');
    $period = analyticsPeriods($sinceRaw, $untilRaw, $days);
    $current = analyticsMetricSet($db, (int)$site['id'], $period['since'], $period['until']);
    $previous = analyticsMetricSet($db, (int)$site['id'], $period['previous_since'], $period['previous_until']);
    $pages = analyticsPages($db, (int)$site['id'], $period['since'], $period['until'], $period['previous_since'], $period['previous_until']);
    $devices = analyticsDevices($db, (int)$site['id'], $period['since'], $period['until']);
    return ['ok'=>true, 'source'=>'postgresql', 'site'=>['site_key'=>$site['site_key'],'name'=>$site['name'],'domain'=>$site['domain']], 'period'=>['since'=>$period['since']->format(DateTimeInterface::ATOM),'until'=>$period['until']->format(DateTimeInterface::ATOM),'previous_since'=>$period['previous_since']->format(DateTimeInterface::ATOM),'previous_until'=>$period['previous_until']->format(DateTimeInterface::ATOM),'timezone'=>$period['timezone']->getName()], 'metrics'=>['visitors'=>analyticsMetric('visitors',$current,$previous),'sessions'=>analyticsMetric('sessions',$current,$previous),'pageviews'=>analyticsMetric('pageviews',$current,$previous),'avg_time'=>analyticsMetric('avg_time',$current,$previous),'engagement'=>analyticsMetric('engagement',$current,$previous),'cta_clicks'=>analyticsMetric('cta_clicks',$current,$previous),'conversions'=>analyticsMetric('conversions',$current,$previous),'returning_visitors'=>analyticsMetric('returning_visitors',$current,$previous)], 'trend'=>analyticsTrend($db,(int)$site['id'],$period['since'],$period['until']), 'pages'=>$pages, 'sources'=>analyticsSources($db,(int)$site['id'],$period['since'],$period['until']), 'devices'=>$devices, 'attention'=>analyticsAttention($current,$previous,$pages,$devices), 'definitions'=>['returning_visitors'=>'visitatori con almeno un evento precedente all’inizio del periodo','engagement'=>'sessioni con almeno uno tra scroll_50, scroll_75, scroll_100, cta_click, form_start o conversion','sources'=>'attribuzione a livello sessione; UTM, poi referrer, poi direct','devices'=>'aggregati a livello sessione'], 'generated_at'=>gmdate('c')];
}
