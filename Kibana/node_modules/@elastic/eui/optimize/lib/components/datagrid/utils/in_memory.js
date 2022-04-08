"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridInMemoryRenderer = exports.useInMemoryValues = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _react2 = require("../../../services/react");

var _mutation_observer = require("../../observer/mutation_observer");

var _react3 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * inMemory values hook
 */
var useInMemoryValues = function useInMemoryValues(inMemory, rowCount) {
  /**
   * For performance, `onCellRender` below mutates the inMemoryValues object
   * instead of cloning. If this operation were done in a setState call
   * React would ignore the update as the object itself has not changed.
   * So, we keep a dual record: the in-memory values themselves and a "version" counter.
   * When the object is mutated, the version is incremented triggering a re-render, and
   * the returned `inMemoryValues` object is re-created (cloned) from the mutated version.
   * The version updates are batched, so only one clone happens per batch.
   **/
  var _inMemoryValues = (0, _react.useRef)({});

  var _useState = (0, _react.useState)(0),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      inMemoryValuesVersion = _useState2[0],
      setInMemoryValuesVersion = _useState2[1]; // eslint-disable-next-line react-hooks/exhaustive-deps


  var inMemoryValues = (0, _react.useMemo)(function () {
    return _objectSpread({}, _inMemoryValues.current);
  }, [inMemoryValuesVersion]);
  var onCellRender = (0, _react.useCallback)(function (rowIndex, columnId, value) {
    var nextInMemoryValues = _inMemoryValues.current;
    nextInMemoryValues[rowIndex] = nextInMemoryValues[rowIndex] || {};

    if (nextInMemoryValues[rowIndex][columnId] !== value) {
      nextInMemoryValues[rowIndex][columnId] = value;
      setInMemoryValuesVersion(function (version) {
        return version + 1;
      });
    }
  }, []); // if `inMemory.level` or `rowCount` changes reset the values

  var inMemoryLevel = inMemory && inMemory.level;
  var resetRunCount = (0, _react.useRef)(0);
  (0, _react.useEffect)(function () {
    if (resetRunCount.current++ > 0) {
      // this has to delete "overflow" keys from the object instead of resetting to an empty one,
      // as the internal inmemoryrenderer component's useEffect which sets the values
      // executes before this outer, wrapping useEffect
      var existingRowKeyCount = Object.keys(_inMemoryValues.current).length;

      for (var i = rowCount; i < existingRowKeyCount; i++) {
        delete _inMemoryValues.current[i];
      }

      setInMemoryValuesVersion(function (version) {
        return version + 1;
      });
    }
  }, [inMemoryLevel, rowCount]);
  return [inMemoryValues, onCellRender];
};
/**
 * InMemory renderer
 */


exports.useInMemoryValues = useInMemoryValues;

var EuiDataGridInMemoryRenderer = function EuiDataGridInMemoryRenderer(_ref) {
  var inMemory = _ref.inMemory,
      columns = _ref.columns,
      rowCount = _ref.rowCount,
      renderCellValue = _ref.renderCellValue,
      onCellRender = _ref.onCellRender;

  var _useState3 = (0, _react.useState)(function () {
    return document.createDocumentFragment();
  }),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 1),
      documentFragment = _useState4[0];

  var cells = (0, _react.useMemo)(function () {
    var CellElement = renderCellValue;
    var cells = [];

    var _loop = function _loop(i) {
      cells.push(columns.map(function (column) {
        var skipThisColumn = inMemory.skipColumns && inMemory.skipColumns.indexOf(column.id) !== -1;

        if (skipThisColumn) {
          return null;
        }

        var isExpandable = column.isExpandable !== undefined ? column.isExpandable : true;
        return (0, _react3.jsx)("div", {
          key: "".concat(i, "-").concat(column.id),
          "data-dg-row": i,
          "data-dg-column": column.id
        }, (0, _react3.jsx)(CellElement, {
          rowIndex: i,
          columnId: column.id,
          setCellProps: noop,
          isExpandable: isExpandable,
          isExpanded: false,
          isDetails: false
        }));
      }).filter(function (cell) {
        return cell != null;
      }));
    };

    for (var i = 0; i < rowCount; i++) {
      _loop(i);
    }

    return cells;
  }, [rowCount, columns, inMemory.skipColumns, renderCellValue]);
  var onMutation = (0, _react.useCallback)(function (records) {
    var _loop2 = function _loop2(i) {
      var record = records[i];
      var target = record.target;

      while (true) {
        if (target == null) return "continue|recordLoop"; // somehow hit the document fragment

        if (target.nodeType === Node.ELEMENT_NODE && target.hasAttribute('data-dg-row')) {
          // target is the cell wrapping div
          break;
        }

        target = target.parentElement;
      }

      var cellDiv = target;
      var rowIndex = parseInt(cellDiv.getAttribute('data-dg-row'), 10);
      var column = cellDiv.getAttribute('data-dg-column');
      (0, _react2.enqueueStateChange)(function () {
        return onCellRender(rowIndex, column, getElementText(cellDiv));
      });
    };

    recordLoop: for (var i = 0; i < records.length; i++) {
      var _ret = _loop2(i);

      if (_ret === "continue|recordLoop") continue recordLoop;
    }
  }, [onCellRender]);
  (0, _react.useEffect)(function () {
    var cellDivs = documentFragment.childNodes[0].childNodes;

    for (var i = 0; i < cellDivs.length; i++) {
      var cellDiv = cellDivs[i];

      var _rowIndex = parseInt(cellDiv.getAttribute('data-dg-row'), 10);

      var column = cellDiv.getAttribute('data-dg-column');
      onCellRender(_rowIndex, column, getElementText(cellDiv));
    } // changes to documentFragment.children is reflected by `cells`
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [onCellRender, cells]);
  return /*#__PURE__*/(0, _reactDom.createPortal)((0, _react3.jsx)(_mutation_observer.EuiMutationObserver, {
    onMutation: onMutation,
    observerOptions: {
      characterData: true,
      subtree: true,
      attributes: true,
      childList: true
    }
  }, function (ref) {
    return (0, _react3.jsx)("div", {
      ref: ref
    }, cells);
  }), documentFragment);
};

exports.EuiDataGridInMemoryRenderer = EuiDataGridInMemoryRenderer;

function noop() {}

function getElementText(element) {
  return 'innerText' in element ? element.innerText : // (this line left here to satisfy Prettier since a ts-ignore is used on the next line)
  // @ts-ignore TypeScript thinks element.innerText always exists, however it doesn't in jest/jsdom environment
  element.textContent || '';
}