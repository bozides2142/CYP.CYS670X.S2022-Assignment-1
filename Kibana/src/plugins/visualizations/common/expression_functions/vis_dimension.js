"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visDimension = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getAccessorByIndex = (accessor, columns) => columns.length > accessor ? accessor : undefined;

const getAccessorById = (accessor, columns) => columns.find(c => c.id === accessor);

const visDimension = () => ({
  name: 'visdimension',
  help: _i18n.i18n.translate('visualizations.function.visDimension.help', {
    defaultMessage: 'Generates visConfig dimension object'
  }),
  type: 'vis_dimension',
  inputTypes: ['datatable'],
  args: {
    accessor: {
      types: ['string', 'number'],
      aliases: ['_'],
      help: _i18n.i18n.translate('visualizations.function.visDimension.accessor.help', {
        defaultMessage: 'Column in your dataset to use (either column index or column name)'
      })
    },
    format: {
      types: ['string'],
      default: 'string',
      help: _i18n.i18n.translate('visualizations.function.visDimension.format.help', {
        defaultMessage: 'Format'
      })
    },
    formatParams: {
      types: ['string'],
      default: '"{}"',
      help: _i18n.i18n.translate('visualizations.function.visDimension.formatParams.help', {
        defaultMessage: 'Format params'
      })
    }
  },
  fn: (input, args) => {
    const accessor = typeof args.accessor === 'number' ? getAccessorByIndex(args.accessor, input.columns) : getAccessorById(args.accessor, input.columns);

    if (accessor === undefined) {
      throw new Error(_i18n.i18n.translate('visualizations.function.visDimension.error.accessor', {
        defaultMessage: 'Column name or index provided is invalid'
      }));
    }

    return {
      type: 'vis_dimension',
      accessor,
      format: {
        id: args.format,
        params: JSON.parse(args.formatParams)
      }
    };
  }
});

exports.visDimension = visDimension;