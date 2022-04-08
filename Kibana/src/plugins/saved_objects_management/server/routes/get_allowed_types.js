"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllowedTypesRoute = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const convertType = sot => {
  var _sot$management$displ, _sot$management;

  return {
    name: sot.name,
    namespaceType: sot.namespaceType,
    hidden: sot.hidden,
    displayName: (_sot$management$displ = (_sot$management = sot.management) === null || _sot$management === void 0 ? void 0 : _sot$management.displayName) !== null && _sot$management$displ !== void 0 ? _sot$management$displ : sot.name
  };
};

const registerGetAllowedTypesRoute = router => {
  router.get({
    path: '/api/kibana/management/saved_objects/_allowed_types',
    validate: false
  }, async (context, req, res) => {
    const allowedTypes = context.core.savedObjects.typeRegistry.getImportableAndExportableTypes().filter(type => {
      var _visibleInManagement;

      return (_visibleInManagement = type.management.visibleInManagement) !== null && _visibleInManagement !== void 0 ? _visibleInManagement : true;
    }).map(convertType);
    return res.ok({
      body: {
        types: allowedTypes
      }
    });
  });
};

exports.registerGetAllowedTypesRoute = registerGetAllowedTypesRoute;