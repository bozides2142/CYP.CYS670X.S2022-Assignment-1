"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiButtonEmpty = exports.FLUSH_TYPES = exports.SIZES = exports.COLORS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _services = require("../../../services");

var _button_content = require("../button_content");

var _href_validator = require("../../../services/security/href_validator");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var colorToClassNameMap = {
  primary: 'euiButtonEmpty--primary',
  danger: 'euiButtonEmpty--danger',
  text: 'euiButtonEmpty--text',
  ghost: 'euiButtonEmpty--ghost',
  success: 'euiButtonEmpty--success',
  warning: 'euiButtonEmpty--warning'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;
var sizeToClassNameMap = {
  xs: 'euiButtonEmpty--xSmall',
  s: 'euiButtonEmpty--small',
  m: null
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;
var flushTypeToClassNameMap = {
  left: 'euiButtonEmpty--flushLeft',
  right: 'euiButtonEmpty--flushRight',
  both: 'euiButtonEmpty--flushBoth'
};
var FLUSH_TYPES = (0, _common.keysOf)(flushTypeToClassNameMap);
/**
 * Extends EuiButtonContentProps which provides
 * `iconType`, `iconSide`, and `textProps`
 */

exports.FLUSH_TYPES = FLUSH_TYPES;

var EuiButtonEmpty = function EuiButtonEmpty(_ref) {
  var children = _ref.children,
      className = _ref.className,
      iconType = _ref.iconType,
      _ref$iconSide = _ref.iconSide,
      iconSide = _ref$iconSide === void 0 ? 'left' : _ref$iconSide,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? 'm' : _ref$iconSize,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'primary' : _ref$color,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      flush = _ref.flush,
      _isDisabled = _ref.isDisabled,
      _disabled = _ref.disabled,
      isLoading = _ref.isLoading,
      href = _ref.href,
      target = _ref.target,
      rel = _ref.rel,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      buttonRef = _ref.buttonRef,
      contentProps = _ref.contentProps,
      textProps = _ref.textProps,
      isSelected = _ref.isSelected,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "iconType", "iconSide", "iconSize", "color", "size", "flush", "isDisabled", "disabled", "isLoading", "href", "target", "rel", "type", "buttonRef", "contentProps", "textProps", "isSelected"]);
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var disabled = _disabled || !isHrefValid;
  var isDisabled = _isDisabled || !isHrefValid; // If in the loading state, force disabled to true

  var buttonIsDisabled = isLoading || isDisabled || disabled;
  var classes = (0, _classnames.default)('euiButtonEmpty', colorToClassNameMap[color], size ? sizeToClassNameMap[size] : null, flush ? flushTypeToClassNameMap[flush] : null, {
    'euiButtonEmpty-isDisabled': buttonIsDisabled
  }, className);
  var contentClassNames = (0, _classnames.default)('euiButtonEmpty__content', contentProps && contentProps.className);
  var textClassNames = (0, _classnames.default)('euiButtonEmpty__text', textProps && textProps.className);
  var innerNode = (0, _react2.jsx)(_button_content.EuiButtonContent, (0, _extends2.default)({
    isLoading: isLoading,
    iconType: iconType,
    iconSide: iconSide,
    iconSize: size === 'xs' ? 's' : iconSize,
    textProps: _objectSpread(_objectSpread({}, textProps), {}, {
      className: textClassNames
    })
  }, contentProps, {
    // className has to come last to override contentProps.className
    className: contentClassNames
  }), children); // <a> elements don't respect the `disabled` attribute. So if we're disabled, we'll just pretend
  // this is a button and piggyback off its disabled styles.

  if (href && !buttonIsDisabled) {
    var secureRel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
    return (0, _react2.jsx)("a", (0, _extends2.default)({
      className: classes,
      href: href,
      target: target,
      rel: secureRel,
      ref: buttonRef
    }, rest), innerNode);
  }

  return (0, _react2.jsx)("button", (0, _extends2.default)({
    disabled: buttonIsDisabled,
    className: classes,
    type: type,
    ref: buttonRef,
    "aria-pressed": isSelected
  }, rest), innerNode);
};

exports.EuiButtonEmpty = EuiButtonEmpty;