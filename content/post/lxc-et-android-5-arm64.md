---
author: "Steven Enten"
date: 2014-12-30
title: LXC et Android 5 ARM64
weight: 10
categories:
  - phd
tags:
  - container engine
  - isolation
  - android
  - arm64
aliases:
  - "/page/lxc-et-android-5/"
---

## Introduction

[LXC](https://linuxcontainers.org/lxc/introduction/) (contraction de _Linux Containers_) est un logiciel permettant de gérer des conteneurs logiciels. Conrètement, LXC peut isole l'exécution de plusieurs environnements Linux sur une même machine. L'isolation est réalisée grâce à l'exploitation des modules de gestion de namespaces du Kernel Linux.

Depuis la publication d'un [article en décembre 2013 sur le blog d'un des principaux développeurs de LXC (Stéphane Graber)](https://www.stgraber.org/2013/12/23/lxc-1-0-some-more-advanced-container-usage/), la communauté d'utilisateurs de conteneurs logiciels est consciente de la possibilité d'utiliser LXC sur un appareil Android. Stéphane Graber en a fait la [démonstration à l'occasion de l'évènement Linux Plumbers Conference de septembre 2013](https://www.youtube.com/watch?v=XZWy2g9YY30).

Les gestionnaires de conteneurs boulversent progressivement les domaines de l'informatique liés à la virtualisation. Le possible usage de LXC sur Android offre des perspectives nouvelles pour l'industrie et la recherche. Un développeur a d'ailleurs démontré (durant l'évènement Droidconf de décembre 2013) le potentiel de LXC en étant capable de [changer à chaud la version d'Android avec une simple application](https://www.youtube.com/watch?v=UpIFByNLM5U).

LXC n'étant pas une application du Google Play Store, son installation sur Android n'est pas évidente. L'utilisateur qui souhaite se lancer sur cette voie est rapidement confronté à des problèmes systèmes. __Dans la sections suivantes, nous décrivons les principaux problèmes que nous avons rencontrés pour installer et utiliser LXC sur Android 5 Lollipop__.

## Contexte

Avant d'aborder les problèmes d'installation de LXC sur Android que nous avons rencontrés, il est important que le lecteur ait connaissance de notre plateforme de test.

### Matériel

Nous avons souhaité réaliser ces tests sur un appareil disposant d'une architecture ARM 64-bits (ARMv8). Ce type d'appareil n'étant pas encore démocratisé, nous avons fait le choix d'utiliser une machine virtuelle Qemu. 

Pour lancer la machine virtuelle de notre appareil fictif, nous utilisons une version dérivée de Qemu. Cette version est issue de la compilation de la branche [ranchu](https://qemu-android.googlesource.com/qemu-android/+/ranchu) du projet [qemu-android](https://qemu-android.googlesource.com/qemu-android/) d'AOSP. L'avantage de cette version est son support de machines virtuelles à l'architecture ARM 64-bits.

Une fois lancé, notre appareil virtuel dispose d'un CPU cortex-a57 et de 4Go de mémoire vive. Il dispose également de 16Go de mémoire disque (en modifiant la taille de l'image `data.img`, voir section suivante).

### Système d'exploitation

Notre choix d'architecture ARM 64-bits nous impose l'utilisation de la version 5 (Lollipop) d'Android car c'est la seule version supportant ce type d'architecture.

Pour obtenir les images des systèmes de fichiers d'Android 5 utilisées pour lancer notre appareil virtuel (`ramdisk.img`, `system.img`, `userdata.img` et `cache.img`), nous avons utilisé la configuration de compilation `ranchu` de la branche [android-5.0.0_r7](https://android.googlesource.com/platform/manifest/+/refs/heads/android-5.0.0_r7) des sources du projet [Android Open Source Project](https://source.android.com/).

Pour obtenir un espace disque important dans notre appareil virtuel, nous avons redimensionné l'image du système de fichiers utilisateur (`userdata.img`).

```bash
# Augmenter la taille de l'image userdata.img d'environs 16Go
dd if=/dev/zero bs=1M count=16000 >> userdata.img
e2fsck -f userdata.img
resize2fs userdata.img
e2fsck -f userdata.img
```

### Kernel Linux

Nous utilisons une version dérivée du noyau Linux. Cette version correspond à la version 3.10 du noyau officiel. Ce noyau est précompilé dans les sources d'AOSP et est disponible dans le répertoire `prebuilts/qemu-kernel/arm64` sous le fichier `kernel-qemu`.

Un projet spécifique est consacré à ce noyau dans le dépôt des sources d'AOSP : [kernel/goldfish](https://android.googlesource.com/kernel/goldfish/). Pour recompiler ce noyau adapté à Qemu, nous avons utilisé la branche [android-goldfish-3.10](https://android.googlesource.com/kernel/goldfish/+/android-goldfish-3.10) du projet.

_Note : `goldfish` désigne les modules des périphériques virtuels nécessaires pour virtualiser Android avec Qemu. Nous vous recommandons la lecture de [GOLDFISH-VIRTUAL-HARDWARE.TXT](https://android.googlesource.com/platform/external/qemu.git/+/master/docs/GOLDFISH-VIRTUAL-HARDWARE.TXT) pour en savoir plus._

### Configuration réseau

Pour que notre appareil fictif ait sa propre adresse IP, nous avons configuré une interface réseau virtuelle connectée à la machine host (utilisée pour les tests) via une interface bridge.

Ainsi, lorsque l'appareil virtuel Android est démarré, il suffit de lancer la directive `dhcpcd eth0` pour demander au DHCP du réseau l'attribution d'une adresse IP (grâce à l'interface bridge, le DHCP traite la requête de notre périphérique virtuel comme celle de n'importe quelle machine physique du réseau).

## Problèmes fondamentaux

### Système Unix restreint

#### Problème

Android est un système d'exploitation Linux destiné à piloter des systèmes embarqués. La philosophie d'Android a conduit ses développeurs à intégrer les outils systèmes uniquement nécessaire à son fonctionnement.

Cette optimisation du système fait d'Android une __distribution Linux "restrictive" dans le sens où les utilisateurs__, familiarisés à l'utilisation d'une des distribution Linux majeures (Debian par exemple), __ne retrouvent pas les outils nécessaires à leurs usages habituels__ (comme un gestionnaire de paquets).

#### Solution

Pour pouvoir utiliser certains utilitaires UNIX absents d'Android, il est d'usage d'__installer une version ARM de [busybox](http://busybox.net/about.html)__ (en copiant son binaire dans le répertoire `/system/bin`). 

Les utilitaires fournis par `busybox` ne suffisent pas à combler les lacunes d'Android. Néanmoins ils nous ont permis d'__installer et de configurer un rootfs Archlinux__. Ainsi, nous disposons maintenant d'une distribution Archlinux embarquée dans notre appareil Android afin d'étendre son fonctionnement.

On peut alors installer facilement LXC grâce à `pacman`, le gestionnaire de paquets d'Archlinux.

### Echec des connexions HTTPS

#### Problème

Une fois le rootfs Archlinux installé et configuré, nous avons souhaité mettre à jour les paquets et installer le paquet LXC. Au cours de cette manipulation, nous avons constaté l'__impossibilité d'établir une connexion via le protocole `https`__.

#### Solution

Ce problème est lié à la date du système. En effet, la date de notre appareil virtuel une fois lancé est assignée au 1/1/1970. Pour corriger ce problème, __il suffit de mettre à jour la date du système__ (avec l'utilitaire `rdate` de `busybox` par exemple).
```bash
busybox rdate -s ntp.unice.fr
```

### Modules du Kernel manquants

#### Problème

Après avoir installé LXC avec `pacman`, et avant de lancer notre premier test de conteneur, nous avons utilisé le script [lxc-checkconfig](https://github.com/lxc/lxc/blob/master/src/lxc/lxc-checkconfig.in). Ce script lit la configuration du kernel utilisée pour sa compilation. Il vérifit la présence de certaines constantes nécessaires à la compilation des modules requis par LXC. Avec ce script, nous avons pu constater l'__absence de modules (du kernel précompilé) nécessaires au bon fonctionnement de LXC__.

#### Solution

Nous avons __recompilé le kernel__ à partir des sources du projet `kernel/goldfish`. Avant de recompiler le kernel, nous avons __modifié la configuration de compilation `ranchu_defconfig`__ (fichier uniquement présent dans le répertoire `arch/arm64/configs/` de la branche `android-goldfish-3.10`) pour y ajouter les constantes suivantes :

```bash
CONFIG_IPC_NS=y
CONFIG_PID_NS=y
CONFIG_PID_IN_CONTEXTIDR=y
CONFIG_NET_NS=y
CONFIG_DEVPTS_MULTIPLE_INSTANCES=y
CONFIG_CGROUP_DEVICE=y
CONFIG_CGROUP_CPUACCT=y
CONFIG_CPUSETS=y
CONFIG_VETH=y
CONFIG_UTS_NS=y
CONFIG_CGROUP_FREEZER=y
CONFIG_CGROUP_PERF=y
CONFIG_RESOURCE_COUNTERS=y
CONFIG_MEMCG=y
CONFIG_MEMCG_SWAP=y
#CONFIG_USER_NS=y
CONFIG_BTRFS_FS=y
CONFIG_EXT4_FS_POSIX_ACL=y
CONFIG_EXT4_FS_SECURITY=y
CONFIG_MACVLAN=y
CONFIG_NETFILTER_XT_MATCH_ADDRTYPE=y
CONFIG_VLAN_8021Q=y
CONFIG_BLK_CGROUP=y
CONFIG_CFQ_GROUP_IOSCHED=y
```

__Important__ : La constante `CONFIG_USER_NS` est volontairement désactivée à cause d'un problème de compilation (lié à la version des sources de ce module).

### Impossibilité de lancer des binaires non-PIE

#### Problème

Au cours de nos tests, nous avons rencontré une sécurité système propre à Android 5 (branche `android-5.0.0_r7`). Ce test de sécurité __bloque l'exécution de fichiers binaires non-[PIE](http://en.wikipedia.org/wiki/Position-independent_code)__. Pour qu'un exécutable soit PIE, il faut le spécifier à sa compilation.

#### Solution

Pour outre passer cette sécurité, un [patch a été développé par un membre du forum XDA-Developers](http://forum.xda-developers.com/google-nexus-5/development/fix-bypassing-pie-security-check-t2797731). Cette solution semble fonctionner selon certains utilisateurs. Nous avons préférés __recompiler le code source en désactivant cette sécurité__. Pour cela nous avons commenter le bloc de code ci-dessous dans le fichier `bionic/linker/linker.cpp`

```cpp
2181    //if (elf_hdr->e_type != ET_DYN) {
2182    //    __libc_format_fd(2, "error: only position independent executables (PIE) are supported.\n");
2183    //    exit(EXIT_FAILURE);
2184    //}
```

### Cgroups non-montés

#### Problème

Lorsque non consultons le fichier `/proc/cgroups`, nous constatons la présence plusieurs cgroups. Or lorsque nous consultons les périphériques montés (avec la commande `mount`), nous avons constaté que seul le cgroup `memory` était monté. __La majorité des cgroups ne sont donc pas montés__.

#### Solution

Il faut __monter les cgroups manquants__. Pour cela nous nous sommes basés sur les [scripts de tianon](https://github.com/tianon/cgroupfs-mount/) à la différence que nous montons les cgroups dans la racine de notre rootfs Archlinux (étant donné que nous utilisons LXC à travers ce rootfs).

```bash
for i in $(busybox awk '!/^#/ { if ($4 == 1) print $1 }' /proc/cgroups); do
    if ! grep -q " $ROOTFS/$i " /proc/mounts; then
        mkdir -p $ROOTFS/$i
        /system/bin/busybox mount -n -t cgroup -o $i cgroup $ROOTFS/$i
    fi
done 
```

__Important__ : si l'arborescence des cgroups n'est pas montée dans le rootfs, il ne sera pas possible de lancer plus d'un conteneur à la fois.

### Echec d'utilisation des cgroups dans un rootfs

#### Problème

Bien que les cgroups soient montés, ceux-ci sont __inutilisables à cause d'un problème d'autorisation d'écriture__ semble-t-il. N'ayant aucune expérience en matière d'utilisation des modules de gestion des namespaces, nous ne savions pas comment corriger ce problème. Néanmoins, nous étions persuadés que le problème était propre à Android (et probablement au fait qu'on utilise LXC à travers un rootfs).

#### Solution

Pour tenter de résoudre ce problème, nous avons analysés les [fichiers utilisés par S. Graber](https://web.archive.org/web/20140723085319/https://qa.linuxcontainers.org/master/current/android-armel/lxc-android.tar.gz) dans sa démonstration de décembre 2013. Nous avons constaté qu'il utilisait un programme appellé `sbin` pour remonter recursivement la racine du téléphone `/` en mode privé.

__En remontant la racine de notre appareil virtuel en mode privé (avec le programme `sbin`) et en démarrant le programme [cgmanager](https://linuxcontainers.org/fr/cgmanager/introduction/) dans notre rootfs Archlinux, nous avons pu lancer notre premier conteneur LXC sur Android.__

_Note : le programme `sbin` récupérée dans l'archive de S. Graber est non-PIE. Il est inutilisable si le programme `linker` d'Android 5 n'est pas patché (comme expliqué précédemment)._

### Conteneur sans accès réseau

#### Problème

Par défaut, la configuration réseau d'un conteneur est vide. Sans configuration réseau, __le conteneur ne dispose pas d'interface pour être connecté en réseau (pas d'adresse IP)__. La configuration réseau "vide" est indiquée dans le fichier de configuration d'un conteneur par la ligne suivante :

```
# Network configuration
lxc.network.type = empty
```

#### Solution

Parmis les différents types de configuration réseau supportés par LXC, __le type `macvlan` et son mode `bridge` nous ont permis d'obtenir une IP propre pour nos conteneurs__. Nous vous recommandons la lecture de cet [excellent article du blog containerops.org](http://containerops.org/2013/11/19/lxc-networking/) pour en savoir plus sur les différents types de configuration réseau de LXC.

```
# Network configuration
lxc.network.type = macvlan
lxc.network.macvlan.mode = bridge
lxc.network.flags = up
lxc.network.link = eth0
```

__Attention__ ! Souvenez-vous que l'utilisation d'un type de configuration réseau dépend des modules du kernel et du matériel sur lequel il est installé (par exemple l'option `CONFIG_MACVLAN=y` utilisée pour recompiler le kernel est nécessaire pour utiliser le type de configuration `macvlan` de LXC).

## Démonstration

_Cliquer sur l'image pour voir la vidéo._

[![LXC on Android - Test 1](http://img.youtube.com/vi/1rW_lFyVY_w/0.jpg)](http://www.youtube.com/watch?v=1rW_lFyVY_w)

## Conclusion

L'installation de LXC sur Android requiert différentes maniputions du système. Afin de capitaliser les bonnes pratiques pour utiliser LXC sur Android, nous avons développé le script [alfred](https://gist.github.com/enten/63cedaca9bf019feb71a). Cet outil est utilisé dans notre vidéo de démonstration.

