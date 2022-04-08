"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSavedQueryRoutes = registerSavedQueryRoutes;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SAVED_QUERY_PATH = '/api/saved_query';

const SAVED_QUERY_ID_CONFIG = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

const SAVED_QUERY_ATTRS_CONFIG = _configSchema.schema.object({
  title: _configSchema.schema.string(),
  description: _configSchema.schema.string(),
  query: _configSchema.schema.object({
    query: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.object({}, {
      unknowns: 'allow'
    })]),
    language: _configSchema.schema.string()
  }),
  filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any())),
  timefilter: _configSchema.schema.maybe(_configSchema.schema.any())
});

function registerSavedQueryRoutes({
  http
}) {
  const router = http.createRouter();
  router.post({
    path: `${SAVED_QUERY_PATH}/_create`,
    validate: {
      body: SAVED_QUERY_ATTRS_CONFIG
    }
  }, async (context, request, response) => {
    try {
      const body = await context.savedQuery.create(request.body);
      return response.ok({
        body
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
  router.put({
    path: `${SAVED_QUERY_PATH}/{id}`,
    validate: {
      params: SAVED_QUERY_ID_CONFIG,
      body: SAVED_QUERY_ATTRS_CONFIG
    }
  }, async (context, request, response) => {
    const {
      id
    } = request.params;

    try {
      const body = await context.savedQuery.update(id, request.body);
      return response.ok({
        body
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
  router.get({
    path: `${SAVED_QUERY_PATH}/{id}`,
    validate: {
      params: SAVED_QUERY_ID_CONFIG
    }
  }, async (context, request, response) => {
    const {
      id
    } = request.params;

    try {
      const body = await context.savedQuery.get(id);
      return response.ok({
        body
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
  router.get({
    path: `${SAVED_QUERY_PATH}/_count`,
    validate: {}
  }, async (context, request, response) => {
    try {
      const count = await context.savedQuery.count();
      return response.ok({
        body: `${count}`
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
  router.post({
    path: `${SAVED_QUERY_PATH}/_find`,
    validate: {
      body: _configSchema.schema.object({
        search: _configSchema.schema.string({
          defaultValue: ''
        }),
        perPage: _configSchema.schema.number({
          defaultValue: 50
        }),
        page: _configSchema.schema.number({
          defaultValue: 1
        })
      })
    }
  }, async (context, request, response) => {
    try {
      const body = await context.savedQuery.find(request.body);
      return response.ok({
        body
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
  router.post({
    path: `${SAVED_QUERY_PATH}/_all`,
    validate: {}
  }, async (context, request, response) => {
    try {
      const body = await context.savedQuery.getAll();
      return response.ok({
        body
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
  router.delete({
    path: `${SAVED_QUERY_PATH}/{id}`,
    validate: {
      params: SAVED_QUERY_ID_CONFIG
    }
  }, async (context, request, response) => {
    const {
      id
    } = request.params;

    try {
      const body = await context.savedQuery.delete(id);
      return response.ok({
        body
      });
    } catch (e) {
      // TODO: Handle properly
      return response.customError(e);
    }
  });
}