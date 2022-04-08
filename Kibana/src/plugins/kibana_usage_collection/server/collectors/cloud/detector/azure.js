"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AzureCloudService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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
// 2017-04-02 is the first GA release of this API
const SERVICE_ENDPOINT = 'http://169.254.169.254/metadata/instance?api-version=2017-04-02';

/**
 * Checks and loads the service metadata for an Azure VM if it is available.
 *
 * @internal
 */
class AzureCloudService extends _cloud_service.CloudService {
  constructor() {
    super('azure');
    (0, _defineProperty2.default)(this, "parseBody", body => {
      const name = this.getName();
      const compute = (0, _lodash.get)(body, 'compute');
      const id = (0, _lodash.get)(compute, 'vmId');
      const vmType = (0, _lodash.get)(compute, 'vmSize');
      const region = (0, _lodash.get)(compute, 'location'); // remove keys that we already have; explicitly undefined so we don't send it when empty

      const metadata = compute ? (0, _lodash.omit)(compute, ['vmId', 'vmSize', 'location']) : undefined; // we don't actually use network, but we check for its existence to see if this is a response from Azure

      const network = (0, _lodash.get)(body, 'network'); // ensure we actually have some data

      if (id || vmType || region) {
        return new _cloud_response.CloudServiceResponse(name, true, {
          id,
          vmType,
          region,
          metadata
        });
      } else if (network) {
        // classic-managed VMs in Azure don't provide compute so we highlight the lack of info
        return new _cloud_response.CloudServiceResponse(name, true, {
          metadata: {
            classic: true
          }
        });
      }

      return null;
    });
    (0, _defineProperty2.default)(this, "_checkIfService", async () => {
      const response = await (0, _nodeFetch.default)(SERVICE_ENDPOINT, {
        method: 'GET',
        headers: {
          // Azure requires this header
          Metadata: 'true'
        }
      });

      if (!response.ok || response.status === 404) {
        throw new Error('Azure request failed');
      }

      const jsonBody = await response.json();
      return this._parseResponse(jsonBody, this.parseBody);
    });
  }
  /**
   * Parse the Azure response, if possible.
   *
   * Azure VMs created using the "classic" method, as opposed to the resource manager,
   * do not provide a "compute" field / object. However, both report the "network" field / object.
   *
   * Example payload (with network object ignored):
   * {
   *   "compute": {
   *     "location": "eastus",
   *     "name": "my-ubuntu-vm",
   *     "offer": "UbuntuServer",
   *     "osType": "Linux",
   *     "platformFaultDomain": "0",
   *     "platformUpdateDomain": "0",
   *     "publisher": "Canonical",
   *     "sku": "16.04-LTS",
   *     "version": "16.04.201706191",
   *     "vmId": "d4c57456-2b3b-437a-9f1f-7082cfce02d4",
   *     "vmSize": "Standard_A1"
   *   },
   *   "network": {
   *     ...
   *   }
   * }
   */


}

exports.AzureCloudService = AzureCloudService;