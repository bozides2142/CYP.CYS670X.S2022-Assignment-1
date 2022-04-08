"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiProgress = exports.POSITIONS = exports.COLORS = exports.SIZES = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../i18n");

var _inner_text = require("../inner_text");

var _common = require("../common");

var _predicate = require("../../services/predicate");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var sizeToClassNameMap = {
  xs: 'euiProgress--xs',
  s: 'euiProgress--s',
  m: 'euiProgress--m',
  l: 'euiProgress--l'
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;
var colorToClassNameMap = {
  primary: 'euiProgress--primary',
  success: 'euiProgress--success',
  warning: 'euiProgress--warning',
  danger: 'euiProgress--danger',
  subdued: 'euiProgress--subdued',
  accent: 'euiProgress--accent',
  vis0: 'euiProgress--vis0',
  vis1: 'euiProgress--vis1',
  vis2: 'euiProgress--vis2',
  vis3: 'euiProgress--vis3',
  vis4: 'euiProgress--vis4',
  vis5: 'euiProgress--vis5',
  vis6: 'euiProgress--vis6',
  vis7: 'euiProgress--vis7',
  vis8: 'euiProgress--vis8',
  vis9: 'euiProgress--vis9'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;

function isNamedColor(name) {
  return colorToClassNameMap.hasOwnProperty(name);
}

var dataColorToClassNameMap = {
  primary: 'euiProgress__data--primary',
  success: 'euiProgress__data--success',
  warning: 'euiProgress__data--warning',
  danger: 'euiProgress__data--danger',
  subdued: 'euiProgress__data--subdued',
  accent: 'euiProgress__data--accent',
  vis0: 'euiProgress__data--vis0',
  vis1: 'euiProgress__data--vis1',
  vis2: 'euiProgress__data--vis2',
  vis3: 'euiProgress__data--vis3',
  vis4: 'euiProgress__data--vis4',
  vis5: 'euiProgress__data--vis5',
  vis6: 'euiProgress__data--vis6',
  vis7: 'euiProgress__data--vis7',
  vis8: 'euiProgress__data--vis8',
  vis9: 'euiProgress__data--vis9'
};
var positionsToClassNameMap = {
  fixed: 'euiProgress--fixed',
  absolute: 'euiProgress--absolute',
  static: ''
};
var POSITIONS = (0, _common.keysOf)(positionsToClassNameMap);
exports.POSITIONS = POSITIONS;

var EuiProgress = function EuiProgress(_ref) {
  var className = _ref.className,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'success' : _ref$color,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? 'static' : _ref$position,
      max = _ref.max,
      _ref$valueText = _ref.valueText,
      valueText = _ref$valueText === void 0 ? false : _ref$valueText,
      label = _ref.label,
      value = _ref.value,
      labelProps = _ref.labelProps,
      rest = _objectWithoutProperties(_ref, ["className", "color", "size", "position", "max", "valueText", "label", "value", "labelProps"]);

  var determinate = !(0, _predicate.isNil)(max);
  var colorClass = null;
  var dataColorClass = null;
  var optionalCustomStyles = null;

  if (color) {
    if (isNamedColor(color)) {
      colorClass = colorToClassNameMap[color];
      dataColorClass = dataColorToClassNameMap[color];
    } else {
      optionalCustomStyles = {
        color: color
      };
      colorClass = 'euiProgress--customColor';
    }
  }

  var classes = (0, _classnames.default)('euiProgress', {
    'euiProgress--indeterminate': !determinate,
    'euiProgress--native': determinate
  }, sizeToClassNameMap[size], colorClass, positionsToClassNameMap[position], className);
  var dataClasses = (0, _classnames.default)('euiProgress__data', {
    'euiProgress__data--l': size === 'l'
  }, dataColorClass);
  var labelClasses = (0, _classnames.default)('euiProgress__label', labelProps && labelProps.className);
  var valueRender;

  if (valueText === true) {
    // valueText is true
    valueRender = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiProgress.valueText",
      default: "{value}%",
      values: {
        value: value
      }
    });
  } else if (valueText) {
    // valueText exists
    valueRender = valueText;
  } // Because of a Firefox animation issue, indeterminate progress needs to not use <progress />.
  // See https://css-tricks.com/html5-progress-element/


  if (determinate) {
    return (0, _react2.jsx)(_react.Fragment, null, label || valueText ? (0, _react2.jsx)("div", {
      className: dataClasses
    }, label && (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      return (0, _react2.jsx)("span", _extends({
        title: innerText,
        ref: ref
      }, labelProps, {
        className: labelClasses
      }), label);
    }), valueRender && (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      return (0, _react2.jsx)("span", {
        title: innerText,
        ref: ref,
        style: optionalCustomStyles,
        className: "euiProgress__valueText"
      }, valueRender);
    })) : undefined, (0, _react2.jsx)("progress", _extends({
      className: classes,
      style: optionalCustomStyles,
      max: max,
      value: value,
      "aria-hidden": label && valueText ? true : false
    }, rest)));
  } else {
    return (0, _react2.jsx)("div", _extends({
      style: optionalCustomStyles,
      className: classes
    }, rest));
  }
};

exports.EuiProgress = EuiProgress;
EuiProgress.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  size: _propTypes.default.oneOf(["xs", "s", "m", "l"]),

  /**
     * One of EUI's color palette, vis colors or a valid CSS color value https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     */

  /**
     * One of EUI's color palette, vis colors or a valid CSS color value https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     */
  color: _propTypes.default.oneOfType([_propTypes.default.oneOf(["primary", "success", "warning", "danger", "subdued", "accent", "vis0", "vis1", "vis2", "vis3", "vis4", "vis5", "vis6", "vis7", "vis8", "vis9"]).isRequired, _propTypes.default.any.isRequired]),
  position: _propTypes.default.oneOf(["fixed", "absolute", "static"]),
  max: _propTypes.default.number,

  /*
       * If true, will render the percentage, otherwise pass a custom node
       */
  valueText: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.node.isRequired]),
  label: _propTypes.default.node,

  /**
       * Object of props passed to the <span/> wrapping the determinate progress's label
       */
  labelProps: _propTypes.default.any
};