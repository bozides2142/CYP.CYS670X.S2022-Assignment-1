"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USAGE_FETCH_INTERVAL = exports.TELEMETRY_QUERY_SOURCE = exports.TELEMETRY_METRIC_BUTTON_CLICK = exports.TELEMETRY_COLLECTION_INTERVAL = exports.STORAGE_KEY = exports.STANDALONE_CLUSTER_CLUSTER_UUID = exports.SORT_DESCENDING = exports.SORT_ASCENDING = exports.SAVED_OBJECT_TELEMETRY = exports.RULE_THREAD_POOL_WRITE_REJECTIONS = exports.RULE_THREAD_POOL_SEARCH_REJECTIONS = exports.RULE_REQUIRES_APP_CONTEXT = exports.RULE_PREFIX = exports.RULE_PANEL_MENU = exports.RULE_NODES_CHANGED = exports.RULE_MISSING_MONITORING_DATA = exports.RULE_MEMORY_USAGE = exports.RULE_LOGSTASH_VERSION_MISMATCH = exports.RULE_LICENSE_EXPIRATION = exports.RULE_LARGE_SHARD_SIZE = exports.RULE_KIBANA_VERSION_MISMATCH = exports.RULE_ELASTICSEARCH_VERSION_MISMATCH = exports.RULE_DISK_USAGE = exports.RULE_DETAILS = exports.RULE_CPU_USAGE = exports.RULE_CLUSTER_HEALTH = exports.RULE_CCR_READ_EXCEPTIONS = exports.RULES = exports.REPORTING_SYSTEM_ID = exports.NORMALIZED_DERIVATIVE_UNIT = exports.MONITORING_SYSTEM_API_VERSION = exports.ML_SUPPORTED_LICENSES = exports.METRICBEAT_INDEX_NAME_UNIQUE_TOKEN = exports.LOGSTASH_SYSTEM_ID = exports.LOGSTASH = exports.LOGGING_TAG = exports.LEGACY_RULE_DETAILS = exports.LEGACY_RULES = exports.KIBANA_SYSTEM_ID = exports.KIBANA_STATS_TYPE_MONITORING = exports.KIBANA_SETTINGS_TYPE = exports.KIBANA_MONITORING_LOGGING_TAG = exports.INFRA_SOURCE_ID = exports.INDEX_PATTERN_LOGSTASH = exports.INDEX_PATTERN_KIBANA = exports.INDEX_PATTERN_ENTERPRISE_SEARCH = exports.INDEX_PATTERN_ELASTICSEARCH_ECS = exports.INDEX_PATTERN_ELASTICSEARCH = exports.INDEX_PATTERN_BEATS = exports.INDEX_PATTERN = exports.INDEX_ALERTS = exports.FORMAT_DURATION_TEMPLATE_TINY = exports.FORMAT_DURATION_TEMPLATE_SHORT = exports.FORMAT_DURATION_TEMPLATE_LONG = exports.EUI_SORT_DESCENDING = exports.EUI_SORT_ASCENDING = exports.ENTERPRISE_SEARCH_SYSTEM_ID = exports.ELASTICSEARCH_SYSTEM_ID = exports.DS_INDEX_PATTERN_METRICS = exports.DS_INDEX_PATTERN_LOGS = exports.DS_INDEX_PATTERN_ES = exports.DEBOUNCE_SLOW_MS = exports.DEBOUNCE_FAST_MS = exports.CODE_PATH_ML = exports.CODE_PATH_LOGSTASH = exports.CODE_PATH_LOGS = exports.CODE_PATH_LICENSE = exports.CODE_PATH_KIBANA = exports.CODE_PATH_ENTERPRISE_SEARCH = exports.CODE_PATH_ELASTICSEARCH = exports.CODE_PATH_BEATS = exports.CODE_PATH_APM = exports.CODE_PATH_ALL = exports.CODE_PATH_ALERTS = exports.CLUSTER_DETAILS_FETCH_INTERVAL = exports.CLUSTER_ALERTS_SEARCH_SIZE = exports.CLUSTER_ALERTS_ADDRESS_CONFIG_KEY = exports.CHART_TEXT_COLOR = exports.CHART_LINE_COLOR = exports.CALCULATE_DURATION_UNTIL = exports.CALCULATE_DURATION_SINCE = exports.BEATS_SYSTEM_ID = exports.APM_SYSTEM_ID = exports.ALERT_EMAIL_SERVICES = exports.ALERT_ACTION_TYPE_LOG = exports.ALERT_ACTION_TYPE_EMAIL = void 0;

