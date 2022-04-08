"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceProfilingTimeline = getServiceProfilingTimeline;

var _lodash = require("lodash");

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _profiling = require("../../../../common/profiling");

var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");

var _environment_query = require("../../../../common/utils/environment_query");

var _server = require("../../../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const configMap = (0, _lodash.mapValues)((0, _lodash.mapKeys)(_profiling.ProfilingValueType, (val, key) => val), value => (0, _profiling.getValueTypeConfig)(value));
const allFields = Object.values(configMap).map(config => config.field);

async function getServiceProfilingTimeline({
  kuery,
  serviceName,
  environment,
  setup,
  start,
  end
}) {
  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search('get_service_profiling_timeline', {
    apm: {
      events: [_processor_event.ProcessorEvent.profile]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: (0, _get_bucket_size.getBucketSize)({
              start,
              end
            }).intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {
            value_type: {
              filters: {
                filters: {
                  unknown: {
                    bool: {
                      must_not: allFields.map(field => ({
                        exists: {
                          field
                        }
                      }))
                    }
                  },
                  ...(0, _lodash.mapValues)(configMap, ({
                    field
                  }) => ({
                    exists: {
                      field
                    }
                  }))
                }
              },
              aggs: {
                num_profiles: {
                  cardinality: {
                    field: _elasticsearch_fieldnames.PROFILE_ID
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  const {
    aggregations
  } = response;

  if (!aggregations) {
    return [];
  }

  return aggregations.timeseries.buckets.map(bucket => {
    return {
      x: bucket.key,
      valueTypes: {
        unknown: bucket.value_type.buckets.unknown.num_profiles.value,
        // TODO: use enum as object key. not possible right now
        // because of https://github.com/microsoft/TypeScript/issues/37888
        ...(0, _lodash.mapValues)(configMap, (_, key) => {
          var _bucket$value_type$bu, _bucket$value_type$bu2;

          return (_bucket$value_type$bu = (_bucket$value_type$bu2 = bucket.value_type.buckets[key]) === null || _bucket$value_type$bu2 === void 0 ? void 0 : _bucket$value_type$bu2.num_profiles.value) !== null && _bucket$value_type$bu !== void 0 ? _bucket$value_type$bu : 0;
        })
      }
    };
  });
}