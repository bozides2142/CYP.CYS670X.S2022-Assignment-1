"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridBody = exports.DataGridWrapperRowsContext = exports.Cell = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _reactWindow = require("react-window");

var _mutation_observer = require("../../observer/mutation_observer");

var _resize_observer = require("../../observer/resize_observer");

var _data_grid_cell = require("./data_grid_cell");

var _data_grid_footer_row = require("./data_grid_footer_row");

var _header = require("./header");

var _popover_utils = require("./popover_utils");

var _data_grid_row_manager = require("./data_grid_row_manager");

var _grid_height_width = require("../utils/grid_height_width");

var _col_widths = require("../utils/col_widths");

var _row_heights = require("../utils/row_heights");

var _focus = require("../utils/focus");

var _scrolling = require("../utils/scrolling");

var _sorting = require("../utils/sorting");

var _test = require("../../../test");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Cell = function Cell(_ref) {
  var columnIndex = _ref.columnIndex,
      visibleRowIndex = _ref.rowIndex,
      style = _ref.style,
      data = _ref.data;
  var leadingControlColumns = data.leadingControlColumns,
      trailingControlColumns = data.trailingControlColumns,
      columns = data.columns,
      visibleColCount = data.visibleColCount,
      schema = data.schema,
      popoverContents = data.popoverContents,
      columnWidths = data.columnWidths,
      defaultColumnWidth = data.defaultColumnWidth,
      renderCellValue = data.renderCellValue,
      interactiveCellId = data.interactiveCellId,
      setRowHeight = data.setRowHeight,
      schemaDetectors = data.schemaDetectors,
      rowHeightsOptions = data.rowHeightsOptions,
      rowHeightUtils = data.rowHeightUtils,
      rowManager = data.rowManager;

  var _useContext = (0, _react.useContext)(DataGridWrapperRowsContext),
      headerRowHeight = _useContext.headerRowHeight;

  var _useContext2 = (0, _react.useContext)(_sorting.DataGridSortingContext),
      getCorrectRowIndex = _useContext2.getCorrectRowIndex;

  var cellContent;
  var isFirstColumn = columnIndex === 0;
  var isLastColumn = columnIndex === visibleColCount - 1;
  var isStripableRow = visibleRowIndex % 2 !== 0;
  var isLeadingControlColumn = columnIndex < leadingControlColumns.length;
  var isTrailingControlColumn = columnIndex >= leadingControlColumns.length + columns.length;
  var dataColumnIndex = columnIndex - leadingControlColumns.length;
  var column = columns[dataColumnIndex];
  var columnId = column === null || column === void 0 ? void 0 : column.id;
  var transformClass = schemaDetectors.filter(function (row) {
    return (column === null || column === void 0 ? void 0 : column.schema) ? (column === null || column === void 0 ? void 0 : column.schema) === row.type : columnId === row.type;
  })[0];
  var textTransform = transformClass === null || transformClass === void 0 ? void 0 : transformClass.textTransform;
  var classes = (0, _classnames.default)((0, _defineProperty2.default)({
    'euiDataGridRowCell--stripe': isStripableRow,
    'euiDataGridRowCell--firstColumn': isFirstColumn,
    'euiDataGridRowCell--lastColumn': isLastColumn,
    'euiDataGridRowCell--controlColumn': isLeadingControlColumn || isTrailingControlColumn
  }, "euiDataGridRowCell--".concat(textTransform), textTransform));
  var sharedCellProps = {
    rowIndex: getCorrectRowIndex(visibleRowIndex),
    visibleRowIndex: visibleRowIndex,
    colIndex: columnIndex,
    interactiveCellId: interactiveCellId,
    className: classes,
    style: _objectSpread(_objectSpread({}, style), {}, {
      top: "".concat(parseFloat(style.top) + headerRowHeight, "px")
    }),
    rowHeightsOptions: rowHeightsOptions,
    rowHeightUtils: rowHeightUtils,
    setRowHeight: isFirstColumn ? setRowHeight : undefined,
    rowManager: rowManager
  };

  if (isLeadingControlColumn) {
    var leadingColumn = leadingControlColumns[columnIndex];
    var id = leadingColumn.id,
        rowCellRender = leadingColumn.rowCellRender;
    cellContent = (0, _react2.jsx)(_data_grid_cell.EuiDataGridCell, (0, _extends2.default)({}, sharedCellProps, {
      columnId: id,
      popoverContent: _popover_utils.DefaultColumnFormatter,
      width: leadingColumn.width,
      renderCellValue: rowCellRender,
      isExpandable: false
    }));
  } else if (isTrailingControlColumn) {
    var columnOffset = columns.length + leadingControlColumns.length;
    var trailingColumnIndex = columnIndex - columnOffset;
    var trailingColumn = trailingControlColumns[trailingColumnIndex];
    var _id = trailingColumn.id,
        _rowCellRender = trailingColumn.rowCellRender;
    cellContent = (0, _react2.jsx)(_data_grid_cell.EuiDataGridCell, (0, _extends2.default)({}, sharedCellProps, {
      columnId: _id,
      popoverContent: _popover_utils.DefaultColumnFormatter,
      width: trailingColumn.width,
      renderCellValue: _rowCellRender,
      isExpandable: false
    }));
  } else {
    // this is a normal data cell
    // offset the column index by the leading control columns
    var columnType = schema[columnId] ? schema[columnId].columnType : null;
    var isExpandable = column.isExpandable !== undefined ? column.isExpandable : true;
    var popoverContent = popoverContents[columnType] || _popover_utils.DefaultColumnFormatter;
    var width = columnWidths[columnId] || defaultColumnWidth;
    cellContent = (0, _react2.jsx)(_data_grid_cell.EuiDataGridCell, (0, _extends2.default)({}, sharedCellProps, {
      columnId: columnId,
      column: column,
      columnType: columnType,
      popoverContent: popoverContent,
      width: width || undefined,
      renderCellValue: renderCellValue,
      interactiveCellId: interactiveCellId,
      isExpandable: isExpandable
    }));
  }

  return cellContent;
}; // Context is required to pass props to react-window's innerElementType
// @see https://github.com/bvaughn/react-window/issues/404


