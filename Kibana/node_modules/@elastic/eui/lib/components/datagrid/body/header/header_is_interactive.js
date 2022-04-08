"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHeaderIsInteractive = void 0;

var _react = require("react");

var _tabbable = _interopRequireDefault(require("tabbable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useHeaderIsInteractive = function useHeaderIsInteractive(gridElement) {
  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      headerIsInteractive = _useState2[0],
      setHeaderIsInteractive = _useState2[1];

  var handleHeaderChange = (0, _react.useCallback)(function (headerRow) {
    var tabbables = (0, _tabbable.default)(headerRow);
    var managed = headerRow.querySelectorAll('[data-euigrid-tab-managed]');
    var hasInteractives = tabbables.length > 0 || managed.length > 0;

    if (hasInteractives !== headerIsInteractive) {
      setHeaderIsInteractive(hasInteractives);
    }
  }, [headerIsInteractive]); // Set headerIsInteractive on data grid init/load

  (0, _react.useEffect)(function () {
    if (gridElement) {
      var headerElement = gridElement.querySelector('[data-test-subj~=dataGridHeader]');

      if (headerElement) {
        handleHeaderChange(headerElement);
      }
    }
  }, [gridElement, handleHeaderChange]); // Update headerIsInteractive if the header changes (e.g., columns are hidden)
  // Used in header mutation observer set in EuiDataGridBody

  var handleHeaderMutation = (0, _react.useCallback)(function (records) {
    var _records = _slicedToArray(records, 1),
        target = _records[0].target; // find the wrapping header div


    var headerRow = target.parentElement;

    while (headerRow && (headerRow.getAttribute('data-test-subj') || '').split(/\s+/).indexOf('dataGridHeader') === -1) {
      headerRow = headerRow.parentElement;
    }

    if (headerRow) handleHeaderChange(headerRow);
  }, [handleHeaderChange]);
  return {
    headerIsInteractive: headerIsInteractive,
    handleHeaderMutation: handleHeaderMutation
  };
};

exports.useHeaderIsInteractive = useHeaderIsInteractive;