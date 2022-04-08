"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudServiceResponse = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Represents a single response from any individual CloudService.
 */
class CloudServiceResponse {
  /**
   * Create an unconfirmed CloudServiceResponse by the name.
   */
  static unconfirmed(name) {
    return new CloudServiceResponse(name, false, {});
  }
  /**
   * Create a new CloudServiceResponse.
   *
   * @param {String} name The name of the CloudService.
   * @param {Boolean} confirmed Confirmed to be the current CloudService.
   * @param {String} id The optional ID of the VM (depends on the cloud service).
   * @param {String} vmType The optional type of VM (depends on the cloud service).
   * @param {String} region The optional region of the VM (depends on the cloud service).
   * @param {String} availabilityZone The optional availability zone within the region (depends on the cloud service).
   * @param {Object} metadata The optional metadata associated with the VM.
   */


  constructor(name, confirmed, {
    id,
    vmType,
    region,
    zone,
    metadata
  }) {
    (0, _defineProperty2.default)(this, "_name", void 0);
    (0, _defineProperty2.default)(this, "_confirmed", void 0);
    (0, _defineProperty2.default)(this, "_id", void 0);
    (0, _defineProperty2.default)(this, "_vmType", void 0);
    (0, _defineProperty2.default)(this, "_region", void 0);
    (0, _defineProperty2.default)(this, "_zone", void 0);
    (0, _defineProperty2.default)(this, "_metadata", void 0);
    this._name = name;
    this._confirmed = confirmed;
    this._id = id;
    this._metadata = metadata;
    this._region = region;
    this._vmType = vmType;
    this._zone = zone;
  }
  /**
   * Get the name of the CloudService associated with the current response.
   */


  getName() {
    return this._name;
  }
  /**
   * Determine if the Cloud Service is confirmed to exist.
   */


  isConfirmed() {
    return this._confirmed;
  }
  /**
   * Create a plain JSON object that can be indexed that represents the response.
   */


  toJSON() {
    if (!this._confirmed) {
      throw new Error(`[${this._name}] is not confirmed`);
    }

    return {
      name: this._name,
      id: this._id,
      vm_type: this._vmType,
      region: this._region,
      zone: this._zone,
      metadata: this._metadata
    };
  }

}

exports.CloudServiceResponse = CloudServiceResponse;