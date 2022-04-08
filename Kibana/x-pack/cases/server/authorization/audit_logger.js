"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthorizationAuditLogger = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Audit logger for authorization operations
 */


class AuthorizationAuditLogger {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    this.auditLogger = logger;
  }
  /**
   * Creates an AuditEvent describing the state of a request.
   */


  static createAuditMsg({
    operation,
    error,
    entity
  }) {
    const doc = entity !== undefined ? `${operation.savedObjectType} [id=${entity.id}]` : `a ${operation.docType}`;
    const ownerText = entity === undefined ? 'as any owners' : `as owner "${entity.owner}"`;
    let message;
    let outcome;

    if (error) {
      message = `Failed attempt to ${operation.verbs.present} ${doc} ${ownerText}`;
      outcome = _.ECS_OUTCOMES.failure;
    } else if ((0, _.isWriteOperation)(operation)) {
      message = `User is ${operation.verbs.progressive} ${doc} ${ownerText}`;
      outcome = _.ECS_OUTCOMES.unknown;
    } else {
      message = `User has ${operation.verbs.past} ${doc} ${ownerText}`;
      outcome = _.ECS_OUTCOMES.success;
    }

    return {
      message,
      event: {
        action: operation.action,
        category: _.DATABASE_CATEGORY,
        type: [operation.ecsType],
        outcome
      },
      ...(entity !== undefined && {
        kibana: {
          saved_object: {
            type: operation.savedObjectType,
            id: entity.id
          }
        }
      }),
      ...(error !== undefined && {
        error: {
          code: error.name,
          message: error.message
        }
      })
    };
  }
  /**
   * Creates a message to be passed to an Error or Boom.
   */


  static createFailureMessage({
    owners,
    operation
  }) {
    const ownerMsg = owners.length <= 0 ? 'of any owner' : `with owners: "${owners.join(', ')}"`;
    /**
     * This will take the form:
     * `Unauthorized to create case with owners: "securitySolution, observability"`
     * `Unauthorized to access cases of any owner`
     */

    return `Unauthorized to ${operation.verbs.present} ${operation.docType} ${ownerMsg}`;
  }
  /**
   * Logs an audit event based on the status of an operation.
   */


  log(auditMsgParams) {
    var _this$auditLogger;

    (_this$auditLogger = this.auditLogger) === null || _this$auditLogger === void 0 ? void 0 : _this$auditLogger.log(AuthorizationAuditLogger.createAuditMsg(auditMsgParams));
  }

}

exports.AuthorizationAuditLogger = AuthorizationAuditLogger;