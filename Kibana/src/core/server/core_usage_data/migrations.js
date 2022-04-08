"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateTo7141 = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const migrateTo7141 = doc => {
  try {
    return resetFields(doc, [// Prior to this, we were counting the `overwrite` option incorrectly; reset all import API counter fields so we get clean data
    'apiCalls.savedObjectsImport.total', 'apiCalls.savedObjectsImport.namespace.default.total', 'apiCalls.savedObjectsImport.namespace.default.kibanaRequest.yes', 'apiCalls.savedObjectsImport.namespace.default.kibanaRequest.no', 'apiCalls.savedObjectsImport.namespace.custom.total', 'apiCalls.savedObjectsImport.namespace.custom.kibanaRequest.yes', 'apiCalls.savedObjectsImport.namespace.custom.kibanaRequest.no', 'apiCalls.savedObjectsImport.createNewCopiesEnabled.yes', 'apiCalls.savedObjectsImport.createNewCopiesEnabled.no', 'apiCalls.savedObjectsImport.overwriteEnabled.yes', 'apiCalls.savedObjectsImport.overwriteEnabled.no']);
  } catch (err) {// fail-safe
  }

  return doc;
};

exports.migrateTo7141 = migrateTo7141;

function resetFields(doc, fieldsToReset) {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  const {
    attributes = {}
  } = newDoc;

  for (const field of fieldsToReset) {
    attributes[field] = 0;
  }

  return { ...newDoc,
    attributes
  };
}