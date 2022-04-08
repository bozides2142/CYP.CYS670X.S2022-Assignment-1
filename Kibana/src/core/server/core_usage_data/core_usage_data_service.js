"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreUsageDataService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _config = require("@kbn/config");

var _is_configured = require("./is_configured");

var _core_usage_stats = require("./core_usage_stats");

var _object_types = require("../saved_objects/object_types");

var _constants = require("./constants");

var _core_usage_stats_client = require("./core_usage_stats_client");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const kibanaIndex = '.kibana';
/**
 * Because users can configure their Saved Object to any arbitrary index name,
 * we need to map customized index names back to a "standard" index name.
 *
 * e.g. If a user configures `kibana.index: .my_saved_objects` we want to the
 * collected data to be grouped under `.kibana` not ".my_saved_objects".
 *
 * This is rather brittle, but the option to configure index names might go
 * away completely anyway (see #60053).
 *
 * @param index The index name configured for this SO type
 * @param kibanaConfigIndex The default kibana index as configured by the user
 * with `kibana.index`
 */

const kibanaOrTaskManagerIndex = (index, kibanaConfigIndex) => {
  return index === kibanaConfigIndex ? '.kibana' : '.kibana_task_manager';
};

class CoreUsageDataService {
  // Initially set to noop
  constructor(core) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "elasticsearchConfig", void 0);
    (0, _defineProperty2.default)(this, "configService", void 0);
    (0, _defineProperty2.default)(this, "httpConfig", void 0);
    (0, _defineProperty2.default)(this, "loggingConfig", void 0);
    (0, _defineProperty2.default)(this, "soConfig", void 0);
    (0, _defineProperty2.default)(this, "stop$", void 0);
    (0, _defineProperty2.default)(this, "opsMetrics", void 0);
    (0, _defineProperty2.default)(this, "coreUsageStatsClient", void 0);
    (0, _defineProperty2.default)(this, "deprecatedConfigPaths", {
      set: [],
      unset: []
    });
    (0, _defineProperty2.default)(this, "incrementUsageCounter", () => {});
    this.logger = core.logger.get('core-usage-stats-service');
    this.configService = core.configService;
    this.stop$ = new _rxjs.Subject();
  }

  async getSavedObjectUsageData(savedObjects, elasticsearch) {
    const [indices, legacyUrlAliases] = await Promise.all([this.getSavedObjectIndicesUsageData(savedObjects, elasticsearch), this.getSavedObjectAliasUsageData(elasticsearch)]);
    return {
      indices,
      legacyUrlAliases
    };
  }

  async getSavedObjectIndicesUsageData(savedObjects, elasticsearch) {
    return Promise.all(Array.from(savedObjects.getTypeRegistry().getAllTypes().reduce((acc, type) => {
      var _type$indexPattern;

      const index = (_type$indexPattern = type.indexPattern) !== null && _type$indexPattern !== void 0 ? _type$indexPattern : kibanaIndex;
      return acc.add(index);
    }, new Set()).values()).map(async index => {
      // The _cat/indices API returns the _index_ and doesn't return a way
      // to map back from the index to the alias. So we have to make an API
      // call for every alias. The document count is the lucene document count.
      const catIndicesResults = await elasticsearch.client.asInternalUser.cat.indices({
        index,
        format: 'JSON',
        bytes: 'b'
      }).then(({
        body
      }) => {
        const stats = body[0];
        return {
          alias: kibanaOrTaskManagerIndex(index, kibanaIndex),
          docsCount: stats['docs.count'] ? parseInt(stats['docs.count'], 10) : 0,
          docsDeleted: stats['docs.deleted'] ? parseInt(stats['docs.deleted'], 10) : 0,
          storeSizeBytes: stats['store.size'] ? parseInt(stats['store.size'], 10) : 0,
          primaryStoreSizeBytes: stats['pri.store.size'] ? parseInt(stats['pri.store.size'], 10) : 0
        };
      }); // We use the GET <index>/_count API to get the number of saved objects
      // to monitor if the cluster will hit the scalling limit of saved object migrations

      const savedObjectsCounts = await elasticsearch.client.asInternalUser.count({
        index
      }).then(({
        body
      }) => {
        return {
          savedObjectsDocsCount: body.count ? body.count : 0
        };
      });
      this.logger.debug(`Lucene documents count ${catIndicesResults.docsCount} from index ${catIndicesResults.alias}`);
      this.logger.debug(`Saved objects documents count ${savedObjectsCounts.savedObjectsDocsCount} from index ${catIndicesResults.alias}`);
      return { ...catIndicesResults,
        ...savedObjectsCounts
      };
    }));
  }

  async getSavedObjectAliasUsageData(elasticsearch) {
    // Note: this agg can be changed to use `savedObjectsRepository.find` in the future after `filters` is supported.
    // See src/core/server/saved_objects/service/lib/aggregations/aggs_types/bucket_aggs.ts for supported aggregations.
    const {
      body: resp
    } = await elasticsearch.client.asInternalUser.search({
      index: kibanaIndex,
      body: {
        track_total_hits: true,
        query: {
          match: {
            type: _object_types.LEGACY_URL_ALIAS_TYPE
          }
        },
        aggs: {
          aliases: {
            filters: {
              filters: {
                disabled: {
                  term: {
                    [`${_object_types.LEGACY_URL_ALIAS_TYPE}.disabled`]: true
                  }
                },
                active: {
                  bool: {
                    must_not: {
                      term: {
                        [`${_object_types.LEGACY_URL_ALIAS_TYPE}.disabled`]: true
                      }
                    },
                    must: {
                      range: {
                        [`${_object_types.LEGACY_URL_ALIAS_TYPE}.resolveCounter`]: {
                          gte: 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        size: 0
      }
    });
    const {
      hits,
      aggregations
    } = resp;
    const totalCount = hits.total.value;
    const aggregate = aggregations.aliases;
    const buckets = aggregate.buckets;
    const disabledCount = buckets.disabled.doc_count;
    const activeCount = buckets.active.doc_count;
    const inactiveCount = totalCount - disabledCount - activeCount;
    return {
      totalCount,
      disabledCount,
      activeCount,
      inactiveCount
    };
  }

  async getCoreUsageData(savedObjects, elasticsearch) {
    var _http$securityRespons, _http$securityRespons2, _http$securityRespons3, _http$securityRespons4, _this$loggingConfig$a, _this$loggingConfig, _this$loggingConfig$l, _this$loggingConfig2;

    if (this.elasticsearchConfig == null || this.httpConfig == null || this.soConfig == null || this.opsMetrics == null) {
      throw new Error('Unable to read config values. Ensure that setup() has completed.');
    }

    if (!this.coreUsageStatsClient) {
      throw new Error('Core usage stats client is not initialized. Ensure that setup() has completed.');
    }

    const es = this.elasticsearchConfig;
    const soUsageData = await this.getSavedObjectUsageData(savedObjects, elasticsearch);
    const coreUsageStatsData = await this.coreUsageStatsClient.getUsageStats();
    const http = this.httpConfig;
    return {
      config: {
        elasticsearch: {
          apiVersion: es.apiVersion,
          sniffOnStart: es.sniffOnStart,
          sniffIntervalMs: es.sniffInterval !== false ? es.sniffInterval.asMilliseconds() : -1,
          sniffOnConnectionFault: es.sniffOnConnectionFault,
          numberOfHostsConfigured: Array.isArray(es.hosts) ? es.hosts.length : _is_configured.isConfigured.string(es.hosts) ? 1 : 0,
          customHeadersConfigured: _is_configured.isConfigured.record(es.customHeaders),
          healthCheckDelayMs: es.healthCheck.delay.asMilliseconds(),
          logQueries: es.logQueries,
          pingTimeoutMs: es.pingTimeout.asMilliseconds(),
          requestHeadersWhitelistConfigured: _is_configured.isConfigured.stringOrArray(es.requestHeadersWhitelist, ['authorization']),
          requestTimeoutMs: es.requestTimeout.asMilliseconds(),
          shardTimeoutMs: es.shardTimeout.asMilliseconds(),
          ssl: {
            alwaysPresentCertificate: es.ssl.alwaysPresentCertificate,
            certificateAuthoritiesConfigured: _is_configured.isConfigured.stringOrArray(es.ssl.certificateAuthorities),
            certificateConfigured: _is_configured.isConfigured.string(es.ssl.certificate),
            keyConfigured: _is_configured.isConfigured.string(es.ssl.key),
            verificationMode: es.ssl.verificationMode,
            truststoreConfigured: _is_configured.isConfigured.record(es.ssl.truststore),
            keystoreConfigured: _is_configured.isConfigured.record(es.ssl.keystore)
          },
          principal: getEsPrincipalUsage(es)
        },
        http: {
          basePathConfigured: _is_configured.isConfigured.string(http.basePath),
          maxPayloadInBytes: http.maxPayload.getValueInBytes(),
          rewriteBasePath: http.rewriteBasePath,
          keepaliveTimeout: http.keepaliveTimeout,
          socketTimeout: http.socketTimeout,
          compression: {
            enabled: http.compression.enabled,
            referrerWhitelistConfigured: _is_configured.isConfigured.array(http.compression.referrerWhitelist)
          },
          xsrf: {
            disableProtection: http.xsrf.disableProtection,
            allowlistConfigured: _is_configured.isConfigured.array(http.xsrf.allowlist)
          },
          requestId: {
            allowFromAnyIp: http.requestId.allowFromAnyIp,
            ipAllowlistConfigured: _is_configured.isConfigured.array(http.requestId.ipAllowlist)
          },
          ssl: {
            certificateAuthoritiesConfigured: _is_configured.isConfigured.stringOrArray(http.ssl.certificateAuthorities),
            certificateConfigured: _is_configured.isConfigured.string(http.ssl.certificate),
            cipherSuites: http.ssl.cipherSuites,
            keyConfigured: _is_configured.isConfigured.string(http.ssl.key),
            redirectHttpFromPortConfigured: _is_configured.isConfigured.number(http.ssl.redirectHttpFromPort),
            supportedProtocols: http.ssl.supportedProtocols,
            clientAuthentication: http.ssl.clientAuthentication,
            keystoreConfigured: _is_configured.isConfigured.record(http.ssl.keystore),
            truststoreConfigured: _is_configured.isConfigured.record(http.ssl.truststore)
          },
          securityResponseHeaders: {
            // ES does not index `null` and it cannot be searched, so we coalesce these to string values instead
            strictTransportSecurity: (_http$securityRespons = http.securityResponseHeaders.strictTransportSecurity) !== null && _http$securityRespons !== void 0 ? _http$securityRespons : 'NULL',
            xContentTypeOptions: (_http$securityRespons2 = http.securityResponseHeaders.xContentTypeOptions) !== null && _http$securityRespons2 !== void 0 ? _http$securityRespons2 : 'NULL',
            referrerPolicy: (_http$securityRespons3 = http.securityResponseHeaders.referrerPolicy) !== null && _http$securityRespons3 !== void 0 ? _http$securityRespons3 : 'NULL',
            permissionsPolicyConfigured: _is_configured.isConfigured.string((_http$securityRespons4 = http.securityResponseHeaders.permissionsPolicy) !== null && _http$securityRespons4 !== void 0 ? _http$securityRespons4 : undefined),
            disableEmbedding: http.securityResponseHeaders.disableEmbedding
          }
        },
        logging: {
          appendersTypesUsed: Array.from(Array.from((_this$loggingConfig$a = (_this$loggingConfig = this.loggingConfig) === null || _this$loggingConfig === void 0 ? void 0 : _this$loggingConfig.appenders.values()) !== null && _this$loggingConfig$a !== void 0 ? _this$loggingConfig$a : []).reduce((acc, a) => acc.add(a.type), new Set()).values()),
          loggersConfiguredCount: (_this$loggingConfig$l = (_this$loggingConfig2 = this.loggingConfig) === null || _this$loggingConfig2 === void 0 ? void 0 : _this$loggingConfig2.loggers.length) !== null && _this$loggingConfig$l !== void 0 ? _this$loggingConfig$l : 0
        },
        savedObjects: {
          customIndex: false,
          maxImportPayloadBytes: this.soConfig.maxImportPayloadBytes.getValueInBytes(),
          maxImportExportSize: this.soConfig.maxImportExportSize
        },
        deprecatedKeys: this.deprecatedConfigPaths
      },
      environment: {
        memory: {
          heapSizeLimit: this.opsMetrics.process.memory.heap.size_limit,
          heapTotalBytes: this.opsMetrics.process.memory.heap.total_in_bytes,
          heapUsedBytes: this.opsMetrics.process.memory.heap.used_in_bytes
        }
      },
      services: {
        savedObjects: soUsageData
      },
      ...coreUsageStatsData
    };
  }

  getMarkedAsSafe(exposedConfigsToUsage, usedPath, pluginId) {
    if (pluginId) {
      const exposeDetails = exposedConfigsToUsage.get(pluginId) || {};
      const exposeKeyDetails = Object.keys(exposeDetails).find(exposeKey => {
        const fullPath = `${pluginId}.${exposeKey}`;
        return (0, _config.hasConfigPathIntersection)(usedPath, fullPath);
      });

      if (exposeKeyDetails) {
        const explicitlyMarkedAsSafe = exposeDetails[exposeKeyDetails];

        if (typeof explicitlyMarkedAsSafe === 'boolean') {
          return {
            explicitlyMarked: true,
            isSafe: explicitlyMarkedAsSafe
          };
        }
      }
    }

    return {
      explicitlyMarked: false,
      isSafe: false
    };
  }

  async getNonDefaultKibanaConfigs(exposedConfigsToUsage) {
    const config = await this.configService.getConfig$().pipe((0, _operators.first)()).toPromise();
    const nonDefaultConfigs = config.toRaw();
    const usedPaths = await this.configService.getUsedPaths();
    const exposedConfigsKeys = [...exposedConfigsToUsage.keys()];
    return usedPaths.reduce((acc, usedPath) => {
      const rawConfigValue = (0, _lodash.get)(nonDefaultConfigs, usedPath);
      const pluginId = exposedConfigsKeys.find(exposedConfigsKey => usedPath === exposedConfigsKey || usedPath.startsWith(`${exposedConfigsKey}.`));
      const {
        explicitlyMarked,
        isSafe
      } = this.getMarkedAsSafe(exposedConfigsToUsage, usedPath, pluginId); // explicitly marked as safe

      if (explicitlyMarked && isSafe) {
        // report array of objects as redacted even if explicitly marked as safe.
        // TS typings prevent explicitly marking arrays of objects as safe
        // this makes sure to report redacted even if TS was bypassed.
        if (Array.isArray(rawConfigValue) && rawConfigValue.some(item => typeof item === 'object')) {
          acc[usedPath] = '[redacted]';
        } else {
          acc[usedPath] = rawConfigValue;
        }
      } // explicitly marked as unsafe


      if (explicitlyMarked && !isSafe) {
        acc[usedPath] = '[redacted]';
      }
      /**
       * not all types of values may contain sensitive values.
       * Report boolean and number configs if not explicitly marked as unsafe.
       */


      if (!explicitlyMarked) {
        switch (typeof rawConfigValue) {
          case 'number':
          case 'boolean':
            acc[usedPath] = rawConfigValue;
            break;

          case 'undefined':
            acc[usedPath] = 'undefined';
            break;

          case 'object':
            {
              // non-array object types are already handled
              if (Array.isArray(rawConfigValue)) {
                if (rawConfigValue.every(item => typeof item === 'number' || typeof item === 'boolean')) {
                  acc[usedPath] = rawConfigValue;
                  break;
                }
              }
            }

          default:
            {
              acc[usedPath] = '[redacted]';
            }
        }
      }

      return acc;
    }, {});
  }

  setup({
    http,
    metrics,
    savedObjectsStartPromise,
    changedDeprecatedConfigPath$
  }) {
    metrics.getOpsMetrics$().pipe((0, _operators.takeUntil)(this.stop$)).subscribe(opsMetrics => this.opsMetrics = opsMetrics);
    this.configService.atPath('elasticsearch').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.elasticsearchConfig = config;
    });
    this.configService.atPath('server').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.httpConfig = config;
    });
    this.configService.atPath('logging').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.loggingConfig = config;
    });
    this.configService.atPath('savedObjects').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.soConfig = config;
    });
    changedDeprecatedConfigPath$.pipe((0, _operators.takeUntil)(this.stop$)).subscribe(deprecatedConfigPaths => this.deprecatedConfigPaths = deprecatedConfigPaths);
    const internalRepositoryPromise = savedObjectsStartPromise.then(savedObjects => savedObjects.createInternalRepository([_constants.CORE_USAGE_STATS_TYPE]));

    const registerType = typeRegistry => {
      typeRegistry.registerType(_core_usage_stats.coreUsageStatsType);
    };

    const getClient = () => {
      const debugLogger = message => this.logger.debug(message);

      return new _core_usage_stats_client.CoreUsageStatsClient(debugLogger, http.basePath, internalRepositoryPromise);
    };

    this.coreUsageStatsClient = getClient();
    const contract = {
      registerType,
      getClient,
      registerUsageCounter: usageCounter => {
        this.incrementUsageCounter = params => usageCounter.incrementCounter(params);
      },
      incrementUsageCounter: params => {
        try {
          this.incrementUsageCounter(params);
        } catch (e) {
          // Self-defense mechanism since the handler is externally registered
          this.logger.debug('Failed to increase the usage counter');
          this.logger.debug(e);
        }
      }
    };
    return contract;
  }

  start({
    savedObjects,
    elasticsearch,
    exposedConfigsToUsage
  }) {
    return {
      getCoreUsageData: async () => {
        return await this.getCoreUsageData(savedObjects, elasticsearch);
      },
      getConfigsUsageData: async () => {
        return await this.getNonDefaultKibanaConfigs(exposedConfigsToUsage);
      }
    };
  }

  stop() {
    this.stop$.next();
    this.stop$.complete();
  }

}

exports.CoreUsageDataService = CoreUsageDataService;

function getEsPrincipalUsage({
  username,
  serviceAccountToken
}) {
  let value = 'unknown';

  if (_is_configured.isConfigured.string(username)) {
    switch (username) {
      case 'kibana': // deprecated

      case 'kibana_system':
        value = `${username}_user`;
        break;

      default:
        value = 'other_user';
    }
  } else if (serviceAccountToken) {
    // cannot be used with elasticsearch.username
    value = 'kibana_service_account';
  }

  return value;
}