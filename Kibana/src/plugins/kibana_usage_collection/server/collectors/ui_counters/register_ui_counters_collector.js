"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFetchUiCounters = void 0;
exports.registerUiCountersUsageCollector = registerUiCountersUsageCollector;
exports.transformRawUiCounterObject = transformRawUiCounterObject;
exports.transformRawUsageCounterObject = transformRawUsageCounterObject;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _ui_counter_saved_object_type = require("./ui_counter_saved_object_type");

var _server = require("../../../../usage_collection/server");

var _ui_counters = require("../../../../usage_collection/common/ui_counters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function transformRawUiCounterObject(rawUiCounter) {
  const {
    id,
    attributes: {
      count
    },
    updated_at: lastUpdatedAt
  } = rawUiCounter;

  if (typeof count !== 'number' || count < 1) {
    return;
  }

  const [appName,, counterType, ...restId] = id.split(':');
  const eventName = restId.join(':');
  const fromTimestamp = (0, _moment.default)(lastUpdatedAt).utc().startOf('day').format();
  return {
    appName,
    eventName,
    lastUpdatedAt,
    fromTimestamp,
    counterType,
    total: count
  };
}

function transformRawUsageCounterObject(rawUsageCounter) {
  const {
    attributes: {
      count,
      counterName,
      counterType,
      domainId
    },
    updated_at: lastUpdatedAt
  } = rawUsageCounter;

  if (domainId !== 'uiCounter' || typeof count !== 'number' || count < 1) {
    return;
  }

  const fromTimestamp = (0, _moment.default)(lastUpdatedAt).utc().startOf('day').format();
  const {
    appName,
    eventName
  } = (0, _ui_counters.deserializeUiCounterName)(counterName);
  return {
    appName,
    eventName,
    lastUpdatedAt,
    fromTimestamp,
    counterType,
    total: count
  };
}

const createFetchUiCounters = stopUsingUiCounterIndicies$ => async function fetchUiCounters({
  soClient
}) {
  const {
    saved_objects: rawUsageCounters
  } = await soClient.find({
    type: _server.USAGE_COUNTERS_SAVED_OBJECT_TYPE,
    fields: ['count', 'counterName', 'counterType', 'domainId'],
    filter: `${_server.USAGE_COUNTERS_SAVED_OBJECT_TYPE}.attributes.domainId: uiCounter`,
    perPage: 10000
  });
  const skipFetchingUiCounters = stopUsingUiCounterIndicies$.isStopped;
  const result = skipFetchingUiCounters || (await soClient.find({
    type: _ui_counter_saved_object_type.UI_COUNTER_SAVED_OBJECT_TYPE,
    fields: ['count'],
    perPage: 10000
  }));
  const rawUiCounters = typeof result === 'object' ? result.saved_objects : [];
  const dailyEventsFromUiCounters = rawUiCounters.reduce((acc, raw) => {
    try {
      const event = transformRawUiCounterObject(raw);

      if (event) {
        const {
          appName,
          eventName,
          counterType
        } = event;
        const key = (0, _server.serializeCounterKey)({
          domainId: 'uiCounter',
          counterName: (0, _ui_counters.serializeUiCounterName)({
            appName,
            eventName
          }),
          counterType,
          date: event.lastUpdatedAt
        });
        acc[key] = event;
      }
    } catch (_) {// swallow error; allows sending successfully transformed objects.
    }

    return acc;
  }, {});
  const dailyEventsFromUsageCounters = rawUsageCounters.reduce((acc, raw) => {
    try {
      const event = transformRawUsageCounterObject(raw);

      if (event) {
        acc[raw.id] = event;
      }
    } catch (_) {// swallow error; allows sending successfully transformed objects.
    }

    return acc;
  }, {});
  const mergedDailyCounters = (0, _lodash.mergeWith)(dailyEventsFromUsageCounters, dailyEventsFromUiCounters, (value, srcValue) => {
    if (!value) {
      return srcValue;
    }

    return { ...srcValue,
      total: srcValue.total + value.total
    };
  });
  return {
    dailyEvents: Object.values(mergedDailyCounters)
  };
};

exports.createFetchUiCounters = createFetchUiCounters;

function registerUiCountersUsageCollector(usageCollection, stopUsingUiCounterIndicies$) {
  const collector = usageCollection.makeUsageCollector({
    type: 'ui_counters',
    schema: {
      dailyEvents: {
        type: 'array',
        items: {
          appName: {
            type: 'keyword',
            _meta: {
              description: 'Name of the app reporting ui counts.'
            }
          },
          eventName: {
            type: 'keyword',
            _meta: {
              description: 'Name of the event that happened.'
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
    fetch: createFetchUiCounters(stopUsingUiCounterIndicies$),
    isReady: () => true
  });
  usageCollection.registerCollector(collector);
}