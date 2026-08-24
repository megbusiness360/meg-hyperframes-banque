---
name: borumi-montage
description: "Monter localement les vidéos MEG dans Borumi via MCP : titres, captions, layouts, médias, curseur, zooms et QC."
---

# Montage MEG dans Borumi

Utiliser ce skill pour toute création ou modification d’un projet Borumi. Il complète, sans le remplacer, le skill `meg-video-montage`, qui reste obligatoire pour toute vidéo MEG.

## Principes non négociables

- Monter dans le projet `.bmprojbundle` local avec le MCP Borumi. Ne pas exporter sans demande explicite.
- Respecter les gates de `meg-video-montage` : aucun B-roll, média de preuve ou bloc réutilisable non validé.
- Utiliser le MCP pour les lectures et mutations. Réserver l’interface à la validation visible ou aux fonctions absentes du MCP.
- Commencer chaque connexion par `get_guides {}`. Récupérer ensuite, une seule fois, les guides réellement nécessaires.
- Toute mutation passe par `begin_project_edit` → lecture du hash → mutation → vérification → `commit_project_edit`. Abandonner avec `abort_project_edit` si le résultat ne peut pas être vérifié.

## Ordre de montage

1. Lire l’état courant avec `get_ui_state`, `list_open_projects`, `get_project_overview` et `get_timeline`.
2. Préserver les découpes, scènes, groupes audio/vidéo et favoris créés par Mohamed.
3. Poser le layout, puis le titre, puis les captions, puis le curseur et enfin les zooms utiles.
4. Contrôler au minimum une frame pendant le hook et une frame juste après sa fin avec `inspect_timeline`.
5. Laisser le projet ouvert dans Edit. Ne produire aucun MP4 de publication sans GO.

## Titre TikTok MEG

- Le titre court commence à `0 ms` et se termine exactement avec le segment de layout du hook.
- Utiliser `borumi/scripts/render-title.mjs` depuis la racine du dépôt en ligne pour fabriquer un PNG transparent 1080×1920, sans dépendance Remotion : `node borumi/scripts/render-title.mjs --line1 "..." [--line2 "..."] --preset A|B|E --output /chemin/titre.png`.
- Importer ce PNG avec `import_media`, puis l’ajouter comme `media_overlay` plein cadre. Le transparent conserve le montage dessous.
- Ne jamais utiliser le texte multiligne natif Borumi pour ce bloc : son fond forme un rectangle unique. Le titre canonique mesure chaque ligne et produit une seule silhouette continue avec raccords concaves.
- Preset A (défaut) : fond crème `#FFFCD6`, texte encre `#2F2C00` ; preset B : fond encre `#2F2C00`, texte crème `#FFFCD6` ; preset E : fond jaune doux `#FFF3AE`, texte encre `#2F2C00`. Les trois utilisent Clash Grotesk Semibold 600 et suivent la largeur réelle de chaque ligne.
- Le script accepte une ou deux lignes uniquement : une troisième ligne est refusée, sans promesse de mise en page à trois lignes.

## Captions MEG

- Une seule piste sur toute la durée utile, issue du transcript Borumi corrigé.
- Clash Grotesk, gras, casse originale, groupes courts d’environ 3–4 mots, une seule ligne.
- Reprendre le bloc HyperFrames `meg-captions-global` : gélule encre `rgba(47,44,0,.86)`, texte crème uniforme `#FFFCD6`, Clash Grotesk 700, taille 58, rayon 28, padding horizontal `.48`, vertical `.24`, position `bottom`, `paragraph_mode: null`.
- Aucun mot actif coloré : `accent_color: null`, `highlight_color: null` et `future_color` identique à `text_color`. Aucun contour.
- Ne pas forcer `paragraph_mode: fill` : il affiche une phrase entière et peut déborder. Vérifier une caption longue et une caption après chaque changement de layout.
- L’ancre reste basse et liée à la zone visage. Elle ne traverse pas une coupe.

## Layout Story/Reel

