# Presets MEG pour Borumi

Ce fichier est la référence des choix validés dans Borumi. Il ne remplace pas l’inventaire HyperFrames : il indique ce qui doit être natif et ce qui doit rester un média local.

## Socle par défaut Reel / Story

- Canvas : `1080×1920`, fond uni `#FFFCD6` (`r:255,g:252,b:214`).
- Captions : gélule encre `rgba(47,44,0,.86)`, texte crème uniforme `#FFFCD6`, Clash Grotesk 700, taille 58, rayon 28, padding horizontal `.48`, vertical `.24`, position basse, aucun mot actif coloré.
- Curseur : absent par défaut.
- Écran recadré : un `screen_zoom` de facteur `1` et point fixe par scène. Ajuster `x_ratio` et `y_ratio` au contenu réellement montré.
- Bordures sources : rayon `.0177777763`, ombre noire alpha 100, blur `.0185185187`, offset Y `.0185185187`.

## Layouts natifs validés

Les identifiants `screen_1` et `camera_1` doivent être remplacés par les Layer IDs lus dans la timeline si le projet en fournit d’autres.

### `MEG Reel · hook titre + écran + visage`

Utiliser uniquement pendant le titre. Le titre transparent occupe la zone haute ; l’écran commence plus bas ; le visage reste petit.

```json
{
  "kind": "custom",
  "sources": [
    {"layer_id":"screen_1","x_ratio":0.0177777763,"y_ratio":0.1430742745,"width_ratio":0.9644443989,"height_ratio":0.5459257509,"lock_aspect_ratio":false,"overflow":false},
    {"layer_id":"camera_1","x_ratio":0.0177777763,"y_ratio":0.6990000606,"width_ratio":0.9644443989,"height_ratio":0.2909999788,"lock_aspect_ratio":false,"overflow":false}
  ]
}
```

### `MEG Reel · écran plein + visage détouré bas gauche`

Preset par défaut après le titre. L’écran reprend toute la hauteur et le visage reste petit. Le détourage est natif, donc la position, la taille et la suppression d’arrière-plan restent modifiables dans Borumi.

```json
{
  "kind": "custom",
  "sources": [
    {"layer_id":"screen_1","x_ratio":0,"y_ratio":0,"width_ratio":1,"height_ratio":1,"border_radius_ratio":0,"lock_aspect_ratio":false,"overflow":false},
    {"layer_id":"camera_1","x_ratio":0,"y_ratio":0.5,"width_ratio":0.4422871121,"height_ratio":0.5000000205,"border_radius_ratio":0,"lock_aspect_ratio":false,"overflow":false,"video_background_override":{"kind":"Transparent","softness":0,"edge_shift":0,"quality":{"kind":"Balanced"}},"face_tracking_mode_override":{"kind":"Disabled"}}
  ]
}
```

Toujours garder `screen_1` avant `camera_1` dans `sources` pour que le visage détouré soit devant l’écran.

### `MEG Reel · écran dominant · visage bas 33`

Alternative native lorsque la séparation nette sert le contenu : écran environ 67 %, visage pleine largeur environ 33 %. Correspond au bloc `meg-reel-bande-bas-33`.

### `MEG YouTube · caméra gauche 32 · écran droite 62`

Preset 16:9 validé dans le projet `MEG — Contrôle YouTube` : fond crème, gouttières de 40 px, caméra petite et écran dominant.

```json
{
  "kind": "custom",
  "sources": [
    {"layer_id":"screen_1","x_ratio":0.357291667,"y_ratio":0.037037037,"width_ratio":0.621875,"height_ratio":0.925925926,"border_radius_ratio":0.015625,"lock_aspect_ratio":false,"overflow":false},
    {"layer_id":"camera_1","x_ratio":0.020833333,"y_ratio":0.037037037,"width_ratio":0.321875,"height_ratio":0.925925926,"border_radius_ratio":0.015625,"lock_aspect_ratio":false,"overflow":false}
  ]
}
```

### `MEG Reel · preuve haut 40 · visage bas 60`

Équivalent natif de `meg-face-proof-split-t04`. Utiliser une composition custom avec preuve haute et visage bas ; préserver environ 40/60, les gouttières et la caption dans la zone visage. La géométrie exacte dépend du crop du rush et se vérifie en situation.

