# Règles de la banque MEG HyperFrames

- Suivre la documentation officielle HyperFrames Registry et les skills MEG vidéo.
- Chercher et réutiliser avant de créer.
- `registry/` contient uniquement des blocs HyperFrames validés, légers et déposables dans `Comps`.
- `sources/` est une bibliothèque de référence Remotion : ne jamais l’importer directement dans une timeline HyperFrames.
- Préfixer les créations MEG par `meg-` et conserver un nom existant immuable.
- Une évolution incompatible devient un nouveau bloc versionné (`-v2`, `-v3`). Ne jamais écraser silencieusement un bloc déjà utilisé.
- Conserver les licences et la provenance de toute source externe.
- Ne jamais committer de vidéo de travail, rush, audio lourd, secret ou donnée client.
- Avant publication : lint, validation HyperFrames, installation dans un projet neuf et contrôle visuel dans Studio.

## Gate QA visuel (obligatoire, retour Mohamed 06/08/2026)

Aucun push de bloc sans vérification visuelle de CHAQUE bloc (jamais un échantillon),
rendu EN SITUATION avec le rush master réel, à 2-3 instants de l'animation :

1. Visage master ENTIER — la tête complète est visible, jamais coupée aux yeux ou à la bouche.
2. Zéro fond noir résiduel — le bloc remplit le cadre (fond crème charte) ou laisse le master plein cadre volontairement.
3. Gouttières ≥ 24 px entre cartes/écrans, marges de sécurité aux bords.
4. Centrage réel — aucun panneau ne déborde du cadre.
5. Les blocs d'animation montrent leur mouvement dans la preview (une image statique ne démontre pas un effet).

Tout FAIL = corriger le générateur puis re-vérifier la famille ENTIÈRE, pas seulement le bloc fautif.
