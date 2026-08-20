# EDL — Tutoriel / démonstration

Gabarit pour montrer un geste métier vérifiable, par exemple remplir une demande
EDOF. Le contenu à l’écran est réel ou clairement marqué comme maquette. Les
prérequis ne sont jamais comptés comme des étapes.

## Règles de durée

- Reel : 2:00 exactement ; accroche de 3 s, puis 3 à 5 étapes.
- YouTube : 15:00 exactement ; même fil, avec pauses pédagogiques et détails de
  preuve.
- Un seul appel à l’action à la fin. Une seule piste voix ; les SFX restent
  sous la voix et aucune musique n’est ajoutée.

## Tableau chronologique

| # scène | Durée Reel 2:00 | Durée YouTube 15:00 | Fonction | Bloc banque recommandé (Reel / YT) | SFX | Note de contenu |
|---|---:|---:|---|---|---|---|
| 1. Hook | 0:00–0:03 (3 s) | 0:00–0:03 (3 s) | Accrocher | `meg-reel-intro-hook-question` / `meg-yt-intro-question` | `sfx-impact-doux` | Question précise pour un OF/CFA. Ne pas promettre d’accord. |
| 2. Plan | 0:03–0:08 (5 s) | 0:03–0:20 (17 s) | Expliquer | `meg-reel-intro-sommaire` / `meg-yt-intro-sommaire` | `sfx-impact-doux` | Annoncer 3 à 5 gestes. Le plan doit correspondre au nombre réel d’étapes. |
| 3. Contexte | 0:08–0:18 (10 s) | 0:20–1:20 (60 s) | Respirer | `meg-reel-ecran-bas-45-carte` / `meg-yt-bande-bas-25` | `muet` | Poser le rôle de l’écran et masquer toute donnée client. Les prérequis restent hors décompte. |
| 4. Étape 1 — accès | 0:18–0:36 (18 s) | 1:20–3:20 (120 s) | Expliquer / prouver | `meg-preuve-curseur-clic-reel` / `meg-preuve-curseur-clic-yt` | `sfx-clic-micro` au clic | Montrer le bouton ou menu exact. Remplacer la maquette par la capture validée. |
| 5. Étape 2 — saisie | 0:36–0:56 (20 s) | 3:20–5:20 (120 s) | Expliquer / prouver | `meg-preuve-scroll-auto-reel` / `meg-preuve-scroll-auto-yt` | `sfx-clic-clavier` aux paliers | Lire les champs utiles sans afficher de nom, e-mail ou identifiant. |
| 6. Étape 3 — pièce ou complément | 0:56–1:16 (20 s) | 5:20–7:20 (120 s) | Prouver | `meg-preuve-loupe-document-reel` / `meg-preuve-loupe-document-yt` | `sfx-pop-doux` à la pose | Louper uniquement la zone utile d’un document. Source, date et statut doivent être vérifiés avant tournage. |
| 7. Étape 4 — instruction | 1:16–1:34 (18 s) | 7:20–9:30 (130 s) | Expliquer / prouver | `meg-freeze-annote-reel` / `meg-freeze-annote-yt` | `sfx-impact-obturateur` | Figer une ligne officielle et l’annoter. Ne pas transformer une annotation en avis juridique. |
| 8. Étape 5 — contrôle | 1:34–1:47 (13 s) | 9:30–11:50 (140 s) | Prouver | `meg-preuve-curseur-clic-reel` / `meg-preuve-curseur-clic-yt` | `sfx-clic-micro` au clic | Vérifier le récapitulatif et le statut affiché. Ne pas déclarer la mise en ligne avant preuve. |
| 9. Récapitulatif | 1:47–1:55 (8 s) | 11:50–13:20 (90 s) | Respirer / convertir | `meg-reel-cta-recap` / `meg-yt-outro-recap` | `sfx-pop-doux` | Reprendre 3 points maximum. En YouTube, enchaîner sur `meg-yt-outro-recap`. |
| 10. CTA unique | 1:55–2:00 (5 s) | 13:20–15:00 (100 s) | Convertir | `meg-reel-cta-commentaire` / `meg-yt-chapitre-carton` | `sfx-pop-doux` | Une action : demander le point sur le projet via le lien validé. Ne pas cumuler lien, commentaire et message privé. |

## Contrat de contenu

1. **Hook de 3 s.** Dire le problème concret avant le nom de l’outil.
2. **Annonce du plan.** Nommer exactement les 3 à 5 étapes visibles.
3. **Preuve écran.** Chaque étape comporte un curseur, un scroll ou une loupe.
   Un écran de démonstration n’est pas une preuve réglementaire en soi.
4. **Vocabulaire prudent.** Pour EDOF, garder les étapes réelles vérifiées le
   jour du tournage : accès, demande initiale, demande complémentaire,
   webinaire/habilitation et contrôle de mise en ligne. La décision relève de
   l’autorité compétente.
5. **Récap et CTA.** Résumer, puis inviter à une seule action. Aucun délai ni
   accord garanti.

## Notes SFX et montage

- Suivre `registry/sfx/sfx-mapping.md` : voix dominante, SFX à environ −18 dB
  sous la voix, pas deux SFX à moins de 300 ms, pas de musique.
- Les transitions éventuelles sont `meg-transition-whip-reel` /
  `meg-transition-whip-yt` avec `sfx-whoosh-moyen`, au maximum entre deux
  étapes. Elles ne remplacent pas la preuve.
- Les sous-titres restent lisibles hors des zones UI et restent liés au visage.