- Pendant le titre, utiliser le layout favori de Mohamed : titre visible en haut, preuve écran lisible, visage en bas.
- Le layout se termine au même instant que le titre. Après cette borne, utiliser par défaut `MEG Reel · écran plein + visage détouré bas gauche` : écran sur toute la hauteur, caméra détourée petite et superposée en bas à gauche. Utiliser la bande visage 25/33 % seulement lorsqu’elle sert le contenu.
- Dans un layout détouré, placer les sources écran avant la caméra : Borumi affiche les sources suivantes au-dessus. Le détourage caméra reste natif et éditable via `video_background_override: Transparent`.
- Un écran recadré suit la souris par défaut, même sans segment `cursor`. Pour le garder immobile, poser sur chaque scène un `screen_zoom` couvrant la scène avec `zoom_factor: 1` et `focus_point: {kind:"position", ...}`. Viser le contenu utile scène par scène ; le centre `.5/.5` n’est qu’un point de départ.
- Ne pas recréer un favori existant ni écraser ses proportions. Lire les propriétés du segment `layout` et les conserver.

## Layout YouTube 16:9

- Partir d’un canevas `1920×1080` avec fond uni `#FFFCD6`.
- Défaut validé : petite caméra à gauche et écran dominant à droite, avec gouttières de 40 px. Les ratios exacts sont dans `presets-meg.md`.
- Les presets personnalisés globaux sont stockés par Borumi dans `Favorites`, mais ils apparaissent aussi dans la vue `All`. Appliquer les cartes 16:9 depuis un projet 16:9 et confirmer le résultat avec `inspect_timeline`.

## Bibliothèque de layouts Borumi

- `All` est une vue, pas un stockage : elle réunit les layouts `Built-in`, ceux utilisés dans le projet courant et les favoris globaux compatibles avec les sources disponibles.
- `Project` ne contient que les layouts déjà utilisés dans le projet courant. `Built-in` vient de l’application et n’est pas extensible par le MCP.
- Le seul stockage global supporté pour un layout custom est `settings.favorite_layout_presets`. Retirer l’étoile supprime donc le layout custom de `Favorites` et de `All`, sauf s’il reste utilisé dans le projet.
- Ne jamais annoncer un layout importé comme `Built-in`. Après une restauration globale, laisser l’onglet `All` sélectionné et vérifier visuellement que les cartes sont présentes.
- Ne pas modifier ni re-signer le bundle Borumi pour injecter des built-ins : une mise à jour écraserait la modification et la signature de l’application serait altérée.

## Canvas MEG

- Par défaut en Reel/Story, utiliser un fond uni crème MEG exact `#FFFCD6` (`{r:255,g:252,b:214}`), jamais un wallpaper ni un dégradé.
- Appliquer le fond avec `update_canvas` dans la même transaction que les layouts quand cela facilite le contrôle visuel.
- Vérifier les gouttières visibles autour des sources : aucune couleur résiduelle d’un ancien wallpaper.

## Curseur et zooms

- Par défaut, ne pas ajouter de segment `cursor` : ses modes Auto, Steady, Balanced et Snappy déplacent tous l’écran à des degrés différents.
- Ajouter le suivi curseur uniquement lorsque Mohamed le demande pour un passage précis. Sinon, verrouiller le cadrage recadré avec un `screen_zoom` fixe de facteur `1`, découpé aux bornes des scènes.
- Aucun zoom permanent. Ajouter un `screen_zoom` seulement autour d’un clic ou d’une interaction qui améliore réellement la compréhension.
- Le `screen_zoom` fixe de facteur `1` est une exception technique : il ne grossit pas l’image, il bloque le suivi automatique. Pour un vrai zoom utile : plage courte, `focus_point: cursor` ou position vérifiée, facteur modéré.

## Médias locaux

- Lire `get_guides` avec `importing_media` et le guide exact du segment avant l’import.
- Importer uniquement des chemins absolus supportés ; Borumi copie le média dans le projet.
- Après chaque import ou changement structurel, relire la timeline pour obtenir le nouveau `timeline_hash`.
- Les quatre variantes officielles MEG doivent être importées au début de chaque projet qui en a besoin : logo clair/sombre et icône claire/sombre. Borumi copie les fichiers dans le bundle du projet ; il n’existe pas de médiathèque globale MCP.

Les commandes MCP, propriétés de référence et contrôles sont détaillés dans [workflow-mcp.md](references/workflow-mcp.md). Pour réutiliser les choix validés, lire [presets-meg.md](references/presets-meg.md). Pour chercher ou importer un ancien bloc HyperFrames, lire [hyperframes-routing.md](references/hyperframes-routing.md).
