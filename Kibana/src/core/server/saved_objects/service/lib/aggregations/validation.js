"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAndConvertAggregations = void 0;

var _lodash = require("lodash");

var _validation_utils = require("./validation_utils");

var _aggs_types = require("./aggs_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggregationKeys = ['aggs', 'aggregations'];

/**
 * Validate an aggregation structure against the declared mappings and
 * aggregation schemas, and rewrite the attribute fields using the KQL-like syntax
 * - `{type}.attributes.{attribute}` to `{type}.{attribute}`
 * - `{type}.{rootField}` to `{rootField}`
 *
 * throws on the first validation error if any is encountered.
 */
const validateAndConvertAggregations = (allowedTypes, aggs, indexMapping) => {
  return validateAggregations(aggs, {
    allowedTypes,
    indexMapping,
    currentPath: []
  });
};
/**
 * Validate a record of aggregation containers,
 * Which can either be the root level aggregations (`SearchRequest.body.aggs`)
 * Or a nested record of aggregation (`SearchRequest.body.aggs.myAggregation.aggs`)
 */


exports.validateAndConvertAggregations = validateAndConvertAggregations;

const validateAggregations = (aggregations, context) => {
  return Object.entries(aggregations).reduce((memo, [aggrName, aggrContainer]) => {
    memo[aggrName] = validateAggregation(aggrContainer, childContext(context, aggrName));
    return memo;
  }, {});
};
/**
 * Validate an aggregation container, e.g an entry of `SearchRequest.body.aggs`, or
 * from a nested aggregation record, including its potential nested aggregations.
 */


const validateAggregation = (aggregation, context) => {
  const container = validateAggregationContainer(aggregation, context);

  if (aggregation.aggregations) {
    container.aggregations = validateAggregations(aggregation.aggregations, childContext(context, 'aggregations'));
  }

  if (aggregation.aggs) {
    container.aggs = validateAggregations(aggregation.aggs, childContext(context, 'aggs'));
  }

  return container;
};
/**
 * Validates root-level aggregation of given aggregation container
 * (ignoring its nested aggregations)
 */


const validateAggregationContainer = (container, context) => {
  return Object.entries(container).reduce((memo, [aggName, aggregation]) => {
    if (aggregationKeys.includes(aggName)) {
      return memo;
    }

    return { ...memo,
      [aggName]: validateAggregationType(aggName, aggregation, childContext(context, aggName))
    };
  }, {});
};

const validateAggregationType = (aggregationType, aggregation, context) => {
  const aggregationSchema = _aggs_types.aggregationSchemas[aggregationType];

  if (!aggregationSchema) {
    throw new Error(`[${context.currentPath.join('.')}] ${aggregationType} aggregation is not valid (or not registered yet)`);
  }

  validateAggregationStructure(aggregationSchema, aggregation, context);
  return validateAndRewriteFieldAttributes(aggregation, context);
};
/**
 * Validate an aggregation structure against its declared schema.
 */


const validateAggregationStructure = (schema, aggObject, context) => {
  return schema.validate(aggObject, {}, context.currentPath.join('.'));
};
/**
 * List of fields that have an attribute path as value
 *
 * @example
 * ```ts
 * avg: {
 *  field: 'alert.attributes.actions.group',
 * },
 * ```
 */


const attributeFields = ['field', 'path'];
/**
 * List of fields that have a Record<attribute path, value> as value
 *
 * @example
 * ```ts
 * filter: {
 *  term: {
 *    'alert.attributes.actions.group': 'value'
 *  },
 * },
 * ```
 */

const attributeMaps = ['term'];

const validateAndRewriteFieldAttributes = (aggregation, context) => {
  return recursiveRewrite(aggregation, context, []);
};

const recursiveRewrite = (currentLevel, context, parents) => {
  return Object.entries(currentLevel).reduce((memo, [key, value]) => {
    const rewriteKey = isAttributeKey(parents);
    const rewriteValue = isAttributeValue(key, value);
    const nestedContext = childContext(context, key);
    const newKey = rewriteKey ? validateAndRewriteAttributePath(key, nestedContext) : key;
    const newValue = rewriteValue ? validateAndRewriteAttributePath(value, nestedContext) : (0, _lodash.isPlainObject)(value) ? recursiveRewrite(value, nestedContext, [...parents, key]) : value;
    return { ...memo,
      [newKey]: newValue
    };
  }, {});
};

const childContext = (context, path) => {
  return { ...context,
    currentPath: [...context.currentPath, path]
  };
};

const lastParent = parents => {
  if (parents.length) {
    return parents[parents.length - 1];
  }

  return undefined;
};

const isAttributeKey = parents => {
  const last = lastParent(parents);

  if (last) {
    return attributeMaps.includes(last);
  }

  return false;
};

const isAttributeValue = (fieldName, fieldValue) => {
  return attributeFields.includes(fieldName) && typeof fieldValue === 'string';
};

const validateAndRewriteAttributePath = (attributePath, {
  allowedTypes,
  indexMapping,
  currentPath
}) => {
  if ((0, _validation_utils.isRootLevelAttribute)(attributePath, indexMapping, allowedTypes)) {
    return (0, _validation_utils.rewriteRootLevelAttribute)(attributePath);
  }

  if ((0, _validation_utils.isObjectTypeAttribute)(attributePath, indexMapping, allowedTypes)) {
    return (0, _validation_utils.rewriteObjectTypeAttribute)(attributePath);
  }

  throw new Error(`[${currentPath.join('.')}] Invalid attribute path: ${attributePath}`);
};