"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SavedObjectsImporter: true,
  SavedObjectsSerializer: true,
  SavedObjectsService: true,
  mergeSavedObjectMigrationMaps: true,
  savedObjectsConfig: true,
  savedObjectsMigrationConfig: true,
  SavedObjectTypeRegistry: true
};
Object.defineProperty(exports, "SavedObjectTypeRegistry", {
  enumerable: true,
  get: function () {
    return _saved_objects_type_registry.SavedObjectTypeRegistry;
  }
});
Object.defineProperty(exports, "SavedObjectsImporter", {
  enumerable: true,
  get: function () {
    return _import.SavedObjectsImporter;
  }
});
Object.defineProperty(exports, "SavedObjectsSerializer", {
  enumerable: true,
  get: function () {
    return _serialization.SavedObjectsSerializer;
  }
});
Object.defineProperty(exports, "SavedObjectsService", {
  enumerable: true,
  get: function () {
    return _saved_objects_service.SavedObjectsService;
  }
});
Object.defineProperty(exports, "mergeSavedObjectMigrationMaps", {
  enumerable: true,
  get: function () {
    return _migrations.mergeSavedObjectMigrationMaps;
  }
});
Object.defineProperty(exports, "savedObjectsConfig", {
  enumerable: true,
  get: function () {
    return _saved_objects_config.savedObjectsConfig;
  }
});
Object.defineProperty(exports, "savedObjectsMigrationConfig", {
  enumerable: true,
  get: function () {
    return _saved_objects_config.savedObjectsMigrationConfig;
  }
});

var _service = require("./service");

Object.keys(_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _service[key];
    }
  });
});

var _import = require("./import");

var _serialization = require("./serialization");

var _saved_objects_service = require("./saved_objects_service");

var _migrations = require("./migrations");

var _saved_objects_config = require("./saved_objects_config");

var _saved_objects_type_registry = require("./saved_objects_type_registry");