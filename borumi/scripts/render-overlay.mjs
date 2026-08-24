#!/usr/bin/env node

/**
 * Render a portable MEG Borumi overlay.
 *
 * The input is data-only JSON.  The renderer writes an SVG in a temporary
 * directory and asks the macOS-native sips utility to rasterise it.  No
 * network, shell interpolation or runtime font download is used.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const ASSET_DIR = path.join(REPO_ROOT, "scripts", "gen-layouts", "assets");
const BUNDLED_FONT = path.join(REPO_ROOT, "borumi", "assets", "fonts", "ClashGrotesk-Variable.ttf");
const LOGO_FILE = path.join(ASSET_DIR, "meg-logo-dark.png");

const PALETTE = Object.freeze({
  cream: "#FFFCD6",
  softCream: "#FFF3AE",
  ink: "#2F2C00",
  olive: "#5C4F1C",
  gold: "#B9AA02",
  violet: "#8F8DE0",
});

const FORMATS = Object.freeze({
  reel: {width: 1080, height: 1920, margin: 56, chromeHeight: 92},
  youtube: {width: 1920, height: 1080, margin: 64, chromeHeight: 74},
});

const TYPES = new Set(["brand-chrome", "steps", "proof-chrome"]);
const MAX_JSON_BYTES = 128 * 1024;
const MAX_OUTPUT_PATH = 1024;
const MAX_LABEL_LENGTH = 64;
const MAX_STEP_LENGTH = 100;

function usage() {
  return [
    "Usage: node borumi/scripts/render-overlay.mjs --input /chemin/overlay.json [--output /chemin/overlay.png]",
    "       node borumi/scripts/render-overlay.mjs --json '{\"format\":\"reel\",\"type\":\"brand-chrome\",\"label\":\"MEG\"}' --output /tmp/overlay.png",
    "       node borumi/scripts/render-overlay.mjs --stdin --output /tmp/overlay.png",
    "",
    "JSON requis : format reel|youtube, type brand-chrome|steps|proof-chrome.",
    "steps exige exactement 5, 6 ou 7 entrées dans steps (ou items).",
  ].join("\n");
}

function fail(message) {
  throw new Error(message);
}

function readBoundedFile(file, description) {
  let stat;
  try {
    stat = fs.statSync(file);
  } catch (error) {
    fail(`${description} introuvable ou illisible : ${error.message}`);
  }
  if (!stat.isFile()) fail(`${description} doit être un fichier régulier : ${file}`);
  if (stat.size > MAX_JSON_BYTES) {
    fail(`${description} trop volumineux (${stat.size} octets ; maximum ${MAX_JSON_BYTES}).`);
  }
  return fs.readFileSync(file, "utf8");
}

function parseCli(argv) {
  let source = null;
  let sourceKind = null;
  let outputOverride = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (arg === "--input" || arg === "--json" || arg === "--output") {
      const value = argv[index + 1];
      if (value == null || value.startsWith("--")) fail(`Valeur manquante pour ${arg}.\n${usage()}`);
      if (arg === "--output") {
        if (outputOverride != null) fail("--output ne peut être fourni qu’une seule fois.");
        outputOverride = value;
      } else {
        if (source != null) fail("Fournissez une seule source JSON : --input, --json ou --stdin.");
        sourceKind = arg;
        source = arg === "--input" ? readBoundedFile(path.resolve(value), "Fichier JSON") : value;
        if (Buffer.byteLength(source, "utf8") > MAX_JSON_BYTES) {
          fail(`JSON trop volumineux (maximum ${MAX_JSON_BYTES} octets).`);
        }
      }
      index += 1;
      continue;
    }
    if (arg === "--stdin") {
      if (source != null) fail("Fournissez une seule source JSON : --input, --json ou --stdin.");
      sourceKind = arg;
      source = fs.readFileSync(0, "utf8");
      if (Buffer.byteLength(source, "utf8") > MAX_JSON_BYTES) {
        fail(`JSON stdin trop volumineux (maximum ${MAX_JSON_BYTES} octets).`);
      }
      continue;
    }
    fail(`Option inconnue : ${arg}.\n${usage()}`);
  }

  if (source == null) fail(`Une source JSON est obligatoire (--input, --json ou --stdin).\n${usage()}`);
  let raw;
  try {
    raw = JSON.parse(source);
  } catch (error) {
    fail(`JSON invalide (${sourceKind}) : ${error.message}`);
  }
  return normalizeInput(raw, outputOverride);
}

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function checkString(value, field, maxLength, {allowEmpty = false} = {}) {
  if (typeof value !== "string") fail(`${field} doit être une chaîne de caractères.`);
  if (!allowEmpty && !value.trim()) fail(`${field} ne peut pas être vide.`);
  if (value.length > maxLength) fail(`${field} dépasse ${maxLength} caractères.`);
  if (/[\u0000-\u001f\u007f]/.test(value)) fail(`${field} contient un caractère de contrôle interdit.`);
  return value.trim();
}

function normalizeOutput(value) {
  const output = checkString(value, "output", MAX_OUTPUT_PATH);
  if (!output.toLowerCase().endsWith(".png")) fail("output doit désigner un fichier .png.");
  return path.resolve(output);
}

function normalizeStep(item, index) {
  let text = item;
  let active = false;
  if (isPlainObject(item)) {
    text = item.text ?? item.label ?? item.title;
    if (item.active != null) {
      if (typeof item.active !== "boolean") fail(`steps[${index}].active doit être booléen.`);
      active = item.active;
    }
  }
  return {text: checkString(text, `steps[${index}]`, MAX_STEP_LENGTH), active};
}

function normalizeInput(raw, outputOverride) {
  if (!isPlainObject(raw)) fail("L’entrée JSON doit être un objet.");
  const format = typeof raw.format === "string" ? raw.format.toLowerCase() : raw.format;
  if (!Object.hasOwn(FORMATS, format)) fail("format doit être reel ou youtube.");
  const type = typeof raw.type === "string" ? raw.type.toLowerCase() : raw.type;
  if (!TYPES.has(type)) fail("type doit être brand-chrome, steps ou proof-chrome.");

  const output = normalizeOutput(outputOverride ?? raw.output);
  const labelValue = raw.label ?? raw.cartouche ?? raw.heading ?? raw.title;
  const defaultLabel = type === "proof-chrome" ? "PREUVE" : type === "steps" ? "ÉTAPES" : "MEG";
  const label = checkString(labelValue ?? defaultLabel, "label", MAX_LABEL_LENGTH);

  const result = {format, type, output, label};
  if (type === "steps") {
    const rawSteps = raw.steps ?? raw.items;
    if (!Array.isArray(rawSteps)) fail("steps exige un tableau de 5, 6 ou 7 entrées.");
    if (![5, 6, 7].includes(rawSteps.length)) fail(`steps exige exactement 5, 6 ou 7 entrées (reçu ${rawSteps.length}).`);
    const steps = rawSteps.map(normalizeStep);
    const activeFlags = steps.reduce((count, step) => count + (step.active ? 1 : 0), 0);
    const explicitIndex = raw.activeIndex ?? (Number.isInteger(raw.active) ? raw.active : null);
    if (explicitIndex != null) {
      if (!Number.isInteger(explicitIndex) || explicitIndex < 0 || explicitIndex >= steps.length) {
        fail(`activeIndex doit être un entier entre 0 et ${steps.length - 1}.`);
      }
      if (activeFlags > 0) fail("Choisissez activeIndex ou steps[].active, pas les deux.");
      steps[explicitIndex].active = true;
    } else if (activeFlags > 1) {
      fail("Une seule étape peut être active.");
    }
    result.steps = steps;
    result.activeIndex = steps.findIndex((step) => step.active);
  }
  return result;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function number(value) {
  return Number(value.toFixed(3));
}

function characterWidthFactor(character) {
  if (character === " ") return 0.31;
  if ("ilIjtfr|!.,:;'·".includes(character)) return 0.27;
  if ("mwMW@%&".includes(character)) return 0.88;
  if ("()[]{}".includes(character)) return 0.4;
  if ("ABCDEFGHKNOPQRSTUVXYZ".includes(character)) return 0.66;
  if ("0123456789".includes(character)) return 0.58;
  return 0.56;
}

function estimateTextWidth(text, fontSize) {
  const base = [...text].reduce((sum, character) => sum + characterWidthFactor(character), 0);
  const tracking = Math.max(0, [...text].length - 1) * fontSize * 0.006;
  return base * fontSize + tracking;
}

function fitFontSize(text, maxWidth, initial, minimum = 12) {
  let fontSize = initial;
  while (fontSize > minimum && estimateTextWidth(text, fontSize) > maxWidth) fontSize -= 1;
  if (estimateTextWidth(text, fontSize) > maxWidth) {
    fail(`Texte trop long pour la zone overlay : « ${text} » (maximum ${Math.round(maxWidth)} px).`);
  }
  return fontSize;
}

function roundedRect(x, y, width, height, radius, attributes) {
  return `<rect x="${number(x)}" y="${number(y)}" width="${number(width)}" height="${number(height)}" rx="${number(radius)}" ${attributes}/>`;
}

function textNode(text, x, y, fontSize, fill, {anchor = "start", weight = 600} = {}) {
  return `<text x="${number(x)}" y="${number(y)}" text-anchor="${anchor}" font-family="Clash Grotesk, sans-serif" font-size="${number(fontSize)}" font-weight="${weight}" fill="${fill}">${escapeXml(text)}</text>`;
}

function ensureMacAndFont() {
  if (process.platform !== "darwin") fail("Le rendu overlay portable nécessite macOS et /usr/bin/sips.");
  if (!fs.existsSync("/usr/bin/sips")) fail("/usr/bin/sips est introuvable ; le rendu overlay nécessite macOS.");
  if (!fs.existsSync(BUNDLED_FONT)) fail(`Police Clash Grotesk absente : ${BUNDLED_FONT}`);
  const destinationDir = path.join(os.homedir(), "Library", "Fonts");
  const destination = path.join(destinationDir, "ClashGrotesk-Variable.ttf");
  const current = fs.existsSync(destination)
    && fs.statSync(destination).size === fs.statSync(BUNDLED_FONT).size
    && fs.readFileSync(destination).equals(fs.readFileSync(BUNDLED_FONT));
  if (!current) {
    fs.mkdirSync(destinationDir, {recursive: true});
    const temporary = `${destination}.tmp-${process.pid}`;
    fs.copyFileSync(BUNDLED_FONT, temporary);
    fs.renameSync(temporary, destination);
  }
}

function logoDataUri() {
  if (!fs.existsSync(LOGO_FILE)) fail(`Logo MEG introuvable : ${LOGO_FILE}`);
  return `data:image/png;base64,${fs.readFileSync(LOGO_FILE).toString("base64")}`;
}

function logoBadge(canvas, dataUri) {
  const {width, margin, chromeHeight} = canvas;
  const badgeWidth = canvas.width === 1080 ? 206 : 184;
  const badgeHeight = chromeHeight;
  const x = width - margin - badgeWidth;
  const y = margin;
  const imageX = x + 20;
  const imageY = y + 10;
  const imageWidth = badgeWidth - 40;
  const imageHeight = badgeHeight - 20;
  return {
    x,
    y,
    width: badgeWidth,
    height: badgeHeight,
    svg: [
      roundedRect(x, y, badgeWidth, badgeHeight, badgeHeight / 2, `fill="${PALETTE.cream}"`),
      `<image href="${dataUri}" x="${number(imageX)}" y="${number(imageY)}" width="${number(imageWidth)}" height="${number(imageHeight)}" preserveAspectRatio="xMidYMid meet"/>`,
    ].join(""),
  };
}

function labelChrome(label, canvas, badge) {
  const gap = canvas.width === 1080 ? 24 : 28;
  const maxWidth = Math.max(160, badge.x - canvas.margin - gap);
  const baseFontSize = canvas.width === 1080 ? 34 : 28;
  const fontSize = fitFontSize(label, maxWidth - 44, baseFontSize, 14);
  const height = canvas.chromeHeight;
  const width = Math.min(maxWidth, estimateTextWidth(label, fontSize) + 44);
  const x = canvas.margin;
  const y = canvas.margin;
  const baseline = y + height * 0.68;
  return [
    roundedRect(x, y, width, height, height / 2, `fill="${PALETTE.ink}"`),
    textNode(label, x + width / 2, baseline, fontSize, PALETTE.cream, {anchor: "middle", weight: 700}),
  ].join("");
}

function chrome(label, canvas, dataUri) {
  const badge = logoBadge(canvas, dataUri);
  return {badge, svg: `${labelChrome(label, canvas, badge)}${badge.svg}`};
}

function renderBrandChrome(input, canvas, dataUri) {
  return {svg: chrome(input.label, canvas, dataUri).svg};
}

function renderSteps(input, canvas, dataUri) {
  const isReel = canvas.width === 1080;
  const compactYouTube = !isReel && input.steps.length === 7;
  const margin = canvas.margin;
  const overlay = chrome(input.label, canvas, dataUri);
  const startY = margin + canvas.chromeHeight + (isReel ? 94 : 70);
  const rowHeight = isReel ? 142 : compactYouTube ? 94 : 106;
  const rowWidth = isReel ? Math.min(760, canvas.width - margin * 2) : Math.min(980, canvas.width - margin * 2);
  const circleSize = isReel ? 70 : compactYouTube ? 48 : 54;
  const textSize = isReel ? 40 : compactYouTube ? 29 : 31;
  const railX = margin + circleSize / 2;
  const railTop = startY + circleSize / 2;
  const railBottom = startY + rowHeight * (input.steps.length - 1) + circleSize / 2;
  const pieces = [
    overlay.svg,
    `<line x1="${number(railX)}" y1="${number(railTop)}" x2="${number(railX)}" y2="${number(railBottom)}" stroke="${PALETTE.violet}" stroke-width="${isReel ? 6 : 5}" stroke-linecap="round"/>`,
  ];

  input.steps.forEach((step, index) => {
    const y = startY + rowHeight * index;
    const active = step.active;
    const rowFill = active ? PALETTE.softCream : PALETTE.cream;
    const circleFill = active ? PALETTE.gold : PALETTE.ink;
    const circleText = active ? PALETTE.ink : PALETTE.cream;
    const textFill = active ? PALETTE.ink : PALETTE.olive;
    const rowRadius = isReel ? 30 : 24;
    const rowX = margin;
    const rowH = isReel ? 102 : compactYouTube ? 70 : 78;
    pieces.push(roundedRect(rowX, y, rowWidth, rowH, rowRadius, `fill="${rowFill}"`));
    pieces.push(`<circle cx="${number(railX)}" cy="${number(y + rowH / 2)}" r="${number(circleSize / 2)}" fill="${circleFill}"/>`);
    pieces.push(textNode(String(index + 1), railX, y + rowH / 2 + textSize * 0.35, textSize, circleText, {anchor: "middle", weight: 700}));
    const textX = margin + circleSize + (isReel ? 28 : 24);
    const maxTextWidth = rowWidth - (textX - margin) - (isReel ? 30 : 24);
    const fontSize = fitFontSize(step.text, maxTextWidth, textSize, 13);
    pieces.push(textNode(step.text, textX, y + rowH / 2 + fontSize * 0.34, fontSize, textFill, {weight: active ? 700 : 600}));
  });
  return {svg: pieces.join("")};
}

function renderProofChrome(input, canvas, dataUri) {
  const overlay = chrome(input.label, canvas, dataUri);
  const frameX = canvas.margin;
  const frameY = canvas.margin + canvas.chromeHeight + (canvas.width === 1080 ? 62 : 48);
  const frameWidth = canvas.width - canvas.margin * 2;
  const frameHeight = canvas.height - frameY - canvas.margin;
  const corner = canvas.width === 1080 ? 32 : 26;
  const frame = [
    // Four violet plates leave the evidence window fully transparent while
    // making the B-roll background visible only during this overlay segment.
    `<rect x="0" y="0" width="${canvas.width}" height="${number(frameY)}" fill="${PALETTE.violet}"/>`,
    `<rect x="0" y="${number(frameY)}" width="${number(frameX)}" height="${number(frameHeight)}" fill="${PALETTE.violet}"/>`,
    `<rect x="${number(frameX + frameWidth)}" y="${number(frameY)}" width="${number(canvas.width - frameX - frameWidth)}" height="${number(frameHeight)}" fill="${PALETTE.violet}"/>`,
    `<rect x="0" y="${number(frameY + frameHeight)}" width="${canvas.width}" height="${number(canvas.height - frameY - frameHeight)}" fill="${PALETTE.violet}"/>`,
    `<rect x="${number(frameX)}" y="${number(frameY)}" width="${number(frameWidth)}" height="${number(frameHeight)}" rx="${number(corner)}" fill="none" stroke="${PALETTE.softCream}" stroke-width="${canvas.width === 1080 ? 8 : 6}"/>`,
    `<path d="M ${number(frameX + corner)} ${number(frameY)} H ${number(frameX + corner + (canvas.width === 1080 ? 148 : 124))}" fill="none" stroke="${PALETTE.gold}" stroke-width="${canvas.width === 1080 ? 10 : 8}" stroke-linecap="round"/>`,
    `<path d="M ${number(frameX)} ${number(frameY + corner)} V ${number(frameY + corner + (canvas.width === 1080 ? 148 : 124))}" fill="none" stroke="${PALETTE.gold}" stroke-width="${canvas.width === 1080 ? 10 : 8}" stroke-linecap="round"/>`,
  ].join("");
  // Draw the chrome last so the violet plate cannot cover the label or logo.
  return {svg: `${frame}${overlay.svg}`};
}

function makeSvg(input, dataUri) {
  const canvas = FORMATS[input.format];
  let content;
  if (input.type === "brand-chrome") content = renderBrandChrome(input, canvas, dataUri);
  else if (input.type === "steps") content = renderSteps(input, canvas, dataUri);
  else content = renderProofChrome(input, canvas, dataUri);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`,
    `<title>MEG Borumi overlay ${escapeXml(input.type)} ${escapeXml(input.format)}</title>`,
    content.svg,
    "</svg>",
  ].join("\n");
}

function sipsRender(svgFile, outputFile) {
  const result = spawnSync("/usr/bin/sips", ["-s", "format", "png", svgFile, "--out", outputFile], {encoding: "utf8"});
  if (result.error) fail(`sips indisponible : ${result.error.message}`);
  if (result.status !== 0) fail(`sips a échoué (${result.status}) : ${result.stderr || result.stdout}`.trim());
}

function validatePng(outputFile, canvas) {
  if (!fs.existsSync(outputFile)) fail(`sips n’a pas créé le PNG attendu : ${outputFile}`);
  const result = spawnSync("/usr/bin/sips", ["-g", "pixelWidth", "-g", "pixelHeight", "-g", "format", "-g", "hasAlpha", outputFile], {encoding: "utf8"});
  if (result.error || result.status !== 0) fail(`Impossible de vérifier le PNG : ${result.stderr || result.error?.message || result.stdout}`.trim());
  const width = Number(result.stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(result.stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  const format = result.stdout.match(/format:\s*(\w+)/)?.[1]?.toLowerCase();
  const hasAlpha = result.stdout.match(/hasAlpha:\s*(\w+)/)?.[1]?.toLowerCase();
  if (width !== canvas.width || height !== canvas.height || format !== "png" || hasAlpha !== "yes") {
    fail(`PNG invalide : ${width}×${height}, format=${format}, alpha=${hasAlpha}`);
  }
  return {width, height, format, hasAlpha: true};
}

function main() {
  const input = parseCli(process.argv.slice(2));
  ensureMacAndFont();
  const canvas = FORMATS[input.format];
  const dataUri = logoDataUri();
  const svg = makeSvg(input, dataUri);
  fs.mkdirSync(path.dirname(input.output), {recursive: true});
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "borumi-overlay-"));
  const svgFile = path.join(temporaryDirectory, "overlay.svg");
  try {
    fs.writeFileSync(svgFile, svg, "utf8");
    sipsRender(svgFile, input.output);
    const image = validatePng(input.output, canvas);
    return {
      ok: true,
      type: input.type,
      format: input.format,
      output: input.output,
      ...(input.type === "steps" ? {stepCount: input.steps.length, activeIndex: input.activeIndex >= 0 ? input.activeIndex : null} : {}),
      image,
    };
  } finally {
    fs.rmSync(temporaryDirectory, {recursive: true, force: true});
  }
}

try {
  process.stdout.write(`${JSON.stringify(main(), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ok: false, error: error.message})}\n`);
  process.exitCode = 1;
}
