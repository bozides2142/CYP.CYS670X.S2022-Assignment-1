"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseConfigureService = void 0;

var _constants = require("../../common/constants");

var _constants2 = require("../../../common/constants");

var _server = require("../../../../actions/server");

var _transform = require("../transform");

var _connector_reference_handler = require("../connector_reference_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CaseConfigureService {
  constructor(log) {
    this.log = log;
  }

  async delete({
    unsecuredSavedObjectsClient,
    configurationId
  }) {
    try {
      this.log.debug(`Attempting to DELETE case configure ${configurationId}`);
      return await unsecuredSavedObjectsClient.delete(_constants2.CASE_CONFIGURE_SAVED_OBJECT, configurationId);
    } catch (error) {
      this.log.debug(`Error on DELETE case configure ${configurationId}: ${error}`);
      throw error;
    }
  }

  async get({
    unsecuredSavedObjectsClient,
    configurationId
  }) {
    try {
      this.log.debug(`Attempting to GET case configuration ${configurationId}`);
      const configuration = await unsecuredSavedObjectsClient.get(_constants2.CASE_CONFIGURE_SAVED_OBJECT, configurationId);
      return transformToExternalModel(configuration);
    } catch (error) {
      this.log.debug(`Error on GET case configuration ${configurationId}: ${error}`);
      throw error;
    }
  }

  async find({
    unsecuredSavedObjectsClient,
    options
  }) {
    try {
      this.log.debug(`Attempting to find all case configuration`);
      const findResp = await unsecuredSavedObjectsClient.find({ ...options,
        // Get the latest configuration
        sortField: 'created_at',
        sortOrder: 'desc',
        type: _constants2.CASE_CONFIGURE_SAVED_OBJECT
      });
      return transformFindResponseToExternalModel(findResp);
    } catch (error) {
      this.log.debug(`Attempting to find all case configuration`);
      throw error;
    }
  }

  async post({
    unsecuredSavedObjectsClient,
    attributes,
    id
  }) {
    try {
      this.log.debug(`Attempting to POST a new case configuration`);
      const esConfigInfo = transformAttributesToESModel(attributes);
      const createdConfig = await unsecuredSavedObjectsClient.create(_constants2.CASE_CONFIGURE_SAVED_OBJECT, esConfigInfo.attributes, {
        id,
        references: esConfigInfo.referenceHandler.build()
      });
      return transformToExternalModel(createdConfig);
    } catch (error) {
      this.log.debug(`Error on POST a new case configuration: ${error}`);
      throw error;
    }
  }

  async patch({
    unsecuredSavedObjectsClient,
    configurationId,
    updatedAttributes,
    originalConfiguration
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case configuration ${configurationId}`);
      const esUpdateInfo = transformAttributesToESModel(updatedAttributes);
      const updatedConfiguration = await unsecuredSavedObjectsClient.update(_constants2.CASE_CONFIGURE_SAVED_OBJECT, configurationId, { ...esUpdateInfo.attributes
      }, {
        references: esUpdateInfo.referenceHandler.build(originalConfiguration.references)
      });
      return transformUpdateResponseToExternalModel(updatedConfiguration);
    } catch (error) {
      this.log.debug(`Error on UPDATE case configuration ${configurationId}: ${error}`);
      throw error;
    }
  }

}

exports.CaseConfigureService = CaseConfigureService;

function transformUpdateResponseToExternalModel(updatedConfiguration) {
  var _updatedConfiguration;

  const {
    connector,
    ...restUpdatedAttributes
  } = (_updatedConfiguration = updatedConfiguration.attributes) !== null && _updatedConfiguration !== void 0 ? _updatedConfiguration : {};
  const transformedConnector = (0, _transform.transformESConnectorToExternalModel)({
    connector,
    references: updatedConfiguration.references,
    referenceName: _constants.CONNECTOR_ID_REFERENCE_NAME
  });
  return { ...updatedConfiguration,
    attributes: { ...restUpdatedAttributes,
      // this will avoid setting connector to undefined, it won't include to field at all
      ...(transformedConnector && {
        connector: transformedConnector
      })
    }
  };
}

function transformToExternalModel(configuration) {
  var _configuration$attrib;

  const connector = (0, _transform.transformESConnectorOrUseDefault)({
    // if the saved object had an error the attributes field will not exist
    connector: (_configuration$attrib = configuration.attributes) === null || _configuration$attrib === void 0 ? void 0 : _configuration$attrib.connector,
    references: configuration.references,
    referenceName: _constants.CONNECTOR_ID_REFERENCE_NAME
  });
  return { ...configuration,
    attributes: { ...configuration.attributes,
      connector
    }
  };
}

function transformFindResponseToExternalModel(configurations) {
  return { ...configurations,
    saved_objects: configurations.saved_objects.map(so => ({ ...so,
      ...transformToExternalModel(so)
    }))
  };
}

function transformAttributesToESModel(configuration) {
  const {
    connector,
    ...restWithoutConnector
  } = configuration;
  const transformedConnector = { ...(connector && {
      connector: {
        name: connector.name,
        type: connector.type,
        fields: (0, _transform.transformFieldsToESModel)(connector)
      }
    })
  };
  return {
    attributes: { ...restWithoutConnector,
      ...transformedConnector
    },
    referenceHandler: buildReferenceHandler(connector === null || connector === void 0 ? void 0 : connector.id)
  };
}

function buildReferenceHandler(id) {
  return new _connector_reference_handler.ConnectorReferenceHandler([{
    id,
    name: _constants.CONNECTOR_ID_REFERENCE_NAME,
    type: _server.ACTION_SAVED_OBJECT_TYPE
  }]);
}