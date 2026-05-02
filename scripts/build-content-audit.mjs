import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const siteScript = await readFile("scripts/site.js", "utf8");
const researchmap = JSON.parse(await readFile("data/researchmap.json", "utf8"));

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
    body: { ...fakeElement(), dataset: { page: "audit" } },
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
  researchmapData: researchmap,
  overleafData: { artifacts: [] }
};

context.globalThis = context;
context.window.globalThis = context;
context.location = context.window.location;

vm.runInNewContext(
  `${siteScript}\nglobalThis.__siteData = siteData;\nglobalThis.__siteReviewData = siteReviewData;\n`,
  context,
  { filename: "scripts/site.js" }
);

const siteData = context.__siteData;
const siteReviewData = context.__siteReviewData;

function simplified(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function titleAliasMap(kind) {
  const entries = siteReviewData.titleEquivalences || [];
  return new Map(
    entries
      .filter((entry) => entry.kind === kind || entry.kind === `${kind}-slide`)
      .flatMap((entry) => [
        [simplified(entry.canonical), entry.canonical],
        ...(entry.aliases || []).map((alias) => [simplified(alias), entry.canonical])
      ])
  );
}

function canonicalTitle(value, aliases) {
  const text = String(value || "").trim();
  return aliases.get(simplified(text)) || text;
}

function paperStatus(paper) {
  return /arxiv/i.test(paper.venue || "") || /arxiv\.org/i.test(paper.link || "") ? "preprint" : "published";
}

function noteTitlePrefixKind(value) {
  const match = String(value || "").trim().match(/^(cloud|pen):\s*/i);
  return match ? match[1].toLowerCase() : "";
}

function noteAudit(note) {
  const titleKind = noteTitlePrefixKind(note.title);
  const byFile = siteReviewData.documentRights.byFile[note.file] || null;
  const isDrive = /drive\.google\.com/i.test(note.href || "") || /drive\.google\.com|lh3\.google/i.test(note.thumbnail || "");
  const rightsRecord = byFile || (isDrive ? siteReviewData.documentRights.defaultDrivePdf : null);
  const status = titleKind === "cloud" ? "speculative" : titleKind === "pen" ? "work-in-progress" : "published-note";
  const rights = rightsRecord?.rightsStatus || (note.href ? "linked-public-record" : "local-record");
  const hasExplicitPermission = rightsRecord?.coauthorConsent === "explicit-granted" || /explicit-permission/i.test(rights);
  const needsVerification = !hasExplicitPermission && (/coauthored|owner-believes-ok/i.test(rights) || Boolean(note.needsVerification));
  return {
    title: note.title,
    file: note.file,
    href: note.href || "",
    status,
    source: rightsRecord?.source || (isDrive ? "google-drive" : "homepage"),
    provenance: rightsRecord ? "owner-reviewed document rights metadata" : "manual homepage metadata",
    rights,
    needsVerification,
    explicitPermission: hasExplicitPermission,
    note: rightsRecord?.note || ""
  };
}

const paperAliases = titleAliasMap("paper");
const talkAliases = titleAliasMap("talk");

const manualPapers = [...siteData.papers.published, ...siteData.papers.preprints].map((paper) => ({
  title: paper.title,
  canonicalTitle: canonicalTitle(paper.title, paperAliases),
  status: paperStatus(paper),
  source: paperStatus(paper) === "preprint" ? "arXiv / manual homepage data" : "DOI or journal page / manual homepage data",
  provenance: "siteData",
  rights: paperStatus(paper) === "preprint" ? "arXiv public preprint metadata" : "publisher/DOI metadata plus homepage-generated figure",
  needsVerification: false
}));

const researchmapPapers = (researchmap.papers || []).map((paper) => ({
  title: paper.title,
  canonicalTitle: canonicalTitle(paper.title, paperAliases),
  status: paper.arxivId && !paper.doi ? "preprint" : "published",
  source: "researchmap",
  provenance: paper.link || researchmap.source?.profileUrl || "",
  rights: paper.arxivId && !paper.doi ? "arXiv public preprint metadata" : "publisher/DOI metadata",
  needsVerification: false
}));

const manualPaperKeys = new Set(manualPapers.map((paper) => simplified(paper.canonicalTitle)));
const researchmapPaperKeys = new Set(researchmapPapers.map((paper) => simplified(paper.canonicalTitle)));

const manualTalks = siteData.talks.flatMap((group) =>
  group.items.map((talk) => ({
    year: group.year,
    title: talk.title,
    canonicalTitle: canonicalTitle(talk.title, talkAliases),
    source: "siteData",
    provenance: talk.href || "",
    rights: "event metadata and owner-maintained talk listing",
    needsVerification: false
  }))
);

const researchmapTalks = (researchmap.presentations || []).map((talk) => ({
  date: talk.date,
  title: talk.title,
  canonicalTitle: canonicalTitle(talk.title, talkAliases),
  event: talk.event,
  source: "researchmap",
  provenance: talk.link || "",
  rights: "researchmap public presentation metadata",
  needsVerification: false
}));

const manualTalkKeys = new Set(manualTalks.map((talk) => simplified(talk.canonicalTitle)));
const researchmapTalkKeys = new Set(researchmapTalks.map((talk) => simplified(talk.canonicalTitle)));
const manualOnlyTalkKeys = new Set(
  (siteReviewData.manualTalksNotInResearchmap || []).flatMap((record) => [
    simplified(record.canonical),
    ...(record.aliases || []).map(simplified)
  ])
);

const notes = siteData.notes.map(noteAudit);

const audit = {
  generatedAt: new Date().toISOString(),
  source: {
    homepage: "scripts/site.js",
    researchmap: researchmap.source?.profileUrl || ""
  },
  decisions: {
    dc1: "Do not display DC1 as current after March 2026.",
    kakenhi24KJ0837: "Display as ongoing.",
    lawvereFourth: "Use providing-a-solution wording; status remains preprint until journal publication.",
    cloud: "Speculative note.",
    pen: "Work in progress."
  },
  profileClaims: siteReviewData.profileClaims,
  awards: siteReviewData.awards,
  mediaRights: siteReviewData.mediaRights,
  papers: {
    manual: manualPapers,
    researchmap: researchmapPapers,
    missingFromManualAfterAliases: researchmapPapers.filter((paper) => !manualPaperKeys.has(simplified(paper.canonicalTitle))),
    missingFromResearchmapAfterAliases: manualPapers.filter((paper) => !researchmapPaperKeys.has(simplified(paper.canonicalTitle)))
  },
  talks: {
    manual: manualTalks,
    researchmap: researchmapTalks,
    missingFromManualAfterAliases: researchmapTalks.filter((talk) => !manualTalkKeys.has(simplified(talk.canonicalTitle))),
    missingFromResearchmapAfterAliases: manualTalks.filter((talk) => !researchmapTalkKeys.has(simplified(talk.canonicalTitle)) && !manualOnlyTalkKeys.has(simplified(talk.canonicalTitle))),
    ownerMaintainedManualOnly: manualTalks.filter((talk) => manualOnlyTalkKeys.has(simplified(talk.canonicalTitle)))
  },
  notes: {
    records: notes,
    needsVerification: notes.filter((note) => note.needsVerification)
  },
  researchmapActivity: {
    researchProjects: researchmap.researchProjects || [],
    academicContributions: researchmap.academicContributions || [],
    socialContributions: researchmap.socialContributions || []
  },
  titleEquivalences: siteReviewData.titleEquivalences
};

await writeFile("data/content-audit.generated.json", `${JSON.stringify(audit, null, 2)}\n`);
console.log("Wrote data/content-audit.generated.json");
