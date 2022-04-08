"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiNotificationEventMessages = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _accordion = require("../accordion");

var _services = require("../../services");

var _i18n = require("../i18n");

var _text = require("../text");

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

var EuiNotificationEventMessages = function EuiNotificationEventMessages(_ref) {
  var messages = _ref.messages,
      eventName = _ref.eventName;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var messagesLength = messages.length;
  var accordionId = (0, _services.useGeneratedHtmlId)({
    prefix: 'euiNotificationEventMessagesAccordion'
  });
  var accordionButtonText = (0, _i18n.useEuiI18n)('euiNotificationEventMessages.accordionButtonText', '+ {messagesLength} more', {
    messagesLength: messagesLength - 1
  });
  var accordionAriaLabelButtonText = (0, _i18n.useEuiI18n)('euiNotificationEventMessages.accordionAriaLabelButtonText', '+ {messagesLength} messages for {eventName}', {
    messagesLength: messagesLength - 1,
    eventName: eventName
  });
  var accordionHideText = (0, _i18n.useEuiI18n)('euiNotificationEventMessages.accordionHideText', 'hide');
  var buttonContentText = isOpen ? "".concat(accordionButtonText, " (").concat(accordionHideText, ")") : accordionButtonText;
  return (0, _react2.jsx)("div", {
    className: "euiNotificationEventMessages"
  }, messages && messagesLength === 1 ? (0, _react2.jsx)(_text.EuiText, {
    size: "s",
    color: "subdued"
  }, (0, _react2.jsx)("p", null, messages)) : (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_text.EuiText, {
    size: "s",
    color: "subdued"
  }, (0, _react2.jsx)("p", null, messages[0])), (0, _react2.jsx)(_accordion.EuiAccordion, {
    onToggle: setIsOpen,
    buttonProps: {
      'aria-label': accordionAriaLabelButtonText
    },
    id: accordionId,
    className: "euiNotificationEventMessages__accordion",
    buttonContent: buttonContentText,
    buttonClassName: "euiNotificationEventMessages__accordionButton",
    arrowDisplay: "none"
  }, (0, _react2.jsx)("div", {
    className: "euiNotificationEventMessages__accordionContent"
  }, messages.map(function (notification, index) {
    return (0, _react2.jsx)(_text.EuiText, {
      size: "s",
      key: index,
      color: "subdued"
    }, (0, _react2.jsx)("p", null, notification));
  }).slice(1)))));
};

exports.EuiNotificationEventMessages = EuiNotificationEventMessages;
EuiNotificationEventMessages.propTypes = {
  /*
     * An array of strings that get individually wrapped in `<p>` tags
     */
  messages: _propTypes.default.arrayOf(_propTypes.default.string.isRequired).isRequired,

  /**
     * A unique, human-friendly name for the event to be used in aria attributes (e.g. "alert-critical-01", "cloud-no-severity-12", etc..).
     */
  eventName: _propTypes.default.string.isRequired
};