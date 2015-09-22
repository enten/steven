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

A minimalist middleware to get started faster with Koa.

## Installation

```bash
npm install kaio --save
```

## Example

### Requirements

```bash
mkdir kaio-app
cd kaio-app
npm install kaio koa-router
touch app.js
```

```javascript
// app.js

var kaio = require('kaio');
var router = require('koa-router');

kaio()
    .setRoot(__dirname)
    .setHost('127.0.0.1')
    .setPort(3000)
    .setUri('/api')
    .bind('/', BaseController)
    .bind('/books', BookController)
    .listen();

function *BaseController(next) {
    yield next;

    if (this.res.statusCode === 200)
        return;

    this.body = 'Hello world!';
}

function BookController() {
    var dataset = [
        { title: "The Fellowship of the Ring", author: "J. R. R. Tolkien", publication: "1954-07-29" },
        { title: "The Two Towers", author: "J. R. R. Tolkien", publication: "1954-11-11" },
        { title: "The Return of the King", author: "J. R. R. Tolkien", publication: "1955-10-20" }
    ];

    var list = function *(next) {
        var res = dataset;

        yield next;
        this.body = res;
    };

    var show = function *(next) {
        var title = decodeURI(this.params.title);
        var res = dataset.filter(function(x) {
            return title === x.title;
        }).shift();

        yield next;
        this.body = res;
    };

    return router()
        .get('/', list)
        .get('/:title', show)
        .middleware();
}
```

### Run the application

```bash
$ KO_PORT=1333 DEBUG=* node --harmony app.js
```

### Test it

```bash
# 3000 is the default port but it is overriden by KO_PORT (1333)

$ curl http://localhost:1333/api/
Not found

$ curl http://localhost:1333/api/
Hello world!

$ curl http://localhost:1333/api/books
[{"title":"The Fellowship of the Ring","author":"J. R. R. Tolkien","publication":"1954-07-29"},{"title":"The Two Towers","author":"J. R. R. Tolkien","publication":"1954-11-11"},{"title":"The Return of the King","author":"J. R. R. Tolkien","publication":"1955-10-20"}]

$ curl http://localhost:1333/api/books/The%2520Two%2520Towers
{"title":"The Two Towers","author":"J. R. R. Tolkien","publication":"1954-11-11"}
```

## API

[API documentation](https://cdn.rawgit.com/enten/kaio/master/docs/kaio/0.5.4/index.html)

## Tests

```
npm test
```

## Release History

* 0.5.0 Use confectioner module, add tests and upgrade public API
* 0.3.0 Replace custom resolver by [dotresolver](https://github.com/enten/dotresolver)
* 0.1.0 Initial release

## Credits

* [Steven Enten](https://github.com/enten)

## License

[MIT](https://github.com/enten/kaio/blob/master/LICENSE.md)
