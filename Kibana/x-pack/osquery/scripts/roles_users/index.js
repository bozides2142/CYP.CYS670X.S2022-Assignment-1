"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _t1_analyst = require("./t1_analyst");

Object.keys(_t1_analyst).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _t1_analyst[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _t1_analyst[key];
    }
  });
});