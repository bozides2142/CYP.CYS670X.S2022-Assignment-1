"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseUserActionService = void 0;
exports.transformFindResponseToExternalModel = transformFindResponseToExternalModel;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _user_actions = require("../../../common/utils/user_actions");

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _constants2 = require("../../common/constants");

var _transform = require("../transform");

var _utils = require("../../client/utils");

var _builder_factory = require("./builder_factory");

var _utils2 = require("../../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CaseUserActionService {
  constructor(log) {
    (0, _defineProperty2.default)(this, "builderFactory", new _builder_factory.BuilderFactory());
    this.log = log;
  }

  getUserActionItemByDifference({
    field,
    originalValue,
    newValue,
    caseId,
    owner,
    user
  }) {
    if (!CaseUserActionService.userActionFieldsAllowed.has(field)) {
      return [];
    }

    if (field === _api.ActionTypes.tags) {
      const tagsUserActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes.tags);
      const compareValues = (0, _utils.isTwoArraysDifference)(originalValue, newValue);
      const userActions = [];

      if (compareValues && compareValues.addedItems.length > 0) {
        const tagAddUserAction = tagsUserActionBuilder === null || tagsUserActionBuilder === void 0 ? void 0 : tagsUserActionBuilder.build({
          action: _api.Actions.add,
          caseId,
          user,
          owner,
          payload: {
            tags: compareValues.addedItems
          }
        });

        if (tagAddUserAction) {
          userActions.push(tagAddUserAction);
        }
      }

      if (compareValues && compareValues.deletedItems.length > 0) {
        const tagsDeleteUserAction = tagsUserActionBuilder === null || tagsUserActionBuilder === void 0 ? void 0 : tagsUserActionBuilder.build({
          action: _api.Actions.delete,
          caseId,
          user,
          owner,
          payload: {
            tags: compareValues.deletedItems
          }
        });

        if (tagsDeleteUserAction) {
          userActions.push(tagsDeleteUserAction);
        }
      }

      return userActions;
    }

    if ((0, _user_actions.isUserActionType)(field) && newValue != null) {
      const userActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes[field]);
      const fieldUserAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        caseId,
        owner,
        user,
        payload: {
          [field]: newValue
        }
      });
      return fieldUserAction ? [fieldUserAction] : [];
    }

    return [];
  }

  async bulkCreateCaseDeletion({
    unsecuredSavedObjectsClient,
    cases,
    user
  }) {
    this.log.debug(`Attempting to create a create case user action`);
    const userActionsWithReferences = cases.reduce((acc, caseInfo) => {
      const userActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes.delete_case);
      const deleteCaseUserAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        action: _api.Actions.delete,
        caseId: caseInfo.id,
        user,
        owner: caseInfo.owner,
        connectorId: caseInfo.connectorId,
        payload: {}
      });

      if (deleteCaseUserAction == null) {
        return acc;
      }

      return [...acc, deleteCaseUserAction];
    }, []);
    await this.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: userActionsWithReferences
    });
  }

  async bulkCreateUpdateCase({
    unsecuredSavedObjectsClient,
    originalCases,
    updatedCases,
    user
  }) {
    const userActionsWithReferences = updatedCases.reduce((acc, updatedCase) => {
      const originalCase = originalCases.find(({
        id
      }) => id === updatedCase.id);

      if (originalCase == null) {
        return acc;
      }

      const caseId = updatedCase.id;
      const owner = originalCase.attributes.owner;
      const userActions = [];
      const updatedFields = Object.keys(updatedCase.attributes);
      updatedFields.filter(field => CaseUserActionService.userActionFieldsAllowed.has(field)).forEach(field => {
        const originalValue = (0, _lodash.get)(originalCase, ['attributes', field]);
        const newValue = (0, _lodash.get)(updatedCase, ['attributes', field]);
        userActions.push(...this.getUserActionItemByDifference({
          unsecuredSavedObjectsClient,
          field,
          originalValue,
          newValue,
          user,
          owner,
          caseId
        }));
      });
      return [...acc, ...userActions];
    }, []);
    await this.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: userActionsWithReferences
    });
  }

  async bulkCreateAttachmentDeletion({
    unsecuredSavedObjectsClient,
    caseId,
    attachments,
    user
  }) {
    this.log.debug(`Attempting to create a create case user action`);
    const userActionsWithReferences = attachments.reduce((acc, attachment) => {
      const userActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes.comment);
      const deleteCommentUserAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        action: _api.Actions.delete,
        caseId,
        user,
        owner: attachment.owner,
        attachmentId: attachment.id,
        payload: {
          attachment: attachment.attachment
        }
      });

      if (deleteCommentUserAction == null) {
        return acc;
      }

      return [...acc, deleteCommentUserAction];
    }, []);
    await this.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: userActionsWithReferences
    });
  }

  async createUserAction({
    unsecuredSavedObjectsClient,
    action,
    type,
    caseId,
    user,
    owner,
    payload,
    connectorId,
    attachmentId
  }) {
    try {
      this.log.debug(`Attempting to create a user action of type: ${type}`);
      const userActionBuilder = this.builderFactory.getBuilder(type);
      const userAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        action,
        caseId,
        user,
        owner,
        connectorId,
        attachmentId,
        payload
      });

      if (userAction) {
        const {
          attributes,
          references
        } = userAction;
        await this.create({
          unsecuredSavedObjectsClient,
          attributes,
          references
        });
      }
    } catch (error) {
      this.log.error(`Error on creating user action of type: ${type}. Error: ${error}`);
      throw error;
    }
  }

  async getAll({
    unsecuredSavedObjectsClient,
    caseId
  }) {
    try {
      const id = caseId;
      const type = _constants.CASE_SAVED_OBJECT;
      const userActions = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type,
          id
        },
        page: 1,
        perPage: _constants.MAX_DOCS_PER_PAGE,
        sortField: 'created_at',
        sortOrder: 'asc'
      });
      return transformFindResponseToExternalModel(userActions);
    } catch (error) {
      this.log.error(`Error on GET case user action case id: ${caseId}: ${error}`);
      throw error;
    }
  }

  async create({
    unsecuredSavedObjectsClient,
    attributes,
    references
  }) {
    try {
      this.log.debug(`Attempting to POST a new case user action`);
      await unsecuredSavedObjectsClient.create(_constants.CASE_USER_ACTION_SAVED_OBJECT, attributes, {
        references: references !== null && references !== void 0 ? references : []
      });
    } catch (error) {
      this.log.error(`Error on POST a new case user action: ${error}`);
      throw error;
    }
  }

  async bulkCreate({
    unsecuredSavedObjectsClient,
    actions
  }) {
    if ((0, _lodash.isEmpty)(actions)) {
      return;
    }

    try {
      this.log.debug(`Attempting to POST a new case user action`);
      await unsecuredSavedObjectsClient.bulkCreate(actions.map(action => ({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        ...action
      })));
    } catch (error) {
      this.log.error(`Error on POST a new case user action: ${error}`);
      throw error;
    }
  }

  async findStatusChanges({
    unsecuredSavedObjectsClient,
    caseId,
    filter
  }) {
    try {
      this.log.debug('Attempting to find status changes');
      const updateActionFilter = (0, _utils.buildFilter)({
        filters: _api.Actions.update,
        field: 'action',
        operator: 'or',
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT
      });
      const statusChangeFilter = (0, _utils.buildFilter)({
        filters: _api.ActionTypes.status,
        field: 'type',
        operator: 'or',
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT
      });
      const combinedFilters = (0, _utils.combineFilters)([updateActionFilter, statusChangeFilter, filter]);
      const finder = unsecuredSavedObjectsClient.createPointInTimeFinder({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        sortField: _utils2.defaultSortField,
        sortOrder: 'asc',
        filter: combinedFilters,
        perPage: _constants.MAX_DOCS_PER_PAGE
      });
      let userActions = [];

      for await (const findResults of finder.find()) {
        userActions = userActions.concat(findResults.saved_objects.map(so => transformToExternalModel(so)));
      }

      return userActions;
    } catch (error) {
      this.log.error(`Error finding status changes: ${error}`);
      throw error;
    }
  }

  async getUniqueConnectors({
    caseId,
    filter,
    unsecuredSavedObjectsClient
  }) {
    try {
      var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6;

      this.log.debug(`Attempting to count connectors for case id ${caseId}`);
      const connectorsFilter = (0, _utils.buildFilter)({
        filters: [_api.ActionTypes.connector, _api.ActionTypes.create_case],
        field: 'type',
        operator: 'or',
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([connectorsFilter, filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        page: 1,
        perPage: 1,
        sortField: _utils2.defaultSortField,
        aggs: this.buildCountConnectorsAggs(),
        filter: combinedFilter
      });
      return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.references) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.connectors) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4.ids) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.buckets) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.map(({
        key
      }) => ({
        id: key
      }))) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    } catch (error) {
      this.log.error(`Error while counting connectors for case id ${caseId}: ${error}`);
      throw error;
    }
  }

  buildCountConnectorsAggs(
  /**
   * It is high unlikely for a user to have more than
   * 100 connectors attached to a case
   */
  size = 100) {
    return {
      references: {
        nested: {
          path: `${_constants.CASE_USER_ACTION_SAVED_OBJECT}.references`
        },
        aggregations: {
          connectors: {
            filter: {
              term: {
                [`${_constants.CASE_USER_ACTION_SAVED_OBJECT}.references.type`]: 'action'
              }
            },
            aggregations: {
              ids: {
                terms: {
                  field: `${_constants.CASE_USER_ACTION_SAVED_OBJECT}.references.id`,
                  size
                }
              }
            }
          }
        }
      }
    };
  }

}

