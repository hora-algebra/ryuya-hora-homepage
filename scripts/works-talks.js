(function () {
  const data = window.worksTalksData;
  if (!data) return;

  const state = {
    noteQuery: "",
    talkQuery: "",
    slideQuery: ""
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

  function slug(prefix, value) {
    return `${prefix}-${String(value || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }

  function isSlide(note) {
    return /slide|slides|talk/i.test([note.kind, note.type, note.status, note.file, note.href, note.title].filter(Boolean).join(" "));
  }

  function hrefFor(record, fallback) {
    const href = record.href || record.link || record.file || fallback;
    if (/^(https?:|#|\.?\.\/)/.test(href)) return href;
    return `../${href}`;
  }

  function renderPreparation() {
    const root = document.getElementById("preparation-paper-list");
    if (!root) return;
    root.replaceChildren();
    const prep = data.preparation || [];
    if (!prep.length) {
      root.append(el("p", "empty-state", "No in-preparation papers."));
      return;
    }
    prep.forEach((title) => {
      const item = el("article", "publication-item publication-item-compact");
      item.id = slug("preparation", title);
      item.append(el("h3", null, title));
      root.append(item);
    });
  }

  function noteMatches(note, query) {
    if (!query) return true;
    return normalized([note.title, note.description, note.file, note.year, note.date, note.language].join(" ")).includes(normalized(query));
  }

  function renderNoteCard(note, prefix) {
    const item = el("article", "note-card");
    item.id = slug(prefix, note.title);
    const title = el("h3");
    const anchor = el("a", null, note.title);
    anchor.href = hrefFor(note, `#${item.id}`);
    if (/^https?:/.test(anchor.href)) anchor.rel = "noreferrer";
    title.append(anchor);
    item.append(title);
    const meta = [note.date || note.year, note.language, note.description].filter(Boolean).join(" / ");
    if (meta) item.append(el("p", "note-meta", meta));
    return item;
  }

  function renderNotes() {
    const input = document.getElementById("note-filter");
    if (input) {
      input.value = state.noteQuery;
      input.oninput = () => {
        state.noteQuery = input.value;
        renderNotes();
      };
    }
    const root = document.getElementById("notes-list");
    if (!root) return;
    const records = (data.notes || []).filter((note) => !isSlide(note)).filter((note) => noteMatches(note, state.noteQuery));
    root.replaceChildren();
    records.forEach((note) => root.append(renderNoteCard(note, "note")));
    const count = document.getElementById("note-filter-count");
    if (count) count.textContent = `${records.length} notes`;
  }

  function renderSlides() {
    const input = document.getElementById("slide-filter");
    if (input) {
      input.value = state.slideQuery;
      input.oninput = () => {
        state.slideQuery = input.value;
        renderSlides();
      };
    }
    const root = document.getElementById("slides-list");
    if (!root) return;
    const records = (data.notes || []).filter(isSlide).filter((note) => noteMatches(note, state.slideQuery));
    root.replaceChildren();
    records.forEach((note) => root.append(renderNoteCard(note, "slide")));
    const count = document.getElementById("slide-filter-count");
    if (count) count.textContent = `${records.length} slides`;
  }

  function talkMatches(talk, year) {
    if (!state.talkQuery) return true;
    return normalized([talk.title, talk.venue, talk.description, talk.href, year].join(" ")).includes(normalized(state.talkQuery));
  }

  function renderTalk(talk, year) {
    const item = el("article", "timeline-item");
    item.id = slug("talk", `${year}-${talk.title}`);
    const title = el("h3");
    const anchor = el("a", null, talk.title);
    anchor.href = hrefFor(talk, `#${item.id}`);
    if (/^https?:/.test(anchor.href)) anchor.rel = "noreferrer";
    title.append(anchor);
    item.append(title);
    const meta = [talk.presenter || talk.speaker, talk.venue, talk.kind].filter(Boolean).join(" / ");
    if (meta) item.append(el("p", "timeline-meta", meta));
    return item;
  }

  function renderTalks() {
    const input = document.getElementById("talk-filter");
    if (input) {
      input.value = state.talkQuery;
      input.oninput = () => {
        state.talkQuery = input.value;
        renderTalks();
      };
    }
    const root = document.getElementById("researchmap-presentation-list");
    if (!root) return;
    root.replaceChildren();
    (data.talks || []).forEach((group) => {
      const items = (group.items || []).filter((talk) => talkMatches(talk, group.year));
      if (!items.length) return;
      const section = el("section", "timeline-year");
      section.append(el("h3", null, group.year));
      items.forEach((talk) => section.append(renderTalk(talk, group.year)));
      root.append(section);
    });
  }

  function render() {
    renderPreparation();
    renderNotes();
    renderTalks();
    renderSlides();
  }

  window.WorksTalks = { render };
})();
