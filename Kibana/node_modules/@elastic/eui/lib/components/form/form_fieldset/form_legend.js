"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFormLegend = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _accessibility = require("../../accessibility");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiFormLegend = function EuiFormLegend(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$display = _ref.display,
      display = _ref$display === void 0 ? 'visible' : _ref$display,
      compressed = _ref.compressed,
      rest = _objectWithoutProperties(_ref, ["children", "className", "display", "compressed"]);

  var isLegendHidden = display === 'hidden';
  var classes = (0, _classnames.default)('euiFormLegend', {
    'euiFormLegend-isHidden': isLegendHidden,
    'euiFormLegend--compressed': compressed
  }, className);
  return (0, _react2.jsx)("legend", _extends({
    className: classes
  }, rest), isLegendHidden ? (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, children)) : children);
};

exports.EuiFormLegend = EuiFormLegend;
EuiFormLegend.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * ReactNode to render as this component's content
       */
  children: _propTypes.default.node.isRequired,

  /**
       * For a hidden legend that is still visible to the screen reader, set to 'hidden'
       */
  display: _propTypes.default.oneOf(["hidden", "visible"]),
  compressed: _propTypes.default.bool
};