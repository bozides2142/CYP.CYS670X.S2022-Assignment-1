"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridPaginationRenderer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _i18n = require("../../i18n");

var _table_pagination = require("../../table/table_pagination");

var _focus = require("./focus");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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