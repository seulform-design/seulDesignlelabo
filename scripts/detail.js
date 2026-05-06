/**
 * LE LABO · detail.js
 * Gallery, size/price, qty, scroll progress, label preview, sticky.
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
    const mainImg = document.getElementById("main-product-image");
    document.querySelectorAll(".thumb-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const thumb = btn.querySelector("img");
        if (!thumb || !mainImg) return;
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt || mainImg.alt;
        document.querySelectorAll(".thumb-btn").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
      });
    });

    const priceAmount = document.getElementById("detail-price-amount");
    const priceUnit = document.getElementById("detail-price-unit");
    const stickyPrice = document.getElementById("sticky-detail-price");

    const applyPrice = (pr, sz) => {
      if (pr == null || pr === "") return;
      const formatted = `₩${Number(pr).toLocaleString("ko-KR")}`;
      if (priceAmount) priceAmount.textContent = formatted;
      if (priceUnit && sz) priceUnit.textContent = `/ ${sz}ml`;
      if (stickyPrice) stickyPrice.textContent = formatted;
    };

    document.querySelectorAll(".btn-size").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-size").forEach((b) => {
          const on = b === btn;
          b.setAttribute("aria-pressed", String(on));
          b.classList.toggle("btn-solid", on);
          b.classList.toggle("btn-ghost", !on);
        });
        applyPrice(btn.getAttribute("data-price"), btn.getAttribute("data-size"));
      });
    });

    const qtyVal = document.querySelector(".qty-value");
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!qtyVal) return;
        let n = Number(qtyVal.textContent) || 1;
        if (btn.getAttribute("data-action") === "increase") n += 1;
        else n = Math.max(1, n - 1);
        qtyVal.textContent = String(n);
      });
    });

    const bar = document.getElementById("scroll-progress");
    const onScroll = () => {
      if (!bar) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = `${p}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const giftInput = document.getElementById("gift-name");
    const giftPrev = document.querySelector(".gift-preview-text");
    giftInput?.addEventListener("input", () => {
      if (giftPrev) giftPrev.textContent = giftInput.value.trim() || "YOUR LABEL";
    });

    const sticky = document.getElementById("sticky-buy");
    if (sticky) {
      const hero =
        document.getElementById("detail-hero") || document.querySelector(".detail-hero-v2");
      const io = new IntersectionObserver(
        ([e]) => {
          sticky.setAttribute("data-visible", e.isIntersecting ? "false" : "true");
        },
        { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
      );
      if (hero) io.observe(hero);
    }
  });
})();
