"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _lodash = require("lodash");

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _types = require("../types");

var _utils = require("../utils");

var _color_default = require("../constants/color_default");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
class ColorFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "htmlConvert", val => {
      const color = this.findColorRuleForVal(val);
      const displayVal = (0, _lodash.escape)((0, _utils.asPrettyString)(val));
      if (!color) return displayVal;
      return _server.default.renderToStaticMarkup( /*#__PURE__*/_react.default.createElement("span", {
        style: {
          color: color.text,
          backgroundColor: color.background
        },
        dangerouslySetInnerHTML: {
          __html: displayVal
        } // eslint-disable-line react/no-danger

      }));
    });
  }

  getParamDefaults() {
    return {
      fieldType: null,
      // populated by editor, see controller below
      colors: [(0, _lodash.cloneDeep)(_color_default.DEFAULT_CONVERTER_COLOR)]
    };
  }

  findColorRuleForVal(val) {
    switch (this.param('fieldType')) {
      case 'string':
        return (0, _lodash.findLast)(this.param('colors'), colorParam => {
          try {
            return new RegExp(colorParam.regex).test(val);
          } catch (e) {
            return false;
          }
        });

      case 'number':
        return (0, _lodash.findLast)(this.param('colors'), ({
          range
        }) => {
          if (!range) return;
          const [start, end] = range.split(':');
          return val >= Number(start) && val <= Number(end);
        });

      default:
        return null;
    }
  }

}

exports.ColorFormat = ColorFormat;
(0, _defineProperty2.default)(ColorFormat, "id", _types.FIELD_FORMAT_IDS.COLOR);
(0, _defineProperty2.default)(ColorFormat, "title", _i18n.i18n.translate('fieldFormats.color.title', {
  defaultMessage: 'Color'
}));
(0, _defineProperty2.default)(ColorFormat, "fieldType", [_fieldTypes.KBN_FIELD_TYPES.NUMBER, _fieldTypes.KBN_FIELD_TYPES.STRING]);