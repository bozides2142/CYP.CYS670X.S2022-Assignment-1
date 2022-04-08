"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformers = exports.transformFields = exports.transformComments = exports.prepareFieldsForTransformation = exports.isCommentAlertType = exports.getLatestPushInfo = exports.getEntity = exports.getCommentContextFromAttributes = exports.createIncident = exports.FIELD_INFORMATION = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _user_actions = require("../../../common/utils/user_actions");

var _api = require("../../../common/api");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getLatestPushInfo = (connectorId, userActions) => {
  for (const [index, action] of [...userActions].reverse().entries()) {
    if ((0, _user_actions.isPushedUserAction)(action) && connectorId === action.payload.externalService.connector_id) {
      try {
        const pushedInfo = action.payload.externalService; // We returned the index of the element in the userActions array.
        // As we traverse the userActions in reverse we need to calculate the index of a normal traversal

        return {
          index: userActions.length - index - 1,
          pushedInfo
        };
      } catch (e) {// ignore parse failures and check the next user action
      }
    }
  }

  return null;
};

exports.getLatestPushInfo = getLatestPushInfo;

const getCommentContent = comment => {
  if (comment.type === _api.CommentType.user) {
    return comment.comment;
  } else if (comment.type === _api.CommentType.alert) {
    const ids = (0, _utils.getAlertIds)(comment);
    return `Alert with ids ${ids.join(', ')} added to case`;
  } else if (comment.type === _api.CommentType.actions && (comment.actions.type === 'isolate' || comment.actions.type === 'unisolate')) {
    var _comment$actions$targ;

    const firstHostname = ((_comment$actions$targ = comment.actions.targets) === null || _comment$actions$targ === void 0 ? void 0 : _comment$actions$targ.length) > 0 ? comment.actions.targets[0].hostname : 'unknown';
    const totalHosts = comment.actions.targets.length;
    const actionText = comment.actions.type === 'isolate' ? 'Isolated' : 'Released';
    const additionalHostsText = totalHosts - 1 > 0 ? `and ${totalHosts - 1} more ` : ``;
    return `${actionText} host ${firstHostname} ${additionalHostsText}with comment: ${comment.comment}`;
  }

  return '';
};

const getAlertsInfo = comments => {
  var _comments$reduce;

  const countingInfo = {
    totalComments: 0,
    pushed: 0,
    totalAlerts: 0
  };
  const res = (_comments$reduce = comments === null || comments === void 0 ? void 0 : comments.reduce(({
    totalComments,
    pushed,
    totalAlerts
  }, comment) => {
    if (comment.type === _api.CommentType.alert) {
      return {
        totalComments: totalComments + 1,
        pushed: comment.pushed_at != null ? pushed + 1 : pushed,
        totalAlerts: totalAlerts + (Array.isArray(comment.alertId) ? comment.alertId.length : 1)
      };
    }

    return {
      totalComments,
      pushed,
      totalAlerts
    };
  }, countingInfo)) !== null && _comments$reduce !== void 0 ? _comments$reduce : countingInfo;
  return {
    totalAlerts: res.totalAlerts,
    hasUnpushedAlertComments: res.totalComments > res.pushed
  };
};

const addAlertMessage = (caseId, caseComments, comments) => {
  const {
    totalAlerts,
    hasUnpushedAlertComments
  } = getAlertsInfo(caseComments);
  const newComments = [...comments];

  if (hasUnpushedAlertComments) {
    newComments.push({
      comment: `Elastic Alerts attached to the case: ${totalAlerts}`,
      commentId: `${caseId}-total-alerts`
    });
  }

  return newComments;
};

