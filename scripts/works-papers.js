(function () {
  const data = window.worksPapersData;
  if (!data) return;

  const state = {
    query: "",
    view: "diagram"
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function slug(value) {
    return `paper-${String(value || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }

  function normalized(value) {
    return String(value || "").toLowerCase().normalize("NFKC");
  }

  function paperRecords() {
    return [
      ...(data.papers.published || []).map((paper) => ({ ...paper, publicationStatus: "Published" })),
      ...(data.papers.preprints || []).map((paper) => ({ ...paper, publicationStatus: "Preprint" }))
    ].sort((a, b) => String(b.year || "").localeCompare(String(a.year || "")) || String(a.title || "").localeCompare(String(b.title || "")));
  }

  function filteredPapers() {
    const query = normalized(state.query);
    return paperRecords().filter((paper) => {
      if (!query) return true;
      return normalized([paper.title, paper.authors, paper.venue, paper.year, paper.summary].flat().join(" ")).includes(query);
    });
  }

  function renderLinks(item, paper) {
    const links = [];
    if (paper.link) links.push(["Open", paper.link]);
    (paper.links || []).forEach(([label, href]) => {
      if (href && !links.some((record) => record[1] === href)) links.push([label || "Link", href]);
    });
    if (!links.length) return;
    const row = el("div", "publication-actions");
    links.forEach(([label, href]) => {
      const anchor = el("a", "text-link", label);
      anchor.href = href;
      if (/^https?:/.test(href)) anchor.rel = "noreferrer";
      row.append(anchor);
    });
    item.append(row);
  }

  function renderPaper(paper) {
    const showFigure = state.view === "diagram" && paper.figure && data.paperFigureTemplates[paper.figure];
    const item = el("article", showFigure ? "publication-item has-figure" : "publication-item");
    item.id = slug(paper.title);
    if (showFigure) {
      const figure = el("div", `publication-figure publication-figure-${paper.figure}`);
      figure.setAttribute("aria-label", `${paper.title} diagram`);
      figure.innerHTML = data.paperFigureTemplates[paper.figure];
      item.append(figure);
    }
    const titleRow = el("div", "publication-title");
    const title = el("h3");
    const anchor = el("a", null, paper.title);
    anchor.href = paper.link || `#${item.id}`;
    if (/^https?:/.test(anchor.href)) anchor.rel = "noreferrer";
    title.append(anchor);
    titleRow.append(title);
    item.append(titleRow);
    const details = [paper.publicationStatus, paper.year, paper.venue].filter(Boolean).join(" / ");
    if (details) item.append(el("p", "publication-details", details));
    if (paper.summary) item.append(el("p", "publication-summary", paper.summary));
    renderLinks(item, paper);
    return item;
  }

  function syncControls() {
    document.querySelectorAll("#paper-filter").forEach((input) => {
      if (input.value !== state.query) input.value = state.query;
      input.oninput = () => {
        state.query = input.value;
        render();
      };
    });
    document.querySelectorAll("[data-paper-view]").forEach((button) => {
      const active = button.dataset.paperView === state.view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.onclick = () => {
        state.view = button.dataset.paperView === "list" ? "list" : "diagram";
        render();
      };
    });
  }

  function render() {
    syncControls();
    const tagRoot = document.getElementById("paper-tag-index");
    if (tagRoot) tagRoot.replaceChildren();
    const root = document.getElementById("paper-list");
    if (!root) return;
    const records = filteredPapers();
    root.replaceChildren();
    if (!records.length) {
      root.append(el("p", "empty-state", "No papers match this filter."));
      return;
    }
    records.forEach((paper) => root.append(renderPaper(paper)));
  }

  window.WorksPapers = { render };
})();
