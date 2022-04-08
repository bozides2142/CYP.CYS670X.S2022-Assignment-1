"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiColorPaletteDisplay = exports.SIZES = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _color_palette_display_fixed = require("./color_palette_display_fixed");

var _color_palette_display_gradient = require("./color_palette_display_gradient");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var sizeToClassNameMap = {
  xs: 'euiColorPaletteDisplay--sizeExtraSmall',
  s: 'euiColorPaletteDisplay--sizeSmall',
  m: 'euiColorPaletteDisplay--sizeMedium'
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;

var EuiColorPaletteDisplay = function EuiColorPaletteDisplay(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'fixed' : _ref$type,
      palette = _ref.palette,
      className = _ref.className,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 's' : _ref$size,
      rest = _objectWithoutProperties(_ref, ["type", "palette", "className", "size"]);

  var classes = (0, _classnames.default)('euiColorPaletteDisplay', className, sizeToClassNameMap[size]);
  return (0, _react2.jsx)(_react.default.Fragment, null, type === 'fixed' ? (0, _react2.jsx)(_color_palette_display_fixed.EuiColorPaletteDisplayFixed, _extends({
    className: classes,
    palette: palette
  }, rest)) : (0, _react2.jsx)(_color_palette_display_gradient.EuiColorPaletteDisplayGradient, _extends({
    className: classes,
    palette: palette
  }, rest)));
};

exports.EuiColorPaletteDisplay = EuiColorPaletteDisplay;
EuiColorPaletteDisplay.propTypes = {
  /**
     * Height of the palette display
     */
  size: _propTypes.default.oneOf(["xs", "s", "m"]),

  /**
     *   Specify the type of palette.
     *  `gradient`: each color fades into the next.
     */

  /**
     *  `fixed`: individual color blocks.
     */
  type: _propTypes.default.oneOfType([_propTypes.default.oneOf(["fixed"]), _propTypes.default.oneOf(["gradient"]).isRequired]),
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Array of color `strings` or an array of #ColorStop. The stops must be numbers in an ordered range.
     */

  /**
     * Array of color `strings` or an array of #ColorStop. The stops must be numbers in an ordered range.
     */
  palette: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string.isRequired).isRequired, _propTypes.default.arrayOf(_propTypes.default.shape({
    stop: _propTypes.default.number.isRequired,
    color: _propTypes.default.string.isRequired
  }).isRequired).isRequired]).isRequired
};