# Banks — matière première de montage (jamais partir de zéro)

Règle Mohamed : **on ne part jamais de zéro**. Avant d'écrire un composant, chercher ici un existant à adapter. Ces banques sont des **sources vendorées** (code copié depuis GitHub, vérifié sans hook d'installation ni appel réseau) : on s'en sert comme catalogue, on ne les importe **jamais directement**.

## Règles d'usage

1. **Copier, pas importer** : un composant utile se copie dans `src/` (ou `src/templates/`) puis s'adapte à la charte MEG (`src/meg-brand.ts` : cream/gold/ink, ClashGrotesk, radius). `banks/` est exclu du `tsconfig` — rien ici n'est compilé.
2. **Adapter toujours** : couleurs → tokens MEG, fontes → `load-font.ts`, jamais de visage humain généré, textes réels seulement au montage.
3. **Licences OK** : MIT partout (RVE : mention MIT dans son README). Deps déjà installées dans le repo : `@remotion/transitions`, `@remotion/lottie`, `@paper-design/shaders-react` (shaders remocn), `@remotion/google-fonts`.
4. **Gate d'abord** : le style (S1/S2/S3/Y1) choisi avec Mohamed décide où piocher — voir le mapping ci-dessous.

## Les 5 banques

| Dossier | Source | Contenu | Point fort |
|---|---|---|---|
| `onda/` | github.com/degueba/onda (MIT) | 70 composants (`components/`) + 18 transitions (`transitions/`) + `lib/` (motion, canvas, choreography — requis par les composants) | Motion graphics soignés : captions, count-up, device-frame, browser-frame, confetti, audio-visualizer |
| `remocn/` | github.com/Remocn/remocn (MIT) | 93 composants (`components/`, chacun autonome avec sa `foundation.tsx`) + `remocn-ui/` + `remocn-icons/` | Le plus premium : démos produit (a1-product-demo), glass-code-block, charts animés, dither/grain dissolve, marquee, bento |
| `rve-templates/` | github.com/reactvideoeditor/remotion-templates (MIT) | 81 templates mono-fichier (`templates/`) | Zéro dépendance, hooks Remotion purs : charts, textes, transitions, effets caméra |
| `captions-themes/` | github.com/vshukla7/remotion-captions-themes (MIT) | 13 thèmes de sous-titres mot à mot (`src/themes/`) + moteur (`src/CaptionTheme.tsx`) | Karaoke, kinetic, one-word — base directe pour S1 |
| `scenes/` | github.com/lifeprompt-team/remotion-scenes (MIT) | 201+ scènes en 16 catégories (`src/scenes/`) : Text, Data, Layout, List, Logo, Particle, Transition, UI… | Volume : toujours une scène proche du besoin |

## Mapping styles → banques (où piocher d'abord)

- **S1 — Captions** : `captions-themes/src/themes/` (simple-one-word, karaoke, kinetic-01/02) ; onda `components/captions` ; titres d'ouverture → rve `bounce-text`, `popping-text`.
- **S2 — Démo preuves** : remocn `a1-product-demo`, `glass-code-block`, `chat-to-preview-layout`, charts animés ; onda `browser-frame`, `device-frame`, `count-up`, `bounding-box` ; rve `stat-counter`, `comparison-chart`, `progress-bars` ; scenes `DataAnimations`, `DemoAnimations`, `UIAnimations`.
- **S3 — Full motion** : scenes `TextAnimations`, `ShapeAnimations`, `ListAnimations`, `LogoAnimations` ; remocn `kinetic-center-build`, `infinite-marquee`, `infinite-bento-pan`, dissolves ; onda `dynamic-grid`, `bento-grid`, `blur-reveal`, `draw-on` ; rve textes et charts.
- **Y1 — Talk 16:9** : onda `chapter-card`, `callout`, transitions ; remocn `line-by-line-slide`, `inline-highlight` ; lower third = toujours `src/meg-logo-data.ts` (bloc logo MEG, jamais un simple texte).
- **Transitions (tous styles)** : onda `transitions/` (18) ; scenes `TransitionAnimations` ; rve `blinds-transition` ; remocn `fade-through`, `dither-dissolve`, `grain-dissolve`.

## Compléments à la demande (non vendorés)

- **LottieFiles** (lottiefiles.com) : animations `.json` à télécharger à l'unité selon le besoin, lues via `@remotion/lottie` (déjà installé). Licence Lottie Simple License.
- **Mixkit** (mixkit.co/free-sound-effects/) : effets sonores gratuits usage commercial, sans attribution.
