import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Result, Results } from "@elastic/react-search-ui-views";
import { withSearch } from "..";
import { Result as ResultContainer } from ".";
import { Result as ResultType } from "../types";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

export var ResultsContainer = /*#__PURE__*/function (_Component) {
  _inherits(ResultsContainer, _Component);

  var _super = _createSuper(ResultsContainer);

  function ResultsContainer() {
    _classCallCheck(this, ResultsContainer);

    return _super.apply(this, arguments);
  }

  _createClass(ResultsContainer, [{
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
          rest = _objectWithoutProperties(_this$props, ["className", "clickThroughTags", "resultView", "results", "shouldTrackClickThrough", "titleField", "urlField", "thumbnailField", "view"]);

      var View = view || Results;
      var ResultView = resultView || Result;
      return View(_objectSpread({
        className: className,
        children: results.map(function (result) {
          return /*#__PURE__*/React.createElement(ResultContainer, {
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
}(Component);

_defineProperty(ResultsContainer, "propTypes", {
  // Props
  className: PropTypes.string,
  clickThroughTags: PropTypes.arrayOf(PropTypes.string),
  resultView: PropTypes.func,
  titleField: PropTypes.string,
  urlField: PropTypes.string,
  thumbnailField: PropTypes.string,
  view: PropTypes.func,
  shouldTrackClickThrough: PropTypes.bool,
  // State
  results: PropTypes.arrayOf(ResultType).isRequired
});

_defineProperty(ResultsContainer, "defaultProps", {
  clickThroughTags: [],
  shouldTrackClickThrough: true
});

export default withSearch(function (_ref) {
  var results = _ref.results;
  return {
    results: results
  };
})(ResultsContainer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250YWluZXJzL1Jlc3VsdHMuanMiXSwibmFtZXMiOlsiUHJvcFR5cGVzIiwiUmVhY3QiLCJDb21wb25lbnQiLCJSZXN1bHQiLCJSZXN1bHRzIiwid2l0aFNlYXJjaCIsIlJlc3VsdENvbnRhaW5lciIsIlJlc3VsdFR5cGUiLCJnZXRSYXciLCJyZXN1bHQiLCJ2YWx1ZSIsInJhdyIsIlJlc3VsdHNDb250YWluZXIiLCJwcm9wcyIsImNsYXNzTmFtZSIsImNsaWNrVGhyb3VnaFRhZ3MiLCJyZXN1bHRWaWV3IiwicmVzdWx0cyIsInNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoIiwidGl0bGVGaWVsZCIsInVybEZpZWxkIiwidGh1bWJuYWlsRmllbGQiLCJ2aWV3IiwicmVzdCIsIlZpZXciLCJSZXN1bHRWaWV3IiwiY2hpbGRyZW4iLCJtYXAiLCJzdHJpbmciLCJhcnJheU9mIiwiZnVuYyIsImJvb2wiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBT0EsU0FBUCxNQUFzQixZQUF0QjtBQUNBLE9BQU9DLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsU0FBU0MsTUFBVCxFQUFpQkMsT0FBakIsUUFBZ0MsZ0NBQWhDO0FBRUEsU0FBU0MsVUFBVCxRQUEyQixJQUEzQjtBQUNBLFNBQVNGLE1BQU0sSUFBSUcsZUFBbkIsUUFBMEMsR0FBMUM7QUFDQSxTQUFTSCxNQUFNLElBQUlJLFVBQW5CLFFBQXFDLFVBQXJDOztBQUVBLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxLQUF4QixFQUErQjtBQUM3QixNQUFJLENBQUNELE1BQU0sQ0FBQ0MsS0FBRCxDQUFQLElBQWtCLENBQUNELE1BQU0sQ0FBQ0MsS0FBRCxDQUFOLENBQWNDLEdBQXJDLEVBQTBDO0FBQzFDLFNBQU9GLE1BQU0sQ0FBQ0MsS0FBRCxDQUFOLENBQWNDLEdBQXJCO0FBQ0Q7O0FBRUQsV0FBYUMsZ0JBQWI7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLFdBb0JFLGtCQUFTO0FBQUEsd0JBWUgsS0FBS0MsS0FaRjtBQUFBLFVBRUxDLFNBRkssZUFFTEEsU0FGSztBQUFBLFVBR0xDLGdCQUhLLGVBR0xBLGdCQUhLO0FBQUEsVUFJTEMsVUFKSyxlQUlMQSxVQUpLO0FBQUEsVUFLTEMsT0FMSyxlQUtMQSxPQUxLO0FBQUEsVUFNTEMsdUJBTkssZUFNTEEsdUJBTks7QUFBQSxVQU9MQyxVQVBLLGVBT0xBLFVBUEs7QUFBQSxVQVFMQyxRQVJLLGVBUUxBLFFBUks7QUFBQSxVQVNMQyxjQVRLLGVBU0xBLGNBVEs7QUFBQSxVQVVMQyxJQVZLLGVBVUxBLElBVks7QUFBQSxVQVdGQyxJQVhFOztBQWNQLFVBQU1DLElBQUksR0FBR0YsSUFBSSxJQUFJbEIsT0FBckI7QUFDQSxVQUFNcUIsVUFBVSxHQUFHVCxVQUFVLElBQUliLE1BQWpDO0FBRUEsYUFBT3FCLElBQUk7QUFDVFYsUUFBQUEsU0FBUyxFQUFFQSxTQURGO0FBRVRZLFFBQUFBLFFBQVEsRUFBRVQsT0FBTyxDQUFDVSxHQUFSLENBQVksVUFBQWxCLE1BQU07QUFBQSw4QkFDMUIsb0JBQUMsZUFBRDtBQUNFLFlBQUEsR0FBRyxtQkFBWUQsTUFBTSxDQUFDQyxNQUFELEVBQVMsSUFBVCxDQUFsQixDQURMO0FBRUUsWUFBQSxVQUFVLEVBQUVVLFVBRmQ7QUFHRSxZQUFBLFFBQVEsRUFBRUMsUUFIWjtBQUlFLFlBQUEsY0FBYyxFQUFFQyxjQUpsQjtBQUtFLFlBQUEsSUFBSSxFQUFFSSxVQUxSO0FBTUUsWUFBQSxNQUFNLEVBQUVoQixNQU5WO0FBT0UsWUFBQSx1QkFBdUIsRUFBRVMsdUJBUDNCO0FBUUUsWUFBQSxnQkFBZ0IsRUFBRUg7QUFScEIsWUFEMEI7QUFBQSxTQUFsQjtBQUZELFNBY05RLElBZE0sRUFBWDtBQWdCRDtBQXJESDs7QUFBQTtBQUFBLEVBQXNDckIsU0FBdEM7O2dCQUFhVSxnQixlQUNRO0FBQ2pCO0FBQ0FFLEVBQUFBLFNBQVMsRUFBRWQsU0FBUyxDQUFDNEIsTUFGSjtBQUdqQmIsRUFBQUEsZ0JBQWdCLEVBQUVmLFNBQVMsQ0FBQzZCLE9BQVYsQ0FBa0I3QixTQUFTLENBQUM0QixNQUE1QixDQUhEO0FBSWpCWixFQUFBQSxVQUFVLEVBQUVoQixTQUFTLENBQUM4QixJQUpMO0FBS2pCWCxFQUFBQSxVQUFVLEVBQUVuQixTQUFTLENBQUM0QixNQUxMO0FBTWpCUixFQUFBQSxRQUFRLEVBQUVwQixTQUFTLENBQUM0QixNQU5IO0FBT2pCUCxFQUFBQSxjQUFjLEVBQUVyQixTQUFTLENBQUM0QixNQVBUO0FBUWpCTixFQUFBQSxJQUFJLEVBQUV0QixTQUFTLENBQUM4QixJQVJDO0FBU2pCWixFQUFBQSx1QkFBdUIsRUFBRWxCLFNBQVMsQ0FBQytCLElBVGxCO0FBVWpCO0FBQ0FkLEVBQUFBLE9BQU8sRUFBRWpCLFNBQVMsQ0FBQzZCLE9BQVYsQ0FBa0J0QixVQUFsQixFQUE4QnlCO0FBWHRCLEM7O2dCQURScEIsZ0Isa0JBZVc7QUFDcEJHLEVBQUFBLGdCQUFnQixFQUFFLEVBREU7QUFFcEJHLEVBQUFBLHVCQUF1QixFQUFFO0FBRkwsQzs7QUF5Q3hCLGVBQWViLFVBQVUsQ0FBQztBQUFBLE1BQUdZLE9BQUgsUUFBR0EsT0FBSDtBQUFBLFNBQWtCO0FBQUVBLElBQUFBLE9BQU8sRUFBUEE7QUFBRixHQUFsQjtBQUFBLENBQUQsQ0FBVixDQUEyQ0wsZ0JBQTNDLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gXCJwcm9wLXR5cGVzXCI7XG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBSZXN1bHQsIFJlc3VsdHMgfSBmcm9tIFwiQGVsYXN0aWMvcmVhY3Qtc2VhcmNoLXVpLXZpZXdzXCI7XG5cbmltcG9ydCB7IHdpdGhTZWFyY2ggfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IFJlc3VsdCBhcyBSZXN1bHRDb250YWluZXIgfSBmcm9tIFwiLlwiO1xuaW1wb3J0IHsgUmVzdWx0IGFzIFJlc3VsdFR5cGUgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZnVuY3Rpb24gZ2V0UmF3KHJlc3VsdCwgdmFsdWUpIHtcbiAgaWYgKCFyZXN1bHRbdmFsdWVdIHx8ICFyZXN1bHRbdmFsdWVdLnJhdykgcmV0dXJuO1xuICByZXR1cm4gcmVzdWx0W3ZhbHVlXS5yYXc7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXN1bHRzQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBQcm9wc1xuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjbGlja1Rocm91Z2hUYWdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICByZXN1bHRWaWV3OiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0aXRsZUZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHVybEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHRodW1ibmFpbEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAvLyBTdGF0ZVxuICAgIHJlc3VsdHM6IFByb3BUeXBlcy5hcnJheU9mKFJlc3VsdFR5cGUpLmlzUmVxdWlyZWRcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNsaWNrVGhyb3VnaFRhZ3M6IFtdLFxuICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoOiB0cnVlXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGNsaWNrVGhyb3VnaFRhZ3MsXG4gICAgICByZXN1bHRWaWV3LFxuICAgICAgcmVzdWx0cyxcbiAgICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoLFxuICAgICAgdGl0bGVGaWVsZCxcbiAgICAgIHVybEZpZWxkLFxuICAgICAgdGh1bWJuYWlsRmllbGQsXG4gICAgICB2aWV3LFxuICAgICAgLi4ucmVzdFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgVmlldyA9IHZpZXcgfHwgUmVzdWx0cztcbiAgICBjb25zdCBSZXN1bHRWaWV3ID0gcmVzdWx0VmlldyB8fCBSZXN1bHQ7XG5cbiAgICByZXR1cm4gVmlldyh7XG4gICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZSxcbiAgICAgIGNoaWxkcmVuOiByZXN1bHRzLm1hcChyZXN1bHQgPT4gKFxuICAgICAgICA8UmVzdWx0Q29udGFpbmVyXG4gICAgICAgICAga2V5PXtgcmVzdWx0LSR7Z2V0UmF3KHJlc3VsdCwgXCJpZFwiKX1gfVxuICAgICAgICAgIHRpdGxlRmllbGQ9e3RpdGxlRmllbGR9XG4gICAgICAgICAgdXJsRmllbGQ9e3VybEZpZWxkfVxuICAgICAgICAgIHRodW1ibmFpbEZpZWxkPXt0aHVtYm5haWxGaWVsZH1cbiAgICAgICAgICB2aWV3PXtSZXN1bHRWaWV3fVxuICAgICAgICAgIHJlc3VsdD17cmVzdWx0fVxuICAgICAgICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoPXtzaG91bGRUcmFja0NsaWNrVGhyb3VnaH1cbiAgICAgICAgICBjbGlja1Rocm91Z2hUYWdzPXtjbGlja1Rocm91Z2hUYWdzfVxuICAgICAgICAvPlxuICAgICAgKSksXG4gICAgICAuLi5yZXN0XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgd2l0aFNlYXJjaCgoeyByZXN1bHRzIH0pID0+ICh7IHJlc3VsdHMgfSkpKFJlc3VsdHNDb250YWluZXIpO1xuIl19