"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAttachmentsSubClient = void 0;

var _add = require("./add");

var _delete = require("./delete");

var _get = require("./get");

var _update = require("./update");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates an API object for interacting with attachments.
 *
 * @ignore
 */


const createAttachmentsSubClient = (clientArgs, casesClient, casesClientInternal) => {
  const attachmentSubClient = {
    add: params => (0, _add.addComment)(params, clientArgs, casesClientInternal),
    deleteAll: deleteAllArgs => (0, _delete.deleteAll)(deleteAllArgs, clientArgs),
    delete: deleteArgs => (0, _delete.deleteComment)(deleteArgs, clientArgs),
    find: findArgs => (0, _get.find)(findArgs, clientArgs),
    getAllAlertsAttachToCase: params => (0, _get.getAllAlertsAttachToCase)(params, clientArgs, casesClient),
    getAll: getAllArgs => (0, _get.getAll)(getAllArgs, clientArgs),
    get: getArgs => (0, _get.get)(getArgs, clientArgs),
    update: updateArgs => (0, _update.update)(updateArgs, clientArgs)
  };
  return Object.freeze(attachmentSubClient);
};

exports.createAttachmentsSubClient = createAttachmentsSubClient;