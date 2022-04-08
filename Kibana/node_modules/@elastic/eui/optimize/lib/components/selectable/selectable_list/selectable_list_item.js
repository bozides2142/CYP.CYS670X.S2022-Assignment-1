"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSelectableListItem = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _i18n = require("../../i18n");

var _icon = require("../../icon");

var _accessibility = require("../../accessibility");

var _badge = require("../../badge");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function resolveIconAndColor(checked) {
  if (!checked) {
    return {
      icon: 'empty'
    };
  }

  return checked === 'on' ? {
    icon: 'check',
    color: 'text'
  } : {
    icon: 'cross',
    color: 'text'
  };
}

// eslint-disable-next-line react/prefer-stateless-function
var EuiSelectableListItem = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiSelectableListItem, _Component);

  var _super = _createSuper(EuiSelectableListItem);

  function EuiSelectableListItem(props) {
    (0, _classCallCheck2.default)(this, EuiSelectableListItem);
    return _super.call(this, props);
  }

  (0, _createClass2.default)(EuiSelectableListItem, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          disabled = _this$props.disabled,
          checked = _this$props.checked,
          isFocused = _this$props.isFocused,
          showIcons = _this$props.showIcons,
          prepend = _this$props.prepend,
          append = _this$props.append,
          allowExclusions = _this$props.allowExclusions,
          onFocusBadge = _this$props.onFocusBadge,
          rest = (0, _objectWithoutProperties2.default)(_this$props, ["children", "className", "disabled", "checked", "isFocused", "showIcons", "prepend", "append", "allowExclusions", "onFocusBadge"]);
      var classes = (0, _classnames.default)('euiSelectableListItem', {
        'euiSelectableListItem-isFocused': isFocused
      }, className);
      var optionIcon;

      if (showIcons) {
        var _resolveIconAndColor = resolveIconAndColor(checked),
            icon = _resolveIconAndColor.icon,
            color = _resolveIconAndColor.color;

        optionIcon = (0, _react2.jsx)(_icon.EuiIcon, {
          className: "euiSelectableListItem__icon",
          color: color,
          type: icon
        });
      }

      var state;
      var instruction;

      if (allowExclusions && checked === 'on') {
        state = (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSelectableListItem.includedOption",
          default: "Included option."
        })));
        instruction = (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSelectableListItem.includedOptionInstructions",
          default: "To exclude this option, press enter."
        })));
      } else if (allowExclusions && checked === 'off') {
        state = (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSelectableListItem.excludedOption",
          default: "Excluded option."
        })));
        instruction = (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSelectableListItem.excludedOptionInstructions",
          default: "To deselect this option, press enter."
        })));
      }

      var prependNode;

      if (prepend) {
        prependNode = (0, _react2.jsx)("span", {
          className: "euiSelectableListItem__prepend"
        }, prepend);
      }

      var appendNode;

      if (append || !!onFocusBadge) {
        var onFocusBadgeNode;
        var defaultOnFocusBadgeProps = {
          'aria-hidden': true,
          iconType: 'returnKey',
          iconSide: 'left',
          color: 'hollow'
        };

        if (onFocusBadge === true) {
          onFocusBadgeNode = (0, _react2.jsx)(_badge.EuiBadge, (0, _extends2.default)({
            className: "euiSelectableListItem__onFocusBadge"
          }, defaultOnFocusBadgeProps));
        } else if (!!onFocusBadge && onFocusBadge !== false) {
          var _children = onFocusBadge.children,
              _className = onFocusBadge.className,
              restBadgeProps = (0, _objectWithoutProperties2.default)(onFocusBadge, ["children", "className"]);
          onFocusBadgeNode = (0, _react2.jsx)(_badge.EuiBadge, (0, _extends2.default)({
            className: (0, _classnames.default)('euiSelectableListItem__onFocusBadge', _className)
          }, defaultOnFocusBadgeProps, restBadgeProps), _children);
        } // Only display the append wrapper if append exists or isFocused


        if (append || isFocused && !disabled) {
          appendNode = (0, _react2.jsx)("span", {
            className: "euiSelectableListItem__append"
          }, append, " ", isFocused && !disabled ? onFocusBadgeNode : null);
        }
      }

      return (0, _react2.jsx)("li", (0, _extends2.default)({
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        role: "option",
        "aria-selected": !disabled && typeof checked === 'string',
        className: classes,
        "aria-disabled": disabled
      }, rest), (0, _react2.jsx)("span", {
        className: "euiSelectableListItem__content"
      }, optionIcon, prependNode, (0, _react2.jsx)("span", {
        className: "euiSelectableListItem__text"
      }, state, children, instruction), appendNode));
    }
  }]);
  return EuiSelectableListItem;
}(_react.Component);

exports.EuiSelectableListItem = EuiSelectableListItem;
(0, _defineProperty2.default)(EuiSelectableListItem, "defaultProps", {
  showIcons: true,
  onFocusBadge: true
});