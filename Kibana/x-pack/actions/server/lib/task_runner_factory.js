"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunnerFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _server = require("../../../spaces/server");

var _server2 = require("../../../../../src/core/server");

var _executor_error = require("./executor_error");

var _types = require("../types");

var _saved_objects = require("../constants/saved_objects");

var _action_execution_source = require("./action_execution_source");

var _related_saved_objects = require("./related_saved_objects");

var _action_task_params_utils = require("./action_task_params_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class TaskRunnerFactory {
  constructor(actionExecutor) {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "taskRunnerContext", void 0);
    (0, _defineProperty2.default)(this, "actionExecutor", void 0);
    this.actionExecutor = actionExecutor;
  }

  initialize(taskRunnerContext) {
    if (this.isInitialized) {
      throw new Error('TaskRunnerFactory already initialized');
    }

    this.isInitialized = true;
    this.taskRunnerContext = taskRunnerContext;
  }

  create({
    taskInstance
  }, maxAttempts = 1) {
    if (!this.isInitialized) {
      throw new Error('TaskRunnerFactory not initialized');
    }

    const {
      actionExecutor
    } = this;
    const {
      logger,
      encryptedSavedObjectsClient,
      spaceIdToNamespace,
      basePathService,
      getUnsecuredSavedObjectsClient
    } = this.taskRunnerContext;
    const taskInfo = {
      scheduled: taskInstance.runAt,
      attempts: taskInstance.attempts
    };
    return {
      async run() {
        var _executorResult, _executorResult2, _executorResult3;

        const actionTaskExecutorParams = taskInstance.params;
        const {
          spaceId
        } = actionTaskExecutorParams;
        const {
          attributes: {
            actionId,
            params,
            apiKey,
            executionId,
            relatedSavedObjects
          },
          references
        } = await getActionTaskParams(actionTaskExecutorParams, encryptedSavedObjectsClient, spaceIdToNamespace);
        const path = (0, _server.addSpaceIdToPath)('/', spaceId);
        const request = getFakeRequest(apiKey);
        basePathService.set(request, path); // Throwing an executor error means we will attempt to retry the task
        // TM will treat a task as a failure if `attempts >= maxAttempts`
        // so we need to handle that here to avoid TM persisting the failed task

        const isRetryableBasedOnAttempts = taskInfo.attempts < (maxAttempts !== null && maxAttempts !== void 0 ? maxAttempts : 1);
        const willRetryMessage = `and will retry`;
        const willNotRetryMessage = `and will not retry`;
        let executorResult;

        try {
          executorResult = await actionExecutor.execute({
            params,
            actionId: actionId,
            isEphemeral: !(0, _types.isPersistedActionTask)(actionTaskExecutorParams),
            request,
            ...getSourceFromReferences(references),
            taskInfo,
            executionId,
            relatedSavedObjects: (0, _related_saved_objects.validatedRelatedSavedObjects)(logger, relatedSavedObjects)
          });
        } catch (e) {
          logger.error(`Action '${actionId}' failed ${isRetryableBasedOnAttempts ? willRetryMessage : willNotRetryMessage}: ${e.message}`);

          if (isRetryableBasedOnAttempts) {
            // In order for retry to work, we need to indicate to task manager this task
            // failed
            throw new _executor_error.ExecutorError(e.message, {}, true);
          }
        }

        if (executorResult && ((_executorResult = executorResult) === null || _executorResult === void 0 ? void 0 : _executorResult.status) === 'error' && ((_executorResult2 = executorResult) === null || _executorResult2 === void 0 ? void 0 : _executorResult2.retry) !== undefined && isRetryableBasedOnAttempts) {
          logger.error(`Action '${actionId}' failed ${!!executorResult.retry ? willRetryMessage : willNotRetryMessage}: ${executorResult.message}`); // Task manager error handler only kicks in when an error thrown (at this time)
          // So what we have to do is throw when the return status is `error`.

          throw new _executor_error.ExecutorError(executorResult.message, executorResult.data, executorResult.retry);
        } else if (executorResult && ((_executorResult3 = executorResult) === null || _executorResult3 === void 0 ? void 0 : _executorResult3.status) === 'error') {
          logger.error(`Action '${actionId}' failed ${willNotRetryMessage}: ${executorResult.message}`);
        } // Cleanup action_task_params object now that we're done with it


        if ((0, _types.isPersistedActionTask)(actionTaskExecutorParams)) {
          try {
            // If the request has reached this far we can assume the user is allowed to run clean up
            // We would idealy secure every operation but in order to support clean up of legacy alerts
            // we allow this operation in an unsecured manner
            // Once support for legacy alert RBAC is dropped, this can be secured
            await getUnsecuredSavedObjectsClient(request).delete(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, actionTaskExecutorParams.actionTaskParamsId);
          } catch (e) {
            // Log error only, we shouldn't fail the task because of an error here (if ever there's retry logic)
            logger.error(`Failed to cleanup ${_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE} object [id="${actionTaskExecutorParams.actionTaskParamsId}"]: ${e.message}`);
          }
        }
      },

      cancel: async () => {
        // Write event log entry
        const actionTaskExecutorParams = taskInstance.params;
        const {
          spaceId
        } = actionTaskExecutorParams;
        const {
          attributes: {
            actionId,
            apiKey,
            executionId,
            relatedSavedObjects
          },
          references
        } = await getActionTaskParams(actionTaskExecutorParams, encryptedSavedObjectsClient, spaceIdToNamespace);
        const request = getFakeRequest(apiKey);
        const path = (0, _server.addSpaceIdToPath)('/', spaceId);
        basePathService.set(request, path);
        await actionExecutor.logCancellation({
          actionId,
          request,
          executionId,
          relatedSavedObjects: relatedSavedObjects || [],
          ...getSourceFromReferences(references)
        });
        logger.debug(`Cancelling action task for action with id ${actionId} - execution error due to timeout.`);
        return {
          state: {}
        };
      }
    };
  }

}

