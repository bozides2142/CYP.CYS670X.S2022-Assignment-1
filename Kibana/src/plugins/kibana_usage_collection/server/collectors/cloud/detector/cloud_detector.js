"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudDetector = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _aws = require("./aws");

var _azure = require("./azure");

var _gcp = require("./gcp");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SUPPORTED_SERVICES = [_aws.AWSCloudService, _azure.AzureCloudService, _gcp.GCPCloudService];

/**
 * The `CloudDetector` can be used to asynchronously detect the
 * cloud service that Kibana is running within.
 *
 * @internal
 */
class CloudDetector {
  constructor(options = {}) {
    var _options$cloudService;

    (0, _defineProperty2.default)(this, "cloudServices", void 0);
    (0, _defineProperty2.default)(this, "cloudDetails", void 0);
    (0, _defineProperty2.default)(this, "getCloudDetails", () => {
      return this.cloudDetails;
    });
    (0, _defineProperty2.default)(this, "detectCloudService", async () => {
      this.cloudDetails = await this.getCloudService();
    });
    this.cloudServices = (_options$cloudService = options.cloudServices) !== null && _options$cloudService !== void 0 ? _options$cloudService : SUPPORTED_SERVICES.map(Service => new Service());
  }
  /**
   * Get any cloud details that we have detected.
   */


  /**
   * Check every cloud service until the first one reports success from detection.
   */
  async getCloudService() {
    // check each service until we find one that is confirmed to match;
    // order is assumed to matter
    for (const service of this.cloudServices) {
      try {
        const serviceResponse = await service.checkIfService();

        if (serviceResponse.isConfirmed()) {
          return serviceResponse.toJSON();
        }
      } catch (ignoredError) {// ignored until we make wider use of this in the UI
      }
    } // explicitly null to differentiate from not having populated the field yet


    return null;
  }

}

exports.CloudDetector = CloudDetector;