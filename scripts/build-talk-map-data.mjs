import { readFileSync, writeFileSync } from "node:fs";

const [, , _coarseCountriesPath, detailedCountriesPath, outputPath = "data/talk-map.generated.js"] = process.argv;

if (!_coarseCountriesPath || !detailedCountriesPath) {
  throw new Error("Usage: node scripts/build-talk-map-data.mjs <natural-earth-50m-countries> <natural-earth-10m-countries> [output]");
}

const detailedWorld = JSON.parse(readFileSync(detailedCountriesPath, "utf8"));

function buildProjection(config) {
  const projection = { ...config };
  const availableWidth = projection.width - projection.margin * 2;
  const availableHeight = projection.height - projection.margin * 2;
  const scale = Math.min(
    availableWidth / (projection.maxLon - projection.minLon),
    availableHeight / (projection.maxLat - projection.minLat)
  );
  projection.scale = Number(scale.toFixed(6));
  projection.offsetX = Number(
    (projection.margin + (availableWidth - (projection.maxLon - projection.minLon) * scale) / 2).toFixed(6)
  );
  projection.offsetY = Number(
    (projection.margin + (availableHeight - (projection.maxLat - projection.minLat) * scale) / 2).toFixed(6)
  );
  return projection;
}

const europeProjection = buildProjection({
  width: 560,
  height: 440,
  minLon: -12,
  maxLon: 32,
  minLat: 35,
  maxLat: 72,
  margin: 22
});

const japanProjection = buildProjection({
  width: 360,
  height: 520,
  minLon: 122,
  maxLon: 146,
  minLat: 24,
  maxLat: 46,
  margin: 18
});

function formatNumber(value) {
  return Number(value.toFixed(1)).toString();
}

function projectByBounds(projection, [lon, lat]) {
  return [
    projection.offsetX + (lon - projection.minLon) * projection.scale,
    projection.offsetY + (projection.maxLat - lat) * projection.scale
  ];
}

function distanceToSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  const x = start[0] + t * dx;
  const y = start[1] + t * dy;
  return Math.hypot(point[0] - x, point[1] - y);
}

function simplifyRing(points, tolerance) {
  if (points.length <= 3) return points;
  let maxDistance = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = distanceToSegment(points[i], start, end);
    if (distance > maxDistance) {
      index = i;
      maxDistance = distance;
    }
  }
  if (maxDistance <= tolerance) return [start, end];
  const left = simplifyRing(points.slice(0, index + 1), tolerance);
  const right = simplifyRing(points.slice(index), tolerance);
  return left.slice(0, -1).concat(right);
}

function ringArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function normalizeRing(ring, project, tolerance, minArea) {
  const projected = ring.map(project);
  const deduped = projected.filter((point, index) => {
    if (index === 0) return true;
    const previous = projected[index - 1];
    return Math.hypot(point[0] - previous[0], point[1] - previous[1]) > 0.08;
  });
  if (deduped.length < 3 || ringArea(deduped) < minArea) return "";
  const simplified = simplifyRing(deduped, tolerance);
  if (simplified.length < 3) return "";
  const commands = simplified.map(([x, y], index) => `${index === 0 ? "M" : "L"}${formatNumber(x)} ${formatNumber(y)}`);
  return `${commands.join("")}Z`;
}

function geometryToPath(geometry, project, tolerance, minArea) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons
    .flatMap((polygon) => polygon.map((ring) => normalizeRing(ring, project, tolerance, minArea)))
    .filter(Boolean)
    .join("");
}

function isEuropeanFeature(feature) {
  return feature.properties.CONTINENT === "Europe";
}

const europePaths = detailedWorld.features
  .filter(isEuropeanFeature)
  .map((feature) => ({
    id: feature.properties.ADM0_A3 || feature.properties.ISO_A3 || feature.properties.NAME,
    name: feature.properties.NAME || feature.properties.ADMIN,
    continent: feature.properties.CONTINENT || "",
    d: geometryToPath(feature.geometry, (point) => projectByBounds(europeProjection, point), 0.2, 0.12)
  }))
  .filter((feature) => feature.d);

if (!europePaths.length) throw new Error("Europe features not found.");

const japanFeature = detailedWorld.features.find((feature) => feature.properties.ADM0_A3 === "JPN" || feature.properties.ISO_A3 === "JPN");
if (!japanFeature) throw new Error("Japan feature not found.");

const talkMapData = {
  source: {
    name: "Natural Earth",
    terms: "https://www.naturalearthdata.com/about/terms-of-use/",
    note: "Made with Natural Earth. Public domain vector data.",
    europeDataset: "ne_10m_admin_0_countries",
    japanDataset: "ne_10m_admin_0_countries"
  },
  europe: {
    viewBox: `0 0 ${europeProjection.width} ${europeProjection.height}`,
    projection: europeProjection,
    paths: europePaths
  },
  japan: {
    viewBox: `0 0 ${japanProjection.width} ${japanProjection.height}`,
    projection: japanProjection,
    paths: [
      {
        id: "JPN",
        name: "Japan",
        d: geometryToPath(japanFeature.geometry, (point) => projectByBounds(japanProjection, point), 0.13, 0.08)
      }
    ]
  }
};

writeFileSync(
  outputPath,
  `// Generated by scripts/build-talk-map-data.mjs from Natural Earth public domain data.\n` +
    `// Source terms: ${talkMapData.source.terms}\n` +
    `globalThis.talkMapData = ${JSON.stringify(talkMapData)};\n`
);
