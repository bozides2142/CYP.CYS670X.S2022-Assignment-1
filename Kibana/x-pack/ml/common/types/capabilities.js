"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicLicenseMlCapabilities = exports.apmUserMlCapabilities = exports.adminMlCapabilities = void 0;
exports.getDefaultCapabilities = getDefaultCapabilities;
exports.getPluginPrivileges = getPluginPrivileges;
exports.userMlCapabilities = void 0;

var _app = require("../constants/app");

var _saved_objects = require("./saved_objects");

var _alerts = require("../constants/alerts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const apmUserMlCapabilities = {
  canGetJobs: false,
  canAccessML: false
};
exports.apmUserMlCapabilities = apmUserMlCapabilities;
const userMlCapabilities = {
  canAccessML: false,
  // Anomaly Detection
  canGetJobs: false,
  canGetDatafeeds: false,
  // Calendars
  canGetCalendars: false,
  // File Data Visualizer
  canFindFileStructure: false,
  // Data Frame Analytics
  canGetDataFrameAnalytics: false,
  // Annotations
  canGetAnnotations: false,
  canCreateAnnotation: false,
  canDeleteAnnotation: false,
  // Alerts
  canUseMlAlerts: false
};
exports.userMlCapabilities = userMlCapabilities;
const adminMlCapabilities = {
  // Anomaly Detection
  canCreateJob: false,
  canDeleteJob: false,
  canOpenJob: false,
  canCloseJob: false,
  canResetJob: false,
  canUpdateJob: false,
  canForecastJob: false,
  canCreateDatafeed: false,
  canDeleteDatafeed: false,
  canStartStopDatafeed: false,
  canUpdateDatafeed: false,
  canPreviewDatafeed: false,
  // Filters
  canGetFilters: false,
  // Calendars
  canCreateCalendar: false,
  canDeleteCalendar: false,
  // Filters
  canCreateFilter: false,
  canDeleteFilter: false,
  // Data Frame Analytics
  canCreateDataFrameAnalytics: false,
  canDeleteDataFrameAnalytics: false,
  canStartStopDataFrameAnalytics: false,
  // Alerts
  canCreateMlAlerts: false,
  canUseMlAlerts: false,
  // Model management
  canViewMlNodes: false
};
exports.adminMlCapabilities = adminMlCapabilities;
const basicLicenseMlCapabilities = ['canAccessML', 'canFindFileStructure'];
exports.basicLicenseMlCapabilities = basicLicenseMlCapabilities;

function getDefaultCapabilities() {
  return { ...userMlCapabilities,
    ...adminMlCapabilities
  };
}

function getPluginPrivileges() {
  const apmUserMlCapabilitiesKeys = Object.keys(apmUserMlCapabilities);
  const userMlCapabilitiesKeys = Object.keys(userMlCapabilities);
  const adminMlCapabilitiesKeys = Object.keys(adminMlCapabilities);
  const allMlCapabilitiesKeys = [...adminMlCapabilitiesKeys, ...userMlCapabilitiesKeys]; // TODO: include ML in base privileges for the `8.0` release: https://github.com/elastic/kibana/issues/71422

  const savedObjects = ['index-pattern', 'dashboard', 'search', 'visualization', _saved_objects.ML_SAVED_OBJECT_TYPE];
  const privilege = {
    app: [_app.PLUGIN_ID, 'kibana'],
    excludeFromBasePrivileges: false,
    management: {
      insightsAndAlerting: ['jobsListLink']
    },
    catalogue: [_app.PLUGIN_ID]
  };
  return {
    admin: { ...privilege,
      api: ['fileUpload:analyzeFile', ...allMlCapabilitiesKeys.map(k => `ml:${k}`)],
      catalogue: [_app.PLUGIN_ID, `${_app.PLUGIN_ID}_file_data_visualizer`],
      ui: allMlCapabilitiesKeys,
      savedObject: {
        all: savedObjects,
        read: savedObjects
      },
      alerting: {
        rule: {
          all: Object.values(_alerts.ML_ALERT_TYPES)
        },
        alert: {
          all: Object.values(_alerts.ML_ALERT_TYPES)
        }
      }
    },
    user: { ...privilege,
      api: ['fileUpload:analyzeFile', ...userMlCapabilitiesKeys.map(k => `ml:${k}`)],
      catalogue: [_app.PLUGIN_ID],
      management: {
        insightsAndAlerting: []
      },
      ui: userMlCapabilitiesKeys,
      savedObject: {
        all: [],
        read: savedObjects
      },
      alerting: {
        rule: {
          read: Object.values(_alerts.ML_ALERT_TYPES)
        },
        alert: {
          read: Object.values(_alerts.ML_ALERT_TYPES)
        }
      }
    },
    apmUser: {
      excludeFromBasePrivileges: true,
      app: [],
      catalogue: [],
      savedObject: {
        all: [],
        read: [_saved_objects.ML_SAVED_OBJECT_TYPE]
      },
      api: apmUserMlCapabilitiesKeys.map(k => `ml:${k}`),
      ui: apmUserMlCapabilitiesKeys
    }
  };
}