"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridCellPopover = EuiDataGridCellPopover;

var _react = _interopRequireDefault(require("react"));

var _services = require("../../../services");

var _button_empty = require("../../button/button_empty");

var _flex = require("../../flex");

var _popover = require("../../popover");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function EuiDataGridCellPopover(_ref) {
  var anchorContent = _ref.anchorContent,
      cellContentProps = _ref.cellContentProps,
      cellContentsRef = _ref.cellContentsRef,
      closePopover = _ref.closePopover,
      column = _ref.column,
      panelRefFn = _ref.panelRefFn,
      PopoverContent = _ref.popoverContent,
      popoverIsOpen = _ref.popoverIsOpen,
      renderCellValue = _ref.renderCellValue,
      rowIndex = _ref.rowIndex;
  var CellElement = renderCellValue;
  return (0, _react2.jsx)(_popover.EuiPopover, {
    hasArrow: false,
    anchorClassName: "euiDataGridRowCell__expand",
    button: anchorContent,
    isOpen: popoverIsOpen,
    panelRef: panelRefFn,
    panelClassName: "euiDataGridRowCell__popover",
    panelPaddingSize: "s",
    display: "block",
    closePopover: closePopover,
    panelProps: {
      'data-test-subj': 'euiDataGridExpansionPopover'
    },
    onKeyDown: function onKeyDown(event) {
      if (event.key === _services.keys.F2 || event.key === _services.keys.ESCAPE) {
        event.preventDefault();
        event.stopPropagation();
        closePopover();
      }
    }
  }, popoverIsOpen ? (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(PopoverContent, {
    cellContentsElement: cellContentsRef
  }, (0, _react2.jsx)(CellElement, _extends({}, cellContentProps, {
    isDetails: true
  }))), column && column.cellActions && column.cellActions.length ? (0, _react2.jsx)(_popover.EuiPopoverFooter, null, (0, _react2.jsx)(_flex.EuiFlexGroup, {
    gutterSize: "s"
  }, column.cellActions.map(function (Action, idx) {
    var CellButtonElement = Action;
    return (0, _react2.jsx)(_flex.EuiFlexItem, {
      key: idx
    }, (0, _react2.jsx)(CellButtonElement, {
      rowIndex: rowIndex,
      columnId: column.id,
      Component: function Component(props) {
        return (0, _react2.jsx)(_button_empty.EuiButtonEmpty, _extends({}, props, {
          size: "s"
        }));
      },
      isExpanded: true,
      closePopover: closePopover
    }));
  }))) : null) : null);
}