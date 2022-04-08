"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineAuthorizedAndOwnerFilter = exports.buildFilter = exports.addStatusFilter = void 0;
exports.combineFilters = combineFilters;
exports.sortToSnake = exports.isTwoArraysDifference = exports.getCaseToUpdate = exports.getAlertIds = exports.decodeCommentRequest = exports.constructQueryOptions = exports.compareArrays = void 0;
exports.stringToKueryNode = stringToKueryNode;

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var _esQuery = require("@kbn/es-query");

var _constants = require("../../common/constants");

var _api = require("../../common/api");

var _utils = require("../authorization/utils");

var _utils2 = require("../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const decodeCommentRequest = comment => {
  if ((0, _utils2.isCommentRequestTypeUser)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ContextTypeUserRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else if ((0, _utils2.isCommentRequestTypeActions)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ActionsCommentRequestRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else if ((0, _utils2.isCommentRequestTypeAlert)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.AlertCommentRequestRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
    const {
      ids,
      indices
    } = (0, _utils2.getIDsAndIndicesAsArrays)(comment);
    /**
     * The alertId and index field must either be both of type string or they must both be string[] and be the same length.
     * Having a one-to-one relationship between the id and index of an alert avoids accidentally updating or
     * retrieving the wrong alert. Elasticsearch only guarantees that the _id (the field we use for alertId) to be
     * unique within a single index. So if we attempt to update or get a specific alert across multiple indices we could
     * update or receive the wrong one.
     *
     * Consider the situation where we have a alert1 with _id = '100' in index 'my-index-awesome' and also in index
     *  'my-index-hi'.
     * If we attempt to update the status of alert1 using an index pattern like `my-index-*` or even providing multiple
     * indices, there's a chance we'll accidentally update too many alerts.
     *
     * This check doesn't enforce that the API request has the correct alert ID to index relationship it just guards
     * against accidentally making a request like:
     * {
     *  alertId: [1,2,3],
     *  index: awesome,
     * }
     *
     * Instead this requires the requestor to provide:
     * {
     *  alertId: [1,2,3],
     *  index: [awesome, awesome, awesome]
     * }
     *
     * Ideally we'd change the format of the comment request to be an array of objects like:
     * {
     *  alerts: [{id: 1, index: awesome}, {id: 2, index: awesome}]
     * }
     *
     * But we'd need to also implement a migration because the saved object document currently stores the id and index
     * in separate fields.
     */

    if (ids.length !== indices.length) {
      throw (0, _boom.badRequest)(`Received an alert comment with ids and indices arrays of different lengths ids: ${JSON.stringify(ids)} indices: ${JSON.stringify(indices)}`);
    }
  }
};
/**
 * Return the alert IDs from the comment if it is an alert style comment. Otherwise return an empty array.
 */


exports.decodeCommentRequest = decodeCommentRequest;

const getAlertIds = comment => {
  if ((0, _utils2.isCommentRequestTypeAlert)(comment)) {
    return Array.isArray(comment.alertId) ? comment.alertId : [comment.alertId];
  }

  return [];
};

exports.getAlertIds = getAlertIds;

const addStatusFilter = ({
  status,
  appendFilter,
  type = _constants.CASE_SAVED_OBJECT
}) => {
  const filters = [];
  filters.push(_esQuery.nodeBuilder.is(`${type}.attributes.status`, status));

  if (appendFilter) {
    filters.push(appendFilter);
  }

  return filters.length > 1 ? _esQuery.nodeBuilder.and(filters) : filters[0];
};

exports.addStatusFilter = addStatusFilter;

const buildFilter = ({
  filters,
  field,
  operator,
  type = _constants.CASE_SAVED_OBJECT
}) => {
  if (filters === undefined) {
    return;
  }

  const filtersAsArray = Array.isArray(filters) ? filters : [filters];

  if (filtersAsArray.length === 0) {
    return;
  }

  return _esQuery.nodeBuilder[operator](filtersAsArray.map(filter => _esQuery.nodeBuilder.is(`${type}.attributes.${field}`, filter)));
};
/**
 * Combines the authorized filters with the requested owners.
 */


exports.buildFilter = buildFilter;

const combineAuthorizedAndOwnerFilter = (owner, authorizationFilter, savedObjectType) => {
  const ownerFilter = buildFilter({
    filters: owner,
    field: _api.OWNER_FIELD,
    operator: 'or',
    type: savedObjectType
  });
  return (0, _utils.combineFilterWithAuthorizationFilter)(ownerFilter, authorizationFilter);
};
/**
 * Combines Kuery nodes and accepts an array with a mixture of undefined and KueryNodes. This will filter out the undefined
 * filters and return a KueryNode with the filters and'd together.
 */


exports.combineAuthorizedAndOwnerFilter = combineAuthorizedAndOwnerFilter;

function combineFilters(nodes) {
  const filters = nodes.filter(node => node !== undefined);

  if (filters.length <= 0) {
    return;
  }

  return _esQuery.nodeBuilder.and(filters);
}
/**
 * Creates a KueryNode from a string expression. Returns undefined if the expression is undefined.
 */


function stringToKueryNode(expression) {
  if (!expression) {
    return;
  }

  return (0, _esQuery.fromKueryExpression)(expression);
}

const constructQueryOptions = ({
  tags,
  reporters,
  status,
  sortByField,
  owner,
  authorizationFilter
}) => {
  const kueryNodeExists = filter => filter != null;

  const tagsFilter = buildFilter({
    filters: tags !== null && tags !== void 0 ? tags : [],
    field: 'tags',
    operator: 'or'
  });
  const reportersFilter = buildFilter({
    filters: reporters !== null && reporters !== void 0 ? reporters : [],
    field: 'created_by.username',
    operator: 'or'
  });
  const sortField = sortToSnake(sortByField);
  const ownerFilter = buildFilter({
    filters: owner !== null && owner !== void 0 ? owner : [],
    field: _api.OWNER_FIELD,
    operator: 'or'
  });
  const statusFilter = status != null ? addStatusFilter({
    status
  }) : undefined;
  const filters = [statusFilter, tagsFilter, reportersFilter, ownerFilter].filter(kueryNodeExists);
  const caseFilters = filters.length > 1 ? _esQuery.nodeBuilder.and(filters) : filters[0];
  return {
    filter: (0, _utils.combineFilterWithAuthorizationFilter)(caseFilters, authorizationFilter),
    sortField
  };
};

exports.constructQueryOptions = constructQueryOptions;

const compareArrays = ({
  originalValue,
  updatedValue
}) => {
  const result = {
    addedItems: [],
    deletedItems: []
  };
  originalValue.forEach(origVal => {
    if (!updatedValue.includes(origVal)) {
      result.deletedItems = [...result.deletedItems, origVal];
    }
  });
  updatedValue.forEach(updatedVal => {
    if (!originalValue.includes(updatedVal)) {
      result.addedItems = [...result.addedItems, updatedVal];
    }
  });
  return result;
};

exports.compareArrays = compareArrays;

const isTwoArraysDifference = (originalValue, updatedValue) => {
  if (originalValue != null && updatedValue != null && Array.isArray(updatedValue) && Array.isArray(originalValue)) {
    const compObj = compareArrays({
      originalValue,
      updatedValue
    });

    if (compObj.addedItems.length > 0 || compObj.deletedItems.length > 0) {
      return compObj;
    }
  }

  return null;
};

exports.isTwoArraysDifference = isTwoArraysDifference;

const getCaseToUpdate = (currentCase, queryCase) => Object.entries(queryCase).reduce((acc, [key, value]) => {
  const currentValue = (0, _lodash.get)(currentCase, key);

  if (Array.isArray(currentValue) && Array.isArray(value)) {
    if (isTwoArraysDifference(value, currentValue)) {
      return { ...acc,
        [key]: value
      };
    }

    return acc;
  } else if ((0, _lodash.isPlainObject)(currentValue) && (0, _lodash.isPlainObject)(value)) {
    if (!(0, _fastDeepEqual.default)(currentValue, value)) {
      return { ...acc,
        [key]: value
      };
    }

    return acc;
  } else if (currentValue != null && value !== currentValue) {
    return { ...acc,
      [key]: value
    };
  }

  return acc;
}, {
  id: queryCase.id,
  version: queryCase.version
});

exports.getCaseToUpdate = getCaseToUpdate;
var SortFieldCase;

(function (SortFieldCase) {
  SortFieldCase["closedAt"] = "closed_at";
  SortFieldCase["createdAt"] = "created_at";
  SortFieldCase["status"] = "status";
})(SortFieldCase || (SortFieldCase = {}));

const sortToSnake = sortField => {
  switch (sortField) {
    case 'status':
      return SortFieldCase.status;

    case 'createdAt':
    case 'created_at':
      return SortFieldCase.createdAt;

    case 'closedAt':
    case 'closed_at':
      return SortFieldCase.closedAt;

    default:
      return SortFieldCase.createdAt;
  }
};

exports.sortToSnake = sortToSnake;