// Couvertures des DEUX catalogues MEG — « MEG - Reel » (9:16) et
// « MEG - Large » (16:9). Chacune ouvre sa partition dans le registre :
// tout ce qui suit une couverture appartient à son catalogue.
// Ce sont des cartes d'identité posables (jamais dans un montage client).

import { PAL, GRAD_CARTE, GRAD_SOMBRE, HACHURE, emit } from "./lib.mjs";

const blocks = [];

// Mini-vignettes abstraites : silhouettes de layouts (écran hachuré + zone
// visage sombre), déclinées par ratio. Aucune donnée réelle.
function miniCss(sel) {
  return `
${sel} .minis{position:absolute;z-index:3;display:flex;gap:34px;opacity:0}
${sel} .mini{box-sizing:border-box;border:5px solid ${PAL.encre};border-radius:22px;background:${PAL.clair};overflow:hidden;display:flex;flex-direction:column;gap:8px;padding:10px}
${sel} .mini .z-ecran{flex:1;border-radius:12px;background:${HACHURE}}
${sel} .mini .z-face{border-radius:12px;background:${GRAD_SOMBRE}}
${sel} .mini .rang2{flex:1;display:flex;gap:8px}
${sel} .mini .rang2 .z-ecran,${sel} .mini .rang2 .z-face{flex:1;height:auto}`;
}

blocks.push(emit({
  name: "meg-catalogue-reel",
  title: "MEG - Reel",
  desc: "Couverture du catalogue vertical 1080×1920 : tous les blocs « Reel — … » qui suivent appartiennent à ce catalogue (layouts, intros, chapitres, CTA, animations 9:16).",
  tags: ["catalogue", "reel", "9-16"],
  family: "catalogue",
  familyTitle: "Catalogues MEG",
  variant: "Reel 9:16",
  ratio: "reel", duration: 4, faceMode: "none", fond: false, posterAt: 1.4,
  comment: `Couverture « MEG - Reel » — carte d'identité du catalogue vertical.
Repère visuel dans la banque, jamais posée dans un montage client.`,
  css: `%R% .scene{position:absolute;inset:0;z-index:2;background:${GRAD_CARTE};display:flex;flex-direction:column;align-items:center;text-align:center;padding:150px 70px 0}
%R% .gelule{padding:14px 36px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:34px;font-weight:700;letter-spacing:.14em;opacity:0}
%R% .titre{margin-top:56px;color:${PAL.encre};font-size:168px;font-weight:700;letter-spacing:-.03em;line-height:.95;opacity:0}
%R% .titre .or{color:${PAL.or}}
%R% .filet{margin-top:44px;width:340px;height:10px;border-radius:6px;background:${PAL.or};transform-origin:center}
%R% .sous{margin-top:40px;color:${PAL.encre};font-size:42px;font-weight:600;opacity:.62;line-height:1.3}
${miniCss("%R%")}
%R% .minis{left:131px;top:1010px}
%R% .mini{width:250px;height:444px}
%R% .mini .z-face{height:180px}
%R% .familles{position:absolute;z-index:3;left:70px;right:70px;bottom:130px;color:${PAL.encre};font-size:34px;font-weight:600;opacity:0;line-height:1.5}`,
  html: `<div class="scene" data-layout-allow-occlusion="">
      <span class="gelule">BANQUE MEG</span>
      <div class="titre">MEG - <span class="or">Reel</span></div>
      <div class="filet"></div>
      <div class="sous">Layouts &amp; animations 9:16<br>Reels · Shorts · TikTok</div>
    </div>
    <div class="minis" data-layout-allow-occlusion="">
      <div class="mini"><div class="z-ecran"></div><div class="z-face"></div></div>
      <div class="mini"><div class="z-ecran"></div><div class="z-ecran"></div><div class="z-face"></div></div>
      <div class="mini"><div class="z-face" style="height:270px"></div><div class="z-ecran"></div></div>
    </div>
    <div class="familles">Splits · duos · trios · détourés · intros<br>chapitres · CTA · avant/après · effets</div>`,
  script: `
      tl.fromTo(root.querySelector('.gelule'),{y:-24,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.titre'),{y:40,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.15)
        .fromTo(root.querySelector('.filet'),{scaleX:0},{scaleX:1,duration:.45,ease:'power2.out'},.45)
        .fromTo(root.querySelector('.sous'),{opacity:0},{opacity:.62,duration:.4},.6)
        .fromTo(root.querySelector('.minis'),{y:50,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.7)
        .fromTo(root.querySelectorAll('.mini'),{scale:.92},{scale:1,duration:.45,ease:'back.out(1.5)',stagger:.1},.7)
        .fromTo(root.querySelector('.familles'),{opacity:0},{opacity:1,duration:.4},1);`,
}));

