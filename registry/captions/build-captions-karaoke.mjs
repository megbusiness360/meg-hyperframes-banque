#!/usr/bin/env node
/* Pipeline captions karaoké MEG.
 *
 * Entrée  : transcript.json (tokens Whisper [{text,start,end}]) — de
 *           préférence les tokens CORRIGÉS après alignement master A
 *           (voir skill meg-video-montage, jamais l'ASR brut en prod).
 * Sortie  : captions-karaoke.json — groupes de 3-4 mots avec fenêtres
 *           par mot, consommable par les blocs meg-captions-karaoke-*.
 *
 * Applique dictionnaire-metier.json : corrections de forme uniquement
 * (casse, sigles, marques). Jamais d'insertion ni de suppression de mot.
 *
 * Usage : node build-captions-karaoke.mjs <transcript.json> [sortie.json]
 *         [--max-mots 4] [--max-duree 2.2] [--pause 0.55]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const files = args.filter((a, i) => !a.startsWith("--") && (i === 0 || !args[i - 1].startsWith("--")));
if (!files[0]) { console.error("Usage: build-captions-karaoke.mjs <transcript.json> [sortie.json]"); process.exit(1); }

const MAX_MOTS = Number(opt("max-mots", "4"));
const MAX_DUREE = Number(opt("max-duree", "2.2"));
const PAUSE = Number(opt("pause", "0.55")); // silence qui force une coupure de groupe

const dico = JSON.parse(readFileSync(join(HERE, "dictionnaire-metier.json"), "utf8"));
const corrections = new Map(Object.entries(dico.corrections).map(([k, v]) => [k.toLowerCase(), v]));

const brut = JSON.parse(readFileSync(resolve(files[0]), "utf8"));
const tokens = (Array.isArray(brut) ? brut : brut.tokens || brut.words || [])
  .filter(t => t && typeof t.text === "string" && t.text.trim())
  .map(t => ({ text: t.text.trim(), start: Number(t.start), end: Number(t.end) }));
if (!tokens.length) { console.error("Aucun token exploitable."); process.exit(1); }

/* Correction de forme : mot par mot puis bigrammes (ex. « mon compte formation »). */
const corrige = (mot) => {
  const nu = mot.toLowerCase().replace(/[.,!?;:]+$/, "");
  const ponct = mot.slice(nu.length ? mot.toLowerCase().lastIndexOf(nu) + nu.length : mot.length);
  return corrections.has(nu) ? corrections.get(nu) + ponct : mot;
};
for (const t of tokens) t.text = corrige(t.text);
for (let i = 0; i < tokens.length - 2; i++) {
  const tri = `${tokens[i].text} ${tokens[i + 1].text} ${tokens[i + 2].text}`.toLowerCase();
  if (corrections.has(tri)) {
    const [a, b, c] = corrections.get(tri).split(" ");
    if (c) { tokens[i].text = a; tokens[i + 1].text = b; tokens[i + 2].text = c; }
  }
}

/* Groupage : 3-4 mots, coupé par pause, durée max, ou ponctuation forte. */
const groupes = [];
let cur = [];
const flush = () => { if (cur.length) { groupes.push(cur); cur = []; } };
for (let i = 0; i < tokens.length; i++) {
  const t = tokens[i];
  const prev = tokens[i - 1];
  if (cur.length && prev && (t.start - prev.end >= PAUSE)) flush();
  if (cur.length && (t.end - cur[0].start > MAX_DUREE)) flush();
  cur.push(t);
  if (cur.length >= MAX_MOTS || /[.!?]$/.test(t.text)) flush();
}
flush();

const sortie = {
  regle: "Un groupe = une ligne, 3-4 mots, ancre basse liée au visage, Clash Grotesk Semibold. Le mot actif passe sur pastille or #B9AA02 encre #2F2C00 pendant sa fenêtre [start,end].",
  groupes: groupes.map(g => ({
    start: g[0].start,
    end: g[g.length - 1].end,
    texte: g.map(t => t.text).join(" "),
    mots: g.map(t => ({ texte: t.text, start: t.start, end: t.end })),
  })),
};
const dst = resolve(files[1] || files[0].replace(/\.json$/, "") + ".captions-karaoke.json");
writeFileSync(dst, JSON.stringify(sortie, null, 2));
console.log(JSON.stringify({ groupes: sortie.groupes.length, mots: tokens.length, sortie: dst }));
