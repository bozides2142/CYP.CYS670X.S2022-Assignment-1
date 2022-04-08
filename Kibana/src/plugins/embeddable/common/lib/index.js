"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getExtractFunction", {
  enumerable: true,
  get: function () {
    return _extract.getExtractFunction;
  }
});
Object.defineProperty(exports, "getInjectFunction", {
  enumerable: true,
  get: function () {
    return _inject.getInjectFunction;
  }
});
Object.defineProperty(exports, "getMigrateFunction", {
  enumerable: true,
  get: function () {
    return _migrate.getMigrateFunction;
  }
});
Object.defineProperty(exports, "getTelemetryFunction", {
  enumerable: true,
  get: function () {
    return _telemetry.getTelemetryFunction;
  }
});
Object.defineProperty(exports, "isSavedObjectEmbeddableInput", {
  enumerable: true,
  get: function () {
    return _saved_object_embeddable.isSavedObjectEmbeddableInput;
  }
});

var _extract = require("./extract");

var _inject = require("./inject");

var _migrate = require("./migrate");

var _telemetry = require("./telemetry");

var _saved_object_embeddable = require("./saved_object_embeddable");