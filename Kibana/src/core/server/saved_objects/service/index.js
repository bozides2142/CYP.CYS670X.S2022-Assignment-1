"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SavedObjectsErrorHelpers: true,
  SavedObjectsClientProvider: true,
  SavedObjectsUtils: true
};
Object.defineProperty(exports, "SavedObjectsClientProvider", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientProvider;
  }
});
Object.defineProperty(exports, "SavedObjectsErrorHelpers", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsErrorHelpers;
  }
});
Object.defineProperty(exports, "SavedObjectsUtils", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsUtils;
  }
});

var _lib = require("./lib");

var _saved_objects_client = require("./saved_objects_client");

Object.keys(_saved_objects_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _saved_objects_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _saved_objects_client[key];
    }
  });
});