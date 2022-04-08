"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformAttributesToESModel = transformAttributesToESModel;
exports.transformBulkResponseToExternalModel = transformBulkResponseToExternalModel;
exports.transformFindResponseToExternalModel = transformFindResponseToExternalModel;
exports.transformSavedObjectToExternalModel = transformSavedObjectToExternalModel;
exports.transformUpdateResponseToExternalModel = transformUpdateResponseToExternalModel;
exports.transformUpdateResponsesToExternalModels = transformUpdateResponsesToExternalModels;

var _server = require("../../../../actions/server");

var _constants = require("../../common/constants");

var _api = require("../../../common/api");

var _transform = require("../transform");

var _connector_reference_handler = require("../connector_reference_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


function transformUpdateResponsesToExternalModels(response) {
  return { ...response,
    saved_objects: response.saved_objects.map(so => ({ ...so,
      ...transformUpdateResponseToExternalModel(so)
    }))
  };
}

function transformUpdateResponseToExternalModel(updatedCase) {
  var _updatedCase$attribut;

  const {
    connector,
    external_service,
    ...restUpdateAttributes
  } = (_updatedCase$attribut = updatedCase.attributes) !== null && _updatedCase$attribut !== void 0 ? _updatedCase$attribut : {};
  const transformedConnector = (0, _transform.transformESConnectorToExternalModel)({
    // if the saved object had an error the attributes field will not exist
    connector,
    references: updatedCase.references,
    referenceName: _constants.CONNECTOR_ID_REFERENCE_NAME
  });
  let externalService; // if external_service is not defined then we don't want to include it in the response since it wasn't passed it as an
  // attribute to update

  if (external_service !== undefined) {
    externalService = transformESExternalService(external_service, updatedCase.references);
  }

  return { ...updatedCase,
    attributes: { ...restUpdateAttributes,
      ...(transformedConnector && {
        connector: transformedConnector
      }),
      // if externalService is null that means we intentionally updated it to null within ES so return that as a valid value
      ...(externalService !== undefined && {
        external_service: externalService
      })
    }
  };
}

function transformAttributesToESModel(caseAttributes) {
  const {
    connector,
    external_service,
    ...restAttributes
  } = caseAttributes;
  const {
    connector_id: pushConnectorId,
    ...restExternalService
  } = external_service !== null && external_service !== void 0 ? external_service : {};
  const transformedConnector = { ...(connector && {
      connector: {
        name: connector.name,
        type: connector.type,
        fields: (0, _transform.transformFieldsToESModel)(connector)
      }
    })
  };
  const transformedExternalService = { ...(external_service ? {
      external_service: restExternalService
    } : external_service === null ? {
      external_service: null
    } : {})
  };
  return {
    attributes: { ...restAttributes,
      ...transformedConnector,
      ...transformedExternalService
    },
    referenceHandler: buildReferenceHandler(connector === null || connector === void 0 ? void 0 : connector.id, pushConnectorId)
  };
}

function buildReferenceHandler(connectorId, pushConnectorId) {
  return new _connector_reference_handler.ConnectorReferenceHandler([{
    id: connectorId,
    name: _constants.CONNECTOR_ID_REFERENCE_NAME,
    type: _server.ACTION_SAVED_OBJECT_TYPE
  }, {
    id: pushConnectorId,
    name: _constants.PUSH_CONNECTOR_ID_REFERENCE_NAME,
    type: _server.ACTION_SAVED_OBJECT_TYPE
  }]);
}
/**
 * Until Kibana uses typescript 4.3 or higher we'll have to keep these functions separate instead of using an overload
 * definition like this:
 *
 * export function transformArrayResponseToExternalModel(
 *  response: SavedObjectsBulkResponse<ESCaseAttributes> | SavedObjectsFindResponse<ESCaseAttributes>
 * ): SavedObjectsBulkResponse<CaseAttributes> | SavedObjectsFindResponse<CaseAttributes> {
 *
 * See this issue for more details: https://stackoverflow.com/questions/49510832/typescript-how-to-map-over-union-array-type
 */


function transformBulkResponseToExternalModel(response) {
  return { ...response,
    saved_objects: response.saved_objects.map(so => ({ ...so,
      ...transformSavedObjectToExternalModel(so)
    }))
  };
}

function transformFindResponseToExternalModel(response) {
  return { ...response,
    saved_objects: response.saved_objects.map(so => ({ ...so,
      ...transformSavedObjectToExternalModel(so)
    }))
  };
}

function transformSavedObjectToExternalModel(caseSavedObject) {
  var _caseSavedObject$attr, _caseSavedObject$attr2;

  const connector = (0, _transform.transformESConnectorOrUseDefault)({
    // if the saved object had an error the attributes field will not exist
    connector: (_caseSavedObject$attr = caseSavedObject.attributes) === null || _caseSavedObject$attr === void 0 ? void 0 : _caseSavedObject$attr.connector,
    references: caseSavedObject.references,
    referenceName: _constants.CONNECTOR_ID_REFERENCE_NAME
  });
  const externalService = transformESExternalService((_caseSavedObject$attr2 = caseSavedObject.attributes) === null || _caseSavedObject$attr2 === void 0 ? void 0 : _caseSavedObject$attr2.external_service, caseSavedObject.references);
  return { ...caseSavedObject,
    attributes: { ...caseSavedObject.attributes,
      connector,
      external_service: externalService
    }
  };
}

function transformESExternalService( // this type needs to match that of CaseFullExternalService except that it does not include the connector_id, see: x-pack/plugins/cases/common/api/cases/case.ts
// that's why it can be null here
externalService, references) {
  var _connectorIdRef$id;

  const connectorIdRef = (0, _transform.findConnectorIdReference)(_constants.PUSH_CONNECTOR_ID_REFERENCE_NAME, references);

  if (!externalService) {
    return null;
  }

  return { ...externalService,
    connector_id: (_connectorIdRef$id = connectorIdRef === null || connectorIdRef === void 0 ? void 0 : connectorIdRef.id) !== null && _connectorIdRef$id !== void 0 ? _connectorIdRef$id : _api.NONE_CONNECTOR_ID
  };
}