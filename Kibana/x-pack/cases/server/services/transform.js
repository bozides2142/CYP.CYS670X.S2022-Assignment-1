"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findConnectorIdReference = findConnectorIdReference;
exports.transformESConnectorOrUseDefault = transformESConnectorOrUseDefault;
exports.transformESConnectorToExternalModel = transformESConnectorToExternalModel;
exports.transformFieldsToESModel = transformFieldsToESModel;

var _server = require("../../../actions/server");

var _utils = require("../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function findConnectorIdReference(name, references) {
  return references === null || references === void 0 ? void 0 : references.find(ref => ref.type === _server.ACTION_SAVED_OBJECT_TYPE && ref.name === name);
}

function transformESConnectorToExternalModel({
  connector,
  references,
  referenceName
}) {
  const connectorIdRef = findConnectorIdReference(referenceName, references);
  return transformConnectorFieldsToExternalModel(connector, connectorIdRef === null || connectorIdRef === void 0 ? void 0 : connectorIdRef.id);
}

function transformConnectorFieldsToExternalModel(connector, connectorId) {
  if (!connector) {
    return;
  } // if the connector is valid, but we can't find it's ID in the reference, then it must be malformed
  // or it was a none connector which doesn't have a reference (a none connector doesn't point to any actual connector
  // saved object)


  if (!connectorId) {
    return (0, _utils.getNoneCaseConnector)();
  }

  const connectorTypeField = {
    type: connector.type,
    fields: connector.fields != null && connector.fields.length > 0 ? connector.fields.reduce((fields, {
      key,
      value
    }) => ({ ...fields,
      [key]: value
    }), {}) : null
  };
  return {
    id: connectorId,
    name: connector.name,
    ...connectorTypeField
  };
}

function transformESConnectorOrUseDefault({
  connector,
  references,
  referenceName
}) {
  var _transformESConnector;

  return (_transformESConnector = transformESConnectorToExternalModel({
    connector,
    references,
    referenceName
  })) !== null && _transformESConnector !== void 0 ? _transformESConnector : (0, _utils.getNoneCaseConnector)();
}

function transformFieldsToESModel(connector) {
  if (!connector.fields) {
    return [];
  }

  return Object.entries(connector.fields).reduce((acc, [key, value]) => [...acc, {
    key,
    value
  }], []);
}