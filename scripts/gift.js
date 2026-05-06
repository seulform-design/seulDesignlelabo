(() => {
  if (typeof document === "undefined") return;
  const input = document.getElementById("gift-label-input");
  const preview = document.getElementById("gift-preview");
  const count = document.getElementById("gift-label-count");
  const clear = document.getElementById("gift-clear-btn");
  const max = 24;

  input?.addEventListener("input", () => {
    const v = input.value.slice(0, max);
    if (input.value !== v) input.value = v;
    if (count) count.textContent = String(v.length);
    if (preview) preview.textContent = v.trim() ? `LE LABO / ${v.trim()}` : "LE LABO / YOUR NAME";
    if (clear) clear.hidden = v.length === 0;
    try {
      if (v.trim()) sessionStorage.setItem("ll_gift_label", v.trim());
      else sessionStorage.removeItem("ll_gift_label");
    } catch {
      /* ignore */
    }
  });

  clear?.addEventListener("click", () => {
    if (input) input.value = "";
    try {
      sessionStorage.removeItem("ll_gift_label");
    } catch {
      /* ignore */
    }
    input?.dispatchEvent(new Event("input"));
  });
})();
