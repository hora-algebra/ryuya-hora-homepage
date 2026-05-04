(function () {
  const initialUrlParams = new URLSearchParams(globalThis.location?.search || "");
  const publicSiteUrl = "https://hora-algebra.github.io/ryuya-hora-homepage/";
  const paperFigureCacheKey = "cache-20260504a";
  const worksInitialPaperRecordLimit = 4;
  const katexCdnBase = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist";

  const state = {
    paperQuery: initialUrlParams.get("paper") || "",
    paperTheme: initialUrlParams.get("theme") || "",
    paperView: "diagram",
    talkQuery: "",
    talkYear: "all",
    talkTheme: "all",
    talkSlides: "all",
    researchTheme: initialUrlParams.get("theme") || "",
    researchMetaTag: initialUrlParams.get("meta") || "",
    noteQuery: "",
    noteLanguage: "all",
    noteYear: "all",
    noteTheme: "all",
    slideQuery: "",
    slideLanguage: "all",
    slideYear: "all",
    slideTheme: "all"
  };

  const paperFigureScriptCache = new Map();
  const dynamicScriptLoads = new Map();
  const dynamicStylesheetLoads = new Map();
  let katexLoadPromise = null;
  let paperFigureObserver = null;
  let noteThumbnailObserver = null;
  let preparationFigureObserver = null;
  let paperFigureHydrationScheduled = false;
  let noteThumbnailHydrationScheduled = false;
  let preparationFigureHydrationScheduled = false;
  let queuedPaperFigures = [];
  let queuedNoteThumbnails = [];
  let queuedPreparationFigures = [];

  function dataSet() {
    return {
      search: globalThis.worksSearchData || null,
      papers: globalThis.worksPapersData || null,
      talks: globalThis.worksTalksData || null,
      researchmap: globalThis.researchmapData || null
    };
  }

  function researchThemes() {
    const data = dataSet();
    return data.search?.researchThemes || data.papers?.researchThemes || data.talks?.researchThemes || [];
  }

  function researchMetaTags() {
    const data = dataSet();
    return data.search?.researchMetaTags || data.papers?.researchMetaTags || data.talks?.researchMetaTags || [];
  }

  function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null && text !== "") element.textContent = text;
    return element;
  }

  function svgEl(tag, attrs = {}, text) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    return node;
  }

  function getPathPrefix() {
    const rawDepth = document.body?.dataset.depth;
    if (rawDepth === "child") return "../";
    const depth = Number.parseInt(rawDepth, 10);
    return Number.isFinite(depth) && depth > 0 ? "../".repeat(depth) : "";
  }

  function localHref(href = "") {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    return `${getPathPrefix()}${href}`;
  }

  function publicHref(href = "") {
    const text = String(href || "").trim();
    if (!text) return publicSiteUrl;
    if (/^https?:/i.test(text)) return text;
    const clean = text.replace(/^(\.\/|\.\.\/)+/u, "").replace(/^\//u, "");
    return new URL(clean, publicSiteUrl).href;
  }

  function link(label, href, className) {
    const anchor = document.createElement("a");
    anchor.href = localHref(href || "#");
    anchor.textContent = label;
    if (className) anchor.className = className;
    if (/^https?:/.test(anchor.href)) anchor.rel = "noreferrer";
    return anchor;
  }

  function normalized(value) {
    return String(value || "").toLowerCase();
  }

  function normalizedUiText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function simplified(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
      .trim();
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function compactText(values) {
    return values.filter((value) => value !== undefined && value !== null && String(value).trim() !== "");
  }

  function matchesQuery(value, query) {
    return !query || normalized(value).includes(normalized(query));
  }

  function peopleArray(value) {
    if (Array.isArray(value)) return compactText(value).map((item) => String(item).trim());
    const text = String(value || "").replace(/^with\s+/i, "").trim();
    if (!text) return [];
    return text.split(/\s*,\s*|\s+and\s+/).map((item) => item.trim()).filter(Boolean);
  }

  function peopleText(value) {
    const people = peopleArray(value);
    return people.length ? people.join(", ") : "";
  }

  function peopleLabel(single, plural, value) {
    const people = peopleArray(value);
    if (!people.length) return "";
    return `${people.length === 1 ? single : plural}: ${people.join(", ")}`;
  }

  function paperPeopleText(paper) {
    if (paper?.coauthors || /^with\s+/i.test(String(paper?.authors || ""))) {
      return peopleLabel("Coauthor", "Coauthors", paper.coauthors || paper.authors);
    }
    if (paper?.authors) return `Authors: ${peopleText(paper.authors)}`;
    return "";
  }

  function presentationPeopleText(record) {
    return peopleLabel("Presenter", "Presenters", record?.presenters || []);
  }

  function themeById(themeId) {
    return researchThemes().find((theme) => theme.id === themeId) || null;
  }

  function metaTagById(tagId) {
    return researchMetaTags().find((tag) => tag.id === tagId) || null;
  }

  function normalizeThemeSelection(selection = "") {
    const rawIds = Array.isArray(selection) ? selection : String(selection).split(/\s+/).map((themeId) => themeId.trim());
    const seen = new Set();
    return rawIds.filter((themeId) => {
      if (!themeId || seen.has(themeId) || !themeById(themeId)) return false;
      seen.add(themeId);
      return true;
    });
  }

  function normalizeMetaTagSelection(selection = "") {
    const rawIds = Array.isArray(selection) ? selection : String(selection).split(/\s+/).map((tagId) => tagId.trim());
    const seen = new Set();
    return rawIds.filter((tagId) => {
      if (!tagId || seen.has(tagId) || !metaTagById(tagId)) return false;
      seen.add(tagId);
      return true;
    });
  }

  function hasTopicKeyword(text, keyword) {
    const haystack = simplified(text);
    const needle = simplified(keyword);
    if (!needle) return false;
    if (/^[a-z0-9]+(?:\s+[a-z0-9]+)*$/.test(needle)) {
      return ` ${haystack} `.includes(` ${needle} `);
    }
    return haystack.includes(needle);
  }

  function hasTopicKeywords(text, keywords = []) {
    return keywords.some((keyword) => hasTopicKeyword(text, keyword));
  }

  function scoreThemeRecord(text, themeHints = []) {
    const hintSet = new Set(normalizeThemeSelection(themeHints));
    const scores = {};
    researchThemes().forEach((theme) => {
      const keywordScore = (theme.keywords || []).reduce((total, keyword) => total + (hasTopicKeyword(text, keyword) ? 1 : 0), 0);
      scores[theme.id] = keywordScore + (hintSet.has(theme.id) ? 8 : 0);
    });
    const themes = Object.entries(scores)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([themeId]) => themeId);
    return { themes, scores, bestScore: themes.length ? scores[themes[0]] : 0 };
  }

  function metaTagIdsForText(text = "", explicitTags = []) {
    const ids = new Set(normalizeMetaTagSelection(explicitTags));
    researchMetaTags().forEach((tag) => {
      if (hasTopicKeywords(text, tag.keywords || [])) ids.add(tag.id);
    });
    return [...ids];
  }

  function tagIconKey(label = "") {
    const text = simplified(label);
    if (!text || text === "all") return "tag";
    if (text.includes("award") || text.includes("grant") || text.includes("kakenhi")) return "award";
    if (text.includes("expository") || text.includes("introduction") || text.includes("intro") || text.includes("toy example") || text.includes("入門") || text.includes("新歓") || text.includes("解説")) return "pencil";
    if (text.includes("education") || text.includes("book") || text.includes("teaching")) return "education";
    if (text.includes("simulation") || text.includes("experiment") || text.includes("workbench") || text.includes("editor")) return "webapp";
    if (text.includes("cloud") || text.includes("speculative")) return "cloud";
    if (text.includes("draft") || text.includes("meta") || text.includes("research log")) return "note";
    if (text.includes("formal") || text.includes("informal") || text.includes("question") || text.includes("problem")) return "problem";
    if (text.includes("classifier")) return "category";
    if (text.includes("geometric morphism")) return "topos";
    if (text.includes("dynamics") || text.includes("dynamical") || text.includes("space time") || text.includes("space-time") || text.includes("orbit") || text.includes("pretopological")) return "dynamical-system";
    if (text.includes("geometry")) return "torus";
    if (text.includes("topos") || text.includes("topoi") || text.includes("sheaf") || text.includes("site") || text.includes("locale") || text.includes("geometric morphism") || text.includes("hyperconnected") || text.includes("cohesive")) return "topos";
    if (text.includes("logic") || text.includes("logical") || text.includes("boolean") || text.includes("constructive") || text.includes("choice")) return "logic";
    if (text.includes("category") || text.includes("categorical")) return "category";
    if (text.includes("kan") || text.includes("yoneda") || text.includes("slice") || text.includes("pullback")) return "kan-extension";
    if (text.includes("automata") || text.includes("automaton") || text.includes("regular language") || text.includes("sigma set") || text.includes("sigma sets") || text.includes("state")) return "automaton-piece";
    if (text.includes("coalgebra")) return "river";
    if (text.includes("game") || text.includes("nim") || text.includes("grundy") || text.includes("wythoff") || text.includes("winning") || text.includes("bouton")) return "pawn";
    if (text.includes("algebra") || text.includes("semiring") || text.includes("monoid") || text.includes("ring") || text.includes("rieg") || text.includes("module") || text.includes("normalization") || text.includes("rota baxter")) return "tensor";
    if (text.includes("combinatorics") || text.includes("species") || text.includes("profinite") || text.includes("finite presheaf")) return "combinatorics";
    if (text.includes("number") || text.includes("integer") || text.includes("natural") || text.includes("rational")) return "timeline";
    if (text.includes("paper")) return "paper";
    if (text.includes("talk") || text.includes("slide")) return "talk";
    if (text.includes("link")) return "link";
    return "tag";
  }

  function uiIconSvg(key) {
    const svg = svgEl("svg", {
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      focusable: "false"
    });
    svg.classList.add("ui-icon-svg");
    const line = (attrs) => svgEl("path", { ...attrs, fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.9" });
    const shape = (tag, attrs, text) => svgEl(tag, attrs, text);
    const normalizedKey = ({
      document: "paper",
      slides: "talk",
      papers: "paper",
      notes: "note",
      talks: "talk",
      links: "link",
      automata: "automaton-piece",
      games: "pawn",
      coalgebra: "river",
      algebra: "tensor",
      geometry: "torus",
      dynamical: "dynamical-system"
    })[key] || key || "tag";

    if (normalizedKey === "paper") {
      svg.append(
        shape("path", { d: "M7.9 3.8H14L18.7 8.5V19.4C18.7 20.3 18 21 17.1 21H7.9C7 21 6.3 20.3 6.3 19.4V5.4C6.3 4.5 7 3.8 7.9 3.8Z", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.9" }),
        shape("path", { d: "M14 4.2V8.7H18.4", fill: "none", stroke: "currentColor", "stroke-linejoin": "round", "stroke-width": "1.7" }),
        shape("rect", { x: "8.8", y: "10.4", width: "6.1", height: "1.55", rx: "0.55", fill: "currentColor" }),
        line({ d: "M8.8 14.2H16.2" }),
        line({ d: "M8.8 16.7H14.8" }),
        shape("path", { d: "M8.8 8.1H11.5", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-width": "2.2" })
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
        line({ d: "M12.4 10.4H16.1", "stroke-width": "1.45" }),
        line({ d: "M6.2 13.2H17.7", "stroke-width": "1.45" }),
        shape("path", { d: "M17.5 15.2L20 12.7L21.1 13.8L18.6 16.3L17.2 16.6Z", fill: "currentColor", "fill-opacity": "0.7" }),
        shape("path", { d: "M19.6 13.1L20.7 14.2", fill: "none", stroke: "var(--paper)", "stroke-linecap": "round", "stroke-width": "0.8" })
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

    if (normalizedKey === "cloud") {
      svg.append(
        shape("path", { d: "M7.1 17.4H17.2C19.3 17.4 20.8 16 20.8 14.2C20.8 12.4 19.5 11 17.7 10.9C17.1 8.3 14.9 6.5 12.3 6.5C10 6.5 8.1 7.8 7.2 9.9C4.9 10.1 3.2 11.7 3.2 13.8C3.2 15.9 4.9 17.4 7.1 17.4Z", fill: "currentColor", "fill-opacity": "0.82", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.25" })
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

    if (normalizedKey === "link" || normalizedKey === "external") {
      svg.append(
        shape("path", { d: "M9.8 13.9A4.2 4.2 0 0 0 16 14.3L18.7 11.6A4.2 4.2 0 1 0 12.8 5.7L11.3 7.2", fill: "none", stroke: "currentColor", "stroke-width": "2.05", "stroke-linecap": "round", "stroke-linejoin": "round" }),
        line({ d: "M9.6 14.4L14.4 9.6", "stroke-width": "2.05" }),
        shape("path", { d: "M14.2 10.1A4.2 4.2 0 0 0 8 9.7L5.3 12.4A4.2 4.2 0 1 0 11.2 18.3L12.7 16.8", fill: "none", stroke: "currentColor", "stroke-width": "2.05", "stroke-linecap": "round", "stroke-linejoin": "round" })
      );
      return svg;
    }

    if (normalizedKey === "problem") {
      svg.append(
        shape("circle", { cx: "12", cy: "12", r: "8.2", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M9.6 9.3A2.7 2.7 0 0 1 12 7.8C13.8 7.8 15.1 8.9 15.1 10.4C15.1 11.7 14.2 12.4 12.9 13.2C12.2 13.6 11.9 14 11.9 14.8" }),
        shape("circle", { cx: "12", cy: "17.5", r: "0.9", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "topos") {
      svg.append(
        shape("path", { d: "M3.5 11.1L8.3 5.3L11 8.6L14.4 4.5L20.5 11.1L18.9 20.4H5.1Z", fill: "var(--paper)", stroke: "none" }),
        shape("path", { d: "M3.5 11.1L8.3 5.3L11 8.6L14.4 4.5L20.5 11.1", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.85" }),
        shape("path", { d: "M12.1 8.2C10.8 9.2 10.5 10.7 11.7 12.3C13 14.1 13.4 15.6 12.2 17.3C11.5 18.3 10.4 19.3 9.1 20.4H15.1C16 19.1 16.4 17.8 15.9 16.4C15.4 15.1 14.3 14.1 13.6 12.9C12.7 11.4 13.4 10.1 15 8.2Z", fill: "currentColor", "fill-opacity": "0.84" }),
        shape("path", { d: "M7.7 6.1L9.5 8.7L10.8 7.8", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.25", "stroke-opacity": "0.45" })
      );
      return svg;
    }

    if (normalizedKey === "torus") {
      svg.append(
        shape("path", { d: "M3.2 12.15C3.2 9.1 7.1 6.75 12 6.75C16.9 6.75 20.8 9.1 20.8 12.15C20.8 15.2 16.9 17.55 12 17.55C7.1 17.55 3.2 15.2 3.2 12.15ZM8.55 11.3C8.55 12.45 10.1 13.3 12 13.3C13.9 13.3 15.45 12.45 15.45 11.3C15.45 10.15 13.9 9.3 12 9.3C10.1 9.3 8.55 10.15 8.55 11.3Z", fill: "currentColor", "fill-rule": "evenodd", "clip-rule": "evenodd", "fill-opacity": "0.24" }),
        shape("path", { d: "M3.85 12.6C4.55 15.45 7.95 17.4 12 17.4C16.05 17.4 19.45 15.45 20.15 12.6C18.85 15.05 15.7 16.45 12 16.45C8.3 16.45 5.15 15.05 3.85 12.6Z", fill: "currentColor", "fill-opacity": "0.22" }),
        shape("ellipse", { cx: "12", cy: "12.15", rx: "8.8", ry: "5.4", fill: "none", stroke: "currentColor", "stroke-width": "2.1" }),
        shape("ellipse", { cx: "12", cy: "11.3", rx: "3.45", ry: "2", fill: "var(--paper)", stroke: "currentColor", "stroke-width": "1.8" }),
        line({ d: "M5.3 10.25C6.7 8.55 9.15 7.65 12 7.65C14.85 7.65 17.3 8.55 18.7 10.25", "stroke-width": "1.2", "stroke-opacity": "0.48" }),
        line({ d: "M8.9 12.65C9.65 13.35 10.75 13.75 12 13.75C13.25 13.75 14.35 13.35 15.1 12.65", "stroke-width": "1.15", "stroke-opacity": "0.58" })
      );
      return svg;
    }

    if (normalizedKey === "dynamical-system") {
      svg.append(
        line({ d: "M12 4.15C15.45 5.1 16.2 8.55 12 12", "stroke-width": "1.65" }),
        line({ d: "M12 4.15C15.45 5.1 16.2 8.55 12 12", transform: "rotate(72 12 12)", "stroke-width": "1.65" }),
        line({ d: "M12 4.15C15.45 5.1 16.2 8.55 12 12", transform: "rotate(144 12 12)", "stroke-width": "1.65" }),
        line({ d: "M12 4.15C15.45 5.1 16.2 8.55 12 12", transform: "rotate(216 12 12)", "stroke-width": "1.65" }),
        line({ d: "M12 4.15C15.45 5.1 16.2 8.55 12 12", transform: "rotate(288 12 12)", "stroke-width": "1.65" })
      );
      return svg;
    }

    if (normalizedKey === "logic") {
      svg.append(
        line({ d: "M7.8 5.2V18.8", "stroke-width": "2.35" }),
        line({ d: "M7.9 9.1H18.3", "stroke-width": "2.35" }),
        line({ d: "M7.9 14.9H18.3", "stroke-width": "2.35" })
      );
      return svg;
    }

    if (normalizedKey === "tensor") {
      svg.append(
        shape("circle", { cx: "12", cy: "12", r: "7.25", fill: "none", stroke: "currentColor", "stroke-width": "2.15" }),
        line({ d: "M8.3 8.3L15.7 15.7", "stroke-width": "2.45" }),
        line({ d: "M15.7 8.3L8.3 15.7", "stroke-width": "2.45" })
      );
      return svg;
    }

    if (normalizedKey === "category") {
      svg.append(
        line({ d: "M4.6 6.3H19.1", "stroke-width": "1.95" }),
        line({ d: "M16.9 4.35L19.1 6.3L16.9 8.25", "stroke-width": "1.95" }),
        line({ d: "M5.3 9.15L10.75 14.6", "stroke-width": "1.9" }),
        line({ d: "M8.25 14.25L10.75 14.6L10.4 12.1", "stroke-width": "1.9" }),
        line({ d: "M13.25 14.6L18.25 10.05", "stroke-width": "1.9" }),
        line({ d: "M17.25 12.35L18.25 10.05L15.9 11", "stroke-width": "1.9" })
      );
      return svg;
    }

    if (normalizedKey === "combinatorics") {
      svg.append(
        shape("path", { d: "M6.5 7.2L17.5 5.1M6.5 7.2L17.5 12M6.5 7.2L17.5 18.9M6.5 16.8L17.5 5.1M6.5 16.8L17.5 12M6.5 16.8L17.5 18.9", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.55", "stroke-opacity": "0.72" }),
        shape("circle", { cx: "6.5", cy: "7.2", r: "1.2", fill: "currentColor" }),
        shape("circle", { cx: "6.5", cy: "16.8", r: "1.2", fill: "currentColor" }),
        shape("circle", { cx: "17.5", cy: "5.1", r: "1.2", fill: "currentColor" }),
        shape("circle", { cx: "17.5", cy: "12", r: "1.2", fill: "currentColor" }),
        shape("circle", { cx: "17.5", cy: "18.9", r: "1.2", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "automaton-piece") {
      svg.append(
        line({ d: "M9.6 7.65C11.05 6.55 12.95 6.55 14.4 7.65", "stroke-width": "1.9" }),
        line({ d: "M11.9 7.15L14.4 7.65L13.8 5.2", "stroke-width": "1.9" }),
        line({ d: "M14.4 16.35C12.95 17.45 11.05 17.45 9.6 16.35", "stroke-width": "1.9" }),
        line({ d: "M12.1 16.85L9.6 16.35L10.2 18.8", "stroke-width": "1.9" }),
        shape("circle", { cx: "6.55", cy: "12", r: "2.75", fill: "var(--paper)", stroke: "currentColor", "stroke-width": "1.95" }),
        shape("circle", { cx: "17.45", cy: "12", r: "2.75", fill: "var(--paper)", stroke: "currentColor", "stroke-width": "1.95" })
      );
      return svg;
    }

    if (normalizedKey === "pawn") {
      svg.append(
        shape("circle", { cx: "12", cy: "6.5", r: "2.65", fill: "currentColor" }),
        shape("path", { d: "M8.8 10.2H15.2L16.4 17H18.1V20H5.9V17H7.6Z", fill: "currentColor" }),
        shape("rect", { x: "7.2", y: "14.8", width: "9.6", height: "2.4", rx: "1.2", fill: "currentColor" })
      );
      return svg;
    }

    if (normalizedKey === "river") {
      svg.append(
        shape("path", { d: "M4.4 7.2C6.6 5.8 8.7 5.8 10.9 7.2C13.1 8.6 15.4 8.6 19.6 6.8", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2.15" }),
        shape("path", { d: "M4.4 12C7.1 10.2 9.7 10.2 12.1 12C14.4 13.7 16.7 13.7 19.6 12", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2.15" }),
        shape("path", { d: "M4.4 16.8C6.6 15 8.9 15 11.1 16.8C13.3 18.6 15.6 18.6 19.6 16.4", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2.15" })
      );
      return svg;
    }

    if (normalizedKey === "award") {
      svg.append(
        shape("circle", { cx: "12", cy: "9.6", r: "3.5", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
        line({ d: "M10.3 13.1L8.8 18.7L12 16.9L15.2 18.7L13.7 13.1" }),
        line({ d: "M10.7 9.8L11.7 10.8L13.8 8.7" })
      );
      return svg;
    }

    if (normalizedKey === "pencil") {
      svg.append(
        shape("path", { d: "M5.1 17.8L6.2 13.6L15 4.8C15.9 3.9 17.3 3.9 18.2 4.8L19.1 5.7C20 6.6 20 8 19.1 8.9L10.3 17.7Z", fill: "currentColor", "fill-opacity": "0.22", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.8" }),
        shape("path", { d: "M6.2 13.6L10.3 17.7L5.1 17.8Z", fill: "var(--paper)", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.55" }),
        shape("path", { d: "M5.1 17.8L7 16.6L6.3 15.9Z", fill: "currentColor" }),
        line({ d: "M13.8 6L17.9 10.1", "stroke-width": "1.75" }),
        line({ d: "M15.5 4.9L19 8.4", "stroke-width": "1.45" })
      );
      return svg;
    }

    if (normalizedKey === "education" || normalizedKey === "book") {
      svg.append(
        shape("path", { d: "M5.5 6.6c0-1 .8-1.8 1.8-1.8h4.7c1.2 0 2.3.5 3 1.4c.7-.9 1.8-1.4 3-1.4h.7v13.7h-.7c-1.2 0-2.3.5-3 1.4c-.7-.9-1.8-1.4-3-1.4H7.3c-1 0-1.8-.8-1.8-1.8Z", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
        line({ d: "M15 6.2V19.3" })
      );
      return svg;
    }

    svg.append(
      line({ d: "M6.4 12H17.6" }),
      line({ d: "M12 6.4V17.6" })
    );
    return svg;
  }

  function uiIcon(key, className = "ui-icon") {
    const span = el("span", className);
    span.dataset.iconKey = key;
    span.setAttribute("aria-hidden", "true");
    span.append(uiIconSvg(key));
    return span;
  }

  function appendTagParts(parent, label, iconClassName = "tag-icon", labelClassName = "tag-label") {
    const iconClasses = iconClassName.includes("ui-icon") ? iconClassName : `ui-icon ${iconClassName}`;
    parent.append(uiIcon(tagIconKey(label), iconClasses), el("span", labelClassName, label));
  }

  function searchResultTitleText(title = "") {
    return normalizedUiText(title).replace(/^cloud:\s*/i, "");
  }

  function symbolicCloudPenLabel(value = "") {
    return normalizedUiText(value).replace(/^cloud:\s*/i, "");
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function titleCopyButton(href, title = "") {
    const button = el("button", "title-copy-link");
    const url = publicHref(href);
    button.type = "button";
    button.dataset.copyHref = url;
    button.dataset.copyPreview = `copy: ${url}`;
    button.setAttribute("aria-label", title ? `Copy link to ${title}` : "Copy link");
    button.title = `copy: ${url}`;
    button.append(uiIcon("link", "title-copy-link-icon"), el("span", "title-copy-link-status"));
    button.addEventListener("click", async () => {
      try {
        await copyTextToClipboard(url);
        button.classList.add("is-copied");
        button.classList.remove("is-failed");
        button.querySelector(".title-copy-link-status").textContent = "Copied!";
        button.setAttribute("aria-label", "Copied!");
        setTimeout(() => {
          button.classList.remove("is-copied");
          button.querySelector(".title-copy-link-status").textContent = "";
          button.setAttribute("aria-label", title ? `Copy link to ${title}` : "Copy link");
        }, 1400);
      } catch (_error) {
        button.classList.add("is-failed");
        button.classList.remove("is-copied");
        button.querySelector(".title-copy-link-status").textContent = "Failed";
        setTimeout(() => {
          button.classList.remove("is-failed");
          button.querySelector(".title-copy-link-status").textContent = "";
        }, 1400);
      }
    });
    return button;
  }

  function appendActionLinks(parent, records) {
    if (!records || !records.length) return;
    const actions = el("div", "action-links");
    records.forEach((record) => {
      const [label, href] = record;
      if (href) actions.append(link(symbolicCloudPenLabel(label), href, "action-link"));
    });
    if (actions.children.length) parent.append(actions);
  }

  function loadScriptOnce(src) {
    const key = new URL(src, document.baseURI).href;
    if (dynamicScriptLoads.has(key)) return dynamicScriptLoads.get(key);
    const promise = new Promise((resolve, reject) => {
      const existing = Array.from(document.scripts).find((script) => script.src === key);
      if (existing?.dataset.dynamicLoaded === "true") {
        resolve();
        return;
      }
      const node = existing || document.createElement("script");
      node.addEventListener("load", () => {
        node.dataset.dynamicLoaded = "true";
        resolve();
      }, { once: true });
      node.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      if (!existing) {
        node.defer = true;
        node.src = src;
        document.body.append(node);
      }
    });
    dynamicScriptLoads.set(key, promise);
    return promise;
  }

  function loadStylesheetOnce(href) {
    const key = new URL(href, document.baseURI).href;
    if (dynamicStylesheetLoads.has(key)) return dynamicStylesheetLoads.get(key);
    const promise = new Promise((resolve, reject) => {
      if (Array.from(document.styleSheets).some((sheet) => sheet.href === key)) {
        resolve();
        return;
      }
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = href;
      linkElement.addEventListener("load", resolve, { once: true });
      linkElement.addEventListener("error", () => reject(new Error(`Failed to load ${href}`)), { once: true });
      document.head.append(linkElement);
    });
    dynamicStylesheetLoads.set(key, promise);
    return promise;
  }

  function ensureKatexAssets() {
    if (globalThis.renderMathInElement) return Promise.resolve();
    if (!katexLoadPromise) {
      katexLoadPromise = Promise.all([
        loadStylesheetOnce(`${katexCdnBase}/katex.min.css`),
        loadScriptOnce(`${katexCdnBase}/katex.min.js`).then(() =>
          loadScriptOnce(`${katexCdnBase}/contrib/auto-render.min.js`)
        )
      ]).then(() => {
        if (!globalThis.renderMathInElement) throw new Error("KaTeX auto-render did not initialize.");
      });
    }
    return katexLoadPromise;
  }

  function rootContainsTeX(root) {
    return /\\\(|\\\[/.test(root?.textContent || "");
  }

  function renderMathNow(root = document.body) {
    if (!globalThis.renderMathInElement) return;
    globalThis.renderMathInElement(root, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false,
      strict: "ignore"
    });
  }

  function typesetMath(root = document.body) {
    if (!root || !rootContainsTeX(root)) return;
    if (globalThis.renderMathInElement) {
      renderMathNow(root);
      return;
    }
    ensureKatexAssets()
      .then(() => {
        if (root === document.body || root.isConnected) renderMathNow(root);
      })
      .catch(() => {});
  }

  function scrollToHashTarget() {
    if (!globalThis.location?.hash) return;
    const id = decodeURIComponent(globalThis.location.hash.slice(1));
    const target = document.getElementById(id);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }

  function timelineUtc(year, month = 6, day = 15) {
    return Date.UTC(Number(year), month, Number(day));
  }

  function timelineTimeFromValue(value, fallbackYear = "", month = 5, day = 15) {
    const text = String(value || fallbackYear || "");
    if (!text) return Number.NaN;
    if (/^\d{4}-\d{2}-\d{2}/.test(text)) return Date.parse(`${text.slice(0, 10)}T00:00:00Z`);
    const yearMonth = text.match(/\b(19\d{2}|20\d{2})-(\d{2})\b/);
    if (yearMonth) return timelineUtc(yearMonth[1], Number(yearMonth[2]) - 1, day);
    const year = text.match(/\b(19\d{2}|20\d{2})\b/)?.[1];
    if (year) return timelineUtc(year, month, day);
    return Number.NaN;
  }

  function explicitTimelineTime(value) {
    const text = String(value || "");
    const explicit = text.match(/\b(19\d{2}|20\d{2})-(\d{2})-(\d{2})\b/);
    if (explicit) return timelineUtc(explicit[1], Number(explicit[2]) - 1, explicit[3]);
    const yearMonth = text.match(/\b(19\d{2}|20\d{2})-(\d{2})\b/);
    if (yearMonth) return timelineUtc(yearMonth[1], Number(yearMonth[2]) - 1, 15);
    return Number.NaN;
  }

  function explicitTimelineLabel(value) {
    return String(value || "").match(/\b(19\d{2}|20\d{2})(?:-\d{2})?(?:-\d{2})?\b/)?.[0] || "";
  }

  function arxivDateFromId(id) {
    const text = String(id || "");
    const modern = text.match(/^(\d{2})(\d{2})\./);
    if (!modern) return Number.NaN;
    const year = Number(modern[1]) + (Number(modern[1]) >= 90 ? 1900 : 2000);
    return timelineUtc(year, Number(modern[2]) - 1, 15);
  }

  function themeTagLabel(themeId) {
    return themeById(themeId)?.label || themeId;
  }

  function metaTagLabel(tagId) {
    return metaTagById(tagId)?.label || tagId;
  }

  function metaTagIconKey(tagId) {
    return metaTagById(tagId)?.icon || tagIconKey(metaTagLabel(tagId));
  }

  function paperAnchor(paper) {
    return `paper-${slugify(paper.title)}`;
  }

  function noteAnchor(note) {
    return `note-${slugify(note.file || note.title)}`;
  }

  function talkRecordKey(record) {
    return slugify(compactText([record.date, record.title, record.event, record.link || record.href]).join(" "));
  }

  function talkRecordAnchor(record) {
    return `talk-${talkRecordKey(record)}`;
  }

  function paperPageHref(anchor = "") {
    return `works/papers/index.html${anchor ? `#${anchor}` : ""}`;
  }

  function notesPageHref(anchor = "") {
    return `works/notes-preparations/index.html${anchor ? `#${anchor}` : ""}`;
  }

  function talksPageHref(anchor = "") {
    return `works/talks-slides/index.html${anchor ? `#${anchor}` : ""}`;
  }

  function applyLanguage() {}

  function setupLanguage() {
    const nav = document.querySelector(".site-nav");
    if (!nav || nav.querySelector("[data-site-search-link]")) return;
    const searchLink = link("", localHref("search/index.html"));
    searchLink.className = "nav-search";
    searchLink.dataset.siteSearchLink = "";
    searchLink.setAttribute("aria-label", "Search");
    const icon = el("span", "search-icon");
    icon.setAttribute("aria-hidden", "true");
    searchLink.append(icon, el("span", "sr-only", "Search"));
    nav.append(searchLink);
  }

  function themeSelectionLabel(themeIds) {
    if (!themeIds.length) return "All themes";
    if (themeIds.length > 2) return `${themeIds.length} themes`;
    return themeIds.map((themeId) => themeById(themeId)?.label || themeId).join(" + ");
  }

  function metaTagSelectionLabel(metaTagIds) {
    if (!metaTagIds.length) return "";
    if (metaTagIds.length > 2) return `${metaTagIds.length} meta tags`;
    return metaTagIds.map(metaTagLabel).join(" + ");
  }

  function researchSelectionLabel(themeIds, metaTagIds) {
    const themeLabel = themeSelectionLabel(themeIds);
    const metaLabel = metaTagSelectionLabel(metaTagIds);
    return metaLabel ? `${themeLabel} / ${metaLabel}` : themeLabel;
  }

  function researchThemeGroups() {
    return [
      ["papers", "Papers", (record) => record.kind === "Papers"],
      ["preparation", "In preparation", (record) => record.kind === "In preparation"],
      ["notes", "Notes", (record) => record.kind === "Notes"],
      ["talks", "Talks", (record) => record.kind === "Talks"]
    ];
  }

  function themedNoteSearchRecords() {
    if (!dataSet().talks) return [];
    return allNoteRecords()
      .filter((note) => note.file !== "Notion archive")
      .map((note) => {
        const theme = noteTheme(note);
        const themeHints = compactText([theme, ...(note.themes || [])]);
        const text = compactText([
          note.title,
          note.description,
          note.language,
          note.file,
          theme,
          noteThemeLabel(theme),
          ...(note.themes || []),
          ...(note.keywords || [])
        ]).join(" ");
        return {
          kind: "Notes",
          title: symbolicNoteTitle(note),
          href: noteHref(note),
          year: noteDateLabel(note),
          summary: compactText([note.language, note.description || note.file]).join(" / "),
          metaTags: metaTagIdsForText(text, note.metaTags || []),
          text,
          ...scoreThemeRecord(text, themeHints)
        };
      })
      .filter((record) => record.themes.length);
  }

  function researchMapRecords() {
    const base = dataSet().search?.records || [];
    if (!dataSet().talks) return base.filter((record) => record.kind !== "Slides");
    return [
      ...base.filter((record) => record.kind !== "Notes" && record.kind !== "Slides"),
      ...themedNoteSearchRecords()
    ];
  }

  function currentResearchThemeSelection() {
    return normalizeThemeSelection(state.researchTheme);
  }

  function currentResearchMetaTagSelection() {
    return normalizeMetaTagSelection(state.researchMetaTag);
  }

  function themeSelectionScore(record, themeIds) {
    const scores = record.scores || {};
    if (!themeIds.length) return record.bestScore || record.themes?.length || 0;
    return themeIds.reduce((score, themeId) => {
      const fallbackScore = (record.themes || []).includes(themeId) ? 1 : 0;
      return score + (scores[themeId] || fallbackScore);
    }, 0);
  }

  function topThemeRecords(kind, selection = "", metaSelection = "") {
    const themeIds = normalizeThemeSelection(selection);
    const metaTagIds = normalizeMetaTagSelection(metaSelection);
    const group = researchThemeGroups().find(([id]) => id === kind);
    const records = researchMapRecords();
    return records
      .filter((record) => group?.[2]?.(record))
      .filter((record) => !themeIds.length || themeIds.every((themeId) => (record.themes || []).includes(themeId)))
      .filter((record) => !metaTagIds.length || metaTagIds.every((tagId) => (record.metaTags || []).includes(tagId)))
      .sort((a, b) => themeSelectionScore(b, themeIds) - themeSelectionScore(a, themeIds) || a.title.localeCompare(b.title));
  }

  function researchThemeItemCount(selection = "", metaSelection = "") {
    return researchThemeGroups().reduce((total, [kind]) => total + topThemeRecords(kind, selection, metaSelection).length, 0);
  }

  function themeChoiceCountLabel(count) {
    return `${count} ${count === 1 ? "item" : "items"}`;
  }

  function themeColumnCountLabel(count) {
    return `(${count})`;
  }

  function renderThemeResultIcons(themeIds = [], metaTagIds = []) {
    const strip = el("div", "theme-result-icons");
    normalizeThemeSelection(themeIds).forEach((themeId) => {
      const label = themeTagLabel(themeId);
      const icon = uiIcon(tagIconKey(label), "theme-result-icon tag-icon");
      icon.title = label;
      icon.setAttribute("aria-label", label);
      strip.append(icon);
    });
    normalizeMetaTagSelection(metaTagIds).forEach((tagId) => {
      const label = metaTagLabel(tagId);
      const icon = uiIcon(metaTagIconKey(tagId), "theme-result-meta-icon tag-icon");
      icon.title = label;
      icon.setAttribute("aria-label", label);
      strip.append(icon);
    });
    return strip;
  }

  function renderThemeResult(record, selection = "", metaSelection = "") {
    const themeIds = normalizeThemeSelection(selection);
    const metaTagIds = normalizeMetaTagSelection(metaSelection);
    const item = el("article", `theme-result${themeIds.length || metaTagIds.length ? " is-active" : ""}`);
    item.dataset.themes = (record.themes || []).join(" ");
    item.dataset.metaTags = (record.metaTags || []).join(" ");
    const heading = el("h4");
    heading.append(link(searchResultTitleText(record.title), record.href));
    item.append(renderThemeResultIcons(record.themes, record.metaTags), heading);
    const meta = themeRecordMeta(record);
    if (meta) item.append(el("p", "theme-result-meta", meta));
    return item;
  }

  function themeRecordMeta(record) {
    if (record.kind === "In preparation") return "In preparation";
    if (record.kind === "Papers") {
      const tail = String(record.text || "")
        .replace(record.title || "", "")
        .replace(record.summary || "", "")
        .replace(/\s+/g, " ")
        .trim();
      return tail || compactText([record.year, record.summary]).join(" / ");
    }
    if (record.kind === "Notes" || record.kind === "Slides") {
      const language = /\bJapanese\b/.test(record.text || "") ? "Japanese" : /\bEnglish\b/.test(record.text || "") ? "English" : "";
      return compactText([language, record.summary || record.year]).join(" / ");
    }
    return compactText([record.year, record.summary]).join(" / ");
  }

  function renderResearchMapResults(selection = "", options = {}) {
    const root = document.querySelector("#research-map");
    if (!root) return;
    const { updateStatus = true, metaSelection = currentResearchMetaTagSelection() } = options;
    const themeIds = normalizeThemeSelection(selection);
    const metaTagIds = normalizeMetaTagSelection(metaSelection);
    const status = root.querySelector("[data-theme-status]");
    const groups = researchThemeGroups();
    const counts = groups.map(([kind]) => topThemeRecords(kind, themeIds, metaTagIds).length);
    if (status && updateStatus) {
      status.replaceChildren(
        el("span", "theme-status-label", researchSelectionLabel(themeIds, metaTagIds)),
        el("span", "theme-status-count", `${counts[0]} papers / ${counts[1]} in preparation / ${counts[2]} notes / ${counts[3]} talks`)
      );
    }
    groups.forEach(([kind], index) => {
      const list = root.querySelector(`[data-theme-results="${kind}"]`);
      if (!list) return;
      const headingCount = root.querySelector(`[data-theme-heading-count="${kind}"]`);
      if (headingCount) headingCount.textContent = themeColumnCountLabel(counts[index] || 0);
      list.replaceChildren();
      const records = topThemeRecords(kind, themeIds, metaTagIds);
      if (!records.length) {
        list.append(el("p", "empty-state", "No linked items yet."));
        return;
      }
      records.forEach((record) => list.append(renderThemeResult(record, themeIds, metaTagIds)));
    });
    typesetMath(root);
  }

  function renderThemeChoice(label, selection = "") {
    const button = el("button", "theme-choice");
    const themeIds = normalizeThemeSelection(selection);
    const countLabel = themeChoiceCountLabel(researchThemeItemCount(themeIds, currentResearchMetaTagSelection()));
    button.type = "button";
    button.dataset.themeChoice = themeIds.join(" ");
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `${label}, ${countLabel}`);
    appendTagParts(button, label, "theme-choice-icon tag-icon", "theme-choice-label");
    button.append(el("span", "theme-choice-count", countLabel));
    button.addEventListener("click", () => {
      if (themeIds.length) toggleResearchThemeSelection(themeIds);
      else setResearchThemeSelection("");
    });
    return button;
  }

  function renderMetaTagChoice(tag) {
    const button = el("button", `theme-choice meta-theme-choice meta-theme-choice-${tag.id}`);
    const metaTagIds = normalizeMetaTagSelection(tag.id);
    const countLabel = themeChoiceCountLabel(researchThemeItemCount(currentResearchThemeSelection(), metaTagIds));
    button.type = "button";
    button.dataset.metaTagChoice = tag.id;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `${tag.label}, ${countLabel}`);
    button.append(uiIcon(metaTagIconKey(tag.id), "theme-choice-icon tag-icon"), el("span", "theme-choice-label", tag.label));
    button.append(el("span", "theme-choice-count", countLabel));
    button.addEventListener("click", () => toggleResearchMetaTagSelection(tag.id));
    return button;
  }

  function updateResearchThemeControls(root, themeIds, className = "is-active") {
    root.querySelectorAll("[data-theme-choice]").forEach((choice) => {
      const choiceThemeIds = normalizeThemeSelection(choice.dataset.themeChoice);
      const isActive = themeIds.length ? choiceThemeIds.length === 1 && themeIds.includes(choiceThemeIds[0]) : !choiceThemeIds.length;
      choice.classList.toggle(className, isActive);
      if (className === "is-active") choice.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    if (className === "is-active") {
      const metaTagIds = currentResearchMetaTagSelection();
      root.querySelectorAll("[data-meta-tag-choice]").forEach((choice) => {
        const isActive = metaTagIds.includes(choice.dataset.metaTagChoice);
        choice.classList.toggle("is-active", isActive);
        choice.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }
  }

  function updateResearchChoiceCounts(root) {
    const themeIds = currentResearchThemeSelection();
    const metaTagIds = currentResearchMetaTagSelection();
    root.querySelectorAll("[data-theme-choice]").forEach((choice) => {
      const choiceThemeIds = normalizeThemeSelection(choice.dataset.themeChoice);
      const countLabel = themeChoiceCountLabel(researchThemeItemCount(choiceThemeIds, metaTagIds));
      const count = choice.querySelector(".theme-choice-count");
      if (count) count.textContent = countLabel;
    });
    root.querySelectorAll("[data-meta-tag-choice]").forEach((choice) => {
      const choiceMetaTagIds = normalizeMetaTagSelection(choice.dataset.metaTagChoice);
      const countLabel = themeChoiceCountLabel(researchThemeItemCount(themeIds, choiceMetaTagIds));
      const count = choice.querySelector(".theme-choice-count");
      if (count) count.textContent = countLabel;
    });
  }

  function setResearchThemeSelection(selection = "") {
    const themeIds = normalizeThemeSelection(selection);
    state.researchTheme = themeIds.join(" ");
    const root = document.querySelector("#research-map");
    if (!root) return;
    const metaTagIds = currentResearchMetaTagSelection();
    root.classList.toggle("has-active-theme", Boolean(themeIds.length || metaTagIds.length));
    updateResearchThemeControls(root, themeIds);
    updateResearchChoiceCounts(root);
    renderResearchMapResults(themeIds, { metaSelection: metaTagIds });
  }

  function setResearchMetaTagSelection(selection = "") {
    const metaTagIds = normalizeMetaTagSelection(selection);
    state.researchMetaTag = metaTagIds.join(" ");
    const root = document.querySelector("#research-map");
    if (!root) return;
    const themeIds = currentResearchThemeSelection();
    root.classList.toggle("has-active-theme", Boolean(themeIds.length || metaTagIds.length));
    updateResearchThemeControls(root, themeIds);
    updateResearchChoiceCounts(root);
    renderResearchMapResults(themeIds, { metaSelection: metaTagIds });
  }

  function toggleResearchThemeSelection(selection = "") {
    const toggledThemeIds = normalizeThemeSelection(selection);
    if (!toggledThemeIds.length) {
      setResearchThemeSelection("");
      return;
    }
    const currentSet = new Set(currentResearchThemeSelection());
    const shouldRemove = toggledThemeIds.every((themeId) => currentSet.has(themeId));
    if (shouldRemove) toggledThemeIds.forEach((themeId) => currentSet.delete(themeId));
    else toggledThemeIds.forEach((themeId) => currentSet.add(themeId));
    setResearchThemeSelection(researchThemes().map((theme) => theme.id).filter((themeId) => currentSet.has(themeId)));
  }

  function toggleResearchMetaTagSelection(selection = "") {
    const toggledTagIds = normalizeMetaTagSelection(selection);
    if (!toggledTagIds.length) {
      setResearchMetaTagSelection("");
      return;
    }
    const currentSet = new Set(currentResearchMetaTagSelection());
    const shouldRemove = toggledTagIds.every((tagId) => currentSet.has(tagId));
    if (shouldRemove) toggledTagIds.forEach((tagId) => currentSet.delete(tagId));
    else toggledTagIds.forEach((tagId) => currentSet.add(tagId));
    setResearchMetaTagSelection(researchMetaTags().map((tag) => tag.id).filter((tagId) => currentSet.has(tagId)));
  }

  function renderResearchMap() {
    const root = document.querySelector("#research-map");
    if (!root) return;
    root.replaceChildren();
    const layout = el("div", "research-map-layout");
    const mapColumn = el("div", "theme-map-column");
    const overview = el("div", "theme-overview");
    const choices = el("div", "theme-choice-list");
    researchThemes().forEach((theme) => choices.append(renderThemeChoice(theme.label, theme.id)));
    const metaChoices = el("div", "theme-choice-list meta-theme-choice-list");
    researchMetaTags().forEach((tag) => metaChoices.append(renderMetaTagChoice(tag)));
    overview.append(choices, metaChoices);
    mapColumn.append(overview);
    const panel = el("div", "theme-panel");
    const columns = el("div", "theme-result-grid");
    researchThemeGroups().forEach(([kind, label]) => {
      const column = el("section", "theme-result-column");
      const heading = el("h3");
      const count = el("span", "theme-result-count", themeColumnCountLabel(0));
      count.dataset.themeHeadingCount = kind;
      heading.append(el("span", null, label), count);
      const list = el("div", "theme-result-list");
      list.dataset.themeResults = kind;
      column.append(heading, list);
      columns.append(column);
    });
    panel.append(columns);
    layout.append(mapColumn, panel);
    root.append(layout);
    setResearchMetaTagSelection(currentResearchMetaTagSelection());
    setResearchThemeSelection(currentResearchThemeSelection());
  }

  function canonicalArxivHref(href) {
    const text = String(href || "").trim();
    const match = text.match(/^https?:\/\/arxiv\.org\/(abs|pdf)\/([^?#]+?)(?:\.pdf)?(?:[?#].*)?$/i);
    if (!match) return text;
    const kind = match[1].toLowerCase();
    const id = match[2].replace(/v\d+$/i, "");
    return `https://arxiv.org/${kind}/${id}`;
  }

  function normalizedPublicationLinks(links = []) {
    const seen = new Set();
    return (links || [])
      .map(([label, href]) => {
        const cleanHref = canonicalArxivHref(href);
        if (!cleanHref) return null;
        let cleanLabel = normalizedUiText(label || "Link");
        if (/^url$/i.test(cleanLabel) && /arxiv\.org\/abs\//i.test(cleanHref)) cleanLabel = "arXiv";
        if (/^url$/i.test(cleanLabel) && /arxiv\.org\/pdf\//i.test(cleanHref)) cleanLabel = "PDF";
        return [cleanLabel, cleanHref];
      })
      .filter(Boolean)
      .filter(([label, href]) => {
        const key = `${simplified(label)}:${href}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function paperDataPapers() {
    return dataSet().papers?.papers || { published: [], preprints: [], preparation: [], misc: [] };
  }

  function paperFigureTemplates() {
    return {
      ...(dataSet().papers?.paperFigureTemplates || {}),
      ...latestPaperFigureTemplates
    };
  }

  function paperThemeText(paper) {
    return compactText([paper.title, paper.authors, paper.summary]).join(" ");
  }

  function paperThemeIds(paper) {
    return paper.themes?.length ? paper.themes : scoreThemeRecord(paperThemeText(paper)).themes;
  }

  function paperMetaTagIds(paper) {
    return metaTagIdsForText(paperThemeText(paper), paper.metaTags || []);
  }

  function paperDisplayTagRecords(paper) {
    return [
      ...paperThemeIds(paper).map((themeId) => ({ label: themeTagLabel(themeId), themeId, kind: "theme" })),
      ...paperMetaTagIds(paper).map((metaTagId) => ({ label: metaTagLabel(metaTagId), metaTagId, kind: "meta" }))
    ];
  }

  function paperReviewRecord(paper) {
    const venue = String(paper?.venue || "");
    const linkHref = String(paper?.link || "");
    const status = paper?.status || (/arxiv/i.test(venue) || /arxiv\.org/i.test(linkHref) ? "preprint" : "published");
    return {
      badges: [
        {
          status,
          label: status === "draft" ? "Draft" : status === "preprint" ? "Preprint" : "Published",
          title: paper?.source || ""
        }
      ]
    };
  }

  function contentReviewClass(status) {
    return slugify(status || "review");
  }

  function contentReviewBadge(status, label, title = "") {
    const badge = el("span", `content-review-badge review-${contentReviewClass(status)}`, label);
    if (title) badge.title = title;
    return badge;
  }

  function appendContentReviewBadges(root, badges = []) {
    badges.filter(Boolean).forEach((badge) => root.append(contentReviewBadge(badge.status, badge.label, badge.title)));
  }

  function publicationDetail(label, value) {
    if (!value) return null;
    const item = el("div", "publication-detail");
    if (label) item.append(el("span", "publication-detail-label", label));
    else item.classList.add("is-unlabeled");
    item.append(el("span", "publication-detail-value", value));
    return item;
  }

  function paperPeopleDetail(paper) {
    const text = paperPeopleText(paper);
    if (!text) return null;
    const match = text.match(/^([^:]+):\s*(.+)$/);
    return match ? publicationDetail(match[1], match[2]) : publicationDetail("Authors", text);
  }

  function renderPublicationDetails(paper) {
    const details = compactText([
      paperPeopleDetail(paper),
      publicationDetail("", paper.year),
      publicationDetail("", paper.venue)
    ]);
    if (!details.length) return null;
    const root = el("div", "publication-details");
    details.forEach((detail) => root.append(detail));
    return root;
  }

  function renderPaperFigureLoadingDots() {
    const dots = el("div", "loading-dots");
    dots.setAttribute("aria-hidden", "true");
    dots.append(el("span"), el("span"), el("span"));
    return dots;
  }

  function paperFigureModuleId(paper) {
    return paperAnchor(paper);
  }

  function paperFigureScriptPath(moduleId) {
    return localHref(`scripts/paper-figures/${moduleId}.js?v=${paperFigureCacheKey}`);
  }

  function loadPaperFigureScript(moduleId) {
    if (paperFigureScriptCache.has(moduleId)) return paperFigureScriptCache.get(moduleId);
    const promise = loadScriptOnce(paperFigureScriptPath(moduleId));
    paperFigureScriptCache.set(moduleId, promise);
    return promise;
  }

  function hydratePaperFigure(figure) {
    if (!figure || figure.dataset.figureLoaded === "true" || figure.dataset.figureLoading === "true") return;
    const moduleId = figure.dataset.paperFigureModule;
    if (!moduleId) return;
    figure.dataset.figureLoading = "true";
    loadPaperFigureScript(moduleId)
      .then(() => {
        const module = globalThis.paperFigureModules?.[moduleId];
        if (!module?.render) throw new Error(`Missing paper figure module: ${moduleId}`);
        module.render(figure);
        figure.dataset.figureLoaded = "true";
      })
      .catch(() => {
        figure.replaceChildren(el("p", "empty-state", "Diagram failed to load."));
        figure.classList.remove("is-loading");
        figure.classList.add("has-load-error");
      })
      .finally(() => {
        delete figure.dataset.figureLoading;
      });
  }

  function observePaperFigure(figure) {
    if (!figure) return;
    if (!globalThis.IntersectionObserver) {
      setTimeout(() => hydratePaperFigure(figure), 0);
      return;
    }
    if (!paperFigureObserver) {
      paperFigureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          paperFigureObserver.unobserve(entry.target);
          hydratePaperFigure(entry.target);
        });
      }, { rootMargin: "260px 0px" });
    }
    paperFigureObserver.observe(figure);
  }

  function queuePaperFigureHydration(figure) {
    if (!figure) return;
    queuedPaperFigures.push(figure);
    if (paperFigureHydrationScheduled) return;
    paperFigureHydrationScheduled = true;
    const afterPaint = globalThis.requestAnimationFrame || ((callback) => setTimeout(callback, 16));
    afterPaint(() => {
      afterPaint(() => {
        const figures = queuedPaperFigures;
        queuedPaperFigures = [];
        paperFigureHydrationScheduled = false;
        figures.forEach((item) => {
          if (item.isConnected) observePaperFigure(item);
        });
      });
    });
  }

  function renderPublicationTag(tag) {
    const button = el("button", `publication-tag publication-tag-${tag.kind || "tag"}`);
    if (tag.metaTagId) button.classList.add(`publication-tag-${tag.metaTagId}`);
    button.type = "button";
    appendTagParts(button, tag.label, "publication-tag-icon tag-icon");
    if (tag.themeId) button.dataset.paperTheme = tag.themeId;
    else button.dataset.paperTag = tag.query || tag.label;
    button.setAttribute("aria-label", `Show ${tag.label}`);
    button.addEventListener("click", () => activatePublicationTag(tag));
    return button;
  }

  function renderPaperRecord(paper, options = {}) {
    const showFigure = options.showFigure ?? true;
    const hasLazyFigure = showFigure && paper.figure;
    const item = el("article", hasLazyFigure ? "publication-item has-figure" : "publication-item");
    item.id = paperAnchor(paper);
    let deferredFigure = null;
    if (hasLazyFigure) {
      const figure = el("div", "publication-figure");
      figure.classList.add(`publication-figure-${paper.figure}`);
      figure.setAttribute("aria-label", `${paper.title} diagram`);
      figure.classList.add("is-loading");
      figure.dataset.paperFigureModule = paperFigureModuleId(paper);
      figure.append(renderPaperFigureLoadingDots());
      deferredFigure = figure;
    }
    const titleRow = el("div", "publication-title");
    const title = el("h3");
    title.append(link(paper.title, paper.link));
    titleRow.append(title, titleCopyButton(paperPageHref(paperAnchor(paper)), paper.title));
    item.append(titleRow);
    const details = renderPublicationDetails(paper);
    if (details) item.append(details);
    const meta = el("div", "publication-meta");
    paperDisplayTagRecords(paper).forEach((tag) => meta.append(renderPublicationTag(tag)));
    appendContentReviewBadges(meta, paperReviewRecord(paper).badges);
    if (meta.children.length) item.append(meta);
    if (paper.summary) item.append(el("p", "publication-summary", paper.summary));
    appendActionLinks(item, normalizedPublicationLinks(paper.links || []));
    if (deferredFigure) {
      item.append(deferredFigure);
      queuePaperFigureHydration(deferredFigure);
    }
    return item;
  }

  function updatePaperViewButtons() {
    document.querySelectorAll("[data-paper-view]").forEach((button) => {
      const isActive = button.dataset.paperView === state.paperView;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function paperListingTime(paper) {
    return [
      timelineTimeFromValue(paper.publicationDate),
      timelineTimeFromValue(paper.preprintDate),
      arxivDateFromId(String(paper.link || "").match(/arxiv\.org\/abs\/([^/?#]+)/i)?.[1]),
      timelineTimeFromValue(paper.year)
    ].find(Number.isFinite) || 0;
  }

  function paperListingRecords() {
    const papers = paperDataPapers();
    return [
      ...(papers.published || []).map((paper) => ({ ...paper, publicationStatus: "Published" })),
      ...(papers.preprints || []).map((paper) => ({ ...paper, publicationStatus: "Preprint" }))
    ].sort((a, b) => paperListingTime(b) - paperListingTime(a) || a.title.localeCompare(b.title));
  }

  function paperSearchText(paper) {
    const metaTagIds = paperMetaTagIds(paper);
    return compactText([
      paper.title,
      paper.authors,
      paper.venue,
      paper.year,
      paper.summary,
      ...paperDisplayTagRecords(paper).map((tag) => tag.label),
      ...metaTagIds,
      ...metaTagIds.flatMap((tagId) => metaTagById(tagId)?.keywords || [])
    ]).join(" ");
  }

  function activePaperThemeId() {
    return normalizeThemeSelection(state.paperTheme)[0] || "";
  }

  function paperMatchesActiveFilters(paper) {
    const themeId = activePaperThemeId();
    if (themeId && !paperThemeIds(paper).includes(themeId)) return false;
    return matchesQuery(paperSearchText(paper), state.paperQuery);
  }

  function paperSearchHasDocumentFilter() {
    return Boolean(activePaperThemeId() || String(state.paperQuery || "").trim());
  }

  function syncPaperFilterInputs() {
    document.querySelectorAll("#paper-filter").forEach((input) => {
      if (input.value !== state.paperQuery) input.value = state.paperQuery;
    });
  }

  function setPaperFilters({ query = "", theme = "" } = {}) {
    state.paperQuery = query;
    state.paperTheme = normalizeThemeSelection(theme)[0] || "";
    syncPaperFilterInputs();
    renderPapers();
    renderPreparationPapers();
  }

  function setPaperTheme(themeId = "") {
    setPaperFilters({ query: "", theme: themeId });
  }

  function setPaperQuery(query = "") {
    setPaperFilters({ query, theme: "" });
  }

  function activatePublicationTag(tag) {
    if (tag.themeId) setPaperTheme(tag.themeId);
    else setPaperQuery(tag.query || tag.label);
    document.querySelector("#paper-list")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function renderPaperTagButton(label, themeId, count) {
    const button = el("button", "paper-tag-button");
    const activeThemeId = activePaperThemeId();
    const isActive = themeId ? activeThemeId === themeId : !activeThemeId && !state.paperQuery;
    button.type = "button";
    button.dataset.paperTheme = themeId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.disabled = Boolean(themeId && !count);
    appendTagParts(button, label, "paper-tag-icon tag-icon", "paper-tag-label");
    button.append(el("span", "paper-tag-count", String(count)));
    button.addEventListener("click", () => setPaperTheme(themeId));
    return button;
  }

  function renderPaperMetaTagButton(tag, count) {
    const button = el("button", `paper-tag-button paper-tag-button-meta paper-tag-button-${tag.id}`);
    const query = tag.label;
    const isActive = !activePaperThemeId() && simplified(state.paperQuery) === simplified(query);
    button.type = "button";
    button.dataset.paperTag = query;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.disabled = !count;
    button.append(uiIcon(metaTagIconKey(tag.id), "paper-tag-icon tag-icon"), el("span", "paper-tag-label", tag.label));
    button.append(el("span", "paper-tag-count", String(count)));
    button.addEventListener("click", () => setPaperQuery(query));
    return button;
  }

  function allRawDocumentRecords() {
    return dataSet().talks?.notes || [];
  }

  function renderPaperTagIndex(records = paperListingRecords()) {
    const root = document.querySelector("#paper-tag-index");
    if (!root) return;
    if (!paperSearchHasDocumentFilter()) {
      root.replaceChildren();
      return;
    }
    const counts = Object.fromEntries(researchThemes().map((theme) => [theme.id, 0]));
    const metaCounts = Object.fromEntries(researchMetaTags().map((tag) => [tag.id, 0]));
    const preparationRecords = (paperDataPapers().preparation || []).map(preparationPaperRecord);
    const noteRecords = allNoteRecords();
    const slideRecords = allSlideRecords();
    [...records, ...preparationRecords].forEach((paper) => {
      new Set(paperThemeIds(paper)).forEach((themeId) => {
        counts[themeId] = (counts[themeId] || 0) + 1;
      });
      new Set(paperMetaTagIds(paper)).forEach((tagId) => {
        metaCounts[tagId] = (metaCounts[tagId] || 0) + 1;
      });
    });
    [...noteRecords, ...slideRecords].forEach((record) => {
      new Set(documentThemesForPaperSearch(record)).forEach((themeId) => {
        counts[themeId] = (counts[themeId] || 0) + 1;
      });
      new Set(metaTagIdsForText(compactText([record.title, record.description, record.file, record.talkTitle, record.talkMeta]).join(" "), record.metaTags || [])).forEach((tagId) => {
        metaCounts[tagId] = (metaCounts[tagId] || 0) + 1;
      });
    });
    const activeThemeId = activePaperThemeId();
    const activeTheme = themeById(activeThemeId);
    const statusText = activeThemeId
      ? `${activeTheme?.label || activeThemeId}: ${counts[activeThemeId] || 0} items`
      : state.paperQuery
        ? `${state.paperQuery} items`
        : `${records.length} papers / ${preparationRecords.length} in preparation / ${noteRecords.length} notes / ${slideRecords.length} slides`;
    root.replaceChildren();
    const head = el("div", "paper-tag-index-head");
    head.append(el("h3", null, "Tags"), el("span", "paper-tag-index-status", statusText));
    const list = el("div", "paper-tag-list");
    list.append(renderPaperTagButton("All", "", records.length + preparationRecords.length + noteRecords.length + slideRecords.length));
    researchThemes().forEach((theme) => list.append(renderPaperTagButton(theme.label, theme.id, counts[theme.id] || 0)));
    researchMetaTags().forEach((tag) => list.append(renderPaperMetaTagButton(tag, metaCounts[tag.id] || 0)));
    root.append(head, list);
  }

  function renderPaperCompactRecord(paper) {
    const item = el("article", "publication-item publication-item-compact");
    item.id = paperAnchor(paper);
    const title = el("h3");
    title.append(link(paper.title, paper.link));
    item.append(title);
    const meta = compactText([paperPeopleText(paper), paper.year, paper.venue]).join(" / ");
    if (meta) item.append(el("p", "publication-compact-meta", meta));
    if (paper.summary) item.append(el("p", "publication-summary publication-summary-compact", paper.summary));
    item.append(link("Open paper", paper.link, "text-link"));
    return item;
  }

  function worksHashTarget() {
    return decodeURIComponent(globalThis.location?.hash?.slice(1) || "");
  }

  function worksInitialPaperLimit() {
    const hash = worksHashTarget();
    if (document.body?.dataset.worksPapersFull === "true") return Infinity;
    if (state.worksPapersExpanded || paperSearchHasDocumentFilter()) return Infinity;
    if (hash.startsWith("paper-") || hash === "papers" || hash === "in-preparation") return Infinity;
    return worksInitialPaperRecordLimit;
  }

  function renderPapers() {
    const root = document.querySelector("#paper-list");
    if (!root) return;
    syncPaperFilterInputs();
    updatePaperViewButtons();
    root.replaceChildren();
    const records = paperListingRecords();
    renderPaperTagIndex(records);
    const filtered = records.filter(paperMatchesActiveFilters);
    if (!filtered.length) {
      root.append(el("p", "empty-state", "No papers match this filter."));
      return;
    }
    const limit = worksInitialPaperLimit();
    const visibleRecords = Number.isFinite(limit) ? filtered.slice(0, limit) : filtered;
    const useCompactRecords = state.paperView !== "diagram" && Number.isFinite(limit) && !paperSearchHasDocumentFilter();
    visibleRecords.forEach((paper) => {
      root.append(useCompactRecords ? renderPaperCompactRecord(paper) : renderPaperRecord(paper, { showFigure: state.paperView === "diagram" }));
    });
    typesetMath(root);
    scrollToHashTarget();
  }

  const preparationSlideMatches = [
    { title: "Topoi of automata II: Hyperconnected geometric morphisms, syntactic monoids, and language classes", slides: [["Topoi of automata slides", "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf"], ["IRIF slides", "IRIFtoday.pdf"]] },
    { title: "Subtopoi of free monoid actions (with Morgan Rogers)", slides: [["Topoi of automata slides", "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf"]] },
    { title: "Demystifying local state classifiers: local state classifier in a total category with a factorization system (with Yuto Ikeda)", slides: [["Local state classifier slides", "Local state classifier for algebraic language theory.pdf"], ["Automata LSC slides", "IRIF20250527_ver1.pdf"]] },
    { title: "Notes on Rieg theory: semiring with exponentials in logic, profinite arithmetic, enumerative combinatorics, and category theory", slides: [["Counting with exponentiation", "counting-with-exponential-of-groups.pdf"]] },
    { title: "Dynamical systems on pretopological spaces", slides: [["Conway pretopology slides", "Adv20241210_Dynamical_system_on_a_pretopological_space.pdf"], ["Space-Time slides", "Space⋊Time for Conway's Game of Life.pdf"]] },
    { title: "An enriched-categorical origin of \\(\\varepsilon\\)-transition", slides: [["Topoi of automata slides", "IRIFtoday.pdf"], ["Automata LSC slides", "IRIF20250527_ver1.pdf"]] },
    { title: "A topos-theoretic view on Gabriel's theorem", slides: [["Representation theory slides", "A_topos_theoretic_view_of_Gabriel_s_theorem-12.pdf"]] },
    { title: "The lattice of hyperconnected quotients is a module of the semiring of productive weak topologies", slides: [["Local state classifier slides", "Local state classifier for algebraic language theory.pdf"]] },
    { title: "On limits in \\(\\mathbf{FinSet}\\)", slides: [["Set-operation slides", "圏論のToy_Exampleとしての集合演算__Ver2_.pdf"]] },
    { title: "When do finite presheaves form a topos? (with Jeremie Marques)", slides: [["Topoi of automata slides", "CSCAT_2025-3.pdf"]] },
    { title: "Local state classifier, permutation model, and the internal axiom of choice", slides: [["Automata LSC slides", "IRIF20250527_ver1.pdf"], ["Algebraic-language LSC slides", "Local state classifier for algebraic language theory.pdf"]] }
  ];

  function noteHrefByFile(file) {
    const note = allRawDocumentRecords().find((record) => record.file === file);
    if (!note) return "";
    return localHref(noteRecordIsSlide(note) ? talksPageHref(noteAnchor(note)) : notesPageHref(noteAnchor(note)));
  }

  const talkSlideMatches = [
    { title: "A Rota-Baxter equation for winning games", event: "Differentiation in category theory", file: "RYUYA,HORA.pdf" },
    { title: "A space⋊︎time for Conway's game of life", event: "CSCAT 2026", file: "Space⋊Time for Conway's Game of Life.pdf" },
    { title: "Turning lights out with the Snake Lemma", event: "CGP", file: "ライツアウトの代数的研究.pdf" },
    { title: "Combinatorial games as recursive coalgebras", event: "CSCAT2024", file: "Hora_CSCAT2024.pdf" },
    { title: "Local state classifier for algebraic language theory", event: "CTTA Groupe", file: "Local state classifier for algebraic language theory.pdf" },
    { title: "Local state classifier for automata theory", event: "IRIF Sémantique", file: "IRIF20250527_ver1.pdf" },
    { title: "Topoi of automata", event: "CSCAT2025", file: "CSCAT_2025-3.pdf" },
    { title: "Topoi of automata", event: "CTTA Groupe", file: "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf" },
    { title: "Topoi of automata", event: "Categories for Automata", file: "IRIFtoday.pdf" },
    { title: "Constructive mathematics and representation theory", event: "数学基礎論若手", file: "若手の会2023-8.pdf" }
  ];

  function preparationSlideLinks(title) {
    const match = preparationSlideMatches.find((record) => record.title === title);
    if (!match) return [];
    return match.slides.map(([label, file]) => {
      const href = noteHrefByFile(file);
      return href ? [label, href] : null;
    }).filter(Boolean);
  }

  function mergeActionLinks(...groups) {
    const seen = new Set();
    return groups.flat().filter(Boolean).filter(([label, href]) => {
      const key = `${label}:${href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function preparationPaperDetails(title) {
    const relatedSlides = preparationSlideLinks(title);
    if (title === "Differential calculus of impartial combinatorial games (with Ryo Suzuki)") {
      const slidesHref = noteHrefByFile("RYUYA,HORA.pdf");
      return {
        figure: "games-integral-calculus",
        themes: ["games", "algebra", "category"],
        links: mergeActionLinks(compactText([slidesHref ? ["Rota-Baxter slides", slidesHref] : null]), relatedSlides)
      };
    }
    if (title === "Topoi of automata III: Geometry of \\(\\Sigma\\)-sets") {
      const slidesHref = noteHrefByFile("_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf");
      return {
        figure: "automata-cantor-morphism",
        themes: ["automata", "topos", "geometry", "combinatorics"],
        links: mergeActionLinks(compactText([slidesHref ? ["CTTA slides", slidesHref] : null]), relatedSlides)
      };
    }
    if (title === "Topoi of automata II: Hyperconnected geometric morphisms, syntactic monoids, and language classes") return { themes: ["algebra", "geometry", "combinatorics"], links: relatedSlides };
    if (title === "Subtopoi of free monoid actions (with Morgan Rogers)") return { themes: ["geometry", "logic"], links: relatedSlides };
    if (title === "Topoi with enough projectives") return { themes: ["algebra", "logic"], metaTags: ["speculative"], links: relatedSlides };
    if (title === "Totally disconnected topoi") return { themes: ["geometry"], links: relatedSlides };
    if (title === "Dynamical systems on pretopological spaces") return { themes: ["topos"], metaTags: ["speculative"], links: relatedSlides };
    if (title === "A topos-theoretic view on Gabriel's theorem") return { themes: ["logic"], metaTags: ["speculative"], links: relatedSlides };
    if (relatedSlides.length) return { links: relatedSlides };
    return {};
  }

  function preparationPaperRecord(title) {
    const base = typeof title === "object" && title ? title : { title };
    return {
      ...base,
      title: base.title,
      publicationStatus: "In preparation",
      ...preparationPaperDetails(base.title)
    };
  }

  function preparationPaperMatchesActiveFilters(title) {
    const paper = preparationPaperRecord(title);
    const themeId = activePaperThemeId();
    if (themeId && !paperThemeIds(paper).includes(themeId)) return false;
    return matchesQuery(paperSearchText(paper), state.paperQuery);
  }

  function renderPreparationFigure(figure) {
    if (!figure || figure.dataset.figureLoaded === "true" || figure.dataset.figureLoading === "true") return;
    const figureId = figure.dataset.preparationFigure;
    const template = figureId ? paperFigureTemplates()[figureId] : "";
    if (!template) {
      figure.classList.remove("is-loading");
      return;
    }
    figure.dataset.figureLoading = "true";
    figure.textContent = "";
    figure.innerHTML = template;
    applyFigureMarkerIds(figure, figureId, figure.dataset.figureMarkerPrefix || "preparation-arrow");
    initializeGamesRbFigures(figure);
    initializeGrundyFigures(figure, { controls: true, autoplay: true });
    initializeLawverePullbackFigures(figure, { controls: true, autoplay: true });
    initializeConnectedCorrespondenceFigures(figure, { controls: true, autoplay: true });
    initializeNormalizationFigures(figure, { controls: true });
    initializeAutomataInteractiveFigures(figure);
    typesetMath(figure);
    figure.dataset.figureLoaded = "true";
    delete figure.dataset.figureLoading;
    figure.classList.remove("is-loading");
  }

  function observePreparationFigure(figure) {
    if (!figure) return;
    if (!globalThis.IntersectionObserver) {
      renderPreparationFigure(figure);
      return;
    }
    if (!preparationFigureObserver) {
      preparationFigureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          preparationFigureObserver.unobserve(entry.target);
          renderPreparationFigure(entry.target);
        });
      }, { rootMargin: "420px 0px" });
    }
    preparationFigureObserver.observe(figure);
  }

  function queuePreparationFigureHydration(figure) {
    if (!figure) return;
    queuedPreparationFigures.push(figure);
    if (preparationFigureHydrationScheduled) return;
    preparationFigureHydrationScheduled = true;
    const schedule = globalThis.requestAnimationFrame || ((callback) => setTimeout(callback, 16));
    schedule(() => schedule(() => {
      const batch = queuedPreparationFigures;
      queuedPreparationFigures = [];
      preparationFigureHydrationScheduled = false;
      batch.forEach((item, index) => {
        observePreparationFigure(item);
        setTimeout(() => renderPreparationFigure(item), 180 + index * 80);
      });
    }));
  }

  function renderPreparationPapers() {
    const root = document.querySelector("#preparation-paper-list");
    if (!root) return;
    root.replaceChildren();
    const filtered = (paperDataPapers().preparation || []).filter(preparationPaperMatchesActiveFilters);
    if (!filtered.length) {
      root.append(el("p", "empty-state", "No papers match this filter."));
      return;
    }
    filtered.forEach((title) => {
      const paper = preparationPaperRecord(title);
      const template = paperFigureTemplates()[paper.figure];
      const showFigure = Boolean(template);
      const item = el("article", showFigure ? "publication-item publication-item-compact has-figure publication-preparation-feature" : "publication-item publication-item-compact");
      item.id = paperAnchor(paper);
      let deferredFigure = null;
      if (showFigure) {
        const figure = el("div", "publication-figure");
        figure.classList.add(`publication-figure-${paper.figure}`);
        figure.setAttribute("aria-label", `${paper.title} diagram`);
        figure.dataset.preparationFigure = paper.figure;
        figure.dataset.figureMarkerPrefix = "preparation-arrow";
        figure.classList.add("is-loading");
        figure.append(renderPaperFigureLoadingDots());
        deferredFigure = figure;
      }
      const titleRow = el("div", "publication-title");
      const heading = el("h3");
      heading.innerHTML = paper.title;
      titleRow.append(heading, titleCopyButton(notesPageHref(paperAnchor(paper)), paper.title));
      item.append(titleRow);
      const details = renderPublicationDetails(paper);
      if (details) item.append(details);
      const meta = el("div", "publication-meta");
      paperDisplayTagRecords(paper).forEach((tag) => meta.append(renderPublicationTag(tag)));
      appendContentReviewBadges(meta, paperReviewRecord({ ...paper, status: "draft", source: "manual homepage preparation list" }).badges);
      if (meta.children.length) item.append(meta);
      if (paper.summary) item.append(el("p", "publication-summary", paper.summary));
      appendActionLinks(item, paper.links || []);
      if (deferredFigure) {
        item.append(deferredFigure);
        queuePreparationFigureHydration(deferredFigure);
      }
      root.append(item);
    });
    typesetMath(root);
  }

  function noteTitlePrefixKind(value) {
    return normalizedUiText(value).match(/^cloud:\s*/i) ? "cloud" : "";
  }

  function stripNoteTitlePrefix(value) {
    return normalizedUiText(value).replace(/^cloud:\s*/i, "").trim();
  }

  function symbolicNoteTitle(note) {
    return noteTitlePrefixKind(note?.title || note) === "cloud" ? stripNoteTitlePrefix(note?.title || note) : symbolicCloudPenLabel(note?.title || note);
  }

  function noteKind(note) {
    if (talkSlideMatches.some((match) => match.file === note.file)) return ["slides", "Slides"];
    if (note.kind === "slide") return ["slides", "Slides"];
    const titleKind = noteTitlePrefixKind(note.title);
    const text = `${note.title} ${note.description || ""} ${note.file}`.toLowerCase();
    if (titleKind === "cloud") return ["cloud", "Speculative", "cloud"];
    if (note.file === "Notion archive") return ["archive", "Archive"];
    if (text.includes("slides") || text.includes("talk") || text.includes("cscat") || text.includes("seminar")) return ["slides", "Slides"];
    return ["note", "Note"];
  }

  function noteRecordIsSlide(note) {
    return noteKind(note)[0] === "slides";
  }

  function staticNoteRecords() {
    return allRawDocumentRecords().filter((note) => !noteRecordIsSlide(note));
  }

  function staticSlideRecords() {
    return allRawDocumentRecords().filter(noteRecordIsSlide);
  }

  function noteTheme(note) {
    if (note.theme) return note.theme;
    const themes = scoreThemeRecord(`${note.title} ${note.description || ""} ${note.file}`, note.themes || []).themes;
    return themes[0] || "general";
  }

  const noteThemeLabels = {
    topos: "Topos",
    automata: "Automaton",
    games: "Games",
    category: "Category theory",
    algebra: "Algebra",
    logic: "Logic",
    dynamical: "Dynamics",
    combinatorics: "Combinatorics",
    number: "Number theory",
    general: "General"
  };
  const noteThemeOrder = ["topos", "automata", "games", "dynamical", "category", "algebra", "logic", "combinatorics", "number", "general"];

  function noteThemeLabel(theme) {
    return noteThemeLabels[theme] || theme || "General";
  }

  function noteLanguageKey(note) {
    const language = String(note.language || "").trim();
    const normalizedLanguage = simplified(language);
    if (normalizedLanguage.includes("japanese")) return "Japanese";
    if (normalizedLanguage.includes("english")) return "English";
    return language || "Other";
  }

  function noteDateText(note) {
    return compactText([note.date, note.updated, note.description, note.file, note.title]).join(" ");
  }

  function noteTime(note) {
    const text = noteDateText(note);
    const explicit = explicitTimelineTime(text);
    if (Number.isFinite(explicit)) return explicit;
    const compactDate = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])([0-3]\d)\b/);
    if (compactDate) return timelineUtc(compactDate[1], Number(compactDate[2]) - 1, compactDate[3]);
    const slashYearMonth = text.match(/\b(19\d{2}|20\d{2})\/(\d{1,2})\b/);
    if (slashYearMonth) return timelineUtc(slashYearMonth[1], Number(slashYearMonth[2]) - 1, 15);
    const compactYearMonth = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])\b/);
    if (compactYearMonth) return timelineUtc(compactYearMonth[1], Number(compactYearMonth[2]) - 1, 15);
    const year = text.match(/(19\d{2}|20\d{2})/)?.[1];
    if (year) return timelineUtc(year);
    return Number.NaN;
  }

  function noteDateLabel(note) {
    if (note.date) return String(note.date);
    const text = noteDateText(note);
    const explicit = explicitTimelineLabel(text);
    if (explicit) return explicit;
    return "";
  }

  function noteYearKey(note) {
    const time = noteTime(note);
    return Number.isFinite(time) ? String(new Date(time).getUTCFullYear()) : "undated";
  }

  function noteSearchText(note) {
    const theme = noteTheme(note);
    return compactText([note.title, shortNoteTitle(note), note.description, note.language, note.file, noteDateLabel(note), noteYearKey(note), theme, noteThemeLabel(theme)]).join(" ");
  }

  function noteMatchesQuery(note, query) {
    const needle = String(query || "").trim();
    if (!needle) return true;
    const text = noteSearchText(note);
    return matchesQuery(text, needle) || simplified(text).includes(simplified(needle));
  }

  function noteMatchesFilters(note) {
    if (!noteMatchesQuery(note, state.noteQuery)) return false;
    if (state.noteLanguage !== "all" && noteLanguageKey(note) !== state.noteLanguage) return false;
    if (state.noteYear !== "all" && noteYearKey(note) !== state.noteYear) return false;
    if (state.noteTheme !== "all" && noteTheme(note) !== state.noteTheme) return false;
    return true;
  }

  function sortedNoteRecords(records) {
    return records
      .map((note, index) => ({ note, index, time: noteTime(note) }))
      .sort((a, b) => {
        const aTime = Number.isFinite(a.time) ? a.time : Number.NEGATIVE_INFINITY;
        const bTime = Number.isFinite(b.time) ? b.time : Number.NEGATIVE_INFINITY;
        return bTime - aTime || a.index - b.index;
      })
      .map((item) => item.note);
  }

  function shortNoteTitle(note) {
    return stripNoteTitlePrefix(note.title);
  }

  function noteHref(note) {
    return localHref(note.href || (noteRecordIsSlide(note) ? talksPageHref(noteAnchor(note)) : notesPageHref(noteAnchor(note))));
  }

  function noteDownloadHref(note) {
    return note.download ? localHref(note.download) : "";
  }

  function allNoteRecords() {
    return sortedNoteRecords(staticNoteRecords());
  }

  function allSlideRecords() {
    return sortedNoteRecords(staticSlideRecords().map(mergeSlideWithTalk));
  }

  function noteThumbnailArt() {
    const art = el("div", "note-thumb-art");
    art.append(el("span", "note-dot a"), el("span", "note-dot b"), el("span", "note-dot c"), el("span", "note-line one"), el("span", "note-line two"));
    return art;
  }

  function noteThumbnailSrc(note) {
    return note.localThumbnail ? localHref(note.localThumbnail) : note.thumbnail || "";
  }

  function loadQueuedNoteThumbnail(target) {
    const image = target?.matches?.("img") ? target : target?.querySelector?.("img[data-thumbnail-src]");
    if (!image || image.dataset.thumbnailLoaded === "true" || image.dataset.thumbnailLoading === "true") return;
    const src = image.dataset.thumbnailSrc;
    if (!src) return;
    image.dataset.thumbnailLoading = "true";
    image.src = src;
  }

  function observeQueuedNoteThumbnail(target) {
    if (!target) return;
    if (!globalThis.IntersectionObserver) {
      loadQueuedNoteThumbnail(target);
      return;
    }
    if (!noteThumbnailObserver) {
      noteThumbnailObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          noteThumbnailObserver.unobserve(entry.target);
          loadQueuedNoteThumbnail(entry.target);
        });
      }, { rootMargin: "420px 0px" });
    }
    noteThumbnailObserver.observe(target);
  }

  function queueNoteThumbnailHydration(target) {
    if (!target) return;
    queuedNoteThumbnails.push(target);
    if (noteThumbnailHydrationScheduled) return;
    noteThumbnailHydrationScheduled = true;
    const schedule = globalThis.requestAnimationFrame || ((callback) => setTimeout(callback, 16));
    schedule(() => schedule(() => {
      const batch = queuedNoteThumbnails;
      queuedNoteThumbnails = [];
      noteThumbnailHydrationScheduled = false;
      batch.forEach((item, index) => {
        observeQueuedNoteThumbnail(item);
        setTimeout(() => loadQueuedNoteThumbnail(item), 220 + index * 45);
      });
    }));
  }

  function noteThumbnail(note) {
    const [kind, kindLabel, kindIcon] = noteKind(note);
    const thumbnailSrc = noteThumbnailSrc(note);
    const thumb = link("", noteHref(note), `note-thumbnail ${kind} ${noteTheme(note)}${thumbnailSrc ? " has-image" : ""}`);
    thumb.setAttribute("aria-label", `Open ${symbolicNoteTitle(note)}`);
    const body = el("div", "note-thumb-body");
    const kindBadge = el("span", "note-thumb-kind", kindLabel);
    if (kindIcon === "cloud") kindBadge.prepend(uiIcon("cloud", "note-kind-icon"));
    body.append(kindBadge, el("span", "note-thumb-title", shortNoteTitle(note)), el("span", "note-thumb-meta", note.language));
    if (thumbnailSrc) {
      const image = el("img");
      let triedDriveFallback = false;
      image.dataset.thumbnailSrc = thumbnailSrc;
      if (note.localThumbnail && note.thumbnail) image.dataset.thumbnailFallback = note.thumbnail;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        if (!triedDriveFallback && image.dataset.thumbnailFallback) {
          triedDriveFallback = true;
          image.src = image.dataset.thumbnailFallback;
          return;
        }
        thumb.classList.remove("has-image");
        image.remove();
        if (!thumb.querySelector(".note-thumb-art")) thumb.prepend(noteThumbnailArt());
      });
      image.addEventListener("load", () => {
        image.dataset.thumbnailLoaded = "true";
        delete image.dataset.thumbnailLoading;
      }, { once: true });
      thumb.append(image, body);
      queueNoteThumbnailHydration(thumb);
      return thumb;
    }
    thumb.append(noteThumbnailArt(), body);
    return thumb;
  }

  function noteReviewRecord(note) {
    const [kind] = noteKind(note);
    const status = note.status || (kind === "slides" ? "slide" : "note");
    return { badges: [{ status, label: status === "slide" ? "Slide" : status === "speculative" ? "Speculative" : "Note" }] };
  }

  function renderMetaTagPill(tagId, className = "") {
    const tag = metaTagById(tagId);
    const label = tag?.label || tagId;
    const pill = el("span", `meta-tag-pill ${className}`.trim());
    pill.append(uiIcon(metaTagIconKey(tagId), "meta-tag-icon tag-icon"), el("span", "tag-label", label));
    return pill;
  }

  function renderDocumentCard(note, pagePath) {
    const item = el("article", "note-item");
    const href = noteHref(note);
    const downloadHref = noteDownloadHref(note);
    const cardTitle = note.talkTitle || shortNoteTitle(note);
    item.id = noteAnchor(note);
    item.append(noteThumbnail(note));
    const heading = el("h3");
    heading.append(link(cardTitle, href), titleCopyButton(`${pagePath}#${noteAnchor(note)}`, cardTitle));
    item.append(heading);
    if (note.talkTitle && simplified(shortNoteTitle(note)) !== simplified(note.talkTitle)) {
      item.append(el("p", "slide-source-title", `Slides: ${shortNoteTitle(note)}`));
    }
    if (note.description) item.append(el("p", null, note.description));
    if (note.talkMeta) {
      const talk = el("p", "slide-talk-meta");
      talk.append(uiIcon("talk", "slide-talk-icon"), document.createTextNode(note.talkMeta));
      item.append(talk);
    }
    const meta = el("div", "note-meta");
    appendContentReviewBadges(meta, noteReviewRecord(note).badges);
    metaTagIdsForText(compactText([note.title, note.description, note.file, note.talkTitle, note.talkMeta]).join(" "), note.metaTags || [])
      .forEach((tagId) => meta.append(renderMetaTagPill(tagId, "note-meta-tag")));
    const dateLabel = noteDateLabel(note);
    if (dateLabel) meta.append(el("span", null, dateLabel));
    meta.append(el("span", null, noteLanguageKey(note)));
    item.append(meta);
    const actions = [["Open", href]];
    if (downloadHref) actions.push(["Download", downloadHref]);
    if (note.talkHref) actions.push(["Talk", note.talkHref]);
    appendActionLinks(item, actions);
    return item;
  }

  function documentThemesForPaperSearch(record) {
    return scoreThemeRecord(compactText([record.title, record.description, record.file, record.talkTitle, record.talkMeta, noteTheme(record), noteThemeLabel(noteTheme(record)), ...(record.themes || [])]).join(" "), compactText([noteTheme(record), ...(record.themes || [])])).themes;
  }

  function updateSelectOptions(select, options, selected) {
    if (!select) return selected;
    const values = options.map(([value]) => value);
    const nextSelected = values.includes(selected) ? selected : "all";
    const signature = JSON.stringify(options);
    if (select.dataset.optionSignature !== signature) {
      select.replaceChildren(...options.map(([value, label]) => {
        const option = el("option", null, label);
        option.value = value;
        return option;
      }));
      select.dataset.optionSignature = signature;
    }
    select.value = nextSelected;
    return nextSelected;
  }

  function renderNoteFilters(allRecords, shownCount) {
    const input = document.querySelector("#note-filter");
    if (input && input.value !== state.noteQuery) input.value = state.noteQuery;
    const languages = Array.from(new Set(allRecords.map(noteLanguageKey))).sort();
    state.noteLanguage = updateSelectOptions(document.querySelector("#note-language-filter"), [["all", "All languages"], ...languages.map((language) => [language, language])], state.noteLanguage);
    const yearKeys = Array.from(new Set(allRecords.map(noteYearKey)));
    const datedYears = yearKeys.filter((year) => year !== "undated").sort((a, b) => Number(b) - Number(a));
    if (yearKeys.includes("undated")) datedYears.push("undated");
    state.noteYear = updateSelectOptions(document.querySelector("#note-year-filter"), [["all", "All years"], ...datedYears.map((year) => [year, year === "undated" ? "Undated" : year])], state.noteYear);
    const themes = Array.from(new Set(allRecords.map(noteTheme))).sort((a, b) => {
      const aIndex = noteThemeOrder.includes(a) ? noteThemeOrder.indexOf(a) : noteThemeOrder.length;
      const bIndex = noteThemeOrder.includes(b) ? noteThemeOrder.indexOf(b) : noteThemeOrder.length;
      return aIndex - bIndex || noteThemeLabel(a).localeCompare(noteThemeLabel(b));
    });
    state.noteTheme = updateSelectOptions(document.querySelector("#note-theme-filter"), [["all", "All themes"], ...themes.map((theme) => [theme, noteThemeLabel(theme)])], state.noteTheme);
    const count = document.querySelector("#note-filter-count");
    if (count) count.textContent = `Showing ${shownCount} / ${allRecords.length} notes`;
  }

  function renderSlideFilters(allRecords, shownCount) {
    const input = document.querySelector("#slide-filter");
    if (input && input.value !== state.slideQuery) input.value = state.slideQuery;
    const languages = Array.from(new Set(allRecords.map(noteLanguageKey))).sort();
    state.slideLanguage = updateSelectOptions(document.querySelector("#slide-language-filter"), [["all", "All languages"], ...languages.map((language) => [language, language])], state.slideLanguage);
    const yearKeys = Array.from(new Set(allRecords.map(noteYearKey)));
    const datedYears = yearKeys.filter((year) => year !== "undated").sort((a, b) => Number(b) - Number(a));
    if (yearKeys.includes("undated")) datedYears.push("undated");
    state.slideYear = updateSelectOptions(document.querySelector("#slide-year-filter"), [["all", "All years"], ...datedYears.map((year) => [year, year === "undated" ? "Undated" : year])], state.slideYear);
    const themes = Array.from(new Set(allRecords.map(noteTheme))).sort((a, b) => {
      const aIndex = noteThemeOrder.includes(a) ? noteThemeOrder.indexOf(a) : noteThemeOrder.length;
      const bIndex = noteThemeOrder.includes(b) ? noteThemeOrder.indexOf(b) : noteThemeOrder.length;
      return aIndex - bIndex || noteThemeLabel(a).localeCompare(noteThemeLabel(b));
    });
    state.slideTheme = updateSelectOptions(document.querySelector("#slide-theme-filter"), [["all", "All themes"], ...themes.map((theme) => [theme, noteThemeLabel(theme)])], state.slideTheme);
    const count = document.querySelector("#slide-filter-count");
    if (count) count.textContent = `Showing ${shownCount} / ${allRecords.length} slides`;
  }

  function renderNotes() {
    const root = document.querySelector("#notes-list");
    if (!root) return;
    root.replaceChildren();
    const allRecords = allNoteRecords();
    const records = allRecords.filter(noteMatchesFilters);
    renderNoteFilters(allRecords, records.length);
    if (!records.length) {
      root.append(el("p", "empty-state", "No notes match this filter."));
      return;
    }
    records.forEach((note) => root.append(renderDocumentCard(note, "works/notes-preparations/index.html")));
    scrollToHashTarget();
  }

  function slideMatchesFilters(slide) {
    if (!noteMatchesQuery({ ...slide, description: compactText([slide.description, slide.talkTitle, slide.talkMeta]).join(" ") }, state.slideQuery)) return false;
    if (state.slideLanguage !== "all" && noteLanguageKey(slide) !== state.slideLanguage) return false;
    if (state.slideYear !== "all" && noteYearKey(slide) !== state.slideYear) return false;
    if (state.slideTheme !== "all" && noteTheme(slide) !== state.slideTheme) return false;
    return true;
  }

  function renderSlides() {
    const root = document.querySelector("#slides-list");
    if (!root) return;
    root.replaceChildren();
    const allRecords = allSlideRecords();
    const records = allRecords.filter(slideMatchesFilters);
    renderSlideFilters(allRecords, records.length);
    if (!records.length) {
      root.append(el("p", "empty-state", "No slides match this filter."));
      return;
    }
    records.forEach((slide) => root.append(renderDocumentCard(slide, "works/talks-slides/index.html")));
    scrollToHashTarget();
  }

  function presentationDisplayRecord(record) {
    return record ? { ...record, title: normalizedUiText(record.title), rawTitle: record.title } : record;
  }

  function researchmapPresentationRecords() {
    return (dataSet().researchmap?.presentations || []).map(presentationDisplayRecord);
  }

  function fallbackPresentationRecords() {
    return (dataSet().talks?.talks || []).flatMap((group) => (group.items || []).map((talk) => ({ ...talk, year: group.year, link: talk.href, event: talk.venue })));
  }

  function presentationComparableDate(record) {
    if (record?.date) return String(record.date).slice(0, 10);
    const year = String(record?.year || "").match(/\b(19\d{2}|20\d{2})\b/)?.[1];
    if (!year) return "";
    const text = compactText([record?.event, record?.venue, record?.dateRange]).join(" ");
    const monthIndex = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12
    };
    const match = text.match(/\b([0-3]?\d)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/i);
    if (!match) return "";
    const month = monthIndex[match[2].toLowerCase()];
    return `${year}-${String(month).padStart(2, "0")}-${String(Number(match[1])).padStart(2, "0")}`;
  }

  function presentationTitlesReferToSameTalk(a, b) {
    const left = simplified(a);
    const right = simplified(b);
    if (!left || !right) return false;
    if (left === right || left.includes(right) || right.includes(left)) return true;
    const leftTokens = new Set(left.split(/\s+/).filter((token) => token.length > 1));
    const rightTokens = new Set(right.split(/\s+/).filter((token) => token.length > 1));
    if (!leftTokens.size || !rightTokens.size) return false;
    const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
    return overlap / Math.min(leftTokens.size, rightTokens.size) >= 0.75;
  }

  function presentationRecordsReferToSameTalk(a, b) {
    const dateA = presentationComparableDate(a);
    const dateB = presentationComparableDate(b);
    const dateDistance = dateA && dateB ? Math.abs(Date.parse(`${dateA}T00:00:00Z`) - Date.parse(`${dateB}T00:00:00Z`)) : Number.POSITIVE_INFINITY;
    const sameDate = dateA && dateA === dateB;
    const nearbyDate = dateDistance <= 24 * 60 * 60 * 1000;
    if ((sameDate || nearbyDate) && presentationTitlesReferToSameTalk(a?.title, b?.title)) return true;
    const sameYear = a?.year && b?.year && String(a.year) === String(b.year);
    return sameYear && presentationTitlesReferToSameTalk(a?.title, b?.title) && simplified(talkSlideRecordContext(a)).includes(simplified(b?.event || b?.venue || ""));
  }

  function allPresentationRecords() {
    const records = researchmapPresentationRecords();
    const fallbackRecords = fallbackPresentationRecords().map(presentationDisplayRecord);
    if (!records.length) return fallbackRecords;
    const fallbackOnlyRecords = fallbackRecords.filter((record) => !records.some((sourceRecord) => presentationRecordsReferToSameTalk(sourceRecord, record)));
    return [...records, ...fallbackOnlyRecords.map((record) => ({ ...record, source: "manual" }))];
  }

  function presentationSearchText(record) {
    return compactText([record.year, record.title, record.rawTitle, record.presenters?.join(" "), record.event, record.venue, record.type, record.date, record.dateRange]).join(" ");
  }

  function visiblePresentationRecords() {
    return allPresentationRecords().filter((record) => matchesQuery(presentationSearchText(record), state.talkQuery));
  }

  function presentationMeta(record) {
    return compactText([
      presentationPeopleText(record),
      record.event || record.venue,
      record.dateRange || record.date,
      record.type,
      record.invited ? "invited" : ""
    ]).join(" / ");
  }

  function presentationTime(record) {
    const value = record.date || record.dateRange || record.year;
    if (!value) return Number.NaN;
    const normalizedDate = /^\d{4}$/.test(value) ? `${value}-01-01` : /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value.slice(0, 10);
    return Date.parse(`${normalizedDate}T00:00:00Z`);
  }

  function sortedPresentations(records) {
    return [...records].sort((a, b) => {
      const dateA = presentationTime(a);
      const dateB = presentationTime(b);
      if (Number.isNaN(dateA) && Number.isNaN(dateB)) return String(a.title).localeCompare(String(b.title));
      if (Number.isNaN(dateA)) return 1;
      if (Number.isNaN(dateB)) return -1;
      return dateA - dateB;
    });
  }

  function uniqueBy(records, keyFn) {
    const seen = new Set();
    return records.filter((record, index) => {
      const key = keyFn(record, index);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function findPresentationForSlide(slide) {
    const title = simplified(slide.talkTitle || slide.title);
    if (!title) return null;
    return allPresentationRecords().find((record) => {
      const recordTitle = simplified(record.title);
      return recordTitle === title || recordTitle.includes(title) || title.includes(recordTitle);
    }) || null;
  }

  function rawSlideRecordByFile(file) {
    return staticSlideRecords().find((record) => record.file === file) || null;
  }

  function mergeSlideWithPresentation(slide, presentation) {
    if (!presentation) return { ...slide, kind: "slide" };
    return {
      ...slide,
      kind: "slide",
      date: slide.date || presentation.dateRange || presentation.date || presentation.year || "",
      description: slide.description || presentation.event || "",
      talkTitle: presentation.title,
      talkMeta: presentationMeta(presentation),
      talkHref: localHref(talksPageHref(talkRecordAnchor(presentation))),
      talkRecord: presentation,
      slideTitle: slide.title
    };
  }

  function mergeSlideWithTalk(slide) {
    return mergeSlideWithPresentation(slide, findPresentationForSlide(slide));
  }

  function talkSlideRecordContext(record) {
    return compactText([record?.event, record?.venue, record?.date, record?.dateRange, record?.link, record?.href]).join(" ");
  }

  function talkSlideMatchApplies(match, record) {
    const recordTitle = simplified(compactText([record?.title, record?.rawTitle]).join(" "));
    const matchTitle = simplified(match?.title || "");
    if (!recordTitle || !matchTitle) return false;
    const titleMatches = recordTitle.includes(matchTitle) || matchTitle.includes(recordTitle);
    const eventMatches = !match.event || simplified(talkSlideRecordContext(record)).includes(simplified(match.event));
    return titleMatches && eventMatches;
  }

  function slideLinksForTalk(record) {
    return matchedSlideRecordsForPresentation(record).map((slide) => ["Slides", noteHref(slide)]).filter(([, href]) => Boolean(href));
  }

  function matchedSlideRecordsForPresentation(record) {
    return uniqueBy(
      talkSlideMatches
        .filter((match) => talkSlideMatchApplies(match, record))
        .map((match) => rawSlideRecordByFile(match.file))
        .filter(Boolean)
        .map((slide) => mergeSlideWithPresentation(slide, record)),
      (slide) => slide.file || slide.href || slide.title
    );
  }

  function talkThumbnail(record) {
    const slide = matchedSlideRecordsForPresentation(record)[0];
    const src = slide ? noteThumbnailSrc(slide) : "";
    return src ? { src, href: noteHref(slide) } : null;
  }

  function talkSlideRecordTime(item) {
    if (item.kind === "talk") {
      const time = presentationTime(item.record);
      return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
    }
    const time = noteTime(item.slide);
    return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
  }

  function talkSlideRecordYear(item) {
    if (item.kind === "talk") {
      const time = presentationTime(item.record);
      if (Number.isFinite(time)) return String(new Date(time).getUTCFullYear());
      return item.record?.year ? String(item.record.year) : "Undated";
    }
    const year = noteYearKey(item.slide);
    return year === "undated" ? "Undated" : year;
  }

  function talkSlideRecordThemes(item) {
    const slideThemeHints = item.slides.flatMap((slide) => compactText([noteTheme(slide), ...(slide.themes || [])]));
    const text = compactText([
      item.record ? presentationSearchText(item.record) : "",
      item.slide ? noteSearchText(item.slide) : "",
      ...item.slides.map(noteSearchText),
      ...item.slides.map((slide) => slide.talkMeta)
    ]).join(" ");
    return scoreThemeRecord(text, slideThemeHints).themes;
  }

  function talkSlideRecordSearchText(item) {
    const themes = talkSlideRecordThemes(item);
    return compactText([
      item.kind,
      item.record ? presentationSearchText(item.record) : "",
      item.record ? presentationMeta(item.record) : "",
      item.slide ? noteSearchText(item.slide) : "",
      ...item.slides.map(noteSearchText),
      ...themes,
      ...themes.map(noteThemeLabel),
      item.slides.length ? "slides materials" : "talk only"
    ]).join(" ");
  }

  function talkSlideRecordMatchesFilters(item) {
    const query = String(state.talkQuery || "").trim();
    if (query) {
      const text = talkSlideRecordSearchText(item);
      if (!matchesQuery(text, query) && !simplified(text).includes(simplified(query))) return false;
    }
    if (state.talkYear !== "all" && talkSlideRecordYear(item) !== state.talkYear) return false;
    if (state.talkTheme !== "all" && !talkSlideRecordThemes(item).includes(state.talkTheme)) return false;
    if (state.talkSlides === "with-slides" && !item.slides.length) return false;
    if (state.talkSlides === "without-slides" && item.slides.length) return false;
    if (state.talkSlides === "slides-only" && item.kind !== "slide-only") return false;
    return true;
  }

  function allTalkSlideTimelineRecords() {
    const talkItems = allPresentationRecords().map((record, index) => ({
      kind: "talk",
      record,
      slides: matchedSlideRecordsForPresentation(record),
      index
    }));
    const matchedFiles = new Set(talkItems.flatMap((item) => item.slides.map((slide) => slide.file).filter(Boolean)));
    const slideOnlyItems = staticSlideRecords()
      .filter((slide) => !matchedFiles.has(slide.file))
      .map((slide, index) => {
        const merged = { ...slide, kind: "slide" };
        return {
          kind: "slide-only",
          slide: merged,
          slides: [merged],
          index: talkItems.length + index
        };
      });
    return [...talkItems, ...slideOnlyItems].sort((a, b) => talkSlideRecordTime(b) - talkSlideRecordTime(a) || a.index - b.index);
  }

  function renderTalkFilters(allRecords, shownCount) {
    const input = document.querySelector("#talk-filter");
    if (input && input.value !== state.talkQuery) input.value = state.talkQuery;
    const yearKeys = Array.from(new Set(allRecords.map(talkSlideRecordYear)));
    const datedYears = yearKeys.filter((year) => year !== "Undated").sort((a, b) => Number(b) - Number(a));
    if (yearKeys.includes("Undated")) datedYears.push("Undated");
    state.talkYear = updateSelectOptions(document.querySelector("#talk-year-filter"), [["all", "All years"], ...datedYears.map((year) => [year, year])], state.talkYear);
    const themes = Array.from(new Set(allRecords.flatMap(talkSlideRecordThemes))).sort((a, b) => {
      const aIndex = noteThemeOrder.includes(a) ? noteThemeOrder.indexOf(a) : noteThemeOrder.length;
      const bIndex = noteThemeOrder.includes(b) ? noteThemeOrder.indexOf(b) : noteThemeOrder.length;
      return aIndex - bIndex || noteThemeLabel(a).localeCompare(noteThemeLabel(b));
    });
    state.talkTheme = updateSelectOptions(document.querySelector("#talk-theme-filter"), [["all", "All themes"], ...themes.map((theme) => [theme, noteThemeLabel(theme)])], state.talkTheme);
    state.talkSlides = updateSelectOptions(document.querySelector("#talk-slides-filter"), [
      ["all", "All records"],
      ["with-slides", "With materials"],
      ["without-slides", "Talk only"],
      ["slides-only", "Slides only"]
    ], state.talkSlides);
    const count = document.querySelector("#talk-filter-count");
    if (count) count.textContent = `Showing ${shownCount} / ${allRecords.length} records`;
  }

  function renderTalkMaterialList(slides, slideAnchorRegistry) {
    const list = el("div", "talk-material-list");
    slides.forEach((slide) => {
      const material = el("article", "talk-material-item");
      const anchorId = noteAnchor(slide);
      if (anchorId && !slideAnchorRegistry.has(anchorId)) {
        material.id = anchorId;
        slideAnchorRegistry.add(anchorId);
      }
      const body = el("div", "talk-material-body");
      const title = el("div", "talk-material-title");
      title.append(uiIcon("slides", "talk-material-icon"), link(shortNoteTitle(slide), noteHref(slide)));
      body.append(title);
      const meta = compactText([noteDateLabel(slide), noteThemeLabel(noteTheme(slide)), noteLanguageKey(slide)]).join(" / ");
      if (meta) body.append(el("div", "talk-material-meta", meta));
      material.append(body);
      const actions = [["Open", noteHref(slide)]];
      const downloadHref = noteDownloadHref(slide);
      if (downloadHref) actions.push(["Download", downloadHref]);
      appendActionLinks(material, actions);
      list.append(material);
    });
    return list;
  }

  function renderTalkItem(record, href, metaText, actions = []) {
    const item = el("li");
    const shell = el("div", "talk-item-shell");
    const preview = talkThumbnail(record);
    if (preview) {
      const thumb = link("", preview.href, "talk-thumb");
      thumb.setAttribute("aria-label", `Open slides for ${record.title}`);
      const image = el("img");
      image.src = preview.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => thumb.remove());
      thumb.append(image);
      shell.append(thumb);
      item.classList.add("has-thumbnail");
    }
    const body = el("div", "talk-item-body");
    const title = el("span", "talk-title");
    title.append(uiIcon("talk", "talk-title-icon"));
    if (href) title.append(link(record.title, href));
    else title.append(el("span", null, record.title));
    title.append(titleCopyButton(talksPageHref(talkRecordAnchor(record)), record.title));
    body.append(title, el("span", "talk-venue", metaText));
    if (actions.length) appendActionLinks(body, actions);
    shell.append(body);
    item.append(shell);
    return item;
  }

  function renderTalkSlideItem(item, slideAnchorRegistry) {
    if (item.kind === "slide-only") {
      const slide = item.slide;
      const record = {
        title: shortNoteTitle(slide),
        link: noteHref(slide),
        event: "Unmatched slide material",
        date: noteDateLabel(slide),
        year: talkSlideRecordYear(item)
      };
      const rendered = renderTalkItem(record, noteHref(slide), compactText(["Slides only", noteDateLabel(slide), noteThemeLabel(noteTheme(slide)), noteLanguageKey(slide)]).join(" / "));
      rendered.id = noteAnchor(slide);
      rendered.classList.add("talk-slide-item", "is-slide-only");
      const body = rendered.querySelector(".talk-item-body");
      if (body) body.append(renderTalkMaterialList(item.slides, slideAnchorRegistry));
      return rendered;
    }
    const rendered = renderTalkItem(item.record, item.record.link || item.record.href, presentationMeta(item.record), []);
    rendered.id = talkRecordAnchor(item.record);
    rendered.classList.add("talk-slide-item");
    const body = rendered.querySelector(".talk-item-body");
    if (body && item.slides.length) body.append(renderTalkMaterialList(item.slides, slideAnchorRegistry));
    return rendered;
  }

  function renderResearchmapPresentations() {
    const root = document.querySelector("#researchmap-presentation-list");
    if (!root) return;
    root.replaceChildren();
    const allRecords = allTalkSlideTimelineRecords();
    const records = allRecords.filter(talkSlideRecordMatchesFilters);
    renderTalkFilters(allRecords, records.length);
    if (!records.length) {
      root.append(el("p", "empty-state", "No talks or slides match this filter."));
      return;
    }
    const groups = new Map();
    records.forEach((record) => {
      const year = talkSlideRecordYear(record);
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(record);
    });
    const slideAnchorRegistry = new Set();
    [...groups.entries()].sort(([yearA], [yearB]) => {
      if (yearA === "Undated") return 1;
      if (yearB === "Undated") return -1;
      return Number(yearB) - Number(yearA) || String(yearB).localeCompare(String(yearA));
    }).forEach(([year, items]) => {
      const wrapper = el("article", "timeline-group");
      wrapper.append(el("div", "timeline-year", year));
      const list = el("ul", "talk-items");
      items.forEach((record) => list.append(renderTalkSlideItem(record, slideAnchorRegistry)));
      wrapper.append(list);
      root.append(wrapper);
    });
    scrollToHashTarget();
  }

  // Figure runtime copied from site.js for standalone Works pages.

  // BEGIN WORKS FIGURE RUNTIME

  const grundyGameNodes = [
    { id: "V1", tex: "V_1", x: 126, y: 92, stage: 5, value: 0, options: ["W1", "W2", "W3"] },
    { id: "V2", tex: "V_2", x: 250, y: 92, stage: 5, value: 3, options: ["W2", "X2", "X3"] },
    { id: "W1", tex: "W_1", x: 82, y: 168, stage: 4, value: 1, options: ["X1", "X2"] },
    { id: "W3", tex: "W_3", x: 188, y: 168, stage: 3, value: 2, options: ["Y1", "Z3"] },
    { id: "W2", tex: "W_2", x: 294, y: 168, stage: 4, value: 1, options: ["X2", "X3"] },
    { id: "X1", tex: "X_1", x: 82, y: 244, stage: 3, value: 0, options: ["Y1", "Y2"] },
    { id: "X2", tex: "X_2", x: 188, y: 244, stage: 3, value: 2, options: ["Y2", "Z1"] },
    { id: "X3", tex: "X_3", x: 294, y: 244, stage: 3, value: 0, options: ["Y3"] },
    { id: "Y1", tex: "Y_1", x: 82, y: 320, stage: 2, value: 1, options: ["Z1"] },
    { id: "Y2", tex: "Y_2", x: 188, y: 320, stage: 2, value: 1, options: ["Z2", "Z3"] },
    { id: "Y3", tex: "Y_3", x: 294, y: 320, stage: 2, value: 1, options: ["Z3"] },
    { id: "Z1", tex: "Z_1", x: 82, y: 396, stage: 1, value: 0, options: [] },
    { id: "Z2", tex: "Z_2", x: 188, y: 396, stage: 1, value: 0, options: [] },
    { id: "Z3", tex: "Z_3", x: 294, y: 396, stage: 1, value: 0, options: [] }
  ];

  const grundyGameNodeMap = new Map(grundyGameNodes.map((node) => [node.id, node]));

  const grundyAlgebraOrder = [
    "Z1",
    "Z2",
    "Z3",
    "Y1",
    "Y2",
    "Y3",
    "X1",
    "X2",
    "X3",
    "W3",
    "W1",
    "W2",
    "V1",
    "V2"
  ];

  const grundyNodeStepMap = new Map(grundyAlgebraOrder.map((nodeId, index) => [nodeId, index + 1]));
  const grundyFinalStep = grundyAlgebraOrder.length + 1;
  const grundyNumberLineValues = [0, 1, 2, 3, 4];
  const grundyNumberLineMax = Math.max(...grundyNumberLineValues);
  const grundyTransferDelayMs = 330;
  const grundyTransferDurationMs = 820;
  const grundyAutoplayIntervalMs = 1550;
  const grundyFinalHoldMs = 6200;

  const grundyStepCopy = {
    0: {
      focus: "game coalgebra",
      options: "",
      mex: "choose a state or press Play",
      status: "This is the recursive calculation from the paper, not the heap chain."
    },
    1: {
      focus: "terminal layer",
      options: "terminal states have no options",
      mex: "mex(empty set) = 0",
      status: "Every terminal receives Grundy number 0."
    },
    2: {
      focus: "next layer",
      options: "each sees only Grundy value 0",
      mex: "mex({0}) = 1",
      status: "The Y layer is computed from the terminal layer."
    },
    3: {
      focus: "middle layer",
      options: "some nodes see both 0 and 1",
      mex: "mex({1}) = 0; mex({0,1}) = 2",
      status: "Nonlinear branches already force two different Grundy values."
    },
    4: {
      focus: "upper layer",
      options: "both see values 0 and 2",
      mex: "mex({0,2}) = 1",
      status: "The W layer now uses the X layer computed in the previous step."
    },
    5: {
      focus: "top layer",
      options: "top nodes see values from the layers below",
      mex: "mex({1,2}) = 0; mex({0,1,2}) = 3",
      status: "P-states are exactly the states with Grundy number 0; sums use Nim-sum."
    }
  };

  const grundyFinalCopy = {
    focus: "all states",
    options: "each Grundy number is now known",
    mex: "P-states have Grundy number 0; N-states have positive Grundy number",
    status: "The recursive pass is complete; sums use Nim-sum."
  };

  function grundyOptionValues(node) {
    return [...new Set(node.options.map((id) => grundyGameNodeMap.get(id)?.value).filter((value) => value !== undefined))].sort((a, b) => a - b);
  }

  function grundyNodeStep(nodeId) {
    return grundyNodeStepMap.get(nodeId) || Number.POSITIVE_INFINITY;
  }

  function grundyNodeForStep(step) {
    return grundyGameNodeMap.get(grundyAlgebraOrder[step - 1] || "");
  }

  function grundyStepHasActiveComputation(step) {
    return step > 0 && step <= grundyAlgebraOrder.length;
  }

  function grundyRevealStepBeforeTransfer(step) {
    return grundyStepHasActiveComputation(step) ? Math.max(0, step - 1) : step;
  }

  function grundyNodeIsKnown(node, step) {
    return grundyNodeStep(node.id) <= Math.min(step, grundyAlgebraOrder.length);
  }

  function grundyMex(values) {
    let mex = 0;
    while (values.includes(mex)) mex += 1;
    return mex;
  }

  function grundyEdgePath(from, to) {
    const startY = from.y + 18;
    const endY = to.y - 18;
    const dx = to.x - from.x;
    const dy = endY - startY;
    if (Math.abs(dx) < 2) return `M${from.x} ${startY} L${to.x} ${endY}`;

    const length = Math.hypot(dx, dy) || 1;
    const curve = Math.min(7, Math.abs(dx) * 0.045);
    const side = dx > 0 ? 1 : -1;
    const normalX = (-dy / length) * curve * side;
    const normalY = (dx / length) * curve * side;
    const c1x = from.x + dx * 0.36 + normalX;
    const c1y = startY + dy * 0.36 + normalY;
    const c2x = from.x + dx * 0.64 + normalX;
    const c2y = startY + dy * 0.64 + normalY;
    return `M${from.x} ${startY} C${c1x} ${c1y} ${c2x} ${c2y} ${to.x} ${endY}`;
  }

  function grundyFigureTemplate() {
    const edges = grundyGameNodes
      .flatMap((from) =>
        from.options.map((targetId) => {
          const to = grundyGameNodeMap.get(targetId);
          return `<path class="figure-arrow grundy-edge" data-grundy-edge="${from.id}-${to.id}" d="${grundyEdgePath(from, to)}"></path>`;
        })
      )
      .join("");
    const nodes = grundyGameNodes
      .map(
        ({ id, x, y }) => `
          <g class="grundy-node" data-grundy-node="${id}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="Show mex computation for ${id}">
            <circle class="grundy-node-shell" r="18"></circle>
            <text class="grundy-value-label" y="6" data-grundy-value="${id}"></text>
          </g>`
      )
      .join("");
    const naturalNumbers = grundyNumberLineValues
      .map((value) => `<span class="grundy-natural-number" data-grundy-natural="${value}"><span class="grundy-natural-core">${value}</span></span>`)
      .join("");
    return `
      <div class="grundy-figure" data-grundy-figure data-grundy-max="${grundyFinalStep}">
        <svg viewBox="0 0 760 456" role="img" aria-labelledby="fig-games-title fig-games-desc">
          <title id="fig-games-title">Recursive calculation of Grundy numbers</title>
          <desc id="fig-games-desc">A finite impartial game is drawn on the left, and the corresponding mex algebra is shown on the right.</desc>
          <defs>
            <marker id="arrow-grundy" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="7.4" markerHeight="7.4" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>
          <text class="grundy-title" x="34" y="37">game coalgebra</text>
          <text class="grundy-title" x="498" y="37">mex algebra</text>
          <rect class="grundy-game-frame" x="28" y="76" width="330" height="340" rx="12"></rect>
          <g class="grundy-edges">${edges}</g>
          <g class="grundy-nodes">${nodes}</g>
        </svg>
        <div class="grundy-algebra-panel" data-grundy-algebra-panel>
          <div class="grundy-natural-line" aria-label="Natural numbers for mex">
            <span class="grundy-mex-water" data-grundy-mex-water aria-hidden="true"></span>
            ${naturalNumbers}
          </div>
        </div>
        <div class="grundy-panel" aria-live="polite">
          <span class="grundy-panel-label">Grundy recursion</span>
          <strong data-grundy-focus>game coalgebra</strong>
          <span data-grundy-options></span>
          <span data-grundy-mex>choose a state or press Play</span>
          <span data-grundy-status>This is the recursive calculation from the paper.</span>
        </div>
      </div>`;
  }

  const lawvereCoskelFillerEdges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 6],
    [1, 5],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 5],
    [4, 6],
    [5, 6]
  ];
  const lawvereCoskelVertexFills = ["#ce2f36", "#244db7", "#2e9f3d", "#d48624", "#7e5c9b", "#c7783d", "#2c6f63"];

  function lawverePolarPoint(cx, cy, radius, index, total = 7) {
    const angle = (-90 + (index * 360) / total) * (Math.PI / 180);
    const round = (value) => Math.round(value * 10) / 10;
    return {
      x: round(cx + Math.cos(angle) * radius),
      y: round(cy + Math.sin(angle) * radius)
    };
  }

  function lawvereCoskelGraphTemplate({
    cx,
    cy,
    radius,
    deleted = null,
    frameRadius = 0,
    vertexRadius = 4,
    compact = false,
    animatedEdges = false,
    monochromeVertices = false
  }) {
    const points = Array.from({ length: 7 }, (_, index) => lawverePolarPoint(cx, cy, radius, index));
    const frame = frameRadius
      ? `<circle class="${compact ? "lawvere-coskel-frame" : "lawvere-coskel-core-frame"}" cx="${cx}" cy="${cy}" r="${frameRadius}"></circle>`
      : "";
    const edges = lawvereCoskelFillerEdges
      .map(([from, to], edgeIndex) => {
        if (from === deleted || to === deleted) return "";
        const group = edgeIndex % 4;
        const data = animatedEdges ? ` data-coskel-core-edge data-coskel-edge-from="${from}" data-coskel-edge-to="${to}"` : "";
        const edgeClass = compact ? "boundary" : monochromeVertices ? "core" : `g${group}`;
        return `<path class="lawvere-coskel-edge ${edgeClass}"${data} d="M${points[from].x} ${points[from].y} L${points[to].x} ${points[to].y}"></path>`;
      })
      .join("");
    const vertices = points
      .map((point, index) => {
        if (index === deleted) {
          const size = vertexRadius * 1.7;
          return `
            <g class="lawvere-coskel-deleted">
              <path d="M${point.x - size} ${point.y - size} L${point.x + size} ${point.y + size}"></path>
              <path d="M${point.x + size} ${point.y - size} L${point.x - size} ${point.y + size}"></path>
            </g>`;
        }
        const fill = compact || monochromeVertices ? "#2b342b" : lawvereCoskelVertexFills[index];
        const data = animatedEdges ? ` data-coskel-vertex="${index}"` : "";
        return `<circle class="lawvere-coskel-vertex" cx="${point.x}" cy="${point.y}" r="${vertexRadius}" fill="${fill}"${data}></circle>`;
      })
      .join("");
    return `${frame}<g class="lawvere-coskel-edges">${edges}</g><g class="lawvere-coskel-vertices">${vertices}</g>`;
  }

  function lawvereCoskelPanelTemplate() {
    const center = { x: 570, y: 146 };
    const coreRadius = 56;
    const coreFrameRadius = 72;
    const coreVertexRadius = 6.4;
    const boundaryScale = 0.32;
    const boundaryGraphs = Array.from({ length: 7 }, (_, index) => {
      const point = lawverePolarPoint(center.x, center.y, 112, index);
      const homeX = Math.round((point.x - center.x) * 10) / 10;
      const homeY = Math.round((point.y - center.y) * 10) / 10;
      return `
        <g class="lawvere-coskel-boundary" data-coskel-boundary="${index}" style="--coskel-origin-x: ${center.x}px; --coskel-origin-y: ${center.y}px; --coskel-home-x: ${homeX}px; --coskel-home-y: ${homeY}px; --coskel-home-scale: ${boundaryScale};">
          ${lawvereCoskelGraphTemplate({
            cx: center.x,
            cy: center.y,
            radius: coreRadius,
            deleted: index,
            frameRadius: coreFrameRadius,
            vertexRadius: coreVertexRadius,
            compact: true
          })}
        </g>`;
    }).join("");

    return `
      <g class="lawvere-coskel-panel">
        <g class="lawvere-coskel-filler">
          ${lawvereCoskelGraphTemplate({
            cx: center.x,
            cy: center.y,
            radius: coreRadius,
            frameRadius: coreFrameRadius,
            vertexRadius: coreVertexRadius,
            animatedEdges: true,
            monochromeVertices: true
          })}
        </g>
        <g class="lawvere-coskel-boundaries">${boundaryGraphs}</g>
      </g>`;
  }

  function lawvereFourthFigureTemplate() {
    return `
      <div class="lawvere-pullback-figure" data-lawvere-pullback>
        <svg viewBox="0 0 760 320" role="img" aria-labelledby="fig-lawvere-fourth-title fig-lawvere-fourth-desc">
          <title id="fig-lawvere-fourth-title">Skeletality and coskeletality in parallel</title>
          <desc id="fig-lawvere-fourth-desc">The left panel shows a graph recovered from a quotient structure. The right panel shows a filler of a 6-cycle in Graph.</desc>
          <defs>
            <marker id="arrow-lawvere-fourth" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>

          <path class="lawvere-panel-divider" d="M380 38 V282"></path>

          <g class="lawvere-skel-panel">
            <g class="lawvere-x-graph">
              <circle class="lawvere-graph-frame" cx="92" cy="160" r="72"></circle>
              <g class="lawvere-x-edges">
                <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M92 88 L42 111"></path>
                <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M92 88 L31 172"></path>
                <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M42 111 L158 172"></path>
                <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M31 172 L158 172"></path>

                <path class="lawvere-x-edge ro" data-pullback-edge="ro" d="M92 88 L121 232"></path>
                <path class="lawvere-x-edge ro" data-pullback-edge="ro" d="M121 232 L158 172"></path>

                <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M92 88 L65 232"></path>
                <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M92 88 L143 111"></path>
                <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M65 232 L158 172"></path>
                <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M158 172 L143 111"></path>

                <path class="lawvere-x-edge og" data-pullback-edge="og" d="M121 232 L65 232"></path>
                <path class="lawvere-x-edge og" data-pullback-edge="og" d="M121 232 L143 111"></path>
              </g>
              <g class="lawvere-x-vertices">
                <circle class="c-red" cx="92" cy="88" r="7"></circle>
                <circle class="c-blue" cx="42" cy="111" r="7"></circle>
                <circle class="c-blue" cx="31" cy="172" r="7"></circle>
                <circle class="c-green" cx="65" cy="232" r="7"></circle>
                <circle class="c-orange" cx="121" cy="232" r="7"></circle>
                <circle class="c-red" cx="158" cy="172" r="7"></circle>
                <circle class="c-green" cx="143" cy="111" r="7"></circle>
              </g>
            </g>

            <path class="figure-arrow lawvere-alpha-arrow" d="M180 160 H222"></path>

            <g class="lawvere-y-graph">
              <circle class="lawvere-graph-frame small" cx="284" cy="160" r="54"></circle>
              <g class="lawvere-y-edges">
                <path class="lawvere-y-edge rb" data-pullback-source="rb" d="M255 130 V190"></path>
                <path class="lawvere-y-edge ro" data-pullback-source="ro" d="M255 130 L315 190"></path>
                <path class="lawvere-y-edge rg" data-pullback-source="rg" d="M255 130 H315"></path>
                <path class="lawvere-y-edge og" data-pullback-source="og" d="M315 190 V130"></path>
              </g>
              <g class="lawvere-y-vertices">
                <circle class="c-red" cx="255" cy="130" r="8"></circle>
                <circle class="c-blue" cx="255" cy="190" r="8"></circle>
                <circle class="c-orange" cx="315" cy="190" r="8"></circle>
                <circle class="c-green" cx="315" cy="130" r="8"></circle>
              </g>
            </g>
          </g>

          ${lawvereCoskelPanelTemplate()}
          <text class="lawvere-panel-label" x="190" y="294" text-anchor="middle">skeletality</text>
          <text class="lawvere-panel-label" x="570" y="294" text-anchor="middle">coskeletality</text>
        </svg>
      </div>`;
  }

  function completelyConnectedFigureTemplate() {
    return `
      <div class="connected-figure" data-connected-correspondence>
        <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-connected-title fig-connected-desc">
          <title id="fig-connected-title">Rooted trees and rooted forests</title>
          <desc id="fig-connected-desc">A rooted tree is paired with its corresponding rooted forest.</desc>
          <defs>
            <marker id="arrow-connected-a" class="connected-marker-a" data-connected-marker="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
            <marker id="arrow-connected-b" class="connected-marker-b" data-connected-marker="b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
            <marker id="arrow-connected-c" class="connected-marker-c" data-connected-marker="c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>
          <g class="connected-pattern is-visible" data-connected-pattern="0">
            <g transform="translate(62 48)">
              <path class="figure-line connected-top-edge" d="M130 0 L60 54 M130 0 L130 54 M130 0 L214 54"></path>
              <circle class="figure-node connected-top-root" cx="130" cy="0" r="11"></circle>
              <g class="connected-match" data-connected-left="a">
                <path class="figure-line" d="M60 54 L28 108 M60 54 L92 108 M28 108 L8 162 M28 108 L48 162 M92 108 L72 162 M92 108 L112 162"></path>
                <circle class="figure-node soft" cx="60" cy="54" r="11"></circle>
                <circle class="figure-node" cx="28" cy="108" r="11"></circle><circle class="figure-node" cx="92" cy="108" r="11"></circle>
                <circle class="figure-node" cx="8" cy="162" r="11"></circle><circle class="figure-node" cx="48" cy="162" r="11"></circle><circle class="figure-node" cx="72" cy="162" r="11"></circle><circle class="figure-node" cx="112" cy="162" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-left="b">
                <path class="figure-line" d="M130 54 L130 108"></path>
                <circle class="figure-node soft" cx="130" cy="54" r="11"></circle>
                <circle class="figure-node" cx="130" cy="108" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-left="c">
                <path class="figure-line" d="M214 54 L214 108 M214 108 L194 162 M214 108 L234 162"></path>
                <circle class="figure-node soft" cx="214" cy="54" r="11"></circle>
                <circle class="figure-node" cx="214" cy="108" r="11"></circle>
                <circle class="figure-node" cx="194" cy="162" r="11"></circle><circle class="figure-node" cx="234" cy="162" r="11"></circle>
              </g>
            </g>
            <path class="figure-line dashed connected-divider" d="M380 38 V330"></path>
            <g class="connected-correspondence-arrows">
              <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="a" marker-end="url(#arrow-connected-a)" d="M234 150 C314 88, 404 78, 486 102"></path>
              <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="b" marker-end="url(#arrow-connected-b)" d="M214 164 C332 214, 466 204, 578 140"></path>
              <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="c" marker-end="url(#arrow-connected-c)" d="M306 158 C404 242, 564 232, 666 164"></path>
            </g>
            <g transform="translate(446 102)">
              <g class="connected-match" data-connected-right="a">
                <path class="figure-line" d="M58 0 L26 54 M58 0 L90 54 M26 54 L6 108 M26 54 L46 108 M90 54 L70 108 M90 54 L110 108"></path>
                <circle class="figure-node soft" cx="58" cy="0" r="11"></circle>
                <circle class="figure-node" cx="26" cy="54" r="11"></circle><circle class="figure-node" cx="90" cy="54" r="11"></circle>
                <circle class="figure-node" cx="6" cy="108" r="11"></circle><circle class="figure-node" cx="46" cy="108" r="11"></circle><circle class="figure-node" cx="70" cy="108" r="11"></circle><circle class="figure-node" cx="110" cy="108" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-right="b">
                <path class="figure-line" d="M148 0 L148 54"></path>
                <circle class="figure-node soft" cx="148" cy="0" r="11"></circle>
                <circle class="figure-node" cx="148" cy="54" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-right="c">
                <path class="figure-line" d="M230 0 L230 54 M230 54 L210 108 M230 54 L250 108"></path>
                <circle class="figure-node soft" cx="230" cy="0" r="11"></circle>
                <circle class="figure-node" cx="230" cy="54" r="11"></circle>
                <circle class="figure-node" cx="210" cy="108" r="11"></circle><circle class="figure-node" cx="250" cy="108" r="11"></circle>
              </g>
            </g>
          </g>
          <g class="connected-pattern" data-connected-pattern="1">
            <g transform="translate(62 58)">
              <path class="figure-line connected-top-edge" d="M130 0 L44 54 M130 0 L130 54 M130 0 L222 54"></path>
              <circle class="figure-node connected-top-root" cx="130" cy="0" r="11"></circle>
              <g class="connected-match" data-connected-left="a">
                <path class="figure-line" d="M44 54 L44 108 L44 162"></path>
                <circle class="figure-node soft" cx="44" cy="54" r="11"></circle>
                <circle class="figure-node" cx="44" cy="108" r="11"></circle><circle class="figure-node" cx="44" cy="162" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-left="b">
                <path class="figure-line" d="M130 54 L98 108 M130 54 L162 108 M98 108 L80 162"></path>
                <circle class="figure-node soft" cx="130" cy="54" r="11"></circle>
                <circle class="figure-node" cx="98" cy="108" r="11"></circle><circle class="figure-node" cx="162" cy="108" r="11"></circle><circle class="figure-node" cx="80" cy="162" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-left="c">
                <circle class="figure-node soft" cx="222" cy="54" r="11"></circle>
              </g>
            </g>
            <path class="figure-line dashed connected-divider" d="M380 38 V330"></path>
            <g class="connected-correspondence-arrows">
              <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="a" marker-end="url(#arrow-connected-a)" d="M118 112 C260 70, 352 74, 472 122"></path>
              <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="b" marker-end="url(#arrow-connected-b)" d="M204 120 C330 188, 462 188, 574 128"></path>
              <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="c" marker-end="url(#arrow-connected-c)" d="M296 114 C420 66, 560 76, 672 122"></path>
            </g>
            <g transform="translate(446 122)">
              <g class="connected-match" data-connected-right="a">
                <path class="figure-line" d="M38 0 L38 54 L38 108"></path>
                <circle class="figure-node soft" cx="38" cy="0" r="11"></circle>
                <circle class="figure-node" cx="38" cy="54" r="11"></circle><circle class="figure-node" cx="38" cy="108" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-right="b">
                <path class="figure-line" d="M140 0 L108 54 M140 0 L172 54 M108 54 L90 108"></path>
                <circle class="figure-node soft" cx="140" cy="0" r="11"></circle>
                <circle class="figure-node" cx="108" cy="54" r="11"></circle><circle class="figure-node" cx="172" cy="54" r="11"></circle><circle class="figure-node" cx="90" cy="108" r="11"></circle>
              </g>
              <g class="connected-match" data-connected-right="c">
                <circle class="figure-node soft" cx="238" cy="0" r="11"></circle>
              </g>
            </g>
          </g>
          <text class="connected-category-svg-label" x="192" y="306">Trees</text>
          <text class="connected-category-svg-label" x="594" y="306">Fam(Trees)</text>
        </svg>
      </div>`;
  }

  function normalizationLatticeTemplate(role, x, y, scale = 1) {
    return `
        <g class="normalization-lattice" data-normalization-lattice-role="${role}" transform="translate(${x} ${y}) scale(${scale})">
          <g class="normalization-hasse-edges" data-normalization-hasse-edges>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="d4" data-normalization-hasse-to="v0" d="M150 49 L70 101"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="d4" data-normalization-hasse-to="rot" d="M150 49 L150 101"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="d4" data-normalization-hasse-to="v1" d="M150 49 L230 101"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="v0" data-normalization-hasse-to="ref0" d="M70 123 L35 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="v0" data-normalization-hasse-to="ref2" d="M70 123 L95 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="v0" data-normalization-hasse-to="r2" d="M70 123 L150 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="rot" data-normalization-hasse-to="r2" d="M150 123 L150 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="v1" data-normalization-hasse-to="r2" d="M230 123 L150 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="v1" data-normalization-hasse-to="ref1" d="M230 123 L205 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="v1" data-normalization-hasse-to="ref3" d="M230 123 L265 225"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="one" data-normalization-hasse-to="ref0" d="M150 311 L35 247"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="one" data-normalization-hasse-to="ref2" d="M150 311 L95 247"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="one" data-normalization-hasse-to="r2" d="M150 311 L150 247"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="one" data-normalization-hasse-to="ref1" d="M150 311 L205 247"></path>
            <path class="figure-line normalization-hasse-edge" data-normalization-hasse-edge data-normalization-hasse-from="one" data-normalization-hasse-to="ref3" d="M150 311 L265 247"></path>
          </g>

          <g class="normalization-subgroup" data-normalization-subgroup="d4" data-subgroup-label="D4" transform="translate(150 38)">
            <rect class="figure-node soft" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label large" y="1">D<tspan baseline-shift="sub" font-size="68%">4</tspan></text>
          </g>
          <g class="normalization-subgroup" data-normalization-subgroup="v0" data-subgroup-label="&lt;tau,sigma^2&gt;" transform="translate(70 112)">
            <rect class="figure-node pale" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label tiny" y="1">&#10216;&tau;, &sigma;<tspan baseline-shift="super" font-size="65%">2</tspan>&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-subgroup="rot" data-subgroup-label="&lt;sigma&gt;" transform="translate(150 112)">
            <rect class="figure-node pale" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label small" y="1">&#10216;&sigma;&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-subgroup="v1" data-subgroup-label="&lt;sigma tau,sigma^2&gt;" transform="translate(230 112)">
            <rect class="figure-node pale" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label tiny" y="1">&#10216;&sigma;&tau;, &sigma;<tspan baseline-shift="super" font-size="65%">2</tspan>&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-face-colors="blue" data-normalization-subgroup="ref0" data-subgroup-label="&lt;tau&gt;" transform="translate(35 236)">
            <rect class="figure-node" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label small" y="1">&#10216;&tau;&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-face-colors="red" data-normalization-subgroup="ref2" data-subgroup-label="&lt;sigma^2 tau&gt;" transform="translate(95 236)">
            <rect class="figure-node" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label tiny" y="1">&#10216;&sigma;<tspan baseline-shift="super" font-size="65%">2</tspan>&tau;&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-subgroup="r2" data-subgroup-label="&lt;sigma^2&gt;" transform="translate(150 236)">
            <rect class="figure-node warm" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label small" y="1">&#10216;&sigma;<tspan baseline-shift="super" font-size="65%">2</tspan>&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-edge-colors="green" data-normalization-subgroup="ref1" data-subgroup-label="&lt;sigma tau&gt;" transform="translate(205 236)">
            <rect class="figure-node" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label small" y="1">&#10216;&sigma;&tau;&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-edge-colors="purple" data-normalization-subgroup="ref3" data-subgroup-label="&lt;sigma^3 tau&gt;" transform="translate(265 236)">
            <rect class="figure-node" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label tiny" y="1">&#10216;&sigma;<tspan baseline-shift="super" font-size="65%">3</tspan>&tau;&#10217;</text>
          </g>
          <g class="normalization-subgroup" data-normalization-subgroup="one" data-subgroup-label="&lt;1&gt;" transform="translate(150 322)">
            <rect class="figure-node soft" x="-11" y="-11" width="22" height="22" rx="3"></rect>
            <text class="figure-math-label small" y="1">&#10216;1&#10217;</text>
          </g>
        </g>`;
  }

  function normalizationFigureTemplate() {
    return `
      <svg class="normalization-figure" data-normalization-figure data-normalization-selected="d4" viewBox="0 0 900 470" role="img" aria-labelledby="fig-normalization-title fig-normalization-desc">
        <title id="fig-normalization-title">Subgroups and D4-actions</title>
        <desc id="fig-normalization-desc">A D4-action on a square on the left, an old subgroup lattice in the middle, and a new subgroup lattice on the right. Dotted links connect each square point to its stabilizer in the old lattice. Green dotted links connect each old subgroup to its normalized subgroup in the new lattice.</desc>
        <defs>
          <marker id="arrow-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="normalization-link-arrow-d4" viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="4.8" markerHeight="4.8" orient="auto" markerUnits="strokeWidth"><path d="M 0 1.2 L 8 5 L 0 8.8 z" fill="#5d615c" fill-opacity="0.58"></path></marker>
          <marker id="normalization-link-arrow-ref0" viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="4.8" markerHeight="4.8" orient="auto" markerUnits="strokeWidth"><path d="M 0 1.2 L 8 5 L 0 8.8 z" fill="#1f6fb2" fill-opacity="0.9"></path></marker>
          <marker id="normalization-link-arrow-ref2" viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="4.8" markerHeight="4.8" orient="auto" markerUnits="strokeWidth"><path d="M 0 1.2 L 8 5 L 0 8.8 z" fill="#d65a3a" fill-opacity="0.9"></path></marker>
          <marker id="normalization-link-arrow-ref1" viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="4.8" markerHeight="4.8" orient="auto" markerUnits="strokeWidth"><path d="M 0 1.2 L 8 5 L 0 8.8 z" fill="#51912f" fill-opacity="0.92"></path></marker>
          <marker id="normalization-link-arrow-ref3" viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="4.8" markerHeight="4.8" orient="auto" markerUnits="strokeWidth"><path d="M 0 1.2 L 8 5 L 0 8.8 z" fill="#7c57c2" fill-opacity="0.92"></path></marker>
        </defs>

        ${normalizationLatticeTemplate("old", 315, 54, 0.88)}
        ${normalizationLatticeTemplate("new", 620, 54, 0.88)}

        <foreignObject class="normalization-tex-object" x="118" y="21" width="50" height="30">
          <div xmlns="http://www.w3.org/1999/xhtml" class="normalization-tex-label">\\(X\\)</div>
        </foreignObject>
        <foreignObject class="normalization-tex-object" x="422" y="21" width="50" height="30">
          <div xmlns="http://www.w3.org/1999/xhtml" class="normalization-tex-label">\\(\\mathrm{\\Xi}\\)</div>
        </foreignObject>
        <foreignObject class="normalization-tex-object" x="727" y="21" width="50" height="30">
          <div xmlns="http://www.w3.org/1999/xhtml" class="normalization-tex-label">\\(\\mathrm{\\Xi}\\)</div>
        </foreignObject>
        <path class="figure-arrow normalization-object-arrow" d="M172 32 H418" marker-end="url(#arrow-f)"></path>
        <foreignObject class="normalization-tex-morphism" x="263" y="8" width="64" height="24">
          <div xmlns="http://www.w3.org/1999/xhtml" class="normalization-tex-label">\\(\\xi_X\\)</div>
        </foreignObject>
        <text class="normalization-arrow-caption" x="295" y="53">stabilizer</text>
        <path class="figure-arrow normalization-object-arrow" d="M476 32 H723" marker-end="url(#arrow-f)"></path>
        <foreignObject class="normalization-tex-morphism" x="568" y="8" width="64" height="24">
          <div xmlns="http://www.w3.org/1999/xhtml" class="normalization-tex-label">\\(\\xi_{\\mathrm{\\Xi}}\\)</div>
        </foreignObject>
        <text class="normalization-arrow-caption" x="600" y="53">Normalizer</text>
        <g class="normalization-action-atlas" transform="translate(22 58)">
          <rect class="normalization-action-stage-bg" width="254" height="292" rx="10"></rect>
          <g class="normalization-square-stage" transform="translate(28 73) scale(4.6)">
            <g class="normalization-square-body" data-normalization-square-body>
              <path class="normalization-square-shadow" d="M0 4 H42 V46 H0 Z"></path>
              <path class="normalization-square-edge-hit" data-normalization-boundary-edge="e0" d="M0 4 H42"></path>
              <path class="normalization-square-edge-hit" data-normalization-boundary-edge="e1" d="M42 4 V46"></path>
              <path class="normalization-square-edge-hit" data-normalization-boundary-edge="e2" d="M42 46 H0"></path>
              <path class="normalization-square-edge-hit" data-normalization-boundary-edge="e3" d="M0 46 V4"></path>
              <path class="normalization-action-line normalization-square-frame normalization-square-edge-segment" data-normalization-boundary-edge="e0" d="M0 4 H42"></path>
              <path class="normalization-action-line normalization-square-frame normalization-square-edge-segment" data-normalization-boundary-edge="e1" d="M42 4 V46"></path>
              <path class="normalization-action-line normalization-square-frame normalization-square-edge-segment" data-normalization-boundary-edge="e2" d="M42 46 H0"></path>
              <path class="normalization-action-line normalization-square-frame normalization-square-edge-segment" data-normalization-boundary-edge="e3" d="M0 46 V4"></path>
            </g>
            <g class="normalization-action" data-normalization-stabilizers="ref1 ref3">
              <circle class="normalization-action-dot normalization-edge-point normalization-action-place" data-normalization-place-stabilizer="ref1" data-normalization-orbit="edge" data-normalization-point="e0" data-normalization-token="a" cx="21" cy="4" r="3.2"></circle><circle class="normalization-action-dot normalization-edge-point normalization-action-place" data-normalization-place-stabilizer="ref3" data-normalization-orbit="edge" data-normalization-point="e1" data-normalization-token="b" cx="42" cy="25" r="3.2"></circle>
              <circle class="normalization-action-dot normalization-edge-point normalization-action-place" data-normalization-place-stabilizer="ref1" data-normalization-orbit="edge" data-normalization-point="e2" data-normalization-token="c" cx="21" cy="46" r="3.2"></circle><circle class="normalization-action-dot normalization-edge-point normalization-action-place" data-normalization-place-stabilizer="ref3" data-normalization-orbit="edge" data-normalization-point="e3" data-normalization-token="d" cx="0" cy="25" r="3.2"></circle>
            </g>
            <g class="normalization-action" data-normalization-stabilizers="ref0 ref2">
              <circle class="normalization-action-dot normalization-vertex-point normalization-action-place" data-normalization-place-stabilizer="ref0" data-normalization-orbit="vertex" data-normalization-point="v0" data-normalization-token="a" cx="0" cy="4" r="3.2"></circle><circle class="normalization-action-dot normalization-vertex-point normalization-action-place" data-normalization-place-stabilizer="ref2" data-normalization-orbit="vertex" data-normalization-point="v1" data-normalization-token="b" cx="42" cy="4" r="3.2"></circle>
              <circle class="normalization-action-dot normalization-vertex-point normalization-action-place" data-normalization-place-stabilizer="ref0" data-normalization-orbit="vertex" data-normalization-point="v2" data-normalization-token="c" cx="42" cy="46" r="3.2"></circle><circle class="normalization-action-dot normalization-vertex-point normalization-action-place" data-normalization-place-stabilizer="ref2" data-normalization-orbit="vertex" data-normalization-point="v3" data-normalization-token="d" cx="0" cy="46" r="3.2"></circle>
            </g>
          </g>
        </g>
        <g class="normalization-element-controls" transform="translate(60 424)">
          <g class="normalization-element-control" data-normalization-element-control="e" transform="translate(0 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">1</text></g>
          <g class="normalization-element-control" data-normalization-element-control="s" transform="translate(100 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&sigma;</text></g>
          <g class="normalization-element-control" data-normalization-element-control="s2" transform="translate(200 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&sigma;<tspan baseline-shift="super" font-size="70%">2</tspan></text></g>
          <g class="normalization-element-control" data-normalization-element-control="s3" transform="translate(300 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&sigma;<tspan baseline-shift="super" font-size="70%">3</tspan></text></g>
          <g class="normalization-element-control" data-normalization-element-control="t" transform="translate(400 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&tau;</text></g>
          <g class="normalization-element-control" data-normalization-element-control="st" transform="translate(500 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&sigma;&tau;</text></g>
          <g class="normalization-element-control" data-normalization-element-control="s2t" transform="translate(600 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&sigma;<tspan baseline-shift="super" font-size="70%">2</tspan>&tau;</text></g>
          <g class="normalization-element-control" data-normalization-element-control="s3t" transform="translate(700 0)"><rect class="normalization-element-button" width="80" height="38" rx="10"></rect><text x="40" y="25">&sigma;<tspan baseline-shift="super" font-size="70%">3</tspan>&tau;</text></g>
        </g>
        <g class="normalization-stabilizer-links" data-normalization-stabilizer-links aria-hidden="true">
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref0" data-normalization-link-orbit="vertex" data-normalization-link-point="v0" d="M47 232 C171.16 198, 310.84 149.2, 435 115.2"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref2" data-normalization-link-orbit="vertex" data-normalization-link-point="v1" d="M107 232 C269.75 198, 452.85 149.2, 615.6 115.2"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref0" data-normalization-link-orbit="vertex" data-normalization-link-point="v2" d="M47 232 C228.95 266, 433.65 261.8, 615.6 295.8"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref2" data-normalization-link-orbit="vertex" data-normalization-link-point="v3" d="M107 232 C211.96 266, 330.04 261.8, 435 295.8"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref1" data-normalization-link-orbit="edge" data-normalization-link-point="e0" d="M217 232 C315.66 198, 426.64 149.2, 525.3 115.2"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref3" data-normalization-link-orbit="edge" data-normalization-link-point="e1" d="M277 232 C385.35 198, 507.25 239.5, 615.6 205.5"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref1" data-normalization-link-orbit="edge" data-normalization-link-point="e2" d="M217 232 C315.66 266, 426.64 261.8, 525.3 295.8"></path>
          <path class="normalization-stabilizer-link" data-normalization-stabilizer-link data-normalization-link-subgroup="ref3" data-normalization-link-orbit="edge" data-normalization-link-point="e3" d="M277 232 C327.56 198, 384.44 239.5, 435 205.5"></path>
        </g>
        <g class="normalization-operator-links" data-normalization-operator-links aria-hidden="true">
          <path class="normalization-operator-link" data-normalization-operator-link data-normalization-operator-source="ref0" data-normalization-operator-target="v0"></path>
          <path class="normalization-operator-link" data-normalization-operator-link data-normalization-operator-source="ref2" data-normalization-operator-target="v0"></path>
          <path class="normalization-operator-link" data-normalization-operator-link data-normalization-operator-source="ref1" data-normalization-operator-target="v1"></path>
          <path class="normalization-operator-link" data-normalization-operator-link data-normalization-operator-source="ref3" data-normalization-operator-target="v1"></path>
        </g>
      </svg>`;
  }

  function internalPoint([x, y]) {
    return `${Number(x.toFixed(1))} ${Number(y.toFixed(1))}`;
  }

  function internalOffsetPoint(point, center, scale, jitter = [0, 0]) {
    return [point[0] + (point[0] - center[0]) * scale + jitter[0], point[1] + (point[1] - center[1]) * scale + jitter[1]];
  }

  function internalLineAsCubicPath(from, to) {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const controlA = [from[0] + dx / 3, from[1] + dy / 3];
    const controlB = [from[0] + (dx * 2) / 3, from[1] + (dy * 2) / 3];
    return `M${internalPoint(from)} C${internalPoint(controlA)}, ${internalPoint(controlB)}, ${internalPoint(to)}`;
  }

  const internalParameterizationDuration = "12s";
  const internalVertexRadius = 8;
  const internalClassifierVertexRadius = 9;
  const internalClassifierNonLoopPath = "M82 112 C112 100, 112 136, 82 124";
  const internalClassifierLoopPath = "M64 124 C34 136, 34 100, 64 112";
  const internalPieceBaseStroke = "#2c312d";
  const internalPieceVertexStroke = "#1d6fd8";
  const internalPieceNonLoopStroke = "#008f63";
  const internalPieceLoopStroke = "#d66a1f";
  const internalSmoothTiming = `calcMode="spline" keySplines="${[
    "0.42 0 0.58 1",
    "0.33 0 0.2 1",
    "0.33 0 0.2 1",
    "0.42 0 0.58 1",
    "0.42 0 0.58 1",
    "0.33 0 0.2 1",
    "0.42 0 0.58 1",
    "0.42 0 0.58 1"
  ].join("; ")}"`;

  function internalPieceColorValues(baseColor, activeColor) {
    return `${baseColor}; ${baseColor}; ${baseColor}; ${activeColor}; ${activeColor}; ${activeColor}; ${activeColor}; ${activeColor}; ${baseColor}`;
  }

  function internalPieceMarker(markerKey, className, color, keyTimes, duration) {
    const refX = className.includes("-n") ? "9.45" : "8";
    return `<defs><marker id="arrow-a-${markerKey}" class="${className}" data-internal-piece-marker="${markerKey}" viewBox="0 0 10 10" refX="${refX}" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"><animate attributeName="fill" attributeType="CSS" values="${internalPieceColorValues(internalPieceBaseStroke, color)}" keyTimes="${keyTimes}" dur="${duration}" repeatCount="indefinite"></animate></path></marker></defs>`;
  }

  function internalAnimatedPath(path, finalPath, className, keyTimes, duration, color, markerKey) {
    const markerDefinition = markerKey ? internalPieceMarker(markerKey, className.includes("-l") ? "internal-marker-piece-l" : "internal-marker-piece-n", color, keyTimes, duration) : "";
    const markerAttribute = markerKey ? ` data-internal-piece-marker="${markerKey}"` : "";
    const pathAnimation = finalPath
      ? `<animate attributeName="d" values="${path}; ${path}; ${path}; ${path}; ${path}; ${path}; ${finalPath}; ${finalPath}; ${path}" keyTimes="${keyTimes}" ${internalSmoothTiming} dur="${duration}" repeatCount="indefinite"></animate>`
      : "";
    const colorAnimation = `<animate attributeName="stroke" attributeType="CSS" values="${internalPieceColorValues(internalPieceBaseStroke, color)}" keyTimes="${keyTimes}" dur="${duration}" repeatCount="indefinite"></animate>`;
    return `${markerDefinition}<path class="figure-arrow internal-piece-arrow ${className}"${markerAttribute} d="${path}">${pathAnimation}${colorAnimation}</path>`;
  }

  function internalStaggeredKeyTimes(staggerIndex, staggerTotal) {
    const splitStart = 0.25;
    const decomposedTime = 0.31;
    const colorDoneTime = 0.37;
    const holdTime = 0.438;
    const flightWindowStart = 0.468;
    const flightWindowEnd = 0.903;
    const slot = (flightWindowEnd - flightWindowStart) / Math.max(staggerTotal, 1);
    const flightStart = flightWindowStart + staggerIndex * slot;
    const flightEnd = flightStart + slot * 0.84;
    return [0, splitStart, decomposedTime, colorDoneTime, holdTime, flightStart, flightEnd, 0.94, 1]
      .map((time) => Number(time.toFixed(3)))
      .join(";");
  }

  function internalParameterizationPiece({ type, start, decomposed, target, from, to, loopPath, finalPath, finalScale, staggerIndex = 0, staggerTotal = 1 }) {
    const duration = internalParameterizationDuration;
    const keyTimes = internalStaggeredKeyTimes(staggerIndex, staggerTotal);
    const compactScale = 0.88;
    const arrivalScale = finalScale ?? compactScale;
    let content = "";
    if (type === "vertex") {
      content = `<circle class="internal-piece-dot internal-piece-dot-vertex" cx="0" cy="0" r="${internalVertexRadius}"><animate attributeName="stroke" attributeType="CSS" values="${internalPieceColorValues("#1f2721", internalPieceVertexStroke)}" keyTimes="${keyTimes}" dur="${duration}" repeatCount="indefinite"></animate><animate attributeName="fill" attributeType="CSS" values="#fffdf8; #fffdf8; #fffdf8; #e5f0ff; #e5f0ff; #e5f0ff; #e5f0ff; #e5f0ff; #fffdf8" keyTimes="${keyTimes}" dur="${duration}" repeatCount="indefinite"></animate></circle>`;
    } else if (type === "loop") {
      content = internalAnimatedPath(loopPath, finalPath, "internal-piece-arrow-l", keyTimes, duration, internalPieceLoopStroke, `piece-l-${staggerIndex}`);
    } else {
      content = internalAnimatedPath(internalLineAsCubicPath(from, to), finalPath, "internal-piece-arrow-n", keyTimes, duration, internalPieceNonLoopStroke, `piece-n-${staggerIndex}`);
    }
    return `<g class="internal-piece internal-piece-${type}" opacity="1" transform="translate(${internalPoint(start)})">
          <animate attributeName="opacity" values="1;1;1;1;1;1;1;0;0" keyTimes="${keyTimes}" dur="${duration}" repeatCount="indefinite"></animate>
          <animateTransform attributeName="transform" type="translate" values="${internalPoint(start)}; ${internalPoint(start)}; ${internalPoint(decomposed)}; ${internalPoint(decomposed)}; ${internalPoint(decomposed)}; ${internalPoint(decomposed)}; ${internalPoint(target)}; ${internalPoint(target)}; ${internalPoint(start)}" keyTimes="${keyTimes}" ${internalSmoothTiming} dur="${duration}" repeatCount="indefinite"></animateTransform>
          <g class="internal-piece-shape" transform="scale(1)">
            <animateTransform attributeName="transform" type="scale" values="1;1;1;${compactScale};${compactScale};${compactScale};${arrivalScale};${arrivalScale};1" keyTimes="${keyTimes}" ${internalSmoothTiming} dur="${duration}" repeatCount="indefinite"></animateTransform>
            ${content}
          </g>
        </g>`;
  }

  function createInternalParameterizationPieces() {
    const classifierOrigin = [584, 76];
    const vertexTarget = [657, 194];
    const nonLoopTarget = classifierOrigin;
    const loopTarget = classifierOrigin;
    const vertexFinalScale = internalClassifierVertexRadius / internalVertexRadius;
    const nonLoopFinalPath = internalClassifierNonLoopPath;
    const loopFinalPath = internalClassifierLoopPath;
    const graphCenter = [280, 202];
    const vertices = [
      [88, 184],
      [152, 132],
      [230, 134],
      [308, 184],
      [388, 130],
      [458, 182],
      [136, 266],
      [224, 274],
      [326, 274],
      [438, 270],
    ].map((start, index) => ({
      type: "vertex",
      start,
      target: vertexTarget,
      finalScale: vertexFinalScale,
    }));
    const nonLoopEdges = [
      [[94.2, 179], [145.8, 137]],
      [[160, 132.2], [222, 133.8]],
      [[236.7, 138.3], [301.3, 179.7]],
      [[314.6, 179.5], [381.4, 134.5]],
      [[394.4, 134.8], [451.6, 177.2]],
      [[302.5, 189.8], [229.5, 268.2]],
      [[144, 266.7], [216, 273.3]],
      [[232, 274], [318, 274]],
      [[332.6, 269.4], [451.4, 186.6]],
      [[334, 273.7], [430, 270.3]],
    ].map(([source, destination], index) => {
      const start = [(source[0] + destination[0]) / 2, (source[1] + destination[1]) / 2];
      return {
        type: "nonloop",
        start,
        target: nonLoopTarget,
        from: [source[0] - start[0], source[1] - start[1]],
        to: [destination[0] - start[0], destination[1] - start[1]],
        finalPath: nonLoopFinalPath,
        finalScale: 1,
      };
    });
    const loops = [
      {
        type: "loop",
        start: [458, 182],
        target: loopTarget,
        loopPath: "M7 -5 C35 -18, 35 18, 7 5",
        finalPath: loopFinalPath,
        finalScale: 1,
        decomposeDrift: [26, -8],
      },
      {
        type: "loop",
        start: [136, 266],
        target: loopTarget,
        loopPath: "M-8 6 C-38 18, -38 -18, -8 -6",
        finalPath: loopFinalPath,
        finalScale: 1,
        decomposeDrift: [-26, 8],
      },
      {
        type: "loop",
        start: [230, 134],
        target: loopTarget,
        loopPath: "M-5 -8 C-20 -30, 20 -30, 5 -8",
        finalPath: loopFinalPath,
        finalScale: 1,
        decomposeDrift: [0, -28],
      },
      {
        type: "loop",
        start: [438, 270],
        target: loopTarget,
        loopPath: "M7 -5 C35 -17, 35 17, 7 5",
        finalPath: loopFinalPath,
        finalScale: 1,
        decomposeDrift: [26, 8],
      },
    ];
    const pieces = [...vertices, ...nonLoopEdges, ...loops].sort((first, second) => {
      const firstOrder = first.start[0] + first.start[1] * 2;
      const secondOrder = second.start[0] + second.start[1] * 2;
      return firstOrder - secondOrder;
    });
    const animatedPieces = pieces
      .map((piece, index) => {
        const jitter = [(index % 3 - 1) * 4, (index % 4 - 1.5) * 4];
        const drift = piece.decomposeDrift ?? [0, 0];
        const decomposedJitter = [jitter[0] + drift[0], jitter[1] + drift[1]];
        return internalParameterizationPiece({
          ...piece,
          decomposed: internalOffsetPoint(piece.start, graphCenter, 0.18, decomposedJitter),
          staggerIndex: index,
          staggerTotal: pieces.length,
        });
      })
      .join("\n");
    return animatedPieces;
  }

  const quotientLightColorValues = {
    green: "#2c6f63",
    orange: "#b66737",
    blue: "#2f5f91"
  };

  function quotientLightClasses(color = "green") {
    const colorClass = color === "orange" ? " quotient-light-core-orange" : color === "blue" ? " quotient-light-core-blue" : "";
    const filterClass = color === "orange" ? " quotient-moving-light-period" : color === "blue" ? " quotient-moving-light-blue" : "";
    return { colorClass, filterClass };
  }

  function quotientMovingLight(path, {
    color = "green",
    dur = "2.7s",
    begin = "0s",
    transitionTo = "",
    className = ""
  } = {}) {
    const { colorClass, filterClass } = quotientLightClasses(color);
    const fromColor = quotientLightColorValues[color] || quotientLightColorValues.green;
    const toColor = quotientLightColorValues[transitionTo] || "";
    const fillTransition = toColor ? `<animate attributeName="fill" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${fromColor};${toColor}" keyTimes="0;1"></animate>` : "";
    return `
          <g class="quotient-moving-light quotient-flow-light${filterClass}${className}">
            <animateMotion dur="${dur}" begin="${begin}" repeatCount="indefinite" path="${path}" calcMode="paced"></animateMotion>
            <circle class="quotient-light-halo" cx="0" cy="0" r="11"></circle>
            <circle class="quotient-light-core${colorClass}" cx="0" cy="0" r="5.2">${fillTransition}</circle>
          </g>`;
  }

  function quotientTurnLights(paths, color = "green") {
    return paths.map((entry) => {
      const record = typeof entry === "string" ? { path: entry, color } : { color, ...entry };
      return quotientMovingLight(record.path, {
      color: record.color || color,
      transitionTo: record.transitionTo || "",
      className: " quotient-turn-light"
      });
    }).join("\n");
  }

  function automataCoverKey(value) {
    return Number(value.toFixed(3)).toString();
  }

  const automataTreeEdgeTimings = {
    1: { hidden: 0.16, start: 0.18, end: 0.25 },
    2: { hidden: 0.26, start: 0.28, end: 0.37 },
    3: { hidden: 0.37, start: 0.39, end: 0.49 },
    4: { hidden: 0.48, start: 0.5, end: 0.58 }
  };

  const automataTreeEdges = [
    { level: 4, color: "blue", child: true, from: [281.8, 109], to: [255.5, 107.3] },
    { level: 4, color: "red", child: true, from: [281.8, 109.6], to: [255.5, 111.3] },
    { level: 4, color: "blue", child: true, from: [281.8, 122.2], to: [255.5, 120.5] },
    { level: 4, color: "red", child: true, from: [281.8, 122.8], to: [255.5, 124.5] },
    { level: 4, color: "blue", child: true, from: [281.8, 148.6], to: [255.5, 146.9] },
    { level: 4, color: "red", child: true, from: [281.8, 149.2], to: [255.5, 150.8] },
    { level: 4, color: "blue", child: true, from: [281.8, 161.7], to: [255.5, 160] },
    { level: 4, color: "red", child: true, from: [281.8, 162.3], to: [255.5, 164] },
    { level: 4, color: "blue", child: true, from: [281.8, 227.7], to: [255.5, 226] },
    { level: 4, color: "red", child: true, from: [281.8, 228.3], to: [255.5, 229.9] },
    { level: 4, color: "blue", child: true, from: [281.8, 240.8], to: [255.5, 239.1] },
    { level: 4, color: "red", child: true, from: [281.8, 241.4], to: [255.5, 243.1] },
    { level: 4, color: "blue", child: true, from: [281.8, 267.2], to: [255.5, 265.5] },
    { level: 4, color: "red", child: true, from: [281.8, 267.8], to: [255.5, 269.5] },
    { level: 4, color: "blue", child: true, from: [281.8, 280.4], to: [255.5, 278.7] },
    { level: 4, color: "red", child: true, from: [281.8, 281], to: [255.5, 282.7] },
    { level: 3, color: "blue", child: true, from: [330.8, 115.2], to: [290.4, 109.9] },
    { level: 3, color: "red", child: true, from: [330.8, 116.6], to: [290.4, 121.9] },
    { level: 3, color: "blue", child: true, from: [330.8, 154.7], to: [290.4, 149.5] },
    { level: 3, color: "red", child: true, from: [330.8, 156.1], to: [290.4, 161.4] },
    { level: 3, color: "blue", child: true, from: [330.8, 233.9], to: [290.4, 228.6] },
    { level: 3, color: "red", child: true, from: [330.8, 235.3], to: [290.4, 240.5] },
    { level: 3, color: "blue", child: true, from: [330.8, 273.4], to: [290.4, 268.1] },
    { level: 3, color: "red", child: true, from: [330.8, 274.8], to: [290.4, 280.1] },
    { level: 2, color: "blue", from: [401.1, 133.8], to: [341.2, 117.3] },
    { level: 2, color: "red", from: [401.1, 137.6], to: [341.2, 154] },
    { level: 1, color: "blue", from: [475.7, 187.1], to: [413.9, 140.2] },
    { level: 2, color: "blue", from: [401.1, 252.4], to: [341.2, 236] },
    { level: 2, color: "red", from: [401.1, 256.2], to: [341.2, 272.7] },
    { level: 1, color: "red", from: [475.7, 202.9], to: [413.9, 249.8] }
  ];

  function automataTreeEdgeTemplate({ level, color, child = false, from, to }) {
    const timing = automataTreeEdgeTimings[level];
    const [x1, y1] = from;
    const [x2, y2] = to;
    const keyTimes = [0, timing.hidden, timing.start, timing.end, 1].map(automataCoverKey).join(";");
    const x2Values = [x1, x1, x1, x2, x2].join(";");
    const y2Values = [y1, y1, y1, y2, y2].join(";");
    const opacityValues = "0;0;1;1;1";
    const childClass = child ? " child" : "";
    return `<line class="automata-cantor-tree-edge${childClass} level-${level} ${color}" data-cantor-arrow="${color}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
              <animate attributeName="x2" dur="12s" repeatCount="indefinite" calcMode="linear" keyTimes="${keyTimes}" values="${x2Values}"></animate>
              <animate attributeName="y2" dur="12s" repeatCount="indefinite" calcMode="linear" keyTimes="${keyTimes}" values="${y2Values}"></animate>
              <animate attributeName="opacity" dur="12s" repeatCount="indefinite" calcMode="discrete" keyTimes="${keyTimes}" values="${opacityValues}"></animate>
            </line>`;
  }

  function automataCantorTreeEdgesTemplate() {
    return automataTreeEdges.map(automataTreeEdgeTemplate).join("\n");
  }

  const automataTreeNodeTimings = {
    0: 0.16,
    1: 0.25,
    2: 0.37,
    3: 0.49,
    4: 0.58
  };

  const automataTreeNodes = [
    { depth: 4, size: "micro", cx: 252, cy: 107.1, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 111.5, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 120.3, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 124.7, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 146.7, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 151, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 159.8, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 164.2, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 225.8, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 230.1, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 238.9, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 243.3, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 265.3, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 269.7, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 278.5, r: 2.35 },
    { depth: 4, size: "micro", cx: 252, cy: 282.9, r: 2.35 },
    { depth: 3, size: "tiny", cx: 286, cy: 109.3, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 122.5, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 148.9, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 162, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 228, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 241.1, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 267.5, r: 3.2 },
    { depth: 3, size: "tiny", cx: 286, cy: 280.7, r: 3.2 },
    { depth: 2, size: "small", cx: 336, cy: 115.9, r: 4.2 },
    { depth: 2, size: "small", cx: 336, cy: 155.4, r: 4.2 },
    { depth: 2, size: "small", cx: 336, cy: 234.6, r: 4.2 },
    { depth: 2, size: "small", cx: 336, cy: 274.1, r: 4.2 },
    { depth: 1, cx: 408, cy: 135.7, r: 6.2 },
    { depth: 1, cx: 408, cy: 254.3, r: 6.2 },
    { depth: 0, size: "large", cx: 486, cy: 195, r: 12 }
  ];

  function automataTreeNodeTemplate({ depth, size = "", cx, cy, r }) {
    const appear = automataCoverKey(automataTreeNodeTimings[depth]);
    const sizeClass = size ? ` ${size}` : "";
    return `<circle class="automata-cantor-node${sizeClass} tree-depth-${depth}" cx="${cx}" cy="${cy}" r="${r}">
              <animate attributeName="opacity" dur="12s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${appear};1" values="0;1;1"></animate>
            </circle>`;
  }

  function automataCantorTreeNodesTemplate() {
    return automataTreeNodes.map(automataTreeNodeTemplate).join("\n");
  }

  function automataCoverRollingBouquet({ path, start, end, scale = 1 }) {
    const fadeIn = Math.min(start + 0.012, end);
    const fadeOut = Math.min(end + 0.018, 0.98);
    const keyTimes = [0, start, end, 1].map(automataCoverKey).join(";");
    const opacityTimes = [0, start, fadeIn, end, fadeOut, 1].map(automataCoverKey).join(";");
    return `
            <g class="automata-rolling-bouquet" opacity="0">
              <animateMotion dur="12s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="${keyTimes}" path="${path}"></animateMotion>
              <animate attributeName="opacity" dur="12s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="${opacityTimes}"></animate>
              <g transform="scale(${scale})">
                <g class="automata-rolling-bouquet-spinner">
                  <animateTransform attributeName="transform" type="rotate" dur="860ms" repeatCount="indefinite" from="0 0 0" to="-360 0 0"></animateTransform>
                  <path class="automata-rolling-bouquet-loop blue" d="M0 0 C-19 -12, -17 -38, 0 -38 C17 -38, 19 -12, 0 0"></path>
                  <path class="automata-rolling-bouquet-loop red" d="M0 0 C-19 12, -17 38, 0 38 C17 38, 19 12, 0 0"></path>
                  <circle class="automata-rolling-bouquet-node" cx="0" cy="0" r="5.2"></circle>
                </g>
              </g>
            </g>`;
  }

  function automataCoverUnfoldingTemplate() {
    const rollingBouquets = [
      { start: 0.08, end: 0.16, scale: 0.78, path: "M650 195 H486" },
      { start: 0.17, end: 0.25, scale: 0.62, path: "M486 195 L408 135.7" },
      { start: 0.17, end: 0.25, scale: 0.62, path: "M486 195 L408 254.3" },
      { start: 0.27, end: 0.36, scale: 0.48, path: "M408 135.7 L336 115.9" },
      { start: 0.27, end: 0.36, scale: 0.48, path: "M408 135.7 L336 155.4" },
      { start: 0.27, end: 0.36, scale: 0.48, path: "M408 254.3 L336 234.6" },
      { start: 0.27, end: 0.36, scale: 0.48, path: "M408 254.3 L336 274.1" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 115.9 L286 109.3" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 115.9 L286 122.5" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 155.4 L286 148.9" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 155.4 L286 162" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 234.6 L286 228" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 234.6 L286 241.1" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 274.1 L286 267.5" },
      { start: 0.38, end: 0.48, scale: 0.36, path: "M336 274.1 L286 280.7" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 109.3 L252 107.1" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 109.3 L252 111.5" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 122.5 L252 120.3" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 122.5 L252 124.7" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 148.9 L252 146.7" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 148.9 L252 151" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 162 L252 159.8" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 162 L252 164.2" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 228 L252 225.8" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 228 L252 230.1" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 241.1 L252 238.9" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 241.1 L252 243.3" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 267.5 L252 265.3" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 267.5 L252 269.7" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 280.7 L252 278.5" },
      { start: 0.49, end: 0.56, scale: 0.27, path: "M286 280.7 L252 282.9" },
    ];
    return `
          <g class="automata-cover-unfolding" transform="translate(26 0)" aria-hidden="true">
  ${rollingBouquets.map(automataCoverRollingBouquet).join("\n")}
          </g>`;
  }

  const gamesRbSelectableValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const gamesRbVisibleValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const gamesRbInitialS = [0, 1, 2, 5, 7];
  const gamesRbInitialT = [0, 1, 2, 3, 4, 6];
  const gamesRbMexSTex = "\\(\\operatorname{mex}\\,\\textcolor{#2563eb}{S}\\)";
  const gamesRbMexTTex = "\\(\\operatorname{mex}\\,\\textcolor{#c82727}{T}\\)";
  const gamesRbExpandedMexTex = "\\(\\operatorname{mex}\\bigl(\\colorbox{#f8dddd}{$(\\operatorname{mex}\\,\\textcolor{#2563eb}{S}\\oplus\\textcolor{#c82727}{T})$}\\cup\\colorbox{#dfe8ff}{$(\\textcolor{#2563eb}{S}\\oplus\\operatorname{mex}\\,\\textcolor{#c82727}{T})$}\\bigr)\\)";
  const gamesRbRhsMexTex = "\\(\\operatorname{mex}\\,\\textcolor{#2563eb}{S}\\oplus\\operatorname{mex}\\,\\textcolor{#c82727}{T}\\)";
  const gamesRbIntegralExpandedTex = "\\(\\int\\bigl(\\colorbox{#f8dddd}{$(\\int \\textcolor{#2563eb}{f})\\,\\textcolor{#c82727}{g}$}+\\colorbox{#dfe8ff}{$\\textcolor{#2563eb}{f}\\,(\\int \\textcolor{#c82727}{g})$}\\bigr)\\)";
  const gamesRbIntegralProductTex = "\\(\\left(\\int \\textcolor{#2563eb}{f}\\right)\\left(\\int \\textcolor{#c82727}{g}\\right)\\)";
  const gamesRbCellWidth = 30;
  const gamesRbCellHeight = 24;
  const gamesRbHeaderWidth = 31;
  const gamesRbHeaderHeight = 26;
  const gamesRbTableWidth = gamesRbHeaderWidth + gamesRbVisibleValues.length * gamesRbCellWidth;
  const gamesRbTableHeight = gamesRbHeaderHeight + gamesRbVisibleValues.length * gamesRbCellHeight;
  const gamesRbExpandedPanelX = 22;
  const gamesRbProductPanelX = 386;
  const gamesRbTableOffsetX = 54;
  const gamesRbPanelY = 8;
  const gamesRbTableOffsetY = 60;

  function gamesRbColumnX(value) {
    return gamesRbHeaderWidth + value * gamesRbCellWidth;
  }

  function gamesRbRowY(value) {
    return gamesRbHeaderHeight + value * gamesRbCellHeight;
  }

  function gamesRbCellTextX(value) {
    return gamesRbColumnX(value) + gamesRbCellWidth / 2;
  }

  function gamesRbCellTextY(value) {
    return gamesRbRowY(value) + 17.8;
  }

  function gamesRbTableHitTargetsTemplate() {
    const tTargets = gamesRbSelectableValues
      .map((value) => `<rect class="games-rb-hit-target is-t-target" data-games-rb-toggle="T" data-games-rb-value="${value}" role="button" tabindex="0" aria-label="Toggle ${value} in T" aria-pressed="${gamesRbInitialT.includes(value) ? "true" : "false"}" x="${gamesRbColumnX(value)}" y="0" width="${gamesRbCellWidth}" height="${gamesRbHeaderHeight}"></rect>`)
      .join("\n          ");
    const sTargets = gamesRbSelectableValues
      .map((value) => `<rect class="games-rb-hit-target is-s-target" data-games-rb-toggle="S" data-games-rb-value="${value}" role="button" tabindex="0" aria-label="Toggle ${value} in S" aria-pressed="${gamesRbInitialS.includes(value) ? "true" : "false"}" x="0" y="${gamesRbRowY(value)}" width="${gamesRbHeaderWidth}" height="${gamesRbCellHeight}"></rect>`)
      .join("\n          ");
    return `${tTargets}\n          ${sTargets}`;
  }

  function gamesRbMex(values) {
    const set = new Set(values);
    let value = 0;
    while (set.has(value)) value += 1;
    return value;
  }

  function gamesRbFormatSet(values) {
    return [...values].sort((a, b) => a - b).join(",");
  }

  function gamesRbExpandedOutputValues(state, mexS, mexT) {
    return [
      ...state.T.map((value) => mexS ^ value),
      ...state.S.map((value) => value ^ mexT)
    ];
  }

  function gamesRbNimTableBaseTemplate() {
    const minorLines = [
      ...gamesRbVisibleValues.slice(1).map((value) => `M0 ${gamesRbRowY(value)} H${gamesRbTableWidth}`),
      ...gamesRbVisibleValues.slice(1).map((value) => `M${gamesRbColumnX(value)} 0 V${gamesRbTableHeight}`)
    ].join(" ");
    const headerTexts = gamesRbVisibleValues
      .map((value) => `<text class="games-rb-cell-text is-head" x="${gamesRbCellTextX(value)}" y="19.3" text-anchor="middle">${value}</text>`)
      .join("\n          ");
    const rows = gamesRbVisibleValues
      .map((row) => {
        const rowHead = `<text class="games-rb-cell-text is-head" x="${gamesRbHeaderWidth / 2}" y="${gamesRbCellTextY(row)}" text-anchor="middle">${row}</text>`;
        const cells = gamesRbVisibleValues
          .map((column) => `<text class="games-rb-cell-text" x="${gamesRbCellTextX(column)}" y="${gamesRbCellTextY(row)}" text-anchor="middle">${row ^ column}</text>`)
          .join("\n          ");
        return `${rowHead}\n          ${cells}`;
      })
      .join("\n          ");
    return `
            <rect class="games-rb-table-bg" x="0" y="0" width="${gamesRbTableWidth}" height="${gamesRbTableHeight}" rx="0"></rect>
            <rect class="games-rb-table-head-row" x="0" y="0" width="${gamesRbTableWidth}" height="${gamesRbHeaderHeight}"></rect>
            <rect class="games-rb-table-head-col" x="0" y="0" width="${gamesRbHeaderWidth}" height="${gamesRbTableHeight}"></rect>
            <path class="games-rb-table-lines is-major" d="M0 0 H${gamesRbTableWidth} M0 ${gamesRbTableHeight} H${gamesRbTableWidth} M0 0 V${gamesRbTableHeight} M${gamesRbTableWidth} 0 V${gamesRbTableHeight}"></path>
            <path class="games-rb-table-lines" d="${minorLines}"></path>
            <path class="games-rb-table-lines is-input-output" d="M0 ${gamesRbHeaderHeight} H${gamesRbTableWidth} M${gamesRbHeaderWidth} 0 V${gamesRbTableHeight}"></path>
            <text class="games-rb-cell-text is-head" x="${gamesRbHeaderWidth / 2}" y="19.3" text-anchor="middle">⊕</text>
            ${headerTexts}
            ${rows}`;
  }

  const latestPaperFigureTemplates = {
    "games-integral-calculus": `
      <svg class="games-rb-table-figure games-rb-dual-figure" data-games-rb-interactive viewBox="0 0 760 390" role="img" aria-labelledby="fig-games-rb-table-title fig-games-rb-table-desc">
        <title id="fig-games-rb-table-title">Checking the mex Rota-Baxter equation with two Nim-sum tables</title>
        <desc id="fig-games-rb-table-desc">Two Nim-sum operation tables compute the two sides of the mex Rota-Baxter equation for selectable finite sets S and T.</desc>
        <defs>
          <marker id="games-rb-mex-arrow-orange" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
          <marker id="games-rb-mex-arrow-red" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
          <marker id="games-rb-arrow-blue" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
          <marker id="games-rb-arrow-red" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
          <linearGradient id="games-rb-table-paper" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#fffdf8"></stop>
            <stop offset="0.6" stop-color="#f7f1e7"></stop>
            <stop offset="1" stop-color="#e8eef1"></stop>
          </linearGradient>
          <linearGradient id="games-rb-union-both" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#c82727" stop-opacity="0.13"></stop>
            <stop offset="0.49" stop-color="#c82727" stop-opacity="0.13"></stop>
            <stop offset="0.51" stop-color="#2563eb" stop-opacity="0.13"></stop>
            <stop offset="1" stop-color="#2563eb" stop-opacity="0.13"></stop>
          </linearGradient>
          <g id="games-nim-table-base">
  ${gamesRbNimTableBaseTemplate()}
          </g>
        </defs>

        <rect class="games-rb-table-paper" width="760" height="390" rx="0"></rect>

        <g class="games-rb-dual-panel is-expanded-side" transform="translate(${gamesRbExpandedPanelX} ${gamesRbPanelY})">
          <g class="games-rb-dual-table is-expanded-table" transform="translate(${gamesRbTableOffsetX} ${gamesRbTableOffsetY})">
            <use href="#games-nim-table-base"></use>
            <g data-games-rb-set-layer="expanded"></g>
            <g data-games-rb-union-layer></g>
            <g data-games-rb-mex-layer="expanded"></g>
            <g class="games-rb-hit-layer">
  ${gamesRbTableHitTargetsTemplate()}
            </g>
            <text class="games-rb-mex-axis-svg-label is-mex-s-label" data-games-rb-mex-label="S" x="-15" y="73" text-anchor="end">mex <tspan class="games-rb-mex-var is-s-var">S</tspan></text>
            <text class="games-rb-mex-axis-svg-label is-mex-t-label" data-games-rb-mex-label="T" x="104" y="-10" text-anchor="middle">mex <tspan class="games-rb-mex-var is-t-var">T</tspan></text>
          </g>
        </g>

        <g class="games-rb-dual-panel is-product-side" transform="translate(${gamesRbProductPanelX} ${gamesRbPanelY})">
          <g class="games-rb-dual-table is-product-table" transform="translate(${gamesRbTableOffsetX} ${gamesRbTableOffsetY})">
            <use href="#games-nim-table-base"></use>
            <g data-games-rb-set-layer="product"></g>
            <g data-games-rb-product-layer></g>
            <g data-games-rb-product-arrow-layer></g>
            <g data-games-rb-mex-layer="product"></g>
            <g class="games-rb-hit-layer">
  ${gamesRbTableHitTargetsTemplate()}
            </g>
            <text class="games-rb-mex-axis-svg-label is-mex-s-label" data-games-rb-mex-label="S" x="-15" y="73" text-anchor="end">mex <tspan class="games-rb-mex-var is-s-var">S</tspan></text>
            <text class="games-rb-mex-axis-svg-label is-mex-t-label" data-games-rb-mex-label="T" x="104" y="-10" text-anchor="middle">mex <tspan class="games-rb-mex-var is-t-var">T</tspan></text>
          </g>
        </g>
      </svg>
      <span class="games-rb-limit-toast" data-games-rb-limit-toast role="status" aria-live="polite"></span>
      <span class="figure-math games-rb-table-tex games-rb-expanded-mex-readout" data-games-rb-expanded-mex-readout>${gamesRbExpandedMexTex}</span>
      <span class="figure-math games-rb-table-tex games-rb-bottom-result" data-games-rb-center-result>\(=\textcolor{#7c3aed}{1}=\)</span>
      <span class="figure-math games-rb-table-tex games-rb-expanded-mex-rhs">${gamesRbRhsMexTex}</span>
      <span class="figure-math games-rb-table-tex games-rb-integral-left">${gamesRbIntegralExpandedTex}</span>
      <span class="figure-math games-rb-table-tex games-rb-integral-right">${gamesRbIntegralProductTex}</span>`,
    "automata-cantor-morphism": `
      <svg class="automata-cantor-figure" viewBox="0 0 760 390" role="img" aria-labelledby="fig-automata-cantor-title fig-automata-cantor-desc">
        <title id="fig-automata-cantor-title">Canonical geometric morphism from Cantor space to Sigma-sets</title>
        <desc id="fig-automata-cantor-desc">The Cantor space of infinite words maps as a sublocale to the prefix poset sheaf topos, equivalent to Sigma-Set over Sigma star, and then by an etale cover to Sigma-Set.</desc>
        <defs>
          <marker id="automata-cantor-arrow-neutral" class="automata-cantor-marker-neutral" data-cantor-marker="neutral" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="automata-cantor-arrow-red" class="automata-cantor-marker-red" data-cantor-marker="red" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="automata-cantor-arrow-blue" class="automata-cantor-marker-blue" data-cantor-marker="blue" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="automata-cantor-arrow-purple" class="automata-cantor-marker-purple" data-cantor-marker="purple" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
        </defs>

        <rect class="automata-cantor-paper" width="760" height="390"></rect>
        <g class="automata-cantor-layout">
          <foreignObject class="automata-topos-label automata-topos-label-left" x="6" y="42" width="160" height="44">
            <div xmlns="http://www.w3.org/1999/xhtml" class="automata-topos-tex">\\(\\operatorname{Sh}(\\Sigma^\\omega)\\)</div>
          </foreignObject>
          <foreignObject class="automata-topos-label automata-topos-label-middle" x="301" y="42" width="190" height="44">
            <div xmlns="http://www.w3.org/1999/xhtml" class="automata-topos-tex">\\(\\operatorname{PSh}(\\Sigma^*,\\triangleleft)\\)</div>
          </foreignObject>
          <foreignObject class="automata-topos-label automata-topos-label-right" x="601" y="42" width="150" height="44">
            <div xmlns="http://www.w3.org/1999/xhtml" class="automata-topos-tex">\\(\\Sigma\\text{-}\\operatorname{Set}\\)</div>
          </foreignObject>
          <g class="automata-cantor-space" transform="translate(-44 0)">
            <g class="automata-cantor-fractal">
              <path class="automata-cantor-interval stage-0" d="M56 106 L56 284"></path>
              <path class="automata-cantor-interval stage-1" d="M88 106 L88 165.3"></path>
              <path class="automata-cantor-interval stage-1" d="M88 224.7 L88 284"></path>
              <path class="automata-cantor-interval stage-2" d="M120 106 L120 125.8"></path>
              <path class="automata-cantor-interval stage-2" d="M120 145.6 L120 165.3"></path>
              <path class="automata-cantor-interval stage-2" d="M120 224.7 L120 244.4"></path>
              <path class="automata-cantor-interval stage-2" d="M120 264.2 L120 284"></path>
              <path class="automata-cantor-interval stage-3" d="M152 106 L152 112.6"></path>
              <path class="automata-cantor-interval stage-3" d="M152 119.2 L152 125.8"></path>
              <path class="automata-cantor-interval stage-3" d="M152 145.6 L152 152.1"></path>
              <path class="automata-cantor-interval stage-3" d="M152 158.7 L152 165.3"></path>
              <path class="automata-cantor-interval stage-3" d="M152 224.7 L152 231.3"></path>
              <path class="automata-cantor-interval stage-3" d="M152 237.9 L152 244.4"></path>
              <path class="automata-cantor-interval stage-3" d="M152 264.2 L152 270.8"></path>
              <path class="automata-cantor-interval stage-3" d="M152 277.4 L152 284"></path>
              <path class="automata-cantor-interval stage-4" d="M184 106 L184 108.2"></path>
              <path class="automata-cantor-interval stage-4" d="M184 110.4 L184 112.6"></path>
              <path class="automata-cantor-interval stage-4" d="M184 119.2 L184 121.4"></path>
              <path class="automata-cantor-interval stage-4" d="M184 123.6 L184 125.8"></path>
              <path class="automata-cantor-interval stage-4" d="M184 145.6 L184 147.8"></path>
              <path class="automata-cantor-interval stage-4" d="M184 150 L184 152.1"></path>
              <path class="automata-cantor-interval stage-4" d="M184 158.7 L184 160.9"></path>
              <path class="automata-cantor-interval stage-4" d="M184 163.1 L184 165.3"></path>
              <path class="automata-cantor-interval stage-4" d="M184 224.7 L184 226.9"></path>
              <path class="automata-cantor-interval stage-4" d="M184 229.1 L184 231.3"></path>
              <path class="automata-cantor-interval stage-4" d="M184 237.9 L184 240"></path>
              <path class="automata-cantor-interval stage-4" d="M184 242.2 L184 244.4"></path>
              <path class="automata-cantor-interval stage-4" d="M184 264.2 L184 266.4"></path>
              <path class="automata-cantor-interval stage-4" d="M184 268.6 L184 270.8"></path>
              <path class="automata-cantor-interval stage-4" d="M184 277.4 L184 279.6"></path>
              <path class="automata-cantor-interval stage-4" d="M184 281.8 L184 284"></path>
              <path class="automata-cantor-connector cantor-stage-1" d="M56 195 L88 135.7"></path>
              <path class="automata-cantor-connector cantor-stage-1" d="M56 195 L88 254.3"></path>
              <path class="automata-cantor-connector cantor-stage-2" d="M88 135.7 L120 115.9"></path>
              <path class="automata-cantor-connector cantor-stage-2" d="M88 135.7 L120 155.4"></path>
              <path class="automata-cantor-connector cantor-stage-2" d="M88 254.3 L120 234.6"></path>
              <path class="automata-cantor-connector cantor-stage-2" d="M88 254.3 L120 274.1"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 115.9 L152 109.3"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 115.9 L152 122.5"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 155.4 L152 148.9"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 155.4 L152 162"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 234.6 L152 228"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 234.6 L152 241.1"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 274.1 L152 267.5"></path>
              <path class="automata-cantor-connector cantor-stage-3" d="M120 274.1 L152 280.7"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 109.3 L184 107.1"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 109.3 L184 111.5"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 122.5 L184 120.3"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 122.5 L184 124.7"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 148.9 L184 146.7"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 148.9 L184 151"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 162 L184 159.8"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 162 L184 164.2"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 228 L184 225.8"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 228 L184 230.1"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 241.1 L184 238.9"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 241.1 L184 243.3"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 267.5 L184 265.3"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 267.5 L184 269.7"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 280.7 L184 278.5"></path>
              <path class="automata-cantor-connector cantor-stage-4" d="M152 280.7 L184 282.9"></path>
            </g>
          </g>

          <path class="figure-arrow automata-cantor-main-arrow automata-sublocale-arrow" data-cantor-arrow="neutral" d="M164 195 H248"></path>
          <text class="automata-cantor-arrow-label large automata-sublocale-label" x="206" y="178">sublocale</text>

  ${automataCoverUnfoldingTemplate()}
          <g class="automata-prefix-poset" transform="translate(26 0)">
  ${automataCantorTreeEdgesTemplate()}
  ${automataCantorTreeNodesTemplate()}
          </g>

          <path class="figure-arrow automata-cantor-main-arrow automata-etale-arrow" data-cantor-arrow="neutral" d="M548 195 H632"></path>
          <text class="automata-cantor-arrow-label large automata-etale-label" x="590" y="170">&eacute;tale cover</text>

          <g class="automata-bouquet-space" transform="translate(676 195)">
            <path class="automata-cantor-bouquet-loop blue" data-cantor-arrow="blue" d="M0 0 C-40 -24, -36 -92, 0 -92 C36 -92, 40 -24, 0 0"></path>
            <path class="automata-cantor-bouquet-loop red" data-cantor-arrow="red" d="M0 0 C-40 24, -36 92, 0 92 C36 92, 40 24, 0 0"></path>
            <circle class="automata-cantor-node large" cx="0" cy="0" r="10"></circle>
          </g>
        </g>
      </svg>`,
    "internal-parameterizations": `
      <svg class="internal-parameterization-figure" viewBox="0 0 760 390" role="img" aria-labelledby="fig-internal-title fig-internal-desc">
        <title id="fig-internal-title">Directed graph local states</title>
        <desc id="fig-internal-desc">In the directed graph example, non-loop edges are classified as N, while self-loops are classified as L in the local state classifier.</desc>
        <defs>
          <marker id="arrow-a" data-internal-marker="default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="arrow-a-piece-n" class="internal-marker-piece-n" data-internal-marker="piece-n" viewBox="0 0 10 10" refX="9.45" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="arrow-a-piece-l" class="internal-marker-piece-l" data-internal-marker="piece-l" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="arrow-a-n" class="internal-marker-n" data-internal-marker="n" viewBox="0 0 10 10" refX="9.45" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
          <marker id="arrow-a-l" class="internal-marker-l" data-internal-marker="l" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
        </defs>
        <text class="internal-figure-heading" x="42" y="34">Local state classifier of Directed Graphs</text>
        <g transform="translate(34 58)">
          <g class="internal-source-graph">
          <circle class="internal-graph-node" cx="54" cy="126" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="118" cy="74" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="196" cy="76" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="274" cy="126" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="354" cy="72" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="424" cy="124" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="102" cy="208" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="190" cy="216" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="292" cy="216" r="${internalVertexRadius}"></circle>
          <circle class="internal-graph-node" cx="404" cy="212" r="${internalVertexRadius}"></circle>
          <path class="figure-arrow internal-edge-base" d="M60.2 121 L111.8 79"></path>
          <path class="figure-arrow internal-edge-base" d="M126 74.2 L188 75.8"></path>
          <path class="figure-arrow internal-edge-base" d="M202.7 80.3 L267.3 121.7"></path>
          <path class="figure-arrow internal-edge-base" d="M280.6 121.5 L347.4 76.5"></path>
          <path class="figure-arrow internal-edge-base" d="M360.4 76.8 L417.6 119.2"></path>
          <path class="figure-arrow internal-edge-base" d="M268.5 131.8 L195.5 210.2"></path>
          <path class="figure-arrow internal-edge-base" d="M110 208.7 L182 215.3"></path>
          <path class="figure-arrow internal-edge-base" d="M200 216 L284 216"></path>
          <path class="figure-arrow internal-edge-base" d="M298.6 211.4 L417.4 128.6"></path>
          <path class="figure-arrow internal-edge-base" d="M300 215.7 L396 212.3"></path>
          <path class="figure-arrow internal-edge-base internal-self-loop" d="M431 119 C459 106, 459 142, 431 129"></path>
          <path class="figure-arrow internal-edge-base internal-self-loop" d="M94 214 C64 226, 64 190, 94 202"></path>
          <path class="figure-arrow internal-edge-base internal-self-loop" d="M191 68 C176 46, 216 46, 201 68"></path>
          <path class="figure-arrow internal-edge-base internal-self-loop" d="M411 207 C439 195, 439 229, 411 217"></path>
          </g>
        </g>
        <g transform="translate(584 76)">
          <rect class="internal-panel-bg" x="0" y="0" width="142" height="232" rx="8"></rect>
          <foreignObject class="internal-classifier-symbol-box" x="54" y="38" width="38" height="30">
            <div xmlns="http://www.w3.org/1999/xhtml" class="internal-classifier-symbol">\\(\\mathrm{\\Xi}\\)</div>
          </foreignObject>
          <path class="figure-arrow internal-classifier-loop internal-loop-l" d="${internalClassifierLoopPath}"></path>
          <path class="figure-arrow internal-classifier-loop internal-loop-n" d="${internalClassifierNonLoopPath}"></path>
          <circle class="internal-classifier-node" cx="73" cy="118" r="${internalClassifierVertexRadius}"></circle>
          <text class="figure-small internal-classifier-edge-label internal-classifier-caption-loop" x="43" y="149">loop</text>
          <text class="figure-small internal-classifier-edge-label internal-classifier-caption-nonloop" x="103" y="149">non-loop</text>
        </g>
        ${createInternalParameterizationPieces()}
      </svg>`,
    "quotient-toposes": `
      <svg class="quotient-toposes-figure" viewBox="0 0 760 400" role="img" aria-labelledby="fig-quotient-title fig-quotient-desc">
        <title id="fig-quotient-title">Discrete dynamical systems with finite height and infinite orbit</title>
        <desc id="fig-quotient-desc">A reconstruction of the paper TikZ picture with an added infinite-height example. The first system has a finite height-three tail followed by a four-cycle. The second system has a finite height-three branch entering a two-sided infinite non-periodic orbit. The third has an infinite-height branch entering a five-cycle. In each turn, every visible point moves along exactly one outgoing arrow.</desc>
        <defs>
          <marker id="arrow-b-height" class="quotient-marker-height" data-quotient-marker="height" viewBox="0 0 10 10" refX="14.6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" overflow="visible"><path d="M 0 1.2 L 9 5 L 0 8.8 z"></path></marker>
          <marker id="arrow-b-period" class="quotient-marker-period" data-quotient-marker="period" viewBox="0 0 10 10" refX="14.6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" overflow="visible"><path d="M 0 1.2 L 9 5 L 0 8.8 z"></path></marker>
          <marker id="arrow-b-infinite" class="quotient-marker-infinite" data-quotient-marker="infinite" viewBox="0 0 10 10" refX="14.6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" overflow="visible"><path d="M 0 1.2 L 9 5 L 0 8.8 z"></path></marker>
        </defs>

        <g class="quotient-legend" transform="translate(506 24)">
          <circle class="figure-dot quotient-state-height" cx="0" cy="0" r="4.5"></circle>
          <text class="figure-small quotient-label quotient-height-label" x="13" y="4">finite height</text>
          <circle class="figure-dot quotient-state-period" cx="0" cy="24" r="4.5"></circle>
          <text class="figure-small quotient-label quotient-period-label" x="13" y="28">positive period</text>
          <circle class="figure-dot quotient-state-infinite" cx="0" cy="48" r="4.5"></circle>
          <text class="figure-small quotient-label quotient-infinite-label" x="13" y="52">infinite orbit</text>
        </g>

        <g class="quotient-system quotient-system-t34" transform="translate(82 10)">

          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M0 76 H58"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M58 76 H116"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M116 76 H174"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M174 76 A45 45 0 0 1 219 121"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M219 121 A45 45 0 0 1 174 166"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M174 166 A45 45 0 0 1 129 121"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M129 121 A45 45 0 0 1 174 76"></path>

          <path class="quotient-guide quotient-height-guide" d="M0 76 H58 H116 H174"></path>
          <path class="quotient-guide quotient-period-guide" d="M174 76 A45 45 0 0 1 219 121 A45 45 0 0 1 174 166 A45 45 0 0 1 129 121 A45 45 0 0 1 174 76"></path>
          ${quotientTurnLights(["M0 76 H58", "M58 76 H116", { path: "M116 76 H174", transitionTo: "orange" }], "green")}
          ${quotientTurnLights(["M174 76 A45 45 0 0 1 219 121", "M219 121 A45 45 0 0 1 174 166", "M174 166 A45 45 0 0 1 129 121", "M129 121 A45 45 0 0 1 174 76"], "orange")}

          <circle class="figure-dot quotient-state-height" cx="0" cy="76" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="58" cy="76" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="116" cy="76" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="174" cy="76" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="219" cy="121" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="174" cy="166" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="129" cy="121" r="5.4"></circle>
          <text class="figure-small quotient-label quotient-height-label" x="42" y="58">height 3</text>
          <text class="figure-small quotient-label quotient-period-label" x="206" y="87">period 4</text>
        </g>

        <g class="quotient-system quotient-system-t30" transform="translate(68 154)">

          <text class="quotient-ellipsis quotient-ellipsis-left" x="20" y="102">...</text>
          <text class="quotient-ellipsis quotient-ellipsis-right" x="638" y="102">...</text>
          <path class="figure-line quotient-infinite-continuation" d="M44 96 H614"></path>

          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M244 32 H304"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M304 32 H364"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M364 32 L424 96"></path>

          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M52 96 H72"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M72 96 H132"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M132 96 H192"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M192 96 H252"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M252 96 H312"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M312 96 H372"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M372 96 H424"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M424 96 H484"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M484 96 H544"></path>
          <path class="figure-arrow quotient-edge-infinite" data-quotient-arrow="infinite" d="M544 96 H606"></path>

          <path class="quotient-guide quotient-height-guide" d="M244 32 H304 H364 L424 96"></path>
          <path class="quotient-guide quotient-infinite-guide" d="M52 96 H72 H132 H192 H252 H312 H372 H424 H484 H544 H606"></path>
          ${quotientTurnLights(["M244 32 H304", "M304 32 H364", { path: "M364 32 L424 96", transitionTo: "orange" }], "green")}
          ${quotientTurnLights(["M52 96 H72", "M72 96 H132", "M132 96 H192", "M192 96 H252", "M252 96 H312", "M312 96 H372", "M372 96 H424", "M424 96 H484", "M484 96 H544", "M544 96 H606"], "orange")}

          <circle class="figure-dot quotient-state-height" cx="244" cy="32" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="304" cy="32" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="364" cy="32" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="72" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="132" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="192" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="252" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="312" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="372" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="424" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="484" cy="96" r="5.4"></circle>
          <circle class="figure-dot quotient-state-infinite" cx="544" cy="96" r="5.4"></circle>
          <text class="figure-small quotient-label quotient-height-label" x="246" y="58">height 3</text>
          <text class="figure-small quotient-label quotient-infinite-label" x="424" y="122">non-periodic infinite orbit</text>
        </g>

        <g class="quotient-system quotient-system-infinite-period" transform="translate(72 276)">
          <text class="quotient-ellipsis quotient-ellipsis-left" x="16" y="58">...</text>
          <path class="figure-line quotient-infinite-height-continuation" d="M44 52 H350"></path>

          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M72 52 H132"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M132 52 H192"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M192 52 H252"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M252 52 H312"></path>
          <path class="figure-arrow quotient-edge-height" data-quotient-arrow="height" d="M312 52 H370"></path>

          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M370 52 L410 23"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M410 23 L450 52"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M450 52 L435 99"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M435 99 L385 99"></path>
          <path class="figure-arrow quotient-edge-period" data-quotient-arrow="period" d="M385 99 L370 52"></path>

          <path class="quotient-guide quotient-height-guide" d="M72 52 H132 H192 H252 H312 H370"></path>
          <path class="quotient-guide quotient-period-guide" d="M370 52 L410 23 L450 52 L435 99 L385 99 L370 52"></path>
          ${quotientTurnLights(["M72 52 H132", "M132 52 H192", "M192 52 H252", "M252 52 H312", { path: "M312 52 H370", transitionTo: "orange" }], "green")}
          ${quotientTurnLights(["M370 52 L410 23", "M410 23 L450 52", "M450 52 L435 99", "M435 99 L385 99", "M385 99 L370 52"], "orange")}

          <circle class="figure-dot quotient-state-height" cx="72" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="132" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="192" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="252" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-height" cx="312" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="370" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="410" cy="23" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="450" cy="52" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="435" cy="99" r="5.4"></circle>
          <circle class="figure-dot quotient-state-period" cx="385" cy="99" r="5.4"></circle>
          <text class="figure-small quotient-label quotient-height-label" x="150" y="34">infinite height</text>
          <text class="figure-small quotient-label quotient-period-label" x="463" y="56">period 5</text>
        </g>
      </svg>`,
    "completely-connected": completelyConnectedFigureTemplate(),
    "lawvere-first": `
      <svg class="tensor-factorization-figure" viewBox="0 0 760 390" role="img" aria-labelledby="fig-lawvere-first-title fig-lawvere-first-desc">
        <title id="fig-lawvere-first-title">Power set tensor calculation through image factorization</title>
        <desc id="fig-lawvere-first-desc">A concrete calculation for the covariant power set functor: the restricted map from S factors as an epimorphism onto f(S) followed by the inclusion into X, giving the minimal expression.</desc>
        <defs>
          <marker id="tensor-f-arrow-green" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto">
            <path class="tensor-f-arrow-head tensor-f-arrow-head-green" d="M 1 1 L 9 5 L 1 9 z"></path>
          </marker>
        </defs>

        <g transform="translate(42 56)">
          <foreignObject class="tensor-tex-object tensor-tex-object-left" x="130" y="-4" width="60" height="32">
            <div xmlns="http://www.w3.org/1999/xhtml" class="tensor-tex-label">\\(X\\)</div>
          </foreignObject>
          <foreignObject class="tensor-tex-object tensor-tex-object-product" x="292" y="-12" width="96" height="46">
            <div xmlns="http://www.w3.org/1999/xhtml" class="tensor-tex-label">\\(\\mathop{\\otimes}\\limits_{\\mathrm{FinSet}}\\)</div>
          </foreignObject>
          <foreignObject class="tensor-tex-object tensor-tex-object-right" x="490" y="-4" width="60" height="32">
            <div xmlns="http://www.w3.org/1999/xhtml" class="tensor-tex-label">\\(F\\)</div>
          </foreignObject>
          <rect class="tensor-step1-block tensor-step1-block-left" x="32" y="58" width="256" height="168" rx="12">
            <animate attributeName="width" values="256;256;184;184;256;256" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="1;1;1" keyTimes="0;0.0806;1" dur="12.4s" repeatCount="indefinite"></animate>
          </rect>
          <rect class="tensor-step1-block tensor-step1-block-middle" x="392" y="58" width="128" height="168" rx="12">
            <animate attributeName="x" values="392;392;392;286;246;246;210;210;210" keyTimes="0;0.0806;0.1775;0.2258;0.2823;0.3387;0.5403;0.622;1" dur="12.4s" repeatCount="indefinite"></animate>
            <animate attributeName="width" values="128;128;128;158;188;188;80;80;80" keyTimes="0;0.0806;0.1775;0.2258;0.2823;0.3387;0.5403;0.622;1" dur="12.4s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="0;0;0;1;1;0;0" keyTimes="0;0.0806;0.2258;0.2339;0.3807;0.3891;1" dur="12.4s" repeatCount="indefinite"></animate>
          </rect>
          <rect class="tensor-step1-block tensor-step1-block-subset" x="390" y="58" width="260" height="168" rx="12">
            <animate attributeName="x" values="390;390;462;462;390;390" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate>
            <animate attributeName="width" values="260;260;188;188;260;260" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="1;1;1" keyTimes="0;0.0806;1" dur="12.4s" repeatCount="indefinite"></animate>
          </rect>
          <g>
            <g class="tensor-x-node selected" transform="translate(70 92)"><animateTransform attributeName="transform" type="translate" values="70 92;70 92;70 92;70 92;70 92;70 92" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">x</text></g>
            <g class="tensor-x-node selected green" transform="translate(70 146)"><animateTransform attributeName="transform" type="translate" values="70 146;70 146;70 146;70 146;70 146;70 146" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">y</text></g>
            <g class="tensor-x-node selected green" transform="translate(70 200)"><animateTransform attributeName="transform" type="translate" values="70 200;70 200;70 200;70 200;70 200;70 200" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">z</text></g>

            <g class="tensor-left-a-node tensor-neutral-node" transform="translate(250 88)"><animateTransform attributeName="transform" type="translate" values="250 88;250 88;178 88;178 88;250 88;250 88" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">a</text></g>
            <g class="tensor-left-a-node tensor-neutral-node tensor-step2-late-absorbed-node" transform="translate(250 126)"><animateTransform attributeName="transform" type="translate" values="250 126;250 126;178 126;178 126;250 126;250 126;70 146;70 146" keyTimes="0;0.0806;0.2823;0.3387;0.5403;0.5968;0.7984;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">b</text></g>
            <g class="tensor-left-a-node tensor-neutral-node" transform="translate(250 164)"><animateTransform attributeName="transform" type="translate" values="250 164;250 164;178 164;178 164;250 164;250 164" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">c</text></g>
            <g class="tensor-left-a-node tensor-neutral-node tensor-step2-late-absorbed-node" transform="translate(250 202)"><animateTransform attributeName="transform" type="translate" values="250 202;250 202;178 202;178 202;250 202;250 202;70 200;70 200" keyTimes="0;0.0806;0.2823;0.3387;0.5403;0.5968;0.7984;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">d</text></g>

            <g class="tensor-left-map-cords">
              <path class="tensor-left-map-cord" marker-end="url(#tensor-f-arrow-green)" d="M230 88 L88 92"><animate attributeName="d" values="M230 88 L88 92;M230 88 L88 92;M158 88 L88 92;M158 88 L88 92;M230 88 L88 92;M230 88 L88 92" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <g class="tensor-edge-direction tensor-edge-direction-map" transform="translate(159 90)"><animateTransform attributeName="transform" type="translate" values="159 90;159 90;123 90;123 90;159 90;159 90" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><path d="M -6 0 L 5 -5 L 5 5 z"></path></g>
              <path class="tensor-left-map-cord" marker-end="url(#tensor-f-arrow-green)" d="M230 126 L88 140"><animate attributeName="d" values="M230 126 L88 140;M230 126 L88 140;M158 126 L88 140;M158 126 L88 140;M230 126 L88 140;M230 126 L88 140;M50 146 L88 146;M50 146 L88 146" keyTimes="0;0.0806;0.2823;0.3387;0.5403;0.5968;0.7984;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.82;0.82;0.82;0.82;0;0" keyTimes="0;0.0806;0.5968;0.6892;0.7984;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <g class="tensor-edge-direction tensor-edge-direction-map" transform="translate(159 133)"><animateTransform attributeName="transform" type="translate" values="159 133;159 133;123 133;123 133;159 133;159 133;69 146;69 146" keyTimes="0;0.0806;0.2823;0.3387;0.5403;0.5968;0.7984;1" dur="12.4s" repeatCount="indefinite"></animateTransform><animate attributeName="opacity" values="0.82;0.82;0.82;0.82;0;0" keyTimes="0;0.0806;0.5968;0.6892;0.7984;1" dur="12.4s" repeatCount="indefinite"></animate><path d="M -6 0 L 5 -5 L 5 5 z"></path></g>
              <path class="tensor-left-map-cord" marker-end="url(#tensor-f-arrow-green)" d="M230 164 L88 152"><animate attributeName="d" values="M230 164 L88 152;M230 164 L88 152;M158 164 L88 152;M158 164 L88 152;M230 164 L88 152;M230 164 L88 152" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <g class="tensor-edge-direction tensor-edge-direction-map" transform="translate(159 158)"><animateTransform attributeName="transform" type="translate" values="159 158;159 158;123 158;123 158;159 158;159 158" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><path d="M -6 0 L 5 -5 L 5 5 z"></path></g>
              <path class="tensor-left-map-cord" marker-end="url(#tensor-f-arrow-green)" d="M230 202 L88 200"><animate attributeName="d" values="M230 202 L88 200;M230 202 L88 200;M158 202 L88 200;M158 202 L88 200;M230 202 L88 200;M230 202 L88 200;M50 200 L88 200;M50 200 L88 200" keyTimes="0;0.0806;0.2823;0.3387;0.5403;0.5968;0.7984;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.82;0.82;0.82;0.82;0;0" keyTimes="0;0.0806;0.5968;0.6892;0.7984;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <g class="tensor-edge-direction tensor-edge-direction-map" transform="translate(159 201)"><animateTransform attributeName="transform" type="translate" values="159 201;159 201;123 201;123 201;159 201;159 201;69 200;69 200" keyTimes="0;0.0806;0.2823;0.3387;0.5403;0.5968;0.7984;1" dur="12.4s" repeatCount="indefinite"></animateTransform><animate attributeName="opacity" values="0.82;0.82;0.82;0.82;0;0" keyTimes="0;0.0806;0.5968;0.6892;0.7984;1" dur="12.4s" repeatCount="indefinite"></animate><path d="M -6 0 L 5 -5 L 5 5 z"></path></g>
            </g>
            <g class="tensor-subset-links">
              <path class="tensor-a-copy-link" d="M272 88 H408"><animate attributeName="d" values="M272 88 H408;M272 88 H408;M200 88 H264;M200 88 H264;M242 88 H243;M242 88 H243;M242 88 H243;M242 88 H243" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.55;0.55;0.55;0.55;0.55;0;0;0" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-a-copy-link" d="M272 126 C312 126, 368 126, 410 126"><animate attributeName="d" values="M272 126 C312 126, 368 126, 410 126;M272 126 C312 126, 368 126, 410 126;M200 126 C220 126, 244 126, 266 126;M200 126 C220 126, 244 126, 266 126;M242 126 C242 126, 243 126, 243 126;M242 126 C242 126, 243 126, 243 126;M242 126 C242 126, 243 126, 243 126;M242 126 C242 126, 243 126, 243 126" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.55;0.55;0.55;0.55;0.55;0;0;0" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-a-copy-link" d="M272 164 H408"><animate attributeName="d" values="M272 164 H408;M272 164 H408;M200 164 H264;M200 164 H264;M242 164 H243;M242 164 H243;M242 164 H243;M242 164 H243" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.55;0.55;0.55;0.55;0.55;0;0;0" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-a-copy-link" d="M272 202 C312 202, 368 202, 410 202"><animate attributeName="d" values="M272 202 C312 202, 368 202, 410 202;M272 202 C312 202, 368 202, 410 202;M200 202 C220 202, 244 202, 266 202;M200 202 C220 202, 244 202, 266 202;M242 202 C242 202, 243 202, 243 202;M242 202 C242 202, 243 202, 243 202;M242 202 C242 202, 243 202, 243 202;M242 202 C242 202, 243 202, 243 202" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.55;0.55;0.55;0.55;0.55;0;0;0" keyTimes="0;0.0806;0.2823;0.3387;0.4563;0.4648;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-neutral-link" d="M448 88 H412"><animate attributeName="d" values="M448 88 H412;M448 88 H412;M304 88 H376;M304 88 H376;M268 88 H232;M268 88 H232" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.0806;0.5403;0.622;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-neutral-link" d="M448 164 H412"><animate attributeName="d" values="M448 164 H412;M448 164 H412;M304 164 H376;M304 164 H376;M268 164 H232;M268 164 H232" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.0806;0.5403;0.622;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-a-copy-link" d="M448 88 H412"><animate attributeName="d" values="M448 88 H412;M448 88 H412;M412 88 H484;M412 88 H484;M268 88 H412;M268 88 H412" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.55;0.55;0.55;0.55;0.55;0.55" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-a-copy-link" d="M448 164 H412"><animate attributeName="d" values="M448 164 H412;M448 164 H412;M412 164 H484;M412 164 H484;M268 164 H412;M268 164 H412" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="0.55;0.55;0.55;0.55;0.55;0.55" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <path class="tensor-subset-link" d="M448 88 H592"><animate attributeName="d" values="M448 88 H592;M448 88 H592;M520 88 H592;M520 88 H592;M448 88 H592;M448 88 H592" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <g class="tensor-edge-direction tensor-edge-direction-subset" transform="translate(520 88)"><animateTransform attributeName="transform" type="translate" values="520 88;520 88;556 88;556 88;520 88;520 88" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><path d="M -6 0 L 5 -5 L 5 5 z"></path></g>
              <path class="tensor-subset-link" d="M448 164 H592"><animate attributeName="d" values="M448 164 H592;M448 164 H592;M520 164 H592;M520 164 H592;M448 164 H592;M448 164 H592" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animate></path>
              <g class="tensor-edge-direction tensor-edge-direction-subset" transform="translate(520 164)"><animateTransform attributeName="transform" type="translate" values="520 164;520 164;556 164;556 164;520 164;520 164" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><path d="M -6 0 L 5 -5 L 5 5 z"></path></g>
            </g>

            <g class="tensor-right-a-node tensor-neutral-node tensor-step2-absorbed-node in-s" transform="translate(430 88)"><animateTransform attributeName="transform" type="translate" values="430 88;430 88;286 88;286 88;250 88;250 88" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">a</text></g>
            <g class="tensor-right-a-node tensor-neutral-node tensor-step2-absorbed-node" transform="translate(430 126)"><animateTransform attributeName="transform" type="translate" values="430 126;430 126;286 126;286 126;250 126;250 126" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">b</text></g>
            <g class="tensor-right-a-node tensor-neutral-node tensor-step2-absorbed-node in-s" transform="translate(430 164)"><animateTransform attributeName="transform" type="translate" values="430 164;430 164;286 164;286 164;250 164;250 164" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">c</text></g>
            <g class="tensor-right-a-node tensor-neutral-node tensor-step2-absorbed-node" transform="translate(430 202)"><animateTransform attributeName="transform" type="translate" values="430 202;430 202;286 202;286 202;250 202;250 202" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform><circle cx="0" cy="0" r="18"></circle><text x="0" y="7">d</text></g>
          </g>
          <g class="tensor-s-node tensor-neutral-node tensor-s-duplicate-node" transform="translate(430 88)">
            <animateTransform attributeName="transform" type="translate" values="430 88;430 88;502 88;502 88;430 88;430 88" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform>
            <circle cx="0" cy="0" r="18"></circle><text x="0" y="7">a</text>
          </g>
          <g class="tensor-s-node tensor-neutral-node tensor-s-duplicate-node" transform="translate(430 164)">
            <animateTransform attributeName="transform" type="translate" values="430 164;430 164;502 164;502 164;430 164;430 164" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform>
            <circle cx="0" cy="0" r="18"></circle><text x="0" y="7">c</text>
          </g>
          <g class="tensor-s-node" transform="translate(610 88)">
            <circle cx="0" cy="0" r="18"></circle><text x="0" y="7">a</text>
          </g>
          <g class="tensor-s-node" transform="translate(610 164)">
            <circle cx="0" cy="0" r="18"></circle><text x="0" y="7">c</text>
          </g>
          <g class="tensor-s-new-node tensor-neutral-node tensor-step2-absorbed-node" transform="translate(430 88)">
            <animateTransform attributeName="transform" type="translate" values="430 88;430 88;394 88;394 88;250 88;250 88" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform>
            <circle cx="0" cy="0" r="18"></circle><text x="0" y="7">a</text>
          </g>
          <g class="tensor-s-new-node tensor-neutral-node tensor-step2-absorbed-node" transform="translate(430 164)">
            <animateTransform attributeName="transform" type="translate" values="430 164;430 164;394 164;394 164;250 164;250 164" keyTimes="0;0.0806;0.2823;0.3387;0.5403;1" dur="12.4s" repeatCount="indefinite"></animateTransform>
            <circle cx="0" cy="0" r="18"></circle><text x="0" y="7">c</text>
          </g>

        </g>
      </svg>`,
    "lawvere-fourth": lawvereFourthFigureTemplate(),
    "topoi-automata": `
      <svg class="automata-cover-figure" viewBox="0 0 760 456" role="img" aria-labelledby="fig-automata-title fig-automata-desc">
        <title id="fig-automata-title">Automaton as a directed covering over a bouquet</title>
        <desc id="fig-automata-desc">A finite automaton is drawn as a directed graph over the one-vertex bouquet B Sigma. A moving point on the bouquet is lifted to a moving point in the automaton, and input words are classified into accept and reject output cells.</desc>
        <defs>
          <marker id="arrow-automata-cover-a" class="automata-marker-a" data-automata-marker="a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 z"></path></marker>
          <marker id="arrow-automata-cover-b" class="automata-marker-b" data-automata-marker="b" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 z"></path></marker>
          <marker id="arrow-automata-cover-neutral" class="automata-marker-neutral" data-automata-marker="neutral" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 z"></path></marker>
        </defs>
        <g transform="translate(22 18)">
          <g class="automata-input-tape" transform="translate(36 8)">
            <rect class="automata-input-panel" x="0" y="0" width="188" height="132" rx="12"></rect>
            <text class="figure-small automata-input-heading" x="18" y="24">Input:</text>
            <text class="figure-small automata-input-word" x="28" y="57"><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.0083;0.0208;0.995;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.0583;0.0708;0.995;1"></animate></tspan><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.1083;0.1208;0.995;1"></animate></tspan></text>
            <text class="figure-small automata-input-word" x="28" y="89"><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.3417;0.3542;0.995;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.3917;0.4042;0.995;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.4417;0.4542;0.995;1"></animate></tspan></text>
            <text class="figure-small automata-input-word" x="28" y="121"><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.675;0.6875;0.995;1"></animate></tspan><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.725;0.7375;0.995;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.775;0.7875;0.995;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.2;0.2;1" keyTimes="0;0.825;0.8375;0.995;1"></animate></tspan></text>
          </g>

          <path class="automata-input-start-link" d="M96 140 V232"></path>

          <g class="automata-dot-links">
            <line class="automata-dot-link" x1="95.8" y1="248.6" x2="616.7" y2="248.6">
              <animate attributeName="x1" dur="24s" repeatCount="indefinite" values="95.8;113;133.1;151.9;170.7;190.8;208.1;225.4;245;262.9;280.3;298.8;320.4;342;362.6;380.3;397.3;415.4;432.7;432.7;95.8;95.8" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3337;1"></animate>
              <animate attributeName="y1" dur="24s" repeatCount="indefinite" values="248.6;237.8;194;179.4;194;237.8;248.6;259.4;300.7;314.4;300.7;259.4;248.6;237.8;194;179.4;194;237.8;248.6;248.6;248.6;248.6" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3337;1"></animate>
              <animate attributeName="x2" dur="24s" repeatCount="indefinite" values="616.7;605;596;616.7;637.5;628.5;616.7;628.5;637.5;616.7;596;605;616.7;605;596;616.7;637.5;628.5;616.7;616.7;616.7;616.7" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3337;1"></animate>
              <animate attributeName="y2" dur="24s" repeatCount="indefinite" values="248.6;237.8;194;179.5;194;237.8;248.6;259.3;300.7;314.4;300.7;259.3;248.6;237.8;194;179.5;194;237.8;248.6;248.6;248.6;248.6" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3337;1"></animate>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.325;0.3333;1"></animate>
            </line>
            <line class="automata-dot-link" x1="95.8" y1="248.6" x2="616.7" y2="248.6">
              <animate attributeName="x1" dur="24s" repeatCount="indefinite" values="95.8;95.8;95.8;113;133.1;151.9;170.7;190.8;208.1;225.4;245;262.9;280.3;298.8;320.4;298.8;295.2;320.4;345.6;342;320.4;320.4;95.8;95.8" keyTimes="0;0.3332;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.6671;1"></animate>
              <animate attributeName="y1" dur="24s" repeatCount="indefinite" values="248.6;248.6;248.6;237.8;194;179.4;194;237.8;248.6;259.4;300.7;314.4;300.7;259.4;248.6;259.4;300.7;314.4;300.7;259.4;248.6;248.6;248.6;248.6" keyTimes="0;0.3332;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.6671;1"></animate>
              <animate attributeName="x2" dur="24s" repeatCount="indefinite" values="616.7;616.7;616.7;605;596;616.7;637.5;628.5;616.7;628.5;637.5;616.7;596;605;616.7;628.5;637.5;616.7;596;605;616.7;616.7;616.7;616.7" keyTimes="0;0.3332;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.6671;1"></animate>
              <animate attributeName="y2" dur="24s" repeatCount="indefinite" values="248.6;248.6;248.6;237.8;194;179.5;194;237.8;248.6;259.3;300.7;314.4;300.7;259.3;248.6;259.3;300.7;314.4;300.7;259.3;248.6;248.6;248.6;248.6" keyTimes="0;0.3332;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.6671;1"></animate>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.3332;0.3333;0.6583;0.6667;1"></animate>
            </line>
            <line class="automata-dot-link" x1="95.8" y1="248.6" x2="616.7" y2="248.6">
              <animate attributeName="x1" dur="24s" repeatCount="indefinite" values="95.8;95.8;95.8;113;133.1;151.9;170.7;190.8;208.1;190.8;183.5;208.1;232.7;225.4;208.1;225.4;245;262.9;280.3;298.8;320.4;298.8;295.2;320.4;345.6;342;320.4;320.4" keyTimes="0;0.6666;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animate>
              <animate attributeName="y1" dur="24s" repeatCount="indefinite" values="248.6;248.6;248.6;237.8;194;179.4;194;237.8;248.6;237.8;194;179.4;194;237.8;248.6;259.4;300.7;314.4;300.7;259.4;248.6;259.4;300.7;314.4;300.7;259.4;248.6;248.6" keyTimes="0;0.6666;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animate>
              <animate attributeName="x2" dur="24s" repeatCount="indefinite" values="616.7;616.7;616.7;605;596;616.7;637.5;628.5;616.7;605;596;616.7;637.5;628.5;616.7;628.5;637.5;616.7;596;605;616.7;628.5;637.5;616.7;596;605;616.7;616.7" keyTimes="0;0.6666;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animate>
              <animate attributeName="y2" dur="24s" repeatCount="indefinite" values="248.6;248.6;248.6;237.8;194;179.5;194;237.8;248.6;237.8;194;179.5;194;237.8;248.6;259.3;300.7;314.4;300.7;259.3;248.6;259.3;300.7;314.4;300.7;259.3;248.6;248.6" keyTimes="0;0.6666;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animate>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.6666;0.6667;0.9958;1"></animate>
            </line>
          </g>

          <g transform="translate(18 106) scale(1.08)">
            <path class="figure-arrow automata-edge automata-edge-a" d="M88 122 C114 50, 134 50, 160 122"></path>
            <path class="figure-arrow automata-edge automata-edge-a" d="M160 122 C118 50, 234 50, 192 122"></path>
            <path class="figure-arrow automata-edge automata-edge-a" d="M300 122 C328 50, 344 50, 368 122"></path>
            <path class="figure-arrow automata-edge automata-edge-a" d="M368 122 C326 50, 438 50, 400 122"></path>

            <path class="figure-arrow automata-edge automata-edge-b" d="M88 142 C126 210, 18 210, 56 142"></path>
            <path class="figure-arrow automata-edge automata-edge-b" d="M192 142 C220 210, 236 210, 260 142"></path>
            <path class="figure-arrow automata-edge automata-edge-b" d="M260 142 C226 210, 334 210, 300 142"></path>
            <path class="figure-arrow automata-edge automata-edge-b" d="M368 145 C344 218, 318 216, 291 151"></path>

            <g class="automata-consume-effects">
              <g class="automata-consume-effect automata-consume-effect-a">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.0083;0.0091;0.0255;0.026;1"></animate>
                <circle cx="72" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.0083;0.0091;0.0255;0.026;1"></animate></circle>
                <path d="M72 132 C78 126, 87 119, 98 115"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-b">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.0583;0.0591;0.0755;0.076;1"></animate>
                <circle cx="176" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.0583;0.0591;0.0755;0.076;1"></animate></circle>
                <path d="M176 132 C184 138, 193 145, 204 151"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-a">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.1083;0.1091;0.1255;0.126;1"></animate>
                <circle cx="280" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.1083;0.1091;0.1255;0.126;1"></animate></circle>
                <path d="M280 132 C288 126, 297 119, 308 115"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-a">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.3417;0.3425;0.3589;0.3594;1"></animate>
                <circle cx="72" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.3417;0.3425;0.3589;0.3594;1"></animate></circle>
                <path d="M72 132 C78 126, 87 119, 98 115"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-b">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.3917;0.3925;0.4089;0.4094;1"></animate>
                <circle cx="176" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.3917;0.3925;0.4089;0.4094;1"></animate></circle>
                <path d="M176 132 C184 138, 193 145, 204 151"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-b">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.4417;0.4425;0.4589;0.4594;1"></animate>
                <circle cx="280" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.4417;0.4425;0.4589;0.4594;1"></animate></circle>
                <path d="M280 132 C288 138, 297 145, 308 151"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-a">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.675;0.6758;0.6922;0.6927;1"></animate>
                <circle cx="72" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.675;0.6758;0.6922;0.6927;1"></animate></circle>
                <path d="M72 132 C78 126, 87 119, 98 115"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-a">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.725;0.7258;0.7422;0.7427;1"></animate>
                <circle cx="176" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.725;0.7258;0.7422;0.7427;1"></animate></circle>
                <path d="M176 132 C170 126, 161 119, 150 115"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-b">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.775;0.7758;0.7922;0.7927;1"></animate>
                <circle cx="176" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.775;0.7758;0.7922;0.7927;1"></animate></circle>
                <path d="M176 132 C184 138, 193 145, 204 151"></path>
              </g>
              <g class="automata-consume-effect automata-consume-effect-b">
                <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0;0" keyTimes="0;0.825;0.8258;0.8422;0.8427;1"></animate>
                <circle cx="280" cy="132" r="10"><animate attributeName="r" dur="24s" repeatCount="indefinite" values="10;10;13;27;27;10" keyTimes="0;0.825;0.8258;0.8422;0.8427;1"></animate></circle>
                <path d="M280 132 C288 138, 297 145, 308 151"></path>
              </g>
            </g>

            <g class="automata-edge-highlights">
              <path class="automata-edge-highlight automata-edge-highlight-a" marker-end="url(#arrow-automata-cover-a)" d="M88 122 C114 50, 134 50, 160 122"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.0042;0.0083;0.05;0.0583;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-b" marker-end="url(#arrow-automata-cover-b)" d="M192 142 C220 210, 236 210, 260 142"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.0542;0.0583;0.1;0.1083;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-a" marker-end="url(#arrow-automata-cover-a)" d="M300 122 C328 50, 344 50, 368 122"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.1042;0.1083;0.15;0.1583;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-a" marker-end="url(#arrow-automata-cover-a)" d="M88 122 C114 50, 134 50, 160 122"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.3375;0.3417;0.3833;0.3917;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-b" marker-end="url(#arrow-automata-cover-b)" d="M192 142 C220 210, 236 210, 260 142"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.3875;0.3917;0.4333;0.4417;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-b" marker-end="url(#arrow-automata-cover-b)" d="M260 142 C226 210, 334 210, 300 142"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.4375;0.4417;0.4833;0.4917;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-a" marker-end="url(#arrow-automata-cover-a)" d="M88 122 C114 50, 134 50, 160 122"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6708;0.675;0.7167;0.725;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-a" marker-end="url(#arrow-automata-cover-a)" d="M160 122 C118 50, 234 50, 192 122"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.7208;0.725;0.7667;0.775;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-b" marker-end="url(#arrow-automata-cover-b)" d="M192 142 C220 210, 236 210, 260 142"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.7708;0.775;0.8167;0.825;1"></animate></path>
              <path class="automata-edge-highlight automata-edge-highlight-b" marker-end="url(#arrow-automata-cover-b)" d="M260 142 C226 210, 334 210, 300 142"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.8208;0.825;0.8667;0.875;1"></animate></path>
            </g>

            <g class="automata-state" transform="translate(72 132)">
              <circle class="figure-node" cx="0" cy="0" r="17"></circle>
            </g>
            <g class="automata-state" transform="translate(176 132)">
              <circle class="figure-node" cx="0" cy="0" r="17"></circle>
            </g>
            <g class="automata-state" transform="translate(280 132)">
              <circle class="figure-node" cx="0" cy="0" r="17"></circle>
            </g>
            <g class="automata-state" transform="translate(384 132)">
              <circle class="figure-node" cx="0" cy="0" r="17"></circle>
            </g>

            <g class="automata-moving-dot automata-moving-dot-cover automata-moving-dot-word-u">
              <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="72 132;72 132;106.6 81.5;124 68;141.4 81.5;160 122;176 132;176 132;210.2 180.3;226.8 193;242.9 180.3;260 142;280 132;280 132;319.1 81.5;335.5 68;351.2 81.5;368 122;384 132;384 132;72 132;72 132" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3337;1"></animateTransform>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.325;0.3333;1"></animate>
              <circle class="automata-moving-dot-halo" cx="0" cy="0" r="11"></circle>
              <circle class="automata-moving-dot-core" cx="0" cy="0" r="9.6"></circle>
            </g>
            <g class="automata-moving-dot automata-moving-dot-cover automata-moving-dot-word-v">
              <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="72 132;72 132;72 132;72 132;106.6 81.5;124 68;141.4 81.5;160 122;176 132;176 132;210.2 180.3;226.8 193;242.9 180.3;260 142;280 132;280 132;256.7 180.3;280 193;303.3 180.3;300 142;280 132;280 132;72 132;72 132" keyTimes="0;0.3332;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.6671;1"></animateTransform>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.3332;0.3333;0.6583;0.6667;1"></animate>
              <circle class="automata-moving-dot-halo" cx="0" cy="0" r="11"></circle>
              <circle class="automata-moving-dot-core" cx="0" cy="0" r="9.6"></circle>
            </g>
            <g class="automata-moving-dot automata-moving-dot-cover automata-moving-dot-word-w">
              <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="72 132;72 132;72 132;72 132;106.6 81.5;124 68;141.4 81.5;160 122;176 132;176 132;153.2 81.5;176 68;198.8 81.5;192 122;176 132;176 132;210.2 180.3;226.8 193;242.9 180.3;260 142;280 132;280 132;256.7 180.3;280 193;303.3 180.3;300 142;280 132;280 132" keyTimes="0;0.6666;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animateTransform>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.6666;0.6667;0.9958;1"></animate>
              <circle class="automata-moving-dot-halo" cx="0" cy="0" r="11"></circle>
              <circle class="automata-moving-dot-core" cx="0" cy="0" r="9.6"></circle>
            </g>

            <g class="automata-moving-word automata-moving-word-u">
              <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="72 132;72 132;106.6 81.5;124 68;141.4 81.5;160 122;176 132;176 132;210.2 180.3;226.8 193;242.9 180.3;260 142;280 132;280 132;319.1 81.5;335.5 68;351.2 81.5;368 122;384 132;384 132;72 132;72 132" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3337;1"></animateTransform>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.1458;0.1542;1"></animate>
              <text x="14" y="-14"><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.0083;0.0208;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#9f3f31;#ffd866;#fff6bf;#9f3f31;#9f3f31" keyTimes="0;0.0083;0.0146;0.0208;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.0583;0.0708;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#2f5d8e;#d8eeff;#ffffff;#2f5d8e;#2f5d8e" keyTimes="0;0.0583;0.0646;0.0708;1"></animate></tspan><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.1083;0.1208;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#9f3f31;#ffd866;#fff6bf;#9f3f31;#9f3f31" keyTimes="0;0.1083;0.1146;0.1208;1"></animate></tspan></text>
            </g>
            <g class="automata-moving-word automata-moving-word-v">
              <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="72 132;72 132;72 132;72 132;106.6 81.5;124 68;141.4 81.5;160 122;176 132;176 132;210.2 180.3;226.8 193;242.9 180.3;260 142;280 132;280 132;256.7 180.3;280 193;303.3 180.3;300 142;280 132;280 132;72 132;72 132" keyTimes="0;0.3332;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.6671;1"></animateTransform>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.3332;0.3333;0.4792;0.4875;1"></animate>
              <text x="14" y="-14"><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.3417;0.3542;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#9f3f31;#ffd866;#fff6bf;#9f3f31;#9f3f31" keyTimes="0;0.3417;0.3479;0.3542;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.3917;0.4042;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#2f5d8e;#d8eeff;#ffffff;#2f5d8e;#2f5d8e" keyTimes="0;0.3917;0.3979;0.4042;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.4417;0.4542;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#2f5d8e;#d8eeff;#ffffff;#2f5d8e;#2f5d8e" keyTimes="0;0.4417;0.4479;0.4542;1"></animate></tspan></text>
            </g>
            <g class="automata-moving-word automata-moving-word-w">
              <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="72 132;72 132;72 132;72 132;106.6 81.5;124 68;141.4 81.5;160 122;176 132;176 132;153.2 81.5;176 68;198.8 81.5;192 122;176 132;176 132;210.2 180.3;226.8 193;242.9 180.3;260 142;280 132;280 132;256.7 180.3;280 193;303.3 180.3;300 142;280 132;280 132" keyTimes="0;0.6666;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animateTransform>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6666;0.6667;0.8625;0.8708;1"></animate>
              <text x="14" y="-14"><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.675;0.6875;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#9f3f31;#ffd866;#fff6bf;#9f3f31;#9f3f31" keyTimes="0;0.675;0.6813;0.6875;1"></animate></tspan><tspan class="automata-word-a">a<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.725;0.7375;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#9f3f31;#ffd866;#fff6bf;#9f3f31;#9f3f31" keyTimes="0;0.725;0.7313;0.7375;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.775;0.7875;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#2f5d8e;#d8eeff;#ffffff;#2f5d8e;#2f5d8e" keyTimes="0;0.775;0.7813;0.7875;1"></animate></tspan><tspan class="automata-word-b">b<animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0.15;0.15;1" keyTimes="0;0.825;0.8375;0.995;1"></animate><animate attributeName="fill" dur="24s" repeatCount="indefinite" values="#2f5d8e;#d8eeff;#ffffff;#2f5d8e;#2f5d8e" keyTimes="0;0.825;0.8313;0.8375;1"></animate></tspan></text>
            </g>

            <g class="automata-state-mark-layer">
              <g transform="translate(72 132)">
                <path class="automata-state-mark automata-state-cross" d="M-6 -6 L6 6 M6 -6 L-6 6"></path>
              </g>
              <g transform="translate(176 132)">
                <path class="automata-state-mark automata-state-check" d="M-7 -1 L-2 5 L8 -7"></path>
              </g>
              <g transform="translate(280 132)">
                <path class="automata-state-mark automata-state-check" d="M-7 -1 L-2 5 L8 -7"></path>
              </g>
              <g transform="translate(384 132)">
                <path class="automata-state-mark automata-state-cross" d="M-6 -6 L6 6 M6 -6 L-6 6"></path>
              </g>
            </g>

          </g>

          <g transform="translate(506 178) scale(0.98)">
            <g transform="translate(113 72)">
              <path class="figure-arrow automata-edge automata-edge-a" d="M-12 -11 C-58 -90.4, 58 -90.4, 12 -11"></path>
              <path class="figure-arrow automata-edge automata-edge-b" d="M12 11 C58 86, -58 86, -12 11"></path>
              <circle class="figure-node" cx="0" cy="0" r="15"></circle>
              <g class="automata-moving-dot automata-moving-dot-base">
                <animateTransform attributeName="transform" type="translate" dur="24s" repeatCount="indefinite" calcMode="linear" values="0 0;-12 -11;-21.2 -55.7;0 -70.5;21.2 -55.7;12 -11;0 0;12 11;21.2 53.2;0 67.2;-21.2 53.2;-12 11;0 0;-12 -11;-21.2 -55.7;0 -70.5;21.2 -55.7;12 -11;0 0;0 0;-12 -11;-21.2 -55.7;0 -70.5;21.2 -55.7;12 -11;0 0;12 11;21.2 53.2;0 67.2;-21.2 53.2;-12 11;0 0;12 11;21.2 53.2;0 67.2;-21.2 53.2;-12 11;0 0;0 0;-12 -11;-21.2 -55.7;0 -70.5;21.2 -55.7;12 -11;0 0;-12 -11;-21.2 -55.7;0 -70.5;21.2 -55.7;12 -11;0 0;12 11;21.2 53.2;0 67.2;-21.2 53.2;-12 11;0 0;12 11;21.2 53.2;0 67.2;-21.2 53.2;-12 11;0 0;0 0" keyTimes="0;0.0083;0.0167;0.025;0.0333;0.0417;0.05;0.0583;0.0667;0.075;0.0833;0.0917;0.1;0.1083;0.1167;0.125;0.1333;0.1417;0.15;0.3333;0.3417;0.35;0.3583;0.3667;0.375;0.3833;0.3917;0.4;0.4083;0.4167;0.425;0.4333;0.4417;0.45;0.4583;0.4667;0.475;0.4833;0.6667;0.675;0.6833;0.6917;0.7;0.7083;0.7167;0.725;0.7333;0.7417;0.75;0.7583;0.7667;0.775;0.7833;0.7917;0.8;0.8083;0.8167;0.825;0.8333;0.8417;0.85;0.8583;0.8667;1"></animateTransform>
                <circle class="automata-moving-dot-halo" cx="0" cy="0" r="11"></circle>
                <circle class="automata-moving-dot-core" cx="0" cy="0" r="9.6"></circle>
              </g>
            </g>
          </g>

          <g class="automata-output-panel" transform="translate(476 42)">
            <rect class="automata-output-panel-bg" x="0" y="0" width="230" height="64" rx="12"></rect>
            <text class="figure-small automata-output-heading" x="18" y="24">Output</text>
            <rect class="automata-current-output-block" x="78" y="7" width="130" height="40" rx="10"></rect>
          </g>
          <g class="automata-result-output automata-language-reject">
            <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M432.7 248.6 C506 282, 556 338, 584 408" keyTimes="0;0.1542;0.1708;0.9958;1" keyPoints="0;0;1;1;0"></animateMotion>
            <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.1542;0.1708;0.9958;1"></animate>
            <g class="automata-output-token automata-output-token-reject">
              <text class="figure-small automata-output-word" x="0" y="4"><tspan class="automata-word-a">a</tspan><tspan class="automata-word-b">b</tspan><tspan class="automata-word-a">a</tspan></text>
            </g>
          </g>
          <g class="automata-result-output automata-language-accept">
            <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M320.4 248.6 C420 280, 520 326, 582 373" keyTimes="0;0.4875;0.5042;0.9958;1" keyPoints="0;0;1;1;0"></animateMotion>
            <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.4875;0.5042;0.9958;1"></animate>
            <g class="automata-output-token automata-output-token-accept">
              <text class="figure-small automata-output-word" x="0" y="4"><tspan class="automata-word-a">a</tspan><tspan class="automata-word-b">b</tspan><tspan class="automata-word-b">b</tspan></text>
            </g>
          </g>
          <g class="automata-result-output automata-language-accept">
            <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M320.4 248.6 C436 302, 546 342, 642 373" keyTimes="0;0.8708;0.8875;0.9958;1" keyPoints="0;0;1;1;0"></animateMotion>
            <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.8708;0.8875;0.9958;1"></animate>
            <g class="automata-output-token automata-output-token-accept">
              <text class="figure-small automata-output-word" x="0" y="4"><tspan class="automata-word-a">a</tspan><tspan class="automata-word-a">a</tspan><tspan class="automata-word-b">b</tspan><tspan class="automata-word-b">b</tspan></text>
            </g>
          </g>
          <g class="automata-consuming-letters">
            <g class="automata-consumed-letter automata-consumed-letter-a">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M64 60 C74 116, 86 192, 95.8 248.6" keyTimes="0;0.0083;0.0208;1" keyPoints="0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.0083;0.0208;1"></animate>
              <text x="0" y="5">a</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-b">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M72 60 C108 120, 160 202, 208.1 248.6" keyTimes="0;0.0521;0.0583;0.0708;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.0521;0.0583;0.0708;1"></animate>
              <text x="0" y="5">b</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-a">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M80 60 C156 128, 252 212, 320.4 248.6" keyTimes="0;0.1021;0.1083;0.1208;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.1021;0.1083;0.1208;1"></animate>
              <text x="0" y="5">a</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-a">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M64 92 C76 138, 88 200, 95.8 248.6" keyTimes="0;0.3354;0.3417;0.3542;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.3354;0.3417;0.3542;1"></animate>
              <text x="0" y="5">a</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-b">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M72 92 C110 146, 162 214, 208.1 248.6" keyTimes="0;0.3854;0.3917;0.4042;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.3854;0.3917;0.4042;1"></animate>
              <text x="0" y="5">b</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-b">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M80 92 C156 152, 252 218, 320.4 248.6" keyTimes="0;0.4354;0.4417;0.4542;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.4354;0.4417;0.4542;1"></animate>
              <text x="0" y="5">b</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-a">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M64 124 C78 158, 90 208, 95.8 248.6" keyTimes="0;0.6688;0.675;0.6875;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.6688;0.675;0.6875;1"></animate>
              <text x="0" y="5">a</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-a">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M72 124 C112 160, 164 218, 208.1 248.6" keyTimes="0;0.7188;0.725;0.7375;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.7188;0.725;0.7375;1"></animate>
              <text x="0" y="5">a</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-b">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M80 124 C120 166, 166 224, 208.1 248.6" keyTimes="0;0.7688;0.775;0.7875;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.7688;0.775;0.7875;1"></animate>
              <text x="0" y="5">b</text>
            </g>
            <g class="automata-consumed-letter automata-consumed-letter-b">
              <animateMotion dur="24s" repeatCount="indefinite" calcMode="linear" path="M88 124 C166 170, 260 224, 320.4 248.6" keyTimes="0;0.8188;0.825;0.8375;1" keyPoints="0;0;1;1;0"></animateMotion>
              <animate attributeName="opacity" dur="24s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.8188;0.825;0.8375;1"></animate>
              <text x="0" y="5">b</text>
            </g>
          </g>
        </g>
      </svg>`,
    "games-coalgebras": grundyFigureTemplate(),
    "normalization": normalizationFigureTemplate()
  };

  const paperDiagramNotes = {
    "internal-parameterizations": {
      heading: "Local State Classifier",
      keywords: ["hyperconnected quotient", "local state", "classifier", "internal parameterization"],
      concepts: [
        ["Local state classifier", "An object that packages locally determined states and compares them across inclusions."],
        ["Hyperconnected quotient", "A quotient geometric morphism controlled by internal local data."]
      ],
      results: ["Hyperconnected quotients can be parameterized inside the ambient topos by local state classifiers."]
    },
    "quotient-toposes": {
      heading: "Height And Period",
      keywords: ["discrete dynamics", "quotient topos", "height", "period"],
      concepts: [
        ["Discrete dynamical system", "A set equipped with a self-map, drawn here by arrows between states."],
        ["Invariant class", "A class of systems closed under the categorical operations relevant to quotient topoi."]
      ],
      results: ["Quotient topoi of discrete dynamical systems are organized by numerical dynamics such as height and period."]
    },
    "completely-connected": {
      heading: "Completely Connected Topoi",
      keywords: ["connectedness", "Grothendieck topos", "site", "rooted trees"],
      concepts: [
        ["Completely connected", "A strengthened connectedness property detected through adjoints to global sections."],
        ["Site presentation", "A concrete category of shapes used to present the topos."]
      ],
      results: ["The paper gives a site-theoretic way to build a Grothendieck topos with a long adjoint pattern."]
    },
    "lawvere-first": {
      heading: "Image Factorization And Minimal Expression",
      keywords: ["Lawvere problem", "coend", "tensor notation", "epi-mono factorization", "minimal expression"],
      concepts: [
        ["Model case", "For the covariant power set functor, an expression is a pair of a map f from A to X and a subset S of A."],
        ["Epi-mono factorization", "The restricted map f|S factors as S onto f(S), followed by the inclusion of f(S) into X."],
        ["Minimal expression", "The paper's Section 3 calculation replaces the original expression by the image expression, whose length is the size of f(S)."]
      ],
      results: ["This is the model-case calculation from Section 3: (X <- f A) tensor (S subset A) reduces to (X <- f(S)) tensor (f(S) subset f(S))."]
    },
    "lawvere-fourth": {
      heading: "Pullback And Levels",
      keywords: ["Lawvere problem", "species", "symmetric simplicial set", "pullback", "level"],
      concepts: [
        ["Species", "A structure indexed by finite sets and symmetries."],
        ["Graph pullback", "For a graph y on B and a map alpha: A -> B, the graph x=y alpha on A is obtained by pulling back the edge subset of y."],
        ["EZ-decomposition", "An M-structure x is written as x=y alpha with alpha surjective and y non-degenerate; the colours record the induced EZ-congruence."],
        ["Level", "A layer in the topos of symmetric simplicial sets used to measure locality."]
      ],
      results: ["The pullback behaviour of structures under maps of finite sets is the local combinatorics behind the level calculation."]
    },
    "topoi-automata": {
      heading: "Automata As Coverings",
      keywords: ["automata", "bouquet", "directed covering", "Sigma-sets", "regular languages"],
      concepts: [
        ["Bouquet", "The one-vertex directed graph with one loop for each letter in the alphabet."],
        ["Directed covering", "A graph over the bouquet in which each state has one outgoing lift of every letter-loop."],
        ["Finite automaton", "A finite Sigma-set drawn as this covering graph, together with an initial state and accepting states."]
      ],
      results: ["This picture makes the topos of orbit-finite Sigma-sets visible as a geometry of finite-state directed covers over the alphabet bouquet."]
    },
    "games-coalgebras": {
      heading: "Games As Recursive Coalgebras",
      keywords: ["Nim", "coalgebra", "combinatorial games", "Sprague-Grundy"],
      concepts: [
        ["Recursive coalgebra", "A coalgebra whose unfolding describes recursively generated positions."],
        ["Grundy number", "A value computed by the mex of the values reachable in one move."],
        ["Nim-sum", "The operation that controls sums of impartial games."]
      ],
      results: ["Impartial games and the Nim-sum can be read categorically through recursive coalgebras."]
    },
    normalization: {
      heading: "Normalizer Map",
      keywords: ["normalization", "subgroup", "word congruence", "local state classifier"],
      concepts: [
        ["Normalizer", "An operator sending a subgroup to the largest ambient symmetry preserving it."],
        ["Generalized normalization", "A common pattern appearing for subgroups, topoi, and word congruences."]
      ],
      results: ["The subgroup picture motivates a normalization operator that also applies to topoi and algebraic language theory."]
    }
  };

  const normalizationContainment = {
    d4: ["d4", "v0", "v1", "rot", "r2", "ref0", "ref1", "ref2", "ref3", "one"],
    v0: ["v0", "r2", "ref0", "ref2", "one"],
    v1: ["v1", "r2", "ref1", "ref3", "one"],
    rot: ["rot", "r2", "one"],
    r2: ["r2", "one"],
    ref0: ["ref0", "one"],
    ref1: ["ref1", "one"],
    ref2: ["ref2", "one"],
    ref3: ["ref3", "one"],
    one: ["one"]
  };

  const normalizationConjugateDownsets = {
    ...normalizationContainment,
    ref0: ["ref0", "ref2", "one"],
    ref2: ["ref0", "ref2", "one"],
    ref1: ["ref1", "ref3", "one"],
    ref3: ["ref1", "ref3", "one"]
  };

  const normalizationElementLabels = {
    e: "1",
    s: "sigma",
    s2: "sigma^2",
    s3: "sigma^3",
    t: "tau",
    st: "sigma tau",
    s2t: "sigma^2 tau",
    s3t: "sigma^3 tau"
  };

  const normalizationElementDisplayLabels = {
    e: "1",
    s: "σ",
    s2: "σ²",
    s3: "σ³",
    t: "τ",
    st: "στ",
    s2t: "σ²τ",
    s3t: "σ³τ"
  };

  const normalizationSubgroupElements = {
    d4: ["e", "s", "s2", "s3", "t", "st", "s2t", "s3t"],
    v0: ["e", "s2", "t", "s2t"],
    v1: ["e", "s2", "st", "s3t"],
    rot: ["e", "s", "s2", "s3"],
    r2: ["e", "s2"],
    ref0: ["e", "t"],
    ref1: ["e", "st"],
    ref2: ["e", "s2t"],
    ref3: ["e", "s3t"],
    one: ["e"]
  };

  const normalizationSubgroupCoordinates = {
    d4: [150, 38],
    v0: [70, 112],
    rot: [150, 112],
    v1: [230, 112],
    ref0: [35, 236],
    ref2: [95, 236],
    r2: [150, 236],
    ref1: [205, 236],
    ref3: [265, 236],
    one: [150, 322]
  };

  const normalizationSubgroupNodeHalfExtents = {
    d4: [11, 11],
    v0: [11, 11],
    rot: [11, 11],
    v1: [11, 11],
    ref0: [11, 11],
    ref2: [11, 11],
    r2: [11, 11],
    ref1: [11, 11],
    ref3: [11, 11],
    one: [11, 11]
  };

  const normalizationHasseEdges = [
    ["d4", "v0"],
    ["d4", "rot"],
    ["d4", "v1"],
    ["v0", "ref0"],
    ["v0", "ref2"],
    ["v0", "r2"],
    ["rot", "r2"],
    ["v1", "r2"],
    ["v1", "ref1"],
    ["v1", "ref3"],
    ["one", "ref0"],
    ["one", "ref2"],
    ["one", "r2"],
    ["one", "ref1"],
    ["one", "ref3"]
  ];

  const normalizationNormalizerTargets = {
    d4: "d4",
    v0: "d4",
    rot: "d4",
    v1: "d4",
    ref0: "v0",
    ref2: "v0",
    r2: "d4",
    ref1: "v1",
    ref3: "v1",
    one: "d4"
  };

  const normalizationElementOrder = Object.keys(normalizationElementLabels);

  const normalizationElementCoordinates = {
    orientation: {
      o0: [21, 23],
      o1: [45, 23]
    },
    halfturn: {
      h0: [8, 13],
      h1: [48, 13],
      h2: [48, 37],
      h3: [8, 37]
    },
    free: {
      e: [21, -1],
      s: [37, 5],
      s2: [43, 21],
      s3: [37, 37],
      t: [21, 43],
      st: [5, 37],
      s2t: [-1, 21],
      s3t: [5, 5]
    },
  };

  const normalizationElementTuples = {
    e: [0, 0],
    s: [1, 0],
    s2: [2, 0],
    s3: [3, 0],
    t: [0, 1],
    st: [1, 1],
    s2t: [2, 1],
    s3t: [3, 1]
  };

  const normalizationTupleElements = Object.fromEntries(
    Object.entries(normalizationElementTuples).map(([element, tuple]) => [tuple.join(","), element])
  );

  const normalizationD4Matrices = {
    e: [1, 0, 0, 1],
    s: [0, 1, -1, 0],
    s2: [-1, 0, 0, -1],
    s3: [0, -1, 1, 0],
    t: [0, 1, 1, 0],
    st: [-1, 0, 0, 1],
    s2t: [0, -1, -1, 0],
    s3t: [1, 0, 0, -1]
  };

  const normalizationRotationStepDegrees = {
    e: 0,
    s: 90,
    s2: 180,
    s3: -90
  };

  const normalizationGeometricMotion = {
    vertex: [21, 25],
    edge: [21, 25],
    center: [21, 25]
  };

  const normalizationSquareBodyCenter = [21, 25];
  const normalizationOldLatticeGlobalOffset = [315, 54];
  const normalizationNewLatticeGlobalOffset = [620, 54];
  const normalizationLatticeGlobalScale = 0.88;
  const normalizationLatticeGlobalOffset = normalizationOldLatticeGlobalOffset;
  const normalizationSquareStageGlobalOrigin = [50, 131];
  const normalizationSquareStageScale = 4.6;
  const normalizationActionDotRadius = 3.2;
  const normalizationActionPointGlobalRadius = normalizationActionDotRadius * normalizationSquareStageScale;

  const normalizationOrbitCoordinates = {
    vertex: {
      v0: [-1, -1],
      v1: [1, -1],
      v2: [1, 1],
      v3: [-1, 1]
    },
    edge: {
      e0: [0, -1],
      e1: [1, 0],
      e2: [0, 1],
      e3: [-1, 0]
    },
    center: {
      p0: [0, 0]
    }
  };

  const normalizationMotionState = new WeakMap();
  const normalizationSubgroupMotionState = new WeakMap();
  const normalizationHasseEdgeMotionState = new WeakMap();
  const normalizationStabilizerLinkMotionState = new WeakMap();
  const normalizationOperatorLinkMotionState = new WeakMap();

  function normalizationMultiplyElements(left, right) {
    const leftTuple = normalizationElementTuples[left] || normalizationElementTuples.e;
    const rightTuple = normalizationElementTuples[right] || normalizationElementTuples.e;
    const rotationSign = leftTuple[1] ? -1 : 1;
    const rotation = (leftTuple[0] + rotationSign * rightTuple[0] + 4) % 4;
    const reflection = (leftTuple[1] + rightTuple[1]) % 2;
    return normalizationTupleElements[[rotation, reflection].join(",")] || "e";
  }

  function normalizationInverseElement(elementId) {
    return (
      normalizationElementOrder.find(
        (candidate) =>
          normalizationMultiplyElements(elementId, candidate) === "e" &&
          normalizationMultiplyElements(candidate, elementId) === "e"
      ) || "e"
    );
  }

  function normalizationConjugateElement(conjugator, elementId) {
    return normalizationMultiplyElements(
      normalizationMultiplyElements(conjugator, elementId),
      normalizationInverseElement(conjugator)
    );
  }

  function normalizationElementSetKey(elements) {
    const elementSet = new Set(elements);
    return normalizationElementOrder.filter((elementId) => elementSet.has(elementId)).join(" ");
  }

  const normalizationSubgroupByElementSet = Object.fromEntries(
    Object.entries(normalizationSubgroupElements).map(([subgroupId, elements]) => [
      normalizationElementSetKey(elements),
      subgroupId
    ])
  );

  function normalizationConjugateSubgroup(conjugator, subgroupId) {
    const elements = normalizationSubgroupElements[subgroupId] || normalizationSubgroupElements.one;
    const conjugatedElements = elements.map((elementId) => normalizationConjugateElement(conjugator, elementId));
    return normalizationSubgroupByElementSet[normalizationElementSetKey(conjugatedElements)] || subgroupId;
  }

  function normalizationPointByCoordinate(orbit, coordinate) {
    const [targetX, targetY] = coordinate;
    const coordinates = normalizationOrbitCoordinates[orbit] || {};
    return Object.entries(coordinates).find(([, [x, y]]) => x === targetX && y === targetY)?.[0] || "";
  }

  function normalizationTargetCoordinate(elementId, coordinate) {
    const [x, y] = coordinate;
    const [a, b, c, d] = normalizationD4Matrices[elementId] || normalizationD4Matrices.e;
    return [a * x + c * y, b * x + d * y];
  }

  function normalizationHalfturnTargetPoint(elementId, pointId) {
    const representatives = {
      h0: "e",
      h1: "s",
      h2: "st",
      h3: "t"
    };
    const product = normalizationMultiplyElements(elementId, representatives[pointId] || "e");
    const tuple = normalizationElementTuples[product] || normalizationElementTuples.e;
    if (!tuple[1]) return tuple[0] % 2 === 0 ? "h0" : "h1";
    return tuple[0] % 2 === 0 ? "h3" : "h2";
  }

  function normalizationTargetPoint(orbit, elementId, pointId) {
    if (orbit === "vertex" || orbit === "edge" || orbit === "center") {
      const coordinate = normalizationOrbitCoordinates[orbit]?.[pointId];
      if (!coordinate) return pointId;
      return normalizationPointByCoordinate(orbit, normalizationTargetCoordinate(elementId, coordinate)) || pointId;
    }
    if (orbit === "free") return normalizationMultiplyElements(elementId, pointId);
    if (orbit === "halfturn") return normalizationHalfturnTargetPoint(elementId, pointId);
    if (orbit === "orientation") {
      const tuple = normalizationElementTuples[elementId] || normalizationElementTuples.e;
      if (!tuple[1]) return pointId;
      return pointId === "o0" ? "o1" : "o0";
    }
    return pointId;
  }

  function normalizationFormatPoint(point) {
    return point.map((value) => Number(value.toFixed(2))).join(" ");
  }

  function normalizationBoundaryPointOnCircle(center, toward, radius) {
    const dx = toward[0] - center[0];
    const dy = toward[1] - center[1];
    const length = Math.hypot(dx, dy);
    if (!length) return center;
    return [
      center[0] + (dx / length) * radius,
      center[1] + (dy / length) * radius
    ];
  }

  function normalizationBoundaryPointOnRect(center, toward, halfExtents) {
    const dx = toward[0] - center[0];
    const dy = toward[1] - center[1];
    if (!dx && !dy) return center;
    const [halfWidth, halfHeight] = halfExtents;
    const scale = Math.min(
      dx ? halfWidth / Math.abs(dx) : Infinity,
      dy ? halfHeight / Math.abs(dy) : Infinity
    );
    return [
      center[0] + dx * scale,
      center[1] + dy * scale
    ];
  }

  function normalizationSubgroupBoundaryPoint(center, subgroupId, toward) {
    const halfExtents = normalizationSubgroupNodeHalfExtents[subgroupId] || [24, 13];
    return normalizationBoundaryPointOnRect(
      center,
      toward,
      [halfExtents[0] * normalizationLatticeGlobalScale, halfExtents[1] * normalizationLatticeGlobalScale]
    );
  }

  function normalizationSubgroupLocalBoundaryPoint(center, subgroupId, toward) {
    const halfExtents = normalizationSubgroupNodeHalfExtents[subgroupId] || [24, 13];
    return normalizationBoundaryPointOnRect(center, toward, halfExtents);
  }

  function normalizationActionBoundaryPoint(center, toward) {
    return normalizationBoundaryPointOnCircle(center, toward, normalizationActionPointGlobalRadius);
  }

  function normalizationStabilizerBoundaryEndpoints(fromCenter, toCenter, subgroupId) {
    return {
      from: normalizationActionBoundaryPoint(toCenter, fromCenter),
      to: normalizationSubgroupBoundaryPoint(fromCenter, subgroupId, toCenter)
    };
  }

  function normalizationOperatorBoundaryEndpoints(fromCenter, toCenter, sourceId, targetId) {
    return {
      from: normalizationSubgroupBoundaryPoint(fromCenter, sourceId, toCenter),
      to: normalizationSubgroupBoundaryPoint(toCenter, targetId, fromCenter)
    };
  }

  function normalizationSubgroupGlobalPoint(conjugator, subgroupId) {
    return normalizationSubgroupGlobalPointInLattice(normalizationLatticeGlobalOffset, conjugator, subgroupId);
  }

  function normalizationSubgroupLocalPoint(conjugator, subgroupId) {
    const targetSubgroupId = normalizationConjugateSubgroup(conjugator, subgroupId);
    return normalizationSubgroupCoordinates[targetSubgroupId] || normalizationSubgroupCoordinates[subgroupId] || null;
  }

  function normalizationSubgroupGlobalPointInLattice(offset, conjugator, subgroupId) {
    const targetSubgroupId = normalizationConjugateSubgroup(conjugator, subgroupId);
    const point = normalizationSubgroupCoordinates[targetSubgroupId] || normalizationSubgroupCoordinates[subgroupId];
    if (!point) return null;
    return [
      offset[0] + point[0] * normalizationLatticeGlobalScale,
      offset[1] + point[1] * normalizationLatticeGlobalScale
    ];
  }

  function normalizationLinkCoordinate(orbit, pointId) {
    return normalizationOrbitCoordinates[orbit]?.[pointId] || null;
  }

  function normalizationLinkGlobalPoint(actionState, orbit, pointId) {
    const coordinate = normalizationLinkCoordinate(orbit, pointId);
    if (!coordinate) return null;
    const [x, y] = normalizationTargetCoordinate(actionState, coordinate);
    return [
      normalizationSquareStageGlobalOrigin[0] + (21 + 21 * x) * normalizationSquareStageScale,
      normalizationSquareStageGlobalOrigin[1] + (25 + 21 * y) * normalizationSquareStageScale
    ];
  }

  function normalizationStabilizerLinkPath(from, to) {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const bend = dy < 0 ? -34 : 34;
    const controlA = [from[0] + dx * 0.32, from[1] + bend];
    const controlB = [from[0] + dx * 0.68, to[1] - bend];
    return normalizationCubicPathWithMiddleVertex(from, controlA, controlB, to);
  }

  function normalizationCubicPathWithMiddleVertex(from, controlA, controlB, to) {
    const leftA = normalizationInterpolatePoint(from, controlA, 0.5);
    const middleControl = normalizationInterpolatePoint(controlA, controlB, 0.5);
    const rightB = normalizationInterpolatePoint(controlB, to, 0.5);
    const leftB = normalizationInterpolatePoint(leftA, middleControl, 0.5);
    const rightA = normalizationInterpolatePoint(middleControl, rightB, 0.5);
    const middle = normalizationInterpolatePoint(leftB, rightA, 0.5);
    return `M${normalizationFormatPoint(from)} C${normalizationFormatPoint(leftA)}, ${normalizationFormatPoint(leftB)}, ${normalizationFormatPoint(middle)} C${normalizationFormatPoint(rightA)}, ${normalizationFormatPoint(rightB)}, ${normalizationFormatPoint(to)}`;
  }

  function normalizationApplyMatrixToPoint(matrix, point) {
    const [a, b, c, d, e, f] = matrix;
    const [x, y] = point;
    return [a * x + c * y + e, b * x + d * y + f];
  }

  function normalizationInterpolatePoint(from, to, progress) {
    return [
      from[0] + (to[0] - from[0]) * progress,
      from[1] + (to[1] - from[1]) * progress
    ];
  }

  function normalizationLinkLocalPoint(orbit, pointId) {
    const coordinate = normalizationLinkCoordinate(orbit, pointId);
    if (!coordinate) return null;
    return [
      normalizationSquareBodyCenter[0] + 21 * coordinate[0],
      normalizationSquareBodyCenter[1] + 21 * coordinate[1]
    ];
  }

  function normalizationActionMotionDuration(actedElement) {
    const rotationDegrees = normalizationRotationStepDegrees[actedElement];
    return Math.abs(rotationDegrees || 0) === 180 ? 920 : 720;
  }

  function normalizationCanAnimate() {
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return typeof requestAnimationFrame === "function" && typeof performance !== "undefined" && !prefersReducedMotion;
  }

  function normalizationAnimatedActionMatrix(fromActionState, toActionState, actedElement, progress) {
    const fromMatrix = normalizationMatrixAround(
      normalizationSquareBodyCenter,
      normalizationD4Matrices[fromActionState] || normalizationD4Matrices.e
    );
    const targetMatrix = normalizationMatrixAround(
      normalizationSquareBodyCenter,
      normalizationD4Matrices[toActionState] || normalizationD4Matrices.e
    );
    const rotationDegrees = normalizationRotationStepDegrees[actedElement];
    if (typeof rotationDegrees === "number" && rotationDegrees !== 0) {
      return normalizationMultiplyMatrices(
        normalizationMatrixAround(normalizationSquareBodyCenter, normalizationRotationMatrix(rotationDegrees * progress)),
        fromMatrix
      );
    }
    return targetMatrix.map((targetValue, index) => fromMatrix[index] + (targetValue - fromMatrix[index]) * progress);
  }

  function normalizationAnimatedLinkGlobalPoint(fromActionState, toActionState, actedElement, orbit, pointId, progress) {
    const localPoint = normalizationLinkLocalPoint(orbit, pointId);
    if (!localPoint) return null;
    const transformedPoint = normalizationApplyMatrixToPoint(
      normalizationAnimatedActionMatrix(fromActionState, toActionState, actedElement, progress),
      localPoint
    );
    return [
      normalizationSquareStageGlobalOrigin[0] + transformedPoint[0] * normalizationSquareStageScale,
      normalizationSquareStageGlobalOrigin[1] + transformedPoint[1] * normalizationSquareStageScale
    ];
  }

  function normalizationAnimatedLinkBoundaryGlobalPoint(
    fromActionState,
    toActionState,
    actedElement,
    orbit,
    pointId,
    progress,
    toward
  ) {
    const localPoint = normalizationLinkLocalPoint(orbit, pointId);
    if (!localPoint) return null;
    const matrix = normalizationAnimatedActionMatrix(fromActionState, toActionState, actedElement, progress);
    const transformedPoint = normalizationApplyMatrixToPoint(matrix, localPoint);
    const center = [
      normalizationSquareStageGlobalOrigin[0] + transformedPoint[0] * normalizationSquareStageScale,
      normalizationSquareStageGlobalOrigin[1] + transformedPoint[1] * normalizationSquareStageScale
    ];
    const dx = toward[0] - center[0];
    const dy = toward[1] - center[1];
    const length = Math.hypot(dx, dy);
    if (!length) return center;

    const [a, b, c, d] = matrix;
    const scaledA = a * normalizationSquareStageScale;
    const scaledB = b * normalizationSquareStageScale;
    const scaledC = c * normalizationSquareStageScale;
    const scaledD = d * normalizationSquareStageScale;
    const ellipseXX = scaledA * scaledA + scaledC * scaledC;
    const ellipseXY = scaledA * scaledB + scaledC * scaledD;
    const ellipseYY = scaledB * scaledB + scaledD * scaledD;
    const ux = dx / length;
    const uy = dy / length;
    const supportX = ellipseXX * ux + ellipseXY * uy;
    const supportY = ellipseXY * ux + ellipseYY * uy;
    const supportLength = Math.sqrt(Math.max(0.0001, ux * supportX + uy * supportY));

    return [
      center[0] + (normalizationActionDotRadius * supportX) / supportLength,
      center[1] + (normalizationActionDotRadius * supportY) / supportLength
    ];
  }

  function normalizationAnimatedSubgroupGlobalPoint(fromSubgroupActionState, toSubgroupActionState, subgroupId, progress) {
    return normalizationAnimatedSubgroupGlobalPointInLattice(
      normalizationLatticeGlobalOffset,
      fromSubgroupActionState,
      toSubgroupActionState,
      subgroupId,
      progress
    );
  }

  function normalizationAnimatedSubgroupGlobalPointInLattice(
    offset,
    fromSubgroupActionState,
    toSubgroupActionState,
    subgroupId,
    progress
  ) {
    const from = normalizationSubgroupGlobalPointInLattice(offset, fromSubgroupActionState, subgroupId);
    const to = normalizationSubgroupGlobalPointInLattice(offset, toSubgroupActionState, subgroupId);
    if (!from || !to) return null;
    return normalizationInterpolatePoint(from, to, progress);
  }

  function normalizationAnimatedSubgroupLocalPoint(fromSubgroupActionState, toSubgroupActionState, subgroupId, progress) {
    const from = normalizationSubgroupLocalPoint(fromSubgroupActionState, subgroupId);
    const to = normalizationSubgroupLocalPoint(toSubgroupActionState, subgroupId);
    if (!from || !to) return null;
    return normalizationInterpolatePoint(from, to, progress);
  }

  function normalizationStabilizerLinkEndpoints(actionState, subgroupActionState, link) {
    const subgroupId = link.dataset.normalizationLinkSubgroup || "";
    const orbit = link.dataset.normalizationLinkOrbit || "vertex";
    const pointId = link.dataset.normalizationLinkPoint || "";
    const from = normalizationSubgroupGlobalPoint(subgroupActionState, subgroupId);
    const to = normalizationLinkGlobalPoint(actionState, orbit, pointId);
    return from && to ? normalizationStabilizerBoundaryEndpoints(from, to, subgroupId) : null;
  }

  function setNormalizationStabilizerLinkPath(link, endpoints) {
    if (!endpoints) return;
    link.setAttribute("d", normalizationStabilizerLinkPath(endpoints.from, endpoints.to));
  }

  function normalizationOperatorLinkEndpoints(subgroupActionState, link) {
    const sourceId = link.dataset.normalizationOperatorSource || "";
    const targetId = link.dataset.normalizationOperatorTarget || normalizationNormalizerTargets[sourceId] || "";
    const from = normalizationSubgroupGlobalPointInLattice(normalizationOldLatticeGlobalOffset, subgroupActionState, sourceId);
    const to = normalizationSubgroupGlobalPointInLattice(normalizationNewLatticeGlobalOffset, subgroupActionState, targetId);
    return from && to ? normalizationOperatorBoundaryEndpoints(from, to, sourceId, targetId) : null;
  }

  function normalizationOperatorLinkPath(from, to) {
    const dx = to[0] - from[0];
    const controlA = [from[0] + dx * 0.42, from[1]];
    const controlB = [from[0] + dx * 0.58, to[1]];
    return normalizationCubicPathWithMiddleVertex(from, controlA, controlB, to);
  }

  function setNormalizationOperatorLinkPath(link, endpoints) {
    if (!endpoints) return;
    link.setAttribute("d", normalizationOperatorLinkPath(endpoints.from, endpoints.to));
  }

  function normalizationHasseEdgePath(from, to) {
    return `M${normalizationFormatPoint(from)} L${normalizationFormatPoint(to)}`;
  }

  function normalizationHasseEdgeEndpoints(subgroupActionState, edge) {
    const fromId = edge.dataset.normalizationHasseFrom || "";
    const toId = edge.dataset.normalizationHasseTo || "";
    const fromCenter = normalizationSubgroupLocalPoint(subgroupActionState, fromId);
    const toCenter = normalizationSubgroupLocalPoint(subgroupActionState, toId);
    if (!fromCenter || !toCenter) return null;
    return {
      from: normalizationSubgroupLocalBoundaryPoint(fromCenter, fromId, toCenter),
      to: normalizationSubgroupLocalBoundaryPoint(toCenter, toId, fromCenter)
    };
  }

  function setNormalizationHasseEdgePath(edge, endpoints) {
    if (!endpoints) return;
    edge.setAttribute("d", normalizationHasseEdgePath(endpoints.from, endpoints.to));
  }

  function updateNormalizationHasseEdges(root) {
    const state = normalizationHasseEdgeMotionState.get(root);
    if (state?.frame) cancelAnimationFrame(state.frame);
    const subgroupActionState = normalizationCurrentSubgroupActionState(root);

    root.querySelectorAll("[data-normalization-hasse-edge]").forEach((edge) => {
      setNormalizationHasseEdgePath(edge, normalizationHasseEdgeEndpoints(subgroupActionState, edge));
    });

    normalizationHasseEdgeMotionState.set(root, { frame: null });
  }

  function animateNormalizationHasseEdges(root, fromSubgroupActionState, toSubgroupActionState) {
    const previousState = normalizationHasseEdgeMotionState.get(root);
    if (previousState?.frame) cancelAnimationFrame(previousState.frame);
    const edges = Array.from(root.querySelectorAll("[data-normalization-hasse-edge]"));
    if (!edges.length) return;

    const duration = 720;
    if (!normalizationCanAnimate()) {
      updateNormalizationHasseEdges(root);
      return;
    }

    const startedAt = performance.now();
    const state = { frame: null };
    normalizationHasseEdgeMotionState.set(root, state);

    const step = (now) => {
      const elapsed = now - startedAt;
      const progress = normalizationEase(Math.min(1, elapsed / duration));

      edges.forEach((edge) => {
        const fromId = edge.dataset.normalizationHasseFrom || "";
        const toId = edge.dataset.normalizationHasseTo || "";
        const fromCenter = normalizationAnimatedSubgroupLocalPoint(fromSubgroupActionState, toSubgroupActionState, fromId, progress);
        const toCenter = normalizationAnimatedSubgroupLocalPoint(fromSubgroupActionState, toSubgroupActionState, toId, progress);
        if (!fromCenter || !toCenter) return;
        setNormalizationHasseEdgePath(edge, {
          from: normalizationSubgroupLocalBoundaryPoint(fromCenter, fromId, toCenter),
          to: normalizationSubgroupLocalBoundaryPoint(toCenter, toId, fromCenter)
        });
      });

      if (elapsed < duration) {
        state.frame = requestAnimationFrame(step);
        return;
      }

      state.frame = null;
      edges.forEach((edge) => {
        setNormalizationHasseEdgePath(edge, normalizationHasseEdgeEndpoints(toSubgroupActionState, edge));
      });
    };

    state.frame = requestAnimationFrame(step);
  }

  function updateNormalizationStabilizerLinks(root) {
    const state = normalizationStabilizerLinkMotionState.get(root);
    if (state?.frame) cancelAnimationFrame(state.frame);
    root.classList.remove("is-transporting");
    const actionState = normalizationCurrentActionState(root);
    const subgroupActionState = normalizationCurrentSubgroupActionState(root);
    const linksByKey = new Map();

    root.querySelectorAll("[data-normalization-stabilizer-link]").forEach((link) => {
      const endpoints = normalizationStabilizerLinkEndpoints(actionState, subgroupActionState, link);
      setNormalizationStabilizerLinkPath(link, endpoints);
      if (endpoints) linksByKey.set(`${link.dataset.normalizationLinkSubgroup}:${link.dataset.normalizationLinkPoint}`, endpoints);
    });

    normalizationStabilizerLinkMotionState.set(root, { frame: null, linksByKey });
  }

  function updateNormalizationOperatorLinks(root) {
    const state = normalizationOperatorLinkMotionState.get(root);
    if (state?.frame) cancelAnimationFrame(state.frame);
    const subgroupActionState = normalizationCurrentSubgroupActionState(root);
    const linksByKey = new Map();

    root.querySelectorAll("[data-normalization-operator-link]").forEach((link) => {
      const endpoints = normalizationOperatorLinkEndpoints(subgroupActionState, link);
      setNormalizationOperatorLinkPath(link, endpoints);
      if (endpoints) linksByKey.set(link.dataset.normalizationOperatorSource || "", endpoints);
    });

    normalizationOperatorLinkMotionState.set(root, { frame: null, linksByKey });
  }

  function animateNormalizationStabilizerLinks(root, fromActionState, toActionState, fromSubgroupActionState, toSubgroupActionState, actedElement) {
    const previousState = normalizationStabilizerLinkMotionState.get(root);
    if (previousState?.frame) cancelAnimationFrame(previousState.frame);
    const links = Array.from(root.querySelectorAll("[data-normalization-stabilizer-link]"));
    if (!links.length) return;

    const canAnimate = normalizationCanAnimate();
    const actionDuration = normalizationActionMotionDuration(actedElement);
    const subgroupDuration = 720;
    const duration = Math.max(actionDuration, subgroupDuration);
    const linksByKey = new Map();

    if (!canAnimate || duration <= 0) {
      updateNormalizationStabilizerLinks(root);
      return;
    }

    root.classList.add("is-transporting");
    const startedAt = performance.now();
    const state = { frame: null, linksByKey };
    normalizationStabilizerLinkMotionState.set(root, state);

    const step = (now) => {
      const elapsed = now - startedAt;
      const actionProgress = normalizationEase(Math.min(1, elapsed / actionDuration));
      const subgroupProgress = normalizationEase(Math.min(1, elapsed / subgroupDuration));

      links.forEach((link) => {
        const subgroupId = link.dataset.normalizationLinkSubgroup || "";
        const orbit = link.dataset.normalizationLinkOrbit || "vertex";
        const pointId = link.dataset.normalizationLinkPoint || "";
        const fromCenter = normalizationAnimatedSubgroupGlobalPoint(fromSubgroupActionState, toSubgroupActionState, subgroupId, subgroupProgress);
        if (!fromCenter) return;
        const to = normalizationAnimatedLinkBoundaryGlobalPoint(fromActionState, toActionState, actedElement, orbit, pointId, actionProgress, fromCenter);
        if (!to) return;
        const endpoints = {
          from: to,
          to: normalizationSubgroupBoundaryPoint(fromCenter, subgroupId, to)
        };
        setNormalizationStabilizerLinkPath(link, endpoints);
        linksByKey.set(`${subgroupId}:${pointId}`, endpoints);
      });

      if (elapsed < duration) {
        state.frame = requestAnimationFrame(step);
        return;
      }

      state.frame = null;
      root.classList.remove("is-transporting");
      links.forEach((link) => {
        const endpoints = normalizationStabilizerLinkEndpoints(toActionState, toSubgroupActionState, link);
        setNormalizationStabilizerLinkPath(link, endpoints);
        if (endpoints) linksByKey.set(`${link.dataset.normalizationLinkSubgroup}:${link.dataset.normalizationLinkPoint}`, endpoints);
      });
    };

    state.frame = requestAnimationFrame(step);
  }

  function animateNormalizationOperatorLinks(root, fromSubgroupActionState, toSubgroupActionState) {
    const previousState = normalizationOperatorLinkMotionState.get(root);
    if (previousState?.frame) cancelAnimationFrame(previousState.frame);
    const links = Array.from(root.querySelectorAll("[data-normalization-operator-link]"));
    if (!links.length) return;

    const duration = 720;
    const linksByKey = new Map();

    if (!normalizationCanAnimate()) {
      updateNormalizationOperatorLinks(root);
      return;
    }

    const startedAt = performance.now();
    const state = { frame: null, linksByKey };
    normalizationOperatorLinkMotionState.set(root, state);

    const step = (now) => {
      const elapsed = now - startedAt;
      const progress = normalizationEase(Math.min(1, elapsed / duration));

      links.forEach((link) => {
        const sourceId = link.dataset.normalizationOperatorSource || "";
        const targetId = link.dataset.normalizationOperatorTarget || normalizationNormalizerTargets[sourceId] || "";
        const fromCenter = normalizationAnimatedSubgroupGlobalPointInLattice(
          normalizationOldLatticeGlobalOffset,
          fromSubgroupActionState,
          toSubgroupActionState,
          sourceId,
          progress
        );
        const toCenter = normalizationAnimatedSubgroupGlobalPointInLattice(
          normalizationNewLatticeGlobalOffset,
          fromSubgroupActionState,
          toSubgroupActionState,
          targetId,
          progress
        );
        if (!fromCenter || !toCenter) return;
        const endpoints = normalizationOperatorBoundaryEndpoints(fromCenter, toCenter, sourceId, targetId);
        setNormalizationOperatorLinkPath(link, endpoints);
        linksByKey.set(sourceId, endpoints);
      });

      if (elapsed < duration) {
        state.frame = requestAnimationFrame(step);
        return;
      }

      state.frame = null;
      links.forEach((link) => {
        const endpoints = normalizationOperatorLinkEndpoints(toSubgroupActionState, link);
        setNormalizationOperatorLinkPath(link, endpoints);
        if (endpoints) linksByKey.set(link.dataset.normalizationOperatorSource || "", endpoints);
      });
    };

    state.frame = requestAnimationFrame(step);
  }

  function normalizationMatrixAround(center, linear) {
    const [cx, cy] = center;
    const [a, b, c, d] = linear;
    return [a, b, c, d, cx - a * cx - c * cy, cy - b * cx - d * cy];
  }

  function normalizationRotationMatrix(degrees) {
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return [cos, sin, -sin, cos];
  }

  function normalizationMultiplyMatrices(left, right) {
    const [a1, b1, c1, d1, e1, f1] = left;
    const [a2, b2, c2, d2, e2, f2] = right;
    return [
      a1 * a2 + c1 * b2,
      b1 * a2 + d1 * b2,
      a1 * c2 + c1 * d2,
      b1 * c2 + d1 * d2,
      a1 * e2 + c1 * f2 + e1,
      b1 * e2 + d1 * f2 + f1
    ];
  }

  function normalizationTranslateMatrix(dx, dy) {
    return [1, 0, 0, 1, dx, dy];
  }

  function normalizationMatrixString(matrix) {
    return `matrix(${matrix.map((value) => Number(value.toFixed(3))).join(" ")})`;
  }

  function normalizationEase(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateNormalizationTransform(element, targetMatrix) {
    const currentState = normalizationMotionState.get(element);
    const fromMatrix = currentState?.matrix || [1, 0, 0, 1, 0, 0];
    if (currentState?.frame) cancelAnimationFrame(currentState.frame);

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const canAnimate =
      typeof requestAnimationFrame === "function" &&
      typeof performance !== "undefined" &&
      !prefersReducedMotion;

    if (!canAnimate) {
      element.setAttribute("transform", normalizationMatrixString(targetMatrix));
      normalizationMotionState.set(element, { matrix: targetMatrix, frame: null });
      return;
    }

    const startedAt = performance.now();
    const duration = 720;
    const state = { matrix: fromMatrix, frame: null };
    normalizationMotionState.set(element, state);

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = normalizationEase(progress);
      const matrix = targetMatrix.map((targetValue, index) => fromMatrix[index] + (targetValue - fromMatrix[index]) * eased);
      state.matrix = matrix;
      element.setAttribute("transform", normalizationMatrixString(matrix));
      if (progress < 1) {
        state.frame = requestAnimationFrame(step);
        return;
      }
      state.frame = null;
      state.matrix = targetMatrix;
      element.setAttribute("transform", normalizationMatrixString(targetMatrix));
    };

    state.frame = requestAnimationFrame(step);
  }

  function normalizationTranslateString(point) {
    return `translate(${point.map((value) => Number(value.toFixed(2))).join(" ")})`;
  }

  function animateNormalizationSubgroupTransform(element, targetPoint) {
    const subgroupId = element.dataset.normalizationSubgroup || "";
    const homePoint = normalizationSubgroupCoordinates[subgroupId] || [0, 0];
    const currentState = normalizationSubgroupMotionState.get(element);
    const fromPoint = currentState?.point || homePoint;
    if (currentState?.frame) cancelAnimationFrame(currentState.frame);

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const canAnimate =
      typeof requestAnimationFrame === "function" &&
      typeof performance !== "undefined" &&
      !prefersReducedMotion;

    if (!canAnimate) {
      element.setAttribute("transform", normalizationTranslateString(targetPoint));
      normalizationSubgroupMotionState.set(element, { point: targetPoint, frame: null });
      return;
    }

    const startedAt = performance.now();
    const duration = 720;
    const state = { point: fromPoint, frame: null };
    normalizationSubgroupMotionState.set(element, state);

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = normalizationEase(progress);
      const point = [
        fromPoint[0] + (targetPoint[0] - fromPoint[0]) * eased,
        fromPoint[1] + (targetPoint[1] - fromPoint[1]) * eased
      ];
      state.point = point;
      element.setAttribute("transform", normalizationTranslateString(point));
      if (progress < 1) {
        state.frame = requestAnimationFrame(step);
        return;
      }
      state.frame = null;
      state.point = targetPoint;
      element.setAttribute("transform", normalizationTranslateString(targetPoint));
    };

    state.frame = requestAnimationFrame(step);
  }

  function setNormalizationTransform(element, targetMatrix) {
    const currentState = normalizationMotionState.get(element);
    if (currentState?.frame) cancelAnimationFrame(currentState.frame);
    element.setAttribute("transform", normalizationMatrixString(targetMatrix));
    normalizationMotionState.set(element, { matrix: targetMatrix, frame: null });
  }

  function animateNormalizationRotationTransform(element, targetMatrix, center, degrees) {
    const currentState = normalizationMotionState.get(element);
    const fromMatrix = currentState?.matrix || [1, 0, 0, 1, 0, 0];
    if (currentState?.frame) cancelAnimationFrame(currentState.frame);

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const canAnimate =
      typeof requestAnimationFrame === "function" &&
      typeof performance !== "undefined" &&
      !prefersReducedMotion &&
      degrees !== 0;

    if (!canAnimate) {
      setNormalizationTransform(element, targetMatrix);
      return;
    }

    const startedAt = performance.now();
    const duration = Math.abs(degrees) === 180 ? 920 : 720;
    const state = { matrix: fromMatrix, frame: null };
    normalizationMotionState.set(element, state);

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = normalizationEase(progress);
      const rotationMatrix = normalizationMatrixAround(center, normalizationRotationMatrix(degrees * eased));
      const matrix = normalizationMultiplyMatrices(rotationMatrix, fromMatrix);
      state.matrix = matrix;
      element.setAttribute("transform", normalizationMatrixString(matrix));
      if (progress < 1) {
        state.frame = requestAnimationFrame(step);
        return;
      }
      state.frame = null;
      state.matrix = targetMatrix;
      element.setAttribute("transform", normalizationMatrixString(targetMatrix));
    };

    state.frame = requestAnimationFrame(step);
  }

  function applyNormalizationD4Transform(element, targetMatrix, center, actedElement) {
    const rotationDegrees = normalizationRotationStepDegrees[actedElement];
    if (typeof rotationDegrees === "number") {
      animateNormalizationRotationTransform(element, targetMatrix, center, rotationDegrees);
      return;
    }
    animateNormalizationTransform(element, targetMatrix);
  }

  function normalizationCurrentActionState(root) {
    const current = root.dataset.normalizationActionState || "e";
    return normalizationElementLabels[current] ? current : "e";
  }

  function normalizationCurrentSubgroupActionState(root) {
    const current = root.dataset.normalizationSubgroupActionState || normalizationCurrentActionState(root);
    return normalizationElementLabels[current] ? current : "e";
  }

  function setNormalizationActionMotion(root, elementId) {
    const actedElement = normalizationElementLabels[elementId] ? elementId : "e";
    const fromState = normalizationCurrentActionState(root);
    const toState = normalizationMultiplyElements(actedElement, fromState);
    const d4Matrix = normalizationD4Matrices[toState] || normalizationD4Matrices.e;
    root.dataset.normalizationActionState = toState;

    root.querySelectorAll("[data-normalization-square-body]").forEach((squareBody) => {
      applyNormalizationD4Transform(
        squareBody,
        normalizationMatrixAround(normalizationSquareBodyCenter, d4Matrix),
        normalizationSquareBodyCenter,
        actedElement
      );
    });

    root.querySelectorAll("[data-normalization-orbit][data-normalization-point]").forEach((place) => {
      const orbit = place.dataset.normalizationOrbit || "";
      const pointId = place.dataset.normalizationPoint || "";
      const center = normalizationGeometricMotion[orbit];
      if (center) {
        applyNormalizationD4Transform(place, normalizationMatrixAround(center, d4Matrix), center, actedElement);
        return;
      }

      const points = normalizationElementCoordinates[orbit];
      const source = points?.[pointId];
      const target = points?.[normalizationTargetPoint(orbit, toState, pointId)];
      if (!source || !target) return;
      animateNormalizationTransform(place, normalizationTranslateMatrix(target[0] - source[0], target[1] - source[1]));
    });

    return { actedElement, fromState, toState };
  }

  function setNormalizationSubgroupMotion(root, conjugator) {
    const actingElement = normalizationElementLabels[conjugator] ? conjugator : "e";
    root.dataset.normalizationSubgroupActionState = actingElement;

    root.querySelectorAll("[data-normalization-subgroup]").forEach((subgroup) => {
      const subgroupId = subgroup.dataset.normalizationSubgroup || "one";
      const targetSubgroupId = normalizationConjugateSubgroup(actingElement, subgroupId);
      const targetPoint = normalizationSubgroupCoordinates[targetSubgroupId] || normalizationSubgroupCoordinates[subgroupId];
      if (!targetPoint) return;
      subgroup.classList.toggle("is-conjugated", targetSubgroupId !== subgroupId);
      animateNormalizationSubgroupTransform(subgroup, targetPoint);
    });
  }

  function pulseNormalizationElementControl(root, elementId) {
    root.querySelectorAll("[data-normalization-element-control]").forEach((control) => {
      const isActed = control.dataset.normalizationElementControl === elementId;
      control.classList.remove("is-acted");
      if (!isActed) return;
      control.getBoundingClientRect();
      control.classList.add("is-acted");
      window.setTimeout(() => control.classList.remove("is-acted"), 260);
    });
  }

  function setNormalizationSelection(root, subgroupId = "d4") {
    const selected = normalizationContainment[subgroupId] ? subgroupId : "d4";
    const allowed = new Set(normalizationContainment[selected]);
    const highlighted = new Set(normalizationConjugateDownsets[selected] || normalizationContainment[selected]);
    root.dataset.normalizationSelected = selected;
    delete root.dataset.normalizationActionSelected;

    root.querySelectorAll("[data-normalization-subgroup]").forEach((node) => {
      const subgroup = node.dataset.normalizationSubgroup || "";
      const isSelected = subgroup === selected;
      const isHighlighted = highlighted.has(subgroup);
      node.classList.toggle("is-selected", isSelected);
      node.classList.toggle("is-highlighted", isHighlighted);
      node.classList.toggle("is-muted", !isHighlighted);
      if (root.classList.contains("is-interactive")) node.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    root.querySelectorAll("[data-normalization-stabilizers]").forEach((action) => {
      const stabilizers = (action.dataset.normalizationStabilizers || "").split(/\s+/).filter(Boolean);
      const matches = stabilizers.some((stabilizer) => allowed.has(stabilizer));
      action.classList.remove("is-selected");
      action.classList.toggle("is-dimmed", !matches);
      action.classList.toggle("is-matched", matches && selected !== "d4");
      if (root.classList.contains("is-interactive")) action.setAttribute("aria-pressed", "false");
    });

  }

  function setNormalizationElementSelection(root, elementId) {
    const selectedElement = normalizationElementLabels[elementId] ? elementId : "e";
    const fromSubgroupState = normalizationCurrentSubgroupActionState(root);
    const { actedElement, fromState, toState } = setNormalizationActionMotion(root, selectedElement);
    setNormalizationSubgroupMotion(root, toState);
    animateNormalizationHasseEdges(root, fromSubgroupState, toState);
    animateNormalizationStabilizerLinks(root, fromState, toState, fromSubgroupState, toState, actedElement);
    animateNormalizationOperatorLinks(root, fromSubgroupState, toState);
    pulseNormalizationElementControl(root, selectedElement);
  }

  function initializeNormalizationFigure(root, options = {}) {
    root.classList.toggle("is-interactive", Boolean(options.controls));
    setNormalizationSelection(root, root.dataset.normalizationSelected || "d4");
    updateNormalizationHasseEdges(root);
    updateNormalizationStabilizerLinks(root);
    updateNormalizationOperatorLinks(root);
    typesetMath(root);
    if (!options.controls || root.dataset.normalizationInitialized) return;
    root.dataset.normalizationInitialized = "true";

    root.querySelectorAll("[data-normalization-element-control]").forEach((control) => {
      const elementId = control.dataset.normalizationElementControl || "e";
      const label = normalizationElementLabels[elementId] || elementId;
      control.setAttribute("role", "button");
      control.setAttribute("tabindex", "0");
      control.setAttribute("aria-label", `Act once by ${label}`);
      control.addEventListener("click", (event) => {
        event.stopPropagation();
        setNormalizationElementSelection(root, elementId);
      });
      control.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        setNormalizationElementSelection(root, elementId);
      });
    });
  }

  function initializeNormalizationFigures(scope, options = {}) {
    const roots = scope.matches?.("[data-normalization-figure]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-normalization-figure]"));
    roots.forEach((root) => initializeNormalizationFigure(root, options));
  }

  const grundyFigureStates = new WeakMap();

  function formatGrundySet(values) {
    return values.length ? `{${values.join(", ")}}` : "empty set";
  }

  function grundyActiveNodeIds(state) {
    if (!state.step) return new Set();
    if (state.focusId && grundyNodeStep(state.focusId) <= state.step) return new Set([state.focusId]);
    const activeNode = grundyNodeForStep(state.step);
    return activeNode ? new Set([activeNode.id]) : new Set();
  }

  function updateGrundyPanel(root, state, activeIds) {
    const focus = root.querySelector("[data-grundy-focus]");
    const options = root.querySelector("[data-grundy-options]");
    const mex = root.querySelector("[data-grundy-mex]");
    const status = root.querySelector("[data-grundy-status]");
    const activeNodeId = [...activeIds][0] || "";
    const focusedNode = state.focusId ? grundyGameNodeMap.get(state.focusId) : grundyGameNodeMap.get(activeNodeId);

    if (focusedNode) {
      const values = grundyOptionValues(focusedNode);
      if (focus) focus.textContent = "current node";
      if (options) options.textContent = `reachable values: ${formatGrundySet(values)}`;
      if (mex) mex.textContent = `mex = ${focusedNode.value}`;
      if (status) status.textContent = "cross out the reachable values; choose the first number left.";
      return;
    }

    const copy = state.step >= state.max ? grundyFinalCopy : grundyStepCopy[state.step] || grundyStepCopy[0];
    const activeText = [...activeIds].join(", ");
    if (focus) focus.textContent = activeText || copy.focus;
    if (options) options.textContent = copy.options;
    if (mex) mex.textContent = copy.mex;
    if (status) status.textContent = copy.status;
  }

  function updateGrundyAlgebraPanel(root, state, activeIds) {
    const activeNodeId = [...activeIds][0] || "";
    const focusedNode = state.focusId ? grundyGameNodeMap.get(state.focusId) : grundyGameNodeMap.get(activeNodeId);
    const values = focusedNode ? grundyOptionValues(focusedNode) : [];
    const mexValue = focusedNode ? grundyMex(values) : null;
    const isReady = Boolean(focusedNode);
    const water = root.querySelector("[data-grundy-mex-water]");

    root.querySelectorAll("[data-grundy-natural]").forEach((number) => {
      const value = Number(number.dataset.grundyNatural);
      const excluded = isReady && values.includes(value);
      const isMex = isReady && value === mexValue;
      number.classList.toggle("is-excluded", excluded);
      number.classList.toggle("is-mex", isMex);
      number.classList.toggle("is-after-mex", isReady && value > mexValue && !excluded);
    });

    if (water) {
      const line = water.closest(".grundy-natural-line");
      const previousTransition = water.style.transition;
      water.style.transition = "none";
      water.classList.remove("is-ready");
      water.style.setProperty("--grundy-mex-water-height", "0px");
      void water.offsetHeight;
      water.style.transition = previousTransition;
      if (isReady) {
        const mexNumber = line?.querySelector(`[data-grundy-natural="${mexValue}"]`);
        const lineRect = line?.getBoundingClientRect();
        const mexRect = mexNumber?.getBoundingClientRect();
        const waterHeight = lineRect && mexRect
          ? `${Math.max(0, lineRect.bottom - (mexRect.top + mexRect.height / 2))}px`
          : "0px";
        water.style.setProperty("--grundy-mex-water-height", waterHeight);
        water.classList.add("is-ready");
      }
      water.dataset.grundyMexWater = isReady ? String(mexValue) : "";
    }

    root.dataset.grundyMexValue = isReady ? String(mexValue) : "";
  }

  function clearGrundyTransfer(root, state) {
    if (state?.transferTimer) window.clearTimeout(state.transferTimer);
    if (state) {
      state.transferTimer = null;
      state.lastTransferKey = "";
    }
    root.querySelectorAll(".grundy-transfer-ball").forEach((ball) => ball.remove());
    root.querySelectorAll(".grundy-node.is-receiving").forEach((node) => node.classList.remove("is-receiving"));
  }

  function grundySmoothStep(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
  }

  function grundyTransferKeyframes(fromX, fromY, midX, midY, toX, toY) {
    return Array.from({ length: 43 }, (_, index) => {
      const offset = index / 42;
      const t = grundySmoothStep(offset);
      const inverse = 1 - t;
      const x = inverse * inverse * fromX + 2 * inverse * t * midX + t * t * toX;
      const y = inverse * inverse * fromY + 2 * inverse * t * midY + t * t * toY;
      const opacity = offset < 0.08 ? offset / 0.08 : offset > 0.9 ? (1 - offset) / 0.1 : 1;
      const scale = 0.76 + Math.sin(Math.PI * offset) * 0.2 - offset * 0.06;
      return {
        offset,
        opacity: Math.max(0, Math.min(1, opacity)),
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`
      };
    });
  }

  function animateGrundyMexTransfer(root, state, activeIds, onComplete = () => {}) {
    const activeNodeId = [...activeIds][0] || "";
    const focusedNode = state.focusId ? grundyGameNodeMap.get(state.focusId) : grundyGameNodeMap.get(activeNodeId);
    if (!focusedNode || typeof window === "undefined") {
      clearGrundyTransfer(root, state);
      return false;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      clearGrundyTransfer(root, state);
      return false;
    }

    const transferKey = `${state.step}:${state.focusId || ""}:${focusedNode.id}:${focusedNode.value}`;
    if (state.lastTransferKey === transferKey) return true;
    clearGrundyTransfer(root, state);
    state.lastTransferKey = transferKey;

    state.transferTimer = window.setTimeout(() => {
      state.transferTimer = null;
      if (!root.isConnected || state.lastTransferKey !== transferKey) return;
      const source = root.querySelector(`[data-grundy-natural="${focusedNode.value}"]`);
      const targetNode = root.querySelector(`[data-grundy-node="${focusedNode.id}"]`);
      const target = targetNode?.querySelector(".grundy-node-shell");
      if (!source || !target) {
        onComplete();
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const fromX = sourceRect.left + sourceRect.width / 2 - rootRect.left;
      const fromY = sourceRect.top + sourceRect.height / 2 - rootRect.top;
      const toX = targetRect.left + targetRect.width / 2 - rootRect.left;
      const toY = targetRect.top + targetRect.height / 2 - rootRect.top;
      const arc = Math.max(36, Math.min(92, Math.abs(fromX - toX) * 0.14));
      const size = Math.max(28, Math.min(42, sourceRect.width, targetRect.width));
      const ball = document.createElement("span");
      ball.className = `grundy-transfer-ball ${focusedNode.value === 0 ? "is-zero" : "is-positive"}`;
      ball.textContent = String(focusedNode.value);
      ball.style.setProperty("--from-x", `${fromX}px`);
      ball.style.setProperty("--from-y", `${fromY}px`);
      ball.style.setProperty("--mid-x", `${(fromX + toX) / 2}px`);
      ball.style.setProperty("--mid-y", `${Math.min(fromY, toY) - arc}px`);
      ball.style.setProperty("--to-x", `${toX}px`);
      ball.style.setProperty("--to-y", `${toY}px`);
      ball.style.setProperty("--grundy-transfer-size", `${size}px`);
      root.append(ball);

      const receiveTimer = window.setTimeout(() => {
        if (root.isConnected && state.lastTransferKey === transferKey) targetNode.classList.add("is-receiving");
      }, 360);

      let cleanedUp = false;
      const cleanup = (didComplete = false) => {
        if (cleanedUp) return;
        cleanedUp = true;
        window.clearTimeout(receiveTimer);
        ball.remove();
        if (didComplete && root.isConnected && state.lastTransferKey === transferKey) onComplete();
        window.setTimeout(() => targetNode.classList.remove("is-receiving"), 160);
      };

      if (typeof ball.animate !== "function") {
        targetNode.classList.add("is-receiving");
        ball.classList.add("is-css-flight");
        ball.addEventListener("animationend", () => cleanup(true), { once: true });
        return;
      }

      const flight = ball.animate(
        grundyTransferKeyframes(fromX, fromY, (fromX + toX) / 2, Math.min(fromY, toY) - arc, toX, toY),
        { duration: grundyTransferDurationMs, easing: "linear", fill: "both" }
      );
      flight.addEventListener("finish", () => cleanup(true), { once: true });
      flight.addEventListener("cancel", () => cleanup(false), { once: true });
    }, grundyTransferDelayMs);
    return true;
  }

  function updateGrundyPlayControl(root) {
    const state = grundyFigureStates.get(root);
    const play = root.querySelector('[data-grundy-action="play"]');
    if (play && state) play.textContent = state.playing ? "Pause" : "Play";
    root.dataset.grundyPlaying = state?.playing ? "true" : "false";
  }

  function updateGrundyGameGraph(root, step, activeIds) {
    const referencedIds = new Set();
    activeIds.forEach((nodeId) => {
      const record = grundyGameNodeMap.get(nodeId);
      if (!record) return;
      record.options.forEach((optionId) => referencedIds.add(optionId));
    });

    root.querySelectorAll("[data-grundy-node]").forEach((node) => {
      const nodeId = node.dataset.grundyNode || "";
      const record = grundyGameNodeMap.get(nodeId);
      if (!record) return;
      const value = node.querySelector("[data-grundy-value]");
      const known = grundyNodeIsKnown(record, step);
      const active = known && activeIds.has(record.id);
      node.classList.toggle("is-known", known);
      node.classList.toggle("is-computed", known && !active);
      node.classList.toggle("is-active", active);
      node.classList.toggle("is-referenced", referencedIds.has(record.id) && !active);
      node.classList.toggle("is-p-state", known && record.value === 0);
      node.classList.toggle("is-n-state", known && record.value !== 0);
      if (value) value.textContent = known ? String(record.value) : "";
    });

    root.querySelectorAll("[data-grundy-edge]").forEach((edge) => {
      const [fromId, toId] = String(edge.dataset.grundyEdge || "").split("-");
      const from = grundyGameNodeMap.get(fromId);
      const to = grundyGameNodeMap.get(toId);
      if (!from || !to) return;
      const active = activeIds.has(from.id) && grundyNodeIsKnown(to, step);
      const known = grundyNodeIsKnown(from, step);
      edge.classList.toggle("is-active", active);
      edge.classList.toggle("is-computed", known && !active);
    });
  }

  function renderGrundyStep(root) {
    const state = grundyFigureStates.get(root);
    if (!state) return;
    const step = state.step;
    const activeIds = grundyActiveNodeIds(state);
    root.dataset.grundyStep = String(step);
    root.classList.toggle("is-final", step >= state.max);
    const gameStep = Math.max(0, Math.min(step, state.gameRevealStep ?? grundyRevealStepBeforeTransfer(step)));
    updateGrundyGameGraph(root, gameStep, activeIds);

    const slider = root.querySelector("[data-grundy-slider]");
    if (slider) slider.value = String(step);
    updateGrundyAlgebraPanel(root, state, activeIds);
    const revealGameStep = () => {
      if (!root.isConnected || state.step !== step) return;
      state.gameRevealStep = step;
      updateGrundyGameGraph(root, step, grundyActiveNodeIds(state));
    };
    if (gameStep < step && activeIds.size) {
      const transferStarted = animateGrundyMexTransfer(root, state, activeIds, revealGameStep);
      if (!transferStarted) revealGameStep();
    } else {
      clearGrundyTransfer(root, state);
    }
    updateGrundyPanel(root, state, activeIds);
  }

  function setGrundyStep(root, step, focusId = "") {
    const state = grundyFigureStates.get(root);
    if (!state) return;
    state.step = Math.max(0, Math.min(state.max, Number(step) || 0));
    state.focusId = focusId;
    state.gameRevealStep = grundyRevealStepBeforeTransfer(state.step);
    renderGrundyStep(root);
  }

  function stopGrundyFigure(root) {
    const state = grundyFigureStates.get(root);
    if (!state) return;
    if (state.timer) window.clearTimeout(state.timer);
    state.timer = null;
    state.playing = false;
    updateGrundyPlayControl(root);
  }

  function startGrundyFigure(root) {
    const state = grundyFigureStates.get(root);
    if (!state || state.timer) return;
    if (state.step >= state.max) setGrundyStep(root, 0);
    state.playing = true;
    updateGrundyPlayControl(root);
    const advance = () => {
      if (!state.playing) return;
      setGrundyStep(root, state.step >= state.max ? 0 : state.step + 1);
      state.timer = window.setTimeout(advance, state.step >= state.max ? state.finalHoldMs : state.intervalMs);
    };
    state.timer = window.setTimeout(advance, state.intervalMs);
  }

  function ensureGrundyControls(root) {
    if (root.querySelector("[data-grundy-controls]")) return;
    const controls = el("div", "grundy-controls");
    controls.dataset.grundyControls = "";

    const makeButton = (action, label) => {
      const button = el("button", "grundy-control", label);
      button.type = "button";
      button.dataset.grundyAction = action;
      return button;
    };

    const sliderLabel = el("label", "grundy-slider");
    sliderLabel.append(el("span", null, "node"));
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = root.dataset.grundyMax || String(grundyFinalStep);
    slider.value = root.dataset.grundyStep || "0";
    slider.dataset.grundySlider = "";
    sliderLabel.append(slider);

    controls.append(
      makeButton("reset", "Reset"),
      makeButton("prev", "Prev"),
      makeButton("play", "Play"),
      makeButton("next", "Next"),
      sliderLabel
    );
    root.append(controls);
  }

  function initializeGrundyFigure(root, options = {}) {
    const previous = grundyFigureStates.get(root);
    if (previous?.timer) window.clearTimeout(previous.timer);
    if (previous?.transferTimer) window.clearTimeout(previous.transferTimer);

    const max = Number(root.dataset.grundyMax || grundyFinalStep);
    const initialStep = Math.max(0, Math.min(max, Number(options.initialStep ?? root.dataset.grundyStep ?? 0)));
    const state = {
      max,
      step: initialStep,
      gameRevealStep: grundyRevealStepBeforeTransfer(initialStep),
      focusId: "",
      timer: null,
      transferTimer: null,
      lastTransferKey: "",
      playing: false,
      intervalMs: options.intervalMs || grundyAutoplayIntervalMs,
      finalHoldMs: options.finalHoldMs || grundyFinalHoldMs
    };
    grundyFigureStates.set(root, state);

    if (options.controls) {
      ensureGrundyControls(root);
      root.querySelectorAll("[data-grundy-node]").forEach((node) => {
        const record = grundyGameNodeMap.get(node.dataset.grundyNode || "");
        node.addEventListener("click", (event) => {
          event.stopPropagation();
          stopGrundyFigure(root);
          if (record) setGrundyStep(root, grundyNodeStep(record.id), record.id);
        });
        node.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          stopGrundyFigure(root);
          if (record) setGrundyStep(root, grundyNodeStep(record.id), record.id);
        });
      });
      root.querySelectorAll("[data-grundy-action]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const action = button.dataset.grundyAction;
          if (action === "play") {
            if (state.playing) stopGrundyFigure(root);
            else startGrundyFigure(root);
            return;
          }
          stopGrundyFigure(root);
          if (action === "reset") setGrundyStep(root, 0);
          if (action === "prev") setGrundyStep(root, state.step - 1);
          if (action === "next") setGrundyStep(root, state.step + 1);
        });
      });
      const slider = root.querySelector("[data-grundy-slider]");
      slider?.addEventListener("input", () => {
        stopGrundyFigure(root);
        setGrundyStep(root, slider.value);
      });
    }

    renderGrundyStep(root);
    updateGrundyPlayControl(root);
    if (options.autoplay) startGrundyFigure(root);
  }

  function initializeGrundyFigures(scope, options = {}) {
    const roots = scope.matches?.("[data-grundy-figure]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-grundy-figure]"));
    roots.forEach((root) => initializeGrundyFigure(root, options));
  }

  function stopGrundyFigures(scope) {
    const roots = scope.matches?.("[data-grundy-figure]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-grundy-figure]"));
    roots.forEach((root) => stopGrundyFigure(root));
  }

  function gamesRbSvgElement(tag, attrs = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      node.setAttribute(key, String(value));
    });
    return node;
  }

  function gamesRbSetTex(name) {
    return `\\(${name}=\\)`;
  }

  function gamesRbSetControlTemplate(name, values) {
    const buttons = gamesRbSelectableValues
      .map((value) => `<button type="button" class="games-rb-set-button" data-games-rb-toggle="${name}" data-games-rb-value="${value}" aria-pressed="${values.includes(value) ? "true" : "false"}">${value}</button>`)
      .join("");
    return `<div class="figure-math games-rb-table-tex games-rb-set-control games-rb-set-control-${name.toLowerCase()} games-rb-set-def-${name.toLowerCase()}" data-games-rb-set-control="${name}">
        <span class="games-rb-set-current" data-games-rb-set-def="${name}">${gamesRbSetTex(name)}</span>
        <span class="games-rb-set-buttons" aria-label="Choose ${name}">${buttons}</span>
      </div>`;
  }

  function appendGamesRbRect(layer, className, x, y, width = gamesRbCellWidth, height = gamesRbCellHeight, extra = {}) {
    if (!layer) return null;
    const rect = gamesRbSvgElement("rect", {
      class: className,
      x,
      y,
      width,
      height,
      ...extra
    });
    layer.append(rect);
    return rect;
  }

  function appendGamesRbPath(layer, className, d, extra = {}) {
    if (!layer) return null;
    const path = gamesRbSvgElement("path", {
      class: className,
      d,
      ...extra
    });
    layer.append(path);
    return path;
  }

  function renderGamesRbSetHighlights(layer, state) {
    if (!layer) return;
    layer.replaceChildren();
    state.S.forEach((value) => {
      appendGamesRbRect(layer, "games-rb-set-highlight is-s-entry", 0, gamesRbRowY(value), gamesRbHeaderWidth, gamesRbCellHeight);
    });
    state.T.forEach((value) => {
      appendGamesRbRect(layer, "games-rb-set-highlight is-t-entry", gamesRbColumnX(value), 0, gamesRbCellWidth, gamesRbHeaderHeight);
    });
  }

  function renderGamesRbMexRings(layer, mexS, mexT) {
    if (!layer) return;
    layer.replaceChildren();
    appendGamesRbRect(layer, "games-rb-mex-cell-ring is-mex-s-ring", 0, gamesRbRowY(mexS), gamesRbHeaderWidth, gamesRbCellHeight, { rx: 4 });
    appendGamesRbRect(layer, "games-rb-mex-cell-ring is-mex-t-ring", gamesRbColumnX(mexT), 0, gamesRbCellWidth, gamesRbHeaderHeight, { rx: 4 });
  }

  function renderGamesRbUnionHighlights(layer, state, mexS, mexT) {
    if (!layer) return;
    layer.replaceChildren();
    const cells = new Map();
    state.T.forEach((value) => cells.set(`${mexS}:${value}`, [mexS, value, "is-mex-s-plus-t"]));
    state.S.forEach((value) => {
      const key = `${value}:${mexT}`;
      const previous = cells.get(key);
      cells.set(key, [value, mexT, previous ? "is-both-union-terms" : "is-s-plus-mex-t"]);
    });
    cells.forEach(([row, column, className]) => {
      if (!gamesRbVisibleValues.includes(row) || !gamesRbVisibleValues.includes(column)) return;
      appendGamesRbRect(layer, `games-rb-union-highlight ${className}`, gamesRbColumnX(column), gamesRbRowY(row));
    });
  }

  function renderGamesRbProductHighlight(layer, mexS, mexT) {
    if (!layer) return;
    layer.replaceChildren();
    if (!gamesRbVisibleValues.includes(mexS) || !gamesRbVisibleValues.includes(mexT)) return;
    appendGamesRbRect(layer, "games-rb-product-highlight", gamesRbColumnX(mexT), gamesRbRowY(mexS), gamesRbCellWidth, gamesRbCellHeight, { rx: 4 });
  }

  function renderGamesRbProductArrows(layer, mexS, mexT) {
    if (!layer) return;
    layer.replaceChildren();
    if (!gamesRbVisibleValues.includes(mexS) || !gamesRbVisibleValues.includes(mexT)) return;
    const targetX = gamesRbCellTextX(mexT);
    const targetY = gamesRbRowY(mexS) + gamesRbCellHeight / 2;
    const sStartX = gamesRbHeaderWidth;
    const sStartY = gamesRbRowY(mexS) + gamesRbCellHeight / 2;
    const tStartX = gamesRbCellTextX(mexT);
    const tStartY = gamesRbHeaderHeight;
    appendGamesRbPath(
      layer,
      "games-rb-product-arrow is-from-mex-s",
      `M${sStartX + 3} ${sStartY} C${targetX - 42} ${sStartY}, ${targetX - 26} ${targetY}, ${targetX - 15} ${targetY}`
    );
    appendGamesRbPath(
      layer,
      "games-rb-product-arrow is-from-mex-t",
      `M${tStartX} ${tStartY + 3} C${tStartX} ${targetY - 42}, ${targetX} ${targetY - 26}, ${targetX} ${targetY - 14}`
    );
  }

  function renderGamesRbFigure(root) {
    const container = root.closest(".publication-figure, .diagram-expanded") || root.parentElement || root;
    const sRaw = root.dataset.gamesRbS ?? gamesRbInitialS.join(",");
    const tRaw = root.dataset.gamesRbT ?? gamesRbInitialT.join(",");
    const state = {
      S: sRaw.split(",").filter(Boolean).map(Number).sort((a, b) => a - b),
      T: tRaw.split(",").filter(Boolean).map(Number).sort((a, b) => a - b)
    };
    const mexS = gamesRbMex(state.S);
    const mexT = gamesRbMex(state.T);
    const rbResult = gamesRbMex(gamesRbExpandedOutputValues(state, mexS, mexT));

    root.querySelectorAll("[data-games-rb-set-layer]").forEach((layer) => renderGamesRbSetHighlights(layer, state));
    root.querySelectorAll("[data-games-rb-mex-layer]").forEach((layer) => renderGamesRbMexRings(layer, mexS, mexT));
    renderGamesRbUnionHighlights(root.querySelector("[data-games-rb-union-layer]"), state, mexS, mexT);
    renderGamesRbProductHighlight(root.querySelector("[data-games-rb-product-layer]"), mexS, mexT);
    renderGamesRbProductArrows(root.querySelector("[data-games-rb-product-arrow-layer]"), mexS, mexT);
    root.querySelectorAll('[data-games-rb-mex-label="S"]').forEach((label) => {
      label.setAttribute("y", String(gamesRbRowY(mexS) + 16));
    });
    root.querySelectorAll('[data-games-rb-mex-label="T"]').forEach((label) => {
      label.setAttribute("x", String(gamesRbCellTextX(mexT)));
    });
    const desc = root.querySelector("#fig-games-rb-table-desc");
    if (desc) {
      desc.textContent = `Two Nim-sum operation tables compute the mex Rota-Baxter equation for S={${gamesRbFormatSet(state.S)}} and T={${gamesRbFormatSet(state.T)}}. The computed values are mex(S)=${mexS} and mex(T)=${mexT}.`;
    }
    container.querySelectorAll("[data-games-rb-toggle]").forEach((hit) => {
      const setName = hit.dataset.gamesRbToggle;
      const value = Number(hit.dataset.gamesRbValue);
      const selected = state[setName]?.includes(value) || false;
      hit.setAttribute("aria-pressed", selected ? "true" : "false");
      hit.classList.toggle("is-selected", selected);
    });
    container.querySelectorAll("[data-games-rb-expanded-mex-readout]").forEach((readout) => {
      readout.innerHTML = gamesRbExpandedMexTex;
      typesetMath(readout);
    });
    container.querySelectorAll("[data-games-rb-center-result]").forEach((readout) => {
      readout.innerHTML = `\\(=\\textcolor{#7c3aed}{${rbResult}}=\\)`;
      typesetMath(readout);
    });
  }

  const gamesRbLimitMessageTimers = new WeakMap();

  function showGamesRbLimitMessage(root) {
    const container = root.closest(".publication-figure, .diagram-expanded") || root.parentElement || root;
    const toast = container.querySelector("[data-games-rb-limit-toast]");
    if (!toast) return;
    const previous = gamesRbLimitMessageTimers.get(root);
    if (previous) clearTimeout(previous);
    toast.textContent = "mex would exceed the table range.";
    toast.classList.add("is-visible");
    const timer = setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.textContent = "";
      gamesRbLimitMessageTimers.delete(root);
    }, 1000);
    gamesRbLimitMessageTimers.set(root, timer);
  }

  function toggleGamesRbValue(root, setName, value) {
    const key = setName === "T" ? "gamesRbT" : "gamesRbS";
    const current = (root.dataset[key] ?? (setName === "T" ? gamesRbInitialT : gamesRbInitialS).join(","))
      .split(",")
      .filter(Boolean)
      .map(Number);
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else {
      next.add(value);
      if (gamesRbSelectableValues.every((candidate) => next.has(candidate))) {
        showGamesRbLimitMessage(root);
        return;
      }
    }
    root.dataset[key] = [...next].sort((a, b) => a - b).join(",");
    renderGamesRbFigure(root);
  }

  function ensureGamesRbSetControls(root) {
    const container = root.closest(".publication-figure, .diagram-expanded") || root.parentElement || root;
    container.querySelectorAll("[data-games-rb-toggle]").forEach((button) => {
      if (button.dataset.gamesRbControlReady === "true") return;
      button.dataset.gamesRbControlReady = "true";
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleGamesRbValue(root, button.dataset.gamesRbToggle || "S", Number(button.dataset.gamesRbValue));
      });
      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        toggleGamesRbValue(root, button.dataset.gamesRbToggle || "S", Number(button.dataset.gamesRbValue));
      });
    });
  }

  function initializeGamesRbFigure(root) {
    if (!root || root.dataset.gamesRbInitialized === "true") return;
    root.dataset.gamesRbInitialized = "true";
    root.dataset.gamesRbS = gamesRbInitialS.join(",");
    root.dataset.gamesRbT = gamesRbInitialT.join(",");
    ensureGamesRbSetControls(root);
    renderGamesRbFigure(root);
  }

  function initializeGamesRbFigures(scope) {
    const roots = scope.matches?.("[data-games-rb-interactive]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-games-rb-interactive]"));
    roots.forEach(initializeGamesRbFigure);
  }

  const lawverePullbackGroups = ["rb", "ro", "rg", "og"];
  const lawverePullbackStates = new WeakMap();

  function renderLawverePullbackStep(root, step) {
    const leftPhaseLength = lawverePullbackGroups.length;
    const rightPhaseLength = 7;
    const completeStep = leftPhaseLength + rightPhaseLength + 1;
    const boundedStep = Math.max(0, Math.min(completeStep, Number(step) || 0));
    root.dataset.pullbackStep = String(boundedStep);
    root.classList.toggle("is-complete", boundedStep === completeStep);

    const leftStep = Math.min(boundedStep, leftPhaseLength + 1);
    const rightStep = Math.max(0, boundedStep - leftPhaseLength);
    const activeLeftGroup = boundedStep <= leftPhaseLength ? lawverePullbackGroups[boundedStep - 1] || "" : "";
    const activeRightVertex =
      boundedStep > leftPhaseLength && boundedStep <= leftPhaseLength + rightPhaseLength ? rightStep - 1 : -1;
    const isRightActive = activeRightVertex >= 0;
    root.classList.toggle("is-coskel-building", isRightActive);

    root.querySelectorAll("[data-pullback-source]").forEach((edge) => {
      const index = lawverePullbackGroups.indexOf(edge.dataset.pullbackSource) + 1;
      edge.classList.toggle("is-active", Boolean(activeLeftGroup) && edge.dataset.pullbackSource === activeLeftGroup);
      edge.classList.toggle("is-complete", boundedStep > leftPhaseLength || (index > 0 && index < leftStep));
    });
    root.querySelectorAll("[data-pullback-edge]").forEach((edge) => {
      const index = lawverePullbackGroups.indexOf(edge.dataset.pullbackEdge) + 1;
      edge.classList.toggle("is-active", Boolean(activeLeftGroup) && edge.dataset.pullbackEdge === activeLeftGroup);
      edge.classList.toggle("is-complete", boundedStep > leftPhaseLength || (index > 0 && index < leftStep));
    });
    root.querySelectorAll("[data-coskel-boundary]").forEach((graph) => {
      const index = Number(graph.dataset.coskelBoundary);
      graph.classList.toggle("is-active", activeRightVertex === index);
      graph.classList.toggle("is-glued", isRightActive && index < activeRightVertex);
      graph.classList.toggle("is-complete", boundedStep === completeStep);
    });
    root.querySelectorAll("[data-coskel-core-edge]").forEach((edge) => {
      const from = Number(edge.dataset.coskelEdgeFrom);
      const to = Number(edge.dataset.coskelEdgeTo);
      const isIncident = from === activeRightVertex || to === activeRightVertex;
      edge.classList.toggle("is-gluing", isRightActive && !isIncident);
      edge.classList.toggle("is-complete", boundedStep === completeStep);
    });
    root.querySelectorAll("[data-coskel-vertex]").forEach((vertex) => {
      const index = Number(vertex.dataset.coskelVertex);
      vertex.classList.toggle("is-gluing", isRightActive && index !== activeRightVertex);
      vertex.classList.toggle("is-complete", boundedStep === completeStep);
    });
  }

  function stopLawverePullbackFigure(root) {
    const state = lawverePullbackStates.get(root);
    if (!state) return;
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers = [];
    state.playing = false;
  }

  function playLawverePullbackFigure(root) {
    const state = lawverePullbackStates.get(root);
    if (!state) return;
    stopLawverePullbackFigure(root);
    state.playing = true;
    root.classList.add("is-animated");
    root.classList.remove("is-complete");
    renderLawverePullbackStep(root, 0);
    const totalAnimationSteps = lawverePullbackGroups.length + 7;
    Array.from({ length: totalAnimationSteps }, (_, index) => index).forEach((index) => {
      state.timers.push(
        window.setTimeout(() => renderLawverePullbackStep(root, index + 1), 420 + index * state.intervalMs)
      );
    });
    state.timers.push(
      window.setTimeout(() => {
        renderLawverePullbackStep(root, totalAnimationSteps + 1);
        if (state.loop) {
          state.timers.push(window.setTimeout(() => playLawverePullbackFigure(root), state.intervalMs));
          return;
        }
        state.playing = false;
      }, 420 + totalAnimationSteps * state.intervalMs)
    );
  }

  function initializeLawverePullbackFigure(root, options = {}) {
    stopLawverePullbackFigure(root);
    lawverePullbackStates.set(root, {
      timers: [],
      playing: false,
      intervalMs: options.intervalMs || 760,
      loop: options.loop ?? true
    });
    if (options.controls) {
      root.setAttribute("role", "button");
      root.setAttribute("aria-label", "Replay the pullback animation");
      root.tabIndex = 0;
      root.addEventListener("click", (event) => {
        playLawverePullbackFigure(root);
      });
      root.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        playLawverePullbackFigure(root);
      });
    }
    renderLawverePullbackStep(root, lawverePullbackGroups.length + 8);
    if (options.autoplay) playLawverePullbackFigure(root);
  }

  function initializeLawverePullbackFigures(scope, options = {}) {
    const roots = scope.matches?.("[data-lawvere-pullback]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-lawvere-pullback]"));
    roots.forEach((root) => initializeLawverePullbackFigure(root, options));
  }

  function stopLawverePullbackFigures(scope) {
    const roots = scope.matches?.("[data-lawvere-pullback]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-lawvere-pullback]"));
    roots.forEach((root) => stopLawverePullbackFigure(root));
  }

  const connectedCorrespondenceGroups = ["a", "b", "c"];
  const connectedCorrespondenceStates = new WeakMap();

  function setConnectedPattern(root) {
    const state = connectedCorrespondenceStates.get(root);
    const patterns = Array.from(root.querySelectorAll("[data-connected-pattern]"));
    if (!patterns.length) return;
    const activeIndex = Math.max(0, Math.min(patterns.length - 1, state?.patternIndex || 0));
    root.dataset.connectedPattern = String(activeIndex);
    patterns.forEach((pattern, index) => {
      pattern.classList.toggle("is-visible", index === activeIndex);
    });
  }

  function renderConnectedCorrespondenceStep(root, step) {
    const completeStep = connectedCorrespondenceGroups.length + 1;
    const boundedStep = Math.max(0, Math.min(completeStep, Number(step) || 0));
    root.dataset.connectedStep = String(boundedStep);
    root.classList.toggle("is-complete", boundedStep === completeStep);

    const activeGroup = connectedCorrespondenceGroups[boundedStep - 1] || "";
    root.querySelectorAll("[data-connected-left], [data-connected-right]").forEach((group) => {
      const groupId = group.dataset.connectedLeft || group.dataset.connectedRight || "";
      const index = connectedCorrespondenceGroups.indexOf(groupId) + 1;
      group.classList.toggle("is-active", Boolean(activeGroup) && groupId === activeGroup);
      group.classList.toggle("is-complete", boundedStep === completeStep || (index > 0 && index < boundedStep));
    });

    root.querySelectorAll("[data-connected-arrow]").forEach((arrow) => {
      const index = connectedCorrespondenceGroups.indexOf(arrow.dataset.connectedArrow) + 1;
      arrow.classList.toggle("is-active", Boolean(activeGroup) && arrow.dataset.connectedArrow === activeGroup);
      arrow.classList.toggle("is-complete", boundedStep === completeStep || (index > 0 && index < boundedStep));
    });
  }

  function stopConnectedCorrespondenceFigure(root) {
    const state = connectedCorrespondenceStates.get(root);
    if (!state) return;
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers = [];
    state.playing = false;
  }

  function playConnectedCorrespondenceFigure(root) {
    const state = connectedCorrespondenceStates.get(root);
    if (!state) return;
    stopConnectedCorrespondenceFigure(root);
    state.playing = true;
    root.classList.add("is-animated");
    root.classList.remove("is-complete");
    setConnectedPattern(root);
    renderConnectedCorrespondenceStep(root, 0);
    connectedCorrespondenceGroups.forEach((_, index) => {
      state.timers.push(
        window.setTimeout(() => renderConnectedCorrespondenceStep(root, index + 1), 360 + index * state.intervalMs)
      );
    });
    state.timers.push(
      window.setTimeout(() => {
        renderConnectedCorrespondenceStep(root, connectedCorrespondenceGroups.length + 1);
        if (state.loop) {
          const patternCount = root.querySelectorAll("[data-connected-pattern]").length || 1;
          state.patternIndex = (state.patternIndex + 1) % patternCount;
          state.timers.push(window.setTimeout(() => playConnectedCorrespondenceFigure(root), state.intervalMs));
          return;
        }
        state.playing = false;
      }, 360 + connectedCorrespondenceGroups.length * state.intervalMs)
    );
  }

  function initializeConnectedCorrespondenceFigure(root, options = {}) {
    stopConnectedCorrespondenceFigure(root);
    connectedCorrespondenceStates.set(root, {
      timers: [],
      playing: false,
      intervalMs: options.intervalMs || 760,
      loop: options.loop ?? true,
      patternIndex: 0
    });
    if (options.controls) {
      root.setAttribute("role", "button");
      root.setAttribute("aria-label", "Replay the rooted tree and rooted forest correspondence animation");
      root.tabIndex = 0;
      root.addEventListener("click", () => playConnectedCorrespondenceFigure(root));
      root.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        playConnectedCorrespondenceFigure(root);
      });
    }
    setConnectedPattern(root);
    renderConnectedCorrespondenceStep(root, connectedCorrespondenceGroups.length + 1);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (options.autoplay && !reducedMotion) playConnectedCorrespondenceFigure(root);
  }

  function initializeConnectedCorrespondenceFigures(scope, options = {}) {
    const roots = scope.matches?.("[data-connected-correspondence]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-connected-correspondence]"));
    roots.forEach((root) => initializeConnectedCorrespondenceFigure(root, options));
  }

  function stopConnectedCorrespondenceFigures(scope) {
    const roots = scope.matches?.("[data-connected-correspondence]")
      ? [scope]
      : Array.from(scope.querySelectorAll("[data-connected-correspondence]"));
    roots.forEach((root) => stopConnectedCorrespondenceFigure(root));
  }

  const automataSvgNs = "http://www.w3.org/2000/svg";

  function initializeAutomataInteractiveFigures(scope) {
    const figures = scope.matches?.(".publication-figure-topoi-automata, .diagram-expanded")
      ? [scope]
      : Array.from(scope.querySelectorAll(".publication-figure-topoi-automata, .diagram-expanded"));
    figures.forEach((figure) => initializeAutomataInteractiveFigure(figure));
  }

  function initializeAutomataInteractiveFigure(figure) {
    const svg = figure.querySelector(".automata-cover-figure");
    if (!svg || svg.dataset.automataInteractive === "true") return;
    svg.dataset.automataInteractive = "true";
    svg.classList.add("is-interactive-automaton");
    svg.pauseAnimations?.();
    svg.setCurrentTime?.(0);

    svg.querySelectorAll(".automata-moving-dot, .automata-moving-word, .automata-result-output").forEach((node) => {
      node.setAttribute("display", "none");
    });
    svg.querySelectorAll(".automata-input-word").forEach((node) => {
      node.setAttribute("display", "none");
    });

    const coverGroup = svg.querySelector(".automata-state")?.parentElement;
    const baseGroup = svg.querySelector(".automata-moving-dot-base")?.parentElement;
    const inputTape = svg.querySelector(".automata-input-tape");
    const outputPanel = svg.querySelector(".automata-output-panel");
    const outerGroup = svg.querySelector(":scope > g");
    if (!coverGroup || !baseGroup || !inputTape || !outputPanel || !outerGroup) return;

    const coverNodes = [
      [72, 132],
      [176, 132],
      [280, 132],
      [384, 132]
    ];
    const acceptStates = new Set([1, 2]);
    const transitions = {
      0: { a: 1, b: 0 },
      1: { a: 1, b: 2 },
      2: { a: 3, b: 2 },
      3: { a: 3, b: 2 }
    };
    const coverPaths = {
      "0a": "M72 132 L88 122 C114 50, 134 50, 160 122 L176 132",
      "0b": "M72 132 L56 142 C18 210, 126 210, 88 142 L72 132",
      "1a": "M176 132 L160 122 C118 50, 234 50, 192 122 L176 132",
      "1b": "M176 132 L192 142 C220 210, 236 210, 260 142 L280 132",
      "2a": "M280 132 L300 122 C328 50, 344 50, 368 122 L384 132",
      "2b": "M280 132 L260 142 C226 210, 334 210, 300 142 L280 132",
      "3a": "M384 132 L368 122 C326 50, 438 50, 400 122 L384 132",
      "3b": "M384 132 L368 145 C344 218, 318 216, 291 151 L280 132"
    };
    const basePaths = {
      a: "M0 0 L-12 -11 C-58 -90.4, 58 -90.4, 12 -11 L0 0",
      b: "M0 0 L12 11 C58 86, -58 86, -12 11 L0 0"
    };

    const makeSvg = (tag, attrs = {}) => {
      const node = document.createElementNS(automataSvgNs, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };
    const makePath = (d) => {
      const path = makeSvg("path", { d });
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "none");
      svg.append(path);
      return path;
    };
    const coverPathNodes = Object.fromEntries(Object.entries(coverPaths).map(([key, d]) => [key, makePath(d)]));
    const basePathNodes = Object.fromEntries(Object.entries(basePaths).map(([key, d]) => [key, makePath(d)]));
    const coverEdgeHighlightLayer = makeSvg("g", { class: "automata-interactive-edge-highlight-layer" });
    const baseEdgeHighlightLayer = makeSvg("g", { class: "automata-interactive-edge-highlight-layer" });
    coverGroup.insertBefore(coverEdgeHighlightLayer, coverGroup.querySelector(".automata-state"));
    baseGroup.insertBefore(baseEdgeHighlightLayer, baseGroup.querySelector(".figure-node"));

    const link = makeSvg("line", { class: "automata-dot-link automata-interactive-link" });
    outerGroup.insertBefore(link, outerGroup.querySelector(".automata-dot-links"));

    const coverDot = makeSvg("g", { class: "automata-moving-dot automata-interactive-dot" });
    coverDot.append(makeSvg("circle", { class: "automata-moving-dot-core", cx: "0", cy: "0", r: "9.6" }));
    coverGroup.append(coverDot);
    const baseDot = makeSvg("g", { class: "automata-moving-dot automata-interactive-dot" });
    baseDot.append(makeSvg("circle", { class: "automata-moving-dot-core", cx: "0", cy: "0", r: "9.6" }));
    baseGroup.append(baseDot);

    const liveWord = makeSvg("text", { class: "automata-live-word", x: "86", y: "24" });
    inputTape.append(liveWord);
    const liveWordShadow = makeSvg("text", { class: "automata-live-word automata-live-word-near-dot", x: "14", y: "-14" });
    const liveWordGroup = makeSvg("g", { class: "automata-live-word-group" });
    liveWordGroup.append(liveWordShadow);
    coverGroup.append(liveWordGroup);

    outputPanel.querySelectorAll(".automata-output-cell").forEach((node) => node.remove());
    let resultBlock = outputPanel.querySelector(".automata-current-output-block");
    if (!resultBlock) {
      resultBlock = makeSvg("rect", { class: "automata-current-output-block", x: "78", y: "7", width: "130", height: "40", rx: "10" });
      outputPanel.append(resultBlock);
    }
    const resultText = makeSvg("text", { class: "automata-interactive-result", x: "143", y: "35" });
    outputPanel.append(resultText);

    const state = {
      q: 0,
      word: "",
      busy: false,
      cover: coverNodes[0],
      base: [0, 0]
    };

    const outerCoverPoint = ([x, y]) => [18 + 1.08 * x, 106 + 1.08 * y];
    const outerBasePoint = ([x, y]) => [506 + 0.98 * (113 + x), 178 + 0.98 * (72 + y)];
    const setTransform = (node, [x, y]) => node.setAttribute("transform", `translate(${x} ${y})`);
    const updateLink = () => {
      const [x1, y1] = outerCoverPoint(state.cover);
      const [x2, y2] = outerBasePoint(state.base);
      link.setAttribute("x1", x1.toFixed(1));
      link.setAttribute("y1", y1.toFixed(1));
      link.setAttribute("x2", x2.toFixed(1));
      link.setAttribute("y2", y2.toFixed(1));
    };
    const renderWord = () => {
      const renderInto = (node) => {
        node.textContent = "";
        [...state.word].forEach((letter) => {
          const tspan = makeSvg("tspan", { class: letter === "a" ? "automata-word-a" : "automata-word-b" });
          tspan.textContent = letter;
          node.append(tspan);
        });
      };
      renderInto(liveWord);
      renderInto(liveWordShadow);
    };
    const evaluatedStateForWord = (word) => [...word].reduce((q, letter) => transitions[q][letter], 0);
    const renderResult = () => {
      const value = acceptStates.has(evaluatedStateForWord(state.word)) ? "accept" : "reject";
      resultText.textContent = "";
      outputPanel.classList.toggle("is-accept", value === "accept");
      outputPanel.classList.toggle("is-reject", value === "reject");
      resultText.textContent = value === "accept" ? "✓" : "×";
    };
    const render = () => {
      setTransform(coverDot, state.cover);
      setTransform(liveWordGroup, state.cover);
      setTransform(baseDot, state.base);
      updateLink();
      renderWord();
      renderResult();
    };
    const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const flashTransitionEdge = (pathKey, letter) => {
      const className = `automata-interactive-edge-highlight automata-interactive-edge-highlight-${letter}`;
      const coverPath = makeSvg("path", { class: className, d: coverPaths[pathKey] });
      const basePath = makeSvg("path", { class: className, d: basePaths[letter] });
      coverEdgeHighlightLayer.append(coverPath);
      baseEdgeHighlightLayer.append(basePath);
      const animations = [coverPath, basePath].map((path) =>
        path.animate(
          [
            { opacity: 0, strokeWidth: "3px" },
            { opacity: 0.95, strokeWidth: "8px" },
            { opacity: 0, strokeWidth: "5px" }
          ],
          { duration: 360, easing: "ease-out" }
        )
      );
      return Promise.all(animations.map((animation) => animation.finished.catch(() => {}))).finally(() => {
        coverPath.remove();
        basePath.remove();
      });
    };
    const flashConsumedLetter = async (letter, index) => {
      let x = 14;
      let y = -14;
      if (typeof liveWordShadow.getStartPositionOfChar === "function" && index >= 0) {
        try {
          const position = liveWordShadow.getStartPositionOfChar(index);
          x = Number(position.x.toFixed(2));
          y = Number(position.y.toFixed(2));
        } catch (_error) {
          x = 14 + index * 8.4;
        }
      } else {
        x = 14 + index * 8.4;
      }
      const text = makeSvg("text", {
        class: `automata-consume-letter-flash ${letter === "a" ? "automata-word-a" : "automata-word-b"}`,
        x: String(x),
        y: String(y)
      });
      text.textContent = letter;
      const group = makeSvg("g", { transform: `translate(${state.cover[0]} ${state.cover[1]})` });
      group.append(text);
      coverGroup.append(group);
      text.animate(
        [
          { opacity: 1, fill: letter === "a" ? "#9f3f31" : "#2f5d8e", transform: "scale(1)" },
          { opacity: 1, fill: "#fff6bf", transform: "scale(1.35)" },
          { opacity: 0, fill: "#fff6bf", transform: "scale(0.9)" }
        ],
        { duration: 360, easing: "ease-out" }
      ).finished.finally(() => group.remove());
      await sleep(360);
    };
    const animateAlong = (coverPath, basePath, nextState) =>
      new Promise((resolve) => {
        const duration = 620;
        const start = performance.now();
        const coverLength = coverPath.getTotalLength();
        const baseLength = basePath.getTotalLength();
        const step = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const coverPoint = coverPath.getPointAtLength(coverLength * eased);
          const basePoint = basePath.getPointAtLength(baseLength * eased);
          state.cover = [Number(coverPoint.x.toFixed(1)), Number(coverPoint.y.toFixed(1))];
          state.base = [Number(basePoint.x.toFixed(1)), Number(basePoint.y.toFixed(1))];
          setTransform(coverDot, state.cover);
          setTransform(liveWordGroup, state.cover);
          setTransform(baseDot, state.base);
          updateLink();
          if (progress < 1) {
            requestAnimationFrame(step);
            return;
          }
          state.q = nextState;
          state.cover = coverNodes[state.q];
          state.base = [0, 0];
          render();
          resolve();
        };
        requestAnimationFrame(step);
      });
    const consume = async (letter) => {
      if (state.busy) return;
      state.busy = true;
      state.word += letter;
      renderWord();
      renderResult();
      const from = state.q;
      const next = transitions[from][letter];
      await Promise.all([flashConsumedLetter(letter, state.word.length - 1), flashTransitionEdge(`${from}${letter}`, letter)]);
      await animateAlong(coverPathNodes[`${from}${letter}`], basePathNodes[letter], next);
      state.busy = false;
    };
    const reset = () => {
      if (state.busy) return;
      state.q = 0;
      state.word = "";
      state.cover = coverNodes[0];
      state.base = [0, 0];
      render();
    };

    let inputControls = figure.querySelector(".automata-interactive-controls-input");
    figure.querySelectorAll(".automata-interactive-controls-actions, .automata-button-judge").forEach((node) => node.remove());
    if (!inputControls) {
      inputControls = el("div", "automata-interactive-controls automata-interactive-controls-input");
      const aButton = el("button", "automata-button automata-button-a", "a");
      const bButton = el("button", "automata-button automata-button-b", "b");
      const resetButton = el("button", "automata-button automata-button-reset", "Reset");
      [aButton, bButton, resetButton].forEach((button) => {
        button.type = "button";
        inputControls.append(button);
      });
      figure.append(inputControls);
      aButton.addEventListener("click", () => consume("a"));
      bButton.addEventListener("click", () => consume("b"));
      resetButton.addEventListener("click", reset);
    }

    render();
  }

  // END WORKS FIGURE RUNTIME

  function setupInteractions() {
    const paperFilter = document.querySelector("#paper-filter");
    if (paperFilter && !paperFilter.dataset.worksListener) {
      paperFilter.dataset.worksListener = "true";
      paperFilter.addEventListener("input", (event) => setPaperFilters({ query: event.target.value, theme: "" }));
    }
    document.querySelectorAll("[data-paper-view]").forEach((button) => {
      if (button.dataset.worksListener) return;
      button.dataset.worksListener = "true";
      button.addEventListener("click", () => {
        state.paperView = button.dataset.paperView === "diagram" ? "diagram" : "list";
        renderPapers();
        renderPreparationPapers();
      });
    });
    const talkFilter = document.querySelector("#talk-filter");
    if (talkFilter && !talkFilter.dataset.worksListener) {
      talkFilter.dataset.worksListener = "true";
      talkFilter.addEventListener("input", (event) => {
        state.talkQuery = event.target.value;
        renderResearchmapPresentations();
      });
    }
    [
      ["#note-filter", "input", (event) => { state.noteQuery = event.target.value; renderNotes(); }],
      ["#note-language-filter", "change", (event) => { state.noteLanguage = event.target.value; renderNotes(); }],
      ["#note-year-filter", "change", (event) => { state.noteYear = event.target.value; renderNotes(); }],
      ["#note-theme-filter", "change", (event) => { state.noteTheme = event.target.value; renderNotes(); }],
      ["#talk-year-filter", "change", (event) => { state.talkYear = event.target.value; renderResearchmapPresentations(); }],
      ["#talk-theme-filter", "change", (event) => { state.talkTheme = event.target.value; renderResearchmapPresentations(); }],
      ["#talk-slides-filter", "change", (event) => { state.talkSlides = event.target.value; renderResearchmapPresentations(); }],
      ["#slide-filter", "input", (event) => { state.slideQuery = event.target.value; renderSlides(); }],
      ["#slide-language-filter", "change", (event) => { state.slideLanguage = event.target.value; renderSlides(); }],
      ["#slide-year-filter", "change", (event) => { state.slideYear = event.target.value; renderSlides(); }],
      ["#slide-theme-filter", "change", (event) => { state.slideTheme = event.target.value; renderSlides(); }]
    ].forEach(([selector, type, handler]) => {
      const node = document.querySelector(selector);
      if (!node || node.dataset.worksListener) return;
      node.dataset.worksListener = "true";
      node.addEventListener(type, handler);
    });
  }

  function applyFigureMarkerIds(container, figureId, prefix) {
    const svg = container.querySelector("svg");
    if (!svg) return;

    if (figureId === "completely-connected") {
      svg.querySelectorAll("marker[data-connected-marker]").forEach((marker) => {
        const group = marker.dataset.connectedMarker || "";
        svg.querySelectorAll(`[data-connected-arrow="${group}"]`).forEach((path) => {
          path.setAttribute("marker-end", `url(#${marker.id})`);
        });
      });
    } else if (figureId === "internal-parameterizations") {
      const markers = new Map();
      svg.querySelectorAll("marker[data-internal-marker]").forEach((marker) => {
        markers.set(marker.dataset.internalMarker || "default", marker.id);
      });
      svg.querySelectorAll("marker[data-internal-piece-marker]").forEach((marker) => {
        markers.set(`piece:${marker.dataset.internalPieceMarker || ""}`, marker.id);
      });
      const setMarker = (selector, group) => {
        const markerId = markers.get(group);
        if (!markerId) return;
        svg.querySelectorAll(selector).forEach((path) => {
          path.setAttribute("marker-end", `url(#${markerId})`);
        });
      };
      svg.querySelectorAll(".internal-piece-arrow[data-internal-piece-marker]").forEach((path) => {
        const markerId = markers.get(`piece:${path.dataset.internalPieceMarker || ""}`);
        if (markerId) path.setAttribute("marker-end", `url(#${markerId})`);
      });
      setMarker(".internal-loop-n", "n");
      setMarker(".internal-loop-l", "l");
      const defaultMarker = markers.get("default");
      if (defaultMarker) {
        svg.querySelectorAll(".figure-arrow").forEach((path) => {
          if (!path.hasAttribute("marker-end")) path.setAttribute("marker-end", `url(#${defaultMarker})`);
        });
      }
    } else if (figureId === "quotient-toposes") {
      const markers = new Map();
      svg.querySelectorAll("marker[data-quotient-marker]").forEach((marker) => {
        markers.set(marker.dataset.quotientMarker || "height", marker.id);
      });
      svg.querySelectorAll("[data-quotient-arrow]").forEach((path) => {
        const markerId = markers.get(path.dataset.quotientArrow);
        if (markerId) path.setAttribute("marker-end", `url(#${markerId})`);
      });
    } else if (figureId === "topoi-automata") {
      const markers = new Map();
      svg.querySelectorAll("marker[data-automata-marker]").forEach((marker) => {
        markers.set(marker.dataset.automataMarker || "neutral", marker.id);
      });
      const setMarker = (selector, group) => {
        const markerId = markers.get(group);
        if (!markerId) return;
        svg.querySelectorAll(selector).forEach((path) => {
          path.setAttribute("marker-end", `url(#${markerId})`);
        });
      };
      setMarker(".automata-edge-a", "a");
      setMarker(".automata-edge-b", "b");
    } else if (figureId === "automata-cantor-morphism") {
      const markers = new Map();
      svg.querySelectorAll("marker[data-cantor-marker]").forEach((marker) => {
        markers.set(marker.dataset.cantorMarker || "neutral", marker.id);
      });
      svg.querySelectorAll("[data-cantor-arrow]").forEach((path) => {
        const markerId = markers.get(path.dataset.cantorArrow || "neutral");
        if (markerId) path.setAttribute("marker-end", `url(#${markerId})`);
      });
    } else {
      const marker = svg.querySelector("marker");
      if (marker) {
        svg.querySelectorAll(".figure-arrow").forEach((path) => {
          if (!path.hasAttribute("marker-end")) path.setAttribute("marker-end", `url(#${marker.id})`);
        });
      }
    }

    const idMap = new Map();
    container.querySelectorAll("[id]").forEach((node) => {
      const oldId = node.id;
      const newId = `${prefix}-${figureId}-${oldId}`;
      idMap.set(oldId, newId);
      node.id = newId;
    });
    if (!idMap.size) return;
    container.querySelectorAll("*").forEach((node) => {
      ["marker-start", "marker-mid", "marker-end", "fill", "stroke", "filter", "clip-path", "mask"].forEach((attribute) => {
        const value = node.getAttribute(attribute);
        if (!value) return;
        let nextValue = value;
        idMap.forEach((newId, oldId) => {
          nextValue = nextValue.replaceAll(`url(#${oldId})`, `url(#${newId})`);
        });
        if (nextValue !== value) node.setAttribute(attribute, nextValue);
      });
      ["href", "xlink:href"].forEach((attribute) => {
        const value = node.getAttribute(attribute);
        if (!value?.startsWith("#")) return;
        const newId = idMap.get(value.slice(1));
        if (newId) node.setAttribute(attribute, `#${newId}`);
      });
      ["aria-labelledby", "aria-describedby"].forEach((attribute) => {
        const value = node.getAttribute(attribute);
        if (!value) return;
        const nextValue = value.split(/\s+/).map((id) => idMap.get(id) || id).join(" ");
        if (nextValue !== value) node.setAttribute(attribute, nextValue);
      });
    });
  }

  globalThis.setupLanguage = setupLanguage;
  globalThis.setupInteractions = setupInteractions;
  globalThis.applyLanguage = applyLanguage;
  globalThis.renderResearchMap = renderResearchMap;
  globalThis.renderPapers = renderPapers;
  globalThis.renderPreparationPapers = renderPreparationPapers;
  globalThis.renderNotes = renderNotes;
  globalThis.renderResearchmapPresentations = renderResearchmapPresentations;
  globalThis.renderSlides = renderSlides;
  globalThis.typesetMath = typesetMath;
  globalThis.applyFigureMarkerIds = applyFigureMarkerIds;
  globalThis.initializeGamesRbFigures = initializeGamesRbFigures;
  globalThis.initializeGrundyFigures = initializeGrundyFigures;
  globalThis.initializeLawverePullbackFigures = initializeLawverePullbackFigures;
  globalThis.initializeConnectedCorrespondenceFigures = initializeConnectedCorrespondenceFigures;
  globalThis.initializeNormalizationFigures = initializeNormalizationFigures;
  globalThis.initializeAutomataInteractiveFigures = initializeAutomataInteractiveFigures;
  globalThis.stopGrundyFigures = stopGrundyFigures;
  globalThis.stopLawverePullbackFigures = stopLawverePullbackFigures;
  globalThis.stopConnectedCorrespondenceFigures = stopConnectedCorrespondenceFigures;
  globalThis.grundyAutoplayIntervalMs = grundyAutoplayIntervalMs;
})();
