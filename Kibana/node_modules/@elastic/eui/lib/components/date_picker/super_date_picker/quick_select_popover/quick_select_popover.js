"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiQuickSelectPopover = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _button = require("../../../button");

var _icon = require("../../../icon");

var _popover = require("../../../popover");

var _title = require("../../../title");

var _spacer = require("../../../spacer");

var _horizontal_rule = require("../../../horizontal_rule");

var _text = require("../../../text");

var _quick_select = require("./quick_select");

var _commonly_used_time_ranges = require("./commonly_used_time_ranges");

var _recently_used = require("./recently_used");

var _refresh_interval = require("../../auto_refresh/refresh_interval");

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

var EuiQuickSelectPopover = /*#__PURE__*/function (_Component) {
  _inherits(EuiQuickSelectPopover, _Component);

  var _super = _createSuper(EuiQuickSelectPopover);

  function EuiQuickSelectPopover() {
    var _this;

    _classCallCheck(this, EuiQuickSelectPopover);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isOpen: false
    });

    _defineProperty(_assertThisInitialized(_this), "closePopover", function () {
      _this.setState({
        isOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "togglePopover", function () {
      _this.setState(function (prevState) {
        return {
          isOpen: !prevState.isOpen
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "applyTime", function (_ref) {
      var start = _ref.start,
          end = _ref.end,
          quickSelect = _ref.quickSelect,
          _ref$keepPopoverOpen = _ref.keepPopoverOpen,
          keepPopoverOpen = _ref$keepPopoverOpen === void 0 ? false : _ref$keepPopoverOpen;

      _this.props.applyTime({
        start: start,
        end: end
      });

      if (quickSelect) {
        _this.setState({
          prevQuickSelect: quickSelect
        });
      }

      if (!keepPopoverOpen) {
        _this.closePopover();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderDateTimeSections", function () {
      var _this$props = _this.props,
          commonlyUsedRanges = _this$props.commonlyUsedRanges,
          dateFormat = _this$props.dateFormat,
          end = _this$props.end,
          recentlyUsedRanges = _this$props.recentlyUsedRanges,
          start = _this$props.start;
      var prevQuickSelect = _this.state.prevQuickSelect;
      return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_quick_select.EuiQuickSelect, {
        applyTime: _this.applyTime,
        start: start,
        end: end,
        prevQuickSelect: prevQuickSelect
      }), commonlyUsedRanges.length > 0 && (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, {
        margin: "s"
      }), (0, _react2.jsx)(_commonly_used_time_ranges.EuiCommonlyUsedTimeRanges, {
        applyTime: _this.applyTime,
        commonlyUsedRanges: commonlyUsedRanges
      }), recentlyUsedRanges.length > 0 && (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, {
        margin: "s"
      }), (0, _react2.jsx)(_recently_used.EuiRecentlyUsed, {
        applyTime: _this.applyTime,
        commonlyUsedRanges: commonlyUsedRanges,
        dateFormat: dateFormat,
        recentlyUsedRanges: recentlyUsedRanges
      }), _this.renderCustomQuickSelectPanels());
    });

    _defineProperty(_assertThisInitialized(_this), "renderCustomQuickSelectPanels", function () {
      var customQuickSelectPanels = _this.props.customQuickSelectPanels;

      if (!customQuickSelectPanels) {
        return null;
      }

      return customQuickSelectPanels.map(function (_ref2) {
        var title = _ref2.title,
            content = _ref2.content;
        return (0, _react2.jsx)(_react.Fragment, {
          key: title
        }, (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, {
          margin: "s"
        }), (0, _react2.jsx)(_title.EuiTitle, {
          size: "xxxs"
        }, (0, _react2.jsx)("span", null, title)), (0, _react2.jsx)(_spacer.EuiSpacer, {
          size: "xs"
        }), (0, _react2.jsx)(_text.EuiText, {
          size: "s",
          className: "euiQuickSelectPopover__section"
        }, /*#__PURE__*/_react.default.cloneElement(content, {
          applyTime: _this.applyTime
        })));
      });
    });

    return _this;
  }

  _createClass(EuiQuickSelectPopover, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          applyRefreshInterval = _this$props2.applyRefreshInterval,
          isDisabled = _this$props2.isDisabled,
          isPaused = _this$props2.isPaused,
          refreshInterval = _this$props2.refreshInterval;
      var isOpen = this.state.isOpen;
      var quickSelectButton = (0, _react2.jsx)(_button.EuiButtonEmpty, {
        className: "euiFormControlLayout__prepend",
        textProps: {
          className: 'euiQuickSelectPopover__buttonText'
        },
        onClick: this.togglePopover,
        "aria-label": "Date quick select",
        size: "xs",
        iconType: "arrowDown",
        iconSide: "right",
        isDisabled: isDisabled,
        "data-test-subj": "superDatePickerToggleQuickMenuButton"
      }, (0, _react2.jsx)(_icon.EuiIcon, {
        type: "calendar"
      }));
      return (0, _react2.jsx)(_popover.EuiPopover, {
        button: quickSelectButton,
        isOpen: isOpen,
        closePopover: this.closePopover,
        anchorPosition: "downLeft",
        anchorClassName: "euiQuickSelectPopover__anchor"
      }, (0, _react2.jsx)("div", {
        className: "euiQuickSelectPopover__content",
        "data-test-subj": "superDatePickerQuickMenu"
      }, this.renderDateTimeSections(), applyRefreshInterval && (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, {
        margin: "s"
      }), (0, _react2.jsx)(_refresh_interval.EuiRefreshInterval, {
        onRefreshChange: applyRefreshInterval,
        isPaused: isPaused,
        refreshInterval: refreshInterval
      }))));
    }
  }]);

  return EuiQuickSelectPopover;
}(_react.Component);

exports.EuiQuickSelectPopover = EuiQuickSelectPopover;
EuiQuickSelectPopover.propTypes = {
  applyRefreshInterval: _propTypes.default.func,
  applyTime: _propTypes.default.func.isRequired,
  commonlyUsedRanges: _propTypes.default.arrayOf(_propTypes.default.shape({
    end: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired,
    label: _propTypes.default.string,
    start: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired
  }).isRequired).isRequired,
  customQuickSelectPanels: _propTypes.default.arrayOf(_propTypes.default.shape({
    title: _propTypes.default.string.isRequired,
    content: _propTypes.default.element.isRequired
  }).isRequired),
  dateFormat: _propTypes.default.string.isRequired,
  end: _propTypes.default.string.isRequired,
  isDisabled: _propTypes.default.bool.isRequired,
  isPaused: _propTypes.default.bool.isRequired,
  recentlyUsedRanges: _propTypes.default.arrayOf(_propTypes.default.shape({
    end: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired,
    label: _propTypes.default.string,
    start: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired
  }).isRequired).isRequired,
  refreshInterval: _propTypes.default.number.isRequired,
  start: _propTypes.default.string.isRequired
};