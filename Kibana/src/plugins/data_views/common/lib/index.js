"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  DataViewMissingIndices: true,
  getTitle: true,
  validateDataView: true
};
Object.defineProperty(exports, "DataViewMissingIndices", {
  enumerable: true,
  get: function () {
    return _errors.DataViewMissingIndices;
  }
});
Object.defineProperty(exports, "getTitle", {
  enumerable: true,
  get: function () {
    return _get_title.getTitle;
  }
});
Object.defineProperty(exports, "validateDataView", {
  enumerable: true,
  get: function () {
    return _validate_data_view.validateDataView;
  }
});

var _errors = require("./errors");

var _get_title = require("./get_title");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _validate_data_view = require("./validate_data_view");