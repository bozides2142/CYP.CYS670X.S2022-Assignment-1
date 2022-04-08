"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiThemeProvider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _context = require("./context");

var _utils = require("./utils");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EuiThemeProvider = function EuiThemeProvider(_ref) {
  var _system = _ref.theme,
      _colorMode = _ref.colorMode,
      _modifications = _ref.modify,
      children = _ref.children;
  var parentSystem = (0, _react.useContext)(_context.EuiSystemContext);
  var parentModifications = (0, _react.useContext)(_context.EuiModificationsContext);
  var parentColorMode = (0, _react.useContext)(_context.EuiColorModeContext);
  var parentTheme = (0, _react.useContext)(_context.EuiThemeContext);

  var _useState = (0, _react.useState)(_system || parentSystem),
      _useState2 = _slicedToArray(_useState, 2),
      system = _useState2[0],
      setSystem = _useState2[1];

  var prevSystemKey = (0, _react.useRef)(system.key);

  var _useState3 = (0, _react.useState)((0, _utils.mergeDeep)(parentModifications, _modifications)),
      _useState4 = _slicedToArray(_useState3, 2),
      modifications = _useState4[0],
      setModifications = _useState4[1];

  var prevModifications = (0, _react.useRef)(modifications);

  var _useState5 = (0, _react.useState)((0, _utils.getColorMode)(_colorMode, parentColorMode)),
      _useState6 = _slicedToArray(_useState5, 2),
      colorMode = _useState6[0],
      setColorMode = _useState6[1];

  var prevColorMode = (0, _react.useRef)(colorMode);
  var isParentTheme = (0, _react.useRef)(prevSystemKey.current === parentSystem.key && colorMode === parentColorMode && (0, _isEqual.default)(parentModifications, modifications));

  var _useState7 = (0, _react.useState)(isParentTheme.current && Object.keys(parentTheme).length ? parentTheme : (0, _utils.getComputed)(system, (0, _utils.buildTheme)(modifications, "_".concat(system.key)), colorMode)),
      _useState8 = _slicedToArray(_useState7, 2),
      theme = _useState8[0],
      setTheme = _useState8[1];

  (0, _react.useEffect)(function () {
    var newSystem = _system || parentSystem;

    if (prevSystemKey.current !== newSystem.key) {
      setSystem(newSystem);
      prevSystemKey.current = newSystem.key;
      isParentTheme.current = false;
    }
  }, [_system, parentSystem]);
  (0, _react.useEffect)(function () {
    var newModifications = (0, _utils.mergeDeep)(parentModifications, _modifications);

    if (!(0, _isEqual.default)(prevModifications.current, newModifications)) {
      setModifications(newModifications);
      prevModifications.current = newModifications;
      isParentTheme.current = false;
    }
  }, [_modifications, parentModifications]);
  (0, _react.useEffect)(function () {
    var newColorMode = (0, _utils.getColorMode)(_colorMode, parentColorMode);

    if (!(0, _isEqual.default)(newColorMode, prevColorMode.current)) {
      setColorMode(newColorMode);
      prevColorMode.current = newColorMode;
      isParentTheme.current = false;
    }
  }, [_colorMode, parentColorMode]);
  (0, _react.useEffect)(function () {
    if (!isParentTheme.current) {
      setTheme((0, _utils.getComputed)(system, (0, _utils.buildTheme)(modifications, "_".concat(system.key)), colorMode));
    }
  }, [colorMode, system, modifications]);
  return (0, _react2.jsx)(_context.EuiColorModeContext.Provider, {
    value: colorMode
  }, (0, _react2.jsx)(_context.EuiSystemContext.Provider, {
    value: system
  }, (0, _react2.jsx)(_context.EuiModificationsContext.Provider, {
    value: modifications
  }, (0, _react2.jsx)(_context.EuiThemeContext.Provider, {
    value: theme
  }, children))));
};

exports.EuiThemeProvider = EuiThemeProvider;