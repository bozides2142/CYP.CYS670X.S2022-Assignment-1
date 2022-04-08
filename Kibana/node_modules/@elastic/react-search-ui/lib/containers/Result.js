"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ResultContainer = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = require("react");

var _reactSearchUiViews = require("@elastic/react-search-ui-views");

var _ = require("..");

var _types = require("../types");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ResultContainer = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(ResultContainer, _Component);

  var _super = _createSuper(ResultContainer);

  function ResultContainer() {
    var _this;

    (0, _classCallCheck2.default)(this, ResultContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClickLink", function (id) {
      var _this$props = _this.props,
          clickThroughTags = _this$props.clickThroughTags,
          shouldTrackClickThrough = _this$props.shouldTrackClickThrough,
          trackClickThrough = _this$props.trackClickThrough;

      if (shouldTrackClickThrough) {
        trackClickThrough(id, clickThroughTags);
      }
    });
    return _this;
  }

  (0, _createClass2.default)(ResultContainer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          className = _this$props2.className,
          result = _this$props2.result,
          titleField = _this$props2.titleField,
          urlField = _this$props2.urlField,
          thumbnailField = _this$props2.thumbnailField,
          view = _this$props2.view,
          trackClickThrough = _this$props2.trackClickThrough,
          shouldTrackClickThrough = _this$props2.shouldTrackClickThrough,
          clickThroughTags = _this$props2.clickThroughTags,
          rest = (0, _objectWithoutProperties2.default)(_this$props2, ["className", "result", "titleField", "urlField", "thumbnailField", "view", "trackClickThrough", "shouldTrackClickThrough", "clickThroughTags"]);
      var View = view || _reactSearchUiViews.Result;
      return View(_objectSpread({
        className: className,
        result: result,
        key: "result-".concat(result.id.raw),
        onClickLink: function onClickLink() {
          return _this2.handleClickLink(result.id.raw);
        },
        titleField: titleField,
        urlField: urlField,
        thumbnailField: thumbnailField
      }, rest));
    }
  }]);
  return ResultContainer;
}(_react.Component);

exports.ResultContainer = ResultContainer;
(0, _defineProperty2.default)(ResultContainer, "propTypes", {
  // Props
  className: _propTypes.default.string,
  clickThroughTags: _propTypes.default.arrayOf(_propTypes.default.string),
  titleField: _propTypes.default.string,
  urlField: _propTypes.default.string,
  thumbnailField: _propTypes.default.string,
  view: _propTypes.default.func,
  result: _types.Result.isRequired,
  shouldTrackClickThrough: _propTypes.default.bool,
  // Actions
  trackClickThrough: _propTypes.default.func
});
(0, _defineProperty2.default)(ResultContainer, "defaultProps", {
  clickThroughTags: [],
  shouldTrackClickThrough: true
});

