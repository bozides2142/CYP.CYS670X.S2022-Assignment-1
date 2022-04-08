"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTourStepIndicator = exports.STATUS = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _icon = require("../icon");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var statusToClassNameMap = {
  complete: 'euiTourStepIndicator--complete',
  incomplete: 'euiTourStepIndicator--incomplete',
  active: 'euiTourStepIndicator--active'
};
var STATUS = (0, _common.keysOf)(statusToClassNameMap);
exports.STATUS = STATUS;

var EuiTourStepIndicator = function EuiTourStepIndicator(_ref) {
  var className = _ref.className,
      number = _ref.number,
      status = _ref.status,
      rest = _objectWithoutProperties(_ref, ["className", "number", "status"]);

  var classes = (0, _classnames.default)('euiTourStepIndicator', status ? statusToClassNameMap[status] : undefined, className);
  var indicatorIcon;

  if (status === 'active') {
    indicatorIcon = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiTourStepIndicator.isActive",
      default: "active"
    }, function (isActive) {
      return (0, _react2.jsx)(_icon.EuiIcon, {
        type: "dot",
        className: "euiStepNumber__icon",
        "aria-label": isActive,
        color: "success",
        "aria-current": "step"
      });
    });
  } else if (status === 'complete') {
    indicatorIcon = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiTourStepIndicator.isComplete",
      default: "complete"
    }, function (isComplete) {
      return (0, _react2.jsx)(_icon.EuiIcon, {
        type: "dot",
        className: "euiStepNumber__icon",
        "aria-label": isComplete,
        color: "subdued"
      });
    });
  } else if (status === 'incomplete') {
    indicatorIcon = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiTourStepIndicator.isIncomplete",
      default: "incomplete"
    }, function (isIncomplete) {
      return (0, _react2.jsx)(_icon.EuiIcon, {
        type: "dot",
        className: "euiStepNumber__icon",
        "aria-label": isIncomplete,
        color: "subdued"
      });
    });
  }

  return (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiTourStepIndicator.ariaLabel",
    default: "Step {number} {status}",
    values: {
      status: status,
      number: number
    }
  }, function (ariaLabel) {
    return (0, _react2.jsx)("li", _extends({
      className: classes,
      "aria-label": ariaLabel
    }, rest), indicatorIcon);
  });
};

exports.EuiTourStepIndicator = EuiTourStepIndicator;
EuiTourStepIndicator.propTypes = {
  number: _propTypes.default.number.isRequired,
  status: _propTypes.default.oneOf(["complete", "incomplete", "active"]).isRequired,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};