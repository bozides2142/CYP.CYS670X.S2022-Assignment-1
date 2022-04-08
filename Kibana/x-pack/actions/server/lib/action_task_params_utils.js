"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_REF_NAME = void 0;
exports.extractSavedObjectReferences = extractSavedObjectReferences;
exports.injectSavedObjectReferences = injectSavedObjectReferences;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ACTION_REF_NAME = `actionRef`;
exports.ACTION_REF_NAME = ACTION_REF_NAME;

function extractSavedObjectReferences(actionId, isPreconfigured, relatedSavedObjects) {
  const references = [];
  const relatedSavedObjectWithRefs = []; // Add action saved object to reference if it is not preconfigured

  if (!isPreconfigured) {
    references.push({
      id: actionId,
      name: ACTION_REF_NAME,
      type: 'action'
    });
  } // Add related saved objects, if any


  (relatedSavedObjects !== null && relatedSavedObjects !== void 0 ? relatedSavedObjects : []).forEach((relatedSavedObject, index) => {
    relatedSavedObjectWithRefs.push({ ...relatedSavedObject,
      id: `related_${relatedSavedObject.type}_${index}`
    });
    references.push({
      id: relatedSavedObject.id,
      name: `related_${relatedSavedObject.type}_${index}`,
      type: relatedSavedObject.type
    });
  });
  return {
    references,
    ...(relatedSavedObjects ? {
      relatedSavedObjectWithRefs
    } : {})
  };
}

function injectSavedObjectReferences(references, relatedSavedObjects) {
  var _references;

  references = (_references = references) !== null && _references !== void 0 ? _references : []; // Look for for the action id

  const action = references.find(ref => ref.name === ACTION_REF_NAME);
  const injectedRelatedSavedObjects = (relatedSavedObjects !== null && relatedSavedObjects !== void 0 ? relatedSavedObjects : []).flatMap(relatedSavedObject => {
    const reference = references.find(ref => ref.name === relatedSavedObject.id); // relatedSavedObjects are used only in the event log document that is written during
    // action execution. Because they are not critical to the actual execution of the action
    // we will not throw an error if no reference is found matching this related saved object

    return reference ? [{ ...relatedSavedObject,
      id: reference.id
    }] : [relatedSavedObject];
  });
  const result = {};

  if (action) {
    result.actionId = action.id;
  }

  if (relatedSavedObjects) {
    result.relatedSavedObjects = injectedRelatedSavedObjects;
  }

  return result;
}