var _default = (0, _.withSearch)(function (_ref) {
  var trackClickThrough = _ref.trackClickThrough;
  return {
    trackClickThrough: trackClickThrough
  };
})(ResultContainer);

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250YWluZXJzL1Jlc3VsdC5qcyJdLCJuYW1lcyI6WyJSZXN1bHRDb250YWluZXIiLCJpZCIsInByb3BzIiwiY2xpY2tUaHJvdWdoVGFncyIsInNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoIiwidHJhY2tDbGlja1Rocm91Z2giLCJjbGFzc05hbWUiLCJyZXN1bHQiLCJ0aXRsZUZpZWxkIiwidXJsRmllbGQiLCJ0aHVtYm5haWxGaWVsZCIsInZpZXciLCJyZXN0IiwiVmlldyIsIlJlc3VsdCIsImtleSIsInJhdyIsIm9uQ2xpY2tMaW5rIiwiaGFuZGxlQ2xpY2tMaW5rIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYXJyYXlPZiIsImZ1bmMiLCJSZXN1bHRUeXBlIiwiaXNSZXF1aXJlZCIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7OztJQUVhQSxlOzs7Ozs7Ozs7Ozs7Ozs7a0dBb0JPLFVBQUFDLEVBQUUsRUFBSTtBQUFBLHdCQUtsQixNQUFLQyxLQUxhO0FBQUEsVUFFcEJDLGdCQUZvQixlQUVwQkEsZ0JBRm9CO0FBQUEsVUFHcEJDLHVCQUhvQixlQUdwQkEsdUJBSG9CO0FBQUEsVUFJcEJDLGlCQUpvQixlQUlwQkEsaUJBSm9COztBQU90QixVQUFJRCx1QkFBSixFQUE2QjtBQUMzQkMsUUFBQUEsaUJBQWlCLENBQUNKLEVBQUQsRUFBS0UsZ0JBQUwsQ0FBakI7QUFDRDtBQUNGLEs7Ozs7OztXQUVELGtCQUFTO0FBQUE7O0FBQUEseUJBZUgsS0FBS0QsS0FmRjtBQUFBLFVBRUxJLFNBRkssZ0JBRUxBLFNBRks7QUFBQSxVQUdMQyxNQUhLLGdCQUdMQSxNQUhLO0FBQUEsVUFJTEMsVUFKSyxnQkFJTEEsVUFKSztBQUFBLFVBS0xDLFFBTEssZ0JBS0xBLFFBTEs7QUFBQSxVQU1MQyxjQU5LLGdCQU1MQSxjQU5LO0FBQUEsVUFPTEMsSUFQSyxnQkFPTEEsSUFQSztBQUFBLFVBU0xOLGlCQVRLLGdCQVNMQSxpQkFUSztBQUFBLFVBV0xELHVCQVhLLGdCQVdMQSx1QkFYSztBQUFBLFVBYUxELGdCQWJLLGdCQWFMQSxnQkFiSztBQUFBLFVBY0ZTLElBZEU7QUFnQlAsVUFBTUMsSUFBSSxHQUFHRixJQUFJLElBQUlHLDBCQUFyQjtBQUVBLGFBQU9ELElBQUk7QUFDVFAsUUFBQUEsU0FBUyxFQUFUQSxTQURTO0FBRVRDLFFBQUFBLE1BQU0sRUFBRUEsTUFGQztBQUdUUSxRQUFBQSxHQUFHLG1CQUFZUixNQUFNLENBQUNOLEVBQVAsQ0FBVWUsR0FBdEIsQ0FITTtBQUlUQyxRQUFBQSxXQUFXLEVBQUU7QUFBQSxpQkFBTSxNQUFJLENBQUNDLGVBQUwsQ0FBcUJYLE1BQU0sQ0FBQ04sRUFBUCxDQUFVZSxHQUEvQixDQUFOO0FBQUEsU0FKSjtBQUtUUixRQUFBQSxVQUFVLEVBQVZBLFVBTFM7QUFNVEMsUUFBQUEsUUFBUSxFQUFSQSxRQU5TO0FBT1RDLFFBQUFBLGNBQWMsRUFBZEE7QUFQUyxTQVFORSxJQVJNLEVBQVg7QUFVRDs7O0VBNURrQ08sZ0I7Ozs4QkFBeEJuQixlLGVBQ1E7QUFDakI7QUFDQU0sRUFBQUEsU0FBUyxFQUFFYyxtQkFBVUMsTUFGSjtBQUdqQmxCLEVBQUFBLGdCQUFnQixFQUFFaUIsbUJBQVVFLE9BQVYsQ0FBa0JGLG1CQUFVQyxNQUE1QixDQUhEO0FBSWpCYixFQUFBQSxVQUFVLEVBQUVZLG1CQUFVQyxNQUpMO0FBS2pCWixFQUFBQSxRQUFRLEVBQUVXLG1CQUFVQyxNQUxIO0FBTWpCWCxFQUFBQSxjQUFjLEVBQUVVLG1CQUFVQyxNQU5UO0FBT2pCVixFQUFBQSxJQUFJLEVBQUVTLG1CQUFVRyxJQVBDO0FBUWpCaEIsRUFBQUEsTUFBTSxFQUFFaUIsY0FBV0MsVUFSRjtBQVNqQnJCLEVBQUFBLHVCQUF1QixFQUFFZ0IsbUJBQVVNLElBVGxCO0FBVWpCO0FBQ0FyQixFQUFBQSxpQkFBaUIsRUFBRWUsbUJBQVVHO0FBWFosQzs4QkFEUnZCLGUsa0JBZVc7QUFDcEJHLEVBQUFBLGdCQUFnQixFQUFFLEVBREU7QUFFcEJDLEVBQUFBLHVCQUF1QixFQUFFO0FBRkwsQzs7ZUFnRFQsa0JBQVc7QUFBQSxNQUFHQyxpQkFBSCxRQUFHQSxpQkFBSDtBQUFBLFNBQTRCO0FBQUVBLElBQUFBLGlCQUFpQixFQUFqQkE7QUFBRixHQUE1QjtBQUFBLENBQVgsRUFDYkwsZUFEYSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb3BUeXBlcyBmcm9tIFwicHJvcC10eXBlc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBSZXN1bHQgfSBmcm9tIFwiQGVsYXN0aWMvcmVhY3Qtc2VhcmNoLXVpLXZpZXdzXCI7XG5cbmltcG9ydCB7IHdpdGhTZWFyY2ggfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IFJlc3VsdCBhcyBSZXN1bHRUeXBlIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBSZXN1bHRDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFByb3BzXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsaWNrVGhyb3VnaFRhZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHRpdGxlRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdXJsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGh1bWJuYWlsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcmVzdWx0OiBSZXN1bHRUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2hvdWxkVHJhY2tDbGlja1Rocm91Z2g6IFByb3BUeXBlcy5ib29sLFxuICAgIC8vIEFjdGlvbnNcbiAgICB0cmFja0NsaWNrVGhyb3VnaDogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNsaWNrVGhyb3VnaFRhZ3M6IFtdLFxuICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoOiB0cnVlXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2tMaW5rID0gaWQgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNsaWNrVGhyb3VnaFRhZ3MsXG4gICAgICBzaG91bGRUcmFja0NsaWNrVGhyb3VnaCxcbiAgICAgIHRyYWNrQ2xpY2tUaHJvdWdoXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoc2hvdWxkVHJhY2tDbGlja1Rocm91Z2gpIHtcbiAgICAgIHRyYWNrQ2xpY2tUaHJvdWdoKGlkLCBjbGlja1Rocm91Z2hUYWdzKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpdGxlRmllbGQsXG4gICAgICB1cmxGaWVsZCxcbiAgICAgIHRodW1ibmFpbEZpZWxkLFxuICAgICAgdmlldyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgdHJhY2tDbGlja1Rocm91Z2gsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBjbGlja1Rocm91Z2hUYWdzLFxuICAgICAgLi4ucmVzdFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3IHx8IFJlc3VsdDtcblxuICAgIHJldHVybiBWaWV3KHtcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAga2V5OiBgcmVzdWx0LSR7cmVzdWx0LmlkLnJhd31gLFxuICAgICAgb25DbGlja0xpbms6ICgpID0+IHRoaXMuaGFuZGxlQ2xpY2tMaW5rKHJlc3VsdC5pZC5yYXcpLFxuICAgICAgdGl0bGVGaWVsZCxcbiAgICAgIHVybEZpZWxkLFxuICAgICAgdGh1bWJuYWlsRmllbGQsXG4gICAgICAuLi5yZXN0XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgd2l0aFNlYXJjaCgoeyB0cmFja0NsaWNrVGhyb3VnaCB9KSA9PiAoeyB0cmFja0NsaWNrVGhyb3VnaCB9KSkoXG4gIFJlc3VsdENvbnRhaW5lclxuKTtcbiJdfQ==