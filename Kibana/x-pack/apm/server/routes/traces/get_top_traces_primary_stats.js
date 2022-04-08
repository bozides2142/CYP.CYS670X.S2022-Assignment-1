"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopTracesPrimaryStats = getTopTracesPrimaryStats;

var _lodash = require("lodash");

var _with_apm_span = require("../../utils/with_apm_span");

var _as_mutable_array = require("../../../common/utils/as_mutable_array");

var _environment_query = require("../../../common/utils/environment_query");

var _calculate_impact_builder = require("./calculate_impact_builder");

var _calculate_throughput = require("../../lib/helpers/calculate_throughput");

var _server = require("../../../../observability/server");

var _transactions = require("../../lib/helpers/transactions");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTopTracesPrimaryStats({
  environment,
  kuery,
  transactionName,
  searchAggregatedTransactions,
  start,
  end,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_top_traces_primary_stats', async () => {
    var _response$aggregation, _response$aggregation2;

    const response = await setup.apmEventClient.search('get_transaction_group_stats', {
      apm: {
        events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(searchAggregatedTransactions ? [{
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_ROOT]: true
              }
            }] : [])],
            must_not: [...(!searchAggregatedTransactions ? [{
              exists: {
                field: _elasticsearch_fieldnames.PARENT_ID
              }
            }] : [])]
          }
        },
        aggs: {
          transaction_groups: {
            composite: {
              sources: (0, _as_mutable_array.asMutableArray)([{
                [_elasticsearch_fieldnames.SERVICE_NAME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_NAME
                  }
                }
              }, {
                [_elasticsearch_fieldnames.TRANSACTION_NAME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.TRANSACTION_NAME
                  }
                }
              }]),
              // traces overview is hardcoded to 10000
              size: 10000
            },
            aggs: {
              transaction_type: {
                top_metrics: {
                  sort: {
                    '@timestamp': 'desc'
                  },
                  metrics: [{
                    field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                  }, {
                    field: _elasticsearch_fieldnames.AGENT_NAME
                  }]
                }
              },
              avg: {
                avg: {
                  field: (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions)
                }
              },
              sum: {
                sum: {
                  field: (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions)
                }
              }
            }
          }
        }
      }
    });
    const calculateImpact = (0, _calculate_impact_builder.calculateImpactBuilder)((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.transaction_groups.buckets.map(({
      sum
    }) => sum.value));
    const items = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.transaction_groups.buckets.map(bucket => {
      var _bucket$doc_count, _bucket$sum$value;

      return {
        key: bucket.key,
        serviceName: bucket.key[_elasticsearch_fieldnames.SERVICE_NAME],
        transactionName: bucket.key[_elasticsearch_fieldnames.TRANSACTION_NAME],
        averageResponseTime: bucket.avg.value,
        transactionsPerMinute: (0, _calculate_throughput.calculateThroughputWithRange)({
          start,
          end,
          value: (_bucket$doc_count = bucket.doc_count) !== null && _bucket$doc_count !== void 0 ? _bucket$doc_count : 0
        }),
        transactionType: bucket.transaction_type.top[0].metrics[_elasticsearch_fieldnames.TRANSACTION_TYPE],
        impact: calculateImpact((_bucket$sum$value = bucket.sum.value) !== null && _bucket$sum$value !== void 0 ? _bucket$sum$value : 0),
        agentName: bucket.transaction_type.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME]
      };
    });
    return {
      // sort by impact by default so most impactful services are not cut off
      items: (0, _lodash.sortBy)(items, 'impact').reverse()
    };
  });
}