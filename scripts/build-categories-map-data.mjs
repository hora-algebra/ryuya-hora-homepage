import { readFileSync, writeFileSync } from "node:fs";

const [, , admin1Path, outputPath = "data/categories-map.generated.js"] = process.argv;

if (!admin1Path) {
  throw new Error("Usage: node scripts/build-categories-map-data.mjs <natural-earth-admin-1-geojson> [output]");
}

const world = JSON.parse(readFileSync(admin1Path, "utf8"));

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

const japanProjection = buildProjection({
  width: 430,
  height: 360,
  minLon: 122,
  maxLon: 146,
  minLat: 24,
  maxLat: 46,
  margin: 14
});

const kantoProjection = buildProjection({
  width: 260,
  height: 220,
  minLon: 138.45,
  maxLon: 141.1,
  minLat: 34.85,
  maxLat: 36.85,
  margin: 16
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

function ringInsideBounds(ring, projection) {
  if (!projection) return true;
  const lons = ring.map(([lon]) => lon);
  const lats = ring.map(([, lat]) => lat);
  return (
    Math.max(...lons) >= projection.minLon &&
    Math.min(...lons) <= projection.maxLon &&
    Math.max(...lats) >= projection.minLat &&
    Math.min(...lats) <= projection.maxLat
  );
}

function geometryToPath(geometry, project, tolerance, minArea, boundsProjection = null) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons
    .flatMap((polygon) =>
      polygon
        .filter((ring) => ringInsideBounds(ring, boundsProjection))
        .map((ring) => normalizeRing(ring, project, tolerance, minArea))
    )
    .filter(Boolean)
    .join("");
}

function pointFor(projection, lon, lat) {
  const [x, y] = projectByBounds(projection, [lon, lat]);
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function japanFeature(feature) {
  const properties = feature.properties || {};
  return properties.adm0_a3 === "JPN" || properties.admin === "Japan" || properties.iso_a2 === "JP";
}

const prefectures = world.features
  .filter(japanFeature)
  .map((feature) => {
    const properties = feature.properties || {};
    const name = properties.name || String(properties.name_en || "").replace(/\s+(Prefecture|Metropolis)$/i, "");
    return {
      id: properties.iso_3166_2 || properties.adm1_code || properties.name,
      name,
      nameJa: properties.name_ja || properties.name_local || "",
      region: properties.region || "",
      isTokyo: properties.name === "Tokyo" || properties.iso_3166_2 === "JP-13",
      d: geometryToPath(feature.geometry, (point) => projectByBounds(japanProjection, point), 0.14, 0.18),
      kantoD: geometryToPath(feature.geometry, (point) => projectByBounds(kantoProjection, point), 0.12, 0.14, kantoProjection)
    };
  })
  .filter((feature) => feature.d);

if (prefectures.length < 40) throw new Error("Japan prefecture features not found.");
if (!prefectures.some((feature) => feature.isTokyo)) throw new Error("Tokyo feature not found.");

const kantoNames = new Set(["Tokyo", "Kanagawa", "Saitama", "Chiba", "Ibaraki", "Tochigi", "Gunma", "Yamanashi"]);
const categoriesMapData = {
  source: {
    name: "Natural Earth",
    terms: "https://www.naturalearthdata.com/about/terms-of-use/",
    note: "Made with Natural Earth. Public domain vector data.",
    dataset: "ne_10m_admin_1_states_provinces",
    downloadedFrom: "https://github.com/nvkelso/natural-earth-vector"
  },
  japan: {
    viewBox: `0 0 ${japanProjection.width} ${japanProjection.height}`,
    projection: japanProjection,
    tokyoPoint: pointFor(japanProjection, 139.767, 35.681),
    prefectures: prefectures.map(({ kantoD, ...feature }) => feature)
  },
  kanto: {
    viewBox: `0 0 ${kantoProjection.width} ${kantoProjection.height}`,
    projection: kantoProjection,
    tokyoPoint: pointFor(kantoProjection, 139.767, 35.681),
    prefectures: prefectures
      .filter((feature) => kantoNames.has(feature.name) && feature.kantoD)
      .map((feature) => ({
        id: feature.id,
        name: feature.name,
        nameJa: feature.nameJa,
        region: feature.region,
        isTokyo: feature.isTokyo,
        d: feature.kantoD
      }))
  }
};

writeFileSync(
  outputPath,
  `// Generated by scripts/build-categories-map-data.mjs from Natural Earth public domain data.\n` +
    `// Source terms: ${categoriesMapData.source.terms}\n` +
    `globalThis.categoriesMapData = ${JSON.stringify(categoriesMapData)};\n`
);
