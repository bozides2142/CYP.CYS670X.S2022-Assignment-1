"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiImage = exports.SIZES = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _overlay_mask = require("../overlay_mask");

var _icon = require("../icon");

var _i18n = require("../i18n");

var _focus_trap = require("../focus_trap");

var _services = require("../../services");

var _inner_text = require("../inner_text");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var sizeToClassNameMap = {
  s: 'euiImage--small',
  m: 'euiImage--medium',
  l: 'euiImage--large',
  xl: 'euiImage--xlarge',
  fullWidth: 'euiImage--fullWidth',
  original: 'euiImage--original'
};
var marginToClassNameMap = {
  s: 'euiImage--marginSmall',
  m: 'euiImage--marginMedium',
  l: 'euiImage--marginLarge',
  xl: 'euiImage--marginXlarge'
};
var floatToClassNameMap = {
  left: 'euiImage--floatLeft',
  right: 'euiImage--floatRight'
};
var SIZES = Object.keys(sizeToClassNameMap);
exports.SIZES = SIZES;
var fullScreenIconColorMap = {
  light: 'ghost',
  dark: 'default'
};

var EuiImage = function EuiImage(_ref) {
  var className = _ref.className,
      url = _ref.url,
      src = _ref.src,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'original' : _ref$size,
      caption = _ref.caption,
      hasShadow = _ref.hasShadow,
      allowFullScreen = _ref.allowFullScreen,
      _ref$fullScreenIconCo = _ref.fullScreenIconColor,
      fullScreenIconColor = _ref$fullScreenIconCo === void 0 ? 'light' : _ref$fullScreenIconCo,
      alt = _ref.alt,
      style = _ref.style,
      float = _ref.float,
      margin = _ref.margin,
      rest = _objectWithoutProperties(_ref, ["className", "url", "src", "size", "caption", "hasShadow", "allowFullScreen", "fullScreenIconColor", "alt", "style", "float", "margin"]);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isFullScreenActive = _useState2[0],
      setIsFullScreenActive = _useState2[1];

  var onKeyDown = function onKeyDown(event) {
    if (event.key === _services.keys.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
      closeFullScreen();
    }
  };

  var closeFullScreen = function closeFullScreen() {
    setIsFullScreenActive(false);
  };

  var openFullScreen = function openFullScreen() {
    setIsFullScreenActive(true);
  };

  var customStyle = _objectSpread({}, style);

  var classes = (0, _classnames.default)('euiImage', {
    'euiImage--hasShadow': hasShadow,
    'euiImage--allowFullScreen': allowFullScreen
  }, margin ? marginToClassNameMap[margin] : null, float ? floatToClassNameMap[float] : null, className);

  if (typeof size === 'string' && SIZES.includes(size)) {
    classes = "".concat(classes, " ").concat(sizeToClassNameMap[size]);
  } else {
    classes = "".concat(classes);
    customStyle.maxWidth = size;
    customStyle.maxHeight = size; // Set width back to auto to ensure aspect ratio is kept

    customStyle.width = 'auto';
  }

  var allowFullScreenButtonClasses = 'euiImage__button'; // when the button is not custom we need it to go full width
  // to match the parent '.euiImage' width except when the size is original

  if (typeof size === 'string' && size !== 'original' && SIZES.includes(size)) {
    allowFullScreenButtonClasses = "".concat(allowFullScreenButtonClasses, " euiImage__button--fullWidth");
  } else {
    allowFullScreenButtonClasses = "".concat(allowFullScreenButtonClasses);
  }

  var _useInnerText = (0, _inner_text.useInnerText)(),
      _useInnerText2 = _slicedToArray(_useInnerText, 2),
      optionalCaptionRef = _useInnerText2[0],
      optionalCaptionText = _useInnerText2[1];

  var optionalCaption;

  if (caption) {
    optionalCaption = (0, _react2.jsx)("figcaption", {
      ref: optionalCaptionRef,
      className: "euiImage__caption"
    }, caption);
  }

  var allowFullScreenIcon = (0, _react2.jsx)(_icon.EuiIcon, {
    type: "fullScreen",
    color: fullScreenIconColorMap[fullScreenIconColor],
    className: "euiImage__icon"
  });
  var fullScreenDisplay = (0, _react2.jsx)(_overlay_mask.EuiOverlayMask, {
    "data-test-subj": "fullScreenOverlayMask",
    onClick: closeFullScreen
  }, (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
    clickOutsideDisables: true
  }, (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)("figure", {
    className: "euiImage euiImage-isFullScreen",
    "aria-label": optionalCaptionText
  }, (0, _react2.jsx)("button", {
    type: "button",
    "aria-label": (0, _i18n.useEuiI18n)('euiImage.closeImage', 'Close full screen {alt} image', {
      alt: alt
    }),
    className: "euiImage__button",
    "data-test-subj": "deactivateFullScreenButton",
    onClick: closeFullScreen,
    onKeyDown: onKeyDown
  }, (0, _react2.jsx)("img", _extends({
    src: src || url,
    alt: alt,
    className: "euiImage-isFullScreen__img"
  }, rest))), optionalCaption), (0, _react2.jsx)(_icon.EuiIcon, {
    type: "cross",
    color: "default",
    className: "euiImage-isFullScreenCloseIcon"
  }))));
  var fullscreenLabel = (0, _i18n.useEuiI18n)('euiImage.openImage', 'Open full screen {alt} image', {
    alt: alt
  });

  if (allowFullScreen) {
    return (0, _react2.jsx)("figure", {
      className: classes,
      "aria-label": optionalCaptionText
    }, (0, _react2.jsx)("button", {
      type: "button",
      "aria-label": fullscreenLabel,
      className: allowFullScreenButtonClasses,
      "data-test-subj": "activateFullScreenButton",
      onClick: openFullScreen
    }, (0, _react2.jsx)("img", _extends({
      style: customStyle,
      src: src || url,
      alt: alt,
      className: "euiImage__img"
    }, rest)), allowFullScreenIcon), isFullScreenActive && fullScreenDisplay, optionalCaption);
  } else {
    return (0, _react2.jsx)("figure", {
      className: classes,
      "aria-label": optionalCaptionText
    }, (0, _react2.jsx)("img", _extends({
      style: customStyle,
      src: src || url,
      className: "euiImage__img",
      alt: alt
    }, rest)), optionalCaption);
  }
};

