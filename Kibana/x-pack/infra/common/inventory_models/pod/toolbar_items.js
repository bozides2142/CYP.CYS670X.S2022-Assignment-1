"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.podMetricTypes = exports.podGroupByFields = exports.PodToolbarItems = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _metrics_and_groupby_toolbar_items = require("../shared/components/metrics_and_groupby_toolbar_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const podMetricTypes = ['cpu', 'memory', 'rx', 'tx'];
exports.podMetricTypes = podMetricTypes;
const podGroupByFields = ['kubernetes.namespace', 'kubernetes.node.name', 'service.type'];
exports.podGroupByFields = podGroupByFields;

const PodToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, (0, _extends2.default)({}, props, {
    metricTypes: podMetricTypes,
    groupByFields: podGroupByFields
  }));
};

exports.PodToolbarItems = PodToolbarItems;