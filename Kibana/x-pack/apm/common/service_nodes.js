"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SERVICE_NODE_NAME_MISSING = void 0;
exports.getServiceNodeName = getServiceNodeName;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SERVICE_NODE_NAME_MISSING = '_service_node_name_missing_';
exports.SERVICE_NODE_NAME_MISSING = SERVICE_NODE_NAME_MISSING;

const UNIDENTIFIED_SERVICE_NODES_LABEL = _i18n.i18n.translate('xpack.apm.serviceNodeNameMissing', {
  defaultMessage: '(Empty)'
});

function getServiceNodeName(serviceNodeName) {
  return serviceNodeName === SERVICE_NODE_NAME_MISSING || !serviceNodeName ? UNIDENTIFIED_SERVICE_NODES_LABEL : serviceNodeName;
}