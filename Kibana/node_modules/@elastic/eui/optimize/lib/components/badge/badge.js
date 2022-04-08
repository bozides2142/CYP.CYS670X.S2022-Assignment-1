"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiBadge = exports.ICON_SIDES = exports.COLORS = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _chromaJs = _interopRequireDefault(require("chroma-js"));

var _common = require("../common");

var _services = require("../../services");

var _inner_text = require("../inner_text");

var _icon = require("../icon");

var _utils = require("../color_picker/utils");

var _href_validator = require("../../services/security/href_validator");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// TODO - replace with variables once https://github.com/elastic/eui/issues/2731 is closed
var colorInk = '#000';
var colorGhost = '#fff'; // The color blind palette has some stricter accessibility needs with regards to
// charts and contrast. We use the euiPaletteColorBlindBehindText variant here since our
// accessibility concerns pertain to foreground (text) and background contrast

var visColors = (0, _services.euiPaletteColorBlindBehindText)();
var colorToHexMap = {
  // TODO - replace with variable once https://github.com/elastic/eui/issues/2731 is closed
  default: '#d3dae6',
  primary: visColors[1],
  success: visColors[0],
  accent: visColors[2],
  warning: visColors[5],
  danger: visColors[9]
};
var COLORS = (0, _common.keysOf)(colorToHexMap);
exports.COLORS = COLORS;
var iconSideToClassNameMap = {
  left: 'euiBadge--iconLeft',
  right: 'euiBadge--iconRight'
};
var ICON_SIDES = (0, _common.keysOf)(iconSideToClassNameMap);
exports.ICON_SIDES = ICON_SIDES;

