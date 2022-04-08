"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridCellButtons = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../i18n");

var _button_icon = require("../../button/button_icon");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EuiDataGridCellButtons = function EuiDataGridCellButtons(_ref) {
  var popoverIsOpen = _ref.popoverIsOpen,
      closePopover = _ref.closePopover,
      onExpandClick = _ref.onExpandClick,
      column = _ref.column,
      rowIndex = _ref.rowIndex;
  var buttonIconClasses = (0, _classnames.default)('euiDataGridRowCell__expandButtonIcon', {
    'euiDataGridRowCell__expandButtonIcon-isActive': popoverIsOpen
  });
  var buttonClasses = (0, _classnames.default)('euiDataGridRowCell__expandButton', {
    'euiDataGridRowCell__expandButton-isActive': popoverIsOpen
  });
  var expandButton = (0, _react2.jsx)(_i18n.EuiI18n, {
    key: 'expand',
    token: "euiDataGridCellButtons.expandButtonTitle",
    default: "Click or hit enter to interact with cell content"
  }, function (expandButtonTitle) {
    return (0, _react2.jsx)(_button_icon.EuiButtonIcon, {
      display: "fill",
      className: buttonIconClasses,
      color: "primary",
      iconSize: "s",
      iconType: "expandMini",
      "aria-hidden": true,
      onClick: onExpandClick,
      title: expandButtonTitle
    });
  });
  var additionalButtons = (0, _react.useMemo)(function () {
    var ButtonComponent = function ButtonComponent(props) {
      return (0, _react2.jsx)(_button_icon.EuiButtonIcon, _extends({}, props, {
        "aria-hidden": true,
        className: "euiDataGridRowCell__actionButtonIcon",
        iconSize: "s"
      }));
    };

    return column && Array.isArray(column.cellActions) ? column.cellActions.map(function (Action, idx) {
      // React is more permissible than the TS types indicate
      var CellButtonElement = Action;
      return (0, _react2.jsx)(CellButtonElement, {
        key: idx,
        rowIndex: rowIndex,
        columnId: column.id,
        Component: ButtonComponent,
        isExpanded: false,
        closePopover: closePopover
      });
    }) : [];
  }, [column, rowIndex, closePopover]);
  return (0, _react2.jsx)("div", {
    className: buttonClasses
  }, [].concat(_toConsumableArray(additionalButtons), [expandButton]));
};

exports.EuiDataGridCellButtons = EuiDataGridCellButtons;