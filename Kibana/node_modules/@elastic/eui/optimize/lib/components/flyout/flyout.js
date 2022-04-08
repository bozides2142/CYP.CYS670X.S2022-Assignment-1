"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFlyout = exports.PADDING_SIZES = exports.SIZES = exports.SIDES = exports.TYPES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _common = require("../common");

var _focus_trap = require("../focus_trap");

var _overlay_mask = require("../overlay_mask");

var _button = require("../button");

var _i18n = require("../i18n");

var _resize_observer = require("../observer/resize_observer");

var _outside_click_detector = require("../outside_click_detector");

var _portal = require("../portal");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var typeToClassNameMap = {
  push: 'euiFlyout--push',
  overlay: null
};
var TYPES = (0, _common.keysOf)(typeToClassNameMap);
exports.TYPES = TYPES;
var sideToClassNameMap = {
  left: 'euiFlyout--left',
  right: null
};
var SIDES = (0, _common.keysOf)(sideToClassNameMap);
exports.SIDES = SIDES;
var sizeToClassNameMap = {
  s: 'euiFlyout--small',
  m: 'euiFlyout--medium',
  l: 'euiFlyout--large'
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;

/**
 * Custom type checker for named flyout sizes since the prop
 * `size` can also be CSSProperties['width'] (string | number)
 */
function isEuiFlyoutSizeNamed(value) {
  return SIZES.includes(value);
}

var paddingSizeToClassNameMap = {
  none: 'euiFlyout--paddingNone',
  s: 'euiFlyout--paddingSmall',
  m: 'euiFlyout--paddingMedium',
  l: 'euiFlyout--paddingLarge'
};
var PADDING_SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.PADDING_SIZES = PADDING_SIZES;
var defaultElement = 'div';
var EuiFlyout = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var className = _ref.className,
      children = _ref.children,
      as = _ref.as,
      _ref$hideCloseButton = _ref.hideCloseButton,
      hideCloseButton = _ref$hideCloseButton === void 0 ? false : _ref$hideCloseButton,
      closeButtonProps = _ref.closeButtonProps,
      closeButtonAriaLabel = _ref.closeButtonAriaLabel,
      _ref$closeButtonPosit = _ref.closeButtonPosition,
      closeButtonPosition = _ref$closeButtonPosit === void 0 ? 'inside' : _ref$closeButtonPosit,
      onClose = _ref.onClose,
      _ref$ownFocus = _ref.ownFocus,
      ownFocus = _ref$ownFocus === void 0 ? true : _ref$ownFocus,
      _ref$side = _ref.side,
      side = _ref$side === void 0 ? 'right' : _ref$side,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'l' : _ref$paddingSize,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? false : _ref$maxWidth,
      style = _ref.style,
      maskProps = _ref.maskProps,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'overlay' : _ref$type,
      outsideClickCloses = _ref.outsideClickCloses,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? 'dialog' : _ref$role,
      _ref$pushMinBreakpoin = _ref.pushMinBreakpoint,
      pushMinBreakpoint = _ref$pushMinBreakpoin === void 0 ? 'l' : _ref$pushMinBreakpoin,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "children", "as", "hideCloseButton", "closeButtonProps", "closeButtonAriaLabel", "closeButtonPosition", "onClose", "ownFocus", "side", "size", "paddingSize", "maxWidth", "style", "maskProps", "type", "outsideClickCloses", "role", "pushMinBreakpoint"]);
  var Element = as || defaultElement;
  /**
   * Setting the initial state of pushed based on the `type` prop
   * and if the current window size is large enough (larger than `pushMinBreakpoint`)
   */

  var _useState = (0, _react.useState)((0, _services.isWithinMinBreakpoint)(typeof window === 'undefined' ? 0 : window.innerWidth, pushMinBreakpoint)),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      windowIsLargeEnoughToPush = _useState2[0],
      setWindowIsLargeEnoughToPush = _useState2[1];

  var isPushed = type === 'push' && windowIsLargeEnoughToPush;
  /**
   * Watcher added to the window to maintain `isPushed` state depending on
   * the window size compared to the `pushBreakpoint`
   */

  var functionToCallOnWindowResize = (0, _services.throttle)(function () {
    if ((0, _services.isWithinMinBreakpoint)(window.innerWidth, pushMinBreakpoint)) {
      setWindowIsLargeEnoughToPush(true);
    } else {
      setWindowIsLargeEnoughToPush(false);
    } // reacts every 50ms to resize changes and always gets the final update

  }, 50);
  /**
   * Setting up the refs on the actual flyout element in order to
   * accommodate for the `isPushed` state by adding padding to the body equal to the width of the element
   */

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      resizeRef = _useState4[0],
      setResizeRef = _useState4[1];

  var setRef = (0, _services.useCombinedRefs)([setResizeRef, ref]); // TODO: Allow this hook to be conditional

  var dimensions = (0, _resize_observer.useResizeObserver)(resizeRef);
  (0, _react.useEffect)(function () {
    // This class doesn't actually do anything by EUI, but is nice to add for consumers (JIC)
    document.body.classList.add('euiBody--hasFlyout');
    /**
     * Accomodate for the `isPushed` state by adding padding to the body equal to the width of the element
     */

    if (type === 'push') {
      // Only add the event listener if we'll need to accommodate with padding
      window.addEventListener('resize', functionToCallOnWindowResize);

      if (isPushed) {
        if (side === 'right') {
          document.body.style.paddingRight = "".concat(dimensions.width, "px");
        } else if (side === 'left') {
          document.body.style.paddingLeft = "".concat(dimensions.width, "px");
        }
      }
    }

    return function () {
      document.body.classList.remove('euiBody--hasFlyout');

      if (type === 'push') {
        window.removeEventListener('resize', functionToCallOnWindowResize);

        if (side === 'right') {
          document.body.style.paddingRight = '';
        } else if (side === 'left') {
          document.body.style.paddingLeft = '';
        }
      }
    };
  }, [type, side, dimensions, isPushed, functionToCallOnWindowResize]);
  /**
   * ESC key closes flyout (always?)
   */

  var onKeyDown = function onKeyDown(event) {
    if (!isPushed && event.key === _services.keys.ESCAPE) {
      event.preventDefault();
      onClose();
    }
  };

  var newStyle;
  var widthClassName;
  var sizeClassName; // Setting max-width

  if (maxWidth === true) {
    widthClassName = 'euiFlyout--maxWidth-default';
  } else if (maxWidth !== false) {
    var value = typeof maxWidth === 'number' ? "".concat(maxWidth, "px") : maxWidth;
    newStyle = _objectSpread(_objectSpread({}, style), {}, {
      maxWidth: value
    });
  } // Setting size


  if (isEuiFlyoutSizeNamed(size)) {
    sizeClassName = sizeToClassNameMap[size];
  } else if (newStyle) {
    newStyle.width = size;
  } else {
    newStyle = _objectSpread(_objectSpread({}, style), {}, {
      width: size
    });
  }

  var classes = (0, _classnames.default)('euiFlyout', typeToClassNameMap[type], sideToClassNameMap[side], sizeClassName, paddingSizeToClassNameMap[paddingSize], widthClassName, className);
  var closeButton;

  if (onClose && !hideCloseButton) {
    var closeButtonClasses = (0, _classnames.default)('euiFlyout__closeButton', "euiFlyout__closeButton--".concat(closeButtonPosition), closeButtonProps === null || closeButtonProps === void 0 ? void 0 : closeButtonProps.className);
    closeButton = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiFlyout.closeAriaLabel",
      default: "Close this dialog"
    }, function (closeAriaLabel) {
      return (0, _react2.jsx)(_button.EuiButtonIcon, (0, _extends2.default)({
        display: closeButtonPosition === 'outside' ? 'fill' : 'empty',
        iconType: "cross",
        color: "text",
        "aria-label": closeButtonAriaLabel || closeAriaLabel,
        "data-test-subj": "euiFlyoutCloseButton"
      }, closeButtonProps, {
        className: closeButtonClasses,
        onClick: function onClick(e) {
          onClose();
          (closeButtonProps === null || closeButtonProps === void 0 ? void 0 : closeButtonProps.onClick) && closeButtonProps.onClick(e);
        }
      }));
    });
  }

  var flyoutContent = (0, _react2.jsx)(Element, (0, _extends2.default)({}, rest, {
    role: role,
    className: classes,
    tabIndex: -1,
    style: newStyle || style,
    ref: setRef
  }), closeButton, children);
  /*
   * Trap focus even when `ownFocus={false}`, otherwise closing
   * the flyout won't return focus to the originating button.
   *
   * Set `clickOutsideDisables={true}` when `ownFocus={false}`
   * to allow non-keyboard users the ability to interact with
   * elements outside the flyout.
   */

  var flyout = (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
    disabled: isPushed,
    clickOutsideDisables: !ownFocus
  }, flyoutContent);
  /**
   * Unless outsideClickCloses = true, then add the outside click detector
   */

  if (ownFocus === false && outsideClickCloses === true) {
    flyout = (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
      disabled: isPushed,
      clickOutsideDisables: !ownFocus
    }, (0, _react2.jsx)(_outside_click_detector.EuiOutsideClickDetector, {
      isDisabled: isPushed,
      onOutsideClick: function onOutsideClick() {
        return onClose();
      }
    }, flyoutContent));
  } // If ownFocus is set, wrap with an overlay and allow the user to click it to close it.


  if (ownFocus && !isPushed) {
    flyout = (0, _react2.jsx)(_overlay_mask.EuiOverlayMask, (0, _extends2.default)({
      onClick: outsideClickCloses === false ? undefined : onClose,
      headerZindexLocation: "below"
    }, maskProps), flyout);
  } else if (!isPushed) {
    // Otherwise still wrap within an EuiPortal so it appends (unless it is the push style)
    flyout = (0, _react2.jsx)(_portal.EuiPortal, null, flyout);
  }

  return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_services.EuiWindowEvent, {
    event: "keydown",
    handler: onKeyDown
  }), flyout);
} // React.forwardRef interferes with the inferred element type
// Casting to ensure correct element prop type checking for `as`
// e.g., `href` is not on a `div`
); // Recast to allow `displayName`

exports.EuiFlyout = EuiFlyout;
EuiFlyout.displayName = 'EuiFlyout';