"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aliases = require("./aliases");

Object.keys(_aliases).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _aliases[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _aliases[key];
    }
  });
});

var _indices = require("./indices");

Object.keys(_indices).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _indices[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _indices[key];
    }
  });
});

var _mappings = require("./mappings");

Object.keys(_mappings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mappings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mappings[key];
    }
  });
});

var _templates = require("./templates");

Object.keys(_templates).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _templates[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _templates[key];
    }
  });
});

var _component_templates = require("./component_templates");

Object.keys(_component_templates).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _component_templates[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _component_templates[key];
    }
  });
});