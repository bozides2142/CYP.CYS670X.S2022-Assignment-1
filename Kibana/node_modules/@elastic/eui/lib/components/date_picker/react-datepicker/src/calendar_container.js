"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CalendarContainer;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function CalendarContainer(_ref) {
  var className = _ref.className,
      children = _ref.children,
      _ref$arrowProps = _ref.arrowProps,
      arrowProps = _ref$arrowProps === void 0 ? {} : _ref$arrowProps;
  return (0, _react2.jsx)("div", {
    className: className
  }, (0, _react2.jsx)("div", _extends({
    className: "react-datepicker__triangle"
  }, arrowProps)), children);
}

CalendarContainer.propTypes = {
  className: _propTypes.default.string,
  children: _propTypes.default.node,
  arrowProps: _propTypes.default.object // react-popper arrow props

};
module.exports = exports.default;