---
author: "Steven Enten"
date: 2015-06-15
title: Android 5.1.1 x86_64
weight: 10
topics:
  - phd
tags:
  - android
  - lollipop
  - virtualization
  - qemu
  - embedded system
  - amd64
aliases:
  - "/page/android-5-1-1-x86-64/"
---


## Introduction

Le projet [android-x86](http://www.android-x86.org/) est un fork d'Android Open Source Project ([AOSP](http://source.android.com/)) permettant d'installer Android sur PC (la compilation de ses sources produit une image CD bootable). Ce fork fût longtemps la seule solution pour compiler simplement Android pour plateforme x86.

Avec [Android 5 Lollipop](http://www.android.com/versions/lollipop-5-0/), Google a ouvert la voix à la compilation d'[AOSP](http://source.android.com/) pour architectures 64-bits (ARM et x86). Cette possibilité ne rend pas le fork [android-x86](http://www.android-x86.org/) obsolète pour autant.
En effet la compilation de ces 2 projets ne produit pas le même résultat (une unique image iso pour android-x86 contre plusieurs images de systèmes de fichiers pour AOSP).

__Nous discuterons dans cette article uniquement d'AOSP et de la manière de compiler ses sources pour des architectures 64-bits.__

## Contexte

Peu de temps après notre expérience de [virtualisation d'Android 5 Lollipop avec Qemu](/page/virtualiser-android-5-lollipop-avec-qemu/), nous avons constaté que des images 64-bits précompilées d'Android étaient proposées en téléchargement par le [SDK Manager](http://developer.android.com/tools/help/sdk-manager.html).

!TODO Screen SDK images/fig/sdk-manager-images-64bits.png

Le tableau ci-dessous montre les différentes images 64-bits (par version d'Android) actuellement disponibles en téléchargement via le [SDK Manager](http://developer.android.com/tools/help/sdk-manager.html).

Codename | Version | API            | Images
---------|---------|----------------|------------------------------------------
M        | 5.1.1   | 22 MNC Preview | ARM 64 v8a System Image
M        | 5.1.1   | 22 MNC Preview | Intel x86 Atom_64 System Image
Lollipop | 5.1.1   | 22             | Intel x86 Atom_64 System Image
Lollipop | 5.1.1   | 22             | Goole APIs Intel x86 Atom-64 System Image
Lollipop | 5.0.1   | 21             | Intel x86 Atom_64 System Image
Lollipop | 5.0.1   | 21             | Goole APIs Intel x86 Atom-64 System Image

_Android M est semble-t-il la première version proposant une image ARM 64-bits précompilée (ce qui évite de prendre des heures à compiler soit-même AOSP pour ARM 64-bits)._

Nous sommes maintenant certains qu'il est possible de compiler AOSP pour des architectures x86_64, et ce depuis la version 5.0.1 d'Android.

## Expérience

__Dans cette section, nous allons compiler Android pour architecture x86_64 à partir des sources du projet officiel (AOSP).__ Les images résultantes de la compilation pourront être utilisées directement avec Qemu ou l'outil [emulator](http://developer.android.com/tools/help/emulator.html) du SDK. __Nous souhaitons également recompiler un kernel  Linux compatible__.

L'expérience semble simple. Toute fois, des problèmes de compatibilité de versions peuvent rendrent l'expérience moins évidente.

### Prérequis matériel

* Processeur amd64
* RAM &ge; 4 Go
* Espace disque &ge; 50 Go
* Système d'exploitation GNU/Linux récent

### Versions

Voici les différentes versions des composants utilisés pour compiler AOSP x86_64.

* Système d'exploitation : [Debian GNU/Linux 8 (jessie)](https://www.debian.org/releases/jessie/) 64-bits
* Java Development Kit : [Oracle JDK 7 (1.7.0_79-b15)](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)
* Android Open Source Project : [android-5.1.1_r4](https://android.googlesource.com/platform/manifest/+/android-5.1.1_r4)
* Toolchain : [x86_64-linux-android-4.8](https://android.googlesource.com/platform/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.8/+/android-5.1.1_r4) (branche android-5.1.1_r4)
* Kernel : [android-goldfish-3.10 commit 43dbfdb838](https://android.googlesource.com/kernel/goldfish/+/43dbfdb838603e823d75cec871f0c317e8c20fc9)

__WARNING__
Pour pouvoir compiler un kernel Linux compatible avec les images résultantes de la compilation d'AOSP branche `android-5.1.1_r4`, il est important d'utiliser la branche `android-goldfish-3.10` du projet `kernel/goldfish` à son état du 16 sept. 2014 (commit 43dbfdb838).

### Préparer l'environnement d'assemblage

#### JDK 7

Installer un JDK 7 (Java Open JDK 7 par exemple).

```bash
$ sudo apt-get install openjdk-7-jdk –y
```

Vérifier qu'il est bien utilisé par défaut.

```bash
$ sudo update-alternatives --config java
$ sudo update-alternatives --config javac
```

#### Packages requis

Installer les packages nécessaires pour compiler AOSP.

```bash
$ dpkg --add-architecture i386
$ sudo apt-get install bison g++-multilib git gperf libxml2-utils make zlib1g-dev:i386 zip
```

Configurer une identité utilisateur sous Git

```bash
$ git config --global user.name "John Doe"
$ git config --global user.email "jd@android.com"
```

Récupérer l'utilitaire repo de Google et le charger dans le `PATH` courrant.

```bash
$ mkdir ~/bin
$ curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
$ chmod a+x ~/bin/repo
$ PATH=~/bin:$PATH
```

<small>Référence : [Setting up a Linux build environment](http://source.android.com/source/initializing.html#setting-up-a-linux-build-environment)</small>

### Sources d'AOSP

Nous allons maintenant récupérer les sources officielles d'Android.

Pour cela il suffit de créer un répertoire, de l'initialiser avec l'outil `repo` et la branche souhaitée (`android-5.1.1_r4`) puis de lancer le téchargement des sources.

```bash
$ mkdir ~/aosp
$ cd ~/aosp
$ repo init -u https://android.googlesource.com/platform/manifest -b android-5.1.1_r4
$ repo sync
```

__Attention__ La synchronisation des sources d'AOSP dure plusieurs heures (à la faveur d'une connexion Internet grand public).

### Compiler AOSP

Une fois les sources d'AOSP récupérées, quelques lignes de commandes suffisent à charger la configuration d'assemblage `aosp_x86_64-eng` pour produire des images x86_64 d'Android.

```bash
$ cd ~/aosp
$ source build/envsetup.sh
$ lunch aosp_x86_64-eng
```

Avant de lancer la compilation, vérifions que le toolchain [x86_64-linux-android-4.8](https://android.googlesource.com/platform/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.8/+/android-5.1.1_r4) figure bien dans notre `PATH` (il a automatiquement été chargé dedans via `lunch`).

```bash
$ echo $PATH | grep 'x86_64-linux-android-4.8'

# Le contenu du PATH doit s'afficher à l'écran
# avec le tooclhain dans le répertoire :
# <aosp>/prebuilts/gcc/linux_x86/x86/x86_64-linuxandroid-4.8/bin
```

Maintenant que tout est prêt nous pouvons lancer la compilation via plusieurs threads en fonction des capacités de l'ordinateur.

```bash
$ make –j8
```

__Attention__ La compilation dure également plusieurs heures selon le nombre de threads utilisés pour compiler et les capacités de l'ordinateur :

* environs 3h30 pour un PC avec un processeur 4 coeurs, 8 Go  de RAM et 8 threads pour compiler ;
* environs 1h30 pour un PC avec un processeur 8 coeurs, 32 Go de RAM et 32 threads pour compiler.


__A la fin de la comilation, les images des systèmes de fichiers créées sont disponibles dans le répertoire `<aosp>/out/target/production/generic_x86_64`.__

### Compiler Goldfish

[Goldfish](https://android.googlesource.com/kernel/goldfish) est une version du kernel Linux adaptée pour Android. Lorsque l'on utilise l'[AVD Manager](http://developer.android.com/tools/help/avd-manager.html) pour créer des émulateurs, des images pré-compilées du kernel Goldfish sont utilisées.

Comme on aime les défis, nous allons le compiler nous-même. Les sources de Goldfish ne faisant pas parties d'AOSP (mais du projet Linux), elles sont stockées dans un dépôt à part entière.

Récupérer le dépôt du kernel Linux Goldfish.

```bash
$ git clone https://android.googlesource.com/kernel/goldfish.git
```

Une fois le dépôt récupéré, nous allons sélectionner la branche `android-goldfish-3.10` et ramener les sources à leur état du 16/09/2014.

```bash
$ cd goldfish
$ git checkout android-goldfish-3.10
$ git reset --hard 43dbfdb838603e823d75cec871f0c317e8c20fc9
# HEAD is now at 43dbfdb goldfish: Disable Seccomp for Intel builds.
```

Avant de compiler le kernel Goldfish, il faut vérifier que le toolchain 4.8 est toujours dans notre PATH. Si ce n'est pas le cas, rajoutez le.

```bash
PATH=$PATH:~/aosp/prebuilts/gcc/linux_x86/x86/x86_64-linuxandroid-4.8/bin
```

Il ne nous reste qu'à préparer la configuration d'assemblage et de lancer la compilation.

```bash
make x86_64_emu_defconfig
make -j8
```

__A la fin de la comilation, le kernel compilé est disponible dans le répertoire `<goldfish>/arch/x86/boot` sous le nom `bzImage`.__

### Tester

Nous disposons maintenant de tous les fichiers nécessaires pour lancer un émulateur Android x86_64 100% custom (recompilé par nos soins).

* Images de systèmes de fichiers issues de la compilation d'AOSP dans le répertoire `<aosp>/out/target/product/generic_x86_64/`
  * __cache.img__
  * __hardware-qemu.ini__
  * __ramdisk.img__
  * __system.img__
  * __userdata-qemu.img__
* Kernel Linux adapté à Android dans le répertoire : `<goldfish>/arch/x86/boot/`
  * __bzImage__
