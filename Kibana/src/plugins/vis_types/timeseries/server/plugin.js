"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisTypeTimeseriesPlugin = void 0;

var _operators = require("rxjs/operators");

var _get_vis_data = require("./lib/get_vis_data");

var _vis = require("./routes/vis");

var _fields = require("./routes/fields");

var _ui_settings = require("./ui_settings");

var _search_strategies = require("./lib/search_strategies");

var _usage_collector = require("./usage_collector");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class VisTypeTimeseriesPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
    this.initializerContext = initializerContext;
  }

  setup(core, plugins) {
    const logger = this.initializerContext.logger.get('visTypeTimeseries');
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    const config$ = this.initializerContext.config.create(); // Global config contains things like the ES shard timeout

    const globalConfig$ = this.initializerContext.config.legacy.globalConfig$;
    const router = core.http.createRouter();
    const searchStrategyRegistry = new _search_strategies.SearchStrategyRegistry();
    const framework = {
      core,
      plugins,
      config$,
      globalConfig$,
      logger,
      searchStrategyRegistry,
      getEsShardTimeout: () => globalConfig$.pipe((0, _operators.first)(), (0, _operators.map)(config => config.elasticsearch.shardTimeout.asMilliseconds())).toPromise(),
      getIndexPatternsService: async requestContext => {
        const [, {
          data
        }] = await core.getStartServices();
        return await data.indexPatterns.indexPatternsServiceFactory(requestContext.core.savedObjects.client, requestContext.core.elasticsearch.client.asCurrentUser);
      },
      getFieldFormatsService: async uiSettings => {
        const [, {
          data
        }] = await core.getStartServices();
        return data.fieldFormats.fieldFormatServiceFactory(uiSettings);
      }
    };
    searchStrategyRegistry.addStrategy(new _search_strategies.DefaultSearchStrategy());
    searchStrategyRegistry.addStrategy(new _search_strategies.RollupSearchStrategy());
    (0, _vis.visDataRoutes)(router, framework);
    (0, _fields.fieldsRoutes)(router, framework);

    if (plugins.usageCollection) {
      (0, _usage_collector.registerTimeseriesUsageCollector)(plugins.usageCollection, plugins.home);
    }

    return {
      getVisData: async (requestContext, fakeRequest, options) => {
        return await (0, _get_vis_data.getVisData)(requestContext, { ...fakeRequest,
          body: options
        }, framework);
      }
    };
  }

  start(core) {}

}

exports.VisTypeTimeseriesPlugin = VisTypeTimeseriesPlugin;