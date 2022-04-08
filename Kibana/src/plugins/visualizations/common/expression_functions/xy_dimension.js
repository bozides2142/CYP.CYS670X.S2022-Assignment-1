"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xyDimension = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const xyDimension = () => ({
  name: 'xydimension',
  help: _i18n.i18n.translate('visualizations.function.xydimension.help', {
    defaultMessage: 'Generates xy dimension object'
  }),
  type: 'xy_dimension',
  args: {
    visDimension: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('visualizations.function.xyDimension.visDimension.help', {
        defaultMessage: 'Dimension object config'
      }),
      required: true
    },
    label: {
      types: ['string'],
      help: _i18n.i18n.translate('visualizations.function.xyDimension.label.help', {
        defaultMessage: 'Label'
      })
    },
    aggType: {
      types: ['string'],
      help: _i18n.i18n.translate('visualizations.function.xyDimension.aggType.help', {
        defaultMessage: 'Aggregation type'
      })
    },
    params: {
      types: ['string'],
      default: '"{}"',
      help: _i18n.i18n.translate('visualizations.function.xyDimension.params.help', {
        defaultMessage: 'Params'
      })
    }
  },
  fn: (context, args) => {
    return {
      type: 'xy_dimension',
      label: args.label,
      aggType: args.aggType,
      params: JSON.parse(args.params),
      accessor: args.visDimension.accessor,
      format: args.visDimension.format
    };
  }
});

exports.xyDimension = xyDimension;