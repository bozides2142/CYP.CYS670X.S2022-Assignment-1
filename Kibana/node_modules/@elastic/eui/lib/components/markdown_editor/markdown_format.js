"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiMarkdownFormat = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _unified = _interopRequireDefault(require("unified"));

var _classnames = _interopRequireDefault(require("classnames"));

var _text = require("../text/text");

var _markdown_default_plugins = require("./plugins/markdown_default_plugins");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiMarkdownFormat = function EuiMarkdownFormat(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$parsingPluginLis = _ref.parsingPluginList,
      parsingPluginList = _ref$parsingPluginLis === void 0 ? _markdown_default_plugins.defaultParsingPlugins : _ref$parsingPluginLis,
      _ref$processingPlugin = _ref.processingPluginList,
      processingPluginList = _ref$processingPlugin === void 0 ? _markdown_default_plugins.defaultProcessingPlugins : _ref$processingPlugin,
      _ref$textSize = _ref.textSize,
      textSize = _ref$textSize === void 0 ? 'm' : _ref$textSize,
      rest = _objectWithoutProperties(_ref, ["children", "className", "parsingPluginList", "processingPluginList", "textSize"]);

  var processor = (0, _react.useMemo)(function () {
    return (0, _unified.default)().use(parsingPluginList).use(processingPluginList);
  }, [parsingPluginList, processingPluginList]);
  var result = (0, _react.useMemo)(function () {
    try {
      var _ref2;

      var processed = processor.processSync(children); // `.result` is intentionally `unknown` (https://github.com/vfile/vfile/pull/53)
      // cast to something expected.

      return (_ref2 = processed.result) !== null && _ref2 !== void 0 ? _ref2 : processed.contents;
    } catch (e) {
      return children;
    }
  }, [children, processor]);
  var classes = (0, _classnames.default)('euiMarkdownFormat', className);
  return (0, _react2.jsx)(_text.EuiText, _extends({
    size: textSize,
    className: classes
  }, rest), result);
};

exports.EuiMarkdownFormat = EuiMarkdownFormat;
EuiMarkdownFormat.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  children: _propTypes.default.string.isRequired,

  /** array of unified plugins to parse content into an AST */
  parsingPluginList: _propTypes.default.any,

  /** array of unified plugins to convert the AST into a ReactNode */
  processingPluginList: _propTypes.default.any,

  /**
       * Determines the text size. Choose `relative` to control the `font-size` based on the value of a parent container.
       */
  textSize: _propTypes.default.oneOf(["xs", "s", "m", "relative"])
};