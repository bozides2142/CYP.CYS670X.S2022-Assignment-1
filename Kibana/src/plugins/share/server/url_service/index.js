"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerUrlServiceRoutes: true,
  registerUrlServiceSavedObjectType: true
};
Object.defineProperty(exports, "registerUrlServiceRoutes", {
  enumerable: true,
  get: function () {
    return _register_url_service_routes.registerUrlServiceRoutes;
  }
});
Object.defineProperty(exports, "registerUrlServiceSavedObjectType", {
  enumerable: true,
  get: function () {
    return _register_url_service_saved_object_type.registerUrlServiceSavedObjectType;
  }
});

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

var _short_urls = require("./short_urls");

Object.keys(_short_urls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _short_urls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _short_urls[key];
    }
  });
});

var _register_url_service_routes = require("./http/register_url_service_routes");

var _register_url_service_saved_object_type = require("./saved_objects/register_url_service_saved_object_type");