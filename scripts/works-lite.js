(function () {
  const cacheKey = "cache-20260504s";
  const loaded = new Map();
  let worksCorePromise = null;
  let searchDataPromise = null;
  let papersDataPromise = null;
  let talksDataPromise = null;
  let researchmapDataPromise = null;
  let richSetupDone = false;
  let userScrolled = false;
  const sectionLoaders = {
    papers: loadPapers,
    "notes-preparations": loadTalks,
    "in-preparation": loadTalks,
    "talks-slides": loadTalks
  };
  const worksPage = document.body?.dataset.worksPage || "index";

  function pathPrefix() {
    const depth = Number.parseInt(document.body?.dataset.depth || "0", 10);
    return Number.isFinite(depth) && depth > 0 ? "../".repeat(depth) : "";
  }

  function assetPath(path) {
    return `${pathPrefix()}${path}`;
  }

  function script(src, attrs = {}) {
    if (loaded.has(src)) return loaded.get(src);
    const promise = new Promise((resolve, reject) => {
      const node = document.createElement("script");
      node.src = src;
      node.defer = true;
      Object.entries(attrs).forEach(([key, value]) => {
        if (value === true) node.setAttribute(key, "");
        else node.setAttribute(key, value);
      });
      node.addEventListener("load", resolve, { once: true });
      node.addEventListener("error", reject, { once: true });
      document.body.append(node);
    });
    loaded.set(src, promise);
    return promise;
  }

  function loadWorksCore() {
    if (worksCorePromise) return worksCorePromise;
    worksCorePromise = script(`${assetPath("scripts/works-page.js")}?v=${cacheKey}`);
    return worksCorePromise;
  }

  function loadSearchData() {
    if (searchDataPromise) return searchDataPromise;
    searchDataPromise = script(`${assetPath("data/works-search.generated.js")}?v=${cacheKey}`);
    return searchDataPromise;
  }

  function loadPapersData() {
    if (papersDataPromise) return papersDataPromise;
    papersDataPromise = script(`${assetPath("data/works-papers.generated.js")}?v=${cacheKey}`);
    return papersDataPromise;
  }

  function loadTalksData() {
    if (talksDataPromise) return talksDataPromise;
    talksDataPromise = script(`${assetPath("data/works-talks.generated.js")}?v=${cacheKey}`);
    return talksDataPromise;
  }

  function loadResearchmapData() {
    if (researchmapDataPromise) return researchmapDataPromise;
    researchmapDataPromise = script(`${assetPath("data/researchmap.generated.js")}?v=${cacheKey}`);
    return researchmapDataPromise;
  }

  function setupRichOnce() {
    if (richSetupDone) return;
    if (typeof setupLanguage === "function") setupLanguage();
    if (typeof setupInteractions === "function") setupInteractions();
    if (typeof window.decorateNavIcons === "function") window.decorateNavIcons();
    richSetupDone = true;
  }

  function finishRichRender() {
    setupRichOnce();
    if (typeof applyLanguage === "function") applyLanguage();
    if (typeof window.decorateNavIcons === "function") window.decorateNavIcons();
  }

  function loadSearch() {
    return Promise.all([loadWorksCore(), loadSearchData(), loadTalksData()]).then(() => {
      setupRichOnce();
      if (typeof renderResearchMap === "function") renderResearchMap();
      finishRichRender();
    });
  }

  function loadPapers() {
    return Promise.all([loadWorksCore(), loadPapersData(), loadTalksData()]).then(() => {
      setupRichOnce();
      document.body.dataset.worksPapersFull = "true";
      if (typeof renderPapers === "function") renderPapers();
      finishRichRender();
      scrollHashTarget();
    });
  }

  function loadTalks() {
    return Promise.all([loadWorksCore(), loadTalksData(), loadPapersData(), loadResearchmapData()]).then(() => {
      setupRichOnce();
      if (typeof renderPreparationPapers === "function") renderPreparationPapers();
      if (typeof renderNotes === "function") renderNotes();
      if (typeof renderResearchmapPresentations === "function") renderResearchmapPresentations();
      if (typeof renderSlides === "function") renderSlides();
      finishRichRender();
      scrollHashTarget();
    });
  }

  function afterPageLoad(callback) {
    if (document.readyState === "complete") {
      setTimeout(callback, 0);
      return;
    }
    window.addEventListener("load", () => setTimeout(callback, 0), { once: true });
  }

  function setupMenu() {
    const button = document.querySelector(".menu-button");
    const nav = document.querySelector(".site-nav");
    if (!button || !nav) return;
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
  }

  function hashTarget(hash = location.hash) {
    return decodeURIComponent(String(hash || "").replace(/^#/, ""));
  }

  function hashElementId(hash = hashTarget()) {
    if (hash === "notes") return "notes-list";
    if (hash === "slides" || hash === "slides-list") return "talks-slides";
    if (hash === "talks") return "talks-slides";
    if (hash === "preparations") return "in-preparation";
    return hash;
  }

  function scrollHashTarget() {
    const id = hashElementId();
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));
    schedule(() => schedule(() => target.scrollIntoView({ block: "start" })));
  }

  function loaderForHash(hash = hashTarget()) {
    if (hash === "papers" || hash.startsWith("paper-")) return loadPapers;
    if (hash === "notes-preparations" || hash === "notes" || hash === "notes-list" || hash === "in-preparation" || hash === "preparations" || hash.startsWith("note-")) return loadTalks;
    if (hash === "talks-slides" || hash === "talks" || hash === "slides" || hash === "slides-list" || hash.startsWith("talk-") || hash.startsWith("slide-")) return loadTalks;
    return null;
  }

  function pageForHash(hash = hashTarget()) {
    if (hash === "papers" || hash.startsWith("paper-")) return "papers";
    if (hash === "notes-preparations" || hash === "notes" || hash === "notes-list" || hash === "in-preparation" || hash === "preparations" || hash.startsWith("note-")) return "notes-preparations";
    if (hash === "talks-slides" || hash === "talks" || hash === "slides" || hash === "slides-list" || hash.startsWith("talk-") || hash.startsWith("slide-")) return "talks-slides";
    return "";
  }

  function redirectLegacyHash() {
    if (worksPage !== "index") return false;
    const targetPage = pageForHash();
    if (!targetPage) return false;
    location.replace(`${targetPage}/index.html${location.search || ""}${location.hash || ""}`);
    return true;
  }

  function setupLazySections() {
    const markUserScrolled = () => {
      if (userScrolled) return;
      userScrolled = true;
      if (!loaderForHash()) loadPapers();
    };
    window.addEventListener("wheel", markUserScrolled, { passive: true, once: true });
    window.addEventListener("touchmove", markUserScrolled, { passive: true, once: true });
    window.addEventListener("keydown", (event) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) markUserScrolled();
    }, { once: true });

    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const loader = sectionLoaders[entry.target.id];
          if (!loader) return;
          const activeHashLoader = loaderForHash();
          if (!userScrolled && activeHashLoader !== loader) return;
          if (loader) loader();
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "120px 0px" });
      Object.keys(sectionLoaders).forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    } else {
      setTimeout(loadPapers, 1200);
      setTimeout(loadTalks, 1800);
    }

    document.querySelectorAll("#paper-filter, [data-paper-view]").forEach((node) => {
      node.addEventListener("focus", loadPapers, { once: true });
      node.addEventListener("click", loadPapers, { once: true });
    });

    document.querySelectorAll("#note-filter, #slide-filter, #talk-filter, #note-language-filter, #note-year-filter, #note-theme-filter, #slide-language-filter, #slide-year-filter, #slide-theme-filter, #talk-year-filter, #talk-theme-filter, #talk-slides-filter").forEach((node) => {
      node.addEventListener("focus", loadTalks, { once: true });
      node.addEventListener("click", loadTalks, { once: true });
    });

    document.addEventListener("click", (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.getAttribute("href"), location.href);
      const loader = loaderForHash(url.hash);
      if (loader) loader();
    });

    window.addEventListener("hashchange", () => {
      const loader = loaderForHash();
      if (loader) loader();
    });
  }

  setupMenu();
  if (typeof window.decorateNavIcons === "function") window.decorateNavIcons();
  if (redirectLegacyHash()) return;
  setupLazySections();
  afterPageLoad(() => {
    if (document.querySelector("#research-map")) loadSearch();
    if (worksPage === "papers") {
      loadPapers();
      return;
    }
    if (worksPage === "notes-preparations" || worksPage === "talks-slides") {
      loadTalks();
      return;
    }
    const loader = loaderForHash();
    if (loader) loader();
  });
})();
