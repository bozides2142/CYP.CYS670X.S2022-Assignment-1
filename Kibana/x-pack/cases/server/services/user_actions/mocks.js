"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatedCases = exports.originalCases = exports.externalService = exports.comment = exports.casePayload = exports.attachments = void 0;

var _constants = require("../../../common/constants");

var _common = require("../../../common");

var _api = require("../../../common/api");

var _test_utils = require("../test_utils");

var _transform = require("../cases/transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const casePayload = {
  title: 'Case SIR',
  tags: ['sir'],
  description: 'testing sir',
  connector: {
    id: '456',
    name: 'ServiceNow SN',
    type: _api.ConnectorTypes.serviceNowSIR,
    fields: {
      category: 'Denial of Service',
      destIp: true,
      malwareHash: true,
      malwareUrl: true,
      priority: '2',
      sourceIp: true,
      subcategory: '45'
    }
  },
  settings: {
    syncAlerts: true
  },
  owner: _common.SECURITY_SOLUTION_OWNER
};
exports.casePayload = casePayload;
const externalService = {
  pushed_at: '2021-02-03T17:41:26.108Z',
  pushed_by: {
    username: 'elastic',
    full_name: 'Elastic',
    email: 'elastic@elastic.co'
  },
  connector_id: '456',
  connector_name: 'ServiceNow SN',
  external_id: 'external-id',
  external_title: 'SIR0010037',
  external_url: 'https://dev92273.service-now.com/nav_to.do?uri=sn_si_incident.do?sys_id=external-id'
};
exports.externalService = externalService;
const originalCases = [{ ...(0, _test_utils.createCaseSavedObjectResponse)(),
  id: '1'
}, { ...(0, _test_utils.createCaseSavedObjectResponse)(),
  id: '2'
}].map(so => (0, _transform.transformSavedObjectToExternalModel)(so));
exports.originalCases = originalCases;
const updatedCases = [{ ...(0, _test_utils.createCaseSavedObjectResponse)(),
  id: '1',
  type: _constants.CASE_SAVED_OBJECT,
  attributes: {
    title: 'updated title',
    status: _api.CaseStatuses.closed,
    connector: casePayload.connector
  },
  references: []
}, { ...(0, _test_utils.createCaseSavedObjectResponse)(),
  id: '2',
  type: _constants.CASE_SAVED_OBJECT,
  attributes: {
    description: 'updated desc',
    tags: ['one', 'two'],
    settings: {
      syncAlerts: false
    }
  },
  references: []
}];
exports.updatedCases = updatedCases;
const comment = {
  comment: 'a comment',
  type: _api.CommentType.user,
  owner: _common.SECURITY_SOLUTION_OWNER
};
exports.comment = comment;
const alertComment = {
  alertId: 'alert-id-1',
  index: 'alert-index-1',
  rule: {
    id: 'rule-id-1',
    name: 'rule-name-1'
  },
  type: _api.CommentType.alert,
  owner: _common.SECURITY_SOLUTION_OWNER
};
const attachments = [{
  id: '1',
  attachment: { ...comment
  },
  owner: _common.SECURITY_SOLUTION_OWNER
}, {
  id: '2',
  attachment: { ...alertComment
  },
  owner: _common.SECURITY_SOLUTION_OWNER
}];
exports.attachments = attachments;