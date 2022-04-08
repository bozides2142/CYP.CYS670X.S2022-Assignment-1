"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUserActionsSubClient = void 0;

var _get = require("./get");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates an API object for interacting with the user action entities
 *
 * @ignore
 */


const createUserActionsSubClient = clientArgs => {
  const attachmentSubClient = {
    getAll: params => (0, _get.get)(params, clientArgs)
  };
  return Object.freeze(attachmentSubClient);
};

exports.createUserActionsSubClient = createUserActionsSubClient;