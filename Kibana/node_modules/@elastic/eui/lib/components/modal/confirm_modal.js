"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiConfirmModal = exports.CANCEL_BUTTON = exports.CONFIRM_BUTTON = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _modal = require("./modal");

var _modal_footer = require("./modal_footer");

var _modal_header = require("./modal_header");

var _modal_header_title = require("./modal_header_title");

var _modal_body = require("./modal_body");

var _button = require("../button");

var _text = require("../text");

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

var CONFIRM_BUTTON = 'confirm';
exports.CONFIRM_BUTTON = CONFIRM_BUTTON;
var CANCEL_BUTTON = 'cancel';
exports.CANCEL_BUTTON = CANCEL_BUTTON;

var EuiConfirmModal = function EuiConfirmModal(_ref) {
  var children = _ref.children,
      title = _ref.title,
      onCancel = _ref.onCancel,
      onConfirm = _ref.onConfirm,
      cancelButtonText = _ref.cancelButtonText,
      confirmButtonText = _ref.confirmButtonText,
      confirmButtonDisabled = _ref.confirmButtonDisabled,
      className = _ref.className,
      _ref$buttonColor = _ref.buttonColor,
      buttonColor = _ref$buttonColor === void 0 ? 'primary' : _ref$buttonColor,
      defaultFocusedButton = _ref.defaultFocusedButton,
      isLoading = _ref.isLoading,
      rest = _objectWithoutProperties(_ref, ["children", "title", "onCancel", "onConfirm", "cancelButtonText", "confirmButtonText", "confirmButtonDisabled", "className", "buttonColor", "defaultFocusedButton", "isLoading"]);

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      cancelButton = _useState2[0],
      setCancelButton = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      confirmButton = _useState4[0],
      setConfirmButton = _useState4[1];

  (0, _react.useEffect)(function () {
    // We have to do this instead of using `autoFocus` because React's polyfill for auto-focusing
    // elements conflicts with the focus-trap logic we have on EuiModal.
    // Wait a beat for the focus-trap to complete, and then set focus to the right button. Check that
    // the buttons exist first, because it's possible the modal has been closed already.
    requestAnimationFrame(function () {
      if (defaultFocusedButton === CANCEL_BUTTON && cancelButton) {
        cancelButton.focus();
      } else if (defaultFocusedButton === CONFIRM_BUTTON && confirmButton) {
        confirmButton.focus();
      }
    });
  });

  var confirmRef = function confirmRef(node) {
    return setConfirmButton(node);
  };

  var cancelRef = function cancelRef(node) {
    return setCancelButton(node);
  };

  var classes = (0, _classnames.default)('euiModal--confirmation', className);
  var modalTitle;

  if (title) {
    modalTitle = (0, _react2.jsx)(_modal_header.EuiModalHeader, null, (0, _react2.jsx)(_modal_header_title.EuiModalHeaderTitle, {
      "data-test-subj": "confirmModalTitleText"
    }, title));
  }

  var message;

  if (typeof children === 'string' && children.length > 0) {
    message = (0, _react2.jsx)("p", null, children);
  } else {
    message = children;
  }

  return (0, _react2.jsx)(_modal.EuiModal, _extends({
    className: classes,
    onClose: onCancel
  }, rest), modalTitle, message && (0, _react2.jsx)(_modal_body.EuiModalBody, null, (0, _react2.jsx)(_text.EuiText, {
    "data-test-subj": "confirmModalBodyText"
  }, message)), (0, _react2.jsx)(_modal_footer.EuiModalFooter, null, (0, _react2.jsx)(_button.EuiButtonEmpty, {
    "data-test-subj": "confirmModalCancelButton",
    onClick: onCancel,
    buttonRef: cancelRef
  }, cancelButtonText), (0, _react2.jsx)(_button.EuiButton, {
    "data-test-subj": "confirmModalConfirmButton",
    onClick: onConfirm,
    isLoading: isLoading,
    fill: true,
    buttonRef: confirmRef,
    color: buttonColor,
    isDisabled: confirmButtonDisabled
  }, confirmButtonText)));
};

exports.EuiConfirmModal = EuiConfirmModal;
EuiConfirmModal.propTypes = {
  /**
     * ReactNode to render as this component's content
     */
  children: _propTypes.default.node,
  title: _propTypes.default.node,
  cancelButtonText: _propTypes.default.node,
  confirmButtonText: _propTypes.default.node,
  onCancel: _propTypes.default.func.isRequired,
  onConfirm: _propTypes.default.func,
  confirmButtonDisabled: _propTypes.default.bool,
  className: _propTypes.default.string,
  defaultFocusedButton: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.any.isRequired]),
  buttonColor: _propTypes.default.oneOf(["primary", "accent", "success", "warning", "danger", "ghost", "text"]),
  // For docs only, will get passed with ...rest

  /**
     * Sets the max-width of the modal.
     * Set to `true` to use the default (`euiBreakpoints 'm'`),
     * set to `false` to not restrict the width,
     * set to a number for a custom width in px,
     * set to a string for a custom width in custom measurement.
     */
  maxWidth: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.number.isRequired, _propTypes.default.string.isRequired]),

  /**
     * Passes `isLoading` prop to the confirm button
     */
  isLoading: _propTypes.default.bool
};