"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiInputPopover = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _tabbable = _interopRequireDefault(require("tabbable"));

var _focus_trap = require("../focus_trap");

var _popover = require("./popover");

var _resize_observer = require("../observer/resize_observer");

var _services = require("../../services");

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

var EuiInputPopover = function EuiInputPopover(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$disableFocusTrap = _ref.disableFocusTrap,
      disableFocusTrap = _ref$disableFocusTrap === void 0 ? false : _ref$disableFocusTrap,
      input = _ref.input,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      onPanelResize = _ref.onPanelResize,
      props = _objectWithoutProperties(_ref, ["children", "className", "disableFocusTrap", "input", "fullWidth", "onPanelResize"]);

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      inputEl = _useState2[0],
      setInputEl = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      inputElWidth = _useState4[0],
      setInputElWidth = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      panelEl = _useState6[0],
      setPanelEl = _useState6[1];

  var inputRef = function inputRef(node) {
    return setInputEl(node);
  };

  var panelRef = function panelRef(node) {
    return setPanelEl(node);
  };

  var setPanelWidth = (0, _react.useCallback)(function (width) {
    if (panelEl && (!!inputElWidth || !!width)) {
      var newWidth = !!width ? width : inputElWidth;
      panelEl.style.width = "".concat(newWidth, "px");

      if (onPanelResize) {
        onPanelResize(newWidth);
      }
    }
  }, [panelEl, inputElWidth, onPanelResize]);
  var onResize = (0, _react.useCallback)(function () {
    if (inputEl) {
      var _width = inputEl.getBoundingClientRect().width;
      setInputElWidth(_width);
      setPanelWidth(_width);
    }
  }, [inputEl, setPanelWidth]);
  (0, _react.useEffect)(function () {
    onResize();
  }, [onResize]);
  (0, _react.useEffect)(function () {
    setPanelWidth();
  }, [setPanelWidth]);

  var onKeyDown = function onKeyDown(event) {
    if (panelEl && event.key === _services.cascadingMenuKeys.TAB) {
      var tabbableItems = (0, _tabbable.default)(panelEl).filter(function (el) {
        return Array.from(el.attributes).map(function (el) {
          return el.name;
        }).indexOf('data-focus-guard') < 0;
      });

      if (disableFocusTrap || tabbableItems.length && tabbableItems[tabbableItems.length - 1] === document.activeElement) {
        props.closePopover();
      }
    }
  };

  var classes = (0, _classnames.default)('euiInputPopover', {
    'euiInputPopover--fullWidth': fullWidth
  }, className);
  return (0, _react2.jsx)(_popover.EuiPopover, _extends({
    ownFocus: false,
    button: (0, _react2.jsx)(_resize_observer.EuiResizeObserver, {
      onResize: onResize
    }, function (resizeRef) {
      return (0, _react2.jsx)("div", {
        ref: resizeRef
      }, input);
    }),
    buttonRef: inputRef,
    panelRef: panelRef,
    className: classes
  }, props), (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
    clickOutsideDisables: true,
    disabled: disableFocusTrap
  }, (0, _react2.jsx)("div", {
    onKeyDown: onKeyDown
  }, children)));
};

exports.EuiInputPopover = EuiInputPopover;
EuiInputPopover.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  disableFocusTrap: _propTypes.default.bool,
  fullWidth: _propTypes.default.bool,
  input: _propTypes.default.any.isRequired,
  inputRef: _propTypes.default.any,
  onPanelResize: _propTypes.default.func
};
EuiInputPopover.defaultProps = {
  anchorPosition: 'downLeft',
  attachToAnchor: true,
  display: 'block',
  panelPaddingSize: 's'
};