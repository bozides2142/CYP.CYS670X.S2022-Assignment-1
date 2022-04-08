"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ResultsContainer = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactSearchUiViews = require("@elastic/react-search-ui-views");

var _ = require("..");

var _2 = require(".");

var _types = require("../types");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

var ResultsContainer = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(ResultsContainer, _Component);

  var _super = _createSuper(ResultsContainer);

  function ResultsContainer() {
    (0, _classCallCheck2.default)(this, ResultsContainer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ResultsContainer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          clickThroughTags = _this$props.clickThroughTags,
          resultView = _this$props.resultView,
          results = _this$props.results,
          shouldTrackClickThrough = _this$props.shouldTrackClickThrough,
          titleField = _this$props.titleField,
          urlField = _this$props.urlField,
          thumbnailField = _this$props.thumbnailField,
          view = _this$props.view,
          rest = (0, _objectWithoutProperties2.default)(_this$props, ["className", "clickThroughTags", "resultView", "results", "shouldTrackClickThrough", "titleField", "urlField", "thumbnailField", "view"]);
      var View = view || _reactSearchUiViews.Results;
      var ResultView = resultView || _reactSearchUiViews.Result;
      return View(_objectSpread({
        className: className,
        children: results.map(function (result) {
          return /*#__PURE__*/_react.default.createElement(_2.Result, {
            key: "result-".concat(getRaw(result, "id")),
            titleField: titleField,
            urlField: urlField,
            thumbnailField: thumbnailField,
            view: ResultView,
            result: result,
            shouldTrackClickThrough: shouldTrackClickThrough,
            clickThroughTags: clickThroughTags
          });
        })
      }, rest));
    }
  }]);
  return ResultsContainer;
}(_react.Component);

exports.ResultsContainer = ResultsContainer;
(0, _defineProperty2.default)(ResultsContainer, "propTypes", {
  // Props
  className: _propTypes.default.string,
  clickThroughTags: _propTypes.default.arrayOf(_propTypes.default.string),
  resultView: _propTypes.default.func,
  titleField: _propTypes.default.string,
  urlField: _propTypes.default.string,
  thumbnailField: _propTypes.default.string,
  view: _propTypes.default.func,
  shouldTrackClickThrough: _propTypes.default.bool,
  // State
  results: _propTypes.default.arrayOf(_types.Result).isRequired
});
(0, _defineProperty2.default)(ResultsContainer, "defaultProps", {
  clickThroughTags: [],
  shouldTrackClickThrough: true
});

