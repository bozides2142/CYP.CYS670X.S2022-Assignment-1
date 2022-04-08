"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDisabledContrastColor = exports.makeHighContrastColor = void 0;

var _chromaJs = _interopRequireDefault(require("chroma-js"));

var _manipulation = require("./manipulation");

var _utils = require("../theme/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Creates a new color that meets or exceeds WCAG level AA
 * @param foreground - Color to manipulate
 * @param ratio - Amount to change in absolute terms. 0-10.
 * *
 * @param themeOrBackground - Color to use as the contrast basis or just pass EuiTheme
 */
var makeHighContrastColor = function makeHighContrastColor(_foreground) {
  var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4.55;
  return function (themeOrBackground) {
    var _getOn;

    var foreground = _typeof(themeOrBackground) === 'object' ? (_getOn = (0, _utils.getOn)(themeOrBackground, _foreground)) !== null && _getOn !== void 0 ? _getOn : _foreground : _foreground;
    var background = _typeof(themeOrBackground) === 'object' ? themeOrBackground.colors.body : themeOrBackground;

    if ((0, _chromaJs.default)(foreground).alpha() < 1 || (0, _chromaJs.default)(background).alpha() < 1) {
      console.warn("Contrast cannot be accurately calculated when colors have alpha channel opacity. Make sure the provided foreground and background colors have no transparency:\n\nForeground: ".concat(foreground, "\nBackground: ").concat(background));
    }

    var contrast = _chromaJs.default.contrast(foreground, background); // Determine the lightness factor of the background color first to
    // determine whether to shade or tint the foreground.


    var brightness = (0, _manipulation.lightness)(background);
    var highContrastTextColor = foreground;

    while (contrast < ratio) {
      if (brightness > 50) {
        highContrastTextColor = (0, _manipulation.shade)(highContrastTextColor, 0.05);
      } else {
        highContrastTextColor = (0, _manipulation.tint)(highContrastTextColor, 0.05);
      }

      contrast = _chromaJs.default.contrast(highContrastTextColor, background);
      var lightness = (0, _manipulation.lightness)(highContrastTextColor);

      if (lightness < 5) {
        console.warn('High enough contrast could not be determined. Most likely your background color does not adjust for light mode.');
        return highContrastTextColor;
      }

      if (lightness > 95) {
        console.warn('High enough contrast could not be determined. Most likely your background color does not adjust for dark mode.');
        return highContrastTextColor;
      }
    }

    return (0, _chromaJs.default)(highContrastTextColor).hex();
  };
};
/**
 * Creates a new color with increased contrast
 * Disabled content only needs a contrast of at least 2 because there is no interaction available
 * @param foreground - Color to manipulate
 * @param ratio - Amount to change in absolute terms. 0-10.
 * *
 * @param themeOrBackground - Color to use as the contrast basis
 */


exports.makeHighContrastColor = makeHighContrastColor;

var makeDisabledContrastColor = function makeDisabledContrastColor(color) {
  var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return function (themeOrBackground) {
    return makeHighContrastColor(color, ratio)(themeOrBackground);
  };
};

exports.makeDisabledContrastColor = makeDisabledContrastColor;