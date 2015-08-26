---
author: "Steven Enten"
date: 2014-06-01
title: Communications dans les systèmes embarqués par l’emploi d’agents mobiles
weight: 10
categories:
  - phd
tags:
  - cloudlet
  - embedded system
  - mobile agents
  - virtualization
aliases:
  - "/page/communications-dans-les-systmes-embarqus-par-lemploi-dagents-mobiles/"
---

## Contexte

Les systèmes embarqués sont le support des périphériques mobiles qui ont envahi notre quotidien : ordinateurs portables, terminaux de poche (« smartphones »), tablettes tactiles, … ont profondément modifiés notre comportement. Les puissances de calculs (de plus en plus grandes) et les moyens de communications (e.g. Wifi, Bluetooth) dont ils disposent leur permettent d'interagir entre eux et avec le monde environnant.  Il est possible d’échanger avec l’un de ces systèmes lorsque le périphérique destinataire est joignable par un réseau informatique. Les périodes d’indisponibilités de ces périphériques sont fréquentes au cours de leur cycle d’utilisation (par exemple la perte d’une connexion à un réseau Wifi ou téléphonique mobile lors d’un déplacement).

Le sujet de ce projet de recherche porte sur l’emploi de la mobilité logicielle dans le but de proposer un modèle de communication nouveau pouvant garantir l’aboutissement des échanges entre systèmes embarqués. La conduite des travaux de ce projet doit permettre : à la société Leuville Objects d’initier une cellule de recherche et développement destinée à améliorer et optimiser ses prestations d’ingénieries informatiques ; de former et d’intégrer progressivement un étudiant – Steven ENTEN, arrivant au terme d’un second cycle universitaire et souhaitant devenir Docteur en informatique spécialisé dans les technologies mobiles – au monde de la recherche et de l’entreprise ; de contribuer aux recherches du groupe « Mobilité », dirigé par Fabrice MOURLIN, du Laboratoire d’Algorithmique,  Complexité et Logique (LACL).

La société Leuville Objects (LO) a depuis sa création en 1996, eu pour thème d'activité les architectures logicielles, leur création, leur gestion mais aussi leur mise en œuvre via l'emploi de cadres de développement (« frameworks ») novateurs pour leur époque. Ainsi, dès les premières versions de Java 2 Enterprise Edition (J2EE), des projets ont été montés dans des sociétés clientes par des ingénieurs de LO. De même, lors de l'apparition des premiers bus logiciels d'entreprise (ESB), LO a fait des choix audacieux autour de produits Open Source tels qu'Apache ServiceMix pour offrir à ses clients des solutions nouvelles à base de clusters d'ESBs.

Au cours des années passées, le thème de la virtualisation s'est développé dans toutes les sociétés, allant de la virtualisation de serveurs, jusqu'au poste client en passant par les réseaux eux même. La société LO souhaite être reconnue auprès de ses partenaires pour son expérience dans ce domaine et plus particulièrement sur le thème de la virtualisation de périphériques mobiles. Ce sujet est lié de manière très étroite à l'économie d'énergie et l'accroissement de la durée d'usage des périphériques mobiles tels que les téléphones, tablettes et autres navigateurs [1]. Le sujet de thèse proposé aborde le domaine commun de la virtualisation de périphérique mobile dans un cloud avec la possibilité d'exporter tout le contexte d'exécution pour en minimiser sa consommation énergétique [4], [7].

Les résultats obtenus dans cette thèse vont pouvoir directement être intégrés dans les travaux préparatoires effectués au sein de la société LO. Nous pouvons citer : la définition d'une architecture logicielle pour la virtualisation de poste mobile, l'isolation de machine virtuelle par container, la mise en place d'une architecture tolérante aux pannes (« fault tolerance ») pour assurer à l'utilisateur la disponibilité de son poste virtualisé. Le suivi régulier de ces travaux est aussi un moyen pour assurer la montée en compétence des ingénieurs sur ces sujets et ainsi développer l'activité de recherche et de développement de la société LO.

## Objectif

