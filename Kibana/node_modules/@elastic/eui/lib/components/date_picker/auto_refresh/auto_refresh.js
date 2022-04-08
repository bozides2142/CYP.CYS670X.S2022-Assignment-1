"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiAutoRefreshButton = exports.EuiAutoRefresh = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../../form");

var _button_empty = require("../../button/button_empty/button_empty");

var _popover = require("../../popover");

var _i18n = require("../../i18n");

var _pretty_interval = require("../super_date_picker/pretty_interval");

var _refresh_interval = require("./refresh_interval");

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

var EuiAutoRefresh = function EuiAutoRefresh(_ref) {
  var className = _ref.className,
      onRefreshChange = _ref.onRefreshChange,
      isDisabled = _ref.isDisabled,
      _ref$isPaused = _ref.isPaused,
      isPaused = _ref$isPaused === void 0 ? true : _ref$isPaused,
      _ref$refreshInterval = _ref.refreshInterval,
      refreshInterval = _ref$refreshInterval === void 0 ? 1000 : _ref$refreshInterval,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? true : _ref$readOnly,
      rest = _objectWithoutProperties(_ref, ["className", "onRefreshChange", "isDisabled", "isPaused", "refreshInterval", "readOnly"]);

  var classes = (0, _classnames.default)('euiAutoRefresh', className);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPopoverOpen = _useState2[0],
      setIsPopoverOpen = _useState2[1];

  var autoRefeshLabel = (0, _i18n.useEuiI18n)('euiAutoRefresh.autoRefreshLabel', 'Auto refresh');
  return (0, _react2.jsx)(_popover.EuiInputPopover, {
    className: classes,
    fullWidth: rest.fullWidth,
    input: (0, _react2.jsx)(_form.EuiFieldText, _extends({
      "aria-label": autoRefeshLabel,
      onClick: function onClick() {
        return setIsPopoverOpen(function (isOpen) {
          return !isOpen;
        });
      },
      prepend: (0, _react2.jsx)(_button_empty.EuiButtonEmpty, {
        className: "euiFormControlLayout__prepend",
        onClick: function onClick() {
          return setIsPopoverOpen(function (isOpen) {
            return !isOpen;
          });
        },
        size: "s",
        color: "text",
        iconType: "timeRefresh",
        isDisabled: isDisabled
      }, (0, _react2.jsx)("strong", null, (0, _react2.jsx)("small", null, autoRefeshLabel))),
      readOnly: readOnly,
      disabled: isDisabled,
      value: (0, _pretty_interval.prettyInterval)(Boolean(isPaused), refreshInterval)
    }, rest)),
    isOpen: isPopoverOpen,
    closePopover: function closePopover() {
      setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)(_refresh_interval.EuiRefreshInterval, {
    onRefreshChange: onRefreshChange,
    isPaused: isPaused,
    refreshInterval: refreshInterval
  }));
};

exports.EuiAutoRefresh = EuiAutoRefresh;
EuiAutoRefresh.propTypes = {
  /**
     * Is refresh paused or running.
     */
  isPaused: _propTypes.default.bool,

  /**
     * Refresh interval in milliseconds.
     */
  refreshInterval: _propTypes.default.number,

  /**
     * Passes back the updated state of `isPaused` and `refreshInterval`.
     */
  onRefreshChange: _propTypes.default.func.isRequired,
  isDisabled: _propTypes.default.bool,

  /**
     * The input is `readOnly` by default because the input value is handled by the popover form.
     * If you need make the input `isInvalid`, you'll need to set `readOnly` to `false`.
     */
  readOnly: _propTypes.default.any
};

var EuiAutoRefreshButton = function EuiAutoRefreshButton(_ref2) {
  var className = _ref2.className,
      onRefreshChange = _ref2.onRefreshChange,
      isDisabled = _ref2.isDisabled,
      _ref2$isPaused = _ref2.isPaused,
      isPaused = _ref2$isPaused === void 0 ? true : _ref2$isPaused,
      _ref2$refreshInterval = _ref2.refreshInterval,
      refreshInterval = _ref2$refreshInterval === void 0 ? 1000 : _ref2$refreshInterval,
      _ref2$shortHand = _ref2.shortHand,
      shortHand = _ref2$shortHand === void 0 ? false : _ref2$shortHand,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? 's' : _ref2$size,
      _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? 'text' : _ref2$color,
      rest = _objectWithoutProperties(_ref2, ["className", "onRefreshChange", "isDisabled", "isPaused", "refreshInterval", "shortHand", "size", "color"]);

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isPopoverOpen = _useState4[0],
      setIsPopoverOpen = _useState4[1];

  var classes = (0, _classnames.default)('euiAutoRefreshButton', className);
  var autoRefeshLabelOff = (0, _i18n.useEuiI18n)('euiAutoRefresh.buttonLabelOff', 'Auto refresh is off');
  var autoRefeshLabelOn = (0, _i18n.useEuiI18n)('euiAutoRefresh.buttonLabelOn', 'Auto refresh is on and set to {prettyInterval}', {
    prettyInterval: (0, _pretty_interval.prettyInterval)(Boolean(isPaused), refreshInterval)
  });
  return (0, _react2.jsx)(_popover.EuiPopover, {
    button: (0, _react2.jsx)(_button_empty.EuiButtonEmpty, _extends({
      onClick: function onClick() {
        return setIsPopoverOpen(function (isOpen) {
          return !isOpen;
        });
      },
      className: classes,
      size: size,
      color: color,
      iconType: "timeRefresh",
      title: isPaused ? autoRefeshLabelOff : autoRefeshLabelOn,
      isDisabled: isDisabled
    }, rest), (0, _pretty_interval.prettyInterval)(Boolean(isPaused), refreshInterval, shortHand)),
    isOpen: isPopoverOpen,
    closePopover: function closePopover() {
      setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)(_refresh_interval.EuiRefreshInterval, {
    onRefreshChange: onRefreshChange,
    isPaused: isPaused,
    refreshInterval: refreshInterval
  }));
};

exports.EuiAutoRefreshButton = EuiAutoRefreshButton;
EuiAutoRefreshButton.propTypes = {
  isPaused: _propTypes.default.bool,
  refreshInterval: _propTypes.default.number,
  onRefreshChange: _propTypes.default.func.isRequired,

  /**
     * `disabled` is also allowed
     */
  isDisabled: _propTypes.default.bool,

  /**
     * Reduces the time unit to a single letter
     */
  shortHand: _propTypes.default.bool,

  /**
     * Any of our named colors
     */
  color: _propTypes.default.oneOf(["primary", "danger", "text", "ghost", "success", "warning"]),
  size: _propTypes.default.oneOf(["xs", "s", "m"]),

  /**
     * Ensure the text of the button sits flush to the left, right, or both sides of its container
     */
  flush: _propTypes.default.oneOf(["left", "right", "both"]),

  /**
     * Force disables the button and changes the icon to a loading spinner
     */
  isLoading: _propTypes.default.bool,
  href: _propTypes.default.string,
  target: _propTypes.default.string,
  rel: _propTypes.default.string,
  buttonRef: _propTypes.default.any,

  /**
     * Object of props passed to the <span/> wrapping the button's content
     */
  contentProps: _propTypes.default.any,

  /**
     * Object of props passed to the <span/> wrapping the content's text/children only (not icon)
     */
  textProps: _propTypes.default.shape({
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,
    ref: _propTypes.default.any,
    "data-text": _propTypes.default.string
  }),
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};