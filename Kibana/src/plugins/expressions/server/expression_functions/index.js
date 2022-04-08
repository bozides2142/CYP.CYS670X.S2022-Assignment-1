"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ui_setting = require("./ui_setting");

Object.keys(_ui_setting).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ui_setting[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui_setting[key];
    }
  });
});