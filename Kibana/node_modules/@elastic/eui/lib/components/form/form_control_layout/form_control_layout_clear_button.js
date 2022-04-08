"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFormControlLayoutClearButton = exports.SIZES = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _icon = require("../../icon");

var _i18n = require("../../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var sizeToClassNameMap = {
  s: 'euiFormControlLayoutClearButton--small',
  m: null
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;

var EuiFormControlLayoutClearButton = function EuiFormControlLayoutClearButton(_ref) {
  var className = _ref.className,
      onClick = _ref.onClick,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      rest = _objectWithoutProperties(_ref, ["className", "onClick", "size"]);

  var classes = (0, _classnames.default)('euiFormControlLayoutClearButton', sizeToClassNameMap[size], className);
  return (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiFormControlLayoutClearButton.label",
    default: "Clear input"
  }, function (label) {
    return (0, _react2.jsx)("button", _extends({
      type: "button",
      className: classes,
      onClick: onClick,
      "aria-label": label
    }, rest), (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiFormControlLayoutClearButton__icon",
      type: "cross"
    }));
  });
};

exports.EuiFormControlLayoutClearButton = EuiFormControlLayoutClearButton;
EuiFormControlLayoutClearButton.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  size: _propTypes.default.any
};