"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiOverlayMask = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = require("react-dom");

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiOverlayMask = function EuiOverlayMask(_ref) {
  var className = _ref.className,
      children = _ref.children,
      onClick = _ref.onClick,
      _ref$headerZindexLoca = _ref.headerZindexLocation,
      headerZindexLocation = _ref$headerZindexLoca === void 0 ? 'above' : _ref$headerZindexLoca,
      rest = _objectWithoutProperties(_ref, ["className", "children", "onClick", "headerZindexLocation"]);

  var overlayMaskNode = (0, _react.useRef)();

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPortalTargetReady = _useState2[0],
      setIsPortalTargetReady = _useState2[1];

  (0, _react.useEffect)(function () {
    document.body.classList.add('euiBody-hasOverlayMask');
    return function () {
      document.body.classList.remove('euiBody-hasOverlayMask');
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (typeof document !== 'undefined') {
      overlayMaskNode.current = document.createElement('div');
    }
  }, []);
  (0, _react.useEffect)(function () {
    var portalTarget = overlayMaskNode.current;

    if (portalTarget) {
      document.body.appendChild(portalTarget);
    }

    setIsPortalTargetReady(true);
    return function () {
      if (portalTarget) {
        document.body.removeChild(portalTarget);
      }
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (!overlayMaskNode.current) return;
    (0, _common.keysOf)(rest).forEach(function (key) {
      if (typeof rest[key] !== 'string') {
        throw new Error("Unhandled property type. EuiOverlayMask property ".concat(key, " is not a string."));
      }

      if (overlayMaskNode.current) {
        overlayMaskNode.current.setAttribute(key, rest[key]);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  (0, _react.useEffect)(function () {
    if (!overlayMaskNode.current) return;
    overlayMaskNode.current.className = (0, _classnames.default)('euiOverlayMask', "euiOverlayMask--".concat(headerZindexLocation, "Header"), className);
  }, [className, headerZindexLocation]);
  (0, _react.useEffect)(function () {
    if (!overlayMaskNode.current || !onClick) return;
    var portalTarget = overlayMaskNode.current;

    var listener = function listener(e) {
      if (e.target === overlayMaskNode.current) {
        onClick();
      }
    };

    overlayMaskNode.current.addEventListener('click', listener);
    return function () {
      if (portalTarget && onClick) {
        portalTarget.removeEventListener('click', listener);
      }
    };
  }, [onClick]);
  return isPortalTargetReady ? (0, _react2.jsx)(_react.default.Fragment, null, /*#__PURE__*/(0, _reactDom.createPortal)(children, overlayMaskNode.current)) : null;
};

exports.EuiOverlayMask = EuiOverlayMask;
EuiOverlayMask.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Function that applies to clicking the mask itself and not the children
     */
  onClick: _propTypes.default.func,

  /**
     * ReactNode to render as this component's content
     */
  children: _propTypes.default.node,

  /**
     * Should the mask visually sit above or below the EuiHeader (controlled by z-index)
     */
  headerZindexLocation: _propTypes.default.oneOf(["above", "below"])
};