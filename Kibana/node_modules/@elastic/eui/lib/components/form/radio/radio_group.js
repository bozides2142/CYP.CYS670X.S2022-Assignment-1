"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRadioGroup = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_fieldset = require("../form_fieldset");

var _radio = require("./radio");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiRadioGroup = function EuiRadioGroup(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      idSelected = _ref.idSelected,
      onChange = _ref.onChange,
      name = _ref.name,
      className = _ref.className,
      disabled = _ref.disabled,
      compressed = _ref.compressed,
      legend = _ref.legend,
      rest = _objectWithoutProperties(_ref, ["options", "idSelected", "onChange", "name", "className", "disabled", "compressed", "legend"]);

  var radios = options.map(function (option, index) {
    var isOptionDisabled = option.disabled,
        optionClass = option.className,
        id = option.id,
        label = option.label,
        optionRest = _objectWithoutProperties(option, ["disabled", "className", "id", "label"]);

    return (0, _react2.jsx)(_radio.EuiRadio, _extends({
      className: (0, _classnames.default)('euiRadioGroup__item', optionClass),
      key: index,
      name: name,
      checked: id === idSelected,
      disabled: disabled || isOptionDisabled,
      onChange: onChange.bind(null, id, option.value),
      compressed: compressed,
      id: id,
      label: label
    }, optionRest));
  });

  if (!!legend) {
    // Be sure to pass down the compressed option to the legend
    legend.compressed = compressed;
    return (0, _react2.jsx)(_form_fieldset.EuiFormFieldset, _extends({
      className: className,
      legend: legend
    }, rest), radios);
  }

  return (0, _react2.jsx)("div", _extends({
    className: className
  }, rest), radios);
};

exports.EuiRadioGroup = EuiRadioGroup;
EuiRadioGroup.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  disabled: _propTypes.default.bool,

  /**
     * Tightens up the spacing between radio rows and sends down the
     * compressed prop to the radio itself
     */
  compressed: _propTypes.default.bool,
  name: _propTypes.default.string,
  options: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }).isRequired).isRequired,
  idSelected: _propTypes.default.string,
  onChange: _propTypes.default.func.isRequired,

  /**
     * If the individual labels for each radio do not provide a sufficient description, add a legend.
     * Wraps the group in a `EuiFormFieldset` which adds an `EuiLegend` for titling the whole group.
     * Accepts an `EuiFormLegendProps` shape.
     */
  legend: _propTypes.default.shape({
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,

    /**
         * ReactNode to render as this component's content
         */
    children: _propTypes.default.node.isRequired,

    /**
         * For a hidden legend that is still visible to the screen reader, set to 'hidden'
         */
    display: _propTypes.default.oneOf(["hidden", "visible"]),
    compressed: _propTypes.default.bool
  })
};