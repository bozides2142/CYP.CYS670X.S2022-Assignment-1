"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSuggest = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _suggest_item = require("./suggest_item");

var _suggest_input = require("./suggest_input");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EuiSuggest = function EuiSuggest(props) {
  var onItemClick = props.onItemClick,
      onInputChange = props.onInputChange,
      status = props.status,
      append = props.append,
      tooltipContent = props.tooltipContent,
      suggestions = props.suggestions,
      rest = (0, _objectWithoutProperties2.default)(props, ["onItemClick", "onInputChange", "status", "append", "tooltipContent", "suggestions"]);

  var onChange = function onChange(e) {
    onInputChange ? onInputChange(e.target) : null;
  };

  var suggestionList = suggestions.map(function (item, index) {
    var props = _objectSpread({}, item);

    if (onItemClick) {
      props.onClick = function () {
        return onItemClick(item);
      };
    }

    return (0, _react2.jsx)(_suggest_item.EuiSuggestItem, (0, _extends2.default)({
      key: index
    }, props));
  });
  var suggestInput = (0, _react2.jsx)(_suggest_input.EuiSuggestInput, (0, _extends2.default)({
    status: status,
    tooltipContent: tooltipContent,
    append: append,
    suggestions: suggestionList
  }, rest));
  return (0, _react2.jsx)("div", {
    onChange: onChange
  }, suggestInput);
};

exports.EuiSuggest = EuiSuggest;
_suggest_input.EuiSuggestInput.defaultProps = {
  status: 'unchanged'
};