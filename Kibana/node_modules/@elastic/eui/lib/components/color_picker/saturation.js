"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSaturation = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _predicate = require("../../services/predicate");

var _i18n = require("../i18n");

var _utils = require("./utils");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiSaturation = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var className = _ref.className,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? [1, 0, 0] : _ref$color,
      _ref$dataTestSubj = _ref['data-test-subj'],
      dataTestSubj = _ref$dataTestSubj === void 0 ? 'euiSaturation' : _ref$dataTestSubj,
      hex = _ref.hex,
      id = _ref.id,
      onChange = _ref.onChange,
      rest = _objectWithoutProperties(_ref, ["className", "color", "data-test-subj", "hex", "id", "onChange"]);

  var _useEuiI18n = (0, _i18n.useEuiI18n)(['euiSaturation.ariaLabel', 'euiSaturation.screenReaderInstructions'], ['HSV color mode saturation and value 2-axis slider', "Arrow keys to navigate the square color gradient. Coordinates will be used to calculate HSV color mode 'saturation' and 'value' numbers, in the range of 0 to 1. Left and right to change the saturation. Up and down change the value."]),
      _useEuiI18n2 = _slicedToArray(_useEuiI18n, 2),
      roleDescString = _useEuiI18n2[0],
      instructionsString = _useEuiI18n2[1];

  var _useState = (0, _react.useState)({
    left: 0,
    top: 0
  }),
      _useState2 = _slicedToArray(_useState, 2),
      indicator = _useState2[0],
      setIndicator = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      lastColor = _useState4[0],
      setLastColor = _useState4[1];

  var boxRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    // Mimics `componentDidMount` and `componentDidUpdate`
    var _color = _slicedToArray(color, 3),
        s = _color[1],
        v = _color[2];

    if (!(0, _predicate.isNil)(boxRef.current) && lastColor.join() !== color.join()) {
      var _boxRef$current$getBo = boxRef.current.getBoundingClientRect(),
          height = _boxRef$current$getBo.height,
          width = _boxRef$current$getBo.width;

      setIndicator({
        left: s * width,
        top: (1 - v) * height
      });
    }
  }, [color, lastColor]);

  var calculateColor = function calculateColor(_ref2) {
    var top = _ref2.top,
        height = _ref2.height,
        left = _ref2.left,
        width = _ref2.width;

    var _color2 = _slicedToArray(color, 1),
        h = _color2[0];

    var s = left / width;
    var v = 1 - top / height;
    return [h, s, v];
  };

  var handleUpdate = function handleUpdate(box) {
    var left = box.left,
        top = box.top;
    setIndicator({
      left: left,
      top: top
    });
    var newColor = calculateColor(box);
    setLastColor(newColor);
    onChange(newColor);
  };

  var handleChange = function handleChange(location) {
    if ((0, _predicate.isNil)(boxRef === null || boxRef === void 0 ? void 0 : boxRef.current)) return;
    var box = (0, _utils.getEventPosition)(location, boxRef.current);
    handleUpdate(box);
  };

  var _useMouseMove = (0, _services.useMouseMove)(handleChange, boxRef.current),
      _useMouseMove2 = _slicedToArray(_useMouseMove, 2),
      handleMouseDown = _useMouseMove2[0],
      handleInteraction = _useMouseMove2[1];

  var handleKeyDown = function handleKeyDown(event) {
    if ((0, _predicate.isNil)(boxRef === null || boxRef === void 0 ? void 0 : boxRef.current)) return;

    var _boxRef$current$getBo2 = boxRef.current.getBoundingClientRect(),
        height = _boxRef$current$getBo2.height,
        width = _boxRef$current$getBo2.width;

    var left = indicator.left,
        top = indicator.top;
    var heightScale = height / 100;
    var widthScale = width / 100;
    var newLeft = left;
    var newTop = top;

    switch (event.key) {
      case _services.keys.ARROW_DOWN:
        event.preventDefault();
        newTop = top < height ? top + heightScale : height;
        break;

      case _services.keys.ARROW_LEFT:
        event.preventDefault();
        newLeft = left > 0 ? left - widthScale : 0;
        break;

      case _services.keys.ARROW_UP:
        event.preventDefault();
        newTop = top > 0 ? top - heightScale : 0;
        break;

      case _services.keys.ARROW_RIGHT:
        event.preventDefault();
        newLeft = left < width ? left + widthScale : width;
        break;

      default:
        return;
    }

    var newPosition = {
      left: newLeft,
      top: newTop
    };
    setIndicator(newPosition);
    var newColor = calculateColor(_objectSpread({
      width: width,
      height: height
    }, newPosition));
    onChange(newColor);
  };

  var classes = (0, _classnames.default)('euiSaturation', className);
  var instructionsId = "".concat(id, "-instructions");
  return (0, _react2.jsx)("div", _extends({
    onMouseDown: handleMouseDown,
    onTouchStart: handleInteraction,
    onTouchMove: handleInteraction,
    onKeyDown: handleKeyDown,
    ref: ref,
    className: classes,
    "data-test-subj": dataTestSubj,
    style: {
      background: "hsl(".concat(color[0], ", 100%, 50%)")
    },
    tabIndex: -1
  }, rest), (0, _react2.jsx)("div", {
    className: "euiSaturation__lightness",
    ref: boxRef
  }, (0, _react2.jsx)("div", {
    className: "euiSaturation__saturation"
  })), (0, _react2.jsx)("button", {
    id: "".concat(id, "-saturationIndicator"),
    className: "euiSaturation__indicator",
    style: _objectSpread({}, indicator),
    "aria-roledescription": roleDescString,
    "aria-label": hex,
    "aria-describedby": instructionsId
  }), (0, _react2.jsx)("span", {
    hidden: true,
    "aria-live": "assertive"
  }, hex), (0, _react2.jsx)("span", {
    hidden: true,
    id: instructionsId
  }, instructionsString));
});
exports.EuiSaturation = EuiSaturation;
EuiSaturation.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  color: _propTypes.default.any,
  onChange: _propTypes.default.func.isRequired,
  hex: _propTypes.default.string
};
EuiSaturation.displayName = 'EuiSaturation';