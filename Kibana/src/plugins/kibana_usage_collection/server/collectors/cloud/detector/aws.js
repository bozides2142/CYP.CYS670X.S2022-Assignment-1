"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AWSCloudService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _promises = require("fs/promises");

var _lodash = require("lodash");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cloud_service = require("./cloud_service");

var _cloud_response = require("./cloud_response");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// We explicitly call out the version, 2016-09-02, rather than 'latest' to avoid unexpected changes
const SERVICE_ENDPOINT = 'http://169.254.169.254/2016-09-02/dynamic/instance-identity/document';
/** @internal */

/**
 * Checks and loads the service metadata for an Amazon Web Service VM if it is available.
 *
 * @internal
 */
class AWSCloudService extends _cloud_service.CloudService {
  constructor() {
    super('aws');
    (0, _defineProperty2.default)(this, "parseBody", body => {
      const name = this.getName();
      const id = (0, _lodash.get)(body, 'instanceId');
      const vmType = (0, _lodash.get)(body, 'instanceType');
      const region = (0, _lodash.get)(body, 'region');
      const zone = (0, _lodash.get)(body, 'availabilityZone');
      const metadata = (0, _lodash.omit)(body, [// remove keys we already have
      'instanceId', 'instanceType', 'region', 'availabilityZone', // remove keys that give too much detail
      'accountId', 'billingProducts', 'devpayProductCodes', 'privateIp']); // ensure we actually have some data

      if (id || vmType || region || zone) {
        return new _cloud_response.CloudServiceResponse(name, true, {
          id,
          vmType,
          region,
          zone,
          metadata
        });
      }

      return null;
    });
    (0, _defineProperty2.default)(this, "_isWindows", () => {
      return process.platform.startsWith('win');
    });
    (0, _defineProperty2.default)(this, "_checkIfService", async () => {
      try {
        const response = await (0, _nodeFetch.default)(SERVICE_ENDPOINT, {
          method: 'GET'
        });

        if (!response.ok || response.status === 404) {
          throw new Error('AWS request failed');
        }

        const jsonBody = await response.json();
        return this._parseResponse(jsonBody, this.parseBody);
      } catch (_) {
        return this.tryToDetectUuid();
      }
    });
    (0, _defineProperty2.default)(this, "tryToDetectUuid", async () => {
      const isWindows = this._isWindows(); // Windows does not have an easy way to check


      if (!isWindows) {
        const pathsToCheck = ['/sys/hypervisor/uuid', '/sys/devices/virtual/dmi/id/product_uuid'];
        const responses = await Promise.allSettled(pathsToCheck.map(path => (0, _promises.readFile)(path, 'utf8')));

        for (const response of responses) {
          let uuid;

          if (response.status === 'fulfilled' && typeof response.value === 'string') {
            // Some AWS APIs return it lowercase (like the file did in testing), while others return it uppercase
            uuid = response.value.trim().toLowerCase(); // There is a small chance of a false positive here in the unlikely event that a uuid which doesn't
            // belong to ec2 happens to be generated with `ec2` as the first three characters.

            if (uuid.startsWith('ec2')) {
              return new _cloud_response.CloudServiceResponse(this._name, true, {
                id: uuid
              });
            }
          }
        }

        return this._createUnconfirmedResponse();
      }

      return this._createUnconfirmedResponse();
    });
  }
  /**
   * Parse the AWS response, if possible.
   *
   * Example payload:
   * {
   *   "accountId" : "1234567890",
   *   "architecture" : "x86_64",
   *   "availabilityZone" : "us-west-2c",
   *   "billingProducts" : null,
   *   "devpayProductCodes" : null,
   *   "imageId" : "ami-6df1e514",
   *   "instanceId" : "i-0c7a5b7590a4d811c",
   *   "instanceType" : "t2.micro",
   *   "kernelId" : null,
   *   "pendingTime" : "2017-07-06T02:09:12Z",
   *   "privateIp" : "10.0.0.38",
   *   "ramdiskId" : null,
   *   "region" : "us-west-2"
   *   "version" : "2010-08-31",
   * }
   */


}

exports.AWSCloudService = AWSCloudService;