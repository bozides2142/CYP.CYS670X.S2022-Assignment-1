"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSortField = exports.validateSearchFields = exports.validateOperationOnAttributes = exports.validateFilterKueryNode = void 0;

var _lodash = require("lodash");

var _mappings = _interopRequireDefault(require("../../saved_objects/mappings.json"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const astFunctionType = ['is', 'range', 'nested'];

const validateOperationOnAttributes = (astFilter, sortField, searchFields, excludedFieldNames) => {
  if (sortField) {
    validateSortField(sortField, excludedFieldNames);
  }

  if (!(0, _lodash.isEmpty)(searchFields)) {
    validateSearchFields(searchFields !== null && searchFields !== void 0 ? searchFields : [], excludedFieldNames);
  }

  if (astFilter) {
    validateFilterKueryNode({
      astFilter,
      excludedFieldNames
    });
  }
};

exports.validateOperationOnAttributes = validateOperationOnAttributes;

const validateSortField = (sortField, excludedFieldNames) => {
  if (excludedFieldNames.filter(efn => sortField.split('.')[0].includes(efn)).length > 0) {
    throw new Error(`Sort is not supported on this field ${sortField}`);
  }
};

exports.validateSortField = validateSortField;

const validateSearchFields = (searchFields, excludedFieldNames) => {
  const excludedSearchFields = searchFields.filter(sf => excludedFieldNames.filter(efn => sf.split('.')[0].includes(efn)).length > 0);

  if (excludedSearchFields.length > 0) {
    throw new Error(`Search field ${excludedSearchFields.join()} not supported`);
  }
};

exports.validateSearchFields = validateSearchFields;

const validateFilterKueryNode = ({
  astFilter,
  excludedFieldNames,
  hasNestedKey = false,
  nestedKeys,
  storeValue,
  path = 'arguments'
}) => {
  let localStoreValue = storeValue;
  let localNestedKeys;

  if (localStoreValue === undefined) {
    localStoreValue = astFilter.type === 'function' && astFunctionType.includes(astFilter.function);
  }

  astFilter.arguments.forEach((ast, index) => {
    if (hasNestedKey && ast.type === 'literal' && ast.value != null) {
      localNestedKeys = ast.value;
    } else if (ast.type === 'literal' && ast.value && typeof ast.value === 'string') {
      const key = ast.value.replace('.attributes', '');
      const mappingKey = 'properties.' + key.split('.').join('.properties.');
      const field = (0, _lodash.get)(_mappings.default, mappingKey);

      if (field != null && field.type === 'nested') {
        localNestedKeys = ast.value;
      }
    }

    if (ast.arguments) {
      const myPath = `${path}.${index}`;
      validateFilterKueryNode({
        astFilter: ast,
        excludedFieldNames,
        storeValue: ast.type === 'function' && astFunctionType.includes(ast.function),
        path: `${myPath}.arguments`,
        hasNestedKey: ast.type === 'function' && ast.function === 'nested',
        nestedKeys: localNestedKeys || nestedKeys
      });
    }

    if (localStoreValue && index === 0) {
      const fieldName = nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value;
      const fieldNameSplit = fieldName.split('.').filter(fn => !['alert', 'attributes'].includes(fn));
      const firstAttribute = fieldNameSplit.length > 0 ? fieldNameSplit[0] : '';

      if (excludedFieldNames.includes(firstAttribute)) {
        throw new Error(`Filter is not supported on this field ${fieldName}`);
      }
    }
  });
};

exports.validateFilterKueryNode = validateFilterKueryNode;