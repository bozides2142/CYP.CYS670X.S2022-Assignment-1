"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multilayer_timeaxis = require("./multilayer_timeaxis");

Object.keys(_multilayer_timeaxis).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _multilayer_timeaxis[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _multilayer_timeaxis[key];
    }
  });
});