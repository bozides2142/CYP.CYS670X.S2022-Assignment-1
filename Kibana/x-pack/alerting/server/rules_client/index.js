"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rules_client = require("./rules_client");

Object.keys(_rules_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rules_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rules_client[key];
    }
  });
});