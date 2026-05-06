(() => {
  if (typeof document === "undefined") return;
  const live = document.getElementById("cart-aria-status");

  document.querySelectorAll(".cart-item-qty").forEach((wrap) => {
    const val = wrap.querySelector(".qty-val");
    wrap.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!val) return;
        let n = Number(val.textContent) || 1;
        if (btn.getAttribute("aria-label")?.includes("Increase")) n += 1;
        else n = Math.max(1, n - 1);
        val.textContent = String(n);
        if (live) live.textContent = `수량 ${n}으로 변경되었습니다.`;
      });
    });
  });
  document.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".cart-item")?.remove();
      if (live) live.textContent = "해당 상품을 장바구니에서 제거했습니다.";
    });
  });
  document.querySelector(".cart-promo")?.addEventListener("submit", (e) => e.preventDefault());
})();
