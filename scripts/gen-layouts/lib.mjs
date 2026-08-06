// Générateur de layouts MEG — bibliothèque partagée.
// Chaque famille déclare des specs ; emit() produit le document HyperFrames
// complet : contrat data-*, hf-id uniques, IIFE anti-collision, timeline GSAP.
//
// CONVENTION v2 (drag & drop pur) : contrairement à meg-face-proof-split-t04
// (contrat appelé côté hôte), chaque bloc layout pilote LUI-MÊME le master
// `#meg-master-frame` : recadrage animé à l'entrée (fromTo depuis le plein
// cadre), restauration plein cadre à la sortie (duration-.42). Poser le bloc
// sur la piste 2 suffit — aucun JS hôte à écrire. Deux layouts ne se
// chevauchent jamais sur la même piste, la restauration en sortie garantit
// que le bloc suivant repart d'un master propre.
//
// Pièges GSAP gravés (linter gsap_css_transform_conflict) :
// - JAMAIS de transform en CSS sur un élément tweené : état initial posé par
//   gsap.set ou par le `from` d'un fromTo, toujours en px.
// - Les rotations décoratives passent par gsap.set (elles composent avec les
//   tweens x/y car GSAP possède tout l'état transform).

import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const PAL = {
  creme: "#FFFCD6",
  clair: "#FFFEEC",
  encre: "#2F2C00",
  sombre: "#3B3B3B",
  or: "#B9AA02",
  pop: "#FFF3AE",
  rouge: "#EC4046",
};
export const GRAD_CARTE = "linear-gradient(158deg,#FFFEEC 0%,#FFFCD6 52%,#F4E9A8 100%)";
export const GRAD_SOMBRE = "linear-gradient(180deg,#3B3B3B 0%,#2F2C00 100%)";
export const HACHURE = "repeating-linear-gradient(-45deg,#ece9cc 0 18px,#fffcd6 18px 36px)";
export const HACHURE_SOMBRE = "repeating-linear-gradient(-45deg,rgba(47,44,0,.16) 0 18px,rgba(47,44,0,.06) 18px 36px)";

export const FONT_CSS =
  "@font-face{font-family:'Clash Grotesk MEG';src:url('assets/ClashGrotesk-Variable.woff2') format('woff2');font-weight:200 700;font-style:normal;font-display:block}";

export const RATIOS = {
  reel: { w: 1080, h: 1920, marge: 46, radius: 34, resolution: "portrait" },
  yt: { w: 1920, h: 1080, marge: 40, radius: 30, resolution: "landscape" },
};

// Préfixe hf-id : hash du nom → 4 caractères base36, collisions vérifiées.
const usedPrefixes = new Map();
export function hfPrefix(name) {
  let h = 5381;
  for (const c of name) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  let p = h.toString(36).slice(0, 4).padStart(4, "0");
  while (usedPrefixes.has(p) && usedPrefixes.get(p) !== name) {
    h = (h + 7919) >>> 0;
    p = h.toString(36).slice(0, 4).padStart(4, "0");
  }
  usedPrefixes.set(p, name);
  return p;
}

