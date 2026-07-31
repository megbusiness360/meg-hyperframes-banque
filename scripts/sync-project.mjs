#!/usr/bin/env node

import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const REGISTRY_URL =
  process.env.MEG_HYPERFRAMES_REGISTRY_URL ??
  "https://raw.githubusercontent.com/megbusiness360/meg-hyperframes-banque/main/registry";
const CONFIG_SCHEMA = "https://hyperframes.heygen.com/schema/hyperframes.json";

function usage() {
  console.error("Usage: node scripts/sync-project.mjs <chemin-projet-hyperframes>");
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Registry inaccessible (${response.status}) : ${url}`);
  }
  return response.json();
}

async function readConfig(configPath) {
  if (!(await exists(configPath))) return {};
  return JSON.parse(await readFile(configPath, "utf8"));
}

async function main() {
  const projectPath = resolve(process.argv[2] ?? "");
  if (!process.argv[2]) {
    usage();
    process.exitCode = 2;
    return;
  }
  if (!(await exists(resolve(projectPath, "index.html")))) {
    throw new Error(`Projet HyperFrames invalide : ${projectPath}`);
  }

  const configPath = resolve(projectPath, "hyperframes.json");
  const previousConfig = await readConfig(configPath);
  const nextConfig = {
    $schema: previousConfig.$schema ?? CONFIG_SCHEMA,
    ...previousConfig,
    registry: REGISTRY_URL,
    paths: {
      blocks: "compositions",
      components: "compositions/components",
      assets: "assets",
      ...(previousConfig.paths ?? {}),
    },
  };
  if (JSON.stringify(previousConfig) !== JSON.stringify(nextConfig)) {
    await writeFile(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`);
  }

  const registry = await fetchJson(`${REGISTRY_URL}/registry.json`);
  const blockNames = registry.items
    .filter((item) => item.type === "hyperframes:block")
    .map((item) => item.name);

  const installed = [];
  const preserved = [];
  for (const name of blockNames) {
    const item = await fetchJson(`${REGISTRY_URL}/blocks/${name}/registry-item.json`);
    const compositionTargets = item.files
      .filter((file) => file.type === "hyperframes:composition")
      .map((file) => resolve(projectPath, file.target));
    if (compositionTargets.length > 0 && (await Promise.all(compositionTargets.map(exists))).every(Boolean)) {
      preserved.push(name);
      continue;
    }

    await execFileAsync(
      "npx",
      ["--yes", "hyperframes", "add", name, "--dir", projectPath, "--no-clipboard", "--json"],
      { timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
    );
    installed.push(name);
  }

  console.log(JSON.stringify({
    registry: REGISTRY_URL,
    project: projectPath,
    available: blockNames.length,
    installed,
    preserved: preserved.length,
  }));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
