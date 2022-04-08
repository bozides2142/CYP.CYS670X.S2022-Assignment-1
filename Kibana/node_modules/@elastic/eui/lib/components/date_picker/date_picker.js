"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDatePicker = exports.euiDatePickerDefaultTimeFormat = exports.euiDatePickerDefaultDateFormat = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../form");

var _context = require("../context");

var _reactDatepicker = require("./react-datepicker");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var euiDatePickerDefaultDateFormat = 'MM/DD/YYYY';
exports.euiDatePickerDefaultDateFormat = euiDatePickerDefaultDateFormat;
var euiDatePickerDefaultTimeFormat = 'hh:mm A';
exports.euiDatePickerDefaultTimeFormat = euiDatePickerDefaultTimeFormat;
var mapAnchorPositions = {
  'bottom-start': 'downLeft',
  bottom: 'downCenter',
  'bottom-end': 'downRight',
  'left-start': 'leftUp',
  left: 'leftCenter',
  'left-end': 'leftDown',
  'right-start': 'rightUp',
  right: 'rightCenter',
  'right-end': 'rightDown',
  'top-start': 'upLeft',
  top: 'upCenter',
  'top-end': 'upRight'
};

function isPopperPlacement(position) {
  return position != null && Object.keys(mapAnchorPositions).includes(position);
} // EuiDatePicker only supports a subset of props from react-datepicker.


var unsupportedProps = [// We don't want to show multiple months next to each other
'monthsShown', // There is no need to show week numbers
'showWeekNumbers', // Our css adapts to height, no need to fix it
'fixedHeight', // We force the month / year selection UI. No need to configure it
'dropdownMode', // Short month is unnecessary. Our UI has plenty of room for full months
'useShortMonthInDropdown', // The today button is not needed. This should always be external to the calendar
'todayButton', // We hide the time caption, so there is no need to overwrite its text
'timeCaption', // We always want keyboard accessibility on
'disabledKeyboardNavigation', // This is easy enough to do. It can conflict with isLoading state
'isClearable', // There is no reason to launch the datepicker in its own modal. Can always build these ourselves
'withPortal', // Causes Error: Cannot read property 'clone' of undefined
'showMonthYearDropdown', // We overridde this with `popoverPlacement`
'popperPlacement'];

