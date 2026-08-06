// Familles 9:16 (Reels/Shorts) — 100 layouts.
// Grille : marge 46, couture 22, rayon 34, liseré crème 7 px (héritée de
// meg-face-proof-split-t04). Le visage = master hôte recadré par le bloc
// lui-même (convention v2, voir lib.mjs).

import {
  PAL, GRAD_CARTE, GRAD_SOMBRE, HACHURE, HACHURE_SOMBRE,
  emit, ecranCss, ecranDiv, standaloneCss, standaloneHtml,
  silhouetteCss, silhouetteDiv,
} from "./lib.mjs";

const W = 1080, H = 1920, M = 46, SEAM = 30, R = 34;
const CW = W - 2 * M; // 988 — largeur utile carte

const cadreCss = (sel) =>
  `${sel} .face-cadre{position:absolute;z-index:5;border:7px solid #fffcd6;border-radius:${R}px;pointer-events:none;opacity:0}`;
const cadreDiv = (g) =>
  `<div class="face-cadre" style="left:${g.x - 7}px;top:${g.y - 7}px;width:${g.w + 14}px;height:${g.h + 14}px;"></div>`;

const entree = (dur, dirY = -70) => `
      tl.fromTo(root.querySelectorAll('.ecran'),{y:${dirY},opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:.5,ease:'power3.out',stagger:.12},.06)
        .to(root.querySelectorAll('.ecran'),{opacity:0,y:${dirY > 0 ? 44 : -44},duration:.35,ease:'power2.in'},${(dur - 0.4).toFixed(2)});
      const cadre=root.querySelector('.face-cadre');
      if(cadre)tl.fromTo(cadre,{opacity:0},{opacity:1,duration:.4,ease:'power2.out'},.2)
        .to(cadre,{opacity:0,duration:.3,ease:'power2.in'},${(dur - 0.38).toFixed(2)});`;

const DUR = 6;
const blocks = [];

