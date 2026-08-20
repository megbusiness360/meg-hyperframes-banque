# EDL — Comparatif « VS »

Gabarit pour comparer deux options sans fabriquer de gagnant universel. Exemples
possibles : RS vs RNCP, sous-traitance vs direct. Les critères et les sources
sont renseignés avant le montage.

## Tableau chronologique

| # scène | Durée Reel 2:00 | Durée YouTube 15:00 | Fonction | Bloc banque recommandé (Reel / YT) | SFX | Note de contenu |
|---|---:|---:|---|---|---|---|
| 1. Hook VS | 0:00–0:03 (3 s) | 0:00–0:03 (3 s) | Accrocher | `meg-reel-intro-vs-teaser` / `meg-yt-intro-question` | `sfx-impact-doux` | Poser les deux options et le cas d’usage. |
| 2. Critère 1 | 0:03–0:20 (17 s) | 0:03–2:00 (117 s) | Expliquer | `meg-compare-cards` / `meg-yt-avant-apres-colonnes` | `sfx-pop-doux` | Comparer le périmètre, pas une opinion. Afficher la source sous le critère. |
| 3. Critère 2 | 0:20–0:40 (20 s) | 2:00–4:00 (120 s) | Prouver | `meg-reel-avant-apres-horizontal-50` / `meg-yt-avant-apres-colonnes` | `sfx-riser-court` puis `sfx-impact-doux` | Montrer un avant/après documenté. Masquer tout identifiant client. |
| 4. Critère 3 | 0:40–1:00 (20 s) | 4:00–6:00 (120 s) | Expliquer | `meg-reel-avant-apres-duo-cartes` / `meg-yt-avant-apres-cartes` | `sfx-riser-court` puis `sfx-impact-doux` | Ajouter une limite ou condition. Un critère non sourcé reste `[à vérifier]`. |
| 5. Mise en situation | 1:00–1:30 (30 s) | 6:00–10:00 (240 s) | Prouver | `meg-preuve-loupe-document-reel` / `meg-preuve-loupe-document-yt` | `sfx-pop-doux` | Appliquer les critères à un cas OF/CFA anonymisé. Ne pas appeler cela une validation. |
| 6. Barres finales | 1:30–1:52 (22 s) | 10:00–13:30 (210 s) | Convertir | `meg-data-bars` / `meg-motion-chips-colonne-yt` | `sfx-pop-double` | Afficher seulement des valeurs sourcées. |
| 7. Verdict nuancé | 1:52–1:57 (5 s) | 13:30–14:30 (60 s) | Expliquer | `meg-reel-intro-titre-plein` / `meg-yt-intro-titre-plein` | `sfx-impact-doux` | Conclure « pour [cas], [option] semble adaptée ; à confirmer selon [source] ». |
| 8. CTA unique | 1:57–2:00 (3 s) | 14:30–15:00 (30 s) | Convertir | `meg-reel-cta-fond-noir` / `meg-yt-chapitre-carton` | `sfx-pop-doux` | Une action de contact. Ne pas promettre le résultat du choix. |

## Grille de comparaison

| Critère | Option A | Option B | Source / date | Limite à dire |
|---|---|---|---|---|
| Périmètre | `[à remplir]` | `[à remplir]` | `[URL]` / `[date]` | `[ce qui n’est pas couvert]` |
| Public et usage | `[à remplir]` | `[à remplir]` | `[URL]` / `[date]` | `[condition]` |
| Mise en œuvre | `[à remplir]` | `[à remplir]` | `[URL]` / `[date]` | `[dépendance]` |

## Règles

- Ne jamais présenter RS ou RNCP, sous-traitance ou direct comme « meilleur » en
  toute circonstance.
- Pour un financement, nommer le canal correctement et rappeler qui décide.
- Les montants ou plafonds restent `[chiffre à sourcer]` tant qu’une source
  officielle datée n’est pas archivée.
- Si une carte « MEG » apparaît, elle décrit une méthode ou un cas documenté,
  jamais une promesse d’accord.

## Divergences d’ID

- Intro VS YouTube : pas de `meg-yt-intro-vs-teaser` dédié ; utiliser `meg-yt-intro-question` (existant) ou `meg-yt-avant-apres-colonnes` en teaser.
- Barres comparatives : `meg-data-bars` est au format unique ; en 16:9, `meg-motion-chips-colonne-yt` reste la solution validée.
- Fin YouTube : `meg-yt-outro-recap` puis `meg-yt-outro-carte-marque`.
