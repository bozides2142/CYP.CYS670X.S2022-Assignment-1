"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCheckableCard = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../../form");

var _panel = require("../../panel");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiCheckableCard = function EuiCheckableCard(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$checkableType = _ref.checkableType,
      checkableType = _ref$checkableType === void 0 ? 'radio' : _ref$checkableType,
      label = _ref.label,
      checked = _ref.checked,
      disabled = _ref.disabled,
      hasShadow = _ref.hasShadow,
      _ref$hasBorder = _ref.hasBorder,
      hasBorder = _ref$hasBorder === void 0 ? true : _ref$hasBorder,
      rest = _objectWithoutProperties(_ref, ["children", "className", "checkableType", "label", "checked", "disabled", "hasShadow", "hasBorder"]);

  var id = rest.id;
  var labelEl = (0, _react.useRef)(null);
  var classes = (0, _classnames.default)('euiCheckableCard', {
    'euiCheckableCard-isChecked': checked,
    'euiCheckableCard-isDisabled': disabled
  }, className);
  var checkableElement;

  if (checkableType === 'radio') {
    checkableElement = (0, _react2.jsx)(_form.EuiRadio, _extends({
      checked: checked,
      disabled: disabled
    }, rest));
  } else {
    checkableElement = (0, _react2.jsx)(_form.EuiCheckbox, _extends({
      checked: checked,
      disabled: disabled
    }, rest));
  }

  var labelClasses = (0, _classnames.default)('euiCheckableCard__label', {
    'euiCheckableCard__label-isDisabled': disabled
  });

  var onChangeAffordance = function onChangeAffordance() {
    if (labelEl.current) {
      labelEl.current.click();
    }
  };

  return (0, _react2.jsx)(_panel.EuiSplitPanel.Outer, {
    responsive: false,
    hasShadow: hasShadow,
    hasBorder: hasBorder,
    direction: "row",
    className: classes
  }, (0, _react2.jsx)(_panel.EuiSplitPanel.Inner, {
    // Bubbles up the change event when clicking on the whole div for extra affordance
    onClick: disabled ? undefined : onChangeAffordance,
    color: checked ? 'primary' : 'subdued',
    grow: false
  }, checkableElement), (0, _react2.jsx)(_panel.EuiSplitPanel.Inner, null, (0, _react2.jsx)("label", {
    ref: labelEl,
    className: labelClasses,
    htmlFor: id,
    "aria-describedby": children ? "".concat(id, "-details") : undefined
  }, label), children && (0, _react2.jsx)("div", {
    id: "".concat(id, "-details"),
    className: "euiCheckableCard__children"
  }, children)));
};

exports.EuiCheckableCard = EuiCheckableCard;
EuiCheckableCard.propTypes = {
  id: _propTypes.default.string.isRequired,
  label: _propTypes.default.node.isRequired,
  hasShadow: _propTypes.default.any,
  hasBorder: _propTypes.default.any
};