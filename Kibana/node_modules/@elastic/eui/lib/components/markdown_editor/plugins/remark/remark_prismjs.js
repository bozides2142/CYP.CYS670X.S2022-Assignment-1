"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FENCED_CLASS = void 0;

var _refractor = _interopRequireDefault(require("refractor"));

var _unistUtilVisit = _interopRequireDefault(require("unist-util-visit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FENCED_CLASS = 'remark-prismjs--fenced';
exports.FENCED_CLASS = FENCED_CLASS;

var attacher = function attacher() {
  return function (ast) {
    return (0, _unistUtilVisit.default)(ast, 'code', visitor);
  };

  function visitor(node) {
    var _data$hProperties;

    var _node$data = node.data,
        data = _node$data === void 0 ? {} : _node$data,
        language = node.lang;

    if (!language) {
      return;
    }

    node.data = data;
    data.hChildren = _refractor.default.highlight(node.value, language);
    data.hProperties = _objectSpread(_objectSpread({}, data.hProperties), {}, {
      language: language,
      className: ['prismjs'].concat(_toConsumableArray(((_data$hProperties = data.hProperties) === null || _data$hProperties === void 0 ? void 0 : _data$hProperties.className) || []), ["language-".concat(language), FENCED_CLASS])
    });
  }
};

var _default = attacher;
exports.default = _default;