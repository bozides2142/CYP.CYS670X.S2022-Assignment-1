"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutocompleteService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class AutocompleteService {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "valueSuggestionsEnabled", true);
    this.initializerContext = initializerContext;
    initializerContext.config.create().subscribe(configUpdate => {
      this.valueSuggestionsEnabled = configUpdate.autocomplete.valueSuggestions.enabled;
    });
  }

  setup(core) {
    if (this.valueSuggestionsEnabled) (0, _routes.registerRoutes)(core, this.initializerContext.config.create());
  }

  start() {}

}

exports.AutocompleteService = AutocompleteService;