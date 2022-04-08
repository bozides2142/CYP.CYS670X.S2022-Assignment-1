"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privilegesCheckRoute = void 0;

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const privilegesCheckRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/privileges_check',
    validate: {},
    options: {
      tags: [`access:${_common.PLUGIN_ID}-readLiveQueries`]
    }
  }, async (context, request, response) => {
    if (osqueryContext.security.authz.mode.useRbacForRequest(request)) {
      const checkPrivileges = osqueryContext.security.authz.checkPrivilegesDynamicallyWithRequest(request);
      const {
        hasAllRequested
      } = await checkPrivileges({
        elasticsearch: {
          cluster: [],
          index: {
            [`logs-${_common.OSQUERY_INTEGRATION_NAME}.result*`]: ['read']
          }
        }
      });
      return response.ok({
        body: `${hasAllRequested}`
      });
    }

    return response.ok({
      body: 'true'
    });
  });
};

exports.privilegesCheckRoute = privilegesCheckRoute;