Les périphériques mobiles représentent un des axes stratégiques de développement de la recherche actuelle [6]. La mise au point de ce mécanisme inédit de haute disponibilité des communications doit permettre d’ouvrir la voie à des applications industrielles innovantes. Ce mécanisme consiste à communiquer par l’emploi d’agents mobiles envoyés directement au périphérique destinataire quand celui-ci est joignable. En cas d’indisponibilité du périphérique destinataire, les agents mobiles s’adresseront à un « clone » (une image virtuelle) du périphérique destinataire présent dans un environnement cloud. De cette manière, la communication est assurée entre l’expéditeur et le destinataire. Lorsque le destinataire sera de nouveau joignable, la synchronisation avec son clone sera réalisée par des agents mobiles.

Le développement d’un prototype logiciel illustrant ce mécanisme – de communication indirecte par l’emploi d’agents mobiles dans un environnement cloud – est l’une des contributions apportées par ce projet de recherche. Avant cela, il sera impératif d’élaborer une spécification formelle qui décrit de manière unique cette haute disponibilité des communications (la garantie que les messages échangés aboutissent malgré une indisponibilité partielle du destinataire). Un modèle temporel devra également être établi afin de vérifier la spécification ainsi que les propriétés temporelles exprimées par cette logique.

## Organisation des travaux de recherche

### Première année

Des travaux seront menés pour valider l’applicabilité de travaux antérieurs portant sur différentes stratégies de communication directe par agents mobiles [2], [3], [8]. Il faudra ensuite les développer pour proposer une stratégie de communication indirecte par cloud.

#### Communication directe

Il s’agira de développer une application distribuée sur deux périphériques embarqués et connectés par un réseau Wifi : le but est de montrer la possibilité d’échanger en direct un agent mobile entre deux tablettes. L’agent échangé – disposant de droits pour s’exécuter sur la plate-forme cible – effectuera une collection d’information avant de retourner sur la plate-forme de départ. Ce cas d’étude se raffine par une configuration initiale de l’agent afin de visiter une suite de périphériques embarqués avec retour. Un point important sera placé sur la description de la demande effectuée par les plates-formes ainsi que la gestion des permissions lors des visites. Un premier rapport de développement sera fourni pour montrer que les principes sont assimilés.

#### Communication indirecte par cloud

Le mode de communication précédent présente des limites évidentes. La disponibilité est essentielle, or dans le cadre de périphérique mobile, il faut que ceux-ci soient joignables par le réseau. De plus, l’aspect embarqué des périphériques implique une indisponibilité partielle de parties logicielles en regard des interruptions supportées : appels entrant, alarmes, batterie insuffisante, etc. Il est indispensable d’envisager un autre mode de communication non synchrone dans le cas où le mode précédent ne peut pas être utilisé. Ce mode alternatif consistera pour la partie communicante à envoyer un agent à destination non pas du receveur mais d’une image de ce dernier dans le cloud. Ce clone assurera les services d’accueil de la plate-forme absente. Lorsque celle-ci sera de nouveau disponible, le clone se chargera de sa mise à jour. L’application illustrant ce mode de communication devra être optimisée pour  un système réparti multi-échelle [5].
Un bilan de cette étude sera rédigé en mettant en valeur la pertinence des critères de réalisation. Un point important sera placé sur la description du clone et l’ensemble de son cycle de vie.

Les stratégies de communication précédemment introduites doivent donner lieu à une validation par prototypage. Chaque prototype sera défini au préalable pour s’assurer des observations faites, puis validé pour s’assurer de l’adéquation avec ce qu’il est censé montrer. Un bilan de cette première année devra être rédigé en anglais afin qu’une publication puisse paraître. Ce bilan devra conclure sur la poursuite du travail réalisé.

### Deuxième année

Sur la base du travail réalisé en première année, une application type sera à définir. Elle aura pour principal concept la mobilité d’agents (le plus autonome possible) entre plates-formes nomades. La rédaction des spécifications de cette application devra être menée à son terme pour ensuite débuter sa conception.

