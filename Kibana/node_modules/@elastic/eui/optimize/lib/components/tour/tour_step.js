"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTourStep = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
      rest = (0, _objectWithoutProperties2.default)(_ref, ["anchorPosition", "children", "className", "closePopover", "content", "isStepOpen", "minWidth", "maxWidth", "onFinish", "step", "stepsTotal", "style", "subtitle", "title", "decoration", "footerAction"]);
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
  }, (0, _toConsumableArray2.default)(Array(stepsTotal).keys()).map(function (_, i) {
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
    var _ref3 = (0, _slicedToArray2.default)(_ref2, 3),
        endTour = _ref3[0],
        skipTour = _ref3[1],
        closeTour = _ref3[2];

    var content = closeTour;

    if (stepsTotal > 1) {
      content = stepsTotal === step ? endTour : skipTour;
    }

    return (0, _react2.jsx)(_button.EuiButtonEmpty, (0, _extends2.default)({
      onClick: onFinish
    }, finishButtonProps), content);
  })));
  var hasBeacon = decoration === 'beacon';
  return (0, _react2.jsx)(_popover.EuiPopover, (0, _extends2.default)({
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