var EuiDatePicker = /*#__PURE__*/function (_Component) {
  _inherits(EuiDatePicker, _Component);

  var _super = _createSuper(EuiDatePicker);

  function EuiDatePicker() {
    _classCallCheck(this, EuiDatePicker);

    return _super.apply(this, arguments);
  }

  _createClass(EuiDatePicker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          adjustDateOnChange = _this$props.adjustDateOnChange,
          calendarClassName = _this$props.calendarClassName,
          className = _this$props.className,
          customInput = _this$props.customInput,
          dateFormat = _this$props.dateFormat,
          dayClassName = _this$props.dayClassName,
          disabled = _this$props.disabled,
          excludeDates = _this$props.excludeDates,
          filterDate = _this$props.filterDate,
          fullWidth = _this$props.fullWidth,
          iconType = _this$props.iconType,
          injectTimes = _this$props.injectTimes,
          inline = _this$props.inline,
          inputRef = _this$props.inputRef,
          isInvalid = _this$props.isInvalid,
          isLoading = _this$props.isLoading,
          locale = _this$props.locale,
          maxDate = _this$props.maxDate,
          maxTime = _this$props.maxTime,
          minDate = _this$props.minDate,
          minTime = _this$props.minTime,
          onChange = _this$props.onChange,
          onClear = _this$props.onClear,
          openToDate = _this$props.openToDate,
          placeholder = _this$props.placeholder,
          popperClassName = _this$props.popperClassName,
          _popoverPlacement = _this$props.popoverPlacement,
          selected = _this$props.selected,
          shadow = _this$props.shadow,
          shouldCloseOnSelect = _this$props.shouldCloseOnSelect,
          showIcon = _this$props.showIcon,
          showTimeSelect = _this$props.showTimeSelect,
          showTimeSelectOnly = _this$props.showTimeSelectOnly,
          timeFormat = _this$props.timeFormat,
          utcOffset = _this$props.utcOffset,
          rest = _objectWithoutProperties(_this$props, ["adjustDateOnChange", "calendarClassName", "className", "customInput", "dateFormat", "dayClassName", "disabled", "excludeDates", "filterDate", "fullWidth", "iconType", "injectTimes", "inline", "inputRef", "isInvalid", "isLoading", "locale", "maxDate", "maxTime", "minDate", "minTime", "onChange", "onClear", "openToDate", "placeholder", "popperClassName", "popoverPlacement", "selected", "shadow", "shouldCloseOnSelect", "showIcon", "showTimeSelect", "showTimeSelectOnly", "timeFormat", "utcOffset"]);

      var classes = (0, _classnames.default)('euiDatePicker', {
        'euiDatePicker--shadow': shadow,
        'euiDatePicker--inline': inline
      });
      var datePickerClasses = (0, _classnames.default)('euiDatePicker', 'euiFieldText', {
        'euiFieldText--fullWidth': fullWidth,
        'euiFieldText-isLoading': isLoading,
        'euiFieldText--withIcon': !inline && showIcon,
        'euiFieldText--isClearable': !inline && selected && onClear,
        'euiFieldText-isInvalid': isInvalid
      }, className);
      var optionalIcon;

      if (inline || customInput || !showIcon) {
        optionalIcon = undefined;
      } else if (iconType) {
        optionalIcon = iconType;
      } else if (showTimeSelectOnly) {
        optionalIcon = 'clock';
      } else {
        optionalIcon = 'calendar';
      } // In case the consumer did not alter the default date format but wants
      // to add the time select, we append the default time format


      var fullDateFormat = dateFormat;

      if (showTimeSelect && dateFormat === euiDatePickerDefaultDateFormat) {
        fullDateFormat = "".concat(dateFormat, " ").concat(timeFormat);
      }

      var popoverPlacement;

      if (isPopperPlacement(_popoverPlacement)) {
        popoverPlacement = mapAnchorPositions[_popoverPlacement];
      } else {
        popoverPlacement = _popoverPlacement;
      }

      return (0, _react2.jsx)("span", {
        className: classes
      }, (0, _react2.jsx)(_form.EuiFormControlLayout, {
        icon: optionalIcon,
        fullWidth: fullWidth,
        clear: selected && onClear ? {
          onClick: onClear
        } : undefined,
        isLoading: isLoading
      }, (0, _react2.jsx)(_form.EuiValidatableControl, {
        isInvalid: isInvalid
      }, (0, _react2.jsx)(_context.EuiI18nConsumer, null, function (_ref) {
        var contextLocale = _ref.locale;
        return (0, _react2.jsx)(_reactDatepicker.ReactDatePicker, _extends({
          adjustDateOnChange: adjustDateOnChange,
          calendarClassName: calendarClassName,
          className: datePickerClasses,
          customInput: customInput,
          dateFormat: fullDateFormat,
          dayClassName: dayClassName,
          disabled: disabled,
          excludeDates: excludeDates,
          filterDate: filterDate,
          injectTimes: injectTimes,
          inline: inline,
          locale: locale || contextLocale,
          maxDate: maxDate,
          maxTime: maxTime,
          minDate: minDate,
          minTime: minTime,
          onChange: onChange,
          openToDate: openToDate,
          placeholderText: placeholder,
          popperClassName: popperClassName,
          ref: inputRef,
          selected: selected,
          shouldCloseOnSelect: shouldCloseOnSelect,
          showMonthDropdown: true,
          showTimeSelect: showTimeSelectOnly ? true : showTimeSelect,
          showTimeSelectOnly: showTimeSelectOnly,
          showYearDropdown: true,
          timeFormat: timeFormat,
          utcOffset: utcOffset,
          yearDropdownItemNumber: 7,
          accessibleMode: true,
          popperPlacement: popoverPlacement
        }, rest));
      }))));
    }
  }]);

  return EuiDatePicker;
}(_react.Component);

exports.EuiDatePicker = EuiDatePicker;

_defineProperty(EuiDatePicker, "defaultProps", {
  adjustDateOnChange: true,
  dateFormat: euiDatePickerDefaultDateFormat,
  fullWidth: false,
  inputRef: function inputRef() {},
  isLoading: false,
  shadow: true,
  shouldCloseOnSelect: true,
  showIcon: true,
  showTimeSelect: false,
  timeFormat: euiDatePickerDefaultTimeFormat,
  popoverPlacement: 'downLeft'
});

