(function () {
  function normalizedText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function simplified(value) {
    return normalizedText(value).toLowerCase();
  }

  function svgEl(tag, attrs = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function navIconKey(label = "", href = "") {
    const text = simplified(label);
    const url = String(href || "").toLowerCase();
    if (text.includes("profile") || text.includes("プロフィール") || text.includes("概要")) return "profile";
    if (text.includes("current position") || text.includes("past affiliation") || text.includes("affiliation")) return "building";
    if (text === "background" || text.includes("academic background") || text.includes("teaching") || text.includes("outreach") || url.includes("#academic-background")) return "education";
    if (text.includes("award")) return "award";
    if (text.includes("notes") || text.includes("ノート") || url.includes("/notes") || url.includes("notes-preparations")) return "note";
    if (text.includes("talks") || text.includes("slides") || text.includes("発表") || url.includes("/talks") || url.includes("talks-slides")) return "talk";
    if (text.includes("web apps") || url.includes("/web-apps/") || url.includes("#web-apps")) return "webapp";
    if (text.includes("search") || text.includes("explore") || text.includes("pages") || text.includes("検索") || text.includes("ページ") || url.includes("/search/") || url.includes("#work-search")) return "search";
    if (text.includes("research timeline") || text.includes("yearly record") || text.includes("timeline") || text.includes("研究タイムライン") || text.includes("年次記録") || url.includes("#research-timeline") || url.includes("#timeline") || url.includes("#yearly-records")) return "timeline";
    if (text.includes("upcoming") || text.includes("preparation") || text.includes("予定") || url.includes("#in-preparation")) return "clock";
    if (text.includes("documents") || text.includes("資料")) return "paper";
    if (text.includes("papers") || text.includes("論文") || url.includes("/papers/")) return "paper";
    if (text.includes("visit") || text.includes("訪問") || url.includes("#visit")) return "globe";
    if (text.includes("categories in tokyo")) return "kan-extension";
    if (text.includes("activities") || text.includes("活動") || url.includes("/activities/")) return "activity";
    if (text.includes("work") || text.includes("interest") || text.includes("関心") || text.includes("成果") || url.includes("/works/") || url.includes("#works") || url.includes("#interests")) return "paper";
    if (text.includes("others") || text.includes("その他") || url.includes("/others/")) return "link";
    if (text.includes("links") || text.includes("リンク") || url.includes("/links/") || url.includes("#links")) return "link";
    if (text.includes("problems") || url.includes("/problems/")) return "problem";
    if (text.includes("cv") || url.includes("/cv/")) return "cv";
    if (text.includes("awards") || text.includes("受賞")) return "award";
    return "";
  }

  function uiIconSvg(key) {
    const svg = svgEl("svg", {
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      focusable: "false"
    });
    svg.classList.add("ui-icon-svg");
    const line = (attrs) => svgEl("path", { ...attrs, fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": attrs["stroke-width"] || "1.9" });
    const shape = (tag, attrs) => svgEl(tag, attrs);
    const normalizedKey = ({
      document: "paper",
      papers: "paper",
      notes: "note",
      talks: "talk",
      slides: "talk",
      activities: "activity",
      visit: "globe",
      visits: "globe",
      webapps: "webapp",
      links: "link",
      awards: "award",
      book: "education"
    })[key] || key || "link";
    const commonKeys = new Set([
      "profile",
      "paper",
      "note",
      "talk",
      "activity",
      "timeline",
      "clock",
      "globe",
      "kan-extension",
      "webapp",
      "problem",
      "search",
      "cv",
      "award",
      "education",
      "building",
      "mail",
      "link",
      "external"
    ]);
    if (!commonKeys.has(normalizedKey)) return null;

    if (normalizedKey === "profile") {
      svg.append(
        shape("circle", { cx: "12", cy: "8.2", r: "3.1", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M6.3 19.1C7.7 15.9 9.5 14.5 12 14.5C14.5 14.5 16.3 15.9 17.7 19.1" })
      );
      return svg;
    }

    if (normalizedKey === "paper") {
      svg.append(
        shape("path", { d: "M7.9 3.8H14L18.7 8.5V19.4C18.7 20.3 18 21 17.1 21H7.9C7 21 6.3 20.3 6.3 19.4V5.4C6.3 4.5 7 3.8 7.9 3.8Z", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.9" }),
        shape("path", { d: "M14 4.2V8.7H18.4", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.7" }),
        shape("rect", { x: "8.8", y: "10.4", width: "6.1", height: "1.55", rx: "0.55", fill: "currentColor" }),
        line({ d: "M8.8 14.2H16.2" }),
        line({ d: "M8.8 16.7H14.8" })
      );
      return svg;
    }

    if (normalizedKey === "note") {
      svg.append(
        shape("rect", { x: "3.9", y: "5.1", width: "16.2", height: "10.4", rx: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
        line({ d: "M8.4 18.8H15.6" }),
        line({ d: "M12 15.6V18.8" }),
        shape("rect", { x: "6.1", y: "7.5", width: "4.6", height: "3.2", rx: "0.65", fill: "currentColor", "fill-opacity": "0.18", stroke: "currentColor", "stroke-width": "1.15" }),
        line({ d: "M12.4 8.1H17.4", "stroke-width": "1.45" }),
        line({ d: "M12.4 10.4H16.1", "stroke-width": "1.45" })
      );
      return svg;
    }

    if (normalizedKey === "talk") {
      svg.append(
        shape("path", { d: "M5.2 12.8H8.1L17.9 7.4V16.6L8.1 11.2H5.2Z", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.9" }),
        shape("path", { d: "M7.8 13L9.2 18.3H12.1L10.3 14.2", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.8" }),
        line({ d: "M20.2 9.1L22 7.7", "stroke-width": "1.6" }),
        line({ d: "M20.7 12H22.9", "stroke-width": "1.6" }),
        line({ d: "M20.2 14.9L22 16.3", "stroke-width": "1.6" })
      );
      return svg;
    }

    if (normalizedKey === "activity") {
      svg.append(
        shape("rect", { x: "4.5", y: "6.2", width: "15", height: "13.3", rx: "2", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M8 4.8V8" }),
        line({ d: "M16 4.8V8" }),
        line({ d: "M4.8 10H19.2" }),
        shape("circle", { cx: "9", cy: "13.7", r: "1.1", fill: "currentColor" }),
        shape("circle", { cx: "12", cy: "13.7", r: "1.1", fill: "currentColor" }),
        shape("circle", { cx: "15", cy: "13.7", r: "1.1", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "timeline") {
      svg.append(
        line({ d: "M6.2 5V19" }),
        line({ d: "M6.2 7.3H14.8" }),
        line({ d: "M6.2 12H17.5" }),
        line({ d: "M6.2 16.7H12.9" }),
        shape("circle", { cx: "14.8", cy: "7.3", r: "1.55", fill: "currentColor" }),
        shape("circle", { cx: "17.5", cy: "12", r: "1.55", fill: "currentColor" }),
        shape("circle", { cx: "12.9", cy: "16.7", r: "1.55", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "clock") {
      svg.append(
        shape("circle", { cx: "12", cy: "12", r: "7.4", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M12 7.6V12.2L15.1 14.1", "stroke-width": "2.1" }),
        shape("circle", { cx: "12", cy: "12", r: "0.85", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "mail") {
      svg.append(
        shape("rect", { x: "4.2", y: "6.6", width: "15.6", height: "10.8", rx: "2", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
        line({ d: "M5.2 8.6L12 13.1L18.8 8.6" })
      );
      return svg;
    }

    if (normalizedKey === "globe") {
      svg.append(
        shape("circle", { cx: "12", cy: "12", r: "8", fill: "none", stroke: "currentColor", "stroke-width": "1.8" }),
        line({ d: "M4.6 12H19.4" }),
        line({ d: "M12 4.2C14.2 6.1 15.3 8.7 15.3 12S14.2 17.9 12 19.8" }),
        line({ d: "M12 4.2C9.8 6.1 8.7 8.7 8.7 12S9.8 17.9 12 19.8" })
      );
      return svg;
    }

    if (normalizedKey === "kan-extension") {
      svg.append(
        line({ d: "M8.3 8.1L15.8 11.3" }),
        line({ d: "M6.8 9.4V14.6" }),
        line({ d: "M8.3 15.9L15.8 12.7", "stroke-dasharray": "2 2" }),
        shape("circle", { cx: "6.8", cy: "7.5", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
        shape("circle", { cx: "6.8", cy: "16.5", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
        shape("circle", { cx: "17.2", cy: "12", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" })
      );
      return svg;
    }

    if (normalizedKey === "webapp") {
      svg.append(
        shape("rect", { x: "3.8", y: "5.1", width: "16.4", height: "13.8", rx: "2", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M3.8 8.6H20.2" }),
        shape("circle", { cx: "7", cy: "6.9", r: "0.8", fill: "currentColor" }),
        shape("circle", { cx: "9.8", cy: "6.9", r: "0.8", fill: "currentColor" }),
        line({ d: "M8 13.8H16" }),
        line({ d: "M8 16.4H13" })
      );
      return svg;
    }

    if (normalizedKey === "problem") {
      svg.append(
        shape("circle", { cx: "12", cy: "12", r: "8", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M9.7 9.4C10.2 8.4 11 7.9 12.2 7.9C13.7 7.9 14.7 8.8 14.7 10.1C14.7 12.2 12.2 12.3 12.2 14.3", "stroke-width": "1.9" }),
        shape("circle", { cx: "12.2", cy: "17", r: "1", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "search") {
      svg.append(
        shape("circle", { cx: "10.4", cy: "10.4", r: "5.8", fill: "none", stroke: "currentColor", "stroke-width": "2" }),
        line({ d: "M14.7 14.7L20 20", "stroke-width": "2.35" })
      );
      return svg;
    }

    if (normalizedKey === "cv") {
      svg.append(
        shape("path", { d: "M6.4 4.3h7.4l4 4v11.1c0 .9-.7 1.6-1.6 1.6H7.8c-.9 0-1.6-.7-1.6-1.6V5.9c0-.9.7-1.6 1.6-1.6Z", fill: "#fffdf8", stroke: "currentColor", "stroke-width": "1.6", "stroke-linejoin": "round" }),
        shape("path", { d: "M13.6 4.7V8.4h3.8", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linejoin": "round" }),
        line({ d: "M9 13H15" }),
        line({ d: "M9 16H14" })
      );
      return svg;
    }

    if (normalizedKey === "award") {
      svg.append(
        shape("path", { d: "M8.1 4.8H15.9V10.8C15.9 13 14.2 14.5 12 14.5C9.8 14.5 8.1 13 8.1 10.8Z", fill: "none", stroke: "currentColor", "stroke-width": "1.85", "stroke-linejoin": "round" }),
        shape("path", { d: "M8.1 6.5H5.2C5.2 9.2 6.2 10.9 8.4 11.3M15.9 6.5H18.8C18.8 9.2 17.8 10.9 15.6 11.3", fill: "none", stroke: "currentColor", "stroke-width": "1.55", "stroke-linecap": "round", "stroke-linejoin": "round" }),
        line({ d: "M12 14.5V18.6" }),
        line({ d: "M8.9 20H15.1" })
      );
      return svg;
    }

    if (normalizedKey === "education") {
      svg.append(
        shape("path", { d: "M5.5 6.6c0-1 .8-1.8 1.8-1.8h4.7c1.2 0 2.3.5 3 1.4c.7-.9 1.8-1.4 3-1.4h.7v13.7h-.7c-1.2 0-2.3.5-3 1.4c-.7-.9-1.8-1.4-3-1.4H7.3c-1 0-1.8-.8-1.8-1.8Z", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
        line({ d: "M15 6.2V19.3" })
      );
      return svg;
    }

    if (normalizedKey === "building") {
      svg.append(
        shape("rect", { x: "5.2", y: "6.2", width: "13.6", height: "14.2", rx: "1.5", fill: "none", stroke: "currentColor", "stroke-width": "1.8" }),
        line({ d: "M8.2 9H10.1" }),
        line({ d: "M13.9 9H15.8" }),
        line({ d: "M8.2 12.2H10.1" }),
        line({ d: "M13.9 12.2H15.8" }),
        line({ d: "M8.2 15.4H10.1" }),
        line({ d: "M13.9 15.4H15.8" }),
        line({ d: "M11.4 20.4V16.8H12.6V20.4" })
      );
      return svg;
    }

    svg.append(
      shape("path", { d: "M9.8 13.9A4.2 4.2 0 0 0 16 14.3L18.7 11.6A4.2 4.2 0 1 0 12.8 5.7L11.3 7.2", fill: "none", stroke: "currentColor", "stroke-width": "2.05", "stroke-linecap": "round", "stroke-linejoin": "round" }),
      line({ d: "M9.6 14.4L14.4 9.6", "stroke-width": "2.05" }),
      shape("path", { d: "M14.2 10.1A4.2 4.2 0 0 0 8 9.7L5.3 12.4A4.2 4.2 0 1 0 11.2 18.3L12.7 16.8", fill: "none", stroke: "currentColor", "stroke-width": "2.05", "stroke-linecap": "round", "stroke-linejoin": "round" })
    );
    return svg;
  }

  function uiIcon(key) {
    const span = document.createElement("span");
    span.className = "nav-item-icon";
    span.dataset.iconKey = key;
    span.setAttribute("aria-hidden", "true");
    span.append(uiIconSvg(key) || uiIconSvg("link"));
    return span;
  }

  function decorateNavIcons(root = document.body) {
    if (!root) return;
    const nodes = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(".nav-group-label, .nav-submenu a")) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll(".nav-group-label, .nav-submenu a"));
    nodes.forEach((node) => {
      if (node.classList.contains("nav-search") || node.querySelector(".nav-item-icon")) return;
      const key = navIconKey(node.textContent, node.getAttribute("href"));
      if (!key) return;
      node.prepend(uiIcon(key));
      node.classList.add("has-icon");
    });
  }

  function run() {
    decorateNavIcons();
  }

  window.decorateNavIcons = decorateNavIcons;
  window.navIconKey = window.navIconKey || navIconKey;
  window.siteCommonIconSvg = window.siteCommonIconSvg || uiIconSvg;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) decorateNavIcons(node);
        });
      });
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    else document.addEventListener("DOMContentLoaded", () => observer.observe(document.body, { childList: true, subtree: true }), { once: true });
  }
})();
