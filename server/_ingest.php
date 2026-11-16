<?php
declare(strict_types=1);
// PostgreSQL collector controls; no alternate event storage.
function analyticsIngestFailure(int $status,string $message): never { analyticsJsonResponse(['ok'=>false,'message'=>$message],$status); }
function analyticsReportScopes(): array {
    $secret=analyticsEnv('ANALYTICS_REPORT_TOKEN');
    $header=$_SERVER['HTTP_AUTHORIZATION']??'';
    if(!$secret||strlen($secret)<32) analyticsIngestFailure(503,'Report access not configured.');
    if(!hash_equals('Bearer '.$secret,$header))analyticsIngestFailure(401,'Authentication required.');
    return array_values(array_filter(array_map('trim',explode(',',analyticsEnv('ANALYTICS_REPORT_SITES','')??''))));
}
function analyticsRequireReportAccess(?string $siteKey=null): array {
    $scopes=analyticsReportScopes();
    if($siteKey!==null&&!in_array('*',$scopes,true)&&!in_array($siteKey,$scopes,true))analyticsIngestFailure(403,'Site scope denied.');
    return $scopes;
}
function analyticsVerifyReceipt(string $receipt,string $siteKey): ?array {
    $key=analyticsEnv('POGGIO_ANALYTICS_RECEIPT_KEY');
    if(!$key||strlen($key)<32||strlen($receipt)>2048)return null;
    $parts=explode('.',$receipt);if(count($parts)!==2||!preg_match('/^[A-Za-z0-9_-]+$/D',$parts[0])||!preg_match('/^[a-f0-9]{64}$/D',$parts[1]))return null;
    if(!hash_equals(hash_hmac('sha256',$parts[0],$key),$parts[1]))return null;
    try{$c=json_decode(base64_decode(strtr($parts[0],'-_','+/'),true),true,16,JSON_THROW_ON_ERROR);}catch(Throwable){return null;}
    if(!is_array($c)||($c['v']??null)!==1||($c['site_key']??null)!==$siteKey||($c['status']??null)!=='mail_server_accepted'||!is_int($c['iat']??null)||!is_int($c['exp']??null)||$c['iat']>time()+60||$c['exp']<time()||$c['exp']-$c['iat']>86400||$c['exp']<=$c['iat'])return null;
    if(!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/D',(string)($c['request_id']??''))||!in_array($c['form_context']??'', ['home','contatti','eventi','matrimoni','soggiorna'],true)||!in_array($c['page_language']??'',['it','en'],true))return null;
    return $c;
}
function analyticsPrepareIngest(array $payload,string $origin): array {
    if(isset($payload['site'])&&!is_array($payload['site']))analyticsIngestFailure(422,'Invalid site object.');
    $input=$payload['events']??null;
    if(!is_array($input)||!array_is_list($input)||count($input)<1||count($input)>40)analyticsIngestFailure(422,'Invalid batch.');
    $site=analyticsSanitizeString($payload['site']['site_key']??$payload['site_key']??$input[0]['site_key']??null,160);
    $config=$site?analyticsSiteConfig($site):null;
    if(!$config||!($config['enabled']??false))analyticsIngestFailure(403,'Site not enabled.');
    $origins=$config['origins']??[];
    if($site==='ciuffo_portfolio'){
        $configured=analyticsEnv('CIUFFO_PORTFOLIO_ANALYTICS_ORIGINS');
        $legacy=array_filter(array_map('trim',explode(',',$configured??analyticsEnv('ANALYTICS_ALLOWED_ORIGINS','')??'')));
        if($configured===null)$legacy=array_diff($legacy,analyticsSiteConfig('poggio_alla_pieve')['origins']??[]);
        $origins=array_merge($origins,$legacy);
    }
    if(!in_array($origin,$origins,true))analyticsIngestFailure(403,'Origin not allowed for site.');
    $events=[];
    foreach($input as $raw){
        if(!is_array($raw)||($raw['site_key']??$site)!==$site)analyticsIngestFailure(422,'Mixed or malformed site batch.');
        $id=$raw['event_id']??$raw['id']??null;
        if(!is_string($id)||!preg_match('/^[a-zA-Z0-9:_-]{1,160}$/D',$id))analyticsIngestFailure(422,'Invalid event id.');
        $timestamp=$raw['occurred_at']??$raw['timestamp']??null;if(!is_string($timestamp)||strtotime($timestamp)===false)analyticsIngestFailure(422,'Invalid timestamp.');
        $event=analyticsSanitizeEvent($raw);
        if(!$event||!preg_match('/^(?:pageview|page_view|page_time|cta_view|cta_click|cta_clicked|contact_click|section_view|section_time|scroll_(?:25|50|75|100)|form_start|form_error|form_submit|form_submitted|conversion|thank_you_view|click|mouse_move|cta_impression)$/D',$event['event_name']))analyticsIngestFailure(422,'Invalid event type.');
        $event['site_key']=$site;
        $time=strtotime($event['occurred_at']);if($time<time()-86400*7||$time>time()+300)analyticsIngestFailure(422,'Event timestamp outside retention window.');
        foreach(['page_url','referrer'] as $field){$url=$event[$field];if($url){$parts=parse_url($url);$event[$field]=isset($parts['host'])?($parts['scheme']??'https').'://'.$parts['host'].($field==='page_url'?($parts['path']??'/'):'/'):null;}}
        if($site==='poggio_alla_pieve'){
            if(!in_array($event['event_name'],['page_view','page_time','cta_view','cta_click','contact_click','scroll_25','scroll_50','scroll_75','scroll_100','form_start','form_error','conversion'],true))analyticsIngestFailure(422,'Event not permitted for Poggio.');
            $path=$event['page_path']??'';
            if(str_starts_with($path,'/test/')&&analyticsEnv('APP_ENV','production')==='production')analyticsIngestFailure(422,'Staging path forbidden in production.');
            if(!preg_match('~^/(?:test/)?(?:en/)?(?:|(?:storia|borgo|cucina|eventi|matrimoni|soggiorna|contatti|come-arrivare|privacy|cookie|privacy-policy|cookie-policy)/|camere/(?:appartamento-(?:rosso|bianco|rosa|blu)|suite-(?:verde|gialla))/|404\.html)$~D',$path))analyticsIngestFailure(422,'Unknown page path.');
            $language=preg_match('~^/(?:test/)?en/~',$path)?'en':'it';
            $content=preg_replace('~^/(?:test/)?(?:en/)?~','',$path);$content=trim($content,'/')?:'home';
            $event['page_id']=(str_starts_with($path,'/test/')?'test-':'').$language.'-'.str_replace('/','-',$content);$event['page_name']=$content;
            $event['page_url']=$origin.$path;
            $metadata=['page_language'=>$language,'content_key'=>$content];
            $rawMetadata=is_array($raw['metadata']??null)?$raw['metadata']:[];
            $form=$rawMetadata['form_context']??null;
            if(in_array($event['event_name'],['form_start','form_error','conversion'],true)){
                if(!in_array($form,['home','contatti','eventi','matrimoni','soggiorna'],true))analyticsIngestFailure(422,'Invalid form context.');
                $metadata['form_context']=$form;
                if($content!==$form)analyticsIngestFailure(422,'Form does not match page.');
            }
            if($event['event_name']==='form_error')$metadata['error_code']=in_array($rawMetadata['error_code']??'', ['validation','network','timeout','400','403','409','422','429','502','503'],true)?$rawMetadata['error_code']:'other';
            if($event['event_name']==='contact_click')$metadata['channel']=in_array($rawMetadata['channel']??'',['phone','email','whatsapp'],true)?$rawMetadata['channel']:'other';
            if($event['event_name']==='conversion'){
                $claims=analyticsVerifyReceipt(is_string($raw['receipt']??null)?$raw['receipt']:'',$site);
                if(!$claims||$claims['form_context']!==$form||$claims['page_language']!==$language)analyticsIngestFailure(422,'Invalid conversion receipt.');
                $id='conversion:'.$claims['request_id'];$metadata['receipt_verified']=true;$metadata['request_id']=$claims['request_id'];$metadata['status']='mail_server_accepted';
                $event['occurred_at']=gmdate('c',$claims['iat']);
            }
            $event['event_id']=$site.':'.hash('sha256',$id);
            $event['metadata']=$metadata;
            $event['event_value']=$event['event_name']==='page_time'&&is_numeric($event['event_value'])?(string)min(86400000,max(0,(float)$event['event_value'])):null;
            foreach(['utm_source','utm_medium','utm_campaign','utm_term','utm_content'] as $field)$event[$field]=null;
            foreach(['visitor_id','session_id'] as $field)if(!is_string($event[$field])||!preg_match('/^(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}|id-[a-z0-9]+-[a-z0-9]+)$/D',$event[$field]))analyticsIngestFailure(422,'Invalid random identifier.');
        }
        if($site==='poggio_alla_pieve'){
            foreach(['viewport_width','viewport_height','screen_width','screen_height'] as $field)if($event[$field]!==null&&($event[$field]<0||$event[$field]>16384))analyticsIngestFailure(422,'Invalid dimensions.');
            $event['device_type']=in_array($event['device_type'],['desktop','tablet','mobile'],true)?$event['device_type']:'other';
            $event['browser']=in_array($event['browser'],['Chrome','Edge','Opera','Firefox','Safari','Other'],true)?$event['browser']:'Other';
            $event['os']=in_array($event['os'],['Windows','Android','iOS','macOS','Linux','Other'],true)?$event['os']:'Other';
            if(!preg_match('/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/D',$event['language']??''))$event['language']=null;
            if(!in_array($event['timezone'],timezone_identifiers_list(),true))$event['timezone']=null;
        }
        $events[]=$event;
    }
    return [$site,$config,$events];
}
function analyticsConsumeRate(PDO $db,string $site,string $ip,int $cost): void {
    $secret=analyticsEnv('ANALYTICS_RATE_LIMIT_KEY');if(!$secret||strlen($secret)<32)analyticsIngestFailure(503,'Rate limit not configured.');
    foreach([['site:'.$site,86400,$site==='poggio_alla_pieve'?20000:200000],['ip:'.$site.':'.hash_hmac('sha256',$ip,$secret),60,600]] as [$key,$seconds,$limit]){
        $bucket=intdiv(time(),$seconds)*$seconds;
        $statement=$db->prepare('INSERT INTO analytics_private.ingest_limits(key,bucket,count) VALUES (:key,:bucket,:cost) ON CONFLICT(key) DO UPDATE SET bucket=EXCLUDED.bucket,count=CASE WHEN ingest_limits.bucket=EXCLUDED.bucket THEN ingest_limits.count+EXCLUDED.count ELSE EXCLUDED.count END RETURNING count');
        $statement->execute([':key'=>$key,':bucket'=>$bucket,':cost'=>$cost]);if((int)$statement->fetchColumn()>$limit){header('Retry-After: '.$seconds);analyticsIngestFailure(429,'Rate or quota exceeded.');}
    }
}
