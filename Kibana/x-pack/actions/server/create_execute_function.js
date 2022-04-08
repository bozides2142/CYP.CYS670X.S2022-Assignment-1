"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEphemeralExecutionEnqueuerFunction = createEphemeralExecutionEnqueuerFunction;
exports.createExecutionEnqueuerFunction = createExecutionEnqueuerFunction;

var _saved_objects = require("./constants/saved_objects");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createExecutionEnqueuerFunction({
  taskManager,
  actionTypeRegistry,
  isESOCanEncrypt,
  preconfiguredActions
}) {
  return async function execute(unsecuredSavedObjectsClient, {
    id,
    params,
    spaceId,
    source,
    apiKey,
    executionId,
    relatedSavedObjects
  }) {
    if (!isESOCanEncrypt) {
      throw new Error(`Unable to execute action because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
    }

    const {
      action,
      isPreconfigured
    } = await getAction(unsecuredSavedObjectsClient, preconfiguredActions, id);
    validateCanActionBeUsed(action);
    const {
      actionTypeId
    } = action;

    if (!actionTypeRegistry.isActionExecutable(id, actionTypeId, {
      notifyUsage: true
    })) {
      actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    } // Get saved object references from action ID and relatedSavedObjects


    const {
      references,
      relatedSavedObjectWithRefs
    } = (0, _lib.extractSavedObjectReferences)(id, isPreconfigured, relatedSavedObjects);
    const executionSourceReference = executionSourceAsSavedObjectReferences(source);
    const taskReferences = [];

    if (executionSourceReference.references) {
      taskReferences.push(...executionSourceReference.references);
    }

    if (references) {
      taskReferences.push(...references);
    }

    const actionTaskParamsRecord = await unsecuredSavedObjectsClient.create(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, {
      actionId: id,
      params,
      apiKey,
      executionId,
      relatedSavedObjects: relatedSavedObjectWithRefs
    }, {
      references: taskReferences
    });
    await taskManager.schedule({
      taskType: `actions:${action.actionTypeId}`,
      params: {
        spaceId,
        actionTaskParamsId: actionTaskParamsRecord.id
      },
      state: {},
      scope: ['actions']
    });
  };
}

function createEphemeralExecutionEnqueuerFunction({
  taskManager,
  actionTypeRegistry,
  preconfiguredActions
}) {
  return async function execute(unsecuredSavedObjectsClient, {
    id,
    params,
    spaceId,
    source,
    apiKey,
    executionId
  }) {
    const {
      action
    } = await getAction(unsecuredSavedObjectsClient, preconfiguredActions, id);
    validateCanActionBeUsed(action);
    const {
      actionTypeId
    } = action;

    if (!actionTypeRegistry.isActionExecutable(id, actionTypeId, {
      notifyUsage: true
    })) {
      actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    }

    const taskParams = {
      spaceId,
      taskParams: {
        actionId: id,
        // Saved Objects won't allow us to enforce unknown rather than any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: params,
        ...(apiKey ? {
          apiKey
        } : {}),
        ...(executionId ? {
          executionId
        } : {})
      },
      ...executionSourceAsSavedObjectReferences(source)
    };
    return taskManager.ephemeralRunNow({
      taskType: `actions:${action.actionTypeId}`,
      params: taskParams,
      state: {},
      scope: ['actions']
    });
  };
}

function validateCanActionBeUsed(action) {
  const {
    name,
    isMissingSecrets
  } = action;

  if (isMissingSecrets) {
    throw new Error(`Unable to execute action because no secrets are defined for the "${name}" connector.`);
  }
}

function executionSourceAsSavedObjectReferences(executionSource) {
  return (0, _lib.isSavedObjectExecutionSource)(executionSource) ? {
    references: [{
      name: 'source',
      ...executionSource.source
    }]
  } : {};
}

async function getAction(unsecuredSavedObjectsClient, preconfiguredActions, actionId) {
  const pcAction = preconfiguredActions.find(action => action.id === actionId);

  if (pcAction) {
    return {
      action: pcAction,
      isPreconfigured: true
    };
  }

  const {
    attributes
  } = await unsecuredSavedObjectsClient.get('action', actionId);
  return {
    action: attributes,
    isPreconfigured: false
  };
}