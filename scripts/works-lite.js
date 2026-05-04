(function () {
  const cacheKey = "cache-20260504ac";
  const loaded = new Map();
  let worksCorePromise = null;
  let searchDataPromise = null;
  let papersDataPromise = null;
  let talksDataPromise = null;
  let researchmapDataPromise = null;
  let richSetupDone = false;
  let userScrolled = false;
  const legacyExpositorySlideAnchors = new Set([
    "note-2021topos-zeta-2-3-pdf",
    "note-2022topos-kan-ext-pdf",
    "note-2023topos-species-8-pdf",
    "note-2024topos新歓202405-6-pdf"
  ]);
  const sectionLoaders = {
    papers: loadPapers,
    "notes-preparations": loadNotesPreparations,
    "in-preparation": loadNotesPreparations,
    "talks-slides": loadTalksSlides
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
    if (typeof window.decorateCommonIcons === "function") window.decorateCommonIcons(document.body, { sections: true });
    else if (typeof window.decorateNavIcons === "function") window.decorateNavIcons();
    richSetupDone = true;
  }

  function finishRichRender() {
    setupRichOnce();
    if (typeof applyLanguage === "function") applyLanguage();
    if (typeof window.decorateCommonIcons === "function") window.decorateCommonIcons(document.body, { sections: true });
    else if (typeof window.decorateNavIcons === "function") window.decorateNavIcons();
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

  function loadNotesPreparations() {
    return Promise.all([loadWorksCore(), loadTalksData(), loadPapersData()]).then(() => {
      setupRichOnce();
      if (typeof renderPreparationPapers === "function") renderPreparationPapers();
      if (typeof renderNotes === "function") renderNotes();
      finishRichRender();
      scrollHashTarget();
    });
  }

  function loadTalksSlides() {
    return Promise.all([loadWorksCore(), loadTalksData(), loadResearchmapData()]).then(() => {
      setupRichOnce();
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
    if (hash === "notes-preparations" || hash === "notes" || hash === "notes-list" || hash === "in-preparation" || hash === "preparations" || hash.startsWith("note-")) return loadNotesPreparations;
    if (hash === "talks-slides" || hash === "talks" || hash === "slides" || hash === "slides-list" || hash.startsWith("talk-") || hash.startsWith("slide-")) return loadTalksSlides;
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

  function redirectLegacyExpositorySlideAnchor() {
    if (worksPage !== "notes-preparations") return false;
    const target = hashTarget();
    if (!legacyExpositorySlideAnchors.has(target)) return false;
    location.replace(`../talks-slides/index.html${location.search || ""}${location.hash || ""}`);
    return true;
  }

  function firstPresentSectionLoader() {
    for (const [id, loader] of Object.entries(sectionLoaders)) {
      if (document.getElementById(id)) return loader;
    }
    return null;
  }

  function scheduleSectionFallback(id, loader, delay) {
    if (document.getElementById(id)) setTimeout(loader, delay);
  }

  function setupLazySections() {
    const markUserScrolled = () => {
      if (userScrolled) return;
      userScrolled = true;
      if (!loaderForHash()) firstPresentSectionLoader()?.();
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
      scheduleSectionFallback("papers", loadPapers, 1200);
      scheduleSectionFallback("notes-preparations", loadNotesPreparations, 1800);
      scheduleSectionFallback("talks-slides", loadTalksSlides, 1800);
    }

    document.querySelectorAll("#paper-filter, [data-paper-view]").forEach((node) => {
      node.addEventListener("focus", loadPapers, { once: true });
      node.addEventListener("click", loadPapers, { once: true });
    });

    document.querySelectorAll("#note-filter, #note-language-filter, #note-year-filter, #note-theme-filter").forEach((node) => {
      node.addEventListener("focus", loadNotesPreparations, { once: true });
      node.addEventListener("click", loadNotesPreparations, { once: true });
    });

    document.querySelectorAll("#slide-filter, #talk-filter, #slide-language-filter, #slide-year-filter, #slide-theme-filter, #talk-year-filter, #talk-theme-filter, #talk-slides-filter, #talk-type-filter").forEach((node) => {
      node.addEventListener("focus", loadTalksSlides, { once: true });
      node.addEventListener("click", loadTalksSlides, { once: true });
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

  if (typeof window.setupSiteNav === "function") window.setupSiteNav(document.body);
  if (typeof window.decorateCommonIcons === "function") window.decorateCommonIcons(document.body, { sections: true });
  else if (typeof window.decorateNavIcons === "function") window.decorateNavIcons();
  if (redirectLegacyHash()) return;
  if (redirectLegacyExpositorySlideAnchor()) return;
  setupLazySections();
  afterPageLoad(() => {
    if (document.querySelector("#research-map")) loadSearch();
    if (worksPage === "papers") {
      loadPapers();
      return;
    }
    if (worksPage === "notes-preparations") {
      loadNotesPreparations();
      return;
    }
    if (worksPage === "talks-slides") {
      loadTalksSlides();
      return;
    }
    const loader = loaderForHash();
    if (loader) loader();
  });
})();
