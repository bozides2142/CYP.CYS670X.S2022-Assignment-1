"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inspector_stats = require("./inspector_stats");

Object.keys(_inspector_stats).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inspector_stats[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inspector_stats[key];
    }
  });
});