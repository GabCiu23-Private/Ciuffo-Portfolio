const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const interactivePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -36px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initBackgroundHover() {
  if (reducedMotion || !interactivePointer) {
    return;
  }

  const root = document.documentElement;
  const state = { x: 50, y: 50, shiftX: 0, shiftY: 0 };
  const target = { x: 50, y: 50, shiftX: 0, shiftY: 0 };
  let frameId = null;

  const renderBackgroundHover = () => {
    state.x += (target.x - state.x) * 0.12;
    state.y += (target.y - state.y) * 0.12;
    state.shiftX += (target.shiftX - state.shiftX) * 0.08;
    state.shiftY += (target.shiftY - state.shiftY) * 0.08;

    root.style.setProperty("--bg-hover-x", `${state.x.toFixed(2)}%`);
    root.style.setProperty("--bg-hover-y", `${state.y.toFixed(2)}%`);
    root.style.setProperty("--bg-grid-shift-x", `${state.shiftX.toFixed(2)}px`);
    root.style.setProperty("--bg-grid-shift-y", `${state.shiftY.toFixed(2)}px`);

    if (
      Math.abs(target.x - state.x) > 0.02 ||
      Math.abs(target.y - state.y) > 0.02 ||
      Math.abs(target.shiftX - state.shiftX) > 0.02 ||
      Math.abs(target.shiftY - state.shiftY) > 0.02
    ) {
      frameId = window.requestAnimationFrame(renderBackgroundHover);
    } else {
      frameId = null;
    }
  };

  const queueBackgroundHover = () => {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(renderBackgroundHover);
  };

  window.addEventListener("mousemove", (event) => {
    const xRatio = event.clientX / window.innerWidth;
    const yRatio = event.clientY / window.innerHeight;

    target.x = xRatio * 100;
    target.y = yRatio * 100;
    target.shiftX = (xRatio - 0.5) * 10;
    target.shiftY = (yRatio - 0.5) * 6;
    root.style.setProperty("--bg-hover-opacity", "1");
    queueBackgroundHover();
  });

  window.addEventListener("mouseleave", () => {
    target.x = 50;
    target.y = 50;
    target.shiftX = 0;
    target.shiftY = 0;
    root.style.setProperty("--bg-hover-opacity", "0");
    queueBackgroundHover();
  });
}

function initCaseVideos() {
  const caseVideoBlocks = document.querySelectorAll(".case-video-crop");

  caseVideoBlocks.forEach((wrap) => {
    const video = wrap.querySelector(".case-video-asset");
    const toggle = wrap.querySelector(".case-video-toggle");
    const fullscreen = wrap.querySelector(".case-video-fullscreen");

    if (!video) {
      return;
    }

    if (toggle) {
      const syncVideoToggleLabel = () => {
        const isPaused = video.paused;
        toggle.textContent = isPaused ? "Avvia video" : "Pausa video";
        toggle.setAttribute("aria-pressed", isPaused ? "true" : "false");
      };

      toggle.addEventListener("click", () => {
        if (video.paused) {
          void video.play();
        } else {
          video.pause();
        }
        syncVideoToggleLabel();
      });

      video.addEventListener("play", syncVideoToggleLabel);
      video.addEventListener("pause", syncVideoToggleLabel);
      syncVideoToggleLabel();
    }

    if (fullscreen) {
      const syncFullscreenLabel = () => {
        const isFullscreen = document.fullscreenElement === wrap;
        fullscreen.textContent = isFullscreen ? "Chiudi fullscreen" : "Fullscreen";
        fullscreen.setAttribute("aria-pressed", isFullscreen ? "true" : "false");
      };

      fullscreen.addEventListener("click", async () => {
        if (document.fullscreenElement === wrap) {
          await document.exitFullscreen();
        } else {
          await wrap.requestFullscreen();
        }
        syncFullscreenLabel();
      });

      document.addEventListener("fullscreenchange", syncFullscreenLabel);
      syncFullscreenLabel();
    }
  });
}

