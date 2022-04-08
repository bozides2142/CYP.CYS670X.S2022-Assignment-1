"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WriteOperations = exports.ReadOperations = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The tenses for describing the action performed by a API route
 */

/**
 * Read operations for the cases APIs.
 *
 * NOTE: If you add a value here you'll likely also need to make changes here:
 * x-pack/plugins/security/server/authorization/privileges/feature_privilege_builder/cases.ts
 */

let ReadOperations;
/**
 * Write operations for the cases APIs.
 *
 * NOTE: If you add a value here you'll likely also need to make changes here:
 * x-pack/plugins/security/server/authorization/privileges/feature_privilege_builder/cases.ts
 */

exports.ReadOperations = ReadOperations;

(function (ReadOperations) {
  ReadOperations["GetCase"] = "getCase";
  ReadOperations["ResolveCase"] = "resolveCase";
  ReadOperations["FindCases"] = "findCases";
  ReadOperations["GetCaseIDsByAlertID"] = "getCaseIDsByAlertID";
  ReadOperations["GetCaseStatuses"] = "getCaseStatuses";
  ReadOperations["GetComment"] = "getComment";
  ReadOperations["GetAllComments"] = "getAllComments";
  ReadOperations["FindComments"] = "findComments";
  ReadOperations["GetTags"] = "getTags";
  ReadOperations["GetReporters"] = "getReporters";
  ReadOperations["FindConfigurations"] = "findConfigurations";
  ReadOperations["GetUserActions"] = "getUserActions";
  ReadOperations["GetAlertsAttachedToCase"] = "getAlertsAttachedToCase";
  ReadOperations["GetAttachmentMetrics"] = "getAttachmentMetrics";
  ReadOperations["GetCaseMetrics"] = "getCaseMetrics";
  ReadOperations["GetUserActionMetrics"] = "getUserActionMetrics";
})(ReadOperations || (exports.ReadOperations = ReadOperations = {}));

let WriteOperations;
/**
 * Defines the structure for a case API route.
 */

exports.WriteOperations = WriteOperations;

(function (WriteOperations) {
  WriteOperations["CreateCase"] = "createCase";
  WriteOperations["DeleteCase"] = "deleteCase";
  WriteOperations["UpdateCase"] = "updateCase";
  WriteOperations["PushCase"] = "pushCase";
  WriteOperations["CreateComment"] = "createComment";
  WriteOperations["DeleteAllComments"] = "deleteAllComments";
  WriteOperations["DeleteComment"] = "deleteComment";
  WriteOperations["UpdateComment"] = "updateComment";
  WriteOperations["CreateConfiguration"] = "createConfiguration";
  WriteOperations["UpdateConfiguration"] = "updateConfiguration";
})(WriteOperations || (exports.WriteOperations = WriteOperations = {}));