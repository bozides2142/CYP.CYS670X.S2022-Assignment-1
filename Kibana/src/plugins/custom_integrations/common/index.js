"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shipper = exports.category = exports.SHIPPER_DISPLAY = exports.ROUTES_REPLACEMENT_CUSTOM_INTEGRATIONS = exports.ROUTES_APPEND_CUSTOM_INTEGRATIONS = exports.PLUGIN_NAME = exports.PLUGIN_ID = exports.INTEGRATION_CATEGORY_DISPLAY = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const PLUGIN_ID = 'customIntegrations';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'customIntegrations';
/**
 * A map of category names and their corresponding titles.
 */
// TODO: consider i18n

exports.PLUGIN_NAME = PLUGIN_NAME;
const INTEGRATION_CATEGORY_DISPLAY = {
  aws: 'AWS',
  azure: 'Azure',
  cloud: 'Cloud',
  config_management: 'Config management',
  containers: 'Containers',
  crm: 'CRM',
  custom: 'Custom',
  datastore: 'Datastore',
  elastic_stack: 'Elastic Stack',
  google_cloud: 'Google cloud',
  kubernetes: 'Kubernetes',
  languages: 'Languages',
  message_queue: 'Message queue',
  monitoring: 'Monitoring',
  network: 'Network',
  notification: 'Notification',
  os_system: 'OS & System',
  productivity: 'Productivity',
  security: 'Security',
  sample_data: 'Sample data',
  support: 'Support',
  ticketing: 'Ticketing',
  version_control: 'Version control',
  web: 'Web',
  // Kibana added
  communications: 'Communications',
  file_storage: 'File storage',
  language_client: 'Language client',
  upload_file: 'Upload a file',
  website_search: 'Website search',
  geo: 'Geo'
};
/**
 * A category applicable to an Integration.
 */

exports.INTEGRATION_CATEGORY_DISPLAY = INTEGRATION_CATEGORY_DISPLAY;

/**
 * The list of all available categories.
 */
// This `as` is necessary, as Object.keys cannot be strongly typed.
// see: https://github.com/Microsoft/TypeScript/issues/12870
const category = Object.keys(INTEGRATION_CATEGORY_DISPLAY);
/**
 * An object containing the id of an `IntegrationCategory` and the count of all Integrations in that category.
 */

exports.category = category;

/**
 * A map of shipper names and their corresponding titles.
 */
// TODO: consider i18n
const SHIPPER_DISPLAY = {
  beats: 'Beats',
  enterprise_search: 'Enterprise Search',
  language_clients: 'Language clients',
  other: 'Other',
  sample_data: 'Sample data',
  tests: 'Tests',
  tutorial: 'Tutorials'
};
/**
 * A shipper-- an internal or external system capable of storing data in ES/Kibana-- applicable to an Integration.
 */

exports.SHIPPER_DISPLAY = SHIPPER_DISPLAY;

/**
 * The list of all known shippers.
 */
// This `as` is necessary, as Object.keys cannot be strongly typed.
// see: https://github.com/Microsoft/TypeScript/issues/12870
const shipper = Object.keys(SHIPPER_DISPLAY);
/**
 * An icon representing an Integration.
 */

exports.shipper = shipper;
const ROUTES_APPEND_CUSTOM_INTEGRATIONS = `/internal/${PLUGIN_ID}/appendCustomIntegrations`;
exports.ROUTES_APPEND_CUSTOM_INTEGRATIONS = ROUTES_APPEND_CUSTOM_INTEGRATIONS;
const ROUTES_REPLACEMENT_CUSTOM_INTEGRATIONS = `/internal/${PLUGIN_ID}/replacementCustomIntegrations`;
exports.ROUTES_REPLACEMENT_CUSTOM_INTEGRATIONS = ROUTES_REPLACEMENT_CUSTOM_INTEGRATIONS;