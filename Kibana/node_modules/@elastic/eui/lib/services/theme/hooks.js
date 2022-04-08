"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withEuiTheme = exports.useEuiTheme = void 0;

var _react = _interopRequireWildcard(require("react"));

var _context = require("./context");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var useEuiTheme = function useEuiTheme() {
  var theme = (0, _react.useContext)(_context.EuiThemeContext);
  var colorMode = (0, _react.useContext)(_context.EuiColorModeContext);
  var modifications = (0, _react.useContext)(_context.EuiModificationsContext);
  return {
    euiTheme: theme,
    colorMode: colorMode,
    modifications: modifications
  };
};

exports.useEuiTheme = useEuiTheme;

var withEuiTheme = function withEuiTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';

  var Render = function Render(props, ref) {
    var _useEuiTheme = useEuiTheme(),
        euiTheme = _useEuiTheme.euiTheme,
        colorMode = _useEuiTheme.colorMode,
        modifications = _useEuiTheme.modifications;

    return (0, _react2.jsx)(Component, _extends({
      theme: {
        euiTheme: euiTheme,
        colorMode: colorMode,
        modifications: modifications
      },
      ref: ref
    }, props));
  };

  var WithEuiTheme = /*#__PURE__*/(0, _react.forwardRef)(Render);
  WithEuiTheme.displayName = "WithEuiTheme(".concat(componentName, ")");
  return WithEuiTheme;
};

exports.withEuiTheme = withEuiTheme;