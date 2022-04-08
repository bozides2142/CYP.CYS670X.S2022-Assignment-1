"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SEARCH_SESSIONS_CLEANUP_TASK_TYPE = exports.SEARCH_SESSIONS_CLEANUP_TASK_ID = void 0;
exports.checkNonPersistedSessions = checkNonPersistedSessions;

var _moment = _interopRequireDefault(require("moment"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _common = require("../../../../../../src/plugins/data/common");

var _get_search_session_page = require("./get_search_session_page");

var _types = require("./types");

var _update_session_status = require("./update_session_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SEARCH_SESSIONS_CLEANUP_TASK_TYPE = 'search_sessions_cleanup';
exports.SEARCH_SESSIONS_CLEANUP_TASK_TYPE = SEARCH_SESSIONS_CLEANUP_TASK_TYPE;
const SEARCH_SESSIONS_CLEANUP_TASK_ID = `data_enhanced_${SEARCH_SESSIONS_CLEANUP_TASK_TYPE}`;
exports.SEARCH_SESSIONS_CLEANUP_TASK_ID = SEARCH_SESSIONS_CLEANUP_TASK_ID;

function isSessionStale(session, config) {
  const curTime = (0, _moment.default)(); // Delete cancelled sessions immediately

  if (session.attributes.status === _common.SearchSessionStatus.CANCELLED) return true; // Delete if a running session wasn't polled for in the last notTouchedInProgressTimeout OR
  // if a completed \ errored \ canceled session wasn't saved for within notTouchedTimeout

  return session.attributes.status === _common.SearchSessionStatus.IN_PROGRESS && curTime.diff((0, _moment.default)(session.attributes.touched), 'ms') > config.notTouchedInProgressTimeout.asMilliseconds() || session.attributes.status !== _common.SearchSessionStatus.IN_PROGRESS && curTime.diff((0, _moment.default)(session.attributes.touched), 'ms') > config.notTouchedTimeout.asMilliseconds();
}

function checkNonPersistedSessionsPage(deps, config, filter, page) {
  const {
    logger,
    client,
    savedObjectsClient
  } = deps;
  logger.debug(`${SEARCH_SESSIONS_CLEANUP_TASK_TYPE} Fetching sessions from page ${page}`);
  return (0, _get_search_session_page.getSearchSessionsPage$)(deps, filter, config.pageSize, page).pipe((0, _operators.concatMap)(async nonPersistedSearchSessions => {
    if (!nonPersistedSearchSessions.total) return nonPersistedSearchSessions;
    logger.debug(`${SEARCH_SESSIONS_CLEANUP_TASK_TYPE} Found ${nonPersistedSearchSessions.total} sessions, processing ${nonPersistedSearchSessions.saved_objects.length}`);
    const updatedSessions = await (0, _update_session_status.getAllSessionsStatusUpdates)(deps, config, nonPersistedSearchSessions);
    const deletedSessionIds = [];
    await Promise.all(nonPersistedSearchSessions.saved_objects.map(async session => {
      if (isSessionStale(session, config)) {
        // delete saved object to free up memory
        // TODO: there's a potential rare edge case of deleting an object and then receiving a new trackId for that same session!
        // Maybe we want to change state to deleted and cleanup later?
        logger.debug(`Deleting stale session | ${session.id}`);

        try {
          var _session$namespaces;

          deletedSessionIds.push(session.id);
          await savedObjectsClient.delete(_common.SEARCH_SESSION_TYPE, session.id, {
            namespace: (_session$namespaces = session.namespaces) === null || _session$namespaces === void 0 ? void 0 : _session$namespaces[0]
          });
        } catch (e) {
          logger.error(`${SEARCH_SESSIONS_CLEANUP_TASK_TYPE} Error while deleting session ${session.id}: ${e.message}`);
        } // Send a delete request for each async search to ES


        Object.keys(session.attributes.idMapping).map(async searchKey => {
          const searchInfo = session.attributes.idMapping[searchKey];
          if (searchInfo.status === _types.SearchStatus.ERROR) return; // skip attempting to delete async search in case we know it has errored out

          if (searchInfo.strategy === _common.ENHANCED_ES_SEARCH_STRATEGY) {
            try {
              await client.asyncSearch.delete({
                id: searchInfo.id
              });
            } catch (e) {
              if (e.message !== 'resource_not_found_exception') {
                logger.error(`${SEARCH_SESSIONS_CLEANUP_TASK_TYPE} Error while deleting async_search ${searchInfo.id}: ${e.message}`);
              }
            }
          }
        });
      }
    }));
    const nonDeletedSessions = updatedSessions.filter(updateSession => {
      return deletedSessionIds.indexOf(updateSession.id) === -1;
    });
    await (0, _update_session_status.bulkUpdateSessions)(deps, nonDeletedSessions);
    return nonPersistedSearchSessions;
  }));
}

function checkNonPersistedSessions(deps, config) {
  const {
    logger
  } = deps;

  const filters = _common.nodeBuilder.is(`${_common.SEARCH_SESSION_TYPE}.attributes.persisted`, 'false');

  return (0, _get_search_session_page.checkSearchSessionsByPage)(checkNonPersistedSessionsPage, deps, config, filters).pipe((0, _operators.catchError)(e => {
    logger.error(`${SEARCH_SESSIONS_CLEANUP_TASK_TYPE} Error while processing sessions: ${e === null || e === void 0 ? void 0 : e.message}`);
    return _rxjs.EMPTY;
  }));
}