/**
 * LE LABO · animation.js — 스크롤·모션 (저사양 / reduced-motion 대응)
 */
(() => {
  if (typeof document === "undefined") return;

  window.LLInitAnimation = () => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    document.documentElement.classList.add("js-animations");

    const nodes = Array.from(document.querySelectorAll("[data-scroll-reveal]"));
    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") return;

    const assignRevealStagger = (section) => {
      const kids = section.classList.contains("hero-section")
        ? Array.from(section.children)
        : Array.from(section.querySelectorAll(":scope > .container > .content > *"));
      kids.forEach((node, i) => {
        node.style.setProperty("--reveal-d", `${42 + i * 70}ms`);
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach((el) => {
      assignRevealStagger(el);
      io.observe(el);
    });

    /** 와이드 에디토리얼 배너: 배경만 미세 이동(이미지 scale·hover와 분리) */
    const wide = document.querySelector(".editorial-section--wide");
    const parallaxWrap = wide?.querySelector(".image-wrap");
    if (wide instanceof HTMLElement && parallaxWrap instanceof HTMLElement) {
      let parallaxActive = false;
      let parallaxRaf = 0;
      const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

      const applyParallax = () => {
        parallaxRaf = 0;
        if (!parallaxActive) {
          parallaxWrap.style.transform = "";
          return;
        }
        const rect = wide.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const sectionMid = rect.top + rect.height * 0.5;
        const delta = (sectionMid - vh * 0.5) / vh;
        const y = clamp(-delta * 34, -26, 26);
        parallaxWrap.style.transform = `translate3d(0, ${y}px, 0)`;
      };

      const queueParallax = () => {
        if (parallaxRaf) return;
        parallaxRaf = window.requestAnimationFrame(applyParallax);
      };

      const parallaxIo = new IntersectionObserver(
        (entries) => {
          parallaxActive = entries.some((e) => e.isIntersecting);
          if (!parallaxActive) parallaxWrap.style.transform = "";
          queueParallax();
        },
        { rootMargin: "15% 0px", threshold: 0 }
      );
      parallaxIo.observe(wide);
      window.addEventListener("scroll", queueParallax, { passive: true });
      window.addEventListener("resize", queueParallax, { passive: true });
      queueParallax();
    }
  };
})();
