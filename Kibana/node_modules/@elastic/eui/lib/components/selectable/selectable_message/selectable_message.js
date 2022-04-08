"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSelectableMessage = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _text = require("../../text");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiSelectableMessage = function EuiSelectableMessage(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$bordered = _ref.bordered,
      bordered = _ref$bordered === void 0 ? false : _ref$bordered,
      rest = _objectWithoutProperties(_ref, ["children", "className", "bordered"]);

  var classes = (0, _classnames.default)('euiSelectableMessage', {
    'euiSelectableMessage--bordered': bordered
  }, className);
  return (0, _react2.jsx)(_text.EuiText, _extends({
    color: "subdued",
    size: "xs",
    className: classes
  }, rest), children);
};

exports.EuiSelectableMessage = EuiSelectableMessage;
EuiSelectableMessage.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Match this to the `listProps.bordered` property of your `EuiSelectable` instance
       */
  bordered: _propTypes.default.bool
};