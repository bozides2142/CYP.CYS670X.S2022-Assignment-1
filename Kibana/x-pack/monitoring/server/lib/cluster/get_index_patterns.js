"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDsIndexPattern = getDsIndexPattern;
exports.getIndexPatterns = getIndexPatterns;
exports.getLegacyIndexPattern = getLegacyIndexPattern;
exports.getNewIndexPatterns = getNewIndexPatterns;

var _ccs_utils = require("../../../common/ccs_utils");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getIndexPatterns(server, additionalPatterns = {}, ccs = '*') {
  const config = server.config;
  const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);
  const kbnIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_KIBANA, ccs);
  const lsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs);
  const beatsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);
  const apmIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);
  const alertsIndex = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_ALERTS, ccs);
  const enterpriseSearchIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ENTERPRISE_SEARCH, ccs);
  const indexPatterns = {
    esIndexPattern,
    kbnIndexPattern,
    lsIndexPattern,
    beatsIndexPattern,
    apmIndexPattern,
    alertsIndex,
    enterpriseSearchIndexPattern,
    ...Object.keys(additionalPatterns).reduce((accum, varName) => {
      return { ...accum,
        [varName]: (0, _ccs_utils.prefixIndexPattern)(config, additionalPatterns[varName], ccs)
      };
    }, {})
  };
  return indexPatterns;
} // calling legacy index patterns those that are .monitoring


function getLegacyIndexPattern({
  moduleType,
  ecsLegacyOnly = false,
  config,
  ccs
}) {
  let indexPattern = '';

  switch (moduleType) {
    case 'elasticsearch':
      // there may be cases where we only want the legacy ecs version index pattern (>=8.0)
      indexPattern = ecsLegacyOnly ? _constants.INDEX_PATTERN_ELASTICSEARCH_ECS : _constants.INDEX_PATTERN_ELASTICSEARCH;
      break;

    case 'kibana':
      indexPattern = _constants.INDEX_PATTERN_KIBANA;
      break;

    case 'logstash':
      indexPattern = _constants.INDEX_PATTERN_LOGSTASH;
      break;

    case 'beats':
      indexPattern = _constants.INDEX_PATTERN_BEATS;
      break;

    case 'enterprisesearch':
      indexPattern = _constants.INDEX_PATTERN_ENTERPRISE_SEARCH;
      break;

    default:
      throw new Error(`invalid module type to create index pattern: ${moduleType}`);
  }

  return (0, _ccs_utils.prefixIndexPattern)(config, indexPattern, ccs);
}

function getDsIndexPattern({
  type = _constants.DS_INDEX_PATTERN_METRICS,
  moduleType,
  dataset,
  namespace = '*',
  config,
  ccs
}) {
  let datasetsPattern = '';

  if (dataset) {
    datasetsPattern = `${moduleType}.${dataset}`;
  } else {
    datasetsPattern = `${moduleType}.*`;
  }

  return (0, _ccs_utils.prefixIndexPattern)(config, `${type}-${datasetsPattern}-${namespace}`, ccs);
}

function getNewIndexPatterns({
  config,
  moduleType,
  type = _constants.DS_INDEX_PATTERN_METRICS,
  dataset,
  namespace = '*',
  ccs,
  ecsLegacyOnly
}) {
  const legacyIndexPattern = getLegacyIndexPattern({
    moduleType,
    ecsLegacyOnly,
    config,
    ccs
  });
  const dsIndexPattern = getDsIndexPattern({
    type,
    moduleType,
    dataset,
    namespace,
    config,
    ccs
  });
  return `${legacyIndexPattern},${dsIndexPattern}`;
}