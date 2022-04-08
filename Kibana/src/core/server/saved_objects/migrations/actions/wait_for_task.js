"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForTask = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const catchWaitForTaskCompletionTimeout = e => {
  var _e$body, _e$body$error, _e$body2, _e$body2$error;

  if (((_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : _e$body$error.type) === 'timeout_exception' || ((_e$body2 = e.body) === null || _e$body2 === void 0 ? void 0 : (_e$body2$error = _e$body2.error) === null || _e$body2$error === void 0 ? void 0 : _e$body2$error.type) === 'receive_timeout_transport_exception') {
    return Either.left({
      type: 'wait_for_task_completion_timeout',
      message: `[${e.body.error.type}] ${e.body.error.reason}`,
      error: e
    });
  } else {
    throw e;
  }
};
/** @internal */


/**
 * Blocks for up to 60s or until a task completes.
 *
 * TODO: delete completed tasks
 */
const waitForTask = ({
  client,
  taskId,
  timeout
}) => () => {
  return client.tasks.get({
    task_id: taskId,
    wait_for_completion: true,
    timeout
  }).then(res => {
    var _body$response$failur, _body$response;

    const body = res.body;
    const failures = (_body$response$failur = (_body$response = body.response) === null || _body$response === void 0 ? void 0 : _body$response.failures) !== null && _body$response$failur !== void 0 ? _body$response$failur : [];
    return Either.right({
      completed: body.completed,
      error: Option.fromNullable(body.error),
      failures: failures.length > 0 ? Option.some(failures) : Option.none,
      description: body.task.description
    });
  }).catch(catchWaitForTaskCompletionTimeout).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.waitForTask = waitForTask;