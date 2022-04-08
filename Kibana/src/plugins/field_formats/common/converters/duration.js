"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DurationFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _types = require("../types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ratioToSeconds = {
  picoseconds: 0.000000000001,
  nanoseconds: 0.000000001,
  microseconds: 0.000001
};
const HUMAN_FRIENDLY = 'humanize';
const HUMAN_FRIENDLY_PRECISE = 'humanizePrecise';
const DEFAULT_OUTPUT_PRECISION = 2;
const DEFAULT_INPUT_FORMAT = {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.seconds', {
    defaultMessage: 'Seconds'
  }),
  kind: 'seconds'
};
const inputFormats = [{
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.picoseconds', {
    defaultMessage: 'Picoseconds'
  }),
  kind: 'picoseconds'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.nanoseconds', {
    defaultMessage: 'Nanoseconds'
  }),
  kind: 'nanoseconds'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.microseconds', {
    defaultMessage: 'Microseconds'
  }),
  kind: 'microseconds'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.milliseconds', {
    defaultMessage: 'Milliseconds'
  }),
  kind: 'milliseconds'
}, { ...DEFAULT_INPUT_FORMAT
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.minutes', {
    defaultMessage: 'Minutes'
  }),
  kind: 'minutes'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.hours', {
    defaultMessage: 'Hours'
  }),
  kind: 'hours'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.days', {
    defaultMessage: 'Days'
  }),
  kind: 'days'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.weeks', {
    defaultMessage: 'Weeks'
  }),
  kind: 'weeks'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.months', {
    defaultMessage: 'Months'
  }),
  kind: 'months'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.inputFormats.years', {
    defaultMessage: 'Years'
  }),
  kind: 'years'
}];
const DEFAULT_OUTPUT_FORMAT = {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.humanize.approximate', {
    defaultMessage: 'Human-readable (approximate)'
  }),
  method: 'humanize'
};
const outputFormats = [{ ...DEFAULT_OUTPUT_FORMAT
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.humanize.precise', {
    defaultMessage: 'Human-readable (precise)'
  }),
  method: 'humanizePrecise'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asMilliseconds', {
    defaultMessage: 'Milliseconds'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asMilliseconds.short', {
    defaultMessage: 'ms'
  }),
  method: 'asMilliseconds'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asSeconds', {
    defaultMessage: 'Seconds'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asSeconds.short', {
    defaultMessage: 's'
  }),
  method: 'asSeconds'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asMinutes', {
    defaultMessage: 'Minutes'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asMinutes.short', {
    defaultMessage: 'min'
  }),
  method: 'asMinutes'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asHours', {
    defaultMessage: 'Hours'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asHours.short', {
    defaultMessage: 'h'
  }),
  method: 'asHours'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asDays', {
    defaultMessage: 'Days'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asDays.short', {
    defaultMessage: 'd'
  }),
  method: 'asDays'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asWeeks', {
    defaultMessage: 'Weeks'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asWeeks.short', {
    defaultMessage: 'w'
  }),
  method: 'asWeeks'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asMonths', {
    defaultMessage: 'Months'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asMonths.short', {
    defaultMessage: 'mon'
  }),
  method: 'asMonths'
}, {
  text: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asYears', {
    defaultMessage: 'Years'
  }),
  shortText: _i18n.i18n.translate('fieldFormats.duration.outputFormats.asYears.short', {
    defaultMessage: 'y'
  }),
  method: 'asYears'
}];

function parseInputAsDuration(val, inputFormat) {
  const ratio = ratioToSeconds[inputFormat] || 1;
  const kind = inputFormat in ratioToSeconds ? 'seconds' : inputFormat;
  return _moment.default.duration(val * ratio, kind);
}

function formatInputHumanPrecise(val, inputFormat, outputPrecision, useShortSuffix, includeSpace) {
  const ratio = ratioToSeconds[inputFormat] || 1;
  const kind = inputFormat in ratioToSeconds ? 'seconds' : inputFormat;

  const valueInDuration = _moment.default.duration(val * ratio, kind);

  return formatDuration(val, valueInDuration, inputFormat, outputPrecision, useShortSuffix, includeSpace);
}

class DurationFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "allowsNumericalAggregations", true);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      const inputFormat = this.param('inputFormat');
      const outputFormat = this.param('outputFormat');
      const outputPrecision = this.param('outputPrecision');
      const showSuffix = Boolean(this.param('showSuffix'));
      const useShortSuffix = Boolean(this.param('useShortSuffix'));
      const includeSpaceWithSuffix = this.param('includeSpaceWithSuffix');
      const includeSpace = includeSpaceWithSuffix ? ' ' : '';
      const human = this.isHuman();
      const humanPrecise = this.isHumanPrecise();
      const prefix = val < 0 && human ? _i18n.i18n.translate('fieldFormats.duration.negativeLabel', {
        defaultMessage: 'minus'
      }) + ' ' : '';
      const duration = parseInputAsDuration(val, inputFormat);
      const formatted = humanPrecise ? formatInputHumanPrecise(val, inputFormat, outputPrecision, useShortSuffix, includeSpace) : duration[outputFormat]();
      const precise = human || humanPrecise ? formatted : formatted.toFixed(outputPrecision);
      const type = outputFormats.find(({
        method
      }) => method === outputFormat);
      const unitText = useShortSuffix ? type === null || type === void 0 ? void 0 : type.shortText : type === null || type === void 0 ? void 0 : type.text.toLowerCase();
      const suffix = showSuffix && unitText && !human ? `${includeSpace}${unitText}` : '';
      return humanPrecise ? precise : prefix + precise + suffix;
    });
  }

  isHuman() {
    return this.param('outputFormat') === HUMAN_FRIENDLY;
  }

  isHumanPrecise() {
    return this.param('outputFormat') === HUMAN_FRIENDLY_PRECISE;
  }

  getParamDefaults() {
    return {
      inputFormat: DEFAULT_INPUT_FORMAT.kind,
      outputFormat: DEFAULT_OUTPUT_FORMAT.method,
      outputPrecision: DEFAULT_OUTPUT_PRECISION,
      includeSpaceWithSuffix: true
    };
  }

}

exports.DurationFormat = DurationFormat;
(0, _defineProperty2.default)(DurationFormat, "id", _types.FIELD_FORMAT_IDS.DURATION);
(0, _defineProperty2.default)(DurationFormat, "title", _i18n.i18n.translate('fieldFormats.duration.title', {
  defaultMessage: 'Duration'
}));
(0, _defineProperty2.default)(DurationFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.NUMBER);
(0, _defineProperty2.default)(DurationFormat, "inputFormats", inputFormats);
(0, _defineProperty2.default)(DurationFormat, "outputFormats", outputFormats);

function formatDuration(val, duration, inputFormat, outputPrecision, useShortSuffix, includeSpace) {
  // return nothing when the duration is falsy or not correctly parsed (P0D)
  if (!duration || !duration.isValid()) return;
  const units = [{
    unit: duration.years(),
    nextUnitRate: 12,
    method: 'asYears'
  }, {
    unit: duration.months(),
    nextUnitRate: 4,
    method: 'asMonths'
  }, {
    unit: duration.weeks(),
    nextUnitRate: 7,
    method: 'asWeeks'
  }, {
    unit: duration.days(),
    nextUnitRate: 24,
    method: 'asDays'
  }, {
    unit: duration.hours(),
    nextUnitRate: 60,
    method: 'asHours'
  }, {
    unit: duration.minutes(),
    nextUnitRate: 60,
    method: 'asMinutes'
  }, {
    unit: duration.seconds(),
    nextUnitRate: 1000,
    method: 'asSeconds'
  }, {
    unit: duration.milliseconds(),
    nextUnitRate: 1000,
    method: 'asMilliseconds'
  }];

  const getUnitText = method => {
    const type = outputFormats.find(({
      method: methodT
    }) => method === methodT);
    return useShortSuffix ? type === null || type === void 0 ? void 0 : type.shortText : type === null || type === void 0 ? void 0 : type.text.toLowerCase();
  };

  for (let i = 0; i < units.length; i++) {
    const unitValue = units[i].unit;

    if (unitValue >= 1) {
      const unitText = getUnitText(units[i].method);
      const value = Math.floor(unitValue);

      if (units !== null && units !== void 0 && units[i + 1]) {
        const decimalPointValue = Math.floor(units[i + 1].unit);
        return (value + decimalPointValue / units[i].nextUnitRate).toFixed(outputPrecision) + includeSpace + unitText;
      } else {
        return unitValue.toFixed(outputPrecision) + includeSpace + unitText;
      }
    }
  }

  const unitValue = units[units.length - 1].unit;
  const unitText = getUnitText(units[units.length - 1].method);
  return unitValue.toFixed(outputPrecision) + includeSpace + unitText;
}