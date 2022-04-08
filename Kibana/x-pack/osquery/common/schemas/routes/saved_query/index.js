"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create_saved_query_request_schema = require("./create_saved_query_request_schema");

Object.keys(_create_saved_query_request_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _create_saved_query_request_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_saved_query_request_schema[key];
    }
  });
});