function initCaseMaps() {
  const mapOpenButtons = document.querySelectorAll("[data-map-open]");

  mapOpenButtons.forEach((button) => {
    const modalId = button.dataset.mapOpen;
    const modal = document.getElementById(modalId);
    const closeButton = modal?.querySelector("[data-map-close]");
    const scrollframe = modal?.querySelector(".case-map-scrollframe");
    const zoomRange = modal?.querySelector("[data-map-zoom-range]");
    const zoomIn = modal?.querySelector("[data-map-zoom-in]");
    const zoomOut = modal?.querySelector("[data-map-zoom-out]");
    const zoomReset = modal?.querySelector("[data-map-zoom-reset]");
    const panState = {
      active: false,
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0,
    };
    let lockedScrollY = 0;

    if (!modal) {
      return;
    }

    const lockPageScroll = () => {
      lockedScrollY = window.scrollY;
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.classList.add("is-modal-open");
    };

    const unlockPageScroll = () => {
      document.body.classList.remove("is-modal-open");
      document.body.style.top = "";
      window.scrollTo(0, lockedScrollY);
    };

    const setMapZoom = (value) => {
      const zoomValue = Math.min(260, Math.max(100, Number(value)));
      modal.style.setProperty("--map-zoom", `${zoomValue}%`);
      modal.classList.toggle("is-zoomed", zoomValue > 100);

      if (zoomRange) {
        zoomRange.value = String(zoomValue);
      }

      if (scrollframe) {
        scrollframe.scrollTo({
          left: (scrollframe.scrollWidth - scrollframe.clientWidth) / 2,
          top: (scrollframe.scrollHeight - scrollframe.clientHeight) / 2,
        });
      }
    };

    button.addEventListener("click", () => {
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
      lockPageScroll();
      setMapZoom(100);
    });

    closeButton?.addEventListener("click", () => {
      modal.close();
    });

    modal.addEventListener("close", unlockPageScroll);

    zoomRange?.addEventListener("input", () => {
      setMapZoom(zoomRange.value);
    });

    zoomIn?.addEventListener("click", () => {
      setMapZoom(Number(zoomRange?.value || 100) + 20);
    });

    zoomOut?.addEventListener("click", () => {
      setMapZoom(Number(zoomRange?.value || 100) - 20);
    });

    zoomReset?.addEventListener("click", () => {
      setMapZoom(100);
    });

    scrollframe?.addEventListener("pointerdown", (event) => {
      if (!modal.classList.contains("is-zoomed")) {
        return;
      }

      panState.active = true;
      panState.startX = event.clientX;
      panState.startY = event.clientY;
      panState.scrollLeft = scrollframe.scrollLeft;
      panState.scrollTop = scrollframe.scrollTop;
      scrollframe.classList.add("is-panning");
      scrollframe.setPointerCapture(event.pointerId);
    });

    scrollframe?.addEventListener("pointermove", (event) => {
      if (!panState.active) {
        return;
      }

      event.preventDefault();
      scrollframe.scrollLeft = panState.scrollLeft - (event.clientX - panState.startX);
      scrollframe.scrollTop = panState.scrollTop - (event.clientY - panState.startY);
    });

    const endMapPan = (event) => {
      if (!panState.active) {
        return;
      }

      panState.active = false;
      scrollframe?.classList.remove("is-panning");

      if (scrollframe?.hasPointerCapture(event.pointerId)) {
        scrollframe.releasePointerCapture(event.pointerId);
      }
    };

    scrollframe?.addEventListener("pointerup", endMapPan);
    scrollframe?.addEventListener("pointercancel", endMapPan);
    scrollframe?.addEventListener("lostpointercapture", () => {
      panState.active = false;
      scrollframe.classList.remove("is-panning");
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });
  });
}

window.CiuffoAnimations = {
  initBackgroundHover,
  initCaseMaps,
  initCaseVideos,
  initRevealAnimations,
};
