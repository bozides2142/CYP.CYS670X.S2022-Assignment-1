"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadMigrationsFactory = void 0;

var _remove_attributes_id = require("./remove_attributes_id");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const workpadMigrationsFactory = deps => ({
  '7.0.0': _remove_attributes_id.removeAttributesId
});

exports.workpadMigrationsFactory = workpadMigrationsFactory;