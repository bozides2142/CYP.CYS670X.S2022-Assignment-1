"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.euiSelectableTemplateSitewideRenderOptions = exports.euiSelectableTemplateSitewideFormatOptions = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../../../components/icon");

var _avatar = require("../../../components/avatar/avatar");

var _highlight = require("../../../components/highlight");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var euiSelectableTemplateSitewideFormatOptions = function euiSelectableTemplateSitewideFormatOptions(options) {
  return options.map(function (item) {
    var title = item.label;

    if (item.meta && item.meta.length) {
      title += " \u2022".concat(renderOptionMeta(item.meta, '', true));
    }

    return _objectSpread(_objectSpread({
      key: item.label,
      title: title
    }, item), {}, {
      className: (0, _classnames.default)('euiSelectableTemplateSitewide__listItem', item.className),
      prepend: item.icon ? (0, _react2.jsx)(_icon.EuiIcon, _extends({
        color: "subdued",
        size: "l"
      }, item.icon)) : item.prepend,
      append: item.avatar ? (0, _react2.jsx)(_avatar.EuiAvatar, _extends({
        type: "space",
        size: "s"
      }, item.avatar)) : item.append
    });
  });
};

exports.euiSelectableTemplateSitewideFormatOptions = euiSelectableTemplateSitewideFormatOptions;

var euiSelectableTemplateSitewideRenderOptions = function euiSelectableTemplateSitewideRenderOptions(option, searchValue) {
  return (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_highlight.EuiHighlight, {
    className: "euiSelectableTemplateSitewide__listItemTitle",
    search: searchValue
  }, option.label), renderOptionMeta(option.meta, searchValue));
};

exports.euiSelectableTemplateSitewideRenderOptions = euiSelectableTemplateSitewideRenderOptions;

function renderOptionMeta(meta) {
  var searchValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var stringsOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!meta || meta.length < 1) return;
  var metas = meta.map(function (meta) {
    var text = meta.text,
        highlightSearchString = meta.highlightSearchString,
        className = meta.className,
        rest = _objectWithoutProperties(meta, ["text", "highlightSearchString", "className"]);

    if (stringsOnly) {
      return " ".concat(text);
    } // Start with the base and custom classes


    var metaClasses = (0, _classnames.default)('euiSelectableTemplateSitewide__optionMeta', className); // If they provided a type, create the class and append

    if (meta.type) {
      metaClasses = (0, _classnames.default)(["euiSelectableTemplateSitewide__optionMeta--".concat(meta.type)], metaClasses);
    }

    return (0, _react2.jsx)(_highlight.EuiHighlight, _extends({
      search: highlightSearchString ? searchValue : '',
      className: metaClasses,
      key: text
    }, rest), text);
  });
  return stringsOnly ? metas : (0, _react2.jsx)("span", {
    className: "euiSelectableTemplateSitewide__optionMetasList"
  }, metas);
}