"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiKeyPadMenu = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_label = require("../form/form_label/form_label");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiKeyPadMenu = function EuiKeyPadMenu(_ref) {
  var children = _ref.children,
      className = _ref.className,
      checkable = _ref.checkable,
      rest = _objectWithoutProperties(_ref, ["children", "className", "checkable"]);

  var classes = (0, _classnames.default)('euiKeyPadMenu', className);
  var legend = _typeof(checkable) === 'object' && checkable.legend ? (0, _react2.jsx)(_form_label.EuiFormLabel, _extends({}, checkable.legendProps, {
    type: "legend"
  }), checkable.legend) : undefined;
  return checkable ? (0, _react2.jsx)("fieldset", _extends({
    className: classes,
    "aria-label": _typeof(checkable) === 'object' ? checkable.ariaLegend : undefined
  }, rest), legend, children) : (0, _react2.jsx)("ul", _extends({
    className: classes
  }, rest), _react.default.Children.map(children, function (child) {
    return (0, _react2.jsx)("li", null, child);
  }));
};

exports.EuiKeyPadMenu = EuiKeyPadMenu;
EuiKeyPadMenu.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Renders the the group as a `fieldset`.
       * Set to `true` to customize the labelling, or pass an #EuiKeyPadMenuCheckableProps object to add a `legend` or `ariaLegend`
       */
  checkable: _propTypes.default.oneOfType([_propTypes.default.shape({
    /**
         * Rendered within a `legend` to label the `fieldset`.
         * To create a visually hidden legend, use `ariaLegend`
         */
    legend: _propTypes.default.node,

    /**
         * Pass through props to a `EuiFormLabel` component, except for `type`
         */
    legendProps: _propTypes.default.any,

    /**
         * Custom aria-attribute for creating a *visually hidden* legend.
         * To create a visible legend, use `legend`
         */
    ariaLegend: _propTypes.default.string
  }).isRequired, _propTypes.default.oneOf([true])])
};