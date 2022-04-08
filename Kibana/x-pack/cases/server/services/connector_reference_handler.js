"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorReferenceHandler = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _api = require("../../common/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ConnectorReferenceHandler {
  constructor(references) {
    (0, _defineProperty2.default)(this, "newReferences", []);

    for (const {
      id,
      name,
      type
    } of references) {
      // When id is null, or the none connector we'll try to remove the reference if it exists
      // When id is undefined it means that we're doing a patch request and this particular field shouldn't be updated
      // so we'll ignore it. If it was already in the reference array then it'll stay there when we merge them together below
      if (id === null || id === _api.NONE_CONNECTOR_ID) {
        this.newReferences.push({
          name
        });
      } else if (id) {
        this.newReferences.push({
          soReference: {
            id,
            name,
            type
          },
          name
        });
      }
    }
  }
  /**
   * Merges the references passed to the constructor into the original references passed into this function
   *
   * @param originalReferences existing saved object references
   * @returns a merged reference list or undefined when there are no new or existing references
   */


  build(originalReferences) {
    if (this.newReferences.length <= 0) {
      return originalReferences;
    }

    const refMap = new Map(originalReferences === null || originalReferences === void 0 ? void 0 : originalReferences.map(ref => [ref.name, ref]));

    for (const newRef of this.newReferences) {
      if (newRef.soReference) {
        refMap.set(newRef.name, newRef.soReference);
      } else {
        refMap.delete(newRef.name);
      }
    }

    return Array.from(refMap.values());
  }

}

exports.ConnectorReferenceHandler = ConnectorReferenceHandler;