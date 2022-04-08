"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelEsRequestOnAbort = cancelEsRequestOnAbort;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function cancelEsRequestOnAbort(promise, request, controller) {
  const subscription = request.events.aborted$.subscribe(() => {
    controller.abort();
  });
  return promise.finally(() => subscription.unsubscribe());
}