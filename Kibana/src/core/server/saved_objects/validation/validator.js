"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsTypeValidator = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _schema = require("./schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Helper class that takes a {@link SavedObjectsValidationMap} and runs validations for a
 * given type based on the provided Kibana version.
 *
 * @internal
 */
class SavedObjectsTypeValidator {
  constructor({
    logger,
    type,
    validationMap
  }) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "validationMap", void 0);
    this.log = logger;
    this.type = type;
    this.validationMap = typeof validationMap === 'function' ? validationMap() : validationMap;
  }

  validate(objectVersion, data) {
    const validationRule = this.validationMap[objectVersion];

    if (!validationRule) {
      return; // no matching validation rule could be found; proceed without validating
    }

    try {
      const validationSchema = (0, _schema.createSavedObjectSanitizedDocSchema)(validationRule);
      validationSchema.validate(data);
    } catch (e) {
      this.log.warn(`Error validating object of type [${this.type}] against version [${objectVersion}]`);
      throw e;
    }
  }

}

exports.SavedObjectsTypeValidator = SavedObjectsTypeValidator;