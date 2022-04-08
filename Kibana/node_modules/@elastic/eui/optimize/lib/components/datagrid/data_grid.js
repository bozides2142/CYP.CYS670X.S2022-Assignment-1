"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGrid = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _services = require("../../services");

var _focus_trap = require("../focus_trap");

var _i18n = require("../i18n");

var _mutation_observer = require("../observer/mutation_observer");

var _resize_observer = require("../observer/resize_observer");

var _body = require("./body");

var _controls = require("./controls");

var _sorting = require("./utils/sorting");

var _focus = require("./utils/focus");

var _in_memory = require("./utils/in_memory");

var _header_is_interactive = require("./body/header/header_is_interactive");

var _popover_utils = require("./body/popover_utils");

var _row_count = require("./utils/row_count");

var _data_grid_pagination = require("./utils/data_grid_pagination");

var _data_grid_schema = require("./utils/data_grid_schema");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Each gridStyle object above sets a specific CSS select to .euiGrid
var fontSizesToClassMap = {
  s: 'euiDataGrid--fontSizeSmall',
  m: '',
  l: 'euiDataGrid--fontSizeLarge'
};
var headerToClassMap = {
  shade: 'euiDataGrid--headerShade',
  underline: 'euiDataGrid--headerUnderline'
};
var footerToClassMap = {
  shade: 'euiDataGrid--footerShade',
  overline: 'euiDataGrid--footerOverline',
  striped: ''
};
var rowHoverToClassMap = {
  highlight: 'euiDataGrid--rowHoverHighlight',
  none: ''
};
var bordersToClassMap = {
  all: 'euiDataGrid--bordersAll',
  horizontal: 'euiDataGrid--bordersHorizontal',
  none: 'euiDataGrid--bordersNone'
};
var cellPaddingsToClassMap = {
  s: 'euiDataGrid--paddingSmall',
  m: '',
  l: 'euiDataGrid--paddingLarge'
};

