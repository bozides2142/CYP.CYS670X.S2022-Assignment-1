"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUsageCountersUsageCollector = registerUsageCountersUsageCollector;
exports.transformRawCounter = transformRawCounter;

var _moment = _interopRequireDefault(require("moment"));

var _server = require("../../../../usage_collection/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function transformRawCounter(rawUsageCounter) {
  const {
    attributes: {
      count,
      counterName,
      counterType,
      domainId
    },
    updated_at: lastUpdatedAt
  } = rawUsageCounter;
  const fromTimestamp = (0, _moment.default)(lastUpdatedAt).utc().startOf('day').format();

  if (domainId === 'uiCounter' || typeof count !== 'number' || count < 1) {
    return;
  }

  return {
    domainId,
    counterName,
    counterType,
    lastUpdatedAt,
    fromTimestamp,
    total: count
  };
}

function registerUsageCountersUsageCollector(usageCollection) {
  const collector = usageCollection.makeUsageCollector({
    type: 'usage_counters',
    schema: {
      dailyEvents: {
        type: 'array',
        items: {
          domainId: {
            type: 'keyword',
            _meta: {
              description: 'Domain name of the metric (ie plugin name).'
            }
          },
          counterName: {
            type: 'keyword',
            _meta: {
              description: 'Name of the counter that happened.'
            }
          },
          lastUpdatedAt: {
            type: 'date',
            _meta: {
              description: 'Time at which the metric was last updated.'
            }
          },
          fromTimestamp: {
            type: 'date',
            _meta: {
              description: 'Time at which the metric was captured.'
            }
          },
          counterType: {
            type: 'keyword',
            _meta: {
              description: 'The type of counter used.'
            }
          },
          total: {
            type: 'integer',
            _meta: {
              description: 'The total number of times the event happened.'
            }
          }
        }
      }
    },
    fetch: async ({
      soClient
    }) => {
      const {
        saved_objects: rawUsageCounters
      } = await soClient.find({
        type: _server.USAGE_COUNTERS_SAVED_OBJECT_TYPE,
        fields: ['count', 'counterName', 'counterType', 'domainId'],
        filter: `NOT ${_server.USAGE_COUNTERS_SAVED_OBJECT_TYPE}.attributes.domainId: uiCounter`,
        perPage: 10000
      });
      return {
        dailyEvents: rawUsageCounters.reduce((acc, rawUsageCounter) => {
          try {
            const event = transformRawCounter(rawUsageCounter);

            if (event) {
              acc.push(event);
            }
          } catch (_) {// swallow error; allows sending successfully transformed objects.
          }

          return acc;
        }, [])
      };
    },
    isReady: () => true
  });
  usageCollection.registerCollector(collector);
}