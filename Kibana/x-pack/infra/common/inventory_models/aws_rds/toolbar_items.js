"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rdsMetricTypes = exports.rdsGroupByFields = exports.AwsRDSToolbarItems = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _metrics_and_groupby_toolbar_items = require("../shared/components/metrics_and_groupby_toolbar_items");

var _cloud_toolbar_items = require("../shared/components/cloud_toolbar_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const rdsMetricTypes = ['cpu', 'rdsConnections', 'rdsQueriesExecuted', 'rdsActiveTransactions', 'rdsLatency'];
exports.rdsMetricTypes = rdsMetricTypes;
const rdsGroupByFields = ['cloud.availability_zone', 'aws.rds.db_instance.class', 'aws.rds.db_instance.status'];
exports.rdsGroupByFields = rdsGroupByFields;

const AwsRDSToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_cloud_toolbar_items.CloudToolbarItems, props), /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, (0, _extends2.default)({}, props, {
    metricTypes: rdsMetricTypes,
    groupByFields: rdsGroupByFields
  })));
};

exports.AwsRDSToolbarItems = AwsRDSToolbarItems;