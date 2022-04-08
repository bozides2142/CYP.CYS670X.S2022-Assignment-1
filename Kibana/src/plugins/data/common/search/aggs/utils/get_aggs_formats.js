"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggsFormats = getAggsFormats;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../field_formats/common");

var _date_range = require("../buckets/lib/date_range");

var _ip_range = require("../buckets/lib/ip_range");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */

/**
 * Certain aggs have custom field formats that have dependency on aggs code.
 * This function creates such field formats types and then those are added to field formatters registry
 *
 * These formats can't be used from field format editor UI
 *
 * This function is internal to the data plugin, and only exists for use inside
 * the field formats service.
 *
 * @internal
 */
function getAggsFormats(getFieldFormat) {
  var _class, _class2, _class3, _class4, _class5;

  return [(_class = class AggsRangeFieldFormat extends _common.FieldFormat {
    constructor(...args) {
      super(...args);
      (0, _defineProperty2.default)(this, "textConvert", range => {
        const params = this._params;

        if (range.label) {
          return range.label;
        }

        const nestedFormatter = params;
        const format = getFieldFormat({
          id: nestedFormatter.id,
          params: nestedFormatter.params
        });
        const gte = '\u2265';
        const lt = '\u003c';
        let fromValue = format.convert(range.gte);
        let toValue = format.convert(range.lt); // In case of identity formatter and a specific flag, replace Infinity values by specific strings

        if (params.replaceInfinity && nestedFormatter.id == null) {
          const FROM_PLACEHOLDER = '\u2212\u221E';
          const TO_PLACEHOLDER = '+\u221E';
          fromValue = isFinite(range.gte) ? fromValue : FROM_PLACEHOLDER;
          toValue = isFinite(range.lt) ? toValue : TO_PLACEHOLDER;
        }

        if (params.template === 'arrow_right') {
          return _i18n.i18n.translate('data.aggTypes.buckets.ranges.rangesFormatMessageArrowRight', {
            defaultMessage: '{from} → {to}',
            values: {
              from: fromValue,
              to: toValue
            }
          });
        }

        return _i18n.i18n.translate('data.aggTypes.buckets.ranges.rangesFormatMessage', {
          defaultMessage: '{gte} {from} and {lt} {to}',
          values: {
            gte,
            from: fromValue,
            lt,
            to: toValue
          }
        });
      });
    }

  }, (0, _defineProperty2.default)(_class, "id", 'range'), (0, _defineProperty2.default)(_class, "hidden", true), _class), (_class2 = class AggsDateRangeFieldFormat extends _common.FieldFormat {
    constructor(...args) {
      super(...args);
      (0, _defineProperty2.default)(this, "textConvert", range => {
        const nestedFormatter = this._params;
        const format = getFieldFormat({
          id: nestedFormatter.id,
          params: nestedFormatter.params
        });
        return (0, _date_range.convertDateRangeToString)(range, format.convert.bind(format));
      });
    }

  }, (0, _defineProperty2.default)(_class2, "id", 'date_range'), (0, _defineProperty2.default)(_class2, "hidden", true), _class2), (_class3 = class AggsIpRangeFieldFormat extends _common.FieldFormat {
    constructor(...args) {
      super(...args);
      (0, _defineProperty2.default)(this, "textConvert", range => {
        const nestedFormatter = this._params;
        const format = getFieldFormat({
          id: nestedFormatter.id,
          params: nestedFormatter.params
        });
        return (0, _ip_range.convertIPRangeToString)(range, format.convert.bind(format));
      });
    }

  }, (0, _defineProperty2.default)(_class3, "id", 'ip_range'), (0, _defineProperty2.default)(_class3, "hidden", true), _class3), (_class4 = class AggsTermsFieldFormat extends _common.FieldFormat {
    constructor(...args) {
      super(...args);
      (0, _defineProperty2.default)(this, "convert", (val, type) => {
        const params = this._params;
        const format = getFieldFormat({
          id: params.id,
          params
        });

        if (val === '__other__') {
          return params.otherBucketLabel;
        }

        if (val === '__missing__') {
          return params.missingBucketLabel;
        }

        return format.convert(val, type);
      });
      (0, _defineProperty2.default)(this, "getConverterFor", type => val => this.convert(val, type));
    }

  }, (0, _defineProperty2.default)(_class4, "id", 'terms'), (0, _defineProperty2.default)(_class4, "hidden", true), _class4), (_class5 = class AggsMultiTermsFieldFormat extends _common.FieldFormat {
    constructor(...args) {
      super(...args);
      (0, _defineProperty2.default)(this, "formatCache", new Map());
      (0, _defineProperty2.default)(this, "convert", (val, type) => {
        var _params$separator;

        const params = this._params;
        const formats = params.paramsPerField.map(fieldParams => {
          const isCached = this.formatCache.has(fieldParams);
          const cachedFormat = this.formatCache.get(fieldParams) || getFieldFormat(fieldParams);

          if (!isCached) {
            this.formatCache.set(fieldParams, cachedFormat);
          }

          return cachedFormat;
        });

        if (String(val) === '__other__') {
          return params.otherBucketLabel;
        }

        const joinTemplate = (_params$separator = params.separator) !== null && _params$separator !== void 0 ? _params$separator : ' › ';
        return val.keys.map((valPart, i) => formats[i].convert(valPart, type)).join(joinTemplate);
      });
      (0, _defineProperty2.default)(this, "getConverterFor", type => val => this.convert(val, type));
    }

  }, (0, _defineProperty2.default)(_class5, "id", 'multi_terms'), (0, _defineProperty2.default)(_class5, "hidden", true), _class5)];
}