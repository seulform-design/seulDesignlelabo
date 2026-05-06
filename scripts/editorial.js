(() => {
  if (typeof document === "undefined") return;

  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  const initSwipers = () => {
    if (typeof Swiper === "undefined") return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const heroEl = document.querySelector('[data-swiper="hero"]');
    if (heroEl) {
      const countEl = heroEl.querySelector(".hero-slide-count");
      const currentEl = countEl?.querySelector(".current");
      const totalEl = countEl?.querySelector(".total");
      const getRealTotal = (swiper) => {
        const slides = Array.from(swiper.slides ?? []);
        const realSlides = slides.filter((slide) => !slide.classList.contains("swiper-slide-duplicate"));
        return Math.max(realSlides.length, 1);
      };

      new Swiper(heroEl, {
        loop: true,
        speed: 800,
        effect: "fade",
        fadeEffect: { crossFade: true },
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: heroEl.querySelector(".swiper-pagination"), clickable: true },
        navigation: {
          nextEl: heroEl.querySelector(".swiper-next"),
          prevEl: heroEl.querySelector(".swiper-prev"),
        },
        on: {
          init(swiper) {
            if (!currentEl || !totalEl) return;
            currentEl.textContent = String(swiper.realIndex + 1).padStart(2, "0");
            totalEl.textContent = String(getRealTotal(swiper)).padStart(2, "0");
          },
          slideChange(swiper) {
            if (!currentEl || !totalEl) return;
            currentEl.textContent = String(swiper.realIndex + 1).padStart(2, "0");
            totalEl.textContent = String(getRealTotal(swiper)).padStart(2, "0");
          },
        },
      });
    }

    const common = {
      speed: 650,
      spaceBetween: 24,
      watchOverflow: true,
      navigation: {},
    };

    const map = {
      quick: { slidesPerView: 1.2, breakpoints: { 640: { slidesPerView: 2 }, 1080: { slidesPerView: 4 } } },
      trending: { slidesPerView: 1.2, breakpoints: { 640: { slidesPerView: 2 }, 1080: { slidesPerView: 4 } } },
      "detail-related": { slidesPerView: 1.15, breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } },
    };

    Object.entries(map).forEach(([key, config]) => {
      const el = document.querySelector(`[data-swiper="${key}"]`);
      if (!el) return;
      const scope = el.closest("section") ?? el.parentElement;
      const nextEl = scope?.querySelector(".swiper-next");
      const prevEl = scope?.querySelector(".swiper-prev");

      new Swiper(el, {
        ...common,
        ...config,
        navigation: { nextEl, prevEl },
      });
    });

    /*
     * 취향의 좌표 — slidesPerView: auto, spaceBetween 40, 좌우 대칭 브리딩은 CSS(--sd-swiper-edge).
     */
    const depthEl = document.querySelector('[data-swiper="depth"]');
    const depthStatusEl = document.getElementById("scent-depth-carousel-status");
    const updateDepthCarouselStatus = (swiper) => {
      if (!depthStatusEl) return;
      const slides = Array.from(swiper.slides ?? []).filter(
        (s) => !s.classList.contains("swiper-slide-duplicate")
      );
      const total = slides.length;
      const i = swiper.realIndex;
      const slide = slides[i];
      const title = slide?.querySelector(".scent-depth__title")?.textContent?.trim() ?? "";
      depthStatusEl.textContent =
        total > 0 ? `${i + 1} / ${total}${title ? `, ${title}` : ""}` : "";
    };

    if (depthEl) {
      const scope = depthEl.closest("section") ?? depthEl.parentElement;
      const nextEl = scope?.querySelector(".swiper-button-next");
      const prevEl = scope?.querySelector(".swiper-button-prev");

      new Swiper(depthEl, {
        watchOverflow: false,
        slidesPerView: "auto",
        spaceBetween: 40,
        centeredSlides: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        speed: reduceMotion ? 0 : 700,
        grabCursor: !reduceMotion,
        slideToClickedSlide: true,
        roundLengths: false,
        loop: false,
        /* 끝/처음에서 화살표 완전 비활성 대신 자연스럽게 되감기(루프 복제 없음) */
        rewind: true,
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: { nextEl, prevEl },
        on: {
          init: updateDepthCarouselStatus,
          slideChange: updateDepthCarouselStatus,
        },
      });
    }
  };

  const initSmoothScroll = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        if (anchor.classList.contains("skip-nav")) return;
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerHeight = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
        if (target instanceof HTMLElement && target.id === "main-content") {
          target.focus({ preventScroll: true });
        }
      });
    });
  };

  ready(() => {
    initSwipers();
    initSmoothScroll();
  });
})();
