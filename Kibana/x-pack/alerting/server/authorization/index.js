"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alerting_authorization = require("./alerting_authorization");

Object.keys(_alerting_authorization).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _alerting_authorization[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerting_authorization[key];
    }
  });
});

var _alerting_authorization_kuery = require("./alerting_authorization_kuery");

Object.keys(_alerting_authorization_kuery).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _alerting_authorization_kuery[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerting_authorization_kuery[key];
    }
  });
});