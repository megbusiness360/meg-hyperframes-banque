# Workflow MCP Borumi

## Guides à charger

Toujours commencer par `get_guides {}`. Selon le besoin, charger ensuite :

- `project_edits`, `editing`, `ui_navigation`
- `importing_media`, `editing_segment_media_overlay_add`
- `editing_segment_captions_add`, `editing_segment_captions_update`
- `editing_segment_cursor_add`, `editing_segment_cursor_update`
- `editing_segment_screen_zoom_add`, `editing_segment_screen_zoom_update`
- `editing_layouts` et le guide `editing_segment_layout_*` correspondant

## Transaction type

1. `begin_project_edit({project_id})`
2. `get_project_overview({tx_id})`
3. `get_timeline({tx_id, range, detail: "segments"})`
4. Mutation avec le dernier `timeline_hash`
5. Nouvelle lecture après toute mutation structurelle
6. `inspect_timeline` sur une plage minimale
7. `commit_project_edit({tx_id, change_summary})`

Garder les transactions petites : titre, captions et curseur/zooms sont des changements distincts.

## Presets

### Media overlay titre

```json
{
  "type": "media_overlay",
  "placement": {"range": [0, 2995]},
  "content": {"media_id": "<media_id>"},
  "properties": {
    "position": {"kind": "custom", "x_ratio": 0, "y_ratio": 0, "width_ratio": 1, "height_ratio": 1},
    "lock_aspect_ratio": false
  }
}
```

Dans Borumi, `x_ratio` et `y_ratio` désignent le coin supérieur gauche du
media, pas son centre. Un overlay plein cadre commence donc toujours à `0,0`.

Remplacer `2995` par la fin exacte du layout de hook.

### Media overlay chrome / étapes / preuve

Rendre d’abord le PNG local (sans réseau) avec
`borumi/scripts/render-overlay.mjs`, puis suivre le même flux `import_media` →
`media_overlay` :

```json
{
  "type": "media_overlay",
  "placement": {"range": [0, 12353]},
  "content": {"media_id": "<media_id>"},
  "properties": {
    "position": {"kind": "custom", "x_ratio": 0, "y_ratio": 0, "width_ratio": 1, "height_ratio": 1},
    "lock_aspect_ratio": false
  }
}
```

Le renderer couvre `brand-chrome`, `steps` (5/6/7 items) et `proof-chrome` en
`reel` ou `youtube`. Le transparent conserve le montage dessous ; le media
reste déplaçable/remplaçable mais son design interne n’est pas éditable.
Utiliser les textes/formes natifs lorsque l’éditabilité est prioritaire et
réserver le PNG aux habillages fixes qui doivent rester visuellement
identiques.

### Captions MEG

```json
{
  "position": "bottom",
  "paragraph_mode": null,
  "text_size": 58,
  "text_color": {"r": 255, "g": 252, "b": 214, "a": 255},
  "future_color": {"r": 255, "g": 252, "b": 214, "a": 255},
  "accent_color": null,
  "highlight_color": null,
  "background_color": {"r": 47, "g": 44, "b": 0, "a": 219},
  "background_horizontal_padding_ratio": 0.48,
  "background_vertical_padding_ratio": 0.24,
  "border_radius": 28,
  "font_families": ["Clash Grotesk"],
  "bold": true,
  "italic": false,
  "casing_mode": "original",
  "stroke_color": null,
  "stroke_width": 0
}
```

### Reel après le titre : écran plein + visage détouré bas gauche

```json
{
  "type": "layout",
  "placement": {"range": [2995, 12353]},
  "properties": {
    "kind": "custom",
    "sources": [
      {
        "layer_id": "screen_1",
        "x_ratio": 0,
        "y_ratio": 0,
        "width_ratio": 1,
        "height_ratio": 1,
        "border_radius_ratio": 0,
        "lock_aspect_ratio": false,
        "overflow": false
      },
      {
        "layer_id": "camera_1",
        "x_ratio": 0,
        "y_ratio": 0.5,
        "width_ratio": 0.4422871121,
        "height_ratio": 0.5000000205,
        "border_radius_ratio": 0,
        "lock_aspect_ratio": false,
        "overflow": false,
        "video_background_override": {
          "kind": "Transparent",
          "softness": 0,
          "edge_shift": 0,
          "quality": {"kind": "Balanced"}
        },
        "face_tracking_mode_override": {"kind": "Disabled"}
      }
    ]
  }
}
```

L’ordre est significatif : écran d’abord, caméra ensuite pour que le détourage passe devant. Remplacer les bornes par la durée réelle. Ne pas ajouter de segment `cursor` par défaut : tous ses modes déplacent l’écran recadré. Le créer seulement sur une plage explicitement demandée.

### YouTube 16:9 : caméra gauche + écran dominant droite

```json
{
  "type": "layout",
  "placement": {"range": [0, 12353]},
  "properties": {
    "kind": "custom",
    "sources": [
      {"layer_id":"screen_1","x_ratio":0.357291667,"y_ratio":0.037037037,"width_ratio":0.621875,"height_ratio":0.925925926,"border_radius_ratio":0.015625,"lock_aspect_ratio":false,"overflow":false},
      {"layer_id":"camera_1","x_ratio":0.020833333,"y_ratio":0.037037037,"width_ratio":0.321875,"height_ratio":0.925925926,"border_radius_ratio":0.015625,"lock_aspect_ratio":false,"overflow":false}
    ]
  }
}
```

Appliquer avec un canevas paysage `1920×1080` et le fond solide `{r:255,g:252,b:214}`.

## Contrôles visuels

- Hook : silhouette TikTok non rectangulaire, titre entièrement visible, captions sans débordement.
- Borne de hook : titre et layout finissent au même milliseconde.
- Après hook Reel : titre absent, écran plein et immobile, visage détouré petit en bas à gauche, captions toujours lisibles.
- YouTube : écran dominant, caméra plus petite, gouttières crème régulières, aucune déformation.
- Curseur : aucune piste de suivi par défaut ; mouvement seulement sur demande explicite.
- Zoom : aucun par défaut ; chaque segment doit correspondre à une interaction utile vérifiée.
