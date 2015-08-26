---
author: "Steven Enten"
date: 2014-11-17
title: Installer Apache Mesos 0.20.1 sur Ubuntu 14.04.1.LTS
weight: 10
categories:
  - software
tags:
  - cluster manager
  - apache
  - mesos
aliases:
  - "/page/installer-apache-mesos-0-20-1-sur-ubuntu-14-04-1-lts/"
---

## A propos d'Apache Mesos

[Mesos](http://mesos.apache.org/) est un projet de la fondation Apache présenté comme un noyau de systèmes distribués. Il permet d'exploiter les ressources de plusieurs machines comme un seul système. Il assure l'isolation et la haute disponibilité d'exécutions de programmes. Mesos fournit deux composants logiciels :

* __mesos-slave__ : composant installé sur un noeud slave pour mettre à disposition ses ressources à un noeud master ;
* __mesos-master__ : composant installé sur un noeud master pour gérer un système distribué (gérer les ressources des noeuds slaves et des exécutions de programmes initiées par l'utilisateur).

_En environnement de production, il est recommandé de configurer plusieurs noeuds mesos-master et d'utiliser [Apache Zookeeper](http://zookeeper.apache.org) pour l'élection du noeud master actif. Ainsi, quand le noeud master actif rencontre un problème, Zookeeper se charge d'élire un nouveau noeud master._

## Exemple d'utilisation d'Apache Mesos

### Plateforme cible

L'objectif de nos manipulations est de configurer un système distribué avec Mesos. Nous allons configurer Mesos sur deux noeuds Ubuntu 14.04.1 LTS :

* Noeud master (192.168.1.101) avec Zookeeper et mesos-master pour gérer le système distribué ;
* Noeud slave (192.168.1.102) avec mesos-slave pour mettre à disposition les ressources du noeud au système distribué (il se connecte à mesos-master en utilisant Zookeeper).

_En environnement de production, il est recommandé d'installer Zookeeper sur un noeud différent du noeud mesos-master car s'il rencontre un problème, Zookeeper ne sera plus disponible pour élire un nouveau noeud mesos-master et rediriger les noeuds mesos-slave._

### Diagramme de déploiement
```
          192.168.1.101
+---------------------------------+
|                   +-----------+ |
|                   | zookeeper | |
|                   +--[2181]---+ |        192.168.1.102
|                       ^  ^      |   +---------------------+
| +--------------+      |  |      |   |   +-------------+   |
| | mesos-master |------+  +------|---|---| mesos-slave |   |
| +----[5050]----+                |   |   +-------------+   |
|        ^                        |   +----------|----------+
|        |                        |              |
|        +------------------------|--------------+
+---------------------------------+
```

## Installer Apache Mesos sur plusieurs noeuds Ubuntu

### Prérequis

* [Ubuntu 14.04.1 LTS](http://releases.ubuntu.com/14.04.1) 64-bit est installé sur les noeuds master et slave
* Le paquet [openjdk-7-jdk](http://packages.ubuntu.com/fr/trusty/openjdk-7-jdk) est installé sur les noeuds
* La dépôt mesosphere est configurée sur les noeuds master et slave :

```bash
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv E56151BF
$ echo "deb http://repos.mesosphere.io/ubuntu trusty main" | sudo tee /etc/apt/sources.list.d/mesosphere.list
$ sudo apt-get update -y
```

### Configuration du noeud master

Installation du paquet __mesos__ et du paquet __zookeeper__ (par dépendance) :

```bash
$ sudo apt-get install mesos -y
```

Configuration de l'interface réseau utilisée par mesos-master :

```bash
$ echo 192.168.1.101 | sudo tee /etc/mesos-master/ip
```

Configuration du nom du système distribué :

```bash
$ echo MyCluster | sudo tee /etc/mesos-master/cluster
```

Configuration de l'URL Zookeeper pour identifier le noeud mesos-master  :

```bash
$ echo zk://192.168.1.101:2181/mesos | sudo tee /etc/mesos/zk
```

Configuration de l'instance Zookeeper :

```bash
$ echo 1 | sudo tee /etc/zookeeper/conf/myid
```

Redémarrage des services Zookeeper et mesos-master :

```bash
$ sudo service zookeeper restart
$ sudo service mesos-master restart
```

### Configuration du noeud slave

Installation du paquet __mesos__ sans le paquet __zookeeper__ :

```bash
$ sudo apt-get download mesos
$ dpkg -i mesos_0.20.1-1.0.ubuntu1404_amd64.deb
```

Configuration de l'interface réseau utilisée par mesos-slave :

```bash
$ echo 192.168.1.102 | sudo tee /etc/mesos-slave/ip
$ echo 192.168.1.102 | sudo tee /etc/mesos-slave/hostname
```

Configuration de l'URL Zookeeper pour identifier le noeud mesos-master :

```bash
$ echo zk://192.168.1.101:2181/mesos | sudo tee /etc/mesos/zk
```

Démarrage du service mesos-slave :

```bash
$ sudo service mesos-slave start
```

## Configuration additionnelle

Pour notre test, il est intéressant de configurer le noeud master pour pouvoir intégrer ses ressources au système distribué en démarrant le service mesos-slave. __Attention!__ Cette pratique est déconseillée en environnement de production.

Sur le noeud master :

```bash
$ echo 192.168.1.101 | sudo tee /etc/mesos-slave/ip
$ echo 192.168.1.101 | sudo tee /etc/mesos-slave/hostname
```
La commande `sudo service mesos-slave start` intégère les ressources du noeud master au système distribué (les ressources du noeud master peuvent alors être utilisées pour réaliser des traitements).

## Tester l'installation d'Apache Mesos

Rendez-vous sur l'interface web de mesos-master en consultant l'URL http://192.168.1.101:5050.
Le cadre à gauche indique le nombre de noeud slaves actifs (1 si mesos-slave est démarré sur le noeud slave, 2 si mesos-slave est également démarré sur le noeud master ou 0 si mesos-slave est arrêté sur les deux noeuds).

Pour tester rapidement l'exécution d'un programme, exécutez la commande suivante depuis le terminal d'un des noeuds :

```bash
$ mesos-execute --master=$(mesos-resolve zk://192.168.1.101:2181/mesos) --name="hello" --command="echo hello world" --resources="cpus:0.1;mem:16"
```

Note : le programme mesos-resolve permet de trouver le noeud mesos-master actif via Zookeeper.

L'installation peut être testée avec le framework [Marathon](https://mesosphere.github.io/marathon). Il est disponible sur le dépôt mesosphere ajouté précédemment. Exécutez la commande suivante sur le noeud master pour installer Marathon :

```bash
$ sudo apt-get install marathon -y
```
Une fois installée, il suffit de démarrer le service Marathon...

```bash
$ sudo service marathon start
```
...et de lancer des applications via son interface web en consultant l'URL http://192.168.1.101:8080.

Marathon négocie avec Mesos l'exécution d'applications et assure quelles soient toujours actives : lorsqu'une application se termine, Marathon se charge de la relancer. Marathon fournit une [API Rest](https://mesosphere.github.io/marathon/docs/rest-api.html) pour réaliser des opérations par requêtes http.

## Références

* Apache Mesos : http://mesos.apache.org
* Apache Zookeeper : http://zookeeper.apache.org
* Marathon : https://mesosphere.github.io/marathon
* Installing Mesosphere Packages on Ubuntu / Debian : https://mesosphere.com/docs/tutorials/install_ubuntu_debian
