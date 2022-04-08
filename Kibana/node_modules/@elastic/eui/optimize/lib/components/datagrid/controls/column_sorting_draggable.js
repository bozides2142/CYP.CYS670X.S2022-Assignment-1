"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridColumnSortingDraggable = exports.defaultSortDescLabel = exports.defaultSortAscLabel = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _accessibility = require("../../accessibility");

var _button = require("../../button");

var _drag_and_drop = require("../../drag_and_drop");

var _flex = require("../../flex");

var _i18n = require("../../i18n");

var _icon = require("../../icon");

var _text = require("../../text");

var _token = require("../../token");

var _data_grid_schema = require("../utils/data_grid_schema");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var defaultSortAscLabel = (0, _react2.jsx)(_i18n.EuiI18n, {
  token: "euiColumnSortingDraggable.defaultSortAsc",
  default: "A-Z"
});
exports.defaultSortAscLabel = defaultSortAscLabel;
var defaultSortDescLabel = (0, _react2.jsx)(_i18n.EuiI18n, {
  token: "euiColumnSortingDraggable.defaultSortDesc",
  default: "Z-A"
});
exports.defaultSortDescLabel = defaultSortDescLabel;

var EuiDataGridColumnSortingDraggable = function EuiDataGridColumnSortingDraggable(_ref) {
  var id = _ref.id,
      display = _ref.display,
      direction = _ref.direction,
      index = _ref.index,
      sorting = _ref.sorting,
      schema = _ref.schema,
      schemaDetectors = _ref.schemaDetectors,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["id", "display", "direction", "index", "sorting", "schema", "schemaDetectors"]);
  var schemaDetails = schema.hasOwnProperty(id) && schema[id].columnType != null ? (0, _data_grid_schema.getDetailsForSchema)(schemaDetectors, schema[id].columnType) : null;
  var textSortAsc = schemaDetails != null ? schemaDetails.sortTextAsc : defaultSortAscLabel;
  var textSortDesc = schemaDetails != null ? schemaDetails.sortTextDesc : defaultSortDescLabel;
  var toggleOptions = [{
    id: "".concat(id, "Asc"),
    value: 'asc',
    label: textSortAsc,
    'data-test-subj': "euiDataGridColumnSorting-sortColumn-".concat(id, "-asc")
  }, {
    id: "".concat(id, "Desc"),
    value: 'desc',
    label: textSortDesc,
    'data-test-subj': "euiDataGridColumnSorting-sortColumn-".concat(id, "-desc")
  }];
  return (0, _react2.jsx)(_drag_and_drop.EuiDraggable, (0, _extends2.default)({
    draggableId: id,
    index: index
  }, rest), function (provided, state) {
    return (0, _react2.jsx)("div", {
      className: "euiDataGridColumnSorting__item ".concat(state.isDragging && 'euiDataGridColumnSorting__item-isDragging')
    }, (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiColumnSortingDraggable.activeSortLabel",
      default: "{display} is sorting this data grid",
      values: {
        display: display
      }
    }, function (activeSortLabel) {
      return activeSortLabel;
    }))), (0, _react2.jsx)(_flex.EuiFlexGroup, {
      gutterSize: "xs",
      alignItems: "center",
      responsive: false,
      "data-test-subj": "euiDataGridColumnSorting-sortColumn-".concat(id)
    }, (0, _react2.jsx)(_flex.EuiFlexItem, {
      grow: false
    }, (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiColumnSortingDraggable.removeSortLabel",
      default: "Remove {display} from data grid sort",
      values: {
        display: display
      }
    }, function (removeSortLabel) {
      return (0, _react2.jsx)(_button.EuiButtonIcon, {
        color: "text",
        className: "euiDataGridColumnSorting__button",
        "aria-label": removeSortLabel,
        iconType: "cross",
        onClick: function onClick() {
          var nextColumns = (0, _toConsumableArray2.default)(sorting.columns);
          var columnIndex = nextColumns.map(function (_ref2) {
            var id = _ref2.id;
            return id;
          }).indexOf(id);
          nextColumns.splice(columnIndex, 1);
          sorting.onSort(nextColumns);
        }
      });
    })), (0, _react2.jsx)(_flex.EuiFlexItem, {
      grow: false
    }, (0, _react2.jsx)(_token.EuiToken, {
      color: schemaDetails != null ? schemaDetails.color : undefined,
      iconType: schemaDetails != null ? schemaDetails.icon : 'tokenString'
    })), (0, _react2.jsx)(_flex.EuiFlexItem, {
      "aria-hidden": true
    }, (0, _react2.jsx)(_text.EuiText, {
      size: "xs"
    }, (0, _react2.jsx)("p", null, display))), (0, _react2.jsx)(_flex.EuiFlexItem, {
      className: "euiDataGridColumnSorting__orderButtons"
    }, (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiColumnSortingDraggable.toggleLegend",
      default: "Select sorting method for {display}",
      values: {
        display: display
      }
    }, function (toggleLegend) {
      return (0, _react2.jsx)(_button.EuiButtonGroup, {
        legend: toggleLegend,
        name: id,
        isFullWidth: true,
        options: toggleOptions,
        buttonSize: "compressed",
        className: "euiDataGridColumnSorting__order",
        idSelected: direction === 'asc' ? "".concat(id, "Asc") : "".concat(id, "Desc"),
        onChange: function onChange(_, direction) {
          var nextColumns = (0, _toConsumableArray2.default)(sorting.columns);
          var columnIndex = nextColumns.map(function (_ref3) {
            var id = _ref3.id;
            return id;
          }).indexOf(id);
          nextColumns.splice(columnIndex, 1, {
            id: id,
            direction: direction
          });
          sorting.onSort(nextColumns);
        }
      });
    })), (0, _react2.jsx)(_flex.EuiFlexItem, (0, _extends2.default)({
      grow: false
    }, provided.dragHandleProps), (0, _react2.jsx)("div", provided.dragHandleProps, (0, _react2.jsx)(_icon.EuiIcon, {
      type: "grab",
      color: "subdued"
    })))));
  });
};

exports.EuiDataGridColumnSortingDraggable = EuiDataGridColumnSortingDraggable;