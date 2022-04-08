"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiColorPaletteDisplayFixed = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

var _screen_reader = require("../../accessibility/screen_reader");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiColorPaletteDisplayFixed = function EuiColorPaletteDisplayFixed(_ref) {
  var palette = _ref.palette,
      title = _ref.title,
      rest = _objectWithoutProperties(_ref, ["palette", "title"]);

  var fixedGradient = (0, _utils.getFixedLinearGradient)(palette);
  var paletteStops = fixedGradient.map(function (item, index) {
    return (0, _react2.jsx)("span", {
      style: {
        backgroundColor: item.color,
        width: item.width
      },
      key: "".concat(item.color, "-").concat(index)
    });
  });
  return (0, _react2.jsx)("span", rest, title && (0, _react2.jsx)(_screen_reader.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, title)), (0, _react2.jsx)("span", {
    // aria-hidden="true" is to ensure color blocks are ignored by screen readers,
    // and the only accessible text for options is the EuiScreenReaderOnly {title}
    "aria-hidden": "true",
    className: "euiColorPaletteDisplayFixed__bleedArea"
  }, paletteStops));
};

exports.EuiColorPaletteDisplayFixed = EuiColorPaletteDisplayFixed;
EuiColorPaletteDisplayFixed.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Array of color `strings` or an array of #ColorStop. The stops must be numbers in an ordered range.
     */
  palette: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string.isRequired).isRequired, _propTypes.default.arrayOf(_propTypes.default.shape({
    stop: _propTypes.default.number.isRequired,
    color: _propTypes.default.string.isRequired
  }).isRequired).isRequired]).isRequired
};