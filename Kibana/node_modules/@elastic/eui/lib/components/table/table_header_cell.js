"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTableHeaderCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _accessibility = require("../accessibility");

var _icon = require("../icon");

var _utils = require("./utils");

var _inner_text = require("../inner_text");

var _services = require("../../services");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var CellContents = function CellContents(_ref) {
  var className = _ref.className,
      description = _ref.description,
      children = _ref.children,
      isSorted = _ref.isSorted,
      isSortAscending = _ref.isSortAscending,
      showSortMsg = _ref.showSortMsg;
  return (0, _react2.jsx)("span", {
    className: className
  }, (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
    return (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiTableHeaderCell.titleTextWithDesc",
      default: "{innerText}; {description}",
      values: {
        innerText: innerText,
        description: description
      }
    }, function (titleTextWithDesc) {
      return (0, _react2.jsx)("span", {
        title: description ? titleTextWithDesc : innerText,
        ref: ref,
        className: "euiTableCellContent__text"
      }, children);
    });
  }), description && (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, description)), showSortMsg && isSorted && (0, _react2.jsx)(_icon.EuiIcon, {
    className: "euiTableSortIcon",
    type: isSortAscending ? 'sortUp' : 'sortDown',
    size: "m"
  }));
};

var EuiTableHeaderCell = function EuiTableHeaderCell(_ref2) {
  var children = _ref2.children,
      _ref2$align = _ref2.align,
      align = _ref2$align === void 0 ? _services.LEFT_ALIGNMENT : _ref2$align,
      onSort = _ref2.onSort,
      isSorted = _ref2.isSorted,
      isSortAscending = _ref2.isSortAscending,
      className = _ref2.className,
      scope = _ref2.scope,
      _ref2$mobileOptions = _ref2.mobileOptions,
      mobileOptions = _ref2$mobileOptions === void 0 ? {
    show: true
  } : _ref2$mobileOptions,
      width = _ref2.width,
      style = _ref2.style,
      readOnly = _ref2.readOnly,
      description = _ref2.description,
      rest = _objectWithoutProperties(_ref2, ["children", "align", "onSort", "isSorted", "isSortAscending", "className", "scope", "mobileOptions", "width", "style", "readOnly", "description"]);

  var classes = (0, _classnames.default)('euiTableHeaderCell', className, {
    'euiTableHeaderCell--hideForDesktop': mobileOptions.only,
    'euiTableHeaderCell--hideForMobile': !mobileOptions.show
  });
  var contentClasses = (0, _classnames.default)('euiTableCellContent', className, {
    'euiTableCellContent--alignRight': align === _services.RIGHT_ALIGNMENT,
    'euiTableCellContent--alignCenter': align === _services.CENTER_ALIGNMENT
  });
  var styleObj = (0, _utils.resolveWidthAsStyle)(style, width);
  var CellComponent = children ? 'th' : 'td';
  var cellScope = CellComponent === 'th' ? scope !== null && scope !== void 0 ? scope : 'col' : undefined; // `scope` is only valid on `th` elements

  if (onSort || isSorted) {
    var buttonClasses = (0, _classnames.default)('euiTableHeaderButton', {
      'euiTableHeaderButton-isSorted': isSorted
    });
    var ariaSortValue = 'none';

    if (isSorted) {
      ariaSortValue = isSortAscending ? 'ascending' : 'descending';
    }

    var cellContents = (0, _react2.jsx)(CellContents, {
      className: contentClasses,
      description: description,
      showSortMsg: true,
      children: children,
      isSorted: isSorted,
      isSortAscending: isSortAscending
    });
    return (0, _react2.jsx)(CellComponent, _extends({
      className: classes,
      scope: cellScope,
      role: "columnheader",
      "aria-sort": ariaSortValue,
      "aria-live": "polite",
      style: styleObj
    }, rest), onSort && !readOnly ? (0, _react2.jsx)("button", {
      type: "button",
      className: buttonClasses,
      onClick: onSort,
      "data-test-subj": "tableHeaderSortButton"
    }, cellContents) : cellContents);
  }

  return (0, _react2.jsx)(CellComponent, _extends({
    className: classes,
    scope: cellScope,
    role: "columnheader",
    style: styleObj
  }, rest), (0, _react2.jsx)(CellContents, {
    className: contentClasses,
    description: description,
    showSortMsg: false,
    children: children,
    isSorted: isSorted,
    isSortAscending: isSortAscending
  }));
};

exports.EuiTableHeaderCell = EuiTableHeaderCell;
EuiTableHeaderCell.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  align: _propTypes.default.oneOf(["left", "right", "center"]),
  isSortAscending: _propTypes.default.bool,
  isSorted: _propTypes.default.bool,

  /**
       * Mobile options for displaying differently at small screens
       */
  mobileOptions: _propTypes.default.shape({
    /**
           * If false, will not render the column at all for mobile
           */
    show: _propTypes.default.bool,

    /**
           * Only show for mobile? If true, will not render the column at all
           * for desktop
           */
    only: _propTypes.default.bool
  }),
  onSort: _propTypes.default.func,
  scope: _propTypes.default.oneOf(["col", "row", "colgroup", "rowgroup"]),
  width: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired]),
  description: _propTypes.default.string,

  /**
       * Shows the sort indicator but removes the button
       */
  readOnly: _propTypes.default.bool
};