var _default = (0, _.withSearch)(function (_ref) {
  var results = _ref.results;
  return {
    results: results
  };
})(ResultsContainer);

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250YWluZXJzL1Jlc3VsdHMuanMiXSwibmFtZXMiOlsiZ2V0UmF3IiwicmVzdWx0IiwidmFsdWUiLCJyYXciLCJSZXN1bHRzQ29udGFpbmVyIiwicHJvcHMiLCJjbGFzc05hbWUiLCJjbGlja1Rocm91Z2hUYWdzIiwicmVzdWx0VmlldyIsInJlc3VsdHMiLCJzaG91bGRUcmFja0NsaWNrVGhyb3VnaCIsInRpdGxlRmllbGQiLCJ1cmxGaWVsZCIsInRodW1ibmFpbEZpZWxkIiwidmlldyIsInJlc3QiLCJWaWV3IiwiUmVzdWx0cyIsIlJlc3VsdFZpZXciLCJSZXN1bHQiLCJjaGlsZHJlbiIsIm1hcCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInN0cmluZyIsImFycmF5T2YiLCJmdW5jIiwiYm9vbCIsIlJlc3VsdFR5cGUiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSxNQUFULENBQWdCQyxNQUFoQixFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsTUFBSSxDQUFDRCxNQUFNLENBQUNDLEtBQUQsQ0FBUCxJQUFrQixDQUFDRCxNQUFNLENBQUNDLEtBQUQsQ0FBTixDQUFjQyxHQUFyQyxFQUEwQztBQUMxQyxTQUFPRixNQUFNLENBQUNDLEtBQUQsQ0FBTixDQUFjQyxHQUFyQjtBQUNEOztJQUVZQyxnQjs7Ozs7Ozs7Ozs7O1dBb0JYLGtCQUFTO0FBQUEsd0JBWUgsS0FBS0MsS0FaRjtBQUFBLFVBRUxDLFNBRkssZUFFTEEsU0FGSztBQUFBLFVBR0xDLGdCQUhLLGVBR0xBLGdCQUhLO0FBQUEsVUFJTEMsVUFKSyxlQUlMQSxVQUpLO0FBQUEsVUFLTEMsT0FMSyxlQUtMQSxPQUxLO0FBQUEsVUFNTEMsdUJBTkssZUFNTEEsdUJBTks7QUFBQSxVQU9MQyxVQVBLLGVBT0xBLFVBUEs7QUFBQSxVQVFMQyxRQVJLLGVBUUxBLFFBUks7QUFBQSxVQVNMQyxjQVRLLGVBU0xBLGNBVEs7QUFBQSxVQVVMQyxJQVZLLGVBVUxBLElBVks7QUFBQSxVQVdGQyxJQVhFO0FBY1AsVUFBTUMsSUFBSSxHQUFHRixJQUFJLElBQUlHLDJCQUFyQjtBQUNBLFVBQU1DLFVBQVUsR0FBR1YsVUFBVSxJQUFJVywwQkFBakM7QUFFQSxhQUFPSCxJQUFJO0FBQ1RWLFFBQUFBLFNBQVMsRUFBRUEsU0FERjtBQUVUYyxRQUFBQSxRQUFRLEVBQUVYLE9BQU8sQ0FBQ1ksR0FBUixDQUFZLFVBQUFwQixNQUFNO0FBQUEsOEJBQzFCLDZCQUFDLFNBQUQ7QUFDRSxZQUFBLEdBQUcsbUJBQVlELE1BQU0sQ0FBQ0MsTUFBRCxFQUFTLElBQVQsQ0FBbEIsQ0FETDtBQUVFLFlBQUEsVUFBVSxFQUFFVSxVQUZkO0FBR0UsWUFBQSxRQUFRLEVBQUVDLFFBSFo7QUFJRSxZQUFBLGNBQWMsRUFBRUMsY0FKbEI7QUFLRSxZQUFBLElBQUksRUFBRUssVUFMUjtBQU1FLFlBQUEsTUFBTSxFQUFFakIsTUFOVjtBQU9FLFlBQUEsdUJBQXVCLEVBQUVTLHVCQVAzQjtBQVFFLFlBQUEsZ0JBQWdCLEVBQUVIO0FBUnBCLFlBRDBCO0FBQUEsU0FBbEI7QUFGRCxTQWNOUSxJQWRNLEVBQVg7QUFnQkQ7OztFQXJEbUNPLGdCOzs7OEJBQXpCbEIsZ0IsZUFDUTtBQUNqQjtBQUNBRSxFQUFBQSxTQUFTLEVBQUVpQixtQkFBVUMsTUFGSjtBQUdqQmpCLEVBQUFBLGdCQUFnQixFQUFFZ0IsbUJBQVVFLE9BQVYsQ0FBa0JGLG1CQUFVQyxNQUE1QixDQUhEO0FBSWpCaEIsRUFBQUEsVUFBVSxFQUFFZSxtQkFBVUcsSUFKTDtBQUtqQmYsRUFBQUEsVUFBVSxFQUFFWSxtQkFBVUMsTUFMTDtBQU1qQlosRUFBQUEsUUFBUSxFQUFFVyxtQkFBVUMsTUFOSDtBQU9qQlgsRUFBQUEsY0FBYyxFQUFFVSxtQkFBVUMsTUFQVDtBQVFqQlYsRUFBQUEsSUFBSSxFQUFFUyxtQkFBVUcsSUFSQztBQVNqQmhCLEVBQUFBLHVCQUF1QixFQUFFYSxtQkFBVUksSUFUbEI7QUFVakI7QUFDQWxCLEVBQUFBLE9BQU8sRUFBRWMsbUJBQVVFLE9BQVYsQ0FBa0JHLGFBQWxCLEVBQThCQztBQVh0QixDOzhCQURSekIsZ0Isa0JBZVc7QUFDcEJHLEVBQUFBLGdCQUFnQixFQUFFLEVBREU7QUFFcEJHLEVBQUFBLHVCQUF1QixFQUFFO0FBRkwsQzs7ZUF5Q1Qsa0JBQVc7QUFBQSxNQUFHRCxPQUFILFFBQUdBLE9BQUg7QUFBQSxTQUFrQjtBQUFFQSxJQUFBQSxPQUFPLEVBQVBBO0FBQUYsR0FBbEI7QUFBQSxDQUFYLEVBQTJDTCxnQkFBM0MsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFJlc3VsdCwgUmVzdWx0cyB9IGZyb20gXCJAZWxhc3RpYy9yZWFjdC1zZWFyY2gtdWktdmlld3NcIjtcblxuaW1wb3J0IHsgd2l0aFNlYXJjaCB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgUmVzdWx0IGFzIFJlc3VsdENvbnRhaW5lciB9IGZyb20gXCIuXCI7XG5pbXBvcnQgeyBSZXN1bHQgYXMgUmVzdWx0VHlwZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5mdW5jdGlvbiBnZXRSYXcocmVzdWx0LCB2YWx1ZSkge1xuICBpZiAoIXJlc3VsdFt2YWx1ZV0gfHwgIXJlc3VsdFt2YWx1ZV0ucmF3KSByZXR1cm47XG4gIHJldHVybiByZXN1bHRbdmFsdWVdLnJhdztcbn1cblxuZXhwb3J0IGNsYXNzIFJlc3VsdHNDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFByb3BzXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsaWNrVGhyb3VnaFRhZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHJlc3VsdFZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICAgIHRpdGxlRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdXJsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGh1bWJuYWlsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgc2hvdWxkVHJhY2tDbGlja1Rocm91Z2g6IFByb3BUeXBlcy5ib29sLFxuICAgIC8vIFN0YXRlXG4gICAgcmVzdWx0czogUHJvcFR5cGVzLmFycmF5T2YoUmVzdWx0VHlwZSkuaXNSZXF1aXJlZFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY2xpY2tUaHJvdWdoVGFnczogW10sXG4gICAgc2hvdWxkVHJhY2tDbGlja1Rocm91Z2g6IHRydWVcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2xhc3NOYW1lLFxuICAgICAgY2xpY2tUaHJvdWdoVGFncyxcbiAgICAgIHJlc3VsdFZpZXcsXG4gICAgICByZXN1bHRzLFxuICAgICAgc2hvdWxkVHJhY2tDbGlja1Rocm91Z2gsXG4gICAgICB0aXRsZUZpZWxkLFxuICAgICAgdXJsRmllbGQsXG4gICAgICB0aHVtYm5haWxGaWVsZCxcbiAgICAgIHZpZXcsXG4gICAgICAuLi5yZXN0XG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBWaWV3ID0gdmlldyB8fCBSZXN1bHRzO1xuICAgIGNvbnN0IFJlc3VsdFZpZXcgPSByZXN1bHRWaWV3IHx8IFJlc3VsdDtcblxuICAgIHJldHVybiBWaWV3KHtcbiAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgICAgY2hpbGRyZW46IHJlc3VsdHMubWFwKHJlc3VsdCA9PiAoXG4gICAgICAgIDxSZXN1bHRDb250YWluZXJcbiAgICAgICAgICBrZXk9e2ByZXN1bHQtJHtnZXRSYXcocmVzdWx0LCBcImlkXCIpfWB9XG4gICAgICAgICAgdGl0bGVGaWVsZD17dGl0bGVGaWVsZH1cbiAgICAgICAgICB1cmxGaWVsZD17dXJsRmllbGR9XG4gICAgICAgICAgdGh1bWJuYWlsRmllbGQ9e3RodW1ibmFpbEZpZWxkfVxuICAgICAgICAgIHZpZXc9e1Jlc3VsdFZpZXd9XG4gICAgICAgICAgcmVzdWx0PXtyZXN1bHR9XG4gICAgICAgICAgc2hvdWxkVHJhY2tDbGlja1Rocm91Z2g9e3Nob3VsZFRyYWNrQ2xpY2tUaHJvdWdofVxuICAgICAgICAgIGNsaWNrVGhyb3VnaFRhZ3M9e2NsaWNrVGhyb3VnaFRhZ3N9XG4gICAgICAgIC8+XG4gICAgICApKSxcbiAgICAgIC4uLnJlc3RcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB3aXRoU2VhcmNoKCh7IHJlc3VsdHMgfSkgPT4gKHsgcmVzdWx0cyB9KSkoUmVzdWx0c0NvbnRhaW5lcik7XG4iXX0=