var _i18n = require("@kbn/i18n");

var _enums = require("./enums");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper string to add as a tag in every logging call
 */


const LOGGING_TAG = 'monitoring';
/**
 * Helper string to add as a tag in every logging call related to Kibana monitoring
 */

exports.LOGGING_TAG = LOGGING_TAG;
const KIBANA_MONITORING_LOGGING_TAG = 'kibana-monitoring';
/**
 * The Monitoring API version is the expected API format that we export and expect to import.
 * @type {string}
 */

exports.KIBANA_MONITORING_LOGGING_TAG = KIBANA_MONITORING_LOGGING_TAG;
const MONITORING_SYSTEM_API_VERSION = '7';
/**
 * The type name used within the Monitoring index to publish Kibana ops stats.
 * @type {string}
 */

exports.MONITORING_SYSTEM_API_VERSION = MONITORING_SYSTEM_API_VERSION;
const KIBANA_STATS_TYPE_MONITORING = 'kibana_stats'; // similar to KIBANA_STATS_TYPE but rolled up into 10s stats from 5s intervals through ops_buffer

/**
 * The type name used within the Monitoring index to publish Kibana stats.
 * @type {string}
 */

exports.KIBANA_STATS_TYPE_MONITORING = KIBANA_STATS_TYPE_MONITORING;
const KIBANA_SETTINGS_TYPE = 'kibana_settings';
/*
 * Key for the localStorage service
 */

exports.KIBANA_SETTINGS_TYPE = KIBANA_SETTINGS_TYPE;
const STORAGE_KEY = 'xpack.monitoring.data';
/**
 * Units for derivative metric values
 */

exports.STORAGE_KEY = STORAGE_KEY;
const NORMALIZED_DERIVATIVE_UNIT = '1s';
/*
 * Values for column sorting in table options
 * @type {number} 1 or -1
 */

exports.NORMALIZED_DERIVATIVE_UNIT = NORMALIZED_DERIVATIVE_UNIT;
const EUI_SORT_ASCENDING = 'asc';
exports.EUI_SORT_ASCENDING = EUI_SORT_ASCENDING;
const EUI_SORT_DESCENDING = 'desc';
exports.EUI_SORT_DESCENDING = EUI_SORT_DESCENDING;
const SORT_ASCENDING = 1;
exports.SORT_ASCENDING = SORT_ASCENDING;
const SORT_DESCENDING = -1;
/*
 * Chart colors
 * @type {string}
 */

exports.SORT_DESCENDING = SORT_DESCENDING;
const CHART_LINE_COLOR = '#d2d2d2';
exports.CHART_LINE_COLOR = CHART_LINE_COLOR;
const CHART_TEXT_COLOR = '#9c9c9c';
/*
 * Number of cluster alerts to show on overview page
 * @type {number}
 */

exports.CHART_TEXT_COLOR = CHART_TEXT_COLOR;
const CLUSTER_ALERTS_SEARCH_SIZE = 3;
/*
 * Format for moment-duration-format timestamp-to-duration template if the time diffs are gte 1 month
 * @type {string}
 */

exports.CLUSTER_ALERTS_SEARCH_SIZE = CLUSTER_ALERTS_SEARCH_SIZE;
const FORMAT_DURATION_TEMPLATE_LONG = 'M [months] d [days]';
/*
 * Format for moment-duration-format timestamp-to-duration template if the time diffs are lt 1 month but gt 1 minute
 * @type {string}
 */

exports.FORMAT_DURATION_TEMPLATE_LONG = FORMAT_DURATION_TEMPLATE_LONG;
const FORMAT_DURATION_TEMPLATE_SHORT = ' d [days] h [hrs] m [min]';
/*
 * Format for moment-duration-format timestamp-to-duration template if the time diffs are lt 1 minute
 * @type {string}
 */

