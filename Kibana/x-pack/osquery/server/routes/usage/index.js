"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recorder = require("./recorder");

Object.keys(_recorder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _recorder[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _recorder[key];
    }
  });
});