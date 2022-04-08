"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ccrShardRoute = ccrShardRoute;

var _moment = _interopRequireDefault(require("moment"));

var _configSchema = require("@kbn/config-schema");

var _handle_error = require("../../../../lib/errors/handle_error");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");

var _static_globals = require("../../../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function getFormattedLeaderIndex(leaderIndex) {
  let leader = leaderIndex;

  if (leader.includes(':')) {
    const leaderSplit = leader.split(':');
    leader = `${leaderSplit[1]} on ${leaderSplit[0]}`;
  }

  return leader;
}

async function getCcrStat(req, esIndexPattern, filters) {
  const min = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const max = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const params = {
    index: esIndexPattern,
    size: 1,
    filter_path: ['hits.hits._source.ccr_stats', 'hits.hits._source.elasticsearch.ccr', 'hits.hits._source.timestamp', 'hits.hits._source.@timestamp', 'hits.hits.inner_hits.oldest.hits.hits._source.ccr_stats.operations_written', 'hits.hits.inner_hits.oldest.hits.hits._source.elasticsearch.ccr.follower.operations_written', 'hits.hits.inner_hits.oldest.hits.hits._source.ccr_stats.failed_read_requests', 'hits.hits.inner_hits.oldest.hits.hits._source.elasticsearch.ccr.requests.failed.read.count'],
    body: {
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          must: [...filters, {
            range: {
              timestamp: {
                format: 'epoch_millis',
                gte: min,
                lte: max
              }
            }
          }]
        }
      },
      collapse: {
        field: 'ccr_stats.follower_index',
        inner_hits: {
          name: 'oldest',
          size: 1,
          sort: [{
            timestamp: {
              order: 'asc',
              unmapped_type: 'long'
            }
          }]
        }
      }
    }
  };
  return await callWithRequest(req, 'search', params);
}

function ccrShardRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/ccr/{index}/shard/{shardId}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          index: _configSchema.schema.string(),
          shardId: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          })
        })
      }
    },

    async handler(req) {
      const index = req.params.index;
      const shardId = req.params.shardId;
      const moduleType = 'elasticsearch';
      const dataset = 'ccr';
      const esIndexPattern = (0, _get_index_patterns.getNewIndexPatterns)({
        config: _static_globals.Globals.app.config,
        ccs: req.payload.ccs,
        moduleType,
        dataset
      });
      const filters = [{
        bool: {
          should: [{
            term: {
              'data_stream.dataset': {
                value: `${moduleType}.${dataset}`
              }
            }
          }, {
            term: {
              'metricset.name': {
                value: dataset
              }
            }
          }, {
            term: {
              type: {
                value: 'ccr_stats'
              }
            }
          }]
        }
      }, {
        term: {
          'ccr_stats.follower_index': {
            value: index
          }
        }
      }, {
        term: {
          'ccr_stats.shard_id': {
            value: shardId
          }
        }
      }];

      try {
        var _ccrResponse$hits, _ccrResponse$hits$hit, _ccrResponse$hits2, _ccrResponse$hits2$hi, _ccrResponse$hits2$hi2, _ccrResponse$hits3, _ccrResponse$hits3$hi, _ccrResponse$hits3$hi2, _ccrResponse$hits3$hi3, _ccrResponse$hits4, _ccrResponse$hits4$hi, _ccrResponse$hits4$hi2, _ccrResponse$hits4$hi3, _ccrResponse$hits4$hi4, _mbStat$leader, _ccrResponse$hits$hit2, _ccrResponse$hits5, _ccrResponse$hits5$hi, _ccrResponse$hits6, _ccrResponse$hits6$hi;

        const [metrics, ccrResponse] = await Promise.all([(0, _get_metrics.getMetrics)(req, 'elasticsearch', [{
          keys: ['ccr_sync_lag_time'],
          name: 'ccr_sync_lag_time'
        }, {
          keys: ['ccr_sync_lag_ops'],
          name: 'ccr_sync_lag_ops'
        }], filters), getCcrStat(req, esIndexPattern, filters)]);
        const legacyStat = (_ccrResponse$hits = ccrResponse.hits) === null || _ccrResponse$hits === void 0 ? void 0 : (_ccrResponse$hits$hit = _ccrResponse$hits.hits[0]) === null || _ccrResponse$hits$hit === void 0 ? void 0 : _ccrResponse$hits$hit._source.ccr_stats;
        const mbStat = (_ccrResponse$hits2 = ccrResponse.hits) === null || _ccrResponse$hits2 === void 0 ? void 0 : (_ccrResponse$hits2$hi = _ccrResponse$hits2.hits[0]) === null || _ccrResponse$hits2$hi === void 0 ? void 0 : (_ccrResponse$hits2$hi2 = _ccrResponse$hits2$hi._source.elasticsearch) === null || _ccrResponse$hits2$hi2 === void 0 ? void 0 : _ccrResponse$hits2$hi2.ccr;
        const oldestLegacyStat = (_ccrResponse$hits3 = ccrResponse.hits) === null || _ccrResponse$hits3 === void 0 ? void 0 : (_ccrResponse$hits3$hi = _ccrResponse$hits3.hits[0].inner_hits) === null || _ccrResponse$hits3$hi === void 0 ? void 0 : (_ccrResponse$hits3$hi2 = _ccrResponse$hits3$hi.oldest.hits) === null || _ccrResponse$hits3$hi2 === void 0 ? void 0 : (_ccrResponse$hits3$hi3 = _ccrResponse$hits3$hi2.hits[0]) === null || _ccrResponse$hits3$hi3 === void 0 ? void 0 : _ccrResponse$hits3$hi3._source.ccr_stats;
        const oldestMBStat = (_ccrResponse$hits4 = ccrResponse.hits) === null || _ccrResponse$hits4 === void 0 ? void 0 : (_ccrResponse$hits4$hi = _ccrResponse$hits4.hits[0].inner_hits) === null || _ccrResponse$hits4$hi === void 0 ? void 0 : (_ccrResponse$hits4$hi2 = _ccrResponse$hits4$hi.oldest.hits) === null || _ccrResponse$hits4$hi2 === void 0 ? void 0 : (_ccrResponse$hits4$hi3 = _ccrResponse$hits4$hi2.hits[0]) === null || _ccrResponse$hits4$hi3 === void 0 ? void 0 : (_ccrResponse$hits4$hi4 = _ccrResponse$hits4$hi3._source.elasticsearch) === null || _ccrResponse$hits4$hi4 === void 0 ? void 0 : _ccrResponse$hits4$hi4.ccr;
        const leaderIndex = mbStat ? mbStat === null || mbStat === void 0 ? void 0 : (_mbStat$leader = mbStat.leader) === null || _mbStat$leader === void 0 ? void 0 : _mbStat$leader.index : legacyStat === null || legacyStat === void 0 ? void 0 : legacyStat.leader_index;
        return {
          metrics,
          stat: mbStat !== null && mbStat !== void 0 ? mbStat : legacyStat,
          formattedLeader: getFormattedLeaderIndex(leaderIndex !== null && leaderIndex !== void 0 ? leaderIndex : ''),
          timestamp: (_ccrResponse$hits$hit2 = (_ccrResponse$hits5 = ccrResponse.hits) === null || _ccrResponse$hits5 === void 0 ? void 0 : (_ccrResponse$hits5$hi = _ccrResponse$hits5.hits[0]) === null || _ccrResponse$hits5$hi === void 0 ? void 0 : _ccrResponse$hits5$hi._source['@timestamp']) !== null && _ccrResponse$hits$hit2 !== void 0 ? _ccrResponse$hits$hit2 : (_ccrResponse$hits6 = ccrResponse.hits) === null || _ccrResponse$hits6 === void 0 ? void 0 : (_ccrResponse$hits6$hi = _ccrResponse$hits6.hits[0]) === null || _ccrResponse$hits6$hi === void 0 ? void 0 : _ccrResponse$hits6$hi._source.timestamp,
          oldestStat: oldestMBStat !== null && oldestMBStat !== void 0 ? oldestMBStat : oldestLegacyStat
        };
      } catch (err) {
        return (0, _handle_error.handleError)(err, req);
      }
    }

  });
}