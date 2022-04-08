"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPaginationButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = require("../button");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiPaginationButton = function EuiPaginationButton(_ref) {
  var className = _ref.className,
      isActive = _ref.isActive,
      isPlaceholder = _ref.isPlaceholder,
      pageIndex = _ref.pageIndex,
      totalPages = _ref.totalPages,
      rest = _objectWithoutProperties(_ref, ["className", "isActive", "isPlaceholder", "pageIndex", "totalPages"]);

  var classes = (0, _classnames.default)('euiPaginationButton', className, {
    'euiPaginationButton-isActive': isActive,
    'euiPaginationButton-isPlaceholder': isPlaceholder
  });

  var props = _objectSpread(_objectSpread(_objectSpread({
    className: classes,
    size: 's',
    color: 'text',
    'data-test-subj': "pagination-button-".concat(pageIndex),
    isDisabled: isPlaceholder || isActive
  }, isActive && {
    'aria-current': true
  }), rest['aria-controls'] && {
    href: "#".concat(rest['aria-controls'])
  }), rest);

  var pageNumber = pageIndex + 1;
  return (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiPaginationButton.longPageString",
    default: "Page {page} of {totalPages}",
    values: {
      page: pageNumber,
      totalPages: totalPages
    }
  }, function (longPageString) {
    return (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiPaginationButton.shortPageString",
      default: "Page {page}",
      values: {
        page: pageNumber
      }
    }, function (shortPageString) {
      return (0, _react2.jsx)(_button.EuiButtonEmpty, _extends({
        "aria-label": totalPages ? longPageString : shortPageString
      }, props), pageNumber);
    });
  });
};

exports.EuiPaginationButton = EuiPaginationButton;
EuiPaginationButton.propTypes = {
  href: _propTypes.default.string,
  onClick: _propTypes.default.func,
  isActive: _propTypes.default.bool,

  /**
     * For ellipsis or other non-clickable buttons.
     */

  /**
     * For ellipsis or other non-clickable buttons.
     */
  isPlaceholder: _propTypes.default.bool,
  pageIndex: _propTypes.default.number.isRequired,
  totalPages: _propTypes.default.number
};