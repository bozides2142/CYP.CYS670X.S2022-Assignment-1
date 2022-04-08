"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCasesSubClient = void 0;

var _create = require("./create");

var _delete = require("./delete");

var _find = require("./find");

var _get = require("./get");

var _push = require("./push");

var _update = require("./update");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates the interface for CRUD on cases objects.
 *
 * @ignore
 */


const createCasesSubClient = (clientArgs, casesClient, casesClientInternal) => {
  const casesSubClient = {
    create: data => (0, _create.create)(data, clientArgs),
    find: params => (0, _find.find)(params, clientArgs),
    get: params => (0, _get.get)(params, clientArgs),
    resolve: params => (0, _get.resolve)(params, clientArgs),
    push: params => (0, _push.push)(params, clientArgs, casesClient, casesClientInternal),
    update: cases => (0, _update.update)(cases, clientArgs),
    delete: ids => (0, _delete.deleteCases)(ids, clientArgs),
    getTags: params => (0, _get.getTags)(params, clientArgs),
    getReporters: params => (0, _get.getReporters)(params, clientArgs),
    getCasesByAlertID: params => (0, _get.getCasesByAlertID)(params, clientArgs)
  };
  return Object.freeze(casesSubClient);
};

exports.createCasesSubClient = createCasesSubClient;