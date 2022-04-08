"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRefreshInterval = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18n = require("../../i18n");

var _common = require("../../common");

var _flex = require("../../flex");

var _form = require("../../form");

var _services = require("../../../services");

var _accessibility = require("../../accessibility");

var _time_units = require("../super_date_picker/time_units");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var refreshUnitsOptions = (0, _common.keysOf)(_time_units.timeUnits).filter(function (timeUnit) {
  return timeUnit === 'h' || timeUnit === 'm' || timeUnit === 's';
}).map(function (timeUnit) {
  return {
    value: timeUnit,
    text: _time_units.timeUnitsPlural[timeUnit]
  };
});
var MILLISECONDS_IN_SECOND = 1000;
var MILLISECONDS_IN_MINUTE = MILLISECONDS_IN_SECOND * 60;
var MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60;

function fromMilliseconds(milliseconds) {
  var round = function round(value) {
    return parseFloat(value.toFixed(2));
  };

  if (milliseconds > MILLISECONDS_IN_HOUR) {
    return {
      units: 'h',
      value: round(milliseconds / MILLISECONDS_IN_HOUR)
    };
  }

  if (milliseconds > MILLISECONDS_IN_MINUTE) {
    return {
      units: 'm',
      value: round(milliseconds / MILLISECONDS_IN_MINUTE)
    };
  }

  return {
    units: 's',
    value: round(milliseconds / MILLISECONDS_IN_SECOND)
  };
}

function toMilliseconds(units, value) {
  switch (units) {
    case 'h':
      return Math.round(value * MILLISECONDS_IN_HOUR);

    case 'm':
      return Math.round(value * MILLISECONDS_IN_MINUTE);

    case 's':
    default:
      return Math.round(value * MILLISECONDS_IN_SECOND);
  }
}