exports.TaskRunnerFactory = TaskRunnerFactory;

function getFakeRequest(apiKey) {
  const requestHeaders = {};

  if (apiKey) {
    requestHeaders.authorization = `ApiKey ${apiKey}`;
  } // Since we're using API keys and accessing elasticsearch can only be done
  // via a request, we're faking one with the proper authorization headers.


  const fakeRequest = _server2.KibanaRequest.from({
    headers: requestHeaders,
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    }
  });

  return fakeRequest;
}

async function getActionTaskParams(executorParams, encryptedSavedObjectsClient, spaceIdToNamespace) {
  const {
    spaceId
  } = executorParams;
  const namespace = spaceIdToNamespace(spaceId);

  if ((0, _types.isPersistedActionTask)(executorParams)) {
    const actionTask = await encryptedSavedObjectsClient.getDecryptedAsInternalUser(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, executorParams.actionTaskParamsId, {
      namespace
    });
    const {
      attributes: {
        relatedSavedObjects
      },
      references
    } = actionTask;
    const {
      actionId,
      relatedSavedObjects: injectedRelatedSavedObjects
    } = (0, _action_task_params_utils.injectSavedObjectReferences)(references, relatedSavedObjects);
    return { ...actionTask,
      attributes: { ...actionTask.attributes,
        ...(actionId ? {
          actionId
        } : {}),
        ...(relatedSavedObjects ? {
          relatedSavedObjects: injectedRelatedSavedObjects
        } : {})
      }
    };
  } else {
    var _executorParams$refer;

    return {
      attributes: executorParams.taskParams,
      references: (_executorParams$refer = executorParams.references) !== null && _executorParams$refer !== void 0 ? _executorParams$refer : []
    };
  }
}

function getSourceFromReferences(references) {
  return (0, _pipeable.pipe)((0, _Option.fromNullable)(references.find(ref => ref.name === 'source')), (0, _Option.map)(source => ({
    source: (0, _action_execution_source.asSavedObjectExecutionSource)((0, _lodash.pick)(source, 'id', 'type'))
  })), (0, _Option.getOrElse)(() => ({})));
}