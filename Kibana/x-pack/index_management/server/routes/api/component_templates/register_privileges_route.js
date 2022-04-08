"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrivilegesRoute = void 0;

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extractMissingPrivileges = (privilegesObject = {}) => Object.keys(privilegesObject).reduce((privileges, privilegeName) => {
  if (!privilegesObject[privilegeName]) {
    privileges.push(privilegeName);
  }

  return privileges;
}, []);

const registerPrivilegesRoute = ({
  router,
  config,
  lib: {
    handleEsError
  }
}) => {
  router.get({
    path: (0, _index.addBasePath)('/component_templates/privileges'),
    validate: false
  }, async (context, request, response) => {
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        cluster: []
      }
    }; // Skip the privileges check if security is not enabled

    if (!config.isSecurityEnabled()) {
      return response.ok({
        body: privilegesResult
      });
    }

    const {
      client
    } = context.core.elasticsearch;

    try {
      const {
        body: {
          has_all_requested: hasAllPrivileges,
          cluster
        }
      } = await client.asCurrentUser.security.hasPrivileges({
        body: {
          cluster: ['manage_index_templates']
        }
      });

      if (!hasAllPrivileges) {
        privilegesResult.missingPrivileges.cluster = extractMissingPrivileges(cluster);
      }

      privilegesResult.hasAllPrivileges = hasAllPrivileges;
      return response.ok({
        body: privilegesResult
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
};

exports.registerPrivilegesRoute = registerPrivilegesRoute;