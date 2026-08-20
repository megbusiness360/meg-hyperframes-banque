# Banque de hooks MEG

Accroches prêtes à adapter pour un OF ou un CFA. Les crochets sont obligatoires
tant que la donnée n’est pas vérifiée. Un hook de 3 secondes ouvre la vidéo ; il
ne remplace ni la source ni la nuance réglementaire.

## Convention

- `[chiffre à sourcer]`, `[date]`, `[source officielle]` et `[résultat documenté]`
  ne sont jamais lus comme des faits tant qu’ils ne sont pas remplis.
- Ne pas commencer chaque hook par « Tu ». Alterner question, constat, scène et
  contraste.
- Bloc Reel / YouTube indiqué dans chaque famille. Les blocs sont des IDs de
  registry, pas des noms libres.

## 1. Chiffre choc

Bloc par défaut : `meg-reel-intro-hook-chiffre` / `meg-yt-intro-hook-chiffre`.

| # | Formulation à trous | Bloc intro adapté | Exemple métier MEG prudent |
|---:|---|---|---|
| 1 | « `[chiffre à sourcer]` : c’est le point à vérifier avant `[action]`. » | `meg-reel-intro-hook-chiffre` / `meg-yt-intro-hook-chiffre` | « `[chiffre à sourcer]` devra être confirmé sur `[source officielle]` avant une demande EDOF. » |
| 2 | « En `[année]`, `[chiffre à sourcer]` concerne `[public]` — voici la source. » | même bloc | « En `[année]`, `[chiffre à sourcer]` concerne les OF/CFA ; source : `[URL]`. » |
| 3 | « `[chiffre à sourcer]` secondes pour repérer `[élément]` dans ce dossier. » | même bloc | « `[chiffre à sourcer]` secondes pour repérer le champ `[nom]`, si l’interface du jour le confirme. » |
| 4 | « `[chiffre à sourcer]` critères, pas un seul : on les compare. » | même bloc | « `[chiffre à sourcer]` critères séparent RS et RNCP dans cette comparaison sourcée. » |
| 5 | « `[chiffre à sourcer]` lignes du texte officiel changent la lecture de `[sujet]`. » | même bloc | « `[chiffre à sourcer]` lignes du décret du `[date]` parlent de `[sujet]`; lisons-les. » |
| 6 | « `[chiffre à sourcer]` pièces demandées dans l’exemple — aucune ne doit être inventée. » | même bloc | « `[chiffre à sourcer]` pièces apparaissent dans la demande de démonstration, à confirmer sur l’écran réel. » |
| 7 | « `[chiffre à sourcer]` étapes vérifiées pour aller de `[départ]` à `[arrivée]`. » | même bloc | « `[chiffre à sourcer]` étapes vérifiées du parcours EDOF seront montrées, pas un raccourci. » |
| 8 | « `[chiffre à sourcer]` mots à corriger dans ce libellé avant envoi. » | même bloc | « `[chiffre à sourcer]` mots du libellé doivent correspondre à la certification affichée. » |
| 9 | « `[chiffre à sourcer]` secondes de preuve écran, puis la limite à connaître. » | même bloc | « `[chiffre à sourcer]` secondes de preuve écran, puis je précise ce que la capture ne prouve pas. » |
| 10 | « `[chiffre à sourcer]` options, une seule adaptée à `[cas]` — on vérifie. » | même bloc | « `[chiffre à sourcer]` options de financement sont comparées pour `[cas]`, sources à l’appui. » |
| 11 | « `[chiffre à sourcer]` erreurs de libellé reviennent dans cette maquette. » | même bloc | « `[chiffre à sourcer]` erreurs sont repérées dans la maquette, pas attribuées aux clients. » |
| 12 | « `[chiffre à sourcer]` dates : publication, entrée en vigueur, contrôle. » | même bloc | « `[chiffre à sourcer]` dates du texte du `[date]` sont séparées à l’écran. » |
| 13 | « `[chiffre à sourcer]` niveaux de preuve ; voici celui qui manque. » | même bloc | « `[chiffre à sourcer]` niveaux de preuve sont distingués : capture, source, décision. » |
| 14 | « `[chiffre à sourcer]` mots dans une question : la réponse dépend de `[autorité]`. » | même bloc | « `[chiffre à sourcer]` mots résument la question ; la décision reste à `[autorité]`. » |
| 15 | « `[chiffre à sourcer]` champs visibles, `[chiffre à sourcer]` champs réellement utiles. » | même bloc | « `[chiffre à sourcer]` champs visibles, mais seulement ceux documentés dans la notice sont commentés. » |
| 16 | « `[chiffre à sourcer]` minutes pour comparer les critères, pas les slogans. » | même bloc | « `[chiffre à sourcer]` minutes pour comparer RS et RNCP avec les sources du jour. » |
| 17 | « `[chiffre à sourcer]` points dans la checklist avant de cliquer. » | même bloc | « `[chiffre à sourcer]` points de contrôle avant l’envoi de la demande affichée. » |
| 18 | « `[chiffre à sourcer]` documents, un seul paragraphe décisif : le voici. » | même bloc | « `[chiffre à sourcer]` documents sont ouverts ; le paragraphe utile est loupé et sourcé. » |
| 19 | « `[chiffre à sourcer]` cas documenté, aucune moyenne inventée. » | même bloc | « `[chiffre à sourcer]` cas documenté est présenté anonymement ; pas de moyenne extrapolée. » |
| 20 | « `[chiffre à sourcer]` secondes pour comprendre `[notion]`, avec sa limite. » | même bloc | « `[chiffre à sourcer]` secondes pour distinguer un canal CPF d’une décision d’accord. » |

