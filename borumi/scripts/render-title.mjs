#!/usr/bin/env node

/**
 * Render a portable MEG TikTok title overlay.
 *
 * The renderer deliberately has no Remotion dependency.  It writes a small
 * SVG silhouette and asks the macOS-native sips tool to rasterise it to a
 * 1080×1920 RGBA PNG.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const BUNDLED_FONT = path.join(REPO_ROOT, "borumi", "assets", "fonts", "ClashGrotesk-Variable.ttf");
const CANVAS = {width: 1080, height: 1920};
const MAX_SHAPE_WIDTH = 980;
const PRESETS = {
  A: {background: "#FFFCD6", text: "#2F2C00"},
  B: {background: "#2F2C00", text: "#FFFCD6"},
  E: {background: "#FFF3AE", text: "#2F2C00"},
};

function usage() {
  return "Usage: node borumi/scripts/render-title.mjs --line1 TEXTE [--line2 TEXTE] --preset A|B|E --output /chemin/titre.png";
}

function parseArgs(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (!arg?.startsWith("--")) throw new Error(`${usage()}\nArgument inattendu : ${arg}`);
    const key = arg.slice(2);
    if (key === "line3") throw new Error("Le titre MEG accepte au maximum deux lignes ; --line3 est refusé.");
    if (!["line1", "line2", "preset", "output"].includes(key)) throw new Error(`Option inconnue : --${key}`);
    const value = argv[index + 1];
    if (value == null || value.startsWith("--")) throw new Error(`Valeur manquante pour --${key}`);
    values.set(key, value);
    index += 1;
  }
  const line1 = values.get("line1");
  const line2 = values.get("line2") || null;
  const output = values.get("output");
  const preset = (values.get("preset") || "A").toUpperCase();
  if (!line1 || !output || !String(line1).trim()) throw new Error(`--line1 et --output sont obligatoires.\n${usage()}`);
  if (!PRESETS[preset]) throw new Error(`Preset inconnu : ${preset}. Choisissez A, B ou E.`);
  for (const [name, value] of [["line1", line1], ["line2", line2]]) {
    if (value && /[\r\n]/.test(value)) throw new Error(`${name} contient une troisième ligne ; utilisez au maximum deux lignes séparées.`);
  }
  return {line1: String(line1).trim(), line2: line2?.trim() || null, output: path.resolve(output), preset};
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function characterWidthFactor(character) {
  if (character === " ") return 0.31;
  if ("ilIjtfr|!.,:;'·".includes(character)) return 0.27;
  if ("mwMW@%&".includes(character)) return 0.88;
  if ("()[]{}".includes(character)) return 0.40;
  if ("ABCDEFGHKNOPQRSTUVXYZ".includes(character)) return 0.66;
  if ("0123456789".includes(character)) return 0.58;
  return 0.56;
}

function estimateTextWidth(text, fontSize) {
  const base = [...text].reduce((sum, character) => sum + characterWidthFactor(character), 0);
  const tracking = Math.max(0, [...text].length - 1) * fontSize * 0.006;
  return base * fontSize + tracking;
}

function chooseFontSize(lines) {
  const padding = 64;
  let fontSize = 176;
  // Keep reducing instead of wrapping: the title contract is one or two
  // explicit lines, each of which must fit its own connected silhouette.
  while (fontSize > 8 && lines.some((line) => estimateTextWidth(line, fontSize) + padding * 2 > MAX_SHAPE_WIDTH)) {
    fontSize -= 1;
  }
  if (lines.some((line) => estimateTextWidth(line, fontSize) + padding * 2 > MAX_SHAPE_WIDTH)) {
    throw new Error("Une ligne est trop longue pour le titre MEG, même à la taille minimale. Raccourcissez le texte au lieu de le laisser déborder.");
  }
  return fontSize;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function roundedPath(x, y, width, height, radius) {
  const right = x + width;
  const bottom = y + height;
  const r = Math.min(radius, width / 2, height / 2);
  return [
    `M ${round(x + r)} ${round(y)}`,
    `H ${round(right - r)}`,
    `Q ${round(right)} ${round(y)} ${round(right)} ${round(y + r)}`,
    `V ${round(bottom - r)}`,
    `Q ${round(right)} ${round(bottom)} ${round(right - r)} ${round(bottom)}`,
    `H ${round(x + r)}`,
    `Q ${round(x)} ${round(bottom)} ${round(x)} ${round(bottom - r)}`,
    `V ${round(y + r)}`,
    `Q ${round(x)} ${round(y)} ${round(x + r)} ${round(y)}`,
    "Z",
  ].join(" ");
}

function ensureFontInstalled() {
  if (process.platform !== "darwin") throw new Error("Le rendu Borumi portable nécessite macOS et /usr/bin/sips.");
  const destinationDir = path.join(os.homedir(), "Library", "Fonts");
  const destination = path.join(destinationDir, "ClashGrotesk-Variable.ttf");
  // The script is also copied into the installed Codex skill. In that
  // location the repository asset is intentionally absent, but the kit
  // installer has already installed the font in the user library.
  if (!fs.existsSync(BUNDLED_FONT)) {
    if (fs.existsSync(destination)) return destination;
    throw new Error("Police Clash Grotesk absente. Exécutez d’abord node borumi/scripts/install.mjs --install depuis le dépôt.");
  }
  const same = fs.existsSync(destination)
    && fs.statSync(destination).size === fs.statSync(BUNDLED_FONT).size
    && fs.readFileSync(destination).equals(fs.readFileSync(BUNDLED_FONT));
  if (same) return destination;
  fs.mkdirSync(destinationDir, {recursive: true});
  const temporary = `${destination}.tmp-${process.pid}`;
  fs.copyFileSync(BUNDLED_FONT, temporary);
  fs.renameSync(temporary, destination);
  return destination;
}

function makeSvg({line1, line2, preset, fontSize}) {
  const lines = [line1, ...(line2 ? [line2] : [])];
  const colors = PRESETS[preset];
  const paddingX = 64;
  const shapeHeight = Math.max(96, fontSize * 1.14);
  const radius = Math.min(38, shapeHeight / 2);
  const top = lines.length === 1 ? 330 : 286;
  const gap = lines.length === 1 ? 0 : -16;
  const positions = lines.map((line, index) => {
    const textWidth = estimateTextWidth(line, fontSize);
    const width = Math.min(MAX_SHAPE_WIDTH, textWidth + paddingX * 2);
    const x = (CANVAS.width - width) / 2;
    const y = top + index * (shapeHeight + gap);
    const baseline = y + shapeHeight * 0.735;
    return {line, width, x, y, baseline};
  });
  const silhouettes = positions.map((position) => `<path d="${roundedPath(position.x, position.y, position.width, shapeHeight, radius)}" fill="${colors.background}"/>`).join("");
  let connector = "";
  if (positions.length === 2) {
    const first = positions[0];
    const second = positions[1];
    const overlapTop = Math.max(first.y + shapeHeight - 30, second.y - 14);
    const overlapBottom = Math.min(first.y + shapeHeight + 12, second.y + 30);
    const left = Math.max(Math.min(first.x + first.width / 2, second.x + second.width / 2) - 36, 0);
    connector = `<path d="${roundedPath(left, overlapTop, 72, Math.max(12, overlapBottom - overlapTop), 18)}" fill="${colors.background}"/>`;
  }
  const text = positions.map((position) => `<text x="${round(position.x + position.width / 2)}" y="${round(position.baseline)}" text-anchor="middle" font-family="Clash Grotesk, sans-serif" font-size="${round(fontSize)}" font-weight="600" letter-spacing="0" fill="${colors.text}">${escapeXml(position.line)}</text>`).join("");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}" viewBox="0 0 ${CANVAS.width} ${CANVAS.height}">`,
    `<title>MEG title preset ${preset}</title>`,
    `<g aria-label="connected title silhouettes">${silhouettes}${connector}</g>`,
    text,
    "</svg>",
  ].join("\n");
}

function sipsRender(svgFile, outputFile) {
  const result = spawnSync("/usr/bin/sips", ["-s", "format", "png", svgFile, "--out", outputFile], {encoding: "utf8"});
  if (result.error) throw new Error(`sips indisponible : ${result.error.message}`);
  if (result.status !== 0) throw new Error(`sips a échoué (${result.status}) : ${result.stderr || result.stdout}`.trim());
}

function validatePng(outputFile) {
  const result = spawnSync("/usr/bin/sips", ["-g", "pixelWidth", "-g", "pixelHeight", "-g", "format", "-g", "hasAlpha", outputFile], {encoding: "utf8"});
  if (result.error || result.status !== 0) throw new Error(`Impossible de vérifier le PNG : ${result.stderr || result.error?.message || result.stdout}`.trim());
  const width = Number(result.stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(result.stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  const format = result.stdout.match(/format:\s*(\w+)/)?.[1]?.toLowerCase();
  const hasAlpha = result.stdout.match(/hasAlpha:\s*(\w+)/)?.[1]?.toLowerCase();
  if (width !== CANVAS.width || height !== CANVAS.height || format !== "png" || hasAlpha !== "yes") {
    throw new Error(`PNG invalide : ${width}×${height}, format=${format}, alpha=${hasAlpha}`);
  }
  return {width, height, format, hasAlpha: true};
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  ensureFontInstalled();
  fs.mkdirSync(path.dirname(options.output), {recursive: true});
  const fontSize = chooseFontSize([options.line1, ...(options.line2 ? [options.line2] : [])]);
  const svg = makeSvg({...options, fontSize});
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "borumi-title-"));
  const svgFile = path.join(temporaryDirectory, "title.svg");
  try {
    fs.writeFileSync(svgFile, svg, "utf8");
    sipsRender(svgFile, options.output);
    const image = validatePng(options.output);
    return {ok: true, output: options.output, preset: options.preset, lines: options.line2 ? 2 : 1, fontSize, image};
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
