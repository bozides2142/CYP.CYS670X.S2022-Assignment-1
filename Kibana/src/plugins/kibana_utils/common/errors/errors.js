"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectNotFound = exports.SavedFieldTypeInvalidForAgg = exports.SavedFieldNotFound = exports.KbnError = exports.InvalidJSONProperty = exports.DuplicateField = exports.CharacterNotAllowedInField = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
// abstract error class
class KbnError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}
/**
 * when a mapping already exists for a field the user is attempting to add
 * @param {String} name - the field name
 */


exports.KbnError = KbnError;

class DuplicateField extends KbnError {
  constructor(name) {
    super(`The field "${name}" already exists in this mapping`);
  }

}
/**
 * when a user is attempting to create a field with disallowed character in the name, like *
 * @param {String} character - the character not allowed in name
 * @param {String} name - the field name
 */


exports.DuplicateField = DuplicateField;

class CharacterNotAllowedInField extends KbnError {
  constructor(character, name) {
    super(`The field "${name}" cannot have "${character}" in the name`);
  }

}
/**
 * A saved object was not found
 */


exports.CharacterNotAllowedInField = CharacterNotAllowedInField;

class SavedObjectNotFound extends KbnError {
  constructor(type, id, link, customMessage) {
    const idMsg = id ? ` (id: ${id})` : '';
    let message = `Could not locate that ${type}${idMsg}`;

    if (link) {
      message += `, [click here to re-create it](${link})`;
    }

    super(customMessage || message);
    (0, _defineProperty2.default)(this, "savedObjectType", void 0);
    (0, _defineProperty2.default)(this, "savedObjectId", void 0);
    this.savedObjectType = type;
    this.savedObjectId = id;
  }

}
/**
 * A saved field doesn't exist anymore
 */


exports.SavedObjectNotFound = SavedObjectNotFound;

class SavedFieldNotFound extends KbnError {
  constructor(message) {
    super(message);
  }

}
/**
 * A saved field type isn't compatible with aggregation
 */


exports.SavedFieldNotFound = SavedFieldNotFound;

class SavedFieldTypeInvalidForAgg extends KbnError {
  constructor(message) {
    super(message);
  }

}
/**
 * This error is for scenarios where a saved object is detected that has invalid JSON properties.
 * There was a scenario where we were importing objects with double-encoded JSON, and the system
 * was silently failing. This error is now thrown in those scenarios.
 */


exports.SavedFieldTypeInvalidForAgg = SavedFieldTypeInvalidForAgg;

class InvalidJSONProperty extends KbnError {
  constructor(message) {
    super(message);
  }

}

exports.InvalidJSONProperty = InvalidJSONProperty;