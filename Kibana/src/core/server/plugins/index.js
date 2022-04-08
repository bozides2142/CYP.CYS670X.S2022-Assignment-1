"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PluginsService: true,
  config: true,
  isNewPlatformPlugin: true
};
Object.defineProperty(exports, "PluginsService", {
  enumerable: true,
  get: function () {
    return _plugins_service.PluginsService;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _plugins_config.config;
  }
});
Object.defineProperty(exports, "isNewPlatformPlugin", {
  enumerable: true,
  get: function () {
    return _discovery.isNewPlatformPlugin;
  }
});

var _plugins_service = require("./plugins_service");

var _plugins_config = require("./plugins_config");

var _discovery = require("./discovery");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});