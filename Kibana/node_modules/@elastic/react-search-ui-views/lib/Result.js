"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _viewHelpers = require("./view-helpers");

var _FieldValueWrapper = require("./types/FieldValueWrapper");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function getFieldType(result, field, type) {
  if (result[field]) return result[field][type];
}

function getRaw(result, field) {
  return getFieldType(result, field, "raw");
}

function getSnippet(result, field) {
  return getFieldType(result, field, "snippet");
}

function htmlEscape(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getEscapedField(result, field) {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  var safeField = getSnippet(result, field) || htmlEscape(getRaw(result, field));
  return Array.isArray(safeField) ? safeField.join(", ") : safeField;
}

function getEscapedFields(result) {
  return Object.keys(result).reduce(function (acc, field) {
    // If we receive an arbitrary value from the response, we may not properly
    // handle it, so we should filter out arbitrary values here.
    //
    // I.e.,
    // Arbitrary value: "_metaField: '1939191'"
    // vs.
    // FieldValueWrapper: "_metaField: {raw: '1939191'}"
    if (!(0, _FieldValueWrapper.isFieldValueWrapper)(result[field])) return acc;
    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2.default)({}, field, getEscapedField(result, field)));
  }, {});
}

function Result(_ref) {
  var className = _ref.className,
      result = _ref.result,
      onClickLink = _ref.onClickLink,
      titleField = _ref.titleField,
      urlField = _ref.urlField,
      thumbnailField = _ref.thumbnailField,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "result", "onClickLink", "titleField", "urlField", "thumbnailField"]);
  var fields = getEscapedFields(result);
  var title = getEscapedField(result, titleField);
  var url = (0, _viewHelpers.getUrlSanitizer)(URL, location)(getRaw(result, urlField));
  var thumbnail = (0, _viewHelpers.getUrlSanitizer)(URL, location)(getRaw(result, thumbnailField));
  return /*#__PURE__*/_react.default.createElement("li", (0, _extends2.default)({
    className: (0, _viewHelpers.appendClassName)("sui-result", className)
  }, rest), /*#__PURE__*/_react.default.createElement("div", {
    className: "sui-result__header"
  }, title && !url && /*#__PURE__*/_react.default.createElement("span", {
    className: "sui-result__title",
    dangerouslySetInnerHTML: {
      __html: title
    }
  }), title && url && /*#__PURE__*/_react.default.createElement("a", {
    className: "sui-result__title sui-result__title-link",
    dangerouslySetInnerHTML: {
      __html: title
    },
    href: url,
    onClick: onClickLink,
    target: "_blank",
    rel: "noopener noreferrer"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "sui-result__body"
  }, thumbnail && /*#__PURE__*/_react.default.createElement("div", {
    className: "sui-result__image"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: thumbnail,
    alt: ""
  })), /*#__PURE__*/_react.default.createElement("ul", {
    className: "sui-result__details"
  }, Object.entries(fields).map(function (_ref2) {
    var _ref3 = (0, _slicedToArray2.default)(_ref2, 2),
        fieldName = _ref3[0],
        fieldValue = _ref3[1];

    return /*#__PURE__*/_react.default.createElement("li", {
      key: fieldName
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "sui-result__key"
    }, fieldName), " ", /*#__PURE__*/_react.default.createElement("span", {
      className: "sui-result__value",
      dangerouslySetInnerHTML: {
        __html: fieldValue
      }
    }));
  }))));
}

