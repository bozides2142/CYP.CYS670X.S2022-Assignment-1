"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectClient = exports.getIndexPatternsServiceFactory = exports.getElasticsearch = void 0;
exports.setStartServices = setStartServices;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let coreStart;
let pluginsStart;

function setStartServices(core, plugins) {
  coreStart = core;
  pluginsStart = plugins;
}

const getSavedObjectClient = extraTypes => {
  return coreStart.savedObjects.createInternalRepository(extraTypes);
};

exports.getSavedObjectClient = getSavedObjectClient;

const getIndexPatternsServiceFactory = () => pluginsStart.data.indexPatterns.indexPatternsServiceFactory;

exports.getIndexPatternsServiceFactory = getIndexPatternsServiceFactory;

const getElasticsearch = () => coreStart.elasticsearch;

exports.getElasticsearch = getElasticsearch;