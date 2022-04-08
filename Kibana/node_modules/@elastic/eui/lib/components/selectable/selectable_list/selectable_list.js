"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSelectableList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactWindow = require("react-window");

var _auto_sizer = require("../../auto_sizer");

var _highlight = require("../../highlight");

var _selectable_list_item = require("./selectable_list_item");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var EuiSelectableList = /*#__PURE__*/function (_Component) {
  _inherits(EuiSelectableList, _Component);

  var _super = _createSuper(EuiSelectableList);

  _createClass(EuiSelectableList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var activeOptionIndex = this.props.activeOptionIndex;

      if (this.listBoxRef && this.props.searchable !== true) {
        this.listBoxRef.setAttribute('aria-activedescendant', "".concat(this.props.makeOptionId(activeOptionIndex)));
      }

      if (this.listRef && typeof this.props.activeOptionIndex !== 'undefined') {
        this.listRef.scrollToItem(this.props.activeOptionIndex, 'auto');
      }
    }
  }]);

  function EuiSelectableList(props) {
    var _this;

    _classCallCheck(this, EuiSelectableList);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "listRef", null);

    _defineProperty(_assertThisInitialized(_this), "listBoxRef", null);

    _defineProperty(_assertThisInitialized(_this), "setListRef", function (ref) {
      _this.listRef = ref;

      if (ref && _this.props.activeOptionIndex) {
        ref.scrollToItem(_this.props.activeOptionIndex, 'auto');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "removeScrollableTabStop", function (ref) {
      // Firefox adds a tab stop for scrollable containers
      // We handle this inside so need to stop firefox from doing its thing
      if (ref) {
        ref.setAttribute('tabindex', '-1');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setListBoxRef", function (ref) {
      _this.listBoxRef = ref;
      var _this$props = _this.props,
          listId = _this$props.listId,
          searchable = _this$props.searchable,
          singleSelection = _this$props.singleSelection,
          ariaLabel = _this$props['aria-label'],
          ariaLabelledby = _this$props['aria-labelledby'],
          ariaDescribedby = _this$props['aria-describedby'];

      if (ref) {
        ref.setAttribute('id', listId);
        ref.setAttribute('role', 'listbox');

        if (searchable !== true) {
          ref.setAttribute('tabindex', '0');

          if (singleSelection !== 'always' && singleSelection !== true) {
            ref.setAttribute('aria-multiselectable', 'true');
          }
        }

        if (typeof ariaLabel === 'string') {
          ref.setAttribute('aria-label', ariaLabel);
        } else if (typeof ariaLabelledby === 'string') {
          ref.setAttribute('aria-labelledby', ariaLabelledby);
        }

        if (typeof ariaDescribedby === 'string') {
          ref.setAttribute('aria-labelledby', ariaDescribedby);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "ListRow", /*#__PURE__*/(0, _react.memo)(function (_ref) {
      var data = _ref.data,
          index = _ref.index,
          style = _ref.style;
      var option = data[index];

      var optionData = option.data,
          _option = _objectWithoutProperties(option, ["data"]);

      var label = option.label,
          isGroupLabel = option.isGroupLabel,
          checked = option.checked,
          disabled = option.disabled,
          prepend = option.prepend,
          append = option.append,
          ref = option.ref,
          key = option.key,
          searchableLabel = option.searchableLabel,
          _data = option.data,
          optionRest = _objectWithoutProperties(option, ["label", "isGroupLabel", "checked", "disabled", "prepend", "append", "ref", "key", "searchableLabel", "data"]);

      if (isGroupLabel) {
        return (0, _react2.jsx)("li", _extends({
          role: "presentation",
          className: "euiSelectableList__groupLabel",
          style: style // @ts-ignore complex

        }, optionRest), prepend, label, append);
      }

      var labelCount = data.filter(function (option) {
        return option.isGroupLabel;
      }).length;
      return (0, _react2.jsx)(_selectable_list_item.EuiSelectableListItem, _extends({
        id: _this.props.makeOptionId(index),
        style: style,
        key: key || label.toLowerCase(),
        onMouseDown: function onMouseDown() {
          _this.props.setActiveOptionIndex(index);
        },
        onClick: function onClick() {
          return _this.onAddOrRemoveOption(option);
        },
        ref: ref ? ref.bind(null, index) : undefined,
        isFocused: _this.props.activeOptionIndex === index,
        title: searchableLabel || label,
        checked: checked,
        disabled: disabled,
        prepend: prepend,
        append: append,
        "aria-posinset": index + 1 - labelCount,
        "aria-setsize": data.length - labelCount,
        onFocusBadge: _this.props.onFocusBadge,
        allowExclusions: _this.props.allowExclusions,
        showIcons: _this.props.showIcons
      }, optionRest), _this.props.renderOption ? _this.props.renderOption( // @ts-ignore complex
      _objectSpread(_objectSpread({}, _option), optionData), _this.props.searchValue) : (0, _react2.jsx)(_highlight.EuiHighlight, {
        search: _this.props.searchValue
      }, label));
    }, _reactWindow.areEqual));

    _defineProperty(_assertThisInitialized(_this), "onAddOrRemoveOption", function (option) {
      if (option.disabled) {
        return;
      }

      var _this$props2 = _this.props,
          allowExclusions = _this$props2.allowExclusions,
          options = _this$props2.options,
          _this$props2$visibleO = _this$props2.visibleOptions,
          visibleOptions = _this$props2$visibleO === void 0 ? options : _this$props2$visibleO;

      _this.props.setActiveOptionIndex(visibleOptions.findIndex(function (_ref2) {
        var label = _ref2.label;
        return label === option.label;
      }), function () {
        if (option.checked === 'on' && allowExclusions) {
          _this.onExcludeOption(option);
        } else if (option.checked === 'on' || option.checked === 'off') {
          _this.onRemoveOption(option);
        } else {
          _this.onAddOption(option);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onAddOption", function (addedOption) {
      var _this$props3 = _this.props,
          onOptionClick = _this$props3.onOptionClick,
          options = _this$props3.options,
          singleSelection = _this$props3.singleSelection;
      var updatedOptions = options.map(function (option) {
        // if singleSelection is enabled, uncheck any selected option(s)
        var updatedOption = _objectSpread({}, option);

        if (singleSelection) {
          delete updatedOption.checked;
        } // if this is the now-selected option, check it


        if (option === addedOption) {
          updatedOption.checked = 'on';
        }

        return updatedOption;
      });
      onOptionClick(updatedOptions);
    });

    _defineProperty(_assertThisInitialized(_this), "onRemoveOption", function (removedOption) {
      var _this$props4 = _this.props,
          onOptionClick = _this$props4.onOptionClick,
          singleSelection = _this$props4.singleSelection,
          options = _this$props4.options;
      var updatedOptions = options.map(function (option) {
        var updatedOption = _objectSpread({}, option);

        if (option === removedOption && singleSelection !== 'always') {
          delete updatedOption.checked;
        }

        return updatedOption;
      });
      onOptionClick(updatedOptions);
    });

    _defineProperty(_assertThisInitialized(_this), "onExcludeOption", function (excludedOption) {
      var _this$props5 = _this.props,
          onOptionClick = _this$props5.onOptionClick,
          options = _this$props5.options;
      excludedOption.checked = 'off';
      var updatedOptions = options.map(function (option) {
        var updatedOption = _objectSpread({}, option);

        if (option === excludedOption) {
          updatedOption.checked = 'off';
        }

        return updatedOption;
      });
      onOptionClick(updatedOptions);
    });

    return _this;
  }

  _createClass(EuiSelectableList, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props6 = this.props,
          className = _this$props6.className,
          options = _this$props6.options,
          searchValue = _this$props6.searchValue,
          onOptionClick = _this$props6.onOptionClick,
          renderOption = _this$props6.renderOption,
          forcedHeight = _this$props6.height,
          windowProps = _this$props6.windowProps,
          rowHeight = _this$props6.rowHeight,
          activeOptionIndex = _this$props6.activeOptionIndex,
          makeOptionId = _this$props6.makeOptionId,
          showIcons = _this$props6.showIcons,
          singleSelection = _this$props6.singleSelection,
          visibleOptions = _this$props6.visibleOptions,
          allowExclusions = _this$props6.allowExclusions,
          bordered = _this$props6.bordered,
          searchable = _this$props6.searchable,
          onFocusBadge = _this$props6.onFocusBadge,
          listId = _this$props6.listId,
          setActiveOptionIndex = _this$props6.setActiveOptionIndex,
          ariaLabel = _this$props6['aria-label'],
          ariaLabelledby = _this$props6['aria-labelledby'],
          ariaDescribedby = _this$props6['aria-describedby'],
          isVirtualized = _this$props6.isVirtualized,
          rest = _objectWithoutProperties(_this$props6, ["className", "options", "searchValue", "onOptionClick", "renderOption", "height", "windowProps", "rowHeight", "activeOptionIndex", "makeOptionId", "showIcons", "singleSelection", "visibleOptions", "allowExclusions", "bordered", "searchable", "onFocusBadge", "listId", "setActiveOptionIndex", "aria-label", "aria-labelledby", "aria-describedby", "isVirtualized"]);

      var optionArray = visibleOptions || options;
      var heightIsFull = forcedHeight === 'full';
      var calculatedHeight = heightIsFull ? false : forcedHeight; // If calculatedHeight is still undefined, then calculate it

      if (calculatedHeight === undefined) {
        var maxVisibleOptions = 7;
        var numVisibleOptions = optionArray.length;
        var numVisibleMoreThanMax = optionArray.length > maxVisibleOptions;

        if (numVisibleMoreThanMax) {
          // Show only half of the last one to indicate there's more to scroll to
          calculatedHeight = (maxVisibleOptions - 0.5) * rowHeight;
        } else {
          calculatedHeight = numVisibleOptions * rowHeight;
        }
      }

      var classes = (0, _classnames.default)('euiSelectableList', {
        'euiSelectableList-fullHeight': heightIsFull,
        'euiSelectableList-bordered': bordered
      }, className);
      return (0, _react2.jsx)("div", _extends({
        className: classes
      }, rest), isVirtualized ? (0, _react2.jsx)(_auto_sizer.EuiAutoSizer, {
        disableHeight: !heightIsFull
      }, function (_ref3) {
        var width = _ref3.width,
            height = _ref3.height;
        return (0, _react2.jsx)(_reactWindow.FixedSizeList, _extends({
          ref: _this2.setListRef,
          outerRef: _this2.removeScrollableTabStop,
          className: "euiSelectableList__list",
          "data-skip-axe": "scrollable-region-focusable",
          width: width,
          height: calculatedHeight || height,
          itemCount: optionArray.length,
          itemData: optionArray,
          itemSize: rowHeight,
          innerElementType: "ul",
          innerRef: _this2.setListBoxRef
        }, windowProps), _this2.ListRow);
      }) : (0, _react2.jsx)("div", {
        className: "euiSelectableList__list",
        ref: this.removeScrollableTabStop
      }, (0, _react2.jsx)("ul", {
        ref: this.setListBoxRef
      }, optionArray.map(function (_, index) {
        return /*#__PURE__*/_react.default.createElement(_this2.ListRow, {
          key: index,
          data: optionArray,
          index: index
        }, null);
      }))));
    }
  }]);

  return EuiSelectableList;
}(_react.Component);

exports.EuiSelectableList = EuiSelectableList;

_defineProperty(EuiSelectableList, "defaultProps", {
  rowHeight: 32,
  searchValue: '',
  isVirtualized: true
});

EuiSelectableList.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * The index of the option to be highlighted as pseudo-focused;
       * Good for use when only one selection is allowed and needing to open
       * directly to that option
       */
  activeOptionIndex: _propTypes.default.number,

  /**
       * Show the check/cross selection indicator icons
       */
  showIcons: _propTypes.default.bool,
  singleSelection: _propTypes.default.oneOfType([_propTypes.default.oneOf(["always"]), _propTypes.default.bool.isRequired]),

  /**
       * Any props to send specifically to the react-window `FixedSizeList`
       */
  windowProps: _propTypes.default.any,

  /**
       * Adds a border around the list to indicate the bounds;
       * Useful when the list scrolls, otherwise use your own container
       */
  bordered: _propTypes.default.bool,

  /**
       * When enabled by setting to either `true` or passing custom text,
       * shows a hollow badge as an append (far right) when the item is focused.
       * The default content when `true` is `↩ to select/deselect/include/exclude`
       */
  onFocusBadge: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.shape({
    /**
       * Accepts any string from our icon library
       */
    iconType: _propTypes.default.oneOfType([_propTypes.default.oneOf(["accessibility", "addDataApp", "advancedSettingsApp", "agentApp", "aggregate", "alert", "analyzeEvent", "annotation", "apmApp", "apmTrace", "appSearchApp", "apps", "arrowDown", "arrowLeft", "arrowRight", "arrowUp", "arrowStart", "arrowEnd", "asterisk", "auditbeatApp", "beaker", "bell", "bellSlash", "bolt", "boxesHorizontal", "boxesVertical", "branch", "broom", "brush", "bug", "bullseye", "calendar", "canvasApp", "check", "checkInCircleFilled", "cheer", "classificationJob", "clock", "cloudDrizzle", "cloudStormy", "cloudSunny", "codeApp", "color", "compute", "console", "consoleApp", "continuityAbove", "continuityAboveBelow", "continuityBelow", "continuityWithin", "controlsHorizontal", "controlsVertical", "copy", "copyClipboard", "createAdvancedJob", "createMultiMetricJob", "createPopulationJob", "createSingleMetricJob", "cross", "crossClusterReplicationApp", "crossInACircleFilled", "crosshairs", "currency", "cut", "dashboardApp", "dataVisualizer", "database", "devToolsApp", "discoverApp", "document", "documentEdit", "documentation", "documents", "dot", "doubleArrowLeft", "doubleArrowRight", "download", "editorAlignCenter", "editorAlignLeft", "editorAlignRight", "editorBold", "editorCodeBlock", "editorComment", "editorDistributeHorizontal", "editorDistributeVertical", "editorHeading", "editorItalic", "editorItemAlignBottom", "editorItemAlignCenter", "editorItemAlignLeft", "editorItemAlignMiddle", "editorItemAlignRight", "editorItemAlignTop", "editorLink", "editorOrderedList", "editorPositionBottomLeft", "editorPositionBottomRight", "editorPositionTopLeft", "editorPositionTopRight", "editorRedo", "editorStrike", "editorTable", "editorUnderline", "editorUndo", "editorUnorderedList", "email", "empty", "emsApp", "eql", "eraser", "exit", "expand", "expandMini", "exportAction", "eye", "eyeClosed", "faceHappy", "faceNeutral", "faceSad", "filebeatApp", "filter", "flag", "fleetApp", "fold", "folderCheck", "folderClosed", "folderExclamation", "folderOpen", "frameNext", "framePrevious", "fullScreen", "fullScreenExit", "function", "gear", "gisApp", "glasses", "globe", "grab", "grabHorizontal", "graphApp", "grid", "grokApp", "heart", "heartbeatApp", "heatmap", "help", "home", "iInCircle", "image", "importAction", "indexClose", "indexEdit", "indexFlush", "indexManagementApp", "indexMapping", "indexOpen", "indexPatternApp", "indexRollupApp", "indexRuntime", "indexSettings", "inputOutput", "inspect", "invert", "ip", "keyboardShortcut", "kqlField", "kqlFunction", "kqlOperand", "kqlSelector", "kqlValue", "layers", "lensApp", "lettering", "link", "list", "listAdd", "lock", "lockOpen", "logoAWS", "logoAWSMono", "logoAerospike", "logoApache", "logoAppSearch", "logoAzure", "logoAzureMono", "logoBeats", "logoBusinessAnalytics", "logoCeph", "logoCloud", "logoCloudEnterprise", "logoCode", "logoCodesandbox", "logoCouchbase", "logoDocker", "logoDropwizard", "logoElastic", "logoElasticStack", "logoElasticsearch", "logoEnterpriseSearch", "logoEtcd", "logoGCP", "logoGCPMono", "logoGithub", "logoGmail", "logoGolang", "logoGoogleG", "logoHAproxy", "logoIBM", "logoIBMMono", "logoKafka", "logoKibana", "logoKubernetes", "logoLogging", "logoLogstash", "logoMaps", "logoMemcached", "logoMetrics", "logoMongodb", "logoMySQL", "logoNginx", "logoObservability", "logoOsquery", "logoPhp", "logoPostgres", "logoPrometheus", "logoRabbitmq", "logoRedis", "logoSecurity", "logoSiteSearch", "logoSketch", "logoSlack", "logoUptime", "logoWebhook", "logoWindows", "logoWorkplaceSearch", "logsApp", "logstashFilter", "logstashIf", "logstashInput", "logstashOutput", "logstashQueue", "machineLearningApp", "magnet", "magnifyWithExclamation", "magnifyWithMinus", "magnifyWithPlus", "managementApp", "mapMarker", "memory", "menu", "menuDown", "menuLeft", "menuRight", "menuUp", "merge", "metricbeatApp", "metricsApp", "minimize", "minus", "minusInCircle", "minusInCircleFilled", "mobile", "monitoringApp", "moon", "nested", "node", "notebookApp", "number", "offline", "online", "outlierDetectionJob", "package", "packetbeatApp", "pageSelect", "pagesSelect", "paperClip", "partial", "pause", "payment", "pencil", "percent", "pin", "pinFilled", "pipelineApp", "play", "playFilled", "plus", "plusInCircle", "plusInCircleFilled", "popout", "push", "questionInCircle", "quote", "recentlyViewedApp", "refresh", "regressionJob", "reporter", "reportingApp", "returnKey", "save", "savedObjectsApp", "scale", "search", "searchProfilerApp", "securityAnalyticsApp", "securityApp", "securitySignal", "securitySignalDetected", "securitySignalResolved", "shard", "share", "snowflake", "sortDown", "sortLeft", "sortRight", "sortUp", "sortable", "spacesApp", "sqlApp", "starEmpty", "starEmptySpace", "starFilled", "starFilledSpace", "starMinusEmpty", "starMinusFilled", "starPlusEmpty", "starPlusFilled", "stats", "stop", "stopFilled", "stopSlash", "storage", "string", "submodule", "sun", "swatchInput", "symlink", "tableDensityCompact", "tableDensityExpanded", "tableDensityNormal", "tableOfContents", "tag", "tear", "temperature", "timeline", "timelionApp", "timeRefresh", "timeslider", "training", "trash", "unfold", "unlink", "upgradeAssistantApp", "uptimeApp", "user", "users", "usersRolesApp", "vector", "videoPlayer", "visArea", "visAreaStacked", "visBarHorizontal", "visBarHorizontalStacked", "visBarVertical", "visBarVerticalStacked", "visGauge", "visGoal", "visLine", "visMapCoordinate", "visMapRegion", "visMetric", "visPie", "visTable", "visTagCloud", "visText", "visTimelion", "visVega", "visVisualBuilder", "visualizeApp", "watchesApp", "wordWrap", "wordWrapDisabled", "workplaceSearchApp", "wrench", "tokenClass", "tokenProperty", "tokenEnum", "tokenVariable", "tokenMethod", "tokenAnnotation", "tokenException", "tokenInterface", "tokenParameter", "tokenField", "tokenElement", "tokenFunction", "tokenBoolean", "tokenString", "tokenArray", "tokenNumber", "tokenConstant", "tokenObject", "tokenEvent", "tokenKey", "tokenNull", "tokenStruct", "tokenPackage", "tokenOperator", "tokenEnumMember", "tokenRepo", "tokenSymbol", "tokenFile", "tokenModule", "tokenNamespace", "tokenDate", "tokenIP", "tokenNested", "tokenAlias", "tokenShape", "tokenGeo", "tokenRange", "tokenBinary", "tokenJoin", "tokenPercolator", "tokenFlattened", "tokenRankFeature", "tokenRankFeatures", "tokenKeyword", "tokenTag", "tokenCompletionSuggester", "tokenDenseVector", "tokenText", "tokenTokenCount", "tokenSearchType", "tokenHistogram"]).isRequired, _propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]),

    /**
       * The side of the badge the icon should sit
       */
    iconSide: _propTypes.default.oneOf(["left", "right"]),

    /**
       * Accepts either our palette colors (primary, success ..etc) or a hex value `#FFFFFF`, `#000`.
       */
    color: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.oneOf(["default", "primary", "success", "accent", "warning", "danger", "text", "subdued", "ghost", "inherit"]).isRequired]),

    /**
       * Will override any color passed through the `color` prop.
       */
    isDisabled: _propTypes.default.bool,

    /**
       * Props passed to the close button.
       */
    closeButtonProps: _propTypes.default.any,
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,

    /**
       * Will apply an onclick to icon within the badge
       */
    iconOnClick: _propTypes.default.func,

    /**
       * Aria label applied to the iconOnClick button
       */
    iconOnClickAriaLabel: _propTypes.default.any,

    /**
       * Will apply an onclick to the badge itself
       */
    onClick: _propTypes.default.func,

    /**
       * Aria label applied to the onClick button
       */
    onClickAriaLabel: _propTypes.default.any,
    href: _propTypes.default.string,
    target: _propTypes.default.string,
    rel: _propTypes.default.string
  }).isRequired]),

  /**
       * Use virtualized rendering for list items with `react-window`.
       * Sets each row's height to the value of `rowHeight`.
       */
  isVirtualized: _propTypes.default.oneOfType([_propTypes.default.oneOf([true]), _propTypes.default.oneOf([false]).isRequired]),

  /**
       *  The height of each option in pixels. Defaults to `32`.
       *  Has no effect if `isVirtualized=false`.
       */
  rowHeight: _propTypes.default.number,

  /**
     * All possible options
     */
  options: _propTypes.default.arrayOf(_propTypes.default.shape({
    /**
       * Optional `boolean`.
       * Set to `true` to indicate object is just a grouping label, not a selectable item
       */
    isGroupLabel: _propTypes.default.oneOfType([_propTypes.default.oneOf([true]).isRequired, _propTypes.default.oneOf([false])]),
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,

    /**
       * Visible label of option.
       * Must be unique across items if `key` is not supplied
       */
    label: _propTypes.default.string,

    /**
       * Optionally change the searchable term by passing a different string other than the `label`.
       * Best used when creating a custom `optionRender` to separate the label from metadata but allowing to search on both
       */
    searchableLabel: _propTypes.default.string,

    /**
       * Must be unique across items.
       * Will be used to match options instead of `label`
       */
    key: _propTypes.default.string,

    /**
       * Leave `undefined` to indicate not selected,
       * 'on' to indicate inclusion and
       * 'off' to indicate exclusion
       */
    checked: _propTypes.default.oneOf(["on", "off", undefined]),
    disabled: _propTypes.default.bool,

    /**
       * Node to add between the selection icon and the label
       */
    prepend: _propTypes.default.node,

    /**
       * Node to add to the far right of the item
       */
    append: _propTypes.default.node,
    ref: _propTypes.default.func,

    /**
       * Option data to pass through to the `renderOptions` element.
       * Bypass `EuiSelectableItem` and avoid DOM attribute warnings.
       */
    data: _propTypes.default.shape({})
  }).isRequired).isRequired,

  /**
     * Filtered options list (if applicable)
     */
  visibleOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
    isGroupLabel: _propTypes.default.oneOfType([_propTypes.default.oneOf([true]).isRequired, _propTypes.default.oneOf([false])]),
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,
    label: _propTypes.default.string,
    searchableLabel: _propTypes.default.string,
    key: _propTypes.default.string,
    checked: _propTypes.default.oneOf(["on", "off", undefined]),
    disabled: _propTypes.default.bool,
    prepend: _propTypes.default.node,
    append: _propTypes.default.node,
    ref: _propTypes.default.func,
    data: _propTypes.default.shape({})
  }).isRequired),

  /**
     * Search value to highlight on the option render
     */
  searchValue: _propTypes.default.string.isRequired,

  /**
     * Returns the array of options with altered checked state
     */
  onOptionClick: _propTypes.default.func.isRequired,

  /**
     * Custom render for the label portion of the option;
     * Takes (option, searchValue), returns ReactNode
     */
  renderOption: _propTypes.default.func,

  /**
     * Sets the max height in pixels or pass `full` to allow
     * the whole group to fill the height of its container and
     * allows the list grow as well
     */
  height: _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.oneOf(["full"])]),

  /**
     * Allow cycling through the on, off and undefined state of option.checked
     * and not just on and undefined
     */
  allowExclusions: _propTypes.default.bool,
  searchable: _propTypes.default.bool,
  makeOptionId: _propTypes.default.func.isRequired,
  listId: _propTypes.default.string.isRequired,
  setActiveOptionIndex: _propTypes.default.func.isRequired
};