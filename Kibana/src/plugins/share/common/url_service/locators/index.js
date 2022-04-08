"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useLocatorUrl: true
};
Object.defineProperty(exports, "useLocatorUrl", {
  enumerable: true,
  get: function () {
    return _use_locator_url.useLocatorUrl;
  }
});

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

var _locator = require("./locator");

Object.keys(_locator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _locator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locator[key];
    }
  });
});

var _locator_client = require("./locator_client");

Object.keys(_locator_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _locator_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locator_client[key];
    }
  });
});

var _redirect = require("./redirect");

Object.keys(_redirect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _redirect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _redirect[key];
    }
  });
});

var _use_locator_url = require("./use_locator_url");