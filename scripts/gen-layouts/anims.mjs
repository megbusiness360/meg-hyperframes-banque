// Bibliothèque d'animations & effets MEG — 26 blocs (13 effets × 2 ratios).
// Complète les transitions v1 (balayage, volets, 9:16 seulement) : chaque
// effet existe en Reel 1080×1920 ET en YouTube 1920×1080. Tout est
// autonome : poser le bloc, remplacer le texte s'il y en a, rien d'autre.

import { PAL, GRAD_CARTE, GRAD_SOMBRE, RATIOS, emit } from "./lib.mjs";

const blocks = [];

// Script master avec substitut : les effets qui pilotent le master doivent
// aussi se voir en aperçu standalone (lint / preview sans projet).
const masterAvecSubstitut = (tween) => `
      let cible=document.querySelector('#meg-master-frame');
      if(!cible){const s=root.querySelector('.substitut');if(s){s.style.display='block';cible=s;}}
      if(cible){${tween}
      }`;
const substitutCss = `%R% .substitut{position:absolute;inset:0;z-index:1;background:${GRAD_SOMBRE};display:none}`;
const substitutHtml = `<div class="substitut" data-layout-allow-occlusion=""></div>`;

for (const ratio of ["reel", "yt"]) {
  const RA = RATIOS[ratio];
  const { w: W, h: H } = RA;
  const suffixe = ratio === "reel" ? "Reel 9:16" : "YouTube 16:9";
  const cx = W / 2, cy = H / 2;

  /* ——— Transitions (3) ——— */
  blocks.push(emit({
    name: `meg-anim-flash-${ratio}`,
    title: `Transition flash crème — ${suffixe}`,
    desc: `Flash crème 0,6 s à poser à cheval sur un cut : monte vite, cache le cut au pic, retombe.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "transition", "flash"],
    family: `anim-transition-${ratio}`,
    familyTitle: `Transitions — ${suffixe}`,
    variant: "flash crème",
    ratio, duration: 0.6, faceMode: "none", needsFont: false, posterAt: 0.15,
    comment: `Transition flash — un voile crème qui claque. À poser À CHEVAL sur un
cut : opacité maximale à mi-course (0.3 s), c'est là que le cut se cache.
Pour les micro-cuts rapides ; le balayage et les volets restent pour les
changements de chapitre.`,
    css: `%R% .flash{position:absolute;inset:0;z-index:40;background:${GRAD_CARTE};opacity:0}`,
    html: `<div class="flash" data-layout-allow-occlusion=""></div>`,
    script: `
      tl.fromTo(root.querySelector('.flash'),{opacity:0},{opacity:1,duration:.3,ease:'power2.in'},0)
        .to(root.querySelector('.flash'),{opacity:0,duration:.3,ease:'power2.out'},.3);`,
  }));

  blocks.push(emit({
    name: `meg-anim-glisse-${ratio}`,
    title: `Transition glissement vertical — ${suffixe}`,
    desc: `Voile crème qui monte du bas, couvre l'écran à mi-course, puis sort par le haut. 1 s, à cheval sur un cut.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "transition", "glisse"],
    family: `anim-transition-${ratio}`,
    familyTitle: `Transitions — ${suffixe}`,
    variant: "glissement vertical",
    ratio, duration: 1, faceMode: "none", needsFont: false, posterAt: 0.3,
    comment: `Transition glissement — le voile monte du bas et sort par le haut,
bord de fuite or. Couvre tout à t=0.5 : caler le cut à cet instant.
Aucun transform CSS : l'état hors champ est posé par le from du fromTo,
en px (piège GSAP gravé).`,
    css: `%R% .voile-v{position:absolute;z-index:40;left:0;top:0;width:100%;height:112%;background:${GRAD_CARTE}}
%R% .voile-v .bord-or{position:absolute;left:0;top:-8px;width:100%;height:26px;background:${PAL.or};box-shadow:0 0 54px rgba(185,170,2,.55)}`,
    html: `<div class="voile-v" data-layout-allow-occlusion="" data-layout-allow-overflow=""><div class="bord-or"></div></div>`,
    script: `
      tl.fromTo(root.querySelector('.voile-v'),{y:${Math.round(H * 1.14)}},{y:0,duration:.5,ease:'power2.in'},0)
        .to(root.querySelector('.voile-v'),{y:${-Math.round(H * 1.16)},duration:.5,ease:'power2.out'},.5);`,
  }));

  // Iris centré sur le VISAGE (tiers haut du master), jamais sur le centre
  // géométrique (= la bouche en 9:16). Rayon depuis ce foyer jusqu'au coin
  // le plus lointain, pour couvrir tout le cadre au pic.
  const icy = Math.round(H * (ratio === "reel" ? 0.33 : 0.30));
  const irad = Math.round(Math.hypot(Math.max(cx, W - cx), Math.max(icy, H - icy))) + 40;
  blocks.push(emit({
    name: `meg-anim-iris-${ratio}`,
    title: `Transition iris — ${suffixe}`,
    desc: `Disque encre qui se referme sur le visage puis se rouvre. 1 s, à cheval sur un cut — la plus cinéma des transitions.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "transition", "iris"],
    family: `anim-transition-${ratio}`,
    familyTitle: `Transitions — ${suffixe}`,
    variant: "iris",
    ratio, duration: 1, faceMode: "none", needsFont: false, posterAt: 0.3,
    comment: `Transition iris — un disque encre grandit depuis le VISAGE (tiers
haut du cadre) jusqu'à tout couvrir (t=0.5 : caler le cut), puis se
résorbe. Liseré or. Le disque est un élément propre animé en scale par
GSAP (jamais de transform CSS sur un élément tweené).`,
    css: `%R% .iris{position:absolute;z-index:40;left:${cx - irad}px;top:${icy - irad}px;width:${irad * 2}px;height:${irad * 2}px;border-radius:50%;background:${GRAD_SOMBRE};box-shadow:inset 0 0 0 12px ${PAL.or}}`,
    html: `<div class="iris" data-layout-allow-occlusion="" data-layout-allow-overflow=""></div>`,
    script: `
      tl.fromTo(root.querySelector('.iris'),{scale:0},{scale:1,duration:.5,ease:'power2.in'},0)
        .to(root.querySelector('.iris'),{scale:0,duration:.5,ease:'power2.out'},.5);`,
  }));

  /* ——— Effets caméra sur le master (3) ——— */
  blocks.push(emit({
    name: `meg-anim-zoom-punch-${ratio}`,
    title: `Effet zoom punch — ${suffixe}`,
    desc: `Coup de zoom sec sur le master (1 → 1.07 → 1) pour appuyer un mot fort. 1 s, se pose tel quel.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "effet", "zoom"],
    family: `anim-camera-${ratio}`,
    familyTitle: `Effets caméra — ${suffixe}`,
    variant: "zoom punch",
    ratio, duration: 1, faceMode: "none", needsFont: false, posterAt: 0.25,
    master: masterAvecSubstitut(`
        /* Punch d'emphase : sec à l'aller, retour souple — finit à scale 1,
           le master ressort intact. */
        tl.fromTo(cible,{scale:1},{scale:1.07,duration:.16,ease:'power2.out'},.08)
          .to(cible,{scale:1,duration:.4,ease:'power2.inOut'},.3);`),
    comment: `Effet zoom punch — le master prend un coup de zoom (1.07) et
redescend. À poser sur le mot fort de la phrase. Finit à l'identique :
aucun réglage, enchaînable.`,
    css: substitutCss,
    html: substitutHtml,
    script: ``,
  }));

  blocks.push(emit({
    name: `meg-anim-secousse-${ratio}`,
    title: `Effet secousse — ${suffixe}`,
    desc: `Secousse horizontale brève du master (±16 px) pour un mot choc ou une rupture. 0,8 s.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "effet", "secousse"],
    family: `anim-camera-${ratio}`,
    familyTitle: `Effets caméra — ${suffixe}`,
    variant: "secousse",
    ratio, duration: 0.8, faceMode: "none", needsFont: false, posterAt: 0.15,
    master: masterAvecSubstitut(`
        /* Secousse amortie en px, finit à x:0 — master intact en sortie. */
        tl.to(cible,{x:-16,duration:.06,ease:'power1.inOut'},.05)
          .to(cible,{x:12,duration:.06,ease:'power1.inOut'},.12)
          .to(cible,{x:-7,duration:.05,ease:'power1.inOut'},.19)
          .to(cible,{x:0,duration:.08,ease:'power2.out'},.25);`),
    comment: `Effet secousse — le cadre tremble une fois, amorti. Pour un chiffre
choc ou une rupture de ton. Finit à x:0 : master intact.`,
    css: substitutCss,
    html: substitutHtml,
    script: ``,
  }));

  blocks.push(emit({
    name: `meg-anim-recadrage-lent-${ratio}`,
    title: `Effet recadrage lent — ${suffixe}`,
    desc: `Zoom avant très lent du master (1 → 1.08) sur 8 s, pour tenir un plan face caméra. Poser juste avant un cut.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "effet", "recadrage"],
    family: `anim-camera-${ratio}`,
    familyTitle: `Effets caméra — ${suffixe}`,
    variant: "recadrage lent",
    ratio, duration: 8, faceMode: "none", needsFont: false, posterAt: 6,
    master: masterAvecSubstitut(`
        /* Zoom lent continu, restauration instantanée à la toute fin :
           poser le bloc juste AVANT un cut pour cacher le retour. */
        tl.fromTo(cible,{scale:1},{scale:1.08,duration:7.9,ease:'none'},0)
          .set(cible,{scale:1},8);`),
    comment: `Effet recadrage lent — micro-zoom continu qui garde un plan face
caméra vivant 8 s. Le retour à l'échelle 1 est instantané en toute fin :
poser le bloc juste avant un cut.`,
    css: substitutCss,
    html: substitutHtml,
    script: ``,
  }));

  /* ——— Accents graphiques (3) ——— */
  /* Défauts en zone NEUTRE (torse reel, tiers gauche yt) : jamais sur la
     bouche/les yeux du master — le monteur repositionne ensuite. */
  const zone = ratio === "reel"
    ? { x: 190, y: 1140, w: 700, h: 300 }
    : { x: 60, y: 390, w: 600, h: 280 };
  blocks.push(emit({
    name: `meg-anim-accent-cercle-${ratio}`,
    title: `Accent cercle or — ${suffixe}`,
    desc: `Ellipse or tracée à la main autour du centre de l'écran, pour entourer un élément. 3 s, repositionnable.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "accent", "cercle"],
    family: `anim-accent-${ratio}`,
    familyTitle: `Accents graphiques — ${suffixe}`,
    variant: "cercle or",
    ratio, duration: 3, faceMode: "none", needsFont: false, posterAt: 1.2,
    comment: `Accent cercle — une ellipse or se trace autour de la zone centrale
(stroke-dashoffset). Déplacer le bloc .accent-zone sur l'élément à
entourer ; le tracé et la sortie suivent.`,
    css: `%R% .accent-zone{position:absolute;z-index:30;left:${zone.x}px;top:${zone.y}px;width:${zone.w}px;height:${zone.h}px;pointer-events:none}
%R% .accent-zone svg{width:100%;height:100%;display:block;overflow:visible}
%R% .accent-zone ellipse{fill:none;stroke:${PAL.or};stroke-width:11;stroke-linecap:round;stroke-dasharray:1520;stroke-dashoffset:1520;filter:drop-shadow(0 4px 18px rgba(185,170,2,.5))}`,
    html: `<div class="accent-zone" data-layout-allow-occlusion=""><svg viewBox="0 0 700 300" aria-hidden="true"><ellipse cx="350" cy="150" rx="330" ry="128"></ellipse></svg></div>`,
    script: `
      tl.to(root.querySelector('.accent-zone ellipse'),{strokeDashoffset:0,duration:.7,ease:'power2.inOut'},.15)
        .to(root.querySelector('.accent-zone'),{opacity:0,duration:.3,ease:'power2.in'},2.6);`,
  }));

  const flecheGeom = ratio === "reel"
    ? { x: 330, y: 1150, r: 0 }
    : { x: 1180, y: 560, r: -35 };
  blocks.push(emit({
    name: `meg-anim-accent-fleche-${ratio}`,
    title: `Accent flèche or — ${suffixe}`,
    desc: `Flèche or tracée qui pointe vers une zone de l'écran. 3 s, repositionnable.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "accent", "fleche"],
    family: `anim-accent-${ratio}`,
    familyTitle: `Accents graphiques — ${suffixe}`,
    variant: "flèche or",
    ratio, duration: 3, faceMode: "none", needsFont: false, posterAt: 1.2,
    comment: `Accent flèche — une flèche or se trace et pointe. Déplacer le bloc
.accent-fleche (et sa rotation gsap.set) vers la cible.`,
    css: `%R% .accent-fleche{position:absolute;z-index:30;left:${flecheGeom.x}px;top:${flecheGeom.y}px;width:420px;height:240px;pointer-events:none}
%R% .accent-fleche svg{width:100%;height:100%;display:block;overflow:visible}
%R% .accent-fleche path{fill:none;stroke:${PAL.or};stroke-width:13;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:560;stroke-dashoffset:560;filter:drop-shadow(0 4px 18px rgba(185,170,2,.5))}`,
    html: `<div class="accent-fleche" data-layout-allow-occlusion=""><svg viewBox="0 0 420 240" aria-hidden="true"><path d="M18 40 C150 30 300 70 380 178 M380 178l-16-84 M380 178l-86-16"></path></svg></div>`,
    script: `
      gsap.set(root.querySelector('.accent-fleche'),{rotation:${flecheGeom.r}});
      tl.to(root.querySelector('.accent-fleche path'),{strokeDashoffset:0,duration:.6,ease:'power2.inOut'},.15)
        .to(root.querySelector('.accent-fleche'),{opacity:0,duration:.3,ease:'power2.in'},2.6);`,
  }));

  const surlGeom = ratio === "reel" ? { x: 150, y: 1150, w: 780 } : { x: 180, y: 820, w: 780 };
  blocks.push(emit({
    name: `meg-anim-accent-surligneur-${ratio}`,
    title: `Accent surligneur — ${suffixe}`,
    desc: `Trait de surligneur or semi-transparent qui balaie une ligne, comme au feutre. 3 s, repositionnable.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "accent", "surligneur"],
    family: `anim-accent-${ratio}`,
    familyTitle: `Accents graphiques — ${suffixe}`,
    variant: "surligneur",
    ratio, duration: 3, faceMode: "none", needsFont: false, posterAt: 1.2,
    comment: `Accent surligneur — un trait or translucide balaie la ligne, geste
feutre. Déplacer .accent-surligne sur le texte à marquer.
transform-origin CSS seul (pas de transform CSS : scaleX posé par GSAP).`,
    css: `%R% .accent-surligne{position:absolute;z-index:30;left:${surlGeom.x}px;top:${surlGeom.y}px;width:${surlGeom.w}px;height:72px;border-radius:14px;background:rgba(185,170,2,.42);transform-origin:left center;pointer-events:none}`,
    html: `<div class="accent-surligne" data-layout-allow-occlusion=""></div>`,
    script: `
      tl.fromTo(root.querySelector('.accent-surligne'),{scaleX:0},{scaleX:1,duration:.55,ease:'power2.inOut'},.15)
        .to(root.querySelector('.accent-surligne'),{opacity:0,duration:.3,ease:'power2.in'},2.6);`,
  }));

  /* ——— Habillages texte (4) ——— */
  const ltGeom = ratio === "reel"
    ? { x: 46, y: 1560, w: 700 }
    : { x: 60, y: 880, w: 640 };
  blocks.push(emit({
    name: `meg-anim-lower-third-${ratio}`,
    title: `Lower third identité — ${suffixe}`,
    desc: `Bandeau d'identité nom + rôle, entrée glissée, filet or. 5 s, textes à remplacer.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "habillage", "lower-third"],
    family: `anim-texte-${ratio}`,
    familyTitle: `Habillages texte — ${suffixe}`,
    variant: "lower third",
    ratio, duration: 5, faceMode: "none", posterAt: 1.5,
    comment: `Lower third — bandeau d'identité (nom + rôle) qui glisse depuis la
gauche, filet or en tête. Remplacer les deux lignes ; la position basse
laisse la zone sous-titres libre.`,
    css: `%R% .lt{position:absolute;z-index:30;left:${ltGeom.x}px;top:${ltGeom.y}px;display:flex;align-items:stretch;gap:0;opacity:0}
%R% .lt .filet{width:12px;background:${PAL.or};border-radius:6px 0 0 6px}
%R% .lt .corps{background:${PAL.creme};border-radius:0 22px 22px 0;padding:22px 40px 24px 30px;box-shadow:0 18px 44px rgba(0,0,0,.3);max-width:${ltGeom.w}px}
%R% .lt .nom{font-size:44px;font-weight:700;color:${PAL.encre};letter-spacing:-.02em}
%R% .lt .role{margin-top:4px;font-size:30px;font-weight:600;color:${PAL.or}}`,
    html: `<div class="lt" data-layout-allow-occlusion=""><div class="filet"></div><div class="corps"><div class="nom">Prénom Nom — à remplacer</div><div class="role">Rôle ou titre — à remplacer</div></div></div>`,
    script: `
      tl.fromTo(root.querySelector('.lt'),{x:-70,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.1)
        .to(root.querySelector('.lt'),{x:-50,opacity:0,duration:.4,ease:'power2.in'},4.4);`,
  }));

  const badgeGeom = ratio === "reel" ? { x: 46, y: 130 } : { x: 60, y: 70 };
  blocks.push(emit({
    name: `meg-anim-badge-${ratio}`,
    title: `Badge à retenir — ${suffixe}`,
    desc: `Badge or « À RETENIR » qui tombe en haut de l'écran. 4 s, texte à remplacer.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "habillage", "badge"],
    family: `anim-texte-${ratio}`,
    familyTitle: `Habillages texte — ${suffixe}`,
    variant: "badge",
    ratio, duration: 4, faceMode: "none", posterAt: 1.2,
    comment: `Badge — une gélule or tombe en haut (« À RETENIR », « ASTUCE »,
« IMPORTANT »…). Remplacer le mot ; jamais sur les yeux (zone haute).`,
    css: `%R% .badge{position:absolute;z-index:30;left:${badgeGeom.x}px;top:${badgeGeom.y}px;padding:18px 38px;border-radius:999px;background:${PAL.or};color:${PAL.encre};font-size:38px;font-weight:700;letter-spacing:.08em;box-shadow:0 16px 40px rgba(0,0,0,.3);opacity:0}`,
    html: `<div class="badge" data-layout-allow-occlusion="">À RETENIR</div>`,
    script: `
      tl.fromTo(root.querySelector('.badge'),{y:-70,opacity:0},{y:0,opacity:1,duration:.5,ease:'back.out(1.6)'},.1)
        .to(root.querySelector('.badge'),{y:-40,opacity:0,duration:.35,ease:'power2.in'},3.5);`,
  }));

  const cptGeom = ratio === "reel"
    ? { x: 0, y: 1130, w: 1080, fs: 240 }
    : { x: 40, y: 330, w: 560, fs: 200 };
  blocks.push(emit({
    name: `meg-anim-compteur-${ratio}`,
    title: `Compteur chiffre choc — ${suffixe}`,
    desc: `Grand chiffre or qui compte de 0 à la valeur cible, avec légende. 4 s, valeur et légende à remplacer.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "habillage", "compteur"],
    family: `anim-texte-${ratio}`,
    familyTitle: `Habillages texte — ${suffixe}`,
    variant: "compteur",
    ratio, duration: 4, faceMode: "none", posterAt: 2,
    comment: `Compteur — le chiffre monte de 0 à la valeur (data-valeur sur
.compteur-nombre, suffixe dans data-suffixe). Remplacer valeur et
légende. Le compteur se rembobine proprement au scrub.`,
    css: `%R% .compteur{position:absolute;z-index:30;left:${cptGeom.x}px;top:${cptGeom.y}px;width:${cptGeom.w}px;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0}
%R% .compteur-nombre{font-size:${cptGeom.fs}px;font-weight:700;color:${PAL.or};line-height:.95;letter-spacing:-.03em;-webkit-text-stroke:3px ${PAL.encre};font-variant-numeric:tabular-nums}
%R% .compteur-legende{font-size:44px;font-weight:700;color:${PAL.creme};background:${PAL.encre};padding:14px 34px;border-radius:999px;letter-spacing:.02em}`,
    html: `<div class="compteur" data-layout-allow-occlusion=""><div class="compteur-nombre" data-valeur="87" data-suffixe=" %">0 %</div><div class="compteur-legende">légende à remplacer</div></div>`,
    script: `
      const nEl=root.querySelector('.compteur-nombre');
      const cible2={v:0};const fin=parseFloat(nEl.dataset.valeur)||0;const suf=nEl.dataset.suffixe||'';
      tl.fromTo(root.querySelector('.compteur'),{y:40,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.1)
        .to(cible2,{v:fin,duration:1.4,ease:'power2.out',onUpdate:()=>{nEl.textContent=Math.round(cible2.v)+suf;}},.3)
        .to(root.querySelector('.compteur'),{opacity:0,duration:.35,ease:'power2.in'},3.55);`,
  }));

  const motGeom = ratio === "reel" ? { y: 1140, fs: 120 } : { y: 740, fs: 130 };
  blocks.push(emit({
    name: `meg-anim-mot-cle-${ratio}`,
    title: `Mot-clé pop — ${suffixe}`,
    desc: `Mot-clé unique qui claque au centre de l'écran sur fond gélule encre. 2,5 s, mot à remplacer.`,
    tags: [ratio === "reel" ? "reel" : "youtube", "habillage", "mot-cle"],
    family: `anim-texte-${ratio}`,
    familyTitle: `Habillages texte — ${suffixe}`,
    variant: "mot-clé pop",
    ratio, duration: 2.5, faceMode: "none", posterAt: 0.8,
    comment: `Mot-clé pop — UN mot qui claque au centre (back.out), gélule encre,
mot en or. Remplacer le mot ; un seul mot, jamais une phrase.`,
    css: `%R% .mot{position:absolute;z-index:30;left:0;top:${motGeom.y}px;width:100%;display:flex;justify-content:center;opacity:0}
%R% .mot span{display:inline-block;padding:26px 54px;border-radius:32px;background:${PAL.encre};color:${PAL.or};font-size:${motGeom.fs}px;font-weight:700;letter-spacing:-.02em;box-shadow:0 24px 60px rgba(0,0,0,.4)}`,
    html: `<div class="mot" data-layout-allow-occlusion=""><span>GAGNANT</span></div>`,
    script: `
      tl.fromTo(root.querySelector('.mot'),{scale:.6,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(1.8)'},.08)
        .to(root.querySelector('.mot'),{scale:.92,opacity:0,duration:.3,ease:'power2.in'},2.1);`,
  }));
}

export const animBlocks = blocks;
