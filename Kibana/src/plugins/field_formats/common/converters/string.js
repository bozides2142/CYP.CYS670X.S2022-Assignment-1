"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _fieldTypes = require("@kbn/field-types");

var _utils = require("../utils");

var _field_format = require("../field_format");

var _types = require("../types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const emptyLabel = _i18n.i18n.translate('fieldFormats.string.emptyLabel', {
  defaultMessage: '(empty)'
});

const TRANSFORM_OPTIONS = [{
  kind: false,
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.none', {
    defaultMessage: '- None -'
  })
}, {
  kind: 'lower',
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.lower', {
    defaultMessage: 'Lower Case'
  })
}, {
  kind: 'upper',
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.upper', {
    defaultMessage: 'Upper Case'
  })
}, {
  kind: 'title',
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.title', {
    defaultMessage: 'Title Case'
  })
}, {
  kind: 'short',
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.short', {
    defaultMessage: 'Short Dots'
  })
}, {
  kind: 'base64',
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.base64', {
    defaultMessage: 'Base64 Decode'
  })
}, {
  kind: 'urlparam',
  text: _i18n.i18n.translate('fieldFormats.string.transformOptions.url', {
    defaultMessage: 'URL Param Decode'
  })
}];
const DEFAULT_TRANSFORM_OPTION = false;
/** @public */

class StringFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      if (val === '') {
        return emptyLabel;
      }

      switch (this.param('transform')) {
        case 'lower':
          return String(val).toLowerCase();

        case 'upper':
          return String(val).toUpperCase();

        case 'title':
          return this.toTitleCase(String(val));

        case 'short':
          return (0, _utils.asPrettyString)((0, _utils.shortenDottedString)(val));

        case 'base64':
          return this.base64Decode(String(val));

        case 'urlparam':
          return decodeURIComponent(String(val));

        default:
          return (0, _utils.asPrettyString)(val);
      }
    });
    (0, _defineProperty2.default)(this, "htmlConvert", (val, {
      hit,
      field
    } = {}) => {
      var _hit$highlight;

      if (val === '') {
        return `<span class="ffString__emptyValue">${emptyLabel}</span>`;
      }

      return hit !== null && hit !== void 0 && (_hit$highlight = hit.highlight) !== null && _hit$highlight !== void 0 && _hit$highlight[field === null || field === void 0 ? void 0 : field.name] ? (0, _utils.getHighlightHtml)((0, _lodash.escape)(val), hit.highlight[field.name]) : (0, _lodash.escape)(this.textConvert(val));
    });
  }

  getParamDefaults() {
    return {
      transform: DEFAULT_TRANSFORM_OPTION
    };
  }

  base64Decode(val) {
    try {
      if (window && window.atob) return window.atob(val); // referencing from `global` tricks webpack to not include `Buffer` polyfill into this bundle

      return global.Buffer.from(val, 'base64').toString('utf8');
    } catch (e) {
      return (0, _utils.asPrettyString)(val);
    }
  }

  toTitleCase(val) {
    return val.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}

exports.StringFormat = StringFormat;
(0, _defineProperty2.default)(StringFormat, "id", _types.FIELD_FORMAT_IDS.STRING);
(0, _defineProperty2.default)(StringFormat, "title", _i18n.i18n.translate('fieldFormats.string.title', {
  defaultMessage: 'String'
}));
(0, _defineProperty2.default)(StringFormat, "fieldType", [_fieldTypes.KBN_FIELD_TYPES.NUMBER, _fieldTypes.KBN_FIELD_TYPES.NUMBER_RANGE, _fieldTypes.KBN_FIELD_TYPES.BOOLEAN, _fieldTypes.KBN_FIELD_TYPES.DATE, _fieldTypes.KBN_FIELD_TYPES.DATE_RANGE, _fieldTypes.KBN_FIELD_TYPES.IP, _fieldTypes.KBN_FIELD_TYPES.IP_RANGE, _fieldTypes.KBN_FIELD_TYPES.ATTACHMENT, _fieldTypes.KBN_FIELD_TYPES.GEO_POINT, _fieldTypes.KBN_FIELD_TYPES.GEO_SHAPE, _fieldTypes.KBN_FIELD_TYPES.STRING, _fieldTypes.KBN_FIELD_TYPES.MURMUR3, _fieldTypes.KBN_FIELD_TYPES.UNKNOWN, _fieldTypes.KBN_FIELD_TYPES.CONFLICT]);
(0, _defineProperty2.default)(StringFormat, "transformOptions", TRANSFORM_OPTIONS);