# Require Modifier (require-mod)

**RequireMod** is a **NodeJS-Package** which provides the functionality to modify the require-process of a nodejs-module instance.

## Installation

This module is installed via npm:

``` bash
$ npm install require-mod
```

## Usage

*Include the ProxyScope constructor:*

``` js
var ProxyScope = require('require-mod').ProxyScope;
```

*Create a new proxyScope:*

```js
var scope = new ProxyScope(module);
```

*Register a redirection:*

```js
scope.when(/^fs$/).redirect("fse");

var fse = require("fs"); // the "fse" module instance 
```
*After the regitration the require function of the current module has been modified and loads the registered module-proxy*

**The Module is also Typescript compatible, you can use the [mtype](https://github.com/alex20465/mytype):require-mod to install the definitions.**