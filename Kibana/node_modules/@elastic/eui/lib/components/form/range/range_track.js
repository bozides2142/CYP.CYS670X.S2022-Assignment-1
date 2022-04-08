"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LEVEL_COLORS", {
  enumerable: true,
  get: function get() {
    return _range_levels.LEVEL_COLORS;
  }
});
exports.EuiRangeTrack = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _range = _interopRequireDefault(require("lodash/range"));

var _services = require("../../../services");

var _range_levels = require("./range_levels");

var _range_ticks = require("./range_ticks");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var EuiRangeTrack = /*#__PURE__*/function (_Component) {
  _inherits(EuiRangeTrack, _Component);

  var _super = _createSuper(EuiRangeTrack);

  function EuiRangeTrack() {
    var _this;

    _classCallCheck(this, EuiRangeTrack);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "validateValueIsInStep", function (value) {
      if (value < _this.props.min) {
        throw new Error("The value of ".concat(value, " is lower than the min value of ").concat(_this.props.min, "."));
      }

      if (value > _this.props.max) {
        throw new Error("The value of ".concat(value, " is higher than the max value of ").concat(_this.props.max, "."));
      } // Error out if the value doesn't line up with the sequence of steps


      if (!(0, _services.isEvenlyDivisibleBy)(value - _this.props.min, _this.props.step !== undefined ? _this.props.step : 1)) {
        throw new Error("The value of ".concat(value, " is not included in the possible sequence provided by the step of ").concat(_this.props.step, "."));
      } // Return the value if nothing fails


      return value;
    });

    _defineProperty(_assertThisInitialized(_this), "calculateSequence", function (min, max, interval) {
      // Loop from min to max, creating adding values at each interval
      var sequence = (0, _range.default)(min, max, interval); // range is non-inclusive of max, so make it inclusive

      if (max % interval === 0 && !sequence.includes(max)) {
        sequence.push(max);
      }

      return sequence;
    });

    _defineProperty(_assertThisInitialized(_this), "calculateTicks", function (min, max, step, tickInterval, customTicks) {
      var ticks;

      if (customTicks) {
        // If custom values were passed, use those for the sequence
        // But make sure they align with the possible sequence
        ticks = customTicks.map(function (tick) {
          return _this.validateValueIsInStep(tick.value);
        });
      } else {
        // If a custom interval was passed, use those for the sequence
        // But make sure they align with the possible sequence
        var interval = tickInterval || step;

        var tickSequence = _this.calculateSequence(min, max, interval);

        ticks = tickSequence.map(function (tick) {
          return _this.validateValueIsInStep(tick);
        });
      } // Error out if there are too many ticks to render


      if (ticks.length > 20) {
        throw new Error("The number of ticks to render is too high (".concat(ticks.length, "), reduce the interval."));
      }

      return ticks;
    });

    return _this;
  }

  _createClass(EuiRangeTrack, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          disabled = _this$props.disabled,
          max = _this$props.max,
          min = _this$props.min,
          step = _this$props.step,
          showTicks = _this$props.showTicks,
          tickInterval = _this$props.tickInterval,
          ticks = _this$props.ticks,
          levels = _this$props.levels,
          onChange = _this$props.onChange,
          value = _this$props.value,
          compressed = _this$props.compressed,
          rest = _objectWithoutProperties(_this$props, ["children", "disabled", "max", "min", "step", "showTicks", "tickInterval", "ticks", "levels", "onChange", "value", "compressed"]); // TODO: Move these to only re-calculate if no-value props have changed


      this.validateValueIsInStep(max);
      var tickSequence = showTicks === true && this.calculateTicks(min, max, step, tickInterval, ticks);
      var trackClasses = (0, _classnames.default)('euiRangeTrack', {
        'euiRangeTrack--disabled': disabled,
        'euiRangeTrack--hasLevels': levels && !!levels.length,
        'euiRangeTrack--hasTicks': tickSequence || ticks,
        'euiRangeTrack--compressed': compressed
      });
      return (0, _react2.jsx)("div", _extends({
        className: trackClasses
      }, rest), levels && !!levels.length && (0, _react2.jsx)(_range_levels.EuiRangeLevels, {
        compressed: compressed,
        levels: levels,
        max: max,
        min: min,
        showTicks: showTicks
      }), tickSequence && (0, _react2.jsx)(_range_ticks.EuiRangeTicks, {
        disabled: disabled,
        compressed: compressed,
        onChange: onChange,
        ticks: ticks,
        tickSequence: tickSequence,
        value: value,
        min: min,
        max: max,
        interval: tickInterval || step
      }), children);
    }
  }]);

  return EuiRangeTrack;
}(_react.Component);

exports.EuiRangeTrack = EuiRangeTrack;
EuiRangeTrack.propTypes = {
  min: _propTypes.default.number.isRequired,
  max: _propTypes.default.number.isRequired,
  step: _propTypes.default.number,
  value: _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired, _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired]).isRequired).isRequired]),
  compressed: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  showTicks: _propTypes.default.bool,
  tickInterval: _propTypes.default.number,
  ticks: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.number.isRequired,
    label: _propTypes.default.node.isRequired
  }).isRequired),
  onChange: _propTypes.default.func,
  levels: _propTypes.default.arrayOf(_propTypes.default.shape({
    min: _propTypes.default.number.isRequired,
    max: _propTypes.default.number.isRequired,

    /**
       * Accepts one of `["primary", "success", "warning", "danger"]` or a valid CSS color value.
       */
    color: _propTypes.default.oneOfType([_propTypes.default.oneOf(["primary", "success", "warning", "danger"]).isRequired, _propTypes.default.any.isRequired]).isRequired,
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  }).isRequired)
};