const createIncident = async ({
  actionsClient,
  theCase,
  userActions,
  connector,
  mappings,
  alerts,
  casesConnectors
}) => {
  var _latestPushInfo$pushe, _latestPushInfo$pushe2, _casesConnectors$get$, _casesConnectors$get, _latestPushInfo$index;

  const {
    comments: caseComments,
    title,
    description,
    created_at: createdAt,
    created_by: createdBy,
    updated_at: updatedAt,
    updated_by: updatedBy
  } = theCase;
  const params = {
    title,
    description,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy
  };
  const latestPushInfo = getLatestPushInfo(connector.id, userActions);
  const externalId = (_latestPushInfo$pushe = latestPushInfo === null || latestPushInfo === void 0 ? void 0 : (_latestPushInfo$pushe2 = latestPushInfo.pushedInfo) === null || _latestPushInfo$pushe2 === void 0 ? void 0 : _latestPushInfo$pushe2.external_id) !== null && _latestPushInfo$pushe !== void 0 ? _latestPushInfo$pushe : null;
  const defaultPipes = externalId ? ['informationUpdated'] : ['informationCreated'];
  let currentIncident;
  const externalServiceFields = (_casesConnectors$get$ = (_casesConnectors$get = casesConnectors.get(connector.actionTypeId)) === null || _casesConnectors$get === void 0 ? void 0 : _casesConnectors$get.format(theCase, alerts)) !== null && _casesConnectors$get$ !== void 0 ? _casesConnectors$get$ : {};
  let incident = { ...externalServiceFields
  };

  if (externalId) {
    try {
      currentIncident = await actionsClient.execute({
        actionId: connector.id,
        params: {
          subAction: 'getIncident',
          subActionParams: {
            externalId
          }
        }
      });
    } catch (ex) {
      throw new Error(`Retrieving Incident by id ${externalId} from ${connector.actionTypeId} failed with exception: ${ex}`);
    }
  }

  const fields = prepareFieldsForTransformation({
    defaultPipes,
    mappings,
    params
  });
  const transformedFields = transformFields({
    params,
    fields,
    currentIncident
  });
  incident = { ...incident,
    ...transformedFields,
    externalId
  };
  const commentsIdsToBeUpdated = new Set(userActions.slice((_latestPushInfo$index = latestPushInfo === null || latestPushInfo === void 0 ? void 0 : latestPushInfo.index) !== null && _latestPushInfo$index !== void 0 ? _latestPushInfo$index : 0).filter(action => action.type === _api.ActionTypes.comment).map(action => action.comment_id));
  const commentsToBeUpdated = caseComments === null || caseComments === void 0 ? void 0 : caseComments.filter(comment => // We push only user's comments
  (comment.type === _api.CommentType.user || comment.type === _api.CommentType.actions) && commentsIdsToBeUpdated.has(comment.id));
  let comments = [];

  if (commentsToBeUpdated && Array.isArray(commentsToBeUpdated) && commentsToBeUpdated.length > 0) {
    const commentsMapping = mappings.find(m => m.source === 'comments');

    if ((commentsMapping === null || commentsMapping === void 0 ? void 0 : commentsMapping.action_type) !== 'nothing') {
      comments = transformComments(commentsToBeUpdated, ['informationAdded']);
    }
  }

  comments = addAlertMessage(theCase.id, caseComments, comments);
  return {
    incident,
    comments
  };
};

exports.createIncident = createIncident;

const getEntity = entity => {
  var _ref;

  return (_ref = entity.updatedBy != null ? entity.updatedBy.full_name ? entity.updatedBy.full_name : entity.updatedBy.username : entity.createdBy != null ? entity.createdBy.full_name ? entity.createdBy.full_name : entity.createdBy.username : '') !== null && _ref !== void 0 ? _ref : '';
};

exports.getEntity = getEntity;

const FIELD_INFORMATION = (mode, date, user) => {
  switch (mode) {
    case 'create':
      return _i18n.i18n.translate('xpack.cases.connectors.cases.externalIncidentCreated', {
        values: {
          date,
          user
        },
        defaultMessage: '(created at {date} by {user})'
      });

    case 'update':
      return _i18n.i18n.translate('xpack.cases.connectors.cases.externalIncidentUpdated', {
        values: {
          date,
          user
        },
        defaultMessage: '(updated at {date} by {user})'
      });

    case 'add':
      return _i18n.i18n.translate('xpack.cases.connectors.cases.externalIncidentAdded', {
        values: {
          date,
          user
        },
        defaultMessage: '(added at {date} by {user})'
      });

    default:
      return _i18n.i18n.translate('xpack.cases.connectors.cases.externalIncidentDefault', {
        values: {
          date,
          user
        },
        defaultMessage: '(created at {date} by {user})'
      });
  }
};

