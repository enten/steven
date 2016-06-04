---
author: "Steven Enten"
date: 2016-06-04
title: Les prémices d'un nouveau framework orienté micro-services
weight: 10
topics:
  - restau
tags:
  - microservice
  - javascript
  - nodejs
  - restau
---


## Introduction

Chaque année, les étudiants de nombreux cursus informatiques se préparent à intégrer des deux pieds le monde de l'entreprise. Jeune ingénieur en poste depuis quelques mois, je souhaite partager mon expérience d'insertion professionnelle.

A travers une série d'articles, je tenterai de présenter le contexte de travail qui m'a conduit à concevoir et à implémenter un framework pour encadrer et optimiser le développement logiciel.

## Pourquoi un nouveau framework ?

Je pense que pour chaque besoin il existe une ou plusieurs solutions. Je ne suis pas de ceux qui aiment ré-inventer la roue. Au contraire. Seulement, mon contexte de travail actuel m'a amené à penser que parfois il n'existe pas de solution qui répond parfaitement à nos besoins.

J'évolue dans une PME où le service informatique est composé d'un responsable matériel (the sysadmin) et de deux développeurs (dont votre serviteur).

Aujourd'hui l'entreprise à besoin de concevoir ses systèmes en micro-services ré-utilisables. De nombreuses solutions dans différents languages existent et permettent de mettre rapidement en place ce type de plateformes.

J'ai commencé mon travail en m'appuyant sur un framework existant. J'ai pu rapidement mettre en place deux services :

* __Service A__ : gestion d'utilisateurs (création de nouveaux comptes et de jetons d'authentification)
* __Service B__ : gestion de documents (création, lecture et modification)

```
[Server A]                             :  [Server B]                
                                       :                            
                 Service A             :                   Service B
                     |                 :                       |    
    GET /profile/123 |                 :      GET /doc/321     |    
    ---------------->|                 :      ---------------->|    
    < - - - - - - - -|                 :      < - - - - - - - -|    
      profile(json)  |                 :        doc(json)      |    
                     |                 :                       |    
```

Ainsi, ces services peuvent être ré-utilisés à travers différents projets. Le backend était presque complet. Il ne manquait qu'à écrire un troisième service : le __service C__ qui conjugue et enrichi les services A et B pour proposer un service permettant de gérer des utilisateurs ayant des documents privés (sans lien direct entre un utilisateur et ses documents).

C'est là où se sont présentés différents problèmes. Des problèmes qui m'ont poussés à changer de framework. Mais les problèmes étaient toujours là.

## Un problème de conception

A ce stade, nous avons déjà 2 composants implémentés : `Services A` (gestion des utilisateurs) et `Service B` (gestion de documents).

Le composant `Service C` doit utiliser les services A et B. Il nous faut écrire 2 autres composants qui sont les clients permettant d'utiliser les services A et B : ce sont eux qui savent comment dialoguer avec les services (appeler les bonnes routes avec les bons paramètres).

Nous appelerons ces composants `Service A Client` et `Service B Client`. Ils pourront être réutilisés par d'autres composants qui souhaiteraient s'interfacer avec un de ces services (A ou B).

```
[Server C]                               :  [Server A]               
                                         :                           
                 Service A Client        :         Service A         
                         |               :             |             
                         |               :             |             
    cltA.getProfile(123) |               :             |             
    -------------------->|      GET /profile/123       |             
                         |---------------------------->|             
                         |< - - - - - - - - - - - - - -|             
    < - - - - - - - - - -|       profile(json)         |             
        profile(json)    |               :             |             
                         |               :             |             
                                         :                           
                                         :...........................
                                         :                           
                                         : [Server B]                
                                         :                           
                 Service B Client        :         Service B         
                         |               :             |             
                         |               :             |             
    cltB.getDoc(321)     |               :             |             
    -------------------->|        GET /doc/321         |             
                         |---------------------------->|             
                         |< - - - - - - - - - - - - - -|             
    < - - - - - - - - - -|         doc(json)           |             
          doc(json)      |               :             |             
                         |               :             |             

```

Nous pouvons maintenant écrire le service C. Et c'est là où émerge la principale problématique.

__Si les services A et B évoluent, il faut mettre à jour les composants clients respectifs.__ Il en va de même pour un éventuel futur composant `Service C Client`.

