function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return () => {};
  video.disablePictureInPicture = true;
  video.disableRemotePlayback = true;
  video.controls = false;
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let failed = false, disposed = false;
  const shouldPlay = () => !document.hidden && !reduced.matches && !failed && !disposed;
  const sync = () => {
    if (!shouldPlay()) { video.pause(); return; }
    if (!video.getAttribute('src')) { video.src = video.dataset.src; video.muted = true; }
    video.play().then(() => { if (!shouldPlay()) video.pause(); }).catch(() => { /* Keep the static poster if autoplay is blocked. */ });
  };
  sync();
  video.addEventListener('error', () => { failed = true; video.pause(); }, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  reduced.addEventListener('change', sync, { signal });
  return () => { disposed = true; controller.abort(); video.pause(); };
}

/* Text and object timelines follow native scrolling in both directions. */
let disposeSiteMotion = () => {};
function initSiteMotion() {
  disposeSiteMotion();
  const disposeVideo = initHeroVideo();
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 900px)');
  const items = [];
  let frame = 0;
  const selector = '.hero-word-text, .title-row-two > span, .title-row-three > span, .hero > .title-note, .work-hero-title-row h1, .profile-hero-title-row h1, .project-introduction h1, main h2, main h3, main p';
  const objects = [...document.querySelectorAll('.project-tile, .home-work-media, .numbers > div, .portrait-mark, .profile-facts, .project-screenshot, .case-media, .process-orbit, .service-list > article > span, .process-steps > div > span, .contact h2 > a, .work-hero-scroll, .case-section-label > span')];
  const targets = [...document.querySelectorAll(selector), ...objects].filter((element, index, all) => all.indexOf(element) === index && !objects.some((parent) => parent !== element && parent.contains(element)));
  const progress = document.querySelector('.case-progress');
  const clear = () => {
    items.forEach(({ animation }) => animation.cancel());
    items.length = 0;
  };
  const build = () => {
    clear();
    if (reduced.matches) return;
    targets.forEach((element) => {
      if (!element.animate) return;
      const object = objects.includes(element);
      const ornament = element.matches('.asterisk, .hero-motion-asterisk, .portrait-mark, .process-orbit');
      const anchor = (object ? element.parentElement : element).closest('section, article') || element.parentElement;
      const hero = Boolean(element.closest('.hero, .work-index-hero, .profile-hero'));
      const distance = mobile.matches ? (object ? 12 : 24) : object ? 32 : hero ? 110 : 64;
      const frames = ornament
        ? [{ rotate: '-35deg', scale: '.9' }, { rotate: '145deg', scale: '1' }]
        : object
          ? [{ translate: `0 ${mobile.matches ? 22 : 52}px`, scale: '.94' }, { translate: '0 0', scale: '1' }]
          : hero
            ? [{ translate: '0 0' }, { translate: `0 ${-distance}px` }]
            : [{ translate: `0 ${mobile.matches ? 28 : 64}px` }, { translate: '0 0' }];
      const top = element.getBoundingClientRect().top + scrollY;
      const animation = element.animate(frames, { duration: 1000, fill: 'both', easing: 'linear' });
      animation.pause();
      items.push({ element, anchor, hero, object, ornament, top, animation });
    });
    schedule();
  };
  const update = () => {
    frame = 0;
    // Read stationary section boxes first, then update the text timelines.
    const boxes = new Map();
    items.forEach(({ anchor }) => {
      if (!boxes.has(anchor)) boxes.set(anchor, anchor.getBoundingClientRect());
    });
    items.forEach(({ anchor, hero, ornament, top, animation }) => {
      const box = boxes.get(anchor);
      const value = hero
        ? -box.top / Math.max(1, box.height)
        : ornament
          ? (innerHeight - box.top) / Math.max(1, innerHeight + box.height)
          : (innerHeight * .9 - (top - scrollY)) / Math.max(1, innerHeight * .55);
      animation.currentTime = Math.max(0, Math.min(1, value)) * 1000;
    });
    if (progress) {
      const range = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0})`;
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', build, { passive: true, signal });
  window.addEventListener('load', build, { once: true, signal });
  document.fonts?.ready.then(() => { if (!signal.aborted) build(); });
  reduced.addEventListener('change', build, { signal });
  mobile.addEventListener('change', build, { signal });
  document.addEventListener('focusin', ({ target }) => {
    // A keyboard user always reaches a stationary action.
    for (let index = items.length - 1; index >= 0; index--) {
      const item = items[index];
      if (item.element.contains(target) || target.contains(item.element)) { item.animation.cancel(); items.splice(index, 1); }
    }
  }, { signal });
  build();
  disposeSiteMotion = () => { disposeVideo(); controller.abort(); clear(); cancelAnimationFrame(frame); };
}
window.addEventListener('pagehide', () => disposeSiteMotion());
window.addEventListener('pageshow', (event) => { if (event.persisted) initSiteMotion(); });
