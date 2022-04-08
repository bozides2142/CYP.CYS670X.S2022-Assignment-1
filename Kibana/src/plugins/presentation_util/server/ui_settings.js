"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUISettings = exports.SETTING_CATEGORY = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SETTING_CATEGORY = 'Presentation Labs';
exports.SETTING_CATEGORY = SETTING_CATEGORY;

const labsProjectSettings = _common.projectIDs.reduce((acc, id) => {
  const project = _common.projects[id];
  const {
    name,
    description,
    isActive: value
  } = project;
  acc[id] = {
    name,
    value,
    type: 'boolean',
    description,
    schema: _configSchema.schema.boolean(),
    requiresPageReload: true,
    category: [SETTING_CATEGORY]
  };
  return acc;
}, {});
/**
 * uiSettings definitions for Presentation Util.
 */


const getUISettings = () => ({ ...labsProjectSettings
});

exports.getUISettings = getUISettings;