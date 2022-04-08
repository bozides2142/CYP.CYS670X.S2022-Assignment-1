"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActionFieldType = exports.PushConnectorIdReferenceName = exports.ConnectorIdReferenceName = void 0;
exports.extractConnectorIdFromJson = extractConnectorIdFromJson;
exports.extractConnectorIdHelper = extractConnectorIdHelper;
exports.formatDocumentWithConnectorReferences = formatDocumentWithConnectorReferences;
exports.isConnectorUserAction = isConnectorUserAction;
exports.isCreateCaseConnector = isCreateCaseConnector;
exports.isCreateConnector = isCreateConnector;
exports.isPush = isPush;
exports.isUpdateConnector = isUpdateConnector;
exports.transformConnectorFromCreateAndUpdateAction = transformConnectorFromCreateAndUpdateAction;
exports.transformPushConnectorIdToReference = exports.transformConnectorIdToReference = void 0;
exports.userActionsConnectorIdMigration = userActionsConnectorIdMigration;

var _api = require("../../../../common/api");

var _constants = require("../../../common/constants");

var _utils = require("../../../common/utils");

var _server = require("../../../../../actions/server");

var _utils2 = require("../utils");

var _constants2 = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


function isCreateConnector(action, actionFields) {
  return action === 'create' && actionFields != null && actionFields.includes('connector');
}

function isUpdateConnector(action, actionFields) {
  return action === 'update' && actionFields != null && actionFields.includes('connector');
}

function isPush(action, actionFields) {
  return action === 'push-to-service' && actionFields != null && actionFields.includes('pushed');
}
/**
 * Indicates whether which user action field is being parsed, the new_value or the old_value.
 */


let UserActionFieldType;
/**
 * Extracts the connector id from a json encoded string and formats it as a saved object reference. This will remove
 * the field it extracted the connector id from.
 */

exports.UserActionFieldType = UserActionFieldType;

(function (UserActionFieldType) {
  UserActionFieldType["New"] = "New";
  UserActionFieldType["Old"] = "Old";
})(UserActionFieldType || (exports.UserActionFieldType = UserActionFieldType = {}));

function extractConnectorIdFromJson({
  action,
  actionFields,
  actionDetails,
  fieldType
}) {
  if (!action || !actionFields || !actionDetails) {
    return {
      transformedActionDetails: actionDetails,
      references: []
    };
  }

  const decodedJson = JSON.parse(actionDetails);
  return extractConnectorIdHelper({
    action,
    actionFields,
    actionDetails: decodedJson,
    fieldType
  });
}
/**
 * Internal helper function for extracting the connector id. This is only exported for usage in unit tests.
 * This function handles encoding the transformed fields as a json string
 */


function extractConnectorIdHelper({
  action,
  actionFields,
  actionDetails,
  fieldType
}) {
  let transformedActionDetails = actionDetails;
  let referencesToReturn = [];

  try {
    if (isCreateCaseConnector(action, actionFields, actionDetails)) {
      const {
        transformedActionDetails: transformedConnectorPortion,
        references
      } = transformConnectorFromCreateAndUpdateAction(actionDetails.connector, fieldType); // the above call only transforms the connector portion of the action details so let's add back
      // the rest of the details and we'll overwrite the connector portion when the transformed one

      transformedActionDetails = { ...actionDetails,
        ...transformedConnectorPortion
      };
      referencesToReturn = references;
    } else if (isUpdateCaseConnector(action, actionFields, actionDetails)) {
      const {
        transformedActionDetails: {
          connector: transformedConnector
        },
        references
      } = transformConnectorFromCreateAndUpdateAction(actionDetails, fieldType);
      transformedActionDetails = transformedConnector;
      referencesToReturn = references;
    } else if (isPushConnector(action, actionFields, actionDetails)) {
      ({
        transformedActionDetails,
        references: referencesToReturn
      } = transformConnectorFromPushAction(actionDetails, fieldType));
    }
  } catch (error) {// ignore any errors, we'll just return whatever was passed in for action details in that case
  }

  return {
    transformedActionDetails: JSON.stringify(transformedActionDetails),
    references: referencesToReturn
  };
}

function isCreateCaseConnector(action, actionFields, actionDetails) {
  try {
    const unsafeCase = actionDetails;
    return isCreateConnector(action, actionFields) && unsafeCase.connector !== undefined && _api.CaseConnectorRt.is(unsafeCase.connector);
  } catch {
    return false;
  }
}

const ConnectorIdReferenceName = {
  [UserActionFieldType.New]: _constants.CONNECTOR_ID_REFERENCE_NAME,
  [UserActionFieldType.Old]: _constants2.USER_ACTION_OLD_ID_REF_NAME
};
exports.ConnectorIdReferenceName = ConnectorIdReferenceName;