exports.FORMAT_DURATION_TEMPLATE_SHORT = FORMAT_DURATION_TEMPLATE_SHORT;
const FORMAT_DURATION_TEMPLATE_TINY = ' s [seconds]';
/*
 * Simple unique values for Timestamp to duration flags. These are used for
 * determining if calculation should be formatted as "time until" (now to
 * timestamp) or "time since" (timestamp to now)
 */

exports.FORMAT_DURATION_TEMPLATE_TINY = FORMAT_DURATION_TEMPLATE_TINY;
const CALCULATE_DURATION_SINCE = 'since';
exports.CALCULATE_DURATION_SINCE = CALCULATE_DURATION_SINCE;
const CALCULATE_DURATION_UNTIL = 'until';
/**
 * In order to show ML Jobs tab in the Elasticsearch section / tab navigation, license must be supported
 */

exports.CALCULATE_DURATION_UNTIL = CALCULATE_DURATION_UNTIL;
const ML_SUPPORTED_LICENSES = ['trial', 'platinum', 'enterprise'];
/**
 * Constants used by Logstash monitoring code
 */

exports.ML_SUPPORTED_LICENSES = ML_SUPPORTED_LICENSES;
const LOGSTASH = {
  MAJOR_VER_REQD_FOR_PIPELINES: 6,

  /*
   * Names ES keys on for different Logstash pipeline queues.
   * @type {string}
   */
  QUEUE_TYPES: {
    MEMORY: 'memory',
    PERSISTED: 'persisted'
  }
};
exports.LOGSTASH = LOGSTASH;
const DEBOUNCE_SLOW_MS = 17; // roughly how long it takes to render a frame at 60fps

exports.DEBOUNCE_SLOW_MS = DEBOUNCE_SLOW_MS;
const DEBOUNCE_FAST_MS = 10; // roughly how long it takes to render a frame at 100fps

/**
 * Configuration key for setting the email address used for cluster alert notifications.
 */

exports.DEBOUNCE_FAST_MS = DEBOUNCE_FAST_MS;
const CLUSTER_ALERTS_ADDRESS_CONFIG_KEY = 'cluster_alerts.email_notifications.email_address';
exports.CLUSTER_ALERTS_ADDRESS_CONFIG_KEY = CLUSTER_ALERTS_ADDRESS_CONFIG_KEY;
const STANDALONE_CLUSTER_CLUSTER_UUID = '__standalone_cluster__';
exports.STANDALONE_CLUSTER_CLUSTER_UUID = STANDALONE_CLUSTER_CLUSTER_UUID;
const INDEX_PATTERN = '.monitoring-*';
exports.INDEX_PATTERN = INDEX_PATTERN;
const INDEX_PATTERN_KIBANA = '.monitoring-kibana-*';
exports.INDEX_PATTERN_KIBANA = INDEX_PATTERN_KIBANA;
const INDEX_PATTERN_LOGSTASH = '.monitoring-logstash-*';
exports.INDEX_PATTERN_LOGSTASH = INDEX_PATTERN_LOGSTASH;
const INDEX_PATTERN_BEATS = '.monitoring-beats-*';
exports.INDEX_PATTERN_BEATS = INDEX_PATTERN_BEATS;
const INDEX_ALERTS = '.monitoring-alerts-*';
exports.INDEX_ALERTS = INDEX_ALERTS;
const INDEX_PATTERN_ELASTICSEARCH = '.monitoring-es-*'; // ECS-compliant patterns (metricbeat >8 and agent)

exports.INDEX_PATTERN_ELASTICSEARCH = INDEX_PATTERN_ELASTICSEARCH;
const INDEX_PATTERN_ELASTICSEARCH_ECS = '.monitoring-es-8-*';
exports.INDEX_PATTERN_ELASTICSEARCH_ECS = INDEX_PATTERN_ELASTICSEARCH_ECS;
const INDEX_PATTERN_ENTERPRISE_SEARCH = '.monitoring-ent-search-*';
exports.INDEX_PATTERN_ENTERPRISE_SEARCH = INDEX_PATTERN_ENTERPRISE_SEARCH;
const DS_INDEX_PATTERN_METRICS = 'metrics';
exports.DS_INDEX_PATTERN_METRICS = DS_INDEX_PATTERN_METRICS;
const DS_INDEX_PATTERN_LOGS = 'logs';
exports.DS_INDEX_PATTERN_LOGS = DS_INDEX_PATTERN_LOGS;
const DS_INDEX_PATTERN_ES = 'elasticsearch'; // This is the unique token that exists in monitoring indices collected by metricbeat

