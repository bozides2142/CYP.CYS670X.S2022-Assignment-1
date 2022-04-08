import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import PropTypes from "prop-types";
import { Component } from "react";
import { Result } from "@elastic/react-search-ui-views";
import { withSearch } from "..";
import { Result as ResultType } from "../types";
export var ResultContainer = /*#__PURE__*/function (_Component) {
  _inherits(ResultContainer, _Component);

  var _super = _createSuper(ResultContainer);

  function ResultContainer() {
    var _this;

    _classCallCheck(this, ResultContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClickLink", function (id) {
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

  _createClass(ResultContainer, [{
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
          rest = _objectWithoutProperties(_this$props2, ["className", "result", "titleField", "urlField", "thumbnailField", "view", "trackClickThrough", "shouldTrackClickThrough", "clickThroughTags"]);

      var View = view || Result;
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
}(Component);

_defineProperty(ResultContainer, "propTypes", {
  // Props
  className: PropTypes.string,
  clickThroughTags: PropTypes.arrayOf(PropTypes.string),
  titleField: PropTypes.string,
  urlField: PropTypes.string,
  thumbnailField: PropTypes.string,
  view: PropTypes.func,
  result: ResultType.isRequired,
  shouldTrackClickThrough: PropTypes.bool,
  // Actions
  trackClickThrough: PropTypes.func
});

_defineProperty(ResultContainer, "defaultProps", {
  clickThroughTags: [],
  shouldTrackClickThrough: true
});

export default withSearch(function (_ref) {
  var trackClickThrough = _ref.trackClickThrough;
  return {
    trackClickThrough: trackClickThrough
  };
})(ResultContainer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250YWluZXJzL1Jlc3VsdC5qcyJdLCJuYW1lcyI6WyJQcm9wVHlwZXMiLCJDb21wb25lbnQiLCJSZXN1bHQiLCJ3aXRoU2VhcmNoIiwiUmVzdWx0VHlwZSIsIlJlc3VsdENvbnRhaW5lciIsImlkIiwicHJvcHMiLCJjbGlja1Rocm91Z2hUYWdzIiwic2hvdWxkVHJhY2tDbGlja1Rocm91Z2giLCJ0cmFja0NsaWNrVGhyb3VnaCIsImNsYXNzTmFtZSIsInJlc3VsdCIsInRpdGxlRmllbGQiLCJ1cmxGaWVsZCIsInRodW1ibmFpbEZpZWxkIiwidmlldyIsInJlc3QiLCJWaWV3Iiwia2V5IiwicmF3Iiwib25DbGlja0xpbmsiLCJoYW5kbGVDbGlja0xpbmsiLCJzdHJpbmciLCJhcnJheU9mIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJib29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU9BLFNBQVAsTUFBc0IsWUFBdEI7QUFDQSxTQUFTQyxTQUFULFFBQTBCLE9BQTFCO0FBQ0EsU0FBU0MsTUFBVCxRQUF1QixnQ0FBdkI7QUFFQSxTQUFTQyxVQUFULFFBQTJCLElBQTNCO0FBQ0EsU0FBU0QsTUFBTSxJQUFJRSxVQUFuQixRQUFxQyxVQUFyQztBQUVBLFdBQWFDLGVBQWI7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQSxzRUFvQm9CLFVBQUFDLEVBQUUsRUFBSTtBQUFBLHdCQUtsQixNQUFLQyxLQUxhO0FBQUEsVUFFcEJDLGdCQUZvQixlQUVwQkEsZ0JBRm9CO0FBQUEsVUFHcEJDLHVCQUhvQixlQUdwQkEsdUJBSG9CO0FBQUEsVUFJcEJDLGlCQUpvQixlQUlwQkEsaUJBSm9COztBQU90QixVQUFJRCx1QkFBSixFQUE2QjtBQUMzQkMsUUFBQUEsaUJBQWlCLENBQUNKLEVBQUQsRUFBS0UsZ0JBQUwsQ0FBakI7QUFDRDtBQUNGLEtBOUJIOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLFdBZ0NFLGtCQUFTO0FBQUE7O0FBQUEseUJBZUgsS0FBS0QsS0FmRjtBQUFBLFVBRUxJLFNBRkssZ0JBRUxBLFNBRks7QUFBQSxVQUdMQyxNQUhLLGdCQUdMQSxNQUhLO0FBQUEsVUFJTEMsVUFKSyxnQkFJTEEsVUFKSztBQUFBLFVBS0xDLFFBTEssZ0JBS0xBLFFBTEs7QUFBQSxVQU1MQyxjQU5LLGdCQU1MQSxjQU5LO0FBQUEsVUFPTEMsSUFQSyxnQkFPTEEsSUFQSztBQUFBLFVBU0xOLGlCQVRLLGdCQVNMQSxpQkFUSztBQUFBLFVBV0xELHVCQVhLLGdCQVdMQSx1QkFYSztBQUFBLFVBYUxELGdCQWJLLGdCQWFMQSxnQkFiSztBQUFBLFVBY0ZTLElBZEU7O0FBZ0JQLFVBQU1DLElBQUksR0FBR0YsSUFBSSxJQUFJZCxNQUFyQjtBQUVBLGFBQU9nQixJQUFJO0FBQ1RQLFFBQUFBLFNBQVMsRUFBVEEsU0FEUztBQUVUQyxRQUFBQSxNQUFNLEVBQUVBLE1BRkM7QUFHVE8sUUFBQUEsR0FBRyxtQkFBWVAsTUFBTSxDQUFDTixFQUFQLENBQVVjLEdBQXRCLENBSE07QUFJVEMsUUFBQUEsV0FBVyxFQUFFO0FBQUEsaUJBQU0sTUFBSSxDQUFDQyxlQUFMLENBQXFCVixNQUFNLENBQUNOLEVBQVAsQ0FBVWMsR0FBL0IsQ0FBTjtBQUFBLFNBSko7QUFLVFAsUUFBQUEsVUFBVSxFQUFWQSxVQUxTO0FBTVRDLFFBQUFBLFFBQVEsRUFBUkEsUUFOUztBQU9UQyxRQUFBQSxjQUFjLEVBQWRBO0FBUFMsU0FRTkUsSUFSTSxFQUFYO0FBVUQ7QUE1REg7O0FBQUE7QUFBQSxFQUFxQ2hCLFNBQXJDOztnQkFBYUksZSxlQUNRO0FBQ2pCO0FBQ0FNLEVBQUFBLFNBQVMsRUFBRVgsU0FBUyxDQUFDdUIsTUFGSjtBQUdqQmYsRUFBQUEsZ0JBQWdCLEVBQUVSLFNBQVMsQ0FBQ3dCLE9BQVYsQ0FBa0J4QixTQUFTLENBQUN1QixNQUE1QixDQUhEO0FBSWpCVixFQUFBQSxVQUFVLEVBQUViLFNBQVMsQ0FBQ3VCLE1BSkw7QUFLakJULEVBQUFBLFFBQVEsRUFBRWQsU0FBUyxDQUFDdUIsTUFMSDtBQU1qQlIsRUFBQUEsY0FBYyxFQUFFZixTQUFTLENBQUN1QixNQU5UO0FBT2pCUCxFQUFBQSxJQUFJLEVBQUVoQixTQUFTLENBQUN5QixJQVBDO0FBUWpCYixFQUFBQSxNQUFNLEVBQUVSLFVBQVUsQ0FBQ3NCLFVBUkY7QUFTakJqQixFQUFBQSx1QkFBdUIsRUFBRVQsU0FBUyxDQUFDMkIsSUFUbEI7QUFVakI7QUFDQWpCLEVBQUFBLGlCQUFpQixFQUFFVixTQUFTLENBQUN5QjtBQVhaLEM7O2dCQURScEIsZSxrQkFlVztBQUNwQkcsRUFBQUEsZ0JBQWdCLEVBQUUsRUFERTtBQUVwQkMsRUFBQUEsdUJBQXVCLEVBQUU7QUFGTCxDOztBQWdEeEIsZUFBZU4sVUFBVSxDQUFDO0FBQUEsTUFBR08saUJBQUgsUUFBR0EsaUJBQUg7QUFBQSxTQUE0QjtBQUFFQSxJQUFBQSxpQkFBaUIsRUFBakJBO0FBQUYsR0FBNUI7QUFBQSxDQUFELENBQVYsQ0FDYkwsZUFEYSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb3BUeXBlcyBmcm9tIFwicHJvcC10eXBlc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBSZXN1bHQgfSBmcm9tIFwiQGVsYXN0aWMvcmVhY3Qtc2VhcmNoLXVpLXZpZXdzXCI7XG5cbmltcG9ydCB7IHdpdGhTZWFyY2ggfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IFJlc3VsdCBhcyBSZXN1bHRUeXBlIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBSZXN1bHRDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFByb3BzXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsaWNrVGhyb3VnaFRhZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHRpdGxlRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdXJsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGh1bWJuYWlsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcmVzdWx0OiBSZXN1bHRUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2hvdWxkVHJhY2tDbGlja1Rocm91Z2g6IFByb3BUeXBlcy5ib29sLFxuICAgIC8vIEFjdGlvbnNcbiAgICB0cmFja0NsaWNrVGhyb3VnaDogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNsaWNrVGhyb3VnaFRhZ3M6IFtdLFxuICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoOiB0cnVlXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2tMaW5rID0gaWQgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNsaWNrVGhyb3VnaFRhZ3MsXG4gICAgICBzaG91bGRUcmFja0NsaWNrVGhyb3VnaCxcbiAgICAgIHRyYWNrQ2xpY2tUaHJvdWdoXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoc2hvdWxkVHJhY2tDbGlja1Rocm91Z2gpIHtcbiAgICAgIHRyYWNrQ2xpY2tUaHJvdWdoKGlkLCBjbGlja1Rocm91Z2hUYWdzKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpdGxlRmllbGQsXG4gICAgICB1cmxGaWVsZCxcbiAgICAgIHRodW1ibmFpbEZpZWxkLFxuICAgICAgdmlldyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgdHJhY2tDbGlja1Rocm91Z2gsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHNob3VsZFRyYWNrQ2xpY2tUaHJvdWdoLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBjbGlja1Rocm91Z2hUYWdzLFxuICAgICAgLi4ucmVzdFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3IHx8IFJlc3VsdDtcblxuICAgIHJldHVybiBWaWV3KHtcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAga2V5OiBgcmVzdWx0LSR7cmVzdWx0LmlkLnJhd31gLFxuICAgICAgb25DbGlja0xpbms6ICgpID0+IHRoaXMuaGFuZGxlQ2xpY2tMaW5rKHJlc3VsdC5pZC5yYXcpLFxuICAgICAgdGl0bGVGaWVsZCxcbiAgICAgIHVybEZpZWxkLFxuICAgICAgdGh1bWJuYWlsRmllbGQsXG4gICAgICAuLi5yZXN0XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgd2l0aFNlYXJjaCgoeyB0cmFja0NsaWNrVGhyb3VnaCB9KSA9PiAoeyB0cmFja0NsaWNrVGhyb3VnaCB9KSkoXG4gIFJlc3VsdENvbnRhaW5lclxuKTtcbiJdfQ==