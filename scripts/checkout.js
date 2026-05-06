/**
 * LE LABO · checkout.js — shipping, promo panel, assist, gift label sync, light form UX
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
    const giftEl = document.getElementById("checkout-gift-label");
    try {
      const g = sessionStorage.getItem("ll_gift_label")?.trim();
      if (g && giftEl) {
        giftEl.textContent = `Gift Label · LE LABO / ${g}`;
        giftEl.hidden = false;
      }
    } catch {
      /* ignore */
    }

    document.querySelectorAll(".shipping-methods .shipping-method").forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.closest(".shipping-methods");
        const method = btn.getAttribute("data-shipping-method") || "standard";
        group?.querySelectorAll(".shipping-method").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-selected", on);
          b.setAttribute("aria-pressed", String(on));
        });
        const rows = document.querySelectorAll(".checkout-summary-calc .summary-row");
        const shipSpan = rows[1]?.querySelector("span:last-child");
        const deliveryEl = document.querySelector(".checkout-delivery .delivery-date");
        if (method === "express") {
          if (shipSpan) shipSpan.textContent = "₩ 8,000";
          if (deliveryEl) deliveryEl.textContent = "Express · Next day dispatch";
        } else {
          if (shipSpan) shipSpan.textContent = "Complimentary";
          if (deliveryEl) deliveryEl.textContent = "Standard · 2-3 business days";
        }
      });
    });

    const promoToggle = document.getElementById("promo-toggle");
    const promoWrap = document.getElementById("promo-code-wrap");
    promoToggle?.addEventListener("click", () => {
      const hidden = promoWrap?.hasAttribute("hidden");
      if (hidden) promoWrap.removeAttribute("hidden");
      else promoWrap?.setAttribute("hidden", "");
      promoToggle.setAttribute("aria-expanded", String(!!hidden));
    });

    document.querySelector(".promo-apply-btn")?.addEventListener("click", () => {
      const input = document.getElementById("promo-code-input");
      const code = input?.value?.trim();
      if (!code) {
        input?.focus();
        return;
      }
      promoToggle?.setAttribute("aria-expanded", "false");
      promoWrap?.setAttribute("hidden", "");
    });

    const assistMsg = document.getElementById("checkout-assist-msg");
    document.getElementById("address-assist-btn")?.addEventListener("click", () => {
      document.getElementById("ship-addr")?.focus();
      if (assistMsg) {
        assistMsg.hidden = false;
        assistMsg.textContent = "주소 필드에 포커스했습니다. 우편번호·동 이후 상세 주소를 이어서 입력해 주세요.";
      }
    });

    const note = document.getElementById("delivery-note");
    const noteHelp = document.getElementById("delivery-note-help");
    note?.addEventListener("input", () => {
      const len = note.value.length;
      if (noteHelp) {
        noteHelp.textContent = `최대 160자 · 현재 ${len}자 · 개인정보를 포함하지 마세요.`;
      }
    });

    const cardNum = document.getElementById("card-num");
    cardNum?.addEventListener("input", (e) => {
      const t = e.target;
      let d = t.value.replace(/\D/g, "").slice(0, 16);
      d = d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      t.value = d;
    });

    document.querySelectorAll(".express-btns .btn, .express-btns-v2 .btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (assistMsg) {
          assistMsg.hidden = false;
          assistMsg.textContent =
            "데모 환경: 간편결제는 연결되지 않았습니다. 아래 양식으로 주문을 이어가 주세요.";
        }
      });
    });

    document.querySelector("form.checkout-form, form.checkout-form-v2")?.addEventListener("submit", () => {
      try {
        sessionStorage.setItem("ll_checkout_submitted", String(Date.now()));
      } catch {
        /* ignore */
      }
    });

    // V2 markup fallback: no dedicated assist button id, use visible address helper button.
    if (!document.getElementById("address-assist-btn")) {
      const addrAssistBtn = document.querySelector(".field-v2.has-btn .field-link-v2");
      addrAssistBtn?.addEventListener("click", () => {
        document.getElementById("ship-addr")?.focus();
      });
    }
  });
})();
