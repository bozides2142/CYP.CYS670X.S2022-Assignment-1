"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBulkGetRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerBulkGetRoute = (router, managementServicePromise) => {
  router.post({
    path: '/api/kibana/management/saved_objects/_bulk_get',
    validate: {
      body: _configSchema.schema.arrayOf(_configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }))
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const managementService = await managementServicePromise;
    const {
      getClient,
      typeRegistry
    } = context.core.savedObjects;
    const objects = req.body;
    const uniqueTypes = objects.reduce((acc, {
      type
    }) => acc.add(type), new Set());
    const includedHiddenTypes = Array.from(uniqueTypes).filter(type => typeRegistry.isHidden(type) && typeRegistry.isImportableAndExportable(type));
    const client = getClient({
      includedHiddenTypes
    });
    const response = await client.bulkGet(objects);
    const enhancedObjects = response.saved_objects.map(obj => {
      if (!obj.error) {
        return (0, _lib.injectMetaAttributes)(obj, managementService);
      }

      return obj;
    });
    return res.ok({
      body: enhancedObjects
    });
  }));
};

exports.registerBulkGetRoute = registerBulkGetRoute;