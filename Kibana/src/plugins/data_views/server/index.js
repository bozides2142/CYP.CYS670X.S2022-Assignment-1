"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DATA_VIEW_PATH", {
  enumerable: true,
  get: function () {
    return _constants.DATA_VIEW_PATH;
  }
});
Object.defineProperty(exports, "DATA_VIEW_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.DATA_VIEW_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "IndexPatternsFetcher", {
  enumerable: true,
  get: function () {
    return _fetcher.IndexPatternsFetcher;
  }
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.DataViewsServerPlugin;
  }
});
Object.defineProperty(exports, "RUNTIME_FIELD_PATH", {
  enumerable: true,
  get: function () {
    return _constants.RUNTIME_FIELD_PATH;
  }
});
Object.defineProperty(exports, "RUNTIME_FIELD_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.RUNTIME_FIELD_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "SCRIPTED_FIELD_PATH", {
  enumerable: true,
  get: function () {
    return _constants.SCRIPTED_FIELD_PATH;
  }
});
Object.defineProperty(exports, "SCRIPTED_FIELD_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.SCRIPTED_FIELD_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "SERVICE_KEY", {
  enumerable: true,
  get: function () {
    return _constants.SERVICE_KEY;
  }
});
Object.defineProperty(exports, "SERVICE_KEY_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.SERVICE_KEY_LEGACY;
  }
});
Object.defineProperty(exports, "SERVICE_PATH", {
  enumerable: true,
  get: function () {
    return _constants.SERVICE_PATH;
  }
});
Object.defineProperty(exports, "SERVICE_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.SERVICE_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "SPECIFIC_DATA_VIEW_PATH", {
  enumerable: true,
  get: function () {
    return _constants.SPECIFIC_DATA_VIEW_PATH;
  }
});
Object.defineProperty(exports, "SPECIFIC_DATA_VIEW_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.SPECIFIC_DATA_VIEW_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "SPECIFIC_RUNTIME_FIELD_PATH", {
  enumerable: true,
  get: function () {
    return _constants.SPECIFIC_RUNTIME_FIELD_PATH;
  }
});
Object.defineProperty(exports, "SPECIFIC_RUNTIME_FIELD_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.SPECIFIC_RUNTIME_FIELD_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "SPECIFIC_SCRIPTED_FIELD_PATH", {
  enumerable: true,
  get: function () {
    return _constants.SPECIFIC_SCRIPTED_FIELD_PATH;
  }
});
Object.defineProperty(exports, "SPECIFIC_SCRIPTED_FIELD_PATH_LEGACY", {
  enumerable: true,
  get: function () {
    return _constants.SPECIFIC_SCRIPTED_FIELD_PATH_LEGACY;
  }
});
Object.defineProperty(exports, "findIndexPatternById", {
  enumerable: true,
  get: function () {
    return _utils.findIndexPatternById;
  }
});
Object.defineProperty(exports, "getCapabilitiesForRollupIndices", {
  enumerable: true,
  get: function () {
    return _fetcher.getCapabilitiesForRollupIndices;
  }
});
Object.defineProperty(exports, "getFieldByName", {
  enumerable: true,
  get: function () {
    return _utils.getFieldByName;
  }
});
Object.defineProperty(exports, "mergeCapabilitiesWithFields", {
  enumerable: true,
  get: function () {
    return _fetcher.mergeCapabilitiesWithFields;
  }
});
exports.plugin = plugin;
Object.defineProperty(exports, "shouldReadFieldFromDocValues", {
  enumerable: true,
  get: function () {
    return _fetcher.shouldReadFieldFromDocValues;
  }
});

var _utils = require("./utils");

var _fetcher = require("./fetcher");

var _plugin = require("./plugin");

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Static code to be shared externally
 * @public
 */
function plugin(initializerContext) {
  return new _plugin.DataViewsServerPlugin(initializerContext);
}