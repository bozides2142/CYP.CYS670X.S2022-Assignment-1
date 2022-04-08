"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrioritizedFieldValuePairs = void 0;

var _constants = require("../constants");

var _has_prefix_to_include = require("./has_prefix_to_include");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getPrioritizedFieldValuePairs = fieldValuePairs => {
  const prioritizedFields = [..._constants.FIELDS_TO_ADD_AS_CANDIDATE];
  return fieldValuePairs.sort((a, b) => {
    const hasPrefixA = (0, _has_prefix_to_include.hasPrefixToInclude)(a.fieldName);
    const hasPrefixB = (0, _has_prefix_to_include.hasPrefixToInclude)(b.fieldName);
    const includesA = prioritizedFields.includes(a.fieldName);
    const includesB = prioritizedFields.includes(b.fieldName);

    if ((includesA || hasPrefixA) && !includesB && !hasPrefixB) {
      return -1;
    } else if (!includesA && !hasPrefixA && (includesB || hasPrefixB)) {
      return 1;
    }

    return 0;
  });
};

exports.getPrioritizedFieldValuePairs = getPrioritizedFieldValuePairs;