"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformConnectorsForExport = transformConnectorsForExport;

var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function transformConnectorsForExport(connectors, actionTypeRegistry) {
  return connectors.map(c => {
    const connector = c;
    return transformConnectorForExport(connector, actionTypeRegistry.get(connector.attributes.actionTypeId));
  });
}

function transformConnectorForExport(connector, actionType) {
  let isMissingSecrets = false;

  try {
    var _ref, _connector$attributes, _connector$attributes2; // If connector requires secrets, this will throw an error


    (0, _lib.validateSecrets)(actionType, {}); // If connector has optional (or no) secrets, set isMissingSecrets value to value of hasAuth
    // If connector doesn't have hasAuth value, default to isMissingSecrets: false

    isMissingSecrets = (_ref = connector === null || connector === void 0 ? void 0 : (_connector$attributes = connector.attributes) === null || _connector$attributes === void 0 ? void 0 : (_connector$attributes2 = _connector$attributes.config) === null || _connector$attributes2 === void 0 ? void 0 : _connector$attributes2.hasAuth) !== null && _ref !== void 0 ? _ref : false;
  } catch (err) {
    isMissingSecrets = true;
  } // Skip connectors


  return { ...connector,
    attributes: { ...connector.attributes,
      isMissingSecrets
    }
  };
}