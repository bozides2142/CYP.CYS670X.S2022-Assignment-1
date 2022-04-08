"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTableRowCell = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _utils = require("./utils");

var _useIsWithinBreakpoints = require("../../services/hooks/useIsWithinBreakpoints");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EuiTableRowCell = function EuiTableRowCell(_ref) {
  var _mobileOptions$showOn, _mobileOptions$trunca;

  var _ref$align = _ref.align,
      align = _ref$align === void 0 ? _services.LEFT_ALIGNMENT : _ref$align,
      children = _ref.children,
      className = _ref.className,
      truncateText = _ref.truncateText,
      setScopeRow = _ref.setScopeRow,
      showOnHover = _ref.showOnHover,
      _ref$textOnly = _ref.textOnly,
      textOnly = _ref$textOnly === void 0 ? true : _ref$textOnly,
      hasActions = _ref.hasActions,
      isExpander = _ref.isExpander,
      style = _ref.style,
      width = _ref.width,
      _ref$valign = _ref.valign,
      valign = _ref$valign === void 0 ? 'middle' : _ref$valign,
      _ref$mobileOptions = _ref.mobileOptions,
      mobileOptions = _ref$mobileOptions === void 0 ? {
    show: true
  } : _ref$mobileOptions,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["align", "children", "className", "truncateText", "setScopeRow", "showOnHover", "textOnly", "hasActions", "isExpander", "style", "width", "valign", "mobileOptions"]);
  var cellClasses = (0, _classnames.default)('euiTableRowCell', (0, _defineProperty2.default)({
    'euiTableRowCell--hasActions': hasActions,
    'euiTableRowCell--isExpander': isExpander,
    'euiTableRowCell--hideForDesktop': mobileOptions.only,
    'euiTableRowCell--enlargeForMobile': mobileOptions.enlarge
  }, "euiTableRowCell--".concat(valign), valign));
  var contentClasses = (0, _classnames.default)('euiTableCellContent', className, {
    'euiTableCellContent--alignRight': align === _services.RIGHT_ALIGNMENT,
    'euiTableCellContent--alignCenter': align === _services.CENTER_ALIGNMENT,
    'euiTableCellContent--showOnHover': showOnHover,
    'euiTableCellContent--truncateText': truncateText,
    // We're doing this rigamarole instead of creating `euiTableCellContent--textOnly` for BWC
    // purposes for the time-being.
    'euiTableCellContent--overflowingContent': textOnly !== true
  });
  var mobileContentClasses = (0, _classnames.default)('euiTableCellContent', className, {
    'euiTableCellContent--alignRight': mobileOptions.align === _services.RIGHT_ALIGNMENT || align === _services.RIGHT_ALIGNMENT,
    'euiTableCellContent--alignCenter': mobileOptions.align === _services.CENTER_ALIGNMENT || align === _services.CENTER_ALIGNMENT,
    'euiTableCellContent--showOnHover': (_mobileOptions$showOn = mobileOptions.showOnHover) !== null && _mobileOptions$showOn !== void 0 ? _mobileOptions$showOn : showOnHover,
    'euiTableCellContent--truncateText': (_mobileOptions$trunca = mobileOptions.truncateText) !== null && _mobileOptions$trunca !== void 0 ? _mobileOptions$trunca : truncateText,
    // We're doing this rigamarole instead of creating `euiTableCellContent--textOnly` for BWC
    // purposes for the time-being.
    'euiTableCellContent--overflowingContent': mobileOptions.textOnly !== true || textOnly !== true
  });
  var childClasses = (0, _classnames.default)({
    euiTableCellContent__text: textOnly === true,
    euiTableCellContent__hoverItem: showOnHover
  });
  var widthValue = (0, _useIsWithinBreakpoints.useIsWithinBreakpoints)(['xs', 's', 'm']) && mobileOptions.width ? mobileOptions.width : width;
  var styleObj = (0, _utils.resolveWidthAsStyle)(style, widthValue);

  function modifyChildren(children) {
    var modifiedChildren = children;

    if (textOnly === true) {
      modifiedChildren = (0, _react2.jsx)("span", {
        className: childClasses
      }, children);
    } else if ( /*#__PURE__*/_react.default.isValidElement(children)) {
      modifiedChildren = _react.default.Children.map(children, function (child) {
        return /*#__PURE__*/_react.default.cloneElement(child, {
          className: (0, _classnames.default)(child.props.className, childClasses)
        });
      });
    }

    return modifiedChildren;
  }

  var childrenNode = modifyChildren(children);
  var hideForMobileClasses = 'euiTableRowCell--hideForMobile';
  var showForMobileClasses = 'euiTableRowCell--hideForDesktop';
  var Element = setScopeRow ? 'th' : 'td';

  var sharedProps = _objectSpread({
    scope: setScopeRow ? 'row' : undefined,
    style: styleObj
  }, rest);

  if (mobileOptions.show === false) {
    return (0, _react2.jsx)(Element, (0, _extends2.default)({
      className: "".concat(cellClasses, " ").concat(hideForMobileClasses)
    }, sharedProps), (0, _react2.jsx)("div", {
      className: contentClasses
    }, childrenNode));
  } else {
    return (0, _react2.jsx)(Element, (0, _extends2.default)({
      className: cellClasses
    }, sharedProps), mobileOptions.header && (0, _react2.jsx)("div", {
      className: "euiTableRowCell__mobileHeader ".concat(showForMobileClasses)
    }, mobileOptions.header), mobileOptions.render ? (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("div", {
      className: "".concat(mobileContentClasses, " ").concat(showForMobileClasses)
    }, modifyChildren(mobileOptions.render)), (0, _react2.jsx)("div", {
      className: "".concat(contentClasses, " ").concat(hideForMobileClasses)
    }, childrenNode)) : (0, _react2.jsx)("div", {
      className: contentClasses
    }, childrenNode));
  }
};

exports.EuiTableRowCell = EuiTableRowCell;