## 2. Question

Bloc par défaut : `meg-reel-intro-question` / `meg-yt-intro-question`.

| # | Formulation à trous | Bloc intro adapté | Exemple métier MEG prudent |
|---:|---|---|---|
| 1 | « Qui décide vraiment de `[décision]` ? » | `meg-reel-intro-question` / `meg-yt-intro-question` | « Qui décide vraiment de l’accès à EDOF ? On commence par l’autorité compétente. » |
| 2 | « Quelle différence entre `[option A]` et `[option B]` pour `[cas]` ? » | même bloc | « Quelle différence entre RS et RNCP pour ton catalogue ? Les critères sont sourcés. » |
| 3 | « Où se trouve `[champ / preuve]` dans `[outil]` ? » | même bloc | « Où se trouve le champ utile dans la demande EDOF du jour ? » |
| 4 | « Pourquoi cette ligne `[texte]` mérite-t-elle une vérification ? » | même bloc | « Pourquoi cette ligne du décret du `[date]` mérite-t-elle une lecture séparée ? » |
| 5 | « Que change `[texte officiel]` pour `[public]` ? » | même bloc | « Que change le texte du `[date]` pour les OF concernés, selon sa portée exacte ? » |
| 6 | « Quelle pièce faut-il montrer, et laquelle ne faut-il pas afficher ? » | même bloc | « Quelle pièce montrer à l’écran, et quelles données masquer avant la capture ? » |
| 7 | « À quel moment vérifier `[condition]` ? » | même bloc | « À quel moment vérifier l’alignement entre programme et certification ? » |
| 8 | « Peut-on comparer `[A]` et `[B]` sans regarder `[critère]` ? » | même bloc | « Peut-on comparer sous-traitance et direct sans regarder le périmètre réel ? » |
| 9 | « Quelle est la première action après `[événement]` ? » | même bloc | « Quelle est la première action après la publication du nouveau texte ? » |
| 10 | « La capture prouve-t-elle `[claim]` ? » | même bloc | « La capture prouve-t-elle une décision ? Non : elle montre seulement l’état affiché. » |
| 11 | « Comment répondre à `[question client]` sans promettre `[résultat]` ? » | même bloc | « Comment répondre sur le CPF sans promettre l’accord d’un financeur ? » |
| 12 | « Qu’est-ce qui est obligatoire, recommandé ou simplement utile ? » | même bloc | « Qu’est-ce qui est écrit dans le texte, et qu’est-ce qui relève seulement de la méthode ? » |
| 13 | « Quelle preuve manque dans `[dossier]` ? » | même bloc | « Quelle preuve manque dans ce dossier anonymisé avant le clic final ? » |
| 14 | « RS ou RNCP : lequel répond à `[objectif]` ? » | même bloc | « RS ou RNCP pour `[objectif]` ? La réponse dépend des critères documentés. » |
| 15 | « Direct ou sous-traitance : où se trouve la responsabilité ? » | même bloc | « Direct ou sous-traitance : quelles responsabilités sont écrites dans le contrat ? » |
| 16 | « Que faut-il dater avant de partager cette actualité ? » | même bloc | « Que faut-il dater avant de partager ce décret : publication, effet ou contrôle ? » |
| 17 | « Quel écran montre réellement `[étape]` ? » | même bloc | « Quel écran montre réellement l’étape de demande complémentaire ? » |
| 18 | « Quelle limite dois-tu dire à la fin de cette comparaison ? » | même bloc | « Quelle limite dire à la fin : la décision ne revient pas à MEG. » |
| 19 | « Comment vérifier `[chiffre]` avant de l’afficher ? » | même bloc | « Comment vérifier `[chiffre à sourcer]` avant de le mettre en gros titre ? » |
| 20 | « Que ferais-tu aujourd’hui si `[règle]` venait de changer ? » | même bloc | « Que ferais-tu si la règle du `[date]` venait de changer ? Ouvre la source avant d’agir. » |

