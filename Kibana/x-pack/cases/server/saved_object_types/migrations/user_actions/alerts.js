"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeRuleInformation = removeRuleInformation;

var _api = require("../../../../common/api");

var _constants = require("../constants");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


function removeRuleInformation(doc, context) {
  var _doc$references;

  const originalDocWithReferences = { ...doc,
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };

  try {
    var _doc$references2;

    const {
      new_value,
      action,
      action_field
    } = doc.attributes;

    if (!isCreateComment(action, action_field)) {
      return originalDocWithReferences;
    }

    const decodedNewValueData = decodeNewValue(new_value);

    if (!isAlertUserAction(decodedNewValueData)) {
      return originalDocWithReferences;
    }

    const encodedValue = JSON.stringify({ ...decodedNewValueData,
      rule: {
        id: null,
        name: null
      }
    });
    return { ...doc,
      attributes: { ...doc.attributes,
        new_value: encodedValue
      },
      references: (_doc$references2 = doc.references) !== null && _doc$references2 !== void 0 ? _doc$references2 : []
    };
  } catch (error) {
    (0, _utils.logError)({
      id: doc.id,
      context,
      error,
      docType: 'user action alerts',
      docKey: 'userAction'
    });
    return originalDocWithReferences;
  }
}

function decodeNewValue(data) {
  if (data === undefined || data === null) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

function isAlertUserAction(newValue) {
  const unsafeAlertData = newValue;
  return unsafeAlertData !== undefined && unsafeAlertData !== null && (unsafeAlertData.type === _constants.GENERATED_ALERT || unsafeAlertData.type === _api.CommentType.alert);
}

function isCreateComment(action, actionFields) {
  return action === 'create' && actionFields !== null && actionFields !== undefined && actionFields.includes('comment');
}