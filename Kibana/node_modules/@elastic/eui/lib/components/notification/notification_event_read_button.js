"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiNotificationEventReadButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _button = require("../button");

var _i18n = require("../i18n");

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiNotificationEventReadButton = function EuiNotificationEventReadButton(_ref) {
  var id = _ref.id,
      isRead = _ref.isRead,
      onClick = _ref.onClick,
      eventName = _ref.eventName,
      rest = _objectWithoutProperties(_ref, ["id", "isRead", "onClick", "eventName"]);

  var classesReadState = (0, _classnames.default)('euiNotificationEventReadButton', {
    'euiNotificationEventReadButton--isRead': isRead
  });
  var markAsReadAria = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsReadAria', 'Mark {eventName} as read', {
    eventName: eventName
  });
  var markAsUnreadAria = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsUnreadAria', 'Mark {eventName} as unread', {
    eventName: eventName
  });
  var markAsRead = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsRead', 'Mark as read');
  var markAsUnread = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsUnread', 'Mark as unread');
  var buttonAriaLabel = isRead ? markAsUnreadAria : markAsReadAria;
  var buttonTitle = isRead ? markAsUnread : markAsRead;
  return (0, _react2.jsx)(_button.EuiButtonIcon, _extends({
    iconType: "dot",
    "aria-label": buttonAriaLabel,
    title: buttonTitle,
    className: classesReadState,
    onClick: onClick,
    "data-test-subj": "".concat(id, "-notificationEventReadButton")
  }, rest));
};

exports.EuiNotificationEventReadButton = EuiNotificationEventReadButton;
EuiNotificationEventReadButton.propTypes = {
  /**
     * Any of the named color palette options.
     */
  color: _propTypes.default.oneOf(["primary", "accent", "success", "warning", "danger", "ghost", "text"]),
  "aria-label": _propTypes.default.string,
  "aria-labelledby": _propTypes.default.string,

  /**
     * Size of the icon only.
     * This will not affect the overall size of the button
     */
  iconSize: _propTypes.default.oneOf(["original", "s", "m", "l", "xl", "xxl"]),

  /**
     * Sets the display style for matching other EuiButton types.
     * `base` is equivalent to a typical EuiButton
     * `fill` is equivalent to a filled EuiButton
     * `empty` (default) is equivalent to an EuiButtonEmpty
     */
  display: _propTypes.default.oneOf(["base", "empty", "fill"]),
  className: _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  id: _propTypes.default.string.isRequired,

  /**
     * Shows an indicator of the read state of the event
     */
  isRead: _propTypes.default.bool.isRequired,

  /**
     * Applies an `onClick` handler to the `read` indicator.
     */
  onClick: _propTypes.default.func.isRequired,

  /**
     * A unique, human-friendly name for the event to be used in aria attributes (e.g. "alert-critical-01", "cloud-no-severity-12", etc..).
     */
  eventName: _propTypes.default.string.isRequired
};