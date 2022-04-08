"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_TOKENS_RETURNED = exports.ConnectorTokenClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _server = require("../../../../../../src/core/server");

var _saved_objects = require("../../constants/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_TOKENS_RETURNED = 1;
exports.MAX_TOKENS_RETURNED = MAX_TOKENS_RETURNED;

class ConnectorTokenClient {
  constructor({
    unsecuredSavedObjectsClient,
    encryptedSavedObjectsClient,
    logger
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "unsecuredSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsClient", void 0);
    this.encryptedSavedObjectsClient = encryptedSavedObjectsClient;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.logger = logger;
  }
  /**
   * Create new token for connector
   */


  async create({
    connectorId,
    token,
    expiresAtMillis,
    tokenType
  }) {
    const id = _server.SavedObjectsUtils.generateId();

    const createTime = Date.now();

    try {
      const result = await this.unsecuredSavedObjectsClient.create(_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE, {
        connectorId,
        token,
        expiresAt: expiresAtMillis,
        tokenType: tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token',
        createdAt: new Date(createTime).toISOString(),
        updatedAt: new Date(createTime).toISOString()
      }, {
        id
      });
      return result.attributes;
    } catch (err) {
      this.logger.error(`Failed to create connector_token for connectorId "${connectorId}" and tokenType: "${tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token'}". Error: ${err.message}`);
      throw err;
    }
  }
  /**
   * Update connector token
   */


  async update({
    id,
    token,
    expiresAtMillis,
    tokenType
  }) {
    const {
      attributes,
      references,
      version
    } = await this.unsecuredSavedObjectsClient.get(_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE, id);
    const createTime = Date.now();
    const conflicts = await this.unsecuredSavedObjectsClient.checkConflicts([{
      id,
      type: 'connector_token'
    }]);

    try {
      if (conflicts.errors.length > 0) {
        this.logger.error(`Failed to update connector_token for id "${id}" and tokenType: "${tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token'}". ${conflicts.errors.reduce((messages, errorObj) => `Error: ${errorObj.error.message} ${messages}`, '')}`);
        return null;
      } else {
        const result = await this.unsecuredSavedObjectsClient.create(_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE, { ...attributes,
          token,
          expiresAt: expiresAtMillis,
          tokenType: tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token',
          updatedAt: new Date(createTime).toISOString()
        }, (0, _lodash.omitBy)({
          id,
          overwrite: true,
          references,
          version
        }, _lodash.isUndefined));
        return result.attributes;
      }
    } catch (err) {
      this.logger.error(`Failed to update connector_token for id "${id}" and tokenType: "${tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token'}". Error: ${err.message}`);
      throw err;
    }
  }
  /**
   * Get connector token
   */


  async get({
    connectorId,
    tokenType
  }) {
    const connectorTokensResult = [];
    const tokenTypeFilter = tokenType ? ` AND ${_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE}.attributes.tokenType: "${tokenType}"` : '';

    try {
      connectorTokensResult.push(...(await this.unsecuredSavedObjectsClient.find({
        perPage: MAX_TOKENS_RETURNED,
        type: _saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE,
        filter: `${_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE}.attributes.connectorId: "${connectorId}"${tokenTypeFilter}`,
        sortField: 'updatedAt',
        sortOrder: 'desc'
      })).saved_objects);
    } catch (err) {
      this.logger.error(`Failed to fetch connector_token for connectorId "${connectorId}" and tokenType: "${tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token'}". Error: ${err.message}`);
      return {
        hasErrors: true,
        connectorToken: null
      };
    }

    if (connectorTokensResult.length === 0) {
      return {
        hasErrors: false,
        connectorToken: null
      };
    }

    try {
      const {
        attributes: {
          token
        }
      } = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser(_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE, connectorTokensResult[0].id);
      return {
        hasErrors: false,
        connectorToken: {
          id: connectorTokensResult[0].id,
          ...connectorTokensResult[0].attributes,
          token
        }
      };
    } catch (err) {
      this.logger.error(`Failed to decrypt connector_token for connectorId "${connectorId}" and tokenType: "${tokenType !== null && tokenType !== void 0 ? tokenType : 'access_token'}". Error: ${err.message}`);
      return {
        hasErrors: true,
        connectorToken: null
      };
    }
  }
  /**
   * Delete all connector tokens
   */


  async deleteConnectorTokens({
    connectorId,
    tokenType
  }) {
    const tokenTypeFilter = tokenType ? ` AND ${_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE}.attributes.tokenType: "${tokenType}"` : '';

    try {
      const result = await this.unsecuredSavedObjectsClient.find({
        type: _saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE,
        filter: `${_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE}.attributes.connectorId: "${connectorId}"${tokenTypeFilter}`
      });
      return Promise.all(result.saved_objects.map(async obj => await this.unsecuredSavedObjectsClient.delete(_saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE, obj.id)));
    } catch (err) {
      this.logger.error(`Failed to delete connector_token records for connectorId "${connectorId}". Error: ${err.message}`);
      throw err;
    }
  }

}

exports.ConnectorTokenClient = ConnectorTokenClient;