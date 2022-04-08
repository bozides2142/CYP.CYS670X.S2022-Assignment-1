"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadMigrationsFactory = exports.templateWorkpadMigrationsFactory = exports.customElementMigrationsFactory = void 0;

var _expressions = require("./expressions");

var _workpad = require("./workpad");

var _common = require("../../../../../../src/plugins/kibana_utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const workpadMigrationsFactory = deps => (0, _common.mergeMigrationFunctionMaps)((0, _workpad.workpadMigrationsFactory)(deps), (0, _expressions.workpadExpressionsMigrationsFactory)(deps));

exports.workpadMigrationsFactory = workpadMigrationsFactory;

const templateWorkpadMigrationsFactory = deps => (0, _expressions.templateWorkpadExpressionsMigrationsFactory)(deps);

exports.templateWorkpadMigrationsFactory = templateWorkpadMigrationsFactory;

const customElementMigrationsFactory = deps => (0, _expressions.customElementExpressionsMigrationsFactory)(deps);

exports.customElementMigrationsFactory = customElementMigrationsFactory;