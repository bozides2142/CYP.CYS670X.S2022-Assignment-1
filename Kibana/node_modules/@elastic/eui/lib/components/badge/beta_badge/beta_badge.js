"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiBetaBadge = exports.SIZES = exports.sizeToClassMap = exports.COLORS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _services = require("../../../services");

var _tool_tip = require("../../tool_tip");

var _icon = require("../../icon");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var colorToClassMap = {
  accent: 'euiBetaBadge--accent',
  subdued: 'euiBetaBadge--subdued',
  hollow: 'euiBetaBadge--hollow'
};
var COLORS = (0, _common.keysOf)(colorToClassMap);
exports.COLORS = COLORS;
var sizeToClassMap = {
  s: 'euiBetaBadge--small',
  m: null
};
exports.sizeToClassMap = sizeToClassMap;
var SIZES = (0, _common.keysOf)(sizeToClassMap);
exports.SIZES = SIZES;

var EuiBetaBadge = function EuiBetaBadge(_ref) {
  var className = _ref.className,
      label = _ref.label,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'hollow' : _ref$color,
      tooltipContent = _ref.tooltipContent,
      _ref$tooltipPosition = _ref.tooltipPosition,
      tooltipPosition = _ref$tooltipPosition === void 0 ? 'top' : _ref$tooltipPosition,
      title = _ref.title,
      iconType = _ref.iconType,
      onClick = _ref.onClick,
      onClickAriaLabel = _ref.onClickAriaLabel,
      href = _ref.href,
      rel = _ref.rel,
      target = _ref.target,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      rest = _objectWithoutProperties(_ref, ["className", "label", "color", "tooltipContent", "tooltipPosition", "title", "iconType", "onClick", "onClickAriaLabel", "href", "rel", "target", "size"]);

  var singleLetter = false;

  if (typeof label === 'string' && label.length === 1) {
    singleLetter = true;
  }

  var classes = (0, _classnames.default)('euiBetaBadge', {
    'euiBetaBadge--iconOnly': iconType,
    'euiBetaBadge--singleLetter': singleLetter,
    'euiBetaBadge-isClickable': onClick || href
  }, colorToClassMap[color], sizeToClassMap[size], className);
  var icon;

  if (iconType) {
    icon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiBetaBadge__icon",
      type: iconType,
      size: size === 'm' ? 'm' : 's',
      "aria-hidden": "true",
      color: "inherit" // forces the icon to inherit its parent color

    });
  }

  var Element = href ? 'a' : 'button';
  var relObj = {};

  if (href) {
    relObj.href = href;
    relObj.target = target;
    relObj.rel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
  }

  if (onClick) {
    relObj.onClick = onClick;
  }

  var content;

  if (onClick || href) {
    content = (0, _react2.jsx)(Element, _extends({
      "aria-label": onClickAriaLabel,
      className: classes,
      title: typeof label === 'string' ? label : title
    }, relObj, rest), icon || label);

    if (tooltipContent) {
      return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
        position: tooltipPosition,
        content: tooltipContent,
        title: title || label
      }, content);
    } else {
      return (0, _react2.jsx)(_react.Fragment, null, content);
    }
  } else {
    if (tooltipContent) {
      return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
        position: tooltipPosition,
        content: tooltipContent,
        title: title || label
      }, (0, _react2.jsx)("span", _extends({
        tabIndex: 0,
        className: classes,
        role: "button"
      }, rest), icon || label));
    } else {
      var spanTitle = title || label;

      if (spanTitle && typeof spanTitle !== 'string') {
        console.warn("Only string titles are permitted on badges that do not use tooltips. Found: ".concat(_typeof(spanTitle)));
      }

      return (0, _react2.jsx)("span", _extends({
        className: classes,
        title: spanTitle
      }, rest), icon || label);
    }
  }
};

exports.EuiBetaBadge = EuiBetaBadge;
EuiBetaBadge.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

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
  rel: _propTypes.default.string,

  /**
     * Supply an icon type if the badge should just be an icon
     */
  iconType: _propTypes.default.oneOfType([_propTypes.default.oneOf(["accessibility", "addDataApp", "advancedSettingsApp", "agentApp", "aggregate", "alert", "analyzeEvent", "annotation", "apmApp", "apmTrace", "appSearchApp", "apps", "arrowDown", "arrowLeft", "arrowRight", "arrowUp", "arrowStart", "arrowEnd", "asterisk", "auditbeatApp", "beaker", "bell", "bellSlash", "bolt", "boxesHorizontal", "boxesVertical", "branch", "broom", "brush", "bug", "bullseye", "calendar", "canvasApp", "check", "checkInCircleFilled", "cheer", "classificationJob", "clock", "cloudDrizzle", "cloudStormy", "cloudSunny", "codeApp", "color", "compute", "console", "consoleApp", "continuityAbove", "continuityAboveBelow", "continuityBelow", "continuityWithin", "controlsHorizontal", "controlsVertical", "copy", "copyClipboard", "createAdvancedJob", "createMultiMetricJob", "createPopulationJob", "createSingleMetricJob", "cross", "crossClusterReplicationApp", "crossInACircleFilled", "crosshairs", "currency", "cut", "dashboardApp", "dataVisualizer", "database", "devToolsApp", "discoverApp", "document", "documentEdit", "documentation", "documents", "dot", "doubleArrowLeft", "doubleArrowRight", "download", "editorAlignCenter", "editorAlignLeft", "editorAlignRight", "editorBold", "editorCodeBlock", "editorComment", "editorDistributeHorizontal", "editorDistributeVertical", "editorHeading", "editorItalic", "editorItemAlignBottom", "editorItemAlignCenter", "editorItemAlignLeft", "editorItemAlignMiddle", "editorItemAlignRight", "editorItemAlignTop", "editorLink", "editorOrderedList", "editorPositionBottomLeft", "editorPositionBottomRight", "editorPositionTopLeft", "editorPositionTopRight", "editorRedo", "editorStrike", "editorTable", "editorUnderline", "editorUndo", "editorUnorderedList", "email", "empty", "emsApp", "eql", "eraser", "exit", "expand", "expandMini", "exportAction", "eye", "eyeClosed", "faceHappy", "faceNeutral", "faceSad", "filebeatApp", "filter", "flag", "fleetApp", "fold", "folderCheck", "folderClosed", "folderExclamation", "folderOpen", "frameNext", "framePrevious", "fullScreen", "fullScreenExit", "function", "gear", "gisApp", "glasses", "globe", "grab", "grabHorizontal", "graphApp", "grid", "grokApp", "heart", "heartbeatApp", "heatmap", "help", "home", "iInCircle", "image", "importAction", "indexClose", "indexEdit", "indexFlush", "indexManagementApp", "indexMapping", "indexOpen", "indexPatternApp", "indexRollupApp", "indexRuntime", "indexSettings", "inputOutput", "inspect", "invert", "ip", "keyboardShortcut", "kqlField", "kqlFunction", "kqlOperand", "kqlSelector", "kqlValue", "layers", "lensApp", "lettering", "link", "list", "listAdd", "lock", "lockOpen", "logoAWS", "logoAWSMono", "logoAerospike", "logoApache", "logoAppSearch", "logoAzure", "logoAzureMono", "logoBeats", "logoBusinessAnalytics", "logoCeph", "logoCloud", "logoCloudEnterprise", "logoCode", "logoCodesandbox", "logoCouchbase", "logoDocker", "logoDropwizard", "logoElastic", "logoElasticStack", "logoElasticsearch", "logoEnterpriseSearch", "logoEtcd", "logoGCP", "logoGCPMono", "logoGithub", "logoGmail", "logoGolang", "logoGoogleG", "logoHAproxy", "logoIBM", "logoIBMMono", "logoKafka", "logoKibana", "logoKubernetes", "logoLogging", "logoLogstash", "logoMaps", "logoMemcached", "logoMetrics", "logoMongodb", "logoMySQL", "logoNginx", "logoObservability", "logoOsquery", "logoPhp", "logoPostgres", "logoPrometheus", "logoRabbitmq", "logoRedis", "logoSecurity", "logoSiteSearch", "logoSketch", "logoSlack", "logoUptime", "logoWebhook", "logoWindows", "logoWorkplaceSearch", "logsApp", "logstashFilter", "logstashIf", "logstashInput", "logstashOutput", "logstashQueue", "machineLearningApp", "magnet", "magnifyWithExclamation", "magnifyWithMinus", "magnifyWithPlus", "managementApp", "mapMarker", "memory", "menu", "menuDown", "menuLeft", "menuRight", "menuUp", "merge", "metricbeatApp", "metricsApp", "minimize", "minus", "minusInCircle", "minusInCircleFilled", "mobile", "monitoringApp", "moon", "nested", "node", "notebookApp", "number", "offline", "online", "outlierDetectionJob", "package", "packetbeatApp", "pageSelect", "pagesSelect", "paperClip", "partial", "pause", "payment", "pencil", "percent", "pin", "pinFilled", "pipelineApp", "play", "playFilled", "plus", "plusInCircle", "plusInCircleFilled", "popout", "push", "questionInCircle", "quote", "recentlyViewedApp", "refresh", "regressionJob", "reporter", "reportingApp", "returnKey", "save", "savedObjectsApp", "scale", "search", "searchProfilerApp", "securityAnalyticsApp", "securityApp", "securitySignal", "securitySignalDetected", "securitySignalResolved", "shard", "share", "snowflake", "sortDown", "sortLeft", "sortRight", "sortUp", "sortable", "spacesApp", "sqlApp", "starEmpty", "starEmptySpace", "starFilled", "starFilledSpace", "starMinusEmpty", "starMinusFilled", "starPlusEmpty", "starPlusFilled", "stats", "stop", "stopFilled", "stopSlash", "storage", "string", "submodule", "sun", "swatchInput", "symlink", "tableDensityCompact", "tableDensityExpanded", "tableDensityNormal", "tableOfContents", "tag", "tear", "temperature", "timeline", "timelionApp", "timeRefresh", "timeslider", "training", "trash", "unfold", "unlink", "upgradeAssistantApp", "uptimeApp", "user", "users", "usersRolesApp", "vector", "videoPlayer", "visArea", "visAreaStacked", "visBarHorizontal", "visBarHorizontalStacked", "visBarVertical", "visBarVerticalStacked", "visGauge", "visGoal", "visLine", "visMapCoordinate", "visMapRegion", "visMetric", "visPie", "visTable", "visTagCloud", "visText", "visTimelion", "visVega", "visVisualBuilder", "visualizeApp", "watchesApp", "wordWrap", "wordWrapDisabled", "workplaceSearchApp", "wrench", "tokenClass", "tokenProperty", "tokenEnum", "tokenVariable", "tokenMethod", "tokenAnnotation", "tokenException", "tokenInterface", "tokenParameter", "tokenField", "tokenElement", "tokenFunction", "tokenBoolean", "tokenString", "tokenArray", "tokenNumber", "tokenConstant", "tokenObject", "tokenEvent", "tokenKey", "tokenNull", "tokenStruct", "tokenPackage", "tokenOperator", "tokenEnumMember", "tokenRepo", "tokenSymbol", "tokenFile", "tokenModule", "tokenNamespace", "tokenDate", "tokenIP", "tokenNested", "tokenAlias", "tokenShape", "tokenGeo", "tokenRange", "tokenBinary", "tokenJoin", "tokenPercolator", "tokenFlattened", "tokenRankFeature", "tokenRankFeatures", "tokenKeyword", "tokenTag", "tokenCompletionSuggester", "tokenDenseVector", "tokenText", "tokenTokenCount", "tokenSearchType", "tokenHistogram"]).isRequired, _propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]),

  /**
     * One word label like "Beta" or "Lab"
     */

  /**
     * One word label like "Beta" or "Lab"
     */
  label: _propTypes.default.oneOfType([_propTypes.default.node.isRequired, _propTypes.default.oneOfType([_propTypes.default.node.isRequired, _propTypes.default.string.isRequired]).isRequired]).isRequired,

  /**
     * Content for the tooltip
     */
  tooltipContent: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.node.isRequired])]),

  /**
     * Custom position of the tooltip
     */
  tooltipPosition: _propTypes.default.oneOf(["top", "right", "bottom", "left"]),

  /**
     * Optional title will be supplied as tooltip title or title attribute
     * otherwise the label will be used
     */
  title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.string])]),

  /**
     * Accepts accent, subdued and hollow.
     */
  color: _propTypes.default.oneOf(["accent", "subdued", "hollow"]),
  size: _propTypes.default.oneOf(["s", "m"])
};