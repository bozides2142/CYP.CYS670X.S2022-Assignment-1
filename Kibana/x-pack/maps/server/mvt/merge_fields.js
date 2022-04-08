"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeFields = mergeFields;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// can not use "import type * as estypes from '@elastic/elasticsearch/lib/api/typesWithBodyKey"
// SearchRequest is incorrectly typed and does not support Field as object
// https://github.com/elastic/elasticsearch-js/issues/1615

function mergeFields(fieldsList, excludeNames) {
  const fieldNames = [];
  const mergedFields = [];
  fieldsList.forEach(fields => {
    if (!fields) {
      return;
    }

    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.field;

      if (!excludeNames.includes(fieldName) && !fieldNames.includes(fieldName)) {
        fieldNames.push(fieldName);
        mergedFields.push(field);
      }
    });
  });
  return mergedFields;
}