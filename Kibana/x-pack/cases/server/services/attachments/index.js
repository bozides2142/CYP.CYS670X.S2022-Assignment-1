"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachmentService = void 0;

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _utils = require("../../client/utils");

var _utils2 = require("../../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AttachmentService {
  constructor(log) {
    this.log = log;
  }

  async countAlertsAttachedToCase({
    unsecuredSavedObjectsClient,
    caseId,
    filter
  }) {
    try {
      var _response$aggregation, _response$aggregation2;

      this.log.debug(`Attempting to count alerts for case id ${caseId}`);
      const alertsFilter = (0, _utils.buildFilter)({
        filters: [_api.CommentType.alert],
        field: 'type',
        operator: 'or',
        type: _constants.CASE_COMMENT_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([alertsFilter, filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        page: 1,
        perPage: 1,
        sortField: _utils2.defaultSortField,
        aggs: this.buildCountAlertsAggs(),
        filter: combinedFilter
      });
      return (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.alerts) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.value;
    } catch (error) {
      this.log.error(`Error while counting alerts for case id ${caseId}: ${error}`);
      throw error;
    }
  }

  buildCountAlertsAggs() {
    return {
      alerts: {
        cardinality: {
          field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.alertId`
        }
      }
    };
  }
  /**
   * Retrieves all the alerts attached to a case.
   */


  async getAllAlertsAttachToCase({
    unsecuredSavedObjectsClient,
    caseId,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all alerts for case id ${caseId}`);
      const alertsFilter = (0, _utils.buildFilter)({
        filters: [_api.CommentType.alert],
        field: 'type',
        operator: 'or',
        type: _constants.CASE_COMMENT_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([alertsFilter, filter]);
      const finder = unsecuredSavedObjectsClient.createPointInTimeFinder({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        sortField: 'created_at',
        sortOrder: 'asc',
        filter: combinedFilter,
        perPage: _constants.MAX_DOCS_PER_PAGE
      });
      let result = [];

      for await (const userActionSavedObject of finder.find()) {
        result = result.concat(userActionSavedObject.saved_objects);
      }

      return result;
    } catch (error) {
      this.log.error(`Error on GET all alerts for case id ${caseId}: ${error}`);
      throw error;
    }
  }
  /**
   * Executes the aggregations against the actions attached to a case.
   */


  async executeCaseActionsAggregations({
    unsecuredSavedObjectsClient,
    caseId,
    filter,
    aggregations
  }) {
    try {
      this.log.debug(`Attempting to count actions for case id ${caseId}`);
      const actionsFilter = (0, _utils.buildFilter)({
        filters: [_api.CommentType.actions],
        field: 'type',
        operator: 'or',
        type: _constants.CASE_COMMENT_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([actionsFilter, filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        page: 1,
        perPage: 1,
        sortField: _utils2.defaultSortField,
        aggs: aggregations,
        filter: combinedFilter
      });
      return response.aggregations;
    } catch (error) {
      this.log.error(`Error while counting actions for case id ${caseId}: ${error}`);
      throw error;
    }
  }

  async get({
    unsecuredSavedObjectsClient,
    attachmentId
  }) {
    try {
      this.log.debug(`Attempting to GET attachment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.get(_constants.CASE_COMMENT_SAVED_OBJECT, attachmentId);
    } catch (error) {
      this.log.error(`Error on GET attachment ${attachmentId}: ${error}`);
      throw error;
    }
  }

  async delete({
    unsecuredSavedObjectsClient,
    attachmentId
  }) {
    try {
      this.log.debug(`Attempting to DELETE attachment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.delete(_constants.CASE_COMMENT_SAVED_OBJECT, attachmentId);
    } catch (error) {
      this.log.error(`Error on DELETE attachment ${attachmentId}: ${error}`);
      throw error;
    }
  }

  async create({
    unsecuredSavedObjectsClient,
    attributes,
    references,
    id
  }) {
    try {
      this.log.debug(`Attempting to POST a new comment`);
      return await unsecuredSavedObjectsClient.create(_constants.CASE_COMMENT_SAVED_OBJECT, attributes, {
        references,
        id
      });
    } catch (error) {
      this.log.error(`Error on POST a new comment: ${error}`);
      throw error;
    }
  }

  async update({
    unsecuredSavedObjectsClient,
    attachmentId,
    updatedAttributes,
    options
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.update(_constants.CASE_COMMENT_SAVED_OBJECT, attachmentId, updatedAttributes, options);
    } catch (error) {
      this.log.error(`Error on UPDATE comment ${attachmentId}: ${error}`);
      throw error;
    }
  }

  async bulkUpdate({
    unsecuredSavedObjectsClient,
    comments
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comments ${comments.map(c => c.attachmentId).join(', ')}`);
      return await unsecuredSavedObjectsClient.bulkUpdate(comments.map(c => ({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        id: c.attachmentId,
        attributes: c.updatedAttributes,
        ...c.options
      })));
    } catch (error) {
      this.log.error(`Error on UPDATE comments ${comments.map(c => c.attachmentId).join(', ')}: ${error}`);
      throw error;
    }
  }

}

exports.AttachmentService = AttachmentService;