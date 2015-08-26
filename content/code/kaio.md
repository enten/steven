---
author: "Steven Enten"
date: 2015-06-14
title: kaio
description: A minimalist middleware to get started faster with Koa.
github: enten/kaio
topics:
  - project
tags:
  - javascript
  - node
  - koa
aliases:
  - "/page/kaio/"
badges:
  travis:
    alt: build status
    img: https://travis-ci.org/enten/kaio.svg?branch=master
    url: https://travis-ci.org/enten/kaio
  deps:
    alt: dependency
    img: https://david-dm.org/enten/kaio/dev-status.svg
    url: https://david-dm.org/enten/kaio
  devDeps:
    alt: dev dependency
    img: https://david-dm.org/enten/kaio.svg
    url: https://david-dm.org/enten/kaio#info=devDependencies
  license:
    alt: license
    img: http://img.shields.io/npm/l/kaio.svg
    url: LICENSE.md
---

A small library providing the R method to make work with paths and imports less involved.

## Installation

```bash
npm install kaio --save
```

## Example

```javascript
// example.js

var kaio = require('kaio');

var ko = kaio('root', __dirname, function() {

    this.setUri('/api');
    this.setPort(8080);
    this.setAliases({ctrl:'lib',pub:'views',css:'pub.styles'});

    this.use(mw1);
    this.bind('hello', mw2);
});

ko.listen();

function mw1() {
    return function *(next) {
        yield next;

        if (this.res.statusCode === 200)
            return;

        this.body = 'Styles folder: '+this.kaio.R('css');
    }
}

function *mw2(next) {
    yield next;

    this.body = 'Hello world! You are on '+this.kaio.uri('/hello');
}

// $ PORT=1333 DEBUG=* node --harmony example.js
//
// $ curl http://localhost:1333/api/hello
// Hello world! You are on /api/hello
//
// $ curl http://localhost:1333/api
// Styles folder: /home/steven/w/code/kaio/views/styles

```

## API

[API documentation](https://cdn.rawgit.com/enten/kaio/master/docs/kaio/0.5.0/index.html)

## Tests

```
make test
```
or

```
npm test
```

## Release History

* 0.5.0 Use confectioner module, add tests and upgrade public API
* 0.3.0 Replace custom resolver by [dotresolver](https://github.com/enten/dotresolver)
* 0.1.0 Initial release

## Credits

* [Leuville Objects](http://leuville.com)
* [Steven Enten](https://github.com/enten)

## License

[MIT](LICENSE.md)
