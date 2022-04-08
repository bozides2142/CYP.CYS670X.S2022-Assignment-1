"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiKeyPadMenuItem = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _beta_badge = require("../badge/beta_badge");

var _services = require("../../services");

var _form = require("../form");

var _href_validator = require("../../services/security/href_validator");

var _tool_tip = require("../tool_tip");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiKeyPadMenuItem = function EuiKeyPadMenuItem(_ref) {
  var id = _ref.id,
      isSelected = _ref.isSelected,
      _isDisabled = _ref.isDisabled,
      label = _ref.label,
      children = _ref.children,
      className = _ref.className,
      betaBadgeLabel = _ref.betaBadgeLabel,
      betaBadgeTooltipContent = _ref.betaBadgeTooltipContent,
      betaBadgeIconType = _ref.betaBadgeIconType,
      betaBadgeTooltipProps = _ref.betaBadgeTooltipProps,
      href = _ref.href,
      rel = _ref.rel,
      target = _ref.target,
      buttonRef = _ref.buttonRef,
      checkable = _ref.checkable,
      name = _ref.name,
      value = _ref.value,
      disabled = _ref.disabled,
      _onChange = _ref.onChange,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["id", "isSelected", "isDisabled", "label", "children", "className", "betaBadgeLabel", "betaBadgeTooltipContent", "betaBadgeIconType", "betaBadgeTooltipProps", "href", "rel", "target", "buttonRef", "checkable", "name", "value", "disabled", "onChange"]);
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var isDisabled = disabled || _isDisabled || !isHrefValid;
  var classes = (0, _classnames.default)('euiKeyPadMenuItem', {
    'euiKeyPadMenuItem--hasBetaBadge': betaBadgeLabel,
    'euiKeyPadMenuItem--checkable': checkable,
    'euiKeyPadMenuItem-isDisabled': isDisabled,
    'euiKeyPadMenuItem-isSelected': isSelected
  }, className);
  var Element = href && !isDisabled ? 'a' : 'button';
  if (checkable) Element = 'label';
  var itemId = (0, _services.useGeneratedHtmlId)({
    conditionalId: id
  });

  var renderCheckableElement = function renderCheckableElement() {
    if (!checkable) return;
    var inputClasses = (0, _classnames.default)('euiKeyPadMenuItem__checkableInput');
    var checkableElement;

    if (checkable === 'single') {
      checkableElement = (0, _react2.jsx)(_form.EuiRadio, {
        id: itemId,
        className: inputClasses,
        checked: isSelected,
        disabled: isDisabled,
        name: name,
        value: value,
        onChange: function onChange() {
          return _onChange(itemId, value);
        }
      });
    } else {
      checkableElement = (0, _react2.jsx)(_form.EuiCheckbox, {
        id: itemId,
        className: inputClasses,
        checked: isSelected,
        disabled: isDisabled,
        name: name,
        onChange: function onChange() {
          return _onChange(itemId);
        }
      });
    }

    return checkableElement;
  };

  var renderBetaBadge = function renderBetaBadge() {
    if (!betaBadgeLabel) return;
    return (0, _react2.jsx)(_beta_badge.EuiBetaBadge // Since we move the tooltip contents to a wrapping EuiToolTip,
    // this badge is purely visual therefore we can safely hide it from screen readers
    , {
      "aria-hidden": "true",
      size: "s",
      color: "subdued",
      className: "euiKeyPadMenuItem__betaBadge",
      label: betaBadgeLabel.charAt(0),
      iconType: betaBadgeIconType
    });
  };

  var relObj = {};

  if (href && !isDisabled) {
    relObj.href = href;
    relObj.rel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
    relObj.target = target;
    relObj['aria-current'] = isSelected ? isSelected : undefined;
  } else if (checkable) {
    relObj.htmlFor = itemId;
  } else {
    relObj.disabled = isDisabled;
    relObj.type = 'button';
    relObj['aria-pressed'] = isSelected;
  }

  var button = (0, _react2.jsx)(Element, (0, _extends2.default)({
    className: classes
  }, relObj, rest, {
    // Unable to get past `LegacyRef` conflicts
    ref: buttonRef
  }), (0, _react2.jsx)("span", {
    className: "euiKeyPadMenuItem__inner"
  }, checkable ? renderCheckableElement() : renderBetaBadge(), (0, _react2.jsx)("span", {
    className: "euiKeyPadMenuItem__icon"
  }, children), (0, _react2.jsx)("span", {
    className: "euiKeyPadMenuItem__label"
  }, label)));
  return betaBadgeLabel ? (0, _react2.jsx)(_tool_tip.EuiToolTip, (0, _extends2.default)({}, betaBadgeTooltipProps, {
    title: betaBadgeLabel,
    content: betaBadgeTooltipContent,
    delay: "long"
  }), button) : button;
};

exports.EuiKeyPadMenuItem = EuiKeyPadMenuItem;