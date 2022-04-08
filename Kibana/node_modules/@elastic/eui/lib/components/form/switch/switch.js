"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSwitch = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _accessibility = require("../../../services/accessibility");

var _icon = require("../../icon");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiSwitch = function EuiSwitch(_ref) {
  var label = _ref.label,
      id = _ref.id,
      checked = _ref.checked,
      disabled = _ref.disabled,
      compressed = _ref.compressed,
      onChange = _ref.onChange,
      className = _ref.className,
      _ref$showLabel = _ref.showLabel,
      showLabel = _ref$showLabel === void 0 ? true : _ref$showLabel,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      labelProps = _ref.labelProps,
      rest = _objectWithoutProperties(_ref, ["label", "id", "checked", "disabled", "compressed", "onChange", "className", "showLabel", "type", "labelProps"]);

  var switchId = (0, _accessibility.useGeneratedHtmlId)({
    conditionalId: id
  });
  var labelId = (0, _accessibility.useGeneratedHtmlId)({
    conditionalId: labelProps === null || labelProps === void 0 ? void 0 : labelProps.id
  });
  var onClick = (0, _react.useCallback)(function (e) {
    if (disabled) {
      return;
    }

    var event = e;
    event.target.checked = !checked;
    onChange(event);
  }, [checked, disabled, onChange]);
  var classes = (0, _classnames.default)('euiSwitch', {
    'euiSwitch--compressed': compressed
  }, className);
  var labelClasses = (0, _classnames.default)('euiSwitch__label', labelProps === null || labelProps === void 0 ? void 0 : labelProps.className);

  if (showLabel === false && typeof label !== 'string') {
    console.warn('EuiSwitch `label` must be a string when `showLabel` is false.');
  }

  return (0, _react2.jsx)("div", {
    className: classes
  }, (0, _react2.jsx)("button", _extends({
    id: switchId,
    "aria-checked": checked || false,
    className: "euiSwitch__button",
    role: "switch",
    type: type,
    disabled: disabled,
    onClick: onClick,
    "aria-label": showLabel ? undefined : label,
    "aria-labelledby": showLabel ? labelId : undefined
  }, rest), (0, _react2.jsx)("span", {
    className: "euiSwitch__body"
  }, (0, _react2.jsx)("span", {
    className: "euiSwitch__thumb"
  }), (0, _react2.jsx)("span", {
    className: "euiSwitch__track"
  }, !compressed && (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_icon.EuiIcon, {
    type: "cross",
    size: "m",
    className: "euiSwitch__icon"
  }), (0, _react2.jsx)(_icon.EuiIcon, {
    type: "check",
    size: "m",
    className: "euiSwitch__icon euiSwitch__icon--checked"
  }))))), showLabel && // <button> + <label> has poor screen reader support.
  // Click handler added to simulate natural, secondary <label> interactivity.
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  (0, _react2.jsx)("span", _extends({}, labelProps, {
    className: labelClasses,
    id: labelId,
    onClick: onClick
  }), label));
};

exports.EuiSwitch = EuiSwitch;
EuiSwitch.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Whether to render the render the text label
       */
  showLabel: _propTypes.default.bool,

  /**
       * Must be a string if `showLabel` prop is false
       */
  label: _propTypes.default.oneOfType([_propTypes.default.node.isRequired, _propTypes.default.string.isRequired]).isRequired,
  checked: _propTypes.default.bool.isRequired,
  onChange: _propTypes.default.func.isRequired,
  disabled: _propTypes.default.bool,
  compressed: _propTypes.default.bool,
  type: _propTypes.default.oneOf(["submit", "reset", "button"]),

  /**
       * Object of props passed to the label's <span/>
       */
  labelProps: _propTypes.default.shape({
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  })
};