"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWorkpadRouteContext = void 0;

var _constants = require("../common/lib/constants");

var _workpad_references = require("./saved_objects/workpad_references");

var _get_id = require("../common/lib/get_id");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createWorkpadRouteContext = ({
  expressions
}) => {
  return context => ({
    workpad: {
      create: async workpad => {
        const now = new Date().toISOString();
        const {
          id: maybeId,
          ...attributes
        } = workpad;
        const id = maybeId ? maybeId : (0, _get_id.getId)('workpad');
        const {
          workpad: extractedAttributes,
          references
        } = (0, _workpad_references.extractReferences)(attributes, expressions);
        return await context.core.savedObjects.client.create(_constants.CANVAS_TYPE, { ...extractedAttributes,
          '@timestamp': now,
          '@created': now
        }, {
          id,
          references
        });
      },
      import: async workpad => {
        const now = new Date().toISOString();
        const {
          id: maybeId,
          ...workpadWithoutId
        } = workpad; // Functionality of running migrations on import of workpads was implemented in v8.1.0.
        // As only attributes of the saved object workpad are exported, to run migrations it is necessary
        // to specify the minimal version of possible migrations to execute them. It is v8.0.0 in the current case.

        const DEFAULT_MIGRATION_VERSION = {
          [_constants.CANVAS_TYPE]: '8.0.0'
        };
        const DEFAULT_CORE_MIGRATION_VERSION = '8.0.0';
        const id = maybeId ? maybeId : (0, _get_id.getId)('workpad');
        return await context.core.savedObjects.client.create(_constants.CANVAS_TYPE, {
          isWriteable: true,
          ...workpadWithoutId,
          '@timestamp': now,
          '@created': now
        }, {
          migrationVersion: DEFAULT_MIGRATION_VERSION,
          coreMigrationVersion: DEFAULT_CORE_MIGRATION_VERSION,
          id
        });
      },
      get: async id => {
        const workpad = await context.core.savedObjects.client.get(_constants.CANVAS_TYPE, id);
        workpad.attributes = (0, _workpad_references.injectReferences)(workpad.attributes, workpad.references, expressions);
        return workpad;
      },
      resolve: async id => {
        const resolved = await context.core.savedObjects.client.resolve(_constants.CANVAS_TYPE, id);
        resolved.saved_object.attributes = (0, _workpad_references.injectReferences)(resolved.saved_object.attributes, resolved.saved_object.references, expressions);
        return resolved;
      },
      update: async (id, {
        id: omittedId,
        ...workpad
      }) => {
        const now = new Date().toISOString();
        const workpadObject = await context.core.savedObjects.client.get(_constants.CANVAS_TYPE, id);
        const injectedAttributes = (0, _workpad_references.injectReferences)(workpadObject.attributes, workpadObject.references, expressions);
        const updatedAttributes = { ...injectedAttributes,
          ...workpad,
          '@timestamp': now,
          // always update the modified time
          '@created': workpadObject.attributes['@created'] // ensure created is not modified

        };
        const extracted = (0, _workpad_references.extractReferences)(updatedAttributes, expressions);
        return await context.core.savedObjects.client.create(_constants.CANVAS_TYPE, extracted.workpad, {
          overwrite: true,
          id,
          references: extracted.references
        });
      }
    }
  });
};

exports.createWorkpadRouteContext = createWorkpadRouteContext;