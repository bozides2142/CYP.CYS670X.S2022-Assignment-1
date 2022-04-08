"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiLink = exports.COLORS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../icon");

var _i18n = require("../i18n");

var _common = require("../common");

var _services = require("../../services");

var _accessibility = require("../accessibility");

var _href_validator = require("../../services/security/href_validator");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var colorsToClassNameMap = {
  primary: 'euiLink--primary',
  subdued: 'euiLink--subdued',
  success: 'euiLink--success',
  accent: 'euiLink--accent',
  danger: 'euiLink--danger',
  warning: 'euiLink--warning',
  ghost: 'euiLink--ghost',
  text: 'euiLink--text'
};
var COLORS = (0, _common.keysOf)(colorsToClassNameMap);
exports.COLORS = COLORS;
var EuiLink = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var children = _ref.children,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'primary' : _ref$color,
      className = _ref.className,
      href = _ref.href,
      external = _ref.external,
      target = _ref.target,
      rel = _ref.rel,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      onClick = _ref.onClick,
      _disabled = _ref.disabled,
      rest = _objectWithoutProperties(_ref, ["children", "color", "className", "href", "external", "target", "rel", "type", "onClick", "disabled"]);

  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var disabled = _disabled || !isHrefValid;
  var externalLinkIcon = (0, _react2.jsx)(_icon.EuiIcon, {
    "aria-label": (0, _i18n.useEuiI18n)('euiLink.external.ariaLabel', 'External link'),
    size: "s",
    className: "euiLink__externalIcon",
    type: "popout"
  });
  var newTargetScreenreaderText = (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiLink.newTarget.screenReaderOnlyText",
    default: "(opens in a new tab or window)"
  })));

  if (href === undefined || !isHrefValid) {
    var buttonProps = _objectSpread({
      className: (0, _classnames.default)('euiLink', disabled ? 'euiLink-disabled' : colorsToClassNameMap[color], className),
      type: type,
      onClick: onClick,
      disabled: disabled
    }, rest);

    return (0, _react2.jsx)("button", _extends({
      ref: ref
    }, buttonProps), children);
  }

  var secureRel = (0, _services.getSecureRelForTarget)({
    href: href,
    target: target,
    rel: rel
  });

  var anchorProps = _objectSpread({
    className: (0, _classnames.default)('euiLink', colorsToClassNameMap[color], className),
    href: href,
    target: target,
    rel: secureRel,
    onClick: onClick
  }, rest);

  var showExternalLinkIcon = target === '_blank' && external !== false || external === true;
  return (0, _react2.jsx)("a", _extends({
    ref: ref
  }, anchorProps), children, showExternalLinkIcon && externalLinkIcon, target === '_blank' && newTargetScreenreaderText);
});
exports.EuiLink = EuiLink;
EuiLink.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  type: _propTypes.default.oneOf(["button", "reset", "submit"]),

  /**
     * Any of our named colors.
     */

  /**
     * Any of our named colors.
     */
  color: _propTypes.default.oneOf(["primary", "subdued", "success", "accent", "danger", "warning", "text", "ghost"]),
  onClick: _propTypes.default.func,

  /**
     * Set to true to show an icon indicating that it is an external link;
     * Defaults to true if `target="_blank"`
     */
  external: _propTypes.default.bool
};
EuiLink.displayName = 'EuiLink';