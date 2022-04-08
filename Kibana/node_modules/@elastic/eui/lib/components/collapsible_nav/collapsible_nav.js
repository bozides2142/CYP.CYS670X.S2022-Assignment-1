"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCollapsibleNav = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _flyout = require("../flyout");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
      rest = _objectWithoutProperties(_ref, ["id", "children", "className", "isDocked", "isOpen", "button", "showButtonIfDocked", "dockedBreakpoint", "as", "size", "side", "role", "ownFocus", "outsideClickCloses", "closeButtonPosition", "paddingSize"]);

  var flyoutID = (0, _services.useGeneratedHtmlId)({
    conditionalId: id,
    suffix: 'euiCollapsibleNav'
  });
  /**
   * Setting the initial state of pushed based on the `type` prop
   * and if the current window size is large enough (larger than `pushBreakpoint`)
   */

  var _useState = (0, _react.useState)((0, _services.isWithinMinBreakpoint)(typeof window === 'undefined' ? 0 : window.innerWidth, dockedBreakpoint)),
      _useState2 = _slicedToArray(_useState, 2),
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
  var flyout = (0, _react2.jsx)(_flyout.EuiFlyout, _extends({
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
EuiCollapsibleNav.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Sets the HTML element for `EuiFlyout`
     */
  as: _propTypes.default.any,
  onClose: _propTypes.default.func.isRequired,

  /**
     * Defines the width of the panel.
     * Pass a predefined size of `s | m | l`, or pass any number/string compatible with the CSS `width` attribute
     */
  size: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.any.isRequired]),

  /**
     * Sets the max-width of the panel,
     * set to `true` to use the default size,
     * set to `false` to not restrict the width,
     * set to a number for a custom width in px,
     * set to a string for a custom width in custom measurement.
     */
  maxWidth: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.number.isRequired, _propTypes.default.string.isRequired]),

  /**
     * Customize the padding around the content of the flyout header, body and footer
     */
  paddingSize: _propTypes.default.any,

  /**
     * Adds an EuiOverlayMask and wraps in an EuiPortal
     */
  ownFocus: _propTypes.default.bool,

  /**
     * Hides the default close button. You must provide another close button somewhere within the flyout.
     */
  hideCloseButton: _propTypes.default.bool,

  /**
     * Extends EuiButtonIconProps onto the close button
     */
  closeButtonProps: _propTypes.default.any,

  /**
     * Position of close button.
     * `inside`: Floating to just inside the flyout, always top right;
     * `outside`: Floating just outside the flyout near the top (side dependent on `side`). Helpful when the close button may cover other interactable content.
     */
  closeButtonPosition: _propTypes.default.oneOf(["inside", "outside"]),

  /**
     * Adjustments to the EuiOverlayMask that is added when `ownFocus = true`
     */
  maskProps: _propTypes.default.shape({
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,

    /**
       * Function that applies to clicking the mask itself and not the children
       */
    onClick: _propTypes.default.func,

    /**
       * ReactNode to render as this component's content
       */
    children: _propTypes.default.node,

    /**
       * Should the mask visually sit above or below the EuiHeader (controlled by z-index)
       */
    headerZindexLocation: _propTypes.default.oneOf(["above", "below"])
  }),

  /**
     * Forces this interaction on the mask overlay or body content.
     * Defaults depend on `ownFocus` and `type` values
     */
  outsideClickCloses: _propTypes.default.bool,

  /**
     * Which side of the window to attach to.
     * The `left` option should only be used for navigation.
     */
  side: _propTypes.default.any,

  /**
     * Defaults to `dialog` which is best for most cases of the flyout.
     * Otherwise pass in your own, aria-role, or `null` to remove it and use the semantic `as` element instead
     */
  role: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.string.isRequired]),

  /**
     * Named breakpoint or pixel value for customizing the minimum window width to enable docking
     */
  pushMinBreakpoint: _propTypes.default.oneOfType([_propTypes.default.oneOf(["xs", "s", "m", "l", "xl"]).isRequired, _propTypes.default.number.isRequired]),
  style: _propTypes.default.any,

  /**
     * ReactNode to render as this component's content
     */
  children: _propTypes.default.node,

  /**
     * Shows the navigation flyout
     */
  isOpen: _propTypes.default.bool,

  /**
     * Keeps navigation flyout visible and push `<body>` content via padding
     */
  isDocked: _propTypes.default.bool,
  dockedBreakpoint: _propTypes.default.oneOfType([_propTypes.default.oneOf(["xs", "s", "m", "l", "xl"]).isRequired, _propTypes.default.number.isRequired]),

  /**
     * Button for controlling visible state of the nav
     */
  button: _propTypes.default.element,

  /**
     * Keeps the display of toggle button when in docked state
     */
  showButtonIfDocked: _propTypes.default.bool
};