"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAppSearchRoutes = void 0;

var _adaptive_relevance = require("./adaptive_relevance");

var _analytics = require("./analytics");

var _api_logs = require("./api_logs");

var _crawler = require("./crawler");

var _crawler_crawl_rules = require("./crawler_crawl_rules");

var _crawler_entry_points = require("./crawler_entry_points");

var _crawler_sitemaps = require("./crawler_sitemaps");

var _credentials = require("./credentials");

var _curations = require("./curations");

var _documents = require("./documents");

var _engines = require("./engines");

var _onboarding = require("./onboarding");

var _result_settings = require("./result_settings");

var _role_mappings = require("./role_mappings");

var _schema = require("./schema");

var _search = require("./search");

var _search_settings = require("./search_settings");

var _search_ui = require("./search_ui");

var _settings = require("./settings");

var _source_engines = require("./source_engines");

var _synonyms = require("./synonyms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerAppSearchRoutes = dependencies => {
  (0, _engines.registerEnginesRoutes)(dependencies);
  (0, _credentials.registerCredentialsRoutes)(dependencies);
  (0, _settings.registerSettingsRoutes)(dependencies);
  (0, _analytics.registerAnalyticsRoutes)(dependencies);
  (0, _documents.registerDocumentsRoutes)(dependencies);
  (0, _documents.registerDocumentRoutes)(dependencies);
  (0, _schema.registerSchemaRoutes)(dependencies);
  (0, _search.registerSearchRoutes)(dependencies);
  (0, _source_engines.registerSourceEnginesRoutes)(dependencies);
  (0, _curations.registerCurationsRoutes)(dependencies);
  (0, _synonyms.registerSynonymsRoutes)(dependencies);
  (0, _search_settings.registerSearchSettingsRoutes)(dependencies);
  (0, _role_mappings.registerRoleMappingsRoutes)(dependencies);
  (0, _search_ui.registerSearchUIRoutes)(dependencies);
  (0, _result_settings.registerResultSettingsRoutes)(dependencies);
  (0, _api_logs.registerApiLogsRoutes)(dependencies);
  (0, _onboarding.registerOnboardingRoutes)(dependencies);
  (0, _crawler.registerCrawlerRoutes)(dependencies);
  (0, _crawler_entry_points.registerCrawlerEntryPointRoutes)(dependencies);
  (0, _crawler_crawl_rules.registerCrawlerCrawlRulesRoutes)(dependencies);
  (0, _crawler_sitemaps.registerCrawlerSitemapRoutes)(dependencies);
  (0, _adaptive_relevance.registerSearchRelevanceSuggestionsRoutes)(dependencies);
};

exports.registerAppSearchRoutes = registerAppSearchRoutes;