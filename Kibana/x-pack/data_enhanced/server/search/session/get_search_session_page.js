"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSearchSessionsByPage = void 0;
exports.getSearchSessionsPage$ = getSearchSessionsPage$;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _common = require("../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getSearchSessionsPage$({
  savedObjectsClient
}, filter, pageSize, page) {
  return (0, _rxjs.from)(savedObjectsClient.find({
    page,
    perPage: pageSize,
    type: _common.SEARCH_SESSION_TYPE,
    namespaces: ['*'],
    // process older sessions first
    sortField: 'touched',
    sortOrder: 'asc',
    filter
  }));
}

const checkSearchSessionsByPage = (checkFn, deps, config, filters, nextPage = 1) => checkFn(deps, config, filters, nextPage).pipe((0, _operators.concatMap)(result => {
  if (!result || !result.saved_objects || result.saved_objects.length < config.pageSize) {
    return _rxjs.EMPTY;
  } else {
    // TODO: while processing previous page session list might have been changed and we might skip a session,
    // because it would appear now on a different "page".
    // This isn't critical, as we would pick it up on a next task iteration, but maybe we could improve this somehow
    return checkSearchSessionsByPage(checkFn, deps, config, filters, result.page + 1);
  }
}));

exports.checkSearchSessionsByPage = checkSearchSessionsByPage;