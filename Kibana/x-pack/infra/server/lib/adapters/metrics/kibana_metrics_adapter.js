"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaMetricsAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");

var _check_valid_node = require("./lib/check_valid_node");

var _inventory_models = require("../../../../common/inventory_models");

var _types = require("../../../../common/inventory_models/types");

var _calculate_metric_interval = require("../../../utils/calculate_metric_interval");

var _server = require("../../../../../../../src/plugins/vis_types/timeseries/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class KibanaMetricsAdapter {
  constructor(framework) {
    (0, _defineProperty2.default)(this, "framework", void 0);
    this.framework = framework;
  }

  async getMetrics(requestContext, options, rawRequest) {
    const indexPattern = `${options.sourceConfiguration.metricAlias}`;
    const fields = (0, _inventory_models.findInventoryFields)(options.nodeType);
    const nodeField = fields.id;

    const search = searchOptions => this.framework.callWithRequest(requestContext, 'search', searchOptions);

    const validNode = await (0, _check_valid_node.checkValidNode)(search, indexPattern, nodeField, options.nodeIds.nodeId);

    if (!validNode) {
      throw new Error(_i18n.i18n.translate('xpack.infra.kibanaMetrics.nodeDoesNotExistErrorMessage', {
        defaultMessage: '{nodeId} does not exist.',
        values: {
          nodeId: options.nodeIds.nodeId
        }
      }));
    }

    const requests = options.metrics.map(metricId => this.makeTSVBRequest(metricId, options, nodeField, requestContext, rawRequest));
    return Promise.all(requests).then(results => {
      return results.filter(_server.isVisSeriesData).map(result => {
        const metricIds = Object.keys(result).filter(k => !['type', 'uiRestrictions', 'trackedEsSearches'].includes(k));
        return metricIds.map(id => {
          if (!_types.InventoryMetricRT.is(id)) {
            throw new Error(_i18n.i18n.translate('xpack.infra.kibanaMetrics.invalidInfraMetricErrorMessage', {
              defaultMessage: '{id} is not a valid InfraMetric',
              values: {
                id
              }
            }));
          }

          const panel = result[id];
          return {
            id,
            series: panel.series.map(series => {
              return {
                id: series.id,
                label: series.label,
                data: series.data.map(point => ({
                  timestamp: point[0],
                  value: point[1]
                }))
              };
            })
          };
        });
      });
    }).then(result => (0, _lodash.flatten)(result));
  }

  async makeTSVBRequest(metricId, options, nodeField, requestContext, rawRequest) {
    const createTSVBModel = (0, _lodash.get)(_inventory_models.metrics, ['tsvb', metricId]);

    if (!createTSVBModel) {
      throw new Error(_i18n.i18n.translate('xpack.infra.metrics.missingTSVBModelError', {
        defaultMessage: 'The TSVB model for {metricId} does not exist for {nodeType}',
        values: {
          metricId,
          nodeType: options.nodeType
        }
      }));
    }

    const indexPattern = `${options.sourceConfiguration.metricAlias}`;
    const timerange = {
      min: options.timerange.from,
      max: options.timerange.to
    };
    const model = createTSVBModel(_constants.TIMESTAMP_FIELD, indexPattern, options.timerange.interval);

    const client = opts => this.framework.callWithRequest(requestContext, 'search', opts);

    const calculatedInterval = await (0, _calculate_metric_interval.calculateMetricInterval)(client, {
      indexPattern: `${options.sourceConfiguration.metricAlias}`,
      timerange: options.timerange
    }, model.requires);

    if (calculatedInterval) {
      model.interval = `>=${calculatedInterval}s`;
    }

    if (model.id_type === 'cloud' && !options.nodeIds.cloudId) {
      throw new Error(_i18n.i18n.translate('xpack.infra.kibanaMetrics.cloudIdMissingErrorMessage', {
        defaultMessage: 'Model for {metricId} requires a cloudId, but none was given for {nodeId}.',
        values: {
          metricId,
          nodeId: options.nodeIds.nodeId
        }
      }));
    }

    const id = model.id_type === 'cloud' ? options.nodeIds.cloudId : options.nodeIds.nodeId;
    const filters = model.map_field_to ? [{
      match: {
        [model.map_field_to]: id
      }
    }] : [{
      match: {
        [nodeField]: id
      }
    }];
    return this.framework.makeTSVBRequest(requestContext, rawRequest, model, timerange, filters);
  }

}

exports.KibanaMetricsAdapter = KibanaMetricsAdapter;