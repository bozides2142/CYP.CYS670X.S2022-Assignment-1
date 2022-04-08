"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSideNavItem = EuiSideNavItem;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../icon");

var _services = require("../../services");

var _href_validator = require("../../services/security/href_validator");

var _inner_text = require("../inner_text");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var DefaultRenderItem = function DefaultRenderItem(_ref) {
  var href = _ref.href,
      target = _ref.target,
      rel = _ref.rel,
      onClick = _ref.onClick,
      className = _ref.className,
      children = _ref.children,
      disabled = _ref.disabled,
      rest = _objectWithoutProperties(_ref, ["href", "target", "rel", "onClick", "className", "children", "disabled"]);

  if (href && !disabled) {
    var secureRel = (0, _services.getSecureRelForTarget)({
      href: href,
      rel: rel,
      target: target
    });
    return (0, _react2.jsx)("a", _extends({
      className: className,
      href: href,
      target: target,
      rel: secureRel,
      onClick: onClick
    }, rest), children);
  }

  if (onClick || disabled) {
    return (0, _react2.jsx)("button", _extends({
      type: "button",
      className: className,
      onClick: onClick,
      disabled: disabled
    }, rest), children);
  }

  return (0, _react2.jsx)("div", _extends({
    className: className
  }, rest), children);
};

function EuiSideNavItem(_ref2) {
  var isOpen = _ref2.isOpen,
      isSelected = _ref2.isSelected,
      isParent = _ref2.isParent,
      icon = _ref2.icon,
      onClick = _ref2.onClick,
      _href = _ref2.href,
      rel = _ref2.rel,
      target = _ref2.target,
      items = _ref2.items,
      children = _ref2.children,
      _ref2$renderItem = _ref2.renderItem,
      RenderItem = _ref2$renderItem === void 0 ? DefaultRenderItem : _ref2$renderItem,
      _ref2$depth = _ref2.depth,
      depth = _ref2$depth === void 0 ? 0 : _ref2$depth,
      className = _ref2.className,
      _ref2$truncate = _ref2.truncate,
      truncate = _ref2$truncate === void 0 ? true : _ref2$truncate,
      emphasize = _ref2.emphasize,
      buttonClassName = _ref2.buttonClassName,
      childrenOnly = _ref2.childrenOnly,
      rest = _objectWithoutProperties(_ref2, ["isOpen", "isSelected", "isParent", "icon", "onClick", "href", "rel", "target", "items", "children", "renderItem", "depth", "className", "truncate", "emphasize", "buttonClassName", "childrenOnly"]);

  var isHrefValid = !_href || (0, _href_validator.validateHref)(_href);
  var href = isHrefValid ? _href : '';
  var isClickable = onClick || href; // Forcing accordion style item if not linked, but has children

  var _useState = (0, _react.useState)(isOpen),
      _useState2 = _slicedToArray(_useState, 2),
      itemIsOpen = _useState2[0],
      setItemIsOpen = _useState2[1];

  (0, _react.useEffect)(function () {
    setItemIsOpen(isOpen);
  }, [isOpen]);

  var toggleItemOpen = function toggleItemOpen() {
    setItemIsOpen(function (isOpen) {
      return !isOpen;
    });
  };

  var childItems;

  if (items && itemIsOpen) {
    childItems = (0, _react2.jsx)("div", {
      className: "euiSideNavItem__items"
    }, items);
  }

  var buttonIcon;

  if (icon) {
    buttonIcon = /*#__PURE__*/(0, _react.cloneElement)(icon, {
      className: (0, _classnames.default)('euiSideNavItemButton__icon', icon.props.className)
    });
  }

  var classes = (0, _classnames.default)('euiSideNavItem', {
    'euiSideNavItem--root': depth === 0,
    'euiSideNavItem--rootIcon': depth === 0 && icon,
    'euiSideNavItem--trunk': depth === 1,
    'euiSideNavItem--branch': depth > 1,
    'euiSideNavItem--hasChildItems': !!childItems,
    'euiSideNavItem--emphasized': emphasize
  }, className);
  var buttonClasses = (0, _classnames.default)('euiSideNavItemButton', {
    'euiSideNavItemButton--isClickable': isClickable,
    'euiSideNavItemButton-isOpen': depth > 0 && itemIsOpen && !isSelected,
    'euiSideNavItemButton-isSelected': isSelected
  }, buttonClassName);
  var caret;

  if (depth > 0 && childrenOnly) {
    caret = (0, _react2.jsx)(_icon.EuiIcon, {
      type: itemIsOpen ? 'arrowDown' : 'arrowRight',
      size: "s"
    });
  }

  var buttonContent = (0, _react2.jsx)("span", {
    className: "euiSideNavItemButton__content"
  }, buttonIcon, (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
    return (0, _react2.jsx)("span", {
      ref: ref,
      title: truncate ? innerText : undefined,
      className: (0, _classnames.default)('euiSideNavItemButton__label', {
        'euiSideNavItemButton__label--truncated': truncate
      })
    }, children);
  }), caret);
  var renderItemProps = {
    href: href,
    rel: rel,
    target: target,
    onClick: childrenOnly ? toggleItemOpen : onClick,
    className: buttonClasses,
    children: buttonContent
  };
  return (0, _react2.jsx)("div", {
    className: classes
  }, (0, _react2.jsx)(RenderItem, _extends({}, renderItemProps, rest)), childItems);
}