// Familles 16:9 (YouTube, vidéos longues) — 52 layouts.
// Grille : marge 40, couture 22, rayon 30. En 16:9 le split naturel est
// VERTICAL (visage d'un côté, écran de l'autre) — l'inverse du Reel.

import {
  PAL, GRAD_CARTE, GRAD_SOMBRE, HACHURE, HACHURE_SOMBRE,
  emit, ecranCss, ecranDiv, standaloneCss, standaloneHtml,
  silhouetteCss, silhouetteDiv,
} from "./lib.mjs";

const W = 1920, H = 1080, M = 40, SEAM = 22, R = 30;
const UH = H - 2 * M; // 1000 — hauteur utile

const cadreCss = (sel) =>
  `${sel} .face-cadre{position:absolute;z-index:5;border:7px solid #fffcd6;border-radius:${R}px;pointer-events:none;opacity:0}`;
const cadreDiv = (g) =>
  `<div class="face-cadre" style="left:${g.x - 7}px;top:${g.y - 7}px;width:${g.w + 14}px;height:${g.h + 14}px;"></div>`;

const entree = (dur, dirX = 70) => `
      tl.fromTo(root.querySelectorAll('.ecran'),{x:${dirX},opacity:0,scale:.97},{x:0,opacity:1,scale:1,duration:.5,ease:'power3.out',stagger:.12},.06)
        .to(root.querySelectorAll('.ecran'),{opacity:0,x:${dirX > 0 ? 44 : -44},duration:.35,ease:'power2.in'},${(dur - 0.4).toFixed(2)});
      const cadre=root.querySelector('.face-cadre');
      if(cadre)tl.fromTo(cadre,{opacity:0},{opacity:1,duration:.4,ease:'power2.out'},.2)
        .to(cadre,{opacity:0,duration:.3,ease:'power2.in'},${(dur - 0.38).toFixed(2)});`;

const DUR = 6;
const blocks = [];

