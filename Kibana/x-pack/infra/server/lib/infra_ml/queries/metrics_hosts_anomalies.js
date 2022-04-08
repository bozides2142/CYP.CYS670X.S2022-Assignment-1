"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricsHostsAnomalyHitRT = exports.metricsHostsAnomaliesResponseRT = exports.createMetricsHostsAnomaliesQuery = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _constants = require("../../../../common/constants");

var _elasticsearch_runtime_types = require("../../../utils/elasticsearch_runtime_types");

var _common = require("./common");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const sortToMlFieldMap = {
  dataset: 'partition_field_value',
  anomalyScore: 'record_score',
  startTime: 'timestamp'
};

const createMetricsHostsAnomaliesQuery = ({
  jobIds,
  anomalyThreshold,
  startTime,
  endTime,
  sort,
  pagination,
  influencerFilter,
  jobQuery
}) => {
  const {
    field
  } = sort;
  const {
    pageSize
  } = pagination;
  let filters = [...(0, _common.createJobIdsFilters)(jobIds), ...(0, _common.createAnomalyScoreFilter)(anomalyThreshold), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createResultTypeFilters)(['record'])];

  if (jobQuery) {
    filters = [...filters, ...(0, _common.createJobIdsQuery)(jobQuery)];
  }

  const influencerQuery = influencerFilter ? {
    must: (0, _common.createInfluencerFilter)(influencerFilter)
  } : {};
  const sourceFields = ['job_id', 'record_score', 'typical', 'actual', 'partition_field_name', 'partition_field_value', 'timestamp', 'bucket_span', 'by_field_value', 'host.name', 'influencers.influencer_field_name', 'influencers.influencer_field_values'];
  const {
    querySortDirection,
    queryCursor
  } = parsePaginationCursor(sort, pagination);
  const sortOptions = [{
    [sortToMlFieldMap[field]]: querySortDirection
  }, {
    [_constants.TIEBREAKER_FIELD]: querySortDirection
  } // Tiebreaker
  ];
  const resultsQuery = { ..._common.defaultRequestParameters,
    body: {
      query: {
        bool: {
          filter: filters,
          ...influencerQuery
        }
      },
      search_after: queryCursor,
      sort: sortOptions,
      size: pageSize,
      _source: sourceFields
    }
  };
  return resultsQuery;
};

exports.createMetricsHostsAnomaliesQuery = createMetricsHostsAnomaliesQuery;
const metricsHostsAnomalyHitRT = rt.type({
  _id: rt.string,
  _source: rt.intersection([rt.type({
    job_id: rt.string,
    record_score: rt.number,
    typical: rt.array(rt.number),
    actual: rt.array(rt.number),
    influencers: rt.array(rt.type({
      influencer_field_name: rt.string,
      influencer_field_values: rt.array(rt.string)
    })),
    'host.name': rt.array(rt.string),
    bucket_span: rt.number,
    timestamp: rt.number
  }), rt.partial({
    partition_field_name: rt.string,
    partition_field_value: rt.string,
    by_field_value: rt.string
  })]),
  sort: rt.tuple([rt.union([rt.string, rt.number]), rt.union([rt.string, rt.number])])
});
exports.metricsHostsAnomalyHitRT = metricsHostsAnomalyHitRT;
const metricsHostsAnomaliesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(metricsHostsAnomalyHitRT)
  })
})]);
exports.metricsHostsAnomaliesResponseRT = metricsHostsAnomaliesResponseRT;

const parsePaginationCursor = (sort, pagination) => {
  const {
    cursor
  } = pagination;
  const {
    direction
  } = sort;

  if (!cursor) {
    return {
      querySortDirection: direction,
      queryCursor: undefined
    };
  } // We will always use ES's search_after to paginate, to mimic "search_before" behaviour we
  // need to reverse the user's chosen search direction for the ES query.


  if ('searchBefore' in cursor) {
    return {
      querySortDirection: direction === 'desc' ? 'asc' : 'desc',
      queryCursor: cursor.searchBefore
    };
  } else {
    return {
      querySortDirection: direction,
      queryCursor: cursor.searchAfter
    };
  }
};