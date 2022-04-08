"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridPaginationRenderer = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireWildcard(require("react"));

var _i18n = require("../../i18n");

var _table_pagination = require("../../table/table_pagination");

var _focus = require("./focus");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Note: this file must be named data_grid_pagination to match i18n tokens
var EuiDataGridPaginationRenderer = function EuiDataGridPaginationRenderer(_ref) {
  var pageIndex = _ref.pageIndex,
      pageSize = _ref.pageSize,
      pageSizeOptions = _ref.pageSizeOptions,
      _onChangePage = _ref.onChangePage,
      onChangeItemsPerPage = _ref.onChangeItemsPerPage,
      rowCount = _ref.rowCount,
      controls = _ref.controls,
      ariaLabel = _ref['aria-label'];
  var detailedPaginationLabel = (0, _i18n.useEuiI18n)('euiDataGridPagination.detailedPaginationLabel', 'Pagination for preceding grid: {label}', {
    label: ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : ''
  });
  var paginationLabel = (0, _i18n.useEuiI18n)('euiDataGridPagination.paginationLabel', 'Pagination for preceding grid'); // Focus the first data cell & scroll back to the top of the grid whenever paginating to a new page

  var _useContext = (0, _react.useContext)(_focus.DataGridFocusContext),
      setFocusedCell = _useContext.setFocusedCell;

  var onChangePage = (0, _react.useCallback)(function (pageIndex) {
    _onChangePage(pageIndex);

    setFocusedCell([0, 0]);
  }, [setFocusedCell, _onChangePage]);
  var pageCount = Math.ceil(rowCount / pageSize);
  var minSizeOption = pageSizeOptions && (0, _toConsumableArray2.default)(pageSizeOptions).sort(function (a, b) {
    return a - b;
  })[0];

  if (rowCount < (minSizeOption || pageSize)) {
    /**
     * Do not render the pagination when:
     * 1. Rows count is less than min pagination option (rows per page)
     * 2. Rows count is less than pageSize (the case when there are no pageSizeOptions provided)
     */
    return null;
  } // hide select rows per page if pageSizeOptions is undefined or an empty array


  var hidePerPageOptions = !pageSizeOptions || pageSizeOptions.length === 0;
  return (0, _react2.jsx)("div", {
    className: "euiDataGrid__pagination"
  }, (0, _react2.jsx)(_table_pagination.EuiTablePagination, {
    "aria-controls": controls,
    activePage: pageIndex,
    hidePerPageOptions: hidePerPageOptions,
    itemsPerPage: pageSize,
    itemsPerPageOptions: pageSizeOptions,
    pageCount: pageCount,
    onChangePage: onChangePage,
    onChangeItemsPerPage: onChangeItemsPerPage,
    "aria-label": ariaLabel ? detailedPaginationLabel : paginationLabel
  }));
};

exports.EuiDataGridPaginationRenderer = EuiDataGridPaginationRenderer;