exports.DS_INDEX_PATTERN_ES = DS_INDEX_PATTERN_ES;
const METRICBEAT_INDEX_NAME_UNIQUE_TOKEN = '-mb-'; // We use this for metricbeat migration to identify specific products that we do not have constants for

exports.METRICBEAT_INDEX_NAME_UNIQUE_TOKEN = METRICBEAT_INDEX_NAME_UNIQUE_TOKEN;
const ELASTICSEARCH_SYSTEM_ID = 'elasticsearch';
/**
 * The id of the infra source owned by the monitoring plugin.
 */

exports.ELASTICSEARCH_SYSTEM_ID = ELASTICSEARCH_SYSTEM_ID;
const INFRA_SOURCE_ID = 'internal-stack-monitoring';
/*
 * These constants represent code paths within `getClustersFromRequest`
 * that an api call wants to invoke. This is meant as an optimization to
 * avoid unnecessary ES queries (looking at you logstash) when the data
 * is not used. In the long term, it'd be nice to have separate api calls
 * instead of this path logic.
 */

exports.INFRA_SOURCE_ID = INFRA_SOURCE_ID;
const CODE_PATH_ALL = 'all';
exports.CODE_PATH_ALL = CODE_PATH_ALL;
const CODE_PATH_ALERTS = 'alerts';
exports.CODE_PATH_ALERTS = CODE_PATH_ALERTS;
const CODE_PATH_KIBANA = 'kibana';
exports.CODE_PATH_KIBANA = CODE_PATH_KIBANA;
const CODE_PATH_ELASTICSEARCH = 'elasticsearch';
exports.CODE_PATH_ELASTICSEARCH = CODE_PATH_ELASTICSEARCH;
const CODE_PATH_ML = 'ml';
exports.CODE_PATH_ML = CODE_PATH_ML;
const CODE_PATH_BEATS = 'beats';
exports.CODE_PATH_BEATS = CODE_PATH_BEATS;
const CODE_PATH_LOGSTASH = 'logstash';
exports.CODE_PATH_LOGSTASH = CODE_PATH_LOGSTASH;
const CODE_PATH_APM = 'apm';
exports.CODE_PATH_APM = CODE_PATH_APM;
const CODE_PATH_LICENSE = 'license';
exports.CODE_PATH_LICENSE = CODE_PATH_LICENSE;
const CODE_PATH_LOGS = 'logs';
exports.CODE_PATH_LOGS = CODE_PATH_LOGS;
const CODE_PATH_ENTERPRISE_SEARCH = 'enterprise_search';
/**
 * The header sent by telemetry service when hitting Elasticsearch to identify query source
 * @type {string}
 */

exports.CODE_PATH_ENTERPRISE_SEARCH = CODE_PATH_ENTERPRISE_SEARCH;
const TELEMETRY_QUERY_SOURCE = 'TELEMETRY';
/**
 * The name of the Kibana System ID used to publish and look up Kibana stats through the Monitoring system.
 * @type {string}
 */

exports.TELEMETRY_QUERY_SOURCE = TELEMETRY_QUERY_SOURCE;
const KIBANA_SYSTEM_ID = 'kibana';
/**
 * The name of the Beats System ID used to publish and look up Beats stats through the Monitoring system.
 * @type {string}
 */

exports.KIBANA_SYSTEM_ID = KIBANA_SYSTEM_ID;
const BEATS_SYSTEM_ID = 'beats';
/**
 * The name of the Enterprise Search System ID used to publish and look up Enterprise Search stats through the Monitoring system.
 * @type {string}
 */

