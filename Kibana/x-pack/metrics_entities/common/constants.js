"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METRICS_ENTITIES_URL = exports.METRICS_ENTITIES_TRANSFORMS = exports.ELASTIC_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Base route
 */

const METRICS_ENTITIES_URL = '/api/metrics_entities';
/**
 * Transforms route
 */

exports.METRICS_ENTITIES_URL = METRICS_ENTITIES_URL;
const METRICS_ENTITIES_TRANSFORMS = `${METRICS_ENTITIES_URL}/transforms`;
/**
 * Global prefix for all the transform jobs
 */

exports.METRICS_ENTITIES_TRANSFORMS = METRICS_ENTITIES_TRANSFORMS;
const ELASTIC_NAME = 'estc';
exports.ELASTIC_NAME = ELASTIC_NAME;