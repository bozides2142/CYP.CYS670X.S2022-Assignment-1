"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3MetricTypes = exports.s3GroupByFields = exports.AwsS3ToolbarItems = void 0;

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


const s3MetricTypes = ['s3BucketSize', 's3NumberOfObjects', 's3TotalRequests', 's3DownloadBytes', 's3UploadBytes'];
exports.s3MetricTypes = s3MetricTypes;
const s3GroupByFields = ['cloud.region'];
exports.s3GroupByFields = s3GroupByFields;

const AwsS3ToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_cloud_toolbar_items.CloudToolbarItems, props), /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, (0, _extends2.default)({}, props, {
    metricTypes: s3MetricTypes,
    groupByFields: s3GroupByFields
  })));
};

exports.AwsS3ToolbarItems = AwsS3ToolbarItems;