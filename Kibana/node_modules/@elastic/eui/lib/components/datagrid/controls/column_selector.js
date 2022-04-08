"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridColumnSelector = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _popover = require("../../popover");

var _i18n = require("../../i18n");

var _button = require("../../button");

var _flex = require("../../flex");

var _form = require("../../form");

var _drag_and_drop = require("../../drag_and_drop");

var _icon = require("../../icon");

var _services = require("../../../services");

var _data_grid_toolbar = require("./data_grid_toolbar");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useDataGridColumnSelector = function useDataGridColumnSelector(availableColumns, columnVisibility, showColumnSelector, displayValues) {
  var allowColumnHiding = (0, _data_grid_toolbar.getNestedObjectOptions)(showColumnSelector, 'allowHide');
  var allowColumnReorder = (0, _data_grid_toolbar.getNestedObjectOptions)(showColumnSelector, 'allowReorder');

  var _useDependentState = (0, _services.useDependentState)(function () {
    return availableColumns.map(function (_ref) {
      var id = _ref.id;
      return id;
    });
  }, [availableColumns]),
      _useDependentState2 = _slicedToArray(_useDependentState, 2),
      sortedColumns = _useDependentState2[0],
      setSortedColumns = _useDependentState2[1];

  var visibleColumns = columnVisibility.visibleColumns,
      setVisibleColumns = columnVisibility.setVisibleColumns;
  var visibleColumnIds = (0, _react.useMemo)(function () {
    return new Set(visibleColumns);
  }, [visibleColumns]);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var setColumns = (0, _react.useCallback)(function (nextColumns) {
    setSortedColumns(nextColumns);
    var nextVisibleColumns = nextColumns.filter(function (id) {
      return visibleColumnIds.has(id);
    });
    setVisibleColumns(nextVisibleColumns);
  }, [setSortedColumns, setVisibleColumns, visibleColumnIds]);
  var onDragEnd = (0, _react.useCallback)(function (_ref2) {
    var sourceIndex = _ref2.source.index,
        destination = _ref2.destination;

    if (destination) {
      var destinationIndex = destination.index;
      var nextSortedColumns = (0, _drag_and_drop.euiDragDropReorder)(sortedColumns, sourceIndex, destinationIndex);
      setColumns(nextSortedColumns);
    }
  }, [sortedColumns, setColumns]);
  var numberOfHiddenFields = availableColumns.length - visibleColumns.length;

  var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      columnSearchText = _useState4[0],
      setColumnSearchText = _useState4[1];

  var controlBtnClasses = (0, _classnames.default)('euiDataGrid__controlBtn', {
    'euiDataGrid__controlBtn--active': numberOfHiddenFields > 0
  });
  var filteredColumns = (0, _react.useMemo)(function () {
    return sortedColumns.filter(function (id) {
      return (displayValues[id] || id).toLowerCase().indexOf(columnSearchText.toLowerCase()) !== -1;
    });
  }, [sortedColumns, columnSearchText, displayValues]);
  var isDragEnabled = allowColumnReorder && columnSearchText.length === 0; // only allow drag-and-drop when not filtering columns

  var buttonText = (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiColumnSelector.button",
    default: "Columns"
  });

  if (numberOfHiddenFields === 1) {
    buttonText = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiColumnSelector.buttonActiveSingular",
      default: "{numberOfHiddenFields} column hidden",
      values: {
        numberOfHiddenFields: numberOfHiddenFields
      }
    });
  } else if (numberOfHiddenFields > 1) {
    buttonText = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiColumnSelector.buttonActivePlural",
      default: "{numberOfHiddenFields} columns hidden",
      values: {
        numberOfHiddenFields: numberOfHiddenFields
      }
    });
  }

  var columnSelector = allowColumnHiding || allowColumnReorder ? (0, _react2.jsx)(_popover.EuiPopover, {
    "data-test-subj": "dataGridColumnSelectorPopover",
    isOpen: isOpen,
    closePopover: function closePopover() {
      return setIsOpen(false);
    },
    anchorPosition: "downLeft",
    panelPaddingSize: "s",
    panelClassName: "euiDataGrid__controlPopoverWithDragDrop",
    button: (0, _react2.jsx)(_button.EuiButtonEmpty, {
      size: "xs",
      iconType: allowColumnHiding ? 'listAdd' : 'list',
      color: "text",
      className: controlBtnClasses,
      "data-test-subj": "dataGridColumnSelectorButton",
      onClick: function onClick() {
        return setIsOpen(!isOpen);
      }
    }, buttonText)
  }, (0, _react2.jsx)("div", null, allowColumnHiding && (0, _react2.jsx)(_popover.EuiPopoverTitle, null, (0, _react2.jsx)(_i18n.EuiI18n, {
    tokens: ['euiColumnSelector.search', 'euiColumnSelector.searchcolumns'],
    defaults: ['Search', 'Search columns']
  }, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        search = _ref4[0],
        searchcolumns = _ref4[1];

    return (0, _react2.jsx)(_form.EuiFieldText, {
      compressed: true,
      placeholder: search,
      "aria-label": searchcolumns,
      value: columnSearchText,
      onChange: function onChange(e) {
        return setColumnSearchText(e.currentTarget.value);
      },
      "data-test-subj": "dataGridColumnSelectorSearch"
    });
  })), (0, _react2.jsx)("div", {
    className: "euiDataGrid__controlScroll"
  }, (0, _react2.jsx)(_drag_and_drop.EuiDragDropContext, {
    onDragEnd: onDragEnd
  }, (0, _react2.jsx)(_drag_and_drop.EuiDroppable, {
    droppableId: "columnOrder",
    isDropDisabled: !isDragEnabled
  }, (0, _react2.jsx)(_react.Fragment, null, filteredColumns.map(function (id, index) {
    return (0, _react2.jsx)(_drag_and_drop.EuiDraggable, {
      key: id,
      draggableId: id,
      index: index,
      isDragDisabled: !isDragEnabled
    }, function (provided, state) {
      return (0, _react2.jsx)("div", {
        className: "euiDataGridColumnSelector__item ".concat(state.isDragging && 'euiDataGridColumnSelector__item-isDragging'),
        "data-test-subj": "dataGridColumnSelectorColumnItem-".concat(id)
      }, (0, _react2.jsx)(_flex.EuiFlexGroup, {
        responsive: false,
        gutterSize: "m",
        alignItems: "center"
      }, (0, _react2.jsx)(_flex.EuiFlexItem, null, allowColumnHiding ? (0, _react2.jsx)(_form.EuiSwitch, {
        name: id,
        label: displayValues[id] || id,
        checked: visibleColumnIds.has(id),
        compressed: true,
        className: "euiSwitch--mini",
        onChange: function onChange(event) {
          var checked = event.target.checked;
          var nextVisibleColumns = sortedColumns.filter(function (columnId) {
            return checked ? visibleColumnIds.has(columnId) || id === columnId : visibleColumnIds.has(columnId) && id !== columnId;
          });
          setVisibleColumns(nextVisibleColumns);
        },
        "data-test-subj": "dataGridColumnSelectorToggleColumnVisibility-".concat(id)
      }) : (0, _react2.jsx)("span", {
        className: "euiDataGridColumnSelector__itemLabel"
      }, id)), isDragEnabled && (0, _react2.jsx)(_flex.EuiFlexItem, {
        grow: false
      }, (0, _react2.jsx)(_icon.EuiIcon, {
        type: "grab",
        color: "subdued"
      }))));
    });
  })))))), allowColumnHiding && (0, _react2.jsx)(_popover.EuiPopoverFooter, null, (0, _react2.jsx)(_flex.EuiFlexGroup, {
    gutterSize: "s",
    responsive: false,
    justifyContent: "spaceBetween"
  }, (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, (0, _react2.jsx)(_button.EuiButtonEmpty, {
    size: "xs",
    flush: "left",
    onClick: function onClick() {
      return setVisibleColumns(sortedColumns);
    },
    "data-test-subj": "dataGridColumnSelectorShowAllButton"
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiColumnSelector.selectAll",
    default: "Show all"
  }))), (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, (0, _react2.jsx)(_button.EuiButtonEmpty, {
    size: "xs",
    flush: "right",
    onClick: function onClick() {
      return setVisibleColumns([]);
    },
    "data-test-subj": "dataGridColumnSelectorHideAllButton"
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiColumnSelector.hideAll",
    default: "Hide all"
  })))))) : null;
  var orderedVisibleColumns = (0, _react.useMemo)(function () {
    return visibleColumns.map(function (columnId) {
      return availableColumns.find(function (_ref5) {
        var id = _ref5.id;
        return id === columnId;
      });
    } // cast to avoid `undefined`, it filters those out next
    ).filter(function (column) {
      return column != null;
    });
  }, [availableColumns, visibleColumns]);
  /**
   * Used for moving columns left/right, available in the headers actions menu
   */

  var switchColumnPos = (0, _react.useCallback)(function (fromColId, toColId) {
    var moveFromIdx = sortedColumns.indexOf(fromColId);
    var moveToIdx = sortedColumns.indexOf(toColId);

    if (moveFromIdx === -1 || moveToIdx === -1) {
      return;
    }

    var nextSortedColumns = _toConsumableArray(sortedColumns);

    nextSortedColumns.splice(moveFromIdx, 1);
    nextSortedColumns.splice(moveToIdx, 0, fromColId);
    setColumns(nextSortedColumns);
  }, [setColumns, sortedColumns]);
  return [columnSelector, orderedVisibleColumns, setVisibleColumns, switchColumnPos];
};

exports.useDataGridColumnSelector = useDataGridColumnSelector;