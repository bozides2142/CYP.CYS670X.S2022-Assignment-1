"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAndCleanupTasks = findAndCleanupTasks;

var _cleanup_tasks = require("./cleanup_tasks");

var _common = require("../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function findAndCleanupTasks({
  logger,
  actionTypeRegistry,
  coreStartServices,
  config,
  kibanaIndex,
  taskManagerIndex
}) {
  logger.debug('Starting cleanup of failed executions');
  const [{
    savedObjects,
    elasticsearch
  }, {
    spaces
  }] = await coreStartServices;
  const esClient = elasticsearch.client.asInternalUser;
  const savedObjectsClient = savedObjects.createInternalRepository(['task']);
  const savedObjectsSerializer = savedObjects.createSerializer();
  const result = await savedObjectsClient.find({
    type: 'task',
    filter: _common.nodeBuilder.and([_common.nodeBuilder.is('task.attributes.status', 'failed'), _common.nodeBuilder.or(actionTypeRegistry.list().map(actionType => _common.nodeBuilder.is('task.attributes.taskType', `actions:${actionType.id}`)))]),
    page: 1,
    perPage: config.pageSize,
    sortField: 'runAt',
    sortOrder: 'asc'
  });
  logger.debug(`Removing ${result.saved_objects.length} of ${result.total} failed execution task(s)`);
  const cleanupResult = await (0, _cleanup_tasks.cleanupTasks)({
    logger,
    esClient,
    spaces,
    kibanaIndex,
    taskManagerIndex,
    savedObjectsSerializer,
    tasks: result.saved_objects
  });
  logger.debug(`Finished cleanup of failed executions. [success=${cleanupResult.successCount}, failures=${cleanupResult.failureCount}]`);
  return { ...cleanupResult,
    remaining: result.total - cleanupResult.successCount
  };
}