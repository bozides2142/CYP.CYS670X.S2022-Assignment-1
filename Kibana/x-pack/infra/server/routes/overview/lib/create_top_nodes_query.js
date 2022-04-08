"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTopNodesQuery = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createTopNodesQuery = (options, source) => {
  var _options$sort, _options$sortDirectio;

  const sortByHost = options.sort && options.sort === 'name';
  const sortField = sortByHost ? '_key' : (_options$sort = options.sort) !== null && _options$sort !== void 0 ? _options$sort : 'uptime';
  const sortDirection = (_options$sortDirectio = options.sortDirection) !== null && _options$sortDirectio !== void 0 ? _options$sortDirectio : 'asc';
  return {
    size: 0,
    query: {
      bool: {
        filter: [{
          range: {
            [_constants.TIMESTAMP_FIELD]: {
              gte: options.timerange.from,
              lte: options.timerange.to,
              format: 'epoch_millis'
            }
          }
        }, {
          match_phrase: {
            'event.module': 'system'
          }
        }]
      }
    },
    aggs: {
      nodes: {
        terms: {
          field: 'host.name',
          size: options.size,
          order: {
            [sortField]: sortDirection
          }
        },
        aggs: {
          metadata: {
            top_metrics: {
              metrics: [{
                field: 'host.os.platform'
              }, {
                field: 'host.name'
              }, {
                field: 'cloud.provider'
              }],
              sort: {
                [_constants.TIMESTAMP_FIELD]: 'desc'
              },
              size: 1
            }
          },
          uptime: {
            max: {
              field: 'system.uptime.duration.ms'
            }
          },
          cpu: {
            avg: {
              field: 'system.cpu.total.norm.pct'
            }
          },
          iowait: {
            avg: {
              field: 'system.core.iowait.pct'
            }
          },
          load: {
            avg: {
              field: 'system.load.15'
            }
          },
          rx: {
            sum: {
              field: 'host.network.in.bytes'
            }
          },
          tx: {
            sum: {
              field: 'host.network.out.bytes'
            }
          },
          timeseries: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: '1m',
              extended_bounds: {
                min: options.timerange.from,
                max: options.timerange.to
              }
            },
            aggs: {
              cpu: {
                avg: {
                  field: 'host.cpu.pct'
                }
              },
              iowait: {
                avg: {
                  field: 'system.core.iowait.pct'
                }
              },
              load: {
                avg: {
                  field: 'system.load.15'
                }
              },
              rx: {
                rate: {
                  field: 'host.network.ingress.bytes'
                }
              },
              tx: {
                rate: {
                  field: 'host.network.egress.bytes'
                }
              }
            }
          }
        }
      }
    }
  };
};

exports.createTopNodesQuery = createTopNodesQuery;