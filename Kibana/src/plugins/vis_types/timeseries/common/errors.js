"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterCannotBeAppliedErrorMessage = exports.ValidateIntervalError = exports.UIError = exports.TimeFieldNotSpecifiedError = exports.PivotNotSelectedForTableError = exports.FilterCannotBeAppliedError = exports.FieldNotFoundError = exports.AggNotSupportedError = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
class UIError extends Error {
  constructor(message) {
    super(message);
  }

  get name() {
    return this.constructor.name;
  }

  get errBody() {
    return this.message;
  }

}

exports.UIError = UIError;

class FieldNotFoundError extends UIError {
  constructor(name) {
    super(_i18n.i18n.translate('visTypeTimeseries.errors.fieldNotFound', {
      defaultMessage: `Field "{field}" not found`,
      values: {
        field: name
      }
    }));
  }

}

exports.FieldNotFoundError = FieldNotFoundError;

class ValidateIntervalError extends UIError {
  constructor() {
    super(_i18n.i18n.translate('visTypeTimeseries.errors.maxBucketsExceededErrorMessage', {
      defaultMessage: 'Your query attempted to fetch too much data. Reducing the time range or changing the interval used usually fixes the issue.'
    }));
  }

}

exports.ValidateIntervalError = ValidateIntervalError;

class AggNotSupportedError extends UIError {
  constructor(metricType) {
    super(_i18n.i18n.translate('visTypeTimeseries.wrongAggregationErrorMessage', {
      defaultMessage: 'The {metricType} aggregation is not supported for existing panel configuration.',
      values: {
        metricType
      }
    }));
  }

}

exports.AggNotSupportedError = AggNotSupportedError;

class TimeFieldNotSpecifiedError extends UIError {
  constructor() {
    super(_i18n.i18n.translate('visTypeTimeseries.errors.timeFieldNotSpecifiedError', {
      defaultMessage: 'Time field is required to visualize the data'
    }));
  }

}

exports.TimeFieldNotSpecifiedError = TimeFieldNotSpecifiedError;

const filterCannotBeAppliedErrorMessage = _i18n.i18n.translate('visTypeTimeseries.filterCannotBeAppliedError', {
  defaultMessage: 'The "filter" cannot be applied with this configuration'
});

exports.filterCannotBeAppliedErrorMessage = filterCannotBeAppliedErrorMessage;

class FilterCannotBeAppliedError extends UIError {
  constructor() {
    super(filterCannotBeAppliedErrorMessage);
  }

}

exports.FilterCannotBeAppliedError = FilterCannotBeAppliedError;

class PivotNotSelectedForTableError extends UIError {
  constructor() {
    super(_i18n.i18n.translate('visTypeTimeseries.table.noResultsAvailableWithDescriptionMessage', {
      defaultMessage: 'No results available. You must choose a group by field for this visualization.'
    }));
  }

}

exports.PivotNotSelectedForTableError = PivotNotSelectedForTableError;