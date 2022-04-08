"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UUID_V5_NAMESPACE = exports.PRECONFIGURATION_LATEST_KEYWORD = exports.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE = exports.KEEP_POLICIES_UP_TO_DATE_PACKAGES = exports.FLEET_PACKAGES = exports.AUTO_UPGRADE_POLICIES_PACKAGES = exports.AUTO_UPDATE_PACKAGES = void 0;

var _lodash = require("lodash");

var _ = require(".");

var _epm = require("./epm");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// UUID v5 values require a namespace. We use UUID v5 for some of our preconfigured ID values.


const UUID_V5_NAMESPACE = 'dde7c2de-1370-4c19-9975-b473d0e03508';
exports.UUID_V5_NAMESPACE = UUID_V5_NAMESPACE;
const PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE = 'fleet-preconfiguration-deletion-record';
exports.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE = PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE;
const PRECONFIGURATION_LATEST_KEYWORD = 'latest';
exports.PRECONFIGURATION_LATEST_KEYWORD = PRECONFIGURATION_LATEST_KEYWORD;

const AUTO_UPDATE_PACKAGES = _epm.autoUpdatePackages.map(name => ({
  name,
  version: PRECONFIGURATION_LATEST_KEYWORD
})); // These packages default to `keep_policies_up_to_date: true` and don't allow users to opt out


exports.AUTO_UPDATE_PACKAGES = AUTO_UPDATE_PACKAGES;

const AUTO_UPGRADE_POLICIES_PACKAGES = _epm.autoUpgradePoliciesPackages.map(name => ({
  name,
  version: PRECONFIGURATION_LATEST_KEYWORD
}));

exports.AUTO_UPGRADE_POLICIES_PACKAGES = AUTO_UPGRADE_POLICIES_PACKAGES;
const FLEET_PACKAGES = [_.FLEET_SYSTEM_PACKAGE, _.FLEET_ELASTIC_AGENT_PACKAGE, _.FLEET_SERVER_PACKAGE].map(name => ({
  name,
  version: PRECONFIGURATION_LATEST_KEYWORD
})); // Controls whether the `Keep Policies up to date` setting is exposed to the user

exports.FLEET_PACKAGES = FLEET_PACKAGES;
const KEEP_POLICIES_UP_TO_DATE_PACKAGES = (0, _lodash.uniqBy)([...AUTO_UPGRADE_POLICIES_PACKAGES, ...FLEET_PACKAGES, ...AUTO_UPDATE_PACKAGES], ({
  name
}) => name);
exports.KEEP_POLICIES_UP_TO_DATE_PACKAGES = KEEP_POLICIES_UP_TO_DATE_PACKAGES;