"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "prettyDuration", {
  enumerable: true,
  get: function get() {
    return _pretty_duration.prettyDuration;
  }
});
Object.defineProperty(exports, "commonDurationRanges", {
  enumerable: true,
  get: function get() {
    return _pretty_duration.commonDurationRanges;
  }
});
exports.EuiSuperDatePicker = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _moment = _interopRequireDefault(require("moment"));

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _context = require("../../context");

var _date_picker_range = require("../date_picker_range");

var _form = require("../../form");

var _flex = require("../../flex");

var _pretty_duration = require("./pretty_duration");

var _async_interval = require("./async_interval");

var _super_update_button = require("./super_update_button");

var _quick_select_popover = require("./quick_select_popover/quick_select_popover");

var _date_popover_button = require("./date_popover/date_popover_button");

var _auto_refresh = require("../auto_refresh/auto_refresh");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

function isRangeInvalid(start, end) {
  if (start === 'now' && end === 'now') {
    return true;
  }

  var startMoment = _datemath.default.parse(start);

  var endMoment = _datemath.default.parse(end, {
    roundUp: true
  });

  var isInvalid = !startMoment || !endMoment || !startMoment.isValid() || !endMoment.isValid() || !(0, _moment.default)(startMoment).isValid() || !(0, _moment.default)(endMoment).isValid() || startMoment.isAfter(endMoment);
  return isInvalid;
}

