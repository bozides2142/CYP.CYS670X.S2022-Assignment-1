"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postTransforms = void 0;

var _modules = require("../modules");

var _install_mappings = require("./install_mappings");

var _install_transforms = require("./install_transforms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const postTransforms = async ({
  autoStart,
  logger,
  esClient,
  frequency,
  indices,
  docsPerSecond,
  kibanaVersion,
  maxPageSearchSize,
  modules,
  prefix,
  suffix,
  query,
  sync
}) => {
  for (const moduleName of modules) {
    const mappings = _modules.installableMappings[moduleName];
    const transforms = _modules.installableTransforms[moduleName];
    await (0, _install_mappings.installMappings)({
      esClient,
      kibanaVersion,
      logger,
      mappings,
      prefix,
      suffix
    });
    await (0, _install_transforms.installTransforms)({
      autoStart,
      docsPerSecond,
      esClient,
      frequency,
      indices,
      logger,
      maxPageSearchSize,
      prefix,
      query,
      suffix,
      sync,
      transforms
    });
  }
};

exports.postTransforms = postTransforms;