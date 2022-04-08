"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridFooterRow = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _data_grid_cell = require("./data_grid_cell");

var _popover_utils = require("./popover_utils");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiDataGridFooterRow = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var leadingControlColumns = _ref.leadingControlColumns,
      trailingControlColumns = _ref.trailingControlColumns,
      columns = _ref.columns,
      schema = _ref.schema,
      popoverContents = _ref.popoverContents,
      columnWidths = _ref.columnWidths,
      defaultColumnWidth = _ref.defaultColumnWidth,
      className = _ref.className,
      renderCellValue = _ref.renderCellValue,
      rowIndex = _ref.rowIndex,
      interactiveCellId = _ref.interactiveCellId,
      _dataTestSubj = _ref['data-test-subj'],
      _ref$visibleRowIndex = _ref.visibleRowIndex,
      visibleRowIndex = _ref$visibleRowIndex === void 0 ? rowIndex : _ref$visibleRowIndex,
      rest = _objectWithoutProperties(_ref, ["leadingControlColumns", "trailingControlColumns", "columns", "schema", "popoverContents", "columnWidths", "defaultColumnWidth", "className", "renderCellValue", "rowIndex", "interactiveCellId", "data-test-subj", "visibleRowIndex"]);

  var classes = (0, _classnames.default)('euiDataGridRow', 'euiDataGridFooter', className);
  var dataTestSubj = (0, _classnames.default)('dataGridRow', 'dataGridFooterRow', _dataTestSubj);
  var sharedCellProps = {
    rowIndex: rowIndex,
    visibleRowIndex: visibleRowIndex,
    interactiveCellId: interactiveCellId,
    isExpandable: true
  };
  return (0, _react2.jsx)("div", _extends({
    ref: ref,
    role: "row",
    className: classes,
    "data-test-subj": dataTestSubj
  }, rest), leadingControlColumns.map(function (_ref2, i) {
    var id = _ref2.id,
        width = _ref2.width;
    return (0, _react2.jsx)(_data_grid_cell.EuiDataGridCell, _extends({}, sharedCellProps, {
      key: "".concat(id, "-").concat(rowIndex),
      colIndex: i,
      columnId: id,
      popoverContent: _popover_utils.DefaultColumnFormatter,
      width: width,
      renderCellValue: function renderCellValue() {
        return null;
      },
      className: "euiDataGridFooterCell euiDataGridRowCell--controlColumn"
    }));
  }), columns.map(function (_ref3, i) {
    var id = _ref3.id;
    var columnType = schema[id] ? schema[id].columnType : null;
    var popoverContent = columnType && popoverContents[columnType] || _popover_utils.DefaultColumnFormatter;
    var width = columnWidths[id] || defaultColumnWidth;
    var columnPosition = i + leadingControlColumns.length;
    return (0, _react2.jsx)(_data_grid_cell.EuiDataGridCell, _extends({}, sharedCellProps, {
      key: "".concat(id, "-").concat(rowIndex),
      colIndex: columnPosition,
      columnId: id,
      columnType: columnType,
      popoverContent: popoverContent,
      width: width || undefined,
      renderCellValue: renderCellValue,
      className: "euiDataGridFooterCell"
    }));
  }), trailingControlColumns.map(function (_ref4, i) {
    var id = _ref4.id,
        width = _ref4.width;
    var colIndex = i + columns.length + leadingControlColumns.length;
    return (0, _react2.jsx)(_data_grid_cell.EuiDataGridCell, _extends({}, sharedCellProps, {
      key: "".concat(id, "-").concat(rowIndex),
      colIndex: colIndex,
      columnId: id,
      popoverContent: _popover_utils.DefaultColumnFormatter,
      width: width,
      renderCellValue: function renderCellValue() {
        return null;
      },
      className: "euiDataGridFooterCell euiDataGridRowCell--controlColumn"
    }));
  }));
}));
exports.EuiDataGridFooterRow = EuiDataGridFooterRow;
EuiDataGridFooterRow.displayName = 'EuiDataGridFooterRow';