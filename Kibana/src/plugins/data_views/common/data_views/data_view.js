"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPattern = exports.DataView = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireWildcard(require("lodash"));

var _fieldTypes = require("@kbn/field-types");

var _common = require("../../../kibana_utils/common");

var _fields = require("../fields");

var _flatten_hit = require("./flatten_hit");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
class DataView {
  /**
   * Only used by rollup indices, used by rollup specific endpoint to load field list
   */

  /**
   * Type is used to identify rollup index patterns
   */

  /**
   * @deprecated Use `flattenHit` utility method exported from data plugin instead.
   */

  /**
   * SavedObject version
   */

  /**
   * prevents errors when index pattern exists before indices
   */
  constructor({
    spec = {},
    fieldFormats,
    shortDotsEnable = false,
    metaFields = []
  }) {
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "title", '');
    (0, _defineProperty2.default)(this, "fieldFormatMap", void 0);
    (0, _defineProperty2.default)(this, "typeMeta", void 0);
    (0, _defineProperty2.default)(this, "fields", void 0);
    (0, _defineProperty2.default)(this, "timeFieldName", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "flattenHit", void 0);
    (0, _defineProperty2.default)(this, "metaFields", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    (0, _defineProperty2.default)(this, "sourceFilters", void 0);
    (0, _defineProperty2.default)(this, "originalSavedObjectBody", {});
    (0, _defineProperty2.default)(this, "shortDotsEnable", false);
    (0, _defineProperty2.default)(this, "fieldFormats", void 0);
    (0, _defineProperty2.default)(this, "fieldAttrs", void 0);
    (0, _defineProperty2.default)(this, "runtimeFieldMap", void 0);
    (0, _defineProperty2.default)(this, "allowNoIndex", false);
    (0, _defineProperty2.default)(this, "getOriginalSavedObjectBody", () => ({ ...this.originalSavedObjectBody
    }));
    (0, _defineProperty2.default)(this, "resetOriginalSavedObjectBody", () => {
      this.originalSavedObjectBody = this.getAsSavedObjectBody();
    });
    (0, _defineProperty2.default)(this, "getFieldAttrs", () => {
      const newFieldAttrs = { ...this.fieldAttrs
      };
      this.fields.forEach(field => {
        const attrs = {};
        let hasAttr = false;

        if (field.customLabel) {
          attrs.customLabel = field.customLabel;
          hasAttr = true;
        }

        if (field.count) {
          attrs.count = field.count;
          hasAttr = true;
        }

        if (hasAttr) {
          newFieldAttrs[field.name] = attrs;
        } else {
          delete newFieldAttrs[field.name];
        }
      });
      return newFieldAttrs;
    });
    (0, _defineProperty2.default)(this, "setFieldFormat", (fieldName, format) => {
      this.fieldFormatMap[fieldName] = format;
    });
    (0, _defineProperty2.default)(this, "deleteFieldFormat", fieldName => {
      delete this.fieldFormatMap[fieldName];
    });
    // set dependencies
    this.fieldFormats = fieldFormats; // set config

    this.shortDotsEnable = shortDotsEnable;
    this.metaFields = metaFields; // initialize functionality

    this.fields = (0, _fields.fieldList)([], this.shortDotsEnable);
    this.flattenHit = (0, _flatten_hit.flattenHitWrapper)(this, metaFields); // set values

    this.id = spec.id;
    this.fieldFormatMap = spec.fieldFormats || {};
    this.version = spec.version;
    this.title = spec.title || '';
    this.timeFieldName = spec.timeFieldName;
    this.sourceFilters = spec.sourceFilters;
    this.fields.replaceAll(Object.values(spec.fields || {}));
    this.type = spec.type;
    this.typeMeta = spec.typeMeta;
    this.fieldAttrs = spec.fieldAttrs || {};
    this.allowNoIndex = spec.allowNoIndex || false;
    this.runtimeFieldMap = spec.runtimeFieldMap || {};
  }
  /**
   * Get last saved saved object fields
   */


