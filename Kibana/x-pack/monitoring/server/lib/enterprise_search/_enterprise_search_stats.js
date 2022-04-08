"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entSearchUuidsAgg = exports.entSearchAggResponseHandler = exports.entSearchAggFilterPath = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const entSearchAggFilterPath = ['aggregations.total', 'aggregations.versions.buckets', // Latest values
'aggregations.app_search_engines.value', 'aggregations.workplace_search_org_sources.value', 'aggregations.workplace_search_private_sources.value', // Cluster-wide values
'aggregations.uptime.value', 'aggregations.cluster_heap_used.value', 'aggregations.cluster_heap_total.value', 'aggregations.cluster_heap_committed.value'];
exports.entSearchAggFilterPath = entSearchAggFilterPath;

const entSearchUuidsAgg = maxBucketSize => ({
  // Count all unique agents
  total: {
    cardinality: {
      field: 'agent.id',
      precision_threshold: 10000
    }
  },
  // Collect all running versions
  versions: {
    terms: {
      field: 'enterprisesearch.health.version.number'
    }
  },
  // Get latest values for some of the metrics across the recent events
  latest_report: {
    terms: {
      field: '@timestamp',
      size: 2,
      // There is a health and a stats event and we want to make sure we always get at least one of each
      order: {
        _key: 'desc'
      }
    },
    aggs: {
      app_search_engines: {
        max: {
          field: 'enterprisesearch.stats.product_usage.app_search.total_engines'
        }
      },
      workplace_search_org_sources: {
        max: {
          field: 'enterprisesearch.stats.product_usage.workplace_search.total_org_sources'
        }
      },
      workplace_search_private_sources: {
        max: {
          field: 'enterprisesearch.stats.product_usage.workplace_search.total_private_sources'
        }
      }
    }
  },
  // Get per-instance values using ephemeral IDs to aggreagte metrics
  ephemeral_ids: {
    terms: {
      field: 'agent.ephemeral_id',
      size: maxBucketSize
    },
    aggs: {
      uptime_max: {
        max: {
          field: 'enterprisesearch.health.process.uptime.sec'
        }
      },
      heap_used: {
        max: {
          field: 'enterprisesearch.health.jvm.memory_usage.heap_used.bytes'
        }
      },
      heap_total: {
        max: {
          field: 'enterprisesearch.health.jvm.memory_usage.heap_max.bytes'
        }
      },
      heap_committed: {
        max: {
          field: 'enterprisesearch.health.jvm.memory_usage.heap_committed.bytes'
        }
      }
    }
  },
  // Get latest values from aggregations into global values
  app_search_engines: {
    max_bucket: {
      buckets_path: 'latest_report>app_search_engines'
    }
  },
  workplace_search_org_sources: {
    max_bucket: {
      buckets_path: 'latest_report>workplace_search_org_sources'
    }
  },
  workplace_search_private_sources: {
    max_bucket: {
      buckets_path: 'latest_report>workplace_search_private_sources'
    }
  },
  // Aggregate metrics into global values
  uptime: {
    max_bucket: {
      buckets_path: 'ephemeral_ids>uptime_max'
    }
  },
  cluster_heap_used: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>heap_used'
    }
  },
  cluster_heap_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>heap_total'
    }
  },
  cluster_heap_committed: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>heap_committed'
    }
  }
});

exports.entSearchUuidsAgg = entSearchUuidsAgg;

const entSearchAggResponseHandler = response => {
  var _aggs$app_search_engi, _aggs$workplace_searc, _aggs$workplace_searc2, _aggs$total$value, _aggs$uptime$value, _aggs$cluster_heap_us, _aggs$cluster_heap_co, _aggs$cluster_heap_to, _aggs$versions$bucket;

  const aggs = response.aggregations; // console.log('Aggs: ', aggs);

  const appSearchEngines = (_aggs$app_search_engi = aggs === null || aggs === void 0 ? void 0 : aggs.app_search_engines.value) !== null && _aggs$app_search_engi !== void 0 ? _aggs$app_search_engi : 0;
  const workplaceSearchOrgSources = (_aggs$workplace_searc = aggs === null || aggs === void 0 ? void 0 : aggs.workplace_search_org_sources.value) !== null && _aggs$workplace_searc !== void 0 ? _aggs$workplace_searc : 0;
  const workplaceSearchPrivateSources = (_aggs$workplace_searc2 = aggs === null || aggs === void 0 ? void 0 : aggs.workplace_search_private_sources.value) !== null && _aggs$workplace_searc2 !== void 0 ? _aggs$workplace_searc2 : 0;
  const totalInstances = (_aggs$total$value = aggs === null || aggs === void 0 ? void 0 : aggs.total.value) !== null && _aggs$total$value !== void 0 ? _aggs$total$value : 0;
  const uptime = (_aggs$uptime$value = aggs === null || aggs === void 0 ? void 0 : aggs.uptime.value) !== null && _aggs$uptime$value !== void 0 ? _aggs$uptime$value : 0;
  const memUsed = (_aggs$cluster_heap_us = aggs === null || aggs === void 0 ? void 0 : aggs.cluster_heap_used.value) !== null && _aggs$cluster_heap_us !== void 0 ? _aggs$cluster_heap_us : 0;
  const memCommitted = (_aggs$cluster_heap_co = aggs === null || aggs === void 0 ? void 0 : aggs.cluster_heap_committed.value) !== null && _aggs$cluster_heap_co !== void 0 ? _aggs$cluster_heap_co : 0;
  const memTotal = (_aggs$cluster_heap_to = aggs === null || aggs === void 0 ? void 0 : aggs.cluster_heap_total.value) !== null && _aggs$cluster_heap_to !== void 0 ? _aggs$cluster_heap_to : 0;
  const versions = ((_aggs$versions$bucket = aggs === null || aggs === void 0 ? void 0 : aggs.versions.buckets) !== null && _aggs$versions$bucket !== void 0 ? _aggs$versions$bucket : []).map(({
    key
  }) => key);
  return {
    appSearchEngines,
    workplaceSearchOrgSources,
    workplaceSearchPrivateSources,
    totalInstances,
    uptime,
    memUsed,
    memCommitted,
    memTotal,
    versions
  };
};

exports.entSearchAggResponseHandler = entSearchAggResponseHandler;