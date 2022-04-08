"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url_service = require("./url_service");

Object.keys(_url_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _url_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _url_service[key];
    }
  });
});

var _locators = require("./locators");

Object.keys(_locators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _locators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locators[key];
    }
  });
});

var _short_urls = require("./short_urls");

Object.keys(_short_urls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _short_urls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _short_urls[key];
    }
  });
});