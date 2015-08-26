---
author: "Steven Enten"
date: 2014-11-30
title: Virtualiser Android 5 Lollipop avec Qemu
weight: 10
categories:
  - phd
tags:
  - android
  - lollipop
  - virtualization
  - qemu
  - embedded system
  - arm64
aliases:
  - "/page/virtualiser-android-5-lollipop-avec-qemu/"
---

## Introduction

Les dernières branches d'[Android Open Source Project](https://source.android.com/) (AOSP) – branches `android-5.x` – proposent différentes configurations d'assemblages d'[Android 5 Lollipop](https://www.android.com/versions/lollipop-5-0/).
Chaque configuration d'assemblage correspond à un produit adapté à un type de plateformes d'exécutions. Pour compiler une version complète d'Android 5 pour plateformes ARM, il faut utiliser la configuration d'assemblage `aosp_arm-eng` (pour les plateformes ARM 32-bits) ou `aosp_arm64-eng` (pour les plateformes ARM 64-bits).

D'autres produits sont proposées à la compilation notamment les produits `ranchu_arm64-eng` et `mini_emulator_arm64-userdebug` :

* __`ranchu_arm64-eng`__ : la compilation de ce produit permet d'obtenir une version complète d'Android 5 ARM 64-bits destinée à être exécutée dans une machine virtuelle (VM) Qemu ;
* __`mini_emulator_arm64-userdebug`__ : ce produit est similaire à `ranchu_arm64-eng` à la différence que sa compilation permet d'obtenir une version simplifiée d'Android 5 embarquant le minimum de composants nécessaires à son fonctionnement.

La compilation d'un de ces produits créer des images de systèmes de fichiers (`ramdisk.img`, `system.img`, `cache.img` et `userdata.img`) devant être utilisées avec le [logiciel de virtualisation Qemu](http://qemu.org/).
L'initialisation d'une VM Qemu avec le produit `ranchu_arm64-eng` permet de virtualiser Android 5 et de le contrôler via son terminal ou son interface graphique. L'initialisation d'une VM Qemu avec le produit `mini_emulator_arm64-userdebug` est beaucoup plus rapide car les composants de l'environnement graphique ne sont pas chargés : seul le terminal permet de contrôler cette version allégée d'Android 5.

Les dernières versions de Qemu (`2.x`) permettent de virtualiser des machines ARM 64-bits. Cependant, aucun programme du projet officiel Qemu ne supporte la virtualisation de machines virtuelles pouvant exécuter le système d'exploitation (OS) Android. Google s'est chargé d'enrichir le projet Qemu pour proposer des programmes capables de virtualiser l'OS Android : c'est le projet [qemu-android](https://qemu-android.googlesource.com/).
La compilation des sources du projet `qemu-android` permet d'obtenir l'exécutable `qemu-system-aarch64` nécessaire à la virtualisation de versions d'Android ARM 64-bits.

Dans les sections suivantes, nous allons voir comment compiler Android 5 (produit `ranchu_arm64-eng` ou `mini_emulator_arm64-userdebug`) et le virtualiser dans une VM Qemu.

## Prérequis

* Capacités processeur et mémoire importantes (la compilation nécessite parfois jusqu’à 4 Go de RAM) ;
* Une configuration du bios autorisant la virtualisation ;
* Environ 100 Go d’espace disque libre (pour pouvoir compiler les deux produits) ;
* Une distribution d’un système d’exploitation Linux récente.

