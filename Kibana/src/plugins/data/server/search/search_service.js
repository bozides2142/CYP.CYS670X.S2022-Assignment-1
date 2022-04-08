"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _operators = require("rxjs/operators");

var _aggs = require("./aggs");

var _routes = require("./routes");

var _es_search = require("./strategies/es_search");

var _register = require("./collectors/register");

var _usage = require("./collectors/usage");

var _saved_objects = require("../saved_objects");

var _search = require("../../common/search");

var _expressions = require("./expressions");

var _shard_delay = require("../../common/search/aggs/buckets/shard_delay");

var _shard_delay_fn = require("../../common/search/aggs/buckets/shard_delay_fn");

var _session = require("./session");

var _server = require("../../../kibana_utils/server");

var _bsearch = require("./routes/bsearch");

var _kibana_context = require("./expressions/kibana_context");

var _ese_search = require("./strategies/ese_search");

var _eql_search = require("./strategies/eql_search");

var _no_search_id_in_session = require("./errors/no_search_id_in_session");

var _services = require("./services");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SearchService {
  constructor(initializerContext, logger) {
    (0, _defineProperty2.default)(this, "aggsService", new _aggs.AggsService());
    (0, _defineProperty2.default)(this, "searchSourceService", new _search.SearchSourceService());
    (0, _defineProperty2.default)(this, "searchStrategies", {});
    (0, _defineProperty2.default)(this, "sessionService", void 0);
    (0, _defineProperty2.default)(this, "asScoped", void 0);
    (0, _defineProperty2.default)(this, "searchAsInternalUser", void 0);
    (0, _defineProperty2.default)(this, "registerSearchStrategy", (name, strategy) => {
      this.logger.debug(`Register strategy ${name}`);
      this.searchStrategies[name] = strategy;
    });
    (0, _defineProperty2.default)(this, "getSearchStrategy", (name = _search.ENHANCED_ES_SEARCH_STRATEGY) => {
      this.logger.debug(`Get strategy ${name}`);
      const strategy = this.searchStrategies[name];

      if (!strategy) {
        throw new _server.KbnServerError(`Search strategy ${name} not found`, 404);
      }

      return strategy;
    });
    (0, _defineProperty2.default)(this, "search", (deps, request, options) => {
      try {
        const strategy = this.getSearchStrategy(options.strategy);

        const getSearchRequest = async () => {
          if (!options.sessionId || !options.isRestore || request.id) {
            return request;
          } else {
            try {
              const id = await deps.searchSessionsClient.getId(request, options);
              this.logger.debug(`Found search session id for request ${id}`);
              return { ...request,
                id
              };
            } catch (e) {
              if (e instanceof _no_search_id_in_session.NoSearchIdInSessionError) {
                this.logger.debug('Ignoring missing search ID');
                return request;
              } else {
                throw e;
              }
            }
          }
        };

        const searchRequest$ = (0, _rxjs.from)(getSearchRequest());
        const search$ = searchRequest$.pipe((0, _operators.switchMap)(searchRequest => strategy.search(searchRequest, options, deps)), (0, _operators.withLatestFrom)(searchRequest$), (0, _operators.tap)(([response, requestWithId]) => {
          if (!options.sessionId || !response.id || options.isRestore && requestWithId.id) return; // intentionally swallow tracking error, as it shouldn't fail the search

          deps.searchSessionsClient.trackId(request, response.id, options).catch(trackErr => {
            this.logger.error(trackErr);
          });
        }), (0, _operators.map)(([response, requestWithId]) => {
          return { ...response,
            isRestored: !!requestWithId.id
          };
        }));
        return search$;
      } catch (e) {
        return (0, _rxjs.throwError)(e);
      }
    });
    (0, _defineProperty2.default)(this, "cancel", async (deps, id, options = {}) => {
      const strategy = this.getSearchStrategy(options.strategy);

      if (!strategy.cancel) {
        throw new _server.KbnServerError(`Search strategy ${options.strategy} doesn't support cancellations`, 400);
      }

      return strategy.cancel(id, options, deps);
    });
    (0, _defineProperty2.default)(this, "extend", async (deps, id, keepAlive, options = {}) => {
      const strategy = this.getSearchStrategy(options.strategy);

      if (!strategy.extend) {
        throw new _server.KbnServerError(`Search strategy ${options.strategy} does not support extend`, 400);
      }

      return strategy.extend(id, keepAlive, options, deps);
    });
    (0, _defineProperty2.default)(this, "cancelSessionSearches", async (deps, sessionId) => {
      const searchIdMapping = await deps.searchSessionsClient.getSearchIdMapping(sessionId);
      await Promise.allSettled(Array.from(searchIdMapping).map(([searchId, strategyName]) => {
        const searchOptions = {
          sessionId,
          strategy: strategyName,
          isStored: true
        };
        return this.cancel(deps, searchId, searchOptions);
      }));
    });
    (0, _defineProperty2.default)(this, "cancelSession", async (deps, sessionId) => {
      const response = await deps.searchSessionsClient.cancel(sessionId);
      await this.cancelSessionSearches(deps, sessionId);
      return response;
    });
    (0, _defineProperty2.default)(this, "deleteSession", async (deps, sessionId) => {
      await this.cancelSessionSearches(deps, sessionId);
      return deps.searchSessionsClient.delete(sessionId);
    });
    (0, _defineProperty2.default)(this, "extendSession", async (deps, sessionId, expires) => {
      const searchIdMapping = await deps.searchSessionsClient.getSearchIdMapping(sessionId);
      const keepAlive = `${(0, _moment.default)(expires).diff((0, _moment.default)())}ms`;
      const result = await Promise.allSettled(Array.from(searchIdMapping).map(([searchId, strategyName]) => {
        const searchOptions = {
          sessionId,
          strategy: strategyName,
          isStored: true
        };
        return this.extend(deps, searchId, keepAlive, searchOptions);
      }));

      if (result.some(extRes => extRes.status === 'rejected')) {
        throw new Error('Failed to extend the expiration of some searches');
      }

      return deps.searchSessionsClient.extend(sessionId, expires);
    });
    (0, _defineProperty2.default)(this, "asScopedProvider", core => {
      const {
        elasticsearch,
        savedObjects,
        uiSettings
      } = core;
      const getSessionAsScoped = this.sessionService.asScopedProvider(core);
      return request => {
        const savedObjectsClient = savedObjects.getScopedClient(request);
        const searchSessionsClient = getSessionAsScoped(request);
        const deps = {
          searchSessionsClient,
          savedObjectsClient,
          esClient: elasticsearch.client.asScoped(request),
          uiSettingsClient: new _services.CachedUiSettingsClient(uiSettings.asScopedToClient(savedObjectsClient)),
          request
        };
        return {
          search: (searchRequest, options = {}) => this.search(deps, searchRequest, options),
          cancel: this.cancel.bind(this, deps),
          extend: this.extend.bind(this, deps),
          saveSession: searchSessionsClient.save,
          getSession: searchSessionsClient.get,
          findSessions: searchSessionsClient.find,
          updateSession: searchSessionsClient.update,
          extendSession: this.extendSession.bind(this, deps),
          cancelSession: this.cancelSession.bind(this, deps),
          deleteSession: this.deleteSession.bind(this, deps)
        };
      };
    });
    this.initializerContext = initializerContext;
    this.logger = logger;
    this.sessionService = new _session.SearchSessionService();
  }

  setup(core, {
    bfetch,
    expressions,
    usageCollection
  }) {
    const usage = usageCollection ? (0, _usage.usageProvider)(core) : undefined;
    const router = core.http.createRouter();
    (0, _routes.registerSearchRoute)(router);
    core.http.registerRouteHandlerContext('search', async (context, request) => {
      return this.asScoped(request);
    });
    this.registerSearchStrategy(_es_search.ES_SEARCH_STRATEGY, (0, _es_search.esSearchStrategyProvider)(this.initializerContext.config.legacy.globalConfig$, this.logger, usage));
    this.registerSearchStrategy(_search.ENHANCED_ES_SEARCH_STRATEGY, (0, _ese_search.enhancedEsSearchStrategyProvider)(this.initializerContext.config.legacy.globalConfig$, this.logger, usage)); // We don't want to register this because we don't want the client to be able to access this
    // strategy, but we do want to expose it to other server-side plugins
    // see x-pack/plugins/security_solution/server/search_strategy/timeline/index.ts
    // for example use case

    this.searchAsInternalUser = (0, _ese_search.enhancedEsSearchStrategyProvider)(this.initializerContext.config.legacy.globalConfig$, this.logger, usage, true);
    this.registerSearchStrategy(_search.EQL_SEARCH_STRATEGY, (0, _eql_search.eqlSearchStrategyProvider)(this.logger));
    (0, _bsearch.registerBsearchRoute)(bfetch, request => this.asScoped(request), core.executionContext);
    core.savedObjects.registerType(_saved_objects.searchTelemetry);

    if (usageCollection) {
      (0, _register.registerUsageCollector)(usageCollection, core.savedObjects.getKibanaIndex());
    }

    expressions.registerFunction((0, _expressions.getEsaggs)({
      getStartServices: core.getStartServices
    }));
    expressions.registerFunction((0, _expressions.getEsdsl)({
      getStartServices: core.getStartServices
    }));
    expressions.registerFunction((0, _expressions.getEql)({
      getStartServices: core.getStartServices
    }));
    expressions.registerFunction(_search.cidrFunction);
    expressions.registerFunction(_search.dateRangeFunction);
    expressions.registerFunction(_search.extendedBoundsFunction);
    expressions.registerFunction(_search.geoBoundingBoxFunction);
    expressions.registerFunction(_search.geoPointFunction);
    expressions.registerFunction(_search.ipRangeFunction);
    expressions.registerFunction(_search.kibana);
    expressions.registerFunction(_search.luceneFunction);
    expressions.registerFunction(_search.kqlFunction);
    expressions.registerFunction(_search.kibanaTimerangeFunction);
    expressions.registerFunction((0, _kibana_context.getKibanaContext)({
      getStartServices: core.getStartServices
    }));
    expressions.registerFunction(_search.fieldFunction);
    expressions.registerFunction(_search.numericalRangeFunction);
    expressions.registerFunction(_search.rangeFunction);
    expressions.registerFunction(_search.kibanaFilterFunction);
    expressions.registerFunction(_search.existsFilterFunction);
    expressions.registerFunction(_search.queryFilterFunction);
    expressions.registerFunction(_search.rangeFilterFunction);
    expressions.registerFunction(_search.removeFilterFunction);
    expressions.registerFunction(_search.selectFilterFunction);
    expressions.registerFunction(_search.phraseFilterFunction);
    expressions.registerType(_search.kibanaContext);
    expressions.registerType(_search.esRawResponse);
    expressions.registerType(_search.eqlRawResponse);
    const aggs = this.aggsService.setup({
      registerFunction: expressions.registerFunction
    });
    this.initializerContext.config.create().pipe((0, _operators.first)()).toPromise().then(value => {
      if (value.search.aggs.shardDelay.enabled) {
        aggs.types.registerBucket(_shard_delay.SHARD_DELAY_AGG_NAME, _shard_delay.getShardDelayBucketAgg);
        expressions.registerFunction(_shard_delay_fn.aggShardDelay);
      }
    });
    return {
      __enhance: enhancements => {
        this.sessionService = enhancements.sessionService;
      },
      aggs,
      registerSearchStrategy: this.registerSearchStrategy,
      usage,
      searchSource: this.searchSourceService.setup()
    };
  }

  start(core, {
    fieldFormats,
    indexPatterns
  }) {
    const {
      elasticsearch,
      savedObjects,
      uiSettings
    } = core;
    this.asScoped = this.asScopedProvider(core);
    return {
      aggs: this.aggsService.start({
        fieldFormats,
        uiSettings,
        indexPatterns
      }),
      searchAsInternalUser: this.searchAsInternalUser,
      getSearchStrategy: this.getSearchStrategy,
      asScoped: this.asScoped,
      searchSource: {
        asScoped: async request => {
          const esClient = elasticsearch.client.asScoped(request);
          const savedObjectsClient = savedObjects.getScopedClient(request);
          const scopedIndexPatterns = await indexPatterns.indexPatternsServiceFactory(savedObjectsClient, esClient.asCurrentUser);
          const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient); // cache ui settings, only including items which are explicitly needed by SearchSource

          const uiSettingsCache = (0, _lodash.pick)(await uiSettingsClient.getAll(), _search.searchSourceRequiredUiSettings);
          const searchSourceDependencies = {
            getConfig: key => uiSettingsCache[key],
            search: this.asScoped(request).search,
            onResponse: (req, res) => res
          };
          return this.searchSourceService.start(scopedIndexPatterns, searchSourceDependencies);
        }
      }
    };
  }

  stop() {
    this.aggsService.stop();
  }

}

exports.SearchService = SearchService;