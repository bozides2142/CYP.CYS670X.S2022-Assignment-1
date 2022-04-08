"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrivilegesRoute = void 0;

var _constants = require("../../../common/constants");
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
  config
}) => {
  router.get({
    path: `${_constants.API_BASE_PATH}/privileges`,
    validate: false
  }, async (ctx, req, res) => {
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        cluster: []
      }
    }; // Skip the privileges check if security is not enabled

    if (!config.isSecurityEnabled()) {
      return res.ok({
        body: privilegesResult
      });
    }

    const {
      client: clusterClient
    } = ctx.core.elasticsearch;
    const {
      body: {
        has_all_requested: hasAllPrivileges,
        cluster
      }
    } = await clusterClient.asCurrentUser.security.hasPrivileges({
      // @ts-expect-error @elastic/elasticsearch SecurityClusterPrivilege doesn’t contain all the priviledges
      body: {
        cluster: _constants.APP_CLUSTER_REQUIRED_PRIVILEGES
      }
    });

    if (!hasAllPrivileges) {
      privilegesResult.missingPrivileges.cluster = extractMissingPrivileges(cluster);
    }

    privilegesResult.hasAllPrivileges = hasAllPrivileges;
    return res.ok({
      body: privilegesResult
    });
  });
};

exports.registerPrivilegesRoute = registerPrivilegesRoute;