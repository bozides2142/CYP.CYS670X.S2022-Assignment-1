"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _function_wrapper = require("./function_wrapper");

Object.keys(_function_wrapper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _function_wrapper[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _function_wrapper[key];
    }
  });
});

var _test_styles = require("./test_styles");

Object.keys(_test_styles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _test_styles[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _test_styles[key];
    }
  });
});