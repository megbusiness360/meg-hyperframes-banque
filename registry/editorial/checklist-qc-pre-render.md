# Checklist QC avant MP4 final

À exécuter après le montage et avant tout MP4 de livraison. Chaque ligne reçoit
`PASS`, `FAIL` ou `N/A` justifié dans le rapport QC. Un seul `FAIL` bloque le
rendu final.

| # | Contrôle | Preuve attendue |
|---:|---|---|
| 1 | Visage entier | À 3 instants minimum et sur chaque cut : tête, yeux, bouche et menton jamais coupés. |
| 2 | Zones sûres Reel | En 9:16, conserver environ 15 % libres en haut et 20 % en bas pour l’UI ; aucun texte important dans ces zones. |
| 3 | Zones sûres YouTube | En 16:9, vérifier les bords, la barre de lecture et le titre ; aucune information utile ne touche le cadre. |
| 4 | Sous-titres | Sous-titres hors UI, lisibles, liés au visage, une ligne de préférence, sans recouvrir une preuve. |
| 5 | CTA | Un seul CTA final, compréhensible et cohérent avec la destination ; aucun CTA concurrent en surimpression. |
| 6 | Contraste et charte | Crème, or et encre lisibles ; contraste vérifié sur fond clair et fond noir ; aucune marque fournisseur. |
| 7 | Données client | Aucun nom, e-mail, téléphone, identifiant, numéro de dossier ou message non autorisé. |
| 8 | URL et PII | URL internes, QR, tokens, adresses et barres navigateur masqués ou remplacés par une maquette neutre. |
| 9 | Claims | Chaque affirmation, chiffre, date et délai est relié à une source archivée ; aucun « conforme Qualiopi garanti », accord ou délai promis. |
| 10 | Autorité compétente | La vidéo distingue clairement Caisse des Dépôts, certificateur, France compétences, DREETS/DDETS, OF et CFA quand ils sont cités. |
| 11 | SFX | Mapping respecté : SFX utilitaires uniquement, aucune musique ni mélodie, pas deux SFX à moins de 300 ms, environ −18 dB sous la voix. |
| 12 | Mix voix | Voix dominante, intelligible au casque et sur haut-parleur ; aucun clic, souffle ou SFX ne couvre un mot. |
| 13 | Durée | Reel = 2:00 si ce gabarit est demandé ; YouTube = 15:00 ; tolérance et tenue documentées dans l’EDL. |
| 14 | Français | Accents, apostrophes, majuscules, nombres et termes métier relus ; format monétaire avec espace, par exemple `5 000 €`. |
| 15 | Lecture intégrale | Lecture à vitesse normale puis contrôle des cuts, transitions, freezes, captures et CTA ; aucun écran noir, flash parasite ou désynchronisation A/V. |

## Références de vérification

- SFX : `registry/sfx/sfx-mapping.md`.
- Claims : fiche source avec URL, autorité, date de publication et date d’effet.
- Visuels : captures anonymisées et autorisations jointes au projet, jamais dans
  la registry.

