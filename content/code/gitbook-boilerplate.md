---
author: "Steven Enten"
date: 2015-07-28
title: gitbook-boilerplate
description: GitBook Boilerplate.
github: enten/gitbook-boilerplate
topics:
  - project
tags:
  - gitbook
  - wiki
---

## Demo

* [Github Pages](http://enten.github.io/gitbook-boilerplate/)
* [Github Wiki](https://github.com/enten/gitbook-boilerplate/wiki)

## Installation

```shell
cd ~/code

git clone https://github.com/enten/gitbook-boilerplate.git awesome-project

cd awesome-project

rm -fr .git

vi package.json
# edit repository.url and repository.wiki

git remote add origin <url>

npm run build
# or
# npm run generate-gitbook && npm run generate-wiki

npm run deploy
# or
# npm run deploy-gitbook && npm run deploy-wiki
```
__Important__: Wiki must be created on Github
