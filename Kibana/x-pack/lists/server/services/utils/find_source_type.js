"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSourceType = void 0;

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findSourceType = (listItem, types = Object.keys(_securitysolutionIoTsListTypes.type.keys)) => {
  const foundEntry = Object.entries(listItem).find(([key, value]) => types.includes(key) && value != null);

  if (foundEntry != null && _securitysolutionIoTsListTypes.type.is(foundEntry[0])) {
    return foundEntry[0];
  } else {
    return null;
  }
};

exports.findSourceType = findSourceType;