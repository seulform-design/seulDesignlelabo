/**
 * LE LABO · order-complete.js — show persisted gift label when present
 */
(() => {
  if (typeof document === "undefined") return;

  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const gift = document.getElementById("order-gift-label");
    try {
      const g = sessionStorage.getItem("ll_gift_label")?.trim();
      if (g && gift) {
        gift.textContent = `Gift Label · LE LABO / ${g}`;
        gift.hidden = false;
      }
    } catch {
      /* ignore */
    }

    document.getElementById("order-live-track-btn")?.addEventListener("click", () => {
      const trackStatus = document.getElementById("order-track-status");
      if (trackStatus) {
        trackStatus.textContent = "실시간 배송 조회는 데모에서 준비 중입니다.";
        trackStatus.hidden = false;
      }
    });
  });
})();
