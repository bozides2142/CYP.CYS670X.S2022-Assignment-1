"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _view_box = require("./view_box");

Object.keys(_view_box).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _view_box[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _view_box[key];
    }
  });
});

var _available_shapes = require("./available_shapes");

Object.keys(_available_shapes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _available_shapes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _available_shapes[key];
    }
  });
});

var _get_id = require("./get_id");

Object.keys(_get_id).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_id[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_id[key];
    }
  });
});