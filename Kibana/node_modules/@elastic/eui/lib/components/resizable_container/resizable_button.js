"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.euiResizableButtonWithControls = euiResizableButtonWithControls;
exports.EuiResizableButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../i18n");

var _services = require("../../services");

var _context = require("./context");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiResizableButton = function EuiResizableButton(_ref) {
  var isHorizontal = _ref.isHorizontal,
      className = _ref.className,
      id = _ref.id,
      registration = _ref.registration,
      disabled = _ref.disabled,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      rest = _objectWithoutProperties(_ref, ["isHorizontal", "className", "id", "registration", "disabled", "onFocus", "onBlur"]);

  var resizerId = (0, _services.useGeneratedHtmlId)({
    prefix: 'resizable-button',
    conditionalId: id
  });

  var _useEuiResizableConta = (0, _context.useEuiResizableContainerContext)(),
      _useEuiResizableConta2 = _useEuiResizableConta.registry;

  _useEuiResizableConta2 = _useEuiResizableConta2 === void 0 ? {
    resizers: {}
  } : _useEuiResizableConta2;
  var resizers = _useEuiResizableConta2.resizers;
  var isDisabled = (0, _react.useMemo)(function () {
    return disabled || resizers[resizerId] && resizers[resizerId].isDisabled;
  }, [resizers, resizerId, disabled]);
  var classes = (0, _classnames.default)('euiResizableButton', {
    'euiResizableButton--vertical': !isHorizontal,
    'euiResizableButton--horizontal': isHorizontal,
    'euiResizableButton--disabled': isDisabled
  }, className);
  var previousRef = (0, _react.useRef)();
  var onRef = (0, _react.useCallback)(function (ref) {
    if (!registration) return;

    if (ref) {
      previousRef.current = ref;
      registration.register({
        id: resizerId,
        ref: ref,
        isFocused: false,
        isDisabled: disabled || false
      });
    } else {
      if (previousRef.current != null) {
        registration.deregister(resizerId);
        previousRef.current = undefined;
      }
    }
  }, [registration, resizerId, disabled]);

  var setFocus = function setFocus(e) {
    return e.currentTarget.focus();
  };

  var handleFocus = function handleFocus() {
    onFocus && onFocus(resizerId);
  };

  return (0, _react2.jsx)(_i18n.EuiI18n, {
    tokens: ['euiResizableButton.horizontalResizerAriaLabel', 'euiResizableButton.verticalResizerAriaLabel'],
    defaults: ['Press left or right to adjust panels size', 'Press up or down to adjust panels size']
  }, function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        horizontalResizerAriaLabel = _ref3[0],
        verticalResizerAriaLabel = _ref3[1];

    return (0, _react2.jsx)("button", _extends({
      id: resizerId,
      ref: onRef,
      "aria-label": isHorizontal ? horizontalResizerAriaLabel : verticalResizerAriaLabel,
      className: classes,
      "data-test-subj": "euiResizableButton",
      type: "button",
      onClick: setFocus,
      onFocus: handleFocus,
      onBlur: onBlur,
      disabled: isDisabled
    }, rest));
  });
};

exports.EuiResizableButton = EuiResizableButton;
EuiResizableButton.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};

function euiResizableButtonWithControls(controls) {
  return function (props) {
    return (0, _react2.jsx)(EuiResizableButton, _extends({}, controls, props));
  };
}