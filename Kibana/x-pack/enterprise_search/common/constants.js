"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WORKPLACE_SEARCH_PLUGIN = exports.READ_ONLY_MODE_HEADER = exports.LICENSED_SUPPORT_URL = exports.JSON_HEADER = exports.ERROR_CONNECTING_HEADER = exports.ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID = exports.ENTERPRISE_SEARCH_PLUGIN = exports.ENTERPRISE_SEARCH_KIBANA_COOKIE = exports.ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID = exports.APP_SEARCH_PLUGIN = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ENTERPRISE_SEARCH_PLUGIN = {
  ID: 'enterpriseSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.productName', {
    defaultMessage: 'Enterprise Search'
  }),
  NAV_TITLE: _i18n.i18n.translate('xpack.enterpriseSearch.navTitle', {
    defaultMessage: 'Overview'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.FeatureCatalogue.description', {
    defaultMessage: 'Create search experiences with a refined set of APIs and tools.'
  }),
  URL: '/app/enterprise_search/overview',
  LOGO: 'logoEnterpriseSearch'
};
exports.ENTERPRISE_SEARCH_PLUGIN = ENTERPRISE_SEARCH_PLUGIN;
const APP_SEARCH_PLUGIN = {
  ID: 'appSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productName', {
    defaultMessage: 'App Search'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productDescription', {
    defaultMessage: 'Leverage dashboards, analytics, and APIs for advanced application search made simple.'
  }),
  CARD_DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productCardDescription', {
    defaultMessage: 'Design, deploy, and manage powerful search experiences for your websites and web/mobile apps.'
  }),
  URL: '/app/enterprise_search/app_search',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/app-search/'
};
exports.APP_SEARCH_PLUGIN = APP_SEARCH_PLUGIN;
const WORKPLACE_SEARCH_PLUGIN = {
  ID: 'workplaceSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productName', {
    defaultMessage: 'Workplace Search'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productDescription', {
    defaultMessage: 'Search all documents, files, and sources available across your virtual workplace.'
  }),
  CARD_DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productCardDescription', {
    defaultMessage: 'Unify your content in one place, with instant connectivity to popular productivity and collaboration tools.'
  }),
  URL: '/app/enterprise_search/workplace_search',
  NON_ADMIN_URL: '/app/enterprise_search/workplace_search/p',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/workplace-search/'
};
exports.WORKPLACE_SEARCH_PLUGIN = WORKPLACE_SEARCH_PLUGIN;
const LICENSED_SUPPORT_URL = 'https://support.elastic.co';
exports.LICENSED_SUPPORT_URL = LICENSED_SUPPORT_URL;
const JSON_HEADER = {
  'Content-Type': 'application/json',
  // This needs specific casing or Chrome throws a 415 error
  Accept: 'application/json' // Required for Enterprise Search APIs

};
exports.JSON_HEADER = JSON_HEADER;
const ERROR_CONNECTING_HEADER = 'x-ent-search-error-connecting';
exports.ERROR_CONNECTING_HEADER = ERROR_CONNECTING_HEADER;
const READ_ONLY_MODE_HEADER = 'x-ent-search-read-only-mode';
exports.READ_ONLY_MODE_HEADER = READ_ONLY_MODE_HEADER;
const ENTERPRISE_SEARCH_KIBANA_COOKIE = '_enterprise_search';
exports.ENTERPRISE_SEARCH_KIBANA_COOKIE = ENTERPRISE_SEARCH_KIBANA_COOKIE;
const ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID = 'ent-search-logs';
exports.ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID = ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID;
const ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID = 'ent-search-audit-logs';
exports.ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID = ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID;