"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NEWSFEED_FALLBACK_LANGUAGE = exports.NEWSFEED_DEV_SERVICE_BASE_URL = exports.NEWSFEED_DEFAULT_SERVICE_PATH = exports.NEWSFEED_DEFAULT_SERVICE_BASE_URL = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const NEWSFEED_FALLBACK_LANGUAGE = 'en';
exports.NEWSFEED_FALLBACK_LANGUAGE = NEWSFEED_FALLBACK_LANGUAGE;
const NEWSFEED_DEFAULT_SERVICE_BASE_URL = 'https://feeds.elastic.co';
exports.NEWSFEED_DEFAULT_SERVICE_BASE_URL = NEWSFEED_DEFAULT_SERVICE_BASE_URL;
const NEWSFEED_DEV_SERVICE_BASE_URL = 'https://feeds-staging.elastic.co';
exports.NEWSFEED_DEV_SERVICE_BASE_URL = NEWSFEED_DEV_SERVICE_BASE_URL;
const NEWSFEED_DEFAULT_SERVICE_PATH = '/kibana/v{VERSION}.json';
exports.NEWSFEED_DEFAULT_SERVICE_PATH = NEWSFEED_DEFAULT_SERVICE_PATH;