"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update_fields = require("./update_fields");

Object.keys(_update_fields).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _update_fields[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _update_fields[key];
    }
  });
});