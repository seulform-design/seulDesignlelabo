/**
 * LE LABO · global.js
 * Shared helpers for sub-pages (main index uses index.js only).
 */
(() => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  const ensureMainFocusTarget = () => {
    const main = document.getElementById("main-content");
    if (main && !main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureMainFocusTarget, { once: true });
  } else {
    ensureMainFocusTarget();
  }

  window.LL_UI = {
    headerOffset() {
      const raw = getComputedStyle(root).getPropertyValue("--header-height");
      const n = Number.parseInt(String(raw).trim(), 10);
      return Number.isFinite(n) ? n : 72;
    },
    scrollToHash(id, behavior) {
      if (!id || id === "#") return;
      const el = document.querySelector(id.startsWith("#") ? id : `#${id}`);
      if (!(el instanceof HTMLElement)) return;
      const top = el.getBoundingClientRect().top + window.scrollY - this.headerOffset() - 8;
      window.scrollTo({ top, behavior: behavior || "smooth" });
    },
  };
})();
