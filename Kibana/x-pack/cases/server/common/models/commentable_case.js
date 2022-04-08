"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentableCase = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _error = require("../error");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This class represents a case that can have a comment attached to it.
 */


class CommentableCase {
  constructor({
    caseInfo,
    unsecuredSavedObjectsClient,
    caseService,
    attachmentService,
    logger,
    lensEmbeddableFactory
  }) {
    (0, _defineProperty2.default)(this, "caseInfo", void 0);
    (0, _defineProperty2.default)(this, "unsecuredSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "caseService", void 0);
    (0, _defineProperty2.default)(this, "attachmentService", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "lensEmbeddableFactory", void 0);
    this.caseInfo = caseInfo;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.caseService = caseService;
    this.attachmentService = attachmentService;
    this.logger = logger;
    this.lensEmbeddableFactory = lensEmbeddableFactory;
  }

  get status() {
    return this.caseInfo.attributes.status;
  }

  get id() {
    return this.caseInfo.id;
  }

  get settings() {
    return this.caseInfo.attributes.settings;
  }

  get caseId() {
    return this.caseInfo.id;
  }

  get owner() {
    return this.caseInfo.attributes.owner;
  }

  buildRefsToCase() {
    return [{
      type: _constants.CASE_SAVED_OBJECT,
      name: `associated-${_constants.CASE_SAVED_OBJECT}`,
      id: this.caseInfo.id
    }];
  }

  async update({
    date,
    user
  }) {
    try {
      var _updatedCase$version;

      const updatedCase = await this.caseService.patchCase({
        originalCase: this.caseInfo,
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        caseId: this.caseInfo.id,
        updatedAttributes: {
          updated_at: date,
          updated_by: { ...user
          }
        },
        version: this.caseInfo.version
      });
      return new CommentableCase({
        caseInfo: { ...this.caseInfo,
          attributes: { ...this.caseInfo.attributes,
            ...updatedCase.attributes
          },
          version: (_updatedCase$version = updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : this.caseInfo.version
        },
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        caseService: this.caseService,
        attachmentService: this.attachmentService,
        logger: this.logger,
        lensEmbeddableFactory: this.lensEmbeddableFactory
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update commentable case, case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }
  /**
   * Update a comment and update the corresponding case's update_at and updated_by fields.
   */


  async updateComment({
    updateRequest,
    updatedAt,
    user
  }) {
    try {
      const {
        id,
        version,
        ...queryRestAttributes
      } = updateRequest;
      const options = {
        version
      };

      if (queryRestAttributes.type === _api.CommentType.user && queryRestAttributes !== null && queryRestAttributes !== void 0 && queryRestAttributes.comment) {
        const currentComment = await this.attachmentService.get({
          unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
          attachmentId: id
        });
        const updatedReferences = (0, _utils.getOrUpdateLensReferences)(this.lensEmbeddableFactory, queryRestAttributes.comment, currentComment);
        options.references = updatedReferences;
      }

      const [comment, commentableCase] = await Promise.all([this.attachmentService.update({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        attachmentId: id,
        updatedAttributes: { ...queryRestAttributes,
          updated_at: updatedAt,
          updated_by: user
        },
        options
      }), this.update({
        date: updatedAt,
        user
      })]);
      return {
        comment,
        commentableCase
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update comment in commentable case, case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }
  /**
   * Create a new comment on the appropriate case. This updates the case's updated_at and updated_by fields.
   */


  async createComment({
    createdDate,
    user,
    commentReq,
    id
  }) {
    try {
      if (commentReq.type === _api.CommentType.alert) {
        if (this.status === _api.CaseStatuses.closed) {
          throw _boom.default.badRequest('Alert cannot be attached to a closed case');
        }
      }

      if (commentReq.owner !== this.owner) {
        throw _boom.default.badRequest('The owner field of the comment must match the case');
      }

      let references = this.buildRefsToCase();

      if (commentReq.type === _api.CommentType.user && commentReq !== null && commentReq !== void 0 && commentReq.comment) {
        const commentStringReferences = (0, _utils.getOrUpdateLensReferences)(this.lensEmbeddableFactory, commentReq.comment);
        references = [...references, ...commentStringReferences];
      }

      const [comment, commentableCase] = await Promise.all([this.attachmentService.create({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        attributes: (0, _utils.transformNewComment)({
          createdDate,
          ...commentReq,
          ...user
        }),
        references,
        id
      }), this.update({
        date: createdDate,
        user
      })]);
      return {
        comment,
        commentableCase
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed creating a comment on a commentable case, case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  formatForEncoding(totalComment) {
    var _this$caseInfo$versio;

    return {
      id: this.caseInfo.id,
      version: (_this$caseInfo$versio = this.caseInfo.version) !== null && _this$caseInfo$versio !== void 0 ? _this$caseInfo$versio : '0',
      totalComment,
      ...this.caseInfo.attributes
    };
  }

  async encode() {
    try {
      var _countAlertsForID;

      const comments = await this.caseService.getAllCaseComments({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        id: this.caseInfo.id,
        options: {
          fields: [],
          page: 1,
          perPage: _constants.MAX_DOCS_PER_PAGE
        }
      });
      const totalAlerts = (_countAlertsForID = (0, _utils.countAlertsForID)({
        comments,
        id: this.caseInfo.id
      })) !== null && _countAlertsForID !== void 0 ? _countAlertsForID : 0;
      const caseResponse = {
        comments: (0, _utils.flattenCommentSavedObjects)(comments.saved_objects),
        totalAlerts,
        ...this.formatForEncoding(comments.total)
      };
      return _api.CaseResponseRt.encode(caseResponse);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed encoding the commentable case, case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

}

exports.CommentableCase = CommentableCase;