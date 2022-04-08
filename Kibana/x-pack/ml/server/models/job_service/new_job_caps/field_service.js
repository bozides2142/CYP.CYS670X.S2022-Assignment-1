"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldServiceProvider = fieldServiceProvider;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _common = require("../../../../../../../src/plugins/data/common");

var _fields_utils = require("../../../../common/util/fields_utils");

var _rollup = require("./rollup");

var _aggregation_types = require("../../../../common/constants/aggregation_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const supportedTypes = [_common.ES_FIELD_TYPES.DATE, _common.ES_FIELD_TYPES.KEYWORD, _common.ES_FIELD_TYPES.TEXT, _common.ES_FIELD_TYPES.DOUBLE, _common.ES_FIELD_TYPES.INTEGER, _common.ES_FIELD_TYPES.FLOAT, _common.ES_FIELD_TYPES.LONG, _common.ES_FIELD_TYPES.UNSIGNED_LONG, _common.ES_FIELD_TYPES.BYTE, _common.ES_FIELD_TYPES.HALF_FLOAT, _common.ES_FIELD_TYPES.SCALED_FLOAT, _common.ES_FIELD_TYPES.SHORT, _common.ES_FIELD_TYPES.IP, _common.ES_FIELD_TYPES.GEO_POINT, _common.ES_FIELD_TYPES.GEO_SHAPE, _common.ES_FIELD_TYPES.BOOLEAN];

function fieldServiceProvider(indexPattern, isRollup, client, dataViewsService) {
  return new FieldsService(indexPattern, isRollup, client, dataViewsService);
}

class FieldsService {
  constructor(indexPattern, isRollup, client, dataViewsService) {
    (0, _defineProperty2.default)(this, "_indexPattern", void 0);
    (0, _defineProperty2.default)(this, "_isRollup", void 0);
    (0, _defineProperty2.default)(this, "_mlClusterClient", void 0);
    (0, _defineProperty2.default)(this, "_dataViewsService", void 0);
    this._indexPattern = indexPattern;
    this._isRollup = isRollup;
    this._mlClusterClient = client;
    this._dataViewsService = dataViewsService;
  }

  async loadFieldCaps() {
    const {
      body
    } = await this._mlClusterClient.asCurrentUser.fieldCaps({
      index: this._indexPattern,
      fields: '*'
    });
    return body;
  } // create field object from the results from _field_caps


  async createFields(includeNested = false) {
    const fieldCaps = await this.loadFieldCaps();
    const fields = [];

    if (fieldCaps && fieldCaps.fields) {
      Object.keys(fieldCaps.fields).forEach(k => {
        const fc = fieldCaps.fields[k];
        const firstKey = Object.keys(fc)[0];

        if (firstKey !== undefined) {
          const field = fc[firstKey]; // add to the list of fields if the field type can be used by ML

          if (supportedTypes.includes(field.type) === true && field.metadata_field !== true || includeNested && field.type === _common.ES_FIELD_TYPES.NESTED) {
            fields.push({
              id: k,
              name: k,
              type: field.type,
              aggregatable: field.aggregatable,
              aggs: []
            });
          }
        }
      });
    }

    return fields.sort((a, b) => a.id.localeCompare(b.id));
  } // public function to load fields from _field_caps and create a list
  // of aggregations and fields that can be used for an ML job
  // if the index is a rollup, the fields and aggs will be filtered
  // based on what is available in the rollup job
  // the _indexPattern will be replaced with a comma separated list
  // of index patterns from all of the rollup jobs


  async getData(includeNested = false) {
    let rollupFields = {};

    if (this._isRollup) {
      const rollupService = await (0, _rollup.rollupServiceProvider)(this._indexPattern, this._mlClusterClient, this._dataViewsService);
      const rollupConfigs = await rollupService.getRollupJobs(); // if a rollup index has been specified, yet there are no
      // rollup configs, return with no results

      if (rollupConfigs === null) {
        return {
          aggs: [],
          fields: []
        };
      } else {
        rollupFields = combineAllRollupFields(rollupConfigs);
        this._indexPattern = rollupService.getIndexPattern();
      }
    }

    const aggs = (0, _lodash.cloneDeep)([..._aggregation_types.aggregations, ..._aggregation_types.mlOnlyAggregations]);
    const fields = await this.createFields(includeNested);
    return (0, _fields_utils.combineFieldsAndAggs)(fields, aggs, rollupFields);
  }

}

function combineAllRollupFields(rollupConfigs) {
  const rollupFields = {};
  rollupConfigs.forEach(conf => {
    Object.keys(conf.fields).forEach(fieldName => {
      if (rollupFields[fieldName] === undefined) {
        // @ts-expect-error fix type. our RollupFields type is better
        rollupFields[fieldName] = conf.fields[fieldName];
      } else {
        const aggs = conf.fields[fieldName]; // @ts-expect-error fix type. our RollupFields type is better

        aggs.forEach(agg => {
          if (rollupFields[fieldName].find(f => f.agg === agg.agg) === null) {
            rollupFields[fieldName].push(agg);
          }
        });
      }
    });
  });
  return rollupFields;
}