_Note : les manipulations décritent ci-dessous ont été réalisées sur un ordinateur disposant d’un processeur Intel Core i5 (2 cœurs cadencés à 1.8 Ghz supportant jusqu’à 4 threads par coeur), de 8 Go de mémoire RAM et de la distribution [Ubuntu 14.04.1 LTS](http://releases.ubuntu.com/14.04.1) 64-bits._

## Préparer l'environnement d'assemblage

Installer la machine virtuelle Java (JVM) Open JDK 7 (nécessaire pour compiler les dernières branches d'Android)

```bash
$ sudo apt-get install openjdk-7-jdk –y
```

Vérifier que Open JDK 7 est la JVM utilisée par défaut

```bash
$ sudo update-alternatives --config java
$ sudo update-alternatives --config javac
```

Installer des packages nécessaires pour la compilation

```bash
$ sudo apt-get install bison build-essential curl flex g++-multilib git gperf lib32z1 lib32z1-dev libglib2.0-dev libpixman-1-dev libswitch-perl libxml2-utils yasm zlib1g zlib1g-dev
```

Configurer une identité utilisateur sous Git

```bash
$ git config --global user.name "John Doe"
$ git config --global user.email "jd@android.com"
```

Récupérer l'utilitaire repo de Google et le charger dans le PATH courrant

```bash
$ mkdir ~/bin && PATH=~/bin:$PATH
$ curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
$ chmod a+x ~/bin/repo
```

## Récupérer les sources d'AOSP

Créer un répertoire pour le dépôt des sources d'AOSP

```bash
$ mkdir –p ~/dev/aosp && cd ~/dev/aosp
```

Initialiser le dépôt avec la branche `android-5.0.0_r7` d'Android

```bash
$ repo init -u https://android.googlesource.com/platform/manifest -b android-5.0.0_r7
```

Synchroniser le dépôt pour récupérer les sources (l'opération dure plusieurs heures à cause du volume important de données à télécharger)

```bash
$ repo sync
```

## Corriger les configurations d'assemblage

Les premières branches d'Android 5 souffrent de petits bugs nécessitant une modification manuelle des sources pour pouvoir compiler les produits `ranchu_arm64-eng` et `mini_emulator_arm64-userdebug` :

* __`ranchu_arm64-eng`__ : le script permettant de proposer ce produit à la compilation n'existe pas, il faut le rajouter ;
* __`mini_emulator_arm64-userdebug`__ : le choix de la configuration d'assemblage de ce produit indique que les fichiers compilés sont destinés à des plateformes ARM 32-bits (armv7), il faut modifier cela pour que les fichiers soit compilés pour plateformes ARM 64-bits (armv8).

Merci à [Vito Rallo](https://www.linkedin.com/in/vitorallo) qui a identifié ces bugs et qui propose une archive à décompresser dans le répertoire `device/generic` pour les corriger.

```bash
$ cd ~/dev
$ wget https://dl.dropboxusercontent.com/u/2930979/fixit.tar.gz
$ tar -xvf fixit.tar.gz -C aosp/device/generic
```

## Compiler les sources d'AOSP

Se placer dans le dossier principal des sources d'AOSP

```bash
$ cd ~/dev/aosp
```

Initialiser l'environnement de compilation dans le terminal

```bash
$ source build/envsetup.sh
```

Charger la configuration d'assemblage du produit `ranchu_arm64-eng` ou

`mini_emulator_arm64-userdebug`
```bash
$ lunch ranchu_arm64-eng
```

Lancer la compilation en fonction des capacités de l'ordinateur (pour un processeur dual core supportant 4 threads par cœur, 8 threads peuvent être utilisés pour la compilation)

```bash
$ make –j8
```

A la fin de la comilation, les images des systèmes de fichiers créées sont disponibles dans un sous répertoire du dossier "out"

* Pour `ranchu_arm64-eng` : out/target/product/generic_arm64/
* Pour `mini_emulator_arm64-userdebug` : out/target/product/mini-emulator-arm64/

## Virtualiser la version compilée d'Android avec Qemu

Pour virtualiser une version d'Android 5 ARM 64-bits, nous avons besoin du programme `qemu-system-aarch64` modifié par Google pour supporter l'exécution de la machine virtuelle "ranchu" (et du type de processeur "cortex-v57").

Initialiser le dépôt du projet `qemu-android`

```bash
$ cd ~/dev
$ git clone https://qemu-android.googlesource.com/qemu-android
$ cd qemu-android
```

Compiler l'exécutable `qemu-system-aarch64`

```bash
$ git submodule update --init dtc
$ git checkout origin/ranchu
$ ./configure --target-list=aarch64-softmmu
$ make -j8
```

Charger le programme compilée dans le PATH courrant (par lien symbolique)

```bash
$ ln -s ~/dev/qemu-android/aarch64-softmmu/qemu-system-aarch64 ~/bin/qemu-system-aarch64
```

Nous sommes maintenant prêt à virtualiser Android 5 pour plateformes ARM 64-bits dans une VM Qemu grâce à l'exécutable `qemu-system-aarch64`, nos images compilées de systèmes de fichiers et un kernel Qemu précompilé par Google.

Se positionner dans le répertoire d'un des produits compilés

```bash
$ cd ~/dev/aosp/out/product/generic_arm64
```

Démarrer une VM Qemu avec Android 5 Lollipop

```bash
qemu-system-aarch64 -machine type=ranchu -cpu cortex-a57 -m 2048 -serial mon:stdio -show-cursor -kernel ~/dev/aosp/prebuilts/qemu-kernel/arm64/kernel-qemu -initrd ramdisk.img -drive index=2,id=userdata,file=userdata.img -device virtio-blk-device,drive=userdata -device virtio-blk-device,drive=cache -drive index=1,id=cache,file=cache.img -device virtio-blk-device,drive=system -drive index=0,id=system,file=system.img -netdev user,id=mynet -device virtio-net-device,netdev=mynet
```

__Explication de la commande__ :

* `-machine type=ranchu` : on sélectionne le type de machine virtuelle "ranchu" adaptée à la virtualisation d'Android
* `-cpu cortex-a57` : on sélectionne le processeur virtuel pour plateformes ARM 64-bits
* `-m 2048` : on alloue 2048 Mo de mémoire à la VM
* `-serial mon:stdio` : pour pouvoir contrôler le terminal de la VM
* `-show-cursor` : pour afficher le pointeur de la souris dans la VM
* `-kernel` : on utilise le kernel Qemu pour plateformes ARM 64-bits précompilé par Google
* `-initrd` : on utilise le fichier compilé "ramdisk.img" comme disque RAM initial
* `-drive et -device` : on monte les images de systèmes de fichiers compilés
* `-netdev` : pour profiter de la connexion réseau

__Aperçu de `ranchu_arm64-eng`__ :

[![ranchu_arm64-eng preview](/assets/images/fig/ranchu_arm64-eng-tiny.png)](/assets/images/fig/ranchu_arm64-eng.png)

__Aperçu de ` mini_emulator_arm64-userdebug`__ :

[![mini_emulator_arm64-userdebug preview](/assets/images/fig/mini_emulator_arm64-userdebug-tiny.png)](/assets/images/fig/mini_emulator_arm64-userdebug.png)

## Références

* [AOSP documentation - Downloading and Building](https://source.android.com/source/building.html)
* [Ranchu where are you, kernel and emulator aarch64 (arm64)](http://restart-thinking.vitorallo.com/2014/11/ranchu-where-are-you-kernel-and.html)
* [Code source du fichier emulator-qemu.cpp](https://android.googlesource.com/platform/external/qemu/+/android-5.0.0_r7/android/qemu-launcher/emulator-qemu.cpp#694), lignes 694-761

