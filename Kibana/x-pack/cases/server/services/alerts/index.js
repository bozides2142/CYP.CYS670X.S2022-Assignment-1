"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertService = void 0;

var _pMap = _interopRequireDefault(require("p-map"));

var _lodash = require("lodash");

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _error = require("../../common/error");

var _technical_rule_data_field_names = require("../../../../rule_registry/common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AlertService {
  constructor(scopedClusterClient, logger) {
    this.scopedClusterClient = scopedClusterClient;
    this.logger = logger;
  }

  async executeAggregations({
    aggregationBuilders,
    alerts
  }) {
    try {
      const {
        ids,
        indices
      } = AlertService.getUniqueIdsIndices(alerts);
      const builtAggs = aggregationBuilders.reduce((acc, agg) => {
        return { ...acc,
          ...agg.build()
        };
      }, {});
      const res = await this.scopedClusterClient.search({
        index: indices,
        ignore_unavailable: true,
        query: {
          ids: {
            values: ids
          }
        },
        size: 0,
        aggregations: builtAggs
      });
      return res.body.aggregations;
    } catch (error) {
      const aggregationNames = aggregationBuilders.map(agg => agg.getName());
      throw (0, _error.createCaseError)({
        message: `Failed to execute aggregations [${aggregationNames.join(',')}]: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  static getUniqueIdsIndices(alerts) {
    const {
      ids,
      indices
    } = alerts.reduce((acc, alert) => {
      acc.ids.add(alert.id);
      acc.indices.add(alert.index);
      return acc;
    }, {
      ids: new Set(),
      indices: new Set()
    });
    return {
      ids: Array.from(ids),
      indices: Array.from(indices)
    };
  }

  async updateAlertsStatus(alerts) {
    try {
      const bucketedAlerts = this.bucketAlertsByIndexAndStatus(alerts);
      const indexBuckets = Array.from(bucketedAlerts.entries());
      await (0, _pMap.default)(indexBuckets, async indexBucket => this.updateByQuery(indexBucket), {
        concurrency: _constants.MAX_CONCURRENT_SEARCHES
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update alert status ids: ${JSON.stringify(alerts)}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  bucketAlertsByIndexAndStatus(alerts) {
    return alerts.reduce((acc, alert) => {
      // skip any alerts that are empty
      if (AlertService.isEmptyAlert(alert)) {
        return acc;
      }

      const translatedAlert = { ...alert,
        status: this.translateStatus(alert)
      };
      const statusToAlertId = acc.get(translatedAlert.index); // if we haven't seen the index before

      if (!statusToAlertId) {
        // add a new index in the parent map, with an entry for the status the alert set to pointing
        // to an initial array of only the current alert
        acc.set(translatedAlert.index, createStatusToAlertMap(translatedAlert));
      } else {
        // We had the index in the map so check to see if we have a bucket for the
        // status, if not add a new status entry with the alert, if so update the status entry
        // with the alert
        updateIndexEntryWithStatus(statusToAlertId, translatedAlert);
      }

      return acc;
    }, new Map());
  }

  static isEmptyAlert(alert) {
    return (0, _lodash.isEmpty)(alert.id) || (0, _lodash.isEmpty)(alert.index);
  }

  translateStatus(alert) {
    const translatedStatuses = {
      [_api.CaseStatuses.open]: 'open',
      [_api.CaseStatuses['in-progress']]: 'acknowledged',
      [_api.CaseStatuses.closed]: 'closed'
    };
    const translatedStatus = translatedStatuses[alert.status];

    if (!translatedStatus) {
      this.logger.error(`Unable to translate case status ${alert.status} during alert update: ${JSON.stringify(alert)}`);
    }

    return translatedStatus !== null && translatedStatus !== void 0 ? translatedStatus : 'open';
  }

  async updateByQuery([index, statusToAlertMap]) {
    const statusBuckets = Array.from(statusToAlertMap);
    return Promise.all( // this will create three update by query calls one for each of the three statuses
    statusBuckets.map(([status, translatedAlerts]) => this.scopedClusterClient.updateByQuery({
      index,
      conflicts: 'abort',
      body: {
        script: {
          source: `if (ctx._source['${_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS}'] != null) {
                ctx._source['${_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS}'] = '${status}'
              }
              if (ctx._source.signal != null && ctx._source.signal.status != null) {
                ctx._source.signal.status = '${status}'
              }`,
          lang: 'painless'
        },
        // the query here will contain all the ids that have the same status for the same index
        // being updated
        query: {
          ids: {
            values: translatedAlerts.map(({
              id
            }) => id)
          }
        }
      },
      ignore_unavailable: true
    })));
  }

  async getAlerts(alertsInfo) {
    try {
      const docs = alertsInfo.filter(alert => !AlertService.isEmptyAlert(alert)).slice(0, _constants.MAX_ALERTS_PER_CASE).map(alert => ({
        _id: alert.id,
        _index: alert.index
      }));

      if (docs.length <= 0) {
        return;
      }

      const results = await this.scopedClusterClient.mget({
        body: {
          docs
        }
      }); // @ts-expect-error @elastic/elasticsearch _source is optional

      return results.body;
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve alerts ids: ${JSON.stringify(alertsInfo)}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

}

exports.AlertService = AlertService;

function createStatusToAlertMap(alert) {
  return new Map([[alert.status, [alert]]]);
}

function updateIndexEntryWithStatus(statusToAlerts, alert) {
  const statusBucket = statusToAlerts.get(alert.status);

  if (!statusBucket) {
    statusToAlerts.set(alert.status, [alert]);
  } else {
    statusBucket.push(alert);
  }
}