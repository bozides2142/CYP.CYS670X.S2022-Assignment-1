"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiForm = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _call_out = require("../call_out");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiForm = function EuiForm(_ref) {
  var children = _ref.children,
      className = _ref.className,
      isInvalid = _ref.isInvalid,
      error = _ref.error,
      _ref$component = _ref.component,
      component = _ref$component === void 0 ? 'div' : _ref$component,
      _ref$invalidCallout = _ref.invalidCallout,
      invalidCallout = _ref$invalidCallout === void 0 ? 'above' : _ref$invalidCallout,
      rest = _objectWithoutProperties(_ref, ["children", "className", "isInvalid", "error", "component", "invalidCallout"]);

  var handleFocus = (0, _react.useCallback)(function (node) {
    node === null || node === void 0 ? void 0 : node.focus();
  }, []);
  var classes = (0, _classnames.default)('euiForm', className);
  var optionalErrors = null;

  if (error) {
    var errorTexts = Array.isArray(error) ? error : [error];
    optionalErrors = (0, _react2.jsx)("ul", null, errorTexts.map(function (error, index) {
      return (0, _react2.jsx)("li", {
        className: "euiForm__error",
        key: index
      }, error);
    }));
  }

  var optionalErrorAlert;

  if (isInvalid && invalidCallout === 'above') {
    optionalErrorAlert = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiForm.addressFormErrors",
      default: "Please address the highlighted errors."
    }, function (addressFormErrors) {
      return (0, _react2.jsx)(_call_out.EuiCallOut, {
        tabIndex: -1,
        ref: handleFocus,
        className: "euiForm__errors",
        title: addressFormErrors,
        color: "danger",
        role: "alert",
        "aria-live": "assertive"
      }, optionalErrors);
    });
  }

  var Element = component;
  return (0, _react2.jsx)(Element, _extends({
    className: classes
  }, rest), optionalErrorAlert, children);
};

exports.EuiForm = EuiForm;
EuiForm.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Which HTML element to render `div` or `form`
       */
  component: _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.oneOf(["form"]).isRequired, _propTypes.default.oneOf(["div"])]), _propTypes.default.oneOf(["form", "div"])]),
  isInvalid: _propTypes.default.bool,
  error: _propTypes.default.oneOfType([_propTypes.default.node.isRequired, _propTypes.default.arrayOf(_propTypes.default.node.isRequired).isRequired]),

  /**
       * Where to display the callout with the list of errors
       */
  invalidCallout: _propTypes.default.oneOf(["above", "none"])
};