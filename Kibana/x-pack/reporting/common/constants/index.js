"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PLUGIN_ID: true,
  REPORTING_TRANSACTION_TYPE: true,
  REPORTING_SYSTEM_INDEX: true,
  JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY: true,
  CONTENT_TYPE_CSV: true,
  CSV_REPORTING_ACTION: true,
  CSV_BOM_CHARS: true,
  CSV_FORMULA_CHARS: true,
  ALLOWED_JOB_CONTENT_TYPES: true,
  KBN_SCREENSHOT_HEADER_BLOCK_LIST: true,
  KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN: true,
  UI_SETTINGS_SEARCH_INCLUDE_FROZEN: true,
  UI_SETTINGS_CUSTOM_PDF_LOGO: true,
  UI_SETTINGS_CSV_SEPARATOR: true,
  UI_SETTINGS_CSV_QUOTE_VALUES: true,
  UI_SETTINGS_DATEFORMAT_TZ: true,
  CSV_SEARCHSOURCE_IMMEDIATE_TYPE: true,
  CSV_REPORT_TYPE_DEPRECATED: true,
  CSV_JOB_TYPE_DEPRECATED: true,
  USES_HEADLESS_JOB_TYPES: true,
  DEPRECATED_JOB_TYPES: true,
  LICENSE_TYPE_TRIAL: true,
  LICENSE_TYPE_BASIC: true,
  LICENSE_TYPE_STANDARD: true,
  LICENSE_TYPE_GOLD: true,
  LICENSE_TYPE_PLATINUM: true,
  LICENSE_TYPE_ENTERPRISE: true,
  API_BASE_URL: true,
  API_BASE_GENERATE: true,
  API_LIST_URL: true,
  API_DIAGNOSE_URL: true,
  API_GET_ILM_POLICY_STATUS: true,
  API_MIGRATE_ILM_POLICY_URL: true,
  API_BASE_URL_V1: true,
  ILM_POLICY_NAME: true,
  REPORTING_MANAGEMENT_HOME: true,
  REPORTING_REDIRECT_LOCATOR_STORE_KEY: true,
  getRedirectAppPath: true,
  JOB_STATUSES: true,
  REPORT_TABLE_ID: true,
  REPORT_TABLE_ROW_ID: true,
  UNVERSIONED_VERSION: true,
  API_GENERATE_IMMEDIATE: true
};
exports.getRedirectAppPath = exports.USES_HEADLESS_JOB_TYPES = exports.UNVERSIONED_VERSION = exports.UI_SETTINGS_SEARCH_INCLUDE_FROZEN = exports.UI_SETTINGS_DATEFORMAT_TZ = exports.UI_SETTINGS_CUSTOM_PDF_LOGO = exports.UI_SETTINGS_CSV_SEPARATOR = exports.UI_SETTINGS_CSV_QUOTE_VALUES = exports.REPORT_TABLE_ROW_ID = exports.REPORT_TABLE_ID = exports.REPORTING_TRANSACTION_TYPE = exports.REPORTING_SYSTEM_INDEX = exports.REPORTING_REDIRECT_LOCATOR_STORE_KEY = exports.REPORTING_MANAGEMENT_HOME = exports.PLUGIN_ID = exports.LICENSE_TYPE_TRIAL = exports.LICENSE_TYPE_STANDARD = exports.LICENSE_TYPE_PLATINUM = exports.LICENSE_TYPE_GOLD = exports.LICENSE_TYPE_ENTERPRISE = exports.LICENSE_TYPE_BASIC = exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN = exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST = exports.JOB_STATUSES = exports.JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY = exports.ILM_POLICY_NAME = exports.DEPRECATED_JOB_TYPES = exports.CSV_SEARCHSOURCE_IMMEDIATE_TYPE = exports.CSV_REPORT_TYPE_DEPRECATED = exports.CSV_REPORTING_ACTION = exports.CSV_JOB_TYPE_DEPRECATED = exports.CSV_FORMULA_CHARS = exports.CSV_BOM_CHARS = exports.CONTENT_TYPE_CSV = exports.API_MIGRATE_ILM_POLICY_URL = exports.API_LIST_URL = exports.API_GET_ILM_POLICY_STATUS = exports.API_GENERATE_IMMEDIATE = exports.API_DIAGNOSE_URL = exports.API_BASE_URL_V1 = exports.API_BASE_URL = exports.API_BASE_GENERATE = exports.ALLOWED_JOB_CONTENT_TYPES = void 0;

var jobTypes = _interopRequireWildcard(require("./job_types"));

Object.keys(jobTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === jobTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return jobTypes[key];
    }
  });
});

var _report_types = require("./report_types");