var EuiBadge = function EuiBadge(_ref) {
  var children = _ref.children,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'default' : _ref$color,
      iconType = _ref.iconType,
      _ref$iconSide = _ref.iconSide,
      iconSide = _ref$iconSide === void 0 ? 'left' : _ref$iconSide,
      className = _ref.className,
      _isDisabled = _ref.isDisabled,
      onClick = _ref.onClick,
      iconOnClick = _ref.iconOnClick,
      onClickAriaLabel = _ref.onClickAriaLabel,
      iconOnClickAriaLabel = _ref.iconOnClickAriaLabel,
      closeButtonProps = _ref.closeButtonProps,
      href = _ref.href,
      rel = _ref.rel,
      target = _ref.target,
      style = _ref.style,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "color", "iconType", "iconSide", "className", "isDisabled", "onClick", "iconOnClick", "onClickAriaLabel", "iconOnClickAriaLabel", "closeButtonProps", "href", "rel", "target", "style"]);
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var isDisabled = _isDisabled || !isHrefValid;
  var optionalCustomStyles = style;
  var textColor = null; // TODO - replace with variable once https://github.com/elastic/eui/issues/2731 is closed

  var wcagContrastBase = 4.5; // WCAG AA contrast level

  var wcagContrast = null;
  var colorHex = null; // Check if a valid color name was provided

  try {
    if (COLORS.indexOf(color) > -1) {
      // Get the hex equivalent for the provided color name
      colorHex = colorToHexMap[color]; // Set dark or light text color based upon best contrast

      textColor = setTextColor(colorHex);
      optionalCustomStyles = _objectSpread({
        backgroundColor: colorHex,
        color: textColor
      }, optionalCustomStyles);
    } else if (color !== 'hollow') {
      // This is a custom color that is neither from the base palette nor hollow
      // Let's do our best to ensure that it provides sufficient contrast
      // Set dark or light text color based upon best contrast
      textColor = setTextColor(color); // Check the contrast

      wcagContrast = getColorContrast(textColor, color);

      if (wcagContrast < wcagContrastBase) {
        // It's low contrast, so lets show a warning in the console
        console.warn('Warning: ', color, ' badge has low contrast of ', wcagContrast.toFixed(2), '. Should be above ', wcagContrastBase, '.');
      }

      optionalCustomStyles = _objectSpread({
        backgroundColor: color,
        color: textColor
      }, optionalCustomStyles);
    }
  } catch (err) {
    handleInvalidColor(color);
  }

  var classes = (0, _classnames.default)('euiBadge', {
    'euiBadge-isClickable': (onClick || href) && !iconOnClick,
    'euiBadge-isDisabled': isDisabled,
    'euiBadge--hollow': color === 'hollow'
  }, iconSideToClassNameMap[iconSide], className);
  var closeClassNames = (0, _classnames.default)('euiBadge__icon', closeButtonProps && closeButtonProps.className);
  var Element = href && !isDisabled ? 'a' : 'button';
  var relObj = {};

  if (href && !isDisabled) {
    relObj.href = href;
    relObj.target = target;
    relObj.rel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
  }

  if (onClick) {
    relObj.onClick = onClick;
  }

  var optionalIcon = null;

  if (iconType) {
    if (iconOnClick) {
      if (!iconOnClickAriaLabel) {
        console.warn('When passing the iconOnClick props to EuiBadge, you must also provide iconOnClickAriaLabel');
      }

      optionalIcon = (0, _react2.jsx)("button", {
        type: "button",
        className: "euiBadge__iconButton",
        "aria-label": iconOnClickAriaLabel,
        disabled: isDisabled,
        title: iconOnClickAriaLabel,
        onClick: iconOnClick
      }, (0, _react2.jsx)(_icon.EuiIcon, (0, _extends2.default)({
        type: iconType,
        size: "s",
        color: "inherit" // forces the icon to inherit its parent color

      }, closeButtonProps, {
        className: closeClassNames
      })));
    } else {
      optionalIcon = (0, _react2.jsx)(_icon.EuiIcon, {
        type: iconType,
        size: children ? 's' : 'm',
        className: "euiBadge__icon",
        color: "inherit" // forces the icon to inherit its parent color

      });
    }
  }

  if (onClick && !onClickAriaLabel) {
    console.warn('When passing onClick to EuiBadge, you must also provide onClickAriaLabel');
  }

  var content = (0, _react2.jsx)("span", {
    className: "euiBadge__content"
  }, children && (0, _react2.jsx)("span", {
    className: "euiBadge__text"
  }, children), optionalIcon);

  if (iconOnClick) {
    return onClick || href ? (0, _react2.jsx)("span", {
      className: classes,
      style: optionalCustomStyles
    }, (0, _react2.jsx)("span", {
      className: "euiBadge__content"
    }, (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      return (0, _react2.jsx)(Element, (0, _extends2.default)({
        className: "euiBadge__childButton",
        disabled: isDisabled,
        "aria-label": onClickAriaLabel,
        ref: ref,
        title: innerText
      }, relObj, rest), children);
    }), optionalIcon)) : (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      return (0, _react2.jsx)("span", (0, _extends2.default)({
        className: classes,
        style: optionalCustomStyles,
        ref: ref,
        title: innerText
      }, rest), content);
    });
  } else if (onClick || href) {
    return (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      return (0, _react2.jsx)(Element, (0, _extends2.default)({
        disabled: isDisabled,
        "aria-label": onClickAriaLabel,
        className: classes,
        style: optionalCustomStyles,
        ref: ref,
        title: innerText
      }, relObj, rest), content);
    });
  } else {
    return (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      return (0, _react2.jsx)("span", (0, _extends2.default)({
        className: classes,
        style: optionalCustomStyles,
        ref: ref,
        title: innerText
      }, rest), content);
    });
  }
};

exports.EuiBadge = EuiBadge;

function getColorContrast(textColor, color) {
  var contrastValue = _chromaJs.default.contrast(textColor, color);

  return contrastValue;
}

function setTextColor(bgColor) {
  var textColor = _services.isColorDark.apply(void 0, (0, _toConsumableArray2.default)((0, _chromaJs.default)(bgColor).rgb())) ? colorGhost : colorInk;
  return textColor;
}

function handleInvalidColor(color) {
  var isNamedColor = color && COLORS.includes(color) || color === 'hollow';
  var isValidColorString = color && (0, _utils.chromaValid)((0, _utils.parseColor)(color) || '');

  if (!isNamedColor && !isValidColorString) {
    console.warn('EuiBadge expects a valid color. This can either be a three or six ' + "character hex value, rgb(a) value, hsv value, hollow, or one of the following: ".concat(COLORS, ". ") + "Instead got ".concat(color, "."));
  }
}