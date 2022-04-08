"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUsageCounterLabel = createUsageCounterLabel;
exports.templateSavedQueries = exports.templatePacks = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _filters = require("./filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Constructs the packs telemetry schema from a collection of packs saved objects
 */


const templatePacks = (packsData, clusterInfo, licenseInfo) => packsData.map(item => {
  const template = {
    '@timestamp': (0, _moment.default)().toISOString(),
    cluster_uuid: clusterInfo.cluster_uuid,
    cluster_name: clusterInfo.cluster_name,
    license_id: licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid
  }; // cast exception list type to a TelemetryEvent for allowlist filtering

  const filteredPackItem = (0, _filters.copyAllowlistedFields)(_filters.packEventFields, item.attributes);
  return { ...template,
    id: item.id,
    ...filteredPackItem
  };
});
/**
 * Constructs the packs telemetry schema from a collection of packs saved objects
 */


exports.templatePacks = templatePacks;

const templateSavedQueries = (savedQueriesData, clusterInfo, licenseInfo) => savedQueriesData.map(item => {
  const template = {
    '@timestamp': (0, _moment.default)().toISOString(),
    cluster_uuid: clusterInfo.cluster_uuid,
    cluster_name: clusterInfo.cluster_name,
    license_id: licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid
  }; // cast exception list type to a TelemetryEvent for allowlist filtering

  const filteredSavedQueryItem = (0, _filters.copyAllowlistedFields)(_filters.savedQueryEventFields, item.attributes);
  return { ...template,
    id: item.id,
    ...filteredSavedQueryItem
  };
});
/**
 * Convert counter label list to kebab case
 *
 * @param label_list the list of labels to create standardized UsageCounter from
 * @returns a string label for usage in the UsageCounter
 */


exports.templateSavedQueries = templateSavedQueries;

function createUsageCounterLabel(labelList) {
  return labelList.join('-');
}