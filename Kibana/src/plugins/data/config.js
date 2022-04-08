"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSessionsConfigSchema = exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configSchema = _configSchema.schema.object({
  autocomplete: _configSchema.schema.object({
    querySuggestions: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }),
    valueSuggestions: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      tiers: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal('data_content'), _configSchema.schema.literal('data_hot'), _configSchema.schema.literal('data_warm'), _configSchema.schema.literal('data_cold'), _configSchema.schema.literal('data_frozen')]), {
        defaultValue: ['data_hot', 'data_warm', 'data_content', 'data_cold']
      }),
      terminateAfter: _configSchema.schema.duration({
        defaultValue: 100000
      }),
      timeout: _configSchema.schema.duration({
        defaultValue: 1000
      })
    })
  }),
  search: _configSchema.schema.object({
    aggs: _configSchema.schema.object({
      shardDelay: _configSchema.schema.object({
        // Whether or not to register the shard_delay (which is only available in snapshot versions
        // of Elasticsearch) agg type/expression function to make it available in the UI for either
        // functional or manual testing
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    })
  })
});

exports.configSchema = configSchema;

const searchSessionsConfigSchema = _configSchema.schema.object({
  /**
   * Turns the feature on \ off (incl. removing indicator and management screens)
   */
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),

  /**
   * pageSize controls how many search session objects we load at once while monitoring
   * session completion
   */
  pageSize: _configSchema.schema.number({
    defaultValue: 100
  }),

  /**
   * trackingInterval controls how often we track persisted search session objects progress
   */
  trackingInterval: _configSchema.schema.duration({
    defaultValue: '10s'
  }),

  /**
   * cleanupInterval controls how often we track non-persisted search session objects for cleanup
   */
  cleanupInterval: _configSchema.schema.duration({
    defaultValue: '60s'
  }),

  /**
   * expireInterval controls how often we track persisted search session objects for expiration
   */
  expireInterval: _configSchema.schema.duration({
    defaultValue: '60m'
  }),

  /**
   * monitoringTaskTimeout controls for how long task manager waits for search session monitoring task to complete before considering it timed out,
   * If tasks timeouts it receives cancel signal and next task starts in "trackingInterval" time
   */
  monitoringTaskTimeout: _configSchema.schema.duration({
    defaultValue: '5m'
  }),

  /**
   * notTouchedTimeout controls how long do we store unpersisted search session results,
   * after the last search in the session has completed
   */
  notTouchedTimeout: _configSchema.schema.duration({
    defaultValue: '5m'
  }),

  /**
   * notTouchedInProgressTimeout controls how long do allow a search session to run after
   * a user has navigated away without persisting
   */
  notTouchedInProgressTimeout: _configSchema.schema.duration({
    defaultValue: '1m'
  }),

  /**
   * maxUpdateRetries controls how many retries we perform while attempting to save a search session
   */
  maxUpdateRetries: _configSchema.schema.number({
    defaultValue: 3
  }),

  /**
   * defaultExpiration controls how long search sessions are valid for, until they are expired.
   */
  defaultExpiration: _configSchema.schema.duration({
    defaultValue: '7d'
  }),
  management: _configSchema.schema.object({
    /**
     * maxSessions controls how many saved search sessions we display per page on the management screen.
     */
    maxSessions: _configSchema.schema.number({
      defaultValue: 10000
    }),

    /**
     * refreshInterval controls how often we refresh the management screen.
     */
    refreshInterval: _configSchema.schema.duration({
      defaultValue: '10s'
    }),

    /**
     * refreshTimeout controls how often we refresh the management screen.
     */
    refreshTimeout: _configSchema.schema.duration({
      defaultValue: '1m'
    }),
    expiresSoonWarning: _configSchema.schema.duration({
      defaultValue: '1d'
    })
  })
});

exports.searchSessionsConfigSchema = searchSessionsConfigSchema;