Object.keys(_report_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _report_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _report_types[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  PDF_JOB_TYPE,
  PDF_JOB_TYPE_V2,
  PNG_JOB_TYPE,
  PNG_JOB_TYPE_V2
} = jobTypes;
const PLUGIN_ID = 'reporting';
exports.PLUGIN_ID = PLUGIN_ID;
const REPORTING_TRANSACTION_TYPE = PLUGIN_ID;
exports.REPORTING_TRANSACTION_TYPE = REPORTING_TRANSACTION_TYPE;
const REPORTING_SYSTEM_INDEX = '.reporting';
exports.REPORTING_SYSTEM_INDEX = REPORTING_SYSTEM_INDEX;
const JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY = 'xpack.reporting.jobCompletionNotifications';
exports.JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY = JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY;
const CONTENT_TYPE_CSV = 'text/csv';
exports.CONTENT_TYPE_CSV = CONTENT_TYPE_CSV;
const CSV_REPORTING_ACTION = 'downloadCsvReport';
exports.CSV_REPORTING_ACTION = CSV_REPORTING_ACTION;
const CSV_BOM_CHARS = '\ufeff';
exports.CSV_BOM_CHARS = CSV_BOM_CHARS;
const CSV_FORMULA_CHARS = ['=', '+', '-', '@'];
exports.CSV_FORMULA_CHARS = CSV_FORMULA_CHARS;
const ALLOWED_JOB_CONTENT_TYPES = ['application/json', 'application/pdf', CONTENT_TYPE_CSV, 'image/png', 'text/plain']; // See:
// https://github.com/chromium/chromium/blob/3611052c055897e5ebbc5b73ea295092e0c20141/services/network/public/cpp/header_util_unittest.cc#L50
// For a list of headers that chromium doesn't like

exports.ALLOWED_JOB_CONTENT_TYPES = ALLOWED_JOB_CONTENT_TYPES;
const KBN_SCREENSHOT_HEADER_BLOCK_LIST = ['accept-encoding', 'connection', 'content-length', 'content-type', 'host', 'referer', // `Transfer-Encoding` is hop-by-hop header that is meaningful
// only for a single transport-level connection, and shouldn't
// be stored by caches or forwarded by proxies.
'transfer-encoding', 'trailer', 'te', 'upgrade', 'keep-alive'];
exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST = KBN_SCREENSHOT_HEADER_BLOCK_LIST;
const KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN = ['proxy-'];
exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN = KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN;
const UI_SETTINGS_SEARCH_INCLUDE_FROZEN = 'search:includeFrozen';
exports.UI_SETTINGS_SEARCH_INCLUDE_FROZEN = UI_SETTINGS_SEARCH_INCLUDE_FROZEN;
const UI_SETTINGS_CUSTOM_PDF_LOGO = 'xpackReporting:customPdfLogo';
exports.UI_SETTINGS_CUSTOM_PDF_LOGO = UI_SETTINGS_CUSTOM_PDF_LOGO;
const UI_SETTINGS_CSV_SEPARATOR = 'csv:separator';
exports.UI_SETTINGS_CSV_SEPARATOR = UI_SETTINGS_CSV_SEPARATOR;
const UI_SETTINGS_CSV_QUOTE_VALUES = 'csv:quoteValues';
exports.UI_SETTINGS_CSV_QUOTE_VALUES = UI_SETTINGS_CSV_QUOTE_VALUES;
const UI_SETTINGS_DATEFORMAT_TZ = 'dateFormat:tz'; // Re-export type definitions here for convenience.

exports.UI_SETTINGS_DATEFORMAT_TZ = UI_SETTINGS_DATEFORMAT_TZ;
const CSV_SEARCHSOURCE_IMMEDIATE_TYPE = 'csv_searchsource_immediate'; // This is deprecated because it lacks support for runtime fields
// but the extension points are still needed for pre-existing scripted automation, until 8.0

exports.CSV_SEARCHSOURCE_IMMEDIATE_TYPE = CSV_SEARCHSOURCE_IMMEDIATE_TYPE;
const CSV_REPORT_TYPE_DEPRECATED = 'CSV';
exports.CSV_REPORT_TYPE_DEPRECATED = CSV_REPORT_TYPE_DEPRECATED;
const CSV_JOB_TYPE_DEPRECATED = 'csv';
exports.CSV_JOB_TYPE_DEPRECATED = CSV_JOB_TYPE_DEPRECATED;
const USES_HEADLESS_JOB_TYPES = [PDF_JOB_TYPE, PNG_JOB_TYPE, PDF_JOB_TYPE_V2, PNG_JOB_TYPE_V2];
exports.USES_HEADLESS_JOB_TYPES = USES_HEADLESS_JOB_TYPES;
const DEPRECATED_JOB_TYPES = [CSV_JOB_TYPE_DEPRECATED]; // Licenses

exports.DEPRECATED_JOB_TYPES = DEPRECATED_JOB_TYPES;
const LICENSE_TYPE_TRIAL = 'trial';
exports.LICENSE_TYPE_TRIAL = LICENSE_TYPE_TRIAL;
const LICENSE_TYPE_BASIC = 'basic';
exports.LICENSE_TYPE_BASIC = LICENSE_TYPE_BASIC;
const LICENSE_TYPE_STANDARD = 'standard';
exports.LICENSE_TYPE_STANDARD = LICENSE_TYPE_STANDARD;
const LICENSE_TYPE_GOLD = 'gold';
exports.LICENSE_TYPE_GOLD = LICENSE_TYPE_GOLD;
const LICENSE_TYPE_PLATINUM = 'platinum';
exports.LICENSE_TYPE_PLATINUM = LICENSE_TYPE_PLATINUM;
const LICENSE_TYPE_ENTERPRISE = 'enterprise'; // Routes

exports.LICENSE_TYPE_ENTERPRISE = LICENSE_TYPE_ENTERPRISE;
const API_BASE_URL = '/api/reporting'; // "Generation URL" from share menu

exports.API_BASE_URL = API_BASE_URL;
const API_BASE_GENERATE = `${API_BASE_URL}/generate`;
exports.API_BASE_GENERATE = API_BASE_GENERATE;
const API_LIST_URL = `${API_BASE_URL}/jobs`;
exports.API_LIST_URL = API_LIST_URL;
const API_DIAGNOSE_URL = `${API_BASE_URL}/diagnose`;
exports.API_DIAGNOSE_URL = API_DIAGNOSE_URL;
const API_GET_ILM_POLICY_STATUS = `${API_BASE_URL}/ilm_policy_status`;
exports.API_GET_ILM_POLICY_STATUS = API_GET_ILM_POLICY_STATUS;
const API_MIGRATE_ILM_POLICY_URL = `${API_BASE_URL}/deprecations/migrate_ilm_policy`;
exports.API_MIGRATE_ILM_POLICY_URL = API_MIGRATE_ILM_POLICY_URL;
const API_BASE_URL_V1 = '/api/reporting/v1'; //

exports.API_BASE_URL_V1 = API_BASE_URL_V1;
const ILM_POLICY_NAME = 'kibana-reporting'; // Management UI route

exports.ILM_POLICY_NAME = ILM_POLICY_NAME;
const REPORTING_MANAGEMENT_HOME = '/app/management/insightsAndAlerting/reporting';
exports.REPORTING_MANAGEMENT_HOME = REPORTING_MANAGEMENT_HOME;
const REPORTING_REDIRECT_LOCATOR_STORE_KEY = '__REPORTING_REDIRECT_LOCATOR_STORE_KEY__';
/**
 * A way to get the client side route for the reporting redirect app.
 *
 * TODO: Add a job ID and a locator to use so that we can redirect without expecting state to
 * be injected to the page
 */

exports.REPORTING_REDIRECT_LOCATOR_STORE_KEY = REPORTING_REDIRECT_LOCATOR_STORE_KEY;

const getRedirectAppPath = () => {
  return '/app/reportingRedirect';
}; // Statuses


exports.getRedirectAppPath = getRedirectAppPath;
let JOB_STATUSES; // Test Subjects

exports.JOB_STATUSES = JOB_STATUSES;

(function (JOB_STATUSES) {
  JOB_STATUSES["PENDING"] = "pending";
  JOB_STATUSES["PROCESSING"] = "processing";
  JOB_STATUSES["COMPLETED"] = "completed";
  JOB_STATUSES["FAILED"] = "failed";
  JOB_STATUSES["WARNINGS"] = "completed_with_warnings";
})(JOB_STATUSES || (exports.JOB_STATUSES = JOB_STATUSES = {}));

const REPORT_TABLE_ID = 'reportJobListing';
exports.REPORT_TABLE_ID = REPORT_TABLE_ID;
const REPORT_TABLE_ROW_ID = 'reportJobRow'; // Job params require a `version` field as of 7.15.0. For older jobs set with
// automation that have no version value in the job params, we assume the
// intended version is 7.14.0

exports.REPORT_TABLE_ROW_ID = REPORT_TABLE_ROW_ID;
const UNVERSIONED_VERSION = '7.14.0'; // hacky endpoint: download CSV without queueing a report
// FIXME: find a way to make these endpoints "generic" instead of hardcoded, as are the queued report export types

exports.UNVERSIONED_VERSION = UNVERSIONED_VERSION;
const API_GENERATE_IMMEDIATE = `${API_BASE_URL_V1}/generate/immediate/csv_searchsource`;
exports.API_GENERATE_IMMEDIATE = API_GENERATE_IMMEDIATE;