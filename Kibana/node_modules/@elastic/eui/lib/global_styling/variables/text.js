"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fontSize = void 0;

var _theme = require("../../services/theme");

var _typography = require("./_typography");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fontSize = _typography.SCALES.reduce(function (acc, elem) {
  acc[elem] = {
    fontSize: (0, _theme.computed)(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          scale = _ref2[0];

      return "".concat(scale, "rem");
    }, ["font.scale.".concat(elem)]),
    lineHeight: (0, _theme.computed)(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          base = _ref4[0],
          font = _ref4[1];

      return (0, _theme.lineHeightFromBaseline)(base, font, font.scale[elem]);
    }, ['base', 'font'])
  };
  return acc;
}, {});

exports.fontSize = fontSize;