## 3. Erreur fréquente

Bloc par défaut : `meg-reel-intro-titre-plein` / `meg-yt-intro-titre-plein`.

| # | Formulation à trous | Bloc intro adapté | Exemple métier MEG prudent |
|---:|---|---|---|
| 1 | « L’erreur fréquente avec `[outil]` : `[erreur]`. » | `meg-reel-intro-titre-plein` / `meg-yt-intro-titre-plein` | « L’erreur fréquente dans cette maquette EDOF : confondre prérequis et étape. » |
| 2 | « Ne commence pas par `[mauvais geste]` ; vérifie `[bon repère]`. » | même bloc | « Ne commence pas par copier un modèle ; vérifie d’abord la source officielle. » |
| 3 | « Un écran propre ne prouve pas `[claim]` : voici ce qu’il prouve. » | même bloc | « Un écran propre ne prouve pas un accord ; il montre seulement les champs remplis. » |
| 4 | « Ce libellé ressemble à `[mot]`, mais le texte dit `[terme exact]`. » | même bloc | « Ce libellé ressemble à “certifié” ; le terme exact doit venir du texte vérifié. » |
| 5 | « Trois mots à ne pas mélanger : `[A]`, `[B]`, `[C]`. » | même bloc | « CPF, EDOF et financeur : trois mots, trois rôles à séparer. » |
| 6 | « Avant de cliquer sur `[bouton]`, contrôle `[condition]`. » | même bloc | « Avant l’envoi, contrôle l’alignement programme-certification affiché. » |
| 7 | « La maquette affiche `[élément]`, mais la source exige `[élément vérifié]`. » | même bloc | « La maquette affiche un exemple ; la source officielle doit confirmer chaque champ. » |
| 8 | « Ne compte pas `[prérequis]` comme une étape. » | même bloc | « Ne compte pas Qualiopi ou le NDA comme une étape du parcours montré. » |
| 9 | « Une date sans `[type de date]` peut tromper : ajoute `[type]`. » | même bloc | « Une date sans “publication” ou “entrée en vigueur” peut tromper : ajoute le type. » |
| 10 | « Le même mot ne veut pas dire la même chose dans `[contexte A]` et `[contexte B]`. » | même bloc | « “Habilitation” ne remplace pas le nom de l’organisme qui décide. » |
| 11 | « Ne montre pas `[PII]` pour expliquer `[fonction]`. » | même bloc | « Ne montre pas l’e-mail du client pour expliquer un champ de demande. » |
| 12 | « Un chiffre non sourcé reste `[placeholder]`, pas un titre. » | même bloc | « `[chiffre à sourcer]` reste un placeholder jusqu’à l’archive officielle. » |
| 13 | « Le mauvais comparatif commence par `[critère faible]` ; commence par `[critère utile]`. » | même bloc | « Le mauvais comparatif commence par un slogan ; commence par le périmètre. » |
| 14 | « Ne déduis pas `[résultat]` de `[capture]`. » | même bloc | « Ne déduis pas une mise en ligne d’une capture ; montre le statut autorisé. » |
| 15 | « L’erreur de vocabulaire : dire `[terme interdit]` au lieu de `[terme exact]`. » | même bloc | « L’erreur de vocabulaire : dire “conforme Qualiopi” pour un document. » |
| 16 | « Une réponse courte doit quand même citer `[source]`. » | même bloc | « Une réponse courte doit citer la source du texte et sa date. » |
| 17 | « `[action]` avant `[vérification]` : inverse l’ordre. » | même bloc | « Envoyer avant de vérifier l’alignement : inverse l’ordre dans la démonstration. » |
| 18 | « Le problème n’est pas `[peur]`, c’est `[point contrôlable]`. » | même bloc | « Le point contrôlable est le périmètre du texte, pas une promesse de résultat. » |
| 19 | « Ne laisse pas `[zone sensible]` visible pendant le scroll. » | même bloc | « Ne laisse pas un identifiant client visible pendant le scroll automatique. » |
| 20 | « Si `[condition]` manque, arrête le montage et marque `[à vérifier]`. » | même bloc | « Si la date d’effet manque, marque `[à vérifier]` et ne publie pas l’alerte. » |

