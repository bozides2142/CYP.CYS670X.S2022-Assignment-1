"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDroppable = exports.EuiDroppableContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactBeautifulDnd = require("react-beautiful-dnd");

var _classnames = _interopRequireDefault(require("classnames"));

var _drag_drop_context = require("./drag_drop_context");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var spacingToClassNameMap = {
  none: null,
  s: 'euiDroppable--s',
  m: 'euiDroppable--m',
  l: 'euiDroppable--l'
};

var EuiDroppableContext = /*#__PURE__*/_react.default.createContext({
  cloneItems: false
});

exports.EuiDroppableContext = EuiDroppableContext;

var EuiDroppable = function EuiDroppable(_ref) {
  var droppableId = _ref.droppableId,
      direction = _ref.direction,
      _ref$isDropDisabled = _ref.isDropDisabled,
      isDropDisabled = _ref$isDropDisabled === void 0 ? false : _ref$isDropDisabled,
      children = _ref.children,
      className = _ref.className,
      _ref$cloneDraggables = _ref.cloneDraggables,
      cloneDraggables = _ref$cloneDraggables === void 0 ? false : _ref$cloneDraggables,
      _ref$spacing = _ref.spacing,
      spacing = _ref$spacing === void 0 ? 'none' : _ref$spacing,
      style = _ref.style,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'EUI_DEFAULT' : _ref$type,
      _ref$withPanel = _ref.withPanel,
      withPanel = _ref$withPanel === void 0 ? false : _ref$withPanel,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? false : _ref$grow,
      _ref$dataTestSubj = _ref['data-test-subj'],
      dataTestSubj = _ref$dataTestSubj === void 0 ? 'droppable' : _ref$dataTestSubj,
      rest = _objectWithoutProperties(_ref, ["droppableId", "direction", "isDropDisabled", "children", "className", "cloneDraggables", "spacing", "style", "type", "withPanel", "grow", "data-test-subj"]);

  var _useContext = (0, _react.useContext)(_drag_drop_context.EuiDragDropContextContext),
      isDraggingType = _useContext.isDraggingType;

  var dropIsDisabled = cloneDraggables ? true : isDropDisabled;
  return (0, _react2.jsx)(_reactBeautifulDnd.Droppable, _extends({
    isDropDisabled: dropIsDisabled,
    droppableId: droppableId,
    direction: direction,
    type: type
  }, rest), function (provided, snapshot) {
    var classes = (0, _classnames.default)('euiDroppable', {
      'euiDroppable--isDisabled': dropIsDisabled,
      'euiDroppable--isDraggingOver': snapshot.isDraggingOver,
      'euiDroppable--isDraggingType': isDraggingType === type,
      'euiDroppable--withPanel': withPanel,
      'euiDroppable--grow': grow,
      'euiDroppable--noGrow': !grow
    }, spacingToClassNameMap[spacing], className);
    var placeholderClasses = (0, _classnames.default)('euiDroppable__placeholder', {
      'euiDroppable__placeholder--isHidden': cloneDraggables
    });
    var DroppableElement = typeof children === 'function' ? children(provided, snapshot) : children;
    return (0, _react2.jsx)("div", _extends({}, provided.droppableProps, {
      ref: provided.innerRef,
      style: style,
      "data-test-subj": dataTestSubj,
      className: classes
    }), (0, _react2.jsx)(EuiDroppableContext.Provider, {
      value: {
        cloneItems: cloneDraggables
      }
    }, DroppableElement), (0, _react2.jsx)("div", {
      className: placeholderClasses
    }, provided.placeholder));
  });
};

exports.EuiDroppable = EuiDroppable;
EuiDroppable.propTypes = {
  /**
     * ReactNode to render as this component's content
     */
  children: _propTypes.default.oneOfType([_propTypes.default.element.isRequired, _propTypes.default.arrayOf(_propTypes.default.element.isRequired).isRequired, _propTypes.default.any.isRequired]).isRequired,
  className: _propTypes.default.string,

  /**
     * Makes its items immutable. Dragging creates cloned items that can be dropped elsewhere.
     */
  cloneDraggables: _propTypes.default.bool,
  style: _propTypes.default.any,

  /**
     * Adds padding to the droppable area
     */
  spacing: _propTypes.default.oneOf(["none", "s", "m", "l"]),

  /**
     * Adds an EuiPanel style to the droppable area
     */
  withPanel: _propTypes.default.bool,

  /**
     * Allow the panel to flex-grow?
     */
  grow: _propTypes.default.bool,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};