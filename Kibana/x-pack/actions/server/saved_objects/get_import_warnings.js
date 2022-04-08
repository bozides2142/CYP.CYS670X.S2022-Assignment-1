"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GO_TO_CONNECTORS_BUTTON_LABLE = void 0;
exports.getImportWarnings = getImportWarnings;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getImportWarnings(connectors) {
  const connectorsWithSecrets = connectors.filter(connector => connector.attributes.isMissingSecrets);

  if (connectorsWithSecrets.length === 0) {
    return [];
  }

  const message = _i18n.i18n.translate('xpack.actions.savedObjects.onImportText', {
    defaultMessage: '{connectorsWithSecretsLength} {connectorsWithSecretsLength, plural, one {connector has} other {connectors have}} sensitive information that require updates.',
    values: {
      connectorsWithSecretsLength: connectorsWithSecrets.length
    }
  });

  return [{
    type: 'action_required',
    message,
    actionPath: '/app/management/insightsAndAlerting/triggersActions/connectors',
    buttonLabel: GO_TO_CONNECTORS_BUTTON_LABLE
  }];
}

const GO_TO_CONNECTORS_BUTTON_LABLE = _i18n.i18n.translate('xpack.actions.savedObjects.goToConnectorsButtonText', {
  defaultMessage: 'Go to connectors'
});

exports.GO_TO_CONNECTORS_BUTTON_LABLE = GO_TO_CONNECTORS_BUTTON_LABLE;