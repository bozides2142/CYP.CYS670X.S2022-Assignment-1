"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mathFn = exports.errors = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _tinymath = require("@kbn/tinymath");

var _expression_types = require("../../expression_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function pivotObjectArray(rows, columns) {
  const columnNames = columns || Object.keys(rows[0]);

  if (!columnNames.every(_lodash.isString)) {
    throw new Error('Columns should be an array of strings');
  }

  const columnValues = (0, _lodash.map)(columnNames, name => (0, _lodash.map)(rows, name));
  return (0, _lodash.zipObject)(columnNames, columnValues);
}

const errors = {
  emptyExpression: () => new Error(_i18n.i18n.translate('expressions.functions.math.emptyExpressionErrorMessage', {
    defaultMessage: 'Empty expression'
  })),
  tooManyResults: () => new Error(_i18n.i18n.translate('expressions.functions.math.tooManyResultsErrorMessage', {
    defaultMessage: 'Expressions must return a single number. Try wrapping your expression in {mean} or {sum}',
    values: {
      mean: 'mean()',
      sum: 'sum()'
    }
  })),
  executionFailed: () => new Error(_i18n.i18n.translate('expressions.functions.math.executionFailedErrorMessage', {
    defaultMessage: 'Failed to execute math expression. Check your column names'
  })),
  emptyDatatable: () => new Error(_i18n.i18n.translate('expressions.functions.math.emptyDatatableErrorMessage', {
    defaultMessage: 'Empty datatable'
  }))
};
exports.errors = errors;
const fallbackValue = {
  null: null,
  zero: 0,
  false: false
};

const mathFn = (input, args) => {
  const {
    expression,
    onError
  } = args;
  const onErrorValue = onError !== null && onError !== void 0 ? onError : 'throw';

  if (!expression || expression.trim() === '') {
    throw errors.emptyExpression();
  } // Use unique ID if available, otherwise fall back to names


  const mathContext = (0, _expression_types.isDatatable)(input) ? pivotObjectArray(input.rows, input.columns.map(col => col.id)) : {
    value: input
  };

  try {
    const result = (0, _tinymath.evaluate)(expression, mathContext);

    if (Array.isArray(result)) {
      if (result.length === 1) {
        return result[0];
      }

      throw errors.tooManyResults();
    }

    if (isNaN(result)) {
      // make TS happy
      if (onErrorValue !== 'throw' && onErrorValue in fallbackValue) {
        return fallbackValue[onErrorValue];
      }

      throw errors.executionFailed();
    }

    return result;
  } catch (e) {
    if (onErrorValue !== 'throw' && onErrorValue in fallbackValue) {
      return fallbackValue[onErrorValue];
    }

    if ((0, _expression_types.isDatatable)(input) && input.rows.length === 0) {
      throw errors.emptyDatatable();
    } else {
      throw e;
    }
  }
};

exports.mathFn = mathFn;