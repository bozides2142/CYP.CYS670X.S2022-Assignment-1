"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingAuthorizationFilterType = void 0;
exports.asFiltersByRuleTypeAndConsumer = asFiltersByRuleTypeAndConsumer;
exports.asFiltersBySpaceId = asFiltersBySpaceId;
exports.ensureFieldIsSafeForQuery = ensureFieldIsSafeForQuery;

var _lodash = require("lodash");

var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let AlertingAuthorizationFilterType;
exports.AlertingAuthorizationFilterType = AlertingAuthorizationFilterType;

(function (AlertingAuthorizationFilterType) {
  AlertingAuthorizationFilterType["KQL"] = "kql";
  AlertingAuthorizationFilterType["ESDSL"] = "dsl";
})(AlertingAuthorizationFilterType || (exports.AlertingAuthorizationFilterType = AlertingAuthorizationFilterType = {}));

const esQueryConfig = {
  allowLeadingWildcards: true,
  dateFormatTZ: 'Zulu',
  ignoreFilterIfFieldNotInIndex: false,
  queryStringOptions: {
    analyze_wildcard: true
  }
};

function asFiltersByRuleTypeAndConsumer(ruleTypes, opts, spaceId) {
  const kueryNode = _esQuery.nodeBuilder.or(Array.from(ruleTypes).reduce((filters, {
    id,
    authorizedConsumers
  }) => {
    ensureFieldIsSafeForQuery('ruleTypeId', id);
    const andNodes = [_esQuery.nodeBuilder.is(opts.fieldNames.ruleTypeId, id), _esQuery.nodeBuilder.or(Object.keys(authorizedConsumers).map(consumer => {
      ensureFieldIsSafeForQuery('consumer', consumer);
      return _esQuery.nodeBuilder.is(opts.fieldNames.consumer, consumer);
    }))];

    if (opts.fieldNames.spaceIds != null && spaceId != null) {
      andNodes.push(_esQuery.nodeBuilder.is(opts.fieldNames.spaceIds, spaceId));
    }

    filters.push(_esQuery.nodeBuilder.and(andNodes));
    return filters;
  }, []));

  if (opts.type === AlertingAuthorizationFilterType.ESDSL) {
    return (0, _esQuery.toElasticsearchQuery)(kueryNode, undefined, esQueryConfig);
  }

  return kueryNode;
} // This is a specific use case currently for alerts as data
// Space ids are stored in the alerts documents and even if security is disabled
// still need to consider the users space privileges


function asFiltersBySpaceId(opts, spaceId) {
  if (opts.fieldNames.spaceIds != null && spaceId != null) {
    const kueryNode = _esQuery.nodeBuilder.is(opts.fieldNames.spaceIds, spaceId);

    switch (opts.type) {
      case AlertingAuthorizationFilterType.ESDSL:
        return (0, _esQuery.toElasticsearchQuery)(kueryNode, undefined, esQueryConfig);

      case AlertingAuthorizationFilterType.KQL:
        return kueryNode;

      default:
        return undefined;
    }
  }

  return undefined;
}

function ensureFieldIsSafeForQuery(field, value) {
  const invalid = value.match(/([>=<\*:()]+|\s+)/g);

  if (invalid) {
    const whitespace = (0, _lodash.remove)(invalid, chars => chars.trim().length === 0);
    const errors = [];

    if (whitespace.length) {
      errors.push(`whitespace`);
    }

    if (invalid.length) {
      errors.push(`invalid character${invalid.length > 1 ? `s` : ``}: ${invalid === null || invalid === void 0 ? void 0 : invalid.join(`, `)}`);
    }

    throw new Error(`expected ${field} not to include ${errors.join(' and ')}`);
  }

  return true;
}