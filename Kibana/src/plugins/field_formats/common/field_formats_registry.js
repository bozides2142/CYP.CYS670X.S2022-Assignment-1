"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldFormatsRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _types = require("./types");

var _base_formatters = require("./constants/base_formatters");

var _field_format = require("./field_format");

var _ui_settings = require("../common/constants/ui_settings");

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line max-classes-per-file
class FieldFormatsRegistry {
  constructor() {
    (0, _defineProperty2.default)(this, "fieldFormats", new Map());
    (0, _defineProperty2.default)(this, "defaultMap", {});
    (0, _defineProperty2.default)(this, "metaParamsOptions", {});
    (0, _defineProperty2.default)(this, "getConfig", void 0);
    (0, _defineProperty2.default)(this, "deserialize", mapping => {
      if (!mapping) {
        return new (_field_format.FieldFormat.from(_lodash.identity))();
      }

      const {
        id,
        params = {}
      } = mapping;

      if (id) {
        const Format = this.getType(id);

        if (Format) {
          return new Format(params, this.getConfig);
        }
      }

      return new (_field_format.FieldFormat.from(_lodash.identity))();
    });
    (0, _defineProperty2.default)(this, "getDefaultConfig", (fieldType, esTypes) => {
      const type = this.getDefaultTypeName(fieldType, esTypes);
      return this.defaultMap && this.defaultMap[type] || {
        id: _types.FIELD_FORMAT_IDS.STRING,
        params: {}
      };
    });
    (0, _defineProperty2.default)(this, "getType", formatId => {
      const fieldFormat = this.fieldFormats.get(formatId);

      if (fieldFormat) {
        const decoratedFieldFormat = this.fieldFormatMetaParamsDecorator(fieldFormat);

        if (decoratedFieldFormat) {
          return decoratedFieldFormat;
        }
      }

      return undefined;
    });
    (0, _defineProperty2.default)(this, "getTypeWithoutMetaParams", formatId => {
      return this.fieldFormats.get(formatId);
    });
    (0, _defineProperty2.default)(this, "getDefaultType", (fieldType, esTypes) => {
      const config = this.getDefaultConfig(fieldType, esTypes);
      return this.getType(config.id);
    });
    (0, _defineProperty2.default)(this, "getTypeNameByEsTypes", esTypes => {
      if (!Array.isArray(esTypes)) {
        return undefined;
      }

      return esTypes.find(type => this.defaultMap[type] && this.defaultMap[type].es);
    });
    (0, _defineProperty2.default)(this, "getDefaultTypeName", (fieldType, esTypes) => {
      const esType = this.getTypeNameByEsTypes(esTypes);
      return esType || fieldType;
    });
    (0, _defineProperty2.default)(this, "getInstance", (formatId, params = {}) => {
      return this.getInstanceMemoized(formatId, params);
    });
    (0, _defineProperty2.default)(this, "getInstanceMemoized", (0, _lodash.memoize)((formatId, params = {}) => {
      const ConcreteFieldFormat = this.getType(formatId);

      if (!ConcreteFieldFormat) {
        throw new _errors.FieldFormatNotFoundError(`Field Format '${formatId}' not found!`, formatId);
      }

      return new ConcreteFieldFormat(params, this.getConfig);
    }, (formatId, params) => JSON.stringify({
      formatId,
      ...params
    })));
    (0, _defineProperty2.default)(this, "getDefaultInstancePlain", (fieldType, esTypes, params = {}) => {
      const conf = this.getDefaultConfig(fieldType, esTypes);
      const instanceParams = { ...conf.params,
        ...params
      };
      return this.getInstance(conf.id, instanceParams);
    });
    (0, _defineProperty2.default)(this, "getDefaultInstance", (fieldType, esTypes, params = {}) => {
      return this.getDefaultInstanceMemoized(fieldType, esTypes, params);
    });
    (0, _defineProperty2.default)(this, "getDefaultInstanceMemoized", (0, _lodash.memoize)(this.getDefaultInstancePlain, this.getDefaultInstanceCacheResolver));
    (0, _defineProperty2.default)(this, "fieldFormatMetaParamsDecorator", fieldFormat => {
      const getMetaParams = customParams => this.buildMetaParams(customParams);

      if (fieldFormat) {
        var _class;

        return _class = class DecoratedFieldFormat extends fieldFormat {
          constructor(params = {}, getConfig) {
            super(getMetaParams(params), getConfig);
          }

        }, (0, _defineProperty2.default)(_class, "id", fieldFormat.id), (0, _defineProperty2.default)(_class, "fieldType", fieldFormat.fieldType), _class;
      }

      return undefined;
    });
    (0, _defineProperty2.default)(this, "buildMetaParams", customParams => ({ ...this.metaParamsOptions,
      ...customParams
    }));
  }

