"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _case = require("./case");

Object.keys(_case).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _case[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _case[key];
    }
  });
});