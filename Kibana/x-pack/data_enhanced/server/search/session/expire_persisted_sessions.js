"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SEARCH_SESSIONS_EXPIRE_TASK_TYPE = exports.SEARCH_SESSIONS_EXPIRE_TASK_ID = void 0;
exports.checkPersistedCompletedSessionExpiration = checkPersistedCompletedSessionExpiration;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _common = require("../../../../../../src/plugins/data/common");

var _get_search_session_page = require("./get_search_session_page");

var _update_session_status = require("./update_session_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SEARCH_SESSIONS_EXPIRE_TASK_TYPE = 'search_sessions_expire';
exports.SEARCH_SESSIONS_EXPIRE_TASK_TYPE = SEARCH_SESSIONS_EXPIRE_TASK_TYPE;
const SEARCH_SESSIONS_EXPIRE_TASK_ID = `data_enhanced_${SEARCH_SESSIONS_EXPIRE_TASK_TYPE}`;
exports.SEARCH_SESSIONS_EXPIRE_TASK_ID = SEARCH_SESSIONS_EXPIRE_TASK_ID;

function checkSessionExpirationPage(deps, config, filter, page) {
  const {
    logger
  } = deps;
  logger.debug(`${SEARCH_SESSIONS_EXPIRE_TASK_TYPE} Fetching sessions from page ${page}`);
  return (0, _get_search_session_page.getSearchSessionsPage$)(deps, filter, config.pageSize, page).pipe((0, _operators.concatMap)(async searchSessions => {
    if (!searchSessions.total) return searchSessions;
    logger.debug(`${SEARCH_SESSIONS_EXPIRE_TASK_TYPE} Found ${searchSessions.total} sessions, processing ${searchSessions.saved_objects.length}`);
    const updatedSessions = await (0, _update_session_status.getAllSessionsStatusUpdates)(deps, config, searchSessions);
    await (0, _update_session_status.bulkUpdateSessions)(deps, updatedSessions);
    return searchSessions;
  }));
}

function checkPersistedCompletedSessionExpiration(deps, config) {
  const {
    logger
  } = deps;

  const persistedSessionsFilter = _common.nodeBuilder.and([_common.nodeBuilder.is(`${_common.SEARCH_SESSION_TYPE}.attributes.persisted`, 'true'), _common.nodeBuilder.is(`${_common.SEARCH_SESSION_TYPE}.attributes.status`, _common.SearchSessionStatus.COMPLETE.toString())]);

  return (0, _get_search_session_page.checkSearchSessionsByPage)(checkSessionExpirationPage, deps, config, persistedSessionsFilter).pipe((0, _operators.catchError)(e => {
    logger.error(`${SEARCH_SESSIONS_EXPIRE_TASK_TYPE} Error while processing sessions: ${e === null || e === void 0 ? void 0 : e.message}`);
    return _rxjs.EMPTY;
  }));
}