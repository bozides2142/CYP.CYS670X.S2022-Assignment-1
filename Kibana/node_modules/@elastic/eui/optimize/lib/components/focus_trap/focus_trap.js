"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFocusTrap = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactFocusOn = require("react-focus-on");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EuiFocusTrap = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiFocusTrap, _Component);

  var _super = _createSuper(EuiFocusTrap);

  function EuiFocusTrap() {
    var _this;

    (0, _classCallCheck2.default)(this, EuiFocusTrap);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(_args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      hasBeenDisabledByClick: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "lastInterceptedEvent", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "preventFocusExit", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setInitialFocus", function (initialFocus) {
      var node = initialFocus instanceof HTMLElement ? initialFocus : null;

      if (typeof initialFocus === 'string') {
        node = document.querySelector(initialFocus);
      } else if (typeof initialFocus === 'function') {
        node = initialFocus();
      }

      if (!node) return; // `data-autofocus` is part of the 'react-focus-on' API

      node.setAttribute('data-autofocus', 'true');
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOutsideClick", function () {
      var _this$props = _this.props,
          onClickOutside = _this$props.onClickOutside,
          clickOutsideDisables = _this$props.clickOutsideDisables;

      if (clickOutsideDisables) {
        _this.setState({
          hasBeenDisabledByClick: true
        });
      }

      if (onClickOutside) {
        onClickOutside.apply(void 0, arguments);
      }
    });
    return _this;
  }

  (0, _createClass2.default)(EuiFocusTrap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setInitialFocus(this.props.initialFocus);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.disabled === true && this.props.disabled === false) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          hasBeenDisabledByClick: false
        });
      }
    } // Programmatically sets focus on a nested DOM node; optional

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          clickOutsideDisables = _this$props2.clickOutsideDisables,
          disabled = _this$props2.disabled,
          returnFocus = _this$props2.returnFocus,
          noIsolation = _this$props2.noIsolation,
          scrollLock = _this$props2.scrollLock,
          rest = (0, _objectWithoutProperties2.default)(_this$props2, ["children", "clickOutsideDisables", "disabled", "returnFocus", "noIsolation", "scrollLock"]);
      var isDisabled = disabled || this.state.hasBeenDisabledByClick;

      var focusOnProps = _objectSpread(_objectSpread({
        returnFocus: returnFocus,
        noIsolation: noIsolation,
        scrollLock: scrollLock,
        enabled: !isDisabled
      }, rest), {}, {
        onClickOutside: this.handleOutsideClick
      });

      return (0, _react2.jsx)(_reactFocusOn.FocusOn, focusOnProps, children);
    }
  }]);
  return EuiFocusTrap;
}(_react.Component);

exports.EuiFocusTrap = EuiFocusTrap;
(0, _defineProperty2.default)(EuiFocusTrap, "defaultProps", {
  clickOutsideDisables: false,
  disabled: false,
  returnFocus: true,
  noIsolation: true,
  scrollLock: false
});