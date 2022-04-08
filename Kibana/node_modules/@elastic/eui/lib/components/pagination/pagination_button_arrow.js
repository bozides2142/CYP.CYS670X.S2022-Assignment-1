"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPaginationButtonArrow = exports.TYPES = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button_icon = require("../button/button_icon");

var _common = require("../common");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var typeToIconTypeMap = {
  first: 'arrowStart',
  previous: 'arrowLeft',
  next: 'arrowRight',
  last: 'arrowEnd'
};
var TYPES = (0, _common.keysOf)(typeToIconTypeMap);
exports.TYPES = TYPES;

var EuiPaginationButtonArrow = function EuiPaginationButtonArrow(_ref) {
  var className = _ref.className,
      type = _ref.type,
      disabled = _ref.disabled,
      ariaControls = _ref.ariaControls,
      onClick = _ref.onClick;
  var labels = {
    first: (0, _i18n.useEuiI18n)('euiPaginationButtonArrow.firstPage', 'First page'),
    previous: (0, _i18n.useEuiI18n)('euiPaginationButtonArrow.previousPage', 'Previous page'),
    next: (0, _i18n.useEuiI18n)('euiPaginationButtonArrow.nextPage', 'Next page'),
    last: (0, _i18n.useEuiI18n)('euiPaginationButtonArrow.lastPage', 'Last page')
  };
  var buttonProps = {};

  if (ariaControls && !disabled) {
    buttonProps.href = "#".concat(ariaControls);
    buttonProps['aria-controls'] = ariaControls;
  }

  return (0, _react2.jsx)(_button_icon.EuiButtonIcon, _extends({
    className: (0, _classnames.default)('euiPaginationArrowButton', className),
    color: "text",
    "aria-label": labels[type],
    title: disabled ? undefined : labels[type],
    isDisabled: disabled,
    onClick: onClick,
    "data-test-subj": "pagination-button-".concat(type),
    iconType: typeToIconTypeMap[type]
  }, buttonProps));
};

exports.EuiPaginationButtonArrow = EuiPaginationButtonArrow;
EuiPaginationButtonArrow.propTypes = {
  type: _propTypes.default.any.isRequired,
  disabled: _propTypes.default.bool,
  ariaControls: _propTypes.default.string
};