"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternField = exports.DataViewField = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fieldTypes = require("@kbn/field-types");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */

/** @public */
class DataViewField {
  // not writable or serialized
  constructor(spec) {
    (0, _defineProperty2.default)(this, "spec", void 0);
    (0, _defineProperty2.default)(this, "kbnFieldType", void 0);
    this.spec = { ...spec,
      type: spec.name === '_source' ? '_source' : spec.type
    };
    this.kbnFieldType = (0, _fieldTypes.getKbnFieldType)(spec.type);
  } // writable attrs

  /**
   * Count is used for field popularity
   */


  get count() {
    return this.spec.count || 0;
  }

  set count(count) {
    this.spec.count = count;
  }

  get runtimeField() {
    return this.spec.runtimeField;
  }

  set runtimeField(runtimeField) {
    this.spec.runtimeField = runtimeField;
  }
  /**
   * Script field code
   */


  get script() {
    return this.spec.script;
  }

  set script(script) {
    this.spec.script = script;
  }
  /**
   * Script field language
   */


  get lang() {
    return this.spec.lang;
  }

  set lang(lang) {
    this.spec.lang = lang;
  }

  get customLabel() {
    return this.spec.customLabel;
  }

  set customLabel(customLabel) {
    this.spec.customLabel = customLabel;
  }
  /**
   * Description of field type conflicts across different indices in the same index pattern
   */


  get conflictDescriptions() {
    return this.spec.conflictDescriptions;
  }

  set conflictDescriptions(conflictDescriptions) {
    this.spec.conflictDescriptions = conflictDescriptions;
  } // read only attrs


  get name() {
    return this.spec.name;
  }

  get displayName() {
    return this.spec.customLabel ? this.spec.customLabel : this.spec.shortDotsEnable ? (0, _utils.shortenDottedString)(this.spec.name) : this.spec.name;
  }

  get type() {
    var _this$runtimeField, _this$runtimeField2;

    return (_this$runtimeField = this.runtimeField) !== null && _this$runtimeField !== void 0 && _this$runtimeField.type ? (0, _fieldTypes.castEsToKbnFieldTypeName)((_this$runtimeField2 = this.runtimeField) === null || _this$runtimeField2 === void 0 ? void 0 : _this$runtimeField2.type) : this.spec.type;
  }

  get esTypes() {
    var _this$runtimeField3, _this$runtimeField4;

    return (_this$runtimeField3 = this.runtimeField) !== null && _this$runtimeField3 !== void 0 && _this$runtimeField3.type ? [(_this$runtimeField4 = this.runtimeField) === null || _this$runtimeField4 === void 0 ? void 0 : _this$runtimeField4.type] : this.spec.esTypes;
  }

  get scripted() {
    return !!this.spec.scripted;
  }

  get searchable() {
    return !!(this.spec.searchable || this.scripted);
  }

  get aggregatable() {
    return !!(this.spec.aggregatable || this.scripted);
  }

  get readFromDocValues() {
    return !!(this.spec.readFromDocValues && !this.scripted);
  }

  get subType() {
    return this.spec.subType;
  }
  /**
   * Is the field part of the index mapping?
   */


  get isMapped() {
    return this.spec.isMapped;
  } // not writable, not serialized


  get sortable() {
    return this.name === '_score' || (this.spec.indexed || this.aggregatable) && this.kbnFieldType.sortable;
  }

  get filterable() {
    return this.name === '_id' || this.scripted || (this.spec.indexed || this.searchable) && this.kbnFieldType.filterable;
  }

  get visualizable() {
    const notVisualizableFieldTypes = [_fieldTypes.KBN_FIELD_TYPES.UNKNOWN, _fieldTypes.KBN_FIELD_TYPES.CONFLICT];
    return this.aggregatable && !notVisualizableFieldTypes.includes(this.spec.type);
  }

  isSubtypeNested() {
    return (0, _utils.isDataViewFieldSubtypeNested)(this);
  }

  isSubtypeMulti() {
    return (0, _utils.isDataViewFieldSubtypeMulti)(this);
  }

  getSubtypeNested() {
    return (0, _utils.getDataViewFieldSubtypeNested)(this);
  }

  getSubtypeMulti() {
    return (0, _utils.getDataViewFieldSubtypeMulti)(this);
  }

  deleteCount() {
    delete this.spec.count;
  }

  toJSON() {
    return {
      count: this.count,
      script: this.script,
      lang: this.lang,
      conflictDescriptions: this.conflictDescriptions,
      name: this.name,
      type: this.type,
      esTypes: this.esTypes,
      scripted: this.scripted,
      searchable: this.searchable,
      aggregatable: this.aggregatable,
      readFromDocValues: this.readFromDocValues,
      subType: this.subType,
      customLabel: this.customLabel
    };
  }

  toSpec({
    getFormatterForField
  } = {}) {
    return {
      count: this.count,
      script: this.script,
      lang: this.lang,
      conflictDescriptions: this.conflictDescriptions,
      name: this.name,
      type: this.type,
      esTypes: this.esTypes,
      scripted: this.scripted,
      searchable: this.searchable,
      aggregatable: this.aggregatable,
      readFromDocValues: this.readFromDocValues,
      subType: this.subType,
      format: getFormatterForField ? getFormatterForField(this).toJSON() : undefined,
      customLabel: this.customLabel,
      shortDotsEnable: this.spec.shortDotsEnable,
      runtimeField: this.runtimeField,
      isMapped: this.isMapped
    };
  }

}
/**
 * @deprecated Use DataViewField instead. All index pattern interfaces were renamed.
 */


exports.DataViewField = DataViewField;

class IndexPatternField extends DataViewField {}

exports.IndexPatternField = IndexPatternField;