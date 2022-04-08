"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strings = exports.shapeFunction = exports.errors = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../types");

var _constants = require("../constants");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const strings = {
  help: _i18n.i18n.translate('expressionShape.functions.shapeHelpText', {
    defaultMessage: 'Creates a shape.'
  }),
  args: {
    shape: _i18n.i18n.translate('expressionShape.functions.shape.args.shapeHelpText', {
      defaultMessage: 'Pick a shape.'
    }),
    border: _i18n.i18n.translate('expressionShape.functions.shape.args.borderHelpText', {
      defaultMessage: 'An {SVG} color for the border outlining the shape.',
      values: {
        SVG: _constants.SVG
      }
    }),
    borderWidth: _i18n.i18n.translate('expressionShape.functions.shape.args.borderWidthHelpText', {
      defaultMessage: 'The thickness of the border.'
    }),
    fill: _i18n.i18n.translate('expressionShape.functions.shape.args.fillHelpText', {
      defaultMessage: 'An {SVG} color to fill the shape.',
      values: {
        SVG: _constants.SVG
      }
    }),
    maintainAspect: _i18n.i18n.translate('expressionShape.functions.shape.args.maintainAspectHelpText', {
      defaultMessage: `Maintain the shape's original aspect ratio?`
    })
  }
};
exports.strings = strings;
const errors = {
  invalidShape: shape => new Error(_i18n.i18n.translate('expressionShape.functions.shape.invalidShapeErrorMessage', {
    defaultMessage: "Invalid value: '{shape}'. Such a shape doesn't exist.",
    values: {
      shape
    }
  }))
};
exports.errors = errors;

const shapeFunction = () => {
  const {
    help,
    args: argHelp
  } = strings;
  return {
    name: 'shape',
    aliases: [],
    inputTypes: ['null'],
    help,
    args: {
      shape: {
        types: ['string'],
        help: argHelp.shape,
        aliases: ['_'],
        default: 'square',
        options: Object.values(_types.Shape)
      },
      border: {
        types: ['string'],
        aliases: ['stroke'],
        help: argHelp.border
      },
      borderWidth: {
        types: ['number'],
        aliases: ['strokeWidth'],
        help: argHelp.borderWidth,
        default: 0
      },
      fill: {
        types: ['string'],
        help: argHelp.fill,
        default: 'black'
      },
      maintainAspect: {
        types: ['boolean'],
        help: argHelp.maintainAspect,
        default: false,
        options: [true, false]
      }
    },
    fn: (input, args) => {
      const avaliableShapes = (0, _lib.getAvailableShapes)();

      if (!avaliableShapes.includes(args.shape)) {
        throw errors.invalidShape(args.shape);
      }

      return {
        type: 'shape',
        ...args
      };
    }
  };
};

exports.shapeFunction = shapeFunction;