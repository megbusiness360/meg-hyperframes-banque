#!/usr/bin/env node

/** Portable Borumi kit smoke test, including isolated --install runs. */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const PRESETS_FILE = path.join(REPO_ROOT, "borumi", "layouts", "favorite-layout-presets.json");
const MANIFEST_FILE = path.join(REPO_ROOT, "borumi", "layouts", "manifest.json");
const INSTALLER = path.join(REPO_ROOT, "borumi", "scripts", "install.mjs");
const RENDERER = path.join(REPO_ROOT, "borumi", "scripts", "render-title.mjs");
const EXPECTED_COUNT = 86;

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function geometryKey(preset) {
  const sources = preset.sources.map((source) => ({
    kind: source.source?.content_kind?.kind,
    x_ratio: source.x_ratio,
    y_ratio: source.y_ratio,
    width_ratio: source.width_ratio,
    height_ratio: source.height_ratio,
    border_radius_ratio: source.border_radius_ratio,
  }));
  return stable(sources.sort((left, right) => stable(left).localeCompare(stable(right))));
}

function validPreset(preset) {
  if (preset?.kind !== "Custom" || !Array.isArray(preset.sources) || !preset.sources.length) return false;
  return preset.sources.every((source) => ["Camera", "Screen"].includes(source.source?.content_kind?.kind)
    && ["x_ratio", "y_ratio", "width_ratio", "height_ratio"].every((key) => Number.isFinite(source[key])));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {encoding: "utf8", maxBuffer: 16 * 1024 * 1024, ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} a échoué (${result.status}) : ${result.stderr || result.stdout}`.trim());
  return result.stdout;
}

function expectFailure(command, args, pattern, options = {}) {
  const result = spawnSync(command, args, {encoding: "utf8", maxBuffer: 16 * 1024 * 1024, ...options});
  if (result.error) throw result.error;
  const output = `${result.stderr || ""}\n${result.stdout || ""}`;
  if (result.status === 0 || !pattern.test(output)) {
    throw new Error(`Échec attendu absent pour ${command} ${args.join(" ")} : ${output}`);
  }
}

function readImageMetadata(file) {
  const stdout = run("/usr/bin/sips", ["-g", "pixelWidth", "-g", "pixelHeight", "-g", "format", "-g", "hasAlpha", file]);
  const width = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  const format = stdout.match(/format:\s*(\w+)/)?.[1]?.toLowerCase();
  const hasAlpha = stdout.match(/hasAlpha:\s*(\w+)/)?.[1]?.toLowerCase();
  if (width !== 1080 || height !== 1920 || format !== "png" || hasAlpha !== "yes") {
    throw new Error(`${path.basename(file)} invalide : ${width}×${height}, ${format}, alpha=${hasAlpha}`);
  }
  return {width, height, format, hasAlpha: true};
}

function validateKit() {
  const presets = JSON.parse(fs.readFileSync(PRESETS_FILE, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  if (!Array.isArray(presets) || presets.length !== EXPECTED_COUNT) throw new Error(`Payload : ${EXPECTED_COUNT} presets attendus.`);
  if (!manifest || manifest.schemaVersion !== 1 || manifest.presetCount !== EXPECTED_COUNT || manifest.presets?.length !== EXPECTED_COUNT) {
    throw new Error("Manifest : schemaVersion/presetCount incohérents.");
  }
  const geometries = new Set();
  const ids = new Set();
  presets.forEach((preset, index) => {
    if (!validPreset(preset)) throw new Error(`Preset ${index} hors schéma.`);
    if (Object.keys(preset).some((key) => ["name", "title", "family", "format", "metadata"].includes(key))) throw new Error(`Métadonnée injectée dans le preset ${index}.`);
    const key = geometryKey(preset);
    if (geometries.has(key)) throw new Error(`Géométrie dupliquée au preset ${index}.`);
    geometries.add(key);
  });
  manifest.presets.forEach((entry, index) => {
    const expectedId = `meg-layout-${String(index).padStart(3, "0")}`;
    if (entry.id !== expectedId || !entry.name || !entry.format || !Array.isArray(entry.formats)) throw new Error(`Mapping manifest invalide au preset ${index}.`);
    if (ids.has(entry.id)) throw new Error(`ID manifest dupliqué : ${entry.id}`);
    ids.add(entry.id);
  });
  return {presetCount: presets.length, manifestCount: manifest.presets.length, uniqueGeometries: geometries.size};
}

function runTitleRenders(directory) {
  const results = {};
  for (const preset of ["A", "B", "E"]) {
    const output = path.join(directory, `title-${preset}.png`);
    const stdout = run(process.execPath, [RENDERER, "--line1", "TEST MEG", "--line2", "BORUMI", "--preset", preset, "--output", output]);
    const payload = JSON.parse(stdout);
    if (!payload.ok || payload.preset !== preset) throw new Error(`Rendu ${preset} : réponse invalide.`);
    results[preset] = {output, image: readImageMetadata(output), fontSize: payload.fontSize};
  }
  return results;
}

function runTitleInputGuards(directory) {
  const output = path.join(directory, "rejected.png");
  expectFailure(process.execPath, [RENDERER, "--line1", "LIGNE 1", "--line3", "LIGNE 3", "--output", output], /maximum deux lignes|line3/i);
  expectFailure(process.execPath, [RENDERER, "--line1", "W".repeat(500), "--output", output], /trop longue|déborder/i);
  return {line3Rejected: true, excessiveLineRejected: true};
}

function sqlQuote(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function runInstallerInstall(directory) {
  const database = path.join(directory, "settings-wal.db");
  const codeHome = path.join(directory, "codex-home");
  const fontDir = path.join(directory, "fonts");
  const binDir = path.join(directory, "bin");
  fs.mkdirSync(binDir, {recursive: true});
  fs.symlinkSync("/usr/bin/sqlite3", path.join(binDir, "sqlite3"));
  const pgrepStub = path.join(binDir, "pgrep");
  fs.writeFileSync(pgrepStub, "#!/bin/sh\nexit 1\n", "utf8");
  fs.chmodSync(pgrepStub, 0o755);

  const kitPresets = JSON.parse(fs.readFileSync(PRESETS_FILE, "utf8"));
  const userPreset = structuredClone(kitPresets[0]);
  userPreset.name = "Personal favorite preserved";
  userPreset.sources[0].hide_on_cursor_overlap = true;
  const seedSql = [
    "PRAGMA journal_mode=WAL;",
    "PRAGMA wal_autocheckpoint=0;",
    "CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT);",
    `INSERT INTO settings(key,value) VALUES('favorite_layout_presets',${sqlQuote(JSON.stringify([userPreset]))});`,
  ].join(" ");
  run("/usr/bin/sqlite3", [database, seedSql]);
  const noPgrepDir = path.join(directory, "bin-without-pgrep");
  fs.mkdirSync(noPgrepDir, {recursive: true});
  fs.symlinkSync("/usr/bin/sqlite3", path.join(noPgrepDir, "sqlite3"));
  expectFailure(
    process.execPath,
    [INSTALLER, "--check", "--settings-db", database],
    /Impossible de vérifier si Borumi est ouvert/i,
    {env: {...process.env, PATH: noPgrepDir}},
  );
  const env = {...process.env, PATH: binDir};
  const args = [INSTALLER, "--install", "--settings-db", database, "--code-home", codeHome, "--font-dir", fontDir];
  const first = JSON.parse(run(process.execPath, args, {env}));
  const second = JSON.parse(run(process.execPath, args, {env}));
  if (first.database?.installedPresetCount !== 87 || second.database?.installedPresetCount !== 87 || second.database?.existingPresetCount !== 87) {
    throw new Error(`Installateur non idempotent : first=${first.database?.installedPresetCount}, second=${second.database?.installedPresetCount}.`);
  }
  const stored = JSON.parse(run("/usr/bin/sqlite3", ["-noheader", database, "SELECT value FROM settings WHERE key='favorite_layout_presets';"]).trim());
  if (stored[0]?.name !== userPreset.name || stored[0]?.sources?.[0]?.hide_on_cursor_overlap !== true) {
    throw new Error("Le favori utilisateur sémantiquement distinct n’a pas été préservé.");
  }
  const backupIntegrity = run("/usr/bin/sqlite3", ["-noheader", first.database.backup, "PRAGMA integrity_check;"]).trim();
  if (backupIntegrity !== "ok") throw new Error(`Sauvegarde SQLite invalide : ${backupIntegrity}`);
  const journalMode = run("/usr/bin/sqlite3", ["-noheader", database, "PRAGMA journal_mode;"]).trim();
  const marker = fs.readFileSync(path.join(codeHome, "skills", "borumi-montage", ".repo-root"), "utf8").trim();
  if (marker !== REPO_ROOT) throw new Error(`Marker repo-root invalide : ${marker}`);
  return {
    journalMode,
    firstCount: first.database.installedPresetCount,
    secondCount: second.database.installedPresetCount,
    userFavoritePreserved: true,
    backupIntegrity,
    skillMarker: marker,
    missingPgrepRejected: true,
  };
}

function runInstallerCheck() {
  const database = process.env.BORUMI_SETTINGS_DB || path.join(os.homedir(), "Library", "Application Support", "borumi", "settings.db");
  const before = fs.existsSync(database) ? fs.statSync(database) : null;
  const stdout = run(process.execPath, [INSTALLER, "--check"]);
  const result = JSON.parse(stdout);
  if (!result.ok || result.mode !== "check" || result.readOnly !== true || result.kit?.presetCount !== EXPECTED_COUNT) {
    throw new Error("install.mjs --check n’a pas retourné un contrôle en lecture seule valide.");
  }
  const after = fs.existsSync(database) ? fs.statSync(database) : null;
  if (before && (!after || before.size !== after.size || before.mtimeMs !== after.mtimeMs)) throw new Error("--check a modifié settings.db.");
  return {mode: result.mode, readOnly: result.readOnly, settingsDbExists: result.borumi?.settingsDbExists ?? false};
}

function main() {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "borumi-self-test-"));
  try {
    const kit = validateKit();
    const renders = runTitleRenders(temporaryDirectory);
    const titleGuards = runTitleInputGuards(temporaryDirectory);
    const installer = runInstallerCheck();
    const isolatedInstall = runInstallerInstall(temporaryDirectory);
    return {ok: true, repoRoot: REPO_ROOT, kit, renders, titleGuards, installer, isolatedInstall};
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
