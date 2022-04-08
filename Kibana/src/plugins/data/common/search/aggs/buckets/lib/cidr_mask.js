"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CidrMask = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ipaddr = _interopRequireDefault(require("ipaddr.js"));

var _utils = require("../../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class CidrMask {
  static getNetmask(size, prefix) {
    return new Array(size).fill(255).map((byte, index) => {
      const bytePrefix = 8 - Math.min(Math.max(prefix - index * 8, 0), 8); // eslint-disable-next-line no-bitwise

      return byte >> bytePrefix << bytePrefix;
    });
  }

  constructor(cidr) {
    (0, _defineProperty2.default)(this, "address", void 0);
    (0, _defineProperty2.default)(this, "netmask", void 0);
    (0, _defineProperty2.default)(this, "prefix", void 0);

    try {
      const [address, prefix] = _ipaddr.default.parseCIDR(cidr);

      this.address = address.toByteArray();
      this.netmask = CidrMask.getNetmask(this.address.length, prefix);
      this.prefix = prefix;
    } catch {
      throw Error('Invalid CIDR mask: ' + cidr);
    }
  }

  getBroadcastAddress() {
    // eslint-disable-next-line no-bitwise
    const broadcast = this.address.map((byte, index) => byte | this.netmask[index] ^ 255);
    return new _utils.IpAddress(broadcast).toString();
  }

  getNetworkAddress() {
    // eslint-disable-next-line no-bitwise
    const network = this.address.map((byte, index) => byte & this.netmask[index]);
    return new _utils.IpAddress(network).toString();
  }

  getRange() {
    return {
      from: this.getNetworkAddress(),
      to: this.getBroadcastAddress()
    };
  }

  toString() {
    return `${new _utils.IpAddress(this.address)}/${this.prefix}`;
  }

}

exports.CidrMask = CidrMask;