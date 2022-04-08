"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get_metrics_entities_client = require("./get_metrics_entities_client");

Object.keys(_get_metrics_entities_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_metrics_entities_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_metrics_entities_client[key];
    }
  });
});