"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _custom = require("./converters/custom");

var _content_types = require("./content_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_CONTEXT_TYPE = _content_types.TEXT_CONTEXT_TYPE;

class FieldFormat {
  /**
   * @property {string} - Field Format Id
   * @static
   * @public
   */

  /**
   * Hidden field formats can only be accessed directly by id,
   * They won't appear in field format editor UI,
   * But they can be accessed and used from code internally.
   *
   * @property {boolean} -  Is this a hidden field format
   * @static
   * @public
   */

  /**
   * @property {string} -  Field Format Title
   * @static
   * @public
   */

  /**
   * @property {string} - Field Format Type
   * @private
   */

  /**
   * @property {FieldFormatConvert}
   * @private
   * have to remove the private because of
   * https://github.com/Microsoft/TypeScript/issues/17293
   */

  /**
   * @property {htmlConvert}
   * @protected
   * have to remove the protected because of
   * https://github.com/Microsoft/TypeScript/issues/17293
   */

  /**
   * @property {textConvert}
   * @protected
   * have to remove the protected because of
   * https://github.com/Microsoft/TypeScript/issues/17293
   */

  /**
   * @property {Function} - ref to child class
   * @private
   */
  constructor(_params = {}, getConfig) {
    (0, _defineProperty2.default)(this, "convertObject", void 0);
    (0, _defineProperty2.default)(this, "htmlConvert", void 0);
    (0, _defineProperty2.default)(this, "textConvert", void 0);
    (0, _defineProperty2.default)(this, "type", this.constructor);
    (0, _defineProperty2.default)(this, "allowsNumericalAggregations", void 0);
    (0, _defineProperty2.default)(this, "_params", void 0);
    (0, _defineProperty2.default)(this, "getConfig", void 0);
    this._params = _params;

    if (getConfig) {
      this.getConfig = getConfig;
    }
  }
  /**
   * Convert a raw value to a formatted string
   * @param  {unknown} value
   * @param  {string} [contentType=text] - optional content type, the only two contentTypes
   *                                currently supported are "html" and "text", which helps
   *                                formatters adjust to different contexts
   * @return {string} - the formatted string, which is assumed to be html, safe for
   *                    injecting into the DOM or a DOM attribute
   * @public
   */


  convert(value, contentType = DEFAULT_CONTEXT_TYPE, options) {
    const converter = this.getConverterFor(contentType);

    if (converter) {
      return converter.call(this, value, options);
    } // TODO: should be "return `${value}`;", but might be a breaking change


    return value;
  }
  /**
   * Get a convert function that is bound to a specific contentType
   * @param  {string} [contentType=text]
   * @return {function} - a bound converter function
   * @public
   */


  getConverterFor(contentType = DEFAULT_CONTEXT_TYPE) {
    if (!this.convertObject) {
      this.convertObject = this.setupContentType();
    }

    return this.convertObject[contentType];
  }
  /**
   * Get parameter defaults
   * @return {object} - parameter defaults
   * @public
   */


  getParamDefaults() {
    return {};
  }
  /**
   * Get the value of a param. This value may be a default value.
   *
   * @param  {string} name - the param name to fetch
   * @return {any} TODO: https://github.com/elastic/kibana/issues/108158
   * @public
   */


  param(name) {
    const val = (0, _lodash.get)(this._params, name);

    if (val || val === false || val === 0) {
      // truthy, false, or 0 are fine
      // '', NaN, null, undefined, etc are not
      return val;
    }

    return (0, _lodash.get)(this.getParamDefaults(), name);
  }
  /**
   * Get all of the params in a single object
   * @return {object}
   * @public
   */


  params() {
    return (0, _lodash.cloneDeep)((0, _lodash.defaults)({}, this._params, this.getParamDefaults()));
  }
  /**
   * Serialize this format to a simple POJO, with only the params
   * that are not default
   *
   * @return {object}
   * @public
   */


  toJSON() {
    const id = this.type.id;
    const defaultsParams = this.getParamDefaults() || {};
    const params = (0, _lodash.transform)(this._params, (uniqParams, val, param) => {
      if (param === 'parsedUrl') return;

      if (param && val !== (0, _lodash.get)(defaultsParams, param)) {
        uniqParams[param] = val;
      }
    }, {});
    return {
      id,
      params: (0, _lodash.size)(params) ? params : undefined
    };
  }

  static from(convertFn) {
    return (0, _custom.createCustomFieldFormat)(convertFn);
  }

  setupContentType() {
    return {
      text: (0, _content_types.textContentTypeSetup)(this, this.textConvert),
      html: (0, _content_types.htmlContentTypeSetup)(this, this.htmlConvert)
    };
  }

  static isInstanceOfFieldFormat(fieldFormat) {
    return Boolean(fieldFormat && typeof fieldFormat === 'object' && 'convert' in fieldFormat);
  }

}

exports.FieldFormat = FieldFormat;
(0, _defineProperty2.default)(FieldFormat, "id", void 0);
(0, _defineProperty2.default)(FieldFormat, "hidden", void 0);
(0, _defineProperty2.default)(FieldFormat, "title", void 0);
(0, _defineProperty2.default)(FieldFormat, "fieldType", void 0);