"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiEmptyPrompt = exports.PADDING_SIZES = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _title = require("../title");

var _flex = require("../flex");

var _spacer = require("../spacer");

var _icon = require("../icon");

var _named_colors = require("../icon/named_colors");

var _text = require("../text");

var _panel = require("../panel/panel");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var paddingSizeToClassNameMap = {
  none: null,
  s: 'euiEmptyPrompt--paddingSmall',
  m: 'euiEmptyPrompt--paddingMedium',
  l: 'euiEmptyPrompt--paddingLarge'
};
var PADDING_SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.PADDING_SIZES = PADDING_SIZES;

var EuiEmptyPrompt = function EuiEmptyPrompt(_ref) {
  var icon = _ref.icon,
      iconType = _ref.iconType,
      _iconColor = _ref.iconColor,
      title = _ref.title,
      _ref$titleSize = _ref.titleSize,
      titleSize = _ref$titleSize === void 0 ? 'm' : _ref$titleSize,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'l' : _ref$paddingSize,
      body = _ref.body,
      actions = _ref.actions,
      className = _ref.className,
      _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? 'vertical' : _ref$layout,
      hasBorder = _ref.hasBorder,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'transparent' : _ref$color,
      footer = _ref.footer,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["icon", "iconType", "iconColor", "title", "titleSize", "paddingSize", "body", "actions", "className", "layout", "hasBorder", "color", "footer"]);
  var isVerticalLayout = layout === 'vertical'; // Default the iconColor to `subdued`,
  // otherwise try to match the iconColor with the panel color unless iconColor is specified

  var iconColor = _iconColor !== null && _iconColor !== void 0 ? _iconColor : (0, _named_colors.isNamedColor)(color) ? color : 'subdued';
  var iconNode = iconType ? (0, _react2.jsx)(_icon.EuiIcon, {
    type: iconType,
    size: "xxl",
    color: iconColor
  }) : icon;
  var titleNode;
  var bodyNode;

  if (body || title) {
    if (title) {
      titleNode = (0, _react2.jsx)(_title.EuiTitle, {
        size: titleSize
      }, title);
    }

    if (body) {
      bodyNode = (0, _react2.jsx)(_text.EuiTextColor, {
        color: "subdued"
      }, title && (0, _react2.jsx)(_spacer.EuiSpacer, {
        size: "m"
      }), (0, _react2.jsx)(_text.EuiText, null, body));
    }
  }

  var actionsNode;

  if (actions) {
    var actionsRow;

    if (Array.isArray(actions)) {
      actionsRow = (0, _react2.jsx)(_flex.EuiFlexGroup, {
        className: "euiEmptyPrompt__actions",
        gutterSize: "m",
        alignItems: "center",
        justifyContent: "center",
        direction: isVerticalLayout ? 'column' : 'row'
      }, actions.map(function (action, index) {
        return (0, _react2.jsx)(_flex.EuiFlexItem, {
          key: index,
          grow: false
        }, action);
      }));
    } else {
      actionsRow = actions;
    }

    actionsNode = (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_spacer.EuiSpacer, {
      size: "l"
    }), actionsRow);
  }

  var contentNodes = (0, _react2.jsx)(_react.default.Fragment, null, titleNode, bodyNode, actionsNode);
  var classes = (0, _classnames.default)('euiEmptyPrompt', ["euiEmptyPrompt--".concat(layout)], paddingSizeToClassNameMap[paddingSize], className);

  var panelProps = _objectSpread({
    className: classes,
    color: color,
    paddingSize: 'none',
    hasBorder: hasBorder
  }, rest);

  return (0, _react2.jsx)(_panel.EuiPanel, panelProps, (0, _react2.jsx)("div", {
    className: "euiEmptyPrompt__main"
  }, iconNode && (0, _react2.jsx)("div", {
    className: "euiEmptyPrompt__icon"
  }, iconNode), (0, _react2.jsx)("div", {
    className: "euiEmptyPrompt__content"
  }, (0, _react2.jsx)("div", {
    className: "euiEmptyPrompt__contentInner"
  }, contentNodes))), footer && (0, _react2.jsx)("div", {
    className: "euiEmptyPrompt__footer"
  }, footer));
};

exports.EuiEmptyPrompt = EuiEmptyPrompt;