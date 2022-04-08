"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFilterButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../i18n");

var _notification_badge = require("../badge/notification_badge");

var _button_empty = require("../button/button_empty");

var _inner_text = require("../inner_text");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EuiFilterButton = function EuiFilterButton(_ref) {
  var children = _ref.children,
      className = _ref.className,
      iconType = _ref.iconType,
      _ref$iconSide = _ref.iconSide,
      iconSide = _ref$iconSide === void 0 ? 'right' : _ref$iconSide,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'text' : _ref$color,
      hasActiveFilters = _ref.hasActiveFilters,
      numFilters = _ref.numFilters,
      numActiveFilters = _ref.numActiveFilters,
      isDisabled = _ref.isDisabled,
      isSelected = _ref.isSelected,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? true : _ref$grow,
      noDivider = _ref.noDivider,
      withNext = _ref.withNext,
      textProps = _ref.textProps,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "iconType", "iconSide", "color", "hasActiveFilters", "numFilters", "numActiveFilters", "isDisabled", "isSelected", "type", "grow", "noDivider", "withNext", "textProps"]);
  var numFiltersDefined = numFilters != null; // != instead of !== to allow for null and undefined

  var numActiveFiltersDefined = numActiveFilters != null && numActiveFilters > 0;
  var classes = (0, _classnames.default)('euiFilterButton', {
    'euiFilterButton-isSelected': isSelected,
    'euiFilterButton-hasActiveFilters': hasActiveFilters,
    'euiFilterButton-hasNotification': numFiltersDefined,
    'euiFilterButton--hasIcon': iconType,
    'euiFilterButton--noGrow': !grow,
    'euiFilterButton--withNext': noDivider || withNext
  }, className);
  var buttonTextClassNames = (0, _classnames.default)({
    'euiFilterButton__text-hasNotification': numFiltersDefined || numActiveFilters
  }, textProps && textProps.className);
  var showBadge = numFiltersDefined || numActiveFiltersDefined;
  var badgeCount = numActiveFilters || numFilters;
  var activeBadgeLabel = (0, _i18n.useEuiI18n)('euiFilterButton.filterBadgeActiveAriaLabel', '{count} active filters', {
    count: badgeCount
  });
  var availableBadgeLabel = (0, _i18n.useEuiI18n)('euiFilterButton.filterBadgeAvailableAriaLabel', '{count} available filters', {
    count: badgeCount
  });
  var badgeContent = showBadge && (0, _react2.jsx)(_notification_badge.EuiNotificationBadge, {
    className: "euiFilterButton__notification",
    size: "m",
    "aria-label": hasActiveFilters ? activeBadgeLabel : availableBadgeLabel,
    color: isDisabled || !hasActiveFilters ? 'subdued' : 'accent'
  }, badgeCount);
  var dataText;

  if (typeof children === 'string') {
    dataText = children;
  }

  var _useInnerText = (0, _inner_text.useInnerText)(),
      _useInnerText2 = (0, _slicedToArray2.default)(_useInnerText, 2),
      ref = _useInnerText2[0],
      innerText = _useInnerText2[1];

  var buttonContents = (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("span", {
    ref: ref,
    className: "euiFilterButton__textShift",
    "data-text": dataText || innerText,
    title: dataText || innerText
  }, children), badgeContent);
  return (0, _react2.jsx)(_button_empty.EuiButtonEmpty, (0, _extends2.default)({
    className: classes,
    color: color,
    isDisabled: isDisabled,
    iconSide: iconSide,
    iconType: iconType,
    type: type,
    textProps: _objectSpread(_objectSpread({}, textProps), {}, {
      className: buttonTextClassNames
    })
  }, rest), buttonContents);
};

exports.EuiFilterButton = EuiFilterButton;