  getComputedFields() {
    const scriptFields = {};

    if (!this.fields) {
      return {
        storedFields: ['*'],
        scriptFields,
        docvalueFields: [],
        runtimeFields: {}
      };
    } // Date value returned in "_source" could be in any number of formats
    // Use a docvalue for each date field to ensure standardized formats when working with date fields
    // dataView.flattenHit will override "_source" values when the same field is also defined in "fields"


    const docvalueFields = (0, _lodash.reject)(this.fields.getByType('date'), 'scripted').map(dateField => {
      return {
        field: dateField.name,
        format: dateField.esTypes && dateField.esTypes.indexOf('date_nanos') !== -1 ? 'strict_date_time' : 'date_time'
      };
    });
    (0, _lodash.each)(this.getScriptedFields(), function (field) {
      scriptFields[field.name] = {
        script: {
          source: field.script,
          lang: field.lang
        }
      };
    });
    return {
      storedFields: ['*'],
      scriptFields,
      docvalueFields,
      runtimeFields: this.runtimeFieldMap
    };
  }
  /**
   * Create static representation of index pattern
   */


  toSpec() {
    return {
      id: this.id,
      version: this.version,
      title: this.title,
      timeFieldName: this.timeFieldName,
      sourceFilters: this.sourceFilters,
      fields: this.fields.toSpec({
        getFormatterForField: this.getFormatterForField.bind(this)
      }),
      typeMeta: this.typeMeta,
      type: this.type,
      fieldFormats: this.fieldFormatMap,
      runtimeFieldMap: this.runtimeFieldMap,
      fieldAttrs: this.fieldAttrs,
      allowNoIndex: this.allowNoIndex
    };
  }
  /**
   * Get the source filtering configuration for that index.
   */


  getSourceFiltering() {
    return {
      excludes: this.sourceFilters && this.sourceFilters.map(filter => filter.value) || []
    };
  }
  /**
   * Remove scripted field from field list
   * @param fieldName
   * @deprecated use runtime field instead
   */


  removeScriptedField(fieldName) {
    const field = this.fields.getByName(fieldName);

    if (field) {
      this.fields.remove(field);
    }
  }
  /**
   *
   * @deprecated Will be removed when scripted fields are removed
   */


  getNonScriptedFields() {
    return [...this.fields.getAll().filter(field => !field.scripted)];
  }
  /**
   *
   * @deprecated use runtime field instead
   */


  getScriptedFields() {
    return [...this.fields.getAll().filter(field => field.scripted)];
  }

  isTimeBased() {
    return !!this.timeFieldName && (!this.fields || !!this.getTimeField());
  }

  isTimeNanosBased() {
    const timeField = this.getTimeField();
    return !!(timeField && timeField.esTypes && timeField.esTypes.indexOf('date_nanos') !== -1);
  }

  getTimeField() {
    if (!this.timeFieldName || !this.fields || !this.fields.getByName) return undefined;
    return this.fields.getByName(this.timeFieldName);
  }

  getFieldByName(name) {
    if (!this.fields || !this.fields.getByName) return undefined;
    return this.fields.getByName(name);
  }

  getAggregationRestrictions() {
    var _this$typeMeta;

    return (_this$typeMeta = this.typeMeta) === null || _this$typeMeta === void 0 ? void 0 : _this$typeMeta.aggs;
  }
  /**
   * Returns index pattern as saved object body for saving
   */


  getAsSavedObjectBody() {
    var _this$fields$filter, _this$fields, _this$typeMeta2;

    const fieldFormatMap = _lodash.default.isEmpty(this.fieldFormatMap) ? undefined : JSON.stringify(this.fieldFormatMap);
    const fieldAttrs = this.getFieldAttrs();
    const runtimeFieldMap = this.runtimeFieldMap;
    return {
      fieldAttrs: fieldAttrs ? JSON.stringify(fieldAttrs) : undefined,
      title: this.title,
      timeFieldName: this.timeFieldName,
      sourceFilters: this.sourceFilters ? JSON.stringify(this.sourceFilters) : undefined,
      fields: JSON.stringify((_this$fields$filter = (_this$fields = this.fields) === null || _this$fields === void 0 ? void 0 : _this$fields.filter(field => field.scripted)) !== null && _this$fields$filter !== void 0 ? _this$fields$filter : []),
      fieldFormatMap,
      type: this.type,
      typeMeta: JSON.stringify((_this$typeMeta2 = this.typeMeta) !== null && _this$typeMeta2 !== void 0 ? _this$typeMeta2 : {}),
      allowNoIndex: this.allowNoIndex ? this.allowNoIndex : undefined,
      runtimeFieldMap: runtimeFieldMap ? JSON.stringify(runtimeFieldMap) : undefined
    };
  }
  /**
   * Provide a field, get its formatter
   * @param field
   */


