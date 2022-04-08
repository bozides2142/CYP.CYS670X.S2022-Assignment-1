"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForPickupUpdatedMappingsTask = void 0;

var TaskEither = _interopRequireWildcard(require("fp-ts/lib/TaskEither"));

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _function = require("fp-ts/lib/function");

var _wait_for_task = require("./wait_for_task");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const waitForPickupUpdatedMappingsTask = (0, _function.flow)(_wait_for_task.waitForTask, TaskEither.chain(res => {
  // We don't catch or type failures/errors because they should never
  // occur in our migration algorithm and we don't have any business logic
  // for dealing with it. If something happens we'll just crash and try
  // again.
  if (Option.isSome(res.failures)) {
    throw new Error('pickupUpdatedMappings task failed with the following failures:\n' + JSON.stringify(res.failures.value));
  } else if (Option.isSome(res.error)) {
    throw new Error('pickupUpdatedMappings task failed with the following error:\n' + JSON.stringify(res.error.value));
  } else {
    return TaskEither.right('pickup_updated_mappings_succeeded');
  }
}));
exports.waitForPickupUpdatedMappingsTask = waitForPickupUpdatedMappingsTask;