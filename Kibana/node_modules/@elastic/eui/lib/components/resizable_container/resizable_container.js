"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiResizableContainer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _resize_observer = require("../observer/resize_observer");

var _context = require("./context");

var _resizable_button = require("./resizable_button");

var _resizable_panel = require("./resizable_panel");

var _helpers = require("./helpers");

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

var containerDirections = {
  vertical: 'vertical',
  horizontal: 'horizontal'
};
var initialState = {
  isDragging: false,
  currentResizerPos: -1,
  prevPanelId: null,
  nextPanelId: null,
  containerSize: 1,
  panels: {},
  resizers: {}
};

var EuiResizableContainer = function EuiResizableContainer(_ref) {
  var _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'horizontal' : _ref$direction,
      children = _ref.children,
      className = _ref.className,
      onPanelWidthChange = _ref.onPanelWidthChange,
      onToggleCollapsed = _ref.onToggleCollapsed,
      rest = _objectWithoutProperties(_ref, ["direction", "children", "className", "onPanelWidthChange", "onToggleCollapsed"]);

  var containerRef = (0, _react.useRef)(null);
  var isHorizontal = direction === containerDirections.horizontal;
  var classes = (0, _classnames.default)('euiResizableContainer', {
    'euiResizableContainer--vertical': !isHorizontal,
    'euiResizableContainer--horizontal': isHorizontal
  }, className);

  var _useContainerCallback = (0, _helpers.useContainerCallbacks)({
    initialState: _objectSpread(_objectSpread({}, initialState), {}, {
      isHorizontal: isHorizontal
    }),
    containerRef: containerRef,
    onPanelWidthChange: onPanelWidthChange
  }),
      _useContainerCallback2 = _slicedToArray(_useContainerCallback, 2),
      actions = _useContainerCallback2[0],
      reducerState = _useContainerCallback2[1];

  var containerSize = (0, _resize_observer.useResizeObserver)(containerRef.current, isHorizontal ? 'width' : 'height');
  var initialize = (0, _react.useCallback)(function () {
    actions.initContainer(isHorizontal);
  }, [actions, isHorizontal]);
  (0, _react.useEffect)(function () {
    if (containerSize.width > 0 && containerSize.height > 0) {
      initialize();
    }
  }, [initialize, containerSize]);
  var onMouseDown = (0, _react.useCallback)(function (event) {
    var currentTarget = event.currentTarget;
    var prevPanel = currentTarget.previousElementSibling;
    var nextPanel = currentTarget.nextElementSibling;
    if (!prevPanel || !nextPanel) return;
    var prevPanelId = prevPanel.id;
    var nextPanelId = nextPanel.id;
    var position = (0, _helpers.getPosition)(event, isHorizontal);
    actions.dragStart({
      position: position,
      prevPanelId: prevPanelId,
      nextPanelId: nextPanelId
    });
  }, [actions, isHorizontal]);
  var onMouseMove = (0, _react.useCallback)(function (event) {
    if (!reducerState.prevPanelId || !reducerState.nextPanelId || !reducerState.isDragging) return;
    var position = (0, _helpers.getPosition)(event, isHorizontal);
    actions.dragMove({
      position: position,
      prevPanelId: reducerState.prevPanelId,
      nextPanelId: reducerState.nextPanelId
    });
  }, [actions, isHorizontal, reducerState.prevPanelId, reducerState.nextPanelId, reducerState.isDragging]);
  var onKeyDown = (0, _react.useCallback)(function (event) {
    var key = event.key,
        currentTarget = event.currentTarget;
    var shouldResizeHorizontalPanel = isHorizontal && (key === _services.keys.ARROW_LEFT || key === _services.keys.ARROW_RIGHT);
    var shouldResizeVerticalPanel = !isHorizontal && (key === _services.keys.ARROW_UP || key === _services.keys.ARROW_DOWN);
    var prevPanelId = currentTarget.previousElementSibling.id;
    var nextPanelId = currentTarget.nextElementSibling.id;
    var direction;

    if (key === _services.keys.ARROW_DOWN || key === _services.keys.ARROW_RIGHT) {
      direction = 'forward';
    }

    if (key === _services.keys.ARROW_UP || key === _services.keys.ARROW_LEFT) {
      direction = 'backward';
    }

    if (direction === 'forward' || direction === 'backward' && (shouldResizeHorizontalPanel || shouldResizeVerticalPanel) && prevPanelId && nextPanelId) {
      event.preventDefault();
      actions.keyMove({
        direction: direction,
        prevPanelId: prevPanelId,
        nextPanelId: nextPanelId
      });
    }
  }, [actions, isHorizontal]);
  var onMouseUp = (0, _react.useCallback)(function () {
    actions.reset();
  }, [actions]); // eslint-disable-next-line react-hooks/exhaustive-deps

  var EuiResizableButton = (0, _react.useCallback)((0, _resizable_button.euiResizableButtonWithControls)({
    onKeyDown: onKeyDown,
    onMouseDown: onMouseDown,
    onTouchStart: onMouseDown,
    onFocus: actions.resizerFocus,
    onBlur: actions.resizerBlur,
    isHorizontal: isHorizontal,
    registration: {
      register: actions.registerResizer,
      deregister: actions.deregisterResizer
    }
  }), [actions, isHorizontal]); // eslint-disable-next-line react-hooks/exhaustive-deps

  var EuiResizablePanel = (0, _react.useCallback)((0, _resizable_panel.euiResizablePanelWithControls)({
    isHorizontal: isHorizontal,
    registration: {
      register: actions.registerPanel,
      deregister: actions.deregisterPanel
    },
    onToggleCollapsed: onToggleCollapsed,
    onToggleCollapsedInternal: actions.togglePanel
  }), [actions, isHorizontal]);

  var render = function render() {
    var DEFAULT = 'custom';
    var content = children(EuiResizablePanel, EuiResizableButton, {
      togglePanel: actions.togglePanel
    });
    var modes = /*#__PURE__*/_react.default.isValidElement(content) ? content.props.children.map(function (el) {
      return (0, _resizable_panel.getModeType)(el.props.mode) || DEFAULT;
    }) : null;

    if (modes && (['collapsible', 'main'].every(function (i) {
      return modes.includes(i);
    }) || modes.every(function (i) {
      return i === DEFAULT;
    }))) {
      return content;
    } else {
      throw new Error('Both `collapsible` and `main` mode panels are required.');
    }
  };

  return (0, _react2.jsx)(_context.EuiResizableContainerContextProvider, {
    registry: {
      panels: reducerState.panels,
      resizers: reducerState.resizers
    }
  }, (0, _react2.jsx)("div", _extends({
    className: classes,
    ref: containerRef,
    onMouseMove: reducerState.isDragging ? onMouseMove : undefined,
    onMouseUp: onMouseUp,
    onMouseLeave: onMouseUp,
    onTouchMove: onMouseMove,
    onTouchEnd: onMouseUp
  }, rest), render()));
};

exports.EuiResizableContainer = EuiResizableContainer;
EuiResizableContainer.propTypes = {
  /**
     * Specify the container direction
     */
  direction: _propTypes.default.oneOf(["vertical", "horizontal"]),

  /**
     * Pure function which accepts Panel and Resizer components in arguments
     * and returns a component tree
     */
  children: _propTypes.default.func.isRequired,

  /**
     * Pure function which accepts an object where keys are IDs of panels, which sizes were changed,
     * and values are actual sizes in percents
     */
  onPanelWidthChange: _propTypes.default.func,
  onToggleCollapsed: _propTypes.default.func,
  style: _propTypes.default.any,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};