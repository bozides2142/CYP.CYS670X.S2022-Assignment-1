"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.License = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class License {
  constructor() {
    (0, _defineProperty2.default)(this, "licenseStatus", {
      isValid: false,
      message: 'Invalid License'
    });
  }

  setup({
    pluginId,
    minimumLicenseType,
    defaultErrorMessage
  }, {
    licensing,
    logger
  }) {
    licensing.license$.subscribe(license => {
      const {
        state,
        message
      } = license.check(pluginId, minimumLicenseType);
      const hasRequiredLicense = state === 'valid';

      if (hasRequiredLicense) {
        this.licenseStatus = {
          isValid: true
        };
      } else {
        this.licenseStatus = {
          isValid: false,
          message: message || defaultErrorMessage
        };

        if (message) {
          logger.info(message);
        }
      }
    });
  }

  guardApiRoute(handler) {
    const license = this;
    return function licenseCheck(ctx, request, response) {
      const licenseStatus = license.getStatus();

      if (!licenseStatus.isValid) {
        return response.customError({
          body: {
            message: licenseStatus.message || ''
          },
          statusCode: 403
        });
      }

      return handler(ctx, request, response);
    };
  }

  getStatus() {
    return this.licenseStatus;
  }

}

exports.License = License;