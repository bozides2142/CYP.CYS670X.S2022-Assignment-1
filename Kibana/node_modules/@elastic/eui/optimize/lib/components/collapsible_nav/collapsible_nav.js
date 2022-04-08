"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCollapsibleNav = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _flyout = require("../flyout");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiCollapsibleNav = function EuiCollapsibleNav(_ref) {
  var id = _ref.id,
      children = _ref.children,
      className = _ref.className,
      _ref$isDocked = _ref.isDocked,
      isDocked = _ref$isDocked === void 0 ? false : _ref$isDocked,
      _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? false : _ref$isOpen,
      button = _ref.button,
      _ref$showButtonIfDock = _ref.showButtonIfDocked,
      showButtonIfDocked = _ref$showButtonIfDock === void 0 ? false : _ref$showButtonIfDock,
      _ref$dockedBreakpoint = _ref.dockedBreakpoint,
      dockedBreakpoint = _ref$dockedBreakpoint === void 0 ? 'l' : _ref$dockedBreakpoint,
      _ref$as = _ref.as,
      as = _ref$as === void 0 ? 'nav' : _ref$as,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 320 : _ref$size,
      _ref$side = _ref.side,
      side = _ref$side === void 0 ? 'left' : _ref$side,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? null : _ref$role,
      _ref$ownFocus = _ref.ownFocus,
      ownFocus = _ref$ownFocus === void 0 ? true : _ref$ownFocus,
      _ref$outsideClickClos = _ref.outsideClickCloses,
      outsideClickCloses = _ref$outsideClickClos === void 0 ? true : _ref$outsideClickClos,
      _ref$closeButtonPosit = _ref.closeButtonPosition,
      closeButtonPosition = _ref$closeButtonPosit === void 0 ? 'outside' : _ref$closeButtonPosit,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'none' : _ref$paddingSize,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["id", "children", "className", "isDocked", "isOpen", "button", "showButtonIfDocked", "dockedBreakpoint", "as", "size", "side", "role", "ownFocus", "outsideClickCloses", "closeButtonPosition", "paddingSize"]);
  var flyoutID = (0, _services.useGeneratedHtmlId)({
    conditionalId: id,
    suffix: 'euiCollapsibleNav'
  });
  /**
   * Setting the initial state of pushed based on the `type` prop
   * and if the current window size is large enough (larger than `pushBreakpoint`)
   */

  var _useState = (0, _react.useState)((0, _services.isWithinMinBreakpoint)(typeof window === 'undefined' ? 0 : window.innerWidth, dockedBreakpoint)),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      windowIsLargeEnoughToPush = _useState2[0],
      setWindowIsLargeEnoughToPush = _useState2[1];

  var navIsDocked = isDocked && windowIsLargeEnoughToPush;
  /**
   * Watcher added to the window to maintain `isPushed` state depending on
   * the window size compared to the `pushBreakpoint`
   */

  var functionToCallOnWindowResize = (0, _services.throttle)(function () {
    if ((0, _services.isWithinMinBreakpoint)(window.innerWidth, dockedBreakpoint)) {
      setWindowIsLargeEnoughToPush(true);
    } else {
      setWindowIsLargeEnoughToPush(false);
    } // reacts every 50ms to resize changes and always gets the final update

  }, 50);
  (0, _react.useEffect)(function () {
    if (isDocked) {
      // Only add the event listener if we'll need to accommodate with padding
      window.addEventListener('resize', functionToCallOnWindowResize);
    }

    return function () {
      if (isDocked) {
        window.removeEventListener('resize', functionToCallOnWindowResize);
      }
    };
  }, [isDocked, functionToCallOnWindowResize]);
  var classes = (0, _classnames.default)('euiCollapsibleNav', className); // Show a trigger button if one was passed but
  // not if navIsDocked and showButtonIfDocked is false

  var trigger = navIsDocked && !showButtonIfDocked ? undefined : button && /*#__PURE__*/(0, _react.cloneElement)(button, {
    'aria-controls': flyoutID,
    'aria-expanded': isOpen,
    'aria-pressed': isOpen,
    // When EuiOutsideClickDetector is enabled, we don't want both the toggle button and document touches/clicks to happen, they'll cancel eachother out
    onTouchEnd: function onTouchEnd(e) {
      e.nativeEvent.stopImmediatePropagation();
    },
    onMouseUpCapture: function onMouseUpCapture(e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  });
  var flyout = (0, _react2.jsx)(_flyout.EuiFlyout, (0, _extends2.default)({
    id: flyoutID,
    className: classes // Flyout props we set different defaults for
    ,
    as: as,
    size: size,
    side: side,
    role: role,
    ownFocus: ownFocus,
    outsideClickCloses: outsideClickCloses,
    closeButtonPosition: closeButtonPosition,
    paddingSize: paddingSize
  }, rest, {
    // Props dependent on internal docked status
    type: navIsDocked ? 'push' : 'overlay',
    hideCloseButton: navIsDocked,
    pushMinBreakpoint: dockedBreakpoint
  }), children);
  return (0, _react2.jsx)(_react.default.Fragment, null, trigger, (isOpen || navIsDocked) && flyout);
};

exports.EuiCollapsibleNav = EuiCollapsibleNav;