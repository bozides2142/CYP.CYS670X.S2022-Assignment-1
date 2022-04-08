"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _range = require("./range");

Object.keys(_range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _range[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _range[key];
    }
  });
});

var _vis_dimension = require("./vis_dimension");

Object.keys(_vis_dimension).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _vis_dimension[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _vis_dimension[key];
    }
  });
});