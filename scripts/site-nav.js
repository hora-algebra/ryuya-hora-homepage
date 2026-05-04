(function () {
  const NAV_CACHE_KEY = "cache-20260504ac";

  const navGroups = [
    {
      key: "profile",
      label: "Profile",
      path: "profile/index.html",
      children: [
        ["timeline", "Timeline", "profile/index.html#timeline"],
        ["current-positions", "Current Positions", "profile/index.html#current-positions"],
        ["awards", "Awards", "profile/index.html#awards"],
        ["teaching-outreach", "Teaching", "profile/index.html#teaching-outreach"],
        ["academic-background", "Background", "profile/index.html#academic-background"],
        ["personal", "Personal", "profile/index.html#personal"],
        ["explore", "Pages", "profile/index.html#explore"]
      ]
    },
    {
      key: "works",
      label: "Works",
      path: "works/index.html",
      children: [
        ["work-pages", "Browse", "works/index.html#work-pages"],
        ["work-search", "Search", "works/index.html#work-search"],
        ["papers", "Papers", "works/papers/index.html"],
        ["notes-preparations", "Notes and Preparations", "works/notes-preparations/index.html"],
        ["talks-slides", "Talks and Slides", "works/talks-slides/index.html"]
      ]
    },
    {
      key: "activities",
      label: "Activities",
      path: "activities/index.html",
      children: [
        ["upcoming", "Upcoming", "activities/index.html#upcoming"],
        ["visit-map", "Visit Map", "activities/index.html#visit-map"],
        ["yearly-records", "Yearly Records", "activities/index.html#yearly-records"]
      ]
    },
    {
      key: "others",
      label: "Others",
      path: "others/index.html",
      children: [
        ["links", "Links", "others/index.html#links"],
        ["categories-in-tokyo", "Categories in Tokyo", "others/index.html#categories-in-tokyo"],
        ["web-apps", "Web Apps", "others/index.html#web-apps"]
      ]
    }
  ];

  function depthPrefix() {
    const depth = Number.parseInt(document.body?.dataset.depth || "0", 10);
    return Number.isFinite(depth) && depth > 0 ? "../".repeat(depth) : "";
  }

  function localHref(path) {
    if (!path) return "";
    if (/^(https?:|mailto:|#)/.test(path)) return path;
    return `${depthPrefix()}${path}`;
  }

  function currentGroupKey() {
    const page = document.body?.dataset.page || "";
    if (page === "home") return "profile";
    if (["profile", "works", "activities", "others"].includes(page)) return page;
    return "";
  }

  function currentItemKey() {
    const page = document.body?.dataset.page || "";
    const worksPage = document.body?.dataset.worksPage || "";
    const hash = decodeURIComponent(location.hash || "").replace(/^#/, "");
    if (page === "works") {
      if (worksPage && worksPage !== "index") return worksPage;
      if (hash === "work-pages") return "work-pages";
      if (hash === "work-search") return "work-search";
      if (!hash) return "work-pages";
      return "";
    }
    if (hash) return hash;
    return "";
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function navAnchor(label, path, className = "") {
    const anchor = el("a", className, label);
    anchor.href = localHref(path);
    return anchor;
  }

  function renderSiteNav(root = document.body) {
    const nav = root?.querySelector?.(".site-nav");
    if (!nav) return null;

    const activeGroup = currentGroupKey();
    const activeItem = currentItemKey();
    nav.replaceChildren();
    nav.dataset.siteNavRendered = NAV_CACHE_KEY;

    navGroups.forEach((group) => {
      const groupNode = el("div", "nav-group");
      if (group.key === activeGroup) groupNode.classList.add("is-active");

      const groupLink = navAnchor(group.label, group.path, "nav-group-label");
      if (group.key === activeGroup) groupLink.classList.add("is-active");
      groupNode.append(groupLink);

      const submenu = el("div", "nav-submenu");
      group.children.forEach(([key, label, path]) => {
        const child = navAnchor(label, path);
        if (key === activeItem) child.classList.add("is-active");
        submenu.append(child);
      });
      groupNode.append(submenu);
      nav.append(groupNode);
    });

    const search = navAnchor("", "search/index.html", "nav-search");
    search.dataset.siteSearchLink = "";
    search.setAttribute("aria-label", "Search");
    if (document.body?.dataset.page === "search") search.classList.add("is-active");
    const searchIcon = el("span", "search-icon");
    searchIcon.setAttribute("aria-hidden", "true");
    search.append(searchIcon, el("span", "sr-only", "Search"));
    nav.append(search);

    if (typeof window.decorateNavIcons === "function") window.decorateNavIcons(nav);
    return nav;
  }

  function setupSiteNav(root = document.body) {
    const nav = root?.querySelector?.(".site-nav");
    const button = root?.querySelector?.(".menu-button");
    if (!button || !nav) return;
    if (button.dataset.siteNavReady) {
      if (nav.dataset.siteNavRendered !== NAV_CACHE_KEY) renderSiteNav(root);
      return;
    }

    renderSiteNav(root);

    if (!nav.id) nav.id = "site-navigation";
    button.dataset.siteNavReady = "true";
    button.setAttribute("aria-controls", nav.id);

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    };
    const close = () => setOpen(false);

    button.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (event) => {
      if (event.target.closest?.("a[href]")) close();
    });
    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (event.target.closest?.(".site-header")) return;
      close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    window.addEventListener("resize", close, { passive: true });
    window.addEventListener("orientationchange", close, { passive: true });
    window.addEventListener("hashchange", () => {
      renderSiteNav(root);
      close();
    });
  }

  function run() {
    setupSiteNav(document.body);
  }

  window.renderSiteNav = renderSiteNav;
  window.setupSiteNav = setupSiteNav;
  window.siteNavCacheKey = NAV_CACHE_KEY;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
