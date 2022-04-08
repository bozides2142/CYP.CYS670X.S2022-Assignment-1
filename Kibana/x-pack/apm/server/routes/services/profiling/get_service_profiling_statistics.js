"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceProfilingStatistics = getServiceProfilingStatistics;

var _lodash = require("lodash");

var _util = _interopRequireDefault(require("util"));

var _maybe = require("../../../../common/utils/maybe");

var _profiling = require("../../../../common/profiling");

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_STACK_IDS = 10000;
const MAX_STACKS_PER_REQUEST = 1000;

const maybeAdd = (to, value) => {
  if (to.includes(value)) {
    return;
  }

  to.push(value);
};

async function getProfilingStats({
  apmEventClient,
  filter,
  valueTypeField
}) {
  var _response$aggregation, _response$aggregation2;

  const response = await apmEventClient.search('get_profiling_stats', {
    apm: {
      events: [_processor_event.ProcessorEvent.profile]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        stacks: {
          terms: {
            field: _elasticsearch_fieldnames.PROFILE_TOP_ID,
            size: MAX_STACK_IDS,
            order: {
              value: 'desc'
            }
          },
          aggs: {
            value: {
              sum: {
                field: valueTypeField
              }
            }
          }
        }
      }
    }
  });
  const stacks = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.stacks.buckets.map(stack => {
    return {
      id: stack.key,
      value: stack.value.value
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  return stacks;
}

function getProfilesWithStacks({
  apmEventClient,
  filter
}) {
  return (0, _with_apm_span.withApmSpan)('get_profiles_with_stacks', async () => {
    var _cardinalityResponse$, _cardinalityResponse$2;

    const cardinalityResponse = await apmEventClient.search('get_top_cardinality', {
      apm: {
        events: [_processor_event.ProcessorEvent.profile]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter
          }
        },
        aggs: {
          top: {
            cardinality: {
              field: _elasticsearch_fieldnames.PROFILE_TOP_ID
            }
          }
        }
      }
    });
    const cardinality = (_cardinalityResponse$ = (_cardinalityResponse$2 = cardinalityResponse.aggregations) === null || _cardinalityResponse$2 === void 0 ? void 0 : _cardinalityResponse$2.top.value) !== null && _cardinalityResponse$ !== void 0 ? _cardinalityResponse$ : 0;
    const numStacksToFetch = Math.min(Math.ceil(cardinality * 1.1), MAX_STACK_IDS);
    const partitions = Math.ceil(numStacksToFetch / MAX_STACKS_PER_REQUEST);

    if (partitions === 0) {
      return [];
    }

    const allResponses = await (0, _with_apm_span.withApmSpan)('get_all_stacks', async () => {
      return Promise.all([...new Array(partitions)].map(async (_, num) => {
        var _response$aggregation3, _response$aggregation4;

        const response = await apmEventClient.search('get_partition', {
          apm: {
            events: [_processor_event.ProcessorEvent.profile]
          },
          body: {
            query: {
              bool: {
                filter
              }
            },
            aggs: {
              top: {
                terms: {
                  field: _elasticsearch_fieldnames.PROFILE_TOP_ID,
                  size: Math.max(MAX_STACKS_PER_REQUEST),
                  include: {
                    num_partitions: partitions,
                    partition: num
                  }
                },
                aggs: {
                  latest: {
                    top_hits: {
                      _source: [_elasticsearch_fieldnames.PROFILE_TOP_ID, _elasticsearch_fieldnames.PROFILE_STACK]
                    }
                  }
                }
              }
            }
          }
        });
        return (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.top.buckets.flatMap(bucket => {
          return bucket.latest.hits.hits[0]._source;
        })) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : [];
      }));
    });
    return allResponses.flat();
  });
}

async function getServiceProfilingStatistics({
  kuery,
  serviceName,
  setup,
  environment,
  valueType,
  logger,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_profiling_statistics', async () => {
    const {
      apmEventClient
    } = setup;
    const valueTypeField = (0, _profiling.getValueTypeConfig)(valueType).field;
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, {
      exists: {
        field: valueTypeField
      }
    }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];
    const [profileStats, profileStacks] = await Promise.all([getProfilingStats({
      apmEventClient,
      filter,
      valueTypeField
    }), getProfilesWithStacks({
      apmEventClient,
      filter
    })]);
    const nodes = {};
    const rootNodes = [];

    function getNode(frame) {
      const {
        id,
        filename,
        function: functionName,
        line
      } = frame;
      const location = [functionName, line].filter(Boolean).join(':');
      const fqn = [filename, location].filter(Boolean).join('/');
      const label = (0, _lodash.last)(location.split('/'));
      let node = nodes[id];

      if (!node) {
        node = {
          id,
          label,
          fqn,
          value: 0,
          children: []
        };
        nodes[id] = node;
      }

      return node;
    }

    const stackStatsById = (0, _lodash.keyBy)(profileStats, 'id');
    const missingStacks = [];
    profileStacks.forEach(profile => {
      const stats = (0, _maybe.maybe)(stackStatsById[profile.profile.top.id]);

      if (!stats) {
        missingStacks.push(profile.profile.top.id);
        return;
      }

      const frames = profile.profile.stack.concat().reverse();
      frames.forEach((frame, index) => {
        const node = getNode(frame);

        if (index === frames.length - 1 && stats) {
          node.value += stats.value;
        }

        if (index === 0) {
          // root node
          maybeAdd(rootNodes, node.id);
        } else {
          const parent = nodes[frames[index - 1].id];
          maybeAdd(parent.children, node.id);
        }
      });
    });

    if (missingStacks.length > 0) {
      logger.warn(`Could not find stats for all stacks: ${_util.default.inspect({
        numProfileStats: profileStats.length,
        numStacks: profileStacks.length,
        missing: missingStacks
      })}`);
    }

    return {
      nodes,
      rootNodes
    };
  });
}