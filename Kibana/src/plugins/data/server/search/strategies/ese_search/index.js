"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  enhancedEsSearchStrategyProvider: true
};
Object.defineProperty(exports, "enhancedEsSearchStrategyProvider", {
  enumerable: true,
  get: function () {
    return _ese_search_strategy.enhancedEsSearchStrategyProvider;
  }
});

var _ese_search_strategy = require("./ese_search_strategy");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});