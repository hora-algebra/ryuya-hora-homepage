import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

function noop() {}

function fakeElement() {
  return {
    nodeType: 1,
    dataset: {},
    style: { setProperty: noop },
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    children: [],
    childNodes: [],
    append: noop,
    appendChild: noop,
    prepend: noop,
    replaceChildren: noop,
    setAttribute: noop,
    removeAttribute: noop,
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    matches: () => false,
    getBoundingClientRect: () => ({ width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }),
    innerHTML: "",
    textContent: "",
    id: ""
  };
}

function siteVmContext() {
  const documentElement = fakeElement();
  documentElement.lang = "en";
  const context = {
    console,
    URL,
    URLSearchParams,
    Intl,
    Math,
    Date,
    Set,
    Map,
    encodeURIComponent,
    decodeURIComponent,
    Node: { ELEMENT_NODE: 1, TEXT_NODE: 3 },
    document: {
      documentElement,
      body: { ...fakeElement(), dataset: { page: "sync" } },
      currentScript: { dataset: { manualInit: "true" } },
      scripts: [],
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: fakeElement,
      createElementNS: fakeElement,
      createTextNode: (text) => ({ nodeType: 3, textContent: text }),
      addEventListener: noop
    },
    window: {
      addEventListener: noop,
      setTimeout: noop,
      clearTimeout: noop,
      requestAnimationFrame: noop,
      matchMedia: () => ({ matches: false, addEventListener: noop }),
      localStorage: { getItem: () => null, setItem: noop },
      location: { pathname: "/index.html", hash: "", search: "", href: "file:///index.html" }
    },
    globalThis: null,
    researchmapData: null,
    overleafData: { artifacts: [] }
  };
  context.globalThis = context;
  context.window.globalThis = context;
  context.location = context.window.location;
  return context;
}

async function loadSiteData() {
  const context = siteVmContext();
  const source = await readFile("scripts/site.js", "utf8");
  vm.runInNewContext(`${source}\nglobalThis.__siteData = siteData;`, context, { filename: "scripts/site.js" });
  return context.__siteData;
}

async function readBrowserData(path, property) {
  const context = { window: {} };
  context.globalThis = context.window;
  vm.runInNewContext(await readFile(path, "utf8"), context, { filename: path });
  return context.window[property];
}

async function writeBrowserData(path, property, data) {
  await writeFile(path, `window.${property} = ${JSON.stringify(data, null, 2)};\n`);
}

