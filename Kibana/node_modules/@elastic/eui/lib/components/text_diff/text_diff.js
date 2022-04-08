"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEuiTextDiff = void 0;

var _react = _interopRequireWildcard(require("react"));

var _textDiff = _interopRequireDefault(require("text-diff"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useEuiTextDiff = function useEuiTextDiff(_ref) {
  var className = _ref.className,
      _ref$insertComponent = _ref.insertComponent,
      insertComponent = _ref$insertComponent === void 0 ? 'ins' : _ref$insertComponent,
      _ref$deleteComponent = _ref.deleteComponent,
      deleteComponent = _ref$deleteComponent === void 0 ? 'del' : _ref$deleteComponent,
      sameComponent = _ref.sameComponent,
      _ref$beforeText = _ref.beforeText,
      beforeText = _ref$beforeText === void 0 ? '' : _ref$beforeText,
      _ref$afterText = _ref.afterText,
      afterText = _ref$afterText === void 0 ? '' : _ref$afterText,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 0.1 : _ref$timeout,
      rest = _objectWithoutProperties(_ref, ["className", "insertComponent", "deleteComponent", "sameComponent", "beforeText", "afterText", "timeout"]);

  var textDiff = (0, _react.useMemo)(function () {
    var diff = new _textDiff.default({
      timeout: timeout
    }); // options may be passed to constructor

    return diff.main(beforeText, afterText);
  }, [beforeText, afterText, timeout]); // produces diff array

  var classes = (0, _classnames.default)('euiTextDiff', className);
  var rendereredHtml = (0, _react.useMemo)(function () {
    var html = [];
    if (textDiff) for (var i = 0; i < textDiff.length; i++) {
      var Element = void 0;
      var el = textDiff[i];
      if (el[0] === 1) Element = insertComponent;else if (el[0] === -1) Element = deleteComponent;else if (sameComponent) Element = sameComponent;
      if (Element) html.push((0, _react2.jsx)(Element, {
        key: i
      }, el[1]));else html.push(el[1]);
    }
    return html;
  }, [textDiff, deleteComponent, insertComponent, sameComponent]); // produces diff array

  return [(0, _react2.jsx)("span", _extends({
    className: classes
  }, rest), rendereredHtml), textDiff];
};

exports.useEuiTextDiff = useEuiTextDiff;