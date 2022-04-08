"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDerivedServiceAnnotations = getDerivedServiceAnnotations;

var _is_finite_number = require("../../../../common/utils/is_finite_number");

var _annotations = require("../../../../common/annotations");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");

var _transactions = require("../../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getDerivedServiceAnnotations({
  setup,
  serviceName,
  environment,
  searchAggregatedTransactions,
  start,
  end
}) {
  var _await$apmEventClient, _await$apmEventClient2;

  const {
    apmEventClient
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _environment_query.environmentQuery)(environment)];
  const versions = (_await$apmEventClient = (_await$apmEventClient2 = (await apmEventClient.search('get_derived_service_annotations', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...filter, ...(0, _server.rangeQuery)(start, end)]
        }
      },
      aggs: {
        versions: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_VERSION
          }
        }
      }
    }
  })).aggregations) === null || _await$apmEventClient2 === void 0 ? void 0 : _await$apmEventClient2.versions.buckets.map(bucket => bucket.key)) !== null && _await$apmEventClient !== void 0 ? _await$apmEventClient : [];

  if (versions.length <= 1) {
    return [];
  }

  const annotations = await Promise.all(versions.map(async version => {
    const response = await apmEventClient.search('get_first_seen_of_version', {
      apm: {
        events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 1,
        query: {
          bool: {
            filter: [...filter, {
              term: {
                [_elasticsearch_fieldnames.SERVICE_VERSION]: version
              }
            }]
          }
        },
        sort: {
          '@timestamp': 'asc'
        }
      }
    });
    const firstSeen = new Date(response.hits.hits[0]._source['@timestamp']).getTime();

    if (!(0, _is_finite_number.isFiniteNumber)(firstSeen)) {
      throw new Error('First seen for version was unexpectedly undefined or null.');
    }

    if (firstSeen < start || firstSeen > end) {
      return null;
    }

    return {
      type: _annotations.AnnotationType.VERSION,
      id: version,
      '@timestamp': firstSeen,
      text: version
    };
  }));
  return annotations.filter(Boolean);
}