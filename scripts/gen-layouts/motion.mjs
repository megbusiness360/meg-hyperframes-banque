// Vague motion design & textes animés — 36 blocs tirés de l'analyse des
// vidéos d'inspiration (typo cinétique, pops, chips, stickers, cartes),
// REFAITS à la charte MEG (crème/or/encre, Clash) — jamais le style source.
// Tous en faceMode "none" : ils se posent SUR le master ou remplacent l'écran
// entier, sans recadrer le visage. Zones neutres gravées : torse en 9:16
// (y 1140-1700), tiers gauche en 16:9 — jamais yeux/bouche.

import { PAL, GRAD_CARTE, GRAD_SOMBRE, HACHURE, emit } from "./lib.mjs";

const blocks = [];

// Configuration par ratio : préfixe de titre + zone neutre de pose.
const CFG = {
  reel: { W: 1080, H: 1920, prefix: "Reel", famille: "motion-reel", familleTitre: "Reel — motion design & textes animés" },
  yt: { W: 1920, H: 1080, prefix: "Large", famille: "motion-yt", familleTitre: "Large — motion design & textes animés" },
};

const gelule = (extra = "") =>
  `padding:16px 32px;border-radius:26px;background:rgba(47,44,0,.88);color:${PAL.creme};font-weight:700;letter-spacing:-.02em;${extra}`;

/* ————— M1 · Typo cinétique cumulative (4) —————
   La phrase arrive par BLOCS DE MOTS qui s'empilent et restent. */
