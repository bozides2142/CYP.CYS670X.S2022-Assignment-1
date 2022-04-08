"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiAccordion = exports.PADDING_SIZES = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _loading = require("../loading");

var _resize_observer = require("../observer/resize_observer");

var _i18n = require("../i18n");

var _services = require("../../services");

var _button = require("../button");

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

var paddingSizeToClassNameMap = {
  none: '',
  xs: 'euiAccordion__padding--xs',
  s: 'euiAccordion__padding--s',
  m: 'euiAccordion__padding--m',
  l: 'euiAccordion__padding--l',
  xl: 'euiAccordion__padding--xl'
};
var PADDING_SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.PADDING_SIZES = PADDING_SIZES;

var EuiAccordion = /*#__PURE__*/function (_Component) {
  _inherits(EuiAccordion, _Component);

  var _super = _createSuper(EuiAccordion);

  function EuiAccordion() {
    var _this;

    _classCallCheck(this, EuiAccordion);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "childContent", null);

    _defineProperty(_assertThisInitialized(_this), "childWrapper", null);

    _defineProperty(_assertThisInitialized(_this), "state", {
      isOpen: _this.props.forceState ? _this.props.forceState === 'open' : _this.props.initialIsOpen
    });

    _defineProperty(_assertThisInitialized(_this), "setChildContentHeight", function () {
      var forceState = _this.props.forceState;
      requestAnimationFrame(function () {
        var height = _this.childContent && (forceState ? forceState === 'open' : _this.state.isOpen) ? _this.childContent.clientHeight : 0;
        _this.childWrapper && _this.childWrapper.setAttribute('style', "height: ".concat(height, "px"));
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onToggle", function () {
      var forceState = _this.props.forceState;

      if (forceState) {
        _this.props.onToggle && _this.props.onToggle(forceState === 'open' ? false : true);
      } else {
        _this.setState(function (prevState) {
          return {
            isOpen: !prevState.isOpen
          };
        }, function () {
          if (_this.state.isOpen && _this.childWrapper) {
            _this.childWrapper.focus();
          }

          _this.props.onToggle && _this.props.onToggle(_this.state.isOpen);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setChildContentRef", function (node) {
      _this.childContent = node;
    });

    _defineProperty(_assertThisInitialized(_this), "generatedId", (0, _services.htmlIdGenerator)()());

    return _this;
  }

  _createClass(EuiAccordion, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setChildContentHeight();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.setChildContentHeight();
    }
  }, {
    key: "render",
    value: function render() {
      var _buttonProps$id,
          _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          buttonContent = _this$props.buttonContent,
          className = _this$props.className,
          id = _this$props.id,
          _this$props$element = _this$props.element,
          Element = _this$props$element === void 0 ? 'div' : _this$props$element,
          buttonClassName = _this$props.buttonClassName,
          buttonContentClassName = _this$props.buttonContentClassName,
          extraAction = _this$props.extraAction,
          paddingSize = _this$props.paddingSize,
          initialIsOpen = _this$props.initialIsOpen,
          arrowDisplay = _this$props.arrowDisplay,
          forceState = _this$props.forceState,
          isLoading = _this$props.isLoading,
          isLoadingMessage = _this$props.isLoadingMessage,
          buttonProps = _this$props.buttonProps,
          _this$props$buttonEle = _this$props.buttonElement,
          _ButtonElement = _this$props$buttonEle === void 0 ? 'button' : _this$props$buttonEle,
          arrowProps = _this$props.arrowProps,
          rest = _objectWithoutProperties(_this$props, ["children", "buttonContent", "className", "id", "element", "buttonClassName", "buttonContentClassName", "extraAction", "paddingSize", "initialIsOpen", "arrowDisplay", "forceState", "isLoading", "isLoadingMessage", "buttonProps", "buttonElement", "arrowProps"]);

      var isOpen = forceState ? forceState === 'open' : this.state.isOpen; // Force button element to be a legend if the element is a fieldset

      var ButtonElement = Element === 'fieldset' ? 'legend' : _ButtonElement;
      var buttonElementIsFocusable = ButtonElement === 'button'; // Force visibility of arrow button if button element is not focusable

      var _arrowDisplay = arrowDisplay === 'none' && !buttonElementIsFocusable ? 'left' : arrowDisplay;

      var classes = (0, _classnames.default)('euiAccordion', {
        'euiAccordion-isOpen': isOpen
      }, className);
      var paddingClass = paddingSize ? (0, _classnames.default)(paddingSizeToClassNameMap[paddingSize]) : undefined;
      var childrenClasses = (0, _classnames.default)(paddingClass, {
        'euiAccordion__children-isLoading': isLoading
      });
      var buttonClasses = (0, _classnames.default)('euiAccordion__button', buttonClassName, buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.className);
      var buttonContentClasses = (0, _classnames.default)('euiAccordion__buttonContent', buttonContentClassName);
      var iconButtonClasses = (0, _classnames.default)('euiAccordion__iconButton', {
        'euiAccordion__iconButton-isOpen': isOpen,
        'euiAccordion__iconButton--right': _arrowDisplay === 'right'
      }, arrowProps === null || arrowProps === void 0 ? void 0 : arrowProps.className);
      var iconButton;
      var buttonId = (_buttonProps$id = buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.id) !== null && _buttonProps$id !== void 0 ? _buttonProps$id : this.generatedId;

      if (_arrowDisplay !== 'none') {
        iconButton = (0, _react2.jsx)(_button.EuiButtonIcon, _extends({
          color: "text"
        }, arrowProps, {
          className: iconButtonClasses,
          iconType: "arrowRight",
          onClick: this.onToggle,
          "aria-controls": id,
          "aria-expanded": isOpen,
          "aria-labelledby": buttonId,
          tabIndex: buttonElementIsFocusable ? -1 : 0
        }));
      }

      var optionalAction = null;

      if (extraAction) {
        optionalAction = (0, _react2.jsx)("div", {
          className: "euiAccordion__optionalAction"
        }, isLoading ? (0, _react2.jsx)(_loading.EuiLoadingSpinner, null) : extraAction);
      }

      var childrenContent;

      if (isLoading && isLoadingMessage) {
        childrenContent = (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_loading.EuiLoadingSpinner, {
          className: "euiAccordion__spinner"
        }), (0, _react2.jsx)("span", null, isLoadingMessage && isLoadingMessage !== true ? isLoadingMessage : (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiAccordion.isLoading",
          default: "Loading"
        })));
      } else {
        childrenContent = children;
      }

      var button = (0, _react2.jsx)(ButtonElement, _extends({}, buttonProps, {
        id: buttonId,
        className: buttonClasses,
        "aria-controls": id,
        "aria-expanded": isOpen,
        onClick: this.onToggle,
        type: ButtonElement === 'button' ? 'button' : undefined
      }), (0, _react2.jsx)("span", {
        className: buttonContentClasses
      }, buttonContent));
      return (0, _react2.jsx)(Element, _extends({
        className: classes
      }, rest), (0, _react2.jsx)("div", {
        className: "euiAccordion__triggerWrapper"
      }, _arrowDisplay === 'left' && iconButton, button, optionalAction, _arrowDisplay === 'right' && iconButton), (0, _react2.jsx)("div", {
        className: "euiAccordion__childWrapper",
        ref: function ref(node) {
          _this2.childWrapper = node;
        },
        tabIndex: -1,
        role: "region",
        "aria-labelledby": buttonId,
        id: id
      }, (0, _react2.jsx)(_resize_observer.EuiResizeObserver, {
        onResize: this.setChildContentHeight
      }, function (resizeRef) {
        return (0, _react2.jsx)("div", {
          ref: function ref(_ref) {
            _this2.setChildContentRef(_ref);

            resizeRef(_ref);
          }
        }, (0, _react2.jsx)("div", {
          className: childrenClasses
        }, childrenContent));
      })));
    }
  }]);

  return EuiAccordion;
}(_react.Component);

