"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTransforms = void 0;

var _modules = require("../modules");

var _uninstall_mappings = require("./uninstall_mappings");

var _uninstall_transforms = require("./uninstall_transforms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteTransforms = async ({
  esClient,
  logger,
  modules,
  prefix,
  suffix
}) => {
  for (const moduleName of modules) {
    const mappings = _modules.installableMappings[moduleName];
    const transforms = _modules.installableTransforms[moduleName];
    await (0, _uninstall_transforms.uninstallTransforms)({
      esClient,
      logger,
      prefix,
      suffix,
      transforms
    });
    await (0, _uninstall_mappings.uninstallMappings)({
      esClient,
      logger,
      mappings,
      prefix,
      suffix
    });
  }
};

exports.deleteTransforms = deleteTransforms;