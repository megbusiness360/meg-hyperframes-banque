// Runner du générateur de layouts — écrit chaque bloc dans registry/blocks/
// et ajoute les entrées manquantes à registry/registry.json.
// Usage : node scripts/gen-layouts/index.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeBlock } from "./lib.mjs";
import { reelBlocks } from "./reel.mjs";
import { ytBlocks } from "./yt.mjs";
import { animBlocks } from "./anims.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const blocksRoot = join(racine, "registry", "blocks");
const registryPath = join(racine, "registry", "registry.json");

// Police : copiée depuis un bloc existant déjà validé.
const fontCandidates = [
  "meg-captions-middle", "meg-steps-timeline", "meg-face-full", "meg-quote-card",
].map((b) => join(blocksRoot, b, "assets", "ClashGrotesk-Variable.woff2"));
const fontPath = fontCandidates.find((p) => existsSync(p));
if (!fontPath) throw new Error("Police ClashGrotesk-Variable.woff2 introuvable dans les blocs existants");

const all = [...reelBlocks, ...ytBlocks, ...animBlocks];

// Garde-fous : unicité des noms générés ; regénération idempotente (les
// fichiers sont réécrits, le registre n'est complété que des manquants).
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const existants = new Set(registry.items.map((i) => i.name));
const vus = new Set();
for (const b of all) {
  if (vus.has(b.name)) throw new Error(`Nom généré en double : ${b.name}`);
  vus.add(b.name);
}

for (const b of all) writeBlock(blocksRoot, fontPath, b);

for (const b of all) if (!existants.has(b.name)) registry.items.push({ name: b.name, type: "hyperframes:block" });
writeFileSync(registryPath, JSON.stringify(registry, null, 2)
  .replace(/\{\n\s+"name": "([^"]+)",\n\s+"type": "([^"]+)"\n\s+\}/g, '{"name":"$1","type":"$2"}') + "\n");

console.log(`Blocs écrits : ${all.length} (reel ${reelBlocks.length}, yt ${ytBlocks.length}, anims ${animBlocks.length})`);
console.log(`Registre : ${registry.items.length} items`);
