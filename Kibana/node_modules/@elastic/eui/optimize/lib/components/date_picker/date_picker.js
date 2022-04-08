"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDatePicker = exports.euiDatePickerDefaultTimeFormat = exports.euiDatePickerDefaultDateFormat = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../form");

var _context = require("../context");

var _reactDatepicker = require("./react-datepicker");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var euiDatePickerDefaultDateFormat = 'MM/DD/YYYY';
exports.euiDatePickerDefaultDateFormat = euiDatePickerDefaultDateFormat;
var euiDatePickerDefaultTimeFormat = 'hh:mm A';
exports.euiDatePickerDefaultTimeFormat = euiDatePickerDefaultTimeFormat;
var mapAnchorPositions = {
  'bottom-start': 'downLeft',
  bottom: 'downCenter',
  'bottom-end': 'downRight',
  'left-start': 'leftUp',
  left: 'leftCenter',
  'left-end': 'leftDown',
  'right-start': 'rightUp',
  right: 'rightCenter',
  'right-end': 'rightDown',
  'top-start': 'upLeft',
  top: 'upCenter',
  'top-end': 'upRight'
};

function isPopperPlacement(position) {
  return position != null && Object.keys(mapAnchorPositions).includes(position);
} // EuiDatePicker only supports a subset of props from react-datepicker.


var unsupportedProps = [// We don't want to show multiple months next to each other
'monthsShown', // There is no need to show week numbers
'showWeekNumbers', // Our css adapts to height, no need to fix it
'fixedHeight', // We force the month / year selection UI. No need to configure it
'dropdownMode', // Short month is unnecessary. Our UI has plenty of room for full months
'useShortMonthInDropdown', // The today button is not needed. This should always be external to the calendar
'todayButton', // We hide the time caption, so there is no need to overwrite its text
'timeCaption', // We always want keyboard accessibility on
'disabledKeyboardNavigation', // This is easy enough to do. It can conflict with isLoading state
'isClearable', // There is no reason to launch the datepicker in its own modal. Can always build these ourselves
'withPortal', // Causes Error: Cannot read property 'clone' of undefined
'showMonthYearDropdown', // We overridde this with `popoverPlacement`
'popperPlacement'];