EuiDatePicker.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
     * Applies classes to the numbered days provided. Check docs for example.
     */
  dayClassName: _propTypes.default.func,

  /**
     * Makes the input full width
     */
  fullWidth: _propTypes.default.bool,

  /**
     * ref for the ReactDatePicker instance
     */
  inputRef: _propTypes.default.any.isRequired,

  /**
     * Provides styling to the input when invalid
     */
  isInvalid: _propTypes.default.bool,

  /**
     * Provides styling to the input when loading
     */
  isLoading: _propTypes.default.bool,

  /**
     * What to do when the input is cleared by the x icon
     */
  onClear: _propTypes.default.func,

  /**
     * Opens to this date (in moment format) on first press, regardless of selection
     */
  openToDate: _propTypes.default.any,

  /**
     * Shows only when no date is selected
     */
  placeholder: _propTypes.default.string,

  /**
     * Can turn the shadow off if using the inline prop
     */
  shadow: _propTypes.default.bool,

  /**
     * Show the icon in input
     */
  showIcon: _propTypes.default.bool,

  /**
     * Pass an icon type to change the default `calendar` or `clock` icon
     */
  iconType: _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.oneOf(["accessibility", "addDataApp", "advancedSettingsApp", "agentApp", "aggregate", "alert", "analyzeEvent", "annotation", "apmApp", "apmTrace", "appSearchApp", "apps", "arrowDown", "arrowLeft", "arrowRight", "arrowUp", "arrowStart", "arrowEnd", "asterisk", "auditbeatApp", "beaker", "bell", "bellSlash", "bolt", "boxesHorizontal", "boxesVertical", "branch", "broom", "brush", "bug", "bullseye", "calendar", "canvasApp", "check", "checkInCircleFilled", "cheer", "classificationJob", "clock", "cloudDrizzle", "cloudStormy", "cloudSunny", "codeApp", "color", "compute", "console", "consoleApp", "continuityAbove", "continuityAboveBelow", "continuityBelow", "continuityWithin", "controlsHorizontal", "controlsVertical", "copy", "copyClipboard", "createAdvancedJob", "createMultiMetricJob", "createPopulationJob", "createSingleMetricJob", "cross", "crossClusterReplicationApp", "crossInACircleFilled", "crosshairs", "currency", "cut", "dashboardApp", "dataVisualizer", "database", "devToolsApp", "discoverApp", "document", "documentEdit", "documentation", "documents", "dot", "doubleArrowLeft", "doubleArrowRight", "download", "editorAlignCenter", "editorAlignLeft", "editorAlignRight", "editorBold", "editorCodeBlock", "editorComment", "editorDistributeHorizontal", "editorDistributeVertical", "editorHeading", "editorItalic", "editorItemAlignBottom", "editorItemAlignCenter", "editorItemAlignLeft", "editorItemAlignMiddle", "editorItemAlignRight", "editorItemAlignTop", "editorLink", "editorOrderedList", "editorPositionBottomLeft", "editorPositionBottomRight", "editorPositionTopLeft", "editorPositionTopRight", "editorRedo", "editorStrike", "editorTable", "editorUnderline", "editorUndo", "editorUnorderedList", "email", "empty", "emsApp", "eql", "eraser", "exit", "expand", "expandMini", "exportAction", "eye", "eyeClosed", "faceHappy", "faceNeutral", "faceSad", "filebeatApp", "filter", "flag", "fleetApp", "fold", "folderCheck", "folderClosed", "folderExclamation", "folderOpen", "frameNext", "framePrevious", "fullScreen", "fullScreenExit", "function", "gear", "gisApp", "glasses", "globe", "grab", "grabHorizontal", "graphApp", "grid", "grokApp", "heart", "heartbeatApp", "heatmap", "help", "home", "iInCircle", "image", "importAction", "indexClose", "indexEdit", "indexFlush", "indexManagementApp", "indexMapping", "indexOpen", "indexPatternApp", "indexRollupApp", "indexRuntime", "indexSettings", "inputOutput", "inspect", "invert", "ip", "keyboardShortcut", "kqlField", "kqlFunction", "kqlOperand", "kqlSelector", "kqlValue", "layers", "lensApp", "lettering", "link", "list", "listAdd", "lock", "lockOpen", "logoAWS", "logoAWSMono", "logoAerospike", "logoApache", "logoAppSearch", "logoAzure", "logoAzureMono", "logoBeats", "logoBusinessAnalytics", "logoCeph", "logoCloud", "logoCloudEnterprise", "logoCode", "logoCodesandbox", "logoCouchbase", "logoDocker", "logoDropwizard", "logoElastic", "logoElasticStack", "logoElasticsearch", "logoEnterpriseSearch", "logoEtcd", "logoGCP", "logoGCPMono", "logoGithub", "logoGmail", "logoGolang", "logoGoogleG", "logoHAproxy", "logoIBM", "logoIBMMono", "logoKafka", "logoKibana", "logoKubernetes", "logoLogging", "logoLogstash", "logoMaps", "logoMemcached", "logoMetrics", "logoMongodb", "logoMySQL", "logoNginx", "logoObservability", "logoOsquery", "logoPhp", "logoPostgres", "logoPrometheus", "logoRabbitmq", "logoRedis", "logoSecurity", "logoSiteSearch", "logoSketch", "logoSlack", "logoUptime", "logoWebhook", "logoWindows", "logoWorkplaceSearch", "logsApp", "logstashFilter", "logstashIf", "logstashInput", "logstashOutput", "logstashQueue", "machineLearningApp", "magnet", "magnifyWithExclamation", "magnifyWithMinus", "magnifyWithPlus", "managementApp", "mapMarker", "memory", "menu", "menuDown", "menuLeft", "menuRight", "menuUp", "merge", "metricbeatApp", "metricsApp", "minimize", "minus", "minusInCircle", "minusInCircleFilled", "mobile", "monitoringApp", "moon", "nested", "node", "notebookApp", "number", "offline", "online", "outlierDetectionJob", "package", "packetbeatApp", "pageSelect", "pagesSelect", "paperClip", "partial", "pause", "payment", "pencil", "percent", "pin", "pinFilled", "pipelineApp", "play", "playFilled", "plus", "plusInCircle", "plusInCircleFilled", "popout", "push", "questionInCircle", "quote", "recentlyViewedApp", "refresh", "regressionJob", "reporter", "reportingApp", "returnKey", "save", "savedObjectsApp", "scale", "search", "searchProfilerApp", "securityAnalyticsApp", "securityApp", "securitySignal", "securitySignalDetected", "securitySignalResolved", "shard", "share", "snowflake", "sortDown", "sortLeft", "sortRight", "sortUp", "sortable", "spacesApp", "sqlApp", "starEmpty", "starEmptySpace", "starFilled", "starFilledSpace", "starMinusEmpty", "starMinusFilled", "starPlusEmpty", "starPlusFilled", "stats", "stop", "stopFilled", "stopSlash", "storage", "string", "submodule", "sun", "swatchInput", "symlink", "tableDensityCompact", "tableDensityExpanded", "tableDensityNormal", "tableOfContents", "tag", "tear", "temperature", "timeline", "timelionApp", "timeRefresh", "timeslider", "training", "trash", "unfold", "unlink", "upgradeAssistantApp", "uptimeApp", "user", "users", "usersRolesApp", "vector", "videoPlayer", "visArea", "visAreaStacked", "visBarHorizontal", "visBarHorizontalStacked", "visBarVertical", "visBarVerticalStacked", "visGauge", "visGoal", "visLine", "visMapCoordinate", "visMapRegion", "visMetric", "visPie", "visTable", "visTagCloud", "visText", "visTimelion", "visVega", "visVisualBuilder", "visualizeApp", "watchesApp", "wordWrap", "wordWrapDisabled", "workplaceSearchApp", "wrench", "tokenClass", "tokenProperty", "tokenEnum", "tokenVariable", "tokenMethod", "tokenAnnotation", "tokenException", "tokenInterface", "tokenParameter", "tokenField", "tokenElement", "tokenFunction", "tokenBoolean", "tokenString", "tokenArray", "tokenNumber", "tokenConstant", "tokenObject", "tokenEvent", "tokenKey", "tokenNull", "tokenStruct", "tokenPackage", "tokenOperator", "tokenEnumMember", "tokenRepo", "tokenSymbol", "tokenFile", "tokenModule", "tokenNamespace", "tokenDate", "tokenIP", "tokenNested", "tokenAlias", "tokenShape", "tokenGeo", "tokenRange", "tokenBinary", "tokenJoin", "tokenPercolator", "tokenFlattened", "tokenRankFeature", "tokenRankFeatures", "tokenKeyword", "tokenTag", "tokenCompletionSuggester", "tokenDenseVector", "tokenText", "tokenTokenCount", "tokenSearchType", "tokenHistogram"]).isRequired, _propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOfType([_propTypes.default.oneOf(["accessibility", "addDataApp", "advancedSettingsApp", "agentApp", "aggregate", "alert", "analyzeEvent", "annotation", "apmApp", "apmTrace", "appSearchApp", "apps", "arrowDown", "arrowLeft", "arrowRight", "arrowUp", "arrowStart", "arrowEnd", "asterisk", "auditbeatApp", "beaker", "bell", "bellSlash", "bolt", "boxesHorizontal", "boxesVertical", "branch", "broom", "brush", "bug", "bullseye", "calendar", "canvasApp", "check", "checkInCircleFilled", "cheer", "classificationJob", "clock", "cloudDrizzle", "cloudStormy", "cloudSunny", "codeApp", "color", "compute", "console", "consoleApp", "continuityAbove", "continuityAboveBelow", "continuityBelow", "continuityWithin", "controlsHorizontal", "controlsVertical", "copy", "copyClipboard", "createAdvancedJob", "createMultiMetricJob", "createPopulationJob", "createSingleMetricJob", "cross", "crossClusterReplicationApp", "crossInACircleFilled", "crosshairs", "currency", "cut", "dashboardApp", "dataVisualizer", "database", "devToolsApp", "discoverApp", "document", "documentEdit", "documentation", "documents", "dot", "doubleArrowLeft", "doubleArrowRight", "download", "editorAlignCenter", "editorAlignLeft", "editorAlignRight", "editorBold", "editorCodeBlock", "editorComment", "editorDistributeHorizontal", "editorDistributeVertical", "editorHeading", "editorItalic", "editorItemAlignBottom", "editorItemAlignCenter", "editorItemAlignLeft", "editorItemAlignMiddle", "editorItemAlignRight", "editorItemAlignTop", "editorLink", "editorOrderedList", "editorPositionBottomLeft", "editorPositionBottomRight", "editorPositionTopLeft", "editorPositionTopRight", "editorRedo", "editorStrike", "editorTable", "editorUnderline", "editorUndo", "editorUnorderedList", "email", "empty", "emsApp", "eql", "eraser", "exit", "expand", "expandMini", "exportAction", "eye", "eyeClosed", "faceHappy", "faceNeutral", "faceSad", "filebeatApp", "filter", "flag", "fleetApp", "fold", "folderCheck", "folderClosed", "folderExclamation", "folderOpen", "frameNext", "framePrevious", "fullScreen", "fullScreenExit", "function", "gear", "gisApp", "glasses", "globe", "grab", "grabHorizontal", "graphApp", "grid", "grokApp", "heart", "heartbeatApp", "heatmap", "help", "home", "iInCircle", "image", "importAction", "indexClose", "indexEdit", "indexFlush", "indexManagementApp", "indexMapping", "indexOpen", "indexPatternApp", "indexRollupApp", "indexRuntime", "indexSettings", "inputOutput", "inspect", "invert", "ip", "keyboardShortcut", "kqlField", "kqlFunction", "kqlOperand", "kqlSelector", "kqlValue", "layers", "lensApp", "lettering", "link", "list", "listAdd", "lock", "lockOpen", "logoAWS", "logoAWSMono", "logoAerospike", "logoApache", "logoAppSearch", "logoAzure", "logoAzureMono", "logoBeats", "logoBusinessAnalytics", "logoCeph", "logoCloud", "logoCloudEnterprise", "logoCode", "logoCodesandbox", "logoCouchbase", "logoDocker", "logoDropwizard", "logoElastic", "logoElasticStack", "logoElasticsearch", "logoEnterpriseSearch", "logoEtcd", "logoGCP", "logoGCPMono", "logoGithub", "logoGmail", "logoGolang", "logoGoogleG", "logoHAproxy", "logoIBM", "logoIBMMono", "logoKafka", "logoKibana", "logoKubernetes", "logoLogging", "logoLogstash", "logoMaps", "logoMemcached", "logoMetrics", "logoMongodb", "logoMySQL", "logoNginx", "logoObservability", "logoOsquery", "logoPhp", "logoPostgres", "logoPrometheus", "logoRabbitmq", "logoRedis", "logoSecurity", "logoSiteSearch", "logoSketch", "logoSlack", "logoUptime", "logoWebhook", "logoWindows", "logoWorkplaceSearch", "logsApp", "logstashFilter", "logstashIf", "logstashInput", "logstashOutput", "logstashQueue", "machineLearningApp", "magnet", "magnifyWithExclamation", "magnifyWithMinus", "magnifyWithPlus", "managementApp", "mapMarker", "memory", "menu", "menuDown", "menuLeft", "menuRight", "menuUp", "merge", "metricbeatApp", "metricsApp", "minimize", "minus", "minusInCircle", "minusInCircleFilled", "mobile", "monitoringApp", "moon", "nested", "node", "notebookApp", "number", "offline", "online", "outlierDetectionJob", "package", "packetbeatApp", "pageSelect", "pagesSelect", "paperClip", "partial", "pause", "payment", "pencil", "percent", "pin", "pinFilled", "pipelineApp", "play", "playFilled", "plus", "plusInCircle", "plusInCircleFilled", "popout", "push", "questionInCircle", "quote", "recentlyViewedApp", "refresh", "regressionJob", "reporter", "reportingApp", "returnKey", "save", "savedObjectsApp", "scale", "search", "searchProfilerApp", "securityAnalyticsApp", "securityApp", "securitySignal", "securitySignalDetected", "securitySignalResolved", "shard", "share", "snowflake", "sortDown", "sortLeft", "sortRight", "sortUp", "sortable", "spacesApp", "sqlApp", "starEmpty", "starEmptySpace", "starFilled", "starFilledSpace", "starMinusEmpty", "starMinusFilled", "starPlusEmpty", "starPlusFilled", "stats", "stop", "stopFilled", "stopSlash", "storage", "string", "submodule", "sun", "swatchInput", "symlink", "tableDensityCompact", "tableDensityExpanded", "tableDensityNormal", "tableOfContents", "tag", "tear", "temperature", "timeline", "timelionApp", "timeRefresh", "timeslider", "training", "trash", "unfold", "unlink", "upgradeAssistantApp", "uptimeApp", "user", "users", "usersRolesApp", "vector", "videoPlayer", "visArea", "visAreaStacked", "visBarHorizontal", "visBarHorizontalStacked", "visBarVertical", "visBarVerticalStacked", "visGauge", "visGoal", "visLine", "visMapCoordinate", "visMapRegion", "visMetric", "visPie", "visTable", "visTagCloud", "visText", "visTimelion", "visVega", "visVisualBuilder", "visualizeApp", "watchesApp", "wordWrap", "wordWrapDisabled", "workplaceSearchApp", "wrench", "tokenClass", "tokenProperty", "tokenEnum", "tokenVariable", "tokenMethod", "tokenAnnotation", "tokenException", "tokenInterface", "tokenParameter", "tokenField", "tokenElement", "tokenFunction", "tokenBoolean", "tokenString", "tokenArray", "tokenNumber", "tokenConstant", "tokenObject", "tokenEvent", "tokenKey", "tokenNull", "tokenStruct", "tokenPackage", "tokenOperator", "tokenEnumMember", "tokenRepo", "tokenSymbol", "tokenFile", "tokenModule", "tokenNamespace", "tokenDate", "tokenIP", "tokenNested", "tokenAlias", "tokenShape", "tokenGeo", "tokenRange", "tokenBinary", "tokenJoin", "tokenPercolator", "tokenFlattened", "tokenRankFeature", "tokenRankFeatures", "tokenKeyword", "tokenTag", "tokenCompletionSuggester", "tokenDenseVector", "tokenText", "tokenTokenCount", "tokenSearchType", "tokenHistogram"]).isRequired, _propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]).isRequired,
    side: _propTypes.default.any,
    ref: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.func.isRequired])
  }).isRequired]),

  /**
     * Sets the placement of the popover.
     *
     * DEPRECATED: 'bottom', 'bottom-end', 'bottom-start', 'left', 'left-end', 'left-start', right', 'right-end', 'right-start', 'top', 'top-end', 'top-start'
     *
     * **Use [EuiPopover](/#/layout/popover) values**: 'upCenter', 'upLeft', 'upRight', downCenter', 'downLeft', 'downRight', 'leftCenter', 'leftUp', 'leftDown', 'rightCenter', 'rightUp', 'rightDown'.
     */
  popoverPlacement: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.oneOf(["bottom", "bottom-end", "bottom-start", "left", "left-end", "left-start", "right", "right-end", "right-start", "top", "top-end", "top-start"]).isRequired])
};