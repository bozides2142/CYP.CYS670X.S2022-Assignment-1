"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solutionNames = exports.projects = exports.projectIDs = exports.isProjectEnabledByStatus = exports.getProjectIDs = exports.environmentNames = exports.LABS_PROJECT_PREFIX = exports.DEFER_BELOW_FOLD = exports.DASHBOARD_CONTROLS = exports.BY_VALUE_EMBEDDABLE = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const LABS_PROJECT_PREFIX = 'labs:';
exports.LABS_PROJECT_PREFIX = LABS_PROJECT_PREFIX;
const DEFER_BELOW_FOLD = `${LABS_PROJECT_PREFIX}dashboard:deferBelowFold`;
exports.DEFER_BELOW_FOLD = DEFER_BELOW_FOLD;
const DASHBOARD_CONTROLS = `${LABS_PROJECT_PREFIX}dashboard:dashboardControls`;
exports.DASHBOARD_CONTROLS = DASHBOARD_CONTROLS;
const BY_VALUE_EMBEDDABLE = `${LABS_PROJECT_PREFIX}canvas:byValueEmbeddable`;
exports.BY_VALUE_EMBEDDABLE = BY_VALUE_EMBEDDABLE;
const projectIDs = [DEFER_BELOW_FOLD, DASHBOARD_CONTROLS, BY_VALUE_EMBEDDABLE];
exports.projectIDs = projectIDs;
const environmentNames = ['kibana', 'browser', 'session'];
exports.environmentNames = environmentNames;
const solutionNames = ['canvas', 'dashboard', 'presentation'];
/**
 * This is a list of active Labs Projects for the Presentation Team.  It is the "source of truth" for all projects
 * provided to users of our solutions in Kibana.
 */

exports.solutionNames = solutionNames;
const projects = {
  [DEFER_BELOW_FOLD]: {
    id: DEFER_BELOW_FOLD,
    isActive: false,
    isDisplayed: true,
    environments: ['kibana', 'browser', 'session'],
    name: _i18n.i18n.translate('presentationUtil.labs.enableDeferBelowFoldProjectName', {
      defaultMessage: 'Defer loading panels below "the fold"'
    }),
    description: _i18n.i18n.translate('presentationUtil.labs.enableDeferBelowFoldProjectDescription', {
      defaultMessage: 'Any panels below "the fold"-- the area hidden beyond the bottom of the window, accessed by scrolling-- will not be loaded immediately, but only when they enter the viewport'
    }),
    solutions: ['dashboard']
  },
  [DASHBOARD_CONTROLS]: {
    id: DASHBOARD_CONTROLS,
    isActive: false,
    isDisplayed: true,
    environments: ['kibana', 'browser', 'session'],
    name: _i18n.i18n.translate('presentationUtil.labs.enableDashboardControlsProjectName', {
      defaultMessage: 'Enable dashboard controls'
    }),
    description: _i18n.i18n.translate('presentationUtil.labs.enableDashboardControlsProjectDescription', {
      defaultMessage: 'Enables the controls system for dashboard, which allows dashboard authors to more easily build interactive elements for their users.'
    }),
    solutions: ['dashboard']
  },
  [BY_VALUE_EMBEDDABLE]: {
    id: BY_VALUE_EMBEDDABLE,
    isActive: true,
    isDisplayed: true,
    environments: ['kibana', 'browser', 'session'],
    name: _i18n.i18n.translate('presentationUtil.labs.enableByValueEmbeddableName', {
      defaultMessage: 'By-Value Embeddables'
    }),
    description: _i18n.i18n.translate('presentationUtil.labs.enableByValueEmbeddableDescription', {
      defaultMessage: 'Enables support for by-value embeddables in Canvas'
    }),
    solutions: ['canvas']
  }
};
exports.projects = projects;

const getProjectIDs = () => projectIDs;

exports.getProjectIDs = getProjectIDs;

const isProjectEnabledByStatus = (active, status) => {
  // If the project is enabled by default, then any false flag will flip the switch, and vice-versa.
  return active ? Object.values(status).every(value => value === true) : Object.values(status).some(value => value === true);
};

exports.isProjectEnabledByStatus = isProjectEnabledByStatus;