/* ————— Y1 · Visage + 1 écran côte à côte (18 + 2 inclinés) ————— */
for (const side of ["droite", "gauche"]) {
  for (const part of [55, 65, 75]) {
    for (const style of ["carte", "nav", "bord"]) {
      const bord = style === "bord";
      const sw = bord ? Math.round(W * part / 100) - 3 : Math.round(W * part / 100) - M - SEAM / 2;
      const sx = bord ? (side === "droite" ? W - sw : 0) : (side === "droite" ? W - M - sw : M);
      const fw = bord ? W - sw - 6 : W - 2 * M - sw - SEAM;
      const fx = bord ? (side === "droite" ? 0 : sw + 6) : (side === "droite" ? M : M + sw + SEAM);
      const face = { x: fx, y: bord ? 0 : M, w: fw, h: bord ? H : UH, r: bord ? 0 : R };
      const styleTxt = { carte: "carte crème", nav: "fenêtre navigateur", bord: "bord à bord" }[style];
      blocks.push(emit({
        name: `meg-yt-ecran-${side}-${part}-${style}`,
        title: `YouTube — écran ${side} ${part} % (${styleTxt})`,
        desc: `Split 16:9 : écran ${styleTxt} à ${side} (${part} % de la largeur), visage master recadré sur le reste. Drag & drop : le bloc pilote le master.`,
        tags: ["youtube", "16-9", "layout", "split", side, style],
        family: "yt-split-solo",
        familyTitle: "YouTube — splits visage + 1 écran",
        variant: `${side} ${part} % ${styleTxt}`,
        ratio: "yt", duration: DUR,
        faceGeom: face,
        comment: `Layout YouTube 16:9 — écran ${side} ${part} % (${styleTxt}).
Le split roi des vidéos longues : démo/capture d'un côté, présentateur
de l'autre. Poser le bloc suffit (master piloté), remplacer la zone
hachurée par la capture.`,
        css: [
          ecranCss("%R%"),
          bord ? `%R% .couture{position:absolute;z-index:4;top:0;width:6px;height:100%;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55);left:${side === "droite" ? W - sw - 6 : sw}px}` : cadreCss("%R%"),
          standaloneCss("%R%", face),
        ].join("\n"),
        html: [
          ecranDiv({ x: sx, y: bord ? 0 : M, w: sw, h: bord ? H : UH, nav: style === "nav", bord }),
          bord ? `<div class="couture"></div>` : cadreDiv(face),
          standaloneHtml(),
        ].join("\n    "),
        script: entree(DUR, side === "droite" ? 70 : -70),
      }));
    }
  }
}
for (const side of ["droite", "gauche"]) {
  const sw = Math.round(W * 0.62) - M - SEAM / 2;
  const sx = side === "droite" ? W - M - sw : M;
  const fw = W - 2 * M - sw - SEAM;
  const fx = side === "droite" ? M : M + sw + SEAM;
  const face = { x: fx, y: M, w: fw, h: UH, r: R };
  blocks.push(emit({
    name: `meg-yt-ecran-${side}-62-incline`,
    title: `YouTube — écran ${side} 62 % incliné`,
    desc: `Split 16:9 dynamique : carte écran inclinée (-2°) à ${side}, visage master sur le reste.`,
    tags: ["youtube", "16-9", "layout", "split", side, "incline"],
    family: "yt-split-solo",
    familyTitle: "YouTube — splits visage + 1 écran",
    variant: `${side} 62 % incliné`,
    ratio: "yt", duration: DUR,
    faceGeom: face,
    comment: `Layout YouTube — carte écran inclinée (-2°), split plus vivant.
Inclinaison posée par gsap.set (jamais de transform CSS). Remplacer la
zone hachurée.`,
    css: [ecranCss("%R%"), cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
    html: [
      ecranDiv({ x: sx, y: M + 14, w: sw, h: UH - 28, extraClass: "penche" }),
      cadreDiv(face),
      standaloneHtml(),
    ].join("\n    "),
    script: `
      gsap.set(root.querySelector('.penche'),{rotation:${side === "droite" ? -2 : 2}});
      ${entree(DUR, side === "droite" ? 70 : -70)}`,
  }));
}

/* ————— Y2 · Écran plein + détouré / bande (6) ————— */
for (const silPos of ["droite", "gauche"]) {
  for (const taille of ["grand", "moyen"]) {
    const sw = taille === "grand" ? 640 : 480, sh = taille === "grand" ? 660 : 520;
    const sx = silPos === "droite" ? W - sw + 20 : -20;
    blocks.push(emit({
      name: `meg-yt-detoure-${silPos}-${taille}`,
      title: `YouTube — détouré ${silPos} (${taille})`,
      desc: `Layout fond vert 16:9 : écran plein cadre + silhouette détourée ancrée en bas à ${silPos} (${taille}). Remplacer par l'asset alpha.`,
      tags: ["youtube", "16-9", "layout", "detoure", "fond-vert", silPos],
      family: "yt-detoure",
      familyTitle: "YouTube — visage détouré (fond vert)",
      variant: `${silPos} ${taille}`,
      ratio: "yt", duration: DUR,
      faceMode: "hide",
      comment: `Layout YouTube DÉTOURÉ — écran plein cadre, présentateur détouré
ancré au bord bas ${silPos} (jamais un petit PIP coin : la silhouette est
grande). Master masqué : poser l'asset ALPHA à la place de la silhouette.`,
      css: [
        `%R% .fond-ecran{position:absolute;inset:0;z-index:1;background:${HACHURE};display:flex;align-items:flex-start;justify-content:center;padding-top:90px}
%R% .fond-ecran .etiquette{padding:14px 30px;border-radius:24px;background:${PAL.encre};color:${PAL.creme};font-size:40px;font-weight:700;letter-spacing:.05em}`,
        silhouetteCss("%R%"),
      ].join("\n"),
      html: [
        `<div class="fond-ecran" data-layout-allow-occlusion=""><span class="etiquette">ÉCRAN PLEIN CADRE — REMPLACER</span></div>`,
        silhouetteDiv({ x: sx, y: H - sh, w: sw, h: sh }),
      ].join("\n    "),
      script: `
      tl.fromTo(root.querySelector('.fond-ecran'),{opacity:0},{opacity:1,duration:.4,ease:'power2.out'},0)
        .fromTo(root.querySelector('.silhouette'),{y:80,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.18)
        .to([root.querySelector('.fond-ecran'),root.querySelector('.silhouette')],{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.38).toFixed(2)});`,
    }));
  }
}
for (const part of [25, 33]) {
  const bandH = Math.round(H * part / 100);
  const face = { x: 0, y: H - bandH, w: W, h: bandH, r: 0 };
  blocks.push(emit({
    name: `meg-yt-bande-bas-${part}`,
    title: `YouTube — écran dominant, bande visage bas ${part} %`,
    desc: `Layout 16:9 : écran bord à bord dominant + visage master en bande pleine largeur (${part} %) en bas.`,
    tags: ["youtube", "16-9", "layout", "bande"],
    family: "yt-bande",
    familyTitle: "YouTube — écran dominant + bande visage",
    variant: `bas ${part} %`,
    ratio: "yt", duration: DUR,
    faceGeom: face,
    comment: `Layout YouTube — l'écran domine, le visage reste en BANDE pleine
largeur en bas (alternative MEG au PIP coin, interdit). Remplacer la
zone hachurée.`,
    css: [
      `%R% .grand-ecran{position:absolute;z-index:3;left:0;top:0;width:${W}px;height:${H - bandH - 6}px;background:${HACHURE};display:flex;align-items:center;justify-content:center;opacity:0}
%R% .grand-ecran .etiquette{padding:14px 30px;border-radius:24px;background:${PAL.encre};color:${PAL.creme};font-size:40px;font-weight:700;letter-spacing:.05em}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - bandH - 6}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
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

/* ————— Y3 · Visage + 2 écrans (8) ————— */
const duosYt = [
  { key: "pile-droite", txt: "2 écrans empilés à droite", face: { x: M, y: M, w: 1000, h: UH, r: R },
    ecrans: () => { const x = M + 1000 + SEAM, w = W - M - x, h = (UH - 20) / 2;
      return [{ x, y: M, w, h, label: "ÉCRAN 1" }, { x, y: M + h + 20, w, h, label: "ÉCRAN 2" }]; } },
  { key: "pile-gauche", txt: "2 écrans empilés à gauche", face: { x: M + 818 + SEAM, y: M, w: 1000, h: UH, r: R },
    ecrans: () => { const w = 818, h = (UH - 20) / 2;
      return [{ x: M, y: M, w, h, label: "ÉCRAN 1" }, { x: M, y: M + h + 20, w, h, label: "ÉCRAN 2" }]; } },
  { key: "jumeaux-bande", txt: "2 écrans jumeaux + bande visage", face: { x: 0, y: 702, w: W, h: 378, r: 0 },
    ecrans: () => { const w = (W - 2 * M - SEAM) / 2;
      return [{ x: M, y: M, w, h: 600, label: "ÉCRAN 1" }, { x: M + w + SEAM, y: M, w, h: 600, label: "ÉCRAN 2" }]; } },
  { key: "principal-second", txt: "écran principal + vignette dessous", face: { x: M, y: M, w: 1010, h: UH, r: R },
    ecrans: () => { const x = M + 1010 + SEAM, w = W - M - x;
      return [{ x, y: M, w, h: 600, label: "ÉCRAN PRINCIPAL" }, { x, y: M + 620, w, h: 380, label: "ÉCRAN 2" }]; } },
];
for (const d of duosYt) {
  for (const style of ["carte", "nav"]) {
    blocks.push(emit({
      name: `meg-yt-duo-${d.key}-${style}`,
      title: `YouTube — duo ${d.txt} (${style})`,
      desc: `Split 16:9 à deux écrans : ${d.txt}, visage master recadré. Style ${style}.`,
      tags: ["youtube", "16-9", "layout", "duo", d.key, style],
      family: "yt-split-duo",
      familyTitle: "YouTube — splits visage + 2 écrans",
      variant: `${d.txt} ${style}`,
      ratio: "yt", duration: DUR,
      faceGeom: d.face,
      comment: `Layout YouTube à DEUX écrans — ${d.txt}. Chaque zone hachurée se
remplace indépendamment ; le bloc pilote le master.`,
      css: [ecranCss("%R%", { fontSize: 32, sub: false }), cadreCss("%R%"),
        d.key === "jumeaux-bande" ? `%R% .couture{position:absolute;z-index:4;left:0;top:696px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}` : "",
        standaloneCss("%R%", d.face)].join("\n"),
      html: [
        ...d.ecrans().map((e) => ecranDiv({ ...e, nav: style === "nav", sub: "" })),
        d.key === "jumeaux-bande" ? `<div class="couture"></div>` : cadreDiv(d.face),
        standaloneHtml(),
      ].join("\n    "),
      script: entree(DUR, d.key === "pile-gauche" ? -70 : 70),
    }));
  }
}

/* ————— Y4 · Visage + 3 écrans (2) ————— */
{
  const face = { x: M, y: M, w: 1080, h: UH, r: R };
  const x = M + 1080 + SEAM, w = W - M - x, h = (UH - 40) / 3;
  blocks.push(emit({
    name: "meg-yt-trio-colonne-droite",
    title: "YouTube — trio colonne droite",
    desc: "Split 16:9 à trois écrans empilés à droite, visage master pleine hauteur à gauche.",
    tags: ["youtube", "16-9", "layout", "trio"],
    family: "yt-split-trio",
    familyTitle: "YouTube — splits visage + 3 écrans",
    variant: "colonne droite",
    ratio: "yt", duration: DUR,
    faceGeom: face,
    comment: `Layout YouTube à TROIS écrans — colonne droite. Pour les process en
3 temps commentés face caméra. Le bloc pilote le master.`,
    css: [ecranCss("%R%", { fontSize: 28, sub: false }), cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
    html: [
      ...[0, 1, 2].map((i) => ecranDiv({ x, y: M + i * (h + 20), w, h, label: `ÉCRAN ${i + 1}`, sub: "" })),
      cadreDiv(face),
      standaloneHtml(),
    ].join("\n    "),
    script: entree(DUR, 70),
  }));
}
{
  const w2 = (W - 2 * M - SEAM) / 2;
  const face = { x: M + w2 + SEAM, y: M + 480 + 20, w: w2, h: 500, r: R };
  blocks.push(emit({
    name: "meg-yt-trio-grille",
    title: "YouTube — trio en grille",
    desc: "Split 16:9 : 3 écrans en grille 2×2, visage master dans le quart bas-droit.",
    tags: ["youtube", "16-9", "layout", "trio", "grille"],
    family: "yt-split-trio",
    familyTitle: "YouTube — splits visage + 3 écrans",
    variant: "grille 2×2",
    ratio: "yt", duration: DUR,
    faceGeom: face,
    comment: `Layout YouTube — grille 2×2 : trois écrans + le visage dans le quart
bas-droit. Pour les comparatifs multi-sources. Le bloc pilote le master.`,
    css: [ecranCss("%R%", { fontSize: 30, sub: false }), cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
    html: [
      ecranDiv({ x: M, y: M, w: w2, h: 480, label: "ÉCRAN 1", sub: "" }),
      ecranDiv({ x: M + w2 + SEAM, y: M, w: w2, h: 480, label: "ÉCRAN 2", sub: "" }),
      ecranDiv({ x: M, y: M + 500, w: w2, h: 500, label: "ÉCRAN 3", sub: "" }),
      cadreDiv(face),
      standaloneHtml(),
    ].join("\n    "),
    script: entree(DUR, 70),
  }));
}

/* ————— Y5 · Intros / hooks (4) ————— */
const bandeYt = { x: 0, y: H - 330, w: W, h: 330, r: 0 };
const introYtCss = `
%R% .scene{position:absolute;z-index:3;left:0;top:0;width:${W}px;height:${H - 330}px;background:${GRAD_CARTE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;padding:60px 160px;color:${PAL.encre};text-align:center}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 336}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}
%R% .titre-geant{font-size:104px;line-height:.96;font-weight:700;letter-spacing:-.03em;word-spacing:.05em}
%R% .sous-titre{font-size:38px;font-weight:600;opacity:.62}
%R% .gelule{display:inline-block;padding:14px 32px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:30px;font-weight:700;letter-spacing:.06em}`;
const introsYt = [
  { key: "titre-plein", txt: "grand titre",
    html: `<div class="scene" data-layout-allow-occlusion=""><span class="gelule">NOUVELLE VIDÉO</span><div class="titre-geant">Votre titre en deux lignes<br>à remplacer</div><div class="sous-titre">Sous-titre à remplacer</div></div>`,
    script: `tl.fromTo(root.querySelector('.gelule'),{y:-36,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.titre-geant'),{y:50,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.18)
        .fromTo(root.querySelector('.sous-titre'),{opacity:0},{opacity:1,duration:.4},.5);` },
  { key: "question", txt: "question centrale",
    html: `<div class="scene" data-layout-allow-occlusion=""><div class="titre-geant">La question qui fâche ?</div><span class="gelule">RÉPONSE DANS LA VIDÉO</span></div>`,
    script: `tl.fromTo(root.querySelector('.titre-geant'),{scale:.9,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.4)'},.08)
        .fromTo(root.querySelector('.gelule'),{y:30,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.42);` },
  { key: "hook-chiffre", txt: "chiffre choc",
    html: `<div class="scene" data-layout-allow-occlusion="" style="flex-direction:row;gap:70px;"><div class="titre-geant" style="font-size:250px;color:${PAL.or};-webkit-text-stroke:3px ${PAL.encre};">87 %</div><div class="sous-titre" style="font-size:52px;opacity:1;font-weight:700;text-align:left;">des dossiers sont refusés<br>pour cette raison</div></div>`,
    script: `tl.fromTo(root.querySelector('.titre-geant'),{scale:.7,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.6)'},.08)
        .fromTo(root.querySelector('.sous-titre'),{x:50,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out'},.4);` },
];
for (const it of introsYt) {
  blocks.push(emit({
    name: `meg-yt-intro-${it.key}`,
    title: `YouTube — intro ${it.txt}`,
    desc: `Intro 16:9 : ${it.txt} plein cadre + visage master en bande basse. Textes à remplacer.`,
    tags: ["youtube", "16-9", "layout", "intro", it.key],
    family: "yt-intro",
    familyTitle: "YouTube — intros & hooks",
    variant: it.txt,
    ratio: "yt", duration: 5,
    faceGeom: bandeYt,
    comment: `Intro YouTube — ${it.txt}. Visage en bande basse, textes à remplacer,
animations incluses. Enchaîner sur un split une fois le hook posé.`,
    css: [introYtCss, standaloneCss("%R%", bandeYt)].join("\n"),
    html: [it.html, `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `${it.script}
      tl.to(root.querySelector('.scene'),{opacity:0,duration:.35,ease:'power2.in'},4.6);`,
  }));
}
{
  const face = { x: 1250, y: M, w: 630, h: UH, r: R };
  blocks.push(emit({
    name: "meg-yt-intro-sommaire",
    title: "YouTube — intro sommaire",
    desc: "Intro 16:9 : sommaire 3 points à gauche + visage master pleine hauteur à droite.",
    tags: ["youtube", "16-9", "layout", "intro", "sommaire"],
    family: "yt-intro",
    familyTitle: "YouTube — intros & hooks",
    variant: "sommaire 3 points",
    ratio: "yt", duration: 5,
    faceGeom: face,
    comment: `Intro YouTube — sommaire en 3 points annoncé face caméra (visage à
droite pleine hauteur). Remplacer les trois lignes.`,
    css: [`%R% .panneau{position:absolute;z-index:3;left:${M}px;top:${M}px;width:${1250 - M - SEAM}px;height:${UH}px;border-radius:${R}px;background:${GRAD_CARTE};box-shadow:0 34px 78px rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:center;gap:38px;padding:70px 80px;color:${PAL.encre};opacity:0}
%R% .gelule{align-self:flex-start;display:inline-block;padding:14px 32px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:30px;font-weight:700;letter-spacing:.06em}
%R% .point{display:flex;gap:24px;align-items:center;font-size:50px;font-weight:700;opacity:0}
%R% .point .n{color:${PAL.or}}`,
      cadreCss("%R%"), standaloneCss("%R%", face)].join("\n"),
    html: [`<div class="panneau" data-layout-allow-occlusion=""><span class="gelule">AU PROGRAMME</span>
      <div class="point"><span class="n">1.</span><span>Premier point à remplacer</span></div>
      <div class="point"><span class="n">2.</span><span>Deuxième point à remplacer</span></div>
      <div class="point"><span class="n">3.</span><span>Troisième point à remplacer</span></div></div>`,
      cadreDiv(face), standaloneHtml()].join("\n    "),
    script: `
      tl.fromTo(root.querySelector('.panneau'),{x:-70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.06)
        .fromTo(root.querySelectorAll('.point'),{x:-50,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out',stagger:.16},.3);
      const cadre=root.querySelector('.face-cadre');
      if(cadre)tl.fromTo(cadre,{opacity:0},{opacity:1,duration:.4},.2);`,
  }));
}

/* ————— Y6 · Chapitres (3) ————— */
const chapitresYt = [
  { key: "carton", txt: "carton numéro",
    css: `%R% .carton{position:absolute;z-index:3;left:120px;top:330px;width:760px;border-radius:40px;background:${GRAD_CARTE};box-shadow:0 40px 88px rgba(0,0,0,.4);padding:56px 64px;color:${PAL.encre};opacity:0}
%R% .num{font-size:130px;font-weight:700;color:${PAL.or};line-height:.9}
%R% .chap{margin-top:12px;font-size:54px;font-weight:700;letter-spacing:-.02em;line-height:1.02}`,
    html: `<div class="carton" data-layout-allow-occlusion=""><div class="num">02</div><div class="chap">Titre du chapitre<br>à remplacer</div></div>`,
    script: `tl.fromTo(root.querySelector('.carton'),{y:60,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.5,ease:'power3.out'},.1)
        .to(root.querySelector('.carton'),{opacity:0,y:-40,duration:.4,ease:'power2.in'},3.4);` },
  { key: "bandeau-lateral", txt: "bandeau latéral",
    css: `%R% .bandeau{position:absolute;z-index:3;left:0;top:0;width:120px;height:100%;background:${PAL.encre};display:flex;align-items:center;justify-content:center;opacity:0}
%R% .vertical{white-space:nowrap;color:${PAL.creme};font-size:44px;font-weight:700;letter-spacing:.14em}
%R% .filet-or{position:absolute;z-index:4;left:120px;top:0;width:7px;height:100%;background:${PAL.or};opacity:0}`,
    html: `<div class="bandeau" data-layout-allow-occlusion=""><span class="vertical">CHAPITRE 2 — LE DOSSIER</span></div><div class="filet-or"></div>`,
    script: `gsap.set(root.querySelector('.vertical'),{rotation:-90});
      tl.fromTo(root.querySelector('.bandeau'),{x:-130,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.filet-or'),{opacity:0},{opacity:1,duration:.3},.4)
        .to([root.querySelector('.bandeau'),root.querySelector('.filet-or')],{x:-140,opacity:0,duration:.4,ease:'power2.in'},3.5);` },
  { key: "barre-basse", txt: "barre basse + jauge",
    css: `%R% .barre-chap{position:absolute;z-index:3;left:60px;bottom:60px;right:60px;height:88px;border-radius:24px;background:rgba(47,44,0,.82);display:flex;align-items:center;gap:22px;padding:0 32px;color:${PAL.creme};opacity:0}
%R% .barre-chap .num-or{font-size:40px;font-weight:700;color:${PAL.or}}
%R% .barre-chap .lib{font-size:34px;font-weight:600}
%R% .jauge{position:absolute;left:0;bottom:0;height:6px;border-radius:3px;background:${PAL.or};width:100%;transform-origin:left}`,
    html: `<div class="barre-chap" data-layout-allow-occlusion=""><span class="num-or">02</span><span class="lib">Titre du chapitre à remplacer</span><span class="jauge"></span></div>`,
    script: `tl.fromTo(root.querySelector('.barre-chap'),{y:36,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.jauge'),{scaleX:0},{scaleX:.5,duration:1.6,ease:'power1.inOut'},.5)
        .to(root.querySelector('.barre-chap'),{opacity:0,y:26,duration:.35,ease:'power2.in'},3.55);` },
];
for (const c of chapitresYt) {
  blocks.push(emit({
    name: `meg-yt-chapitre-${c.key}`,
    title: `YouTube — chapitre ${c.txt}`,
    desc: `Carton de chapitre 16:9 : ${c.txt}, posé par-dessus le master intact.`,
    tags: ["youtube", "16-9", "layout", "chapitre", c.key],
    family: "yt-chapitre",
    familyTitle: "YouTube — cartons de chapitre",
    variant: c.txt,
    ratio: "yt", duration: 4,
    faceMode: "none",
    comment: `Carton de chapitre YouTube — ${c.txt}. Master plein cadre intact,
habillage par-dessus. Remplacer numéro et libellé.`,
    css: c.css,
    html: c.html,
    script: c.script,
  }));
}

/* ————— Y7 · Outros / CTA (3) ————— */
blocks.push(emit({
  name: "meg-yt-outro-ecran-fin",
  title: "YouTube — écran de fin",
  desc: "Écran de fin 16:9 : visage master à gauche + deux emplacements vidéos suivantes à droite (zones end-screen YouTube).",
  tags: ["youtube", "16-9", "layout", "outro", "ecran-fin"],
  family: "yt-outro",
  familyTitle: "YouTube — outros & CTA",
  variant: "écran de fin",
  ratio: "yt", duration: 8,
  faceGeom: { x: 70, y: 290, w: 640, h: 500, r: R },
  comment: `Écran de fin YouTube — le visage conclut à gauche, les deux cartes à
droite matérialisent les zones end-screen (vidéo suivante + playlist)
qu'on active dans YouTube Studio. Durée 8 s (minimum end-screen 5 s).`,
  css: [`%R% .fond{position:absolute;inset:0;z-index:1}
%R% .fond span{position:absolute;background-image:${GRAD_SOMBRE};background-size:${W}px ${H}px}
%R% .carte-video{position:absolute;z-index:3;left:800px;width:1050px;height:390px;box-sizing:border-box;border-radius:${R}px;border:5px dashed rgba(255,252,214,.5);background:${HACHURE_SOMBRE};display:flex;align-items:center;justify-content:center;gap:20px;color:${PAL.creme};font-size:34px;font-weight:700;letter-spacing:.03em;opacity:0}
%R% .mention{position:absolute;z-index:3;left:70px;top:830px;width:640px;text-align:center;color:${PAL.or};font-size:34px;font-weight:700;opacity:0}`,
    cadreCss("%R%"), standaloneCss("%R%", { x: 70, y: 290, w: 640, h: 500, r: R })].join("\n"),
  html: [`<div class="fond" data-layout-allow-occlusion=""><span style="left:0;top:0;width:${W}px;height:290px;background-position:0 0" data-layout-allow-occlusion=""></span><span style="left:0;top:290px;width:70px;height:500px;background-position:0 -290px" data-layout-allow-occlusion=""></span><span style="left:710px;top:290px;width:${W - 710}px;height:500px;background-position:-710px -290px" data-layout-allow-occlusion=""></span><span style="left:0;top:790px;width:${W}px;height:${H - 790}px;background-position:0 -790px" data-layout-allow-occlusion=""></span></div>`,
    `<div class="carte-video" style="top:120px;">ZONE END-SCREEN — VIDÉO SUIVANTE</div>`,
    `<div class="carte-video" style="top:570px;">ZONE END-SCREEN — PLAYLIST</div>`,
    `<div class="mention">megbusiness360.com</div>`,
    cadreDiv({ x: 70, y: 290, w: 640, h: 500, r: R }), standaloneHtml("MASTER — VOUS")].join("\n    "),
  script: `
      tl.fromTo(root.querySelector('.fond'),{opacity:0},{opacity:1,duration:.5},0)
        .fromTo(root.querySelectorAll('.carte-video'),{x:70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out',stagger:.16},.3)
        .fromTo(root.querySelector('.mention'),{opacity:0},{opacity:1,duration:.4},.7);
      const cadre=root.querySelector('.face-cadre');
      if(cadre)tl.fromTo(cadre,{opacity:0},{opacity:1,duration:.4},.3);`,
}));
blocks.push(emit({
  name: "meg-yt-outro-carte-marque",
  title: "YouTube — outro carte de marque",
  desc: "Outro 16:9 plein cadre : marque MEG + invitation indirecte + URL mise en avant.",
  tags: ["youtube", "16-9", "layout", "outro", "marque"],
  family: "yt-outro",
  familyTitle: "YouTube — outros & CTA",
  variant: "carte de marque",
  ratio: "yt", duration: 5,
  faceMode: "none",
  comment: `Outro YouTube — carte de marque plein cadre. L'invitation reste
indirecte (règles MEG), l'URL est le geste graphique central.`,
  css: `%R% .fond{position:absolute;inset:0;z-index:3;background:${GRAD_SOMBRE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;color:${PAL.creme};text-align:center;opacity:0}
%R% .marque{font-size:76px;font-weight:700;letter-spacing:-.02em}
%R% .invit{font-size:38px;font-weight:600;opacity:.85;max-width:900px;line-height:1.2}
%R% .url-avant{font-size:54px;font-weight:700;color:${PAL.or};letter-spacing:.02em}`,
  html: `<div class="fond" data-layout-allow-occlusion=""><div class="marque">MEG Business 360</div><div class="invit">On regarde votre dossier ensemble sur</div><div class="url-avant">megbusiness360.com</div></div>`,
  script: `
      tl.fromTo(root.querySelector('.fond'),{opacity:0},{opacity:1,duration:.5,ease:'power2.out'},.05)
        .fromTo(root.querySelector('.marque'),{y:36,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.2)
        .fromTo(root.querySelector('.invit'),{y:26,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.42)
        .fromTo(root.querySelector('.url-avant'),{scale:.85,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.6)'},.62);`,
}));
blocks.push(emit({
  name: "meg-yt-outro-recap",
  title: "YouTube — outro récap 3 points",
  desc: "Outro 16:9 : récapitulatif 3 points à gauche + visage master à droite.",
  tags: ["youtube", "16-9", "layout", "outro", "recap"],
  family: "yt-outro",
  familyTitle: "YouTube — outros & CTA",
  variant: "récap 3 points",
  ratio: "yt", duration: 6,
  faceGeom: { x: 1250, y: M, w: 630, h: UH, r: R },
  comment: `Outro YouTube — récap en 3 points cochés, visage à droite. Remplacer
les trois lignes par les vrais points de la vidéo.`,
  css: [`%R% .panneau{position:absolute;z-index:3;left:${M}px;top:${M}px;width:${1250 - M - SEAM}px;height:${UH}px;border-radius:${R}px;background:${GRAD_CARTE};box-shadow:0 34px 78px rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:center;gap:34px;padding:70px 80px;color:${PAL.encre};opacity:0}
%R% .titre-recap{font-size:58px;font-weight:700;letter-spacing:-.02em;margin-bottom:8px}
%R% .ligne{display:flex;gap:22px;align-items:center;font-size:42px;font-weight:600;opacity:0}
%R% .coche{width:50px;height:50px;flex:none;border-radius:50%;background:${PAL.or};display:flex;align-items:center;justify-content:center}
%R% .coche svg{width:28px;height:28px}
%R% .coche path{fill:none;stroke:${PAL.encre};stroke-width:7;stroke-linecap:round;stroke-linejoin:round}`,
    cadreCss("%R%"), standaloneCss("%R%", { x: 1250, y: M, w: 630, h: UH, r: R })].join("\n"),
  html: [`<div class="panneau" data-layout-allow-occlusion=""><div class="titre-recap">À retenir</div>
    <div class="ligne"><span class="coche"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span><span>Premier point à remplacer</span></div>
    <div class="ligne"><span class="coche"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span><span>Deuxième point à remplacer</span></div>
    <div class="ligne"><span class="coche"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></span><span>Troisième point à remplacer</span></div></div>`,
    cadreDiv({ x: 1250, y: M, w: 630, h: UH, r: R }), standaloneHtml()].join("\n    "),
  script: `
      tl.fromTo(root.querySelector('.panneau'),{x:-70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.06)
        .fromTo(root.querySelectorAll('.ligne'),{x:-50,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out',stagger:.18},.3);
      const cadre=root.querySelector('.face-cadre');
      if(cadre)tl.fromTo(cadre,{opacity:0},{opacity:1,duration:.4},.2);`,
}));

/* ————— Y8 · Habillages (4) ————— */
const habillagesYt = [
  { key: "cadre-fin-or", txt: "cadre fin or", font: false,
    css: `%R% .cadre{position:absolute;z-index:3;inset:34px;border:4px solid ${PAL.or};border-radius:26px;pointer-events:none;opacity:0}`,
    html: `<div class="cadre"></div>`,
    script: `tl.fromTo(root.querySelector('.cadre'),{opacity:0,scale:1.03},{opacity:1,scale:1,duration:.5,ease:'power2.out'},.05);` },
  { key: "bandes-cinema", txt: "bandes cinéma", font: false,
    css: `%R% .bande{position:absolute;z-index:3;left:0;width:100%;height:0;background:#1F1D00}
%R% .bande.h{top:0}%R% .bande.b{bottom:0}`,
    html: `<div class="bande h" data-layout-allow-occlusion=""></div><div class="bande b" data-layout-allow-occlusion=""></div>`,
    script: `tl.to(root.querySelectorAll('.bande'),{height:120,duration:.7,ease:'power3.inOut'},.05);` },
  { key: "header-marque", txt: "bande de marque haute", font: true,
    css: `%R% .bande-h{position:absolute;z-index:3;left:0;top:0;width:100%;height:96px;background:${PAL.creme};display:flex;align-items:center;justify-content:space-between;padding:0 60px;color:${PAL.encre};font-size:32px;font-weight:700;letter-spacing:.08em;opacity:0}
%R% .bande-h .url{color:${PAL.or}}`,
    html: `<div class="bande-h" data-layout-allow-occlusion=""><span>MEG BUSINESS 360</span><span class="url">megbusiness360.com</span></div>`,
    script: `tl.fromTo(root.querySelector('.bande-h'),{y:-96,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.05);` },
  { key: "vignette-focus", txt: "vignette de focus", font: false,
    css: `%R% .vignette{position:absolute;z-index:3;inset:0;background:radial-gradient(64% 70% at 50% 46%,rgba(0,0,0,0) 58%,rgba(31,29,0,.52) 100%);pointer-events:none;opacity:0}`,
    html: `<div class="vignette" data-layout-allow-occlusion=""></div>`,
    script: `tl.fromTo(root.querySelector('.vignette'),{opacity:0},{opacity:1,duration:.8,ease:'power2.out'},.05);` },
];
for (const hb of habillagesYt) {
  blocks.push(emit({
    name: `meg-yt-habillage-${hb.key}`,
    title: `YouTube — habillage ${hb.txt}`,
    desc: `Habillage plein cadre 16:9 : ${hb.txt} par-dessus le master intact.`,
    tags: ["youtube", "16-9", "habillage", "overlay", hb.key],
    family: "yt-habillage",
    familyTitle: "YouTube — habillages plein cadre",
    variant: hb.txt,
    ratio: "yt", duration: DUR,
    faceMode: "none",
    needsFont: hb.font,
    comment: `Habillage YouTube — ${hb.txt}. Master plein cadre intact, l'habillage
se pose dessus et s'étire sur la durée voulue.`,
    css: hb.css,
    html: hb.html,
    script: hb.script,
  }));
}

/* ————— Y9 · Avant / après (2) ————— */
{
  const colW = Math.round((W - 2 * M - SEAM) / 2);
  const face = { x: 0, y: H - 330, w: W, h: 330, r: 0 };
  blocks.push(emit({
    name: "meg-yt-avant-apres-colonnes",
    title: "YouTube — avant/après deux colonnes",
    desc: "Comparatif 16:9 : colonnes AVANT/APRÈS côte à côte + visage master en bande basse.",
    tags: ["youtube", "16-9", "layout", "avant-apres"],
    family: "yt-avant-apres",
    familyTitle: "YouTube — avant/après",
    variant: "deux colonnes",
    ratio: "yt", duration: DUR,
    faceGeom: face,
    comment: `Comparatif YouTube AVANT/APRÈS — deux colonnes. L'APRÈS porte le
cadre crème, l'AVANT reste mat. Remplacer les deux zones.`,
    css: [`%R% .col{position:absolute;z-index:3;top:${M}px;width:${colW}px;height:${H - 330 - M - 40}px;box-sizing:border-box;border-radius:${R}px;display:flex;align-items:flex-start;justify-content:center;padding-top:50px;opacity:0}
%R% .col.avant{left:${M}px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4)}
%R% .col.apres{left:${M + colW + SEAM}px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 30px 70px rgba(0,0,0,.25)}
%R% .col .tag{padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:34px;font-weight:700;letter-spacing:.06em}
%R% .col.apres .tag{background:${PAL.or};color:${PAL.encre}}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 336}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", face)].join("\n"),
    html: [`<div class="col avant" data-layout-allow-occlusion=""><span class="tag">AVANT</span></div>`,
      `<div class="col apres" data-layout-allow-occlusion=""><span class="tag">APRÈS</span></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `
      tl.fromTo(root.querySelector('.col.avant'),{x:-70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.col.apres'),{x:70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.22)
        .to(root.querySelectorAll('.col'),{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});`,
  }));
}
{
  const face = { x: 0, y: H - 330, w: W, h: 330, r: 0 };
  blocks.push(emit({
    name: "meg-yt-avant-apres-cartes",
    title: "YouTube — avant/après cartes inclinées",
    desc: "Comparatif 16:9 : deux cartes inclinées qui se chevauchent + visage master en bande basse.",
    tags: ["youtube", "16-9", "layout", "avant-apres", "cartes"],
    family: "yt-avant-apres",
    familyTitle: "YouTube — avant/après",
    variant: "cartes inclinées",
    ratio: "yt", duration: DUR,
    faceGeom: face,
    comment: `Comparatif YouTube — deux cartes inclinées, l'APRÈS passe devant.
Inclinaisons posées par gsap.set. Remplacer les deux zones.`,
    css: [`%R% .carte-av{position:absolute;z-index:3;width:820px;height:560px;box-sizing:border-box;border-radius:${R}px;display:flex;align-items:flex-start;justify-content:center;padding-top:44px;opacity:0}
%R% .carte-av.avant{left:170px;top:80px;background:${HACHURE_SOMBRE};border:5px dashed rgba(47,44,0,.4)}
%R% .carte-av.apres{left:860px;top:140px;background:${HACHURE};border:7px solid #fffcd6;box-shadow:0 40px 90px rgba(0,0,0,.4)}
%R% .carte-av .tag{padding:12px 30px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:32px;font-weight:700;letter-spacing:.06em}
%R% .carte-av.apres .tag{background:${PAL.or};color:${PAL.encre}}
%R% .couture{position:absolute;z-index:4;left:0;top:${H - 336}px;width:100%;height:6px;background:${PAL.or};box-shadow:0 0 34px rgba(185,170,2,.55)}`,
      standaloneCss("%R%", face)].join("\n"),
    html: [`<div class="carte-av avant" data-layout-allow-occlusion=""><span class="tag">AVANT</span></div>`,
      `<div class="carte-av apres" data-layout-allow-occlusion=""><span class="tag">APRÈS</span></div>`,
      `<div class="couture"></div>`, standaloneHtml("MASTER — BANDE VISAGE")].join("\n    "),
    script: `gsap.set(root.querySelector('.carte-av.avant'),{rotation:-3});gsap.set(root.querySelector('.carte-av.apres'),{rotation:2});
      tl.fromTo(root.querySelector('.carte-av.avant'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.08)
        .fromTo(root.querySelector('.carte-av.apres'),{y:80,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.3)
        .to(root.querySelectorAll('.carte-av'),{opacity:0,duration:.35,ease:'power2.in'},${(DUR - 0.4).toFixed(2)});`,
  }));
}

export const ytBlocks = blocks;
