"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateFilterKueryNode = exports.validateConvertFilterToKueryNode = exports.isSavedObjectAttr = exports.hasFilterKeyError = exports.fieldDefined = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var esKuery = _interopRequireWildcard(require("@kbn/es-query"));

var _errors = require("./errors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const astFunctionType = ['is', 'range', 'nested'];

const validateConvertFilterToKueryNode = (allowedTypes, filter, indexMapping) => {
  if (filter && indexMapping) {
    const filterKueryNode = typeof filter === 'string' ? esKuery.fromKueryExpression(filter) : (0, _lodash.cloneDeep)(filter);
    const validationFilterKuery = validateFilterKueryNode({
      astFilter: filterKueryNode,
      types: allowedTypes,
      indexMapping,
      storeValue: filterKueryNode.type === 'function' && astFunctionType.includes(filterKueryNode.function),
      hasNestedKey: filterKueryNode.type === 'function' && filterKueryNode.function === 'nested'
    });

    if (validationFilterKuery.length === 0) {
      throw _errors.SavedObjectsErrorHelpers.createBadRequestError('If we have a filter options defined, we should always have validationFilterKuery defined too');
    }

    if (validationFilterKuery.some(obj => obj.error != null)) {
      throw _errors.SavedObjectsErrorHelpers.createBadRequestError(validationFilterKuery.filter(obj => obj.error != null).map(obj => obj.error).join('\n'));
    }

    validationFilterKuery.forEach(item => {
      const path = item.astPath.length === 0 ? [] : item.astPath.split('.');
      const existingKueryNode = path.length === 0 ? filterKueryNode : (0, _lodash.get)(filterKueryNode, path);

      if (item.isSavedObjectAttr) {
        existingKueryNode.arguments[0].value = existingKueryNode.arguments[0].value.split('.')[1];
        const itemType = allowedTypes.filter(t => t === item.type);

        if (itemType.length === 1) {
          (0, _saferLodashSet.set)(filterKueryNode, path, esKuery.nodeTypes.function.buildNode('and', [esKuery.nodeTypes.function.buildNode('is', 'type', itemType[0]), existingKueryNode]));
        }
      } else {
        existingKueryNode.arguments[0].value = existingKueryNode.arguments[0].value.replace('.attributes', '');
        (0, _saferLodashSet.set)(filterKueryNode, path, existingKueryNode);
      }
    });
    return filterKueryNode;
  }
};

exports.validateConvertFilterToKueryNode = validateConvertFilterToKueryNode;

const validateFilterKueryNode = ({
  astFilter,
  types,
  indexMapping,
  hasNestedKey = false,
  nestedKeys,
  storeValue = false,
  path = 'arguments'
}) => {
  let localNestedKeys;
  return astFilter.arguments.reduce((kueryNode, ast, index) => {
    if (hasNestedKey && ast.type === 'literal' && ast.value != null) {
      localNestedKeys = ast.value;
    } else if (ast.type === 'literal' && ast.value && typeof ast.value === 'string') {
      const key = ast.value.replace('.attributes', '');
      const mappingKey = 'properties.' + key.split('.').join('.properties.');
      const field = (0, _lodash.get)(indexMapping, mappingKey);

      if (field != null && field.type === 'nested') {
        localNestedKeys = ast.value;
      }
    }

    if (ast.arguments) {
      const myPath = `${path}.${index}`;
      return [...kueryNode, ...validateFilterKueryNode({
        astFilter: ast,
        types,
        indexMapping,
        storeValue: ast.type === 'function' && astFunctionType.includes(ast.function),
        path: `${myPath}.arguments`,
        hasNestedKey: ast.type === 'function' && ast.function === 'nested',
        nestedKeys: localNestedKeys || nestedKeys
      })];
    }

    if (storeValue && index === 0) {
      const splitPath = path.split('.');
      return [...kueryNode, {
        astPath: splitPath.slice(0, splitPath.length - 1).join('.'),
        error: hasFilterKeyError(nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value, types, indexMapping),
        isSavedObjectAttr: isSavedObjectAttr(nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value, indexMapping),
        key: nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value,
        type: getType(nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value)
      }];
    }

    return kueryNode;
  }, []);
};

exports.validateFilterKueryNode = validateFilterKueryNode;

const getType = key => key != null && key.includes('.') ? key.split('.')[0] : null;
/**
 * Is this filter key referring to a a top-level SavedObject attribute such as
 * `updated_at` or `references`.
 *
 * @param key
 * @param indexMapping
 */


const isSavedObjectAttr = (key, indexMapping) => {
  const keySplit = key != null ? key.split('.') : [];

  if (keySplit.length === 1 && fieldDefined(indexMapping, keySplit[0])) {
    return true;
  } else if (keySplit.length === 2 && fieldDefined(indexMapping, keySplit[1])) {
    return true;
  } else {
    return false;
  }
};

exports.isSavedObjectAttr = isSavedObjectAttr;

const hasFilterKeyError = (key, types, indexMapping) => {
  if (key == null) {
    return `The key is empty and needs to be wrapped by a saved object type like ${types.join()}`;
  }

  if (!key.includes('.')) {
    return `This key '${key}' need to be wrapped by a saved object type like ${types.join()}`;
  } else if (key.includes('.')) {
    const keySplit = key.split('.');

    if (keySplit.length <= 1 || !types.includes(keySplit[0])) {
      return `This type ${keySplit[0]} is not allowed`;
    }

    if (keySplit.length === 2 && fieldDefined(indexMapping, key) || keySplit.length > 2 && keySplit[1] !== 'attributes') {
      return `This key '${key}' does NOT match the filter proposition SavedObjectType.attributes.key`;
    }

    if (keySplit.length === 2 && !fieldDefined(indexMapping, keySplit[1]) || keySplit.length > 2 && !fieldDefined(indexMapping, `${keySplit[0]}.${keySplit.slice(2, keySplit.length).join('.')}`)) {
      return `This key '${key}' does NOT exist in ${types.join()} saved object index patterns`;
    }
  }

  return null;
};

exports.hasFilterKeyError = hasFilterKeyError;

const fieldDefined = (indexMappings, key) => {
  const mappingKey = 'properties.' + key.split('.').join('.properties.');

  if ((0, _lodash.get)(indexMappings, mappingKey) != null) {
    return true;
  } // If the `mappingKey` does not match a valid path, before returning false,
  // we want to check and see if the intended path was for a multi-field
  // such as `x.attributes.field.text` where `field` is mapped to both text
  // and keyword


  const propertiesAttribute = 'properties';
  const indexOfLastProperties = mappingKey.lastIndexOf(propertiesAttribute);
  const fieldMapping = mappingKey.substr(0, indexOfLastProperties);
  const fieldType = mappingKey.substr(mappingKey.lastIndexOf(propertiesAttribute) + `${propertiesAttribute}.`.length);
  const mapping = `${fieldMapping}fields.${fieldType}`;

  if ((0, _lodash.get)(indexMappings, mapping) != null) {
    return true;
  } // If the path is for a flattened type field, we'll assume the mappings are defined.


  const keys = key.split('.');

  for (let i = 0; i < keys.length; i++) {
    var _get;

    const path = `properties.${keys.slice(0, i + 1).join('.properties.')}`;

    if (((_get = (0, _lodash.get)(indexMappings, path)) === null || _get === void 0 ? void 0 : _get.type) === 'flattened') {
      return true;
    }
  }

  return false;
};

exports.fieldDefined = fieldDefined;