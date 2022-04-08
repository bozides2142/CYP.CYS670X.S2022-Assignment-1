"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSelectableSearch = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../../form");

var _matching_options = require("../matching_options");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EuiSelectableSearch = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiSelectableSearch, _Component);

  var _super = _createSuper(EuiSelectableSearch);

  function EuiSelectableSearch(props) {
    var _this;

    (0, _classCallCheck2.default)(this, EuiSelectableSearch);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onSearchChange", function (value) {
      if (value !== _this.state.searchValue) {
        _this.setState({
          searchValue: value
        }, function () {
          var matchingOptions = (0, _matching_options.getMatchingOptions)(_this.props.options, value, _this.props.isPreFiltered);

          _this.props.onChange(matchingOptions, value);
        });
      }
    });
    _this.state = {
      searchValue: props.defaultValue
    };
    return _this;
  }

  (0, _createClass2.default)(EuiSelectableSearch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var searchValue = this.state.searchValue;
      var matchingOptions = (0, _matching_options.getMatchingOptions)(this.props.options, searchValue, this.props.isPreFiltered);
      this.props.onChange(matchingOptions, searchValue);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          onChange = _this$props.onChange,
          options = _this$props.options,
          defaultValue = _this$props.defaultValue,
          listId = _this$props.listId,
          placeholder = _this$props.placeholder,
          isPreFiltered = _this$props.isPreFiltered,
          rest = (0, _objectWithoutProperties2.default)(_this$props, ["className", "onChange", "options", "defaultValue", "listId", "placeholder", "isPreFiltered"]);
      var classes = (0, _classnames.default)('euiSelectableSearch', className);
      var ariaPropsIfListIsPresent = listId ? {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': true,
        'aria-controls': listId,
        'aria-owns': listId // legacy attribute but shims support for nearly everything atm

      } : undefined;
      return (0, _react2.jsx)(_form.EuiFieldSearch, (0, _extends2.default)({
        className: classes,
        placeholder: placeholder,
        onSearch: this.onSearchChange,
        incremental: true,
        defaultValue: defaultValue,
        fullWidth: true,
        autoComplete: "off",
        "aria-haspopup": "listbox"
      }, ariaPropsIfListIsPresent, rest));
    }
  }]);
  return EuiSelectableSearch;
}(_react.Component);

exports.EuiSelectableSearch = EuiSelectableSearch;
(0, _defineProperty2.default)(EuiSelectableSearch, "defaultProps", {
  defaultValue: ''
});