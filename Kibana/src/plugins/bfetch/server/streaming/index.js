"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create_ndjson_stream = require("./create_ndjson_stream");

Object.keys(_create_ndjson_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _create_ndjson_stream[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_ndjson_stream[key];
    }
  });
});

var _create_compressed_stream = require("./create_compressed_stream");

Object.keys(_create_compressed_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _create_compressed_stream[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_compressed_stream[key];
    }
  });
});

var _create_stream = require("./create_stream");

Object.keys(_create_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _create_stream[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_stream[key];
    }
  });
});