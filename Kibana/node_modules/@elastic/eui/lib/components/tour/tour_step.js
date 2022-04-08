"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTourStep = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _beacon = require("../beacon");

var _button = require("../button");

var _flex = require("../flex");

var _i18n = require("../i18n");

var _popover = require("../popover");

var _title = require("../title");

var _tour_step_indicator = require("./tour_step_indicator");

var _services = require("../../services");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiTourStep = function EuiTourStep(_ref) {
  var _ref$anchorPosition = _ref.anchorPosition,
      anchorPosition = _ref$anchorPosition === void 0 ? 'leftUp' : _ref$anchorPosition,
      children = _ref.children,
      className = _ref.className,
      _ref$closePopover = _ref.closePopover,
      closePopover = _ref$closePopover === void 0 ? function () {} : _ref$closePopover,
      content = _ref.content,
      _ref$isStepOpen = _ref.isStepOpen,
      isStepOpen = _ref$isStepOpen === void 0 ? false : _ref$isStepOpen,
      _ref$minWidth = _ref.minWidth,
      minWidth = _ref$minWidth === void 0 ? 300 : _ref$minWidth,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? 600 : _ref$maxWidth,
      onFinish = _ref.onFinish,
      _ref$step = _ref.step,
      step = _ref$step === void 0 ? 1 : _ref$step,
      stepsTotal = _ref.stepsTotal,
      style = _ref.style,
      subtitle = _ref.subtitle,
      title = _ref.title,
      _ref$decoration = _ref.decoration,
      decoration = _ref$decoration === void 0 ? 'beacon' : _ref$decoration,
      footerAction = _ref.footerAction,
      rest = _objectWithoutProperties(_ref, ["anchorPosition", "children", "className", "closePopover", "content", "isStepOpen", "minWidth", "maxWidth", "onFinish", "step", "stepsTotal", "style", "subtitle", "title", "decoration", "footerAction"]);

  var titleId = (0, _services.useGeneratedHtmlId)();

  if (step === 0) {
    console.warn('EuiTourStep `step` should 1-based indexing. Please update to eliminate 0 indexes.');
  }

  var newStyle = _objectSpread(_objectSpread({}, style), {}, {
    maxWidth: maxWidth,
    minWidth: minWidth
  });

  var classes = (0, _classnames.default)('euiTour', className);
  var finishButtonProps = {
    color: 'text',
    flush: 'right',
    size: 'xs'
  };
  var footer = (0, _react2.jsx)(_flex.EuiFlexGroup, {
    responsive: false,
    justifyContent: stepsTotal > 1 ? 'spaceBetween' : 'flexEnd'
  }, stepsTotal > 1 && (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, (0, _react2.jsx)("ul", {
    className: "euiTourFooter__stepList"
  }, _toConsumableArray(Array(stepsTotal).keys()).map(function (_, i) {
    var status = 'complete';

    if (step === i + 1) {
      status = 'active';
    } else if (step <= i) {
      status = 'incomplete';
    }

    return (0, _react2.jsx)(_tour_step_indicator.EuiTourStepIndicator, {
      key: i,
      number: i + 1,
      status: status
    });
  }))), footerAction ? (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, footerAction) : (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    tokens: ['euiTourStep.endTour', 'euiTourStep.skipTour', 'euiTourStep.closeTour'],
    defaults: ['End tour', 'Skip tour', 'Close tour']
  }, function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 3),
        endTour = _ref3[0],
        skipTour = _ref3[1],
        closeTour = _ref3[2];

    var content = closeTour;

    if (stepsTotal > 1) {
      content = stepsTotal === step ? endTour : skipTour;
    }

    return (0, _react2.jsx)(_button.EuiButtonEmpty, _extends({
      onClick: onFinish
    }, finishButtonProps), content);
  })));
  var hasBeacon = decoration === 'beacon';
  return (0, _react2.jsx)(_popover.EuiPopover, _extends({
    anchorPosition: anchorPosition,
    button: children,
    closePopover: closePopover,
    isOpen: isStepOpen,
    ownFocus: false,
    panelClassName: classes,
    panelStyle: newStyle,
    offset: hasBeacon ? 10 : 0,
    "aria-labelledby": titleId,
    arrowChildren: hasBeacon && (0, _react2.jsx)(_beacon.EuiBeacon, {
      className: "euiTour__beacon"
    })
  }, rest), (0, _react2.jsx)(_popover.EuiPopoverTitle, {
    className: "euiTourHeader",
    id: titleId
  }, subtitle && (0, _react2.jsx)(_title.EuiTitle, {
    size: "xxxs",
    className: "euiTourHeader__subtitle"
  }, (0, _react2.jsx)("h2", null, subtitle)), (0, _react2.jsx)(_title.EuiTitle, {
    size: "xxs",
    className: "euiTourHeader__title"
  }, subtitle ? (0, _react2.jsx)("h3", null, title) : (0, _react2.jsx)("h2", null, title))), (0, _react2.jsx)("div", {
    className: "euiTour__content"
  }, content), (0, _react2.jsx)(_popover.EuiPopoverFooter, {
    className: "euiTourFooter"
  }, footer));
};

exports.EuiTourStep = EuiTourStep;
EuiTourStep.propTypes = {
  /**
     * Element to which the tour step popover attaches when open
     */
  children: _propTypes.default.element.isRequired,

  /**
     * Contents of the tour step popover
     */
  content: _propTypes.default.node.isRequired,

  /**
     * Step will display if set to `true`
     */
  isStepOpen: _propTypes.default.bool,

  /**
     * Change the default min width of the popover panel
     */
  minWidth: _propTypes.default.any,

  /**
     * Change the default max width of the popover panel
     */
  maxWidth: _propTypes.default.any,

  /**
     * Function to call for 'Skip tour' and 'End tour' actions
     */
  onFinish: _propTypes.default.func.isRequired,

  /**
     * The number of the step within the parent tour. 1-based indexing.
     */
  step: _propTypes.default.number.isRequired,

  /**
     * The total number of steps in the tour
     */
  stepsTotal: _propTypes.default.number.isRequired,

  /**
     * Optional, standard DOM `style` attribute. Passed to the EuiPopover panel.
     */
  style: _propTypes.default.any,

  /**
     * Smaller title text that appears atop each step in the tour. The subtitle gets wrapped in the appropriate heading level.
     */
  subtitle: _propTypes.default.node,

  /**
     * Larger title text specific to this step. The title gets wrapped in the appropriate heading level.
     */
  title: _propTypes.default.node.isRequired,

  /**
     * Extra visual indication of step location
     */
  decoration: _propTypes.default.oneOf(["none", "beacon"]),

  /**
     * Element to replace the 'Skip tour' link in the footer
     */
  footerAction: _propTypes.default.element,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};