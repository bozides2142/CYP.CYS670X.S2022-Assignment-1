"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFacetGroup = exports.GUTTER_SIZES = exports.LAYOUTS = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _flex = require("../flex");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var layoutToClassNameMap = {
  vertical: 'euiFacetGroup--vertical',
  horizontal: 'euiFacetGroup--horizontal'
};
var LAYOUTS = (0, _common.keysOf)(layoutToClassNameMap);
exports.LAYOUTS = LAYOUTS;
var gutterSizeToClassNameMap = {
  none: 'euiFacetGroup--gutterNone',
  s: 'euiFacetGroup--gutterSmall',
  m: 'euiFacetGroup--gutterMedium',
  l: 'euiFacetGroup--gutterLarge'
};
var GUTTER_SIZES = (0, _common.keysOf)(gutterSizeToClassNameMap);
exports.GUTTER_SIZES = GUTTER_SIZES;

var EuiFacetGroup = function EuiFacetGroup(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? 'vertical' : _ref$layout,
      _ref$gutterSize = _ref.gutterSize,
      gutterSize = _ref$gutterSize === void 0 ? 'm' : _ref$gutterSize,
      rest = _objectWithoutProperties(_ref, ["children", "className", "layout", "gutterSize"]);

  var classes = (0, _classnames.default)('euiFacetGroup', layoutToClassNameMap[layout], gutterSizeToClassNameMap[gutterSize], className);
  var direction = layout === 'vertical' ? 'column' : 'row';
  var wrap = layout === 'vertical' ? false : true;
  return (0, _react2.jsx)(_flex.EuiFlexGroup, _extends({
    className: classes,
    direction: direction,
    wrap: wrap,
    gutterSize: "none"
  }, rest), children);
};

exports.EuiFacetGroup = EuiFacetGroup;
EuiFacetGroup.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Vertically in a column, or horizontally in one wrapping line
       */
  layout: _propTypes.default.oneOf(["vertical", "horizontal"]),

  /**
       * Distance between facet buttons.
       * Horizontal layout always adds more distance horizontally between buttons.
       */
  gutterSize: _propTypes.default.oneOf(["none", "s", "m", "l"])
};