"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchBeatsStates = fetchBeatsStates;
exports.fetchBeatsStats = fetchBeatsStats;
exports.getBeatsStats = getBeatsStats;
exports.processResults = processResults;

var _lodash = require("lodash");

var _create_query = require("./create_query");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HITS_SIZE = 10000; // maximum hits to receive from ES with each search

const getBaseStats = () => ({
  // stats
  versions: {},
  types: {},
  outputs: {},
  count: 0,
  eventsPublished: 0,
  hosts: 0,
  // state
  input: {
    count: 0,
    names: []
  },
  module: {
    count: 0,
    names: []
  },
  queue: {
    mem: 0,
    spool: 0
  },
  architecture: {
    count: 0,
    architectures: []
  }
});
/*
 * Update a clusters object with processed beat stats
 * @param {Array} results - array of Beats docs from ES
 * @param {Object} clusters - Beats stats in an object keyed by the cluster UUIDs
 * @param {Object} clusterHostSets - the object keyed by cluster UUIDs to count the unique hosts
 * @param {Object} clusterModuleSets - the object keyed by cluster UUIDs to count the unique modules
 */


function processResults(results, {
  clusters,
  clusterHostSets,
  clusterInputSets,
  clusterModuleSets,
  clusterArchitectureMaps
}) {
  var _results$hits;

  const currHits = (results === null || results === void 0 ? void 0 : (_results$hits = results.hits) === null || _results$hits === void 0 ? void 0 : _results$hits.hits) || [];
  currHits.forEach(hit => {
    const clusterUuid = hit._source.cluster_uuid;

    if (clusters[clusterUuid] === undefined) {
      clusters[clusterUuid] = getBaseStats();
      clusterHostSets[clusterUuid] = new Set();
      clusterInputSets[clusterUuid] = new Set();
      clusterModuleSets[clusterUuid] = new Set();
      clusterArchitectureMaps[clusterUuid] = new Map();
    }

    const processBeatsStatsResults = () => {
      var _hit$_source, _hit$_source$beats_st, _hit$_source$beats_st2, _hit$_source2, _hit$_source2$beats_s, _hit$_source2$beats_s2, _hit$_source3, _hit$_source3$beats_s, _hit$_source3$beats_s2, _hit$_source3$beats_s3, _hit$_source3$beats_s4, _hit$_source4, _hit$_source4$beats_s, _hit$_source4$beats_s2, _hit$_source4$beats_s3, _hit$_source4$beats_s4, _hit$_source4$beats_s5, _hit$_source5, _hit$_source5$beats_s, _hit$_source5$beats_s2;

      const {
        versions,
        types,
        outputs
      } = clusters[clusterUuid];
      const thisVersion = (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : (_hit$_source$beats_st = _hit$_source.beats_stats) === null || _hit$_source$beats_st === void 0 ? void 0 : (_hit$_source$beats_st2 = _hit$_source$beats_st.beat) === null || _hit$_source$beats_st2 === void 0 ? void 0 : _hit$_source$beats_st2.version;

      if (thisVersion !== undefined) {
        const thisVersionAccum = versions[thisVersion] || 0;
        versions[thisVersion] = thisVersionAccum + 1;
      }

      const thisType = (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : (_hit$_source2$beats_s = _hit$_source2.beats_stats) === null || _hit$_source2$beats_s === void 0 ? void 0 : (_hit$_source2$beats_s2 = _hit$_source2$beats_s.beat) === null || _hit$_source2$beats_s2 === void 0 ? void 0 : _hit$_source2$beats_s2.type;

      if (thisType !== undefined) {
        const thisTypeAccum = types[thisType] || 0;
        types[thisType] = thisTypeAccum + 1;
      }

      const thisOutput = (_hit$_source3 = hit._source) === null || _hit$_source3 === void 0 ? void 0 : (_hit$_source3$beats_s = _hit$_source3.beats_stats) === null || _hit$_source3$beats_s === void 0 ? void 0 : (_hit$_source3$beats_s2 = _hit$_source3$beats_s.metrics) === null || _hit$_source3$beats_s2 === void 0 ? void 0 : (_hit$_source3$beats_s3 = _hit$_source3$beats_s2.libbeat) === null || _hit$_source3$beats_s3 === void 0 ? void 0 : (_hit$_source3$beats_s4 = _hit$_source3$beats_s3.output) === null || _hit$_source3$beats_s4 === void 0 ? void 0 : _hit$_source3$beats_s4.type;

      if (thisOutput !== undefined) {
        const thisOutputAccum = outputs[thisOutput] || 0;
        outputs[thisOutput] = thisOutputAccum + 1;
      }

      const thisEvents = (_hit$_source4 = hit._source) === null || _hit$_source4 === void 0 ? void 0 : (_hit$_source4$beats_s = _hit$_source4.beats_stats) === null || _hit$_source4$beats_s === void 0 ? void 0 : (_hit$_source4$beats_s2 = _hit$_source4$beats_s.metrics) === null || _hit$_source4$beats_s2 === void 0 ? void 0 : (_hit$_source4$beats_s3 = _hit$_source4$beats_s2.libbeat) === null || _hit$_source4$beats_s3 === void 0 ? void 0 : (_hit$_source4$beats_s4 = _hit$_source4$beats_s3.pipeline) === null || _hit$_source4$beats_s4 === void 0 ? void 0 : (_hit$_source4$beats_s5 = _hit$_source4$beats_s4.events) === null || _hit$_source4$beats_s5 === void 0 ? void 0 : _hit$_source4$beats_s5.published;

      if (thisEvents !== undefined) {
        clusters[clusterUuid].eventsPublished += thisEvents;
      }

      const thisHost = (_hit$_source5 = hit._source) === null || _hit$_source5 === void 0 ? void 0 : (_hit$_source5$beats_s = _hit$_source5.beats_stats) === null || _hit$_source5$beats_s === void 0 ? void 0 : (_hit$_source5$beats_s2 = _hit$_source5$beats_s.beat) === null || _hit$_source5$beats_s2 === void 0 ? void 0 : _hit$_source5$beats_s2.host;

      if (thisHost !== undefined) {
        const hostsMap = clusterHostSets[clusterUuid];
        hostsMap.add(thisHost);
        clusters[clusterUuid].hosts = hostsMap.size;
      }
    };

    const processBeatsStateResults = () => {
      var _hit$_source6, _hit$_source6$beats_s, _hit$_source6$beats_s2, _hit$_source7, _hit$_source7$beats_s, _hit$_source7$beats_s2, _hit$_source8, _hit$_source8$beats_s, _hit$_source8$beats_s2, _hit$_source9, _hit$_source9$beats_s, _hit$_source9$beats_s2, _hit$_source9$beats_s3, _hit$_source10, _hit$_source10$beats_, _hit$_source10$beats_2, _hit$_source11, _hit$_source11$beats_, _hit$_source11$beats_2, _hit$_source12, _hit$_source12$beats_, _hit$_source12$beats_2;

      const stateInput = (_hit$_source6 = hit._source) === null || _hit$_source6 === void 0 ? void 0 : (_hit$_source6$beats_s = _hit$_source6.beats_state) === null || _hit$_source6$beats_s === void 0 ? void 0 : (_hit$_source6$beats_s2 = _hit$_source6$beats_s.state) === null || _hit$_source6$beats_s2 === void 0 ? void 0 : _hit$_source6$beats_s2.input;

      if (stateInput !== undefined) {
        const inputSet = clusterInputSets[clusterUuid];
        stateInput.names.forEach(name => inputSet.add(name));
        clusters[clusterUuid].input.names = Array.from(inputSet);
        clusters[clusterUuid].input.count += stateInput.count;
      }

      const stateModule = (_hit$_source7 = hit._source) === null || _hit$_source7 === void 0 ? void 0 : (_hit$_source7$beats_s = _hit$_source7.beats_state) === null || _hit$_source7$beats_s === void 0 ? void 0 : (_hit$_source7$beats_s2 = _hit$_source7$beats_s.state) === null || _hit$_source7$beats_s2 === void 0 ? void 0 : _hit$_source7$beats_s2.module;
      const statsType = (_hit$_source8 = hit._source) === null || _hit$_source8 === void 0 ? void 0 : (_hit$_source8$beats_s = _hit$_source8.beats_state) === null || _hit$_source8$beats_s === void 0 ? void 0 : (_hit$_source8$beats_s2 = _hit$_source8$beats_s.beat) === null || _hit$_source8$beats_s2 === void 0 ? void 0 : _hit$_source8$beats_s2.type;

      if (stateModule !== undefined) {
        const moduleSet = clusterModuleSets[clusterUuid];
        stateModule.names.forEach(name => moduleSet.add(statsType + '.' + name));
        clusters[clusterUuid].module.names = Array.from(moduleSet);
        clusters[clusterUuid].module.count += stateModule.count;
      }

      const stateQueue = (_hit$_source9 = hit._source) === null || _hit$_source9 === void 0 ? void 0 : (_hit$_source9$beats_s = _hit$_source9.beats_state) === null || _hit$_source9$beats_s === void 0 ? void 0 : (_hit$_source9$beats_s2 = _hit$_source9$beats_s.state) === null || _hit$_source9$beats_s2 === void 0 ? void 0 : (_hit$_source9$beats_s3 = _hit$_source9$beats_s2.queue) === null || _hit$_source9$beats_s3 === void 0 ? void 0 : _hit$_source9$beats_s3.name;

      if (stateQueue !== undefined) {
        clusters[clusterUuid].queue[stateQueue] += 1;
      }

      const heartbeatState = (_hit$_source10 = hit._source) === null || _hit$_source10 === void 0 ? void 0 : (_hit$_source10$beats_ = _hit$_source10.beats_state) === null || _hit$_source10$beats_ === void 0 ? void 0 : (_hit$_source10$beats_2 = _hit$_source10$beats_.state) === null || _hit$_source10$beats_2 === void 0 ? void 0 : _hit$_source10$beats_2.heartbeat;

      if (heartbeatState !== undefined) {
        if (!clusters[clusterUuid].hasOwnProperty('heartbeat')) {
          clusters[clusterUuid].heartbeat = {
            monitors: 0,
            endpoints: 0
          }; // Needed because TS complains about the additional index signature
        }

        const clusterHb = clusters[clusterUuid].heartbeat;
        clusterHb.monitors += heartbeatState.monitors;
        clusterHb.endpoints += heartbeatState.endpoints;

        for (const proto in heartbeatState) {
          if (!heartbeatState.hasOwnProperty(proto)) {
            continue;
          }

          const val = heartbeatState[proto];

          if (typeof val !== 'object') {
            continue;
          }

          if (!clusterHb.hasOwnProperty(proto)) {
            clusterHb[proto] = {
              monitors: 0,
              endpoints: 0
            };
          }

          clusterHb[proto].monitors += val.monitors;
          clusterHb[proto].endpoints += val.endpoints;
        }
      }

      const functionbeatState = (_hit$_source11 = hit._source) === null || _hit$_source11 === void 0 ? void 0 : (_hit$_source11$beats_ = _hit$_source11.beats_state) === null || _hit$_source11$beats_ === void 0 ? void 0 : (_hit$_source11$beats_2 = _hit$_source11$beats_.state) === null || _hit$_source11$beats_2 === void 0 ? void 0 : _hit$_source11$beats_2.functionbeat;

      if (functionbeatState !== undefined) {
        var _functionbeatState$fu;

        if (!clusters[clusterUuid].hasOwnProperty('functionbeat')) {
          clusters[clusterUuid].functionbeat = {
            functions: {
              count: 0
            }
          };
        }

        clusters[clusterUuid].functionbeat.functions.count += ((_functionbeatState$fu = functionbeatState.functions) === null || _functionbeatState$fu === void 0 ? void 0 : _functionbeatState$fu.count) || 0;
      }

      const stateHost = (_hit$_source12 = hit._source) === null || _hit$_source12 === void 0 ? void 0 : (_hit$_source12$beats_ = _hit$_source12.beats_state) === null || _hit$_source12$beats_ === void 0 ? void 0 : (_hit$_source12$beats_2 = _hit$_source12$beats_.state) === null || _hit$_source12$beats_2 === void 0 ? void 0 : _hit$_source12$beats_2.host;

      if (stateHost !== undefined) {
        const hostMap = clusterArchitectureMaps[clusterUuid];
        const hostKey = `${stateHost.architecture}/${stateHost.os.platform}`;
        let os = hostMap.get(hostKey);

        if (!os) {
          // undefined if new
          os = {
            name: stateHost.os.platform,
            architecture: stateHost.architecture,
            count: 0
          };
          hostMap.set(hostKey, os);
        } // total per os/arch


        os.count += 1; // overall total (which should be the same number as the sum of all os.count values)

        clusters[clusterUuid].architecture.count += 1;
        clusters[clusterUuid].architecture.architectures = Array.from(hostMap.values());
      }
    };

    if ((0, _lodash.get)(hit, '_source.type') === 'beats_stats') {
      clusters[clusterUuid].count += 1;
      processBeatsStatsResults();
    } else {
      processBeatsStateResults();
    }
  });
}
/*
 * Create a set of result objects where each is the result of searching hits from Elasticsearch with a size of HITS_SIZE each time.
 * @param {function} callCluster - The callWithRequest or callWithInternalUser handler
 * @param {Array} clusterUuids - The string Cluster UUIDs to fetch details for
 * @param {Date} start - Start time to limit the stats
 * @param {Date} end - End time to limit the stats
 * @param {Number} options.page - selection of hits to fetch from ES
 * @param {Object} options.clusters - Beats stats in an object keyed by the cluster UUIDs
 * @param {String} type - beats_stats or beats_state
 * @return {Promise}
 */


async function fetchBeatsByType(callCluster, clusterUuids, start, end, {
  page = 0,
  ...options
}, type) {
  var _results$hits2;

  const params = {
    index: _constants.INDEX_PATTERN_BEATS,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.cluster_uuid', 'hits.hits._source.type', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beats_state.state', 'hits.hits._source.beats_state.beat.type'],
    body: {
      query: (0, _create_query.createQuery)({
        start,
        end,
        filters: [{
          terms: {
            cluster_uuid: clusterUuids
          }
        }, {
          bool: {
            must_not: {
              term: {
                [`${type}.beat.type`]: 'apm-server'
              }
            },
            must: {
              term: {
                type
              }
            }
          }
        }]
      }),
      from: page * HITS_SIZE,
      collapse: {
        field: `${type}.beat.uuid`
      },
      sort: [{
        [`${type}.timestamp`]: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      size: HITS_SIZE
    }
  };
  const {
    body: results
  } = await callCluster.search(params);
  const hitsLength = (results === null || results === void 0 ? void 0 : (_results$hits2 = results.hits) === null || _results$hits2 === void 0 ? void 0 : _results$hits2.hits.length) || 0;

  if (hitsLength > 0) {
    // further augment the clusters object with more stats
    processResults(results, options);

    if (hitsLength === HITS_SIZE) {
      // call recursively
      const nextOptions = {
        page: page + 1,
        ...options
      }; // returns a promise and keeps the caller blocked from returning until the entire clusters object is built

      return fetchBeatsByType(callCluster, clusterUuids, start, end, nextOptions, type);
    }
  }

  return Promise.resolve();
}

async function fetchBeatsStats(callCluster, clusterUuids, start, end, options) {
  return fetchBeatsByType(callCluster, clusterUuids, start, end, options, 'beats_stats');
}

async function fetchBeatsStates(callCluster, clusterUuids, start, end, options) {
  return fetchBeatsByType(callCluster, clusterUuids, start, end, options, 'beats_state');
}
/*
 * Call the function for fetching and summarizing beats stats
 * @return {Object} - Beats stats in an object keyed by the cluster UUIDs
 */


async function getBeatsStats(callCluster, clusterUuids, start, end) {
  const options = {
    clusters: {},
    // the result object to be built up
    clusterHostSets: {},
    // passed to processResults for tracking state in the results generation
    clusterInputSets: {},
    // passed to processResults for tracking state in the results generation
    clusterModuleSets: {},
    // passed to processResults for tracking state in the results generation
    clusterArchitectureMaps: {} // passed to processResults for tracking state in the results generation

  };
  await Promise.all([fetchBeatsStats(callCluster, clusterUuids, start, end, options), fetchBeatsStates(callCluster, clusterUuids, start, end, options)]);
  return options.clusters;
}