  init(getConfig, metaParamsOptions = {}, defaultFieldConverters = _base_formatters.baseFormatters) {
    const defaultTypeMap = getConfig(_ui_settings.FORMATS_UI_SETTINGS.FORMAT_DEFAULT_TYPE_MAP);
    this.register(defaultFieldConverters);
    this.parseDefaultTypeMap(defaultTypeMap);
    this.getConfig = getConfig;
    this.metaParamsOptions = metaParamsOptions;
  }
  /**
   * Get the id of the default type for this field type
   * using the format:defaultTypeMap config map
   *
   * @param  {KBN_FIELD_TYPES} fieldType - the field type
   * @param  {ES_FIELD_TYPES[]} esTypes - Array of ES data types
   * @return {FieldType}
   */


  /**
   * Returns a cache key built by the given variables for caching in memoized
   * Where esType contains fieldType, fieldType is returned
   * -> kibana types have a higher priority in that case
   * -> would lead to failing tests that match e.g. date format with/without esTypes
   * https://lodash.com/docs#memoize
   *
   * @param  {KBN_FIELD_TYPES} fieldType
   * @param  {ES_FIELD_TYPES[] | undefined} esTypes
   * @return {String}
   */
  getDefaultInstanceCacheResolver(fieldType, esTypes) {
    // @ts-ignore
    return Array.isArray(esTypes) && esTypes.indexOf(fieldType) === -1 ? [fieldType, ...esTypes].join('-') : fieldType;
  }
  /**
   * Get filtered list of field formats by format type,
   * Skips hidden field formats
   *
   * @param  {KBN_FIELD_TYPES} fieldType
   * @return {FieldFormatInstanceType[]}
   */


  getByFieldType(fieldType) {
    return [...this.fieldFormats.values()].filter(format => format && !format.hidden && format.fieldType.indexOf(fieldType) !== -1).map(format => this.fieldFormatMetaParamsDecorator(format));
  }
  /**
   * Get the default fieldFormat instance for a field format.
   * It's a memoized function that builds and reads a cache
   *
   * @param  {KBN_FIELD_TYPES} fieldType
   * @param  {ES_FIELD_TYPES[]} esTypes
   * @param  {FieldFormatParams} params
   * @return {FieldFormat}
   */


  parseDefaultTypeMap(value) {
    var _this$getInstanceMemo, _this$getInstanceMemo2, _this$getDefaultInsta, _this$getDefaultInsta2;

    this.defaultMap = value;
    (_this$getInstanceMemo = (_this$getInstanceMemo2 = this.getInstanceMemoized.cache).clear) === null || _this$getInstanceMemo === void 0 ? void 0 : _this$getInstanceMemo.call(_this$getInstanceMemo2);
    (_this$getDefaultInsta = (_this$getDefaultInsta2 = this.getDefaultInstanceMemoized.cache).clear) === null || _this$getDefaultInsta === void 0 ? void 0 : _this$getDefaultInsta.call(_this$getDefaultInsta2);
  }

  register(fieldFormats) {
    fieldFormats.forEach(fieldFormat => {
      if (this.fieldFormats.has(fieldFormat.id)) throw new Error(`Failed to register field format with id "${fieldFormat.id}" as it already has been registered`);
      this.fieldFormats.set(fieldFormat.id, fieldFormat);
    });
  }
  /**
   * Checks if field format with id already registered
   * @param id
   */


  has(id) {
    return this.fieldFormats.has(id);
  }
  /**
   * FieldFormat decorator - provide a one way to add meta-params for all field formatters
   *
   * @private
   * @param  {FieldFormatInstanceType} fieldFormat - field format type
   * @return {FieldFormatInstanceType | undefined}
   */


}

exports.FieldFormatsRegistry = FieldFormatsRegistry;