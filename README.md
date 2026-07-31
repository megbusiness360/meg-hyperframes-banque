# Banque universelle MEG HyperFrames

Source centrale des layouts MEG réutilisables dans toutes les timelines HyperFrames.

La structure suit la registry officielle HyperFrames : `registry/registry.json`, puis un manifeste et les fichiers de chaque bloc sous `registry/blocks/<nom>/`.

## Utilisation dans une timeline

Chaque projet pointe vers cette URL dans `hyperframes.json` :

```text
https://raw.githubusercontent.com/megbusiness360/meg-hyperframes-banque/main/registry
```

Pour synchroniser une ancienne ou une nouvelle timeline :

```bash
node scripts/sync-project.mjs /chemin/vers/la-timeline
```

La synchronisation installe uniquement les blocs absents dans `compositions/`. Elle ne remplace jamais un layout déjà utilisé : les anciennes vidéos restent donc reproductibles. Un layout amélioré est publié sous un nouveau nom versionné, puis devient disponible dans toutes les timelines au prochain lancement.

## Contenu

- `registry/` : layouts MEG adaptés et directement utilisables dans HyperFrames Studio.
- `sources/` : cinq banques Remotion MIT téléchargées (`onda`, `remocn`, `rve-templates`, `captions-themes`, `scenes`). Elles servent de matière première et ne sont jamais chargées directement dans une timeline HyperFrames.
- `scripts/sync-project.mjs` : synchronisation universelle des blocs manquants.

Les licences et crédits propres à chaque banque source restent dans son dossier. Le code MEG de la registry demeure la propriété de MEG Business 360.

## Ajouter un layout

1. Chercher d’abord un existant dans `registry/` et `sources/`.
2. Adapter le rendu à la charte MEG et au contrat HyperFrames.
3. Créer `registry/blocks/<nom>/registry-item.json` et le bloc HTML.
4. Ajouter le bloc à `registry/registry.json`.
5. Exécuter `hyperframes lint`, `hyperframes validate`, puis tester `hyperframes add` dans un projet neuf.
6. Publier sur `main`. Toutes les timelines verront le nouveau bloc à leur prochaine synchronisation.
