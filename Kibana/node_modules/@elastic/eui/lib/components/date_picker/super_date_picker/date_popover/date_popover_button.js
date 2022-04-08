"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDatePopoverButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../../i18n");

var _popover = require("../../../popover");

var _pretty_duration = require("../pretty_duration");

var _date_popover_content = require("./date_popover_content");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiDatePopoverButton = function EuiDatePopoverButton(props) {
  var position = props.position,
      isDisabled = props.isDisabled,
      isInvalid = props.isInvalid,
      needsUpdating = props.needsUpdating,
      value = props.value,
      buttonProps = props.buttonProps,
      roundUp = props.roundUp,
      onChange = props.onChange,
      locale = props.locale,
      dateFormat = props.dateFormat,
      utcOffset = props.utcOffset,
      timeFormat = props.timeFormat,
      isOpen = props.isOpen,
      onPopoverToggle = props.onPopoverToggle,
      onPopoverClose = props.onPopoverClose,
      compressed = props.compressed,
      rest = _objectWithoutProperties(props, ["position", "isDisabled", "isInvalid", "needsUpdating", "value", "buttonProps", "roundUp", "onChange", "locale", "dateFormat", "utcOffset", "timeFormat", "isOpen", "onPopoverToggle", "onPopoverClose", "compressed"]);

  var classes = (0, _classnames.default)(['euiDatePopoverButton', "euiDatePopoverButton--".concat(position), {
    'euiDatePopoverButton--compressed': compressed,
    'euiDatePopoverButton-isSelected': isOpen,
    'euiDatePopoverButton-isInvalid': isInvalid,
    'euiDatePopoverButton-needsUpdating': needsUpdating,
    'euiDatePopoverButton-disabled': isDisabled
  }]);
  var formattedValue = (0, _pretty_duration.formatTimeString)(value, dateFormat, roundUp, locale);
  var title = formattedValue;
  var invalidTitle = (0, _i18n.useEuiI18n)('euiDatePopoverButton.invalidTitle', 'Invalid date: {title}', {
    title: title
  });
  var outdatedTitle = (0, _i18n.useEuiI18n)('euiDatePopoverButton.outdatedTitle', 'Update needed: {title}', {
    title: title
  });

  if (isInvalid) {
    title = invalidTitle;
  } else if (needsUpdating) {
    title = outdatedTitle;
  }

  var button = (0, _react2.jsx)("button", _extends({
    onClick: onPopoverToggle,
    className: classes,
    title: title,
    disabled: isDisabled,
    "data-test-subj": "superDatePicker".concat(position, "DatePopoverButton")
  }, buttonProps), formattedValue);
  return (0, _react2.jsx)(_popover.EuiPopover, _extends({
    button: button,
    isOpen: isOpen,
    closePopover: onPopoverClose,
    anchorPosition: position === 'start' ? 'downLeft' : 'downRight',
    display: "block",
    panelPaddingSize: "none"
  }, rest), (0, _react2.jsx)(_date_popover_content.EuiDatePopoverContent, {
    value: value,
    roundUp: roundUp,
    onChange: onChange,
    dateFormat: dateFormat,
    timeFormat: timeFormat,
    locale: locale,
    position: position,
    utcOffset: utcOffset
  }));
};

exports.EuiDatePopoverButton = EuiDatePopoverButton;
EuiDatePopoverButton.propTypes = {
  className: _propTypes.default.string,
  buttonProps: _propTypes.default.any,
  dateFormat: _propTypes.default.string.isRequired,
  isDisabled: _propTypes.default.bool,
  isInvalid: _propTypes.default.bool,
  isOpen: _propTypes.default.bool.isRequired,
  needsUpdating: _propTypes.default.bool,
  locale: _propTypes.default.any,
  onChange: _propTypes.default.any.isRequired,
  onPopoverClose: _propTypes.default.func.isRequired,
  onPopoverToggle: _propTypes.default.func.isRequired,
  position: _propTypes.default.oneOf(["start", "end"]).isRequired,
  roundUp: _propTypes.default.bool,
  timeFormat: _propTypes.default.string.isRequired,
  value: _propTypes.default.string.isRequired,
  utcOffset: _propTypes.default.number,
  compressed: _propTypes.default.bool
};
EuiDatePopoverButton.displayName = 'EuiDatePopoverButton';