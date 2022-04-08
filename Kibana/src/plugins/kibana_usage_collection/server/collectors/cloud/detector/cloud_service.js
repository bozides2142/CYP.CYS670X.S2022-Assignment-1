"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _cloud_response = require("./cloud_response");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * CloudService provides a mechanism for cloud services to be checked for
 * metadata that may help to determine the best defaults and priorities.
 */
class CloudService {
  constructor(name) {
    (0, _defineProperty2.default)(this, "_name", void 0);
    (0, _defineProperty2.default)(this, "getName", () => {
      return this._name;
    });
    (0, _defineProperty2.default)(this, "checkIfService", async () => {
      try {
        return await this._checkIfService();
      } catch (e) {
        return this._createUnconfirmedResponse();
      }
    });
    (0, _defineProperty2.default)(this, "_checkIfService", async () => {
      // should always be overridden by a subclass
      return Promise.reject(new Error('not implemented'));
    });
    (0, _defineProperty2.default)(this, "_createUnconfirmedResponse", () => {
      return _cloud_response.CloudServiceResponse.unconfirmed(this._name);
    });
    (0, _defineProperty2.default)(this, "_stringToJson", value => {
      // note: this will throw an error if this is not a string
      value = value.trim();

      try {
        const json = JSON.parse(value); // we don't want to return scalar values, arrays, etc.

        if (!(0, _lodash.isPlainObject)(json)) {
          throw new Error('not a plain object');
        }

        return json;
      } catch (e) {
        throw new Error(`'${value}' is not a JSON object`);
      }
    });
    (0, _defineProperty2.default)(this, "_parseResponse", (body, parseBodyFn) => {
      // parse it if necessary
      const jsonBody = typeof body === 'string' ? this._stringToJson(body) : body;

      if ((0, _lodash.isObject)(jsonBody) && typeof parseBodyFn !== 'undefined') {
        const response = parseBodyFn(jsonBody);

        if (response) {
          return response;
        }
      } // use default handling


      throw new Error('Unable to handle body');
    });
    this._name = name.toLowerCase();
  }
  /**
   * Get the search-friendly name of the Cloud Service.
   */


}

exports.CloudService = CloudService;