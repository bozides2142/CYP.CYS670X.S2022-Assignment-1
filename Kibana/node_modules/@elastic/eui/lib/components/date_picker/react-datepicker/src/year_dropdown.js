"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _year_dropdown_options = _interopRequireDefault(require("./year_dropdown_options"));

var _date_utils = require("./date_utils");

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

var YearDropdown = /*#__PURE__*/function (_React$Component) {
  _inherits(YearDropdown, _React$Component);

  var _super = _createSuper(YearDropdown);

  function YearDropdown() {
    var _this;

    _classCallCheck(this, YearDropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      dropdownVisible: false
    });

    _defineProperty(_assertThisInitialized(_this), "setReadViewRef", function (ref) {
      _this.readViewref = ref;

      _this.props.buttonRef(ref);
    });

    _defineProperty(_assertThisInitialized(_this), "onReadViewKeyDown", function (event) {
      var eventKey = event.key;

      switch (eventKey) {
        case " ":
        case "Enter":
          event.preventDefault();
          event.stopPropagation();

          _this.toggleDropdown();

          break;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onDropDownKeyDown", function (event) {
      var eventKey = event.key;

      switch (eventKey) {
        case " ":
        case "Enter":
          event.preventDefault();
          event.stopPropagation();

          _this.toggleDropdown();

          break;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderSelectOptions", function () {
      var minYear = _this.props.minDate ? (0, _date_utils.getYear)(_this.props.minDate) : 1900;
      var maxYear = _this.props.maxDate ? (0, _date_utils.getYear)(_this.props.maxDate) : 2100;
      var options = [];

      for (var i = minYear; i <= maxYear; i++) {
        options.push((0, _react2.jsx)("option", {
          key: i,
          value: i
        }, i));
      }

      return options;
    });

    _defineProperty(_assertThisInitialized(_this), "onSelectChange", function (e) {
      _this.onChange(e.target.value);
    });

    _defineProperty(_assertThisInitialized(_this), "renderSelectMode", function () {
      return (0, _react2.jsx)("select", {
        value: _this.props.year,
        className: "react-datepicker__year-select",
        onChange: _this.onSelectChange
      }, _this.renderSelectOptions());
    });

    _defineProperty(_assertThisInitialized(_this), "renderReadView", function (visible) {
      return (0, _react2.jsx)("div", {
        key: "read",
        ref: _this.setReadViewRef,
        style: {
          visibility: visible ? "visible" : "hidden"
        },
        className: "react-datepicker__year-read-view",
        onClick: function onClick(event) {
          return _this.toggleDropdown(event);
        },
        onKeyDown: _this.onReadViewKeyDown,
        tabIndex: _this.props.accessibleMode ? "0" : undefined,
        "aria-label": "Button. Open the year selector. ".concat(_this.props.year, " is currently selected.")
      }, (0, _react2.jsx)("span", {
        className: "react-datepicker__year-read-view--down-arrow"
      }), (0, _react2.jsx)("span", {
        className: "react-datepicker__year-read-view--selected-year"
      }, _this.props.year));
    });

    _defineProperty(_assertThisInitialized(_this), "renderDropdown", function () {
      return (0, _react2.jsx)(_year_dropdown_options.default, {
        key: "dropdown",
        ref: "options",
        year: _this.props.year,
        onChange: _this.onChange,
        onCancel: _this.toggleDropdown,
        minDate: _this.props.minDate,
        maxDate: _this.props.maxDate,
        scrollableYearDropdown: _this.props.scrollableYearDropdown,
        yearDropdownItemNumber: _this.props.yearDropdownItemNumber,
        accessibleMode: _this.props.accessibleMode
      });
    });

    _defineProperty(_assertThisInitialized(_this), "renderScrollMode", function () {
      var dropdownVisible = _this.state.dropdownVisible;
      var result = [_this.renderReadView(!dropdownVisible)];

      if (dropdownVisible) {
        result.unshift(_this.renderDropdown());
      }

      return result;
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (year) {
      _this.toggleDropdown();

      if (year === _this.props.year) return;

      _this.props.onChange(year);
    });

    _defineProperty(_assertThisInitialized(_this), "toggleDropdown", function () {
      var isOpen = !_this.state.dropdownVisible;

      _this.setState({
        dropdownVisible: isOpen
      });

      _this.props.onDropdownToggle(isOpen, 'year');
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (date, event) {
      if (_this.props.onSelect) {
        _this.props.onSelect(date, event);
      }
    });

    return _this;
  }

  _createClass(YearDropdown, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.accessibleMode && // in accessibleMode
      prevState.dropdownVisible !== this.state.dropdownVisible && // dropdown visibility changed
      this.state.dropdownVisible === false // dropdown is no longer visible
      ) {
          this.readViewref.focus();
        }
    }
  }, {
    key: "render",
    value: function render() {
      var renderedDropdown;

      switch (this.props.dropdownMode) {
        case "scroll":
          renderedDropdown = this.renderScrollMode();
          break;

        case "select":
          renderedDropdown = this.renderSelectMode();
          break;
      }

      return (0, _react2.jsx)("div", {
        className: "react-datepicker__year-dropdown-container react-datepicker__year-dropdown-container--".concat(this.props.dropdownMode)
      }, renderedDropdown);
    }
  }]);

  return YearDropdown;
}(_react.default.Component);

exports.default = YearDropdown;

_defineProperty(YearDropdown, "propTypes", {
  adjustDateOnChange: _propTypes.default.bool,
  dropdownMode: _propTypes.default.oneOf(["scroll", "select"]).isRequired,
  maxDate: _propTypes.default.object,
  minDate: _propTypes.default.object,
  onChange: _propTypes.default.func.isRequired,
  scrollableYearDropdown: _propTypes.default.bool,
  year: _propTypes.default.number.isRequired,
  yearDropdownItemNumber: _propTypes.default.number,
  date: _propTypes.default.object,
  onSelect: _propTypes.default.func,
  setOpen: _propTypes.default.func,
  accessibleMode: _propTypes.default.bool,
  onDropdownToggle: _propTypes.default.func,
  buttonRef: _propTypes.default.func
});

module.exports = exports.default;