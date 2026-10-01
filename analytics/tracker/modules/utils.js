(function () {
  'use strict';

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function generateFingerprint() {
    var fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      !!window.indexedDB,
      navigator.platform,
      navigator.hardwareConcurrency || 'unknown'
    ].join('|');
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substr(0, 32);
  }

  function readJson(key, fallback, log) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      if (log) log('localStorage non leggibile per', key, error);
      return fallback;
    }
  }

  function writeJson(key, value, log) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (log) log('Impossibile scrivere localStorage per', key, error);
    }
  }

  function readCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function writeCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function throttle(fn, wait) {
    var last = 0;
    var timer = null;

    return function () {
      var now = Date.now();
      var remaining = wait - (now - last);

      if (remaining <= 0) {
        clearTimeout(timer);
        timer = null;
        last = now;
        fn();
        return;
      }

      if (!timer) {
        timer = setTimeout(function () {
          last = Date.now();
          timer = null;
          fn();
        }, remaining);
      }
    };
  }

  window.LandingAnalyticsUtils = {
    generateFingerprint: generateFingerprint,
    readCookie: readCookie,
    readJson: readJson,
    throttle: throttle,
    uuid: uuid,
    writeCookie: writeCookie,
    writeJson: writeJson
  };
})();
