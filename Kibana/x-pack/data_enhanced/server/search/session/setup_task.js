"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchSessionsTask = registerSearchSessionsTask;
exports.scheduleSearchSessionsTask = scheduleSearchSessionsTask;
exports.searchSessionTaskRunner = searchSessionTaskRunner;
exports.unscheduleSearchSessionsTask = unscheduleSearchSessionsTask;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _server = require("../../../../../../src/core/server");

var _common = require("../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function searchSessionTaskRunner(core, deps, title, checkFn) {
  const {
    logger,
    config
  } = deps;
  return ({
    taskInstance
  }) => {
    const aborted$ = new _rxjs.BehaviorSubject(false);
    return {
      async run() {
        try {
          const sessionConfig = config.search.sessions;
          const [coreStart] = await core.getStartServices();

          if (!sessionConfig.enabled) {
            logger.debug(`Search sessions are disabled. Skipping task ${title}.`);
            return;
          }

          if (aborted$.getValue()) return;
          const internalRepo = coreStart.savedObjects.createInternalRepository([_common.SEARCH_SESSION_TYPE]);
          const internalSavedObjectsClient = new _server.SavedObjectsClient(internalRepo);
          await checkFn({
            logger,
            client: coreStart.elasticsearch.client.asInternalUser,
            savedObjectsClient: internalSavedObjectsClient
          }, sessionConfig).pipe((0, _operators.takeUntil)(aborted$.pipe((0, _operators.filter)(aborted => aborted)))).toPromise();
          return {
            state: {}
          };
        } catch (e) {
          logger.error(`An error occurred. Skipping task ${title}.`);
        }
      },

      cancel: async () => {
        aborted$.next(true);
      }
    };
  };
}

function registerSearchSessionsTask(core, deps, taskType, title, checkFn) {
  deps.taskManager.registerTaskDefinitions({
    [taskType]: {
      title,
      createTaskRunner: searchSessionTaskRunner(core, deps, title, checkFn),
      timeout: `${deps.config.search.sessions.monitoringTaskTimeout.asSeconds()}s`
    }
  });
}

async function unscheduleSearchSessionsTask({
  taskManager,
  logger
}, taskId) {
  try {
    await taskManager.removeIfExists(taskId);
    logger.debug(`${taskId} cleared`);
  } catch (e) {
    logger.error(`${taskId} Error clearing task ${e.message}`);
  }
}

async function scheduleSearchSessionsTask({
  taskManager,
  logger
}, taskId, taskType, interval) {
  await taskManager.removeIfExists(taskId);

  try {
    await taskManager.ensureScheduled({
      id: taskId,
      taskType,
      schedule: {
        interval: `${interval.asSeconds()}s`
      },
      state: {},
      params: {}
    });
    logger.debug(`${taskId} scheduled to run`);
  } catch (e) {
    logger.error(`${taskId} Error scheduling task ${e.message}`);
  }
}