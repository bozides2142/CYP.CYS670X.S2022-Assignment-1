"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertLogAliasToLogIndices = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const convertLogAliasToLogIndices = sourceConfigurationDocument => {
  const {
    logAlias,
    ...otherAttributes
  } = sourceConfigurationDocument.attributes;
  const newAttributes = { ...otherAttributes,
    logIndices: {
      type: 'index_name',
      indexName: logAlias !== null && logAlias !== void 0 ? logAlias : _constants.LOGS_INDEX_PATTERN
    }
  };
  return { ...sourceConfigurationDocument,
    attributes: newAttributes
  };
};

exports.convertLogAliasToLogIndices = convertLogAliasToLogIndices;