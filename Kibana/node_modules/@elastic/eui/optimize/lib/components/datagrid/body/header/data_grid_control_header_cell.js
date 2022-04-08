"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridControlHeaderCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _data_grid_header_cell_wrapper = require("./data_grid_header_cell_wrapper");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiDataGridControlHeaderCell = function EuiDataGridControlHeaderCell(_ref) {
  var controlColumn = _ref.controlColumn,
      index = _ref.index,
      headerIsInteractive = _ref.headerIsInteractive;
  var HeaderCellRender = controlColumn.headerCellRender,
      width = controlColumn.width,
      id = controlColumn.id;
  return (0, _react2.jsx)(_data_grid_header_cell_wrapper.EuiDataGridHeaderCellWrapper, {
    className: "euiDataGridHeaderCell--controlColumn",
    id: id,
    index: index,
    width: width,
    headerIsInteractive: headerIsInteractive
  }, (0, _react2.jsx)("div", {
    className: "euiDataGridHeaderCell__content"
  }, (0, _react2.jsx)(HeaderCellRender, null)));
};

exports.EuiDataGridControlHeaderCell = EuiDataGridControlHeaderCell;