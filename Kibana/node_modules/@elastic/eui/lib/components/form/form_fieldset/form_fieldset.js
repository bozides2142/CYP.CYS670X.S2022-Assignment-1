"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFormFieldset = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _form_legend = require("./form_legend");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiFormFieldset = function EuiFormFieldset(_ref) {
  var children = _ref.children,
      className = _ref.className,
      legend = _ref.legend,
      rest = _objectWithoutProperties(_ref, ["children", "className", "legend"]);

  var legendDisplay = !!legend && (0, _react2.jsx)(_form_legend.EuiFormLegend, legend);
  return (0, _react2.jsx)("fieldset", _extends({
    className: className
  }, rest), legendDisplay, children);
};

exports.EuiFormFieldset = EuiFormFieldset;
EuiFormFieldset.propTypes = {
  /**
     * Adds an EuiFormLegend element as the first child
     */
  legend: _propTypes.default.shape({
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
  }),
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};