exports.CaseUserActionService = CaseUserActionService;
(0, _defineProperty2.default)(CaseUserActionService, "userActionFieldsAllowed", new Set(Object.keys(_api.ActionTypes)));

function transformFindResponseToExternalModel(userActions) {
  return { ...userActions,
    saved_objects: userActions.saved_objects.map(so => ({ ...so,
      ...transformToExternalModel(so)
    }))
  };
}

function transformToExternalModel(userAction) {
  var _findReferenceId, _findReferenceId2;

  const {
    references
  } = userAction;
  const caseId = (_findReferenceId = findReferenceId(_constants2.CASE_REF_NAME, _constants.CASE_SAVED_OBJECT, references)) !== null && _findReferenceId !== void 0 ? _findReferenceId : '';
  const commentId = (_findReferenceId2 = findReferenceId(_constants2.COMMENT_REF_NAME, _constants.CASE_COMMENT_SAVED_OBJECT, references)) !== null && _findReferenceId2 !== void 0 ? _findReferenceId2 : null;
  const payload = addReferenceIdToPayload(userAction);
  return { ...userAction,
    attributes: { ...userAction.attributes,
      action_id: userAction.id,
      case_id: caseId,
      comment_id: commentId,
      payload
    }
  };
}

const addReferenceIdToPayload = userAction => {
  const connectorId = getConnectorIdFromReferences(userAction);
  const userActionAttributes = userAction.attributes;

  if ((0, _user_actions.isConnectorUserAction)(userActionAttributes) || (0, _user_actions.isCreateCaseUserAction)(userActionAttributes)) {
    return { ...userActionAttributes.payload,
      connector: { ...userActionAttributes.payload.connector,
        id: connectorId !== null && connectorId !== void 0 ? connectorId : _api.NONE_CONNECTOR_ID
      }
    };
  } else if ((0, _user_actions.isPushedUserAction)(userActionAttributes)) {
    return { ...userAction.attributes.payload,
      externalService: { ...userActionAttributes.payload.externalService,
        connector_id: connectorId !== null && connectorId !== void 0 ? connectorId : _api.NONE_CONNECTOR_ID
      }
    };
  }

  return userAction.attributes.payload;
};

