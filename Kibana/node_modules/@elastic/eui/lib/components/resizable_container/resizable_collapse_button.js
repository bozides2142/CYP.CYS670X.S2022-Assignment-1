"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiResizableCollapseButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = require("../button");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiResizableCollapseButton = function EuiResizableCollapseButton(_ref) {
  var className = _ref.className,
      externalPosition = _ref.externalPosition,
      _ref$internalPosition = _ref.internalPosition,
      internalPosition = _ref$internalPosition === void 0 ? 'middle' : _ref$internalPosition,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'horizontal' : _ref$direction,
      isVisible = _ref.isVisible,
      isCollapsed = _ref.isCollapsed,
      rest = _objectWithoutProperties(_ref, ["className", "externalPosition", "internalPosition", "direction", "isVisible", "isCollapsed"]);

  var isHorizontal = direction === 'horizontal';
  var classes = (0, _classnames.default)('euiResizableToggleButton', "euiResizableToggleButton--".concat(direction), "euiResizableToggleButton--".concat(externalPosition), "euiResizableToggleButton--".concat(internalPosition), {
    'euiResizableToggleButton-isVisible': isVisible,
    'euiResizableToggleButton-isCollapsed': isCollapsed
  }, className); // Default to simiple grab icon in case there is no externalPosition specified

  var COLLAPSED_ICON = isHorizontal ? 'grab' : 'grabHorizontal';
  var NOT_COLLAPSED_ICON = isHorizontal ? 'grab' : 'grabHorizontal';

  switch (externalPosition) {
    case 'before':
      COLLAPSED_ICON = isHorizontal ? 'menuLeft' : 'menuUp';
      NOT_COLLAPSED_ICON = isHorizontal ? 'menuRight' : 'menuDown';
      break;

    case 'after':
      COLLAPSED_ICON = isHorizontal ? 'menuRight' : 'menuDown';
      NOT_COLLAPSED_ICON = isHorizontal ? 'menuLeft' : 'menuUp';
      break;
  }

  return (0, _react2.jsx)(_button.EuiButtonIcon, _extends({
    display: isCollapsed ? 'empty' : 'fill',
    color: isCollapsed ? 'text' : 'ghost'
  }, rest, {
    className: classes,
    iconType: isCollapsed ? COLLAPSED_ICON : NOT_COLLAPSED_ICON
  }));
};

exports.EuiResizableCollapseButton = EuiResizableCollapseButton;
EuiResizableCollapseButton.propTypes = {
  /**
     * Position of the toggle button.
     * Enums based on the `direction` of the EuiResizableContainer
     */
  internalPosition: _propTypes.default.oneOf(["top", "middle", "bottom", "left", "right"]),

  /**
     * Position of the toggle button.
     * Enums based on the `direction` of the EuiResizableContainer
     */
  externalPosition: _propTypes.default.oneOf(["before", "after"]),

  /**
     * Same direction derived from EuiResizableContainer
     */
  direction: _propTypes.default.oneOf(["vertical", "horizontal"]),

  /**
     *
     */
  isVisible: _propTypes.default.bool,
  isCollapsed: _propTypes.default.bool
};