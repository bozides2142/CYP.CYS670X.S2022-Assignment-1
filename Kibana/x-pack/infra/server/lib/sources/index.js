"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  infraSourceConfigurationSavedObjectType: true
};
Object.defineProperty(exports, "infraSourceConfigurationSavedObjectType", {
  enumerable: true,
  get: function () {
    return _saved_object_type.infraSourceConfigurationSavedObjectType;
  }
});

var _defaults = require("./defaults");

Object.keys(_defaults).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _defaults[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _defaults[key];
    }
  });
});

var _saved_object_type = require("./saved_object_type");

var _sources = require("./sources");

Object.keys(_sources).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _sources[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sources[key];
    }
  });
});

var _source_configuration = require("../../../common/source_configuration/source_configuration");

Object.keys(_source_configuration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _source_configuration[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _source_configuration[key];
    }
  });
});