var EuiDatePicker = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiDatePicker, _Component);

  var _super = _createSuper(EuiDatePicker);

  function EuiDatePicker() {
    (0, _classCallCheck2.default)(this, EuiDatePicker);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EuiDatePicker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          adjustDateOnChange = _this$props.adjustDateOnChange,
          calendarClassName = _this$props.calendarClassName,
          className = _this$props.className,
          customInput = _this$props.customInput,
          dateFormat = _this$props.dateFormat,
          dayClassName = _this$props.dayClassName,
          disabled = _this$props.disabled,
          excludeDates = _this$props.excludeDates,
          filterDate = _this$props.filterDate,
          fullWidth = _this$props.fullWidth,
          iconType = _this$props.iconType,
          injectTimes = _this$props.injectTimes,
          inline = _this$props.inline,
          inputRef = _this$props.inputRef,
          isInvalid = _this$props.isInvalid,
          isLoading = _this$props.isLoading,
          locale = _this$props.locale,
          maxDate = _this$props.maxDate,
          maxTime = _this$props.maxTime,
          minDate = _this$props.minDate,
          minTime = _this$props.minTime,
          onChange = _this$props.onChange,
          onClear = _this$props.onClear,
          openToDate = _this$props.openToDate,
          placeholder = _this$props.placeholder,
          popperClassName = _this$props.popperClassName,
          _popoverPlacement = _this$props.popoverPlacement,
          selected = _this$props.selected,
          shadow = _this$props.shadow,
          shouldCloseOnSelect = _this$props.shouldCloseOnSelect,
          showIcon = _this$props.showIcon,
          showTimeSelect = _this$props.showTimeSelect,
          showTimeSelectOnly = _this$props.showTimeSelectOnly,
          timeFormat = _this$props.timeFormat,
          utcOffset = _this$props.utcOffset,
          rest = (0, _objectWithoutProperties2.default)(_this$props, ["adjustDateOnChange", "calendarClassName", "className", "customInput", "dateFormat", "dayClassName", "disabled", "excludeDates", "filterDate", "fullWidth", "iconType", "injectTimes", "inline", "inputRef", "isInvalid", "isLoading", "locale", "maxDate", "maxTime", "minDate", "minTime", "onChange", "onClear", "openToDate", "placeholder", "popperClassName", "popoverPlacement", "selected", "shadow", "shouldCloseOnSelect", "showIcon", "showTimeSelect", "showTimeSelectOnly", "timeFormat", "utcOffset"]);
      var classes = (0, _classnames.default)('euiDatePicker', {
        'euiDatePicker--shadow': shadow,
        'euiDatePicker--inline': inline
      });
      var datePickerClasses = (0, _classnames.default)('euiDatePicker', 'euiFieldText', {
        'euiFieldText--fullWidth': fullWidth,
        'euiFieldText-isLoading': isLoading,
        'euiFieldText--withIcon': !inline && showIcon,
        'euiFieldText--isClearable': !inline && selected && onClear,
        'euiFieldText-isInvalid': isInvalid
      }, className);
      var optionalIcon;

      if (inline || customInput || !showIcon) {
        optionalIcon = undefined;
      } else if (iconType) {
        optionalIcon = iconType;
      } else if (showTimeSelectOnly) {
        optionalIcon = 'clock';
      } else {
        optionalIcon = 'calendar';
      } // In case the consumer did not alter the default date format but wants
      // to add the time select, we append the default time format


      var fullDateFormat = dateFormat;

      if (showTimeSelect && dateFormat === euiDatePickerDefaultDateFormat) {
        fullDateFormat = "".concat(dateFormat, " ").concat(timeFormat);
      }

      var popoverPlacement;

      if (isPopperPlacement(_popoverPlacement)) {
        popoverPlacement = mapAnchorPositions[_popoverPlacement];
      } else {
        popoverPlacement = _popoverPlacement;
      }

      return (0, _react2.jsx)("span", {
        className: classes
      }, (0, _react2.jsx)(_form.EuiFormControlLayout, {
        icon: optionalIcon,
        fullWidth: fullWidth,
        clear: selected && onClear ? {
          onClick: onClear
        } : undefined,
        isLoading: isLoading
      }, (0, _react2.jsx)(_form.EuiValidatableControl, {
        isInvalid: isInvalid
      }, (0, _react2.jsx)(_context.EuiI18nConsumer, null, function (_ref) {
        var contextLocale = _ref.locale;
        return (0, _react2.jsx)(_reactDatepicker.ReactDatePicker, (0, _extends2.default)({
          adjustDateOnChange: adjustDateOnChange,
          calendarClassName: calendarClassName,
          className: datePickerClasses,
          customInput: customInput,
          dateFormat: fullDateFormat,
          dayClassName: dayClassName,
          disabled: disabled,
          excludeDates: excludeDates,
          filterDate: filterDate,
          injectTimes: injectTimes,
          inline: inline,
          locale: locale || contextLocale,
          maxDate: maxDate,
          maxTime: maxTime,
          minDate: minDate,
          minTime: minTime,
          onChange: onChange,
          openToDate: openToDate,
          placeholderText: placeholder,
          popperClassName: popperClassName,
          ref: inputRef,
          selected: selected,
          shouldCloseOnSelect: shouldCloseOnSelect,
          showMonthDropdown: true,
          showTimeSelect: showTimeSelectOnly ? true : showTimeSelect,
          showTimeSelectOnly: showTimeSelectOnly,
          showYearDropdown: true,
          timeFormat: timeFormat,
          utcOffset: utcOffset,
          yearDropdownItemNumber: 7,
          accessibleMode: true,
          popperPlacement: popoverPlacement
        }, rest));
      }))));
    }
  }]);
  return EuiDatePicker;
}(_react.Component);

exports.EuiDatePicker = EuiDatePicker;
(0, _defineProperty2.default)(EuiDatePicker, "defaultProps", {
  adjustDateOnChange: true,
  dateFormat: euiDatePickerDefaultDateFormat,
  fullWidth: false,
  inputRef: function inputRef() {},
  isLoading: false,
  shadow: true,
  shouldCloseOnSelect: true,
  showIcon: true,
  showTimeSelect: false,
  timeFormat: euiDatePickerDefaultTimeFormat,
  popoverPlacement: 'downLeft'
});