## 4. Avant / après

Bloc par défaut : `meg-reel-intro-hook-avant-apres` / `meg-yt-avant-apres-colonnes`.

| # | Formulation à trous | Bloc intro adapté | Exemple métier MEG prudent |
|---:|---|---|---|
| 1 | « Avant : `[état observable]`. Après : `[état documenté]`. » | `meg-reel-intro-hook-avant-apres` / `meg-yt-avant-apres-colonnes` | « Avant : champ vide. Après : champ renseigné selon la notice du jour. » |
| 2 | « Même dossier, deux lectures : `[avant]` puis `[après]`. » | même bloc | « Même demande, deux lectures : maquette non sourcée puis capture validée. » |
| 3 | « Voici ce qui change vraiment entre `[A]` et `[B]`. » | même bloc | « Voici ce qui change vraiment entre RS et RNCP pour `[objectif]`, source à l’appui. » |
| 4 | « Avant de comparer, regarde `[critère]`; après, décide `[action]`. » | même bloc | « Avant de comparer, regarde le périmètre ; après, choisis la prochaine vérification. » |
| 5 | « Le “avant” montre `[écart]`, le “après” montre `[preuve]`, pas une garantie. » | même bloc | « Le “avant” montre l’écart ; le “après” montre la preuve disponible, pas un accord. » |
| 6 | « `[document]` avant, `[document]` après : quelle ligne a bougé ? » | même bloc | « Le document avant/après montre la ligne modifiée, avec la source affichée. » |
| 7 | « Avant : `[terme]`. Après : `[terme vérifié]`. » | même bloc | « Avant : un libellé approximatif. Après : le terme exact de la source officielle. » |
| 8 | « Avant l’envoi, `[contrôle]`; après l’envoi, `[preuve de statut]`. » | même bloc | « Avant l’envoi, contrôle les champs ; après, conserve le statut affiché. » |
| 9 | « Un avant/après utile explique `[cause prouvée]`, pas `[supposition]`. » | même bloc | « Un avant/après utile explique la modification documentée, pas une cause inventée. » |
| 10 | « Avant : `[canal]` seul. Après : `[canal combinable]`, si les conditions le permettent. » | même bloc | « Avant : un seul canal. Après : CPF avec les autres voies pertinentes, selon les conditions vérifiées. » |
| 11 | « Avant : `[question]`. Après : `[réponse sourcée]`. » | même bloc | « Avant : une question sur le décret. Après : la phrase sourcée et sa date d’effet. » |
| 12 | « Ce que l’on voit avant `[action]`, et ce que l’on peut dire après `[preuve]`. » | même bloc | « Ce que l’on voit avant le clic, et ce que l’on peut dire après le statut autorisé. » |
| 13 | « Avant : `[métrique]` non sourcée. Après : `[métrique]` avec `[URL]`. » | même bloc | « Avant : chiffre provisoire. Après : chiffre conservé avec URL et date. » |
| 14 | « Le changement n’est pas `[promesse]`; c’est `[résultat observable]`. » | même bloc | « Le changement n’est pas une garantie ; c’est un champ rempli et vérifiable. » |
| 15 | « Avant : `[geste inutile]`. Après : `[geste documenté]`. » | même bloc | « Avant : parcourir tout l’écran. Après : pointer uniquement la ligne utile. » |
| 16 | « Deux cartes, un choix : `[option A]` / `[option B]` pour `[cas]`. » | même bloc | « Deux cartes, un choix : sous-traitance ou direct pour ce périmètre documenté. » |
| 17 | « Avant l’actualité : `[état]`. Après le texte : `[action à dater]`. » | même bloc | « Avant le décret : état observé. Après le texte : action à dater et à vérifier. » |
| 18 | « Si l’avant et l’après ne sont pas datés, ne les compare pas encore. » | même bloc | « Si les deux captures ne portent pas de date, on les remplace avant le montage. » |
| 19 | « Avant : `[champ sensible]` visible. Après : `[champ]` masqué proprement. » | même bloc | « Avant : e-mail visible. Après : e-mail masqué, preuve toujours lisible. » |
| 20 | « Avant / après, puis une nuance : `[limite]`. » | même bloc | « Avant / après, puis la nuance : l’autorité compétente décide toujours. » |

## 5. Mythe à casser

