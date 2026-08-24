# Routage HyperFrames vers Borumi

Consulter ce fichier uniquement lorsqu’un montage Borumi doit reprendre un bloc de la banque HyperFrames.

Source canonique : racine du dépôt `meg-hyperframes-banque` sur `main`. Le kit Borumi versionné se trouve dans `borumi/`.

## Inventaire exhaustif au 24 août 2026

| Classe | Blocs | Traitement |
|---|---:|---|
| Layout natif convertible | 109 | Installés comme `83` géométries favorites uniques après déduplication. |
| Overlay natif reconstructible | 70 | À reconstruire nativement dans le projet au moment de l’usage ; Borumi n’a pas de bibliothèque globale de presets d’overlays custom via MCP. |
| Média uniquement | 13 | Rendu local transparent ou B-roll remplaçable. |
| Motion uniquement | 82 | HyperFrames, puis import du rendu local. |

L’inventaire source exhaustif reste `registry/registry.json`. Le mapping des 83 géométries natives dédupliquées est versionné dans `borumi/layouts/manifest.json`.

Les `83` favoris générés couvrent `56` géométries Reel/Story et `27` géométries YouTube. Après la restauration du 24 août 2026, Borumi contient `84` favoris globaux : les `83` MEG et un favori utilisateur conservé. Ils apparaissent aussi dans `All`, qui est une vue agrégée.

## Familles Reel 9:16

| Famille HyperFrames | Volume | Routage Borumi |
|---|---:|---|
| Écran + visage, 1 écran | 28 | Layout natif custom ; conserver seulement la géométrie. |
| Deux écrans + visage | 16 | Layout et médias natifs si les deux sources existent ; sinon overlays locaux. |
| Trois écrans + visage | 4 | Plusieurs overlays locaux ; ne pas fusionner les preuves en une image si elles doivent rester remplaçables. |
| Écran dominant + bande visage | 4 | Layout natif. Défaut validé : `meg-reel-bande-bas-33`. |
| Écran + titre à la couture | 4 | Layout natif + titre transparent importé. |
| Intros / hooks | 9 | Texte/cartes simples natifs ; animation HyperFrames importée si nécessaire. |
| Chapitres | 4 | Texte/forme natifs pour une version fixe ; animation importée. |
| CTA / outros | 5 | Texte et gélule natifs si simples ; logo/flèche ou animation en overlay local. |
| Deux visages / réaction | 4 | Natif seulement si deux sources caméra sont disponibles. |
| Détourage | 8 | Layout Borumi natif avec caméra transparente ; écran avant caméra dans l’ordre des sources. |
| Habillages plein cadre | 9 | Formes simples natives ; logo, halo ou progression complexe en overlay. |
| Appareils | 4 | Cadre appareil importé comme média local. |
| Avant / après | 4 | Deux médias natifs si statique ; rideau/animation via HyperFrames. |
| Preuve sociale | 2 | Médias et textes natifs si réels ; animation via HyperFrames. |

La banque comporte aussi les équivalents Large 16:9 : solos, duos, trios, bandes, intros, chapitres, outros, détourages, habillages et avant/après. Les géométries compatibles sont déjà dans les favoris globaux ; les tester depuis un canevas 1920×1080.

## Blocs spéciaux

| Bloc / famille | Routage |
|---|---|
| `meg-tiktok-title-classic` | PNG transparent généré puis `media_overlay`; la silhouette multiligne n’est pas native. |
| `meg-captions-global` | Captions natives selon le preset MEG approuvé. |
| `meg-face-full` | Layout caméra plein écran natif. |
| `meg-face-proof-split-t04` / `t17` | Layouts custom natifs 40/60 ou 60/40 ; l’entrée GSAP reste HyperFrames. |
| `meg-proof-full*` | Écran plein natif pour une preuve simple ; navigateur, tilt et scroll restent HyperFrames. |
| `meg-face-cta-arrows` | Texte natif possible ; flèches animées importées. |
| `meg-lower-third-identity` | Deux gélules + logo/point : natif si éditabilité prioritaire, PNG transparent si fidélité prioritaire. |
| `meg-masked-face-stage`, `meg-cutout-*` | Layout natif si seul le détourage caméra est requis ; HyperFrames si une occlusion ou une animation doit passer derrière/devant la silhouette. |
| `anim-*`, `motion-*`, `transition-*` | HyperFrames, rendu local, import Borumi. |

## Règle d’éditabilité

- Une géométrie traduite en `layout`, un texte Borumi, une caption, un fond ou un zoom restent éditables.
- Un PNG, SVG rasterisé ou MP4 importé reste déplaçable, remplaçable et redimensionnable dans Borumi, mais son design interne n’y est pas éditable.
- Les layouts compatibles sont déjà installés globalement. Pour les autres classes, résoudre le besoin du passage et importer uniquement le rendu utile.
- Borumi rend les `media_overlay` au-dessus de la composition et le MCP n’expose pas de `z-index`. Une bulle réellement derrière la tête nécessite une composition HyperFrames avec occlusion ou une source visuelle native dédiée.
