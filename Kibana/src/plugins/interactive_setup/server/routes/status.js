"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineStatusRoute = defineStatusRoute;

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function defineStatusRoute({
  router,
  elasticsearch,
  preboot
}) {
  router.get({
    path: '/internal/interactive_setup/status',
    validate: false,
    options: {
      authRequired: false
    }
  }, async (context, request, response) => {
    // `connectionStatus$` is a `ReplaySubject` with a buffer size of 1 so `first()` operator will
    // always return the most recently emitted value. We can't use `connectionStatus$.toPromise()`
    // directly since the stream hasn't ended so it would never resolve.
    const connectionStatus = await elasticsearch.connectionStatus$.pipe((0, _operators.first)()).toPromise();
    return response.ok({
      body: {
        connectionStatus,
        isSetupOnHold: preboot.isSetupOnHold()
      }
    });
  });
}