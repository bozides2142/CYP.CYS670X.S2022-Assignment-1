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

var EuiIconEditorLink = function EuiIconEditorLink(_ref) {
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
    d: "M7.556 5.051a.45.45 0 00.637.637l1.503-1.504c.432-.431 1.278-.382 1.89.23.612.612.662 1.458.23 1.89L9.519 8.6c-.432.432-1.278.383-1.89-.23a.45.45 0 10-.636.637c.914.914 2.33 1.063 3.162.23l2.297-2.297c.833-.833.684-2.248-.23-3.162-.914-.915-2.33-1.063-3.162-.23L7.556 5.051zm.888 5.261a.45.45 0 00-.637 0l-1.503 1.504c-.432.431-1.278.382-1.89-.23-.612-.612-.661-1.458-.23-1.89L6.481 7.4c.432-.432 1.278-.383 1.89.23a.45.45 0 00.636-.637c-.914-.914-2.33-1.063-3.162-.23L3.548 9.06c-.833.833-.685 2.248.23 3.162.914.915 2.33 1.063 3.162.23l1.504-1.503a.45.45 0 000-.637zM7.877 5.76a.39.39 0 00.274-.114l1.503-1.504-1.503 1.504a.39.39 0 01-.274.114zm.912 3.183c-.4.003-.843-.172-1.202-.53.359.358.802.533 1.202.53zM12.18 3.82c-.502-.503-1.155-.766-1.773-.76.618-.006 1.27.257 1.773.76.898.898 1.034 2.275.23 3.078l-2.297 2.297 2.297-2.297c.804-.803.668-2.18-.23-3.078zm-4.062 6.42a.39.39 0 01.284.667L6.898 12.41l1.504-1.503a.39.39 0 00-.284-.667zm-.926-3.965c.618-.006 1.27.257 1.773.76-.502-.503-1.155-.766-1.773-.76zM5.414 12.15a1.762 1.762 0 01-1.042-.522c-.626-.627-.692-1.511-.23-1.974L6.44 7.358 4.142 9.654c-.462.463-.396 1.348.23 1.974.311.311.687.484 1.042.522z"
  }));
};

var icon = EuiIconEditorLink;
exports.icon = icon;