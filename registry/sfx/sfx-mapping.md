# Mapping SFX par défaut — banque MEG

Règle halal MEG (obligatoire) : le son d'une vidéo MEG = voix de Mohamed +
SFX utilitaires uniquement (whoosh, pop, clic, impact, riser court).
**Aucune musique, aucune mélodie, aucune voix chantée, aucun instrument.**
Tout nouveau son entre par `sfx-manifest.json` avec licence archivée et
normalisation −14 LUFS. Un bloc sans son reste muet par défaut : le SFX
est posé au montage, sur le label d'entrée du bloc.

| Famille de blocs | SFX par défaut | Alternative |
|---|---|---|
| meg-transition-whip-* | sfx-whoosh-moyen | sfx-whoosh-court |
| meg-transition-flash-* | sfx-whoosh-court | sfx-impact-obturateur |
| meg-transition-doors / -streak / -wipe | sfx-whoosh-double | sfx-whoosh-moyen |
| meg-anim-zoom-punch-* / meg-anim-secousse-* | sfx-impact-doux | sfx-impact-obturateur |
| meg-anim-flash-* / freeze (meg-freeze-annote-*) | sfx-impact-obturateur | — |
| meg-anim-compteur-* / meg-stat-counter | sfx-pop-double | sfx-tic-toggle |
| meg-anim-mot-cle-* / meg-motion-mot-pop-* | sfx-pop-sec | sfx-pop-doux |
| meg-anim-badge-* / chips / icônes | sfx-pop-doux | sfx-pop-sec |
| meg-notification-message-* | sfx-ding-leger | sfx-pop-doux |
| meg-preuve-curseur-clic-* (déplacement → clic) | sfx-clic-micro (au clic) | sfx-clic-net |
| meg-preuve-scroll-auto-* (à chaque palier) | sfx-clic-clavier | sfx-tic-toggle |
| meg-preuve-loupe-document-* (pose de loupe) | sfx-pop-doux | sfx-impact-doux |
| meg-checklist-ticks (chaque tick) | sfx-tic-toggle | sfx-pop-sec |
| meg-reel-avant-apres-* (bascule) | sfx-riser-court puis sfx-impact-doux | sfx-whoosh-double |
| meg-reel-intro-hook-* / meg-yt-intro-* (pose du titre) | sfx-impact-doux | sfx-pop-sec |
| meg-*-cta-* (apparition CTA) | sfx-pop-doux | sfx-ding-leger |
| meg-detoure-occlusion-titre-* (liseré or) | sfx-whoosh-court | — |
| meg-presence-translucide-* (fondu) | muet | sfx-whoosh-court très bas |
| meg-habillage-* | muet (habillage permanent) | — |

Mix : SFX à −18 dB sous la voix, jamais deux SFX à moins de 300 ms
d'écart, maximum ~1 SFX toutes les 2 s en moyenne sur la vidéo.
