"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asDuration = asDuration;
exports.asMillisecondDuration = asMillisecondDuration;
exports.asTransactionRate = asTransactionRate;
exports.toMicroseconds = exports.getDurationFormatter = exports.formatDurationFromTimeUnitChar = void 0;

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _i18n2 = require("../../i18n");

var _formatters = require("./formatters");

var _is_finite_number = require("../is_finite_number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getUnitLabelAndConvertedValue(unitKey, value) {
  switch (unitKey) {
    case 'hours':
      {
        return {
          unitLabel: _i18n.i18n.translate('xpack.observability.formatters.hoursTimeUnitLabel', {
            defaultMessage: 'h'
          }),
          unitLabelExtended: _i18n.i18n.translate('xpack.observability.formatters.hoursTimeUnitLabelExtended', {
            defaultMessage: 'hours'
          }),
          convertedValue: (0, _formatters.asDecimalOrInteger)(_moment.default.duration(value / 1000).asHours())
        };
      }

    case 'minutes':
      {
        return {
          unitLabel: _i18n.i18n.translate('xpack.observability.formatters.minutesTimeUnitLabel', {
            defaultMessage: 'min'
          }),
          unitLabelExtended: _i18n.i18n.translate('xpack.observability.formatters.minutesTimeUnitLabelExtended', {
            defaultMessage: 'minutes'
          }),
          convertedValue: (0, _formatters.asDecimalOrInteger)(_moment.default.duration(value / 1000).asMinutes())
        };
      }

    case 'seconds':
      {
        return {
          unitLabel: _i18n.i18n.translate('xpack.observability.formatters.secondsTimeUnitLabel', {
            defaultMessage: 's'
          }),
          unitLabelExtended: _i18n.i18n.translate('xpack.observability.formatters.secondsTimeUnitLabelExtended', {
            defaultMessage: 'seconds'
          }),
          convertedValue: (0, _formatters.asDecimalOrInteger)(_moment.default.duration(value / 1000).asSeconds())
        };
      }

    case 'milliseconds':
      {
        return {
          unitLabel: _i18n.i18n.translate('xpack.observability.formatters.millisTimeUnitLabel', {
            defaultMessage: 'ms'
          }),
          unitLabelExtended: _i18n.i18n.translate('xpack.observability.formatters.millisTimeUnitLabelExtended', {
            defaultMessage: 'milliseconds'
          }),
          convertedValue: (0, _formatters.asDecimalOrInteger)(_moment.default.duration(value / 1000).asMilliseconds())
        };
      }

    case 'microseconds':
      {
        return {
          unitLabel: _i18n.i18n.translate('xpack.observability.formatters.microsTimeUnitLabel', {
            defaultMessage: 'μs'
          }),
          unitLabelExtended: _i18n.i18n.translate('xpack.observability.formatters.microsTimeUnitLabelExtended', {
            defaultMessage: 'microseconds'
          }),
          convertedValue: (0, _formatters.asInteger)(value)
        };
      }
  }
}
/**
 * Converts a microseconds value into the unit defined.
 */


function convertTo({
  unit,
  microseconds,
  defaultValue = _i18n2.NOT_AVAILABLE_LABEL,
  extended
}) {
  if (!(0, _is_finite_number.isFiniteNumber)(microseconds)) {
    return {
      value: defaultValue,
      formatted: defaultValue
    };
  }

  const {
    convertedValue,
    unitLabel,
    unitLabelExtended
  } = getUnitLabelAndConvertedValue(unit, microseconds);
  const label = extended ? unitLabelExtended : unitLabel;
  return {
    value: convertedValue,
    unit: unitLabel,
    formatted: `${convertedValue} ${label}`
  };
}

const toMicroseconds = (value, timeUnit) => _moment.default.duration(value, timeUnit).asMilliseconds() * 1000;

exports.toMicroseconds = toMicroseconds;

function getDurationUnitKey(max) {
  if (max > toMicroseconds(10, 'hours')) {
    return 'hours';
  }

  if (max > toMicroseconds(10, 'minutes')) {
    return 'minutes';
  }

  if (max > toMicroseconds(10, 'seconds')) {
    return 'seconds';
  }

  if (max > toMicroseconds(1, 'milliseconds')) {
    return 'milliseconds';
  }

  return 'microseconds';
}

const getDurationFormatter = (0, _lodash.memoize)(max => {
  const unit = getDurationUnitKey(max);
  return (value, {
    defaultValue,
    extended
  } = {}) => {
    return convertTo({
      unit,
      microseconds: value,
      defaultValue,
      extended
    });
  };
});
exports.getDurationFormatter = getDurationFormatter;

function asTransactionRate(value) {
  if (!(0, _is_finite_number.isFiniteNumber)(value)) {
    return _i18n2.NOT_AVAILABLE_LABEL;
  }

  let displayedValue;

  if (value === 0) {
    displayedValue = '0';
  } else if (value <= 0.1) {
    displayedValue = '< 0.1';
  } else {
    displayedValue = (0, _formatters.asDecimal)(value);
  }

  return _i18n.i18n.translate('xpack.observability.transactionRateLabel', {
    defaultMessage: `{value} tpm`,
    values: {
      value: displayedValue
    }
  });
}
/**
 * Converts value and returns it formatted - 00 unit
 */


function asDuration(value, {
  defaultValue = _i18n2.NOT_AVAILABLE_LABEL,
  extended
} = {}) {
  if (!(0, _is_finite_number.isFiniteNumber)(value)) {
    return defaultValue;
  }

  const formatter = getDurationFormatter(value);
  return formatter(value, {
    defaultValue,
    extended
  }).formatted;
}
/**
 * Convert a microsecond value to decimal milliseconds. Normally we use
 * `asDuration`, but this is used in places like tables where we always want
 * the same units.
 */


function asMillisecondDuration(value) {
  return convertTo({
    unit: 'milliseconds',
    microseconds: value
  }).formatted;
}

const formatDurationFromTimeUnitChar = (time, unit) => {
  const sForPlural = time !== 0 && time > 1 ? 's' : ''; // Negative values are not taken into account

  switch (unit) {
    case 's':
      return `${time} sec${sForPlural}`;

    case 'm':
      return `${time} min${sForPlural}`;

    case 'h':
      return `${time} hr${sForPlural}`;

    case 'd':
      return `${time} day${sForPlural}`;

    default:
      return `${time} ${unit}`;
  }
};

exports.formatDurationFromTimeUnitChar = formatDurationFromTimeUnitChar;