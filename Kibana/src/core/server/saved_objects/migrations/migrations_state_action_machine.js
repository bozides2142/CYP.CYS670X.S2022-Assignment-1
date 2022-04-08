"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrationStateActionMachine = migrationStateActionMachine;

var _elasticsearch = require("@elastic/elasticsearch");

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _elasticsearch2 = require("../../elasticsearch");

var _state_action_machine = require("./state_action_machine");

var _migrations_state_machine_cleanup = require("./migrations_state_machine_cleanup");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const logStateTransition = (logger, logMessagePrefix, prevState, currState, tookMs) => {
  if (currState.logs.length > prevState.logs.length) {
    currState.logs.slice(prevState.logs.length).forEach(({
      message,
      level
    }) => {
      switch (level) {
        case 'error':
          return logger.error(logMessagePrefix + message);

        case 'warning':
          return logger.warn(logMessagePrefix + message);

        case 'info':
          return logger.info(logMessagePrefix + message);

        default:
          throw new Error(`unexpected log level ${level}`);
      }
    });
  }

  logger.info(logMessagePrefix + `${prevState.controlState} -> ${currState.controlState}. took: ${tookMs}ms.`);
  logger.debug(logMessagePrefix + `${prevState.controlState} -> ${currState.controlState}. took: ${tookMs}ms.`, {
    kibana: {
      migrations: {
        state: currState,
        duration: tookMs
      }
    }
  });
};

const logActionResponse = (logger, logMessagePrefix, state, res) => {
  logger.debug(logMessagePrefix + `${state.controlState} RESPONSE`, res);
};
/**
 * A specialized migrations-specific state-action machine that:
 *  - logs messages in state.logs
 *  - logs state transitions
 *  - logs action responses
 *  - resolves if the final state is DONE
 *  - rejects if the final state is FATAL
 *  - catches and logs exceptions and then rejects with a migrations specific error
 */


async function migrationStateActionMachine({
  initialState,
  logger,
  next,
  model,
  client
}) {
  const startTime = Date.now(); // Since saved object index names usually start with a `.` and can be
  // configured by users to include several `.`'s we can't use a logger tag to
  // indicate which messages come from which index upgrade.

  const logMessagePrefix = `[${initialState.indexPrefix}] `;
  let prevTimestamp = startTime;
  let lastState;

  try {
    const finalState = await (0, _state_action_machine.stateActionMachine)(initialState, state => next(state), (state, res) => {
      var _outdatedDocuments, _transformedDocBatche;

      lastState = state;
      logActionResponse(logger, logMessagePrefix, state, res);
      const newState = model(state, res); // Redact the state to reduce the memory consumption and so that we
      // don't log sensitive information inside documents by only keeping
      // the _id's of documents

      const redactedNewState = { ...newState,
        ...{
          outdatedDocuments: ((_outdatedDocuments = newState.outdatedDocuments) !== null && _outdatedDocuments !== void 0 ? _outdatedDocuments : []).map(doc => ({
            _id: doc._id
          }))
        },
        ...{
          transformedDocBatches: ((_transformedDocBatche = newState.transformedDocBatches) !== null && _transformedDocBatche !== void 0 ? _transformedDocBatche : []).map(batches => batches.map(doc => ({
            _id: doc._id
          })))
        }
      };
      const now = Date.now();
      logStateTransition(logger, logMessagePrefix, state, redactedNewState, now - prevTimestamp);
      prevTimestamp = now;
      return newState;
    });
    const elapsedMs = Date.now() - startTime;

    if (finalState.controlState === 'DONE') {
      logger.info(logMessagePrefix + `Migration completed after ${Math.round(elapsedMs)}ms`);

      if (finalState.sourceIndex != null && Option.isSome(finalState.sourceIndex)) {
        return {
          status: 'migrated',
          destIndex: finalState.targetIndex,
          sourceIndex: finalState.sourceIndex.value,
          elapsedMs
        };
      } else {
        return {
          status: 'patched',
          destIndex: finalState.targetIndex,
          elapsedMs
        };
      }
    } else if (finalState.controlState === 'FATAL') {
      try {
        await (0, _migrations_state_machine_cleanup.cleanup)(client, finalState);
      } catch (e) {
        logger.warn('Failed to cleanup after migrations:', e.message);
      }

      return Promise.reject(new Error(`Unable to complete saved object migrations for the [${initialState.indexPrefix}] index: ` + finalState.reason));
    } else {
      throw new Error('Invalid terminating control state');
    }
  } catch (e) {
    try {
      await (0, _migrations_state_machine_cleanup.cleanup)(client, lastState);
    } catch (err) {
      logger.warn('Failed to cleanup after migrations:', err.message);
    }

    if (e instanceof _elasticsearch.errors.ResponseError) {
      // Log the failed request. This is very similar to the
      // elasticsearch-service's debug logs, but we log everything in single
      // line until we have sub-ms resolution in our cloud logs. Because this
      // is error level logs, we're also more careful and don't log the request
      // body since this can very likely have sensitive saved objects.
      const req = (0, _elasticsearch2.getRequestDebugMeta)(e.meta);
      const failedRequestMessage = `Unexpected Elasticsearch ResponseError: statusCode: ${req.statusCode}, method: ${req.method}, url: ${req.url} error: ${(0, _elasticsearch2.getErrorMessage)(e)},`;
      logger.error(logMessagePrefix + failedRequestMessage);
      throw new Error(`Unable to complete saved object migrations for the [${initialState.indexPrefix}] index. Please check the health of your Elasticsearch cluster and try again. ${failedRequestMessage}`);
    } else {
      logger.error(e);
      const newError = new Error(`Unable to complete saved object migrations for the [${initialState.indexPrefix}] index. ${e}`); // restore error stack to point to a source of the problem.

      newError.stack = `[${e.stack}]`;
      throw newError;
    }
  }
}