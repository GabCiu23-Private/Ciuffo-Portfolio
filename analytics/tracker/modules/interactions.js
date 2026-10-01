(function () {
  'use strict';

  function createInteractionTracker(options) {
    var config = options.config;
    var track = options.track;
    var throttle = options.throttle;
    var sentScrollDepths = {};
    var viewedSections = {};
    var viewedCtas = {};
    var trackedThankYouElements = {};
    var startedForms = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
    var submittedForms = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
    var ctaObserver = null;
    var sectionObserver = null;
    var domObserver = null;
    var lastSubmittedForm = null;
    var lastSubmitAt = 0;

    var ACTION_WORDS = /(prenota|preventivo|contatt|iscriv|registr|acquista|compra|ordina|richied|inizia|prova|scarica|download|invia|scopri|partecipa|call|book|contact|get started|start|try|buy|shop|request|quote|sign up|register|subscribe|download|send|submit|learn more)/i;
    var SUCCESS_WORDS = /(grazie|thank you|thanks|inviat[oa]|ricevut[oa]|success|successo|conferm|sent successfully|message sent|request received|we'll be in touch|ti ricontatteremo)/i;
    var CTA_CLASS_WORDS = /(cta|button|btn|action|primary|hero-?link|submit)/i;
    var CONTACT_HASH = /(contact|contatt|form|preventiv|quote|booking|prenot|lead|signup|register|iscriv)/i;

    function isIgnored(element) {
      return !!(element && element.closest && element.closest('[data-analytics-ignore], [data-no-track], [data-analytics-preview]'));
    }

    function cleanText(value, max) {
      return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max || 120);
    }

    function slug(value) {
      return cleanText(value, 180)
        .toLowerCase()
        .normalize ? cleanText(value, 180).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) : cleanText(value, 180).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
    }

    function getElementText(element) {
      if (!element) return '';
      if (element.matches && element.matches('input[type="submit"], input[type="button"]')) {
        return cleanText(element.value || element.getAttribute('aria-label') || '');
      }
      return cleanText(
        element.getAttribute && (element.getAttribute('aria-label') || element.getAttribute('title')) ||
        element.innerText || element.textContent || ''
      );
    }

    function getHref(element) {
      if (!element) return null;
      var link = element.matches && element.matches('a[href]') ? element : (element.closest ? element.closest('a[href]') : null);
      return link ? (link.getAttribute('href') || link.href || null) : null;
    }

    function getContactChannel(element) {
      var href = String(getHref(element) || '').toLowerCase();
      if (href.indexOf('mailto:') === 0) return 'email';
      if (href.indexOf('tel:') === 0) return 'phone';
      if (href.indexOf('wa.me/') !== -1 || href.indexOf('whatsapp.com/') !== -1 || href.indexOf('api.whatsapp.com/') !== -1) return 'whatsapp';
      return null;
    }

    function getStableLocator(element) {
      if (!element || !element.tagName) return '';
      if (element.id) return '#' + element.id;
      if (element.getAttribute('name')) return element.tagName.toLowerCase() + '[name="' + cleanText(element.getAttribute('name'), 60).replace(/"/g, '') + '"]';

      var parts = [];
      var node = element;
      var depth = 0;
      while (node && node.nodeType === 1 && node !== document.body && depth < 4) {
        var part = node.tagName.toLowerCase();
        if (node.id) {
          part += '#' + node.id;
          parts.unshift(part);
          break;
        }
        var parent = node.parentElement;
        if (parent) {
          var siblings = Array.prototype.filter.call(parent.children, function (child) { return child.tagName === node.tagName; });
          if (siblings.length > 1) part += ':nth-of-type(' + (siblings.indexOf(node) + 1) + ')';
        }
        parts.unshift(part);
        node = parent;
        depth += 1;
      }
      return parts.join(' > ').slice(0, 240);
    }

    function getElementLabel(element) {
      if (!element) return '';
      return cleanText(
        element.getAttribute('data-cta') ||
        element.getAttribute('data-track-form') ||
        element.getAttribute('data-section') ||
        element.getAttribute('aria-label') ||
        getElementText(element) ||
        element.tagName || ''
      );
    }

    function getCtaKey(element) {
      var explicit = element.getAttribute('data-cta');
      if (explicit) return explicit;

      var channel = getContactChannel(element);
      var text = getElementText(element);
      var href = getHref(element) || '';
      var id = element.id || '';
      var base = text || id || href || getStableLocator(element) || element.tagName;
      return 'auto-' + (channel ? channel + '-' : '') + (slug(base) || 'cta');
    }

    function isLikelyCta(element) {
      if (!element || !element.matches || isIgnored(element)) return false;
      if (element.hasAttribute('data-cta')) return true;
      if (config.autoTrackCtas === false) return false;
      if (element.matches('button:not([type="reset"]), input[type="submit"], input[type="button"], [role="button"]')) return true;
      if (!element.matches('a[href]')) return false;

      var href = element.getAttribute('href') || '';
      var text = getElementText(element);
      var classes = typeof element.className === 'string' ? element.className : '';
      if (getContactChannel(element)) return true;
      if (CTA_CLASS_WORDS.test(classes)) return true;
      if (ACTION_WORDS.test(text)) return true;
      if (href.charAt(0) === '#' && CONTACT_HASH.test(href)) return true;
      return false;
    }

    function getCtaElements(root) {
      var base = root && root.querySelectorAll ? root : document;
      var selector = '[data-cta], a[href], button, input[type="submit"], input[type="button"], [role="button"]';
      var items = [];
      if (root && root.nodeType === 1 && root.matches && root.matches(selector)) items.push(root);
      Array.prototype.forEach.call(base.querySelectorAll(selector), function (element) {
        if (items.indexOf(element) === -1) items.push(element);
      });
      return items.filter(isLikelyCta);
    }

    function getCtaMetadata(element, extra) {
      var data = {
        text: getElementText(element),
        href: getHref(element),
        tag: element.tagName ? element.tagName.toLowerCase() : null,
        locator: getStableLocator(element),
        auto_detected: !element.hasAttribute('data-cta'),
        contact_channel: getContactChannel(element)
      };
      Object.keys(extra || {}).forEach(function (key) { data[key] = extra[key]; });
      return data;
    }

    function bindCtaClicks() {
      document.addEventListener('click', function (event) {
        var candidate = event.target.closest && event.target.closest('[data-cta], a[href], button, input[type="submit"], input[type="button"], [role="button"]');
        if (!candidate || !isLikelyCta(candidate)) return;

        var key = getCtaKey(candidate);
        var channel = getContactChannel(candidate);
        track('cta_click', key, getCtaMetadata(candidate));
        if (channel) {
          track('contact_click', channel, getCtaMetadata(candidate, { cta_key: key }));
        }
      });
    }

    function getRenderedPageSize() {
      var doc = document.documentElement;
      var body = document.body;
      var viewportWidth = window.innerWidth || doc.clientWidth || 1;
      var viewportHeight = window.innerHeight || doc.clientHeight || 1;
      var elements = Array.prototype.slice.call(document.body.children).filter(function (element) {
        var style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.tagName.toLowerCase() !== 'script';
      });
      var contentBottom = elements.reduce(function (bottom, element) {
        var rect = element.getBoundingClientRect();
        return Math.max(bottom, rect.bottom + (window.scrollY || doc.scrollTop || body.scrollTop || 0));
      }, 0);

      return {
        width: Math.max(body.scrollWidth, doc.scrollWidth, body.offsetWidth, doc.offsetWidth, viewportWidth),
        height: Math.max(Math.ceil(contentBottom), viewportHeight)
      };
    }

    function buildPointerMetadata(event, target) {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      var pageSize = getRenderedPageSize();
      var pageWidth = pageSize.width;
      var pageHeight = pageSize.height;

      return {
        x: Math.round(event.clientX), y: Math.round(event.clientY),
        x_pct: Math.round((event.clientX / viewportWidth) * 1000) / 10,
        y_pct: Math.round((event.clientY / viewportHeight) * 1000) / 10,
        page_x: Math.round(event.pageX), page_y: Math.round(event.pageY),
        page_x_pct: Math.round((event.pageX / pageWidth) * 1000) / 10,
        page_y_pct: Math.round((event.pageY / pageHeight) * 1000) / 10,
        page_width: pageWidth, page_height: pageHeight,
        viewport_width: viewportWidth, viewport_height: viewportHeight,
        tag: target && target.tagName ? target.tagName.toLowerCase() : '',
        text: getElementLabel(target), href: getHref(target),
        locator: getStableLocator(target)
      };
    }

    function bindClickHeatmap() {
      if (config.trackClicks === false) return;
      document.addEventListener('click', function (event) {
        if (isIgnored(event.target)) return;
        var target = event.target.closest && event.target.closest('a, button, input, select, textarea, label, [data-cta], [role="button"], [role="tab"]') || event.target;
        track('click', getElementLabel(target), buildPointerMetadata(event, target));
      });
    }

    function bindMouseHeatmap() {
      if (config.trackMouse !== true) return;
      var lastMouseTrack = 0;
      document.addEventListener('mousemove', function (event) {
        var now = Date.now();
        if (now - lastMouseTrack < (config.mouseSampleMs || 1200)) return;
        if (isIgnored(event.target)) return;
        lastMouseTrack = now;
        track('mouse_move', 'movement', buildPointerMetadata(event, event.target));
      }, { passive: true });
    }

    function getFormLabel(form) {
      if (!form) return 'form';
      var explicit = form.getAttribute('data-track-form');
      if (explicit) return explicit;
      var id = form.id || form.getAttribute('name');
      if (id) return 'auto-' + slug(id);
      var submit = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
      var heading = form.querySelector('h1,h2,h3,h4,h5,h6,legend');
      var action = form.getAttribute('action');
      var base = (heading && getElementText(heading)) || (submit && getElementText(submit)) || action || getStableLocator(form);
      return 'auto-' + (slug(base) || 'form');
    }

    function getFormMetadata(form) {
      var fields = form ? form.querySelectorAll('input:not([type="hidden"]), textarea, select').length : 0;
      return {
        auto_detected: !form.hasAttribute('data-track-form'),
        form_id: form.id || null,
        form_name: form.getAttribute('name') || null,
        action: form.getAttribute('action') || null,
        method: (form.getAttribute('method') || 'get').toLowerCase(),
        field_count: fields,
        locator: getStableLocator(form)
      };
    }

    function hasFormStarted(form) {
      if (startedForms) return startedForms.has(form);
      return form.dataset.analyticsStarted === 'true';
    }

    function markFormStarted(form) {
      if (startedForms) startedForms.add(form);
      form.dataset.analyticsStarted = 'true';
    }

    function bindForms() {
      if (config.autoTrackForms === false && !document.querySelector('form[data-track-form]')) return;

      document.addEventListener('focusin', function (event) {
        var field = event.target.closest && event.target.closest('input, textarea, select');
        if (!field || isIgnored(field)) return;
        var form = field.closest('form');
        if (!form || (config.autoTrackForms === false && !form.hasAttribute('data-track-form')) || hasFormStarted(form)) return;
        markFormStarted(form);
        track('form_start', getFormLabel(form), getFormMetadata(form));
      });

      document.addEventListener('input', function (event) {
        var field = event.target.closest && event.target.closest('input, textarea, select');
        if (!field || isIgnored(field)) return;
        var form = field.closest('form');
        if (!form || (config.autoTrackForms === false && !form.hasAttribute('data-track-form')) || hasFormStarted(form)) return;
        markFormStarted(form);
        track('form_start', getFormLabel(form), getFormMetadata(form));
      }, { passive: true });

      document.addEventListener('invalid', function (event) {
        var field = event.target;
        var form = field && field.form;
        if (!form || isIgnored(form)) return;
        track('form_error', getFormLabel(form), {
          reason: 'html_validation',
          field_type: field.type || field.tagName.toLowerCase(),
          field_name: field.name || null,
          locator: getStableLocator(field)
        });
      }, true);

      document.addEventListener('submit', function (event) {
        var form = event.target && event.target.closest ? event.target.closest('form') : event.target;
        if (!form || isIgnored(form)) return;
        if (config.autoTrackForms === false && !form.hasAttribute('data-track-form')) return;

        if (!hasFormStarted(form)) {
          markFormStarted(form);
          track('form_start', getFormLabel(form), getFormMetadata(form));
        }

        var now = Date.now();
        var previous = submittedForms ? submittedForms.get(form) : Number(form.dataset.analyticsSubmittedAt || 0);
        if (!previous || now - previous > 1500) {
          track('form_submit', getFormLabel(form), getFormMetadata(form));
          if (submittedForms) submittedForms.set(form, now);
          form.dataset.analyticsSubmittedAt = String(now);
        }
        lastSubmittedForm = form;
        lastSubmitAt = now;
        window.setTimeout(checkAutomaticSuccess, 250);
        window.setTimeout(checkAutomaticSuccess, 1200);
        window.setTimeout(checkAutomaticSuccess, 3000);
      }, true);
    }

    function sendScroll(threshold) {
      if (sentScrollDepths[threshold]) return;
      sentScrollDepths[threshold] = true;
      track('scroll_' + threshold, String(threshold), { depth: threshold });
    }

    function trackScrollDepth() {
      var doc = document.documentElement;
      var body = document.body;
      var scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      var viewport = window.innerHeight || doc.clientHeight;
      var height = Math.max(body.scrollHeight, doc.scrollHeight, body.offsetHeight, doc.offsetHeight, body.clientHeight, doc.clientHeight);
      if (height <= viewport) { sendScroll(100); return; }
      var depth = Math.min(100, Math.round(((scrollTop + viewport) / height) * 100));
      [25, 50, 75, 100].forEach(function (threshold) { if (depth >= threshold) sendScroll(threshold); });
    }

    function bindScrollDepth() {
      var throttledScroll = throttle(trackScrollDepth, 500);
      window.addEventListener('scroll', throttledScroll, { passive: true });
      window.addEventListener('resize', throttledScroll);
      setTimeout(trackScrollDepth, 800);
    }

    function ensureCtaObserver() {
      if (ctaObserver || !('IntersectionObserver' in window)) return;
      ctaObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < (config.ctaViewThreshold || 0.5)) return;
          var key = getCtaKey(entry.target);
          if (!key || viewedCtas[key]) return;
          viewedCtas[key] = true;
          track('cta_view', key, getCtaMetadata(entry.target, {
            intersection_ratio: Math.round(entry.intersectionRatio * 100) / 100
          }));
          ctaObserver.unobserve(entry.target);
        });
      }, { threshold: [config.ctaViewThreshold || 0.5] });
    }

    function observeCtas(root) {
      ensureCtaObserver();
      if (!ctaObserver) return;
      getCtaElements(root || document).forEach(function (cta) {
        if (cta.dataset.analyticsCtaObserved === 'true') return;
        cta.dataset.analyticsCtaObserved = 'true';
        ctaObserver.observe(cta);
      });
    }

    function getSectionLabel(section) {
      var explicit = section.getAttribute('data-section');
      if (explicit) return explicit;
      var id = section.id;
      if (id) return 'auto-' + slug(id);
      var aria = section.getAttribute('aria-label');
      if (aria) return 'auto-' + slug(aria);
      var heading = section.querySelector('h1,h2,h3');
      return 'auto-' + (slug(heading ? getElementText(heading) : getStableLocator(section)) || 'section');
    }

    function isAutoSection(section) {
      if (!section || isIgnored(section)) return false;
      if (section.hasAttribute('data-section')) return true;
      if (config.autoTrackSections === false) return false;
      return section.matches('section, main > article, [role="region"], header.hero, header[class*="hero"]');
    }

    function ensureSectionObserver() {
      if (sectionObserver || !config.trackSections || !('IntersectionObserver' in window)) return;
      sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < (config.sectionViewThreshold || 0.35)) return;
          var sectionName = getSectionLabel(entry.target);
          if (!sectionName || viewedSections[sectionName]) return;
          viewedSections[sectionName] = true;
          track('section_view', sectionName, {
            section: sectionName,
            auto_detected: !entry.target.hasAttribute('data-section'),
            locator: getStableLocator(entry.target),
            heading: getElementText(entry.target.querySelector('h1,h2,h3'))
          });
          sectionObserver.unobserve(entry.target);
        });
      }, { threshold: [config.sectionViewThreshold || 0.35] });
    }

    function observeSections(root) {
      ensureSectionObserver();
      if (!sectionObserver) return;
      var items = [];
      if (root && root.nodeType === 1 && root.matches && root.matches('[data-section], section, main > article, [role="region"], header.hero, header[class*="hero"]')) items.push(root);
      var base = root && root.querySelectorAll ? root : document;
      Array.prototype.forEach.call(base.querySelectorAll('[data-section], section, main > article, [role="region"], header.hero, header[class*="hero"]'), function (section) {
        if (items.indexOf(section) === -1) items.push(section);
      });
      items.filter(isAutoSection).forEach(function (section) {
        if (section.dataset.analyticsSectionObserved === 'true') return;
        section.dataset.analyticsSectionObserved = 'true';
        sectionObserver.observe(section);
      });
    }

    function isElementVisible(element) {
      if (!element || element.hidden || element.getAttribute('aria-hidden') === 'true') return false;
      var style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      var rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }

    function trackThankYouElement(element, value, automatic) {
      var key = value + ':' + getStableLocator(element);
      if (trackedThankYouElements[key] || !isElementVisible(element)) return false;
      trackedThankYouElements[key] = true;
      track('thank_you_view', value, {
        auto_detected: !!automatic,
        text: getElementText(element),
        locator: getStableLocator(element),
        form: lastSubmittedForm ? getFormLabel(lastSubmittedForm) : null
      });
      return true;
    }

    function checkThankYouElements() {
      document.querySelectorAll('[data-thank-you]').forEach(function (element) {
        trackThankYouElement(element, element.getAttribute('data-thank-you') || 'thank_you', false);
      });
    }

    function checkAutomaticSuccess() {
      if (config.autoThankYou === false) return;
      var url = window.location.href.toLowerCase();
      if (/(thank[-_]?you|grazie|success|confirmed|conferma)/.test(url)) {
        var urlKey = 'url:' + window.location.pathname + window.location.search;
        if (!trackedThankYouElements[urlKey]) {
          trackedThankYouElements[urlKey] = true;
          track('thank_you_view', 'auto-url-success', { auto_detected: true, source: 'url', form: lastSubmittedForm ? getFormLabel(lastSubmittedForm) : null });
        }
      }

      if (!lastSubmitAt || Date.now() - lastSubmitAt > (config.successDetectionWindowMs || 15000)) return;
      var selectors = '[role="alert"], [role="status"], .success, .success-message, .form-success, .thank-you, .thank_you, [class*="success"], [class*="thank"]';
      Array.prototype.forEach.call(document.querySelectorAll(selectors), function (element) {
        var text = getElementText(element);
        if (text && SUCCESS_WORDS.test(text)) trackThankYouElement(element, 'auto-form-success', true);
      });
    }

    function observeThankYouElements() {
      checkThankYouElements();
      checkAutomaticSuccess();
    }

    function bindDomDiscovery() {
      if (!('MutationObserver' in window)) return;
      domObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          Array.prototype.forEach.call(mutation.addedNodes || [], function (node) {
            if (!node || node.nodeType !== 1) return;
            observeCtas(node);
            observeSections(node);
          });
        });
        checkThankYouElements();
        checkAutomaticSuccess();
      });
      domObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'aria-hidden'] });
    }

    function bindAll() {
      bindCtaClicks();
      bindClickHeatmap();
      bindMouseHeatmap();
      bindForms();
      observeCtas(document);
      observeSections(document);
      observeThankYouElements();
      bindDomDiscovery();
      bindScrollDepth();
    }

    return {
      bindAll: bindAll,
      refresh: function () {
        observeCtas(document);
        observeSections(document);
        observeThankYouElements();
      },
      getStatus: function () {
        return {
          ctasDetected: getCtaElements(document).length,
          formsDetected: document.querySelectorAll('form').length
        };
      }
    };
  }

  window.LandingAnalyticsInteractions = { create: createInteractionTracker };
})();
