(function () {
  'use strict';

  var currentScript = document.currentScript;
  var scriptUrl = currentScript && currentScript.src ? currentScript.src : '';
  var scriptBase = scriptUrl ? scriptUrl.replace(/\/[^/]*$/, '/') : './';
  var existingConfig = window.LandingAnalyticsConfig || {};
  var datasetConfig = readDatasetConfig(currentScript);
  var scripts = [
    scriptBase + 'modules/utils.js',
    scriptBase + 'modules/interactions.js',
    scriptBase + 'local-analytics.js'
  ];

  window.LandingAnalyticsConfig = Object.assign({}, datasetConfig, existingConfig);

  loadScripts(scripts).catch(function (error) {
    if (window.console) {
      console.error('[LandingAnalytics] Impossibile caricare il tracker.', error);
    }
  });

  function readDatasetConfig(script) {
    if (!script) {
      return {};
    }

    var config = {
      siteId: script.getAttribute('data-site-id') || undefined,
      pageId: script.getAttribute('data-page-id') || undefined,
      pageName: script.getAttribute('data-page-name') || undefined,
      remoteEndpoint: script.getAttribute('data-remote-endpoint') || undefined,
      trackingVersion: script.getAttribute('data-tracking-version') || undefined
    };
    var debug = script.getAttribute('data-debug');
    var remoteEnabled = script.getAttribute('data-remote-enabled');
    var trackSections = script.getAttribute('data-track-sections');
    var autoTrackCtas = script.getAttribute('data-auto-track-ctas');
    var autoTrackForms = script.getAttribute('data-auto-track-forms');
    var autoTrackSections = script.getAttribute('data-auto-track-sections');
    var trackClicks = script.getAttribute('data-track-clicks');
    var trackMouse = script.getAttribute('data-track-mouse');
    var autoThankYou = script.getAttribute('data-auto-thank-you');

    if (debug !== null) config.debug = debug === 'true';
    if (remoteEnabled !== null) config.remoteEnabled = remoteEnabled !== 'false';
    if (trackSections !== null) config.trackSections = trackSections !== 'false';
    if (autoTrackCtas !== null) config.autoTrackCtas = autoTrackCtas !== 'false';
    if (autoTrackForms !== null) config.autoTrackForms = autoTrackForms !== 'false';
    if (autoTrackSections !== null) config.autoTrackSections = autoTrackSections !== 'false';
    if (trackClicks !== null) config.trackClicks = trackClicks !== 'false';
    if (trackMouse !== null) config.trackMouse = trackMouse === 'true';
    if (autoThankYou !== null) config.autoThankYou = autoThankYou !== 'false';

    Object.keys(config).forEach(function (key) {
      if (config[key] === undefined || config[key] === '') {
        delete config[key];
      }
    });

    return config;
  }

  function loadScripts(urls) {
    return urls.reduce(function (chain, url) {
      return chain.then(function () {
        return loadScript(url);
      });
    }, Promise.resolve());
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');

      script.src = url;
      script.async = false;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error('Script non caricato: ' + url));
      };

      document.head.appendChild(script);
    });
  }
})();
