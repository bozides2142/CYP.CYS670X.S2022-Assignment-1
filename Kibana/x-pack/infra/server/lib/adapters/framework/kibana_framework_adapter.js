"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaFramework = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class KibanaFramework {
  constructor(core, config, plugins) {
    (0, _defineProperty2.default)(this, "router", void 0);
    (0, _defineProperty2.default)(this, "plugins", void 0);
    (0, _defineProperty2.default)(this, "core", void 0);
    this.router = core.http.createRouter();
    this.plugins = plugins;
    this.core = core;
  }

  registerRoute(config, handler) {
    const defaultOptions = {
      tags: ['access:infra']
    };
    const routeConfig = {
      path: config.path,
      validate: config.validate,
      // Currently we have no use of custom options beyond tags, this can be extended
      // beyond defaultOptions if it's needed.
      options: defaultOptions
    };

    switch (config.method) {
      case 'get':
        this.router.get(routeConfig, handler);
        break;

      case 'post':
        this.router.post(routeConfig, handler);
        break;

      case 'delete':
        this.router.delete(routeConfig, handler);
        break;

      case 'put':
        this.router.put(routeConfig, handler);
        break;

      case 'patch':
        this.router.patch(routeConfig, handler);
        break;
    }
  }

  async callWithRequest(requestContext, endpoint, params) {
    const {
      elasticsearch,
      uiSettings
    } = requestContext.core;
    const includeFrozen = await uiSettings.client.get(_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);

    if (endpoint === 'msearch') {
      const maxConcurrentShardRequests = await uiSettings.client.get(_server.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS);

      if (maxConcurrentShardRequests > 0) {
        params = { ...params,
          max_concurrent_shard_requests: maxConcurrentShardRequests
        };
      }
    } // Only set the "ignore_throttled" value (to false) if the Kibana setting
    // for "search:includeFrozen" is true (i.e. don't ignore throttled indices, a triple negative!)
    // More information:
    // - https://github.com/elastic/kibana/issues/113197
    // - https://github.com/elastic/elasticsearch/pull/77479
    //
    // NOTE: these params only need to be spread onto the search and msearch calls below


    const frozenIndicesParams = {};

    if (includeFrozen) {
      frozenIndicesParams.ignore_throttled = false;
    }

    let apiResult;

    switch (endpoint) {
      case 'search':
        apiResult = elasticsearch.client.asCurrentUser.search({ ...params,
          ...frozenIndicesParams
        });
        break;

      case 'msearch':
        apiResult = elasticsearch.client.asCurrentUser.msearch({ ...params,
          ...frozenIndicesParams
        });
        break;

      case 'fieldCaps':
        apiResult = elasticsearch.client.asCurrentUser.fieldCaps({ ...params
        });
        break;

      case 'indices.existsAlias':
        apiResult = elasticsearch.client.asCurrentUser.indices.existsAlias({ ...params
        });
        break;

      case 'indices.getAlias':
        apiResult = elasticsearch.client.asCurrentUser.indices.getAlias({ ...params
        });
        break;

      case 'indices.get':
        apiResult = elasticsearch.client.asCurrentUser.indices.get({ ...params
        });
        break;

      case 'transport.request':
        apiResult = elasticsearch.client.asCurrentUser.transport.request({ ...params
        });
        break;

      case 'ml.getBuckets':
        apiResult = elasticsearch.client.asCurrentUser.ml.getBuckets({ ...params
        });
        break;
    }

    return apiResult ? (await apiResult).body : undefined;
  }

  async getIndexPatternsServiceWithRequestContext(requestContext) {
    return await this.createIndexPatternsService(requestContext.core.savedObjects.client, requestContext.core.elasticsearch.client.asCurrentUser);
  }

  async getIndexPatternsService(savedObjectsClient, elasticsearchClient) {
    return await this.createIndexPatternsService(savedObjectsClient, elasticsearchClient);
  }

  async createIndexPatternsService(savedObjectsClient, elasticsearchClient) {
    const [, startPlugins] = await this.core.getStartServices();
    return startPlugins.data.indexPatterns.indexPatternsServiceFactory(savedObjectsClient, elasticsearchClient);
  }

  getSpaceId(request) {
    const spacesPlugin = this.plugins.spaces;

    if (spacesPlugin && spacesPlugin.spacesService && typeof spacesPlugin.spacesService.getSpaceId === 'function') {
      return spacesPlugin.spacesService.getSpaceId(request);
    } else {
      return 'default';
    }
  }

  async makeTSVBRequest(requestContext, rawRequest, model, timerange, filters) {
    const {
      getVisData
    } = this.plugins.visTypeTimeseries;

    if (typeof getVisData !== 'function') {
      throw new Error('TSVB is not available');
    }

    const options = {
      timerange,
      panels: [model],
      filters
    };
    return getVisData(requestContext, rawRequest, options);
  }

}

exports.KibanaFramework = KibanaFramework;