exports.EuiImage = EuiImage;
EuiImage.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Requires either `src` or `url` but defaults to using `src` if both are provided
       */
  src: _propTypes.default.string,
  url: _propTypes.default.string,

  /**
       * Separate from the caption is a title on the alt tag itself.
       * This one is required for accessibility.
       */
  alt: _propTypes.default.string.isRequired,

  /**
       * Accepts `s` / `m` / `l` / `xl` / `original` / `fullWidth` / or a CSS size of `number` or `string`.
       * `fullWidth` will set the figure to stretch to 100% of its container.
       * `string` and `number` types will max both the width or height, whichever is greater.
       */
  size: _propTypes.default.oneOfType([_propTypes.default.oneOf(["s", "m", "l", "xl", "fullWidth", "original"]).isRequired, _propTypes.default.number.isRequired, _propTypes.default.string.isRequired]),

  /**
       * Changes the color of the icon that floats above the image when it can be clicked to fullscreen.
       * The default value of `light` is fine unless your image has a white background, in which case you should change it to `dark`.
       */
  fullScreenIconColor: _propTypes.default.oneOf(["light", "dark"]),

  /**
       * Provides the visible caption to the image
       */
  caption: _propTypes.default.node,

  /**
       * When set to `true` (default) will apply a slight shadow to the image
       */
  hasShadow: _propTypes.default.bool,

  /**
       * When set to `true` will make the image clickable to a larger version
       */
  allowFullScreen: _propTypes.default.bool,

  /**
       * Float the image to the left or right. Useful in large text blocks.
       */
  float: _propTypes.default.oneOf(["left", "right"]),

  /**
       * Margin around the image.
       */
  margin: _propTypes.default.oneOf(["s", "m", "l", "xl"])
};