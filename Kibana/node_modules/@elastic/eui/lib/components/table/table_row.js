"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTableRow = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiTableRow = function EuiTableRow(_ref) {
  var children = _ref.children,
      className = _ref.className,
      isSelected = _ref.isSelected,
      isSelectable = _ref.isSelectable,
      hasActions = _ref.hasActions,
      isExpandedRow = _ref.isExpandedRow,
      isExpandable = _ref.isExpandable,
      onClick = _ref.onClick,
      rest = _objectWithoutProperties(_ref, ["children", "className", "isSelected", "isSelectable", "hasActions", "isExpandedRow", "isExpandable", "onClick"]);

  var classes = (0, _classnames.default)('euiTableRow', className, {
    'euiTableRow-isSelectable': isSelectable,
    'euiTableRow-isSelected': isSelected,
    'euiTableRow-hasActions': hasActions,
    'euiTableRow-isExpandedRow': isExpandedRow,
    'euiTableRow-isExpandable': isExpandable,
    'euiTableRow-isClickable': onClick
  });

  if (!onClick) {
    return (0, _react2.jsx)("tr", _extends({
      className: classes
    }, rest), children);
  }

  var onKeyDown = function onKeyDown(event) {
    // Prevent a scroll from occurring if the user has hit space.
    if (event.key === _services.keys.SPACE) event.preventDefault();
  };

  var onKeyUp = function onKeyUp(event) {
    // Support keyboard accessibility by emulating mouse click on ENTER or SPACE keypress.
    if (event.key === _services.keys.ENTER || event.key === _services.keys.SPACE) {
      onClick(event);
    }
  };

  return (0, _react2.jsx)("tr", _extends({
    className: classes,
    onClick: onClick,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    tabIndex: 0
  }, rest), children);
};

exports.EuiTableRow = EuiTableRow;
EuiTableRow.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Indicates if the table has a single column of checkboxes for selecting
     * rows (affects mobile only)
     */
  isSelectable: _propTypes.default.bool,

  /**
     * Indicates the current row has been selected
     */
  isSelected: _propTypes.default.bool,

  /**
     * Indicates if the table has a dedicated column for icon-only actions
     * (affects mobile only)
     */
  hasActions: _propTypes.default.bool,

  /**
     * Indicates if the row will have an expanded row
     */
  isExpandable: _propTypes.default.bool,

  /**
     * Indicates if the row will be the expanded row
     */
  isExpandedRow: _propTypes.default.bool,
  onClick: _propTypes.default.any
};