import { spawn } from "node:child_process";
import { mkdir, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = resolve(process.cwd(), "assets/web-apps");
const tempDir = await mkdtemp(resolve(tmpdir(), "homepage-web-app-thumbs-"));
const debugPort = 9237;

const apps = [
  ["genericalgoid", "https://genericalgoid-ryuyahora.vercel.app"],
  ["moser-worm", "https://results-fawn.vercel.app"],
  ["erdos-trapezoid-hunt", "https://erdos-game-ryuyahora.vercel.app"],
  ["adjunction-reboot", "https://adjunction-reboot-v2-ryuyahora.vercel.app/workbench"],
  ["cfg-monoid-game", "https://automaton-acceptance-game-cfg-monoi.vercel.app"]
];

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--no-sandbox",
  "--hide-scrollbars",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${tempDir}/chrome-profile`,
  "about:blank"
], { stdio: ["ignore", "ignore", "ignore"] });

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

async function waitForDebugEndpoint() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return;
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not become available.");
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

async function withTimeout(promise, ms) {
  return Promise.race([promise, delay(ms).then(() => null)]);
}

async function capture(slug, url) {
  const page = await createPage();
  try {
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    const loaded = page.once("Page.loadEventFired");
    await page.send("Page.navigate", { url });
    await withTimeout(loaded, 9000);
    await page.send("Runtime.evaluate", {
      expression: "window.scrollTo(0, 0); document.fonts && document.fonts.ready",
      awaitPromise: true
    }).catch(() => {});
    await delay(2500);
    const screenshot = await page.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false
    });
    await writeFile(resolve(outDir, `${slug}.png`), Buffer.from(screenshot.data, "base64"));
    console.log(`captured ${slug}`);
  } finally {
    page.close();
  }
}

try {
  await mkdir(outDir, { recursive: true });
  await waitForDebugEndpoint();
  for (const [slug, url] of apps) await capture(slug, url);
} finally {
  chrome.kill();
}
