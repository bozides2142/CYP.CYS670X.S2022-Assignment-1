"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldParamType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../../plugins/kibana_utils/common");

var _base = require("./base");

var _utils = require("../utils");

var _types = require("../../../kbn_field_types/types");

var _common2 = require("../../../../../data_views/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filterByType = (0, _utils.propFilter)('type');

class FieldParamType extends _base.BaseParamType {
  /**
   * Filter available fields by passing filter fn on a {@link DataViewField}
   * If used, takes precedence over filterFieldTypes and other filter params
   */
  constructor(config) {
    super(config);
    (0, _defineProperty2.default)(this, "required", true);
    (0, _defineProperty2.default)(this, "scriptable", true);
    (0, _defineProperty2.default)(this, "filterFieldTypes", void 0);
    (0, _defineProperty2.default)(this, "onlyAggregatable", void 0);
    (0, _defineProperty2.default)(this, "filterField", void 0);
    (0, _defineProperty2.default)(this, "getAvailableFields", aggConfig => {
      const fields = aggConfig.getIndexPattern().fields;
      const filteredFields = fields.filter(field => {
        const {
          onlyAggregatable,
          scriptable,
          filterFieldTypes,
          filterField
        } = this;

        if (filterField) {
          return filterField(field);
        }

        if (onlyAggregatable && (!field.aggregatable || (0, _common2.isNestedField)(field)) || !scriptable && field.scripted) {
          return false;
        }

        return filterByType([field], filterFieldTypes).length !== 0;
      });
      return filteredFields;
    });
    this.filterFieldTypes = config.filterFieldTypes || '*';
    this.onlyAggregatable = config.onlyAggregatable !== false;
    this.filterField = config.filterField;

    if (!config.write) {
      this.write = (aggConfig, output) => {
        const field = aggConfig.getField();

        if (!field) {
          throw new TypeError(_i18n.i18n.translate('data.search.aggs.paramTypes.field.requiredFieldParameterErrorMessage', {
            defaultMessage: '{fieldParameter} is a required parameter',
            values: {
              fieldParameter: '"field"'
            }
          }));
        }

        if (field.type === _types.KBN_FIELD_TYPES.MISSING) {
          throw new _common.SavedFieldNotFound(_i18n.i18n.translate('data.search.aggs.paramTypes.field.notFoundSavedFieldParameterErrorMessage', {
            defaultMessage: 'The field "{fieldParameter}" associated with this object no longer exists in the data view. Please use another field.',
            values: {
              fieldParameter: field.name
            }
          }));
        }

        const validField = this.getAvailableFields(aggConfig).find(f => f.name === field.name);

        if (!validField) {
          var _aggConfig$type;

          throw new _common.SavedFieldTypeInvalidForAgg(_i18n.i18n.translate('data.search.aggs.paramTypes.field.invalidSavedFieldParameterErrorMessage', {
            defaultMessage: 'Saved field "{fieldParameter}" of data view "{indexPatternTitle}" is invalid for use with the "{aggType}" aggregation. Please select a new field.',
            values: {
              fieldParameter: field.name,
              aggType: aggConfig === null || aggConfig === void 0 ? void 0 : (_aggConfig$type = aggConfig.type) === null || _aggConfig$type === void 0 ? void 0 : _aggConfig$type.title,
              indexPatternTitle: aggConfig.getIndexPattern().title
            }
          }));
        }

        if (validField.scripted) {
          output.params.script = {
            source: validField.script,
            lang: validField.lang
          };
        } else {
          output.params.field = validField.name;
        }
      };
    }

    this.serialize = field => {
      return field.name;
    };

    this.deserialize = (fieldName, aggConfig) => {
      if (!aggConfig) {
        throw new Error('aggConfig was not provided to FieldParamType deserialize function');
      }

      const field = aggConfig.getIndexPattern().fields.getByName(fieldName);

      if (!field) {
        return new _common2.IndexPatternField({
          type: _types.KBN_FIELD_TYPES.MISSING,
          name: fieldName,
          searchable: false,
          aggregatable: false
        });
      }

      return field;
    };
  }
  /**
   * filter the fields to the available ones
   */


}

exports.FieldParamType = FieldParamType;