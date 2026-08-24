#!/usr/bin/env node

/**
 * Install the portable MEG Borumi kit on macOS.
 *
 * The default is an entirely read-only check.  Database writes only happen
 * with --install, after Borumi has been closed and the SQLite file has been
 * backed up and integrity-checked.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const KIT_ROOT = path.resolve(SCRIPT_DIR, "..");
const KIT_PRESETS_RELATIVE = path.join("borumi", "layouts", "favorite-layout-presets.json");
const KIT_MANIFEST_RELATIVE = path.join("borumi", "layouts", "manifest.json");
const KIT_FONT_RELATIVE = path.join("borumi", "assets", "fonts", "ClashGrotesk-Variable.ttf");
const KIT_SKILL_RELATIVE = path.join("skills", "borumi-montage");
const EXPECTED_PRESET_COUNT = 83;
const SUPPORTED_KINDS = new Set(["Camera", "Screen"]);
const SUPPORTED_SOURCE_KEYS = [
  "source",
  "x_ratio",
  "y_ratio",
  "width_ratio",
  "height_ratio",
  "border_radius_ratio",
  "lock_aspect_ratio",
  "overflow",
  "corner_shape",
  "is_shadow_style_aware",
  "shadow_style",
  "stroke_style",
  "video_background_override",
  "face_tracking_mode_override",
  "hide_on_cursor_overlap",
];

function usage() {
  return [
    "Usage: node borumi/scripts/install.mjs [--check|--install] [options]",
    "",
    "  --check                 Read-only check (default).",
    "  --install               Merge presets and install font/skill.",
    "  --repo-root <path>      Repository root (auto-detected by default).",
    "  --settings-db <path>   Override Borumi settings.db location.",
    "  --code-home <path>     Override CODEX_HOME for skill sync.",
    "  --font-dir <path>      Override the macOS user font directory.",
    "  --help                 Show this help.",
  ].join("\n");
}

function expandHome(value) {
  if (value === "~") return os.homedir();
  if (value?.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function parseArgs(argv) {
  const options = {
    mode: "check",
    repoRoot: DEFAULT_REPO_ROOT,
    settingsDb: process.env.BORUMI_SETTINGS_DB || null,
    codeHome: process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
    fontDir: process.env.BORUMI_FONT_DIR || path.join(os.homedir(), "Library", "Fonts"),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (arg === "--check") {
      options.mode = "check";
      continue;
    }
    if (arg === "--install") {
      options.mode = "install";
      continue;
    }
    const key = {
      "--repo-root": "repoRoot",
      "--settings-db": "settingsDb",
      "--code-home": "codeHome",
      "--font-dir": "fontDir",
    }[arg];
    if (!key) throw new Error(`Option inconnue : ${arg}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Valeur manquante pour ${arg}`);
    options[key] = expandHome(value);
    index += 1;
  }
  options.repoRoot = path.resolve(options.repoRoot);
  if (options.settingsDb) options.settingsDb = path.resolve(options.settingsDb);
  options.codeHome = path.resolve(expandHome(options.codeHome));
  options.fontDir = path.resolve(expandHome(options.fontDir));
  return options;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`JSON invalide ou illisible (${file}) : ${error.message}`);
  }
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sourceKey(source) {
  return {
    kind: source.source?.content_kind?.kind || "Unknown",
    x_ratio: source.x_ratio,
    y_ratio: source.y_ratio,
    width_ratio: source.width_ratio,
    height_ratio: source.height_ratio,
    border_radius_ratio: source.border_radius_ratio,
  };
}

function geometryKey(sources) {
  return stable((sources || []).map(sourceKey).sort((left, right) => stable(left).localeCompare(stable(right))));
}

function isValidPreset(preset) {
  if (!preset || typeof preset !== "object" || preset.kind !== "Custom" || !Array.isArray(preset.sources) || !preset.sources.length) {
    return false;
  }
  return preset.sources.every((source) => {
    const kind = source?.source?.content_kind?.kind;
    if (!SUPPORTED_KINDS.has(kind)) return false;
    return ["x_ratio", "y_ratio", "width_ratio", "height_ratio"].every((key) => Number.isFinite(source[key]));
  });
}

function cleanPreset(preset) {
  const output = {kind: preset.kind, sources: []};
  for (const source of preset.sources) {
    const clean = {};
    for (const key of SUPPORTED_SOURCE_KEYS) {
      if (Object.prototype.hasOwnProperty.call(source, key)) clean[key] = source[key];
    }
    output.sources.push(clean);
  }
  return output;
}

function validateKit(repoRoot) {
  const presetsFile = path.join(repoRoot, KIT_PRESETS_RELATIVE);
  const manifestFile = path.join(repoRoot, KIT_MANIFEST_RELATIVE);
  if (!fs.existsSync(presetsFile)) throw new Error(`Kit presets introuvable : ${presetsFile}`);
  if (!fs.existsSync(manifestFile)) throw new Error(`Manifeste introuvable : ${manifestFile}`);
  const presets = readJson(presetsFile);
  const manifest = readJson(manifestFile);
  if (!Array.isArray(presets) || presets.length !== EXPECTED_PRESET_COUNT) {
    throw new Error(`Le kit doit contenir exactement ${EXPECTED_PRESET_COUNT} presets (reçu ${Array.isArray(presets) ? presets.length : "non-tableau"}).`);
  }
  const keys = new Set();
  for (const preset of presets) {
    if (!isValidPreset(preset)) throw new Error("Preset du kit hors schéma Borumi Custom.");
    const key = geometryKey(preset.sources);
    if (keys.has(key)) throw new Error("Le kit contient des géométries dupliquées.");
    keys.add(key);
    if (Object.keys(preset).some((keyName) => ["name", "title", "family", "format", "metadata"].includes(keyName))) {
      throw new Error("Des métadonnées ont été injectées dans le payload Borumi.");
    }
  }
  if (!manifest || manifest.schemaVersion !== 1 || manifest.presetCount !== EXPECTED_PRESET_COUNT || !Array.isArray(manifest.presets) || manifest.presets.length !== EXPECTED_PRESET_COUNT) {
    throw new Error("Manifest Borumi incomplet ou incohérent avec les 83 presets.");
  }
  const manifestIds = new Set();
  for (const entry of manifest.presets) {
    if (!entry || typeof entry.id !== "string" || !entry.id || typeof entry.name !== "string" || !entry.name) {
      throw new Error("Chaque entrée du manifest doit avoir un id et un name stables.");
    }
    if (!Array.isArray(entry.formats) || !entry.formats.length || typeof entry.format !== "string") {
      throw new Error("Chaque entrée du manifest doit avoir format et formats.");
    }
    if (manifestIds.has(entry.id)) throw new Error(`ID de manifest dupliqué : ${entry.id}`);
    manifestIds.add(entry.id);
  }
  return {presets, manifest, presetsFile, manifestFile, count: presets.length};
}

function sqliteQuery(database, sql) {
  const result = spawnSync("sqlite3", ["-batch", "-noheader", database], {
    input: sql,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw new Error(`sqlite3 indisponible : ${result.error.message}`);
  if (result.status !== 0) throw new Error(`sqlite3 a échoué (${result.status}) : ${result.stderr || result.stdout}`.trim());
  return result.stdout;
}

function sqlQuote(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function resolveSettingsDb(explicit) {
  if (explicit) return explicit;
  const home = os.homedir();
  const candidates = [
    path.join(home, "Library", "Application Support", "borumi", "settings.db"),
    path.join(home, "Library", "Application Support", "Borumi", "settings.db"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

function detectBorumiApp() {
  const candidates = [
    process.env.BORUMI_APP,
    "/Applications/Borumi.app",
    path.join(os.homedir(), "Applications", "Borumi.app"),
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function borumiProcesses() {
  const pids = new Set();
  for (const executable of ["borumi", "Borumi"]) {
    const result = spawnSync("pgrep", ["-x", executable], {encoding: "utf8"});
    if (result.error) throw new Error(`Impossible de vérifier si Borumi est ouvert : ${result.error.message}`);
    if (result.status === 0) {
      for (const pid of result.stdout.trim().split(/\s+/).filter(Boolean)) pids.add(pid);
    } else if (result.status !== 1) {
      throw new Error(`pgrep a échoué (${result.status}) pendant la détection de Borumi : ${result.stderr || result.stdout}`.trim());
    }
  }
  return [...pids];
}

function ensureBorumiClosed() {
  const pids = borumiProcesses();
  if (pids.length) {
    throw new Error(`Borumi est encore ouvert (PID ${pids.join(", ")}). Fermez l’application avant --install.`);
  }
}

function integrityCheck(database) {
  const result = sqliteQuery(database, "PRAGMA integrity_check;").trim();
  if (result !== "ok") throw new Error(`PRAGMA integrity_check a échoué : ${result}`);
  return result;
}

function readFavoritePresets(database) {
  const raw = sqliteQuery(database, "SELECT value FROM settings WHERE key='favorite_layout_presets';").trim();
  if (!raw) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`favorite_layout_presets invalide dans ${database} : ${error.message}`);
  }
  if (!Array.isArray(parsed)) throw new Error("favorite_layout_presets doit être un tableau JSON.");
  return parsed;
}

function mergePresets(existing, kit) {
  // Existing entries are user-owned. Preserve every entry byte-for-byte,
  // including duplicates and presets that share geometry but differ through
  // cutout, tracking, shadow, lock or other semantic fields.
  const merged = [...existing];
  const seenExact = new Set(existing.map(stable));
  for (const preset of kit) {
    const clean = cleanPreset(preset);
    const key = stable(clean);
    if (seenExact.has(key)) continue;
    seenExact.add(key);
    merged.push(clean);
  }
  return merged;
}

function backupDatabase(database) {
  const stem = `${database}.bak-${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`;
  let candidate = stem;
  let suffix = 1;
  while (fs.existsSync(candidate)) candidate = `${stem}-${suffix++}`;
  // SQLite's online backup command creates a transactionally consistent
  // snapshot and includes committed WAL state. A raw file copy does not.
  sqliteQuery(database, `.backup ${sqlQuote(candidate)}\n`);
  integrityCheck(candidate);
  return candidate;
}

function writeFavoritePresets(database, presets) {
  const json = JSON.stringify(presets);
  const sql = [
    ".bail on",
    "BEGIN IMMEDIATE;",
    `INSERT INTO settings(key,value) VALUES ('favorite_layout_presets',${sqlQuote(json)}) ON CONFLICT(key) DO UPDATE SET value=excluded.value;`,
    "COMMIT;",
  ].join("\n");
  sqliteQuery(database, sql);
}

function digest(file) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(file));
  return hash.digest("hex");
}

function installFont(source, fontDir) {
  if (!fs.existsSync(source)) throw new Error(`Police Clash Grotesk introuvable : ${source}`);
  const destination = path.join(fontDir, "ClashGrotesk-Variable.ttf");
  const sourceHash = digest(source);
  if (fs.existsSync(destination) && digest(destination) === sourceHash) {
    return {source, destination, action: "already-present", sha256: sourceHash};
  }
  fs.mkdirSync(fontDir, {recursive: true});
  const temporary = `${destination}.tmp-${process.pid}`;
  fs.copyFileSync(source, temporary);
  fs.renameSync(temporary, destination);
  return {source, destination, action: "installed", sha256: sourceHash};
}

function listFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function syncSkill(source, codeHome, write) {
  if (!fs.existsSync(source)) throw new Error(`Skill Borumi introuvable : ${source}`);
  const destination = path.join(codeHome, "skills", "borumi-montage");
  const sourceFiles = listFiles(source);
  let changed = 0;
  for (const sourceFile of sourceFiles) {
    const relative = path.relative(source, sourceFile);
    const destinationFile = path.join(destination, relative);
    const same = fs.existsSync(destinationFile) && digest(sourceFile) === digest(destinationFile);
    if (same) continue;
    changed += 1;
    if (!write) continue;
    fs.mkdirSync(path.dirname(destinationFile), {recursive: true});
    fs.copyFileSync(sourceFile, destinationFile);
    fs.chmodSync(destinationFile, fs.statSync(sourceFile).mode & 0o777);
  }
  if (write) {
    // Keep the installed thin renderer wrapper independent from the clone
    // location. The marker contains only a local path, never a credential.
    fs.mkdirSync(destination, {recursive: true});
    fs.writeFileSync(path.join(destination, ".repo-root"), `${path.resolve(source, "../..")}\n`, "utf8");
  }
  return {source, destination, files: sourceFiles.length, changed, action: write ? (changed ? "synced" : "already-current") : "would-sync"};
}

function inspectFont(source, fontDir) {
  const destination = path.join(fontDir, "ClashGrotesk-Variable.ttf");
  const sourceExists = fs.existsSync(source);
  const destinationExists = fs.existsSync(destination);
  const current = sourceExists && destinationExists && digest(source) === digest(destination);
  return {source, destination, sourceExists, destinationExists, current};
}

function makeCheckResult(options, kit, database) {
  const settingsExists = fs.existsSync(database);
  const runningPids = borumiProcesses();
  const result = {
    ok: true,
    mode: "check",
    platform: process.platform,
    platformSupported: process.platform === "darwin",
    repoRoot: options.repoRoot,
    kit: {
      presetsFile: kit.presetsFile,
      manifestFile: kit.manifestFile,
      presetCount: kit.count,
      expectedPresetCount: EXPECTED_PRESET_COUNT,
    },
    borumi: {
      app: detectBorumiApp(),
      running: runningPids.length > 0,
      pids: runningPids,
      settingsDb: database,
      settingsDbExists: settingsExists,
    },
    font: inspectFont(path.join(options.repoRoot, KIT_FONT_RELATIVE), options.fontDir),
    skill: syncSkill(path.join(options.repoRoot, KIT_SKILL_RELATIVE), options.codeHome, false),
    readOnly: true,
  };
  if (!settingsExists) {
    result.instructions = ["settings.db manque : lancez Borumi une fois, puis quittez-le, et relancez --install."];
    return result;
  }
  result.database = {integrity: integrityCheck(database), favoritePresetCount: readFavoritePresets(database).length};
  if (runningPids.length) result.instructions = ["Borumi est ouvert ; --check reste sans écriture. Fermez-le avant --install."];
  return result;
}

function install(options, kit, database) {
  if (process.platform !== "darwin") throw new Error("L’installation du kit Borumi est prise en charge sur macOS uniquement.");
  if (!fs.existsSync(database)) {
    throw new Error(`settings.db introuvable : ${database}. Lancez Borumi une fois, quittez-le, puis relancez --install.`);
  }
  ensureBorumiClosed();
  const beforeIntegrity = integrityCheck(database);
  const existing = readFavoritePresets(database);
  const merged = mergePresets(existing, kit.presets);
  const backup = backupDatabase(database);
  writeFavoritePresets(database, merged);
  const afterIntegrity = integrityCheck(database);
  const after = readFavoritePresets(database);
  const font = installFont(path.join(options.repoRoot, KIT_FONT_RELATIVE), options.fontDir);
  const skill = syncSkill(path.join(options.repoRoot, KIT_SKILL_RELATIVE), options.codeHome, true);
  return {
    ok: true,
    mode: "install",
    platform: process.platform,
    repoRoot: options.repoRoot,
    database: {
      settingsDb: database,
      backup,
      beforeIntegrity,
      afterIntegrity,
      existingPresetCount: existing.length,
      kitPresetCount: kit.presets.length,
      installedPresetCount: after.length,
    },
    font,
    skill,
    readOnly: false,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const kit = validateKit(options.repoRoot);
  const database = resolveSettingsDb(options.settingsDb);
  if (options.mode === "install") return install(options, kit, database);
  return makeCheckResult(options, kit, database);
}

try {
  process.stdout.write(`${JSON.stringify(main(), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ok: false, error: error.message})}\n`);
  process.exitCode = 1;
}
