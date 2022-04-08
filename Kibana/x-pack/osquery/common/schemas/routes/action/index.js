"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create_action_request_body_schema = require("./create_action_request_body_schema");

Object.keys(_create_action_request_body_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _create_action_request_body_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_action_request_body_schema[key];
    }
  });
});