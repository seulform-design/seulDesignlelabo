/**
 * LE LABO · journal.js — topic filter + newsletter demo submit
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
    const status = document.getElementById("journal-filter-status");
    const chips = document.querySelectorAll(".filter-btn-v2[data-journal-filter], [data-journal-filter].filter-btn-v2");
    const featured = document.querySelectorAll(".journal-card--feature[data-topic]");
    const archiveItems = document.querySelectorAll("#archive-grid .journal-item-v2[data-topic]");

    const TOPIC_KO = {
      all: "전체",
      craft: "Craft",
      lab: "Lab",
      ingredient: "Ingredient",
      scent: "Scent",
      seasonal: "Seasonal",
      material: "Material",
    };

    const applyFilter = (filter) => {
      const f = filter || "all";
      chips.forEach((c) => {
        const v = c.getAttribute("data-journal-filter") || c.textContent?.trim().split(/\s+/)[0]?.toLowerCase() || "all";
        const on = v === f;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
        c.setAttribute("aria-selected", String(on));
      });

      const match = (el) => f === "all" || el.getAttribute("data-topic") === f;
      let n = 0;
      featured.forEach((card) => {
        const show = match(card);
        card.hidden = !show;
        if (show) n += 1;
      });
      archiveItems.forEach((card) => {
        const show = match(card);
        card.hidden = !show;
        if (show) n += 1;
      });

      if (status) {
        const label = TOPIC_KO[f] || f;
        if (f === "all") {
          status.innerHTML = `<span class="filter-status-v2__part"><strong>전체</strong> 아카이브를 표시 중입니다</span><span class="filter-status-v2__sep" aria-hidden="true">·</span><span class="filter-status-v2__part"><strong>${n}</strong>편의 기록</span>`;
        } else {
          status.innerHTML = `<span class="filter-status-v2__part"><strong>${label}</strong> 주제만 표시 중입니다</span><span class="filter-status-v2__sep" aria-hidden="true">·</span><span class="filter-status-v2__part"><strong>${n}</strong>편의 기록</span>`;
        }
      }
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        applyFilter(chip.getAttribute("data-journal-filter") || chip.textContent?.trim().split(/\s+/)[0]?.toLowerCase() || "all");
      });
    });

    applyFilter("all");

    document.querySelectorAll(".journal-icon-btn[data-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", String(on));
      });
    });

    (document.getElementById("journal-subscribe-form") || document.querySelector(".subscribe-form-v2"))?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("journal-subscribe-email");
      const st = document.getElementById("journal-subscribe-status") || document.querySelector(".subscribe-note-v2");
      if (!email) return;
      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }
      if (st) st.textContent = `${email.value} 로 구독 요청을 접수했습니다. (데모)`;
    });
  });
})();
