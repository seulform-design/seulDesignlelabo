/**
 * LE LABO · main.js — 초기화 오케스트레이션
 * interaction.js / animation.js 는 전역 IIFE로 부트스트랩됩니다.
 */
(() => {
  if (typeof document === "undefined") return;

  document.documentElement.classList.add("ll-js-ready");

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const revealAllScrollSections = () => {
        document.querySelectorAll("[data-scroll-reveal]").forEach((el) => el.classList.add("is-revealed"));
      };
      if (typeof window.LLInitAnimation === "function") {
        try {
          window.LLInitAnimation();
        } catch {
          revealAllScrollSections();
        }
      } else {
        revealAllScrollSections();
      }
    },
    { once: true }
  );
})();
