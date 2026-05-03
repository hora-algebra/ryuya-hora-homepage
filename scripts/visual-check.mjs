import { spawn } from "node:child_process";
import { access, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = await mkdtemp(resolve(tmpdir(), "homepage-visual-check-"));
const debugPort = Number(process.env.VISUAL_CHECK_CDP_PORT || 9300 + Math.floor(Math.random() * 600));

const pages = [
  ["home", "index.html"],
  ["profile", "profile/index.html"],
  ["works", "works/index.html"],
  ["documents", "documents/index.html"],
  ["others", "others/index.html"],
  ["papers", "papers/index.html"],
  ["talks", "talks/index.html"],
  ["notes", "notes/index.html"],
  ["slides", "slides/index.html"],
  ["activities", "activities/index.html"],
  ["cv", "cv/index.html"],
  ["problems", "problems/index.html"],
  ["links", "links/index.html"],
  ["web-apps", "web-apps/index.html"],
  ["search", "search/index.html"]
];

const viewports = [
  ["minimum-mobile", 320, 568],
  ["small-mobile", 360, 740],
  ["mobile", 390, 844],
  ["large-mobile", 430, 932],
  ["small-mobile-landscape", 667, 375],
  ["mobile-landscape", 844, 390],
  ["large-mobile-landscape", 932, 430],
  ["tablet", 820, 1180],
  ["tablet-landscape", 1024, 768],
  ["ipad-pro", 1024, 1366],
  ["laptop", 1280, 720],
  ["short-desktop", 1440, 760],
  ["desktop", 1440, 1000],
  ["wide-desktop", 1728, 1117],
  ["full-hd", 1920, 1080],
  ["wide-short", 1920, 540],
  ["ultrawide", 2560, 1080],
  ["curved-ultrawide", 3440, 1440],
  ["super-ultrawide", 5120, 1440]
];

const languages = [
  ["en", ""],
  ["ja", "?lang=ja"]
];

function filterByEnv(items, envName) {
  const value = process.env[envName];
  if (!value) return items;
  const allowed = new Set(value.split(",").map((item) => item.trim()).filter(Boolean));
  return items.filter(([name]) => allowed.has(name));
}

const selectedPages = filterByEnv(pages, "VISUAL_CHECK_PAGES");
const selectedViewports = filterByEnv(viewports, "VISUAL_CHECK_VIEWPORTS");
const selectedLanguages = filterByEnv(languages, "VISUAL_CHECK_LANGUAGES");
const shouldCaptureScreenshots = process.env.VISUAL_CHECK_SCREENSHOTS !== "0";

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function appendLimited(current, chunk, limit = 6000) {
  const next = `${current}${chunk}`;
  return next.length > limit ? next.slice(next.length - limit) : next;
}

async function canAccess(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function browserCandidates() {
  const candidates = [
    process.env.VISUAL_CHECK_BROWSER,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
  ].filter(Boolean);
  const unique = [...new Set(candidates)];
  const available = [];
  for (const candidate of unique) {
    if (await canAccess(candidate)) available.push(candidate);
  }
  return available;
}

function headlessArgument(mode) {
  if (mode === "plain") return "--headless";
  return `--headless=${mode}`;
}

async function waitForDebugEndpoint(diagnostics) {
  const diagnosticTail = () => [
    diagnostics.stderr ? `stderr=${diagnostics.stderr.trim()}` : "",
    diagnostics.stdout ? `stdout=${diagnostics.stdout.trim()}` : ""
  ].filter(Boolean).join("\n");
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (diagnostics.exitCode !== null || diagnostics.signal !== null) {
      const output = diagnosticTail();
      throw new Error(`Browser exited before CDP was ready: code=${diagnostics.exitCode}, signal=${diagnostics.signal}${output ? `\n${output}` : ""}`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return;
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  const output = diagnosticTail();
  throw new Error(`Chrome DevTools endpoint did not become available.${output ? `\n${output}` : ""}`);
}

async function launchChrome() {
  const candidates = await browserCandidates();
  if (!candidates.length) {
    throw new Error("No accessible Chromium-family browser was found. Set VISUAL_CHECK_BROWSER to an executable path.");
  }

  const modes = process.env.VISUAL_CHECK_HEADLESS_MODE
    ? [process.env.VISUAL_CHECK_HEADLESS_MODE]
    : ["new", "chrome", "plain"];
  const argumentProfiles = [
    {
      name: "full",
      args: ["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"]
    },
    {
      name: "minimal",
      args: []
    }
  ];
  const errors = [];

  for (const candidate of candidates) {
    for (const mode of modes) {
      for (const profile of argumentProfiles) {
        const diagnostics = {
          path: candidate,
          mode,
          profile: profile.name,
          stdout: "",
          stderr: "",
          exitCode: null,
          signal: null
        };
        const chrome = spawn(candidate, [
          headlessArgument(mode),
          ...profile.args,
          "--no-first-run",
          "--no-default-browser-check",
          `--remote-debugging-port=${debugPort}`,
          `--user-data-dir=${outDir}/chrome-profile-${mode.replace(/\W+/g, "-")}-${profile.name}`,
          "about:blank"
        ], { stdio: ["ignore", "pipe", "pipe"] });

        chrome.stdout.on("data", (chunk) => {
          diagnostics.stdout = appendLimited(diagnostics.stdout, chunk);
        });
        chrome.stderr.on("data", (chunk) => {
          diagnostics.stderr = appendLimited(diagnostics.stderr, chunk);
        });
        chrome.on("exit", (code, signal) => {
          diagnostics.exitCode = code;
          diagnostics.signal = signal;
        });

        try {
          await waitForDebugEndpoint(diagnostics);
          return { chrome, diagnostics };
        } catch (error) {
          if (diagnostics.exitCode === null && diagnostics.signal === null) chrome.kill("SIGTERM");
          errors.push({
            path: candidate,
            mode,
            profile: profile.name,
            message: error.message,
            exitCode: diagnostics.exitCode,
            signal: diagnostics.signal,
            stdout: diagnostics.stdout,
            stderr: diagnostics.stderr
          });
          await delay(200);
        }
      }
    }
  }

  const summary = errors.map((error) =>
    [
      `${error.path} (${error.mode}/${error.profile})`,
      `message=${error.message}`,
      `exit=${error.exitCode ?? ""}`,
      `signal=${error.signal ?? ""}`,
      error.stderr ? `stderr=${error.stderr.trim()}` : "",
      error.stdout ? `stdout=${error.stdout.trim()}` : ""
    ].filter(Boolean).join("\n")
  ).join("\n\n");
  throw new Error(`No browser candidate exposed a Chrome DevTools endpoint.\n\n${summary}`);
}

class Cdp {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
    this.ws = new WebSocket(wsUrl);
    this.ready = new Promise((resolveReady, rejectReady) => {
      this.ws.addEventListener("open", resolveReady, { once: true });
      this.ws.addEventListener("error", rejectReady, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolveMessage, rejectMessage } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) rejectMessage(new Error(message.error.message));
        else resolveMessage(message.result);
        return;
      }
      if (message.method && this.events.has(message.method)) {
        this.events.get(message.method).forEach((listener) => listener(message.params || {}));
      }
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId;
    this.nextId += 1;
    const promise = new Promise((resolveMessage, rejectMessage) => {
      this.pending.set(id, { resolveMessage, rejectMessage });
    });
    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  once(method) {
    return new Promise((resolveEvent) => {
      const listener = (params) => {
        const listeners = this.events.get(method) || [];
        this.events.set(method, listeners.filter((item) => item !== listener));
        resolveEvent(params);
      };
      this.events.set(method, [...(this.events.get(method) || []), listener]);
    });
  }

  close() {
    this.ws.close();
  }
}

async function createPage() {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Failed to create CDP page: ${response.status}`);
  const target = await response.json();
  return new Cdp(target.webSocketDebuggerUrl);
}

function pageUrl(relativePath, languageQuery) {
  const url = pathToFileURL(resolve(root, relativePath));
  url.search = languageQuery;
  return url.href;
}

const measureScript = String.raw`(() => {
  const visible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 1 && rect.height > 1;
  };
  const rectOf = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      x: Math.round(rect.x * 10) / 10,
      y: Math.round(rect.y * 10) / 10,
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      right: Math.round(rect.right * 10) / 10,
      bottom: Math.round(rect.bottom * 10) / 10
    };
  };
  const labelOf = (el) => {
    const text = (el.innerText || el.textContent || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
    const id = el.id ? "#" + el.id : "";
    const classes = [...el.classList].slice(0, 3).map((name) => "." + name).join("");
    return el.tagName.toLowerCase() + id + classes + (text ? ' "' + text.slice(0, 80) + '"' : "");
  };
  const issues = [];
  const all = [...document.querySelectorAll("body *")].filter(visible);

  const viewportWidth = document.documentElement.clientWidth;
  const pageWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (location.href.startsWith("chrome-error://")) {
    issues.push({ type: "navigation-error", detail: document.title || location.href });
  }
  if (pageWidth > viewportWidth + 2) {
    issues.push({ type: "horizontal-overflow", detail: "page width " + pageWidth + ", viewport " + viewportWidth });
  }

  [...document.querySelectorAll("img")].filter(visible).forEach((image) => {
    if (image.complete && (image.naturalWidth === 0 || image.naturalHeight === 0)) {
      issues.push({ type: "broken-image", element: labelOf(image), rect: rectOf(image), src: image.currentSrc || image.src });
    }
  });

  const overflowSelectors = [
    ".site-nav", ".language-toggle", ".tab-button", ".timeline-control", ".action-link",
    ".publication-figure", ".publication-title", ".publication-meta span", ".note-thumbnail",
    ".note-thumb-body", ".note-thumb-title", ".note-meta span", ".problem-card",
    ".problem-feature", ".talk-timeline", ".talk-timeline-card", ".talk-timeline-track",
    ".timeline-scroll-frame", ".home-timeline", ".home-timeline-track", ".home-timeline-lane", ".home-timeline-paper-span", ".home-timeline-node",
    ".theme-graph", ".theme-result", ".categories-tokyo-map", ".categories-map-svg",
    ".explore-card", ".plan-item", ".speculative-post",
    ".web-app-card", ".web-app-media", ".web-app-body",
    ".speculative-sidebar",
    ".problem-comments", ".problem-comment-setup"
  ].join(",");

  [...document.querySelectorAll(overflowSelectors)].filter(visible).forEach((el) => {
    const style = getComputedStyle(el);
    if (style.overflowX !== "visible" || style.overflowY !== "visible") return;
    if (el.scrollWidth > el.clientWidth + 3 || el.scrollHeight > el.clientHeight + 3) {
      issues.push({
        type: "element-overflow",
        element: labelOf(el),
        rect: rectOf(el),
        detail: "scroll " + el.scrollWidth + "x" + el.scrollHeight + ", client " + el.clientWidth + "x" + el.clientHeight
      });
    }
  });

  [...document.querySelectorAll(".home-timeline-track, .talk-timeline-track")].filter(visible).forEach((track) => {
    const frame = track.closest(".timeline-scroll-frame");
    const minReadableWidth = track.classList.contains("talk-timeline-track") ? 620 : 640;
    if (track.clientWidth < minReadableWidth && (!frame || frame.scrollWidth <= frame.clientWidth + 4)) {
      issues.push({
        type: "timeline-compressed",
        element: labelOf(track),
        rect: rectOf(track),
        detail: "timeline width " + track.clientWidth + " below readable threshold " + minReadableWidth
      });
    }
  });

  [...document.querySelectorAll(".figure-math, .note-thumb-body, .publication-figure svg, .theme-graph svg")].filter(visible).forEach((el) => {
    const parent = el.closest(".publication-figure, .note-thumbnail, .theme-graph, .research-figure");
    if (!parent) return;
    const rect = el.getBoundingClientRect();
    const box = parent.getBoundingClientRect();
    const outside = rect.left < box.left - 2 || rect.top < box.top - 2 || rect.right > box.right + 2 || rect.bottom > box.bottom + 2;
    if (outside) {
      issues.push({ type: "figure-child-outside", element: labelOf(el), parent: labelOf(parent), rect: rectOf(el), parentRect: rectOf(parent) });
    }
  });

  const important = all.filter((el) => el.matches([
    ".site-nav a", ".language-toggle", ".hero-copy h1", ".lead", ".section-head h2",
    ".publication-title h3", ".publication-summary", ".publication-meta span", ".action-link",
    ".figure-math", ".talk-timeline-card", ".talk-timeline-node", ".talk-year-tick",
    ".home-timeline-lane-label", ".home-year-tick",
    ".categories-map-label",
    ".note-thumb-body", ".note-item h3", ".note-meta span", ".problem-card h3",
    ".problem-card-statement", ".problem-feature h2", ".problem-statement",
    ".problem-comments-title", ".problem-comments-note", ".problem-comment-setup",
    ".web-app-title", ".web-app-summary", ".web-app-tag",
    ".speculative-post h2", ".speculative-abstract"
  ].join(",")));

  const intersects = (a, b) => {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const x = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
    const y = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
    return { area: x * y, x, y, ra, rb };
  };

  for (let i = 0; i < important.length; i += 1) {
    for (let j = i + 1; j < important.length; j += 1) {
      const a = important[i];
      const b = important[j];
      if (a.contains(b) || b.contains(a)) continue;
      if (a.closest(".site-nav") && b.closest(".site-nav")) continue;
      if (a.closest(".publication-meta") && b.closest(".publication-meta")) continue;
      if (a.closest(".note-meta") && b.closest(".note-meta")) continue;
      if (a.closest(".action-links") && b.closest(".action-links")) continue;
      if (a.closest(".talk-timeline-track") && b.closest(".talk-timeline-track")) continue;
      if (a.closest(".home-timeline-track") && b.closest(".home-timeline-track")) continue;
      if (a.closest(".publication-figure") && b.closest(".publication-figure")) continue;
      const hit = intersects(a, b);
      if (hit.area > 24 && hit.x > 3 && hit.y > 3) {
        issues.push({
          type: "possible-overlap",
          a: labelOf(a),
          b: labelOf(b),
          aRect: rectOf(a),
          bRect: rectOf(b),
          area: Math.round(hit.area)
        });
      }
    }
  }

  const boxes = {};
  [
    ["publicationFigures", ".publication-figure"],
    ["figureMath", ".figure-math"],
    ["themeGraphs", ".theme-graph"],
    ["talkTimeline", ".talk-timeline"],
    ["categoriesMap", ".categories-map-svg"],
    ["noteThumbnails", ".note-thumbnail"],
    ["problemFeature", ".problem-feature"],
    ["researchFigure", ".research-figure"],
    ["languageToggles", ".language-toggle"]
  ].forEach(([key, selector]) => {
    boxes[key] = [...document.querySelectorAll(selector)].filter(visible).length;
  });

  return {
    url: location.href,
    title: document.title,
    bodyTextLength: document.body.innerText.trim().length,
    viewport: { width: innerWidth, height: innerHeight },
    page: { width: pageWidth, height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) },
    boxes,
    issues: issues.slice(0, 80)
  };
})()`;

const results = [];
let cdp;
let chrome;
let browserDiagnostics = null;
let fatalError = null;

try {
  const launched = await launchChrome();
  chrome = launched.chrome;
  browserDiagnostics = launched.diagnostics;
  cdp = await createPage();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  for (const [pageName, relativePath] of selectedPages) {
    for (const [viewportName, width, height] of selectedViewports) {
      for (const [language, query] of selectedLanguages) {
        await cdp.send("Emulation.setDeviceMetricsOverride", {
          width,
          height,
          deviceScaleFactor: 1,
          mobile: /mobile|phone/.test(viewportName)
        });
        const url = pageUrl(relativePath, query);
        const load = cdp.once("Page.loadEventFired");
        await cdp.send("Page.navigate", { url });
        await load;
        await delay(900);
        await cdp.send("Runtime.evaluate", {
          expression: "document.fonts?.ready ? document.fonts.ready.then(() => true) : true",
          awaitPromise: true
        });
        await delay(150);
        const evaluation = await cdp.send("Runtime.evaluate", {
          expression: measureScript,
          returnByValue: true
        });
        const data = evaluation.result.value;
        data.pageName = pageName;
        data.viewportName = viewportName;
        data.language = language;
        results.push(data);

        if (shouldCaptureScreenshots) {
          const screenshot = await cdp.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: false
          });
          const shotPath = `${outDir}/${pageName}-${viewportName}-${language}.png`;
          await writeFile(shotPath, Buffer.from(screenshot.data, "base64"));
          data.screenshot = shotPath;
        }
      }
    }
  }
} catch (error) {
  fatalError = error;
} finally {
  if (cdp) cdp.close();
  if (chrome && browserDiagnostics?.exitCode === null && browserDiagnostics?.signal === null) chrome.kill("SIGTERM");
}

const report = {
  outDir,
  checkedAt: new Date().toISOString(),
  total: results.length,
  failures: results.filter((result) => result.issues.length),
  results,
  browser: browserDiagnostics
};

if (fatalError) {
  report.error = {
    message: fatalError.message,
    stack: fatalError.stack
  };
}

await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));

console.log(`Output: ${outDir}`);
console.log(`Checked: ${results.length}`);
if (fatalError) {
  console.error(`Visual check failed: ${fatalError.message}`);
  console.error(`Diagnostics written to ${outDir}/report.json`);
  process.exitCode = 1;
}
const failures = results.filter((result) => result.issues.length);
console.log(`With issues: ${failures.length}`);
failures.forEach((result) => {
  console.log(`\n${result.pageName} ${result.viewportName} ${result.language}`);
  result.issues.slice(0, 12).forEach((issue) => {
    console.log(`- ${issue.type}: ${issue.element || issue.a || issue.detail || ""}${issue.b ? ` <> ${issue.b}` : ""}`);
  });
});
