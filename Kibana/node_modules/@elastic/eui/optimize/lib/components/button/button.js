"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiButton = exports.EuiButtonDisplay = exports.SIZES = exports.sizeToClassNameMap = exports.COLORS = exports.colorToClassNameMap = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _services = require("../../services");

var _button_content = require("./button_content");

var _href_validator = require("../../services/security/href_validator");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var colorToClassNameMap = {
  primary: '--primary',
  accent: '--accent',
  success: '--success',
  warning: '--warning',
  danger: '--danger',
  ghost: '--ghost',
  text: '--text'
};
exports.colorToClassNameMap = colorToClassNameMap;
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;
var sizeToClassNameMap = {
  s: '--small',
  m: null
};
exports.sizeToClassNameMap = sizeToClassNameMap;
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
/**
 * Extends EuiButtonContentProps which provides
 * `iconType`, `iconSide`, and `textProps`
 */

exports.SIZES = SIZES;

/**
 * *INTERNAL ONLY*
 * Component for displaying any element as a button
 * EuiButton is largely responsible for providing relevant props
 * and the logic for element-specific attributes
 */
var EuiButtonDisplay = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var _ref$element = _ref.element,
      element = _ref$element === void 0 ? 'button' : _ref$element,
      baseClassName = _ref.baseClassName,
      children = _ref.children,
      className = _ref.className,
      iconType = _ref.iconType,
      _ref$iconSide = _ref.iconSide,
      iconSide = _ref$iconSide === void 0 ? 'left' : _ref$iconSide,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'primary' : _ref$color,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      _ref$fill = _ref.fill,
      fill = _ref$fill === void 0 ? false : _ref$fill,
      isDisabled = _ref.isDisabled,
      isLoading = _ref.isLoading,
      isSelected = _ref.isSelected,
      contentProps = _ref.contentProps,
      textProps = _ref.textProps,
      fullWidth = _ref.fullWidth,
      minWidth = _ref.minWidth,
      style = _ref.style,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["element", "baseClassName", "children", "className", "iconType", "iconSide", "color", "size", "fill", "isDisabled", "isLoading", "isSelected", "contentProps", "textProps", "fullWidth", "minWidth", "style"]);
  var buttonIsDisabled = isLoading || isDisabled;
  var classes = (0, _classnames.default)(baseClassName, color && colorToClassNameMap[color] ? "".concat(baseClassName).concat(colorToClassNameMap[color]) : "".concat(baseClassName).concat(colorToClassNameMap.primary), size && sizeToClassNameMap[size] ? "".concat(baseClassName).concat(sizeToClassNameMap[size]) : null, fill && "".concat(baseClassName, "--fill"), fullWidth && "".concat(baseClassName, "--fullWidth"), buttonIsDisabled && "".concat(baseClassName, "-isDisabled"), className);
  /**
   * Not changing the content or text class names to match baseClassName yet,
   * as it is a major breaking change.
   */

  var contentClassNames = (0, _classnames.default)('euiButton__content', contentProps && contentProps.className);
  var textClassNames = (0, _classnames.default)('euiButton__text', textProps && textProps.className);
  var innerNode = (0, _react2.jsx)(_button_content.EuiButtonContent, (0, _extends2.default)({
    isLoading: isLoading,
    iconType: iconType,
    iconSide: iconSide,
    textProps: _objectSpread(_objectSpread({}, textProps), {}, {
      className: textClassNames
    })
  }, contentProps, {
    // className has to come last to override contentProps.className
    className: contentClassNames
  }), children);
  var calculatedStyle = style;

  if (minWidth !== undefined || minWidth !== null) {
    calculatedStyle = _objectSpread(_objectSpread({}, calculatedStyle), {}, {
      minWidth: minWidth
    });
  }

  return /*#__PURE__*/_react.default.createElement(element, _objectSpread({
    className: classes,
    style: calculatedStyle,
    disabled: element === 'button' && buttonIsDisabled,
    'aria-pressed': element === 'button' ? isSelected : undefined,
    ref: ref
  }, rest), innerNode);
});
exports.EuiButtonDisplay = EuiButtonDisplay;
EuiButtonDisplay.displayName = 'EuiButtonDisplay';

var EuiButton = function EuiButton(_ref2) {
  var _isDisabled = _ref2.isDisabled,
      _disabled = _ref2.disabled,
      href = _ref2.href,
      target = _ref2.target,
      rel = _ref2.rel,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? 'button' : _ref2$type,
      buttonRef = _ref2.buttonRef,
      rest = (0, _objectWithoutProperties2.default)(_ref2, ["isDisabled", "disabled", "href", "target", "rel", "type", "buttonRef"]);
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var disabled = _disabled || !isHrefValid;
  var isDisabled = _isDisabled || !isHrefValid;
  var buttonIsDisabled = rest.isLoading || isDisabled || disabled;
  var element = href && !isDisabled ? 'a' : 'button';
  var elementProps = {}; // Props for all elements

  elementProps = _objectSpread(_objectSpread({}, elementProps), {}, {
    isDisabled: buttonIsDisabled
  }); // Element-specific attributes

  if (element === 'button') {
    elementProps = _objectSpread(_objectSpread({}, elementProps), {}, {
      disabled: buttonIsDisabled
    });
  }

  var relObj = {};

  if (href && !buttonIsDisabled) {
    relObj.href = href;
    relObj.rel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
    relObj.target = target;
  } else {
    relObj.type = type;
  }

  return (0, _react2.jsx)(EuiButtonDisplay, (0, _extends2.default)({
    element: element,
    baseClassName: "euiButton",
    ref: buttonRef
  }, elementProps, relObj, rest));
};

exports.EuiButton = EuiButton;