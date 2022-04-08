"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiNotificationEventReadIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18n = require("../i18n");

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../icon");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiNotificationEventReadIcon = function EuiNotificationEventReadIcon(_ref) {
  var id = _ref.id,
      isRead = _ref.isRead,
      eventName = _ref.eventName,
      rest = _objectWithoutProperties(_ref, ["id", "isRead", "eventName"]);

  var classesReadState = (0, _classnames.default)('euiNotificationEventReadIcon', {
    'euiNotificationEventReadIcon--isRead': isRead
  });
  var readAria = (0, _i18n.useEuiI18n)('euiNotificationEventReadIcon.readAria', '{eventName} is read', {
    eventName: eventName
  });
  var unreadAria = (0, _i18n.useEuiI18n)('euiNotificationEventReadIcon.unreadAria', '{eventName} is unread', {
    eventName: eventName
  });
  var readTitle = (0, _i18n.useEuiI18n)('euiNotificationEventReadIcon.read', 'Read');
  var unreadTitle = (0, _i18n.useEuiI18n)('euiNotificationEventReadIcon.unread', 'Unread');
  var iconAriaLabel = isRead ? readAria : unreadAria;
  var iconTitle = isRead ? readTitle : unreadTitle;
  return (0, _react2.jsx)("div", {
    className: classesReadState
  }, (0, _react2.jsx)(_icon.EuiIcon, _extends({
    type: "dot",
    "aria-label": iconAriaLabel,
    title: iconTitle,
    color: "primary",
    "data-test-subj": "".concat(id, "-notificationEventReadIcon")
  }, rest)));
};

exports.EuiNotificationEventReadIcon = EuiNotificationEventReadIcon;
EuiNotificationEventReadIcon.propTypes = {
  id: _propTypes.default.string.isRequired,

  /**
     * Shows an indicator of the read state of the event
     */
  isRead: _propTypes.default.bool.isRequired,

  /**
     * A unique, human-friendly name for the event to be used in aria attributes (e.g. "alert-critical-01", "cloud-no-severity-12", etc..).
     */
  eventName: _propTypes.default.string.isRequired
};