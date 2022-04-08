"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSavedQueryRouteHandlerContext = registerSavedQueryRouteHandlerContext;

var _esQuery = require("@kbn/es-query");

var _common = require("../../common");

var _persistable_state = require("../../common/query/persistable_state");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function injectReferences({
  id,
  attributes,
  references
}) {
  var _attributes$filters;

  const {
    query
  } = attributes;

  if (typeof query.query === 'string') {
    try {
      const parsed = JSON.parse(query.query);
      query.query = parsed instanceof Object ? parsed : query.query;
    } catch (e) {// Just keep it as a string
    }
  }

  const filters = (0, _persistable_state.inject)((_attributes$filters = attributes.filters) !== null && _attributes$filters !== void 0 ? _attributes$filters : [], references);
  return {
    id,
    attributes: { ...attributes,
      filters
    }
  };
}

function extractReferences({
  title,
  description,
  query,
  filters = [],
  timefilter
}) {
  const {
    state: extractedFilters,
    references
  } = (0, _persistable_state.extract)(filters);
  const attributes = {
    title: title.trim(),
    description: description.trim(),
    query: { ...query,
      query: typeof query.query === 'string' ? query.query : JSON.stringify(query.query)
    },
    filters: extractedFilters,
    ...(timefilter && {
      timefilter
    })
  };
  return {
    attributes,
    references
  };
}

function verifySavedQuery({
  title,
  query,
  filters = []
}) {
  if (!(0, _common.isQuery)(query)) {
    throw new Error(`Invalid query: ${query}`);
  }

  if (!(0, _esQuery.isFilters)(filters)) {
    throw new Error(`Invalid filters: ${filters}`);
  }

  if (!title.trim().length) {
    throw new Error('Cannot create saved query without a title');
  }
}

function registerSavedQueryRouteHandlerContext(context) {
  const createSavedQuery = async attrs => {
    verifySavedQuery(attrs);
    const {
      attributes,
      references
    } = extractReferences(attrs);
    const savedObject = await context.core.savedObjects.client.create('query', attributes, {
      references
    }); // TODO: Handle properly

    if (savedObject.error) throw new Error(savedObject.error.message);
    return injectReferences(savedObject);
  };

  const updateSavedQuery = async (id, attrs) => {
    verifySavedQuery(attrs);
    const {
      attributes,
      references
    } = extractReferences(attrs);
    const savedObject = await context.core.savedObjects.client.update('query', id, attributes, {
      references
    }); // TODO: Handle properly

    if (savedObject.error) throw new Error(savedObject.error.message);
    return injectReferences({
      id,
      attributes,
      references
    });
  };

  const getSavedQuery = async id => {
    const {
      saved_object: savedObject,
      outcome
    } = await context.core.savedObjects.client.resolve('query', id);

    if (outcome === 'conflict') {
      throw new Error(`Multiple saved queries found with ID: ${id} (legacy URL alias conflict)`);
    } else if (savedObject.error) {
      throw new Error(savedObject.error.message);
    }

    return injectReferences(savedObject);
  };

  const getSavedQueriesCount = async () => {
    const {
      total
    } = await context.core.savedObjects.client.find({
      type: 'query'
    });
    return total;
  };

  const findSavedQueries = async ({
    page = 1,
    perPage = 50,
    search = ''
  } = {}) => {
    const {
      total,
      saved_objects: savedObjects
    } = await context.core.savedObjects.client.find({
      type: 'query',
      page,
      perPage,
      search
    });
    const savedQueries = savedObjects.map(injectReferences);
    return {
      total,
      savedQueries
    };
  };

  const getAllSavedQueries = async () => {
    const finder = context.core.savedObjects.client.createPointInTimeFinder({
      type: 'query',
      perPage: 100
    });
    const savedObjects = [];

    for await (const response of finder.find()) {
      var _response$saved_objec;

      savedObjects.push(...((_response$saved_objec = response.saved_objects) !== null && _response$saved_objec !== void 0 ? _response$saved_objec : []));
    }

    await finder.close();
    const savedQueries = savedObjects.map(injectReferences);
    return {
      total: savedQueries.length,
      savedQueries
    };
  };

  const deleteSavedQuery = id => {
    return context.core.savedObjects.client.delete('query', id);
  };

  return {
    create: createSavedQuery,
    update: updateSavedQuery,
    get: getSavedQuery,
    count: getSavedQueriesCount,
    find: findSavedQueries,
    getAll: getAllSavedQueries,
    delete: deleteSavedQuery
  };
}