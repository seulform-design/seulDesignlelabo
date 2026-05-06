/**
 * LE LABO · finder.js
 * 4-step selection, density, live preview, recommendation + similar + story.
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

  const PROFILES = {
    woody: {
      name: "Santal 33",
      family: "Woody · Smoky",
      image: "./images/common/santal33.png",
      notes: "Cardamom · Sandalwood · Cedar",
      editorial:
        "체온과 만나 깊게 가라앉는 샌달우드 베이스. 선택하신 맥락에 맞춰 잔향의 밀도를 최대로 끌어올립니다.",
      price: "₩210,000",
      similar: [
        { name: "Cedar 11", fit: "88", notes: "Woody · Warm", img: "./images/common/Cedar-1.jpg" },
        { name: "Rose 31", fit: "81", notes: "Floral · Green", img: "./images/common/ro31-1.jpg" },
        { name: "Another 13", fit: "79", notes: "Musk · Clean", img: "./images/common/an13.png" },
      ],
    },
    floral: {
      name: "Rose 31",
      family: "Floral · Green",
      image: "./images/common/ro31-1.jpg",
      notes: "Rose · Cumin · Musk",
      editorial:
        "플로럴의 곡선을 스파이스로 절제한 시그니처. 부드러운 데일리 인상을 유지하면서도 존재감을 잃지 않습니다.",
      price: "₩190,000",
      similar: [
        { name: "Iris 39", fit: "86", notes: "Powdery · Soft", img: "./images/common/iris39.png" },
        { name: "Neroli 36", fit: "82", notes: "Floral · Bright", img: "./images/common/neroli36.png" },
        { name: "Santal 33", fit: "78", notes: "Woody · Smoky", img: "./images/common/santal33.png" },
      ],
    },
    citrus: {
      name: "Bergamote 22",
      family: "Citrus · Bright",
      image: "./images/common/bergamote22.png",
      notes: "Bergamot · Vetiver · Musk",
      editorial:
        "투명한 시트러스가 피부 위에서 빠르게 정렬됩니다. 상쾌한 첫인상이 필요한 날의 안전한 선택입니다.",
      price: "₩220,000",
      similar: [
        { name: "Fresh Citrus", fit: "84", notes: "Citrus · Light", img: "./images/common/lelabo_124.jpg" },
        { name: "Rose 31", fit: "80", notes: "Floral · Green", img: "./images/common/ro31-1.jpg" },
        { name: "Santal 33", fit: "76", notes: "Woody · Deep", img: "./images/common/santal33.png" },
      ],
    },
    smoky: {
      name: "Vetiver 46",
      family: "Smoky · Earthy",
      image: "./images/common/vetver46.png",
      notes: "Vetiver · Pepper · Woods",
      editorial:
        "스모키 베티버가 밤의 공기를 닮은 무게를 만듭니다. 깊은 잔향과 실루엣을 동시에 요구할 때 적합합니다.",
      price: "₩260,000",
      similar: [
        { name: "TONKA 25", fit: "85", notes: "Gourmand · Dark", img: "./images/common/tonka-25-1.jpg" },
        { name: "ENCENS 9", fit: "83", notes: "Smoky · Leather", img: "./images/common/lelabo_095.jpg" },
        { name: "Santal 33", fit: "80", notes: "Woody · Signature", img: "./images/common/santal33.png" },
      ],
    },
  };

  const SIT_LABEL = { daily: "Daily", office: "Office", date: "Date", night: "Night" };
  const SEASON_LABEL = { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" };
  const MOOD_LABEL = { warm: "Warm", fresh: "Fresh", calm: "Calm", deep: "Deep" };
  const STEP_IMAGE_BY_VALUE = {
    scent: {
      woody: "./images/common/DryWoody.png",
      floral: "./images/common/lelabo_104.jpg",
      citrus: "./images/common/lelabo_093.jpg",
      smoky: "./images/common/lelabo_228.png",
    },
    situation: {
      daily: "./images/common/situation1.jpg",
      office: "./images/common/situation2.jpg",
      date: "./images/common/situation3.jpg",
      night: "./images/common/situation4.jpg",
    },
    season: {
      spring: "./images/common/Spring.jpg",
      summer: "./images/common/mood2.jpg",
      fall: "./images/common/Fall.jpg",
      winter: "./images/common/mood3.jpg",
    },
    mood: {
      warm: "./images/common/mood1.jpg",
      fresh: "./images/common/mood2.jpg",
      calm: "./images/common/mood3.jpg",
      deep: "./images/common/mood4.jpg",
    },
  };

  ready(() => {
    const state = {
      scent: null,
      situation: null,
      season: null,
      mood: null,
      density: null,
    };

    const progressNum =
      document.querySelector("#finder-progress .finder-progress-num") ||
      document.getElementById("finder-progress-text");
    const progressBar = document.getElementById("finder-progress-bar");
    const progressFill = document.getElementById("finder-progress-fill");
    const progressHint = document.getElementById("finder-progress-hint");
    const selSummary = document.getElementById("finder-selection-summary");
    const feedback = document.getElementById("finder-feedback");

    const setStepButtons = (step, value) => {
      const candidates = document.querySelectorAll(
        `[data-step="${step}"][data-value], .finder-card-v2[data-step="${step}"] .option-btn-v2[data-value]`
      );
      candidates.forEach((btn) => {
        const v = btn.getAttribute("data-value");
        const on = value != null && v === value;
        btn.setAttribute("aria-pressed", String(on));
        if (step === "density") btn.setAttribute("aria-checked", String(on));
      });
    };

    const countSteps = () =>
      ["scent", "situation", "season", "mood"].filter((k) => state[k] != null).length;

    const updateProgress = () => {
      const n = countSteps();
      if (progressNum) {
        progressNum.textContent =
          progressNum.id === "finder-progress-text" ? `${n} / 4 COMPLETED` : String(n);
      }
      if (progressBar) progressBar.setAttribute("aria-valuenow", String(n));
      if (progressFill) progressFill.style.width = `${(n / 4) * 100}%`;

      const hints = [
        "향 계열부터 순서대로 고르면 공식이 완성됩니다.",
        "사용 상황을 고르면 발향 강도 가중치가 반영됩니다.",
        "계절을 고르면 체감 온도 반응이 조정됩니다.",
        "무드를 고르면 추천 문장의 톤이 구체화됩니다.",
      ];
      if (progressHint) progressHint.textContent = hints[Math.min(n, 3)];

      const parts = [];
      if (state.scent) parts.push(state.scent);
      if (state.situation) parts.push(SIT_LABEL[state.situation] || state.situation);
      if (state.season) parts.push(SEASON_LABEL[state.season] || state.season);
      if (state.mood) parts.push(MOOD_LABEL[state.mood] || state.mood);
      if (selSummary) {
        const val = selSummary.querySelector(".summary-value");
        if (val) val.textContent = parts.length ? parts.join(" · ") : "아직 없음 · 향 계열부터 시작하세요";
      }
    };

    const updateLive = () => {
      const liveSummary = document.getElementById("live-summary");
      const liveDirection = document.getElementById("live-direction");
      const liveBest = document.getElementById("live-best-for");
      const liveState = document.getElementById("live-state-label");
      const liveAccord = document.getElementById("live-accord");
      const liveDensity = document.getElementById("live-density");
      const liveConf =
        document.querySelector("#live-confidence .live-confidence-value") ||
        document.getElementById("live-confidence-value");
      const liveTrack = document.getElementById("live-confidence-track-fill");
      const chipWrap = document.getElementById("live-chip-wrap");

      const n = countSteps();
      const conf = Math.min(100, n * 22 + (state.density ? 12 : 0));

      if (liveConf) liveConf.textContent = String(conf);
      if (liveTrack) {
        liveTrack.style.width = `${conf}%`;
        const track = liveTrack.closest(".live-confidence-track");
        if (track) track.setAttribute("aria-valuenow", String(conf));
      }

      if (chipWrap) {
        const chips = [];
        if (state.scent) chips.push(`<span class="live-chip">${state.scent}</span>`);
        if (state.situation) chips.push(`<span class="live-chip">${SIT_LABEL[state.situation]}</span>`);
        if (state.season) chips.push(`<span class="live-chip">${SEASON_LABEL[state.season]}</span>`);
        if (state.mood) chips.push(`<span class="live-chip">${MOOD_LABEL[state.mood]}</span>`);
        chipWrap.innerHTML = chips.length ? chips.join("") : '<span class="live-chip is-empty">No selection</span>';
      }

      if (!state.scent) {
        if (liveState) {
          liveState.textContent = "Empty State · 대기 중";
          liveState.setAttribute("data-state", "empty");
        }
        if (liveSummary) liveSummary.textContent = "아직 선택된 정보가 없습니다.";
        if (liveDirection)
          liveDirection.innerHTML =
            "향 계열부터 선택하면 예상 향 방향을 <strong>즉시</strong> 보여드립니다.";
        if (liveBest) liveBest.textContent = "Best for · 시작 전 단계";
        if (liveAccord) liveAccord.textContent = "Not defined";
        if (liveDensity) liveDensity.textContent = state.density ? state.density : "Balanced";
        return;
      }

      const p = PROFILES[state.scent];
      if (liveState) {
        liveState.textContent = "Live · 방향 구체화 중";
        liveState.setAttribute("data-state", "active");
      }
      if (liveSummary) liveSummary.textContent = `${p.name} 계열로 좁혀지는 중`;
      if (liveDirection) {
        liveDirection.textContent = `${p.family} 방향으로 노트 가중치가 정렬됩니다. 단계를 완료할수록 문장이 정밀해집니다.`;
      }
      if (liveAccord) liveAccord.textContent = p.family;
      if (liveDensity) {
        const d = state.density || (state.mood === "deep" ? "Deep" : state.mood === "fresh" ? "Light" : "Balanced");
        liveDensity.textContent = d;
      }
      if (liveBest) {
        const bits = [];
        if (state.situation) bits.push(SIT_LABEL[state.situation]);
        if (state.season) bits.push(SEASON_LABEL[state.season]);
        liveBest.textContent = bits.length ? `Best for · ${bits.join(" · ")}` : "Best for · 계속 선택해 주세요";
      }
    };

    document.querySelectorAll(
      ".finder-options button[data-step], .finder-card-v2[data-step] .option-btn-v2[data-value]"
    ).forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = btn.getAttribute("data-step") || btn.closest(".finder-card-v2")?.getAttribute("data-step");
        const value = btn.getAttribute("data-value");
        if (!step || !value) return;
        state[step] = value;
        setStepButtons(step, value);

        const imgId = `finder-step-img-${step}`;
        const img = document.getElementById(imgId);
        const imgV2 = document.getElementById(`step-img-${step}`);
        const src =
          btn.getAttribute("data-image") ||
          STEP_IMAGE_BY_VALUE[step]?.[value] ||
          "";
        const alt = btn.getAttribute("data-image-alt");
        const targetImg = img || imgV2;
        if (targetImg && src) {
          targetImg.src = src;
          if (alt) targetImg.alt = alt;
        }

        updateProgress();
        updateLive();
        if (feedback) {
          const n = countSteps();
          feedback.textContent =
            n >= 4
              ? "모든 단계가 채워졌습니다. 추천 결과 보기를 눌러 확정하세요."
              : `${n}/4 단계 · 계속 선택하면 신뢰도가 상승합니다.`;
        }
      });
    });

    document.querySelectorAll(".density-chip, .density-node-v2[data-step='density']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-value");
        state.density = value;
        document.querySelectorAll(".density-chip, .density-node-v2[data-step='density']").forEach((b) => {
          const on = b === btn;
          b.setAttribute("aria-pressed", String(on));
          b.setAttribute("aria-checked", String(on));
        });
        const dc = document.getElementById("density-count");
        if (dc) {
          const label =
            btn.querySelector(".density-chip-title, .node-label")?.textContent?.trim() || value || "—";
          dc.textContent = label;
        }
        updateLive();
      });
    });

    document.getElementById("density-reset")?.addEventListener("click", () => {
      state.density = null;
      document.querySelectorAll(".density-chip, .density-node-v2[data-step='density']").forEach((b) => {
        b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-checked", "false");
      });
      const dc = document.getElementById("density-count");
      if (dc) dc.textContent = "Not selected";
      updateLive();
    });

    const applyRecommendation = () => {
      if (!state.scent || !PROFILES[state.scent]) {
        if (feedback) feedback.textContent = "향 계열을 먼저 선택해 주세요.";
        return;
      }

      const p = PROFILES[state.scent];
      const n = countSteps();
      const fit = Math.min(97, 68 + n * 6 + (state.density ? 5 : 0));

      const sectionResult = document.getElementById("section-result");
      if (sectionResult) {
        sectionResult.setAttribute("data-result-state", "ready");
      }

      const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      const img = document.getElementById("result-primary-img");
      if (img) {
        img.src = p.image;
        img.alt = `${p.name} 추천 이미지`;
      }
      setText("result-primary-caption", `${p.name} · 맞춤 추천`);
      setText("result-badge", n >= 4 ? "High confidence match" : "Directional match");
      const fitVal = document.querySelector("#result-fit-score .fit-score-value");
      if (fitVal) fitVal.textContent = `${fit}%`;
      else {
        const fitWrap = document.getElementById("result-fit-score");
        if (fitWrap) fitWrap.textContent = `FIT ${fit}%`;
      }

      setText("result-name", p.name);
      setText("result-density", `Density · ${state.density || (state.mood === "deep" ? "Deep" : "Balanced")}`);
      setText("result-family", p.family);
      setText("result-editorial", p.editorial);
      const why = document.getElementById("result-why-this");
      if (why) {
        why.textContent = `Why this · ${p.family} 축에서 선택값과 노트 적합도가 가장 안정적으로 겹칩니다.`;
      }

      const bf = [];
      if (state.situation) bf.push(SIT_LABEL[state.situation]);
      if (state.season) bf.push(SEASON_LABEL[state.season]);
      if (state.mood) bf.push(MOOD_LABEL[state.mood]);
      setText("result-best-for", bf.length ? `Best for · ${bf.join(" · ")}` : "Best for · 평일–이브닝 폭넓게");

      setText("result-notes", `Key notes · ${p.notes}`);
      setText(
        "result-guidance",
        n >= 4
          ? "4단계가 모두 반영되었습니다. 유사 향과 스토리를 이어서 확인해 보세요."
          : "더 많은 단계를 채우면 유사 향 정렬과 스토리 디테일이 강화됩니다."
      );

      const shopL = document.getElementById("result-shop-link");
      const detL = document.getElementById("result-detail-link");
      [shopL, detL].forEach((a) => {
        if (!(a instanceof HTMLAnchorElement)) return;
        a.classList.remove("is-disabled");
        a.removeAttribute("aria-disabled");
        a.removeAttribute("tabindex");
      });
      if (shopL) shopL.href = `shop.html#collection`;
      if (detL) detL.href = "detail.html";

      setText(
        "note-fit-text",
        `${p.name}의 탑·미들·베이스가 선택한 ${state.scent} 축과 ${fit}% 수준으로 정렬되었습니다.`
      );
      setText("note-fit-meta", `Top · Middle · Base · 가중 ${fit}%`);

      setText(
        "usage-fit-text",
        state.situation
          ? `${SIT_LABEL[state.situation]} 맥락에서 발향 밸런스와 실루엣을 맞췄습니다.`
          : "상황 값이 비어 있어 데일리 기본값으로 해석했습니다."
      );
      setText("usage-fit-meta", state.season ? `Season bias · ${SEASON_LABEL[state.season]}` : "Season bias · Neutral");

      setText(
        "batch-fit-text",
        state.density
          ? `밀도 ${state.density}에 맞춰 소배치 숙성 프로파일을 조정했습니다.`
          : "밀도 미선택 · 배치 일관성 4.7/5 기준으로 표시합니다."
      );
      setText("batch-fit-meta", "Small Batch · Seasonal Response");

      const simGrid = document.getElementById("similar-scents-grid");
      if (simGrid) {
        simGrid.setAttribute("data-state", "ready");
        simGrid.innerHTML = p.similar
          .map(
            (s, i) => `
          <article class="card similar-card">
            <a href="detail.html" class="card-link similar-card-link" aria-label="${s.name} 상세">
              <div class="card-media">
                <span class="rank">ALT 0${i + 1}</span>
                <img src="${s.img}" alt="${s.name}" loading="lazy" decoding="async" />
              </div>
              <div class="card-body">
                <p class="eyebrow">Fit ${s.fit}%</p>
                <h3 class="card-title">${s.name}</h3>
                <p class="card-desc">${s.notes}</p>
                <p class="eyebrow card-meta">Why · 같은 무드 축의 안전한 대안</p>
              </div>
            </a>
          </article>`
          )
          .join("");
      }

      const hint = document.getElementById("similar-empty-hint");
      if (hint) hint.hidden = true;

      setText("story-visual-caption", `Atmosphere · ${p.name}`);
      setText("story-visual-tag", "LIVE");
      const sf = document.getElementById("story-figure-img");
      if (sf) sf.src = p.image;
      setText("story-title", `${p.name}가 남기는 공기`);
      setText(
        "story-atmosphere",
        `${p.editorial} ${state.mood ? `${MOOD_LABEL[state.mood]} 무드가 잔향의 뉘앙스를 조정합니다.` : ""}`
      );
      setText("story-first", `첫 15분 · ${p.notes.split("·")[0]?.trim() || "탑 노트"}의 첫인상`);
      setText("story-dry", `30–120분 · ${p.family} 중심 톤이 피부에 안착`);
      setText("story-best", bf.length ? `Best moment · ${bf.join(", ")}` : "Best moment · 저녁 이후 실내");
      setText("story-lab", "Batch 24W · Hand blended · F. Voutsa sign-off");

      document.getElementById("section-scent-story")?.setAttribute("data-story-state", "ready");

      const finalBadge = document.getElementById("final-scent-badge");
      if (finalBadge) finalBadge.textContent = `Current Direction · ${p.name}`;
      const finalSum = document.getElementById("final-summary");
      if (finalSum) {
        finalSum.innerHTML = `<strong>${p.name}</strong> 방향이 확정되었습니다. Shop에서 동일 계열을 넓히거나 Gift로 이어가세요.`;
      }

      if (feedback) feedback.textContent = "추천이 갱신되었습니다. 아래 근거·유사 향·스토리 순으로 읽어 보세요.";

      const scrollTarget = document.getElementById("section-result");
      if (scrollTarget && window.LL_UI) {
        window.LL_UI.scrollToHash("#section-result", "smooth");
      }
    };

    document.getElementById("recommend-btn")?.addEventListener("click", applyRecommendation);

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      ["scent", "situation", "season", "mood"].forEach((k) => {
        state[k] = null;
        setStepButtons(k, null);
      });
      state.density = null;
      document.querySelectorAll(".density-chip").forEach((b) => {
        b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-checked", "false");
      });
      const dc = document.getElementById("density-count");
      if (dc) dc.textContent = "Not selected";

      ["scent", "situation", "season", "mood"].forEach((step) => {
        const img = document.getElementById(`finder-step-img-${step}`);
        const def = img?.getAttribute("data-default");
        if (img && def) img.src = def;
      });

      updateProgress();
      updateLive();
      if (feedback) feedback.textContent = "선택이 초기화되었습니다. 향 계열부터 다시 시작하세요.";
    });

    document.getElementById("result-share-btn")?.addEventListener("click", async () => {
      const url = `${window.location.href.split("#")[0]}#section-result`;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          if (feedback) feedback.textContent = "결과 링크가 클립보드에 복사되었습니다.";
        } else {
          throw new Error("no clipboard");
        }
      } catch {
        if (feedback) feedback.textContent = `링크: ${url} (직접 복사해 주세요)`;
      }
    });

    document.getElementById("result-save-btn")?.addEventListener("click", () => {
      try {
        localStorage.setItem(
          "lelabo_finder_direction",
          JSON.stringify({ ...state, savedAt: Date.now() })
        );
        if (feedback) feedback.textContent = "이 브라우저에 방향이 저장되었습니다.";
      } catch {
        if (feedback) feedback.textContent = "저장에 실패했습니다.";
      }
    });

    updateProgress();
    updateLive();
  });
})();