Result.propTypes = {
  result: _propTypes.default.object.isRequired,
  onClickLink: _propTypes.default.func.isRequired,
  className: _propTypes.default.string,
  titleField: _propTypes.default.string,
  urlField: _propTypes.default.string,
  thumbnailField: _propTypes.default.string
};
var _default = Result;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN1bHQuanMiXSwibmFtZXMiOlsiZ2V0RmllbGRUeXBlIiwicmVzdWx0IiwiZmllbGQiLCJ0eXBlIiwiZ2V0UmF3IiwiZ2V0U25pcHBldCIsImh0bWxFc2NhcGUiLCJzdHIiLCJTdHJpbmciLCJyZXBsYWNlIiwiZ2V0RXNjYXBlZEZpZWxkIiwic2FmZUZpZWxkIiwiQXJyYXkiLCJpc0FycmF5Iiwiam9pbiIsImdldEVzY2FwZWRGaWVsZHMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjIiwiUmVzdWx0IiwiY2xhc3NOYW1lIiwib25DbGlja0xpbmsiLCJ0aXRsZUZpZWxkIiwidXJsRmllbGQiLCJ0aHVtYm5haWxGaWVsZCIsInJlc3QiLCJmaWVsZHMiLCJ0aXRsZSIsInVybCIsIlVSTCIsImxvY2F0aW9uIiwidGh1bWJuYWlsIiwiX19odG1sIiwiZW50cmllcyIsIm1hcCIsImZpZWxkTmFtZSIsImZpZWxkVmFsdWUiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsWUFBVCxDQUFzQkMsTUFBdEIsRUFBOEJDLEtBQTlCLEVBQXFDQyxJQUFyQyxFQUEyQztBQUN6QyxNQUFJRixNQUFNLENBQUNDLEtBQUQsQ0FBVixFQUFtQixPQUFPRCxNQUFNLENBQUNDLEtBQUQsQ0FBTixDQUFjQyxJQUFkLENBQVA7QUFDcEI7O0FBRUQsU0FBU0MsTUFBVCxDQUFnQkgsTUFBaEIsRUFBd0JDLEtBQXhCLEVBQStCO0FBQzdCLFNBQU9GLFlBQVksQ0FBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQWdCLEtBQWhCLENBQW5CO0FBQ0Q7O0FBRUQsU0FBU0csVUFBVCxDQUFvQkosTUFBcEIsRUFBNEJDLEtBQTVCLEVBQW1DO0FBQ2pDLFNBQU9GLFlBQVksQ0FBQ0MsTUFBRCxF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aW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBhcHBlbmRDbGFzc05hbWUsIGdldFVybFNhbml0aXplciB9IGZyb20gXCIuL3ZpZXctaGVscGVyc1wiO1xuaW1wb3J0IHsgaXNGaWVsZFZhbHVlV3JhcHBlciB9IGZyb20gXCIuL3R5cGVzL0ZpZWxkVmFsdWVXcmFwcGVyXCI7XG5cbmZ1bmN0aW9uIGdldEZpZWxkVHlwZShyZXN1bHQsIGZpZWxkLCB0eXBlKSB7XG4gIGlmIChyZXN1bHRbZmllbGRdKSByZXR1cm4gcmVzdWx0W2ZpZWxkXVt0eXBlXTtcbn1cblxuZnVuY3Rpb24gZ2V0UmF3KHJlc3VsdCwgZmllbGQpIHtcbiAgcmV0dXJuIGdldEZpZWxkVHlwZShyZXN1bHQsIGZpZWxkLCBcInJhd1wiKTtcbn1cblxuZnVuY3Rpb24gZ2V0U25pcHBldChyZXN1bHQsIGZpZWxkKSB7XG4gIHJldHVybiBnZXRGaWVsZFR5cGUocmVzdWx0LCBmaWVsZCwgXCJzbmlwcGV0XCIpO1xufVxuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cikge1xuICBpZiAoIXN0cikgcmV0dXJuIFwiXCI7XG5cbiAgcmV0dXJuIFN0cmluZyhzdHIpXG4gICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgIC5yZXBsYWNlKC8nL2csIFwiJiMzOTtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIik7XG59XG5cbmZ1bmN0aW9uIGdldEVzY2FwZWRGaWVsZChyZXN1bHQsIGZpZWxkKSB7XG4gIC8vIEZhbGxiYWNrIHRvIHJhdyB2YWx1ZXMgaGVyZSwgYmVjYXVzZSBub24tc3RyaW5nIGZpZWxkc1xuICAvLyB3aWxsIG5vdCBoYXZlIGEgc25pcHBldCBmYWxsYmFjay4gUmF3IHZhbHVlcyBNVVNUIGJlIGh0bWwgZXNjYXBlZC5cbiAgY29uc3Qgc2FmZUZpZWxkID1cbiAgICBnZXRTbmlwcGV0KHJlc3VsdCwgZmllbGQpIHx8IGh0bWxFc2NhcGUoZ2V0UmF3KHJlc3VsdCwgZmllbGQpKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc2FmZUZpZWxkKSA/IHNhZmVGaWVsZC5qb2luKFwiLCBcIikgOiBzYWZlRmllbGQ7XG59XG5cbmZ1bmN0aW9uIGdldEVzY2FwZWRGaWVsZHMocmVzdWx0KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhyZXN1bHQpLnJlZHVjZSgoYWNjLCBmaWVsZCkgPT4ge1xuICAgIC8vIElmIHdlIHJlY2VpdmUgYW4gYXJiaXRyYXJ5IHZhbHVlIGZyb20gdGhlIHJlc3BvbnNlLCB3ZSBtYXkgbm90IHByb3Blcmx5XG4gICAgLy8gaGFuZGxlIGl0LCBzbyB3ZSBzaG91bGQgZmlsdGVyIG91dCBhcmJpdHJhcnkgdmFsdWVzIGhlcmUuXG4gICAgLy9cbiAgICAvLyBJLmUuLFxuICAgIC8vIEFyYml0cmFyeSB2YWx1ZTogXCJfbWV0YUZpZWxkOiAnMTkzOTE5MSdcIlxuICAgIC8vIHZzLlxuICAgIC8vIEZpZWxkVmFsdWVXcmFwcGVyOiBcIl9tZXRhRmllbGQ6IHtyYXc6ICcxOTM5MTkxJ31cIlxuICAgIGlmICghaXNGaWVsZFZhbHVlV3JhcHBlcihyZXN1bHRbZmllbGRdKSkgcmV0dXJuIGFjYztcbiAgICByZXR1cm4geyAuLi5hY2MsIFtmaWVsZF06IGdldEVzY2FwZWRGaWVsZChyZXN1bHQsIGZpZWxkKSB9O1xuICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIFJlc3VsdCh7XG4gIGNsYXNzTmFtZSxcbiAgcmVzdWx0LFxuICBvbkNsaWNrTGluayxcbiAgdGl0bGVGaWVsZCxcbiAgdXJsRmllbGQsXG4gIHRodW1ibmFpbEZpZWxkLFxuICAuLi5yZXN0XG59KSB7XG4gIGNvbnN0IGZpZWxkcyA9IGdldEVzY2FwZWRGaWVsZHMocmVzdWx0KTtcbiAgY29uc3QgdGl0bGUgPSBnZXRFc2NhcGVkRmllbGQocmVzdWx0LCB0aXRsZUZpZWxkKTtcbiAgY29uc3QgdXJsID0gZ2V0VXJsU2FuaXRpemVyKFVSTCwgbG9jYXRpb24pKGdldFJhdyhyZXN1bHQsIHVybEZpZWxkKSk7XG4gIGNvbnN0IHRodW1ibmFpbCA9IGdldFVybFNhbml0aXplcihVUkwsIGxvY2F0aW9uKShcbiAgICBnZXRSYXcocmVzdWx0LCB0aHVtYm5haWxGaWVsZClcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxsaSBjbGFzc05hbWU9e2FwcGVuZENsYXNzTmFtZShcInN1aS1yZXN1bHRcIiwgY2xhc3NOYW1lKX0gey4uLnJlc3R9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWktcmVzdWx0X19oZWFkZXJcIj5cbiAgICAgICAge3RpdGxlICYmICF1cmwgJiYgKFxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzdWktcmVzdWx0X190aXRsZVwiXG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHRpdGxlIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAge3RpdGxlICYmIHVybCAmJiAoXG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInN1aS1yZXN1bHRfX3RpdGxlIHN1aS1yZXN1bHRfX3RpdGxlLWxpbmtcIlxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiB0aXRsZSB9fVxuICAgICAgICAgICAgaHJlZj17dXJsfVxuICAgICAgICAgICAgb25DbGljaz17b25DbGlja0xpbmt9XG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1aS1yZXN1bHRfX2JvZHlcIj5cbiAgICAgICAge3RodW1ibmFpbCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWktcmVzdWx0X19pbWFnZVwiPlxuICAgICAgICAgICAgPGltZyBzcmM9e3RodW1ibmFpbH0gYWx0PVwiXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInN1aS1yZXN1bHRfX2RldGFpbHNcIj5cbiAgICAgICAgICB7T2JqZWN0LmVudHJpZXMoZmllbGRzKS5tYXAoKFtmaWVsZE5hbWUsIGZpZWxkVmFsdWVdKSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtmaWVsZE5hbWV9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdWktcmVzdWx0X19rZXlcIj57ZmllbGROYW1lfTwvc3Bhbj57XCIgXCJ9XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3VpLXJlc3VsdF9fdmFsdWVcIlxuICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZmllbGRWYWx1ZSB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIDwvbGk+XG4gICk7XG59XG5cblJlc3VsdC5wcm9wVHlwZXMgPSB7XG4gIHJlc3VsdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBvbkNsaWNrTGluazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0aXRsZUZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB1cmxGaWVsZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGh1bWJuYWlsRmllbGQ6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3VsdDtcbiJdfQ==