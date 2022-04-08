"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFileUploadPrivileges = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const checkFileUploadPrivileges = async ({
  request,
  authorization,
  checkHasManagePipeline,
  checkCreateIndexPattern,
  indexName
}) => {
  var _authorization$mode$u;

  const requiresAuthz = (_authorization$mode$u = authorization === null || authorization === void 0 ? void 0 : authorization.mode.useRbacForRequest(request)) !== null && _authorization$mode$u !== void 0 ? _authorization$mode$u : false;

  if (!authorization || !requiresAuthz) {
    return {
      hasImportPermission: true
    };
  }

  if (!request.auth.isAuthenticated) {
    return {
      hasImportPermission: false
    };
  }

  const checkPrivilegesPayload = {
    elasticsearch: {
      cluster: checkHasManagePipeline ? ['manage_pipeline'] : [],
      index: indexName ? {
        [indexName]: ['create', 'create_index']
      } : {}
    }
  };

  if (checkCreateIndexPattern) {
    checkPrivilegesPayload.kibana = [authorization.actions.savedObject.get('index-pattern', 'create')];
  }

  const checkPrivileges = authorization.checkPrivilegesDynamicallyWithRequest(request);
  const checkPrivilegesResp = await checkPrivileges(checkPrivilegesPayload);
  return {
    hasImportPermission: checkPrivilegesResp.hasAllRequested
  };
};

exports.checkFileUploadPrivileges = checkFileUploadPrivileges;