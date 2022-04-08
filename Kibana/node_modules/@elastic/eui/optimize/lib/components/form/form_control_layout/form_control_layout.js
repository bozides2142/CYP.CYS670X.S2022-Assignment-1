"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ICON_SIDES", {
  enumerable: true,
  get: function get() {
    return _form_control_layout_icons.ICON_SIDES;
  }
});
exports.EuiFormControlLayout = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_control_layout_icons = require("./form_control_layout_icons");

var _form_label = require("../form_label");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EuiFormControlLayout = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiFormControlLayout, _Component);

  var _super = _createSuper(EuiFormControlLayout);

  function EuiFormControlLayout() {
    (0, _classCallCheck2.default)(this, EuiFormControlLayout);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EuiFormControlLayout, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          icon = _this$props.icon,
          clear = _this$props.clear,
          fullWidth = _this$props.fullWidth,
          isLoading = _this$props.isLoading,
          isDisabled = _this$props.isDisabled,
          compressed = _this$props.compressed,
          className = _this$props.className,
          prepend = _this$props.prepend,
          append = _this$props.append,
          readOnly = _this$props.readOnly,
          inputId = _this$props.inputId,
          rest = (0, _objectWithoutProperties2.default)(_this$props, ["children", "icon", "clear", "fullWidth", "isLoading", "isDisabled", "compressed", "className", "prepend", "append", "readOnly", "inputId"]);
      var classes = (0, _classnames.default)('euiFormControlLayout', {
        'euiFormControlLayout--fullWidth': fullWidth,
        'euiFormControlLayout--compressed': compressed,
        'euiFormControlLayout--readOnly': readOnly,
        'euiFormControlLayout--group': prepend || append,
        'euiFormControlLayout-isDisabled': isDisabled
      }, className);
      var prependNodes = this.renderSideNode('prepend', prepend, inputId);
      var appendNodes = this.renderSideNode('append', append, inputId);
      return (0, _react2.jsx)("div", (0, _extends2.default)({
        className: classes
      }, rest), prependNodes, (0, _react2.jsx)("div", {
        className: "euiFormControlLayout__childrenWrapper"
      }, children, (0, _react2.jsx)(_form_control_layout_icons.EuiFormControlLayoutIcons, {
        icon: icon,
        clear: clear,
        compressed: compressed,
        isLoading: isLoading
      })), appendNodes);
    }
  }, {
    key: "renderSideNode",
    value: function renderSideNode(side, nodes, inputId) {
      var _this = this;

      if (!nodes) {
        return;
      }

      if (typeof nodes === 'string') {
        return this.createFormLabel(side, nodes, inputId);
      }

      var appendNodes = _react.default.Children.map(nodes, function (item, index) {
        return typeof item === 'string' ? _this.createFormLabel(side, item, inputId) : _this.createSideNode(side, item, index);
      });

      return appendNodes;
    }
  }, {
    key: "createFormLabel",
    value: function createFormLabel(side, string, inputId) {
      return (0, _react2.jsx)(_form_label.EuiFormLabel, {
        htmlFor: inputId,
        className: "euiFormControlLayout__".concat(side)
      }, string);
    }
  }, {
    key: "createSideNode",
    value: function createSideNode(side, node, key) {
      return /*#__PURE__*/(0, _react.cloneElement)(node, {
        className: (0, _classnames.default)("euiFormControlLayout__".concat(side), node.props.className),
        key: key
      });
    }
  }]);
  return EuiFormControlLayout;
}(_react.Component);

exports.EuiFormControlLayout = EuiFormControlLayout;