"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRadio = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiRadio = function EuiRadio(_ref) {
  var className = _ref.className,
      id = _ref.id,
      name = _ref.name,
      checked = _ref.checked,
      label = _ref.label,
      value = _ref.value,
      onChange = _ref.onChange,
      disabled = _ref.disabled,
      compressed = _ref.compressed,
      autoFocus = _ref.autoFocus,
      labelProps = _ref.labelProps,
      rest = _objectWithoutProperties(_ref, ["className", "id", "name", "checked", "label", "value", "onChange", "disabled", "compressed", "autoFocus", "labelProps"]);

  var classes = (0, _classnames.default)('euiRadio', {
    'euiRadio--noLabel': !label,
    'euiRadio--compressed': compressed
  }, className);
  var labelClasses = (0, _classnames.default)('euiRadio__label', labelProps === null || labelProps === void 0 ? void 0 : labelProps.className);
  var optionalLabel;

  if (label) {
    optionalLabel = (0, _react2.jsx)("label", _extends({}, labelProps, {
      className: labelClasses,
      htmlFor: id
    }), label);
  }

  return (0, _react2.jsx)("div", _extends({
    className: classes
  }, rest), (0, _react2.jsx)("input", {
    className: "euiRadio__input",
    type: "radio",
    id: id,
    name: name,
    value: value,
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    autoFocus: autoFocus
  }), (0, _react2.jsx)("div", {
    className: "euiRadio__circle"
  }), optionalLabel);
};

exports.EuiRadio = EuiRadio;
EuiRadio.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  autoFocus: _propTypes.default.bool,

  /**
     * When `true` creates a shorter height radio row
     */

  /**
     * When `true` creates a shorter height radio row
     */

  /**
     * When `true` creates a shorter height radio row
     */
  compressed: _propTypes.default.bool,
  name: _propTypes.default.string,
  value: _propTypes.default.string,
  checked: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  onChange: _propTypes.default.any.isRequired,

  /**
     * Object of props passed to the <label/>
     */

  /**
     * Object of props passed to the <label/>
     */

  /**
     * Object of props passed to the <label/>
     */
  labelProps: _propTypes.default.shape({
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  }),
  label: _propTypes.default.node,
  id: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.string.isRequired])
};