"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiStat = exports.ALIGNMENTS = exports.isColorClass = exports.COLORS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _common = require("../common");

var _classnames = _interopRequireDefault(require("classnames"));

var _text = require("../text");

var _title = require("../title/title");

var _accessibility = require("../accessibility");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var colorToClassNameMap = {
  default: null,
  subdued: 'euiStat__title--subdued',
  primary: 'euiStat__title--primary',
  success: 'euiStat__title--success',
  danger: 'euiStat__title--danger',
  accent: 'euiStat__title--accent'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;
var textAlignToClassNameMap = {
  left: 'euiStat--leftAligned',
  center: 'euiStat--centerAligned',
  right: 'euiStat--rightAligned'
};

var isColorClass = function isColorClass(input) {
  return colorToClassNameMap.hasOwnProperty(input);
};

exports.isColorClass = isColorClass;
var ALIGNMENTS = (0, _common.keysOf)(textAlignToClassNameMap);
exports.ALIGNMENTS = ALIGNMENTS;

var EuiStat = function EuiStat(_ref) {
  var children = _ref.children,
      className = _ref.className,
      description = _ref.description,
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? false : _ref$isLoading,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      _ref$textAlign = _ref.textAlign,
      textAlign = _ref$textAlign === void 0 ? 'left' : _ref$textAlign,
      title = _ref.title,
      _ref$titleColor = _ref.titleColor,
      titleColor = _ref$titleColor === void 0 ? 'default' : _ref$titleColor,
      _ref$titleSize = _ref.titleSize,
      titleSize = _ref$titleSize === void 0 ? 'l' : _ref$titleSize,
      _ref$titleElement = _ref.titleElement,
      titleElement = _ref$titleElement === void 0 ? 'p' : _ref$titleElement,
      _ref$descriptionEleme = _ref.descriptionElement,
      descriptionElement = _ref$descriptionEleme === void 0 ? 'p' : _ref$descriptionEleme,
      rest = _objectWithoutProperties(_ref, ["children", "className", "description", "isLoading", "reverse", "textAlign", "title", "titleColor", "titleSize", "titleElement", "descriptionElement"]);

  var classes = (0, _classnames.default)('euiStat', textAlignToClassNameMap[textAlign], className);
  var titleClasses = (0, _classnames.default)('euiStat__title', isColorClass(titleColor) ? colorToClassNameMap[titleColor] : null, {
    'euiStat__title-isLoading': isLoading
  });
  var commonProps = {
    'aria-hidden': true
  };
  var descriptionDisplay = (0, _react2.jsx)(_text.EuiText, {
    size: "s",
    className: "euiStat__description"
  }, /*#__PURE__*/(0, _react.createElement)(descriptionElement, commonProps, description));
  var titlePropsWithColor = {
    'aria-hidden': true,
    style: {
      color: "".concat(titleColor)
    }
  };
  var titleChildren = isLoading ? '--' : title;
  var titleDisplay = isColorClass(titleColor) ? (0, _react2.jsx)(_title.EuiTitle, {
    size: titleSize,
    className: titleClasses
  }, /*#__PURE__*/(0, _react.createElement)(titleElement, commonProps, titleChildren)) : (0, _react2.jsx)(_title.EuiTitle, {
    size: titleSize,
    className: titleClasses
  }, /*#__PURE__*/(0, _react.createElement)(titleElement, titlePropsWithColor, titleChildren));
  var screenReader = (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("p", null, isLoading ? (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiStat.loadingText",
    default: "Statistic is loading"
  }) : (0, _react2.jsx)(_react.Fragment, null, reverse ? "".concat(title, " ").concat(description) : "".concat(description, " ").concat(title))));
  var statDisplay = (0, _react2.jsx)(_react.Fragment, null, !reverse && descriptionDisplay, titleDisplay, reverse && descriptionDisplay, typeof title === 'string' && typeof description === 'string' && screenReader);
  return (0, _react2.jsx)("div", _extends({
    className: classes
  }, rest), statDisplay, children);
};

exports.EuiStat = EuiStat;
EuiStat.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Set the description (label) text
     */
  description: _propTypes.default.node.isRequired,

  /**
     * Will hide the title with an animation until false
     */
  isLoading: _propTypes.default.bool,

  /**
     * Flips the order of the description and title
     */
  reverse: _propTypes.default.bool,
  textAlign: _propTypes.default.oneOf(["left", "center", "right"]),

  /**
     * The (value) text
     */
  title: _propTypes.default.node.isRequired,

  /**
     * The color of the title text
     */
  titleColor: _propTypes.default.oneOfType([_propTypes.default.oneOf(["default", "subdued", "primary", "success", "danger", "accent"]).isRequired, _propTypes.default.string.isRequired]),

  /**
     * Size of the title. See EuiTitle for options ('s', 'm', 'l'... etc)
     */
  titleSize: _propTypes.default.oneOf(["xxxs", "xxs", "xs", "s", "m", "l"]),

  /**
     * HTML Element to be used for title
     */
  titleElement: _propTypes.default.string,

  /**
     * HTML Element to be used for description
     */
  descriptionElement: _propTypes.default.string
};