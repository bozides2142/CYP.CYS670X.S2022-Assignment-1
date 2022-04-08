"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectsDeprecationsProvider = void 0;

var _unknown_object_types = require("./unknown_object_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getSavedObjectsDeprecationsProvider = config => {
  return {
    getDeprecations: async context => {
      return [...(await (0, _unknown_object_types.getUnknownTypesDeprecations)({ ...config,
        esClient: context.esClient
      }))];
    }
  };
};

exports.getSavedObjectsDeprecationsProvider = getSavedObjectsDeprecationsProvider;