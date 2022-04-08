"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPageContent = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _panel = require("../../panel/panel");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var verticalPositionToClassNameMap = {
  center: 'euiPageContent--verticalCenter'
};
var horizontalPositionToClassNameMap = {
  center: 'euiPageContent--horizontalCenter'
};

var EuiPageContent = function EuiPageContent(_ref) {
  var verticalPosition = _ref.verticalPosition,
      horizontalPosition = _ref.horizontalPosition,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'l' : _ref$paddingSize,
      borderRadius = _ref.borderRadius,
      children = _ref.children,
      className = _ref.className,
      _ref$role = _ref.role,
      _role = _ref$role === void 0 ? 'main' : _ref$role,
      rest = _objectWithoutProperties(_ref, ["verticalPosition", "horizontalPosition", "paddingSize", "borderRadius", "children", "className", "role"]);

  var role = _role === null ? undefined : _role;
  var borderRadiusClass = borderRadius === 'none' ? 'euiPageContent--borderRadiusNone' : '';
  var classes = (0, _classnames.default)('euiPageContent', borderRadiusClass, verticalPosition ? verticalPositionToClassNameMap[verticalPosition] : null, horizontalPosition ? horizontalPositionToClassNameMap[horizontalPosition] : null, className);
  return (0, _react2.jsx)(_panel.EuiPanel, _extends({
    className: classes,
    paddingSize: paddingSize,
    borderRadius: borderRadius,
    role: role
  }, rest), children);
};

exports.EuiPageContent = EuiPageContent;
EuiPageContent.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Adds a medium shadow to the panel;
     * Only works when `color="plain"`
     */

  /**
     * Adds a medium shadow to the panel;
     * Only works when `color="plain"`
     */
  hasShadow: _propTypes.default.bool,

  /**
     * Adds a slight 1px border on all edges.
     * Only works when `color="plain | transparent"`
     * Default is `undefined` and will default to that theme's panel style
     */

  /**
     * Adds a slight 1px border on all edges.
     * Only works when `color="plain | transparent"`
     * Default is `undefined` and will default to that theme's panel style
     */
  hasBorder: _propTypes.default.bool,

  /**
     * Padding for all four sides
     */

  /**
     * Padding for all four sides
     */
  paddingSize: _propTypes.default.any,

  /**
     * Corner border radius
     */

  /**
     * Corner border radius
     */
  borderRadius: _propTypes.default.any,

  /**
     * When true the panel will grow in height to match `EuiFlexItem`
     */

  /**
     * When true the panel will grow in height to match `EuiFlexItem`
     */
  grow: _propTypes.default.bool,
  panelRef: _propTypes.default.any,

  /**
     * Background color of the panel;
     * Usually a lightened form of the brand colors
     */

  /**
     * Background color of the panel;
     * Usually a lightened form of the brand colors
     */
  color: _propTypes.default.any,
  element: _propTypes.default.oneOf(["div"]),
  verticalPosition: _propTypes.default.oneOf(["center"]),
  horizontalPosition: _propTypes.default.oneOf(["center"]),

  /**
       * There should only be one EuiPageContent per page and should contain the main contents.
       * If this is untrue, set role = `null`, or change it to match your needed aria role
       */
  role: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.oneOf([null])])
};