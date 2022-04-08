"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridHeaderCell = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _accessibility = require("../../../../services/accessibility");

var _accessibility2 = require("../../../accessibility");

var _i18n = require("../../../i18n");

var _icon = require("../../../icon");

var _list_group = require("../../../list_group");

var _popover = require("../../../popover");

var _sorting = require("../../utils/sorting");

var _focus = require("../../utils/focus");

var _column_actions = require("./column_actions");

var _data_grid_column_resizer = require("./data_grid_column_resizer");

var _data_grid_header_cell_wrapper = require("./data_grid_header_cell_wrapper");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiDataGridHeaderCell = function EuiDataGridHeaderCell(_ref) {
  var column = _ref.column,
      index = _ref.index,
      columns = _ref.columns,
      columnWidths = _ref.columnWidths,
      schema = _ref.schema,
      schemaDetectors = _ref.schemaDetectors,
      defaultColumnWidth = _ref.defaultColumnWidth,
      setColumnWidth = _ref.setColumnWidth,
      setVisibleColumns = _ref.setVisibleColumns,
      switchColumnPos = _ref.switchColumnPos,
      headerIsInteractive = _ref.headerIsInteractive;
  var id = column.id,
      display = column.display,
      displayAsText = column.displayAsText;
  var width = columnWidths[id] || defaultColumnWidth;
  var columnType = schema[id] ? schema[id].columnType : null;
  var classes = (0, _classnames2.default)((0, _defineProperty2.default)({}, "euiDataGridHeaderCell--".concat(columnType), columnType));
  var actionButtonAriaLabel = (0, _i18n.useEuiI18n)('euiDataGridHeaderCell.headerActions', 'Header actions');
  var ariaProps = {};
  var screenReaderId = (0, _accessibility.useGeneratedHtmlId)();

  var _useContext = (0, _react.useContext)(_focus.DataGridFocusContext),
      setFocusedCell = _useContext.setFocusedCell,
      focusFirstVisibleInteractiveCell = _useContext.focusFirstVisibleInteractiveCell;

  var _useContext2 = (0, _react.useContext)(_sorting.DataGridSortingContext),
      sorting = _useContext2.sorting;

  var sortString;

  if (sorting) {
    var sortedColumnIds = new Set(sorting.columns.map(function (_ref2) {
      var id = _ref2.id;
      return id;
    }));

    if (sortedColumnIds.has(id)) {
      if (sorting.columns.length === 1) {
        var sortDirection = sorting.columns[0].direction;
        var sortValue = 'other';

        if (sortDirection === 'asc') {
          sortValue = 'ascending';
        }

        if (sortDirection === 'desc') {
          sortValue = 'descending';
        }

        ariaProps['aria-sort'] = sortValue;
      } else {
        sortString = sorting.columns.map(function (col) {
          return "Sorted by ".concat(col.id, " ").concat(col.direction);
        }).join(' then ');
        ariaProps['aria-describedby'] = screenReaderId;
      }
    }
  }

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isPopoverOpen = _useState2[0],
      setIsPopoverOpen = _useState2[1];

  var columnActions = (0, _column_actions.getColumnActions)({
    column: column,
    columns: columns,
    schema: schema,
    schemaDetectors: schemaDetectors,
    setVisibleColumns: setVisibleColumns,
    focusFirstVisibleInteractiveCell: focusFirstVisibleInteractiveCell,
    setIsPopoverOpen: setIsPopoverOpen,
    sorting: sorting,
    switchColumnPos: switchColumnPos,
    setFocusedCell: setFocusedCell
  });
  var showColumnActions = columnActions && columnActions.length > 0;
  var sortedColumn = sorting === null || sorting === void 0 ? void 0 : sorting.columns.find(function (col) {
    return col.id === id;
  });
  var sortingArrow = sortedColumn ? (0, _react2.jsx)(_icon.EuiIcon, {
    type: sortedColumn.direction === 'asc' ? 'sortUp' : 'sortDown',
    color: "text",
    className: "euiDataGridHeaderCell__sortingArrow",
    "data-test-subj": "dataGridHeaderCellSortingIcon-".concat(id)
  }) : null;
  return (0, _react2.jsx)(_data_grid_header_cell_wrapper.EuiDataGridHeaderCellWrapper, (0, _extends2.default)({
    id: id,
    index: index,
    width: width,
    headerIsInteractive: headerIsInteractive,
    className: classes
  }, ariaProps), column.isResizable !== false && width != null ? (0, _react2.jsx)(_data_grid_column_resizer.EuiDataGridColumnResizer, {
    columnId: id,
    columnWidth: width,
    setColumnWidth: setColumnWidth
  }) : null, sortString && (0, _react2.jsx)(_accessibility2.EuiScreenReaderOnly, null, (0, _react2.jsx)("div", {
    id: screenReaderId
  }, sortString)), !showColumnActions ? (0, _react2.jsx)(_react.default.Fragment, null, sortingArrow, (0, _react2.jsx)("div", {
    className: "euiDataGridHeaderCell__content"
  }, display || displayAsText || id)) : (0, _react2.jsx)(_popover.EuiPopover, {
    anchorClassName: "euiDataGridHeaderCell__anchor",
    panelPaddingSize: "none",
    offset: 7,
    button: (0, _react2.jsx)("button", {
      className: "euiDataGridHeaderCell__button",
      onClick: function onClick() {
        setFocusedCell([index, -1]);
        setIsPopoverOpen(function (isPopoverOpen) {
          return !isPopoverOpen;
        });
      }
    }, sortingArrow, (0, _react2.jsx)("div", {
      className: "euiDataGridHeaderCell__content"
    }, display || displayAsText || id), (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiDataGridHeaderCell__icon",
      type: "arrowDown",
      size: "s",
      color: "text",
      "aria-label": actionButtonAriaLabel,
      "data-test-subj": "dataGridHeaderCellActionButton-".concat(id)
    })),
    isOpen: isPopoverOpen,
    closePopover: function closePopover() {
      return setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)("div", null, (0, _react2.jsx)(_list_group.EuiListGroup, {
    listItems: columnActions,
    gutterSize: "none",
    "data-test-subj": "dataGridHeaderCellActionGroup-".concat(id)
  }))));
};

exports.EuiDataGridHeaderCell = EuiDataGridHeaderCell;