Dans le cas du service C, lorsqu'un utilisateur souhaite récupérer son profil, le service C utilise le composant client du service utilisateur (`Service A Client`) pour contacter le service distant (`Service A`) et retransmet la réponse à l'utilisateur.

```
[Server C]                                                     : [Server A]    
                                                               :               
                     Service C          Service A Client       :    Service A
                         |                     |               :        |      
 ( )    GET /profile/123 |                     |               :        |      
--|--   ---------------->| clt.getProfile(123) |               :        |      
 / \                     |-------------------->|    GET /profile/123    |      
User                     |                     |----------------------->|      
                         |                     |< - - - - - - - - - - - |      
                         |< - - - - - - - - - -|     profile(json)      |      
        <- - - - - - - - |    profile(json)    |               :        |      
          profile(json)  |                     |               :        |      
```

Si la route du service A pour afficher le profile change, il faudra modifier le client (et éventuellement le service C si on veut être cohérent avec les routes du service A) pour pointer vers la nouvelle route.

__Et c'est là où la majorité des frameworks montrent leurs limites : ils sont orientés serveur et n'apportent aucune aide pour s'interfacer avec les services écris.__ Faire évoluer un service devient alors pénible puisqu'il faut faire évoluer ses dépendances.

## La solution idéale

Nous avons constaté que les frameworks de micro services sont orientés serveur : ils permettent d'écrire des services mais ne proposent pas de solution rapide pour s'interfacer avec ces derniers.

La solution idéale doit permettre aux développeurs :

* de se concentrer sur le code métier des services ;
* et de fournir des moyens simples pour les utiliser aussi bien du côté serveur que du côté client.

Nous devrions pouvoir écrire un service de la manière suivante :

```javascript
// HelloService.js

class HelloService {
  sayHello(inputs) {
    return 'hello ' + (inputs.who || 'world');
  }
}

module.exports = HelloService;
```

Ce service ne propose qu'une seule route `GET /sayHello` qui retourne un message selon les paramètres d'appels :

* L'appel `GET /sayHello` affiche _Hello world_ ;
* L'appel `GET /sayHello?who=jd` affiche _Hello jd_.

Notre framework doit être capable de charger des services et de proposer de les exécuter en mode serveur ou en mode client.

```javascript
// app.js
var NotreSuperFramework = require('notre-super-framework');
var HelloService = require('./HelloService');

var app = new NotreSuperFramework();

// charge le service HelloService sur la route /hello
app.use('/hello', HelloService);

module.exports = app;
```

```javascript
// server.js
var app = require('./app');

// lance le serveur http://localhost:1337
app.listen(1337);
```

```javascript
// test.js
var app = require('./app');

// créer un client vers le serveur de services http://localhost:1337
var api = app.client(1337);

// appel la route GET http://localhost:1337/hello/sayHello?who=jd
api.HelloService.sayHello({ who: 'jd' }, function (err, res) {
  if (err) {
    console.error(err);
    return;
  }

  // affiche "Hello jd"
  console.log(res.body);
});
```

Nul besoin d'être un développeur NodeJS confirmé pour comprendre la simplicité d'utilisation recherchée : c'est le framework qui s'occupe de générer le serveur ou le client.

On peut même imaginer un troisième mode qui permettrait de monter automatiquement les routes de services distants.

```javascript
// app-b.js
var NotreSuperFramework = require('notre-super-framework');
var appA = require('./app');

var appB = new NotreSuperFramework();

// monte les services du serveur distant http://localhost:1337
appB.use('/', appA.remote(1337));

module.exports = appB;
```

```javascript
// server.js
var appB = require('./app-b');

// lance le serveur http://localhost:1338
appB.listen(1338);
```

Une requête adressée à la route `GET http://localhost:1338/hello/sayHello` et relayée via le client vers la route `GET http://localhost:1337/sayHello` et la réponse retransmise à l'utilisateur à l'origine de la requête.

## Conclusion

N'ayant pas trouvé de framework permettant d'écrire et d'interfacer simplement des micro services, je vais tenter de développer une idée de framework de micro services universels (pouvant être utiliser dans différents modes dynamiquement).

Dans les prochains articles, nous allons développer les spécifications de notre solution idéale.
