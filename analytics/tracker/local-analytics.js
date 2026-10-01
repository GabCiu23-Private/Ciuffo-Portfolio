(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    siteKey: null,
    siteId: null,
    pageId: null,
    pageName: null,
    sessionMinutes: 30,
    maxEvents: 5000,
    maxPendingEvents: 200,
    remoteBatchSize: 20,
    debug: false,
    trackSections: true,
    autoTrackCtas: true,
    autoTrackForms: true,
    autoTrackSections: true,
    trackClicks: true,
    trackMouse: false,
    autoThankYou: true,
    ctaViewThreshold: 0.5,
    sectionViewThreshold: 0.35,
    successDetectionWindowMs: 15000,
    mouseSampleMs: 1200,
    remoteEnabled: true,
    remoteEndpoint: null,
    trackingVersion: '3.0'
  };

  if (new URLSearchParams(window.location.search).get('analytics_preview') === '1') {
    window.LandingAnalytics = {
      config: Object.assign({}, DEFAULT_CONFIG, window.LandingAnalyticsConfig || {}),
      track: function () {},
      flushRemote: function () { return Promise.resolve(false); },
      getEvents: function () { return []; },
      getPendingEvents: function () { return []; },
      resetEvents: function () {},
      thankYou: function () {},
      formStart: function () {},
      formSubmit: function () {},
      keys: {}
    };
    return;
  }

  var config = Object.assign({}, DEFAULT_CONFIG, window.LandingAnalyticsConfig || {});
  var utils = window.LandingAnalyticsUtils;
  var interactionFactory = window.LandingAnalyticsInteractions;
  var namespace = 'local_landing_analytics';
  config.siteKey = normalizeSiteKey(config.siteKey || config.siteId);
  config.siteId = normalizeSiteId(config.siteId || config.siteKey);
  config.pageId = normalizePageId(config.pageId);
  config.pageName = normalizePageName(config.pageName, config.pageId);
  var keys = {
    events: namespace + ':events',
    config: namespace + ':config',
    pending: namespace + ':pending:' + config.siteId,
    visitorId: namespace + ':visitor_id:' + config.siteId,
    session: namespace + ':session:' + config.siteId
  };
  var activeStartedAt = Date.now();
  var activeTimeMs = 0;
  var lastTrackedTime = 0;
  var remoteState = {
    flushTimer: null,
    inFlight: false,
    lastEventSentAt: null
  };
  var interactionTracker = null;

  config.remoteEndpoint = config.remoteEndpoint || getDefaultRemoteEndpoint();

  if (!utils || !interactionFactory) {
    throw new Error('LandingAnalytics richiede tracker/modules/utils.js e tracker/modules/interactions.js prima di local-analytics.js.');
  }

  function log() {
    if (config.debug && window.console) {
      console.log.apply(console, ['[LocalAnalytics]'].concat(Array.prototype.slice.call(arguments)));
    }
  }

  function getDefaultRemoteEndpoint() {
    var currentScript = document.currentScript;

    if (!currentScript || !currentScript.src) {
      return null;
    }

    try {
      if (config.apiBase) {
        var apiBase = new URL(config.apiBase, window.location.href).toString();
        return new URL('collect.php', apiBase.endsWith('/') ? apiBase : apiBase + '/').toString();
      }
      return new URL('../api/collect.php', currentScript.src).toString();
    } catch (error) {
      log('Impossibile calcolare l\'endpoint remoto.', error);
      return null;
    }
  }

  function normalizeSiteKey(value) {
    return value ? String(value).trim() : null;
  }

  function normalizeSiteId(value) {
    if (value) return value;
    return (window.location.hostname || 'local-site')
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'local-site';
  }

  function normalizePageId(value) {
    if (value && value !== DEFAULT_CONFIG.pageId) {
      return value;
    }

    var path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    var pageSlug = path || 'home';

    return pageSlug
      .toLowerCase()
      .replace(/[^a-z0-9-_\/]+/g, '-')
      .replace(/\//g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') || 'home';
  }

  function normalizePageName(value, pageId) {
    if (value && value !== DEFAULT_CONFIG.pageName) {
      return value;
    }

    return document.title || pageId;
  }

  function readJson(key, fallback) {
    return utils.readJson(key, fallback, log);
  }

  function writeJson(key, value) {
    utils.writeJson(key, value, log);
  }

  function getPendingEvents() {
    return readJson(keys.pending, []);
  }

  function setPendingEvents(events) {
    var normalizedEvents = Array.isArray(events) ? events : [];

    if (normalizedEvents.length > config.maxPendingEvents) {
      normalizedEvents = normalizedEvents.slice(normalizedEvents.length - config.maxPendingEvents);
    }

    writeJson(keys.pending, normalizedEvents);
  }

  function getVisitorId() {
    var cookieName = 'landing_visitor_id';
    var existing = utils.readCookie(cookieName) || localStorage.getItem(keys.visitorId);
    if (existing) {
      if (!utils.readCookie(cookieName)) utils.writeCookie(cookieName, existing, 365);
      if (!localStorage.getItem(keys.visitorId)) localStorage.setItem(keys.visitorId, existing);
      return existing;
    }

    var visitorId = utils.uuid();
    utils.writeCookie(cookieName, visitorId, 365);
    try { localStorage.setItem(keys.visitorId, visitorId); } catch (error) { log('Visitor ID non salvabile in localStorage', error); }
    return visitorId;
  }

  function getSessionId() {
    var now = Date.now();
    var current = readJson(keys.session, null);
    var maxAge = config.sessionMinutes * 60 * 1000;

    if (current && current.id && now - current.updatedAt < maxAge) {
      current.updatedAt = now;
      writeJson(keys.session, current);
      return current.id;
    }

    var next = {
      id: utils.uuid(),
      startedAt: new Date(now).toISOString(),
      updatedAt: now
    };

    writeJson(keys.session, next);
    return next.id;
  }

  function saveConfig() {
    var stored = readJson(keys.config, { sites: {}, pages: {} });

    stored.sites[config.siteId] = {
      id: config.siteId,
      updated_at: new Date().toISOString()
    };

    stored.pages[config.pageId] = {
      id: config.pageId,
      site_id: config.siteId,
      name: config.pageName || config.pageId,
      updated_at: new Date().toISOString()
    };

    writeJson(keys.config, stored);
  }

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);

    return {
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_term: params.get('utm_term') || null,
      utm_content: params.get('utm_content') || null
    };
  }


  function getDeviceInfo() {
    var ua = navigator.userAgent || '';
    var width = window.innerWidth || document.documentElement.clientWidth || 0;
    var deviceType = width < 768 ? 'mobile' : (width < 1100 ? 'tablet' : 'desktop');
    var browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) && !/Chrome\//.test(ua) ? 'Safari' : 'Other';
    var os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Other';

    return {
      device_type: deviceType,
      browser: browser,
      os: os,
      language: navigator.language || null,
      timezone: (window.Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone || null : null
    };
  }

  function buildEvent(eventName, eventValue, metadata) {
    var utm = getUtmParams();
    var device = getDeviceInfo();

    return {
      id: utils.uuid(),
      site_key: config.siteKey,
      site_id: config.siteId,
      page_id: config.pageId,
      page_name: config.pageName || config.pageId,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      event_name: eventName,
      event_value: eventValue || null,
      metadata: metadata || null,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term,
      utm_content: utm.utm_content,
      tracking_version: config.trackingVersion,
      viewport_width: window.innerWidth || document.documentElement.clientWidth || null,
      viewport_height: window.innerHeight || document.documentElement.clientHeight || null,
      screen_width: window.screen ? window.screen.width : null,
      screen_height: window.screen ? window.screen.height : null,
      device_type: device.device_type,
      browser: device.browser,
      os: device.os,
      language: device.language,
      timezone: device.timezone
    };
  }

  function persistEvent(event) {
    var events = readJson(keys.events, []);
    events.push(event);

    if (events.length > config.maxEvents) {
      events = events.slice(events.length - config.maxEvents);
    }

    writeJson(keys.events, events);
    log('Evento salvato in locale', event);
  }

  function removePendingEventsById(ids) {
    if (!Array.isArray(ids) || !ids.length) return;

    var idMap = {};
    var pending = getPendingEvents().filter(function (item) {
      return item && item.id;
    });

    ids.forEach(function (id) {
      idMap[id] = true;
    });

    setPendingEvents(pending.filter(function (item) {
      return !idMap[item.id];
    }));
  }

  function enqueueRemoteEvent(event) {
    if (!config.remoteEnabled || !config.remoteEndpoint || !event || !event.id) {
      return;
    }

    var pending = getPendingEvents();
    var alreadyQueued = pending.some(function (item) {
      return item && item.id === event.id;
    });

    if (alreadyQueued) {
      return;
    }

    pending.push(event);
    setPendingEvents(pending);
    scheduleRemoteFlush(120);
  }

  function scheduleRemoteFlush(delay) {
    if (!config.remoteEnabled || !config.remoteEndpoint) {
      return;
    }

    if (remoteState.flushTimer) {
      clearTimeout(remoteState.flushTimer);
    }

    remoteState.flushTimer = window.setTimeout(function () {
      remoteState.flushTimer = null;
      flushPendingEvents();
    }, typeof delay === 'number' ? delay : 0);
  }

  function flushPendingEvents() {
    if (
      !config.remoteEnabled ||
      !config.remoteEndpoint ||
      remoteState.inFlight ||
      typeof window.fetch !== 'function'
    ) {
      return Promise.resolve(false);
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return Promise.resolve(false);
    }

    var pending = getPendingEvents();

    if (!pending.length) {
      return Promise.resolve(true);
    }

    var batch = pending.slice(0, Math.max(1, config.remoteBatchSize));
    var payload = {
      site: {
        site_id: config.siteId,
        page_id: config.pageId,
        page_name: config.pageName || config.pageId
      },
      events: batch
    };

    remoteState.inFlight = true;

    return window
      .fetch(config.remoteEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        keepalive: batch.length <= 10
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }

        return response.json();
      })
      .then(function (data) {
        if (!data || data.ok !== true) {
          throw new Error('Risposta analytics remota non valida.');
        }

        removePendingEventsById(
          batch.map(function (event) {
            return event.id;
          })
        );

        remoteState.lastEventSentAt = new Date().toISOString();
        log('Eventi inviati al server', batch.length);
        return true;
      })
      .catch(function (error) {
        log('Invio remoto non riuscito', error);
        return false;
      })
      .finally(function () {
        remoteState.inFlight = false;

        if (getPendingEvents().length) {
          scheduleRemoteFlush(4000);
        }
      });
  }

  function track(eventName, eventValue, metadata) {
    var event;

    if (!eventName) return;

    event = buildEvent(eventName, eventValue, metadata);
    persistEvent(event);
    enqueueRemoteEvent(event);
  }

  function trackPageTime(reason) {
    var timeSpent = activeTimeMs;

    if (activeStartedAt !== null && document.visibilityState !== 'hidden') {
      timeSpent += Date.now() - activeStartedAt;
    }

    var timeSeconds = Math.max(1, Math.round(timeSpent / 1000));

    if (timeSeconds <= lastTrackedTime) {
      return;
    }

    lastTrackedTime = timeSeconds;
    track('page_time', String(timeSpent), {
      time_ms: timeSpent,
      time_seconds: timeSeconds,
      reason: reason || 'update'
    });
  }

  function pauseActiveTime() {
    if (activeStartedAt === null) {
      return;
    }

    activeTimeMs += Date.now() - activeStartedAt;
    activeStartedAt = null;
  }

  function resumeActiveTime() {
    if (activeStartedAt === null) {
      activeStartedAt = Date.now();
    }
  }

  function getStoredEvents() {
    return readJson(keys.events, []);
  }

  function resetStoredEvents() {
    localStorage.removeItem(keys.events);
    localStorage.removeItem(keys.pending);
  }

  function bindRemoteLifecycle() {
    if (!config.remoteEnabled || !config.remoteEndpoint) {
      return;
    }

    window.addEventListener('online', function () {
      scheduleRemoteFlush(100);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        flushPendingEvents();
      }
    });
  }

  function bindTimeTracking() {
    window.setInterval(function () {
      if (document.visibilityState !== 'hidden') {
        trackPageTime('heartbeat');
      }
    }, 15000);

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        pauseActiveTime();
        trackPageTime('visibility_hidden');
        flushPendingEvents();
      } else {
        resumeActiveTime();
      }
    });

    window.addEventListener('pagehide', function () {
      pauseActiveTime();
      trackPageTime('pagehide');
      flushPendingEvents();
    });

    window.addEventListener('beforeunload', function () {
      pauseActiveTime();
      trackPageTime('beforeunload');
    });
  }

  function init() {
    interactionTracker = interactionFactory.create({
      config: config,
      track: track,
      throttle: utils.throttle
    });

    saveConfig();
    bindRemoteLifecycle();
    track('page_view');
    interactionTracker.bindAll();
    bindTimeTracking();
    scheduleRemoteFlush(600);

  }

  window.LandingAnalytics = {
    config: config,
    track: track,
    flushRemote: flushPendingEvents,
    getEvents: getStoredEvents,
    getPendingEvents: getPendingEvents,
    resetEvents: resetStoredEvents,
    thankYou: function (value, metadata) {
      track('thank_you_view', value || 'thank_you', metadata || null);
    },
    formStart: function (value, metadata) {
      track('form_start', value || 'form', metadata || null);
    },
    formSubmit: function (value, metadata) {
      track('form_submit', value || 'form', metadata || null);
    },
    getStatus: function () {
      var interactionStatus = interactionTracker && typeof interactionTracker.getStatus === 'function'
        ? interactionTracker.getStatus()
        : { ctasDetected: 0, formsDetected: document.querySelectorAll('form').length };

      return {
        loaded: true,
        siteKey: config.siteKey,
        apiBase: config.apiBase || (config.remoteEndpoint ? config.remoteEndpoint.replace(/\/api\/collect\.php\/?$/, '') : null),
        lastEventSentAt: remoteState.lastEventSentAt,
        queueSize: getPendingEvents().length,
        ctasDetected: interactionStatus.ctasDetected,
        formsDetected: interactionStatus.formsDetected
      };
    },
    keys: keys
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
