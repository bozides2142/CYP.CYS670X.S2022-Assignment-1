"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _week = _interopRequireDefault(require("./week"));

var utils = _interopRequireWildcard(require("./date_utils"));

var _accessibility = require("../../../accessibility");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6;

var Month = /*#__PURE__*/function (_React$Component) {
  _inherits(Month, _React$Component);

  var _super = _createSuper(Month);

  function Month(props) {
    var _this;

    _classCallCheck(this, Month);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleDayClick", function (day, event) {
      if (_this.props.onDayClick) {
        _this.props.onDayClick(day, event);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleDayMouseEnter", function (day) {
      if (_this.props.onDayMouseEnter) {
        _this.props.onDayMouseEnter(day);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseLeave", function () {
      if (_this.props.onMouseLeave) {
        _this.props.onMouseLeave();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      if (_this.props.accessibleMode) {
        _this.setState({
          readInstructions: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function () {
      if (_this.props.accessibleMode) {
        _this.setState({
          readInstructions: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onInputKeyDown", function (event) {
      var eventKey = event.key; // `preSelection` can be `null` but `day` is required. Use it as a fallback if necessary for invalid entries.

      var copy = _this.props.preSelection ? utils.newDate(_this.props.preSelection) : utils.newDate(_this.props.day);
      var newSelection;

      switch (eventKey) {
        case "ArrowLeft":
          newSelection = utils.subtractDays(copy, 1);
          break;

        case "ArrowRight":
          newSelection = utils.addDays(copy, 1);
          break;

        case "ArrowUp":
          newSelection = utils.subtractWeeks(copy, 1);
          break;

        case "ArrowDown":
          newSelection = utils.addWeeks(copy, 1);
          break;

        case "PageUp":
          newSelection = utils.subtractMonths(copy, 1);
          break;

        case "PageDown":
          newSelection = utils.addMonths(copy, 1);
          break;

        case "Home":
          newSelection = utils.subtractYears(copy, 1);
          break;

        case "End":
          newSelection = utils.addYears(copy, 1);
          break;

        case " ":
        case "Enter":
          event.preventDefault();

          _this.handleDayClick(copy, event);

          break;
      }

      if (!newSelection) return; // Let the input component handle this keydown

      event.preventDefault();

      _this.props.updateSelection(newSelection);
    });

    _defineProperty(_assertThisInitialized(_this), "isWeekInMonth", function (startOfWeek) {
      var day = _this.props.day;
      var endOfWeek = utils.addDays(utils.cloneDate(startOfWeek), 6);
      return utils.isSameMonth(startOfWeek, day) || utils.isSameMonth(endOfWeek, day);
    });

    _defineProperty(_assertThisInitialized(_this), "renderWeeks", function () {
      var weeks = [];
      var isFixedHeight = _this.props.fixedHeight;
      var currentWeekStart = utils.getStartOfWeek(utils.getStartOfMonth(utils.cloneDate(_this.props.day)));
      var i = 0;
      var breakAfterNextPush = false;

      while (true) {
        weeks.push((0, _react2.jsx)(_week.default, {
          key: i,
          day: currentWeekStart,
          month: utils.getMonth(_this.props.day),
          onDayClick: _this.handleDayClick,
          onDayMouseEnter: _this.handleDayMouseEnter,
          onWeekSelect: _this.props.onWeekSelect,
          formatWeekNumber: _this.props.formatWeekNumber,
          minDate: _this.props.minDate,
          maxDate: _this.props.maxDate,
          excludeDates: _this.props.excludeDates,
          includeDates: _this.props.includeDates,
          inline: _this.props.inline,
          highlightDates: _this.props.highlightDates,
          selectingDate: _this.props.selectingDate,
          filterDate: _this.props.filterDate,
          preSelection: _this.props.preSelection,
          selected: _this.props.selected,
          selectsStart: _this.props.selectsStart,
          selectsEnd: _this.props.selectsEnd,
          showWeekNumber: _this.props.showWeekNumbers,
          startDate: _this.props.startDate,
          endDate: _this.props.endDate,
          dayClassName: _this.props.dayClassName,
          utcOffset: _this.props.utcOffset,
          setOpen: _this.props.setOpen,
          shouldCloseOnSelect: _this.props.shouldCloseOnSelect,
          disabledKeyboardNavigation: _this.props.disabledKeyboardNavigation,
          renderDayContents: _this.props.renderDayContents,
          accessibleMode: _this.props.accessibleMode
        }));
        if (breakAfterNextPush) break;
        i++;
        currentWeekStart = utils.addWeeks(utils.cloneDate(currentWeekStart), 1); // If one of these conditions is true, we will either break on this week
        // or break on the next week

        var isFixedAndFinalWeek = isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT;
        var isNonFixedAndOutOfMonth = !isFixedHeight && !_this.isWeekInMonth(currentWeekStart);

        if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
          if (_this.props.peekNextMonth) {
            breakAfterNextPush = true;
          } else {
            break;
          }
        }
      }

      return weeks;
    });

    _defineProperty(_assertThisInitialized(_this), "getClassNames", function () {
      var _this$props = _this.props,
          selectingDate = _this$props.selectingDate,
          selectsStart = _this$props.selectsStart,
          selectsEnd = _this$props.selectsEnd;
      return (0, _classnames.default)("react-datepicker__month", {
        "react-datepicker__month--accessible": _this.props.accessibleMode,
        "react-datepicker__month--selecting-range": selectingDate && (selectsStart || selectsEnd)
      });
    });

    _this.dayFormat = "MMMM D, YYYY.";
    _this.state = {
      readInstructions: false
    };
    return _this;
  }

  _createClass(Month, [{
    key: "render",
    value: function render() {
      var screenReaderInstructions;

      if (this.state.readInstructions) {
        screenReaderInstructions = (0, _react2.jsx)("p", {
          "aria-live": true
        }, "You are focused on a calendar. Use the arrow keys to navigate the days in the month. Use the page up and down keys to navigate from month to month. Use the home and end keys to navigate from year to year.", this.props.preSelection ? "".concat(utils.formatDate(this.props.preSelection, this.dayFormat), " is the\n          currently focused date.") : "No date is currently focused.");
      }

      return (0, _react2.jsx)("div", {
        className: this.getClassNames(),
        onMouseLeave: this.handleMouseLeave,
        role: "listbox",
        "aria-label": this.props.day.format("MMMM, YYYY"),
        tabIndex: this.props.accessibleMode ? 0 : -1,
        onKeyDown: this.onInputKeyDown,
        onFocus: this.onFocus,
        onBlur: this.onBlur
      }, (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, screenReaderInstructions)), this.renderWeeks());
    }
  }]);

  return Month;
}(_react.default.Component);

exports.default = Month;

_defineProperty(Month, "propTypes", {
  disabledKeyboardNavigation: _propTypes.default.bool,
  day: _propTypes.default.object.isRequired,
  dayClassName: _propTypes.default.func,
  endDate: _propTypes.default.object,
  excludeDates: _propTypes.default.array,
  filterDate: _propTypes.default.func,
  fixedHeight: _propTypes.default.bool,
  formatWeekNumber: _propTypes.default.func,
  highlightDates: _propTypes.default.instanceOf(Map),
  includeDates: _propTypes.default.array,
  inline: _propTypes.default.bool,
  maxDate: _propTypes.default.object,
  minDate: _propTypes.default.object,
  onDayClick: _propTypes.default.func,
  onDayMouseEnter: _propTypes.default.func,
  onMouseLeave: _propTypes.default.func,
  onWeekSelect: _propTypes.default.func,
  peekNextMonth: _propTypes.default.bool,
  preSelection: _propTypes.default.object,
  selected: _propTypes.default.object,
  selectingDate: _propTypes.default.object,
  selectsEnd: _propTypes.default.bool,
  selectsStart: _propTypes.default.bool,
  showWeekNumbers: _propTypes.default.bool,
  startDate: _propTypes.default.object,
  setOpen: _propTypes.default.func,
  shouldCloseOnSelect: _propTypes.default.bool,
  utcOffset: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  renderDayContents: _propTypes.default.func,
  updateSelection: _propTypes.default.func.isRequired,
  accessibleMode: _propTypes.default.bool
});

module.exports = exports.default;