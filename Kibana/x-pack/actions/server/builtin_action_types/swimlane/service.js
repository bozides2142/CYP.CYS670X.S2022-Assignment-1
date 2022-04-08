"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _axios_utils = require("../lib/axios_utils");

var _helpers = require("./helpers");

var i18n = _interopRequireWildcard(require("./translations"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createErrorMessage = errorResponse => {
  if (errorResponse == null) {
    return 'unknown';
  }

  const {
    ErrorCode,
    Argument
  } = errorResponse;
  return Argument != null && ErrorCode != null ? `${Argument} (${ErrorCode})` : 'unknown';
};

const createExternalService = ({
  config,
  secrets
}, logger, configurationUtilities) => {
  const {
    apiUrl: url,
    appId,
    mappings
  } = config;
  const {
    apiToken
  } = secrets;

  const axiosInstance = _axios.default.create();

  if (!url || !appId || !apiToken || !mappings) {
    throw Error(`[Action]${i18n.NAME}: Wrong configuration.`);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Private-Token': `${secrets.apiToken}`
  };
  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const apiUrl = urlWithoutTrailingSlash.endsWith('api') ? urlWithoutTrailingSlash : urlWithoutTrailingSlash + '/api';

  const getPostRecordUrl = id => `${apiUrl}/app/${id}/record`;

  const getPostRecordIdUrl = (id, recordId) => `${getPostRecordUrl(id)}/${recordId}`;

  const getRecordIdUrl = (id, recordId) => `${urlWithoutTrailingSlash}/record/${id}/${recordId}`;

  const getPostCommentUrl = (id, recordId, commentFieldId) => `${getPostRecordIdUrl(id, recordId)}/${commentFieldId}/comment`;

  const getCommentFieldId = fieldMappings => {
    var _fieldMappings$commen;

    return ((_fieldMappings$commen = fieldMappings.commentsConfig) === null || _fieldMappings$commen === void 0 ? void 0 : _fieldMappings$commen.id) || null;
  };

  const createRecord = async params => {
    try {
      const mappingConfig = mappings;
      const data = (0, _helpers.getBodyForEventAction)(appId, mappingConfig, params.incident);
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        configurationUtilities,
        data,
        headers,
        logger,
        method: 'post',
        url: getPostRecordUrl(appId)
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: ['id', 'name', 'createdDate']
      });
      return {
        id: res.data.id,
        title: res.data.name,
        url: getRecordIdUrl(appId, res.data.id),
        pushedDate: new Date(res.data.createdDate).toISOString()
      };
    } catch (error) {
      var _error$response$statu, _error$response, _error$response2;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to create record in application with id ${appId}. Status: ${(_error$response$statu = (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) !== null && _error$response$statu !== void 0 ? _error$response$statu : 500}. Error: ${error.message}. Reason: ${createErrorMessage((_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data)}`));
    }
  };

  const updateRecord = async params => {
    try {
      const mappingConfig = mappings;
      const data = (0, _helpers.getBodyForEventAction)(appId, mappingConfig, params.incident, params.incidentId);
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        configurationUtilities,
        data,
        headers,
        logger,
        method: 'patch',
        url: getPostRecordIdUrl(appId, params.incidentId)
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: ['id', 'name', 'modifiedDate']
      });
      return {
        id: res.data.id,
        title: res.data.name,
        url: getRecordIdUrl(appId, params.incidentId),
        pushedDate: new Date(res.data.modifiedDate).toISOString()
      };
    } catch (error) {
      var _error$response$statu2, _error$response3, _error$response4;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to update record in application with id ${appId}. Status: ${(_error$response$statu2 = (_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.status) !== null && _error$response$statu2 !== void 0 ? _error$response$statu2 : 500}. Error: ${error.message}. Reason: ${createErrorMessage((_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data)}`));
    }
  };

  const createComment = async ({
    incidentId,
    comment,
    createdDate
  }) => {
    try {
      const mappingConfig = mappings;
      const fieldId = getCommentFieldId(mappingConfig);

      if (fieldId == null) {
        throw new Error(`No comment field mapped in ${i18n.NAME} connector`);
      }

      const data = {
        createdDate,
        fieldId,
        isRichText: true,
        message: comment.comment
      };
      await (0, _axios_utils.request)({
        axios: axiosInstance,
        configurationUtilities,
        data,
        headers,
        logger,
        method: 'post',
        url: getPostCommentUrl(appId, incidentId, fieldId)
      });
      /**
       * Swimlane response does not contain any data.
       * We cannot get an externalCommentId
       */

      return {
        commentId: comment.commentId,
        pushedDate: createdDate
      };
    } catch (error) {
      var _error$response$statu3, _error$response5, _error$response6;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to create comment in application with id ${appId}. Status: ${(_error$response$statu3 = (_error$response5 = error.response) === null || _error$response5 === void 0 ? void 0 : _error$response5.status) !== null && _error$response$statu3 !== void 0 ? _error$response$statu3 : 500}. Error: ${error.message}. Reason: ${createErrorMessage((_error$response6 = error.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.data)}`));
    }
  };

  return {
    createComment,
    createRecord,
    updateRecord
  };
};

exports.createExternalService = createExternalService;