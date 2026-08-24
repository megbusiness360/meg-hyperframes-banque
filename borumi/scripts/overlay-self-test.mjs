#!/usr/bin/env node

/** Targeted smoke test for the portable Borumi overlay renderer. */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const RENDERER = path.join(SCRIPT_DIR, "render-overlay.mjs");
const EXPECTED = {
  reel: {width: 1080, height: 1920},
  youtube: {width: 1920, height: 1080},
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {encoding: "utf8", maxBuffer: 16 * 1024 * 1024, ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} a échoué (${result.status}) : ${result.stderr || result.stdout}`.trim());
  return result.stdout;
}

function expectFailure(args, pattern) {
  const result = spawnSync(process.execPath, [RENDERER, ...args], {encoding: "utf8", maxBuffer: 16 * 1024 * 1024});
  const output = `${result.stderr || ""}\n${result.stdout || ""}`;
  if (result.error) throw result.error;
  if (result.status === 0 || !pattern.test(output)) {
    throw new Error(`Échec attendu absent pour ${args.join(" ")} : ${output}`);
  }
}

function readImageMetadata(file, format) {
  const result = run("/usr/bin/sips", ["-g", "pixelWidth", "-g", "pixelHeight", "-g", "format", "-g", "hasAlpha", file]);
  const width = Number(result.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(result.match(/pixelHeight:\s*(\d+)/)?.[1]);
  const imageFormat = result.match(/format:\s*(\w+)/)?.[1]?.toLowerCase();
  const hasAlpha = result.match(/hasAlpha:\s*(\w+)/)?.[1]?.toLowerCase();
  const expected = EXPECTED[format];
  if (width !== expected.width || height !== expected.height || imageFormat !== "png" || hasAlpha !== "yes") {
    throw new Error(`${path.basename(file)} invalide : ${width}×${height}, ${imageFormat}, alpha=${hasAlpha}`);
  }
  return {width, height, format: imageFormat, hasAlpha: true};
}

function render(directory, payload, name) {
  const output = path.join(directory, `${name}.png`);
  const stdout = run(process.execPath, [RENDERER, "--json", JSON.stringify({...payload, output})]);
  const result = JSON.parse(stdout);
  if (!result.ok || result.type !== payload.type || result.format !== payload.format) {
    throw new Error(`Réponse renderer invalide pour ${name} : ${stdout}`);
  }
  const image = readImageMetadata(output, payload.format);
  return {output, image, stepCount: result.stepCount ?? null, activeIndex: result.activeIndex ?? null};
}

function sampleSteps(count) {
  return Array.from({length: count}, (_, index) => ({
    text: `Étape ${index + 1}`,
    active: index === Math.min(2, count - 1),
  }));
}

function renderAll(directory) {
  const results = {};
  for (const format of Object.keys(EXPECTED)) {
    results[`${format}-brand`] = render(directory, {format, type: "brand-chrome", label: "MEG • TEST"}, `${format}-brand`);
    results[`${format}-proof`] = render(directory, {format, type: "proof-chrome", label: "PREUVE"}, `${format}-proof`);
    for (const count of [5, 6, 7]) {
      results[`${format}-steps-${count}`] = render(directory, {
        format,
        type: "steps",
        label: "PARCOURS",
        steps: sampleSteps(count),
      }, `${format}-steps-${count}`);
    }
  }
  return results;
}

function inputGuards(directory) {
  const output = path.join(directory, "rejected.png");
  expectFailure(["--json", "not-json", "--output", output], /JSON invalide/i);
  expectFailure(["--json", JSON.stringify({format: "reel", type: "unknown", output})], /type doit être/i);
  expectFailure(["--json", JSON.stringify({format: "reel", type: "steps", steps: ["1", "2", "3", "4"], output})], /exactement 5, 6 ou 7/i);
  expectFailure(["--json", JSON.stringify({format: "reel", type: "steps", steps: [{text: "1", active: true}, {text: "2", active: true}, "3", "4", "5"], output})], /Une seule étape/i);
  expectFailure(["--json", JSON.stringify({format: "reel", type: "brand-chrome", label: "X".repeat(65), output})], /label dépasse/i);
  expectFailure(["--json", JSON.stringify({format: "reel", type: "brand-chrome", output: path.join(directory, "not-png.jpg")})], /\.png/i);
  return {invalidJson: true, invalidType: true, invalidStepCount: true, multipleActiveRejected: true, longLabelRejected: true, nonPngRejected: true};
}

function main() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "borumi-overlay-self-test-"));
  try {
    const renders = renderAll(directory);
    const guards = inputGuards(directory);
    return {ok: true, renders, guards};
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
}

try {
  process.stdout.write(`${JSON.stringify(main(), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ok: false, error: error.message})}\n`);
  process.exitCode = 1;
}