function getConnectorIdFromReferences(userAction) {
  const {
    references
  } = userAction;

  if ((0, _user_actions.isConnectorUserAction)(userAction.attributes) || (0, _user_actions.isCreateCaseUserAction)(userAction.attributes)) {
    var _findConnectorIdRefer, _findConnectorIdRefer2;

    return (_findConnectorIdRefer = (_findConnectorIdRefer2 = (0, _transform.findConnectorIdReference)(_constants2.CONNECTOR_ID_REFERENCE_NAME, references)) === null || _findConnectorIdRefer2 === void 0 ? void 0 : _findConnectorIdRefer2.id) !== null && _findConnectorIdRefer !== void 0 ? _findConnectorIdRefer : null;
  } else if ((0, _user_actions.isPushedUserAction)(userAction.attributes)) {
    var _findConnectorIdRefer3, _findConnectorIdRefer4;

    return (_findConnectorIdRefer3 = (_findConnectorIdRefer4 = (0, _transform.findConnectorIdReference)(_constants2.PUSH_CONNECTOR_ID_REFERENCE_NAME, references)) === null || _findConnectorIdRefer4 === void 0 ? void 0 : _findConnectorIdRefer4.id) !== null && _findConnectorIdRefer3 !== void 0 ? _findConnectorIdRefer3 : null;
  }

  return null;
}

function findReferenceId(name, type, references) {
  var _references$find;

  return (_references$find = references.find(ref => ref.name === name && ref.type === type)) === null || _references$find === void 0 ? void 0 : _references$find.id;
}