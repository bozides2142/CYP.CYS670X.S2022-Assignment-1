"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiStep = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _title = require("../title");

var _step_number = require("./step_number");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiStep = function EuiStep(_ref) {
  var className = _ref.className,
      children = _ref.children,
      _ref$headingElement = _ref.headingElement,
      headingElement = _ref$headingElement === void 0 ? 'p' : _ref$headingElement,
      _ref$step = _ref.step,
      step = _ref$step === void 0 ? 1 : _ref$step,
      title = _ref.title,
      _ref$titleSize = _ref.titleSize,
      titleSize = _ref$titleSize === void 0 ? 's' : _ref$titleSize,
      status = _ref.status,
      rest = _objectWithoutProperties(_ref, ["className", "children", "headingElement", "step", "title", "titleSize", "status"]);

  var classes = (0, _classnames.default)('euiStep', {
    'euiStep--small': titleSize === 'xs',
    'euiStep-isDisabled': status === 'disabled'
  }, className);
  var numberClasses = (0, _classnames.default)('euiStep__circle', {
    'euiStepNumber--small': titleSize === 'xs'
  });
  return (0, _react2.jsx)("div", _extends({
    className: classes
  }, rest), (0, _react2.jsx)("div", {
    className: "euiStep__titleWrapper"
  }, (0, _react2.jsx)(_step_number.EuiStepNumber, {
    className: numberClasses,
    number: step,
    status: status,
    titleSize: titleSize,
    isHollow: status === 'incomplete'
  }), (0, _react2.jsx)(_title.EuiTitle, {
    size: titleSize,
    className: "euiStep__title"
  }, /*#__PURE__*/(0, _react.createElement)(headingElement, null, title))), (0, _react2.jsx)("div", {
    className: "euiStep__content"
  }, children));
};

exports.EuiStep = EuiStep;
EuiStep.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * ReactNode to render as this component's content
     */
  children: _propTypes.default.node.isRequired,

  /**
     * The HTML tag used for the title
     */
  headingElement: _propTypes.default.string,

  /**
     * The number of the step in the list of steps
     */
  step: _propTypes.default.number,
  title: _propTypes.default.string.isRequired,

  /**
     * May replace the number provided in props.step with alternate styling.
     */
  status: _propTypes.default.any,

  /**
     * Title sizing equivalent to EuiTitle, but only `m`, `s` and `xs`. Defaults to `s`
     */
  titleSize: _propTypes.default.any
};