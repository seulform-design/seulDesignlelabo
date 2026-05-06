/**
 * LE LABO · layout-system.js
 * Partials는 same-origin HTTP로 fetch합니다. file://로 열면 헤더·푸터가 주입되지 않을 수 있으니 Live Server 등으로 서빙하세요.
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

  const injectSiteChrome = async () => {
    const wrap = document.getElementById("wrap");
    if (!wrap || wrap.querySelector(".header")) return;

    const scriptEl = document.querySelector('script[src*="layout-system.js"]');
    let partialsBase;
    try {
      partialsBase = scriptEl?.src
        ? new URL("../partials/", scriptEl.src)
        : new URL("./partials/", document.baseURI);
    } catch {
      partialsBase = new URL("./partials/", document.baseURI);
    }

    const chromeUrl = new URL("site-chrome.html", partialsBase).href;
    const footerUrl = new URL("site-footer.html", partialsBase).href;

    let chromeText;
    let footerText;
    try {
      const [resChrome, resFooter] = await Promise.all([
        fetch(chromeUrl, { credentials: "same-origin" }),
        fetch(footerUrl, { credentials: "same-origin" }),
      ]);
      if (!resChrome.ok || !resFooter.ok) throw new Error("partial fetch failed");
      chromeText = await resChrome.text();
      footerText = await resFooter.text();
    } catch (e) {
      console.warn(
        "[LE LABO] Site chrome partials could not load. Serve the site over HTTP (e.g. Live Server), not file://.",
        e
      );
      return;
    }

    const skip = wrap.querySelector(".skip-nav");
    const main = document.getElementById("main-content") ?? wrap.querySelector("main");
    if (!main) return;

    const chromeTpl = document.createElement("template");
    chromeTpl.innerHTML = chromeText.trim();
    const chromeFrag = document.createDocumentFragment();
    while (chromeTpl.content.firstChild) {
      chromeFrag.appendChild(chromeTpl.content.firstChild);
    }
    if (skip && skip.parentNode === wrap) {
      skip.after(chromeFrag);
    } else {
      wrap.prepend(chromeFrag);
    }

    if (!wrap.querySelector("footer.footer")) {
      const footerTpl = document.createElement("template");
      footerTpl.innerHTML = footerText.trim();
      while (footerTpl.content.firstChild) main.after(footerTpl.content.firstChild);
    }
  };

  const markActiveNavForCurrentPage = () => {
    /** `null` = GNB에 해당 라우트 없음 — 거짓 하이라이트 방지 */
    const byBody = {
      "page-shop": "shop.html",
      "page-detail": "shop.html",
      "page-finder": "finder.html",
      "page-ingredient": "ingredient.html",
      "page-journal": "journal.html",
      "page-gift": "gift.html",
      "page-cart": null,
      "page-checkout": null,
      "page-order-complete": null,
      "page-login": null,
    };
    const bodyKey = Object.keys(byBody).find((k) => document.body.classList.contains(k));
    if (!bodyKey) return;

    const targetFile = byBody[bodyKey];
    if (targetFile === null) return;
    const fileFromHref = (href) => {
      try {
        const u = new URL(href, window.location.href);
        let f = u.pathname.split("/").pop() || "";
        if (!f) f = "index.html";
        return f;
      } catch {
        return "";
      }
    };

    const apply = (root) => {
      if (!(root instanceof ParentNode)) return;
      root.querySelectorAll("a").forEach((node) => {
        if (!(node instanceof HTMLAnchorElement)) return;
        node.removeAttribute("aria-current");
        node.classList.remove("is-active");
        if (fileFromHref(node.getAttribute("href") || "") === targetFile) {
          node.setAttribute("aria-current", "page");
          node.classList.add("is-active");
        }
      });
    };

    const gnbList = document.querySelector(".gnb-list");
    if (gnbList) apply(gnbList);
    const megaPrimary = document.querySelector(".mega-primary-list");
    if (megaPrimary) apply(megaPrimary);
  };

  const initFooterNewsletter = () => {
    const form = document.getElementById("footer-news-form");
    const input = document.getElementById("footer-news-input");
    const status = document.getElementById("footer-news-status");
    if (!(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement) || !(status instanceof HTMLElement)) return;
    if (form.dataset.llNewsletterBound === "1") return;
    form.dataset.llNewsletterBound = "1";

    const setStatus = (message, isError) => {
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
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

  ready(async () => {
    await injectSiteChrome();

    markActiveNavForCurrentPage();
    initFooterNewsletter();

    const year = document.getElementById("footer-year");
    if (year) year.textContent = String(new Date().getFullYear());

    const root = document.documentElement;
    const announcementBar = document.getElementById("announcement-bar");
    const announcementClose = document.querySelector(".announcement-close");
    if (announcementBar && announcementClose) {
      announcementClose.addEventListener("click", () => {
        announcementBar.setAttribute("hidden", "");
        root.style.setProperty("--announcement-height", "0px");
      });
    }

    const searchForm = document.getElementById("header-search-form");
    const searchToggle = document.getElementById("search-toggle");
    const searchInput = document.getElementById("global-search");
    if (searchForm && searchToggle) {
      const computeSearchWidth = () => {
        const lastGnb =
          document.querySelector('.gnb a[href="gift.html"]')?.closest(".gnb-item") ||
          document.querySelector(".gnb-item:last-child");
        const minW = 160;
        const maxW = 360;
        const breathe = 16;
        if (lastGnb instanceof HTMLElement) {
          const gapPx = searchToggle.getBoundingClientRect().left - lastGnb.getBoundingClientRect().right - breathe;
          if (gapPx >= minW) return Math.min(gapPx, maxW);
        }
        return Math.min(Math.max(window.innerWidth * 0.5, minW), maxW);
      };

      const setSearchOpen = (open) => {
        searchForm.classList.toggle("is-open", open);
        searchForm.style.width = open ? `${computeSearchWidth()}px` : "";
        searchToggle.setAttribute("aria-expanded", String(open));
        searchToggle.setAttribute("aria-label", open ? "검색 닫기" : "검색 열기");
        if (searchInput) {
          if (open) {
            searchInput.removeAttribute("aria-hidden");
            searchInput.disabled = false;
            searchInput.tabIndex = 0;
            searchInput.focus();
          } else {
            searchInput.setAttribute("aria-hidden", "true");
            searchInput.disabled = true;
            searchInput.tabIndex = -1;
          }
        }
      };

      window.addEventListener("resize", () => {
        if (searchToggle.getAttribute("aria-expanded") === "true") {
          searchForm.style.width = `${computeSearchWidth()}px`;
        }
      });

      searchToggle.addEventListener("click", () => {
        const isOpen = searchToggle.getAttribute("aria-expanded") === "true";
        if (!isOpen) {
          const chromeHeader = document.querySelector(".header");
          if (chromeHeader && chromeHeader.classList.contains("is-menu-open")) {
            document.getElementById("mega-toggle")?.click();
          }
        }
        setSearchOpen(!isOpen);
      });

      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (!searchForm.contains(target) && !searchToggle.contains(target)) {
          setSearchOpen(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setSearchOpen(false);
      });

      setSearchOpen(false);
    }

    const header = document.querySelector(".header");
    const megaToggle = document.getElementById("mega-toggle");
    const megaPanel = document.getElementById("mega-menu-panel");
    const megaBackdrop = document.getElementById("mega-backdrop");
    if (header && megaToggle && megaPanel) {
      const getFirstMegaFocusTarget = () => {
        const primaryBlock = megaPanel.querySelector(".mega-primary");
        const primaryLink = megaPanel.querySelector(".mega-primary-list a");
        if (primaryBlock && primaryLink) {
          const cs = window.getComputedStyle(primaryBlock);
          if (cs.display !== "none") return primaryLink;
        }
        return megaPanel.querySelector(".mega-list a");
      };

      const setMenuOpen = (open) => {
        const wasOpen = header.classList.contains("is-menu-open");
        header.classList.toggle("is-menu-open", open);
        document.documentElement.classList.toggle("is-mega-open", open);
        megaToggle.setAttribute("aria-expanded", String(open));
        megaToggle.setAttribute("aria-label", open ? "메가 메뉴 닫기" : "메가 메뉴 열기");
        megaPanel.setAttribute("aria-hidden", String(!open));
        if (megaBackdrop) megaBackdrop.setAttribute("aria-hidden", String(!open));
        document.body.style.overflow = open ? "hidden" : "";

        if (!open && wasOpen) {
          megaToggle.focus({ preventScroll: true });
        }

        if (open) {
          if (searchToggle && searchForm && searchToggle.getAttribute("aria-expanded") === "true") {
            searchForm.classList.remove("is-open");
            searchForm.style.width = "";
            searchToggle.setAttribute("aria-expanded", "false");
            searchToggle.setAttribute("aria-label", "검색 열기");
            if (searchInput) {
              searchInput.setAttribute("aria-hidden", "true");
              searchInput.disabled = true;
              searchInput.tabIndex = -1;
            }
          }
          window.requestAnimationFrame(() => {
            const link = getFirstMegaFocusTarget();
            if (link instanceof HTMLElement) link.focus({ preventScroll: true });
          });
        }
      };

      megaToggle.addEventListener("click", () => {
        const isOpen = megaToggle.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
      });

      megaBackdrop?.addEventListener("click", () => setMenuOpen(false));

      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (!header.contains(target)) setMenuOpen(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenuOpen(false);
      });

      setMenuOpen(false);
    }

    /* Hero ↔ header horizontal alignment: use shared `--container-padding` on
       `.hero .container` / `.hero .hero-swiper-controls` (reset.css) — no inline nudge. */
  });
})();