#### Spécification formelle
Le langage de spécification formelle Pi calcul d’ordre supérieur sera utilisé pour la rédaction des spécifications [10] : ce langage offre un pourvoir d’expression utile pour la description d’agents mobiles. Son étude est un impératif pour pouvoir ensuite décrire de façon formelle le contexte de la communication au sein du réseau.</p>

#### Preuve de propriétés

A partir des spécifications formelles, des propriétés temporelles seront exprimées par l’emploi d’une logique temporelle telle que TCTL [9]. Un modèle temporel sera construit à partir de la spécification en pi calcul. Les propriétés seront ensuite prouvées par model checking, telle que la transparence de communication. Le but est d’assurer que ces propriétés sont préservées lors de la construction du prototype résultat. Un outil tel qu’UPPAAL pourra être utilisé pour la construction d’automates temporisés.

Un bilan de cette étude formelle sera rédigé en insistant sur le cycle de vie d’un clone de plate-forme (e.g. comme la terminaison d’un clone de plate-forme).

### Troisième année

Une fois l’application type spécifiée, son prototypage pourra commencer en veillant à respecter les propriétés établies. L’objectif n’est pas d’obtenir une application distribuée utilisable dans le monde de l’industrie mais de valider les résultats de la première année et surtout d’appliquer les points spécifiés au cours de la deuxième année. Les choix techniques de réalisation ainsi que les aspects liés aux propriétés temporelles devront être consignés dans des documents spécifiques.

Chaque année de recherche donnera lieu à la présentation des résultats dans une conférence internationale reconnue dans le domaine : le travail réalisé y sera présenté. Les publications de la seconde et de la troisième année feront l’objet d’une version étendue afin d’être publiée dans une revue internationale de qualité.

## Références

* [1]	H. FLORES, S. N. SRIRAMA, R. BUYYA, “Computational Offloading or Data Binding? Bridging the Cloud Infrastructureto the Proximity of the Mobile User”, in Mobile Cloud Computing, Services, and Engineering, Second IEEE International Conference, 2014
* [2]	C. DUMONT, “Système d’agents mobiles pour les architectures de calculs auto-adaptatifs”, PhD Thesis, 2014
* [3]	C. MAHMOUDI, F. MOURLIN, “Adaptivity of Business Process”, in The Eighth International Conference on Systems, ICONS, 2013
* [4]	S. SIMANTA, K. HA, G. LEWIS, E. MORRIS, M. Satyanarayanan, “A Reference Architecture for Mobile Code Offload in Hostile Environments”, in Software Architecture and European Conference on Software Architecture, 2012
* [5]	S. ROTTENBERG, S. LERICHE,C. LECOCQ, C. TACONET, “Vers une définition d’un système réparti multi-échelle”, in Ubimob, 2012
* [6]	M. SATYANARAYANAN, “Mobile Computing: the Next Decade”, in The First ACM	 Workshop on Mobile on Mobile Cloud Computing and Services, 2010
* [7]	M. SATYANARAYANAN, P. BAHL, R. CACERES, N. DAVIES, “The Case for VM-based Cloudlets in Mobile Computing”, in Pervasive Computing, vol. 8, 2009
* [8]	M. BERNICHI, “Surveillance logicielle à base d’une communauté d’agents mobiles”, PhD Thesis, 2009
* [9]	P. BOUYER, “Model-checking Timed Temporal Logics”, in Electronic Notes in Theoretical Computer Science, vol. 231, 2009
* [10]	R. MILNER, “The polyadic p-calculus: a tutorial”, in Technical Report ECS-LFCS-91-180, 1993

## Contact

### Société Leuville Objects

__Laurent Nel__  
3 rue de la Porte de Buc, 78000 Versailles  
+33(0)1 39 50 20 00 – laurent.nel@leuville.com

### Directeur de thèse

__Fabrice Mourlin__  
LACL, 61 avenue du Général de Gaulle, 94010 Créteil Cedex  
+33(0)6.15.05.15.51 – fabrice.mourlin@u-pec.fr

### Doctorant

__Steven Enten__  
21 rue Charles Floquet, 94400 Vitry-sur-Seine  
+33(0)7 70 32 27 55 – steven@enten.fr

