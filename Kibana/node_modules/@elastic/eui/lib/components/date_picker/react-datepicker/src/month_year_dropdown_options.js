"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _date_utils = require("./date_utils");

var _focus_trap = require("../../../focus_trap");

var _accessibility = require("../../../accessibility");

var _react2 = require("@emotion/react");

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

function generateMonthYears(minDate, maxDate) {
  var list = [];
  var currDate = (0, _date_utils.getStartOfMonth)((0, _date_utils.cloneDate)(minDate));
  var lastDate = (0, _date_utils.getStartOfMonth)((0, _date_utils.cloneDate)(maxDate));

  while (!(0, _date_utils.isAfter)(currDate, lastDate)) {
    list.push((0, _date_utils.cloneDate)(currDate));
    (0, _date_utils.addMonths)(currDate, 1);
  }

  return list;
}

var MonthYearDropdownOptions = /*#__PURE__*/function (_React$Component) {
  _inherits(MonthYearDropdownOptions, _React$Component);

  var _super = _createSuper(MonthYearDropdownOptions);

  function MonthYearDropdownOptions(props) {
    var _this;

    _classCallCheck(this, MonthYearDropdownOptions);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "renderOptions", function () {
      return _this.state.monthYearsList.map(function (monthYear) {
        var monthYearPoint = monthYear.valueOf();
        var isSameMonthYear = (0, _date_utils.isSameYear)(_this.props.date, monthYear) && (0, _date_utils.isSameMonth)(_this.props.date, monthYear);
        var isPreselectionSameMonthYear = (0, _date_utils.isSameYear)(_this.state.preSelection, monthYear) && (0, _date_utils.isSameMonth)(_this.state.preSelection, monthYear);
        return (0, _react2.jsx)("div", {
          className: (0, _classnames.default)("react-datepicker__month-year-option", {
            "--selected_month-year": isSameMonthYear,
            "react-datepicker__month-year-option--preselected": _this.props.accessibleMode && isPreselectionSameMonthYear
          }),
          key: monthYearPoint,
          ref: function ref(div) {
            if (_this.props.accessibleMode && isPreselectionSameMonthYear) {
              _this.preSelectionDiv = div;
            }
          },
          onClick: _this.onChange.bind(_assertThisInitialized(_this), monthYearPoint)
        }, isSameMonthYear ? (0, _react2.jsx)("span", {
          className: "react-datepicker__month-year-option--selected"
        }, "\u2713") : "", (0, _date_utils.formatDate)(monthYear, _this.props.dateFormat));
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      if (_this.props.accessibleMode) {
        _this.setState({
          readInstructions: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (monthYear) {
      return _this.props.onChange(monthYear);
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickOutside", function () {
      _this.props.onCancel();
    });

    _defineProperty(_assertThisInitialized(_this), "onInputKeyDown", function (event) {
      var eventKey = event.key;
      var newSelection;

      switch (eventKey) {
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          newSelection = (0, _date_utils.addMonths)((0, _date_utils.cloneDate)(_this.state.preSelection), -1);
          break;

        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          newSelection = (0, _date_utils.addMonths)((0, _date_utils.cloneDate)(_this.state.preSelection), 1);
          break;

        case "Escape":
          event.preventDefault();
          event.stopPropagation();

          _this.props.onCancel();

          break;

        case " ":
        case "Enter":
          event.preventDefault();
          event.stopPropagation();

          _this.props.onChange(_this.state.preSelection.valueOf());

          break;
      }

      if (newSelection) {
        var minMonthYear = _this.state.monthYearsList[0];
        var maxMonthYear = _this.state.monthYearsList[_this.state.monthYearsList.length - 1];
        if ((0, _date_utils.isBefore)(newSelection, minMonthYear)) newSelection = maxMonthYear;
        if ((0, _date_utils.isAfter)(newSelection, maxMonthYear)) newSelection = minMonthYear;

        _this.setState({
          preSelection: newSelection
        });
      }
    });

    _this.state = {
      monthYearsList: generateMonthYears(_this.props.minDate, _this.props.maxDate),
      preSelection: (0, _date_utils.getStartOfMonth)((0, _date_utils.cloneDate)(_this.props.date)),
      readInstructions: false
    };
    return _this;
  }

  _createClass(MonthYearDropdownOptions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.preSelectionDiv) {
        this.preSelectionDiv.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "nearest"
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.preSelectionDiv) {
        this.preSelectionDiv.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "nearest"
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var dropdownClass = (0, _classnames.default)({
        "react-datepicker__month-year-dropdown": true,
        "react-datepicker__month-year-dropdown--scrollable": this.props.scrollableMonthYearDropdown
      });
      var screenReaderInstructions;

      if (this.state.readInstructions) {
        screenReaderInstructions = (0, _react2.jsx)("p", {
          "aria-live": true
        }, "You are focused on a month / year selector menu. Use the up and down arrows to select a month / year combination, then hit enter to confirm your selection.", (0, _date_utils.formatDate)(this.state.preSelection, this.props.dateFormat), " is the currently focused month / year.");
      }

      return this.props.accessibleMode ? (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
        onClickOutside: this.handleClickOutside
      }, (0, _react2.jsx)("div", {
        className: dropdownClass,
        tabIndex: "0",
        onKeyDown: this.onInputKeyDown,
        onFocus: this.onFocus
      }, (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, screenReaderInstructions)), this.renderOptions())) : (0, _react2.jsx)("div", {
        className: dropdownClass
      }, this.renderOptions());
      return (0, _react2.jsx)("div", {
        className: dropdownClass
      }, this.renderOptions());
    }
  }]);

  return MonthYearDropdownOptions;
}(_react.default.Component);

exports.default = MonthYearDropdownOptions;

_defineProperty(MonthYearDropdownOptions, "propTypes", {
  minDate: _propTypes.default.object.isRequired,
  maxDate: _propTypes.default.object.isRequired,
  onCancel: _propTypes.default.func.isRequired,
  onChange: _propTypes.default.func.isRequired,
  scrollableMonthYearDropdown: _propTypes.default.bool,
  date: _propTypes.default.object.isRequired,
  dateFormat: _propTypes.default.string.isRequired,
  accessibleMode: _propTypes.default.bool
});

module.exports = exports.default;