"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IpAddress = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ipaddr = _interopRequireDefault(require("ipaddr.js"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isIPv6(value) {
  return value.kind() === 'ipv6';
}

class IpAddress {
  constructor(ipAddress) {
    (0, _defineProperty2.default)(this, "value", void 0);

    try {
      this.value = Array.isArray(ipAddress) ? _ipaddr.default.fromByteArray(ipAddress) : _ipaddr.default.parse(`${ipAddress}`);
    } catch {
      throw Error('Invalid IP address: ' + ipAddress);
    }
  }

  toString() {
    if (isIPv6(this.value)) {
      return this.value.toRFC5952String();
    }

    return this.value.toString();
  }

}

exports.IpAddress = IpAddress;