exports.BEATS_SYSTEM_ID = BEATS_SYSTEM_ID;
const ENTERPRISE_SEARCH_SYSTEM_ID = 'enterprise_search';
/**
 * The name of the Apm System ID used to publish and look up Apm stats through the Monitoring system.
 * @type {string}
 */

exports.ENTERPRISE_SEARCH_SYSTEM_ID = ENTERPRISE_SEARCH_SYSTEM_ID;
const APM_SYSTEM_ID = 'apm';
/**
 * The name of the Kibana System ID used to look up Logstash stats through the Monitoring system.
 * @type {string}
 */

exports.APM_SYSTEM_ID = APM_SYSTEM_ID;
const LOGSTASH_SYSTEM_ID = 'logstash';
/**
 * The name of the Kibana System ID used to look up Reporting stats through the Monitoring system.
 * @type {string}
 */

exports.LOGSTASH_SYSTEM_ID = LOGSTASH_SYSTEM_ID;
const REPORTING_SYSTEM_ID = 'reporting';
/**
 * The amount of time, in milliseconds, to wait between collecting kibana stats from es.
 *
 * Currently 24 hours kept in sync with reporting interval.
 * @type {Number}
 */

exports.REPORTING_SYSTEM_ID = REPORTING_SYSTEM_ID;
const TELEMETRY_COLLECTION_INTERVAL = 86400000;
/**
 * The amount of time, in milliseconds, to fetch the cluster uuids from es.
 *
 * Currently 3 hours.
 * @type {Number}
 */

exports.TELEMETRY_COLLECTION_INTERVAL = TELEMETRY_COLLECTION_INTERVAL;
const CLUSTER_DETAILS_FETCH_INTERVAL = 10800000;
/**
 * The amount of time, in milliseconds, to fetch the usage data from es.
 *
 * Currently 20 minutes.
 * @type {Number}
 */

exports.CLUSTER_DETAILS_FETCH_INTERVAL = CLUSTER_DETAILS_FETCH_INTERVAL;
const USAGE_FETCH_INTERVAL = 1200000;
/**
 * The prefix for all rule types used by monitoring
 */

exports.USAGE_FETCH_INTERVAL = USAGE_FETCH_INTERVAL;
const RULE_PREFIX = 'monitoring_';
exports.RULE_PREFIX = RULE_PREFIX;
const RULE_LICENSE_EXPIRATION = `${RULE_PREFIX}alert_license_expiration`;
exports.RULE_LICENSE_EXPIRATION = RULE_LICENSE_EXPIRATION;
const RULE_CLUSTER_HEALTH = `${RULE_PREFIX}alert_cluster_health`;
exports.RULE_CLUSTER_HEALTH = RULE_CLUSTER_HEALTH;
const RULE_CPU_USAGE = `${RULE_PREFIX}alert_cpu_usage`;
exports.RULE_CPU_USAGE = RULE_CPU_USAGE;
const RULE_DISK_USAGE = `${RULE_PREFIX}alert_disk_usage`;
exports.RULE_DISK_USAGE = RULE_DISK_USAGE;
const RULE_NODES_CHANGED = `${RULE_PREFIX}alert_nodes_changed`;
exports.RULE_NODES_CHANGED = RULE_NODES_CHANGED;
const RULE_ELASTICSEARCH_VERSION_MISMATCH = `${RULE_PREFIX}alert_elasticsearch_version_mismatch`;
exports.RULE_ELASTICSEARCH_VERSION_MISMATCH = RULE_ELASTICSEARCH_VERSION_MISMATCH;
const RULE_KIBANA_VERSION_MISMATCH = `${RULE_PREFIX}alert_kibana_version_mismatch`;
exports.RULE_KIBANA_VERSION_MISMATCH = RULE_KIBANA_VERSION_MISMATCH;
const RULE_LOGSTASH_VERSION_MISMATCH = `${RULE_PREFIX}alert_logstash_version_mismatch`;
exports.RULE_LOGSTASH_VERSION_MISMATCH = RULE_LOGSTASH_VERSION_MISMATCH;
const RULE_MEMORY_USAGE = `${RULE_PREFIX}alert_jvm_memory_usage`;
exports.RULE_MEMORY_USAGE = RULE_MEMORY_USAGE;
const RULE_MISSING_MONITORING_DATA = `${RULE_PREFIX}alert_missing_monitoring_data`;
exports.RULE_MISSING_MONITORING_DATA = RULE_MISSING_MONITORING_DATA;
const RULE_THREAD_POOL_SEARCH_REJECTIONS = `${RULE_PREFIX}alert_thread_pool_search_rejections`;
exports.RULE_THREAD_POOL_SEARCH_REJECTIONS = RULE_THREAD_POOL_SEARCH_REJECTIONS;
const RULE_THREAD_POOL_WRITE_REJECTIONS = `${RULE_PREFIX}alert_thread_pool_write_rejections`;
exports.RULE_THREAD_POOL_WRITE_REJECTIONS = RULE_THREAD_POOL_WRITE_REJECTIONS;
const RULE_CCR_READ_EXCEPTIONS = `${RULE_PREFIX}ccr_read_exceptions`;
exports.RULE_CCR_READ_EXCEPTIONS = RULE_CCR_READ_EXCEPTIONS;
const RULE_LARGE_SHARD_SIZE = `${RULE_PREFIX}shard_size`;
/**
 * Legacy rules details/label for server and public use
 */

