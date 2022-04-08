"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCapabilities = void 0;

var _check_privileges = require("./check_privileges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setupCapabilities = core => {
  core.capabilities.registerProvider(() => {
    return {
      fileUpload: {
        show: true
      }
    };
  });
  core.capabilities.registerSwitcher(async (request, capabilities, useDefaultCapabilities) => {
    if (useDefaultCapabilities) {
      return capabilities;
    }

    const [, {
      security
    }] = await core.getStartServices(); // Check the bare minimum set of privileges required to get some utility out of this feature

    const {
      hasImportPermission
    } = await (0, _check_privileges.checkFileUploadPrivileges)({
      authorization: security === null || security === void 0 ? void 0 : security.authz,
      request,
      checkCreateIndexPattern: true,
      checkHasManagePipeline: false
    });

    if (!hasImportPermission) {
      return {
        fileUpload: {
          show: false
        }
      };
    }

    return capabilities;
  });
};

exports.setupCapabilities = setupCapabilities;