exports.EuiAccordion = EuiAccordion;

_defineProperty(EuiAccordion, "defaultProps", {
  initialIsOpen: false,
  paddingSize: 'none',
  arrowDisplay: 'left',
  isLoading: false,
  isLoadingMessage: false,
  element: 'div',
  buttonElement: 'button'
});

EuiAccordion.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  id: _propTypes.default.string.isRequired,

  /**
       * Applied to the entire .euiAccordion wrapper.
       * When using `fieldset`, it will enforce `buttonElement = legend` as well.
       */
  element: _propTypes.default.oneOf(["div", "fieldset"]),

  /**
       * Class that will apply to the trigger for the accordion.
       */
  buttonClassName: _propTypes.default.string,

  /**
       * Apply more props to the triggering button
       */
  buttonProps: _propTypes.default.shape({
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  }),

  /**
       * Class that will apply to the trigger content for the accordion.
       */
  buttonContentClassName: _propTypes.default.string,

  /**
       * The content of the clickable trigger
       */
  buttonContent: _propTypes.default.node,

  /**
       * Applied to the main button receiving the `onToggle` event.
       * Anything other than the default `button` does not support removing the arrow display (for accessibility of focus).
       */
  buttonElement: _propTypes.default.oneOf(["div", "legend", "button"]),

  /**
       * Extra props to pass to the EuiButtonIcon containing the arrow.
       */
  arrowProps: _propTypes.default.any,

  /**
       * Will appear right aligned against the button. Useful for separate actions like deletions.
       */
  extraAction: _propTypes.default.node,

  /**
       * The accordion will start in the open state.
       */
  initialIsOpen: _propTypes.default.bool.isRequired,

  /**
       * Optional callback method called on open and close with a single `isOpen` parameter
       */
  onToggle: _propTypes.default.func,

  /**
       * The padding around the exposed accordion content.
       */
  paddingSize: _propTypes.default.oneOf(["none", "xs", "s", "m", "l", "xl"]),

  /**
       * Placement of the arrow indicator, or 'none' to hide it.
       */
  arrowDisplay: _propTypes.default.oneOf(["left", "right", "none"]),

  /**
       * Control the opening of accordion via prop
       */
  forceState: _propTypes.default.oneOf(["closed", "open"]),

  /**
       * Change `extraAction` and children into a loading spinner
       */
  isLoading: _propTypes.default.bool,

  /**
       * Choose whether the loading message replaces the content. Customize the message by passing a node
       */
  isLoadingMessage: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.node.isRequired])
};