exports.Cell = Cell;
var DataGridWrapperRowsContext = /*#__PURE__*/(0, _react.createContext)({
  headerRow: (0, _react2.jsx)("div", null),
  headerRowHeight: 0,
  footerRow: null
});
exports.DataGridWrapperRowsContext = DataGridWrapperRowsContext;
var InnerElement = /*#__PURE__*/(0, _react.forwardRef)(function (_ref2, ref) {
  var children = _ref2.children,
      style = _ref2.style,
      rest = (0, _objectWithoutProperties2.default)(_ref2, ["children", "style"]);

  var _useContext3 = (0, _react.useContext)(DataGridWrapperRowsContext),
      headerRowHeight = _useContext3.headerRowHeight,
      headerRow = _useContext3.headerRow,
      footerRow = _useContext3.footerRow;

  return (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)("div", (0, _extends2.default)({
    ref: ref,
    style: _objectSpread(_objectSpread({}, style), {}, {
      height: style.height + headerRowHeight
    })
  }, rest), headerRow, children), footerRow);
});
InnerElement.displayName = 'EuiDataGridInnerElement';

var EuiDataGridBody = function EuiDataGridBody(props) {
  var leadingControlColumns = props.leadingControlColumns,
      trailingControlColumns = props.trailingControlColumns,
      columns = props.columns,
      visibleColCount = props.visibleColCount,
      schema = props.schema,
      schemaDetectors = props.schemaDetectors,
      popoverContents = props.popoverContents,
      rowCount = props.rowCount,
      _props$visibleRows = props.visibleRows,
      startRow = _props$visibleRows.startRow,
      endRow = _props$visibleRows.endRow,
      visibleRowCount = _props$visibleRows.visibleRowCount,
      renderCellValue = props.renderCellValue,
      renderFooterCellValue = props.renderFooterCellValue,
      interactiveCellId = props.interactiveCellId,
      pagination = props.pagination,
      headerIsInteractive = props.headerIsInteractive,
      handleHeaderMutation = props.handleHeaderMutation,
      setVisibleColumns = props.setVisibleColumns,
      switchColumnPos = props.switchColumnPos,
      onColumnResize = props.onColumnResize,
      rowHeightsOptions = props.rowHeightsOptions,
      virtualizationOptions = props.virtualizationOptions,
      isFullScreen = props.isFullScreen,
      gridStyles = props.gridStyles,
      gridWidth = props.gridWidth,
      gridRef = props.gridRef,
      gridItemsRendered = props.gridItemsRendered,
      wrapperRef = props.wrapperRef;
  /**
   * Grid refs & observers
   */

  var wrapperDimensions = (0, _resize_observer.useResizeObserver)(wrapperRef.current);
  var outerGridRef = (0, _react.useRef)(null); // container that becomes scrollable

  var innerGridRef = (0, _react.useRef)(null); // container sized to fit all content

  /**
   * Widths
   */

  var virtualizeContainerWidth = (0, _grid_height_width.useVirtualizeContainerWidth)(outerGridRef.current, gridWidth, pagination === null || pagination === void 0 ? void 0 : pagination.pageSize); // compute the default column width from the container's width and count of visible columns

  var defaultColumnWidth = (0, _col_widths.useDefaultColumnWidth)(virtualizeContainerWidth, leadingControlColumns, trailingControlColumns, columns);

  var _useColumnWidths = (0, _col_widths.useColumnWidths)({
    columns: columns,
    leadingControlColumns: leadingControlColumns,
    trailingControlColumns: trailingControlColumns,
    defaultColumnWidth: defaultColumnWidth,
    onColumnResize: onColumnResize
  }),
      columnWidths = _useColumnWidths.columnWidths,
      setColumnWidth = _useColumnWidths.setColumnWidth,
      getColumnWidth = _useColumnWidths.getColumnWidth;
  /**
   * Header
   */


  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      headerRowRef = _useState2[0],
      setHeaderRowRef = _useState2[1];

  (0, _mutation_observer.useMutationObserver)(headerRowRef, handleHeaderMutation, {
    subtree: true,
    childList: true
  });

  var _useResizeObserver = (0, _resize_observer.useResizeObserver)(headerRowRef, 'height'),
      headerRowHeight = _useResizeObserver.height;

  var headerRow = (0, _react.useMemo)(function () {
    return (0, _react2.jsx)(_header.EuiDataGridHeaderRow, {
      ref: setHeaderRowRef,
      switchColumnPos: switchColumnPos,
      setVisibleColumns: setVisibleColumns,
      leadingControlColumns: leadingControlColumns,
      trailingControlColumns: trailingControlColumns,
      columns: columns,
      columnWidths: columnWidths,
      defaultColumnWidth: defaultColumnWidth,
      setColumnWidth: setColumnWidth,
      schema: schema,
      schemaDetectors: schemaDetectors,
      headerIsInteractive: headerIsInteractive
    });
  }, [switchColumnPos, setVisibleColumns, leadingControlColumns, trailingControlColumns, columns, columnWidths, defaultColumnWidth, setColumnWidth, schema, schemaDetectors, headerIsInteractive]);
  (0, _focus.useHeaderFocusWorkaround)(headerIsInteractive);
  /**
   * Footer
   */

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      footerRowRef = _useState4[0],
      setFooterRowRef = _useState4[1];

  var _useResizeObserver2 = (0, _resize_observer.useResizeObserver)(footerRowRef, 'height'),
      footerRowHeight = _useResizeObserver2.height;

  var footerRow = (0, _react.useMemo)(function () {
    if (renderFooterCellValue == null) return null;
    return (0, _react2.jsx)(_data_grid_footer_row.EuiDataGridFooterRow, {
      ref: setFooterRowRef,
      leadingControlColumns: leadingControlColumns,
      trailingControlColumns: trailingControlColumns,
      columns: columns,
      schema: schema,
      popoverContents: popoverContents,
      columnWidths: columnWidths,
      defaultColumnWidth: defaultColumnWidth,
      renderCellValue: renderFooterCellValue,
      rowIndex: visibleRowCount,
      visibleRowIndex: visibleRowCount,
      interactiveCellId: interactiveCellId
    });
  }, [columnWidths, columns, defaultColumnWidth, interactiveCellId, leadingControlColumns, popoverContents, renderFooterCellValue, schema, trailingControlColumns, visibleRowCount]);
  /**
   * Handle scrolling cells fully into view
   */

  (0, _scrolling.useScroll)({
    gridRef: gridRef,
    outerGridRef: outerGridRef,
    innerGridRef: innerGridRef,
    headerRowHeight: headerRowHeight,
    footerRowHeight: footerRowHeight,
    visibleRowCount: visibleRowCount,
    hasStickyFooter: !!(renderFooterCellValue && gridStyles.stickyFooter)
  });
  /**
   * Row manager
   */
  // useState instead of useMemo as React reserves the right to drop memoized
  // values in the future, and that would be very bad here

  var _useState5 = (0, _react.useState)(function () {
    return (0, _data_grid_row_manager.makeRowManager)(innerGridRef);
  }),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 1),
      rowManager = _useState6[0];
  /**
   * Heights
   */


  var rowHeightUtils = (0, _row_heights.useRowHeightUtils)({
    gridRef: gridRef.current,
    gridStyles: gridStyles,
    columns: columns
  });

  var _useDefaultRowHeight = (0, _row_heights.useDefaultRowHeight)({
    rowHeightsOptions: rowHeightsOptions,
    rowHeightUtils: rowHeightUtils
  }),
      defaultRowHeight = _useDefaultRowHeight.defaultRowHeight,
      setRowHeight = _useDefaultRowHeight.setRowHeight,
      getRowHeight = _useDefaultRowHeight.getRowHeight;

  var unconstrainedHeight = (0, _grid_height_width.useUnconstrainedHeight)({
    rowHeightUtils: rowHeightUtils,
    startRow: startRow,
    endRow: endRow,
    rowHeightsOptions: rowHeightsOptions,
    defaultRowHeight: defaultRowHeight,
    headerRowHeight: headerRowHeight,
    footerRowHeight: footerRowHeight,
    outerGridRef: outerGridRef,
    innerGridRef: innerGridRef
  });
  /**
   * Final grid height & width
   */

  var _useFinalGridDimensio = (0, _grid_height_width.useFinalGridDimensions)({
    unconstrainedHeight: unconstrainedHeight,
    unconstrainedWidth: 0,
    // unable to determine this until the container's size is known
    wrapperDimensions: wrapperDimensions,
    wrapperRef: wrapperRef,
    isFullScreen: isFullScreen,
    rowCount: rowCount
  }),
      finalWidth = _useFinalGridDimensio.finalWidth,
      finalHeight = _useFinalGridDimensio.finalHeight;
  /**
   * Grid resets
   */


  (0, _react.useEffect)(function () {
    if (gridRef.current) {
      gridRef.current.resetAfterColumnIndex(0);
    }
  }, [gridRef, columns, columnWidths, defaultColumnWidth]);
  (0, _react.useEffect)(function () {
    if (gridRef.current && rowHeightsOptions) {
      gridRef.current.resetAfterRowIndex(0);
    }
  }, [gridRef, pagination === null || pagination === void 0 ? void 0 : pagination.pageIndex, rowHeightsOptions, gridStyles === null || gridStyles === void 0 ? void 0 : gridStyles.cellPadding, gridStyles === null || gridStyles === void 0 ? void 0 : gridStyles.fontSize]);
  (0, _react.useEffect)(function () {
    if (gridRef.current) {
      gridRef.current.resetAfterRowIndex(0);
    }
  }, [gridRef, getRowHeight]);
  return _test.IS_JEST_ENVIRONMENT || finalWidth > 0 ? (0, _react2.jsx)(DataGridWrapperRowsContext.Provider, {
    value: {
      headerRowHeight: headerRowHeight,
      headerRow: headerRow,
      footerRow: footerRow
    }
  }, (0, _react2.jsx)(_reactWindow.VariableSizeGrid, (0, _extends2.default)({}, virtualizationOptions ? virtualizationOptions : {}, {
    ref: gridRef,
    onItemsRendered: function onItemsRendered(itemsRendered) {
      gridItemsRendered.current = itemsRendered;
    },
    innerElementType: InnerElement,
    outerRef: outerGridRef,
    innerRef: innerGridRef,
    className: "euiDataGrid__virtualized",
    columnCount: visibleColCount,
    width: finalWidth,
    columnWidth: getColumnWidth,
    height: finalHeight,
    rowHeight: getRowHeight,
    itemData: {
      schemaDetectors: schemaDetectors,
      setRowHeight: setRowHeight,
      leadingControlColumns: leadingControlColumns,
      trailingControlColumns: trailingControlColumns,
      columns: columns,
      visibleColCount: visibleColCount,
      schema: schema,
      popoverContents: popoverContents,
      columnWidths: columnWidths,
      defaultColumnWidth: defaultColumnWidth,
      renderCellValue: renderCellValue,
      interactiveCellId: interactiveCellId,
      rowHeightsOptions: rowHeightsOptions,
      rowHeightUtils: rowHeightUtils,
      rowManager: rowManager
    },
    rowCount: _test.IS_JEST_ENVIRONMENT || headerRowHeight > 0 ? visibleRowCount : 0
  }), Cell)) : null;
};

exports.EuiDataGridBody = EuiDataGridBody;