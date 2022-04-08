"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installMappings = void 0;

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installMappings = async ({
  esClient,
  kibanaVersion,
  mappings,
  prefix,
  suffix,
  logger
}) => {
  for (const mapping of mappings) {
    const {
      index
    } = mapping.mappings._meta;
    const mappingId = (0, _utils.computeMappingId)({
      id: index,
      prefix,
      suffix
    });
    const exists = await (0, _utils.getIndexExists)(esClient, mappingId);
    const computedBody = { ...mapping,
      ...{
        mappings: { ...mapping.mappings,
          _meta: { ...mapping.mappings._meta,
            ...{
              created_by: 'metrics_entities',
              index: mappingId,
              version: kibanaVersion
            }
          }
        }
      }
    };

    if (!exists) {
      try {
        (0, _utils.logMappingInfo)({
          id: mappingId,
          logger,
          message: 'does not exist, creating the mapping'
        });
        await esClient.indices.create({
          body: computedBody,
          index: mappingId
        });
      } catch (error) {
        (0, _utils.logMappingError)({
          error,
          id: mappingId,
          logger,
          message: 'cannot install mapping',
          postBody: computedBody
        });
      }
    } else {
      (0, _utils.logMappingDebug)({
        id: mappingId,
        logger,
        message: 'mapping already exists. It will not be recreated'
      });
    }
  }
};

exports.installMappings = installMappings;