function simplified(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function textHasKeyword(text, keyword) {
  const haystack = ` ${simplified(text)} `;
  const needle = simplified(keyword);
  if (!needle) return false;
  return needle.includes(" ") ? haystack.includes(needle) : haystack.includes(` ${needle} `);
}

function themeIdsForTalk(talk, themes) {
  const text = [talk.title, talk.event, talk.venue, talk.date, talk.year].filter(Boolean).join(" ");
  return themes
    .filter((theme) => (theme.keywords || []).some((keyword) => textHasKeyword(text, keyword)))
    .map((theme) => theme.id);
}

function themeIdsForText(text, themes, hints = []) {
  const hinted = new Set(
    hints
      .map(simplified)
      .filter(Boolean)
  );
  return themes
    .filter((theme) => hinted.has(simplified(theme.id)) || hinted.has(simplified(theme.label)) || (theme.keywords || []).some((keyword) => textHasKeyword(text, keyword)))
    .map((theme) => theme.id);
}

function metaTagIdsForText(text, metaTags, explicit = []) {
  const explicitIds = new Set(explicit.map(simplified).filter(Boolean));
  return metaTags
    .filter((tag) => explicitIds.has(simplified(tag.id)) || explicitIds.has(simplified(tag.label)) || (tag.keywords || []).some((keyword) => textHasKeyword(text, keyword)))
    .map((tag) => tag.id);
}

const knownSlideFiles = new Set([
  "RYUYA,HORA.pdf",
  "Space⋊Time for Conway's Game of Life.pdf",
  "ライツアウトの代数的研究.pdf",
  "Hora_CSCAT2024.pdf",
  "Local state classifier for algebraic language theory.pdf",
  "IRIF20250527_ver1.pdf",
  "CSCAT_2025-3.pdf",
  "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf",
  "IRIFtoday.pdf",
  "ct2025-hora.pdf",
  "若手の会2023-8.pdf"
]);

function noteKind(note) {
  if (knownSlideFiles.has(note.file) || note.kind === "slide") return "Slides";
  const text = [note.kind, note.type, note.status, note.file, note.href, note.title, note.description].filter(Boolean).join(" ");
  if (/slides?|talk|cscat|seminar/i.test(text)) return "Slides";
  return "Notes";
}

function talkSearchRecords(siteData, searchData) {
  const themes = searchData.researchThemes || [];
  return siteData.talks.flatMap((group) =>
    group.items.map((talk) => {
      const year = String(talk.year || group.year || "");
      const href = talk.href || talk.link || "";
      const summary = talk.venue || talk.event || "";
      return {
        kind: "Talks",
        title: talk.title,
        href,
        year,
        summary,
        themes: themeIdsForTalk({ ...talk, year }, themes),
        metaTags: [],
        text: [talk.title, talk.event, summary, talk.date, year, href].filter(Boolean).join(" ")
      };
    })
  );
}

function documentSearchRecords(siteData, searchData) {
  const themes = searchData.researchThemes || [];
  const metaTags = searchData.researchMetaTags || [];
  return siteData.notes
    .filter((note) => note.file !== "Notion archive")
    .map((note) => {
      const kind = noteKind(note);
      const text = [note.title, note.description, note.file, note.date, note.language, note.event, note.talkType, ...(note.themes || []), ...(note.metaTags || [])].filter(Boolean).join(" ");
      return {
        kind,
        title: note.title,
        href: note.href || "",
        year: note.date || "",
        summary: note.description || "",
        themes: themeIdsForText(text, themes, [note.theme, ...(note.themes || [])]),
        metaTags: metaTagIdsForText(text, metaTags, note.metaTags || []),
        text
      };
    });
}

function preparationSearchRecords(siteData, searchData) {
  const themes = searchData.researchThemes || [];
  return siteData.papers.preparation.map((title) => {
    const record = typeof title === "object" && title ? title : { title };
    const text = [record.title, record.summary, ...(record.themes || [])].filter(Boolean).join(" ");
    return {
      kind: "In preparation",
      title: record.title,
      href: "#in-preparation",
      year: record.year || "",
      summary: record.summary || "",
      themes: themeIdsForText(text, themes, record.themes || []),
      metaTags: [],
      text
    };
  });
}

function replaceTalkSearchRecords(searchData, talkRecords) {
  const records = searchData.records || [];
  const firstTalkIndex = records.findIndex((record) => record.kind === "Talks");
  const nonTalkRecords = records.filter((record) => record.kind !== "Talks");
  if (firstTalkIndex < 0) return [...nonTalkRecords, ...talkRecords];
  return [
    ...records.slice(0, firstTalkIndex).filter((record) => record.kind !== "Talks"),
    ...talkRecords,
    ...records.slice(firstTalkIndex).filter((record) => record.kind !== "Talks")
  ];
}

function replaceSearchRecordsByKind(searchData, kinds, replacementRecords) {
  const records = searchData.records || [];
  const wanted = new Set(kinds);
  const firstIndex = records.findIndex((record) => wanted.has(record.kind));
  const nonMatching = records.filter((record) => !wanted.has(record.kind));
  if (firstIndex < 0) return [...nonMatching, ...replacementRecords];
  return [
    ...records.slice(0, firstIndex).filter((record) => !wanted.has(record.kind)),
    ...replacementRecords,
    ...records.slice(firstIndex).filter((record) => !wanted.has(record.kind))
  ];
}

const siteData = await loadSiteData();

const talksDataPath = "data/works-talks.generated.js";
const talksData = await readBrowserData(talksDataPath, "worksTalksData");
talksData.preparation = siteData.papers.preparation;
talksData.notes = siteData.notes;
talksData.talks = siteData.talks;
await writeBrowserData(talksDataPath, "worksTalksData", talksData);

const papersDataPath = "data/works-papers.generated.js";
const papersData = await readBrowserData(papersDataPath, "worksPapersData");
papersData.papers = siteData.papers;
await writeBrowserData(papersDataPath, "worksPapersData", papersData);

const searchDataPath = "data/works-search.generated.js";
const searchData = await readBrowserData(searchDataPath, "worksSearchData");
searchData.records = replaceTalkSearchRecords(searchData, talkSearchRecords(siteData, searchData));
searchData.records = replaceSearchRecordsByKind(searchData, ["In preparation"], preparationSearchRecords(siteData, searchData));
searchData.records = replaceSearchRecordsByKind(searchData, ["Notes", "Slides"], documentSearchRecords(siteData, searchData));
await writeBrowserData(searchDataPath, "worksSearchData", searchData);

console.log("Synced generated Works paper/talk/note/search data from scripts/site.js");
