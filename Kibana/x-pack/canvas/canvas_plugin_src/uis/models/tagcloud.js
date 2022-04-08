"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagcloud = void 0;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");

var _resolved_arg = require("../../../public/lib/resolved_arg");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Tagcloud: strings
} = _i18n.ViewStrings;

const tagcloud = () => ({
  name: 'tagcloud',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'metric',
    displayName: strings.getMetricColumnDisplayName(),
    help: strings.getMetricColumnHelp(),
    argType: 'vis_dimension'
  }, {
    name: 'bucket',
    displayName: strings.getBucketColumnDisplayName(),
    help: strings.getBucketColumnHelp(),
    argType: 'vis_dimension'
  }, {
    name: 'palette',
    argType: 'palette'
  }, {
    name: 'orientation',
    displayName: strings.getOrientationColumnDisplayName(),
    help: strings.getOrientationColumnHelp(),
    argType: 'select',
    default: 'single',
    options: {
      choices: [{
        value: 'single',
        name: strings.getOrientationSingle()
      }, {
        value: 'right angled',
        name: strings.getOrientationRightAngled()
      }, {
        value: 'multiple',
        name: strings.getOrientationMultiple()
      }]
    }
  }, {
    name: 'scale',
    displayName: strings.getScaleColumnDisplayName(),
    help: strings.getScaleColumnHelp(),
    argType: 'select',
    default: 'linear',
    options: {
      choices: [{
        value: 'linear',
        name: strings.getScaleLinear()
      }, {
        value: 'log',
        name: strings.getScaleLog()
      }, {
        value: 'square root',
        name: strings.getScaleSquareRoot()
      }]
    }
  }, {
    name: 'minFontSize',
    displayName: strings.getMinFontHeightColumnDisplayName(),
    help: strings.getMinFontHeightColumnHelp(),
    argType: 'number',
    default: 18
  }, {
    name: 'maxFontSize',
    displayName: strings.getMaxFontHeightColumnDisplayName(),
    help: strings.getMaxFontHeightColumnHelp(),
    argType: 'number',
    default: 72
  }, {
    name: 'showLabel',
    displayName: strings.getShowLabelColumnDisplayName(),
    help: strings.getShowLabelColumnHelp(),
    argType: 'toggle',
    default: true
  }],

  resolve({
    context
  }) {
    if ((0, _resolved_arg.getState)(context) !== 'ready') {
      return {
        columns: []
      };
    }

    return {
      columns: (0, _lodash.get)((0, _resolved_arg.getValue)(context), 'columns', [])
    };
  }

});

exports.tagcloud = tagcloud;