exports.FIELD_INFORMATION = FIELD_INFORMATION;
const transformers = {
  informationCreated: ({
    value,
    date,
    user,
    ...rest
  }) => ({
    value: `${value} ${FIELD_INFORMATION('create', date, user)}`,
    ...rest
  }),
  informationUpdated: ({
    value,
    date,
    user,
    ...rest
  }) => ({
    value: `${value} ${FIELD_INFORMATION('update', date, user)}`,
    ...rest
  }),
  informationAdded: ({
    value,
    date,
    user,
    ...rest
  }) => ({
    value: `${value} ${FIELD_INFORMATION('add', date, user)}`,
    ...rest
  }),
  append: ({
    value,
    previousValue,
    ...rest
  }) => ({
    value: previousValue ? `${previousValue} \r\n${value}` : `${value}`,
    ...rest
  })
};
exports.transformers = transformers;

const prepareFieldsForTransformation = ({
  defaultPipes,
  mappings,
  params
}) => mappings.reduce((acc, mapping) => {
  var _params$mapping$sourc;

  return mapping != null && mapping.target != null && mapping.target !== 'not_mapped' && mapping.action_type !== 'nothing' && mapping.source !== 'comments' ? [...acc, {
    key: mapping.target,
    value: (_params$mapping$sourc = params[mapping.source]) !== null && _params$mapping$sourc !== void 0 ? _params$mapping$sourc : '',
    actionType: mapping.action_type,
    pipes: // Do not transform titles
    mapping.source !== 'title' ? mapping.action_type === 'append' ? [...defaultPipes, 'append'] : defaultPipes : []
  }] : acc;
}, []);

exports.prepareFieldsForTransformation = prepareFieldsForTransformation;

const transformFields = ({
  params,
  fields,
  currentIncident
}) => {
  return fields.reduce((prev, cur) => {
    var _params$updatedAt;

    const transform = (0, _lodash.flow)(...cur.pipes.map(p => transformers[p]));
    return { ...prev,
      [cur.key]: transform({
        value: cur.value,
        date: (_params$updatedAt = params.updatedAt) !== null && _params$updatedAt !== void 0 ? _params$updatedAt : params.createdAt,
        user: getEntity(params),
        previousValue: currentIncident ? currentIncident[cur.key] : ''
      }).value
    };
  }, {});
};

exports.transformFields = transformFields;

const transformComments = (comments = [], pipes) => comments.map(c => {
  var _c$updated_at;

  return {
    comment: (0, _lodash.flow)(...pipes.map(p => transformers[p]))({
      value: getCommentContent(c),
      date: (_c$updated_at = c.updated_at) !== null && _c$updated_at !== void 0 ? _c$updated_at : c.created_at,
      user: getEntity({
        createdAt: c.created_at,
        createdBy: c.created_by,
        updatedAt: c.updated_at,
        updatedBy: c.updated_by
      })
    }).value,
    commentId: c.id
  };
});

exports.transformComments = transformComments;

const isCommentAlertType = comment => comment.type === _api.CommentType.alert;

exports.isCommentAlertType = isCommentAlertType;

const getCommentContextFromAttributes = attributes => {
  const owner = attributes.owner;

  switch (attributes.type) {
    case _api.CommentType.user:
      return {
        type: _api.CommentType.user,
        comment: attributes.comment,
        owner
      };

    case _api.CommentType.alert:
      return {
        type: attributes.type,
        alertId: attributes.alertId,
        index: attributes.index,
        rule: attributes.rule,
        owner
      };

    case _api.CommentType.actions:
      return {
        type: attributes.type,
        comment: attributes.comment,
        actions: {
          targets: attributes.actions.targets,
          type: attributes.actions.type
        },
        owner
      };

    default:
      return {
        type: _api.CommentType.user,
        comment: '',
        owner
      };
  }
};

exports.getCommentContextFromAttributes = getCommentContextFromAttributes;