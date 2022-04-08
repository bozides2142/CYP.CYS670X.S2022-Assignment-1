"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "APP_WRAPPER_CLASS", {
  enumerable: true,
  get: function () {
    return _utils.APP_WRAPPER_CLASS;
  }
});
Object.defineProperty(exports, "CspConfig", {
  enumerable: true,
  get: function () {
    return _csp.CspConfig;
  }
});
Object.defineProperty(exports, "DEFAULT_APP_CATEGORIES", {
  enumerable: true,
  get: function () {
    return _utils.DEFAULT_APP_CATEGORIES;
  }
});
Object.defineProperty(exports, "ElasticsearchConfig", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchConfig;
  }
});
Object.defineProperty(exports, "EventLoopDelaysMonitor", {
  enumerable: true,
  get: function () {
    return _metrics.EventLoopDelaysMonitor;
  }
});
Object.defineProperty(exports, "KibanaRequest", {
  enumerable: true,
  get: function () {
    return _http.KibanaRequest;
  }
});
Object.defineProperty(exports, "PluginType", {
  enumerable: true,
  get: function () {
    return _plugins.PluginType;
  }
});
Object.defineProperty(exports, "SavedObjectTypeRegistry", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectTypeRegistry;
  }
});
Object.defineProperty(exports, "SavedObjectsClient", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClient;
  }
});
Object.defineProperty(exports, "SavedObjectsErrorHelpers", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsErrorHelpers;
  }
});
Object.defineProperty(exports, "SavedObjectsSerializer", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsSerializer;
  }
});
Object.defineProperty(exports, "SavedObjectsUtils", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsUtils;
  }
});
Object.defineProperty(exports, "ServiceStatusLevels", {
  enumerable: true,
  get: function () {
    return _status.ServiceStatusLevels;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function () {
    return _bootstrap.bootstrap;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "kibanaResponseFactory", {
  enumerable: true,
  get: function () {
    return _http.kibanaResponseFactory;
  }
});
Object.defineProperty(exports, "mergeSavedObjectMigrationMaps", {
  enumerable: true,
  get: function () {
    return _saved_objects.mergeSavedObjectMigrationMaps;
  }
});
Object.defineProperty(exports, "pollEsNodesVersion", {
  enumerable: true,
  get: function () {
    return _elasticsearch.pollEsNodesVersion;
  }
});
Object.defineProperty(exports, "validBodyOutput", {
  enumerable: true,
  get: function () {
    return _http.validBodyOutput;
  }
});

var _elasticsearch = require("./elasticsearch");

var _logging = require("./logging");

var _bootstrap = require("./bootstrap");

var _csp = require("./csp");

var _http = require("./http");

var _plugins = require("./plugins");

var _saved_objects = require("./saved_objects");

var _metrics = require("./metrics");

var _utils = require("../utils");

var _status = require("./status");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The Kibana Core APIs for server-side plugins.
 *
 * A plugin requires a `kibana.json` file at it's root directory that follows
 * {@link PluginManifest | the manfiest schema} to define static plugin
 * information required to load the plugin.
 *
 * A plugin's `server/index` file must contain a named import, `plugin`, that
 * implements {@link PluginInitializer} which returns an object that implements
 * {@link Plugin}.
 *
 * The plugin integrates with the core system via lifecycle events: `setup`,
 * `start`, and `stop`. In each lifecycle method, the plugin will receive the
 * corresponding core services available (either {@link CoreSetup} or
 * {@link CoreStart}) and any interfaces returned by dependency plugins'
 * lifecycle method. Anything returned by the plugin's lifecycle method will be
 * exposed to downstream dependencies when their corresponding lifecycle methods
 * are invoked.
 *
 * @packageDocumentation
 */

/**
 * Config schemas for the platform services.
 *
 * @alpha
 */
const config = {
  elasticsearch: {
    schema: _elasticsearch.configSchema
  },
  logging: {
    appenders: _logging.appendersSchema
  }
};
exports.config = config;