blocks.push(emit({
  name: "meg-catalogue-large",
  title: "MEG - Large",
  desc: "Couverture du catalogue horizontal 1920×1080 : tous les blocs « Large — … » qui suivent appartiennent à ce catalogue (layouts, intros, chapitres, outros, animations 16:9).",
  tags: ["catalogue", "large", "16-9"],
  family: "catalogue",
  familyTitle: "Catalogues MEG",
  variant: "Large 16:9",
  ratio: "yt", duration: 4, faceMode: "none", fond: false, posterAt: 1.4,
  comment: `Couverture « MEG - Large » — carte d'identité du catalogue horizontal.
Repère visuel dans la banque, jamais posée dans un montage client.`,
  css: `%R% .scene{position:absolute;inset:0;z-index:2;background:${GRAD_CARTE};display:flex;flex-direction:column;justify-content:center;padding:0 0 0 120px}
%R% .gelule{align-self:flex-start;padding:12px 32px;border-radius:999px;background:${PAL.encre};color:${PAL.creme};font-size:30px;font-weight:700;letter-spacing:.14em;opacity:0}
%R% .titre{margin-top:40px;color:${PAL.encre};font-size:150px;font-weight:700;letter-spacing:-.03em;line-height:.95;opacity:0}
%R% .titre .or{color:${PAL.or}}
%R% .filet{margin-top:36px;width:300px;height:10px;border-radius:6px;background:${PAL.or};transform-origin:left}
%R% .sous{margin-top:34px;color:${PAL.encre};font-size:36px;font-weight:600;opacity:.62;line-height:1.35}
%R% .familles{margin-top:60px;color:${PAL.encre};font-size:29px;font-weight:600;opacity:0;line-height:1.5}
${miniCss("%R%")}
%R% .minis{right:110px;top:123px;flex-direction:column;gap:30px}
%R% .mini{width:460px;height:258px;flex-direction:row}
%R% .mini .z-face{width:170px}`,
  html: `<div class="scene" data-layout-allow-occlusion="">
      <span class="gelule">BANQUE MEG</span>
      <div class="titre">MEG - <span class="or">Large</span></div>
      <div class="filet"></div>
      <div class="sous">Layouts &amp; animations 16:9<br>YouTube · formations · webinaires</div>
      <div class="familles">Splits · duos · trios · détourés · bandes<br>intros · chapitres · outros · effets</div>
    </div>
    <div class="minis" data-layout-allow-occlusion="">
      <div class="mini"><div class="z-ecran"></div><div class="z-face"></div></div>
      <div class="mini"><div class="z-face"></div><div class="z-ecran"></div></div>
      <div class="mini"><div class="z-ecran"></div><div class="z-ecran"></div><div class="z-face"></div></div>
    </div>`,
  script: `
      tl.fromTo(root.querySelector('.gelule'),{y:-24,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'},.05)
        .fromTo(root.querySelector('.titre'),{y:40,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},.15)
        .fromTo(root.querySelector('.filet'),{scaleX:0},{scaleX:1,duration:.45,ease:'power2.out'},.45)
        .fromTo(root.querySelector('.sous'),{opacity:0},{opacity:.62,duration:.4},.6)
        .fromTo(root.querySelector('.minis'),{x:60,opacity:0},{x:0,opacity:1,duration:.5,ease:'power3.out'},.7)
        .fromTo(root.querySelectorAll('.mini'),{scale:.92},{scale:1,duration:.45,ease:'back.out(1.5)',stagger:.1},.7)
        .fromTo(root.querySelector('.familles'),{opacity:0},{opacity:1,duration:.4},1);`,
}));

export const catalogueBlocks = blocks;