var EuiDataGrid = function EuiDataGrid(props) {
  var _gridItemsRendered$cu;

  var _props$leadingControl = props.leadingControlColumns,
      leadingControlColumns = _props$leadingControl === void 0 ? [] : _props$leadingControl,
      _props$trailingContro = props.trailingControlColumns,
      trailingControlColumns = _props$trailingContro === void 0 ? [] : _props$trailingContro,
      columns = props.columns,
      columnVisibility = props.columnVisibility,
      schemaDetectors = props.schemaDetectors,
      rowCount = props.rowCount,
      renderCellValue = props.renderCellValue,
      renderFooterCellValue = props.renderFooterCellValue,
      className = props.className,
      gridStyle = props.gridStyle,
      _props$toolbarVisibil = props.toolbarVisibility,
      toolbarVisibility = _props$toolbarVisibil === void 0 ? true : _props$toolbarVisibil,
      pagination = props.pagination,
      sorting = props.sorting,
      inMemory = props.inMemory,
      popoverContents = props.popoverContents,
      onColumnResize = props.onColumnResize,
      minSizeForControls = props.minSizeForControls,
      height = props.height,
      width = props.width,
      _rowHeightsOptions = props.rowHeightsOptions,
      virtualizationOptions = props.virtualizationOptions,
      rest = (0, _objectWithoutProperties2.default)(props, ["leadingControlColumns", "trailingControlColumns", "columns", "columnVisibility", "schemaDetectors", "rowCount", "renderCellValue", "renderFooterCellValue", "className", "gridStyle", "toolbarVisibility", "pagination", "sorting", "inMemory", "popoverContents", "onColumnResize", "minSizeForControls", "height", "width", "rowHeightsOptions", "virtualizationOptions"]);
  /**
   * Merge consumer settings with defaults
   */

  var gridStyleWithDefaults = (0, _react.useMemo)(function () {
    return _objectSpread(_objectSpread({}, _controls.startingStyles), gridStyle);
  }, [gridStyle]);
  var mergedPopoverContents = (0, _react.useMemo)(function () {
    return _objectSpread(_objectSpread({}, _popover_utils.providedPopoverContents), popoverContents);
  }, [popoverContents]);

  var _useInMemoryValues = (0, _in_memory.useInMemoryValues)(inMemory, rowCount),
      _useInMemoryValues2 = (0, _slicedToArray2.default)(_useInMemoryValues, 2),
      inMemoryValues = _useInMemoryValues2[0],
      onCellRender = _useInMemoryValues2[1];

  var allSchemaDetectors = (0, _react.useMemo)(function () {
    return [].concat((0, _toConsumableArray2.default)(_data_grid_schema.schemaDetectors), (0, _toConsumableArray2.default)(schemaDetectors || []));
  }, [schemaDetectors]);
  var mergedSchema = (0, _data_grid_schema.useMergedSchema)({
    columns: columns,
    inMemory: inMemory,
    inMemoryValues: inMemoryValues,
    schemaDetectors: allSchemaDetectors,
    autoDetectSchema: inMemory != null
  });
  /**
   * Grid refs & observers
   */
  // Outermost wrapper div
  // this ref needs to be managed by a state, to cause a re-render after mount
  // and passing the mounted element to the resize observer

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      resizeRef = _useState2[0],
      setResizeRef = _useState2[1];

  var _useResizeObserver = (0, _resize_observer.useResizeObserver)(resizeRef, 'width'),
      gridWidth = _useResizeObserver.width; // Wrapper div around EuiDataGridBody


  var contentRef = (0, _react.useRef)(null);
  (0, _mutation_observer.useMutationObserver)(contentRef.current, _focus.preventTabbing, {
    subtree: true,
    childList: true
  }); // Imperative handler passed back by react-window - we're setting this at
  // the top datagrid level to make passing it to other children & utils easier

  var gridRef = (0, _react.useRef)(null);
  var gridItemsRendered = (0, _react.useRef)(null);
  /**
   * Display
   */

  var displayValues = (0, _react.useMemo)(function () {
    return columns.reduce(function (acc, column) {
      return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2.default)({}, column.id, column.displayAsText || column.id));
    }, {});
  }, [columns]);

  var _useDataGridDisplaySe = (0, _controls.useDataGridDisplaySelector)((0, _controls.checkOrDefaultToolBarDisplayOptions)(toolbarVisibility, 'showDisplaySelector'), gridStyleWithDefaults, _rowHeightsOptions),
      _useDataGridDisplaySe2 = (0, _slicedToArray2.default)(_useDataGridDisplaySe, 3),
      displaySelector = _useDataGridDisplaySe2[0],
      gridStyles = _useDataGridDisplaySe2[1],
      rowHeightsOptions = _useDataGridDisplaySe2[2];
  /**
   * Column order & visibility
   */


  var _useDataGridColumnSel = (0, _controls.useDataGridColumnSelector)(columns, columnVisibility, (0, _controls.checkOrDefaultToolBarDisplayOptions)(toolbarVisibility, 'showColumnSelector'), displayValues),
      _useDataGridColumnSel2 = (0, _slicedToArray2.default)(_useDataGridColumnSel, 4),
      columnSelector = _useDataGridColumnSel2[0],
      orderedVisibleColumns = _useDataGridColumnSel2[1],
      setVisibleColumns = _useDataGridColumnSel2[2],
      switchColumnPos = _useDataGridColumnSel2[3];

  var visibleColCount = (0, _react.useMemo)(function () {
    return orderedVisibleColumns.length + leadingControlColumns.length + trailingControlColumns.length;
  }, [orderedVisibleColumns, leadingControlColumns, trailingControlColumns]);
  var visibleRows = (0, _react.useMemo)(function () {
    return (0, _row_count.computeVisibleRows)({
      pagination: pagination,
      rowCount: rowCount
    });
  }, [pagination, rowCount]);
  var visibleRowCount = visibleRows.visibleRowCount;
  /**
   * Sorting
   */

  var columnSorting = (0, _controls.useDataGridColumnSorting)(orderedVisibleColumns, sorting, mergedSchema, allSchemaDetectors, displayValues);
  var sortingContext = (0, _sorting.useSorting)({
    sorting: sorting,
    inMemory: inMemory,
    inMemoryValues: inMemoryValues,
    schema: mergedSchema,
    schemaDetectors: allSchemaDetectors,
    startRow: visibleRows.startRow
  });
  /**
   * Focus
   */

  var _useHeaderIsInteracti = (0, _header_is_interactive.useHeaderIsInteractive)(contentRef.current),
      headerIsInteractive = _useHeaderIsInteracti.headerIsInteractive,
      handleHeaderMutation = _useHeaderIsInteracti.handleHeaderMutation;

  var _useFocus = (0, _focus.useFocus)({
    headerIsInteractive: headerIsInteractive,
    gridItemsRendered: gridItemsRendered
  }),
      wrappingDivFocusProps = _useFocus.focusProps,
      focusContext = (0, _objectWithoutProperties2.default)(_useFocus, ["focusProps"]);
  /**
   * Toolbar & full-screen
   */


  var showToolbar = !!toolbarVisibility;

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isFullScreen = _useState4[0],
      setIsFullScreen = _useState4[1];

  var handleGridKeyDown = function handleGridKeyDown(event) {
    switch (event.key) {
      case _services.keys.ESCAPE:
        if (isFullScreen) {
          event.preventDefault();
          setIsFullScreen(false);
        }

        break;
    }
  };
  /**
   * Classes
   */


  var classes = (0, _classnames.default)('euiDataGrid', fontSizesToClassMap[gridStyles.fontSize], bordersToClassMap[gridStyles.border], headerToClassMap[gridStyles.header], footerToClassMap[gridStyles.footer], rowHoverToClassMap[gridStyles.rowHover], cellPaddingsToClassMap[gridStyles.cellPadding], {
    'euiDataGrid--stripes': gridStyles.stripes
  }, {
    'euiDataGrid--stickyFooter': gridStyles.footer && gridStyles.stickyFooter
  }, {
    'euiDataGrid--fullScreen': isFullScreen
  }, {
    'euiDataGrid--noControls': !toolbarVisibility
  }, className);
  var controlBtnClasses = (0, _classnames.default)('euiDataGrid__controlBtn', {
    'euiDataGrid__controlBtn--active': isFullScreen
  });
  /**
   * Accessibility
   */

  var gridId = (0, _services.useGeneratedHtmlId)();
  var interactiveCellId = (0, _services.useGeneratedHtmlId)();
  var ariaLabelledById = (0, _services.useGeneratedHtmlId)();
  var ariaLabel = (0, _i18n.useEuiI18n)('euiDataGrid.ariaLabel', '{label}; Page {page} of {pageCount}.', {
    label: rest['aria-label'],
    page: pagination ? pagination.pageIndex + 1 : 0,
    pageCount: pagination ? Math.ceil(rowCount / pagination.pageSize) : 0
  });
  var ariaLabelledBy = (0, _i18n.useEuiI18n)('euiDataGrid.ariaLabelledBy', 'Page {page} of {pageCount}.', {
    page: pagination ? pagination.pageIndex + 1 : 0,
    pageCount: pagination ? Math.ceil(rowCount / pagination.pageSize) : 0
  }); // extract aria-label and/or aria-labelledby from `rest`

  var gridAriaProps = {};

  if ('aria-label' in rest) {
    gridAriaProps['aria-label'] = pagination ? ariaLabel : rest['aria-label'];
    delete rest['aria-label'];
  }

  if ('aria-labelledby' in rest) {
    gridAriaProps['aria-labelledby'] = "".concat(rest['aria-labelledby'], " ").concat(pagination ? ariaLabelledById : '');
    delete rest['aria-labelledby'];
  }

  return (0, _react2.jsx)(_focus.DataGridFocusContext.Provider, {
    value: focusContext
  }, (0, _react2.jsx)(_sorting.DataGridSortingContext.Provider, {
    value: sortingContext
  }, (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
    disabled: !isFullScreen,
    className: "euiDataGrid__focusWrap"
  }, (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes,
    onKeyDown: handleGridKeyDown,
    style: isFullScreen ? undefined : {
      width: width,
      height: height
    },
    ref: setResizeRef
  }, rest), showToolbar && (0, _react2.jsx)(_controls.EuiDataGridToolbar, {
    gridWidth: gridWidth,
    minSizeForControls: minSizeForControls,
    toolbarVisibility: toolbarVisibility,
    displaySelector: displaySelector,
    isFullScreen: isFullScreen,
    setIsFullScreen: setIsFullScreen,
    controlBtnClasses: controlBtnClasses,
    columnSelector: columnSelector,
    columnSorting: columnSorting
  }), inMemory ? (0, _react2.jsx)(_in_memory.EuiDataGridInMemoryRenderer, {
    inMemory: inMemory,
    renderCellValue: renderCellValue,
    columns: columns,
    rowCount: inMemory.level === 'enhancements' ? // if `inMemory.level === enhancements` then we can only be sure the pagination's pageSize is available in memory
    (pagination === null || pagination === void 0 ? void 0 : pagination.pageSize) || rowCount : // otherwise, all of the data is present and usable
    rowCount,
    onCellRender: onCellRender
  }) : null, (0, _react2.jsx)("div", (0, _extends2.default)({
    // eslint-disable-line jsx-a11y/interactive-supports-focus
    ref: contentRef,
    onKeyDown: (0, _focus.createKeyDownHandler)({
      gridElement: contentRef.current,
      visibleColCount: visibleColCount,
      visibleRowCount: visibleRowCount,
      visibleRowStartIndex: ((_gridItemsRendered$cu = gridItemsRendered.current) === null || _gridItemsRendered$cu === void 0 ? void 0 : _gridItemsRendered$cu.visibleRowStartIndex) || 0,
      rowCount: rowCount,
      pagination: pagination,
      hasFooter: !!renderFooterCellValue,
      headerIsInteractive: headerIsInteractive,
      focusContext: focusContext
    }),
    "data-test-subj": "euiDataGridBody",
    className: "euiDataGrid__content",
    role: "grid",
    id: gridId
  }, wrappingDivFocusProps, gridAriaProps), (0, _react2.jsx)(_body.EuiDataGridBody, {
    columns: orderedVisibleColumns,
    visibleColCount: visibleColCount,
    leadingControlColumns: leadingControlColumns,
    schema: mergedSchema,
    trailingControlColumns: trailingControlColumns,
    setVisibleColumns: setVisibleColumns,
    switchColumnPos: switchColumnPos,
    onColumnResize: onColumnResize,
    headerIsInteractive: headerIsInteractive,
    handleHeaderMutation: handleHeaderMutation,
    schemaDetectors: allSchemaDetectors,
    popoverContents: mergedPopoverContents,
    pagination: pagination,
    renderCellValue: renderCellValue,
    renderFooterCellValue: renderFooterCellValue,
    rowCount: rowCount,
    visibleRows: visibleRows,
    interactiveCellId: interactiveCellId,
    rowHeightsOptions: rowHeightsOptions,
    virtualizationOptions: virtualizationOptions || {},
    isFullScreen: isFullScreen,
    gridStyles: gridStyles,
    gridWidth: gridWidth,
    gridRef: gridRef,
    gridItemsRendered: gridItemsRendered,
    wrapperRef: contentRef
  })), pagination && props['aria-labelledby'] && (0, _react2.jsx)("p", {
    id: ariaLabelledById,
    hidden: true
  }, ariaLabelledBy), pagination && (0, _react2.jsx)(_data_grid_pagination.EuiDataGridPaginationRenderer, (0, _extends2.default)({}, pagination, {
    rowCount: rowCount,
    controls: gridId,
    "aria-label": props['aria-label']
  })), (0, _react2.jsx)("p", {
    id: interactiveCellId,
    hidden: true
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiDataGrid.screenReaderNotice",
    default: "Cell contains interactive content."
  }))))));
};

exports.EuiDataGrid = EuiDataGrid;