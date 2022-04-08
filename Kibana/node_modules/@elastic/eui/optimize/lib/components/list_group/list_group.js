"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiListGroup = exports.GUTTER_SIZES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _list_group_item = require("./list_group_item");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var gutterSizeToClassNameMap = {
  none: '',
  s: 'euiListGroup--gutterSmall',
  m: 'euiListGroup--gutterMedium'
};
var GUTTER_SIZES = Object.keys(gutterSizeToClassNameMap);
exports.GUTTER_SIZES = GUTTER_SIZES;

var EuiListGroup = function EuiListGroup(_ref) {
  var children = _ref.children,
      className = _ref.className,
      listItems = _ref.listItems,
      style = _ref.style,
      _ref$flush = _ref.flush,
      flush = _ref$flush === void 0 ? false : _ref$flush,
      _ref$bordered = _ref.bordered,
      bordered = _ref$bordered === void 0 ? false : _ref$bordered,
      _ref$gutterSize = _ref.gutterSize,
      gutterSize = _ref$gutterSize === void 0 ? 's' : _ref$gutterSize,
      _ref$wrapText = _ref.wrapText,
      wrapText = _ref$wrapText === void 0 ? false : _ref$wrapText,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? true : _ref$maxWidth,
      _ref$showToolTips = _ref.showToolTips,
      showToolTips = _ref$showToolTips === void 0 ? false : _ref$showToolTips,
      color = _ref.color,
      size = _ref.size,
      ariaLabelledby = _ref.ariaLabelledby,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "listItems", "style", "flush", "bordered", "gutterSize", "wrapText", "maxWidth", "showToolTips", "color", "size", "ariaLabelledby"]);
  var newStyle;
  var widthClassName;

  if (maxWidth !== true) {
    var value;

    if (typeof maxWidth === 'number') {
      value = "".concat(maxWidth, "px");
    } else {
      value = typeof maxWidth === 'string' ? maxWidth : undefined;
    }

    newStyle = _objectSpread(_objectSpread({}, style), {}, {
      maxWidth: value
    });
  } else if (maxWidth === true) {
    widthClassName = 'euiListGroup-maxWidthDefault';
  }

  var classes = (0, _classnames.default)('euiListGroup', {
    'euiListGroup-flush': flush,
    'euiListGroup-bordered': bordered
  }, gutterSizeToClassNameMap[gutterSize], widthClassName, className);
  var childrenOrListItems = null;

  if (listItems) {
    childrenOrListItems = listItems.map(function (item, index) {
      return [(0, _react2.jsx)(_list_group_item.EuiListGroupItem, (0, _extends2.default)({
        key: "title-".concat(index),
        showToolTip: showToolTips,
        wrapText: wrapText,
        color: color,
        size: size
      }, item))];
    });
  } else {
    if (showToolTips) {
      childrenOrListItems = _react.default.Children.map(children, function (child) {
        if ( /*#__PURE__*/_react.default.isValidElement(child)) {
          return /*#__PURE__*/_react.default.cloneElement(child, {
            showToolTip: true
          });
        }
      });
    } else {
      childrenOrListItems = children;
    }
  }

  return (0, _react2.jsx)("ul", (0, _extends2.default)({
    className: classes,
    style: newStyle || style,
    "aria-labelledby": ariaLabelledby
  }, rest), childrenOrListItems);
};

exports.EuiListGroup = EuiListGroup;