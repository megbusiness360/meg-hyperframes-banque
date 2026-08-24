#!/usr/bin/env node

/** Delegate to the versioned overlay renderer, wherever the repository was cloned. */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const marker = path.resolve(scriptDirectory, "..", ".repo-root");
const markerRoot = fs.existsSync(marker) ? fs.readFileSync(marker, "utf8").trim() : null;
const candidates = [
  process.env.MEG_HYPERFRAMES_BANQUE,
  markerRoot,
  path.resolve(scriptDirectory, "../../.."),
  process.cwd(),
  path.join(os.homedir(), "Documents", "meg-hyperframes-banque"),
  path.join(os.homedir(), "meg-hyperframes-banque"),
].filter(Boolean);

const renderer = candidates
  .map((root) => path.join(path.resolve(root), "borumi", "scripts", "render-overlay.mjs"))
  .find((candidate) => fs.existsSync(candidate));

if (!renderer) {
  throw new Error("Renderer overlay Borumi introuvable. Réinstallez le kit ou définissez MEG_HYPERFRAMES_BANQUE vers le dépôt cloné.");
}

const result = spawnSync(process.execPath, [renderer, ...process.argv.slice(2)], {stdio: "inherit"});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
