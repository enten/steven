---
author: "Steven Enten"
date: 2015-04-13
title: dotresolver
description: A small library providing the R method to make work with paths and imports less involved.
github: enten/dotresolver
topics:
  - project
tags:
  - javascript
  - node
  - resolving
aliases:
  - "/page/dotresolver/"
badges:
  travis:
    alt: build status
    img: https://travis-ci.org/enten/dotresolver.svg?branch=master
    url: https://travis-ci.org/enten/dotresolver
  deps:
    alt: dependency
    img: https://david-dm.org/enten/dotresolver/dev-status.svg
    url: https://david-dm.org/enten/dotresolver
  devDeps:
    alt: dev dependency
    img: https://david-dm.org/enten/dotresolver.svg
    url: https://david-dm.org/enten/dotresolver#info=devDependencies
  license:
    alt: license
    img: http://img.shields.io/npm/l/dotresolver.svg
    url: LICENSE.md
---

## Installation

```shell
npm install dotresolver --save
```

## Basic usage

```javascript
var R = require('dotresolver')('.');

// displays the root path .
console.log(R());

// displays the path ./src/controllers/hello.js
console.log(R('src.controllers', 'hello.js'));

// imports the module hello.js
var hello = R('src.controllers', 'hello.js', true);
```

## Builder usage

```javascript
var Resolver = require('dotresolver');

// builds resolver with some aliases
var R = Resolver.Builder(__dirname)
            .set('ctrl', 'src.controllers')
            .set('css', 'public.styles')
            .get();

// displays the path /home/steven/myapp/public/src/styles/base.css
console.log(R('css', 'base.css'));

// imports the module hello.js
var hello = R('ctrl', 'hello.js', true);
```

## API

[API documentation](https://cdn.rawgit.com/enten/dotresolver/master/docs/dotresolver/0.3.0/index.html)

## Tests

```
npm test
```

## Release History

* 0.2.8 Fix issue [#3](https://github.com/enten/dotresolver/issues/3)
* 0.2.7 Add helper to create URI resolver
* 0.2.6 Fix issue [#2](https://github.com/enten/dotresolver/issues/2)
* 0.2.5 Support object of aliases with setAlias()
* 0.2.3 Improve the path building
* 0.2.0 Remove real root path features
* 0.1.0 Initial release

## Credits

* [Steven Enten](https://github.com/enten)

## License

[MIT](https://github.com/enten/dotresolver/blob/master/LICENSE)
