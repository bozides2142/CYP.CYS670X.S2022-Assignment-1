"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFormControlLayoutIcons = exports.ICON_SIDES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _loading = require("../../loading");

var _form_control_layout_clear_button = require("./form_control_layout_clear_button");

var _form_control_layout_custom_icon = require("./form_control_layout_custom_icon");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ICON_SIDES = ['left', 'right'];
exports.ICON_SIDES = ICON_SIDES;

function isIconShape(icon) {
  return !!icon && icon.hasOwnProperty('type');
}

var EuiFormControlLayoutIcons = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiFormControlLayoutIcons, _Component);

  var _super = _createSuper(EuiFormControlLayoutIcons);

  function EuiFormControlLayoutIcons() {
    (0, _classCallCheck2.default)(this, EuiFormControlLayoutIcons);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EuiFormControlLayoutIcons, [{
    key: "render",
    value: function render() {
      var icon = this.props.icon;
      var iconSide = isIconShape(icon) && icon.side ? icon.side : 'left';
      var customIcon = this.renderCustomIcon();
      var loadingSpinner = this.renderLoadingSpinner();
      var clearButton = this.renderClearButton();
      var leftIcons;

      if (customIcon && iconSide === 'left') {
        leftIcons = (0, _react2.jsx)("div", {
          className: "euiFormControlLayoutIcons"
        }, customIcon);
      }

      var rightIcons; // If the icon is on the right, it should be placed after the clear button in the DOM.

      if (clearButton || loadingSpinner || customIcon && iconSide === 'right') {
        rightIcons = (0, _react2.jsx)("div", {
          className: "euiFormControlLayoutIcons euiFormControlLayoutIcons--right"
        }, clearButton, loadingSpinner, iconSide === 'right' ? customIcon : undefined);
      }

      return (0, _react2.jsx)(_react.Fragment, null, leftIcons, rightIcons);
    }
  }, {
    key: "renderCustomIcon",
    value: function renderCustomIcon() {
      var _this$props = this.props,
          icon = _this$props.icon,
          compressed = _this$props.compressed;

      if (!icon) {
        return null;
      } // Normalize the icon to an object if it's a string.


      var iconProps = isIconShape(icon) ? icon : {
        type: icon
      };
      var iconRef = iconProps.ref,
          side = iconProps.side,
          iconRest = (0, _objectWithoutProperties2.default)(iconProps, ["ref", "side"]);
      return (0, _react2.jsx)(_form_control_layout_custom_icon.EuiFormControlLayoutCustomIcon, (0, _extends2.default)({
        size: compressed ? 's' : 'm',
        iconRef: iconRef
      }, iconRest));
    }
  }, {
    key: "renderLoadingSpinner",
    value: function renderLoadingSpinner() {
      var _this$props2 = this.props,
          isLoading = _this$props2.isLoading,
          compressed = _this$props2.compressed;

      if (!isLoading) {
        return null;
      }

      return (0, _react2.jsx)(_loading.EuiLoadingSpinner, {
        size: compressed ? 's' : 'm'
      });
    }
  }, {
    key: "renderClearButton",
    value: function renderClearButton() {
      var _this$props3 = this.props,
          clear = _this$props3.clear,
          compressed = _this$props3.compressed;

      if (!clear) {
        return null;
      }

      return (0, _react2.jsx)(_form_control_layout_clear_button.EuiFormControlLayoutClearButton, (0, _extends2.default)({
        size: compressed ? 's' : 'm'
      }, clear));
    }
  }]);
  return EuiFormControlLayoutIcons;
}(_react.Component);

exports.EuiFormControlLayoutIcons = EuiFormControlLayoutIcons;