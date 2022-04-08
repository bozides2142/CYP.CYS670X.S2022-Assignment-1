"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPanel = exports.COLORS = exports.BORDER_RADII = exports.SIZES = exports.panelPaddingValues = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var panelPaddingValues = {
  none: 0,
  s: 8,
  m: 16,
  l: 24
};
exports.panelPaddingValues = panelPaddingValues;
var paddingSizeToClassNameMap = {
  none: null,
  s: 'euiPanel--paddingSmall',
  m: 'euiPanel--paddingMedium',
  l: 'euiPanel--paddingLarge'
};
var SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.SIZES = SIZES;
var borderRadiusToClassNameMap = {
  none: 'euiPanel--borderRadiusNone',
  m: 'euiPanel--borderRadiusMedium'
};
var BORDER_RADII = (0, _common.keysOf)(borderRadiusToClassNameMap);
exports.BORDER_RADII = BORDER_RADII;
var COLORS = ['transparent', 'plain', 'subdued', 'accent', 'primary', 'success', 'warning', 'danger'];
exports.COLORS = COLORS;

var EuiPanel = function EuiPanel(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'm' : _ref$paddingSize,
      _ref$borderRadius = _ref.borderRadius,
      borderRadius = _ref$borderRadius === void 0 ? 'm' : _ref$borderRadius,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'plain' : _ref$color,
      _ref$hasShadow = _ref.hasShadow,
      hasShadow = _ref$hasShadow === void 0 ? true : _ref$hasShadow,
      hasBorder = _ref.hasBorder,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? true : _ref$grow,
      panelRef = _ref.panelRef,
      element = _ref.element,
      rest = _objectWithoutProperties(_ref, ["children", "className", "paddingSize", "borderRadius", "color", "hasShadow", "hasBorder", "grow", "panelRef", "element"]);

  // Shadows are only allowed when there's a white background (plain)
  var canHaveShadow = color === 'plain';
  var canHaveBorder = color === 'plain' || color === 'transparent';
  var classes = (0, _classnames.default)('euiPanel', paddingSizeToClassNameMap[paddingSize], borderRadiusToClassNameMap[borderRadius], "euiPanel--".concat(color), {
    // The `no` classes turn off the option for default theme
    // While the `has` classes turn it on for Amsterdam
    'euiPanel--hasShadow': canHaveShadow && hasShadow === true,
    'euiPanel--noShadow': !canHaveShadow || hasShadow === false,
    'euiPanel--hasBorder': canHaveBorder && hasBorder === true,
    'euiPanel--noBorder': !canHaveBorder || hasBorder === false,
    'euiPanel--flexGrowZero': !grow,
    'euiPanel--isClickable': rest.onClick
  }, className);

  if (rest.onClick && element !== 'div') {
    return (0, _react2.jsx)("button", _extends({
      ref: panelRef,
      className: classes
    }, rest), children);
  }

  return (0, _react2.jsx)("div", _extends({
    ref: panelRef,
    className: classes
  }, rest), children);
};

exports.EuiPanel = EuiPanel;
EuiPanel.propTypes = {
  element: _propTypes.default.oneOfType([_propTypes.default.oneOf(["button"]), _propTypes.default.oneOf(["div"])]),

  /**
     * Adds a medium shadow to the panel;
     * Only works when `color="plain"`
     */

  /**
     * Adds a medium shadow to the panel;
     * Only works when `color="plain"`
     */
  hasShadow: _propTypes.default.bool,

  /**
     * Adds a slight 1px border on all edges.
     * Only works when `color="plain | transparent"`
     * Default is `undefined` and will default to that theme's panel style
     */

  /**
     * Adds a slight 1px border on all edges.
     * Only works when `color="plain | transparent"`
     * Default is `undefined` and will default to that theme's panel style
     */
  hasBorder: _propTypes.default.bool,

  /**
     * Padding for all four sides
     */

  /**
     * Padding for all four sides
     */
  paddingSize: _propTypes.default.any,

  /**
     * Corner border radius
     */

  /**
     * Corner border radius
     */
  borderRadius: _propTypes.default.any,

  /**
     * When true the panel will grow in height to match `EuiFlexItem`
     */

  /**
     * When true the panel will grow in height to match `EuiFlexItem`
     */
  grow: _propTypes.default.bool,
  panelRef: _propTypes.default.any,

  /**
     * Background color of the panel;
     * Usually a lightened form of the brand colors
     */

  /**
     * Background color of the panel;
     * Usually a lightened form of the brand colors
     */
  color: _propTypes.default.any,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};