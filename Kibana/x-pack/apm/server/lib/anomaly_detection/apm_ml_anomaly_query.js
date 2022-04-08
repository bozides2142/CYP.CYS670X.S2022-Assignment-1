"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmMlAnomalyQuery = apmMlAnomalyQuery;

var _server = require("../../../../observability/server");

var _apm_ml_detectors = require("../../../common/anomaly_detection/apm_ml_detectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function apmMlAnomalyQuery({
  serviceName,
  transactionType,
  detectorTypes
}) {
  var _detectorTypes$map;

  return [{
    bool: {
      filter: [{
        bool: {
          should: [{
            bool: {
              filter: [...(0, _server.termQuery)('is_interim', false), ...(0, _server.termQuery)('result_type', 'record')]
            }
          }, {
            bool: {
              filter: (0, _server.termQuery)('result_type', 'model_plot')
            }
          }],
          minimum_should_match: 1
        }
      }, ...(0, _server.termsQuery)('detector_index', ...((_detectorTypes$map = detectorTypes === null || detectorTypes === void 0 ? void 0 : detectorTypes.map(type => (0, _apm_ml_detectors.getApmMlDetectorIndex)(type))) !== null && _detectorTypes$map !== void 0 ? _detectorTypes$map : [])), ...(0, _server.termQuery)('partition_field_value', serviceName), ...(0, _server.termQuery)('by_field_value', transactionType)]
    }
  }];
}