"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQuery = createQuery;
exports.createTimeFilter = createTimeFilter;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("./error_missing_required");

var _standalone_clusters = require("./standalone_clusters");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTimeFilter(options) {
  var _options$metric;

  const {
    start,
    end
  } = options;

  if (!start && !end) {
    return null;
  }

  const timestampField = (_options$metric = options.metric) === null || _options$metric === void 0 ? void 0 : _options$metric.timestampField;

  if (!timestampField) {
    throw new _error_missing_required.MissingRequiredError('metric.timestampField');
  }

  const timeRangeFilter = {
    range: {
      [timestampField]: {
        format: 'epoch_millis'
      }
    }
  };

  if (start) {
    timeRangeFilter.range[timestampField].gte = _moment.default.utc(start).valueOf();
  }

  if (end) {
    timeRangeFilter.range[timestampField].lte = _moment.default.utc(end).valueOf();
  }

  return timeRangeFilter;
}
/*
 * Creates the boilerplace for querying monitoring data, including filling in
 * document UUIDs, start time and end time, and injecting additional filters.
 *
 * Options object:
 * @param {string} options.type - `type` field value of the documents in legay .monitoring indices
 * @param {string} options.dsDataset - `data_stream.dataset` field values of the documents
 * @param {string} options.metricset - `metricset.name` field values of the documents
 * @param {Array} options.filters - additional filters to add to the `bool` section of the query. Default: []
 * @param {string} options.clusterUuid - a UUID of the cluster. Required.
 * @param {string} options.uuid - a UUID of the metric to filter for, or `null` if UUID should not be part of the query
 * @param {Date} options.start - numeric timestamp (optional)
 * @param {Date} options.end - numeric timestamp (optional)
 * @param {Metric} options.metric - Metric instance or metric fields object @see ElasticsearchMetric.getMetricFields
 */


function createQuery(options) {
  var _options$metric3;

  const {
    type,
    metricset,
    dsDataset,
    clusterUuid,
    uuid,
    filters
  } = (0, _lodash.defaults)(options, {
    filters: []
  });
  const isFromStandaloneCluster = clusterUuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID;
  const terms = [];
  let typeFilter; // data_stream.dataset matches agent integration data streams

  if (dsDataset) {
    terms.push({
      term: {
        'data_stream.dataset': dsDataset
      }
    });
  } // metricset.name matches standalone beats


  if (metricset) {
    terms.push({
      term: {
        'metricset.name': metricset
      }
    });
  } // type matches legacy data


  if (type) {
    terms.push({
      term: {
        type
      }
    });
  }

  if (terms.length) {
    typeFilter = {
      bool: {
        should: [...terms]
      }
    };
  }

  let clusterUuidFilter;

  if (clusterUuid && !isFromStandaloneCluster) {
    clusterUuidFilter = {
      term: {
        cluster_uuid: clusterUuid
      }
    };
  }

  let uuidFilter; // options.uuid can be null, for example getting all the clusters

  if (uuid) {
    var _options$metric2;

    const uuidField = (_options$metric2 = options.metric) === null || _options$metric2 === void 0 ? void 0 : _options$metric2.uuidField;

    if (!uuidField) {
      throw new _error_missing_required.MissingRequiredError('options.uuid given but options.metric.uuidField is false');
    }

    uuidFilter = {
      term: {
        [uuidField]: uuid
      }
    };
  }

  const timestampField = (_options$metric3 = options.metric) === null || _options$metric3 === void 0 ? void 0 : _options$metric3.timestampField;

  if (!timestampField) {
    throw new _error_missing_required.MissingRequiredError('metric.timestampField');
  }

  const timeRangeFilter = createTimeFilter(options);
  const combinedFilters = [typeFilter, clusterUuidFilter, uuidFilter, timeRangeFilter !== null && timeRangeFilter !== void 0 ? timeRangeFilter : undefined, ...filters];

  if (isFromStandaloneCluster) {
    combinedFilters.push(_standalone_clusters.standaloneClusterFilter);
  }

  const query = {
    bool: {
      filter: combinedFilters.filter(Boolean)
    }
  };
  return query;
}