exports.RULE_LARGE_SHARD_SIZE = RULE_LARGE_SHARD_SIZE;
const LEGACY_RULE_DETAILS = {
  [RULE_CLUSTER_HEALTH]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.label', {
      defaultMessage: 'Cluster health'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.description', {
      defaultMessage: 'Alert when the health of the cluster changes.'
    })
  },
  [RULE_ELASTICSEARCH_VERSION_MISMATCH]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.label', {
      defaultMessage: 'Elasticsearch version mismatch'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.description', {
      defaultMessage: 'Alert when the cluster has multiple versions of Elasticsearch.'
    })
  },
  [RULE_KIBANA_VERSION_MISMATCH]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.label', {
      defaultMessage: 'Kibana version mismatch'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.description', {
      defaultMessage: 'Alert when the cluser has multiple versions of Kibana.'
    })
  },
  [RULE_LICENSE_EXPIRATION]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.label', {
      defaultMessage: 'License expiration'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.description', {
      defaultMessage: 'Alert when the cluster license is about to expire.'
    })
  },
  [RULE_LOGSTASH_VERSION_MISMATCH]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.label', {
      defaultMessage: 'Logstash version mismatch'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.description', {
      defaultMessage: 'Alert when the cluster has multiple versions of Logstash.'
    })
  },
  [RULE_NODES_CHANGED]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.label', {
      defaultMessage: 'Nodes changed'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.description', {
      defaultMessage: 'Alert when adding, removing, or restarting a node.'
    })
  }
};
/**
 * Rules details/label for server and public use
 */

