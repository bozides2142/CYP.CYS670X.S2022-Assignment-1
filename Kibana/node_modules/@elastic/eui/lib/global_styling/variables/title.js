"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.title = void 0;

var _utils = require("../../services/theme/utils");

var _typography = require("./_typography");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var titlesPartial = {
  xxxs: {
    fontWeight: 'bold',
    letterSpacing: undefined
  },
  xxs: {
    fontWeight: 'bold',
    letterSpacing: undefined
  },
  xs: {
    fontWeight: 'bold',
    letterSpacing: undefined
  },
  s: {
    fontWeight: 'bold',
    letterSpacing: undefined
  },
  m: {
    fontWeight: 'semiBold',
    letterSpacing: '-.02em'
  },
  l: {
    fontWeight: 'medium',
    letterSpacing: '-.025em'
  },
  xl: {
    fontWeight: 'light',
    letterSpacing: '-.04em'
  },
  xxl: {
    fontWeight: 'light',
    letterSpacing: '-.03em'
  }
};

var title = _typography.SCALES.reduce(function (acc, size) {
  acc[size] = {
    fontSize: (0, _utils.computed)(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          fontSize = _ref2[0].fontSize;

      return fontSize;
    }, ["font.size.".concat(size)]),
    lineHeight: (0, _utils.computed)(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 1),
          lineHeight = _ref4[0].lineHeight;

      return lineHeight;
    }, ["font.size.".concat(size)]),
    color: (0, _utils.computed)(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 1),
          color = _ref6[0];

      return color;
    }, ['colors.title']),
    fontWeight: (0, _utils.computed)(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 1),
          fontWeight = _ref8[0];

      return fontWeight;
    }, ["font.weight.".concat(titlesPartial[size].fontWeight)]),
    letterSpacing: titlesPartial[size].letterSpacing
  };
  return acc;
}, {});

exports.title = title;