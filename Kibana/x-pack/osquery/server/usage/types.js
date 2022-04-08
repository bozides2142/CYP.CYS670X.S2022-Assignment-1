"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usageSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const usageSchema = {
  live_query_usage: {
    session: {
      count: {
        type: 'long',
        _meta: {
          description: 'Number of osquery action requests'
        }
      },
      errors: {
        type: 'long',
        _meta: {
          description: 'Number of osquery action requests that resulted in errors'
        }
      }
    },
    cumulative: {
      queries: {
        type: 'long',
        _meta: {
          description: 'Number of osquery actions stored in Elasticsearch'
        }
      }
    }
  },
  scheduled_queries: {
    queryGroups: {
      total: {
        type: 'long',
        _meta: {
          description: 'Number of osquery policies/query groups'
        }
      },
      empty: {
        type: 'long',
        _meta: {
          description: 'Number of empty osquery policies/query groups'
        }
      }
    }
  },
  agent_info: {
    enrolled: {
      type: 'long',
      _meta: {
        description: 'Number of agents enrolled in a policy with an osquery integration'
      }
    }
  },
  beat_metrics: {
    usage: {
      cpu: {
        latest: {
          type: 'long',
          _meta: {
            description: 'Latest cpu usage sample in ms'
          }
        },
        max: {
          type: 'long',
          _meta: {
            description: 'Max cpu usage sample over 24 hours in ms'
          }
        },
        avg: {
          type: 'long',
          _meta: {
            description: 'Mean cpu usage over 24 hours in ms'
          }
        }
      },
      memory: {
        rss: {
          latest: {
            type: 'long',
            _meta: {
              description: 'Latest resident set size sample'
            }
          },
          max: {
            type: 'long',
            _meta: {
              description: 'Max resident set size sample over 24 hours'
            }
          },
          avg: {
            type: 'long',
            _meta: {
              description: 'Mean resident set size sample over 24 hours'
            }
          }
        }
      }
    }
  }
};
exports.usageSchema = usageSchema;