(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  function normalizedText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function simplified(value) {
    return normalizedText(value).toLowerCase();
  }

  function svgEl(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function normalizeIconKey(key = "") {
    return ({
      document: "paper",
      documents: "paper",
      papers: "paper",
      notes: "note",
      talks: "talk",
      activities: "activity",
      visit: "globe",
      visits: "globe",
      webapps: "webapp",
      links: "link",
      awards: "award",
      work: "stack",
      works: "stack",
      folder: "stack",
      more: "collection",
      others: "collection",
      education: "academic-cap",
      academic: "academic-cap",
      cap: "academic-cap",
      physics: "flask",
      sake: "beer",
      journal: "external",
      doi: "external"
    })[key] || key || "link";
  }

  function navIconKey(label = "", href = "") {
    const text = simplified(label);
    const url = String(href || "").toLowerCase();
    if (text.includes("profile") || text.includes("プロフィール") || text.includes("概要")) return "profile";
    if (text.includes("categories in tokyo")) return "kan-extension";
    if (text.includes("web apps") || url.includes("/web-apps/") || url.includes("#web-apps")) return "webapp";
    if (text === "links" || text.includes("リンク") || url.includes("/links/") || url.includes("#links")) return "link";
    if (text === "browse" || text.includes("explore") || text.includes("pages") || text.includes("ページ") || url.includes("#work-pages") || url.includes("#explore") || url.includes("#pages")) return "collection";
    if (text === "roles" || url.includes("#roles")) return "building";
    if (text === "background" || text === "backgrounds" || text.includes("academic background") || url.includes("#academic-background") || url.includes("#backgrounds")) return "academic-cap";
    if (text.includes("teaching") || text.includes("outreach") || url.includes("#teaching-outreach")) return "pencil";
    if (text.includes("current position") || text.includes("past affiliation") || text.includes("affiliation")) return "building";
    if (text.includes("personal") || url.includes("#personal")) return "profile";
    if (text.includes("award")) return "award";
    if (text.includes("notes") || text.includes("ノート") || url.includes("/notes") || url.includes("notes-preparations")) return "note";
    if (text.includes("talks") || text.includes("slides") || text.includes("発表") || url.includes("/talks") || url.includes("talks-slides")) return "talk";
    if (text.includes("search") || text.includes("検索") || url.includes("/search/") || url.includes("#work-search")) return "search";
    if (text.includes("research timeline") || text.includes("yearly record") || text.includes("timeline") || text.includes("研究タイムライン") || text.includes("年次記録") || url.includes("#research-timeline") || url.includes("#timeline") || url.includes("#yearly-records")) return "timeline";
    if (text.includes("upcoming") || text.includes("preparation") || text.includes("予定") || url.includes("#in-preparation")) return "clock";
    if (text.includes("documents") || text.includes("資料")) return "paper";
    if (text.includes("papers") || text.includes("論文") || url.includes("/papers/")) return "paper";
    if (text.includes("visit") || text.includes("訪問") || url.includes("#visit")) return "globe";
    if (text.includes("activities") || text.includes("活動") || url.includes("/activities/")) return "activity";
    if (text === "works" || text.includes("work") || text.includes("interest") || text.includes("関心") || text.includes("成果") || url.includes("/works/") || url.includes("#works") || url.includes("#interests")) return "stack";
    if (text.includes("others") || text.includes("その他") || url.includes("/others/")) return "collection";
    if (text.includes("problems") || url.includes("/problems/")) return "problem";
    if (text.includes("cv") || url.includes("/cv/")) return "cv";
    if (text.includes("awards") || text.includes("受賞")) return "award";
    return "";
  }

  function sectionIconKey(label = "") {
    const text = simplified(label);
    if (!text) return "";
    if (text === "profile" || text.includes("ryuya hora") || text.includes("personal")) return "profile";
    if (text === "works" || text.includes("work overview")) return "stack";
    if (text === "activities") return "activity";
    if (text === "others") return "collection";
    if (text === "browse" || text.includes("explore") || text.includes("pages")) return "collection";
    if (text.includes("categories in tokyo")) return "kan-extension";
    if (text.includes("research timeline") || text.includes("yearly record") || text.includes("timeline") || text.includes("タイムライン") || text.includes("年次記録")) return "timeline";
    if (text.includes("upcoming") || text.includes("plan") || text.includes("予定")) return "clock";
    if (text.includes("visit") || text.includes("訪問")) return "globe";
    if (text.includes("talk") || text.includes("slide") || text.includes("発表")) return "talk";
    if (text.includes("paper") || text.includes("bibliography") || text.includes("writing") || text.includes("論文") || text.includes("文献") || text.includes("文章")) return "paper";
    if (text.includes("note") || text.includes("preparation") || text.includes("ノート")) return "note";
    if (text.includes("web app")) return "webapp";
    if (text.includes("question") || text.includes("trail") || text.includes("problem") || text.includes("entry") || text.includes("entries") || text.includes("全項目")) return "problem";
    if (text.includes("index") || text.includes("search") || text.includes("検索") || text.includes("一覧") || text.includes("索引")) return "search";
    if (text === "roles") return "building";
    if (text.includes("current position") || text.includes("past position") || text.includes("affiliation") || text.includes("position") || text.includes("所属")) return "building";
    if (text.includes("topic") || text.includes("トピック")) return "tag";
    if (text.includes("email") || text.includes("メール")) return "mail";
    if (text.includes("award") || text.includes("受賞")) return "award";
    if (text.includes("book")) return "book";
    if (text.includes("teaching") || text.includes("outreach")) return "pencil";
    if (text.includes("education") || text.includes("background") || text.includes("教育") || text.includes("学歴")) return "academic-cap";
    if (text.includes("interest") || text.includes("関心")) return "topos";
    if (text.includes("link") || text.includes("リンク")) return "link";
    return "";
  }

  function actionIconKey(label = "", href = "") {
    const text = simplified(label);
    const url = String(href || "").toLowerCase();
    if (text.includes("copy")) return "link";
    if (text.includes("researchmap") || url.includes("researchmap.jp")) return "researchmap";
    if (text.includes("download")) return "download";
    if (text.includes("open") || text.includes("guide") || text.includes("tutorial") || text.includes("workbench") || text.includes("dev")) return "open";
    if (text.includes("arxiv") || url.includes("arxiv.org")) return "arxiv";
    if (text.includes("slide") || url.includes("slide")) return "slides";
    if (text.includes("note") || text.includes("preparation") || url.includes("notes-preparations")) return "note";
    if (text.includes("talk")) return "talk";
    if (text.includes("event") || text.includes("flyer")) return "event";
    if (text === "doi" || url.includes("doi.org") || text.includes("journal") || text.includes("issue") || text.includes("advances in mathematics") || text.includes("tac") || text.includes("jpaa") || text.includes("lawvere")) return "external";
    if (text.includes("paper") || text.includes("pdf") || text.includes("preprint")) return "paper";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "talk";
    if (url.includes("github.com") || url.includes("github.io")) return "webapp";
    if (url.startsWith("mailto:")) return "mail";
    return "";
  }

  function siteIconSvg(key) {
    const normalizedKey = normalizeIconKey(key);
    const commonKeys = new Set([
      "profile", "stack", "collection", "paper", "note", "slides", "talk", "activity",
      "timeline", "clock", "mail", "globe", "kan-extension", "webapp", "problem",
      "search", "page", "cv", "award", "pencil", "academic-cap", "book", "building", "flask", "event",
      "researchmap", "download", "open", "arxiv", "external", "link", "tag", "beer"
    ]);
    if (!commonKeys.has(normalizedKey)) return null;

    const svg = svgEl("svg", {
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      focusable: "false"
    });
    svg.classList.add("ui-icon-svg");
    const line = (attrs) => svgEl("path", { ...attrs, fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": attrs["stroke-width"] || "1.9" });
    const shape = (tag, attrs) => svgEl(tag, attrs);

    if (normalizedKey === "profile") {
      svg.append(
        shape("circle", { cx: "12", cy: "8.2", r: "3.1", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M6.3 19.1C7.7 15.9 9.5 14.5 12 14.5C14.5 14.5 16.3 15.9 17.7 19.1" })
      );
      return svg;
    }

    if (normalizedKey === "stack") {
      svg.append(
        shape("path", { d: "M4.7 7.4L12 3.9L19.3 7.4L12 10.9Z", fill: "currentColor", "fill-opacity": "0.16", stroke: "currentColor", "stroke-width": "1.75", "stroke-linejoin": "round" }),
        shape("path", { d: "M5.2 11.3L12 14.6L18.8 11.3", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linejoin": "round" }),
        shape("path", { d: "M5.2 15.2L12 18.5L18.8 15.2", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linejoin": "round" })
      );
      return svg;
    }

    if (normalizedKey === "collection") {
      svg.append(
        shape("rect", { x: "4.2", y: "4.4", width: "6.2", height: "6.2", rx: "1.35", fill: "none", stroke: "currentColor", "stroke-width": "1.85" }),
        shape("rect", { x: "13.6", y: "4.4", width: "6.2", height: "6.2", rx: "1.35", fill: "none", stroke: "currentColor", "stroke-width": "1.85" }),
        shape("rect", { x: "4.2", y: "13.6", width: "6.2", height: "6.2", rx: "1.35", fill: "none", stroke: "currentColor", "stroke-width": "1.85" }),
        shape("rect", { x: "13.6", y: "13.6", width: "6.2", height: "6.2", rx: "1.35", fill: "currentColor", "fill-opacity": "0.18", stroke: "currentColor", "stroke-width": "1.85" })
      );
      return svg;
    }

    if (normalizedKey === "paper" || normalizedKey === "page") {
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

    if (normalizedKey === "slides") {
      svg.append(
        shape("rect", { x: "4.6", y: "5.2", width: "14.8", height: "10.2", rx: "1.6", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
        line({ d: "M12 15.5V19.2" }),
        line({ d: "M8.6 19.2H15.4" }),
        shape("rect", { x: "7.1", y: "7.6", width: "4.2", height: "2.8", rx: "0.6", fill: "currentColor", "fill-opacity": "0.24", stroke: "currentColor", "stroke-width": "1.1" }),
        line({ d: "M13.2 8.1H16.8", "stroke-width": "1.45" }),
        line({ d: "M13.2 10.4H16", "stroke-width": "1.45" }),
        line({ d: "M7.2 12.7H16.8", "stroke-width": "1.45" })
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
        shape("circle", { cx: "12", cy: "12", r: "8.1", fill: "none", stroke: "currentColor", "stroke-width": "1.75" }),
        shape("path", {
          d: "M8.8 5.5C7.2 6.2 6 7.6 5.5 9.5L7 9.8C7.9 10 8.4 10.7 8.2 11.6L8 12.7C7.8 13.6 8.2 14.4 9 14.8L10 15.3C10.7 15.7 10.9 16.5 10.5 17.2L9.8 18.5C9.7 18.8 9.9 19.1 10.2 19.2L11 19.4C11.4 18.1 11.4 16.8 10.9 15.5C10.5 14.3 11 13.3 12.1 12.8L13.1 12.3C13.9 11.9 14.1 10.8 13.4 10.2L12 9C11.3 8.4 10.3 8.5 9.7 9.2L9.1 9.9C8.7 10.4 7.9 10.1 8 9.4L8.8 5.5Z",
          fill: "currentColor",
          "fill-opacity": "0.52"
        }),
        shape("path", {
          d: "M13.3 5C15.4 5.3 17.1 6.4 18.2 8.1L17.4 8.7C16.9 9.1 16.9 9.8 17.4 10.2L18.6 11.3C18.8 11.5 18.7 11.9 18.4 12C17.5 12.3 16.7 12.1 15.9 11.6C15.1 11.1 14.3 11.4 14 12.2C13.8 12.9 14.2 13.5 14.8 13.9C15.5 14.4 15.6 15.3 15 16L13.8 17.4C13.3 18.1 12.3 18 11.9 17.3C11.5 16.6 11.8 16 12.3 15.4C12.9 14.8 12.6 13.8 11.7 13.6L10.6 13.3C9.7 13 9.3 12.2 9.7 11.4C10.1 10.5 11.1 10.3 12.1 10.6C12.9 10.8 13.4 9.8 12.8 9.2L12 8.4C11.2 7.6 11.3 6.4 12.2 5.7L13.3 5Z",
          fill: "currentColor",
          "fill-opacity": "0.34"
        }),
        shape("path", {
          d: "M16.9 15.8C17.8 15.7 18.5 16.1 18.8 16.8C18.1 18 17.1 18.9 15.9 19.5L15.4 18.8C15 18.2 15.2 17.4 15.8 17L16.9 15.8Z",
          fill: "currentColor",
          "fill-opacity": "0.44"
        })
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

    if (normalizedKey === "pencil") {
      svg.append(
        shape("path", {
          d: "M5.1 17.8L6.2 13.6L15 4.8C15.9 3.9 17.3 3.9 18.2 4.8L19.1 5.7C20 6.6 20 8 19.1 8.9L10.3 17.7Z",
          fill: "currentColor",
          "fill-opacity": "0.22",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.8"
        }),
        shape("path", {
          d: "M6.2 13.6L10.3 17.7L5.1 17.8Z",
          fill: "var(--paper)",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.55"
        }),
        shape("path", { d: "M5.1 17.8L7 16.6L6.3 15.9Z", fill: "currentColor" }),
        line({ d: "M13.8 6L17.9 10.1", "stroke-width": "1.75" }),
        line({ d: "M15.5 4.9L19 8.4", "stroke-width": "1.45" })
      );
      return svg;
    }

    if (normalizedKey === "academic-cap") {
      svg.append(
        shape("path", { d: "M3.9 9L12 5.2L20.1 9L12 12.8Z", fill: "currentColor", "fill-opacity": "0.16", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.8" }),
        shape("path", { d: "M7.2 11.2V15.3C8.5 16.7 10.1 17.4 12 17.4C13.9 17.4 15.5 16.7 16.8 15.3V11.2", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.8" }),
        line({ d: "M19.6 9.3V14.8" }),
        shape("circle", { cx: "19.6", cy: "16.2", r: "0.9", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "book") {
      svg.append(
        shape("path", { d: "M5.4 5.4C5.4 4.5 6.1 3.8 7 3.8H11.2C12.4 3.8 13.3 4.2 14 5C14.7 4.2 15.6 3.8 16.8 3.8H19V18.8H16.8C15.6 18.8 14.7 19.2 14 20C13.3 19.2 12.4 18.8 11.2 18.8H7C6.1 18.8 5.4 18.1 5.4 17.2Z", fill: "none", stroke: "currentColor", "stroke-width": "1.85", "stroke-linejoin": "round" }),
        line({ d: "M14 5V20" }),
        line({ d: "M7.7 7.4H10.9", "stroke-width": "1.35" }),
        line({ d: "M7.7 10.1H10.8", "stroke-width": "1.35" })
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

    if (normalizedKey === "flask") {
      svg.append(
        line({ d: "M9.4 5.1H14.6" }),
        shape("path", {
          d: "M10.5 5.1V10.1L6.2 18.1C5.7 19.1 6.4 20.3 7.6 20.3H16.4C17.6 20.3 18.3 19.1 17.8 18.1L13.5 10.1V5.1",
          fill: "none",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.8"
        }),
        shape("path", {
          d: "M8 16H16L17.1 18.2C17.4 18.8 16.9 19.5 16.2 19.5H7.8C7.1 19.5 6.6 18.8 6.9 18.2Z",
          fill: "currentColor",
          "fill-opacity": "0.16"
        }),
        shape("path", {
          d: "M8.9 16C10.2 15.3 11.4 15.3 12.7 16C13.8 16.6 14.9 16.6 16 16",
          fill: "none",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-width": "1.35"
        })
      );
      return svg;
    }

    if (normalizedKey === "event") {
      svg.append(
        shape("path", { d: "M5 8.4H19C19 10 20.1 10.7 20.1 12S19 14 19 15.6H5C5 14 3.9 13.3 3.9 12S5 10 5 8.4Z", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.8" }),
        line({ d: "M8.2 9.2V14.8", "stroke-dasharray": "1.2 1.4", "stroke-width": "1.35" }),
        shape("path", { d: "M13.6 10.2L14.3 11.5L15.8 11.7L14.7 12.8L15 14.3L13.6 13.6L12.2 14.3L12.5 12.8L11.4 11.7L12.9 11.5Z", fill: "currentColor", "fill-opacity": "0.78" })
      );
      return svg;
    }

    if (normalizedKey === "researchmap") {
      svg.append(
        shape("circle", { cx: "7.4", cy: "9.1", r: "2.6", fill: "currentColor" }),
        shape("circle", { cx: "16.5", cy: "8.2", r: "2.45", fill: "currentColor", "fill-opacity": "0.68" }),
        shape("circle", { cx: "14.4", cy: "16.2", r: "2.75", fill: "currentColor" }),
        shape("path", { d: "M9.7 9L14.2 8.5M8.9 10.9L12.6 14.4M15.8 10.5L15 13.6", fill: "none", stroke: "currentColor", "stroke-width": "1.15", "stroke-linecap": "round", "stroke-opacity": "0.64" }),
        shape("circle", { cx: "10.7", cy: "12.1", r: "0.8", fill: "var(--paper)" }),
        shape("circle", { cx: "13.2", cy: "11.2", r: "0.8", fill: "var(--paper)" }),
        shape("circle", { cx: "12.7", cy: "14", r: "0.8", fill: "var(--paper)" })
      );
      return svg;
    }

    if (normalizedKey === "download") {
      svg.append(
        line({ d: "M12 5.7V14.9" }),
        line({ d: "M8.6 11.7L12 15.1L15.4 11.7" }),
        line({ d: "M6.2 18.2H17.8" })
      );
      return svg;
    }

    if (normalizedKey === "open" || normalizedKey === "external") {
      svg.append(
        shape("path", { d: "M8 8.6H6.6A1.6 1.6 0 0 0 5 10.2v7.2A1.6 1.6 0 0 0 6.6 19h7.2A1.6 1.6 0 0 0 15.4 17.4V16", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
        line({ d: "M11 13L19 5" }),
        line({ d: "M13.5 5H19v5.5" })
      );
      return svg;
    }

    if (normalizedKey === "arxiv") {
      const arxivMarkTransform = "translate(12 12) scale(0.175) translate(-486.5 -277.8)";
      const arxivMarkAttrs = {
        fill: "currentColor",
        stroke: "currentColor",
        "stroke-linejoin": "round",
        "stroke-width": "2.1",
        transform: arxivMarkTransform
      };
      svg.append(
        shape("path", {
          d: "M486.149,277.877l-32.741,38.852c-1.286,1.372-2.084,3.777-1.365,5.5a4.705,4.705,0,0,0,4.4,2.914,4.191,4.191,0,0,0,3.16-1.563l40.191-42.714a4.417,4.417,0,0,0,.042-6.042Z",
          ...arxivMarkAttrs
        }),
        shape("path", {
          d: "M486.149,277.877l31.187-38.268c1.492-1.989,2.2-3.03,1.492-4.723a5.142,5.142,0,0,0-4.481-3.161h0a4.024,4.024,0,0,0-3.008,1.108L472.711,274.6a4.769,4.769,0,0,0,.015,6.53L520.512,332.2a3.913,3.913,0,0,0,3.137,1.192,4.394,4.394,0,0,0,4.027-2.818c.719-1.727-.076-3.438-1.4-5.23l-40.124-47.464",
          ...arxivMarkAttrs
        }),
        shape("path", {
          d: "M499.833,274.828,453.169,224.4s-1.713-2.08-3.524-2.124a4.607,4.607,0,0,0-4.338,2.788c-.705,1.692-.2,2.88,1.349,5.1l40.093,48.422",
          ...arxivMarkAttrs
        })
      );
      return svg;
    }

    if (normalizedKey === "tag") {
      svg.append(
        shape("path", { d: "M5.2 5.7H11.8L18.9 12.8L12.8 18.9L5.2 11.3Z", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.9" }),
        shape("circle", { cx: "8.8", cy: "9", r: "1.1", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "beer") {
      svg.append(
        shape("path", { d: "M6.8 8.5H15.4L14.5 19.4H7.7Z", fill: "none", stroke: "currentColor", "stroke-width": "1.75", "stroke-linejoin": "round" }),
        shape("path", { d: "M7.4 11.5H15L14.5 19.4H7.7Z", fill: "currentColor", "fill-opacity": "0.68" }),
        shape("path", { d: "M8 5.9C8.7 4.9 10 4.9 10.8 5.6C11.5 4.6 13.4 4.9 13.9 6.1C15.5 6 16.3 6.9 15.9 8.5H6.9C6.5 7 6.8 6.1 8 5.9Z", fill: "var(--paper)", stroke: "currentColor", "stroke-width": "1.45", "stroke-linejoin": "round" }),
        shape("path", { d: "M15.4 10.7H18C18.8 10.7 19.4 11.3 19.4 12.1V15.6C19.4 17.1 18.4 18.1 17 18.1H14.7", fill: "none", stroke: "currentColor", "stroke-width": "1.55", "stroke-linejoin": "round" })
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

  function siteIcon(key, className = "ui-icon") {
    const normalizedKey = normalizeIconKey(key);
    const span = document.createElement("span");
    span.className = className;
    span.dataset.iconKey = normalizedKey;
    span.setAttribute("aria-hidden", "true");
    span.append(siteIconSvg(normalizedKey) || siteIconSvg("link"));
    return span;
  }

  function collect(root, selector) {
    const nodes = [];
    if (!root) return nodes;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(selector)) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll(selector));
    return nodes;
  }

  function decorateNavIcons(root = document.body) {
    collect(root, ".nav-group-label, .nav-submenu a").forEach((node) => {
      if (node.classList.contains("nav-search") || node.querySelector(".nav-item-icon")) return;
      const key = navIconKey(node.textContent, node.getAttribute("href"));
      if (!key) return;
      node.prepend(siteIcon(key, "nav-item-icon"));
      node.classList.add("has-icon");
    });
  }

  function decorateActionIcons(root = document.body) {
    collect(root, ".action-link").forEach((node) => {
      if (node.querySelector(".action-link-icon") || node.classList.contains("section-link-hidden")) return;
      const key = actionIconKey(node.textContent || node.getAttribute("aria-label"), node.getAttribute("href"));
      if (!key) return;
      node.prepend(siteIcon(key, "action-link-icon"));
      node.classList.add("has-icon");
    });
  }

  function decorateSectionIcons(root = document.body) {
    collect(root, ".page-hero h1, .section-head h2, .profile-grid h2, .categories-tokyo-copy h2").forEach((node) => {
      if (node.querySelector(".section-title-icon")) return;
      const key = sectionIconKey(node.textContent);
      if (!key) return;
      node.prepend(siteIcon(key, "section-title-icon"));
      node.classList.add("has-section-icon");
    });
  }

  function decorateCommonIcons(root = document.body, options = {}) {
    decorateNavIcons(root);
    decorateActionIcons(root);
    if (options.sections || document.body?.dataset?.worksPage) decorateSectionIcons(root);
  }

  function run() {
    decorateCommonIcons(document.body, { sections: Boolean(document.body?.dataset?.worksPage) });
  }

  window.normalizeSiteIconKey = window.normalizeSiteIconKey || normalizeIconKey;
  window.siteIconSvg = window.siteIconSvg || siteIconSvg;
  window.siteCommonIconSvg = window.siteCommonIconSvg || siteIconSvg;
  window.siteIcon = window.siteIcon || siteIcon;
  window.navIconKey = window.navIconKey || navIconKey;
  window.siteNavIconKey = window.siteNavIconKey || navIconKey;
  window.siteSectionIconKey = window.siteSectionIconKey || sectionIconKey;
  window.siteActionIconKey = window.siteActionIconKey || actionIconKey;
  window.decorateNavIcons = decorateNavIcons;
  window.decorateSectionIcons = decorateSectionIcons;
  window.decorateActionIcons = decorateActionIcons;
  window.decorateCommonIcons = decorateCommonIcons;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) decorateCommonIcons(node, { sections: Boolean(document.body?.dataset?.worksPage) });
        });
      });
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    else document.addEventListener("DOMContentLoaded", () => observer.observe(document.body, { childList: true, subtree: true }), { once: true });
  }
})();