function transformConnectorFromCreateAndUpdateAction(connector, fieldType) {
  const {
    transformedConnector,
    references
  } = transformConnectorIdToReference(ConnectorIdReferenceName[fieldType], connector);
  return {
    transformedActionDetails: transformedConnector,
    references
  };
}

const transformConnectorIdToReference = (referenceName, connector) => {
  const {
    id: connectorId,
    ...restConnector
  } = connector !== null && connector !== void 0 ? connector : {};
  const references = createConnectorReference(connectorId, _server.ACTION_SAVED_OBJECT_TYPE, referenceName);
  const {
    id: ignoreNoneId,
    ...restNoneConnector
  } = (0, _utils.getNoneCaseConnector)();
  const connectorFieldsToReturn = connector && isConnectorIdValid(connectorId) ? restConnector : restNoneConnector;
  return {
    transformedConnector: {
      connector: connectorFieldsToReturn
    },
    references
  };
};

exports.transformConnectorIdToReference = transformConnectorIdToReference;

const createConnectorReference = (id, type, name) => {
  return isConnectorIdValid(id) ? [{
    id,
    type,
    name
  }] : [];
};

const isConnectorIdValid = id => id != null && id !== _api.NONE_CONNECTOR_ID;

function isUpdateCaseConnector(action, actionFields, actionDetails) {
  try {
    return isUpdateConnector(action, actionFields) && _api.CaseConnectorRt.is(actionDetails);
  } catch {
    return false;
  }
}

function isPushConnector(action, actionFields, actionDetails) {
  try {
    return isPush(action, actionFields) && _api.CaseExternalServiceBasicRt.is(actionDetails);
  } catch {
    return false;
  }
}

const PushConnectorIdReferenceName = {
  [UserActionFieldType.New]: _constants.PUSH_CONNECTOR_ID_REFERENCE_NAME,
  [UserActionFieldType.Old]: _constants2.USER_ACTION_OLD_PUSH_ID_REF_NAME
};
exports.PushConnectorIdReferenceName = PushConnectorIdReferenceName;

function transformConnectorFromPushAction(externalService, fieldType) {
  const {
    transformedPushConnector,
    references
  } = transformPushConnectorIdToReference(PushConnectorIdReferenceName[fieldType], externalService);
  return {
    transformedActionDetails: transformedPushConnector.external_service,
    references
  };
}

const transformPushConnectorIdToReference = (referenceName, external_service) => {
  const {
    connector_id: pushConnectorId,
    ...restExternalService
  } = external_service !== null && external_service !== void 0 ? external_service : {};
  const references = createConnectorReference(pushConnectorId, _server.ACTION_SAVED_OBJECT_TYPE, referenceName);
  return {
    transformedPushConnector: {
      external_service: external_service ? restExternalService : null
    },
    references
  };
};

exports.transformPushConnectorIdToReference = transformPushConnectorIdToReference;

function isConnectorUserAction(action, actionFields) {
  return isCreateConnector(action, actionFields) || isUpdateConnector(action, actionFields) || isPush(action, actionFields);
}

function formatDocumentWithConnectorReferences(doc) {
  const {
    new_value,
    old_value,
    action,
    action_field,
    ...restAttributes
  } = doc.attributes;
  const {
    references = []
  } = doc;
  const {
    transformedActionDetails: transformedNewValue,
    references: newValueConnectorRefs
  } = extractConnectorIdFromJson({
    action,
    actionFields: action_field,
    actionDetails: new_value,
    fieldType: UserActionFieldType.New
  });
  const {
    transformedActionDetails: transformedOldValue,
    references: oldValueConnectorRefs
  } = extractConnectorIdFromJson({
    action,
    actionFields: action_field,
    actionDetails: old_value,
    fieldType: UserActionFieldType.Old
  });
  return { ...doc,
    attributes: { ...restAttributes,
      action,
      action_field,
      new_value: transformedNewValue,
      old_value: transformedOldValue
    },
    references: [...references, ...newValueConnectorRefs, ...oldValueConnectorRefs]
  };
} // 8.1.0 migration util functions


function userActionsConnectorIdMigration(doc, context) {
  var _doc$references;

  const originalDocWithReferences = { ...doc,
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };

  if (!isConnectorUserAction(doc.attributes.action, doc.attributes.action_field)) {
    return originalDocWithReferences;
  }

  try {
    return formatDocumentWithConnectorReferences(doc);
  } catch (error) {
    (0, _utils2.logError)({
      id: doc.id,
      context,
      error,
      docType: 'user action connector',
      docKey: 'userAction'
    });
    return originalDocWithReferences;
  }
}