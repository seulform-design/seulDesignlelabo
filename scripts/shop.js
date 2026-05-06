/**
 * LE LABO · shop.js
 * Filters, sort, lab picks grid sort, shop grid view, compare tray (max 3).
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
    const labPicksGrid = document.getElementById("lab-picks-grid");

    const sortLabGrid = (mode) => {
      if (!labPicksGrid) return;
      const items = Array.from(labPicksGrid.querySelectorAll(":scope > .lab-picks-card"));
      const sorted = items.slice().sort((a, b) => {
        const pa = Number(a.getAttribute("data-lab-price")) || 0;
        const pb = Number(b.getAttribute("data-lab-price")) || 0;
        const ra = Number(a.getAttribute("data-lab-reviews")) || 0;
        const rb = Number(b.getAttribute("data-lab-reviews")) || 0;
        const sa = a.getAttribute("data-lab-slug") || "";
        const sb = b.getAttribute("data-lab-slug") || "";
        if (mode === "price-asc") return pa - pb || sa.localeCompare(sb);
        return rb - ra || sa.localeCompare(sb);
      });
      sorted.forEach((el) => labPicksGrid.appendChild(el));
    };

    const labSortBtns = document.querySelectorAll(".lab-picks-sort-btn");
    const setLabSortActive = (active) => {
      labSortBtns.forEach((b) => {
        const on = b === active;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
    };

    labSortBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        setLabSortActive(btn);
        sortLabGrid(btn.getAttribute("data-lab-sort") || "popularity");
      });
    });

    /** Shop · Scent Finder — interactive family + situation → preview + hero */
    const initScentFinderSection = () => {
      const root = document.getElementById("scent-finder");
      const startBtn = document.getElementById("scent-finder-start-btn");
      const startHint = document.getElementById("scent-finder-start-hint");
      const heroWrap = document.getElementById("scent-finder-hero-wrap");
      const heroImg = document.getElementById("scent-finder-hero-img");
      const previewRoot = document.getElementById("scent-finder-live-preview");
      const previewList = document.getElementById("scent-finder-preview-list");
      const situationEl = document.getElementById("scent-finder-situation");
      const stepItems = root ? Array.from(root.querySelectorAll(".scent-finder-step")) : [];
      const defaultHero = "./images/common/manufacturing.jpg";

      const DATA = {
        woody: {
          tone: "warm",
          hero: "./images/common/woody.png",
          picks: [
            {
              name: "Santal 33",
              reason: "스모키 우디의 시그니처로, 잔향과 실루엣이 가장 또렷합니다.",
              img: "./images/common/santal33.png",
            },
            {
              name: "Cedar 11",
              reason: "따뜻한 시더 베이스가 포멀·나이트 상황에서 안정적으로 머뭅니다.",
              img: "./images/common/Cedar-1.jpg",
            },
          ],
        },
        floral: {
          tone: "soft",
          hero: "./images/common/lelabo_104.jpg",
          picks: [
            {
              name: "Rose 31",
              reason: "스파이스가 얹힌 플로럴 그린으로 데일리–데이트 모두 실패 확률이 낮습니다.",
              img: "./images/common/rose31.png",
            },
            {
              name: "LYS 41",
              reason: "화이트 플로럴의 밀도가 데이트 실루엣을 또렷하게 잡아줍니다.",
              img: "./images/common/lys41.png",
            },
          ],
        },
        citrus: {
          tone: "fresh",
          hero: "./images/common/lelabo_093.jpg",
          picks: [
            {
              name: "Bergamote 22",
              reason: "선명한 시트러스로 오피스·데일리 첫인상이 가장 안정적입니다.",
              img: "./images/common/bergamote22.png",
            },
            {
              name: "LAVANDE 31",
              reason: "클린한 허브–시트러스로 상쾌한 데일리 무드를 오래 유지합니다.",
              img: "./images/common/lavande-31-1.jpg",
            },
          ],
        },
        smoky: {
          tone: "dark",
          hero: "./images/common/lelabo_228.png",
          picks: [
            {
              name: "TONKA 25",
              reason: "달콤한 스모키 잔향이 밤·포멀 장면에서 지속력 대비 만족도가 높습니다.",
              img: "./images/common/tonka-25-1.jpg",
            },
            {
              name: "ENCENS 9",
              reason: "인센스–레진 축으로 나이트 포멀에 설득력 있는 실루엣을 줍니다.",
              img: "./images/common/lelabo_095.jpg",
            },
          ],
        },
      };

      const state = { family: null, situation: null };

      if (!root || !startBtn || !heroImg || !previewRoot || !previewList || !situationEl) return;

      const cards = Array.from(root.querySelectorAll(".scent-finder-variant-card"));
      const sitButtons = Array.from(root.querySelectorAll(".scent-finder-sit-btn"));

      const setSteps = () => {
        const step = state.situation ? 3 : state.family ? 2 : 1;
        stepItems.forEach((li) => {
          const n = Number(li.getAttribute("data-sf-step-indicator")) || 1;
          li.classList.toggle("is-current", n === step);
          li.classList.toggle("is-done", n < step);
        });
      };

      const situationLabels = {
        daily: "Daily · 데일리",
        office: "Office · 오피스",
        date: "Date · 데이트",
        night: "Night · 나이트",
      };

      const renderPreview = () => {
        if (!state.family) {
          previewList.innerHTML = "";
          previewRoot.hidden = true;
          return;
        }
        const d = DATA[state.family];
        if (!d) return;
        previewRoot.hidden = false;
        const sitLabel =
          state.situation && situationLabels[state.situation]
            ? `<p class="scent-finder-preview-context">선택 상황 · <strong>${situationLabels[state.situation]}</strong></p>`
            : "";
        previewList.innerHTML =
          sitLabel +
          d.picks
            .map(
              (p) => `
          <article class="scent-finder-preview-card">
            <div class="scent-finder-preview-media"><img src="${p.img}" alt="" loading="lazy" width="56" height="56"></div>
            <div class="scent-finder-preview-body">
              <h4 class="scent-finder-preview-name">${p.name}</h4>
              <p class="scent-finder-preview-reason">${p.reason}</p>
            </div>
          </article>`
            )
            .join("");
      };

      const syncHero = () => {
        if (!heroWrap) return;
        if (!state.family) {
          heroImg.src = defaultHero;
          heroWrap.dataset.sfTone = "lab";
          return;
        }
        const d = DATA[state.family];
        heroImg.src = d.hero;
        heroWrap.dataset.sfTone = d.tone;
      };

      const syncStart = () => {
        const ok = Boolean(state.family);
        startBtn.disabled = !ok;
        startBtn.setAttribute("aria-disabled", String(!ok));
        if (startHint) {
          startHint.textContent = ok
            ? "선택한 계열·상황이 Finder에 전달됩니다. 이어서 전체 설문을 진행하세요."
            : "향 계열을 먼저 선택하면 Finder로 이동할 수 있습니다.";
        }
      };

      const selectFamily = (key) => {
        state.family = key;
        cards.forEach((li) => {
          const k = li.getAttribute("data-sf-family");
          const on = k === key;
          li.classList.toggle("is-selected", on);
          const b = li.querySelector(".scent-finder-variant-link");
          if (b) b.setAttribute("aria-pressed", String(on));
        });
        situationEl.hidden = false;
        setSteps();
        syncHero();
        renderPreview();
        syncStart();
      };

      const selectSituation = (key) => {
        state.situation = key;
        sitButtons.forEach((b) => {
          const k = b.getAttribute("data-sf-situation");
          const on = k === key;
          b.classList.toggle("is-selected", on);
          b.setAttribute("aria-pressed", String(on));
        });
        setSteps();
        renderPreview();
      };

      cards.forEach((li) => {
        const btn = li.querySelector(".scent-finder-variant-link");
        const key = li.getAttribute("data-sf-family");
        if (!btn || !key || !(key in DATA)) return;
        btn.addEventListener("click", () => selectFamily(key));
      });

      sitButtons.forEach((b) => {
        b.addEventListener("click", () => {
          const key = b.getAttribute("data-sf-situation");
          if (!key) return;
          selectSituation(key);
        });
      });

      startBtn.addEventListener("click", () => {
        if (!state.family) return;
        const q = new URLSearchParams();
        q.set("family", state.family);
        if (state.situation) q.set("situation", state.situation);
        window.location.href = `finder.html?${q.toString()}`;
      });

      setSteps();
      syncHero();
      syncStart();
    };

    initScentFinderSection();

    /** Shop · scent guide (consultation chips) — DOM differs from finder.html wizard */
    const initShopConsultationChips = () => {
      const chipsRoot = document.getElementById("scent-situation-chips");
      const listRoot = document.getElementById("scent-result-list");
      if (!chipsRoot || !listRoot) return;

      const PRESETS = {
        daily: {
          img: "./images/common/santal33.png",
          alt: "SANTAL 33",
          title: "SANTAL 33",
          tag: "우디 · 데일리 시그니처",
        },
        "special-night": {
          img: "./images/common/rose31.png",
          alt: "ROSE 31",
          title: "ROSE 31",
          tag: "스파이스 플로럴 · 나이트 무드",
        },
        "quiet-focus": {
          img: "./images/common/the-matcha-26-1.jpg",
          alt: "THÉ MATCHA 26",
          title: "THÉ MATCHA 26",
          tag: "그린 티 · 차분한 집중",
        },
        "fresh-energy": {
          img: "./images/common/bergamote22.png",
          alt: "BERGAMOTE 22",
          title: "BERGAMOTE 22",
          tag: "시트러스 · 상쾌한 첫인상",
        },
      };

      const render = (key) => {
        const k = key && key in PRESETS ? key : "daily";
        const d = PRESETS[k];
        listRoot.innerHTML = `
          <div class="recommend-preview">
            <img src="${d.img}" alt="${d.alt}">
            <div class="preview-info">
              <strong>${d.title}</strong>
              <span>${d.tag}</span>
            </div>
          </div>`;
      };

      chipsRoot.querySelectorAll(".chip-v2[data-situation]").forEach((btn) => {
        btn.addEventListener("click", () => {
          chipsRoot.querySelectorAll(".chip-v2[data-situation]").forEach((b) => {
            b.classList.remove("is-active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-pressed", "true");
          const key = btn.getAttribute("data-situation") || "daily";
          render(key in PRESETS ? key : "daily");
        });
      });

      const initial =
        chipsRoot.querySelector(".chip-v2.is-active[data-situation]")?.getAttribute("data-situation") || "daily";
      render(initial in PRESETS ? initial : "daily");
    };

    initShopConsultationChips();

    /** Quick add — demo feedback only (cart wiring can replace later) */
    const bindQuickAdd = (root) => {
      if (!root) return;
      root.addEventListener("click", (e) => {
        const btn = e.target.closest(".shop-quick-add");
        if (!btn || !root.contains(btn)) return;
        e.preventDefault();
        const card = btn.closest(".product-card");
        const input = card?.querySelector(".product-compare-input");
        const name =
          input?.getAttribute("data-product") ||
          card?.querySelector(".card-title")?.textContent?.trim() ||
          "선택한 향";
        const prev = btn.textContent;
        btn.setAttribute("data-state", "added");
        btn.textContent = "담김";
        btn.setAttribute("aria-label", `${name} 장바구니에 담김`);
        window.setTimeout(() => {
          btn.removeAttribute("data-state");
          btn.textContent = prev;
          btn.setAttribute("aria-label", `${name} 장바구니에 담기`);
        }, 1400);
      });
    };

    bindQuickAdd(labPicksGrid);

    const grid = document.getElementById("shop-product-grid");
    if (!grid) return;

    const injectShopCompareControls = () => {
      grid.querySelectorAll(".product-card").forEach((card) => {
        if (card.querySelector(".product-compare-input")) return;
        const title = card.querySelector(".product-title")?.textContent?.trim();
        if (!title) return;
        const label = document.createElement("label");
        label.className = "product-compare";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "product-compare-input";
        input.setAttribute("data-product", title);
        input.setAttribute("aria-label", `${title} 비교 트레이에 추가`);
        const box = document.createElement("span");
        box.className = "product-compare-box";
        box.setAttribute("aria-hidden", "true");
        const cap = document.createElement("span");
        cap.className = "product-compare-label";
        cap.textContent = "Compare";
        label.append(input, box, cap);
        card.insertBefore(label, card.firstChild);
      });
    };

    injectShopCompareControls();

    const cards = Array.from(grid.querySelectorAll(".product-card"));
    const initialOrder = cards.slice();
    const filterCountEl = document.getElementById("shop-filter-count");
    const resultCountEl = document.getElementById("shop-result-count");
    const shopCountEl = document.getElementById("shop-count");
    const emptyState = document.getElementById("shop-empty");
    const resetBtn = document.getElementById("shop-filter-reset");
    const emptyReset = document.getElementById("shop-empty-reset");
    const compareTray = document.getElementById("compare-tray");
    const compareCountEl = document.getElementById("compare-count");
    const compareSlots = compareTray ? Array.from(compareTray.querySelectorAll(".compare-slots .slot")) : [];
    const clearCompare = document.getElementById("clear-compare");
    const openCompare = document.getElementById("open-compare");

    const state = {
      scent: "all",
      situation: "all",
      sort: "featured",
      compare: [],
    };

    const setTrayCount = (n) => {
      if (!compareTray) return;
      compareTray.setAttribute("data-count", String(n));
      if (compareCountEl) {
        compareCountEl.innerHTML = `<strong>${n}</strong> / 3 scents selected`;
      }
      if (clearCompare) clearCompare.disabled = n === 0;
      if (openCompare) openCompare.disabled = n < 2;
    };

    const renderCompareSlots = () => {
      compareSlots.forEach((slot, i) => {
        const name = state.compare[i];
        if (name) {
          slot.innerHTML = `<span class="slot-name">${name}</span><button type="button" class="slot-remove" data-slot-index="${i}" aria-label="${name} 비교에서 제거">×</button>`;
          slot.setAttribute("aria-label", `${name} 비교 슬롯`);
        } else {
          slot.innerHTML = `<span class="slot-placeholder">Slot ${i + 1}</span>`;
          slot.setAttribute("aria-label", `빈 슬롯 ${i + 1}`);
        }
      });
    };

    const syncCompareFromInputs = () => {
      const selected = [];
      grid.querySelectorAll(".product-compare-input:checked").forEach((input) => {
        const name = input.getAttribute("data-product");
        if (name) selected.push({ name, input });
      });
      selected.forEach((item, i) => {
        if (i >= 3) item.input.checked = false;
      });
      state.compare = selected.slice(0, 3).map((s) => s.name);
      setTrayCount(state.compare.length);
      renderCompareSlots();
    };

    grid.querySelectorAll(".product-compare-input").forEach((input) => {
      input.addEventListener("change", () => {
        syncCompareFromInputs();
      });
    });

    compareTray?.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const rm = t.closest(".slot-remove");
      if (!rm) return;
      const idx = Number(rm.getAttribute("data-slot-index"));
      const name = state.compare[idx];
      if (!name) return;
      grid.querySelectorAll(".product-compare-input").forEach((input) => {
        if (input.getAttribute("data-product") === name) input.checked = false;
      });
      syncCompareFromInputs();
    });

    clearCompare?.addEventListener("click", () => {
      grid.querySelectorAll(".product-compare-input").forEach((input) => {
        input.checked = false;
      });
      syncCompareFromInputs();
    });

    openCompare?.addEventListener("click", () => {
      if (state.compare.length < 2) return;
      compareTray?.scrollIntoView({ behavior: "smooth", block: "center" });
      compareTray?.classList.add("is-pulse");
      window.setTimeout(() => compareTray?.classList.remove("is-pulse"), 600);
    });

    const countActiveFilters = () => {
      let n = 0;
      if (state.scent !== "all") n += 1;
      if (state.situation !== "all") n += 1;
      return n;
    };

    const sortInPlace = () => {
      const getNum = (el, attr) => Number(el.getAttribute(attr) || 0);

      if (state.sort === "featured") {
        initialOrder.forEach((c) => grid.appendChild(c));
        return;
      }

      const visibleCards = cards.filter((c) => !c.hidden);
      const hiddenCards = cards.filter((c) => c.hidden);

      if (state.sort === "best-sellers") {
        visibleCards.sort((a, b) => getNum(b, "data-reviews") - getNum(a, "data-reviews"));
      } else if (state.sort === "newest") {
        visibleCards.sort((a, b) => getNum(a, "data-release-order") - getNum(b, "data-release-order"));
      } else if (state.sort === "price-asc") {
        visibleCards.sort((a, b) => getNum(a, "data-price") - getNum(b, "data-price"));
      } else if (state.sort === "price-desc") {
        visibleCards.sort((a, b) => getNum(b, "data-price") - getNum(a, "data-price"));
      }

      visibleCards.forEach((c) => grid.appendChild(c));
      hiddenCards.forEach((c) => grid.appendChild(c));
    };

    const applyFilters = () => {
      let visible = 0;
      cards.forEach((card) => {
        const scent = card.getAttribute("data-scent") || "";
        const sit = (card.getAttribute("data-situation") || "").split(",").map((s) => s.trim());
        let ok = true;
        if (state.scent !== "all" && scent !== state.scent) ok = false;
        if (state.situation !== "all" && !sit.includes(state.situation)) ok = false;
        if (!ok) {
          const cmp = card.querySelector(".product-compare-input:checked");
          if (cmp instanceof HTMLInputElement) cmp.checked = false;
        }
        card.hidden = !ok;
        if (ok) visible += 1;
      });

      if (filterCountEl) filterCountEl.textContent = String(countActiveFilters());
      if (resultCountEl) {
        const total = shopCountEl ? shopCountEl.textContent.trim() : String(cards.length);
        resultCountEl.innerHTML = `<strong>${visible}</strong> of <span>${total}</span> scents`;
      }
      if (emptyState) emptyState.hidden = visible !== 0;

      sortInPlace();
      syncCompareFromInputs();
    };

    document.querySelectorAll(".filter-chip-list .chip[data-filter-group]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const group = chip.getAttribute("data-filter-group");
        const list = chip.closest(".filter-chip-list");
        list?.querySelectorAll(".chip").forEach((c) => {
          if (c.getAttribute("data-filter-group") === group) {
            c.setAttribute("aria-pressed", "false");
          }
        });
        chip.setAttribute("aria-pressed", "true");

        if (group === "scent") {
          state.scent = chip.getAttribute("data-filter-value") || "all";
        }
        if (group === "situation") {
          state.situation = chip.getAttribute("data-filter-value") || "all";
        }
        if (group === "sort") {
          state.sort = chip.getAttribute("data-sort") || "featured";
        }
        applyFilters();
      });
    });

    const resetFilters = () => {
      state.scent = "all";
      state.situation = "all";
      state.sort = "featured";
      document.querySelectorAll('.filter-chip-list .chip[data-filter-group="scent"]').forEach((c) => {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter-value") === "all" ? "true" : "false");
      });
      document.querySelectorAll('.filter-chip-list .chip[data-filter-group="situation"]').forEach((c) => {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter-value") === "all" ? "true" : "false");
      });
      document.querySelectorAll('.filter-chip-list .chip[data-filter-group="sort"]').forEach((c) => {
        c.setAttribute("aria-pressed", c.getAttribute("data-sort") === "featured" ? "true" : "false");
      });
      cards.forEach((c) => {
        c.hidden = false;
      });
      sortInPlace();
      const total = cards.length;
      if (filterCountEl) filterCountEl.textContent = "0";
      if (resultCountEl) {
        resultCountEl.innerHTML = `<strong>${total}</strong> of <span>${total}</span> scents`;
      }
      if (emptyState) emptyState.hidden = true;
    };

    resetBtn?.addEventListener("click", resetFilters);
    emptyReset?.addEventListener("click", resetFilters);

    bindQuickAdd(grid);

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        document.querySelectorAll(".view-btn").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        grid.classList.toggle("is-compact", view === "compact");
      });
    });

    applyFilters();
    syncCompareFromInputs();
  });
})();
