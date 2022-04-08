"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTableHeaderCellCheckbox = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("./utils");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiTableHeaderCellCheckbox = function EuiTableHeaderCellCheckbox(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$scope = _ref.scope,
      scope = _ref$scope === void 0 ? 'col' : _ref$scope,
      style = _ref.style,
      width = _ref.width,
      rest = _objectWithoutProperties(_ref, ["children", "className", "scope", "style", "width"]);

  var classes = (0, _classnames.default)('euiTableHeaderCellCheckbox', className);
  var styleObj = (0, _utils.resolveWidthAsStyle)(style, width);
  return (0, _react2.jsx)("th", _extends({
    className: classes,
    scope: scope,
    style: styleObj
  }, rest), (0, _react2.jsx)("div", {
    className: "euiTableCellContent"
  }, children));
};

exports.EuiTableHeaderCellCheckbox = EuiTableHeaderCellCheckbox;
EuiTableHeaderCellCheckbox.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  width: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired]),
  scope: _propTypes.default.oneOf(["col", "row", "colgroup", "rowgroup"])
};