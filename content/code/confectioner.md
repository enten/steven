---
author: "Steven Enten"
date: 2015-06-01
title: confectioner
description: Simpliest configuration builder which used the environment.
github: enten/confectioner
topics:
  - project
tags:
  - javascript
  - node
  - config
aliases:
  - "/page/confectioner/"
badges:
  travis:
    alt: build status
    img: https://travis-ci.org/enten/confectioner.svg?branch=master
    url: https://travis-ci.org/enten/confectioner
  deps:
    alt: dependency
    img: https://david-dm.org/enten/confectioner/dev-status.svg
    url: https://david-dm.org/enten/confectioner
  devDeps:
    alt: dev dependency
    img: https://david-dm.org/enten/confectioner.svg
    url: https://david-dm.org/enten/confectioner#info=devDependencies
  license:
    alt: license
    img: http://img.shields.io/npm/l/confectioner.svg
    url: LICENSE.md
---


Simpliest configuration builder which used the environment.

## Installation

```shell
npm install confectioner --save
```

## Example

```javascript
// example.js

var confectioner = require('confectioner');

var config = confectioner({
    env: { envname: 'NODE_ENV', defaultValue: 'development' },
    hostname: { envname: 'MY_HOST', defaultValue: 'localhost' },
    port: { envname: 'MY_PORT', defaultValue: 1337, type: 'int' },
    baseuri: { envname: 'MY_BASEURI', defaultValue: '/myapp' }
});

console.log(config.getValuesMap());

// $ NODE_ENV=production MY_PORT=80 node --harmony example.js
// { env: 'production',
//   hostname: 'localhost',
//   port: '80',
//   baseuri: '/myapp' }

```

## API

[API documentation](https://cdn.rawgit.com/enten/confectioner/master/docs/confectioner/0.1.2/index.html)

## Tests

```
npm test
```

## Release History

* 0.1.0 Initial release

## Credits

* [Steven Enten](https://github.com/enten)

## License

[MIT](https://github.com/enten/confectioner/blob/master/LICENSE)
