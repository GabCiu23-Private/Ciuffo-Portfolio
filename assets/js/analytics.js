(function () {
  'use strict';
  if (window.CiuffoAnalytics) return;
  var endpoint = 'https://ciuffo-dashboard.vercel.app/api/analytics/collect';
  var preference = 'ciuffo-analytics-consent-v1';
  var visitorKey = 'ciuffo-analytics-visitor-v1';
  var sessionKey = 'ciuffo-analytics-session-v1';
  var enabled = false, visitor, session, started, queue = [], scrolls = {};
  function read(storage, key) { try { return storage.getItem(key); } catch (_) { return null; } }
  function save(storage, key, value) { try { storage.setItem(key, value); } catch (_) {} }
  function remove(storage, key) { try { storage.removeItem(key); } catch (_) {} }
  function uuid(storage, key) { var id = read(storage,key); if (!/^[a-f0-9-]{36}$/.test(id || '')) { id = crypto.randomUUID(); save(storage,key,id); } return id; }
  function track(name, value) {
    if (!enabled) return;
    var e = {id:crypto.randomUUID(),visitor:visitor,session:session,name:name,path:location.pathname,at:new Date().toISOString(),device:innerWidth<768?'mobile':innerWidth<1024?'tablet':'desktop'};
    if (value !== undefined) e.value=value;
    try { if (document.referrer) e.referrer=new URL(document.referrer).origin; } catch (_) {}
    queue.push(e); flush();
  }
  function flush() {
    if (!enabled || !queue.length) return;
    var batch = queue.splice(0,20);
    fetch(endpoint,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:'ciuffo_portfolio',consent:true,events:batch}),keepalive:true}).then(function(r){
      if (r.status>=500 || r.status===429) queue=queue.concat(batch).slice(-20);
    }).catch(function(){queue=queue.concat(batch).slice(-20);});
  }
  function start() {
    if (enabled || navigator.globalPrivacyControl || navigator.doNotTrack==='1') return;
    visitor=uuid(localStorage,visitorKey); session=uuid(sessionStorage,sessionKey);
    enabled=true; started=Date.now(); track('page_view');
  }
  function choose(allow) {
    save(localStorage,preference,allow?'accepted':'rejected');
    if (allow) start(); else { enabled=false;queue=[];remove(localStorage,visitorKey);remove(sessionStorage,sessionKey); }
    var banner=document.getElementById('analytics-consent');if(banner)banner.remove();
  }
  function show() {
    if(document.getElementById('analytics-consent'))return;
    var panel=document.createElement('section');panel.id='analytics-consent';panel.setAttribute('aria-label','Preferenze statistiche');
    panel.style.cssText='position:fixed;bottom:20px;left:20px;right:20px;max-width:560px;padding:20px;background:#fff;color:#171717;border:1px solid #777;border-radius:12px;z-index:10000;box-shadow:0 8px 32px #0003;font:16px/1.5 system-ui;';
    var p=document.createElement('p');p.textContent='Posso raccogliere statistiche sulle pagine visitate e sui clic per migliorare il portfolio? La scelta è facoltativa e puoi cambiarla in qualsiasi momento. Non raccolgo ciò che scrivi nei moduli.';panel.appendChild(p);
    ['Rifiuta','Accetta statistiche'].forEach(function(label,i){var b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='font:inherit;margin:8px 12px 0 0;padding:10px 14px;border:1px solid #555;border-radius:6px;background:'+(i?'#171717;color:#fff':'#fff;color:#171717');b.onclick=function(){choose(!!i);};panel.appendChild(b);});
    document.body.appendChild(panel);
  }
  window.CiuffoAnalytics={preferences:show,track:track};
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var href=a.getAttribute('href');var contact=/^(mailto:|tel:|https:\/\/(?:www\.)?linkedin\.com\/in\/)/.test(href);if(contact)track('contact_click');if(contact||a.matches('.action-button,.button,.btn,[data-analytics-cta]'))track('cta_click');});
  window.addEventListener('scroll',function(){if(!enabled)return;var h=document.documentElement.scrollHeight-innerHeight;var depth=h>0?100*scrollY/h:100;[25,50,75,100].forEach(function(n){if(depth>=n&&!scrolls[n]){scrolls[n]=true;track('scroll_'+n);}});},{passive:true});
  function time(){if(enabled){track('page_time',Math.min(86400000,Date.now()-started));started=Date.now();}}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')time();});
  window.addEventListener('pagehide',time);
  window.addEventListener('storage',function(e){if(e.key===preference&&e.newValue!=='accepted'){enabled=false;queue=[];}});
  function init(){var b=document.createElement('button');b.type='button';b.textContent='Preferenze statistiche';b.style.cssText='font:inherit;background:transparent;color:inherit;border:0;text-decoration:underline;cursor:pointer;padding:12px;';b.onclick=show;var footer=document.querySelector('footer')||document.body;footer.appendChild(b);var consent=read(localStorage,preference);if(consent==='accepted')start();else if(!consent&&!navigator.globalPrivacyControl&&navigator.doNotTrack!=='1')show();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
