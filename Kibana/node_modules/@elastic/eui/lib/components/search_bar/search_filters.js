"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSearchFilters = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _filters = require("./filters");

var _filter_group = require("../filter_group");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EuiSearchFilters = /*#__PURE__*/function (_Component) {
  _inherits(EuiSearchFilters, _Component);

  var _super = _createSuper(EuiSearchFilters);

  function EuiSearchFilters() {
    _classCallCheck(this, EuiSearchFilters);

    return _super.apply(this, arguments);
  }

  _createClass(EuiSearchFilters, [{
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

_defineProperty(EuiSearchFilters, "defaultProps", {
  filters: []
});

EuiSearchFilters.propTypes = {
  query: _propTypes.default.any.isRequired,
  onChange: _propTypes.default.func.isRequired,
  filters: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({
    type: _propTypes.default.oneOf(["is"]).isRequired,
    field: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    negatedName: _propTypes.default.string,
    available: _propTypes.default.func
  }).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOf(["field_value_selection"]).isRequired,
    field: _propTypes.default.string,
    name: _propTypes.default.string.isRequired,

    /**
       * See #FieldValueOptionType
       */
    options: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.shape({
      field: _propTypes.default.string,
      value: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired, _propTypes.default.bool.isRequired, _propTypes.default.shape({
        type: _propTypes.default.oneOf(["date"]).isRequired,
        raw: _propTypes.default.any.isRequired,
        granularity: _propTypes.default.oneOfType([_propTypes.default.shape({
          es: _propTypes.default.oneOf(["d", "w", "M", "y"]).isRequired,
          js: _propTypes.default.oneOf(["day", "week", "month", "year"]).isRequired,
          isSame: _propTypes.default.func.isRequired,
          start: _propTypes.default.func.isRequired,
          startOfNext: _propTypes.default.func.isRequired,
          iso8601: _propTypes.default.func.isRequired
        }).isRequired, _propTypes.default.oneOf([undefined])]).isRequired,
        text: _propTypes.default.string.isRequired,
        resolve: _propTypes.default.func.isRequired
      }).isRequired]).isRequired,
      name: _propTypes.default.string,
      view: _propTypes.default.node
    }).isRequired).isRequired, _propTypes.default.func.isRequired]).isRequired,
    filterWith: _propTypes.default.oneOfType([_propTypes.default.oneOf(["prefix", "includes"]), _propTypes.default.func.isRequired]),
    cache: _propTypes.default.number,
    multiSelect: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.oneOf(["and", "or"])]),
    loadingMessage: _propTypes.default.string,
    noOptionsMessage: _propTypes.default.string,
    searchThreshold: _propTypes.default.number,
    available: _propTypes.default.func,
    autoClose: _propTypes.default.bool,
    operator: _propTypes.default.oneOf(["eq", "exact", "gt", "gte", "lt", "lte"])
  }).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOf(["field_value_toggle"]).isRequired,
    field: _propTypes.default.string.isRequired,
    value: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired, _propTypes.default.bool.isRequired, _propTypes.default.shape({
      type: _propTypes.default.oneOf(["date"]).isRequired,
      raw: _propTypes.default.any.isRequired,
      granularity: _propTypes.default.oneOfType([_propTypes.default.shape({
        es: _propTypes.default.oneOf(["d", "w", "M", "y"]).isRequired,
        js: _propTypes.default.oneOf(["day", "week", "month", "year"]).isRequired,
        isSame: _propTypes.default.func.isRequired,
        start: _propTypes.default.func.isRequired,
        startOfNext: _propTypes.default.func.isRequired,
        iso8601: _propTypes.default.func.isRequired
      }).isRequired, _propTypes.default.oneOf([undefined])]).isRequired,
      text: _propTypes.default.string.isRequired,
      resolve: _propTypes.default.func.isRequired
    }).isRequired]).isRequired,
    name: _propTypes.default.string.isRequired,
    negatedName: _propTypes.default.string,
    available: _propTypes.default.func,
    operator: _propTypes.default.oneOf(["eq", "exact", "gt", "gte", "lt", "lte"])
  }).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOf(["field_value_toggle_group"]).isRequired,
    field: _propTypes.default.string.isRequired,

    /**
       * See #FieldValueToggleGroupFilterItemType
       */
    items: _propTypes.default.arrayOf(_propTypes.default.shape({
      value: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired, _propTypes.default.bool.isRequired]).isRequired,
      name: _propTypes.default.string.isRequired,
      negatedName: _propTypes.default.string,
      operator: _propTypes.default.oneOf(["eq", "exact", "gt", "gte", "lt", "lte"])
    }).isRequired).isRequired,
    available: _propTypes.default.func
  }).isRequired]).isRequired).isRequired
};