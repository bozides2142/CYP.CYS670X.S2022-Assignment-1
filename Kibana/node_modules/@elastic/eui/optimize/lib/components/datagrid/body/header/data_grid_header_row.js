"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridHeaderRow = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _data_grid_control_header_cell = require("./data_grid_control_header_cell");

var _data_grid_header_cell = require("./data_grid_header_cell");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiDataGridHeaderRow = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var _props$leadingControl = props.leadingControlColumns,
      leadingControlColumns = _props$leadingControl === void 0 ? [] : _props$leadingControl,
      _props$trailingContro = props.trailingControlColumns,
      trailingControlColumns = _props$trailingContro === void 0 ? [] : _props$trailingContro,
      columns = props.columns,
      schema = props.schema,
      schemaDetectors = props.schemaDetectors,
      columnWidths = props.columnWidths,
      defaultColumnWidth = props.defaultColumnWidth,
      className = props.className,
      setColumnWidth = props.setColumnWidth,
      setVisibleColumns = props.setVisibleColumns,
      switchColumnPos = props.switchColumnPos,
      headerIsInteractive = props.headerIsInteractive,
      _dataTestSubj = props['data-test-subj'],
      rest = (0, _objectWithoutProperties2.default)(props, ["leadingControlColumns", "trailingControlColumns", "columns", "schema", "schemaDetectors", "columnWidths", "defaultColumnWidth", "className", "setColumnWidth", "setVisibleColumns", "switchColumnPos", "headerIsInteractive", "data-test-subj"]);
  var classes = (0, _classnames.default)('euiDataGridHeader', className);
  var dataTestSubj = (0, _classnames.default)('dataGridHeader', _dataTestSubj);
  return (0, _react2.jsx)("div", (0, _extends2.default)({
    role: "row",
    ref: ref,
    className: classes,
    "data-test-subj": dataTestSubj
  }, rest), leadingControlColumns.map(function (controlColumn, index) {
    return (0, _react2.jsx)(_data_grid_control_header_cell.EuiDataGridControlHeaderCell, {
      key: controlColumn.id,
      index: index,
      controlColumn: controlColumn,
      headerIsInteractive: headerIsInteractive
    });
  }), columns.map(function (column, index) {
    return (0, _react2.jsx)(_data_grid_header_cell.EuiDataGridHeaderCell, {
      key: column.id,
      column: column,
      columns: columns,
      index: index + leadingControlColumns.length,
      columnWidths: columnWidths,
      schema: schema,
      schemaDetectors: schemaDetectors,
      setColumnWidth: setColumnWidth,
      setVisibleColumns: setVisibleColumns,
      switchColumnPos: switchColumnPos,
      defaultColumnWidth: defaultColumnWidth,
      headerIsInteractive: headerIsInteractive
    });
  }), trailingControlColumns.map(function (controlColumn, index) {
    return (0, _react2.jsx)(_data_grid_control_header_cell.EuiDataGridControlHeaderCell, {
      key: controlColumn.id,
      index: index + leadingControlColumns.length + columns.length,
      controlColumn: controlColumn,
      headerIsInteractive: headerIsInteractive
    });
  }));
});
exports.EuiDataGridHeaderRow = EuiDataGridHeaderRow;
EuiDataGridHeaderRow.displayName = 'EuiDataGridHeaderRow';