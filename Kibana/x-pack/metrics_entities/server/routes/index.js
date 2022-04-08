"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _delete_transforms = require("./delete_transforms");

Object.keys(_delete_transforms).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _delete_transforms[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _delete_transforms[key];
    }
  });
});

var _get_transforms = require("./get_transforms");

Object.keys(_get_transforms).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_transforms[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_transforms[key];
    }
  });
});

var _post_transforms = require("./post_transforms");

Object.keys(_post_transforms).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_transforms[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_transforms[key];
    }
  });
});