import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import React, { useCallback, useContext } from 'react';
import { useEuiI18n } from '../../i18n'; // Note: this file must be named data_grid_pagination to match i18n tokens

import { EuiTablePagination } from '../../table/table_pagination';
import { DataGridFocusContext } from './focus';
import { jsx as ___EmotionJSX } from "@emotion/react";
export var EuiDataGridPaginationRenderer = function EuiDataGridPaginationRenderer(_ref) {
  var pageIndex = _ref.pageIndex,
      pageSize = _ref.pageSize,
      pageSizeOptions = _ref.pageSizeOptions,
      _onChangePage = _ref.onChangePage,
      onChangeItemsPerPage = _ref.onChangeItemsPerPage,
      rowCount = _ref.rowCount,
      controls = _ref.controls,
      ariaLabel = _ref['aria-label'];
  var detailedPaginationLabel = useEuiI18n('euiDataGridPagination.detailedPaginationLabel', 'Pagination for preceding grid: {label}', {
    label: ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : ''
  });
  var paginationLabel = useEuiI18n('euiDataGridPagination.paginationLabel', 'Pagination for preceding grid'); // Focus the first data cell & scroll back to the top of the grid whenever paginating to a new page

  var _useContext = useContext(DataGridFocusContext),
      setFocusedCell = _useContext.setFocusedCell;

  var onChangePage = useCallback(function (pageIndex) {
    _onChangePage(pageIndex);

    setFocusedCell([0, 0]);
  }, [setFocusedCell, _onChangePage]);
  var pageCount = Math.ceil(rowCount / pageSize);

  var minSizeOption = pageSizeOptions && _toConsumableArray(pageSizeOptions).sort(function (a, b) {
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
  return ___EmotionJSX("div", {
    className: "euiDataGrid__pagination"
  }, ___EmotionJSX(EuiTablePagination, {
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