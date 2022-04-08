"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractBeatUsageMetrics = extractBeatUsageMetrics;
exports.getBeatUsage = getBeatUsage;
exports.getLiveQueryUsage = getLiveQueryUsage;
exports.getPackageVersions = getPackageVersions;
exports.getPolicyLevelUsage = getPolicyLevelUsage;
exports.getScheduledQueryUsage = getScheduledQueryUsage;

var _usage = require("../routes/usage");

var _common = require("../../../fleet/common");

var _common2 = require("../../common");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getPolicyLevelUsage(esClient, soClient, packagePolicyService) {
  var _agentResponse$body$a;

  if (!packagePolicyService) {
    return {};
  }

  const packagePolicies = await packagePolicyService.list(soClient, {
    kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
    perPage: 10_000
  });
  const result = {
    scheduled_queries: getScheduledQueryUsage(packagePolicies) // TODO: figure out how to support dynamic keys in metrics
    // packageVersions: getPackageVersions(packagePolicies),

  };
  const agentResponse = await esClient.search({
    body: {
      size: 0,
      query: {
        match: {
          active: true
        }
      },
      aggs: {
        policied: {
          filter: {
            terms: {
              policy_id: packagePolicies.items.map(p => p.policy_id)
            }
          }
        }
      }
    },
    index: '.fleet-agents',
    ignore_unavailable: true
  });
  const policied = (_agentResponse$body$a = agentResponse.body.aggregations) === null || _agentResponse$body$a === void 0 ? void 0 : _agentResponse$body$a.policied;

  if (policied && typeof policied.doc_count === 'number') {
    result.agent_info = {
      enrolled: policied.doc_count
    };
  }

  return result;
}

function getPackageVersions(packagePolicies) {
  return packagePolicies.items.reduce((acc, item) => {
    if (item.package) {
      var _acc$item$package$ver;

      acc[item.package.version] = ((_acc$item$package$ver = acc[item.package.version]) !== null && _acc$item$package$ver !== void 0 ? _acc$item$package$ver : 0) + 1;
    }

    return acc;
  }, {});
}

function getScheduledQueryUsage(packagePolicies) {
  return packagePolicies.items.reduce((acc, item) => {
    ++acc.queryGroups.total;
    const policyAgents = item.inputs.reduce((sum, input) => sum + input.streams.length, 0);

    if (policyAgents === 0) {
      ++acc.queryGroups.empty;
    }

    return acc;
  }, {
    queryGroups: {
      total: 0,
      empty: 0
    }
  });
}

async function getLiveQueryUsage(soClient, esClient) {
  var _metricResponse$aggre;

  const {
    body: metricResponse
  } = await esClient.search({
    body: {
      size: 0,
      aggs: {
        queries: {
          filter: {
            term: {
              input_type: 'osquery'
            }
          }
        }
      }
    },
    index: '.fleet-actions',
    ignore_unavailable: true
  });
  const result = {
    session: await (0, _usage.getRouteMetric)(soClient, 'live_query')
  };
  const esQueries = (_metricResponse$aggre = metricResponse.aggregations) === null || _metricResponse$aggre === void 0 ? void 0 : _metricResponse$aggre.queries;

  if (esQueries && typeof esQueries.doc_count === 'number') {
    // getting error stats out of ES is difficult due to a lack of error info on .fleet-actions
    // and a lack of indexable osquery specific info on .fleet-actions-results
    result.cumulative = {
      queries: esQueries.doc_count
    };
  }

  return result;
}

function extractBeatUsageMetrics(metricResponse) {
  var _metricResponse$aggre2;

  const lastDayAggs = (_metricResponse$aggre2 = metricResponse.aggregations) === null || _metricResponse$aggre2 === void 0 ? void 0 : _metricResponse$aggre2.lastDay;
  const result = {
    memory: {
      rss: {}
    },
    cpu: {}
  };

  if (lastDayAggs) {
    if (lastDayAggs.max_rss !== undefined) {
      result.memory.rss.max = lastDayAggs.max_rss.value;
    }

    if (lastDayAggs.avg_rss !== undefined) {
      // @ts-expect-error condition check another property, not idea why. consider fixing
      result.memory.rss.avg = lastDayAggs.max_rss.value;
    }

    if (lastDayAggs.max_cpu !== undefined) {
      result.cpu.max = lastDayAggs.max_cpu.value;
    }

    if (lastDayAggs.avg_cpu !== undefined) {
      // @ts-expect-error condition check another property, not idea why. consider fixing
      result.cpu.avg = lastDayAggs.max_cpu.value;
    }

    if (lastDayAggs.latest !== undefined) {
      var _lastDayAggs$latest$h, _lastDayAggs$latest$h2;

      const latest = (_lastDayAggs$latest$h = lastDayAggs.latest.hits.hits[0]) === null || _lastDayAggs$latest$h === void 0 ? void 0 : (_lastDayAggs$latest$h2 = _lastDayAggs$latest$h._source) === null || _lastDayAggs$latest$h2 === void 0 ? void 0 : _lastDayAggs$latest$h2.monitoring.metrics.beat;

      if (latest) {
        result.cpu.latest = latest.cpu.total.time.ms;
        result.memory.rss.latest = latest.memstats.rss;
      }
    }
  }

  return result;
}

async function getBeatUsage(esClient) {
  const {
    body: metricResponse
  } = await esClient.search({
    body: {
      size: 0,
      aggs: {
        lastDay: {
          filter: {
            range: {
              '@timestamp': {
                gte: 'now-24h',
                lte: 'now'
              }
            }
          },
          aggs: {
            latest: {
              top_hits: {
                sort: [{
                  '@timestamp': {
                    order: 'desc'
                  }
                }],
                size: 1
              }
            },
            max_rss: {
              max: {
                field: 'monitoring.metrics.beat.memstats.rss'
              }
            },
            avg_rss: {
              avg: {
                field: 'monitoring.metrics.beat.memstats.rss'
              }
            },
            max_cpu: {
              max: {
                field: 'monitoring.metrics.beat.cpu.total.time.ms'
              }
            },
            avg_cpu: {
              avg: {
                field: 'monitoring.metrics.beat.cpu.total.time.ms'
              }
            }
          }
        }
      }
    },
    index: _constants.METRICS_INDICES,
    ignore_unavailable: true
  });
  return extractBeatUsageMetrics(metricResponse);
}