var EuiRefreshInterval = /*#__PURE__*/function (_Component) {
  _inherits(EuiRefreshInterval, _Component);

  var _super = _createSuper(EuiRefreshInterval);

  function EuiRefreshInterval() {
    var _this;

    _classCallCheck(this, EuiRefreshInterval);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", fromMilliseconds(_this.props.refreshInterval || 0));

    _defineProperty(_assertThisInitialized(_this), "generateId", (0, _services.htmlIdGenerator)());

    _defineProperty(_assertThisInitialized(_this), "legendId", _this.generateId());

    _defineProperty(_assertThisInitialized(_this), "refreshSelectionId", _this.generateId());

    _defineProperty(_assertThisInitialized(_this), "onValueChange", function (event) {
      var sanitizedValue = parseFloat(event.target.value);

      _this.setState({
        value: isNaN(sanitizedValue) ? '' : sanitizedValue
      }, _this.applyRefreshInterval);
    });

    _defineProperty(_assertThisInitialized(_this), "onUnitsChange", function (event) {
      _this.setState({
        units: event.target.value
      }, _this.applyRefreshInterval);
    });

    _defineProperty(_assertThisInitialized(_this), "startRefresh", function () {
      var onRefreshChange = _this.props.onRefreshChange;
      var _this$state = _this.state,
          value = _this$state.value,
          units = _this$state.units;

      if (value !== '' && value > 0 && onRefreshChange !== undefined) {
        onRefreshChange({
          refreshInterval: toMilliseconds(units, value),
          isPaused: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (_ref) {
      var key = _ref.key;

      if (key === 'Enter') {
        _this.startRefresh();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "applyRefreshInterval", function () {
      var _this$props = _this.props,
          onRefreshChange = _this$props.onRefreshChange,
          isPaused = _this$props.isPaused;
      var _this$state2 = _this.state,
          units = _this$state2.units,
          value = _this$state2.value;

      if (value === '') {
        return;
      }

      if (!onRefreshChange) {
        return;
      }

      var refreshInterval = toMilliseconds(units, value);
      onRefreshChange({
        refreshInterval: refreshInterval,
        isPaused: refreshInterval <= 0 ? true : !!isPaused
      });
    });

    _defineProperty(_assertThisInitialized(_this), "toggleRefresh", function () {
      var _this$props2 = _this.props,
          onRefreshChange = _this$props2.onRefreshChange,
          isPaused = _this$props2.isPaused;
      var _this$state3 = _this.state,
          units = _this$state3.units,
          value = _this$state3.value;

      if (!onRefreshChange || value === '') {
        return;
      }

      onRefreshChange({
        refreshInterval: toMilliseconds(units, value),
        isPaused: !isPaused
      });
    });

    return _this;
  }

  _createClass(EuiRefreshInterval, [{
    key: "render",
    value: function render() {
      var isPaused = this.props.isPaused;
      var _this$state4 = this.state,
          value = _this$state4.value,
          units = _this$state4.units;
      var options = refreshUnitsOptions.find(function (_ref2) {
        var value = _ref2.value;
        return value === units;
      });
      var optionText = options ? options.text : '';
      var fullDescription = isPaused ? (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiRefreshInterval.fullDescriptionOff",
        default: "Refresh is off, interval set to {optionValue} {optionText}.",
        values: {
          optionValue: value,
          optionText: optionText
        }
      }) : (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiRefreshInterval.fullDescriptionOn",
        default: "Refresh is on, interval set to {optionValue} {optionText}.",
        values: {
          optionValue: value,
          optionText: optionText
        }
      });
      return (0, _react2.jsx)("fieldset", null, (0, _react2.jsx)(_flex.EuiFlexGroup, {
        alignItems: "center",
        gutterSize: "s",
        responsive: false,
        wrap: true
      }, (0, _react2.jsx)(_flex.EuiFlexItem, {
        grow: false
      }, (0, _react2.jsx)(_form.EuiSwitch, {
        "data-test-subj": "superDatePickerToggleRefreshButton",
        "aria-describedby": this.refreshSelectionId,
        checked: !isPaused,
        onChange: this.toggleRefresh,
        compressed: true,
        label: (0, _react2.jsx)(_form.EuiFormLabel, {
          type: "legend",
          id: this.legendId
        }, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiRefreshInterval.legend",
          default: "Refresh every"
        }))
      })), (0, _react2.jsx)(_flex.EuiFlexItem, {
        style: {
          minWidth: 60
        }
      }, (0, _react2.jsx)(_form.EuiFieldNumber, {
        compressed: true,
        fullWidth: true,
        value: value,
        onChange: this.onValueChange,
        onKeyDown: this.handleKeyDown,
        isInvalid: !isPaused && (value === '' || value <= 0),
        disabled: isPaused,
        "aria-label": "Refresh interval value",
        "aria-describedby": "".concat(this.refreshSelectionId, " ").concat(this.legendId),
        "data-test-subj": "superDatePickerRefreshIntervalInput"
      })), (0, _react2.jsx)(_flex.EuiFlexItem, {
        style: {
          minWidth: 100
        },
        grow: 2
      }, (0, _react2.jsx)(_form.EuiSelect, {
        compressed: true,
        fullWidth: true,
        "aria-label": "Refresh interval units",
        "aria-describedby": "".concat(this.refreshSelectionId, " ").concat(this.legendId),
        value: units,
        disabled: isPaused,
        options: refreshUnitsOptions,
        onChange: this.onUnitsChange,
        onKeyDown: this.handleKeyDown,
        "data-test-subj": "superDatePickerRefreshIntervalUnitsSelect"
      }))), (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("p", {
        id: this.refreshSelectionId
      }, fullDescription)));
    }
  }]);

  return EuiRefreshInterval;
}(_react.Component);

exports.EuiRefreshInterval = EuiRefreshInterval;

_defineProperty(EuiRefreshInterval, "defaultProps", {
  isPaused: true,
  refreshInterval: 1000
});

EuiRefreshInterval.propTypes = {
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
  onRefreshChange: _propTypes.default.func.isRequired
};