### `MEG Reel · visage haut 60 · preuve bas 40`

Équivalent natif de `meg-face-proof-split-t17`. Inverser les deux zones ; préserver environ 60/40 et garder la caption liée au visage.

### `MEG Reel · preuve plein écran`

Utiliser `{"kind":"fullscreen","layer_id":"screen_1","fit":"cover"}`. Le cadrage doit être visé et fixe ; utiliser `padding` si aucun crop ne peut conserver l’information utile.

### `MEG Reel · visage plein écran`

Utiliser `{"kind":"fullscreen","layer_id":"camera_1","fit":"cover"}`. Garder les yeux au tiers supérieur.

## Éléments importés depuis HyperFrames

- `meg-tiktok-title-classic` : rendre en PNG transparent avec le script du skill, puis importer comme `media_overlay`. Le texte natif Borumi ne reproduit pas la silhouette multiligne.
- CTA, lower third, logo, cartes et annotations statiques : privilégier les éléments natifs Borumi lorsque leur forme reste simple et éditable ; sinon rendre un PNG transparent local.
- Détourage caméra simple : utiliser le layout natif Borumi avec arrière-plan `Transparent`.
- Animation, entrée/sortie, occlusion, compteur, rail animé, callout, transition, appareil et avant/après animé : conserver HyperFrames, rendre localement puis importer comme overlay ou B-roll. Dans Borumi, le média rendu reste remplaçable, mais son contenu interne n’est pas éditable.
- Un `media_overlay` Borumi est toujours au-dessus de la composition. Pour placer une animation entre l’écran et le visage détouré, la composer dans HyperFrames avec occlusion, ou utiliser une véritable source visuelle supplémentaire ; le MCP Borumi n’expose pas de `z-index` d’overlay.

## Bibliothèque native installée le 24 août 2026

- Inventaire HyperFrames contrôlé : `274` blocs.
- Compatibilité : `109` layouts natifs, `70` overlays simples reconstructibles, `13` médias uniquement, `82` motion design uniquement.
- Les `109` blocs de layout donnent `83` géométries Borumi uniques après déduplication, dont `56` Reel/Story et `27` YouTube 16:9.
- État restauré le 24 août 2026 : `83` presets MEG générés + `1` favori utilisateur conservé = `84` favoris globaux. La déduplication est volontaire : plusieurs blocs HyperFrames ne diffèrent que par un habillage non porté par le payload de layout Borumi.
- L’interface Borumi n’affiche ni nom ni catégorie pour un favori custom. Le format se reconnaît par sa miniature et se contrôle dans un canevas 9:16 ou 16:9.
- `All` affiche ces favoris avec les built-ins et les layouts du projet ; ce n’est pas une bibliothèque indépendante. Si Mohamed retire une étoile, restaurer le preset global avant de poursuivre.
- Import reproductible : `node borumi/scripts/install.mjs --install` depuis la racine du dépôt, Borumi fermé.
- Manifeste versionné : `borumi/layouts/manifest.json` ; payload exact : `borumi/layouts/favorite-layout-presets.json`.

## Logos officiels MEG

Importer dans chaque projet qui en a besoin :

- `meg-logo-dark.png`
- `meg-logo-light.png`
- `meg-icon-dark.png`
- `meg-icon-light.png`

Sources : `scripts/gen-layouts/assets/` depuis la racine du dépôt. Les PNG conservent leur transparence. Les quatre variantes sont déjà copiées dans `Test` et dans `MEG — Contrôle YouTube` sur le Mac courant.

## Routage de la banque HyperFrames

- Géométries de layouts : utiliser les `83` favoris globaux déjà installés.
- Overlays simples : reconstruire nativement dans le projet au moment de l’usage ; Borumi ne propose pas de bibliothèque globale de presets d’éléments personnalisés via MCP.
- Titres TikTok complexes : PNG transparent paramétré.
- Motion design : garder HyperFrames comme moteur source et importer seulement le rendu local nécessaire.

Source canonique : dépôt `meg-hyperframes-banque` sur `main`.
