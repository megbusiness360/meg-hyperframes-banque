// Runner du générateur de layouts — écrit chaque bloc dans registry/blocks/
// puis reconstruit registry/registry.json en DEUX partitions :
//   « MEG - Reel »  (couverture meg-catalogue-reel puis tous les 1080×1920)
//   « MEG - Large » (couverture meg-catalogue-large puis tous les 1920×1080)
// Chaque bloc (générés ET socle) porte le tag de son catalogue
// (meg-reel / meg-large) — la recherche du studio filtre dessus.
// Usage : node scripts/gen-layouts/index.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeBlock } from "./lib.mjs";
import { reelBlocks } from "./reel.mjs";
import { ytBlocks } from "./yt.mjs";
import { animBlocks } from "./anims.mjs";
import { motionBlocks } from "./motion.mjs";
import { catalogueBlocks } from "./catalogues.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const blocksRoot = join(racine, "registry", "blocks");
const registryPath = join(racine, "registry", "registry.json");
const logoPaths = {
  dark: join(racine, "scripts", "gen-layouts", "assets", "meg-logo-dark.png"),
  light: join(racine, "scripts", "gen-layouts", "assets", "meg-logo-light.png"),
};
for (const [variant, path] of Object.entries(logoPaths)) {
  if (!existsSync(path)) throw new Error(`Logo MEG officiel ${variant} introuvable`);
}
// Icône/favicon officielle MEG (3 traits, PAS le wordmark) — asset distinct
// du logo texte, copié depuis les sources canon confirmées visuellement
// (voir vault wiki/concepts/logo-meg-assets-canon.md, 06/08/2026).
const iconPaths = {
  light: join(racine, "scripts", "gen-layouts", "assets", "meg-icon-light.png"),
  dark: join(racine, "scripts", "gen-layouts", "assets", "meg-icon-dark.png"),
};
for (const [variant, path] of Object.entries(iconPaths)) {
  if (!existsSync(path)) throw new Error(`Icône MEG officielle ${variant} introuvable`);
}

// Blocs retirés du registre (dépréciation validée) — le dossier est supprimé
// par git, cette liste empêche toute résurrection à la régénération.
const DEPRECIES = new Set(["meg-catalog-preview"]);

// Police : copiée depuis un bloc existant déjà validé.
const fontCandidates = [
  "meg-captions-middle", "meg-steps-timeline", "meg-face-full", "meg-quote-card",
].map((b) => join(blocksRoot, b, "assets", "ClashGrotesk-Variable.woff2"));
const fontPath = fontCandidates.find((p) => existsSync(p));
if (!fontPath) throw new Error("Police ClashGrotesk-Variable.woff2 introuvable dans les blocs existants");

const all = [...catalogueBlocks, ...reelBlocks, ...ytBlocks, ...animBlocks, ...motionBlocks];

// Garde-fou : unicité des noms générés.
const vus = new Set();
for (const b of all) {
  if (vus.has(b.name)) throw new Error(`Nom généré en double : ${b.name}`);
  vus.add(b.name);
}

for (const b of all) writeBlock(blocksRoot, fontPath, logoPaths, iconPaths, b);

// ——— Reconstruction du registre en deux partitions ———
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const noms = new Set(registry.items.map((i) => i.name));
for (const b of all) if (!noms.has(b.name)) registry.items.push({ name: b.name, type: "hyperframes:block" });

// Taxonomie dynamique du Studio. Chaque bloc porte :
// - exactement un format : meg-reel ou meg-large ;
// - exactement un dossier, spécifique au format, par exemple
//   meg-reel-folder-intros ou meg-youtube-folder-preuves.
// Le Studio peut ainsi reconstruire les deux banques et leurs dossiers à
// chaque lecture de Git, sans liste figée ni rangement manuel.
const TAGS_DOSSIERS = [
  "apercus", "intros", "ecran-visage", "detourage", "preuves",
  "motion-texte", "transitions", "chapitres", "cta-outros", "habillages",
];

function dossierDe(manifest) {
  const tags = new Set(Array.isArray(manifest.tags) ? manifest.tags : []);
  const a = (...valeurs) => valeurs.some((valeur) => tags.has(valeur));
  const nom = manifest.name ?? "";
  if (a("catalogue")) return "apercus";
  if (a("transition") || nom.includes("transition")) return "transitions";
  if (a("habillage")) return "habillages";
  if (a("intro", "hook")) return "intros";
  if (a("chapitre")) return "chapitres";
  if (a("cta", "outro")) return "cta-outros";
  if (a("detoure", "detourage", "fond-vert", "corps-detoure")) return "detourage";
  if (a("preuve", "preuve-sociale", "temoignage", "logos", "broll", "demo", "plan-de-coupe")) return "preuves";
  if (a(
    "motion", "typo-cinetique", "mot-cle", "sous-titres", "captions", "caption",
    "data", "stat", "compteur", "checklist", "liste", "frise", "process",
    "callout", "lower-third", "accent", "effet",
  )) return "motion-texte";
  return "ecran-visage";
}

function estTagDossier(tag) {
  return TAGS_DOSSIERS.some((dossier) =>
    tag === `meg-reel-folder-${dossier}` || tag === `meg-youtube-folder-${dossier}`,
  );
}

// Dimensions + patch idempotent des tags catalogue sur CHAQUE manifest
// (y compris les blocs socle non générés).
function catalogueDe(item) {
  const manifestPath = join(blocksRoot, item.name, "registry-item.json");
  if (!existsSync(manifestPath)) throw new Error(`Manifest introuvable : ${item.name}`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const { width = 0, height = 0 } = manifest.dimensions ?? {};
  const cat = height >= width ? "meg-reel" : "meg-large";
  const formatDossier = cat === "meg-reel" ? "reel" : "youtube";
  const tagDossier = `meg-${formatDossier}-folder-${dossierDe(manifest)}`;
  const tags = Array.isArray(manifest.tags) ? manifest.tags : [];
  const propres = tags.filter((t) =>
    t !== "meg-reel" && t !== "meg-large" && !estTagDossier(t),
  );
  const attendu = [...propres, cat, tagDossier];
  if (JSON.stringify(tags) !== JSON.stringify(attendu)) {
    manifest.tags = attendu;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }
  return cat;
}

const items = registry.items.filter((i) => !DEPRECIES.has(i.name));
const couvReel = items.find((i) => i.name === "meg-catalogue-reel");
const couvLarge = items.find((i) => i.name === "meg-catalogue-large");
const reel = [], large = [];
for (const item of items) {
  if (item === couvReel || item === couvLarge) continue;
  (catalogueDe(item) === "meg-reel" ? reel : large).push(item);
}
catalogueDe(couvReel); catalogueDe(couvLarge);
registry.items = [couvReel, ...reel, couvLarge, ...large];

writeFileSync(registryPath, JSON.stringify(registry, null, 2)
  .replace(/\{\n\s+"name": "([^"]+)",\n\s+"type": "([^"]+)"\n\s+\}/g, '{"name":"$1","type":"$2"}') + "\n");

console.log(`Blocs écrits : ${all.length} (reel ${reelBlocks.length}, yt ${ytBlocks.length}, anims ${animBlocks.length}, motion ${motionBlocks.length}, catalogues ${catalogueBlocks.length})`);
console.log(`Registre : ${registry.items.length} items — MEG - Reel : ${reel.length + 1}, MEG - Large : ${large.length + 1}`);
