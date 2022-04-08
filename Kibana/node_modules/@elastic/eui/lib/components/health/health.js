"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiHealth = exports.TEXT_SIZES = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _icon = require("../icon");

var _flex = require("../flex");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var sizeToClassNameMap = {
  xs: 'euiHealth--textSizeXS',
  s: 'euiHealth--textSizeS',
  m: 'euiHealth--textSizeM',
  inherit: 'euiHealth--textSizeInherit'
};
var TEXT_SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.TEXT_SIZES = TEXT_SIZES;

var EuiHealth = function EuiHealth(_ref) {
  var children = _ref.children,
      className = _ref.className,
      color = _ref.color,
      _ref$textSize = _ref.textSize,
      textSize = _ref$textSize === void 0 ? 's' : _ref$textSize,
      rest = _objectWithoutProperties(_ref, ["children", "className", "color", "textSize"]);

  var classes = (0, _classnames.default)('euiHealth', textSize ? sizeToClassNameMap[textSize] : null, className);
  return (0, _react2.jsx)("div", _extends({
    className: classes
  }, rest), (0, _react2.jsx)(_flex.EuiFlexGroup, {
    gutterSize: "xs",
    alignItems: "center",
    responsive: false
  }, (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, (0, _react2.jsx)(_icon.EuiIcon, {
    type: "dot",
    color: color
  })), (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, children)));
};

exports.EuiHealth = EuiHealth;
EuiHealth.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Sets the color of the dot icon.
       * It accepts any `IconColor`: `default`, `primary`, `success`, `accent`, `warning`, `danger`, `text`,
       * `subdued` or `ghost`; or any valid CSS color value as a `string`
       */
  color: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.oneOf(["default", "primary", "success", "accent", "warning", "danger", "text", "subdued", "ghost", "inherit"]).isRequired]),

  /**
       * Matches the text scales of EuiText.
       * The `inherit` style will get its font size from the parent element
       */
  textSize: _propTypes.default.any
};