var EuiSuperDatePicker = /*#__PURE__*/function (_Component) {
  _inherits(EuiSuperDatePicker, _Component);

  var _super = _createSuper(EuiSuperDatePicker);

  function EuiSuperDatePicker() {
    var _this;

    _classCallCheck(this, EuiSuperDatePicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "asyncInterval", void 0);

    _defineProperty(_assertThisInitialized(_this), "state", {
      prevProps: {
        start: _this.props.start,
        end: _this.props.end
      },
      start: _this.props.start,
      end: _this.props.end,
      isInvalid: isRangeInvalid(_this.props.start, _this.props.end),
      hasChanged: false,
      showPrettyDuration: (0, _pretty_duration.showPrettyDuration)(_this.props.start, _this.props.end, _this.props.commonlyUsedRanges),
      isStartDatePopoverOpen: false,
      isEndDatePopoverOpen: false
    });

    _defineProperty(_assertThisInitialized(_this), "setTime", function (_ref) {
      var end = _ref.end,
          start = _ref.start;
      var isInvalid = isRangeInvalid(start, end);

      _this.setState({
        start: start,
        end: end,
        isInvalid: isInvalid,
        hasChanged: !(_this.state.prevProps.start === start && _this.state.prevProps.end === end)
      });

      if (!_this.props.showUpdateButton) {
        _this.props.onTimeChange({
          start: start,
          end: end,
          isQuickSelection: false,
          isInvalid: isInvalid
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentDidMount", function () {
      if (!_this.props.isPaused) {
        _this.startInterval(_this.props.refreshInterval);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentDidUpdate", function () {
      _this.stopInterval();

      if (!_this.props.isPaused) {
        _this.startInterval(_this.props.refreshInterval);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentWillUnmount", function () {
      _this.stopInterval();
    });

    _defineProperty(_assertThisInitialized(_this), "setStart", function (start) {
      _this.setTime({
        start: start,
        end: _this.state.end
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setEnd", function (end) {
      _this.setTime({
        start: _this.state.start,
        end: end
      });
    });

    _defineProperty(_assertThisInitialized(_this), "applyTime", function () {
      _this.props.onTimeChange({
        start: _this.state.start,
        end: _this.state.end,
        isQuickSelection: false,
        isInvalid: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "applyQuickTime", function (_ref2) {
      var start = _ref2.start,
          end = _ref2.end;

      _this.setState({
        showPrettyDuration: (0, _pretty_duration.showPrettyDuration)(start, end, _pretty_duration.commonDurationRanges)
      });

      _this.props.onTimeChange({
        start: start,
        end: end,
        isQuickSelection: true,
        isInvalid: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "hidePrettyDuration", function () {
      _this.setState({
        showPrettyDuration: false,
        isStartDatePopoverOpen: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onStartDatePopoverToggle", function () {
      _this.setState(function (prevState) {
        return {
          isStartDatePopoverOpen: !prevState.isStartDatePopoverOpen
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onStartDatePopoverClose", function () {
      _this.setState({
        isStartDatePopoverOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onEndDatePopoverToggle", function () {
      _this.setState(function (prevState) {
        return {
          isEndDatePopoverOpen: !prevState.isEndDatePopoverOpen
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onEndDatePopoverClose", function () {
      _this.setState({
        isEndDatePopoverOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onRefreshChange", function (_ref3) {
      var refreshInterval = _ref3.refreshInterval,
          isPaused = _ref3.isPaused;

      _this.stopInterval();

      if (!isPaused) {
        _this.startInterval(refreshInterval);
      }

      if (_this.props.onRefreshChange) {
        _this.props.onRefreshChange({
          refreshInterval: refreshInterval,
          isPaused: isPaused
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "stopInterval", function () {
      if (_this.asyncInterval) {
        _this.asyncInterval.stop();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "startInterval", function (refreshInterval) {
      var onRefresh = _this.props.onRefresh;

      if (onRefresh) {
        var handler = function handler() {
          var _this$props = _this.props,
              start = _this$props.start,
              end = _this$props.end;
          onRefresh({
            start: start,
            end: end,
            refreshInterval: refreshInterval
          });
        };

        _this.asyncInterval = new _async_interval.AsyncInterval(handler, refreshInterval);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderDatePickerRange", function () {
      var _this$state = _this.state,
          end = _this$state.end,
          hasChanged = _this$state.hasChanged,
          isEndDatePopoverOpen = _this$state.isEndDatePopoverOpen,
          isInvalid = _this$state.isInvalid,
          isStartDatePopoverOpen = _this$state.isStartDatePopoverOpen,
          showPrettyDuration = _this$state.showPrettyDuration,
          start = _this$state.start;
      var _this$props2 = _this.props,
          commonlyUsedRanges = _this$props2.commonlyUsedRanges,
          dateFormat = _this$props2.dateFormat,
          isDisabled = _this$props2.isDisabled,
          locale = _this$props2.locale,
          timeFormat = _this$props2.timeFormat,
          utcOffset = _this$props2.utcOffset,
          compressed = _this$props2.compressed;

      if (showPrettyDuration && !isStartDatePopoverOpen && !isEndDatePopoverOpen) {
        return (0, _react2.jsx)(_date_picker_range.EuiDatePickerRange, {
          className: "euiDatePickerRange--inGroup",
          iconType: false,
          isCustom: true,
          startDateControl: (0, _react2.jsx)("div", null),
          endDateControl: (0, _react2.jsx)("div", null)
        }, (0, _react2.jsx)("button", {
          className: (0, _classnames.default)('euiSuperDatePicker__prettyFormat', {
            'euiSuperDatePicker__prettyFormat--disabled': isDisabled
          }),
          "data-test-subj": "superDatePickerShowDatesButton",
          disabled: isDisabled,
          onClick: _this.hidePrettyDuration
        }, (0, _pretty_duration.prettyDuration)(start, end, commonlyUsedRanges, dateFormat)));
      }

      return (0, _react2.jsx)(_context.EuiI18nConsumer, null, function (_ref4) {
        var contextLocale = _ref4.locale;
        return (0, _react2.jsx)(_date_picker_range.EuiDatePickerRange, {
          className: "euiDatePickerRange--inGroup",
          iconType: false,
          isCustom: true,
          startDateControl: (0, _react2.jsx)(_date_popover_button.EuiDatePopoverButton, {
            className: "euiSuperDatePicker__startPopoverButton",
            compressed: compressed,
            position: "start",
            needsUpdating: hasChanged,
            isInvalid: isInvalid,
            isDisabled: isDisabled,
            onChange: _this.setStart,
            value: start,
            dateFormat: dateFormat,
            utcOffset: utcOffset,
            timeFormat: timeFormat,
            locale: locale || contextLocale,
            isOpen: _this.state.isStartDatePopoverOpen,
            onPopoverToggle: _this.onStartDatePopoverToggle,
            onPopoverClose: _this.onStartDatePopoverClose
          }),
          endDateControl: (0, _react2.jsx)(_date_popover_button.EuiDatePopoverButton, {
            position: "end",
            compressed: compressed,
            needsUpdating: hasChanged,
            isInvalid: isInvalid,
            isDisabled: isDisabled,
            onChange: _this.setEnd,
            value: end,
            dateFormat: dateFormat,
            utcOffset: utcOffset,
            timeFormat: timeFormat,
            locale: locale || contextLocale,
            roundUp: true,
            isOpen: _this.state.isEndDatePopoverOpen,
            onPopoverToggle: _this.onEndDatePopoverToggle,
            onPopoverClose: _this.onEndDatePopoverClose
          })
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickUpdateButton", function () {
      if (!_this.state.hasChanged && _this.props.onRefresh) {
        var _this$props3 = _this.props,
            start = _this$props3.start,
            end = _this$props3.end,
            refreshInterval = _this$props3.refreshInterval;

        _this.props.onRefresh({
          start: start,
          end: end,
          refreshInterval: refreshInterval
        });
      } else {
        _this.applyTime();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderUpdateButton", function () {
      var _this$props4 = _this.props,
          isLoading = _this$props4.isLoading,
          isDisabled = _this$props4.isDisabled,
          updateButtonProps = _this$props4.updateButtonProps,
          showUpdateButton = _this$props4.showUpdateButton,
          compressed = _this$props4.compressed;
      if (!showUpdateButton) return null;
      return (0, _react2.jsx)(_flex.EuiFlexItem, {
        grow: false
      }, (0, _react2.jsx)(_super_update_button.EuiSuperUpdateButton, _extends({
        needsUpdate: _this.state.hasChanged,
        showTooltip: !_this.state.isStartDatePopoverOpen && !_this.state.isEndDatePopoverOpen,
        isLoading: isLoading,
        isDisabled: isDisabled || _this.state.isInvalid,
        onClick: _this.handleClickUpdateButton,
        "data-test-subj": "superDatePickerApplyTimeButton",
        size: compressed ? 's' : 'm',
        iconOnly: showUpdateButton === 'iconOnly'
      }, updateButtonProps)));
    });

    return _this;
  }

  _createClass(EuiSuperDatePicker, [{
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          commonlyUsedRanges = _this$props5.commonlyUsedRanges,
          customQuickSelectPanels = _this$props5.customQuickSelectPanels,
          dateFormat = _this$props5.dateFormat,
          end = _this$props5.end,
          isAutoRefreshOnly = _this$props5.isAutoRefreshOnly,
          isDisabled = _this$props5.isDisabled,
          isPaused = _this$props5.isPaused,
          onRefreshChange = _this$props5.onRefreshChange,
          recentlyUsedRanges = _this$props5.recentlyUsedRanges,
          refreshInterval = _this$props5.refreshInterval,
          showUpdateButton = _this$props5.showUpdateButton,
          start = _this$props5.start,
          dataTestSubj = _this$props5['data-test-subj'],
          _width = _this$props5.width,
          isQuickSelectOnly = _this$props5.isQuickSelectOnly,
          compressed = _this$props5.compressed; // Force reduction in width if showing quick select only

      var width = isQuickSelectOnly ? 'auto' : _width;
      var autoRefreshAppend = !isPaused ? (0, _react2.jsx)(_auto_refresh.EuiAutoRefreshButton, {
        className: "euiFormControlLayout__append",
        refreshInterval: refreshInterval,
        isDisabled: isDisabled,
        isPaused: isPaused,
        onRefreshChange: this.onRefreshChange,
        shortHand: true
      }) : undefined;
      var quickSelect = (0, _react2.jsx)(_quick_select_popover.EuiQuickSelectPopover, {
        applyRefreshInterval: onRefreshChange ? this.onRefreshChange : undefined,
        applyTime: this.applyQuickTime,
        commonlyUsedRanges: commonlyUsedRanges,
        customQuickSelectPanels: customQuickSelectPanels,
        dateFormat: dateFormat,
        end: end,
        isDisabled: isDisabled,
        isPaused: isPaused,
        recentlyUsedRanges: recentlyUsedRanges,
        refreshInterval: refreshInterval,
        start: start
      });
      var flexWrapperClasses = (0, _classnames.default)('euiSuperDatePicker__flexWrapper', {
        'euiSuperDatePicker__flexWrapper--noUpdateButton': !showUpdateButton,
        'euiSuperDatePicker__flexWrapper--isAutoRefreshOnly': isAutoRefreshOnly,
        'euiSuperDatePicker__flexWrapper--isQuickSelectOnly': isQuickSelectOnly,
        'euiSuperDatePicker__flexWrapper--fullWidth': width === 'full',
        'euiSuperDatePicker__flexWrapper--autoWidth': width === 'auto'
      });
      return (0, _react2.jsx)(_flex.EuiFlexGroup, {
        gutterSize: "s",
        responsive: false,
        className: flexWrapperClasses
      }, isAutoRefreshOnly && onRefreshChange ? (0, _react2.jsx)(_flex.EuiFlexItem, null, (0, _react2.jsx)(_auto_refresh.EuiAutoRefresh, {
        isPaused: isPaused,
        refreshInterval: refreshInterval,
        onRefreshChange: onRefreshChange,
        fullWidth: width === 'full',
        compressed: compressed,
        isDisabled: isDisabled,
        "data-test-subj": dataTestSubj
      })) : (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_flex.EuiFlexItem, null, (0, _react2.jsx)(_form.EuiFormControlLayout, {
        className: "euiSuperDatePicker",
        compressed: compressed,
        isDisabled: isDisabled,
        prepend: quickSelect,
        append: autoRefreshAppend,
        "data-test-subj": dataTestSubj
      }, !isQuickSelectOnly && this.renderDatePickerRange())), this.renderUpdateButton()));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.start !== prevState.prevProps.start || nextProps.end !== prevState.prevProps.end) {
        return {
          prevProps: {
            start: nextProps.start,
            end: nextProps.end
          },
          start: nextProps.start,
          end: nextProps.end,
          isInvalid: isRangeInvalid(nextProps.start, nextProps.end),
          hasChanged: false,
          showPrettyDuration: (0, _pretty_duration.showPrettyDuration)(nextProps.start, nextProps.end, nextProps.commonlyUsedRanges)
        };
      }

      return null;
    }
  }]);

  return EuiSuperDatePicker;
}(_react.Component);

exports.EuiSuperDatePicker = EuiSuperDatePicker;

_defineProperty(EuiSuperDatePicker, "defaultProps", {
  commonlyUsedRanges: _pretty_duration.commonDurationRanges,
  dateFormat: 'MMM D, YYYY @ HH:mm:ss.SSS',
  end: 'now',
  isAutoRefreshOnly: false,
  isDisabled: false,
  isPaused: true,
  recentlyUsedRanges: [],
  refreshInterval: 1000,
  showUpdateButton: true,
  start: 'now-15m',
  timeFormat: 'HH:mm',
  width: 'restricted'
});

EuiSuperDatePicker.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  commonlyUsedRanges: _propTypes.default.arrayOf(_propTypes.default.shape({
    end: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired,
    label: _propTypes.default.string,
    start: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired
  }).isRequired).isRequired,
  customQuickSelectPanels: _propTypes.default.arrayOf(_propTypes.default.shape({
    title: _propTypes.default.string.isRequired,
    content: _propTypes.default.element.isRequired
  }).isRequired),

  /**
     * Specifies the formatted used when displaying dates and/or datetimes
     */
  dateFormat: _propTypes.default.string.isRequired,

  /**
     * Set isAutoRefreshOnly to true to limit the component to only display auto refresh content.
     */
  isAutoRefreshOnly: _propTypes.default.bool.isRequired,
  isDisabled: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool,
  isPaused: _propTypes.default.bool.isRequired,

  /**
     * Sets the overall width by adding sensible min and max widths.
     * - `auto`: fits width to internal content / time string.
     * - `restricted`: static width that fits the longest possible time string.
     * - `full`: expands to 100% of the container.
     */
  width: _propTypes.default.oneOf(["restricted", "full", "auto"]),

  /**
     * Reduces overall height to compressed form size
     */
  compressed: _propTypes.default.bool,

  /**
     * Used to localize e.g. month names, passed to `moment`
     */
  locale: _propTypes.default.any,

  /**
     * Callback for when the refresh interval is fired.
     * EuiSuperDatePicker will only manage a refresh interval timer when onRefresh callback is supplied
     * If a promise is returned, the next refresh interval will not start until the promise has resolved.
     * If the promise rejects the refresh interval will stop and the error thrown
     */
  onRefresh: _propTypes.default.func,

  /**
     * Callback for when the refresh interval changes.
     * Supply onRefreshChange to show refresh interval inputs in quick select popover
     */
  onRefreshChange: _propTypes.default.func,

  /**
     * Callback for when the time changes.
     */
  onTimeChange: _propTypes.default.func.isRequired,
  recentlyUsedRanges: _propTypes.default.arrayOf(_propTypes.default.shape({
    end: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired,
    label: _propTypes.default.string,
    start: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired
  }).isRequired).isRequired,

  /**
     * Refresh interval in milliseconds
     */
  refreshInterval: _propTypes.default.number.isRequired,
  start: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired,
  end: _propTypes.default.oneOfType([_propTypes.default.oneOf(["now"]), _propTypes.default.string.isRequired]).isRequired,

  /**
     * Specifies the formatted used when displaying times
     */
  timeFormat: _propTypes.default.string.isRequired,
  utcOffset: _propTypes.default.number,

  /**
     * Set showUpdateButton to false to immediately invoke onTimeChange for all start and end changes.
     */
  showUpdateButton: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.oneOf(["iconOnly"])]).isRequired,

  /**
     * Hides the actual input reducing to just the quick select button.
     */
  isQuickSelectOnly: _propTypes.default.bool,

  /**
     * Props passed to the update button #EuiSuperUpdateButtonProps
     */
  updateButtonProps: _propTypes.default.shape({
    /**
       * Show the "Click to apply" tooltip
       */
    showTooltip: _propTypes.default.bool,

    /**
       * Passes props to `EuiToolTip`
       */
    toolTipProps: _propTypes.default.shape({
      /**
         * Passes onto the the trigger.
         */
      anchorClassName: _propTypes.default.string,

      /**
         * The in-view trigger for your tooltip.
         */
      children: _propTypes.default.element.isRequired,

      /**
         * Passes onto the tooltip itself, not the trigger.
         */
      className: _propTypes.default.string,

      /**
         * The main content of your tooltip.
         */
      content: _propTypes.default.node,

      /**
         * Common display alternatives for the anchor wrapper
         */
      display: _propTypes.default.oneOf(["inlineBlock", "block"]),

      /**
         * Delay before showing tooltip. Good for repeatable items.
         */
      delay: _propTypes.default.oneOf(["regular", "long"]).isRequired,

      /**
         * An optional title for your tooltip.
         */
      title: _propTypes.default.node,

      /**
         * Unless you provide one, this will be randomly generated.
         */
      id: _propTypes.default.string,

      /**
         * Suggested position. If there is not enough room for it this will be changed.
         */
      position: _propTypes.default.oneOf(["top", "right", "bottom", "left"]).isRequired,

      /**
         * If supplied, called when mouse movement causes the tool tip to be
         * hidden.
         */
      onMouseOut: _propTypes.default.func
    }),

    /**
       * Returns an IconButton instead
       */
    iconOnly: _propTypes.default.bool,

    /**
       * Forces state to be `iconOnly` when within provided breakpoints.
       * Remove completely with `false` or provide your own list of breakpoints.
       */
    responsive: _propTypes.default.oneOfType([_propTypes.default.oneOf([false]), _propTypes.default.arrayOf(_propTypes.default.oneOf(["xs", "s", "m", "l", "xl"]).isRequired).isRequired])
  })
};