---
author: "Steven Enten"
date: 2015-07-05
title: ps-loyaltydiscount
description: PrestaShop Loyalty discount module.
github: enten/ps-loyaltydiscount
topics:
  - project
tags:
  - php
  - prestashop
aliases:
  - "/page/ps-loyaltydiscount/"
---

## Présentation

Module [PrestaShop 1.6](http://doc.prestashop.com/display/PS16/) permettant de gérer
des remises conditionnées par l'achat.

_Illustration : l'achat d'un produit A par un client lui fait bénéficier d'une remise sur un produit B._

## Installation

```shell
cd <PRESTASHOP_HOME>/modules
git clone https://github.com/enten/ps-loyaltydiscount loyaltydiscount
chown -R www-data loyaltydiscount
```

Se rendre dans le menu `Modules` de l'interface d'administration et
installer le nouveau module `Loyalty Discount`.

## Administration

L'installation du module ajoute le lien `Loyalty Discount` dans le menu `Price Rules`.

L'interface proposée permet de configurer simplement de nouvelles réductions de fidélité.

## Fonctionnement

### Tables de données

```bash
+-------------------------------+
|        loyaltydiscount        |
+-------------------------------+
| - id_loyaltydiscount : int    |
| - id_product_purchased : int  |
| - id_product_discounted : int |
| - rate : float                |
| - active : bit                |
| - date_add : datetime         |
| - date_upd : datetime         |
|                               |
| PK: id_loyaltydiscount        |
+-------------------------------+
    |  |
    |  |    +------------------------------------------+
    |  +--->|           loyaltydiscount_lang           |
    |       +------------------------------------------+
    |       | - id_loyaldiscount : int                 |
    |       | - id_shop : int                          |
    |       | - id_lang : int                          |
    |       | - name : varchar                         |
    |       | - description : text                     |
    |       |                                          |
    |       | PK: id_loyaltydiscount, id_shop, id_lang |
    |       +------------------------------------------+
    |
    |       +---------------------------------+
    +------>|       loyaltydiscount_shop      |
            +---------------------------------+
            | - id_loyaldiscount : int        |
            | - id_shop : int                 |
            |                                 |
            | PK: id_loyaltydiscount, id_shop |
            +---------------------------------+

```

### Surcharge de la classe [SpecificPrice](https://github.com/PrestaShop/PrestaShop/blob/1.6/classes/SpecificPrice.php)

La méthode [getSpecificPrice](https://github.com/PrestaShop/PrestaShop/blob/1.6/classes/SpecificPrice.php#L201)
de la classe [SpecificPrice](https://github.com/PrestaShop/PrestaShop/blob/1.6/classes/SpecificPrice.php) est
surchargée pour appliquer une éventuelle réduction conditionnée par l'achat d'un autre produit.

L'application d'une éventuelle réduction est réalisée sous plusieures conditions :
* Le module `loyaltydiscount` est activé ;
* Le produit a acheter fait l'objet d'une réduction de fidélité (il existe au moins une
  ligne dans la table `loyaltydiscount` où la colonne `id_product_discounted` est
  égale à celle du produit à acheter) ;
* La réduction de fidélité est activée (colonne `active` égale à `1`);
* L'acheteur a une commande validée avec le produit désigné par la colonne `id_product_purchased`.

### Attention

__Les réductions de fidélité se cumulent!__

Par exemple, si l'achat du produit A donne 5% de réduction sur le produit C et que l'achat
du produit B donne 10% de réduction sur le produit C, un acheteur peut cumuler 15% de réduction
(s'il a des commandes valides contenant l'achat des produits A et B).

Ce comportement est dû à l'incrémentation dans la fonction statique `applyPossibleDiscount`
de la classe `LoyaltyDiscount`.

```php
if ($res['n'] > 0)
	$rate += $row['rate'];
```

_Note: remplacer `+=` par `=` annule ce comportement._
