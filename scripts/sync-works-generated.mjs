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

const siteData = await loadSiteData();

const talksDataPath = "data/works-talks.generated.js";
const talksData = await readBrowserData(talksDataPath, "worksTalksData");
talksData.talks = siteData.talks;
await writeBrowserData(talksDataPath, "worksTalksData", talksData);

const searchDataPath = "data/works-search.generated.js";
const searchData = await readBrowserData(searchDataPath, "worksSearchData");
searchData.records = replaceTalkSearchRecords(searchData, talkSearchRecords(siteData, searchData));
await writeBrowserData(searchDataPath, "worksSearchData", searchData);

console.log("Synced generated Works talk/search data from scripts/site.js");
