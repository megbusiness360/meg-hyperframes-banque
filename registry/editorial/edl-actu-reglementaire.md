# EDL — Actualité / alerte réglementaire

Gabarit pour expliquer un décret, arrêté ou texte officiel sans extrapoler. Le
texte source, son URL, sa date de publication et sa date d’entrée en vigueur sont
renseignés avant toute voix ou capture.

## Tableau chronologique

| # scène | Durée Reel 2:00 | Durée YouTube 15:00 | Fonction | Bloc banque recommandé (Reel / YT) | SFX | Note de contenu |
|---|---:|---:|---|---|---|---|
| 1. Hook question | 0:00–0:03 (3 s) | 0:00–0:03 (3 s) | Accrocher | `meg-reel-intro-question` / `meg-yt-intro-question` | `sfx-impact-doux` | Question datée : « Qu’est-ce que le texte du [date] change pour [public] ? » |
| 2. Source officielle | 0:03–0:18 (15 s) | 0:03–1:30 (87 s) | Prouver | `meg-freeze-annote-reel` / `meg-freeze-annote-yt` | `sfx-impact-obturateur` | Freeze sur le titre, l’autorité et la date. Afficher l’URL source raccourcie et lisible. |
| 3. Passage clé | 0:18–0:33 (15 s) | 1:30–3:00 (90 s) | Prouver | `meg-preuve-loupe-document-reel` / `meg-preuve-loupe-document-yt` | `sfx-pop-doux` | Loupe sur le paragraphe exact. Citer le texte sans le présenter comme conseil juridique. |
| 4. Ce que cela change | 0:33–0:58 (25 s) | 3:00–6:00 (180 s) | Expliquer | `meg-preuve-curseur-clic-reel` / `meg-preuve-curseur-clic-yt` | `sfx-clic-micro` au pointage | Séparer obligation, date d’effet et simple recommandation. Aucun délai inventé. |
| 5. Checklist | 0:58–1:23 (25 s) | 6:00–9:00 (180 s) | Expliquer / convertir | `meg-checklist-ticks` / `meg-motion-chips-colonne-yt` | `sfx-tic-toggle` par item | 3 à 5 contrôles datés. La version YouTube utilise les pastilles comme solution de repli de checklist. |
| 6. Public concerné | 1:23–1:38 (15 s) | 9:00–11:00 (120 s) | Expliquer | `meg-reel-ecran-haut-55-carte` / `meg-yt-bande-bas-25` | `muet` | Nommer OF, CFA, sous-traitants ou autres publics seulement si le texte le dit. |
| 7. Action | 1:38–1:52 (14 s) | 11:00–13:30 (150 s) | Convertir | `meg-reel-cta-recap` / `meg-yt-chapitre-barre-basse` | `sfx-pop-doux` | Donner une action vérifiable : archiver la source, contrôler le périmètre, demander un avis compétent si besoin. |
| 8. CTA unique | 1:52–2:00 (8 s) | 13:30–15:00 (90 s) | Convertir | `meg-reel-cta-fond-noir` / `meg-yt-chapitre-carton` | `sfx-pop-doux` | Un lien ou une prise de contact. Ne pas promettre d’interprétation opposable. |

## Gate factuel avant tournage

- [ ] Source officielle ouverte et archivée : `[autorité]`, `[URL]`, `[date]`.
- [ ] Périmètre, public et date d’effet confirmés.
- [ ] Chaque chiffre, seuil ou délai porte une source datée.
- [ ] La voix distingue texte, lecture pédagogique et conseil à faire vérifier.
- [ ] Aucun « conforme Qualiopi garanti », aucun accord ou délai garanti.
- [ ] La carte action ne remplace pas la décision de l’autorité compétente.

## Divergences d’ID

- Preuve écran YouTube : `meg-yt-ecran-droite-65-carte` (ou `-nav` pour une
  barre navigateur, `-75-*` pour une preuve plus dominante).
- Checklist YouTube : `meg-checklist-ticks` est au format unique ; en 16:9,
  utiliser `meg-motion-chips-colonne-yt` ou `meg-motion-icone-check-yt`.
- Fin YouTube : `meg-yt-outro-recap` puis `meg-yt-outro-carte-marque`.
