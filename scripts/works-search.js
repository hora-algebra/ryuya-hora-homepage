(function () {
  const data = window.worksSearchData;
  if (!data) return;

  const state = {
    query: "",
    theme: "",
    meta: ""
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function normalized(value) {
    return String(value || "").toLowerCase().normalize("NFKC");
  }

  function recordsForState() {
    const query = normalized(state.query);
    return data.records.filter((record) => {
      if (state.theme && !(record.themes || []).includes(state.theme)) return false;
      if (state.meta && !(record.metaTags || []).includes(state.meta)) return false;
      if (!query) return true;
      return normalized([record.title, record.summary, record.year, record.kind, record.text].join(" ")).includes(query);
    });
  }

  function countForTheme(themeId) {
    return data.records.filter((record) => (record.themes || []).includes(themeId)).length;
  }

  function countForMeta(metaId) {
    return data.records.filter((record) => (record.metaTags || []).includes(metaId)).length;
  }

  function renderChoice(label, value, kind, count) {
    const button = el("button", "theme-choice", `${label}\n${count} ITEMS`);
    button.type = "button";
    const active = kind === "theme" ? state.theme === value : state.meta === value;
    button.classList.toggle("is-active", active);
    button.addEventListener("click", () => {
      if (kind === "theme") {
        state.theme = state.theme === value ? "" : value;
        state.meta = "";
      } else {
        state.meta = state.meta === value ? "" : value;
        state.theme = "";
      }
      render();
    });
    return button;
  }

  function recordHref(record) {
    if (!record.href) return "#work-search";
    if (/^(https?:|#|\.?\.\/)/.test(record.href)) return record.href;
    return `../${record.href}`;
  }

  function renderRecord(record) {
    const item = el("article", "theme-result-card");
    const kind = el("p", "theme-result-kind", record.kind);
    const title = el("h4");
    const anchor = el("a", null, record.title);
    anchor.href = recordHref(record);
    if (/^https?:/.test(anchor.href)) anchor.rel = "noreferrer";
    title.append(anchor);
    item.append(kind, title);
    const meta = [record.year, record.summary].filter(Boolean).join(" / ");
    if (meta) item.append(el("p", "theme-result-meta", meta));
    return item;
  }

  function render() {
    const root = document.getElementById("research-map");
    if (!root) return;
    const records = recordsForState();
    const limit = state.query || state.theme || state.meta ? 32 : 18;
    root.replaceChildren();

    const layout = el("div", "research-map-layout works-search-split");
    const controls = el("div", "theme-map-column");
    const search = el("label", "search-label works-search-box");
    search.append(el("span", null, "Search works"));
    const input = el("input");
    input.type = "search";
    input.autocomplete = "off";
    input.placeholder = "topos, automata, games...";
    input.value = state.query;
    input.addEventListener("input", () => {
      state.query = input.value;
      render();
      document.getElementById("works-search-input")?.focus();
    });
    input.id = "works-search-input";
    search.append(input);
    const themeList = el("div", "theme-choice-list");
    data.researchThemes.forEach((theme) => themeList.append(renderChoice(theme.label, theme.id, "theme", countForTheme(theme.id))));
    const metaList = el("div", "theme-choice-list meta-theme-choice-list");
    data.researchMetaTags.forEach((tag) => metaList.append(renderChoice(tag.label, tag.id, "meta", countForMeta(tag.id))));
    controls.append(search, themeList, metaList);

    const panel = el("div", "theme-panel");
    const status = el("p", "paper-tag-index-status", `${records.length} works found`);
    const grid = el("div", "theme-result-grid");
    records.slice(0, limit).forEach((record) => grid.append(renderRecord(record)));
    if (records.length > limit) {
      grid.append(el("p", "empty-state", `${records.length - limit} more results appear as you refine the search.`));
    }
    panel.append(status, grid);
    layout.append(controls, panel);
    root.append(layout);
  }

  window.WorksSearch = { render };
})();
