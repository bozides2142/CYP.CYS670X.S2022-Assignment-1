"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCard = exports.LAYOUT_ALIGNMENTS = exports.ALIGNMENTS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _services = require("../../services");

var _text = require("../text");

var _title = require("../title");

var _beta_badge = require("../badge/beta_badge");

var _card_select = require("./card_select");

var _accessibility = require("../../services/accessibility");

var _href_validator = require("../../services/security/href_validator");

var _panel = require("../panel");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var textAlignToClassNameMap = {
  left: 'euiCard--leftAligned',
  center: 'euiCard--centerAligned',
  right: 'euiCard--rightAligned'
};
var ALIGNMENTS = (0, _common.keysOf)(textAlignToClassNameMap);
exports.ALIGNMENTS = ALIGNMENTS;
var layoutToClassNameMap = {
  vertical: '',
  horizontal: 'euiCard--horizontal'
};
var LAYOUT_ALIGNMENTS = (0, _common.keysOf)(layoutToClassNameMap);
/**
 * Certain props are only allowed when the layout is vertical
 */

exports.LAYOUT_ALIGNMENTS = LAYOUT_ALIGNMENTS;

var EuiCard = function EuiCard(_ref) {
  var className = _ref.className,
      description = _ref.description,
      _isDisabled = _ref.isDisabled,
      title = _ref.title,
      _ref$titleElement = _ref.titleElement,
      titleElement = _ref$titleElement === void 0 ? 'span' : _ref$titleElement,
      _ref$titleSize = _ref.titleSize,
      titleSize = _ref$titleSize === void 0 ? 's' : _ref$titleSize,
      icon = _ref.icon,
      image = _ref.image,
      children = _ref.children,
      footer = _ref.footer,
      onClick = _ref.onClick,
      href = _ref.href,
      rel = _ref.rel,
      target = _ref.target,
      _ref$textAlign = _ref.textAlign,
      textAlign = _ref$textAlign === void 0 ? 'center' : _ref$textAlign,
      betaBadgeProps = _ref.betaBadgeProps,
      _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? 'vertical' : _ref$layout,
      selectable = _ref.selectable,
      display = _ref.display,
      paddingSize = _ref.paddingSize,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "description", "isDisabled", "title", "titleElement", "titleSize", "icon", "image", "children", "footer", "onClick", "href", "rel", "target", "textAlign", "betaBadgeProps", "layout", "selectable", "display", "paddingSize"]);
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var isDisabled = _isDisabled || !isHrefValid;
  var isClickable = !isDisabled && (onClick || href || selectable && !selectable.isDisabled);
  /**
   * For a11y, we simulate the same click that's provided on the title when clicking the whole card
   * without having to make the whole card a button or anchor tag.
   * *Card Accessibility: The redundant click event https://inclusive-components.design/cards/*
   */

  var link = null;

  var outerOnClick = function outerOnClick(e) {
    if (link && link !== e.target) {
      link.click();
    }
  };

  if (layout === 'horizontal') {
    if (image || footer || textAlign !== 'center') {
      throw new Error('EuiCard: `layout="horizontal"` cannot be used in conjunction with `image`, `footer`, or `textAlign`.');
    }
  }

  var selectableColorClass = selectable ? "euiCard--isSelectable--".concat((0, _card_select.euiCardSelectableColor)(selectable.color, selectable.isSelected)) : undefined;
  var classes = (0, _classnames.default)('euiCard', textAlignToClassNameMap[textAlign], layoutToClassNameMap[layout], {
    'euiCard--isClickable': isClickable,
    'euiCard--hasBetaBadge': betaBadgeProps === null || betaBadgeProps === void 0 ? void 0 : betaBadgeProps.label,
    'euiCard--hasIcon': icon,
    'euiCard--isSelectable': selectable,
    'euiCard-isSelected': selectable === null || selectable === void 0 ? void 0 : selectable.isSelected,
    'euiCard-isDisabled': isDisabled
  }, selectableColorClass, className);
  var ariaId = (0, _accessibility.useGeneratedHtmlId)();
  var ariaDesc = description ? "".concat(ariaId, "Description") : '';
  /**
   * Top area containing image, icon or both
   */

  var imageNode;

  if (image && layout === 'vertical') {
    if ( /*#__PURE__*/(0, _react.isValidElement)(image) || typeof image === 'string') {
      imageNode = (0, _react2.jsx)("div", {
        className: "euiCard__image"
      }, /*#__PURE__*/(0, _react.isValidElement)(image) ? image : (0, _react2.jsx)("img", {
        src: image,
        alt: ""
      }));
    } else {
      imageNode = null;
    }
  }

  var iconNode;

  if (icon) {
    iconNode = /*#__PURE__*/_react.default.cloneElement(icon, {
      className: (0, _classnames.default)(icon.props.className, 'euiCard__icon')
    });
  }

  var optionalCardTop;

  if (imageNode || iconNode) {
    optionalCardTop = (0, _react2.jsx)("div", {
      className: "euiCard__top"
    }, imageNode, iconNode);
  }
  /**
   * Optional EuiBetaBadge
   */


  var optionalBetaBadge;
  var optionalBetaBadgeID = '';

  if (betaBadgeProps === null || betaBadgeProps === void 0 ? void 0 : betaBadgeProps.label) {
    optionalBetaBadgeID = "".concat(ariaId, "BetaBadge");
    optionalBetaBadge = (0, _react2.jsx)("span", {
      className: "euiCard__betaBadgeWrapper"
    }, (0, _react2.jsx)(_beta_badge.EuiBetaBadge, (0, _extends2.default)({
      id: optionalBetaBadgeID
    }, betaBadgeProps, {
      className: (0, _classnames.default)('euiCard__betaBadge', betaBadgeProps === null || betaBadgeProps === void 0 ? void 0 : betaBadgeProps.className)
    }))); // Increase padding size when there is a beta badge unless it's already determined

    paddingSize = paddingSize || 'l';
  }
  /**
   * Optional selectable button
   */


  if (selectable && isDisabled && selectable.isDisabled === undefined) {
    selectable.isDisabled = isDisabled;
  }

  var optionalSelectButton;

  if (selectable) {
    optionalSelectButton = (0, _react2.jsx)(_card_select.EuiCardSelect, (0, _extends2.default)({
      "aria-describedby": "".concat(ariaId, "Title ").concat(ariaDesc)
    }, selectable, {
      buttonRef: function buttonRef(node) {
        link = node;
      }
    }));
  }
  /**
   * Wraps the title with the link (<a>) or button.
   * This makes the title element a11y friendly and gets described by its content if its interactable.
   */


  var theTitle;

  if (!isDisabled && href) {
    theTitle = (0, _react2.jsx)("a", {
      className: "euiCard__titleAnchor",
      onClick: onClick,
      href: href,
      target: target,
      "aria-describedby": ariaDesc,
      rel: (0, _services.getSecureRelForTarget)({
        href: href,
        target: target,
        rel: rel
      }),
      ref: function ref(node) {
        link = node;
      }
    }, title);
  } else if (isDisabled || onClick) {
    theTitle = (0, _react2.jsx)("button", {
      className: "euiCard__titleButton",
      onClick: onClick,
      disabled: isDisabled,
      "aria-describedby": "".concat(optionalBetaBadgeID, " ").concat(ariaDesc),
      ref: function ref(node) {
        link = node;
      }
    }, title);
  } else {
    theTitle = title;
  }
  /**
   * Convert titleElement to a capital TitleElement
   */


  var TitleElement = titleElement;
  return (0, _react2.jsx)(_panel.EuiPanel, (0, _extends2.default)({
    element: "div",
    className: classes,
    onClick: isClickable ? outerOnClick : undefined,
    color: isDisabled ? 'subdued' : display,
    hasShadow: isDisabled || display ? false : true,
    hasBorder: display ? false : undefined,
    paddingSize: paddingSize
  }, rest), optionalCardTop, (0, _react2.jsx)("div", {
    className: "euiCard__content"
  }, (0, _react2.jsx)(_title.EuiTitle, {
    id: "".concat(ariaId, "Title"),
    className: "euiCard__title",
    size: titleSize
  }, (0, _react2.jsx)(TitleElement, null, theTitle)), description && (0, _react2.jsx)(_text.EuiText, {
    id: ariaDesc,
    size: "s",
    className: "euiCard__description"
  }, (0, _react2.jsx)("p", null, description)), children && (0, _react2.jsx)("div", {
    className: "euiCard__children"
  }, children)), optionalBetaBadge, layout === 'vertical' && footer && (0, _react2.jsx)("div", {
    className: "euiCard__footer"
  }, footer), optionalSelectButton);
};

exports.EuiCard = EuiCard;