const typoVariants = [
  { ratio: "reel", key: "gauche", txt: "empilée à gauche", pos: "left:70px;top:1150px;align-items:flex-start", esc: false },
  { ratio: "reel", key: "centre", txt: "empilée au centre", pos: "left:70px;right:70px;top:1150px;align-items:center", esc: false },
  { ratio: "reel", key: "escalier", txt: "en escalier", pos: "left:70px;top:1130px;align-items:flex-start", esc: true },
  { ratio: "yt", key: "gauche", txt: "empilée à gauche", pos: "left:80px;top:330px;align-items:flex-start", esc: false },
];
for (const v of typoVariants) {
  const C = CFG[v.ratio];
  const fs = v.ratio === "reel" ? 54 : 46;
  blocks.push(emit({
    name: `meg-motion-typo-${v.key}-${v.ratio}`,
    title: `${C.prefix} — Typo cinétique ${v.txt}`,
    desc: `Texte animé : la phrase arrive par blocs de mots qui s'empilent (${v.txt}) et restent à l'écran. Chaque ligne est éditable, le mot fort passe en or.`,
    tags: ["motion", "texte", "typo-cinetique", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `typo ${v.txt}`,
    ratio: v.ratio, duration: 5, faceMode: "none",
    comment: `Typo cinétique — blocs de mots cumulés (${v.txt}). Remplacer le texte
ligne par ligne ; la classe "or" marque le mot fort. Se pose sur le
master en zone neutre, jamais sur les yeux/la bouche.`,
    css: `%R% .pile-typo{position:absolute;z-index:6;display:flex;flex-direction:column;gap:18px;${v.pos}}
%R% .ligne{${gelule(`font-size:${fs}px;`)}opacity:0}
${v.esc ? `%R% .ligne:nth-child(2){margin-left:70px}\n%R% .ligne:nth-child(3){margin-left:140px}` : ""}
%R% .ligne .or{color:${PAL.pop}}`,
    html: `<div class="pile-typo" data-layout-allow-occlusion="">
      <div class="ligne">Le CPF ne finance</div>
      <div class="ligne">plus <span class="or">aucune formation</span></div>
      <div class="ligne">sans ce document</div>
    </div>`,
    script: `
      const lignes=root.querySelectorAll('.ligne');
      tl.fromTo(lignes[0],{y:34,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.1)
        .fromTo(lignes[1],{y:34,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.75)
        .fromTo(lignes[2],{y:34,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},1.4)
        .to(lignes,{opacity:0,y:-24,duration:.35,ease:'power2.in',stagger:.05},4.45);`,
  }));
}

/* ————— M2 · Mot-clé pop (4) —————
   UN mot qui claque à l'écran au moment où il est prononcé. */
const motPop = [
  { ratio: "reel", key: "or", txt: "plein or", css: (C) => `left:40px;right:40px;top:1240px;text-align:center;font-size:150px;color:${PAL.or};-webkit-text-stroke:4px ${PAL.encre};text-shadow:0 10px 40px rgba(0,0,0,.35)` },
  { ratio: "reel", key: "gelule", txt: "gélule encre", css: () => `left:40px;right:40px;top:1270px;text-align:center;font-size:96px;color:transparent` },
  { ratio: "reel", key: "contour", txt: "contour crème", css: (C) => `left:40px;right:40px;top:1250px;text-align:center;font-size:140px;color:transparent;-webkit-text-stroke:4px ${PAL.creme};text-shadow:0 8px 44px rgba(47,44,0,.5)` },
  { ratio: "yt", key: "or", txt: "plein or", css: (C) => `left:80px;top:620px;font-size:120px;color:${PAL.or};-webkit-text-stroke:3px ${PAL.encre};text-shadow:0 10px 40px rgba(0,0,0,.35)` },
];
for (const v of motPop) {
  const C = CFG[v.ratio];
  const isGelule = v.key === "gelule";
  blocks.push(emit({
    name: `meg-motion-mot-pop-${v.key}-${v.ratio}`,
    title: `${C.prefix} — Mot-clé pop (${v.txt})`,
    desc: `Un seul mot qui claque à l'écran (${v.txt}) au moment exact où il est prononcé. Remplacer le mot, caler le bloc sur le mot dans l'audio.`,
    tags: ["motion", "texte", "mot-cle", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `mot pop ${v.txt}`,
    ratio: v.ratio, duration: 1.6, faceMode: "none", posterAt: 0.6,
    comment: `Mot-clé pop ${v.txt} — LE mot fort du discours, posé à l'instant où il
est dit (règle MEG : le mot pop au mot exact). Un seul mot, court.`,
    css: `%R% .mot{position:absolute;z-index:6;font-weight:700;letter-spacing:-.03em;opacity:0;${v.css(C)}}
${isGelule ? `%R% .mot span{display:inline-block;${gelule("font-size:96px;")}background:${PAL.encre};color:${PAL.creme}}` : ""}`,
    html: isGelule
      ? `<div class="mot" data-layout-allow-occlusion=""><span>GRATUIT</span></div>`
      : `<div class="mot" data-layout-allow-occlusion="">GRATUIT</div>`,
    script: `
      const mot=root.querySelector('.mot');
      tl.fromTo(mot,{scale:.4,rotation:-5,opacity:0},{scale:1,rotation:0,opacity:1,duration:.34,ease:'back.out(2.2)'},.05)
        .to(mot,{scale:1.05,duration:.85,ease:'none'},.42)
        .to(mot,{opacity:0,scale:1.12,duration:.28,ease:'power2.in'},1.3);`,
  }));
}

/* ————— M3 · Chips surligneur cumulatives (3) —————
   Une liste qui se construit chip par chip et RESTE à l'écran. */
const chipsVariants = [
  { ratio: "reel", key: "colonne", txt: "en colonne", pos: "left:70px;top:1150px;flex-direction:column;align-items:flex-start;gap:20px" },
  { ratio: "reel", key: "rangee", txt: "en rangée", pos: "left:70px;right:70px;top:1560px;flex-direction:row;flex-wrap:wrap;justify-content:center;gap:18px" },
  { ratio: "yt", key: "colonne", txt: "en colonne", pos: "left:80px;top:340px;flex-direction:column;align-items:flex-start;gap:18px" },
];
for (const v of chipsVariants) {
  const C = CFG[v.ratio];
  const fs = v.ratio === "reel" ? 44 : 38;
  blocks.push(emit({
    name: `meg-motion-chips-${v.key}-${v.ratio}`,
    title: `${C.prefix} — Chips cumulatives ${v.txt}`,
    desc: `Liste animée : chaque point arrive en chip surlignée et reste (${v.txt}). Pour énumérer 3 éléments pendant qu'ils sont dits.`,
    tags: ["motion", "texte", "chips", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `chips ${v.txt}`,
    ratio: v.ratio, duration: 5, faceMode: "none",
    comment: `Chips cumulatives ${v.txt} — une énumération qui se construit à
l'écran, chip par chip, et reste. Remplacer les 3 textes ; caler chaque
apparition sur le point dit dans l'audio.`,
    css: `%R% .chips{position:absolute;z-index:6;display:flex;${v.pos}}
%R% .chip{padding:14px 30px;border-radius:22px;background:${PAL.creme};color:${PAL.encre};font-size:${fs}px;font-weight:700;letter-spacing:-.015em;box-shadow:0 12px 34px rgba(0,0,0,.3),inset 0 -8px 0 ${PAL.or};opacity:0}`,
    html: `<div class="chips" data-layout-allow-occlusion="">
      <div class="chip">1 · Le programme détaillé</div>
      <div class="chip">2 · Les preuves d'assiduité</div>
      <div class="chip">3 · La facture conforme</div>
    </div>`,
    script: `
      const chips=root.querySelectorAll('.chip');
      tl.fromTo(chips[0],{y:30,opacity:0,scale:.94},{y:0,opacity:1,scale:1,duration:.38,ease:'back.out(1.6)'},.15)
        .fromTo(chips[1],{y:30,opacity:0,scale:.94},{y:0,opacity:1,scale:1,duration:.38,ease:'back.out(1.6)'},1.25)
        .fromTo(chips[2],{y:30,opacity:0,scale:.94},{y:0,opacity:1,scale:1,duration:.38,ease:'back.out(1.6)'},2.35)
        .to(chips,{opacity:0,y:-20,duration:.32,ease:'power2.in',stagger:.05},4.5);`,
  }));
}

/* ————— M4 · Pastille CTA persistante (2) —————
   Un badge discret qui reste à l'écran et pulse — jamais sur le visage. */
const ctaVariants = [
  { key: "abonnez", label: "ABONNEZ-VOUS", sym: "+" },
  { key: "lien", label: "LIEN EN BIO", sym: "↑" },
];
for (const v of ctaVariants) {
  const C = CFG.reel;
  blocks.push(emit({
    name: `meg-motion-cta-pastille-${v.key}-reel`,
    title: `Reel — Pastille CTA « ${v.label} »`,
    desc: `Badge CTA persistant en zone neutre (torse, à gauche) : rond or qui pulse + étiquette « ${v.label} ». Se pose sur plusieurs secondes sans gêner.`,
    tags: ["motion", "cta", "pastille", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `pastille ${v.label}`,
    ratio: "reel", duration: 6, faceMode: "none",
    comment: `Pastille CTA persistante « ${v.label} » — badge discret posé au torse
côté gauche (zone neutre gravée), pulsation légère. Étiquette éditable.`,
    css: `%R% .pastille-cta{position:absolute;z-index:6;left:70px;top:1150px;display:flex;align-items:center;gap:18px;opacity:0}
%R% .rond{width:92px;height:92px;border-radius:50%;background:${PAL.or};color:${PAL.encre};display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:700;box-shadow:0 12px 34px rgba(0,0,0,.35)}
%R% .lab{${gelule("font-size:36px;")}}`,
    html: `<div class="pastille-cta" data-layout-allow-occlusion=""><div class="rond">${v.sym}</div><div class="lab">${v.label}</div></div>`,
    script: `
      const p=root.querySelector('.pastille-cta'),rond=root.querySelector('.rond');
      tl.fromTo(p,{x:-40,opacity:0},{x:0,opacity:1,duration:.45,ease:'power3.out'},.1)
        .fromTo(rond,{scale:1},{scale:1.1,duration:.55,ease:'sine.inOut',yoyo:true,repeat:7},.7)
        .to(p,{x:-30,opacity:0,duration:.35,ease:'power2.in'},5.6);`,
  }));
}

/* ————— M5 · Bandeau preuve UI (2) —————
   Une notification de résultat qui glisse — la preuve dite en une ligne. */
for (const ratio of ["reel", "yt"]) {
  const C = CFG[ratio];
  const pos = ratio === "reel" ? "left:70px;right:70px;top:150px" : "left:40px;top:40px;width:780px";
  blocks.push(emit({
    name: `meg-motion-bandeau-preuve-${ratio}`,
    title: `${C.prefix} — Bandeau preuve (notification)`,
    desc: "Bandeau style notification qui glisse du haut : coche or + résultat chiffré. Pour appuyer une preuve dite (montant financé, dossier validé…).",
    tags: ["motion", "preuve", "notification"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "bandeau preuve",
    ratio, duration: 3.5, faceMode: "none", posterAt: 1,
    comment: `Bandeau preuve — une « notification » crème avec coche or : titre =
le résultat, sous-ligne = le contexte. Remplacer les deux textes.`,
    css: `%R% .notif{position:absolute;z-index:6;${pos};display:flex;align-items:center;gap:24px;padding:22px 30px;border-radius:28px;background:${PAL.creme};box-shadow:0 18px 50px rgba(0,0,0,.35);opacity:0}
%R% .coche{flex:none;width:74px;height:74px;border-radius:50%;background:${PAL.or};display:flex;align-items:center;justify-content:center}
%R% .coche svg{width:40px;height:40px}
%R% .txts{min-width:0}
%R% .titre-notif{color:${PAL.encre};font-size:${ratio === "reel" ? 40 : 36}px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
%R% .sous-notif{margin-top:4px;color:${PAL.encre};opacity:.6;font-size:${ratio === "reel" ? 30 : 27}px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
    html: `<div class="notif" data-layout-allow-occlusion="">
      <div class="coche"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 21l8 8 16-18" stroke="${PAL.encre}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
      <div class="txts"><div class="titre-notif">Dossier validé — 12 480 € financés</div><div class="sous-notif">Résultat à remplacer par votre preuve</div></div>
    </div>`,
    script: `
      const n=root.querySelector('.notif');
      tl.fromTo(n,{y:-130,opacity:0},{y:0,opacity:1,duration:.5,ease:'back.out(1.4)'},.1)
        .fromTo(root.querySelector('.coche'),{scale:.4},{scale:1,duration:.4,ease:'back.out(2.5)'},.35)
        .to(n,{y:-40,opacity:0,duration:.35,ease:'power2.in'},3.1);`,
  }));
}

/* ————— M6 · Objet détouré + phrase accent (2) —————
   Un objet plein cadre (asset alpha à poser) + la phrase qui l'explique. */
for (const ratio of ["reel", "yt"]) {
  const C = CFG[ratio];
  const obj = ratio === "reel" ? "left:260px;top:540px;width:560px;height:560px" : "left:1300px;top:220px;width:480px;height:480px";
  const phrase = ratio === "reel" ? "left:70px;right:70px;top:1260px;text-align:center" : "left:1240px;width:600px;top:740px;text-align:center";
  blocks.push(emit({
    name: `meg-motion-objet-phrase-${ratio}`,
    title: `${C.prefix} — Objet détouré + phrase`,
    desc: "Emplacement d'objet détouré (document, téléphone, produit — asset alpha) + phrase accent en gélule dessous. L'objet pop, la phrase suit.",
    tags: ["motion", "objet", "detoure"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "objet + phrase",
    ratio, duration: 4, faceMode: "none",
    comment: `Objet détouré + phrase — remplacer la zone hachurée par l'ASSET ALPHA
de l'objet (jamais d'image avec fond), puis éditer la phrase.`,
    css: `%R% .objet{position:absolute;z-index:6;${obj};box-sizing:border-box;border:5px dashed rgba(255,252,214,.7);border-radius:38px;background:${HACHURE};display:flex;align-items:center;justify-content:center;box-shadow:0 30px 70px rgba(0,0,0,.35);opacity:0}
%R% .objet .tag{${gelule("font-size:30px;")}letter-spacing:.05em}
%R% .phrase{position:absolute;z-index:6;${phrase};opacity:0}
%R% .phrase span{display:inline-block;${gelule(`font-size:${ratio === "reel" ? 48 : 40}px;`)}}
%R% .phrase .or{color:${PAL.pop}}`,
    html: `<div class="objet" data-layout-allow-occlusion=""><span class="tag">OBJET ALPHA — REMPLACER</span></div>
    <div class="phrase" data-layout-allow-occlusion=""><span>Le document qui <span class="or">change tout</span></span></div>`,
    script: `
      tl.fromTo(root.querySelector('.objet'),{scale:.7,rotation:-6,opacity:0},{scale:1,rotation:0,opacity:1,duration:.5,ease:'back.out(1.8)'},.1)
        .fromTo(root.querySelector('.phrase'),{y:30,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},.5)
        .to([root.querySelector('.objet'),root.querySelector('.phrase')],{opacity:0,duration:.35,ease:'power2.in'},3.55);`,
  }));
}

/* ————— M8 · Carte-titre interstitielle (3) —————
   Une carte pleine qui claque entre deux séquences. */
const cartesTitre = [
  { ratio: "reel", key: "slide", txt: "glissée" },
  { ratio: "reel", key: "punch", txt: "punch" },
  { ratio: "yt", key: "slide", txt: "glissée" },
];
for (const v of cartesTitre) {
  const C = CFG[v.ratio];
  blocks.push(emit({
    name: `meg-motion-carte-titre-${v.key}-${v.ratio}`,
    title: `${C.prefix} — Carte-titre interstitielle (${v.txt})`,
    desc: `Carte crème pleine qui ${v.key === "slide" ? "glisse" : "claque"} entre deux séquences : gélule + grand titre + filet or. 2,2 s, à poser sur un cut.`,
    tags: ["motion", "carte-titre", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `carte-titre ${v.txt}`,
    ratio: v.ratio, duration: 2.2, faceMode: "none", posterAt: 0.9,
    comment: `Carte-titre interstitielle ${v.txt} — respiration entre deux idées.
Remplacer gélule + titre. À cheval sur un cut, comme une transition.`,
    css: `%R% .carte-t{position:absolute;inset:0;z-index:30;background:${GRAD_CARTE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;text-align:center;padding:0 90px}
%R% .gelule-t{padding:12px 32px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:32px;font-weight:700;letter-spacing:.12em}
%R% .titre-t{color:${PAL.encre};font-size:${v.ratio === "reel" ? 96 : 104}px;font-weight:700;letter-spacing:-.03em;line-height:1}
%R% .filet-t{width:280px;height:9px;border-radius:5px;background:${PAL.or};transform-origin:center}`,
    html: `<div class="carte-t" data-layout-allow-occlusion="">
      <span class="gelule-t">PARTIE 2</span>
      <div class="titre-t">Le titre de la<br>séquence suivante</div>
      <div class="filet-t"></div>
    </div>`,
    script: v.key === "slide"
      ? `
      const c=root.querySelector('.carte-t');
      tl.fromTo(c,{y:${CFG[v.ratio].H}},{y:0,duration:.45,ease:'power4.out'},0)
        .fromTo(root.querySelector('.titre-t'),{y:34,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.3)
        .fromTo(root.querySelector('.filet-t'),{scaleX:0},{scaleX:1,duration:.35,ease:'power2.out'},.55)
        .to(c,{y:${-CFG[v.ratio].H},duration:.4,ease:'power3.in'},1.8);`
      : `
      const c=root.querySelector('.carte-t');
      tl.fromTo(c,{scale:1.12,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power3.out'},0)
        .fromTo(root.querySelector('.titre-t'),{y:30,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.22)
        .fromTo(root.querySelector('.filet-t'),{scaleX:0},{scaleX:1,duration:.35,ease:'power2.out'},.5)
        .to(c,{scale:1.06,opacity:0,duration:.35,ease:'power2.in'},1.85);`,
  }));
}

/* ————— M9 · Logo reveal MEG (2) ————— */
for (const ratio of ["reel", "yt"]) {
  const C = CFG[ratio];
  blocks.push(emit({
    name: `meg-motion-logo-reveal-${ratio}`,
    title: `${C.prefix} — Logo reveal MEG`,
    desc: "Signature de marque : logo MEG officiel + filet or qui se déploie sur carte crème. 2,5 s — ouverture ou fermeture de vidéo.",
    tags: ["motion", "logo", "marque"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "logo reveal",
    ratio, duration: 2.5, faceMode: "none", posterAt: 1.2,
    logoVariant: "dark",
    comment: `Logo reveal — logo MEG officiel sur carte crème. Ne pas remplacer,
déformer ni recadrer le logo ; durée courte, ouverture/fin.`,
    css: `%R% .marque{position:absolute;inset:0;z-index:30;background:${GRAD_CARTE};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px}
%R% .logo-officiel{display:block;width:${ratio === "reel" ? 620 : 500}px;height:auto;object-fit:contain;opacity:0}
%R% .filet-m{width:300px;height:10px;border-radius:6px;background:${PAL.or};transform-origin:center}`,
    html: `<div class="marque" data-layout-allow-occlusion="">
      <img class="logo-officiel" src="assets/meg-logo-dark.png" alt="Logo MEG Business 360">
      <div class="filet-m"></div>
    </div>`,
    script: `
      tl.fromTo(root.querySelector('.logo-officiel'),{y:44,opacity:0},{y:0,opacity:1,duration:.5,ease:'power4.out'},.1)
        .fromTo(root.querySelector('.filet-m'),{scaleX:0},{scaleX:1,duration:.45,ease:'power2.out'},.4)
        .to(root.querySelector('.marque'),{opacity:0,duration:.4,ease:'power2.in'},2.05);`,
  }));
}

/* ————— M10 · Pile de texte sur B-roll (2) —————
   Grandes lignes qui s'empilent au centre — à poser sur un plan B-roll. */
for (const ratio of ["reel", "yt"]) {
  const C = CFG[ratio];
  blocks.push(emit({
    name: `meg-motion-pile-broll-${ratio}`,
    title: `${C.prefix} — Pile de texte sur B-roll`,
    desc: "Trois grandes lignes en gélules qui s'empilent au centre du cadre — à poser sur un plan B-roll (jamais sur le visage).",
    tags: ["motion", "texte", "broll"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "pile B-roll",
    ratio, duration: 4.5, faceMode: "none",
    comment: `Pile de texte B-roll — la phrase clé en 3 segments GROS, centrés.
À poser sur un plan B-roll/écran, pas sur le master visage. Éditer les
3 lignes ; la classe "or" marque le mot fort.`,
    css: `%R% .pile-b{position:absolute;z-index:6;left:70px;right:70px;top:0;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px}
%R% .lb{${gelule(`font-size:${ratio === "reel" ? 72 : 64}px;`)}opacity:0}
%R% .lb .or{color:${PAL.pop}}`,
    html: `<div class="pile-b" data-layout-allow-occlusion="">
      <div class="lb">3 documents.</div>
      <div class="lb">15 minutes.</div>
      <div class="lb"><span class="or">0 refus.</span></div>
    </div>`,
    script: `
      const lb=root.querySelectorAll('.lb');
      tl.fromTo(lb[0],{y:40,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.42,ease:'back.out(1.5)'},.15)
        .fromTo(lb[1],{y:40,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.42,ease:'back.out(1.5)'},1.15)
        .fromTo(lb[2],{y:40,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.42,ease:'back.out(1.5)'},2.15)
        .to(lb,{opacity:0,y:-26,duration:.32,ease:'power2.in',stagger:.05},4);`,
  }));
}

/* ————— M11 · Sticker flèche (3) —————
   Flèche dessinée qui pointe la preuve/le visage + étiquette. */
const fleches = [
  { ratio: "reel", key: "haut", txt: "vers le haut", rot: 0, pos: "left:600px;top:980px", lab: "left:560px;top:1320px" },
  { ratio: "reel", key: "bas", txt: "vers le bas", rot: 180, pos: "left:600px;top:1180px", lab: "left:560px;top:1080px" },
  { ratio: "yt", key: "gauche", txt: "vers la gauche", rot: -90, pos: "left:760px;top:420px", lab: "left:730px;top:700px" },
];
for (const v of fleches) {
  const C = CFG[v.ratio];
  blocks.push(emit({
    name: `meg-motion-fleche-${v.key}-${v.ratio}`,
    title: `${C.prefix} — Sticker flèche ${v.txt}`,
    desc: `Flèche sticker qui pop et pointe ${v.txt} (preuve, visage, élément) + étiquette éditable.`,
    tags: ["motion", "sticker", "fleche", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `flèche ${v.txt}`,
    ratio: v.ratio, duration: 2.5, faceMode: "none", posterAt: 0.8,
    comment: `Sticker flèche ${v.txt} — pointer ce dont on parle. Déplacer le bloc
pour viser l'élément ; éditer l'étiquette.`,
    css: `%R% .fleche{position:absolute;z-index:6;${v.pos};width:260px;height:300px;opacity:0}
%R% .fleche svg{width:100%;height:100%;overflow:visible}
%R% .etiq-f{position:absolute;z-index:6;${v.lab};${gelule("font-size:36px;")}opacity:0}`,
    html: `<div class="fleche" data-layout-allow-occlusion=""><svg viewBox="0 0 260 300" fill="none" aria-hidden="true">
      <path d="M130 280 C 60 220, 70 120, 118 52" stroke="${PAL.encre}" stroke-width="26" stroke-linecap="round"></path>
      <path d="M130 280 C 60 220, 70 120, 118 52" stroke="${PAL.creme}" stroke-width="13" stroke-linecap="round"></path>
      <path d="M70 78 L120 36 L138 100" stroke="${PAL.encre}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
      <path d="M70 78 L120 36 L138 100" stroke="${PAL.creme}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
    </svg></div>
    <div class="etiq-f" data-layout-allow-occlusion="">C'est ici que ça se joue</div>`,
    script: `
      const f=root.querySelector('.fleche'),e=root.querySelector('.etiq-f');
      gsap.set(f,{rotation:${v.rot}});
      tl.fromTo(f,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(2)'},.1)
        .fromTo(e,{y:24,opacity:0},{y:0,opacity:1,duration:.38,ease:'power3.out'},.35)
        .fromTo(f,{rotation:${v.rot - 5}},{rotation:${v.rot + 5},duration:.5,ease:'sine.inOut',yoyo:true,repeat:2},.55)
        .to([f,e],{opacity:0,duration:.3,ease:'power2.in'},2.15);`,
  }));
}

/* ————— M12 · Icône pop (5) —————
   Une icône qui claque pour ponctuer — check, croix, éclair, euro. */
const icones = [
  { key: "check", svg: `<path d="M20 42l16 16 30-36" stroke="${PAL.encre}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>` },
  { key: "croix", svg: `<path d="M24 24l38 38M62 24L24 62" stroke="${PAL.encre}" stroke-width="11" stroke-linecap="round" fill="none"></path>`, fond: PAL.rouge },
  { key: "eclair", svg: `<path d="M48 12L26 48h16l-6 26 24-38H44l4-24z" fill="${PAL.encre}"></path>` },
  { key: "euro", txt: "€" },
];
for (const v of icones) {
  const C = CFG.reel;
  blocks.push(emit({
    name: `meg-motion-icone-${v.key}-reel`,
    title: `Reel — Icône pop (${v.key})`,
    desc: `Icône ${v.key} qui claque en zone neutre pour ponctuer le propos (validation, refus, rapidité, argent).`,
    tags: ["motion", "icone", v.key],
    family: C.famille, familyTitle: C.familleTitre,
    variant: `icône ${v.key}`,
    ratio: "reel", duration: 1.4, faceMode: "none", posterAt: 0.5,
    comment: `Icône pop ${v.key} — ponctuation visuelle d'un mot (oui/non/vite/€).
Déplacer librement en zone neutre ; caler sur le mot dit.`,
    css: `%R% .badge-i{position:absolute;z-index:6;left:470px;top:1200px;width:150px;height:150px;border-radius:50%;background:${v.fond ?? PAL.or};display:flex;align-items:center;justify-content:center;box-shadow:0 16px 44px rgba(0,0,0,.35);opacity:0}
%R% .badge-i svg{width:86px;height:86px}
%R% .badge-i .sym{font-size:76px;font-weight:700;color:${PAL.encre};line-height:1}
%R% .onde{position:absolute;z-index:5;left:455px;top:1185px;width:180px;height:180px;border-radius:50%;border:6px solid ${v.fond ?? PAL.or};opacity:0}`,
    html: `<div class="onde" data-layout-allow-occlusion=""></div>
    <div class="badge-i" data-layout-allow-occlusion="">${v.txt ? `<span class="sym">${v.txt}</span>` : `<svg viewBox="0 0 86 86" aria-hidden="true">${v.svg}</svg>`}</div>`,
    script: `
      const b=root.querySelector('.badge-i'),o=root.querySelector('.onde');
      tl.fromTo(b,{scale:.3,rotation:-12,opacity:0},{scale:1,rotation:0,opacity:1,duration:.36,ease:'back.out(2.4)'},.05)
        .fromTo(o,{scale:.8,opacity:.8},{scale:1.5,opacity:0,duration:.55,ease:'power2.out'},.28)
        .to(b,{scale:1.06,duration:.55,ease:'none'},.45)
        .to(b,{opacity:0,scale:1.15,duration:.25,ease:'power2.in'},1.12);`,
  }));
}
{
  const C = CFG.yt;
  blocks.push(emit({
    name: "meg-motion-icone-check-yt",
    title: "Large — Icône pop (check)",
    desc: "Coche or qui claque en tiers gauche pour valider un point dit.",
    tags: ["motion", "icone", "check"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "icône check",
    ratio: "yt", duration: 1.4, faceMode: "none", posterAt: 0.5,
    comment: `Icône pop check 16:9 — ponctuation d'un point validé, tiers gauche
(zone neutre gravée). Déplacer librement ; caler sur le mot.`,
    css: `%R% .badge-i{position:absolute;z-index:6;left:200px;top:440px;width:140px;height:140px;border-radius:50%;background:${PAL.or};display:flex;align-items:center;justify-content:center;box-shadow:0 16px 44px rgba(0,0,0,.35);opacity:0}
%R% .badge-i svg{width:80px;height:80px}
%R% .onde{position:absolute;z-index:5;left:186px;top:426px;width:168px;height:168px;border-radius:50%;border:6px solid ${PAL.or};opacity:0}`,
    html: `<div class="onde" data-layout-allow-occlusion=""></div>
    <div class="badge-i" data-layout-allow-occlusion=""><svg viewBox="0 0 86 86" aria-hidden="true"><path d="M20 42l16 16 30-36" stroke="${PAL.encre}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg></div>`,
    script: `
      const b=root.querySelector('.badge-i'),o=root.querySelector('.onde');
      tl.fromTo(b,{scale:.3,rotation:-12,opacity:0},{scale:1,rotation:0,opacity:1,duration:.36,ease:'back.out(2.4)'},.05)
        .fromTo(o,{scale:.8,opacity:.8},{scale:1.5,opacity:0,duration:.55,ease:'power2.out'},.28)
        .to(b,{scale:1.06,duration:.55,ease:'none'},.45)
        .to(b,{opacity:0,scale:1.15,duration:.25,ease:'power2.in'},1.12);`,
  }));
}

/* ————— M13 · Cadre accent or (2) —————
   Un cadre épais qui concentre l'attention sur tout le plan. */
for (const ratio of ["reel", "yt"]) {
  const C = CFG[ratio];
  blocks.push(emit({
    name: `meg-motion-cadre-accent-${ratio}`,
    title: `${C.prefix} — Cadre accent or`,
    desc: "Cadre or épais qui se pose sur le plan entier pour marquer LE moment important. 2,5 s.",
    tags: ["motion", "cadre", "accent"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "cadre accent",
    ratio, duration: 2.5, faceMode: "none", posterAt: 1,
    comment: `Cadre accent — souligner le moment fort sans rien masquer. Se pose
tel quel, aucune édition nécessaire.`,
    css: `%R% .cadre-a{position:absolute;z-index:6;inset:${ratio === "reel" ? 34 : 28}px;box-sizing:border-box;border:${ratio === "reel" ? 16 : 14}px solid ${PAL.or};border-radius:44px;box-shadow:0 0 60px rgba(185,170,2,.4),inset 0 0 60px rgba(185,170,2,.25);opacity:0}`,
    html: `<div class="cadre-a" data-layout-allow-occlusion=""></div>`,
    script: `
      const c=root.querySelector('.cadre-a');
      tl.fromTo(c,{scale:1.05,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power3.out'},.05)
        .fromTo(c,{opacity:1},{opacity:.75,duration:.45,ease:'sine.inOut',yoyo:true,repeat:2},.55)
        .to(c,{scale:1.04,opacity:0,duration:.35,ease:'power2.in'},2.1);`,
  }));
}

/* ————— M14 · Écran plein + caption centrale (2) —————
   Le plan B-roll/écran occupe tout, la phrase clé au centre. */
for (const ratio of ["reel", "yt"]) {
  const C = CFG[ratio];
  blocks.push(emit({
    name: `meg-motion-plein-caption-${ratio}`,
    title: `${C.prefix} — Écran plein + caption centrale`,
    desc: "Écran bord à bord (capture, B-roll) + grande caption centrée en gélule. Remplacer la zone hachurée et le texte.",
    tags: ["motion", "ecran", "caption"],
    family: C.famille, familyTitle: C.familleTitre,
    variant: "plein + caption",
    ratio, duration: 4, faceMode: "none",
    comment: `Écran plein + caption — le plan de preuve occupe TOUT le cadre, la
phrase clé au centre. Remplacer la zone hachurée (capture/B-roll) et la
caption. Le master visage reste derrière, masqué par l'écran.`,
    css: `%R% .plein{position:absolute;inset:0;z-index:2;background:${HACHURE};display:flex;align-items:flex-start;justify-content:center;padding-top:${ratio === "reel" ? 120 : 70}px}
%R% .plein .tag-p{${gelule("font-size:32px;")}letter-spacing:.05em;opacity:.85}
%R% .cap-c{position:absolute;z-index:6;left:70px;right:70px;top:0;height:100%;display:flex;align-items:center;justify-content:center;opacity:0}
%R% .cap-c span{${gelule(`font-size:${ratio === "reel" ? 64 : 58}px;`)}text-align:center}
%R% .cap-c .or{color:${PAL.pop}}`,
    html: `<div class="plein" data-layout-allow-occlusion=""><span class="tag-p">ÉCRAN PLEIN CADRE — REMPLACER</span></div>
    <div class="cap-c" data-layout-allow-occlusion=""><span>La phrase clé <span class="or">au centre</span></span></div>`,
    script: `
      tl.fromTo(root.querySelector('.plein'),{opacity:0},{opacity:1,duration:.4,ease:'power2.out'},0)
        .fromTo(root.querySelector('.cap-c'),{scale:.92,opacity:0},{scale:1,opacity:1,duration:.45,ease:'back.out(1.6)'},.3)
        .to(root.querySelector('.cap-c'),{opacity:0,duration:.35,ease:'power2.in'},3.55);`,
  }));
}

export const motionBlocks = blocks;
