"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectorSet = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _std = require("@kbn/std");

var _lodash = require("lodash");

var _collector = require("./collector");

var _usage_collector = require("./usage_collector");

var _constants = require("../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class CollectorSet {
  constructor({
    logger,
    maximumWaitTimeForAllCollectorsInS = _constants.DEFAULT_MAXIMUM_WAIT_TIME_FOR_ALL_COLLECTORS_IN_S,
    collectors: _collectors = []
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "maximumWaitTimeForAllCollectorsInS", void 0);
    (0, _defineProperty2.default)(this, "collectors", void 0);
    (0, _defineProperty2.default)(this, "makeStatsCollector", options => {
      return new _collector.Collector(this.logger, options);
    });
    (0, _defineProperty2.default)(this, "makeUsageCollector", options => {
      return new _usage_collector.UsageCollector(this.logger, options);
    });
    (0, _defineProperty2.default)(this, "registerCollector", collector => {
      // check instanceof
      if (!(collector instanceof _collector.Collector)) {
        throw new Error('CollectorSet can only have Collector instances registered');
      }

      if (this.collectors.get(collector.type)) {
        throw new Error(`Usage collector's type "${collector.type}" is duplicated.`);
      }

      this.collectors.set(collector.type, collector);
    });
    (0, _defineProperty2.default)(this, "getCollectorByType", type => {
      return [...this.collectors.values()].find(c => c.type === type);
    });
    (0, _defineProperty2.default)(this, "getReadyCollectors", async (collectors = this.collectors) => {
      if (!(collectors instanceof Map)) {
        throw new Error(`getReadyCollectors method given bad Map of collectors: ` + typeof collectors);
      }

      const secondInMs = 1000;
      const collectorsWithStatus = await Promise.all([...collectors.values()].map(async collector => {
        const isReadyWithTimeout = await (0, _std.withTimeout)({
          promise: (async () => {
            try {
              return await collector.isReady();
            } catch (err) {
              this.logger.debug(`Collector ${collector.type} failed to get ready. ${err}`);
              return false;
            }
          })(),
          timeoutMs: this.maximumWaitTimeForAllCollectorsInS * secondInMs
        });
        return {
          isReadyWithTimeout,
          collector
        };
      }));
      const timedOutCollectorsTypes = collectorsWithStatus.filter(collectorWithStatus => collectorWithStatus.isReadyWithTimeout.timedout).map(({
        collector
      }) => collector.type);

      if (timedOutCollectorsTypes.length) {
        this.logger.debug(`Some collectors timedout getting ready (${timedOutCollectorsTypes.join(', ')}). ` + `Waited for ${this.maximumWaitTimeForAllCollectorsInS}s and will return data from collectors that are ready.`);
      }

      const nonTimedOutCollectors = collectorsWithStatus.filter(collectorWithStatus => collectorWithStatus.isReadyWithTimeout.timedout === false);
      const collectorsTypesNotReady = nonTimedOutCollectors.filter(({
        isReadyWithTimeout
      }) => isReadyWithTimeout.value === false).map(({
        collector
      }) => collector.type);

      if (collectorsTypesNotReady.length) {
        this.logger.debug(`Some collectors are not ready (${collectorsTypesNotReady.join(',')}). ` + `will return data from all collectors that are ready.`);
      }

      const readyCollectors = nonTimedOutCollectors.filter(({
        isReadyWithTimeout
      }) => isReadyWithTimeout.value === true).map(({
        collector
      }) => collector);
      return {
        readyCollectors,
        nonReadyCollectorTypes: collectorsTypesNotReady,
        timedOutCollectorsTypes
      };
    });
    (0, _defineProperty2.default)(this, "bulkFetch", async (esClient, soClient, kibanaRequest, // intentionally `| undefined` to enforce providing the parameter
    collectors = this.collectors) => {
      this.logger.debug(`Getting ready collectors`);
      const {
        readyCollectors,
        nonReadyCollectorTypes,
        timedOutCollectorsTypes
      } = await this.getReadyCollectors(collectors);
      const collectorStats = {
        not_ready: {
          count: nonReadyCollectorTypes.length,
          names: nonReadyCollectorTypes
        },
        not_ready_timeout: {
          count: timedOutCollectorsTypes.length,
          names: timedOutCollectorsTypes
        },
        succeeded: {
          count: 0,
          names: []
        },
        failed: {
          count: 0,
          names: []
        }
      };
      const responses = await Promise.all(readyCollectors.map(async collector => {
        this.logger.debug(`Fetching data from ${collector.type} collector`);

        try {
          const context = {
            esClient,
            soClient,
            ...(collector.extendFetchContext.kibanaRequest && {
              kibanaRequest
            })
          };
          const result = await collector.fetch(context);
          collectorStats.succeeded.names.push(collector.type);
          return {
            type: collector.type,
            result
          };
        } catch (err) {
          this.logger.warn(err);
          this.logger.warn(`Unable to fetch data from ${collector.type} collector`);
          collectorStats.failed.names.push(collector.type);
        }
      }));
      collectorStats.succeeded.count = collectorStats.succeeded.names.length;
      collectorStats.failed.count = collectorStats.failed.names.length; // Treat it as just another "collector"

      responses.push({
        type: 'usage_collector_stats',
        result: collectorStats
      });
      return responses.filter(response => typeof response !== 'undefined');
    });
    (0, _defineProperty2.default)(this, "getFilteredCollectorSet", filter => {
      const filtered = [...this.collectors.values()].filter(filter);
      return this.makeCollectorSetFromArray(filtered);
    });
    (0, _defineProperty2.default)(this, "bulkFetchUsage", async (esClient, savedObjectsClient, kibanaRequest) => {
      const usageCollectors = this.getFilteredCollectorSet(c => c instanceof _usage_collector.UsageCollector);
      return await this.bulkFetch(esClient, savedObjectsClient, kibanaRequest, usageCollectors.collectors);
    });
    (0, _defineProperty2.default)(this, "toObject", (statsData = []) => {
      return Object.fromEntries(statsData.map(({
        type,
        result
      }) => [type, result]));
    });
    (0, _defineProperty2.default)(this, "toApiFieldNames", apiData => {
      // handle array and return early, or return a reduced object
      if (Array.isArray(apiData)) {
        return apiData.map(value => this.getValueOrRecurse(value));
      }

      return Object.fromEntries(Object.entries(apiData).map(([field, value]) => {
        let newName = field;
        newName = (0, _lodash.snakeCase)(newName);
        newName = newName.replace(/^(1|5|15)_m/, '$1m'); // os.load.15m, os.load.5m, os.load.1m

        newName = newName.replace('_in_bytes', '_bytes');
        newName = newName.replace('_in_millis', '_ms');
        return [newName, this.getValueOrRecurse(value)];
      }));
    });
    (0, _defineProperty2.default)(this, "getValueOrRecurse", value => {
      if (Array.isArray(value) || typeof value === 'object' && value !== null) {
        return this.toApiFieldNames(value); // recurse
      }

      return value;
    });
    (0, _defineProperty2.default)(this, "makeCollectorSetFromArray", collectors => {
      return new CollectorSet({
        logger: this.logger,
        maximumWaitTimeForAllCollectorsInS: this.maximumWaitTimeForAllCollectorsInS,
        collectors
      });
    });
    this.logger = logger;
    this.collectors = new Map(_collectors.map(collector => [collector.type, collector]));
    this.maximumWaitTimeForAllCollectorsInS = maximumWaitTimeForAllCollectorsInS;
  }
  /**
   * Instantiates a stats collector with the definition provided in the options
   * @param options Definition of the collector {@link CollectorOptions}
   */


}

exports.CollectorSet = CollectorSet;