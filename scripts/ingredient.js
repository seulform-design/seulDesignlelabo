/**
 * LE LABO · ingredient.js — matrix tone filter + anchor card emphasis
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
    const toolbar = document.querySelector(".forest-matrix-toolbar, .forest-matrix-v2 .matrix-filter-v2");
    const hint = document.getElementById("forest-matrix-hint");
    const rows = document.querySelectorAll(".forest-matrix-table tbody tr[data-tone], .matrix-table-v2 tbody tr[data-tone]");
    const anchors = document.querySelectorAll(
      "#key-ingredients-section .ingredient-anchor-card[data-tone], #key-ingredients-section .anchor-card-v2[data-tone]"
    );
    if (!toolbar || !rows.length) return;

    const LABEL = {
      all: "전체",
      woody: "Woody",
      citrus: "Citrus",
      floral: "Floral",
      smoky: "Smoky",
    };

    const setFilter = (tone) => {
      const t = tone || "all";
      toolbar.querySelectorAll("[data-matrix-filter]").forEach((btn) => {
        const v = btn.getAttribute("data-matrix-filter") || "all";
        const on = v === t;
        btn.classList.toggle("is-selected", on);
        btn.setAttribute("aria-pressed", String(on));
      });

      rows.forEach((tr) => {
        const rowTone = tr.getAttribute("data-tone");
        const show = t === "all" || rowTone === t;
        tr.hidden = !show;
        tr.classList.toggle("is-matrix-highlight", t !== "all" && rowTone === t);
      });

      anchors.forEach((card) => {
        const ct = card.getAttribute("data-tone");
        card.classList.toggle("is-anchor-dim", t !== "all" && ct !== t);
        card.classList.toggle("is-anchor-focus", t !== "all" && ct === t);
      });

      if (hint) {
        hint.textContent =
          t === "all"
            ? "전체 원료 행을 표시 중입니다."
            : `${LABEL[t] || t} 톤에 맞는 행만 표시합니다. 위 키 원료 카드와 교차 확인해 보세요.`;
      }
    };

    toolbar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-matrix-filter]");
      if (!btn) return;
      e.preventDefault();
      setFilter(btn.getAttribute("data-matrix-filter") || "all");
    });
  });
})();
