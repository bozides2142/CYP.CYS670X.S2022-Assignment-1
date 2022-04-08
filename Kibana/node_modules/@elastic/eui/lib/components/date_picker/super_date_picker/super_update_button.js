"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSuperUpdateButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = require("../../button");

var _i18n = require("../../i18n");

var _tool_tip = require("../../tool_tip");

var _responsive2 = require("../../responsive");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var EuiSuperUpdateButton = /*#__PURE__*/function (_Component) {
  _inherits(EuiSuperUpdateButton, _Component);

  var _super = _createSuper(EuiSuperUpdateButton);

  function EuiSuperUpdateButton() {
    var _this;

    _classCallCheck(this, EuiSuperUpdateButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_isMounted", false);

    _defineProperty(_assertThisInitialized(_this), "tooltipTimeout", void 0);

    _defineProperty(_assertThisInitialized(_this), "tooltip", null);

    _defineProperty(_assertThisInitialized(_this), "setTootipRef", function (node) {
      _this.tooltip = node;
    });

    _defineProperty(_assertThisInitialized(_this), "showTooltip", function () {
      if (!_this._isMounted || !_this.tooltip) {
        return;
      }

      _this.tooltip.showToolTip();
    });

    _defineProperty(_assertThisInitialized(_this), "hideTooltip", function () {
      if (!_this._isMounted || !_this.tooltip) {
        return;
      }

      _this.tooltip.hideToolTip();
    });

    return _this;
  }

  _createClass(EuiSuperUpdateButton, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;

      if (this.props.showTooltip && this.props.needsUpdate && !this.props.isDisabled && !this.props.isLoading) {
        this.showTooltip();
        this.tooltipTimeout = setTimeout(function () {
          _this2.hideTooltip();
        }, 2000);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          needsUpdate = _this$props.needsUpdate,
          isLoading = _this$props.isLoading,
          isDisabled = _this$props.isDisabled,
          onClick = _this$props.onClick,
          toolTipProps = _this$props.toolTipProps,
          showTooltip = _this$props.showTooltip,
          iconOnly = _this$props.iconOnly,
          _responsive = _this$props.responsive,
          restTextProps = _this$props.textProps,
          fill = _this$props.fill,
          rest = _objectWithoutProperties(_this$props, ["className", "needsUpdate", "isLoading", "isDisabled", "onClick", "toolTipProps", "showTooltip", "iconOnly", "responsive", "textProps", "fill"]); // Force responsive for "all" if `iconOnly = true`


      var responsive = iconOnly ? 'all' : _responsive;
      var classes = (0, _classnames.default)('euiSuperUpdateButton', className);
      var buttonText = (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiSuperUpdateButton.refreshButtonLabel",
        default: "Refresh"
      });

      if (needsUpdate || isLoading) {
        buttonText = isLoading ? (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSuperUpdateButton.updatingButtonLabel",
          default: "Updating"
        }) : (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSuperUpdateButton.updateButtonLabel",
          default: "Update"
        });
      }

      var tooltipContent;

      if (isDisabled) {
        tooltipContent = (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSuperUpdateButton.cannotUpdateTooltip",
          default: "Cannot update"
        });
      } else if (needsUpdate && !isLoading) {
        tooltipContent = (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSuperUpdateButton.clickToApplyTooltip",
          default: "Click to apply"
        });
      }

      var sharedButtonProps = {
        color: needsUpdate || isLoading ? 'success' : 'primary',
        iconType: needsUpdate || isLoading ? 'kqlFunction' : 'refresh',
        isDisabled: isDisabled,
        onClick: onClick,
        isLoading: isLoading
      };
      return (0, _react2.jsx)(_tool_tip.EuiToolTip, _extends({
        ref: this.setTootipRef,
        content: tooltipContent,
        position: "bottom"
      }, toolTipProps), (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_responsive2.EuiShowFor, {
        sizes: responsive || 'none'
      }, (0, _react2.jsx)(_button.EuiButton, _extends({
        className: classes,
        minWidth: 0
      }, sharedButtonProps, {
        fill: fill,
        textProps: _objectSpread(_objectSpread({}, restTextProps), {}, {
          className: (0, _classnames.default)('euiScreenReaderOnly', restTextProps === null || restTextProps === void 0 ? void 0 : restTextProps.className)
        })
      }, rest), buttonText)), (0, _react2.jsx)(_responsive2.EuiHideFor, {
        sizes: responsive || 'none'
      }, (0, _react2.jsx)(_button.EuiButton, _extends({
        className: classes,
        minWidth: 118
      }, sharedButtonProps, {
        fill: fill,
        textProps: restTextProps
      }, rest), buttonText))));
    }
  }]);

  return EuiSuperUpdateButton;
}(_react.Component);

exports.EuiSuperUpdateButton = EuiSuperUpdateButton;

_defineProperty(EuiSuperUpdateButton, "defaultProps", {
  needsUpdate: false,
  isLoading: false,
  isDisabled: false,
  showTooltip: false,
  responsive: ['xs', 's'],
  fill: true
});

EuiSuperUpdateButton.propTypes = {
  isDisabled: _propTypes.default.bool,
  isLoading: _propTypes.default.bool,
  needsUpdate: _propTypes.default.bool,
  onClick: _propTypes.default.func.isRequired,

  /**
     * Show the "Click to apply" tooltip
     */
  showTooltip: _propTypes.default.bool,

  /**
     * Passes props to `EuiToolTip`
     */
  toolTipProps: _propTypes.default.shape({
    /**
       * Passes onto the the trigger.
       */
    anchorClassName: _propTypes.default.string,

    /**
       * The in-view trigger for your tooltip.
       */
    children: _propTypes.default.element.isRequired,

    /**
       * Passes onto the tooltip itself, not the trigger.
       */
    className: _propTypes.default.string,

    /**
       * The main content of your tooltip.
       */
    content: _propTypes.default.node,

    /**
       * Common display alternatives for the anchor wrapper
       */
    display: _propTypes.default.oneOf(["inlineBlock", "block"]),

    /**
       * Delay before showing tooltip. Good for repeatable items.
       */
    delay: _propTypes.default.oneOf(["regular", "long"]).isRequired,

    /**
       * An optional title for your tooltip.
       */
    title: _propTypes.default.node,

    /**
       * Unless you provide one, this will be randomly generated.
       */
    id: _propTypes.default.string,

    /**
       * Suggested position. If there is not enough room for it this will be changed.
       */
    position: _propTypes.default.oneOf(["top", "right", "bottom", "left"]).isRequired,

    /**
       * If supplied, called when mouse movement causes the tool tip to be
       * hidden.
       */
    onMouseOut: _propTypes.default.func
  }),

  /**
     * Returns an IconButton instead
     */
  iconOnly: _propTypes.default.bool,

  /**
     * Forces state to be `iconOnly` when within provided breakpoints.
     * Remove completely with `false` or provide your own list of breakpoints.
     */
  responsive: _propTypes.default.oneOfType([_propTypes.default.oneOf([false]), _propTypes.default.arrayOf(_propTypes.default.oneOf(["xs", "s", "m", "l", "xl"]).isRequired).isRequired])
};