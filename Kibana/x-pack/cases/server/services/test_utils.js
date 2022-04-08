"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSavedObjectReferences = exports.createSOFindResponse = exports.createJiraConnector = exports.createExternalService = exports.createESJiraConnector = exports.createConnectorObject = exports.createCaseSavedObjectResponse = exports.basicCaseFields = void 0;

var _constants = require("../common/constants");

var _api = require("../../common/api");

var _constants2 = require("../../common/constants");

var _server = require("../../../actions/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This file contains utility functions to aid unit test development
 */

/**
 * Create an Elasticsearch jira connector.
 *
 * @param overrides fields used to override the default jira connector
 * @returns a jira Elasticsearch connector (it has key value pairs for the fields) by default
 */


const createESJiraConnector = overrides => {
  return {
    id: '1',
    name: _api.ConnectorTypes.jira,
    fields: [{
      key: 'issueType',
      value: 'bug'
    }, {
      key: 'priority',
      value: 'high'
    }, {
      key: 'parent',
      value: '2'
    }],
    type: _api.ConnectorTypes.jira,
    ...overrides
  };
};
/**
 * Creates a jira CaseConnector (has the actual fields defined in the object instead of key value paris)
 * @param setFieldsToNull a flag that controls setting the fields property to null
 * @returns a jira connector
 */


exports.createESJiraConnector = createESJiraConnector;

const createJiraConnector = ({
  setFieldsToNull
} = {}) => {
  return {
    id: '1',
    name: _api.ConnectorTypes.jira,
    type: _api.ConnectorTypes.jira,
    fields: setFieldsToNull ? null : {
      issueType: 'bug',
      priority: 'high',
      parent: '2'
    }
  };
};

exports.createJiraConnector = createJiraConnector;

const createExternalService = overrides => ({
  connector_id: '100',
  connector_name: '.jira',
  external_id: '100',
  external_title: 'awesome',
  external_url: 'http://www.google.com',
  pushed_at: '2019-11-25T21:54:48.952Z',
  pushed_by: {
    full_name: 'elastic',
    email: 'testemail@elastic.co',
    username: 'elastic'
  },
  ...overrides
});

exports.createExternalService = createExternalService;
const basicCaseFields = {
  closed_at: null,
  closed_by: null,
  created_at: '2019-11-25T21:54:48.952Z',
  created_by: {
    full_name: 'elastic',
    email: 'testemail@elastic.co',
    username: 'elastic'
  },
  description: 'This is a brand new case of a bad meanie defacing data',
  title: 'Super Bad Security Issue',
  status: _api.CaseStatuses.open,
  tags: ['defacement'],
  updated_at: '2019-11-25T21:54:48.952Z',
  updated_by: {
    full_name: 'elastic',
    email: 'testemail@elastic.co',
    username: 'elastic'
  },
  settings: {
    syncAlerts: true
  },
  owner: _constants2.SECURITY_SOLUTION_OWNER
};
exports.basicCaseFields = basicCaseFields;

const createCaseSavedObjectResponse = ({
  connector,
  externalService
} = {}) => {
  var _connector$type, _connector$name, _connector$fields;

  const references = createSavedObjectReferences({
    connector,
    externalService
  });
  const formattedConnector = {
    type: (_connector$type = connector === null || connector === void 0 ? void 0 : connector.type) !== null && _connector$type !== void 0 ? _connector$type : _api.ConnectorTypes.jira,
    name: (_connector$name = connector === null || connector === void 0 ? void 0 : connector.name) !== null && _connector$name !== void 0 ? _connector$name : _api.ConnectorTypes.jira,
    fields: (_connector$fields = connector === null || connector === void 0 ? void 0 : connector.fields) !== null && _connector$fields !== void 0 ? _connector$fields : null
  };
  let restExternalService = null;

  if (externalService !== null) {
    const {
      connector_id: ignored,
      ...rest
    } = externalService !== null && externalService !== void 0 ? externalService : {
      connector_name: '.jira',
      external_id: '100',
      external_title: 'awesome',
      external_url: 'http://www.google.com',
      pushed_at: '2019-11-25T21:54:48.952Z',
      pushed_by: {
        full_name: 'elastic',
        email: 'testemail@elastic.co',
        username: 'elastic'
      }
    };
    restExternalService = rest;
  }

  return {
    type: _constants2.CASE_SAVED_OBJECT,
    id: '1',
    attributes: { ...basicCaseFields,
      // if connector is null we'll default this to an incomplete jira value because the service
      // should switch it to a none connector when the id can't be found in the references array
      connector: formattedConnector,
      external_service: restExternalService
    },
    references
  };
};

exports.createCaseSavedObjectResponse = createCaseSavedObjectResponse;

const createSavedObjectReferences = ({
  connector,
  externalService
} = {}) => [...(connector && connector.id !== _api.NONE_CONNECTOR_ID ? [{
  id: connector.id,
  name: _constants.CONNECTOR_ID_REFERENCE_NAME,
  type: _server.ACTION_SAVED_OBJECT_TYPE
}] : []), ...(externalService && externalService.connector_id ? [{
  id: externalService.connector_id,
  name: _constants.PUSH_CONNECTOR_ID_REFERENCE_NAME,
  type: _server.ACTION_SAVED_OBJECT_TYPE
}] : [])];

exports.createSavedObjectReferences = createSavedObjectReferences;

const createConnectorObject = overrides => ({
  connector: { ...createJiraConnector(),
    ...overrides
  }
});

exports.createConnectorObject = createConnectorObject;

const createSOFindResponse = savedObjects => ({
  saved_objects: savedObjects,
  total: savedObjects.length,
  per_page: savedObjects.length,
  page: 1
});

exports.createSOFindResponse = createSOFindResponse;