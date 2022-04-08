"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

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

var MonthDropdownOptions = /*#__PURE__*/function (_React$Component) {
  _inherits(MonthDropdownOptions, _React$Component);

  var _super = _createSuper(MonthDropdownOptions);

  function MonthDropdownOptions() {
    var _this;

    _classCallCheck(this, MonthDropdownOptions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "renderOptions", function () {
      return _this.props.monthNames.map(function (month, i) {
        return (0, _react2.jsx)("div", {
          className: (0, _classnames.default)("react-datepicker__month-option", {
            "react-datepicker__month-option--selected_month": _this.props.month === i,
            "react-datepicker__month-option--preselected": _this.props.accessibleMode && _this.state.preSelection === i
          }),
          key: month,
          ref: month,
          onClick: _this.onChange.bind(_assertThisInitialized(_this), i)
        }, _this.props.month === i ? (0, _react2.jsx)("span", {
          className: "react-datepicker__month-option--selected"
        }, "\u2713") : "", month);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      if (_this.props.accessibleMode) {
        _this.setState({
          readInstructions: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (month) {
      return _this.props.onChange(month);
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickOutside", function () {
      return _this.props.onCancel();
    });

    _defineProperty(_assertThisInitialized(_this), "onInputKeyDown", function (event) {
      var eventKey = event.key;
      var selectionChange = 0;

      switch (eventKey) {
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          selectionChange = -1;
          break;

        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          selectionChange = 1;
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

          _this.props.onChange(_this.state.preSelection);

          break;
      }

      if (selectionChange) {
        _this.setState(function (_ref) {
          var preSelection = _ref.preSelection;
          var nextSelection = preSelection + selectionChange;
          if (nextSelection < 0) nextSelection = 11;
          if (nextSelection === 12) nextSelection = 0;
          return {
            preSelection: nextSelection
          };
        });
      }
    });

    _this.state = {
      preSelection: _this.props.month,
      readInstructions: false
    };
    return _this;
  }

  _createClass(MonthDropdownOptions, [{
    key: "render",
    value: function render() {
      var screenReaderInstructions;

      if (this.state.readInstructions) {
        screenReaderInstructions = (0, _react2.jsx)("p", {
          "aria-live": true
        }, "You are focused on a month selector menu. Use the up and down arrows to select a year, then hit enter to confirm your selection.", this.props.monthNames[this.state.preSelection], " is the currently focused month.");
      }

      return this.props.accessibleMode ? (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
        onClickOutside: this.handleClickOutside
      }, (0, _react2.jsx)("div", {
        className: "react-datepicker__month-dropdown",
        tabIndex: "0",
        onKeyDown: this.onInputKeyDown,
        onFocus: this.onFocus
      }, (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, screenReaderInstructions)), this.renderOptions())) : (0, _react2.jsx)("div", {
        className: "react-datepicker__month-dropdown"
      }, this.renderOptions());
    }
  }]);

  return MonthDropdownOptions;
}(_react.default.Component);

exports.default = MonthDropdownOptions;

_defineProperty(MonthDropdownOptions, "propTypes", {
  onCancel: _propTypes.default.func.isRequired,
  onChange: _propTypes.default.func.isRequired,
  month: _propTypes.default.number.isRequired,
  monthNames: _propTypes.default.arrayOf(_propTypes.default.string.isRequired).isRequired,
  accessibleMode: _propTypes.default.bool
});

module.exports = exports.default;