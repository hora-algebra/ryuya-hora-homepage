(function () {
  const fullLoadTargets = new Set(["in-preparation", "notes-preparations", "talks-slides"]);
  let fullLoadPromise = null;

  function script(src, attrs = {}) {
    return new Promise((resolve, reject) => {
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
  }

  function showFullLoadStatus() {
    const root = document.getElementById("research-map");
    if (!root) return;
    root.innerHTML = "";
    const card = document.createElement("article");
    card.className = "works-search-loading";
    card.setAttribute("role", "status");
    card.setAttribute("aria-label", "Loading Works index");
    const dots = document.createElement("div");
    dots.className = "loading-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.append(document.createElement("span"), document.createElement("span"), document.createElement("span"));
    card.append(dots);
    root.append(card);
  }

  function loadFullWorks() {
    if (fullLoadPromise) return fullLoadPromise;
    showFullLoadStatus();
    fullLoadPromise = script("../data/researchmap.generated.js?v=cache-20260503u")
      .then(() => script("../data/overleaf.generated.js?v=cache-20260503u"))
      .then(() => script("../scripts/site.js?v=cache-20260503u", { "data-manual-init": true }))
      .then(() => {
        if (typeof setupLanguage === "function") setupLanguage();
        if (typeof renderWorksPageInitial === "function") renderWorksPageInitial();
        if (typeof setupInteractions === "function") setupInteractions();
        if (typeof applyLanguage === "function") applyLanguage();
      });
    return fullLoadPromise;
  }

  function afterPageLoad(callback) {
    const delayMs = 0;
    if (document.readyState === "complete") {
      setTimeout(callback, delayMs);
      return;
    }
    window.addEventListener("load", () => setTimeout(callback, delayMs), { once: true });
  }

  function hashTarget() {
    return decodeURIComponent(location.hash.slice(1) || "");
  }

  function needsFullLoadForHash(hash = hashTarget()) {
    return fullLoadTargets.has(hash) || Array.from(fullLoadTargets).some((id) => hash.startsWith(`${id}-`));
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

  function setupFullLoadTriggers() {
    document.querySelectorAll("[data-load-works-details], #paper-filter, #note-filter, #slide-filter, #talk-filter, [data-paper-view]").forEach((node) => {
      node.addEventListener("click", loadFullWorks, { once: true });
      node.addEventListener("focus", loadFullWorks, { once: true });
    });

    document.addEventListener("click", (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.getAttribute("href"), location.href);
      if (url.pathname.endsWith("/works/index.html") || url.pathname.endsWith("/works/") || url.pathname === location.pathname) {
        if (needsFullLoadForHash(decodeURIComponent(url.hash.slice(1)))) loadFullWorks();
      }
    });

    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          afterPageLoad(loadFullWorks);
        }
      }, { rootMargin: "520px 0px" });
      fullLoadTargets.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }
  }

  setupMenu();
  setupFullLoadTriggers();
  afterPageLoad(loadFullWorks);
})();
