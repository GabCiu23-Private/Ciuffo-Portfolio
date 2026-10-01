(function () {
  'use strict';

  var loader = document.currentScript;
  var stateKey = '__LandingAnalyticsTrackerLoader';
  var state = window[stateKey];

  if (state) {
    return;
  }

  state = window[stateKey] = { loading: true };

  var config = readConfig(loader);
  var analyticsUrl = loader && loader.src
    ? new URL('tracker/analytics.js', loader.src).toString()
    : 'tracker/analytics.js';
  var script = document.createElement('script');

  window.LandingAnalyticsConfig = Object.assign(
    {},
    config,
    window.LandingAnalyticsConfig || {}
  );

  script.src = analyticsUrl;
  script.async = false;
  script.onload = function () {
    state.loaded = true;
  };
  script.onerror = function () {
    state.loading = false;
    state.error = true;
  };
  (document.head || document.documentElement).appendChild(script);

  function readConfig(scriptElement) {
    if (!scriptElement) {
      return {};
    }

    var config = {
      siteKey: scriptElement.getAttribute('data-site-key') ||
        scriptElement.getAttribute('data-site-id') || undefined,
      siteId: scriptElement.getAttribute('data-site-id') || undefined,
      apiBase: scriptElement.getAttribute('data-api-base') || undefined
    };
    var debug = scriptElement.getAttribute('data-debug');
    var trackMouse = scriptElement.getAttribute('data-track-mouse');

    if (config.apiBase === undefined && scriptElement.src) {
      config.apiBase = new URL('api/', scriptElement.src).toString();
    }
    if (debug !== null) {
      config.debug = debug === 'true';
    }
    if (trackMouse !== null) {
      config.trackMouse = trackMouse === 'true';
    }

    Object.keys(config).forEach(function (key) {
      if (config[key] === undefined || config[key] === '') {
        delete config[key];
      }
    });

    return config;
  }
})();
