"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkUpdateSessions = bulkUpdateSessions;
exports.getAllSessionsStatusUpdates = getAllSessionsStatusUpdates;
exports.updateSessionStatus = updateSessionStatus;

var _common = require("../../../../../../src/plugins/data/common");

var _get_search_status = require("./get_search_status");

var _get_session_status = require("./get_session_status");

var _types = require("./types");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function updateSessionStatus({
  logger,
  client
}, config, session) {
  let sessionUpdated = false;
  const isExpired = (0, _utils.isSearchSessionExpired)(session);

  if (!isExpired) {
    // Check statuses of all running searches
    await Promise.all(Object.keys(session.attributes.idMapping).map(async searchKey => {
      const updateSearchRequest = currentStatus => {
        sessionUpdated = true;
        session.attributes.idMapping[searchKey] = { ...session.attributes.idMapping[searchKey],
          ...currentStatus
        };
      };

      const searchInfo = session.attributes.idMapping[searchKey];

      if (searchInfo.status === _types.SearchStatus.IN_PROGRESS) {
        try {
          const currentStatus = await (0, _get_search_status.getSearchStatus)(client, searchInfo.id);

          if (currentStatus.status !== searchInfo.status) {
            logger.debug(`search ${searchInfo.id} | status changed to ${currentStatus.status}`);
            updateSearchRequest(currentStatus);
          }
        } catch (e) {
          var _e$meta$error, _e$meta$error$caused_;

          logger.error(e);
          updateSearchRequest({
            status: _types.SearchStatus.ERROR,
            error: e.message || ((_e$meta$error = e.meta.error) === null || _e$meta$error === void 0 ? void 0 : (_e$meta$error$caused_ = _e$meta$error.caused_by) === null || _e$meta$error$caused_ === void 0 ? void 0 : _e$meta$error$caused_.reason)
          });
        }
      }
    }));
  } // And only then derive the session's status


  const sessionStatus = isExpired ? _common.SearchSessionStatus.EXPIRED : (0, _get_session_status.getSessionStatus)(session.attributes, config);

  if (sessionStatus !== session.attributes.status) {
    const now = new Date().toISOString();
    session.attributes.status = sessionStatus;
    session.attributes.touched = now;

    if (sessionStatus === _common.SearchSessionStatus.COMPLETE) {
      session.attributes.completed = now;
    } else if (session.attributes.completed) {
      session.attributes.completed = null;
    }

    sessionUpdated = true;
  }

  return sessionUpdated;
}

async function getAllSessionsStatusUpdates(deps, config, searchSessions) {
  const updatedSessions = new Array();
  await Promise.all(searchSessions.saved_objects.map(async session => {
    const updated = await updateSessionStatus(deps, config, session);

    if (updated) {
      updatedSessions.push(session);
    }
  }));
  return updatedSessions;
}

async function bulkUpdateSessions({
  logger,
  savedObjectsClient
}, updatedSessions) {
  if (updatedSessions.length) {
    // If there's an error, we'll try again in the next iteration, so there's no need to check the output.
    const updatedResponse = await savedObjectsClient.bulkUpdate(updatedSessions.map(session => {
      var _session$namespaces;

      return { ...session,
        namespace: (_session$namespaces = session.namespaces) === null || _session$namespaces === void 0 ? void 0 : _session$namespaces[0]
      };
    }));
    const success = [];
    const fail = [];
    updatedResponse.saved_objects.forEach(savedObjectResponse => {
      if ('error' in savedObjectResponse) {
        var _savedObjectResponse$;

        fail.push(savedObjectResponse);
        logger.error(`Error while updating search session ${savedObjectResponse === null || savedObjectResponse === void 0 ? void 0 : savedObjectResponse.id}: ${(_savedObjectResponse$ = savedObjectResponse.error) === null || _savedObjectResponse$ === void 0 ? void 0 : _savedObjectResponse$.message}`);
      } else {
        success.push(savedObjectResponse);
      }
    });
    logger.debug(`Updating search sessions: success: ${success.length}, fail: ${fail.length}`);
  }
}