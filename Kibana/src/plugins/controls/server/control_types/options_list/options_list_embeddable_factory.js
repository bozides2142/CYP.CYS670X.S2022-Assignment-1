"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsListPersistableStateServiceFactory = void 0;

var _common = require("../../../common");

var _options_list_persistable_state = require("../../../common/control_types/options_list/options_list_persistable_state");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const optionsListPersistableStateServiceFactory = () => {
  return {
    id: _common.OPTIONS_LIST_CONTROL,
    extract: (0, _options_list_persistable_state.createOptionsListExtract)(),
    inject: (0, _options_list_persistable_state.createOptionsListInject)()
  };
};

exports.optionsListPersistableStateServiceFactory = optionsListPersistableStateServiceFactory;