/* ————— R1 · Visage + 1 écran (24 + 4 inclinés) ————— */
for (const pos of ["haut", "bas"]) {
  for (const part of [35, 45, 55, 65]) {
    for (const style of ["carte", "nav", "bord"]) {
      const bord = style === "bord";
      const screenH = bord ? Math.round(H * part / 100) - 3 : Math.round(H * part / 100) - M - SEAM / 2;
      const sx = bord ? 0 : M, sw = bord ? W : CW;
      let sy, face;
      if (pos === "haut") {
        sy = bord ? 0 : M;
        const fy = bord ? screenH + 6 : M + screenH + SEAM;
        face = { x: bord ? 0 : M, y: fy, w: sw, h: H - fy - (bord ? 0 : M), r: bord ? 0 : R };
      } else {
        sy = bord ? H - screenH : H - M - screenH;
        const fh = bord ? H - screenH - 6 : H - screenH - 2 * M - SEAM;
        face = { x: bord ? 0 : M, y: bord ? 0 : M, w: sw, h: fh, r: bord ? 0 : R };
      }
      const name = `meg-reel-ecran-${pos}-${part}-${style}`;
      const styleTxt = { carte: "carte crème", nav: "fenêtre navigateur", bord: "bord à bord" }[style];
      blocks.push(emit({
        name,
        title: `Reel — écran ${pos} ${part} % (${styleTxt})`,
        desc: `Split 9:16 : écran ${styleTxt} en ${pos} (${part} % de la hauteur), visage master recadré sur le reste. Drag & drop : le bloc pilote le master tout seul.`,
        tags: ["reel", "layout", "split", pos, style],
        family: "reel-split-solo",
        familyTitle: "Reels — splits visage + 1 écran",
        variant: `${pos} ${part} % ${styleTxt}`,
        ratio: "reel", duration: DUR,
        faceGeom: face,
        comment: `Layout Reel — écran ${pos} ${part} % (${styleTxt}).
Poser le bloc suffit : il recadre le master #meg-master-frame sur la zone
visage et le restaure plein cadre en sortie. Remplacer le contenu hachuré
de la zone écran par la capture/démo. Sous-titres : meg-captions-middle
se cale sur la couture.`,
        css: [
          ecranCss("%R%"),
          bord ? `%R% .couture{position:absolute;z-index:4;left:0;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}` : cadreCss("%R%"),
          standaloneCss("%R%", face),
        ].join("\n"),
        html: [
          ecranDiv({ x: sx, y: sy, w: sw, h: screenH, nav: style === "nav", bord }),
          bord ? `<div class="couture" style="top:${pos === "haut" ? screenH : H - screenH - 6}px;"></div>` : cadreDiv(face),
          standaloneHtml(),
        ].join("\n    "),
        script: entree(DUR, pos === "haut" ? -70 : 70),
      }));
    }
  }
}
for (const pos of ["haut", "bas"]) {
  for (const part of [45, 60]) {
    const screenH = Math.round(H * part / 100) - M - SEAM / 2;
    const sy = pos === "haut" ? M : H - M - screenH;
    const face = pos === "haut"
      ? { x: M, y: M + screenH + SEAM, w: CW, h: H - (M + screenH + SEAM) - M, r: R }
      : { x: M, y: M, w: CW, h: H - screenH - 2 * M - SEAM, r: R };
    const name = `meg-reel-ecran-${pos}-${part}-incline`;
    blocks.push(emit({
      name,
      title: `Reel — écran ${pos} ${part} % incliné`,
      desc: `Split 9:16 dynamique : carte écran légèrement inclinée (-2,5°) en ${pos}, visage master sur le reste.`,
      tags: ["reel", "layout", "split", pos, "incline"],
      family: "reel-split-solo",
      familyTitle: "Reels — splits visage + 1 écran",
      variant: `${pos} ${part} % incliné`,
      ratio: "reel", duration: DUR,
      faceGeom: face,
      comment: `Layout Reel — écran incliné (-2,5°), plus vivant qu'une carte droite.
L'inclinaison est posée par gsap.set (jamais de transform CSS : conflit
GSAP). Remplacer le contenu hachuré par la capture.`,
      css: [ecranCss("%R%"), cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
      html: [
        ecranDiv({ x: M + 18, y: sy, w: CW - 36, h: screenH, extraClass: "penche" }),
        cadreDiv(face),
        standaloneHtml(),
      ].join("\n    "),
      script: `
      gsap.set(root.querySelector('.penche'),{rotation:-2.5});
      ${entree(DUR, pos === "haut" ? -70 : 70)}`,
    }));
  }
}

/* ————— R2 · Visage + 2 écrans (16) ————— */
const duoArrs = {
  "pile-haut": { txt: "2 écrans empilés en haut", face: "bas" },
  "cote-haut": { txt: "2 écrans côte à côte en haut", face: "bas" },
  "sandwich": { txt: "écran haut + écran bas, visage au milieu", face: "milieu" },
  "pile-bas": { txt: "2 écrans empilés en bas", face: "haut" },
};
for (const [arr, meta] of Object.entries(duoArrs)) {
  for (const style of ["carte", "nav"]) {
    for (const emp of ["egal", "domine"]) {
      const nav = style === "nav";
      const gap = 28;
      let ecrans = [], face;
      if (arr === "pile-haut" || arr === "pile-bas") {
        const zoneH = Math.round(H * 0.55) - M - SEAM / 2;
        const h1 = emp === "egal" ? Math.round((zoneH - gap) / 2) : Math.round((zoneH - gap) * 0.62);
        const h2 = zoneH - gap - h1;
        const y0 = arr === "pile-haut" ? M : H - M - zoneH;
        ecrans = [
          { x: M, y: y0, w: CW, h: h1, label: "ÉCRAN 1 — REMPLACER" },
          { x: M, y: y0 + h1 + gap, w: CW, h: h2, label: "ÉCRAN 2 — REMPLACER" },
        ];
        face = arr === "pile-haut"
          ? { x: M, y: M + zoneH + SEAM, w: CW, h: H - (M + zoneH + SEAM) - M, r: R }
          : { x: M, y: M, w: CW, h: H - zoneH - 2 * M - SEAM, r: R };
      } else if (arr === "cote-haut") {
        const zoneH = Math.round(H * 0.34);
        const w1 = emp === "egal" ? Math.round((CW - gap) / 2) : Math.round((CW - gap) * 0.6);
        const w2 = CW - gap - w1;
        ecrans = [
          { x: M, y: M, w: w1, h: zoneH, label: "ÉCRAN 1" },
          { x: M + w1 + gap, y: M, w: w2, h: zoneH, label: "ÉCRAN 2" },
        ];
        face = { x: M, y: M + zoneH + SEAM, w: CW, h: H - (M + zoneH + SEAM) - M, r: R };
      } else { // sandwich
        const hTop = emp === "egal" ? 520 : 640, hBas = emp === "egal" ? 520 : 400;
        ecrans = [
          { x: M, y: M, w: CW, h: hTop, label: "ÉCRAN 1 — REMPLACER" },
          { x: M, y: H - M - hBas, w: CW, h: hBas, label: "ÉCRAN 2 — REMPLACER" },
        ];
        face = { x: M, y: M + hTop + SEAM, w: CW, h: H - 2 * M - hTop - hBas - 2 * SEAM, r: R };
      }
      const name = `meg-reel-duo-${arr}-${style}-${emp}`;
      blocks.push(emit({
        name,
        title: `Reel — duo ${meta.txt} (${style}, ${emp})`,
        desc: `Split 9:16 à deux écrans : ${meta.txt}, répartition ${emp === "egal" ? "égale" : "dominante"}, visage master recadré. Style ${style}.`,
        tags: ["reel", "layout", "duo", arr, style],
        family: "reel-split-duo",
        familyTitle: "Reels — splits visage + 2 écrans",
        variant: `${arr} ${style} ${emp}`,
        ratio: "reel", duration: DUR,
        faceGeom: face,
        comment: `Layout Reel à DEUX écrans — ${meta.txt}.
Répartition ${emp === "egal" ? "égale" : "dominante (62/38)"}. Chaque zone hachurée se remplace
indépendamment (comparatif, avant/après, deux sources). Le bloc pilote le
master : visage ${meta.face}.`,
        css: [ecranCss("%R%", { fontSize: 34 }), cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
        html: [
          ...ecrans.map((e) => ecranDiv({ ...e, nav, sub: "" })),
          cadreDiv(face),
          standaloneHtml(),
        ].join("\n    "),
        script: entree(DUR, meta.face === "haut" ? 70 : -70),
      }));
    }
  }
}

/* ————— R3 · Visage + 3 écrans (4) ————— */
const trios = [
  { key: "pile-haut", txt: "3 écrans empilés en haut", ecrans: () => {
      const zoneH = Math.round(H * 0.58), gap = 28, h = Math.round((zoneH - 2 * gap) / 3);
      return [0, 1, 2].map((i) => ({ x: M, y: M + i * (h + gap), w: CW, h, label: `ÉCRAN ${i + 1}` }));
    }, face: () => ({ x: M, y: M + Math.round(H * 0.58) + SEAM, w: CW, h: H - (M + Math.round(H * 0.58) + SEAM) - M, r: R }) },
  { key: "grille-2-1", txt: "2 écrans côte à côte + 1 large dessous", ecrans: () => {
      const gap = 28, h1 = 430, wDemi = Math.round((CW - gap) / 2);
      return [
        { x: M, y: M, w: wDemi, h: h1, label: "ÉCRAN 1" },
        { x: M + wDemi + gap, y: M, w: CW - gap - wDemi, h: h1, label: "ÉCRAN 2" },
        { x: M, y: M + h1 + gap, w: CW, h: 560, label: "ÉCRAN 3 — REMPLACER" },
      ];
    }, face: () => ({ x: M, y: M + 430 + 20 + 560 + SEAM, w: CW, h: H - (M + 430 + 20 + 560 + SEAM) - M, r: R }) },
  { key: "grille-1-2", txt: "1 écran large + 2 côte à côte dessous", ecrans: () => {
      const gap = 28, h1 = 560, h2 = 430, wDemi = Math.round((CW - gap) / 2);
      return [
        { x: M, y: M, w: CW, h: h1, label: "ÉCRAN 1 — REMPLACER" },
        { x: M, y: M + h1 + gap, w: wDemi, h: h2, label: "ÉCRAN 2" },
        { x: M + wDemi + gap, y: M + h1 + gap, w: CW - gap - wDemi, h: h2, label: "ÉCRAN 3" },
      ];
    }, face: () => ({ x: M, y: M + 560 + 20 + 430 + SEAM, w: CW, h: H - (M + 560 + 20 + 430 + SEAM) - M, r: R }) },
  { key: "colonne", txt: "visage pleine hauteur + colonne de 3 écrans", ecrans: () => {
      const gap = 28, colW = 400, colX = W - M - colW, h = Math.round((H - 2 * M - 2 * gap) / 3);
      return [0, 1, 2].map((i) => ({ x: colX, y: M + i * (h + gap), w: colW, h, label: `ÉCRAN ${i + 1}` }));
    }, face: () => ({ x: M, y: M, w: W - 2 * M - 400 - SEAM, h: H - 2 * M, r: R }) },
];
for (const t of trios) {
  const face = t.face();
  blocks.push(emit({
    name: `meg-reel-trio-${t.key}`,
    title: `Reel — trio ${t.txt}`,
    desc: `Split 9:16 à trois écrans : ${t.txt}, visage master recadré. Trois zones à remplacer indépendamment.`,
    tags: ["reel", "layout", "trio", t.key],
    family: "reel-split-trio",
    familyTitle: "Reels — splits visage + 3 écrans",
    variant: t.txt,
    ratio: "reel", duration: DUR,
    faceGeom: face,
    comment: `Layout Reel à TROIS écrans — ${t.txt}.
Pour les process en 3 temps ou les comparatifs multiples. Chaque zone
hachurée se remplace indépendamment ; le bloc pilote le master.`,
    css: [ecranCss("%R%", { fontSize: 30, sub: false }), cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
    html: [
      ...t.ecrans().map((e) => ecranDiv({ ...e, sub: "" })),
      cadreDiv(face),
      standaloneHtml(),
    ].join("\n    "),
    script: entree(DUR, -70),
  }));
}

/* ————— R4 · Détouré fond vert (8) ————— */
for (const silPos of ["centre", "gauche", "droite"]) {
  for (const ecran of ["plein", "carte"]) {
    if (silPos !== "centre" && ecran === "carte") continue; // 4 combinaisons de base
    for (const taille of ["grand", "serre"]) {
      const sw = taille === "grand" ? 720 : 560, sh = taille === "grand" ? 1000 : 800;
      const sx = silPos === "centre" ? Math.round((W - sw) / 2) : silPos === "gauche" ? -30 : W - sw + 30;
      const sil = { x: sx, y: H - sh, w: sw, h: sh };
      const name = `meg-reel-detoure-${silPos}-${ecran}-${taille}`;
      blocks.push(emit({
        name,
        title: `Reel — détouré ${silPos} (écran ${ecran}, ${taille})`,
        desc: `Layout fond vert 9:16 : écran ${ecran === "plein" ? "plein cadre" : "en carte"} + silhouette détourée ${silPos} en bas (${taille}). Remplacer la silhouette par l'asset alpha.`,
        tags: ["reel", "layout", "detoure", "fond-vert", silPos],
        family: "reel-detoure",
        familyTitle: "Reels — visage détouré (fond vert)",
        variant: `${silPos} ${ecran} ${taille}`,
        ratio: "reel", duration: DUR,
        faceMode: "hide",
        comment: `Layout Reel DÉTOURÉ (style fond vert) — silhouette ${silPos}, écran ${ecran}.
Le master brut est masqué : le visage vient d'un asset ALPHA (export
détouré) qu'on pose à la place de la silhouette hachurée. L'écran
${ecran === "plein" ? "plein cadre" : "carte"} passe DERRIÈRE le présentateur — le geste MrBeast/react.
Jamais de PIP coin : la silhouette est ancrée au bord bas, grande.`,
        css: [
          ecran === "plein"
            ? `%R% .fond-ecran{position:absolute;inset:0;z-index:1;background:${HACHURE};display:flex;align-items:flex-start;justify-content:center;padding-top:150px}
%R% .fond-ecran .etiquette{padding:14px 30px;border-radius:24px;background:${PAL.encre};color:${PAL.creme};font-size:42px;font-weight:700;letter-spacing:.05em}`
            : ecranCss("%R%"),
          silhouetteCss("%R%"),
        ].join("\n"),
        html: [
          ecran === "plein"
            ? `<div class="fond-ecran" data-layout-allow-occlusion=""><span class="etiquette">ÉCRAN PLEIN CADRE — REMPLACER</span></div>`
            : ecranDiv({ x: M, y: M, w: CW, h: 900, label: "ÉCRAN — REMPLACER" }),
          silhouetteDiv(sil),
        ].join("\n    "),
        script: `
      ${ecran === "plein"
        ? `tl.fromTo(root.querySelector('.fond-ecran'),{opacity:0},{opacity:1,duration:.4,ease:'power2.out'},0)
        .to(root.querySelector('.fond-ecran'),{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.38).toFixed(2)});`
        : entree(DUR, -70).trim()}
      tl.fromTo(root.querySelector('.silhouette'),{y:90,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.18)
        .to(root.querySelector('.silhouette'),{opacity:0,y:60,duration:.35,ease:'power2.in'},${(DUR - 0.38).toFixed(2)});`,
      }));
    }
  }
}

/* ————— R5 · Écran dominant + bande visage (4) ————— */
for (const pos of ["bas", "haut"]) {
  for (const part of [25, 33]) {
    const bandH = Math.round(H * part / 100);
    const face = pos === "bas" ? { x: 0, y: H - bandH, w: W, h: bandH, r: 0 } : { x: 0, y: 0, w: W, h: bandH, r: 0 };
    const sy = pos === "bas" ? 0 : bandH + 6;
    const sh = H - bandH - 6;
    blocks.push(emit({
      name: `meg-reel-bande-${pos}-${part}`,
      title: `Reel — écran dominant, bande visage ${pos} ${part} %`,
      desc: `Layout 9:16 : écran bord à bord dominant, visage master en bande pleine largeur (${part} %) en ${pos}. Jamais de PIP coin.`,
      tags: ["reel", "layout", "bande", pos],
      family: "reel-bande",
      familyTitle: "Reels — écran dominant + bande visage",
      variant: `${pos} ${part} %`,
      ratio: "reel", duration: DUR,
      faceGeom: face,
      comment: `Layout Reel — l'écran domine, le visage reste présent en BANDE pleine
largeur (${part} %) en ${pos}. C'est l'alternative MEG au PIP coin (interdit) :
le présentateur garde un vrai cadre. Remplacer la zone hachurée.`,
      css: [
        `%R% .grand-ecran{position:absolute;z-index:3;left:0;top:${sy}px;width:${W}px;height:${sh}px;background:${HACHURE};display:flex;align-items:center;justify-content:center;opacity:0}
%R% .grand-ecran .etiquette{padding:14px 30px;border-radius:24px;background:${PAL.encre};color:${PAL.creme};font-size:42px;font-weight:700;letter-spacing:.05em}
%R% .couture{position:absolute;z-index:4;left:0;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55);top:${pos === "bas" ? sh : bandH}px}`,
        standaloneCss("%R%", face),
      ].join("\n"),
      html: [
        `<div class="grand-ecran" data-layout-allow-occlusion=""><span class="etiquette">ÉCRAN — REMPLACER</span></div>`,
        `<div class="couture"></div>`,
        standaloneHtml("MASTER — BANDE VISAGE"),
      ].join("\n    "),
      script: `
      tl.fromTo(root.querySelector('.grand-ecran'),{opacity:0},{opacity:1,duration:.4,ease:'power2.out'},.05)
        .to(root.querySelector('.grand-ecran'),{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.38).toFixed(2)});`,
    }));
  }
}

/* ————— R6 · Intro / hook (6) ————— */
const bandeBasse = { x: 0, y: H - 620, w: W, h: 620, r: 0 };
const introCss = `
%R% .scene{position:absolute;z-index:3;left:0;top:0;width:${W}px;height:${H - 620}px;background:${GRAD_CARTE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;padding:80px 70px;color:${PAL.encre};text-align:center}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 626}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}
%R% .titre-geant{font-size:112px;line-height:.96;font-weight:700;letter-spacing:-.03em;word-spacing:.05em}
%R% .sous-titre{font-size:44px;font-weight:600;opacity:.62}
%R% .gelule{display:inline-block;padding:16px 36px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:36px;font-weight:700;letter-spacing:.06em}`;
const intros = [
  { key: "titre-plein", txt: "grand titre plein cadre",
    html: `<div class="scene" data-layout-allow-occlusion=""><span class="gelule">NOUVELLE VIDÉO</span><div class="titre-geant">Votre titre<br>en deux lignes</div><div class="sous-titre">Sous-titre à remplacer</div></div>`,
    script: `tl.fromTo(root.querySelector('.gelule'),{y:-40,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.titre-geant'),{y:60,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.18)
        .fromTo(root.querySelector('.sous-titre'),{opacity:0},{opacity:1,duration:.4},.5);` },
  { key: "question", txt: "question centrale",
    html: `<div class="scene" data-layout-allow-occlusion=""><div class="titre-geant">La question<br>qui fâche ?</div><span class="gelule">RÉPONSE DANS LA VIDÉO</span></div>`,
    script: `tl.fromTo(root.querySelector('.titre-geant'),{scale:.9,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.4)'},.08)
        .fromTo(root.querySelector('.gelule'),{y:36,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.42);` },
  { key: "hook-chiffre", txt: "chiffre choc",
    html: `<div class="scene" data-layout-allow-occlusion=""><div class="titre-geant" style="font-size:230px;color:${PAL.or};-webkit-text-stroke:3px ${PAL.encre};">87 %</div><div class="sous-titre" style="font-size:52px;opacity:1;font-weight:700;">des dossiers sont refusés<br>pour cette raison</div></div>`,
    script: `tl.fromTo(root.querySelector('.titre-geant'),{scale:.7,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.6)'},.08)
        .fromTo(root.querySelector('.sous-titre'),{y:40,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.4);` },
  { key: "sommaire", txt: "sommaire 3 points",
    html: `<div class="scene" data-layout-allow-occlusion="" style="align-items:flex-start;text-align:left;gap:30px;"><span class="gelule">AU PROGRAMME</span>
      <div class="point" style="display:flex;gap:24px;align-items:center;font-size:52px;font-weight:700;"><span style="color:${PAL.or};">1.</span><span>Premier point à remplacer</span></div>
      <div class="point" style="display:flex;gap:24px;align-items:center;font-size:52px;font-weight:700;"><span style="color:${PAL.or};">2.</span><span>Deuxième point à remplacer</span></div>
      <div class="point" style="display:flex;gap:24px;align-items:center;font-size:52px;font-weight:700;"><span style="color:${PAL.or};">3.</span><span>Troisième point à remplacer</span></div></div>`,
    script: `tl.fromTo(root.querySelector('.gelule'),{y:-30,opacity:0},{y:0,opacity:1,duration:.35,ease:'power3.out'},.05)
        .fromTo(root.querySelectorAll('.point'),{x:-60,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out',stagger:.16},.24);` },
  { key: "vs-teaser", txt: "teaser AVANT / APRÈS",
    html: `<div class="scene" data-layout-allow-occlusion="" style="flex-direction:row;gap:24px;padding:80px 46px;">
      <div class="carte-vs" style="flex:1;height:100%;border-radius:${R}px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4);display:flex;align-items:center;justify-content:center;"><span class="gelule">AVANT</span></div>
      <div class="carte-vs" style="flex:1;height:100%;border-radius:${R}px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 30px 70px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;"><span class="gelule" style="background:${PAL.or};color:${PAL.encre};">APRÈS</span></div></div>`,
    script: `tl.fromTo(root.querySelectorAll('.carte-vs'),{y:70,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out',stagger:.18},.08);` },
  { key: "hook-avant-apres", txt: "hook avant/après empilé",
    html: `<div class="scene" data-layout-allow-occlusion="" style="flex-direction:column;gap:24px;padding:60px 46px;">
      <div class="carte-vs" style="width:100%;flex:1;border-radius:${R}px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4);display:flex;align-items:center;justify-content:center;"><span class="gelule">CAPTURE AVANT</span></div>
      <div class="carte-vs" style="width:100%;flex:1;border-radius:${R}px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 30px 70px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;"><span class="gelule" style="background:${PAL.or};color:${PAL.encre};">CAPTURE APRÈS</span></div></div>`,
    script: `tl.fromTo(root.querySelectorAll('.carte-vs'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out',stagger:.2},.08);` },
];
for (const it of intros) {
  blocks.push(emit({
    name: `meg-reel-intro-${it.key}`,
    title: `Reel — intro ${it.txt}`,
    desc: `Intro 9:16 : ${it.txt} plein cadre + visage master en bande basse. Textes à remplacer, animations incluses.`,
    tags: ["reel", "layout", "intro", "hook", it.key],
    family: "reel-intro",
    familyTitle: "Reels — intros & hooks",
    variant: it.txt,
    ratio: "reel", duration: 5,
    faceGeom: bandeBasse,
    comment: `Intro Reel — ${it.txt}. Le visage reste présent en bande basse
(master recadré par le bloc). Remplacer les textes, garder les animations.
Enchaîner sur un layout split une fois le hook posé.`,
    css: [introCss, standaloneCss("%R%", bandeBasse)].join("\n"),
    html: [it.html, `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `${it.script}
      tl.to(root.querySelector('.scene'),{opacity:0,duration:.35,ease:'power2.in'},4.6);`,
  }));
}

/* ————— R7 · Chapitres (4) ————— */
const chapitres = [
  { key: "carton-numero", txt: "carton numéro plein",
    css: `%R% .carton{position:absolute;z-index:3;left:120px;top:1140px;width:840px;border-radius:44px;background:${GRAD_CARTE};box-shadow:0 40px 88px rgba(0,0,0,.4);padding:64px 70px;color:${PAL.encre};opacity:0}
%R% .num{font-size:150px;font-weight:700;color:${PAL.or};line-height:.9}
%R% .chap{margin-top:14px;font-size:60px;font-weight:700;letter-spacing:-.02em;line-height:1.02}`,
    html: `<div class="carton" data-layout-allow-occlusion=""><div class="num">02</div><div class="chap">Titre du chapitre<br>à remplacer</div></div>`,
    script: `tl.fromTo(root.querySelector('.carton'),{y:70,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.5,ease:'power3.out'},.1)
        .to(root.querySelector('.carton'),{opacity:0,y:-50,duration:.4,ease:'power2.in'},3.4);` },
  { key: "bandeau-lateral", txt: "bandeau latéral vertical",
    css: `%R% .bandeau{position:absolute;z-index:3;left:0;top:0;width:150px;height:100%;background:${PAL.encre};display:flex;align-items:center;justify-content:center;opacity:0}
%R% .vertical{white-space:nowrap;color:${PAL.creme};font-size:52px;font-weight:700;letter-spacing:.14em}
%R% .filet-or{position:absolute;z-index:4;left:150px;top:0;width:8px;height:100%;background:${PAL.or};opacity:0}`,
    html: `<div class="bandeau" data-layout-allow-occlusion=""><span class="vertical">CHAPITRE 2 — LE DOSSIER</span></div><div class="filet-or"></div>`,
    script: `gsap.set(root.querySelector('.vertical'),{rotation:-90});
      tl.fromTo(root.querySelector('.bandeau'),{x:-160,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.filet-or'),{opacity:0},{opacity:1,duration:.3},.4)
        .to([root.querySelector('.bandeau'),root.querySelector('.filet-or')],{x:-170,opacity:0,duration:.4,ease:'power2.in'},3.5);` },
  { key: "pastilles-progression", txt: "pastilles de progression",
    css: `%R% .rail{position:absolute;z-index:3;left:50%;top:120px;display:flex;gap:26px;opacity:0}
%R% .pastille-prog{width:34px;height:34px;border-radius:50%;background:rgba(255,252,214,.38);border:3px solid ${PAL.creme}}
%R% .pastille-prog.active{background:${PAL.or};border-color:${PAL.or}}
%R% .etiq{position:absolute;z-index:3;left:50%;top:180px;padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:34px;font-weight:700;letter-spacing:.05em;opacity:0}`,
    html: `<div class="rail"><span class="pastille-prog"></span><span class="pastille-prog active"></span><span class="pastille-prog"></span><span class="pastille-prog"></span></div><div class="etiq">PARTIE 2 / 4 — À REMPLACER</div>`,
    script: `gsap.set(root.querySelector('.rail'),{xPercent:-50});gsap.set(root.querySelector('.etiq'),{xPercent:-50});
      tl.fromTo(root.querySelector('.rail'),{y:-30,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.etiq'),{y:-20,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.2)
        .fromTo(root.querySelector('.pastille-prog.active'),{scale:1},{scale:1.35,duration:.3,ease:'back.out(2)',yoyo:true,repeat:1},.5)
        .to([root.querySelector('.rail'),root.querySelector('.etiq')],{opacity:0,duration:.35,ease:'power2.in'},3.55);` },
  { key: "barre-basse", txt: "barre basse + libellé",
    css: `%R% .barre-chap{position:absolute;z-index:3;left:46px;bottom:150px;right:46px;height:96px;border-radius:26px;background:rgba(47,44,0,.82);display:flex;align-items:center;gap:24px;padding:0 34px;color:${PAL.creme};opacity:0}
%R% .barre-chap .num-or{font-size:44px;font-weight:700;color:${PAL.or}}
%R% .barre-chap .lib{font-size:38px;font-weight:600;letter-spacing:-.01em}
%R% .jauge{position:absolute;left:0;bottom:0;height:7px;border-radius:4px;background:${PAL.or};width:100%;transform-origin:left}`,
    html: `<div class="barre-chap" data-layout-allow-occlusion=""><span class="num-or">02</span><span class="lib">Titre du chapitre à remplacer</span><span class="jauge"></span></div>`,
    script: `tl.fromTo(root.querySelector('.barre-chap'),{y:40,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.jauge'),{scaleX:0},{scaleX:.5,duration:1.6,ease:'power1.inOut'},.5)
        .to(root.querySelector('.barre-chap'),{opacity:0,y:30,duration:.35,ease:'power2.in'},3.55);` },
];
for (const c of chapitres) {
  blocks.push(emit({
    name: `meg-reel-chapitre-${c.key}`,
    title: `Reel — chapitre ${c.txt}`,
    desc: `Carton de chapitre 9:16 : ${c.txt}, posé par-dessus le master intact. Textes à remplacer.`,
    tags: ["reel", "layout", "chapitre", c.key],
    family: "reel-chapitre",
    familyTitle: "Reels — cartons de chapitre",
    variant: c.txt,
    ratio: "reel", duration: 4,
    faceMode: "none",
    comment: `Carton de chapitre Reel — ${c.txt}. Le master reste plein cadre,
l'habillage passe dessus puis s'efface. Remplacer numéro et libellé.`,
    css: c.css,
    html: c.html,
    script: c.script,
  }));
}

/* ————— R8 · CTA / outro (4) ————— */
const ctas = [
  { key: "carte-marque", txt: "carte de marque plein cadre", dur: 5, faceMode: "none", occl: true, logoVariant: "light",
    css: `%R% .fond{position:absolute;inset:0;z-index:3;background:${GRAD_SOMBRE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;color:${PAL.creme};text-align:center;opacity:0}
%R% .marque{display:block;width:480px;height:auto;object-fit:contain}
%R% .url-avant{font-size:56px;font-weight:700;color:${PAL.or};letter-spacing:.02em}
%R% .invit{font-size:42px;font-weight:600;opacity:.85;max-width:820px;line-height:1.2}`,
    html: `<div class="fond" data-layout-allow-occlusion=""><img class="marque" src="assets/meg-logo-light.png" alt="Logo MEG Business 360"><div class="invit">On regarde votre dossier ensemble sur</div><div class="url-avant">megbusiness360.com</div></div>`,
    script: `tl.fromTo(root.querySelector('.fond'),{opacity:0},{opacity:1,duration:.5,ease:'power2.out'},.05)
        .fromTo(root.querySelector('.marque'),{y:40,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.2)
        .fromTo(root.querySelector('.invit'),{y:30,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.42)
        .fromTo(root.querySelector('.url-avant'),{scale:.85,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.6)'},.62);` },
  { key: "fleche-bas", txt: "flèche vers la description", dur: 4, faceMode: "none",
    css: `%R% .groupe{position:absolute;z-index:3;left:50%;bottom:210px;display:flex;flex-direction:column;align-items:center;gap:18px;opacity:0}
%R% .gelule{padding:16px 38px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:40px;font-weight:700}
%R% .fleche{width:64px;height:64px}
%R% .fleche path{fill:none;stroke:${PAL.or};stroke-width:8;stroke-linecap:round;stroke-linejoin:round}`,
    html: `<div class="groupe"><span class="gelule">Le lien est en description</span><svg class="fleche" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v30M12 26l12 12 12-12"></path></svg></div>`,
    script: `gsap.set(root.querySelector('.groupe'),{xPercent:-50});
      tl.fromTo(root.querySelector('.groupe'),{y:40,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.1)
        .fromTo(root.querySelector('.fleche'),{y:0},{y:16,duration:.5,ease:'power1.inOut',yoyo:true,repeat:3},.6)
        .to(root.querySelector('.groupe'),{opacity:0,y:30,duration:.35,ease:'power2.in'},3.55);` },
  { key: "commentaire", txt: "appel au commentaire", dur: 4, faceMode: "none",
    css: `%R% .bulle{position:absolute;z-index:3;left:90px;bottom:260px;right:90px;border-radius:44px;background:${GRAD_CARTE};box-shadow:0 34px 78px rgba(0,0,0,.35);padding:46px 54px;color:${PAL.encre};opacity:0}
%R% .bulle .q{font-size:52px;font-weight:700;line-height:1.05;letter-spacing:-.02em}
%R% .bulle .trait{margin-top:22px;width:210px;height:8px;border-radius:4px;background:${PAL.or};transform-origin:left}`,
    html: `<div class="bulle" data-layout-allow-occlusion=""><div class="q">Votre cas est différent ?<br>Dites-le en commentaire.</div><div class="trait"></div></div>`,
    script: `tl.fromTo(root.querySelector('.bulle'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.1)
        .fromTo(root.querySelector('.trait'),{scaleX:0},{scaleX:1,duration:.5,ease:'power2.out'},.5)
        .to(root.querySelector('.bulle'),{opacity:0,y:40,duration:.35,ease:'power2.in'},3.55);` },
  { key: "recap", txt: "récap 3 points + bande visage", dur: 5, faceGeom: bandeBasse,
    css: [`%R% .scene{position:absolute;z-index:3;left:0;top:0;width:${W}px;height:${H - 620}px;background:${GRAD_CARTE};display:flex;flex-direction:column;justify-content:center;gap:34px;padding:80px 90px;color:${PAL.encre}}
%R% .titre-recap{font-size:64px;font-weight:700;letter-spacing:-.02em;margin-bottom:10px}
%R% .ligne{display:flex;gap:22px;align-items:center;font-size:44px;font-weight:600;opacity:0}
%R% .coche{width:52px;height:52px;flex:none;border-radius:50%;background:${PAL.or};display:flex;align-items:center;justify-content:center}
%R% .coche svg{width:30px;height:30px}
%R% .coche path{fill:none;stroke:${PAL.encre};stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 626}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", bandeBasse)].join("\n"),
    html: [`<div class="scene" data-layout-allow-occlusion=""><div class="titre-recap">À retenir</div>
      <div class="ligne"><span class="coche"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span><span>Premier point à remplacer</span></div>
      <div class="ligne"><span class="coche"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span><span>Deuxième point à remplacer</span></div>
      <div class="ligne"><span class="coche"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span><span>Troisième point à remplacer</span></div></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `tl.fromTo(root.querySelector('.titre-recap'),{y:-30,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.08)
        .fromTo(root.querySelectorAll('.ligne'),{x:-50,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out',stagger:.18},.3);` },
];
for (const c of ctas) {
  blocks.push(emit({
    name: `meg-reel-cta-${c.key}`,
    title: `Reel — CTA ${c.txt}`,
    desc: `Fin de Reel : ${c.txt}. Textes à remplacer, animations incluses.`,
    tags: ["reel", "layout", "cta", "outro", c.key],
    family: "reel-cta",
    familyTitle: "Reels — CTA & outros",
    variant: c.txt,
    ratio: "reel", duration: c.dur,
    faceGeom: c.faceGeom ?? null,
    faceMode: c.faceGeom ? "move" : "none",
    logoVariant: c.logoVariant ?? null,
    comment: `CTA/outro Reel — ${c.txt}. Remplacer les textes ; l'appel à l'action
reste indirect (règles MEG : on montre où continuer, on ne supplie pas).`,
    css: c.css,
    html: c.html,
    script: c.script,
  }));
}

/* ————— R9 · Duo / réaction — 2 visages (4) ————— */
const duosFaces = [
  { key: "cote-a-cote", txt: "côte à côte 50/50",
    face: { x: 0, y: 420, w: 540, h: 1080, r: 0 }, inv: { x: 540, y: 420, w: 540, h: 1080 } },
  { key: "haut-bas", txt: "empilé 50/50",
    face: { x: M, y: M, w: CW, h: 890, r: R }, inv: { x: M, y: M + 890 + SEAM, w: CW, h: 890 } },
  { key: "entretien-gauche", txt: "hôte dominant à gauche",
    face: { x: M, y: 300, w: 610, h: 1280, r: R }, inv: { x: M + 610 + SEAM, y: 640, w: CW - 610 - SEAM, h: 600 } },
  { key: "entretien-droite", txt: "hôte dominant à droite",
    face: { x: W - M - 610, y: 300, w: 610, h: 1280, r: R }, inv: { x: M, y: 640, w: CW - 610 - SEAM, h: 600 } },
];
for (const d of duosFaces) {
  blocks.push(emit({
    name: `meg-reel-duo-visages-${d.key}`,
    title: `Reel — deux visages ${d.txt}`,
    desc: `Layout réaction/entretien 9:16 : master ${d.txt} + zone invité à remplacer par le rush du second intervenant.`,
    tags: ["reel", "layout", "duo-visages", "reaction", d.key],
    family: "reel-duo-visages",
    familyTitle: "Reels — deux visages (réaction/entretien)",
    variant: d.txt,
    ratio: "reel", duration: DUR,
    faceGeom: d.face,
    comment: `Layout Reel à DEUX visages — ${d.txt}. Le master (vous) est recadré
par le bloc ; la zone INVITÉ hachurée se remplace par le rush du second
intervenant (réaction, duo, entretien).`,
    css: [
      `%R% .invite{position:absolute;z-index:3;left:${d.inv.x}px;top:${d.inv.y}px;width:${d.inv.w}px;height:${d.inv.h}px;box-sizing:border-box;border:7px solid #fffcd6;border-radius:${R}px;background:${HACHURE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:${PAL.encre};opacity:0}
%R% .invite .etiquette{padding:12px 26px;border-radius:22px;background:${PAL.encre};color:${PAL.creme};font-size:34px;font-weight:700;letter-spacing:.05em}
%R% .invite .sous{font-size:26px;font-weight:600;opacity:.62}`,
      cadreCss("%R%"), standaloneCss("%R%", d.face),
    ].join("\n"),
    html: [
      `<div class="invite" data-layout-allow-occlusion=""><span class="etiquette">INVITÉ — REMPLACER</span><span class="sous">rush du second intervenant</span></div>`,
      d.key === "cote-a-cote"
        ? cadreDiv(d.face).replace('class="face-cadre"', 'class="face-cadre" data-qa-allow-bleed=""')
        : cadreDiv(d.face),
      standaloneHtml("MASTER — VOUS"),
    ].join("\n    "),
    script: `
      tl.fromTo(root.querySelector('.invite'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.14)
        .to(root.querySelector('.invite'),{opacity:0,y:-40,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});
      const cadre=root.querySelector('.face-cadre');
      if(cadre)tl.fromTo(cadre,{opacity:0},{opacity:1,duration:.4},.2).to(cadre,{opacity:0,duration:.3},${(DUR - 0.38).toFixed(2)});`,
  }));
}

/* ————— R10 · Habillages plein cadre (8) ————— */
const habillages = [
  { key: "cadre-fin-or", txt: "cadre fin or",
    css: `%R% .cadre{position:absolute;z-index:3;inset:40px;border:4px solid ${PAL.or};border-radius:30px;pointer-events:none;opacity:0}`,
    html: `<div class="cadre"></div>`,
    script: `tl.fromTo(root.querySelector('.cadre'),{opacity:0,scale:1.03},{opacity:1,scale:1,duration:.5,ease:'power2.out'},.05);` },
  { key: "cadre-creme-epais", txt: "cadre crème épais",
    css: `%R% .cadre{position:absolute;z-index:3;inset:0;border:26px solid ${PAL.creme};border-radius:8px;pointer-events:none;opacity:0}`,
    html: `<div class="cadre"></div>`,
    script: `tl.fromTo(root.querySelector('.cadre'),{opacity:0},{opacity:1,duration:.5,ease:'power2.out'},.05);` },
  { key: "coins-or", txt: "quatre coins or",
    css: `%R% .coin{position:absolute;z-index:3;width:110px;height:110px;opacity:0}
%R% .coin path{fill:none;stroke:${PAL.or};stroke-width:10;stroke-linecap:round}
%R% .coin.a{left:52px;top:52px}%R% .coin.b{right:52px;top:52px}%R% .coin.c{left:52px;bottom:52px}%R% .coin.d{right:52px;bottom:52px}`,
    html: `<svg class="coin a" viewBox="0 0 60 60"><path d="M6 54V14a8 8 0 0 1 8-8h40"></path></svg><svg class="coin b" viewBox="0 0 60 60"><path d="M6 6h40a8 8 0 0 1 8 8v40"></path></svg><svg class="coin c" viewBox="0 0 60 60"><path d="M6 6v40a8 8 0 0 0 8 8h40"></path></svg><svg class="coin d" viewBox="0 0 60 60"><path d="M54 6v40a8 8 0 0 1-8 8H6"></path></svg>`,
    script: `tl.fromTo(root.querySelectorAll('.coin'),{opacity:0,scale:.6},{opacity:1,scale:1,duration:.45,ease:'back.out(1.6)',stagger:.08},.05);` },
  { key: "vignette-focus", txt: "vignette de focus",
    css: `%R% .vignette{position:absolute;z-index:3;inset:0;background:radial-gradient(72% 62% at 50% 44%,rgba(0,0,0,0) 58%,rgba(31,29,0,.52) 100%);pointer-events:none;opacity:0}`,
    html: `<div class="vignette" data-layout-allow-occlusion=""></div>`,
    script: `tl.fromTo(root.querySelector('.vignette'),{opacity:0},{opacity:1,duration:.8,ease:'power2.out'},.05);` },
  { key: "bandes-header-footer", txt: "bandes haut et bas", logoVariant: "dark",
    css: `%R% .bande-h{position:absolute;z-index:3;left:0;top:0;width:100%;height:140px;background:${PAL.creme};display:flex;align-items:center;justify-content:center;color:${PAL.encre};font-size:40px;font-weight:700;letter-spacing:.08em;opacity:0}
%R% .bande-h .logo-officiel{display:block;width:150px;height:auto;object-fit:contain}
%R% .bande-b{position:absolute;z-index:3;left:0;bottom:0;width:100%;height:110px;background:${PAL.encre};display:flex;align-items:center;justify-content:center;color:${PAL.or};font-size:34px;font-weight:700;letter-spacing:.06em;opacity:0}`,
    html: `<div class="bande-h" data-layout-allow-occlusion=""><img class="logo-officiel" src="assets/meg-logo-dark.png" alt="Logo MEG Business 360"></div><div class="bande-b" data-layout-allow-occlusion="">megbusiness360.com</div>`,
    script: `tl.fromTo(root.querySelector('.bande-h'),{y:-140,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.bande-b'),{y:110,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.12);` },
  { key: "marge-titre-vertical", txt: "marge latérale + titre vertical",
    css: `%R% .filet{position:absolute;z-index:3;left:70px;top:180px;width:7px;height:0;border-radius:4px;background:${PAL.or}}
%R% .titre-v{position:absolute;z-index:3;left:20px;top:50%;white-space:nowrap;color:${PAL.creme};font-size:44px;font-weight:700;letter-spacing:.12em;text-shadow:0 4px 24px rgba(0,0,0,.5);opacity:0}`,
    html: `<div class="filet"></div><div class="titre-v" data-qa-allow-bleed="">SUJET DE LA VIDÉO</div>`,
    script: `gsap.set(root.querySelector('.titre-v'),{rotation:-90,xPercent:-50,yPercent:-50});
      tl.to(root.querySelector('.filet'),{height:1560,duration:.9,ease:'power2.inOut'},.05)
        .fromTo(root.querySelector('.titre-v'),{opacity:0},{opacity:1,duration:.5},.5);` },
  { key: "filet-progression", txt: "filet de progression bas",
    css: `%R% .rail-prog{position:absolute;z-index:3;left:0;bottom:0;width:100%;height:12px;background:rgba(255,252,214,.28)}
%R% .rail-prog .avance{position:absolute;left:0;top:0;height:100%;width:100%;background:${PAL.or};transform-origin:left}`,
    html: `<div class="rail-prog"><span class="avance"></span></div>`,
    script: `tl.fromTo(root.querySelector('.avance'),{scaleX:0},{scaleX:1,duration:6,ease:'none'},0);` },
  { key: "halo-cinema", txt: "halo cinéma haut/bas",
    css: `%R% .halo-h{position:absolute;z-index:3;left:0;top:0;width:100%;height:320px;background:linear-gradient(180deg,rgba(31,29,0,.6) 0%,rgba(31,29,0,0) 100%);pointer-events:none;opacity:0}
%R% .halo-b{position:absolute;z-index:3;left:0;bottom:0;width:100%;height:420px;background:linear-gradient(0deg,rgba(31,29,0,.66) 0%,rgba(31,29,0,0) 100%);pointer-events:none;opacity:0}`,
    html: `<div class="halo-h" data-layout-allow-occlusion=""></div><div class="halo-b" data-layout-allow-occlusion=""></div>`,
    script: `tl.fromTo([root.querySelector('.halo-h'),root.querySelector('.halo-b')],{opacity:0},{opacity:1,duration:.7,ease:'power2.out'},.05);` },
  { key: "marque-meg-coin", txt: "marque MEG persistante coin haut-droit", logoVariant: "light",
    // Position mesurée en PIXELS (bbox seuil de luminosité) directement sur les
    // 3 captures de référence (2, 3, 5 sur 14) : "LEGEND" a une bbox IDENTIQUE
    // au pixel près sur les 3 (marge droite 112px, texte y:285-325 → centre
    // vertical 305px dans un cadre 1080×1920 canonique) — calque statique à
    // position fixe. La marge standard M (46px) collait trop au bord droit ;
    // corrigé en dur ici pour matcher la référence plutôt que le token maison.
    // QC 6e passe : la 1re mesure utilisait un crop de référence dont le haut
    // (REF_TOP=296) mordait encore sur la barre de navigation iOS translucide
    // ("X · N sur 14"), invisible à l'oeil mais qui déformait l'échelle de
    // remise à l'échelle 1080×1920 canonique. Barre re-mesurée : opaque
    // jusqu'à y=340 (identique aux pixels près sur les 4 captures) ; crop
    // recalé à REF_TOP=348. Sous ce crop corrigé, le centre vertical réel de
    // "LEGEND" est 305px (pas 346) : top:298 plaçait la marque ~45px trop bas.
    // Corrigé ici en top:253.
    css: `%R% .marque-meg-coin{position:absolute;z-index:3;right:112px;top:253px;width:160px;height:auto;object-fit:contain;filter:drop-shadow(0 2px 12px rgba(0,0,0,.5));opacity:0}`,
    html: `<img class="marque-meg-coin" src="assets/meg-logo-light.png" alt="Logo MEG Business 360" data-qa-allow-bleed="">`,
    script: `tl.fromTo(root.querySelector('.marque-meg-coin'),{opacity:0,y:-10},{opacity:1,y:0,duration:.4,ease:'power2.out'},.05);` },
];
for (const hb of habillages) {
  blocks.push(emit({
    name: `meg-reel-habillage-${hb.key}`,
    title: `Reel — habillage ${hb.txt}`,
    desc: `Habillage plein cadre 9:16 : ${hb.txt} par-dessus le master intact. Se pose sur toute la durée d'une séquence.`,
    tags: ["reel", "habillage", "overlay", hb.key],
    family: "reel-habillage",
    familyTitle: "Reels — habillages plein cadre",
    variant: hb.txt,
    ratio: "reel", duration: DUR,
    faceMode: "none",
    needsFont: !["cadre-fin-or", "cadre-creme-epais", "coins-or", "vignette-focus", "filet-progression", "halo-cinema", "marque-meg-coin"].includes(hb.key),
    logoVariant: hb.logoVariant ?? null,
    comment: `Habillage Reel — ${hb.txt}. Le master reste plein cadre, l'habillage
se pose dessus (piste 2) et s'étire sur la durée voulue.`,
    css: hb.css,
    html: hb.html,
    script: hb.script,
  }));
}

/* ————— R11 · Écran + titre à la couture (4) ————— */
for (const part of [45, 55]) {
  for (const style of ["carte", "nav"]) {
    const screenH = Math.round(H * part / 100) - M - 60;
    const titreY = M + screenH + 24;
    const faceY = titreY + 150;
    const face = { x: M, y: faceY, w: CW, h: H - faceY - M, r: R };
    blocks.push(emit({
      name: `meg-reel-ecran-titre-${part}-${style}`,
      title: `Reel — écran ${part} % + titre à la couture (${style})`,
      desc: `Split 9:16 : écran ${style} en haut (${part} %), grande ligne de titre éditable à la couture, visage master en bas.`,
      tags: ["reel", "layout", "split", "titre", style],
      family: "reel-ecran-titre",
      familyTitle: "Reels — écran + titre à la couture",
      variant: `${part} % ${style}`,
      ratio: "reel", duration: DUR,
      faceGeom: face,
      comment: `Layout Reel — écran en haut, TITRE de séquence à la couture, visage
en bas. Le titre est une vraie ligne éditable (pas un sous-titre) :
remplacer le texte, garder le soulignement animé.`,
      css: [
        ecranCss("%R%"),
        `%R% .titre-couture{position:absolute;z-index:4;left:${M}px;top:${titreY}px;width:${CW}px;text-align:center;color:${PAL.encre};font-size:66px;font-weight:700;letter-spacing:-.02em;opacity:0}
%R% .souligne{position:absolute;z-index:4;left:50%;top:${titreY + 104}px;width:340px;height:9px;margin-left:-170px;border-radius:5px;background:${PAL.or};transform-origin:center}`,
        cadreCss("%R%"), standaloneCss("%R%", face),
      ].join("\n"),
      html: [
        ecranDiv({ x: M, y: M, w: CW, h: screenH, nav: style === "nav" }),
        `<div class="titre-couture">Titre de la séquence</div><div class="souligne"></div>`,
        cadreDiv(face),
        standaloneHtml(),
      ].join("\n    "),
      script: `${entree(DUR, -70)}
      tl.fromTo(root.querySelector('.titre-couture'),{y:26,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.3)
        .fromTo(root.querySelector('.souligne'),{scaleX:0},{scaleX:1,duration:.45,ease:'power2.out'},.55)
        .to([root.querySelector('.titre-couture'),root.querySelector('.souligne')],{opacity:0,duration:.3,ease:'power2.in'},${(DUR - 0.36).toFixed(2)});`,
    }));
  }
}

/* ————— R12 · Cadres d'appareils (4) ————— */
const telCss = `
%R% .tel{position:absolute;z-index:3;box-sizing:border-box;border:16px solid ${PAL.encre};border-radius:64px;background:${HACHURE};box-shadow:0 44px 96px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0}
%R% .tel .encoche{position:absolute;top:16px;left:50%;width:180px;height:34px;margin-left:-90px;border-radius:18px;background:${PAL.encre}}
%R% .tel .etiquette{padding:12px 26px;border-radius:22px;background:${PAL.encre};color:${PAL.creme};font-size:32px;font-weight:700;letter-spacing:.05em}`;
const devices = [
  { key: "telephone-centre", txt: "téléphone centré", dur: DUR, faceGeom: bandeBasse,
    css: [telCss, `%R% .couture{position:absolute;z-index:4;left:0;top:${H - 626}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`, standaloneCss("%R%", bandeBasse)].join("\n"),
    html: [`<div class="tel" style="left:270px;top:80px;width:540px;height:1120px;" data-layout-allow-occlusion=""><span class="encoche"></span><span class="etiquette">DÉMO APP — REMPLACER</span></div>`, `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `tl.fromTo(root.querySelector('.tel'),{y:80,opacity:0,scale:.94},{y:0,opacity:1,scale:1,duration:.55,ease:'power3.out'},.08)
        .to(root.querySelector('.tel'),{opacity:0,y:-50,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});` },
  { key: "telephone-penche", txt: "téléphone incliné", dur: DUR, faceGeom: bandeBasse,
    css: [telCss, `%R% .couture{position:absolute;z-index:4;left:0;top:${H - 626}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`, standaloneCss("%R%", bandeBasse)].join("\n"),
    html: [`<div class="tel penche" style="left:280px;top:100px;width:520px;height:1080px;" data-layout-allow-occlusion=""><span class="encoche"></span><span class="etiquette">DÉMO APP — REMPLACER</span></div>`, `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `gsap.set(root.querySelector('.penche'),{rotation:4});
      tl.fromTo(root.querySelector('.tel'),{y:80,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.08)
        .to(root.querySelector('.tel'),{opacity:0,y:-50,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});` },
  { key: "double-telephone", txt: "deux téléphones", dur: DUR, faceGeom: bandeBasse,
    css: [telCss, `%R% .couture{position:absolute;z-index:4;left:0;top:${H - 626}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`, standaloneCss("%R%", bandeBasse)].join("\n"),
    html: [`<div class="tel penche-a" style="left:70px;top:130px;width:440px;height:920px;" data-layout-allow-occlusion=""><span class="encoche"></span><span class="etiquette">APP 1</span></div>`,
      `<div class="tel penche-b" style="left:570px;top:130px;width:440px;height:920px;" data-layout-allow-occlusion=""><span class="encoche"></span><span class="etiquette">APP 2</span></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `gsap.set(root.querySelector('.penche-a'),{rotation:-4});gsap.set(root.querySelector('.penche-b'),{rotation:4});
      tl.fromTo(root.querySelectorAll('.tel'),{y:90,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out',stagger:.14},.08)
        .to(root.querySelectorAll('.tel'),{opacity:0,y:-50,duration:.35,ease:'power2.in',stagger:.06},${(DUR - 0.46).toFixed(2)});` },
  { key: "ordinateur", txt: "ordinateur portable", dur: DUR, faceGeom: bandeBasse,
    css: [`%R% .ecran-pc{position:absolute;z-index:3;left:110px;top:190px;width:860px;height:600px;box-sizing:border-box;border:18px solid ${PAL.encre};border-radius:34px 34px 0 0;background:${HACHURE};display:flex;align-items:center;justify-content:center;opacity:0}
%R% .ecran-pc .etiquette{padding:12px 26px;border-radius:22px;background:${PAL.encre};color:${PAL.creme};font-size:32px;font-weight:700;letter-spacing:.05em}
%R% .socle{position:absolute;z-index:3;left:60px;top:790px;width:960px;height:40px;border-radius:0 0 30px 30px;background:${PAL.encre};opacity:0}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 626}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`, standaloneCss("%R%", bandeBasse)].join("\n"),
    html: [`<div class="ecran-pc" data-layout-allow-occlusion=""><span class="etiquette">CAPTURE BUREAU — REMPLACER</span></div>`, `<div class="socle"></div>`, `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `tl.fromTo([root.querySelector('.ecran-pc'),root.querySelector('.socle')],{y:70,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out',stagger:.08},.08)
        .to([root.querySelector('.ecran-pc'),root.querySelector('.socle')],{opacity:0,y:-50,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});` },
];
for (const d of devices) {
  blocks.push(emit({
    name: `meg-reel-appareil-${d.key}`,
    title: `Reel — appareil ${d.txt}`,
    desc: `Layout 9:16 : démo dans un cadre ${d.txt} + visage master en bande basse. Remplacer l'écran hachuré par la capture.`,
    tags: ["reel", "layout", "appareil", "demo", d.key],
    family: "reel-appareil",
    familyTitle: "Reels — cadres d'appareils",
    variant: d.txt,
    ratio: "reel", duration: d.dur,
    faceGeom: d.faceGeom,
    comment: `Layout Reel — démo dans un vrai cadre d'appareil (${d.txt}).
Remplacer la zone hachurée par la capture d'écran ; le visage reste en
bande basse (master recadré par le bloc).`,
    css: d.css,
    html: d.html,
    script: d.script,
  }));
}

/* ————— R13 · Avant / après (4) ————— */
const avApColW = Math.round((CW - SEAM) / 2);
const avantApres = [
  { key: "vertical-50", txt: "deux colonnes AVANT/APRÈS", faceGeom: { x: 0, y: H - 500, w: W, h: 500, r: 0 },
    css: [`%R% .col{position:absolute;z-index:3;top:${M}px;width:${avApColW}px;height:${H - 500 - M - 40}px;box-sizing:border-box;border-radius:${R}px;display:flex;align-items:flex-start;justify-content:center;padding-top:60px;opacity:0}
%R% .col.avant{left:${M}px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4)}
%R% .col.apres{left:${M + avApColW + SEAM}px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 30px 70px rgba(0,0,0,.25)}
%R% .col .tag{padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:36px;font-weight:700;letter-spacing:.06em}
%R% .col.apres .tag{background:${PAL.or};color:${PAL.encre}}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 506}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", { x: 0, y: H - 500, w: W, h: 500, r: 0 })].join("\n"),
    html: [`<div class="col avant" data-layout-allow-occlusion=""><span class="tag">AVANT</span></div>`,
      `<div class="col apres" data-layout-allow-occlusion=""><span class="tag">APRÈS</span></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `tl.fromTo(root.querySelector('.col.avant'),{x:-70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.col.apres'),{x:70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.22)
        .to(root.querySelectorAll('.col'),{opacity:0,duration:.35,ease:'power2.in'},5.55);` },
  { key: "horizontal-50", txt: "empilé AVANT/APRÈS", faceGeom: { x: 0, y: H - 500, w: W, h: 500, r: 0 },
    css: [`%R% .rang{position:absolute;z-index:3;left:${M}px;width:${CW}px;height:${Math.round((H - 500 - M - 40 - SEAM) / 2)}px;box-sizing:border-box;border-radius:${R}px;display:flex;align-items:center;justify-content:center;opacity:0}
%R% .rang.avant{top:${M}px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4)}
%R% .rang.apres{top:${M + Math.round((H - 500 - M - 40 - SEAM) / 2) + SEAM}px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 30px 70px rgba(0,0,0,.25)}
%R% .rang .tag{padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:36px;font-weight:700;letter-spacing:.06em}
%R% .rang.apres .tag{background:${PAL.or};color:${PAL.encre}}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 506}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", { x: 0, y: H - 500, w: W, h: 500, r: 0 })].join("\n"),
    html: [`<div class="rang avant" data-layout-allow-occlusion=""><span class="tag">AVANT</span></div>`,
      `<div class="rang apres" data-layout-allow-occlusion=""><span class="tag">APRÈS</span></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `tl.fromTo(root.querySelector('.rang.avant'),{y:-60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.rang.apres'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.22)
        .to(root.querySelectorAll('.rang'),{opacity:0,duration:.35,ease:'power2.in'},5.55);` },
  { key: "rideau", txt: "rideau coulissant", faceGeom: { x: 0, y: H - 500, w: W, h: 500, r: 0 },
    css: [`%R% .scene-av{position:absolute;z-index:3;left:0;top:0;width:${W}px;height:${H - 500 - 6}px;background:${HACHURE};overflow:hidden}
%R% .scene-av .tag{position:absolute;right:60px;top:70px;padding:12px 30px;border-radius:999px;background:${PAL.or};color:${PAL.encre};font-size:36px;font-weight:700;letter-spacing:.06em}
%R% .volet-avant{position:absolute;left:0;top:0;width:78%;height:100%;background:${HACHURE_SOMBRE};overflow:hidden}
%R% .volet-avant .tag2{position:absolute;left:60px;top:70px;padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:36px;font-weight:700;letter-spacing:.06em}
%R% .poignee{position:absolute;z-index:4;top:0;left:78%;width:10px;height:${H - 500 - 6}px;background:${PAL.or};box-shadow:0 0 40px rgba(185,170,2,.6)}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 506}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", { x: 0, y: H - 500, w: W, h: 500, r: 0 })].join("\n"),
    html: [`<div class="scene-av" data-layout-allow-occlusion=""><span class="tag">APRÈS — REMPLACER</span><div class="volet-avant"><span class="tag2">AVANT — REMPLACER</span></div></div>`,
      `<div class="poignee"></div>`, `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `
      /* Le rideau AVANT se retire : width animé en px (jamais un transform CSS). */
      tl.fromTo(root.querySelector('.volet-avant'),{width:842},{width:346,duration:1.4,ease:'power2.inOut'},.7)
        .fromTo(root.querySelector('.poignee'),{x:0},{x:-496,duration:1.4,ease:'power2.inOut'},.7);`,
  },
  { key: "duo-cartes", txt: "deux cartes inclinées", faceGeom: { x: 0, y: H - 500, w: W, h: 500, r: 0 },
    css: [`%R% .carte-av{position:absolute;z-index:3;width:470px;height:820px;box-sizing:border-box;border-radius:${R}px;display:flex;align-items:flex-start;justify-content:center;padding-top:50px;opacity:0}
%R% .carte-av.avant{left:46px;top:200px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4)}
%R% .carte-av.apres{left:564px;top:330px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 40px 90px rgba(0,0,0,.4)}
%R% .carte-av .tag{padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:34px;font-weight:700;letter-spacing:.06em}
%R% .carte-av.apres .tag{background:${PAL.or};color:${PAL.encre}}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 506}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", { x: 0, y: H - 500, w: W, h: 500, r: 0 })].join("\n"),
    html: [`<div class="carte-av avant" data-layout-allow-occlusion="" data-qa-allow-overlap=""><span class="tag">AVANT</span></div>`,
      `<div class="carte-av apres" data-layout-allow-occlusion="" data-qa-allow-overlap=""><span class="tag">APRÈS</span></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `gsap.set(root.querySelector('.carte-av.avant'),{rotation:-4});gsap.set(root.querySelector('.carte-av.apres'),{rotation:3});
      tl.fromTo(root.querySelector('.carte-av.avant'),{y:70,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.carte-av.apres'),{y:90,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.3)
        .to(root.querySelectorAll('.carte-av'),{opacity:0,duration:.35,ease:'power2.in'},5.55);` },
];
for (const av of avantApres) {
  blocks.push(emit({
    name: `meg-reel-avant-apres-${av.key}`,
    title: `Reel — avant/après ${av.txt}`,
    desc: `Layout comparatif 9:16 : ${av.txt} + visage master en bande basse. Remplacer les deux zones par les captures.`,
    tags: ["reel", "layout", "avant-apres", "comparatif", av.key],
    family: "reel-avant-apres",
    familyTitle: "Reels — avant/après",
    variant: av.txt,
    ratio: "reel", duration: DUR,
    faceGeom: av.faceGeom,
    comment: `Layout Reel AVANT/APRÈS — ${av.txt}. Les deux zones hachurées se
remplacent par les captures ; le résultat (APRÈS) porte toujours le
cadre crème, l'état de départ reste mat.`,
    css: av.css,
    html: av.html,
    script: av.script,
  }));
}

/* ————— R14 · Preuve sociale (2) ————— */
blocks.push(emit({
  name: "meg-reel-preuve-temoignage",
  title: "Reel — témoignage + capture",
  desc: "Layout preuve sociale 9:16 : citation client en carte + capture d'avis hachurée + visage master en bande basse.",
  tags: ["reel", "layout", "preuve-sociale", "temoignage"],
  family: "reel-preuve-sociale",
  familyTitle: "Reels — preuve sociale",
  variant: "témoignage + capture",
  ratio: "reel", duration: DUR,
  faceGeom: { x: 0, y: H - 560, w: W, h: 560, r: 0 },
  comment: `Layout Reel preuve sociale — citation en carte + capture d'avis.
Remplacer la citation (vraie, sourcée — jamais inventée : règle MEG) et
la zone hachurée par la capture réelle de l'avis.`,
  css: [`%R% .carte-cit{position:absolute;z-index:3;left:${M}px;top:${M}px;width:${CW}px;border-radius:44px;background:${GRAD_CARTE};box-shadow:0 34px 78px rgba(0,0,0,.35);padding:52px 58px;color:${PAL.encre};opacity:0}
%R% .guillemet{font-size:120px;line-height:.6;color:${PAL.or};font-weight:700}
%R% .texte-cit{margin-top:6px;font-size:48px;font-weight:600;line-height:1.16;letter-spacing:-.015em}
%R% .auteur{margin-top:22px;font-size:34px;font-weight:700;color:${PAL.or}}`,
    ecranCss("%R%", { fontSize: 32 }),
    standaloneCss("%R%", { x: 0, y: H - 560, w: W, h: 560, r: 0 }),
    `%R% .couture{position:absolute;z-index:4;left:0;top:${H - 566}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`].join("\n"),
  html: [`<div class="carte-cit" data-layout-allow-occlusion=""><div class="guillemet">«</div><div class="texte-cit">Citation du client à remplacer — toujours réelle et sourcée.</div><div class="auteur">Prénom N. — OF certifié</div></div>`,
    ecranDiv({ x: M, y: 700, w: CW, h: 560, label: "CAPTURE DE L'AVIS — REMPLACER", sub: "Google, LinkedIn, mail…" }),
    `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
  script: `
      tl.fromTo(root.querySelector('.carte-cit'),{y:-60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.08)
        .fromTo(root.querySelectorAll('.ecran'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.26)
        .to([root.querySelector('.carte-cit'),...root.querySelectorAll('.ecran')],{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});`,
}));
blocks.push(emit({
  name: "meg-reel-preuve-logos",
  title: "Reel — mur de logos",
  desc: "Layout preuve sociale 9:16 : grille de 6 tuiles logos partenaires/clients + visage master en bande basse.",
  tags: ["reel", "layout", "preuve-sociale", "logos"],
  family: "reel-preuve-sociale",
  familyTitle: "Reels — preuve sociale",
  variant: "mur de logos",
  ratio: "reel", duration: DUR,
  faceGeom: { x: 0, y: H - 560, w: W, h: 560, r: 0 },
  comment: `Layout Reel preuve sociale — mur de 6 logos. Remplacer chaque tuile
hachurée par un logo réel (clients, certifications, partenaires).`,
  css: [`%R% .titre-mur{position:absolute;z-index:3;left:${M}px;top:70px;width:${CW}px;text-align:center;color:${PAL.encre};font-size:58px;font-weight:700;letter-spacing:-.02em;opacity:0}
%R% .tuile{position:absolute;z-index:3;width:${Math.round((CW - 2 * 20) / 2)}px;height:300px;box-sizing:border-box;border-radius:${R}px;border:7px solid #fffcd6;background:${HACHURE};box-shadow:0 24px 60px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:${PAL.encre};font-size:30px;font-weight:700;letter-spacing:.05em;opacity:0}`,
    standaloneCss("%R%", { x: 0, y: H - 560, w: W, h: 560, r: 0 }),
    `%R% .couture{position:absolute;z-index:4;left:0;top:${H - 566}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`].join("\n"),
  html: [
    `<div class="titre-mur">Ils nous font confiance</div>`,
    ...[0, 1, 2, 3, 4, 5].map((i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * (Math.round((CW - 2 * 20) / 2) + 20 + 10);
      const y = 210 + row * 330;
      return `<div class="tuile" style="left:${x}px;top:${y}px;" data-layout-allow-occlusion="">LOGO ${i + 1}</div>`;
    }),
    `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
  script: `
      tl.fromTo(root.querySelector('.titre-mur'),{y:-30,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.06)
        .fromTo(root.querySelectorAll('.tuile'),{y:44,opacity:0,scale:.94},{y:0,opacity:1,scale:1,duration:.45,ease:'power3.out',stagger:.09},.2)
        .to([root.querySelector('.titre-mur'),...root.querySelectorAll('.tuile')],{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});`,
}));

/* ————— R15 · Bulle réaction — visage flottant coin (1) —————
 * Écran plein cadre dominant (capture, démo, réaction) + visage master
 * dans une BULLE CIRCULAIRE flottante coin bas-gauche, hors zones UI
 * natives. Format "réaction / j'ai testé" — un seul variant (validé
 * Mohamed 06/08/2026). Écart volontaire à la convention "jamais de PIP
 * coin" (bande/silhouette plein) : ici l'écran couvre tout le cadre et
 * la bulle est le point d'entrée demandé explicitement, pas un repli. */
{
  const bulle = { x: 56, y: H - 300 - 328, w: 328, h: 328, r: 164 }; // r = w/2 → cercle parfait
  const bias = "50% 36%"; // même calcul que emit() pour visH≈0.56 en portrait

  const bulleMasterJs = (g, dur) => {
    const exitAt = Math.max(0.5, dur - 0.42).toFixed(2);
    const endAt = dur.toFixed(2);
    return `
      const master=document.querySelector('#meg-master-frame');
      if(master){
        /* Même recadrage "move" que le reste de la banque (x/y/width/
           height/borderRadius, biais visage, restauration en sortie) —
           AUCUN z-index en GSAP ici. L'écran couvre TOUT le cadre et la
           bulle doit rester visible PAR-DESSUS — contrairement aux
           layouts visage+écran classiques où le master occupe une zone
           complémentaire. Ordre obtenu en CSS pure : .ecran/.fond-scene
           passent sous le z-index par défaut du master (harnais/Studio
           = 1, jamais modifié ici) — voir l'override local dans \`css\`
           plus bas. Un .set(zIndex,4)+clearProps avait d'abord semblé
           nécessaire (1re version commitée) mais un test de seek non
           monotone (forward→backward→forward) a montré que clearProps
           ne se réapplique pas de façon fiable après un aller-retour
           arrière (zIndex lu "auto"), un quirk GSAP confirmé pré-existant
           sur toute la banque via masterScript() partagé — mais dont la
           conséquence serait ici une bulle ENTIÈREMENT masquée par
           l'écran plein cadre en cas de seek arrière, contrairement aux
           layouts existants (cartes z3+ sur une zone complémentaire
           seulement). D'où un ordre 100% CSS, robuste à tout sens de
           scrub. */
        tl.fromTo(master,{x:0,y:0,width:${W},height:${H},borderRadius:0},
          {x:${g.x},y:${g.y},width:${g.w},height:${g.h},borderRadius:${g.r},duration:.42,ease:'power3.out'},0)
          .to(master,{x:0,y:0,width:${W},height:${H},borderRadius:0,duration:.42,ease:'power3.in'},${exitAt});
        const vid=master.querySelector('video,img');
        if(vid){
          const op0=vid.style.objectPosition||getComputedStyle(vid).objectPosition||'50% 50%';
          tl.set(vid,{objectPosition:'${bias}'},0).set(vid,{objectPosition:op0},${endAt});
        }
      }else{
        const sa=root.querySelector('.standalone-face');
        if(sa){sa.style.display='flex';tl.fromTo(sa,{opacity:0},{opacity:1,duration:.42,ease:'power2.out'},0);}
      }`;
  };

  blocks.push(emit({
    name: "meg-reel-bulle-reaction-coin",
    title: "Reel — bulle réaction, visage flottant coin bas-gauche",
    desc: "Layout 9:16 : écran plein cadre (capture, démo, réaction) + visage master en bulle circulaire flottante coin bas-gauche, hors zones UI natives. Format réaction / j'ai testé.",
    tags: ["reel", "layout", "bulle-reaction", "reaction", "coin"],
    family: "reel-bulle-reaction",
    familyTitle: "Reels — bulle réaction (visage flottant)",
    variant: "coin bas-gauche",
    ratio: "reel", duration: DUR,
    faceGeom: bulle,
    master: bulleMasterJs(bulle, DUR),
    comment: `Layout Reel "bulle réaction" — écran plein cadre domine (capture,
démo, stat), le visage du présentateur flotte dans une BULLE CIRCULAIRE
coin bas-gauche, hors zones UI natives (profil haut, icônes droite,
légende basse). Format réaction / "j'ai testé" / commentaire en direct
sur un contenu plein écran. Remplacer la zone hachurée par le contenu réel.`,
    css: [
      ecranCss("%R%"),
      // Override local à ce bloc seulement : passe .ecran ET .fond-scene
      // SOUS le z-index par défaut du master (1) au lieu du z3/z1 habituel
      // — même sélecteur/spécificité que les règles partagées ci-dessus et
      // dans emit(), gagne par ordre de cascade (règle plus tardive) sans
      // toucher lib.mjs. Voir le commentaire du master ci-dessus pour le
      // pourquoi (remplace un .set(zIndex)/clearProps GSAP jugé fragile).
      `%R% .ecran{z-index:0}
%R% .fond-scene{z-index:-1}`,
      `%R% .bulle-anneau{position:absolute;z-index:5;left:${bulle.x - 7}px;top:${bulle.y - 7}px;width:${bulle.w + 14}px;height:${bulle.h + 14}px;border-radius:50%;border:7px solid ${PAL.or};box-shadow:0 24px 54px rgba(0,0,0,.45);pointer-events:none;opacity:0}
%R% .bulle-micro{position:absolute;z-index:6;left:${bulle.x + bulle.w - 62}px;top:${bulle.y + bulle.h - 62}px;width:56px;height:56px;border-radius:50%;background:${PAL.encre};border:4px solid ${PAL.creme};pointer-events:none;opacity:0}`,
      standaloneCss("%R%", bulle),
    ].join("\n"),
    html: [
      ecranDiv({ x: 0, y: 0, w: W, h: H, label: "ÉCRAN — REMPLACER", sub: "capture, démo, stat plein écran", bord: true }),
      `<div class="bulle-anneau" data-qa-allow-bleed=""></div>`,
      `<div class="bulle-micro"></div>`,
      standaloneHtml("VISAGE — BULLE"),
    ].join("\n    "),
    script: `
      /* L'écran ne ressort PAS : le master plein cadre (toujours au-dessus
         de l'écran par CSS, voir override + commentaire master ci-dessus)
         le recouvre déjà en revenant à sa taille pleine avant la fin du
         bloc. Un fondu sortant sur l'écran ici créerait un flash crème
         (fond-scene) pendant la fenêtre où le master n'a pas encore fini
         de regrandir — écart volontaire à la convention des autres
         familles où l'écran, lui, ne se fait jamais recouvrir. */
      tl.fromTo(root.querySelector('.ecran'),{opacity:0,scale:1.04},{opacity:1,scale:1,duration:.5,ease:'power2.out'},0);
      tl.fromTo(root.querySelector('.bulle-anneau'),{scale:.6,opacity:0,y:24},{scale:1,opacity:1,y:0,duration:.5,ease:'back.out(1.7)'},.18)
        .to(root.querySelector('.bulle-anneau'),{opacity:0,scale:.85,duration:.35,ease:'power2.in'},5.58);
      tl.fromTo(root.querySelector('.bulle-micro'),{scale:.4,opacity:0},{scale:1,opacity:1,duration:.45,ease:'back.out(1.7)'},.3)
        .to(root.querySelector('.bulle-micro'),{opacity:0,duration:.3,ease:'power2.in'},5.58);`,
  }));
}

/* ————— R16 · Hook bulle-titre + coupe B-roll (référence "legend", 06/08/2026) —————
 * Visage bande haute (master recadré), bulle-titre flottante à cheval sur la
 * couture, coupe B-roll plein cadre en bas. Révisé (06/08/2026, 2e passe) après
 * réexamen pixel des 4 captures de référence envoyées par Mohamed :
 * - l'étiquette n'est pas un médaillon circulaire flottant mais une pastille
 *   qui mord le coin haut-gauche de la bulle-titre.
 * 3e passe (06/08/2026) : le bandeau de marque persistant vu sur plusieurs
 * captures de référence (dont le frame CTA noir n'en porte PAS) n'est PAS un
 * élément de CE bloc — c'est un calque indépendant qui doit pouvoir chevaucher
 * n'importe quelle durée/combinaison de blocs. Déplacé vers son propre
 * habillage (piste 2) : voir R10, `meg-reel-habillage-marque-meg-coin`. Le
 * souder ici en tween local aurait fait clignoter la marque à chaque coupure
 * de bloc au lieu de rester stable — contraire à la référence.
 * 4e passe (06/08/2026) : Mohamed a signalé un vrai bug — la pastille était
 * une reconstruction dessinée à la main (3 rectangles pivotés dans un
 * hexagone), PAS l'icône MEG officielle. Contraire à la doctrine du vault
 * (logo-meg-assets-canon.md : jamais de reconstruction devinée, toujours
 * l'asset canon confirmé visuellement). Remplacée par le vrai fichier
 * (favicon-512.png / icon.png, confirmés à l'oeil) via le nouveau mécanisme
 * `iconVariant` (parallèle à `logoVariant`, même mécanique) — rendue dans sa
 * forme native (carré arrondi), l'hexagone/fond/svg maison sont supprimés. */
blocks.push(emit({
  name: "meg-reel-intro-hook-bulle-titre",
  title: "Reel — hook bulle-titre + coupe B-roll",
  desc: "Intro Reel 9:16 : visage bande haute, bulle-titre flottante à cheval sur la couture (icône MEG officielle mordant le coin), coupe B-roll plein cadre en bas. Format hook \"révélation puis preuve\". Marque persistante : superposer l'habillage `meg-reel-habillage-marque-meg-coin`.",
  tags: ["reel", "layout", "intro", "hook", "bulle-titre", "broll"],
  family: "reel-intro",
  familyTitle: "Reels — intros & hooks",
  variant: "bulle-titre + broll bas",
  ratio: "reel",
  duration: 5,
  iconVariant: "light",
  comment: `Intro Reel "hook bulle-titre" — visage en bande haute, bulle-titre
flottante mordue au coin par l'icône MEG officielle (favicon canon, pas une
reconstruction). Coupe B-roll plein cadre en bas. Remplacer le titre et la
zone hachurée par la preuve réelle ; enchaîner sur un layout standard une
fois le hook posé. Pour une marque persistante en surimpression (bandeau
haut-droite), empiler l'habillage meg-reel-habillage-marque-meg-coin sur
une piste au-dessus — jamais en tween local à ce bloc.`,
  faceGeom: { x: 0, y: 0, w: W, h: 840, r: 0 },
  css: [
    ecranCss("%R%"),
    `%R% .bulle-titre{position:absolute;z-index:4;left:${M}px;top:724px;width:${CW}px;min-height:224px;border-radius:${R}px;background:${PAL.clair};box-shadow:0 30px 70px rgba(0,0,0,.35);padding:60px 58px 42px;color:${PAL.encre};opacity:0}
%R% .bulle-titre .txt{font-size:58px;font-weight:700;line-height:1.08;letter-spacing:-.02em}
%R% .badge-meg{position:absolute;z-index:5;left:70px;top:664px;width:96px;height:96px;object-fit:contain;filter:drop-shadow(0 10px 24px rgba(0,0,0,.4));opacity:0}`,
  ].join("\n"),
  html: [
    ecranDiv({ x: 0, y: 840, w: W, h: H - 840, label: "COUPE B-ROLL — REMPLACER", sub: "preuve, capture, plan tourné", bord: true }),
    `<div class="bulle-titre" data-layout-allow-occlusion=""><span class="txt">Elle a financé sa formation sans avancer un centime</span></div>`,
    `<img class="badge-meg" src="assets/meg-icon-light.png" alt="Icône MEG Business 360" data-qa-allow-bleed="">`,
  ].join("\n    "),
  script: [
    entree(5),
    `
      tl.fromTo(root.querySelector('.bulle-titre'),{y:-46,opacity:0},{y:0,opacity:1,duration:.5,ease:'back.out(1.5)'},.16)
        .to(root.querySelector('.bulle-titre'),{opacity:0,y:-20,duration:.3,ease:'power2.in'},4.6);
      tl.fromTo(root.querySelector('.badge-meg'),{scale:.5,rotate:-14,opacity:0},{scale:1,rotate:0,opacity:1,duration:.42,ease:'back.out(1.8)'},.32)
        .to(root.querySelector('.badge-meg'),{opacity:0,scale:.8,duration:.28,ease:'power2.in'},4.6);`,
  ].join("\n"),
}));

/* ————— R17 · CTA fond noir + contact (référence "legend", 06/08/2026) —————
 * Registre minimaliste distinct des CTA existants (carte-marque, commentaire,
 * recap) : fond noir plein cadre, question + pastille contact — sans carte
 * crème ni logo. Confirmé absent de la banque (grep registry complet) avant
 * création. Révisé (06/08/2026, 2e passe) : alignement à GAUCHE — LECTURE
 * ERRONÉE, corrigée en 3e passe ci-dessous.
 * 3e passe (06/08/2026) : Mohamed a signalé que "plein de trucs ne
 * correspondent pas" ; re-mesure au pixel de la capture 10/14 (marges
 * gauche/droite des 2 lignes de texte ET de la pastille, mesurées depuis les
 * bords du cadre) : les 3 éléments sont CENTRÉS sur l'axe horizontal, marges
 * quasi égales des deux côtés (±8px sur 921px de large, donc <1% d'écart) —
 * pas alignés à gauche. La 2e passe était une lecture pixel erronée,
 * corrigée ici. */
blocks.push(emit({
  name: "meg-reel-cta-fond-noir",
  title: "Reel — CTA fond noir, question + contact",
  desc: "CTA/outro Reel 9:16 : fond noir plein cadre, question directe centrée + pastille contact centrée. Registre minimaliste sans carte ni logo, contraste maximal — variante sobre des CTA MEG.",
  tags: ["reel", "layout", "cta", "outro", "noir", "contact", "minimaliste"],
  family: "reel-cta",
  familyTitle: "Reels — CTA & outros",
  variant: "fond noir + contact",
  ratio: "reel",
  duration: 4,
  comment: `CTA/outro Reel "fond noir" — registre minimaliste : fond noir
plein cadre, question et pastille contact CENTRÉES (confirmé au pixel sur
la référence). Aucune carte ni logo, contraste maximal. Remplacer la
question ; l'appel à l'action reste indirect (règles MEG : on montre où
continuer, on ne supplie pas).`,
  faceGeom: null,
  css: `
%R% .fond{position:absolute;inset:0;z-index:3;background:#000000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:52px;padding:0 84px;color:#FFFFFF;text-align:center;opacity:0}
%R% .question{font-size:70px;font-weight:700;line-height:1.14;letter-spacing:-.01em}
%R% .pastille-contact{display:flex;align-items:center;gap:18px;padding:24px 42px;border-radius:999px;background:linear-gradient(135deg,#FFFEEC 0%,#F4E9A8 100%);color:${PAL.encre};font-size:34px;font-weight:700}
%R% .pastille-contact svg{width:34px;height:34px;flex:none}`,
  html: `<div class="fond" data-layout-allow-occlusion=""><div class="question">Vous avez un dossier à faire avancer ?</div><div class="pastille-contact"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6.5 12 13 21 6.5" stroke="${PAL.encre}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="${PAL.encre}" stroke-width="2"/></svg><span>megbusiness360.com</span></div></div>`,
  script: `
      tl.fromTo(root.querySelector('.fond'),{opacity:0},{opacity:1,duration:.5,ease:'power2.out'},.05)
        .fromTo(root.querySelector('.question'),{y:30,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.22)
        .fromTo(root.querySelector('.pastille-contact'),{scale:.85,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.6)'},.5);`,
}));

/* ————— R18 · Légendes vedette — interview (référence "legend", 06/08/2026) —————
 * Les 2 layouts manquants sur les 4 demandés par Mohamed (bulle-titre et
 * fond-noir étaient déjà construits) : captures 3/14 ("Tony Parker" — légende
 * + pastille nom/rôle) et 5/14 (légende seule, sans pastille). Confirmé
 * absents de la banque (grep registry complet, aucun layout "légende +
 * nom/rôle" ni "légende seule" existant) avant création.
 * Convention : master INTACT plein cadre (comme reel-chapitre, "carton posé
 * par-dessus le master intact") — aucun faceGeom, la légende est un calque,
 * pas un recadrage. Position/typo mesurées au pixel sur les captures 3 et 5 :
 * légende alignée à GAUCHE (pas centrée, contrairement au CTA), texte blanc
 * majuscule à contour foncé (repère visuel constant sur les 2 captures),
 * ancrée à la même hauteur (~59 % du cadre utile) sur les 2 captures — la
 * pastille nom/rôle (capture 3 seulement) vient juste en dessous. Aucune
 * marque persistante embarquée ici : superposer meg-reel-habillage-marque-meg-coin
 * sur une piste au-dessus, comme pour les 2 autres blocs de la même série. */
blocks.push(emit({
  name: "meg-reel-intro-legende-nom-role",
  title: "Reel — légende + nom/rôle",
  desc: "Légende Reel 9:16 : citation vedette en légende basse (texte blanc à contour) + pastille nom/rôle, posée par-dessus le master intact plein cadre. Format interview \"parole d'expert\".",
  tags: ["reel", "layout", "intro", "hook", "legende", "citation", "nom"],
  family: "reel-intro",
  familyTitle: "Reels — intros & hooks",
  variant: "légende + nom/rôle",
  ratio: "reel",
  duration: 5,
  faceGeom: null,
  comment: `Légende Reel avec pastille nom/rôle — le master (parole filmée)
reste plein cadre, intact ; seule la légende est posée par-dessus, comme un
sous-titre vedette. Remplacer la citation et le nom/rôle par les vrais
propos, toujours sourcés (règle MEG : jamais de citation inventée). Marque
persistante : superposer l'habillage meg-reel-habillage-marque-meg-coin.
QC 4e passe : -webkit-text-stroke cassait les fûts fermés (E/P/Q) de Clash
Grotesk 800 à 60px — bug de rendu Chrome confirmé à l'écran, invisible sur le
« 87 % » (chiffres, 230px) qui a inspiré la 1re version. Remplacé par un
contour en text-shadow multi-directions, technique déjà éprouvée dans
meg-captions-middle, sans stroke sur le glyphe.
QC 5e passe : position verticale mesurée en PIXELS (bbox contraste local)
sur la capture de référence Mohamed IMG_3687 (citation 2 lignes y:1228-1346,
pastille nom y:1395-1450 dans un cadre 1080×1920 canonique) — l'ancien
top:1120/1270 plaçait la légende ~100-125px trop haut par rapport à la
référence. Corrigé en dur ici pour matcher, plutôt qu'à l'oeil.
QC 6e passe (revue advisor) : 2 bugs trouvés dans la 5e passe.
(1) Le crop de référence (REF_TOP=296) mordait encore sur la barre de nav iOS
translucide en haut de capture — invisible à l'oeil aux bandes basses qu'on
regardait, mais ça faussait l'échelle de remise à 1080×1920 sur TOUT le cadre.
Barre re-mesurée opaque jusqu'à y=340 (identique sur les 4 captures) → crop
recalé à REF_TOP=348. Sous ce crop corrigé, citation 2 lignes (3687)
y:1213-1334 (centre 1273.5) et citation 1 ligne (3688) y:1249-1299 (centre
1274) : les DEUX captures centrent leur citation sur quasi le même pixel
(1273-1274) malgré 1 ou 2 lignes — la légende référence est donc ANCRÉE SUR
SON MILIEU, pas sur son haut ; top fixe (1210) collait au cas 2-lignes et
plaçait le cas 1-ligne ~35px trop haut. Remplacé par top:1274px +
transform:translateY(-50%) + min-height:132px + flex centrage, qui centre
le bloc sur 1274 quel que soit le nombre de lignes, sans dupliquer un top par
variante. (2) Le texte était fer-à-gauche pleine largeur (988px) ; la
référence est CENTRÉE (lignes 1 et 2 toutes deux centrées sur x=540, mesuré
sur la grille pixel) dans un bandeau plus étroit que la marge M-à-M — ajouté
text-align:center + max-width:860px sur .citation. Pastille nom/rôle : la
référence a son bord gauche à x≈90 (mesuré sur grille), pas x=46 (M) —
corrigé left:90px ; son top box (~1378-1380 mesuré) restait juste sous le
nouveau bas de citation (1274+66=1340, écart ~40px, proche du ~44px mesuré) —
top:1380 inchangé. Citation exemple remplacée : l'ancienne ("Moi, je pense
que c'est ça le plus") était les mots verbatim de la personne filmée dans la
référence Instagram — jamais une citation tierce dans un bloc catalogue
réutilisable ; remplacée par un exemple neutre MEG.`,
  css: `
%R% .legende{position:absolute;z-index:3;left:${M}px;right:${M}px;top:1274px;transform:translateY(-50%);min-height:132px;display:flex;align-items:center;justify-content:center;color:#FFFFFF;opacity:0}
%R% .legende .citation{max-width:860px;text-align:center;font-size:60px;font-weight:800;line-height:1.08;letter-spacing:-.01em;text-transform:uppercase;text-shadow:-3px -3px 0 ${PAL.encre},3px -3px 0 ${PAL.encre},-3px 3px 0 ${PAL.encre},3px 3px 0 ${PAL.encre},0 -3px 0 ${PAL.encre},0 3px 0 ${PAL.encre},-3px 0 0 ${PAL.encre},3px 0 0 ${PAL.encre},0 8px 20px rgba(0,0,0,.4)}
%R% .nom-role{position:absolute;z-index:3;left:90px;top:1380px;padding:14px 30px;border-radius:14px;background:rgba(20,18,4,.6);color:#FFFFFF;font-size:32px;font-weight:700;letter-spacing:.02em;opacity:0}`,
  html: `<div class="legende" data-layout-allow-occlusion=""><div class="citation">On m'a dit que ça ne marcherait jamais</div></div><div class="nom-role" data-layout-allow-occlusion="">Prénom Nom — rôle à remplacer</div>`,
  script: `
      tl.fromTo(root.querySelector('.legende'),{y:30,opacity:0},{y:0,opacity:1,duration:.48,ease:'power3.out'},.2)
        .fromTo(root.querySelector('.nom-role'),{y:20,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.4)
        .to([root.querySelector('.legende'),root.querySelector('.nom-role')],{opacity:0,y:-16,duration:.32,ease:'power2.in'},4.6);`,
}));
blocks.push(emit({
  name: "meg-reel-intro-legende-citation-seule",
  title: "Reel — légende citation seule",
  desc: "Légende Reel 9:16 : citation vedette en légende basse (texte blanc à contour), sans pastille nom, posée par-dessus le master intact plein cadre. Format interview \"punchline\".",
  tags: ["reel", "layout", "intro", "hook", "legende", "citation"],
  family: "reel-intro",
  familyTitle: "Reels — intros & hooks",
  variant: "légende citation seule",
  ratio: "reel",
  duration: 5,
  faceGeom: null,
  comment: `Légende Reel citation seule — le master (parole filmée) reste
plein cadre, intact ; seule la légende punchline est posée par-dessus.
Remplacer la citation par les vrais propos, toujours sourcés (règle MEG :
jamais de citation inventée). Marque persistante : superposer l'habillage
meg-reel-habillage-marque-meg-coin.
QC 4e passe : même correction que meg-reel-intro-legende-nom-role — contour
en text-shadow multi-directions au lieu de -webkit-text-stroke, qui cassait
les fûts fermés (E/P/Q) de Clash Grotesk 800 à 60px.
QC 5e passe : même correction de position que meg-reel-intro-legende-nom-role
— mesure pixel sur IMG_3688 (citation 1 ligne y:1263-1313 dans un cadre
1080×1920 canonique), top:1120 remplacé par top:1210 pour matcher la
référence.
QC 6e passe (revue advisor) : même 2 corrections que
meg-reel-intro-legende-nom-role — crop de référence recalé (REF_TOP=348,
barre de nav iOS translucide re-mesurée opaque jusqu'à y=340), citation
1 ligne (3688) recentrée sur y:1274 (contre 1287 dans la 5e passe), même
pixel de milieu que la variante 2 lignes (3687, 1273.5) : ancrage par
transform:translateY(-50%) sur top:1274 + min-height:132px, pas un top fixe
par variante. Texte re-centré (text-align:center + max-width:860px, contre
fer-à-gauche pleine largeur avant). Citation exemple remplacée : l'ancienne
("C'était en mode") était un fragment verbatim de la personne filmée dans
la référence Instagram — remplacée par un exemple neutre MEG.`,
  css: `
%R% .legende-seule{position:absolute;z-index:3;left:${M}px;right:${M}px;top:1274px;transform:translateY(-50%);min-height:132px;display:flex;align-items:center;justify-content:center;color:#FFFFFF;opacity:0}
%R% .legende-seule .citation{max-width:860px;text-align:center;font-size:60px;font-weight:800;line-height:1.08;letter-spacing:-.01em;text-transform:uppercase;text-shadow:-3px -3px 0 ${PAL.encre},3px -3px 0 ${PAL.encre},-3px 3px 0 ${PAL.encre},3px 3px 0 ${PAL.encre},0 -3px 0 ${PAL.encre},0 3px 0 ${PAL.encre},-3px 0 0 ${PAL.encre},3px 0 0 ${PAL.encre},0 8px 20px rgba(0,0,0,.4)}`,
  html: `<div class="legende-seule" data-layout-allow-occlusion=""><div class="citation">Aujourd'hui, tout a changé</div></div>`,
  script: `
      tl.fromTo(root.querySelector('.legende-seule'),{y:30,opacity:0},{y:0,opacity:1,duration:.48,ease:'power3.out'},.2)
        .to(root.querySelector('.legende-seule'),{opacity:0,y:-16,duration:.32,ease:'power2.in'},4.6);`,
}));

export const reelBlocks = blocks;