exports.LEGACY_RULE_DETAILS = LEGACY_RULE_DETAILS;
const RULE_DETAILS = {
  [RULE_CPU_USAGE]: {
    label: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.label', {
      defaultMessage: 'CPU Usage'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.description', {
      defaultMessage: 'Alert when the CPU load for a node is consistently high.'
    }),
    paramDetails: {
      threshold: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.paramDetails.threshold.label', {
          defaultMessage: `Notify when CPU is over`
        }),
        type: _enums.AlertParamType.Percentage
      },
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.paramDetails.duration.label', {
          defaultMessage: `Look at the average over`
        }),
        type: _enums.AlertParamType.Duration
      }
    }
  },
  [RULE_DISK_USAGE]: {
    paramDetails: {
      threshold: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.paramDetails.threshold.label', {
          defaultMessage: `Notify when disk capacity is over`
        }),
        type: _enums.AlertParamType.Percentage
      },
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.paramDetails.duration.label', {
          defaultMessage: `Look at the average over`
        }),
        type: _enums.AlertParamType.Duration
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.label', {
      defaultMessage: 'Disk Usage'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.description', {
      defaultMessage: 'Alert when the disk usage for a node is consistently high.'
    })
  },
  [RULE_MEMORY_USAGE]: {
    paramDetails: {
      threshold: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.paramDetails.threshold.label', {
          defaultMessage: `Notify when memory usage is over`
        }),
        type: _enums.AlertParamType.Percentage
      },
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.paramDetails.duration.label', {
          defaultMessage: `Look at the average over`
        }),
        type: _enums.AlertParamType.Duration
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.label', {
      defaultMessage: 'Memory Usage (JVM)'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.description', {
      defaultMessage: 'Alert when a node reports high memory usage.'
    })
  },
  [RULE_MISSING_MONITORING_DATA]: {
    paramDetails: {
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.paramDetails.duration.label', {
          defaultMessage: `Notify if monitoring data is missing for the last`
        }),
        type: _enums.AlertParamType.Duration
      },
      limit: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.paramDetails.limit.label', {
          defaultMessage: `looking back`
        }),
        type: _enums.AlertParamType.Duration
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.label', {
      defaultMessage: 'Missing monitoring data'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.description', {
      defaultMessage: 'Alert when monitoring data is missing.'
    })
  },
  [RULE_THREAD_POOL_SEARCH_REJECTIONS]: {
    paramDetails: {
      threshold: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.rejection.paramDetails.threshold.label', {
          defaultMessage: `Notify when {type} rejection count is over`,
          values: {
            type: 'search'
          }
        }),
        type: _enums.AlertParamType.Number
      },
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.rejection.paramDetails.duration.label', {
          defaultMessage: `In the last`
        }),
        type: _enums.AlertParamType.Duration
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.label', {
      defaultMessage: 'Thread pool {type} rejections',
      values: {
        type: 'search'
      }
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.searchThreadPoolRejections.description', {
      defaultMessage: 'Alert when the number of rejections in the search thread pool exceeds the threshold.'
    })
  },
  [RULE_THREAD_POOL_WRITE_REJECTIONS]: {
    paramDetails: {
      threshold: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.rejection.paramDetails.threshold.label', {
          defaultMessage: `Notify when {type} rejection count is over`,
          values: {
            type: 'write'
          }
        }),
        type: _enums.AlertParamType.Number
      },
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.rejection.paramDetails.duration.label', {
          defaultMessage: `In the last`
        }),
        type: _enums.AlertParamType.Duration
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.label', {
      defaultMessage: 'Thread pool {type} rejections',
      values: {
        type: 'write'
      }
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.writeThreadPoolRejections.description', {
      defaultMessage: 'Alert when the number of rejections in the write thread pool exceeds the threshold.'
    })
  },
  [RULE_CCR_READ_EXCEPTIONS]: {
    paramDetails: {
      duration: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.paramDetails.duration.label', {
          defaultMessage: `In the last`
        }),
        type: _enums.AlertParamType.Duration
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.label', {
      defaultMessage: 'CCR read exceptions'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.description', {
      defaultMessage: 'Alert if any CCR read exceptions have been detected.'
    })
  },
  [RULE_LARGE_SHARD_SIZE]: {
    paramDetails: {
      threshold: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.paramDetails.threshold.label', {
          defaultMessage: `Notify when average shard size exceeds this value`
        }),
        type: _enums.AlertParamType.Number,
        append: 'GB'
      },
      indexPattern: {
        label: _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.paramDetails.indexPattern.label', {
          defaultMessage: `Check the following index patterns`
        }),
        placeholder: 'eg: data-*, *prod-data, -.internal-data*',
        type: _enums.AlertParamType.TextField
      }
    },
    label: _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.label', {
      defaultMessage: 'Shard size'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.description', {
      defaultMessage: 'Alert if the average shard size is larger than the configured threshold.'
    })
  }
};
exports.RULE_DETAILS = RULE_DETAILS;
const RULE_PANEL_MENU = [{
  label: _i18n.i18n.translate('xpack.monitoring.alerts.badge.panelCategory.clusterHealth', {
    defaultMessage: 'Cluster health'
  }),
  rules: [{
    ruleName: RULE_NODES_CHANGED
  }, {
    ruleName: RULE_CLUSTER_HEALTH
  }, {
    ruleName: RULE_ELASTICSEARCH_VERSION_MISMATCH
  }, {
    ruleName: RULE_KIBANA_VERSION_MISMATCH
  }, {
    ruleName: RULE_LOGSTASH_VERSION_MISMATCH
  }]
}, {
  label: _i18n.i18n.translate('xpack.monitoring.alerts.badge.panelCategory.resourceUtilization', {
    defaultMessage: 'Resource utilization'
  }),
  rules: [{
    ruleName: RULE_CPU_USAGE
  }, {
    ruleName: RULE_DISK_USAGE
  }, {
    ruleName: RULE_MEMORY_USAGE
  }, {
    ruleName: RULE_LARGE_SHARD_SIZE
  }]
}, {
  label: _i18n.i18n.translate('xpack.monitoring.alerts.badge.panelCategory.errors', {
    defaultMessage: 'Errors and exceptions'
  }),
  rules: [{
    ruleName: RULE_MISSING_MONITORING_DATA
  }, {
    ruleName: RULE_LICENSE_EXPIRATION
  }, {
    ruleName: RULE_THREAD_POOL_SEARCH_REJECTIONS
  }, {
    ruleName: RULE_THREAD_POOL_WRITE_REJECTIONS
  }, {
    ruleName: RULE_CCR_READ_EXCEPTIONS
  }]
}];
/**
 * A listing of all rule types
 */

