"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ccrRoute = ccrRoute;

var _configSchema = require("@kbn/config-schema");

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _handle_error = require("../../../../lib/errors/handle_error");

var _ccs_utils = require("../../../../../common/ccs_utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function getBucketScript(max, min) {
  return {
    bucket_script: {
      buckets_path: {
        max,
        min
      },
      script: 'params.max - params.min'
    }
  };
}

function buildRequest(req, config, esIndexPattern) {
  const min = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const max = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const maxBucketSize = config.ui.max_bucket_size;
  const aggs = {
    ops_synced_max: {
      max: {
        field: 'ccr_stats.operations_written'
      }
    },
    ops_synced_min: {
      min: {
        field: 'ccr_stats.operations_written'
      }
    },
    lag_ops_leader_max: {
      max: {
        field: 'ccr_stats.leader_max_seq_no'
      }
    },
    lag_ops_leader_min: {
      min: {
        field: 'ccr_stats.leader_max_seq_no'
      }
    },
    lag_ops_global_max: {
      max: {
        field: 'ccr_stats.follower_global_checkpoint'
      }
    },
    lag_ops_global_min: {
      min: {
        field: 'ccr_stats.follower_global_checkpoint'
      }
    },
    leader_lag_ops_checkpoint_max: {
      max: {
        field: 'ccr_stats.leader_global_checkpoint'
      }
    },
    leader_lag_ops_checkpoint_min: {
      min: {
        field: 'ccr_stats.leader_global_checkpoint'
      }
    },
    ops_synced: getBucketScript('ops_synced_max', 'ops_synced_min'),
    lag_ops_leader: getBucketScript('lag_ops_leader_max', 'lag_ops_leader_min'),
    lag_ops_global: getBucketScript('lag_ops_global_max', 'lag_ops_global_min'),
    lag_ops: getBucketScript('lag_ops_leader', 'lag_ops_global'),
    lag_ops_leader_checkpoint: getBucketScript('leader_lag_ops_checkpoint_max', 'leader_lag_ops_checkpoint_min'),
    leader_lag_ops: getBucketScript('lag_ops_leader', 'lag_ops_leader_checkpoint'),
    follower_lag_ops: getBucketScript('lag_ops_leader_checkpoint', 'lag_ops_global')
  };
  return {
    index: esIndexPattern,
    size: maxBucketSize,
    filter_path: ['hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.read_exceptions', 'hits.hits.inner_hits.by_shard.hits.hits._source.elasticsearch.ccr.read_exceptions', 'hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.follower_index', 'hits.hits.inner_hits.by_shard.hits.hits._source.elasticsearch.ccr.follower.index', 'hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.shard_id', 'hits.hits.inner_hits.by_shard.hits.hits._source.elasticsearch.ccr.follower.shard.number', 'hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.time_since_last_read_millis', 'hits.hits.inner_hits.by_shard.hits.hits._source.elasticsearch.ccr.follower.time_since_last_read.ms', 'aggregations.by_follower_index.buckets.key', 'aggregations.by_follower_index.buckets.leader_index.buckets.key', 'aggregations.by_follower_index.buckets.leader_index.buckets.remote_cluster.buckets.key', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.key', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.ops_synced.value', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.lag_ops.value', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.leader_lag_ops.value', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.follower_lag_ops.value'],
    body: {
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          must: [{
            bool: {
              should: [{
                term: {
                  type: {
                    value: 'ccr_stats'
                  }
                }
              }, {
                term: {
                  'metricset.name': {
                    value: 'ccr'
                  }
                }
              }]
            }
          }, {
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
          name: 'by_shard',
          sort: [{
            timestamp: {
              order: 'desc',
              unmapped_type: 'long'
            }
          }],
          size: maxBucketSize,
          collapse: {
            field: 'ccr_stats.shard_id'
          }
        }
      },
      aggs: {
        by_follower_index: {
          terms: {
            field: 'ccr_stats.follower_index',
            size: maxBucketSize
          },
          aggs: {
            leader_index: {
              terms: {
                field: 'ccr_stats.leader_index',
                size: 1
              },
              aggs: {
                remote_cluster: {
                  terms: {
                    field: 'ccr_stats.remote_cluster',
                    size: 1
                  }
                }
              }
            },
            by_shard_id: {
              terms: {
                field: 'ccr_stats.shard_id',
                size: 10
              },
              aggs
            }
          }
        }
      }
    }
  };
}

function ccrRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/ccr',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
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
      const config = server.config;
      const ccs = req.payload.ccs;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);

      try {
        var _response$hits$hits$r, _response$hits, _response$aggregation, _response$aggregation2;

        const {
          callWithRequest
        } = req.server.plugins.elasticsearch.getCluster('monitoring');
        const params = buildRequest(req, config, esIndexPattern);
        const response = await callWithRequest(req, 'search', params);

        if (!response || Object.keys(response).length === 0) {
          return {
            data: []
          };
        }

        const fullStats = (_response$hits$hits$r = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits.reduce((accum, hit) => {
          var _hit$inner_hits$by_sh, _hit$inner_hits, _hit$inner_hits$by_sh2;

          const innerHits = (_hit$inner_hits$by_sh = (_hit$inner_hits = hit.inner_hits) === null || _hit$inner_hits === void 0 ? void 0 : (_hit$inner_hits$by_sh2 = _hit$inner_hits.by_shard.hits) === null || _hit$inner_hits$by_sh2 === void 0 ? void 0 : _hit$inner_hits$by_sh2.hits) !== null && _hit$inner_hits$by_sh !== void 0 ? _hit$inner_hits$by_sh : [];
          const grouped = (0, _lodash.groupBy)(innerHits, innerHit => {
            var _innerHit$_source$ela, _innerHit$_source$ela2, _innerHit$_source$ela3;

            if (innerHit._source.ccr_stats) {
              return `${innerHit._source.ccr_stats.follower_index}:${innerHit._source.ccr_stats.shard_id}`;
            } else if ((_innerHit$_source$ela = innerHit._source.elasticsearch) !== null && _innerHit$_source$ela !== void 0 && (_innerHit$_source$ela2 = _innerHit$_source$ela.ccr) !== null && _innerHit$_source$ela2 !== void 0 && (_innerHit$_source$ela3 = _innerHit$_source$ela2.follower) !== null && _innerHit$_source$ela3 !== void 0 && _innerHit$_source$ela3.shard) {
              var _innerHit$_source$ela4, _innerHit$_source$ela5, _innerHit$_source$ela6, _innerHit$_source$ela7, _innerHit$_source$ela8, _innerHit$_source$ela9, _innerHit$_source$ela10;

              return `${(_innerHit$_source$ela4 = innerHit._source.elasticsearch) === null || _innerHit$_source$ela4 === void 0 ? void 0 : (_innerHit$_source$ela5 = _innerHit$_source$ela4.ccr) === null || _innerHit$_source$ela5 === void 0 ? void 0 : (_innerHit$_source$ela6 = _innerHit$_source$ela5.follower) === null || _innerHit$_source$ela6 === void 0 ? void 0 : _innerHit$_source$ela6.index}:${(_innerHit$_source$ela7 = innerHit._source.elasticsearch) === null || _innerHit$_source$ela7 === void 0 ? void 0 : (_innerHit$_source$ela8 = _innerHit$_source$ela7.ccr) === null || _innerHit$_source$ela8 === void 0 ? void 0 : (_innerHit$_source$ela9 = _innerHit$_source$ela8.follower) === null || _innerHit$_source$ela9 === void 0 ? void 0 : (_innerHit$_source$ela10 = _innerHit$_source$ela9.shard) === null || _innerHit$_source$ela10 === void 0 ? void 0 : _innerHit$_source$ela10.number}`;
            }
          });
          return { ...accum,
            ...grouped
          };
        }, {})) !== null && _response$hits$hits$r !== void 0 ? _response$hits$hits$r : {};
        const buckets = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.by_follower_index.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
        const data = buckets.reduce((accum, bucket) => {
          const leaderIndex = (0, _lodash.get)(bucket, 'leader_index.buckets[0].key');
          const remoteCluster = (0, _lodash.get)(bucket, 'leader_index.buckets[0].remote_cluster.buckets[0].key');
          const follows = remoteCluster ? `${leaderIndex} on ${remoteCluster}` : leaderIndex;
          const stat = {
            id: bucket.key,
            index: bucket.key,
            follows,
            shards: [],
            error: undefined,
            opsSynced: undefined,
            syncLagTime: undefined,
            syncLagOps: undefined
          };
          stat.shards = (0, _lodash.get)(bucket, 'by_shard_id.buckets').reduce((accum2, shardBucket) => {
            var _fullStat$_source, _fullStat$_source2, _fullStat$_source2$el, _ref, _fullLegacyStat$ccr_s, _fullLegacyStat$ccr_s2, _fullMbStat$elasticse, _fullMbStat$elasticse2, _readExceptions$0$exc, _fullLegacyStat$ccr_s3, _fullLegacyStat$ccr_s4, _fullMbStat$elasticse3, _fullMbStat$elasticse4, _fullMbStat$elasticse5, _fullMbStat$elasticse6;

            const fullStat = fullStats[`${bucket.key}:${shardBucket.key}`][0];
            const fullLegacyStat = (_fullStat$_source = fullStat._source) !== null && _fullStat$_source !== void 0 && _fullStat$_source.ccr_stats ? fullStat._source : null;
            const fullMbStat = (_fullStat$_source2 = fullStat._source) !== null && _fullStat$_source2 !== void 0 && (_fullStat$_source2$el = _fullStat$_source2.elasticsearch) !== null && _fullStat$_source2$el !== void 0 && _fullStat$_source2$el.ccr ? fullStat._source : null;
            const readExceptions = (_ref = (_fullLegacyStat$ccr_s = fullLegacyStat === null || fullLegacyStat === void 0 ? void 0 : (_fullLegacyStat$ccr_s2 = fullLegacyStat.ccr_stats) === null || _fullLegacyStat$ccr_s2 === void 0 ? void 0 : _fullLegacyStat$ccr_s2.read_exceptions) !== null && _fullLegacyStat$ccr_s !== void 0 ? _fullLegacyStat$ccr_s : fullMbStat === null || fullMbStat === void 0 ? void 0 : (_fullMbStat$elasticse = fullMbStat.elasticsearch) === null || _fullMbStat$elasticse === void 0 ? void 0 : (_fullMbStat$elasticse2 = _fullMbStat$elasticse.ccr) === null || _fullMbStat$elasticse2 === void 0 ? void 0 : _fullMbStat$elasticse2.read_exceptions) !== null && _ref !== void 0 ? _ref : [];
            const shardStat = {
              shardId: shardBucket.key,
              error: readExceptions.length ? (_readExceptions$0$exc = readExceptions[0].exception) === null || _readExceptions$0$exc === void 0 ? void 0 : _readExceptions$0$exc.type : null,
              opsSynced: (0, _lodash.get)(shardBucket, 'ops_synced.value'),
              syncLagTime: // @ts-ignore
              (_fullLegacyStat$ccr_s3 = fullLegacyStat === null || fullLegacyStat === void 0 ? void 0 : (_fullLegacyStat$ccr_s4 = fullLegacyStat.ccr_stats) === null || _fullLegacyStat$ccr_s4 === void 0 ? void 0 : _fullLegacyStat$ccr_s4.time_since_last_read_millis) !== null && _fullLegacyStat$ccr_s3 !== void 0 ? _fullLegacyStat$ccr_s3 : fullMbStat === null || fullMbStat === void 0 ? void 0 : (_fullMbStat$elasticse3 = fullMbStat.elasticsearch) === null || _fullMbStat$elasticse3 === void 0 ? void 0 : (_fullMbStat$elasticse4 = _fullMbStat$elasticse3.ccr) === null || _fullMbStat$elasticse4 === void 0 ? void 0 : (_fullMbStat$elasticse5 = _fullMbStat$elasticse4.follower) === null || _fullMbStat$elasticse5 === void 0 ? void 0 : (_fullMbStat$elasticse6 = _fullMbStat$elasticse5.time_since_last_read) === null || _fullMbStat$elasticse6 === void 0 ? void 0 : _fullMbStat$elasticse6.ms,
              syncLagOps: (0, _lodash.get)(shardBucket, 'lag_ops.value'),
              syncLagOpsLeader: (0, _lodash.get)(shardBucket, 'leader_lag_ops.value'),
              syncLagOpsFollower: (0, _lodash.get)(shardBucket, 'follower_lag_ops.value')
            };
            accum2.push(shardStat);
            return accum2;
          }, []);
          stat.error = (stat.shards.find(shard => shard.error) || {}).error;
          stat.opsSynced = stat.shards.reduce((sum, {
            opsSynced
          }) => sum + opsSynced, 0);
          stat.syncLagTime = stat.shards.reduce((max, {
            syncLagTime
          }) => Math.max(max, syncLagTime), 0);
          stat.syncLagOps = stat.shards.reduce((max, {
            syncLagOps
          }) => Math.max(max, syncLagOps), 0);
          accum.push(stat);
          return accum;
        }, []);
        return {
          data
        };
      } catch (err) {
        return (0, _handle_error.handleError)(err, req);
      }
    }

  });
}