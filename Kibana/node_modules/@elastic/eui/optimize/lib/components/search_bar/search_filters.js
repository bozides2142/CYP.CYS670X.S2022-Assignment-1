"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSearchFilters = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _filters = require("./filters");

var _filter_group = require("../filter_group");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EuiSearchFilters = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiSearchFilters, _Component);

  var _super = _createSuper(EuiSearchFilters);

  function EuiSearchFilters() {
    (0, _classCallCheck2.default)(this, EuiSearchFilters);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EuiSearchFilters, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$filters = _this$props.filters,
          filters = _this$props$filters === void 0 ? [] : _this$props$filters,
          query = _this$props.query,
          onChange = _this$props.onChange;
      var items = [];
      filters.forEach(function (filterConfig, index) {
        if (filterConfig.available && !filterConfig.available()) {
          return;
        }

        var key = "filter_".concat(index);
        var control = (0, _filters.createFilter)(index, filterConfig, query, onChange);
        items.push((0, _react2.jsx)(_react.Fragment, {
          key: key
        }, control));
      });
      return (0, _react2.jsx)(_filter_group.EuiFilterGroup, null, items);
    }
  }]);
  return EuiSearchFilters;
}(_react.Component);

exports.EuiSearchFilters = EuiSearchFilters;
(0, _defineProperty2.default)(EuiSearchFilters, "defaultProps", {
  filters: []
});