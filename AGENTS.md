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
