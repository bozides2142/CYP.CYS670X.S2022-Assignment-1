"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatedRelatedSavedObjects = validatedRelatedSavedObjects;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const RelatedSavedObjectsSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  namespace: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 1
  })),
  id: _configSchema.schema.string({
    minLength: 1
  }),
  type: _configSchema.schema.string({
    minLength: 1
  }),
  // optional; for SO types like action/alert that have type id's
  typeId: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 1
  }))
}), {
  defaultValue: []
});

function validatedRelatedSavedObjects(logger, data) {
  try {
    return RelatedSavedObjectsSchema.validate(data);
  } catch (err) {
    logger.warn(`ignoring invalid related saved objects: ${err.message}`);
    return [];
  }
}