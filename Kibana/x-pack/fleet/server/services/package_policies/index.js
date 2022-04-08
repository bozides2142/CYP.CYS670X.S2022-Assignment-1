"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _package_policy_name_helper = require("./package_policy_name_helper");

Object.keys(_package_policy_name_helper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _package_policy_name_helper[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _package_policy_name_helper[key];
    }
  });
});