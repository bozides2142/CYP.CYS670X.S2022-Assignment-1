"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiStepsHorizontal = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _step_horizontal = require("./step_horizontal");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiStepsHorizontal = function EuiStepsHorizontal(_ref) {
  var className = _ref.className,
      steps = _ref.steps,
      rest = _objectWithoutProperties(_ref, ["className", "steps"]);

  var classes = (0, _classnames.default)('euiStepsHorizontal', className);
  return (0, _react2.jsx)("ol", _extends({
    className: classes
  }, rest), steps.map(function (stepProps, index) {
    var isCurrent = stepProps.isSelected || stepProps.status === 'current' ? {
      'aria-current': 'step'
    } : {};
    return (0, _react2.jsx)("li", _extends({
      key: index,
      className: "euiStepHorizontal__item"
    }, isCurrent), (0, _react2.jsx)(_step_horizontal.EuiStepHorizontal, _extends({
      step: index + 1
    }, stepProps)));
  }));
};

exports.EuiStepsHorizontal = EuiStepsHorizontal;
EuiStepsHorizontal.propTypes = {
  /**
     * An array of `EuiStepHorizontal` objects excluding the `step` prop
     */
  steps: _propTypes.default.arrayOf(_propTypes.default.any.isRequired).isRequired,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};