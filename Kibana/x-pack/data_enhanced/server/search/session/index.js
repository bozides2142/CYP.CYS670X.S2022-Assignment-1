"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _session_service = require("./session_service");

Object.keys(_session_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _session_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _session_service[key];
    }
  });
});