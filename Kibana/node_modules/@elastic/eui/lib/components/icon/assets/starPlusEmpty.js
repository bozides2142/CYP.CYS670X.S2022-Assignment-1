"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.icon = void 0;

var React = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiIconStarPlusEmpty = function EuiIconStarPlusEmpty(_ref) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, ["title", "titleId"]);

  return (0, _react2.jsx)("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    "aria-labelledby": titleId
  }, props), title ? (0, _react2.jsx)("title", {
    id: titleId
  }, title) : null, (0, _react2.jsx)("path", {
    fillRule: "evenodd",
    d: "M6 2a.86.86 0 00-.792.511l-1.33 2.924-3.128.446c-.71.102-1.001.976-.496 1.487l2.313 2.336-.563 3.268A.877.877 0 002.864 14c.142 0 .289-.036.429-.116L6 12.342l2.707 1.542c.14.08.287.116.43.116a.877.877 0 00.859-1.027l-.563-3.269 2.313-2.336c.505-.511.214-1.385-.496-1.487l-3.128-.446-1.33-2.923A.86.86 0 006 2m8 8h2v1h-2v2h-1v-2h-2v-1h2V8h1v2zM6 3c.073 0 .095.049.104.07l1.267 2.783.162.356.387.055 2.978.425c.017.002.071.01.095.08a.116.116 0 01-.029.126L8.762 9.121l-.259.261.063.362.535 3.112c.007.04 0 .07-.023.098a.127.127 0 01-.091.046.106.106 0 01-.055-.016l-2.578-1.469L6 11.314l-.354.201-2.579 1.469a.103.103 0 01-.054.016.127.127 0 01-.091-.046c-.023-.028-.03-.058-.024-.098l.536-3.112.063-.362-.259-.261-2.202-2.226a.116.116 0 01-.029-.126.108.108 0 01.094-.08l2.98-.425.386-.055.162-.356 1.267-2.786C5.905 3.05 5.927 3 6 3z"
  }));
};

var icon = EuiIconStarPlusEmpty;
exports.icon = icon;