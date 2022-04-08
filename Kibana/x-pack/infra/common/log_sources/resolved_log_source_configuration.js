"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveLogSourceConfiguration = void 0;

var _constants = require("../constants");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const resolveLogSourceConfiguration = async (sourceConfiguration, indexPatternsService) => {
  if (sourceConfiguration.logIndices.type === 'index_name') {
    return await resolveLegacyReference(sourceConfiguration, indexPatternsService);
  } else {
    return await resolveKibanaIndexPatternReference(sourceConfiguration, indexPatternsService);
  }
};

exports.resolveLogSourceConfiguration = resolveLogSourceConfiguration;

const resolveLegacyReference = async (sourceConfiguration, indexPatternsService) => {
  if (sourceConfiguration.logIndices.type !== 'index_name') {
    throw new Error('This function can only resolve legacy references');
  }

  const indices = sourceConfiguration.logIndices.indexName;
  const fields = await indexPatternsService.getFieldsForWildcard({
    pattern: indices,
    allowNoIndex: true
  }).catch(error => {
    throw new _errors.ResolveLogSourceConfigurationError(`Failed to fetch fields for indices "${indices}": ${error}`, error);
  });
  return {
    indices: sourceConfiguration.logIndices.indexName,
    timestampField: _constants.TIMESTAMP_FIELD,
    tiebreakerField: _constants.TIEBREAKER_FIELD,
    messageField: sourceConfiguration.fields.message,
    // @ts-ignore
    fields,
    runtimeMappings: {},
    columns: sourceConfiguration.logColumns,
    name: sourceConfiguration.name,
    description: sourceConfiguration.description
  };
};

const resolveKibanaIndexPatternReference = async (sourceConfiguration, indexPatternsService) => {
  var _indexPattern$timeFie;

  if (sourceConfiguration.logIndices.type !== 'index_pattern') {
    throw new Error('This function can only resolve Kibana Index Pattern references');
  }

  const {
    indexPatternId
  } = sourceConfiguration.logIndices;
  const indexPattern = await indexPatternsService.get(indexPatternId).catch(error => {
    throw new _errors.ResolveLogSourceConfigurationError(`Failed to fetch index pattern "${indexPatternId}": ${error}`, error);
  });
  return {
    indices: indexPattern.title,
    timestampField: (_indexPattern$timeFie = indexPattern.timeFieldName) !== null && _indexPattern$timeFie !== void 0 ? _indexPattern$timeFie : _constants.TIMESTAMP_FIELD,
    tiebreakerField: _constants.TIEBREAKER_FIELD,
    messageField: ['message'],
    fields: indexPattern.fields,
    runtimeMappings: resolveRuntimeMappings(indexPattern),
    columns: sourceConfiguration.logColumns,
    name: sourceConfiguration.name,
    description: sourceConfiguration.description
  };
}; // this might take other sources of runtime fields into account in the future


const resolveRuntimeMappings = indexPattern => {
  const {
    runtimeFields
  } = indexPattern.getComputedFields();
  const runtimeMappingsFromIndexPattern = Object.entries(runtimeFields).reduce((accumulatedMappings, [runtimeFieldName, runtimeFieldSpec]) => ({ ...accumulatedMappings,
    [runtimeFieldName]: {
      type: runtimeFieldSpec.type,
      ...(runtimeFieldSpec.script != null ? {
        script: {
          lang: 'painless',
          // required in the es types
          source: runtimeFieldSpec.script.source
        }
      } : {})
    }
  }), {});
  return runtimeMappingsFromIndexPattern;
};