"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableTypes = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

let ObservableTypes;
exports.ObservableTypes = ObservableTypes;

(function (ObservableTypes) {
  ObservableTypes["ip4"] = "ipv4-addr";
  ObservableTypes["url"] = "URL";
  ObservableTypes["sha256"] = "SHA256";
})(ObservableTypes || (exports.ObservableTypes = ObservableTypes = {}));