"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uninstallMappings = void 0;

var _utils = require("./utils");

var _log_mapping_error = require("./utils/log_mapping_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uninstallMappings = async ({
  esClient,
  logger,
  mappings,
  prefix,
  suffix
}) => {
  const indices = mappings.map(mapping => {
    const {
      index
    } = mapping.mappings._meta;
    return (0, _utils.computeMappingId)({
      id: index,
      prefix,
      suffix
    });
  });
  (0, _utils.logMappingInfo)({
    id: indices.join(),
    logger,
    message: 'deleting indices'
  });

  try {
    await esClient.indices.delete({
      allow_no_indices: true,
      ignore_unavailable: true,
      index: indices
    });
  } catch (error) {
    (0, _log_mapping_error.logMappingError)({
      error,
      id: indices.join(),
      logger,
      message: 'could not delete index',
      postBody: undefined
    });
  }
};

exports.uninstallMappings = uninstallMappings;