#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";

const permalink = process.env.RESEARCHMAP_PERMALINK || "ryuyahora";
const baseUrl = (process.env.RESEARCHMAP_BASE_URL || "https://api.researchmap.jp").replace(/\/$/, "");
const accessToken = process.env.RESEARCHMAP_ACCESS_TOKEN;
const outputJson = process.env.RESEARCHMAP_OUTPUT_JSON || "data/researchmap.json";
const outputScript = process.env.RESEARCHMAP_OUTPUT_SCRIPT || "data/researchmap.generated.js";
const preferredLanguages = (process.env.RESEARCHMAP_LANGS || "en,ja")
  .split(",")
  .map((lang) => lang.trim())
  .filter(Boolean);

const achievementTypes = [
  "published_papers",
  "presentations",
  "awards",
  "education",
  "misc",
  "research_projects",
  "academic_contribution",
  "social_contribution"
];

function compact(values) {
  return values.filter((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function pickText(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (Array.isArray(value)) return compact(value.map((entry) => pickText(entry))).join(", ");
  if (typeof value === "object") {
    for (const lang of preferredLanguages) {
      const text = pickText(value[lang]);
      if (text) return text;
    }
    for (const entry of Object.values(value)) {
      const text = pickText(entry);
      if (text) return text;
    }
  }
  return "";
}

function firstText(...values) {
  for (const value of values) {
    const text = pickText(value);
    if (text) return text;
  }
  return "";
}

function yearFrom(...values) {
  const date = firstText(...values);
  const match = date.match(/\d{4}/);
  return match ? match[0] : "";
}

function dateRange(from, to) {
  const start = firstText(from);
  const end = firstText(to);
  const normalizedEnd = end === "9999" ? "present" : end;
  if (start && normalizedEnd) return `${start} - ${normalizedEnd}`;
  return start || normalizedEnd || "";
}

function grantNumbers(item) {
  const identifiers = item.identifiers || {};
  return compact([
    ...asArray(identifiers.grant_number).map(pickText),
    ...asArray(identifiers.national_grant_number).map(pickText)
  ]);
}

function amountValue(value) {
  const text = pickText(value);
  return text ? Number(text) || text : "";
}

function normalizeContributionRoles(value) {
  return asArray(value).map(pickText).filter(Boolean);
}

function normalizeContributionRoleLabel(value) {
  const dictionary = {
    advisor: "advisor",
    appearance: "appearance",
    others: "other",
    peer_review: "peer review",
    planning_etc: "planning",
    panel_chair_etc: "organizing"
  };
  return dictionary[value] || String(value || "").replace(/_/g, " ");
}

function normalizedContributionRoles(value) {
  return normalizeContributionRoles(value).map(normalizeContributionRoleLabel);
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function localizedArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") {
    for (const lang of preferredLanguages) {
      if (Array.isArray(value[lang])) return value[lang];
    }
    for (const entry of Object.values(value)) {
      if (Array.isArray(entry)) return entry;
    }
  }
  return asArray(value);
}

function cleanArxivId(value) {
  const text = pickText(value)
    .replace(/^https?:\/\/arxiv\.org\/(abs|pdf)\//i, "")
    .replace(/^arxiv:/i, "")
    .replace(/\.pdf$/i, "")
    .trim();
  return text.replace(/v\d+$/i, "");
}

function normalizeDoi(value) {
  return pickText(value).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
}

function uniqueLinks(links) {
  const seen = new Set();
  return links.filter(([label, href]) => {
    if (!label || !href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function publicResearchmapUrl(url) {
  const text = pickText(url);
  if (!text.startsWith("http")) return "";
  const parsed = new URL(text);
  if (parsed.hostname === "api.researchmap.jp") return `https://researchmap.jp${parsed.pathname}`;
  return text;
}

function normalizeLink(label, href) {
  let cleanLabel = pickText(label) || "Link";
  let cleanHref = publicResearchmapUrl(href);
  if (!cleanHref) return null;
  cleanHref = cleanHref
    .replace(/^http:\/\/arxiv\.org\/abs\/arXiv:/i, "https://arxiv.org/abs/")
    .replace(/^http:\/\/arxiv\.org\/abs\//i, "https://arxiv.org/abs/")
    .replace(/^http:\/\/arxiv\.org\/pdf\/arXiv:/i, "https://arxiv.org/pdf/")
    .replace(/^http:\/\/arxiv\.org\/pdf\//i, "https://arxiv.org/pdf/");
  if (/^arxiv$/i.test(cleanLabel)) cleanLabel = "arXiv";
  if (/^kaken$/i.test(cleanLabel)) cleanLabel = "KAKEN";
  if (cleanLabel === "rm:research_project_id") cleanLabel = "Research project";
  if (cleanLabel === "rm:published_papers") cleanLabel = "Published paper";
  if (cleanLabel === "rm:misc") cleanLabel = "Misc";
  return [cleanLabel, cleanHref];
}

function itemUrl(item, achievementType) {
  const self = firstText(item["@id"], item._links?.self?.href);
  if (self.startsWith("http")) return publicResearchmapUrl(self);
  const achievementId = firstText(item["rm:achievement_id"], item.achievement_id, item.id);
  return achievementId ? `https://researchmap.jp/${permalink}/${achievementType}/${achievementId}` : "";
}

function linksFrom(item, achievementType) {
  const identifiers = item.identifiers || {};
  const doi = normalizeDoi(identifiers.doi || item.doi);
  const arxivId = cleanArxivId(identifiers.arxiv_id || item.arxiv_id);
  const seeAlso = asArray(item.see_also)
    .map((entry) => normalizeLink(firstText(entry.label, entry.name, entry["@type"], "Link"), firstText(entry["@id"], entry.url)))
    .filter(Boolean);
  return uniqueLinks([
    doi ? ["DOI", `https://doi.org/${doi}`] : null,
    arxivId ? ["arXiv", `https://arxiv.org/abs/${arxivId}`] : null,
    ...seeAlso,
    itemUrl(item, achievementType) ? ["researchmap", itemUrl(item, achievementType)] : null
  ].filter(Boolean));
}

function primaryLink(links, fallback) {
  const preferred = links.find(([label]) => /doi|arxiv/i.test(label)) || links[0];
  return preferred?.[1] || fallback || `https://researchmap.jp/${permalink}`;
}

function normalizePeople(records) {
  return compact(localizedArray(records).map((person) => firstText(person.name, person.full_name, person)));
}

function normalizePages(item) {
  const start = firstText(item.starting_page);
  const end = firstText(item.ending_page);
  if (start && end) return `${start}-${end}`;
  return start || end || "";
}

function normalizePaper(item) {
  const links = linksFrom(item, "published_papers");
  const venueParts = compact([
    firstText(item.publication_name, item.journal_title),
    firstText(item.volume) ? `vol. ${firstText(item.volume)}` : "",
    firstText(item.number) ? `no. ${firstText(item.number)}` : "",
    normalizePages(item)
  ]);
  return {
    title: firstText(item.paper_title, item.title),
    authors: normalizePeople(item.authors),
    venue: venueParts.join(", "),
    publicationDate: firstText(item.publication_date),
    year: yearFrom(item.publication_date),
    type: firstText(item.published_paper_type),
    openAccess: Boolean(item["rm:is_open_access"] || item.is_open_access),
    doi: normalizeDoi(item.identifiers?.doi || item.doi),
    arxivId: cleanArxivId(item.identifiers?.arxiv_id || item.arxiv_id),
    link: primaryLink(links, itemUrl(item, "published_papers")),
    links
  };
}

function normalizePresentation(item) {
  const links = linksFrom(item, "presentations");
  return {
    id: firstText(item["rm:id"], item.id),
    title: firstText(item.presentation_title, item.title),
    presenters: normalizePeople(item.presenters),
    event: firstText(item.event, item.event_title),
    location: firstText(item.location),
    date: firstText(item.publication_date, item.from_event_date),
    dateRange: dateRange(item.from_event_date, item.to_event_date),
    year: yearFrom(item.publication_date, item.from_event_date, item.to_event_date),
    type: firstText(item.presentation_type),
    invited: Boolean(item.invited),
    link: primaryLink(links, itemUrl(item, "presentations")),
    links
  };
}

function normalizeAward(item) {
  const links = linksFrom(item, "awards");
  return {
    title: firstText(item.award_name, item.title),
    association: firstText(item.association),
    date: firstText(item.award_date),
    year: yearFrom(item.award_date),
    description: firstText(item.description),
    link: primaryLink(links, itemUrl(item, "awards")),
    links
  };
}

function normalizeEducation(item) {
  const links = linksFrom(item, "education");
  return {
    affiliation: firstText(item.affiliation),
    department: firstText(item.department),
    course: firstText(item.course),
    period: dateRange(item.from_date, item.to_date),
    from: firstText(item.from_date),
    to: firstText(item.to_date),
    link: primaryLink(links, itemUrl(item, "education")),
    links
  };
}

function normalizeMisc(item) {
  const links = linksFrom(item, "misc");
  return {
    title: firstText(item.paper_title, item.misc_title, item.title),
    authors: normalizePeople(item.authors),
    venue: firstText(item.publication_name),
    publicationDate: firstText(item.publication_date),
    year: yearFrom(item.publication_date),
    link: primaryLink(links, itemUrl(item, "misc")),
    links
  };
}

function normalizeResearchProject(item) {
  const links = linksFrom(item, "research_projects");
  return {
    id: firstText(item["rm:id"], item.id),
    title: firstText(item.research_project_title, item.title),
    investigators: normalizePeople(item.investigators),
    organization: firstText(item.offer_organization),
    systemName: firstText(item.system_name),
    category: firstText(item.category),
    institution: firstText(item.institution_name),
    role: firstText(item.research_project_owner_role),
    period: dateRange(item.from_date, item.to_date),
    from: firstText(item.from_date),
    to: firstText(item.to_date) === "9999" ? "present" : firstText(item.to_date),
    grantNumbers: grantNumbers(item),
    overallGrantAmount: item.overall_grant_amount ? {
      totalCost: amountValue(item.overall_grant_amount.total_cost),
      directCost: amountValue(item.overall_grant_amount.direct_cost),
      indirectCost: amountValue(item.overall_grant_amount.indirect_cost)
    } : null,
    link: primaryLink(links, itemUrl(item, "research_projects")),
    links
  };
}

function normalizeAcademicContribution(item) {
  const links = linksFrom(item, "academic_contribution");
  return {
    id: firstText(item["rm:id"], item.id),
    title: firstText(item.academic_contribution_title, item.title),
    type: firstText(item.academic_contribution_type),
    roles: normalizedContributionRoles(item.academic_contribution_roles),
    promoter: firstText(item.promoter),
    event: firstText(item.event),
    period: dateRange(item.from_event_date, item.to_event_date),
    from: firstText(item.from_event_date),
    to: firstText(item.to_event_date) === "9999" ? "present" : firstText(item.to_event_date),
    year: yearFrom(item.from_event_date, item.to_event_date),
    link: primaryLink(links, itemUrl(item, "academic_contribution")),
    links
  };
}

function normalizeSocialContribution(item) {
  const links = linksFrom(item, "social_contribution");
  return {
    id: firstText(item["rm:id"], item.id),
    title: firstText(item.social_contribution_title, item.title),
    roles: normalizedContributionRoles(item.social_contribution_roles),
    promoter: firstText(item.promoter),
    event: firstText(item.event),
    period: dateRange(item.from_event_date, item.to_event_date),
    from: firstText(item.from_event_date),
    to: firstText(item.to_event_date) === "9999" ? "present" : firstText(item.to_event_date),
    year: yearFrom(item.from_event_date, item.to_event_date),
    link: primaryLink(links, itemUrl(item, "social_contribution")),
    links
  };
}

function graphItems(profile, type) {
  const graph = asArray(profile["@graph"]);
  return asArray(graph.find((entry) => entry["@type"] === type)?.items);
}

function normalizeProfile(profile) {
  const familyName = firstText(profile.family_name);
  const givenName = firstText(profile.given_name);
  const affiliation = asArray(profile.affiliations)[0] || {};
  return {
    permalink,
    name: firstText(profile.name, profile.names?.[0]?.name, profile.names) || compact([givenName, familyName]).join(" "),
    affiliation: firstText(profile.affiliation, affiliation.affiliation),
    position: firstText(profile.position, affiliation.position, affiliation.job),
    image: firstText(profile.image),
    modifiedAt: firstText(profile["rm:modified"], profile.modified),
    links: uniqueLinks([
      ["researchmap", `https://researchmap.jp/${permalink}`],
      ...asArray(profile.see_also).map((entry) => [firstText(entry.label, entry.name, "Link"), firstText(entry["@id"], entry.url)])
    ]),
    researchInterests: compact(graphItems(profile, "research_interests").map((item) => firstText(item.research_interest, item.keyword, item.name))),
    researchAreas: compact(
      graphItems(profile, "research_areas").map((item) =>
        firstText(item.research_keyword, item.research_field, item.discipline, item.research_area, item.name)
      )
    )
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
  });
  if (!response.ok) {
    throw new Error(`researchmap request failed: ${response.status} ${response.statusText} (${url})`);
  }
  return response.json();
}

async function fetchCollection(type) {
  const records = [];
  let url = `${baseUrl}/${permalink}/${type}?limit=100`;
  while (url) {
    const payload = await fetchJson(url);
    records.push(...asArray(payload.items));
    const next = firstText(payload._links?.next?.href);
    url = next ? new URL(next, baseUrl).href : "";
  }
  return records;
}

function escapeScriptJson(json) {
  return json.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

const profileRaw = await fetchJson(`${baseUrl}/${permalink}`);
const collections = Object.fromEntries(
  await Promise.all(
    achievementTypes.map(async (type) => {
      const records = await fetchCollection(type);
      return [type, records];
    })
  )
);

const profile = normalizeProfile(profileRaw);
const data = {
  source: {
    name: "researchmap",
    baseUrl,
    permalink,
    profileUrl: `https://researchmap.jp/${permalink}`,
    profileModifiedAt: profile.modifiedAt,
    credit: "Powered by researchmap"
  },
  profile,
  papers: collections.published_papers.map(normalizePaper).filter((item) => item.title),
  presentations: collections.presentations.map(normalizePresentation).filter((item) => item.title),
  awards: collections.awards.map(normalizeAward).filter((item) => item.title),
  education: collections.education.map(normalizeEducation).filter((item) => item.affiliation || item.department),
  misc: collections.misc.map(normalizeMisc).filter((item) => item.title),
  researchProjects: collections.research_projects.map(normalizeResearchProject).filter((item) => item.title),
  academicContributions: collections.academic_contribution.map(normalizeAcademicContribution).filter((item) => item.title),
  socialContributions: collections.social_contribution.map(normalizeSocialContribution).filter((item) => item.title)
};

await mkdir("data", { recursive: true });
const json = `${JSON.stringify(data, null, 2)}\n`;
await writeFile(outputJson, json);
await writeFile(
  outputScript,
  `window.researchmapData = ${escapeScriptJson(JSON.stringify(data, null, 2))};\n`
);

console.log(`Synced researchmap profile: ${data.source.profileUrl}`);
console.log(`Papers: ${data.papers.length}`);
console.log(`Presentations: ${data.presentations.length}`);
console.log(`Awards: ${data.awards.length}`);
console.log(`Education: ${data.education.length}`);
console.log(`Misc: ${data.misc.length}`);
console.log(`Research projects: ${data.researchProjects.length}`);
console.log(`Academic contributions: ${data.academicContributions.length}`);
console.log(`Social contributions: ${data.socialContributions.length}`);
console.log(`Wrote ${outputJson}`);
console.log(`Wrote ${outputScript}`);
