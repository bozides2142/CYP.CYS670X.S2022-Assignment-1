"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiButtonGroupButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _button = require("../button");

var _inner_text = require("../../inner_text");

var _services = require("../../../services");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EuiButtonGroupButton = function EuiButtonGroupButton(_ref) {
  var className = _ref.className,
      id = _ref.id,
      isDisabled = _ref.isDisabled,
      isIconOnly = _ref.isIconOnly,
      _ref$isSelected = _ref.isSelected,
      isSelected = _ref$isSelected === void 0 ? false : _ref$isSelected,
      label = _ref.label,
      name = _ref.name,
      _onChange = _ref.onChange,
      size = _ref.size,
      value = _ref.value,
      _ref$element = _ref.element,
      element = _ref$element === void 0 ? 'button' : _ref$element,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "id", "isDisabled", "isIconOnly", "isSelected", "label", "name", "onChange", "size", "value", "element", "type"]);
  // Force element to be a button if disabled
  var el = isDisabled ? 'button' : element;
  var newId = (0, _services.useGeneratedHtmlId)();
  var elementProps = {};
  var singleInput;

  if (el === 'label') {
    elementProps = _objectSpread(_objectSpread({}, elementProps), {}, {
      htmlFor: newId
    });
    singleInput = (0, _react2.jsx)("input", {
      id: newId,
      className: "euiScreenReaderOnly",
      name: name,
      checked: isSelected,
      disabled: isDisabled,
      value: value,
      type: "radio",
      onChange: function onChange() {
        return _onChange(id, value);
      },
      "data-test-subj": id
    });
  } else {
    elementProps = _objectSpread(_objectSpread({}, elementProps), {}, {
      id: newId,
      'data-test-subj': id,
      isSelected: isSelected,
      type: type,
      onClick: function onClick() {
        return _onChange(id);
      }
    });
  }

  var buttonClasses = (0, _classnames.default)({
    'euiButtonGroupButton-isSelected': isSelected,
    'euiButtonGroupButton-isIconOnly': isIconOnly
  }, className);
  /**
   * Because the selected buttons also increase their text weight to 'bold',
   * we don't want the whole button size to shift when selected, so we determine
   * the base width of the button via the `euiTextShift()` method in SASS.
   */

  var _useInnerText = (0, _inner_text.useInnerText)(),
      _useInnerText2 = (0, _slicedToArray2.default)(_useInnerText, 2),
      buttonTextRef = _useInnerText2[0],
      innerText = _useInnerText2[1];

  return (0, _react2.jsx)(_button.EuiButtonDisplay, (0, _extends2.default)({
    baseClassName: "euiButtonGroupButton",
    className: buttonClasses,
    element: el,
    fill: size !== 'compressed' && isSelected,
    isDisabled: isDisabled,
    size: size === 'compressed' ? 's' : size,
    textProps: {
      className: isIconOnly ? 'euiScreenReaderOnly' : 'euiButtonGroupButton__textShift',
      ref: buttonTextRef,
      'data-text': innerText
    },
    title: innerText
  }, elementProps, rest), singleInput, label);
};

exports.EuiButtonGroupButton = EuiButtonGroupButton;