  getFormatterForField(field) {
    const fieldFormat = this.getFormatterForFieldNoDefault(field.name);

    if (fieldFormat) {
      return fieldFormat;
    }

    return this.fieldFormats.getDefaultInstance(field.type, field.esTypes);
  }
  /**
   * Add a runtime field - Appended to existing mapped field or a new field is
   * created as appropriate
   * @param name Field name
   * @param runtimeField Runtime field definition
   */


  addRuntimeField(name, runtimeField) {
    const existingField = this.getFieldByName(name);

    if (name.includes('*')) {
      throw new _common.CharacterNotAllowedInField('*', name);
    }

    if (existingField) {
      existingField.runtimeField = runtimeField;
    } else {
      this.fields.add({
        name,
        runtimeField,
        type: (0, _fieldTypes.castEsToKbnFieldTypeName)(runtimeField.type),
        aggregatable: true,
        searchable: true,
        count: 0,
        readFromDocValues: false
      });
    }

    this.runtimeFieldMap[name] = runtimeField;
  }
  /**
   * Checks if runtime field exists
   * @param name
   */


  hasRuntimeField(name) {
    return !!this.runtimeFieldMap[name];
  }
  /**
   * Returns runtime field if exists
   * @param name
   */


  getRuntimeField(name) {
    var _this$runtimeFieldMap;

    return (_this$runtimeFieldMap = this.runtimeFieldMap[name]) !== null && _this$runtimeFieldMap !== void 0 ? _this$runtimeFieldMap : null;
  }
  /**
   * Replaces all existing runtime fields with new fields
   * @param newFields
   */


  replaceAllRuntimeFields(newFields) {
    const oldRuntimeFieldNames = Object.keys(this.runtimeFieldMap);
    oldRuntimeFieldNames.forEach(name => {
      this.removeRuntimeField(name);
    });
    Object.entries(newFields).forEach(([name, field]) => {
      this.addRuntimeField(name, field);
    });
  }
  /**
   * Remove a runtime field - removed from mapped field or removed unmapped
   * field as appropriate. Doesn't clear associated field attributes.
   * @param name - Field name to remove
   */


  removeRuntimeField(name) {
    const existingField = this.getFieldByName(name);

    if (existingField) {
      if (existingField.isMapped) {
        // mapped field, remove runtimeField def
        existingField.runtimeField = undefined;
      } else {
        this.fields.remove(existingField);
      }
    }

    delete this.runtimeFieldMap[name];
  }
  /**
   * Get formatter for a given field name. Return undefined if none exists
   * @param field
   */


  getFormatterForFieldNoDefault(fieldname) {
    const formatSpec = this.fieldFormatMap[fieldname];

    if (formatSpec !== null && formatSpec !== void 0 && formatSpec.id) {
      return this.fieldFormats.getInstance(formatSpec.id, formatSpec.params);
    }
  }

  setFieldAttrs(fieldName, attrName, value) {
    if (!this.fieldAttrs[fieldName]) {
      this.fieldAttrs[fieldName] = {};
    }

    this.fieldAttrs[fieldName][attrName] = value;
  }

  setFieldCustomLabel(fieldName, customLabel) {
    const fieldObject = this.fields.getByName(fieldName);
    const newCustomLabel = customLabel === null ? undefined : customLabel;

    if (fieldObject) {
      fieldObject.customLabel = newCustomLabel;
    }

    this.setFieldAttrs(fieldName, 'customLabel', newCustomLabel);
  }

  setFieldCount(fieldName, count) {
    const fieldObject = this.fields.getByName(fieldName);
    const newCount = count === null ? undefined : count;

    if (fieldObject) {
      if (!newCount) fieldObject.deleteCount();else fieldObject.count = newCount;
      return;
    }

    this.setFieldAttrs(fieldName, 'count', newCount);
  }

}
/**
 * @deprecated Use DataView instead. All index pattern interfaces were renamed.
 */


exports.DataView = DataView;

class IndexPattern extends DataView {}

exports.IndexPattern = IndexPattern;