// Injecte data-hf-id sur chaque balise ouvrante (sauf style/script), en
// respectant les balises déjà porteuses.
export function injectHfIds(html, prefix, startAt = 1) {
  let n = startAt;
  return html.replace(/<([a-z][a-z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/gi, (m, tag, attrs) => {
    if (/^(style|script)$/i.test(tag)) return m;
    if (/data-hf-id=/.test(attrs)) return m;
    return `<${tag} data-hf-id="hf-${prefix}${(n++).toString(36)}"${attrs}>`;
  });
}

// Snippet JS : pilotage du master. geom = {x,y,w,h,r} en px bloc.
// mode 'move'  → recadrage animé + restauration en sortie.
// mode 'hide'  → master masqué pendant le bloc (layouts détourés : le visage
//                vient d'un asset alpha posé dans la zone silhouette).
// mode 'none'  → master intact (habillages, titres, overlays).
export function masterScript({ mode = "move", geom, W, H, dur, bias = null, standaloneSel = ".standalone-face" }) {
  if (mode === "none") return "";
  const exitAt = Math.max(0.5, dur - 0.42).toFixed(2);
  const endAt = dur.toFixed(2);
  if (mode === "hide") {
    const backAt = Math.max(0.3, dur - 0.1).toFixed(2);
    return `
      const master=document.querySelector('#meg-master-frame');
      if(master){
        /* Le visage de ce layout vient d'un asset ALPHA (fond vert détouré)
           posé à la place de la silhouette : fondu sortant rapide du master
           brut à l'entrée, fondu de retour en sortie. Le fromTo part de
           l'état naturel (visible) : rien ne fuit hors de la fenêtre du bloc.
           z-index 2 pendant le bloc : le master fond AU-DESSUS du fond de
           scène crème (z1), jamais coupé net par lui. */
        tl.set(master,{zIndex:2},0)
          .fromTo(master,{autoAlpha:1},{autoAlpha:0,duration:.16,ease:'power2.in'},0)
          .to(master,{autoAlpha:1,duration:.1,ease:'power2.out'},${backAt})
          .set(master,{clearProps:'zIndex'},${endAt});
      }`;
  }
  const g = geom;
  const biasJs = bias
    ? `
        /* Biais visage : pendant le recadrage, la fenêtre cover vise le haut
           du rush (le visage), pas le centre géométrique. Valeur d'origine
           restaurée en sortie — le bloc suivant repart d'un master intact. */
        const vid=master.querySelector('video,img');
        if(vid){
          const op0=vid.style.objectPosition||getComputedStyle(vid).objectPosition||'50% 50%';
          tl.set(vid,{objectPosition:'${bias}'},0).set(vid,{objectPosition:op0},${endAt});
        }`
    : "";
  return `
      const master=document.querySelector('#meg-master-frame');
      if(master){
        /* Drag & drop pur : le bloc recadre le master lui-même. Entrée depuis
           le plein cadre, sortie qui LE RESTAURE — le bloc suivant repart
           toujours d'un master plein cadre. z-index 2 pendant le bloc : le
           master passe AU-DESSUS du fond de scène crème (z1) et SOUS les
           cartes du bloc (z3+). */
        tl.set(master,{zIndex:2},0)
          .fromTo(master,{x:0,y:0,width:${W},height:${H},borderRadius:0},
          {x:${g.x},y:${g.y},width:${g.w},height:${g.h},borderRadius:${g.r},duration:.42,ease:'power3.out'},0)
          .to(master,{x:0,y:0,width:${W},height:${H},borderRadius:0,duration:.42,ease:'power3.in'},${exitAt})
          .set(master,{clearProps:'zIndex'},${endAt});${biasJs}
      }else{
        const sa=root.querySelector('${standaloneSel}');
        if(sa){sa.style.display='flex';tl.fromTo(sa,{opacity:0},{opacity:1,duration:.42,ease:'power2.out'},0);}
      }`;
}

// CSS de la zone standalone (aperçu sans master) posée à la géométrie visage.
export function standaloneCss(sel, g, extra = "") {
  return `${sel} .standalone-face{display:none;position:absolute;z-index:2;left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-radius:${g.r}px;background:${GRAD_SOMBRE};color:#FFFCD6;align-items:center;justify-content:center;text-align:center;font-size:40px;font-weight:700;letter-spacing:-.02em;line-height:1.15;${extra}}`;
}
export function standaloneHtml(label = "MASTER CONTINU<br>RECADRÉ ICI") {
  return `<div class="standalone-face" data-layout-allow-occlusion="">${label}</div>`;
}

// Zone écran placeholder — le cœur du drag & drop : on remplace le contenu
// hachuré par la capture/démo, le cadre et l'animation restent.
export function ecranCss(sel, opts = {}) {
  const { fontSize = 40, sub = true } = opts;
  return `
${sel} .ecran{position:absolute;z-index:3;box-sizing:border-box;border:7px solid #fffcd6;border-radius:34px;background:${HACHURE};box-shadow:0 34px 78px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:${PAL.encre};overflow:hidden;opacity:0}
${sel} .ecran.bord{border:0;border-radius:0;box-shadow:none}
${sel} .ecran .etiquette{padding:12px 26px;border-radius:22px;background:${PAL.encre};color:${PAL.creme};font-size:${fontSize}px;font-weight:700;letter-spacing:.05em}
${sub ? `${sel} .ecran .sous{font-size:${Math.round(fontSize * 0.72)}px;font-weight:600;opacity:.62;letter-spacing:-.01em}` : ""}
${sel} .ecran .barre{position:absolute;left:0;top:0;right:0;display:flex;align-items:center;gap:14px;height:88px;padding:0 26px;background:${PAL.creme};border-bottom:2px solid rgba(47,44,0,.10)}
${sel} .ecran .pastille{width:16px;height:16px;border-radius:50%;background:rgba(47,44,0,.18)}
${sel} .ecran .url{flex:1;min-width:0;margin-left:8px;padding:11px 24px;border-radius:999px;background:${PAL.clair};color:${PAL.encre};font-size:28px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`;
}

export function ecranDiv({ x, y, w, h, label = "ÉCRAN — REMPLACER", sub = "capture, démo, document", nav = false, bord = false, extraClass = "", extraStyle = "" }) {
  const cls = ["ecran", nav ? "nav" : "", bord ? "bord" : "", extraClass].filter(Boolean).join(" ");
  const pos = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;${nav ? "padding-top:88px;" : ""}${extraStyle}`;
  const barre = nav
    ? `<div class="barre"><span class="pastille"></span><span class="pastille"></span><span class="pastille"></span><span class="url">megbusiness360.com</span></div>`
    : "";
  return `<div class="${cls}" style="${pos}" data-layout-allow-occlusion="">${barre}<span class="etiquette">${label}</span>${sub ? `<span class="sous">${sub}</span>` : ""}</div>`;
}

// Silhouette détourée (fond vert) — placeholder à remplacer par l'asset alpha.
export function silhouetteCss(sel) {
  return `
${sel} .silhouette{position:absolute;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:30px;opacity:0}
${sel} .silhouette svg{width:100%;height:auto;display:block}
${sel} .silhouette .tag{margin-top:-8px;padding:11px 24px;border-radius:20px;background:${PAL.encre};color:${PAL.creme};font-size:30px;font-weight:700;letter-spacing:.04em;white-space:nowrap;max-width:calc(100% - 8px);overflow:hidden;text-overflow:ellipsis}`;
}
export function silhouetteDiv({ x, y, w, h, tag = "VISAGE DÉTOURÉ (alpha)" }) {
  // Buste simple tracé : tête + épaules, hachures encre, liseré pointillé.
  return `<div class="silhouette" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" data-layout-allow-occlusion="" data-qa-allow-bleed="">
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs><pattern id="hachure-sil" width="14" height="14" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="rgba(47,44,0,.10)"></rect><rect width="7" height="14" fill="rgba(47,44,0,.20)"></rect></pattern></defs>
      <path d="M100 18a44 44 0 0 1 44 44v14a44 44 0 0 1-15 33c34 12 57 38 63 74l4 57H4l4-57c6-36 29-62 63-74a44 44 0 0 1-15-33v-14a44 44 0 0 1 44-44z" fill="url(#hachure-sil)" stroke="rgba(47,44,0,.55)" stroke-width="4" stroke-dasharray="14 10"></path>
    </svg>
    <span class="tag">${tag}</span>
  </div>`;
}

// Bande visage pleine largeur (jamais de PIP coin — règle MEG).
export function faceBandGeom(RA, pos, bandH) {
  const { w, h } = RA;
  return pos === "bas" ? { x: 0, y: h - bandH, w, h: bandH, r: 0 } : { x: 0, y: 0, w, h: bandH, r: 0 };
}

// ————— Émission d'un bloc —————
export function emit(spec) {
  const {
    name, title, desc, tags = [], family, familyTitle, variant,
    ratio, duration, comment, css, html, script, posterAt = 1.2,
    needsFont = true, logoVariant = null, faceGeom = null, faceMode = "move", master = null,
    fond = true, faceBias = null,
  } = spec;
  const RA = RATIOS[ratio];
  const compId = name.replace(/^meg-/, "");
  const rootId = `${compId}-root`;
  const prefix = hfPrefix(name);
  const R = `#${rootId}`;

  const faceAttrs = faceGeom
    ? ` data-face-x="${faceGeom.x}" data-face-y="${faceGeom.y}" data-face-w="${faceGeom.w}" data-face-h="${faceGeom.h}" data-face-r="${faceGeom.r}" data-face-mode="${faceMode}"`
    : faceMode === "hide" ? ` data-face-mode="alpha"` : "";

  // Biais visage auto : une bande horizontale dans un rush portrait doit viser
  // le tiers visage (et non le haut du rush). Pour un master Large, le sujet
  // reste centré verticalement. Surchargeable par bloc, désactivable (false).
  let bias = faceBias === false ? null : faceBias;
  if (bias == null && faceBias !== false && faceGeom) {
    const scale = Math.max(faceGeom.w / RA.w, faceGeom.h / RA.h);
    const visH = faceGeom.h / scale / RA.h;
    bias = RA.w > RA.h
      ? (visH < 0.96 ? "50% 50%" : null)
      : visH < 0.4 ? "50% 38%" : visH < 0.75 ? "50% 36%" : visH < 0.96 ? "50% 32%" : null;
  }

  // Fond de scène crème : dès que le master quitte le plein cadre (move) ou
  // disparaît (hide), le hors-zone doit être crème MEG, jamais le noir du
  // studio. z1 sous le master (z2) et les cartes (z3+).
  const withFond = fond !== false && (faceGeom !== null || faceMode === "hide");
  const fondCss = withFond ? `${R} .fond-scene{position:absolute;inset:0;z-index:1;background:${GRAD_CARTE}}\n      ` : "";
  const fondHtml = withFond ? `<div class="fond-scene" data-layout-allow-occlusion=""></div>\n    ` : "";

  const scopedCss = fondCss + css.replaceAll("%R%", R).trim();
  const bodyHtml = injectHfIds(fondHtml + html.replaceAll("%R%", R).trim(), prefix);

  const masterJs = master === null
    ? masterScript({ mode: faceGeom ? "move" : faceMode === "hide" ? "hide" : "none", geom: faceGeom, W: RA.w, H: RA.h, dur: duration, bias })
    : master;

  const doc = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${RA.w},height=${RA.h}">
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>html,body{margin:0;width:100%;height:100%;overflow:hidden}*{box-sizing:border-box}</style>
</head>
<body>
<!-- ${comment.trim().split("\n").map((l) => l.trim()).join("\n     ")} -->
<div data-hf-id="hf-${prefix}0" id="${rootId}" data-composition-id="${compId}" data-start="0" data-duration="${duration}" data-width="${RA.w}" data-height="${RA.h}"${faceAttrs}>
    <style>
      ${needsFont ? FONT_CSS + "\n      " : ""}${R}{position:relative;width:100%;height:100%;overflow:hidden;font-family:${needsFont ? "'Clash Grotesk MEG'," : ""}sans-serif}
      ${scopedCss}
    </style>
    ${bodyHtml}
    <script>
      window.__timelines=window.__timelines||{};
      (()=>{
      const root=document.querySelector('#${rootId}');
      const tl=gsap.timeline({paused:true});
      ${masterJs.trim()}
      ${script.replaceAll("%R%", R).trim()}
      window.__timelines['${compId}']=tl;
      })();
    </script>
  </div>
</body>
</html>
`.replace(/[ \t]+$/gm, "");

  return {
    name, doc, posterAt, ratio, duration, needsFont, logoVariant,
    manifest: {
      $schema: "https://hyperframes.heygen.com/schema/registry-item.json",
      name,
      type: "hyperframes:block",
      title,
      description: desc,
      tags: ["meg", ratio === "reel" ? "meg-reel" : "meg-large", ...tags],
      family,
      familyTitle,
      variant,
      dimensions: { width: RA.w, height: RA.h },
      duration,
      files: [
        { path: `${name}.html`, target: `compositions/${name}.html`, type: "hyperframes:composition" },
        ...(needsFont
          ? [{ path: "assets/ClashGrotesk-Variable.woff2", target: "assets/ClashGrotesk-Variable.woff2", type: "hyperframes:asset" }]
          : []),
        ...(logoVariant
          ? [{ path: `assets/meg-logo-${logoVariant}.png`, target: `assets/meg-logo-${logoVariant}.png`, type: "hyperframes:asset" }]
          : []),
      ],
      preview: { poster: "preview.jpg", video: "preview.mp4" },
    },
  };
}

export function writeBlock(blocksRoot, fontPath, logoPaths, block) {
  const dir = join(blocksRoot, block.name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${block.name}.html`), block.doc);
  writeFileSync(join(dir, "registry-item.json"), JSON.stringify(block.manifest, null, 2) + "\n");
  if (block.needsFont) {
    const assets = join(dir, "assets");
    mkdirSync(assets, { recursive: true });
    if (!existsSync(join(assets, "ClashGrotesk-Variable.woff2"))) {
      copyFileSync(fontPath, join(assets, "ClashGrotesk-Variable.woff2"));
    }
  }
  if (block.logoVariant) {
    const source = logoPaths[block.logoVariant];
    if (!source || !existsSync(source)) {
      throw new Error(`Logo MEG ${block.logoVariant} introuvable`);
    }
    const assets = join(dir, "assets");
    mkdirSync(assets, { recursive: true });
    copyFileSync(source, join(assets, `meg-logo-${block.logoVariant}.png`));
  }
}