exports.RULE_PANEL_MENU = RULE_PANEL_MENU;
const RULES = [RULE_LICENSE_EXPIRATION, RULE_CLUSTER_HEALTH, RULE_CPU_USAGE, RULE_DISK_USAGE, RULE_NODES_CHANGED, RULE_ELASTICSEARCH_VERSION_MISMATCH, RULE_KIBANA_VERSION_MISMATCH, RULE_LOGSTASH_VERSION_MISMATCH, RULE_MEMORY_USAGE, RULE_MISSING_MONITORING_DATA, RULE_THREAD_POOL_SEARCH_REJECTIONS, RULE_THREAD_POOL_WRITE_REJECTIONS, RULE_CCR_READ_EXCEPTIONS, RULE_LARGE_SHARD_SIZE];
/**
 * A list of all legacy rules, which means they are powered by watcher
 */

exports.RULES = RULES;
const LEGACY_RULES = [RULE_LICENSE_EXPIRATION, RULE_CLUSTER_HEALTH, RULE_NODES_CHANGED, RULE_ELASTICSEARCH_VERSION_MISMATCH, RULE_KIBANA_VERSION_MISMATCH, RULE_LOGSTASH_VERSION_MISMATCH];
/**
 * Matches the id for the built-in in email action type
 * See x-pack/plugins/actions/server/builtin_action_types/email.ts
 */

exports.LEGACY_RULES = LEGACY_RULES;
const ALERT_ACTION_TYPE_EMAIL = '.email';
/**
 * Matches the id for the built-in in log action type
 * See x-pack/plugins/actions/server/builtin_action_types/log.ts
 */

exports.ALERT_ACTION_TYPE_EMAIL = ALERT_ACTION_TYPE_EMAIL;
const ALERT_ACTION_TYPE_LOG = '.server-log';
/**
 * To enable modifing of rules in under actions
 */

exports.ALERT_ACTION_TYPE_LOG = ALERT_ACTION_TYPE_LOG;
const RULE_REQUIRES_APP_CONTEXT = false;
exports.RULE_REQUIRES_APP_CONTEXT = RULE_REQUIRES_APP_CONTEXT;
const ALERT_EMAIL_SERVICES = ['gmail', 'hotmail', 'icloud', 'outlook365', 'ses', 'yahoo'];
/**
 * The saved object type for various monitoring data
 */

exports.ALERT_EMAIL_SERVICES = ALERT_EMAIL_SERVICES;
const SAVED_OBJECT_TELEMETRY = 'monitoring-telemetry';
exports.SAVED_OBJECT_TELEMETRY = SAVED_OBJECT_TELEMETRY;
const TELEMETRY_METRIC_BUTTON_CLICK = 'btnclick__';
exports.TELEMETRY_METRIC_BUTTON_CLICK = TELEMETRY_METRIC_BUTTON_CLICK;