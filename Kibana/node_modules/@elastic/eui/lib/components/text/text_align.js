"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTextAlign = exports.ALIGNMENTS = exports.alignmentToClassNameMap = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var alignmentToClassNameMap = {
  left: 'euiTextAlign--left',
  right: 'euiTextAlign--right',
  center: 'euiTextAlign--center'
};
exports.alignmentToClassNameMap = alignmentToClassNameMap;
var ALIGNMENTS = (0, _common.keysOf)(alignmentToClassNameMap);
exports.ALIGNMENTS = ALIGNMENTS;

var EuiTextAlign = function EuiTextAlign(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$textAlign = _ref.textAlign,
      textAlign = _ref$textAlign === void 0 ? 'left' : _ref$textAlign,
      rest = _objectWithoutProperties(_ref, ["children", "className", "textAlign"]);

  var classes = (0, _classnames.default)('euiTextAlign', alignmentToClassNameMap[textAlign], className);
  return (0, _react2.jsx)("div", _extends({
    className: classes
  }, rest), children);
};

exports.EuiTextAlign = EuiTextAlign;
EuiTextAlign.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  textAlign: _propTypes.default.oneOf(["left", "right", "center"])
};