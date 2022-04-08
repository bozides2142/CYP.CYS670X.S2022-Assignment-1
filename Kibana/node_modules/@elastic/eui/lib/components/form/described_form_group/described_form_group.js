"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDescribedFormGroup = exports.PADDING_SIZES = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _title = require("../../title");

var _text = require("../../text");

var _flex = require("../../flex");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var paddingSizeToClassNameMap = {
  xxxs: 'euiDescribedFormGroup__fieldPadding--xxxsmall',
  xxs: 'euiDescribedFormGroup__fieldPadding--xxsmall',
  xs: 'euiDescribedFormGroup__fieldPadding--xsmall',
  s: 'euiDescribedFormGroup__fieldPadding--small',
  m: 'euiDescribedFormGroup__fieldPadding--medium',
  l: 'euiDescribedFormGroup__fieldPadding--large'
};
var PADDING_SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.PADDING_SIZES = PADDING_SIZES;

var EuiDescribedFormGroup = function EuiDescribedFormGroup(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$gutterSize = _ref.gutterSize,
      gutterSize = _ref$gutterSize === void 0 ? 'l' : _ref$gutterSize,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      _ref$titleSize = _ref.titleSize,
      titleSize = _ref$titleSize === void 0 ? 'xs' : _ref$titleSize,
      title = _ref.title,
      description = _ref.description,
      descriptionFlexItemProps = _ref.descriptionFlexItemProps,
      fieldFlexItemProps = _ref.fieldFlexItemProps,
      rest = _objectWithoutProperties(_ref, ["children", "className", "gutterSize", "fullWidth", "titleSize", "title", "description", "descriptionFlexItemProps", "fieldFlexItemProps"]);

  var classes = (0, _classnames.default)('euiDescribedFormGroup', {
    'euiDescribedFormGroup--fullWidth': fullWidth
  }, className);
  var fieldClasses = (0, _classnames.default)('euiDescribedFormGroup__fields', paddingSizeToClassNameMap[titleSize], fieldFlexItemProps && fieldFlexItemProps.className);
  var renderedDescription;

  if (description) {
    renderedDescription = (0, _react2.jsx)(_text.EuiText, {
      size: "s",
      color: "subdued",
      className: "euiDescribedFormGroup__description"
    }, description);
  }

  return (0, _react2.jsx)("div", _extends({
    role: "group",
    className: classes
  }, rest), (0, _react2.jsx)(_flex.EuiFlexGroup, {
    gutterSize: gutterSize
  }, (0, _react2.jsx)(_flex.EuiFlexItem, descriptionFlexItemProps, (0, _react2.jsx)(_title.EuiTitle, {
    size: titleSize,
    className: "euiDescribedFormGroup__title"
  }, title), renderedDescription), (0, _react2.jsx)(_flex.EuiFlexItem, _extends({}, fieldFlexItemProps, {
    className: fieldClasses
  }), children)));
};

exports.EuiDescribedFormGroup = EuiDescribedFormGroup;
EuiDescribedFormGroup.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * One or more `EuiFormRow`s
       */
  children: _propTypes.default.node,

  /**
       * Passed to `EuiFlexGroup`
       */
  gutterSize: _propTypes.default.oneOf(["none", "xs", "s", "m", "l", "xl"]),
  fullWidth: _propTypes.default.bool,

  /**
       * For better accessibility, it's recommended the use of HTML headings
       */
  title: _propTypes.default.element.isRequired,
  titleSize: _propTypes.default.oneOf(["xxxs", "xxs", "xs", "s", "m", "l"]),

  /**
       * Added as a child of `EuiText`
       */
  description: _propTypes.default.node,

  /**
       * For customizing the field container. Extended from `EuiFlexItem`
       */
  descriptionFlexItemProps: _propTypes.default.any,
  fieldFlexItemProps: _propTypes.default.any
};