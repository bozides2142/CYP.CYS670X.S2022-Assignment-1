"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.controlGroupContainerPersistableStateServiceFactory = void 0;

var _common = require("../../common");

var _control_group_persistable_state = require("../../common/control_group/control_group_persistable_state");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const controlGroupContainerPersistableStateServiceFactory = persistableStateService => {
  return {
    id: _common.CONTROL_GROUP_TYPE,
    extract: (0, _control_group_persistable_state.createControlGroupExtract)(persistableStateService),
    inject: (0, _control_group_persistable_state.createControlGroupInject)(persistableStateService)
  };
};

exports.controlGroupContainerPersistableStateServiceFactory = controlGroupContainerPersistableStateServiceFactory;