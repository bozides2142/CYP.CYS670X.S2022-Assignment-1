"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureMigrations = exports.configureConnectorIdMigration = void 0;

var _api = require("../../../common/api");

var _ = require(".");

var _constants = require("../../common/constants");

var _connector_id = require("./user_actions/connector_id");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


const configureConnectorIdMigration = doc => {
  // removing the id field since it will be stored in the references instead
  const {
    connector,
    ...restAttributes
  } = doc.attributes;
  const {
    transformedConnector,
    references: connectorReferences
  } = (0, _connector_id.transformConnectorIdToReference)(_constants.CONNECTOR_ID_REFERENCE_NAME, connector);
  const {
    references = []
  } = doc;
  return { ...doc,
    attributes: { ...restAttributes,
      ...transformedConnector
    },
    references: [...references, ...connectorReferences]
  };
};

exports.configureConnectorIdMigration = configureConnectorIdMigration;
const configureMigrations = {
  '7.10.0': doc => {
    const {
      connector_id,
      connector_name,
      ...restAttributes
    } = doc.attributes;
    return { ...doc,
      attributes: { ...restAttributes,
        connector: {
          id: connector_id !== null && connector_id !== void 0 ? connector_id : 'none',
          name: connector_name !== null && connector_name !== void 0 ? connector_name : 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }
      },
      references: doc.references || []
    };
  },
  '7.14.0': doc => {
    return (0, _.addOwnerToSO)(doc);
  },
  '7.15.0': configureConnectorIdMigration
};
exports.configureMigrations = configureMigrations;