"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashboardPersistableStateServiceFactory = void 0;

var _dashboard_container_persistable_state = require("../../common/embeddable/dashboard_container_persistable_state");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dashboardPersistableStateServiceFactory = persistableStateService => {
  return {
    id: 'dashboard',
    extract: (0, _dashboard_container_persistable_state.createExtract)(persistableStateService),
    inject: (0, _dashboard_container_persistable_state.createInject)(persistableStateService)
  };
};

exports.dashboardPersistableStateServiceFactory = dashboardPersistableStateServiceFactory;