Bloc par défaut : `meg-reel-intro-vs-teaser` / `meg-yt-intro-question`.

| # | Formulation à trous | Bloc intro adapté | Exemple métier MEG prudent |
|---:|---|---|---|
| 1 | « Mythe : `[affirmation]`. Réalité à vérifier : `[source]`. » | `meg-reel-intro-vs-teaser` / `meg-yt-intro-question` | « Mythe : un écran prouve l’accord. Réalité : il faut la décision de l’autorité compétente. » |
| 2 | « Non, `[dispositif A]` ne veut pas dire `[dispositif B]`. » | même bloc | « Non, EDOF ne veut pas dire accord automatique. » |
| 3 | « On entend `[phrase]`; le texte dit `[terme exact]`. » | même bloc | « On entend “conforme Qualiopi” pour un document ; le certificat concerne l’organisme. » |
| 4 | « Mythe : `[promesse de délai]`. Vérification : `[date / source]`. » | même bloc | « Mythe : un délai d’accord garanti. Vérification : lire la source et ne rien promettre. » |
| 5 | « `[A]` n’est pas `[B]` : montre la différence en 3 secondes. » | même bloc | « CPF n’est pas EDOF : le premier est un financement, le second un canal. » |
| 6 | « Mythe : `[chiffre]` pour tous. Réalité : `[périmètre]`. » | même bloc | « Mythe : `[chiffre à sourcer]` pour tous. Réalité : préciser le périmètre et la source. » |
| 7 | « Une certification ne remplace pas `[condition]`. » | même bloc | « Une certification ne remplace pas la vérification de l’offre et de son périmètre. » |
| 8 | « Le mythe confond `[acteur 1]` et `[acteur 2]`; voici qui fait quoi. » | même bloc | « Le mythe confond France compétences et certificateur ; voici leurs rôles documentés. » |
| 9 | « Mythe : `[capture]` suffit. Réalité : il faut `[preuve complémentaire]`. » | même bloc | « Mythe : la capture suffit. Réalité : conserver la source, la date et le statut. » |
| 10 | « Ce n’est pas `[superlatif]`; c’est `[action vérifiable]`. » | même bloc | « Ce n’est pas “garanti”; c’est une action vérifiable dans le dossier. » |
| 11 | « Mythe : `[canal]` ferme les autres portes. Vérifie `[combinaison]`. » | même bloc | « Mythe : le CPF remplace tout. Vérifie les canaux qui se combinent réellement. » |
| 12 | « Une phrase virale ne remplace pas `[texte]`. » | même bloc | « Une phrase sur un décret ne remplace pas le texte officiel daté. » |
| 13 | « Mythe : `[option]` convient à tous. Réalité : `[critère]`. » | même bloc | « Mythe : RS ou RNCP convient à tous. Réalité : le choix dépend du critère documenté. » |
| 14 | « Le titre ne dit pas `[résultat]`; il encadre `[usage]`. » | même bloc | « Un titre reconnu n’implique pas à lui seul un financement : il encadre un usage à vérifier. » |
| 15 | « Mythe : `[document]` doit être public. Réalité : masquer `[PII]`. » | même bloc | « Mythe : publier la capture complète. Réalité : masquer les données personnelles. » |
| 16 | « La notification prouve `[message reçu]`, pas `[conclusion]`. » | même bloc | « La notification prouve un message anonymisé, pas un résultat général. » |
| 17 | « Mythe : `[ancienne règle]`. Contrôle la règle datée du `[date]`. » | même bloc | « Mythe : une règle ancienne. Contrôle la version du texte datée du `[date]`. » |
| 18 | « Si la source ne dit pas `[claim]`, ne le dis pas à l’écran. » | même bloc | « Si la source ne dit pas “accord”, ne dis pas “accord” dans le hook. » |
| 19 | « Casser un mythe, c’est montrer `[preuve]` et `[limite]`. » | même bloc | « Casser le mythe, c’est montrer la ligne officielle et dire ce qu’elle ne tranche pas. » |
| 20 | « Le bon réflexe n’est pas `[réflexe rapide]`; c’est `[réflexe sourcé]`. » | même bloc | « Le bon réflexe n’est pas partager une rumeur ; c’est archiver la source officielle. » |

## Divergence d’inventaire

`meg-yt-intro-vs-teaser` n’existe pas dans la banque. Pour la famille « avant /
après », le gabarit utilise `meg-yt-avant-apres-colonnes`; pour la famille « mythe »,
il utilise `meg-yt-intro-question` comme intro proche.
