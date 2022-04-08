"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchableTypes = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSearchableTypes = (typeRegistry, types) => {
  const typeFilter = types ? type => {
    var _type$management;

    if ((_type$management = type.management) !== null && _type$management !== void 0 && _type$management.displayName && isTypeMatching(types, type.management.displayName)) {
      return true;
    }

    return isTypeMatching(types, type.name);
  } : () => true;
  return typeRegistry.getVisibleTypes().filter(typeFilter).filter(type => {
    var _type$management2, _type$management3;

    return ((_type$management2 = type.management) === null || _type$management2 === void 0 ? void 0 : _type$management2.defaultSearchField) && ((_type$management3 = type.management) === null || _type$management3 === void 0 ? void 0 : _type$management3.getInAppUrl);
  });
};

exports.getSearchableTypes = getSearchableTypes;

const isTypeMatching = (list, item) => list.some(e => toCompareFormat(e) === toCompareFormat(item));

const toCompareFormat = str => str.toLowerCase().replace(/\s/g, '-');