"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceMapsRouteRepository = exports.sourceMapRt = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _ioTsUtils = require("@kbn/io-ts-utils");

var _source_maps = require("../fleet/source_maps");

var _get_internal_saved_objects_client = require("../../lib/helpers/get_internal_saved_objects_client");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _string_from_buffer_rt = require("../../utils/string_from_buffer_rt");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const sourceMapRt = t.intersection([t.type({
  version: t.number,
  sources: t.array(t.string),
  mappings: t.string
}), t.partial({
  names: t.array(t.string),
  file: t.string,
  sourceRoot: t.string,
  sourcesContent: t.array(t.string)
})]);
exports.sourceMapRt = sourceMapRt;
const listSourceMapRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/sourcemaps',
  options: {
    tags: ['access:apm']
  },

  async handler({
    plugins
  }) {
    try {
      var _plugins$fleet;

      const fleetPluginStart = await ((_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.start());

      if (fleetPluginStart) {
        const artifacts = await (0, _source_maps.listArtifacts)({
          fleetPluginStart
        });
        return {
          artifacts
        };
      }
    } catch (e) {
      throw _boom.default.internal('Something went wrong while fetching artifacts source maps', e);
    }
  }

});
const uploadSourceMapRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /api/apm/sourcemaps',
  options: {
    tags: ['access:apm', 'access:apm_write'],
    body: {
      accepts: ['multipart/form-data']
    }
  },
  params: t.type({
    body: t.type({
      service_name: t.string,
      service_version: t.string,
      bundle_filepath: t.string,
      sourcemap: t.union([t.string, _string_from_buffer_rt.stringFromBufferRt]).pipe(_ioTsUtils.jsonRt).pipe(sourceMapRt)
    })
  }),
  handler: async ({
    params,
    plugins,
    core
  }) => {
    var _plugins$fleet2;

    const {
      service_name: serviceName,
      service_version: serviceVersion,
      bundle_filepath: bundleFilepath,
      sourcemap: sourceMap
    } = params.body;
    const cleanedBundleFilepath = (0, _source_maps.getCleanedBundleFilePath)(bundleFilepath);
    const fleetPluginStart = await ((_plugins$fleet2 = plugins.fleet) === null || _plugins$fleet2 === void 0 ? void 0 : _plugins$fleet2.start());
    const coreStart = await core.start();
    const esClient = coreStart.elasticsearch.client.asInternalUser;
    const savedObjectsClient = await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core.setup);

    try {
      if (fleetPluginStart) {
        const artifact = await (0, _source_maps.createApmArtifact)({
          fleetPluginStart,
          apmArtifactBody: {
            serviceName,
            serviceVersion,
            bundleFilepath: cleanedBundleFilepath,
            sourceMap
          }
        });
        await (0, _source_maps.updateSourceMapsOnFleetPolicies)({
          core,
          fleetPluginStart,
          savedObjectsClient: savedObjectsClient,
          elasticsearchClient: esClient
        });
        return artifact;
      }
    } catch (e) {
      throw _boom.default.internal('Something went wrong while creating a new source map', e);
    }
  }
});
const deleteSourceMapRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'DELETE /api/apm/sourcemaps/{id}',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    path: t.type({
      id: t.string
    })
  }),
  handler: async ({
    params,
    plugins,
    core
  }) => {
    var _plugins$fleet3;

    const fleetPluginStart = await ((_plugins$fleet3 = plugins.fleet) === null || _plugins$fleet3 === void 0 ? void 0 : _plugins$fleet3.start());
    const {
      id
    } = params.path;
    const coreStart = await core.start();
    const esClient = coreStart.elasticsearch.client.asInternalUser;
    const savedObjectsClient = await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core.setup);

    try {
      if (fleetPluginStart) {
        await (0, _source_maps.deleteApmArtifact)({
          id,
          fleetPluginStart
        });
        await (0, _source_maps.updateSourceMapsOnFleetPolicies)({
          core,
          fleetPluginStart,
          savedObjectsClient: savedObjectsClient,
          elasticsearchClient: esClient
        });
      }
    } catch (e) {
      throw _boom.default.internal(`Something went wrong while deleting source map. id: ${id}`, e);
    }
  }
});
const sourceMapsRouteRepository = { ...listSourceMapRoute,
  ...uploadSourceMapRoute,
  ...deleteSourceMapRoute
};
exports.sourceMapsRouteRepository = sourceMapsRouteRepository;