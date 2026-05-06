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
    const sticky = document.getElementById("sticky-buy");
    const stickyClose = document.getElementById("sticky-close");
    const stickySave = document.getElementById("sticky-save");

    if (stickyClose && sticky) {
      stickyClose.addEventListener("click", () => {
        sticky.setAttribute("data-visible", "false");
      });
    }

    if (stickySave) {
      stickySave.addEventListener("click", () => {
        const pressed = stickySave.getAttribute("aria-pressed") === "true";
        stickySave.setAttribute("aria-pressed", String(!pressed));
        stickySave.textContent = pressed ? "저장" : "저장됨";
      });
    }

    const giftInput = document.getElementById("gift-label-input");
    const giftPreview = document.getElementById("gift-preview");
    const giftCounter = document.getElementById("gift-input-counter");
    if (giftInput && giftPreview && giftCounter) {
      const updateGift = () => {
        const value = giftInput.value.trim();
        giftPreview.textContent = value || "YOUR NAME";
        const strong = giftCounter.querySelector("strong");
        if (strong) strong.textContent = String(value.length);
      };
      giftInput.addEventListener("input", updateGift);
      updateGift();
    }

    const setupNewsletterForm = (formId, inputId, statusId) => {
      const form = document.getElementById(formId);
      const input = document.getElementById(inputId);
      const status = document.getElementById(statusId);
      if (!(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement) || !(status instanceof HTMLElement)) return;

      const setStatus = (message, isError) => {
        status.textContent = message;
        status.classList.toggle("is-error", isError);
      };

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input.value.trim();
        const valid = input.checkValidity();

        if (!value || !valid) {
          input.setAttribute("aria-invalid", "true");
          setStatus("유효한 이메일 주소를 입력해 주세요.", true);
          input.focus();
          return;
        }

        input.removeAttribute("aria-invalid");
        setStatus("구독이 완료되었습니다. 첫 배치 알림을 보내드릴게요.", false);
        form.reset();
      });

      input.addEventListener("input", () => {
        if (input.hasAttribute("aria-invalid")) input.removeAttribute("aria-invalid");
        if (status.textContent) setStatus("", false);
      });
    };

    setupNewsletterForm("cta-newsletter-form", "cta-email", "cta-newsletter-status");

    const initFinderExperience = () => {
      const steps = ["scent", "situation", "season", "mood"];
      const chipButtons = Array.from(document.querySelectorAll(".filter-panel .chip"));
      if (chipButtons.length === 0) return;

      const state = { scent: "", situation: "", season: "", mood: "" };
      const finderPanel = document.querySelector(".finder-panel");
      const progressMeter = document.getElementById("finder-progress");
      const progressBar = document.querySelector(".finder-progress-bar");
      const progressFill = progressBar?.querySelector("span");
      const progressHint = document.getElementById("finder-progress-hint");
      const stepIndicators = Array.from(document.querySelectorAll(".finder-progress-steps li"));
      const finderStepCards = Array.from(document.querySelectorAll(".finder-step"));
      const filterGroups = Array.from(document.querySelectorAll(".filter-panel .filter-group"));
      const resetBtn = document.getElementById("reset-btn");
      const filterResetBtn = document.getElementById("filter-reset-btn");
      const recommendBtn = document.getElementById("recommend-btn");
      const resultList = document.getElementById("finder-result-list");
      const whyFit = document.getElementById("finder-why-fit");
      const whyFitCopy = document.getElementById("finder-why-fit-copy");
      const whyFitPoints = document.getElementById("finder-why-fit-points");
      const finderStates = {
        empty: document.querySelector('[data-ui="empty"]'),
        loading: document.querySelector('[data-ui="loading"]'),
        error: document.querySelector('[data-ui="error"]'),
      };
      const comparisonState = { left: null, right: null, swapped: false };

      const AXIS_KEYS = ["density", "longevity", "sillage", "warmth", "sweetness", "freshness"];

      const catalog = [
        { name: "Santal 33", scent: "woody", situation: "night", season: "winter", mood: "deep", price: "₩210,000", image: "./images/common/santal33.png", desc: "드라이 우디 중심의 시그니처 무드", note: 91, usage: 84, batch: 86, tag: "우디 · 깊이감 · 따뜻함", meta: "나이트 · 겨울", axes: { density: 8, longevity: 8, sillage: 7, warmth: 9, sweetness: 2, freshness: 2 } },
        { name: "Vetiver 46", scent: "smoky", situation: "night", season: "fall", mood: "deep", price: "₩260,000", image: "./images/common/vetver46.png", desc: "스모키·레더 잔향이 길게 남는 타입", note: 88, usage: 80, batch: 83, tag: "스모키 · 다크 · 깊이감", meta: "나이트 · 가을", axes: { density: 8, longevity: 9, sillage: 6, warmth: 8, sweetness: 2, freshness: 3 } },
        { name: "Rose 31", scent: "floral", situation: "daily", season: "spring", mood: "calm", price: "₩190,000", image: "./images/common/rose31.png", desc: "플로럴과 스파이스 균형이 좋은 데일리", note: 86, usage: 89, batch: 82, tag: "플로럴 · 부드러움 · 차분함", meta: "데일리 · 봄", axes: { density: 5, longevity: 6, sillage: 5, warmth: 5, sweetness: 8, freshness: 4 } },
        { name: "Another 13", scent: "citrus", situation: "office", season: "summer", mood: "fresh", price: "₩180,000", image: "./images/common/an13.png", desc: "깨끗한 머스크 기반의 라이트 무드", note: 82, usage: 87, batch: 80, tag: "머스크 · 상쾌함 · 클린", meta: "오피스 · 여름", axes: { density: 4, longevity: 5, sillage: 4, warmth: 3, sweetness: 3, freshness: 9 } },
        { name: "Bergamote 22", scent: "citrus", situation: "daily", season: "summer", mood: "fresh", price: "₩220,000", image: "./images/common/bergamote22.png", desc: "시트러스 중심의 생기 있는 톤", note: 84, usage: 85, batch: 81, tag: "시트러스 · 생동감 · 상쾌함", meta: "데일리 · 여름", axes: { density: 4, longevity: 5, sillage: 6, warmth: 3, sweetness: 4, freshness: 9 } },
        { name: "Neroli 36", scent: "floral", situation: "date", season: "spring", mood: "warm", price: "₩230,000", image: "./images/common/neroli36.png", desc: "은은한 플로럴과 따뜻한 잔향", note: 80, usage: 82, batch: 79, tag: "플로럴 · 따뜻함 · 라이트", meta: "데이트 · 봄", axes: { density: 5, longevity: 5, sillage: 5, warmth: 6, sweetness: 6, freshness: 5 } },
      ];

      const rankProducts = () => {
        const matchScore = (item) => {
          let score = 62;
          steps.forEach((step) => {
            if (state[step] && item[step] === state[step]) score += 9;
          });
          return Math.min(score, 95);
        };
        return [...catalog]
          .map((item) => ({ ...item, score: matchScore(item) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
      };

      const setFinderUi = (mode) => {
        if (!(finderPanel instanceof HTMLElement)) return;
        finderPanel.setAttribute("data-state", mode);
        Object.values(finderStates).forEach((node) => {
          if (node instanceof HTMLElement) node.hidden = true;
        });
        if (resultList instanceof HTMLElement) resultList.hidden = true;
        if (whyFit instanceof HTMLElement) whyFit.hidden = true;

        if (mode === "loading" && finderStates.loading instanceof HTMLElement) finderStates.loading.hidden = false;
        if (mode === "error" && finderStates.error instanceof HTMLElement) finderStates.error.hidden = false;
        if (mode === "result" && resultList instanceof HTMLElement) {
          resultList.hidden = false;
          if (whyFit instanceof HTMLElement) whyFit.hidden = false;
        }
      };

      const updateProgress = () => {
        const done = steps.filter((step) => Boolean(state[step])).length;
        if (progressMeter) progressMeter.textContent = `${done} / 4 단계 선택`;
        if (progressBar) {
          progressBar.setAttribute("aria-valuenow", String(done));
          progressBar.setAttribute("aria-valuemin", "0");
          progressBar.setAttribute("aria-valuemax", "4");
          progressBar.setAttribute("aria-valuetext", `${done}개 단계 선택됨`);
          progressBar.setAttribute("aria-label", "향 추천 선택 단계 진행률");
        }
        if (progressFill instanceof HTMLElement) progressFill.style.width = `${(done / 4) * 100}%`;

        stepIndicators.forEach((node, index) => {
          if (!(node instanceof HTMLElement)) return;
          node.classList.toggle("is-done", index < done);
        });

        finderStepCards.forEach((card) => {
          if (!(card instanceof HTMLElement)) return;
          const stepKey = card.getAttribute("data-finder-step");
          if (!stepKey) return;
          card.classList.toggle("is-done", Boolean(state[stepKey]));
        });

        filterGroups.forEach((group, index) => {
          if (!(group instanceof HTMLElement)) return;
          group.classList.toggle("is-done", Boolean(state[steps[index]]));
        });

        const nextStep = steps.find((step) => !state[step]);
        const stepLabel = { scent: "향 계열", situation: "사용 맥락", season: "계절감", mood: "무드 톤" };
        if (progressHint) progressHint.textContent = nextStep ? `${stepLabel[nextStep]} 항목을 선택해주세요.` : "모든 선택이 완료되었습니다. 추천 결과를 확인해보세요.";
      };

      const updateReasoning = (top, second) => {
        const noteFill = document.querySelector('[data-reason="01"] .why-score-fill');
        const usageFill = document.querySelector('[data-reason="02"] .why-score-fill');
        const batchFill = document.querySelector('[data-reason="03"] .why-score-fill');
        const noteValue = document.querySelector('[data-reason="01"] .why-score-value');
        const usageValue = document.querySelector('[data-reason="02"] .why-score-value');
        const batchValue = document.querySelector('[data-reason="03"] .why-score-value');
        const noteWrap = document.querySelector('[data-reason="01"] .why-score');
        const usageWrap = document.querySelector('[data-reason="02"] .why-score');
        const batchWrap = document.querySelector('[data-reason="03"] .why-score');
        const confidenceValue = document.getElementById("ledger-confidence-value");
        const confidenceHint = document.getElementById("ledger-confidence-hint");
        const confidenceBox = document.querySelector(".ledger-confidence");

        const note = top.note;
        const usage = top.usage;
        const batch = top.batch;
        const confidence = Math.round(note * 0.4 + usage * 0.3 + batch * 0.3);

        if (noteFill instanceof HTMLElement) noteFill.style.setProperty("--score", `${note}%`);
        if (usageFill instanceof HTMLElement) usageFill.style.setProperty("--score", `${usage}%`);
        if (batchFill instanceof HTMLElement) batchFill.style.setProperty("--score", `${batch}%`);
        if (noteValue instanceof HTMLElement) noteValue.innerHTML = `${note}<small>/100</small>`;
        if (usageValue instanceof HTMLElement) usageValue.innerHTML = `${usage}<small>/100</small>`;
        if (batchValue instanceof HTMLElement) batchValue.innerHTML = `${batch}<small>/100</small>`;
        if (noteWrap instanceof HTMLElement) noteWrap.setAttribute("aria-label", `노트 적합 점수 ${note}%`);
        if (usageWrap instanceof HTMLElement) usageWrap.setAttribute("aria-label", `사용 맥락 점수 ${usage}%`);
        if (batchWrap instanceof HTMLElement) batchWrap.setAttribute("aria-label", `배치 안정성 점수 ${batch}%`);
        if (confidenceValue) confidenceValue.textContent = String(confidence);
        if (confidenceHint) confidenceHint.textContent = `${top.name} 추천 신뢰도 ${confidence}% · 대안 ${second.name} 대비 우세`;
        if (confidenceBox instanceof HTMLElement) confidenceBox.setAttribute("data-state", "active");
      };

      const updateCompareAxesPanel = (left, right) => {
        const items = document.querySelectorAll("#comparison .compare-axis-list > li");
        if (!items.length || !left?.axes || !right?.axes) return;

        let leftWins = 0;
        let rightWins = 0;
        items.forEach((li, i) => {
          const key = AXIS_KEYS[i];
          if (!key) return;
          const lv = left.axes[key];
          const rv = right.axes[key];
          const leftBar = li.querySelector(".compare-axis-bar-left > span");
          const rightBar = li.querySelector(".compare-axis-bar-right > span");
          const toPct = (v) => `${Math.min(100, Math.max(8, (Number(v) / 10) * 100))}%`;
          if (leftBar instanceof HTMLElement) leftBar.style.setProperty("--w", toPct(lv));
          if (rightBar instanceof HTMLElement) rightBar.style.setProperty("--w", toPct(rv));
          li.classList.remove("is-left-win", "is-right-win");
          if (lv > rv) {
            li.classList.add("is-left-win");
            leftWins += 1;
          } else if (rv > lv) {
            li.classList.add("is-right-win");
            rightWins += 1;
          } else {
            li.classList.add("is-left-win");
            leftWins += 1;
          }
        });

        const rows = document.querySelectorAll("#comparison .compare-axes-summary-row");
        const rowPick = rows[0];
        const rowAlt = rows[1];
        if (rowPick) {
          rowPick.classList.toggle("is-left-win", leftWins > rightWins);
          const scoreEl = rowPick.querySelector(".compare-axes-summary-score");
          if (scoreEl) scoreEl.textContent = `${leftWins} / 6`;
        }
        if (rowAlt) {
          rowAlt.classList.toggle("is-left-win", rightWins > leftWins);
          const scoreEl = rowAlt.querySelector(".compare-axes-summary-score");
          if (scoreEl) scoreEl.textContent = `${rightWins} / 6`;
        }
      };

      const updateComparison = (left, right) => {
        const setText = (id, value) => {
          const node = document.getElementById(id);
          if (node) node.textContent = value;
        };
        const leftImg = document.querySelector('.compare-card[data-side="left"] img');
        const rightImg = document.querySelector('.compare-card[data-side="right"] img');
        setText("compare-left-title", left.name);
        setText("compare-left-desc", left.tag);
        setText("compare-left-meta", left.meta);
        setText("compare-right-title", right.name);
        setText("compare-right-desc", right.tag);
        setText("compare-right-meta", right.meta);
        setText("compare-axes-left-name", left.name);
        setText("compare-axes-right-name", right.name);
        if (leftImg instanceof HTMLImageElement) {
          leftImg.src = left.image;
          leftImg.alt = `${left.name} 비교 이미지`;
        }
        if (rightImg instanceof HTMLImageElement) {
          rightImg.src = right.image;
          rightImg.alt = `${right.name} 비교 이미지`;
        }
        updateCompareAxesPanel(left, right);
      };

      const syncComparisonByState = () => {
        if (!comparisonState.left || !comparisonState.right) return;
        const left = comparisonState.swapped ? comparisonState.right : comparisonState.left;
        const right = comparisonState.swapped ? comparisonState.left : comparisonState.right;
        updateComparison(left, right);
      };

      const updateSticky = (product) => {
        const stickyProduct = document.getElementById("sticky-product");
        const stickyPrice = document.getElementById("sticky-price");
        if (stickyProduct) stickyProduct.textContent = product.name;
        const starBase = product.score != null ? product.score : product.note;
        if (stickyPrice) stickyPrice.textContent = `${product.price} · ★ ${(starBase / 20).toFixed(1)}`;
      };

      const renderResults = (products) => {
        if (!(resultList instanceof HTMLElement)) return;
        resultList.innerHTML = products
          .map((item) => (
            `<article class="product-card">
              <div class="card-media">
                <img src="${item.image}" alt="${item.name} 추천 이미지" loading="lazy">
              </div>
              <div class="card-body">
                <p class="card-meta card-meta-tag">${item.tag}</p>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-desc">${item.desc}</p>
                <p class="card-meta card-meta-foot" aria-label="가격 및 매칭 점수">
                  <span class="card-price">${item.price}</span>
                  <span class="card-match">MATCH ${item.score}%</span>
                </p>
                <div class="card-action">
                  <a href="detail.html" class="btn btn-secondary">상세 보기</a>
                </div>
              </div>
            </article>`
          ))
          .join("");

        const primary = products[0];
        if (primary && whyFitCopy instanceof HTMLElement) {
          whyFitCopy.textContent = `${primary.name}. 선택한 향·상황·계절·무드와 가장 높은 일치율을 보입니다. 첫 분사부터 잔향까지 무드가 안정적으로 이어집니다.`;
        }
        if (primary && whyFitPoints instanceof HTMLElement) {
          const points = [
            `노트 적합도 ${primary.note}%: 현재 취향 축과 향조가 가장 유사합니다.`,
            `사용 맥락 ${primary.usage}%: 선택한 상황에서 확산과 지속이 안정적입니다.`,
            `배치 안정성 ${primary.batch}%: 계절/무드 조건에서 향 편차가 낮습니다.`,
          ];
          whyFitPoints.innerHTML = points.map((item) => `<li>${item}</li>`).join("");
        }
      };

      const applyRecommendation = () => {
        const selectedCount = steps.filter((step) => Boolean(state[step])).length;
        if (selectedCount < 4) {
          setFinderUi("error");
          return;
        }
        setFinderUi("loading");
        window.setTimeout(() => {
          const ranked = rankProducts();
          if (ranked.length < 2) {
            setFinderUi("error");
            return;
          }
          renderResults(ranked);
          updateReasoning(ranked[0], ranked[1]);
          comparisonState.left = ranked[0];
          comparisonState.right = ranked[1];
          comparisonState.swapped = false;
          syncComparisonByState();
          updateSticky(ranked[0]);
          setFinderUi("result");
        }, 700);
      };

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

      const applyStepImage = (step, value) => {
        const img = document.getElementById(`finder-step-img-${step}`);
        if (!(img instanceof HTMLImageElement)) return;
        const next = value ? STEP_IMAGE_BY_VALUE[step]?.[value] : img.dataset.default;
        if (next && img.getAttribute("src") !== next) img.setAttribute("src", next);
      };

      chipButtons.forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          const step = button.dataset.filterStep;
          const value = button.dataset.filterValue;
          if (!step || !value) return;

          chipButtons.forEach((chip) => {
            if (!(chip instanceof HTMLButtonElement)) return;
            if (chip.dataset.filterStep === step) chip.setAttribute("aria-pressed", "false");
          });

          state[step] = value;
          button.setAttribute("aria-pressed", "true");
          applyStepImage(step, value);
          if (finderPanel instanceof HTMLElement) finderPanel.setAttribute("data-state", "empty");
          updateProgress();
        });
      });

      const resetState = () => {
        steps.forEach((step) => { state[step] = ""; });
        chipButtons.forEach((button) => {
          if (button instanceof HTMLButtonElement) button.setAttribute("aria-pressed", "false");
        });
        if (resultList instanceof HTMLElement) resultList.innerHTML = "";
        setFinderUi("empty");
        updateProgress();
      };

      const resetAll = () => {
        resetState();
        steps.forEach((step) => applyStepImage(step, ""));
      };

      if (recommendBtn instanceof HTMLButtonElement) recommendBtn.addEventListener("click", applyRecommendation);
      if (resetBtn instanceof HTMLButtonElement) resetBtn.addEventListener("click", resetAll);
      if (filterResetBtn instanceof HTMLButtonElement) filterResetBtn.addEventListener("click", resetAll);

      const swapCompare = document.getElementById("swap-compare");
      if (swapCompare instanceof HTMLButtonElement) {
        swapCompare.addEventListener("click", () => {
          if (!comparisonState.left || !comparisonState.right) return;
          comparisonState.swapped = !comparisonState.swapped;
          syncComparisonByState();
        });
      }

      const setLeftCurrent = document.getElementById("set-left-current");
      if (setLeftCurrent instanceof HTMLButtonElement) {
        setLeftCurrent.addEventListener("click", () => {
          const current = comparisonState.swapped ? comparisonState.right : comparisonState.left;
          if (!current) return;
          updateSticky(current);
          const stickyNode = document.getElementById("sticky-buy");
          if (stickyNode) stickyNode.setAttribute("data-visible", "true");
        });
      }

      const seedComparisonFromPage = () => {
        if (!document.getElementById("comparison")) return;
        const lt = document.getElementById("compare-left-title")?.textContent?.trim();
        const rt = document.getElementById("compare-right-title")?.textContent?.trim();
        const byName = (name) => catalog.find((p) => p.name === name);
        let left = lt ? byName(lt) : null;
        let right = rt ? byName(rt) : null;
        if (!left || !right) {
          left = catalog[0];
          right = catalog[2];
        }
        comparisonState.left = left;
        comparisonState.right = right;
        comparisonState.swapped = false;
        syncComparisonByState();
      };

      resetState();
      seedComparisonFromPage();
    };

    initFinderExperience();
  });
})();
