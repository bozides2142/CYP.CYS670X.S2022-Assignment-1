"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userActionsMigrations = void 0;

var _ = require("..");

var _api = require("../../../../common/api");

var _alerts = require("./alerts");

var _connector_id = require("./connector_id");

var _payload = require("./payload");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


const userActionsMigrations = {
  '7.10.0': doc => {
    const {
      action_field,
      new_value,
      old_value,
      ...restAttributes
    } = doc.attributes;

    if (action_field == null || !Array.isArray(action_field) || action_field[0] !== 'connector_id') {
      return { ...doc,
        references: doc.references || []
      };
    }

    return { ...doc,
      attributes: { ...restAttributes,
        action_field: ['connector'],
        new_value: new_value != null ? JSON.stringify({
          id: new_value,
          name: 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }) : new_value,
        old_value: old_value != null ? JSON.stringify({
          id: old_value,
          name: 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }) : old_value
      },
      references: doc.references || []
    };
  },
  '7.14.0': doc => {
    return (0, _.addOwnerToSO)(doc);
  },
  '7.16.0': _connector_id.userActionsConnectorIdMigration,
  '8.0.0': _alerts.removeRuleInformation,
  '8.1.0': _payload.payloadMigration
};
exports.userActionsMigrations = userActionsMigrations;