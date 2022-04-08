"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hosts = require("./hosts");

Object.keys(_hosts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hosts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hosts[key];
    }
  });
});

var _users = require("./users");

Object.keys(_users).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _users[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _users[key];
    }
  });
});