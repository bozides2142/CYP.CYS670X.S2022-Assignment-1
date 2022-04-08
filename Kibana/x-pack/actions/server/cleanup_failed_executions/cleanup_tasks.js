"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanupTasks = cleanupTasks;

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Cleanup tasks
 *
 * This function receives action execution tasks that are in a failed state, removes
 * the linked "action_task_params" object first and then if successful, the task manager's task.
 */


async function cleanupTasks({
  logger,
  esClient,
  tasks,
  spaces,
  savedObjectsSerializer,
  kibanaIndex,
  taskManagerIndex
}) {
  const deserializedTasks = tasks.map(task => ({ ...task,
    attributes: { ...task.attributes,
      params: typeof task.attributes.params === 'string' ? JSON.parse(task.attributes.params) : task.attributes.params || {}
    }
  })); // Remove accumulated action task params

  const actionTaskParamIdsToDelete = deserializedTasks.map(task => (0, _lib.getRawActionTaskParamsIdFromTask)({
    task,
    spaces,
    savedObjectsSerializer
  }));
  const actionTaskParamBulkDeleteResult = await (0, _lib.bulkDelete)(esClient, kibanaIndex, actionTaskParamIdsToDelete);
  const failedActionTaskParams = actionTaskParamBulkDeleteResult ? (0, _lib.extractBulkResponseDeleteFailures)(actionTaskParamBulkDeleteResult) : [];

  if (failedActionTaskParams !== null && failedActionTaskParams !== void 0 && failedActionTaskParams.length) {
    logger.debug(`Failed to delete the following action_task_params [${JSON.stringify(failedActionTaskParams)}]`);
  } // Remove accumulated tasks


  const taskIdsToDelete = deserializedTasks.map(task => {
    const rawId = (0, _lib.getRawActionTaskParamsIdFromTask)({
      task,
      spaces,
      savedObjectsSerializer
    }); // Avoid removing tasks that failed to remove linked objects

    if (failedActionTaskParams !== null && failedActionTaskParams !== void 0 && failedActionTaskParams.find(item => item._id === rawId)) {
      return null;
    }

    const rawTaskId = savedObjectsSerializer.generateRawId(undefined, 'task', task.id);
    return rawTaskId;
  }).filter(id => !!id);
  const taskBulkDeleteResult = await (0, _lib.bulkDelete)(esClient, taskManagerIndex, taskIdsToDelete);
  const failedTasks = taskBulkDeleteResult ? (0, _lib.extractBulkResponseDeleteFailures)(taskBulkDeleteResult) : [];

  if (failedTasks !== null && failedTasks !== void 0 && failedTasks.length) {
    logger.debug(`Failed to delete the following tasks [${JSON.stringify(failedTasks)}]`);
  }

  return {
    success: (failedActionTaskParams === null || failedActionTaskParams === void 0 ? void 0 : failedActionTaskParams.length) === 0 && failedTasks.length === 0,
    successCount: tasks.length - failedActionTaskParams.length - failedTasks.length,
    failureCount: failedActionTaskParams.length + failedTasks.length
  };
}