"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiHeaderLinks = exports.GUTTER_SIZES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _icon = require("../../icon");

var _popover = require("../../popover");

var _i18n = require("../../i18n");

var _header_section = require("../header_section");

var _responsive = require("../../responsive");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var gutterSizeToClassNameMap = {
  xs: '--gutterXS',
  s: '--gutterS',
  m: '--gutterM',
  l: '--gutterL'
};
var GUTTER_SIZES = (0, _common.keysOf)(gutterSizeToClassNameMap);
exports.GUTTER_SIZES = GUTTER_SIZES;

var EuiHeaderLinks = function EuiHeaderLinks(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$gutterSize = _ref.gutterSize,
      gutterSize = _ref$gutterSize === void 0 ? 's' : _ref$gutterSize,
      _ref$popoverBreakpoin = _ref.popoverBreakpoints,
      popoverBreakpoints = _ref$popoverBreakpoin === void 0 ? ['xs', 's'] : _ref$popoverBreakpoin,
      popoverButtonProps = _ref.popoverButtonProps,
      popoverProps = _ref.popoverProps,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "gutterSize", "popoverBreakpoints", "popoverButtonProps", "popoverProps"]);

  var _popoverButtonProps = _objectSpread({}, popoverButtonProps),
      _onClick = _popoverButtonProps.onClick,
      _popoverButtonProps$i = _popoverButtonProps.iconType,
      iconType = _popoverButtonProps$i === void 0 ? 'apps' : _popoverButtonProps$i,
      popoverButtonRest = (0, _objectWithoutProperties2.default)(_popoverButtonProps, ["onClick", "iconType"]);

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      mobileMenuIsOpen = _useState2[0],
      setMobileMenuIsOpen = _useState2[1];

  var onMenuButtonClick = function onMenuButtonClick(e) {
    _onClick && _onClick(e);
    setMobileMenuIsOpen(!mobileMenuIsOpen);
  };

  var closeMenu = function closeMenu() {
    setMobileMenuIsOpen(false);
  };

  (0, _react.useEffect)(function () {
    window.addEventListener('resize', closeMenu);
    return function () {
      window.removeEventListener('resize', closeMenu);
    };
  });
  var classes = (0, _classnames.default)('euiHeaderLinks', className);
  var button = (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiHeaderLinks.openNavigationMenu",
    default: "Open menu"
  }, function (openNavigationMenu) {
    return (0, _react2.jsx)(_header_section.EuiHeaderSectionItemButton, (0, _extends2.default)({
      "aria-label": openNavigationMenu,
      onClick: onMenuButtonClick
    }, popoverButtonRest), (0, _react2.jsx)(_icon.EuiIcon, {
      type: iconType,
      size: "m"
    }));
  });
  return (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiHeaderLinks.appNavigation",
    default: "App menu"
  }, function (appNavigation) {
    return (0, _react2.jsx)("nav", (0, _extends2.default)({
      className: classes,
      "aria-label": appNavigation
    }, rest), (0, _react2.jsx)(_responsive.EuiHideFor, {
      sizes: popoverBreakpoints
    }, (0, _react2.jsx)("div", {
      className: (0, _classnames.default)('euiHeaderLinks__list', ["euiHeaderLinks__list".concat(gutterSizeToClassNameMap[gutterSize])])
    }, children)), (0, _react2.jsx)(_responsive.EuiShowFor, {
      sizes: popoverBreakpoints
    }, (0, _react2.jsx)(_popover.EuiPopover, (0, _extends2.default)({
      button: button,
      isOpen: mobileMenuIsOpen,
      anchorPosition: "downRight",
      closePopover: closeMenu,
      panelPaddingSize: "none"
    }, popoverProps), (0, _react2.jsx)("div", {
      className: (0, _classnames.default)('euiHeaderLinks__mobileList', ["euiHeaderLinks__mobileList".concat(gutterSizeToClassNameMap[gutterSize])])
    }, children))));
  });
};

exports.EuiHeaderLinks = EuiHeaderLinks;