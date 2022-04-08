"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiMarkdownEditorDropZone = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactDropzone = require("react-dropzone");

var _markdown_editor_footer = require("./markdown_editor_footer");

var _resize_observer = require("../observer/resize_observer");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getUnacceptedItems = function getUnacceptedItems(items, dropHandlers) {
  var unacceptedItems = [];

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var isAccepted = false;

    for (var j = 0; j < dropHandlers.length; j++) {
      if (dropHandlers[j].accepts(item.type)) {
        isAccepted = true;
        break;
      }
    }

    if (!isAccepted) {
      unacceptedItems.push(item);
    }
  }

  return unacceptedItems;
};

var EuiMarkdownEditorDropZone = function EuiMarkdownEditorDropZone(props) {
  var _React$useState = _react.default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isDragging = _React$useState2[0],
      toggleDragging = _React$useState2[1];

  var _React$useState3 = _react.default.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      isUploadingFiles = _React$useState4[0],
      toggleUploadingFiles = _React$useState4[1];

  var _React$useState5 = _react.default.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      isDraggingError = _React$useState6[0],
      toggleDraggingError = _React$useState6[1];

  var children = props.children,
      uiPlugins = props.uiPlugins,
      errors = props.errors,
      dropHandlers = props.dropHandlers,
      insertText = props.insertText,
      hasUnacceptedItems = props.hasUnacceptedItems,
      setHasUnacceptedItems = props.setHasUnacceptedItems,
      setEditorFooterHeight = props.setEditorFooterHeight,
      isEditing = props.isEditing;
  var classes = (0, _classnames.default)('euiMarkdownEditorDropZone', {
    'euiMarkdownEditorDropZone--isDragging': isDragging,
    'euiMarkdownEditorDropZone--hasError': hasUnacceptedItems,
    'euiMarkdownEditorDropZone--isDraggingError': isDraggingError
  });

  var _React$useState7 = _react.default.useState(null),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      editorFooterRef = _React$useState8[0],
      setEditorFooterRef = _React$useState8[1];

  var _useResizeObserver = (0, _resize_observer.useResizeObserver)(editorFooterRef, 'height'),
      editorFooterHeight = _useResizeObserver.height;

  (0, _react.useEffect)(function () {
    if (editorFooterHeight !== 0) {
      setEditorFooterHeight(editorFooterHeight);
    }
  }, [setEditorFooterHeight, isEditing, editorFooterHeight]);

  var _useDropzone = (0, _reactDropzone.useDropzone)({
    disabled: dropHandlers.length === 0,
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    preventDropOnDocument: false,
    // multiple: false,
    onDragOver: function onDragOver(e) {
      var result;

      if (e.dataTransfer) {
        var unacceptedItems = getUnacceptedItems(e.dataTransfer.items, dropHandlers);
        setHasUnacceptedItems(unacceptedItems.length > 0);
        toggleDraggingError(unacceptedItems.length > 0);
        result = unacceptedItems.length === 0;
      } else {
        setHasUnacceptedItems(false);
        result = false;
      }

      toggleDragging(result);

      if (result === false) {
        e.preventDefault();
      }

      return result;
    },
    onDragEnter: function onDragEnter(e) {
      var result;

      if (e.dataTransfer) {
        var unacceptedItems = getUnacceptedItems(e.dataTransfer.items, dropHandlers);
        setHasUnacceptedItems(unacceptedItems.length > 0);
        toggleDraggingError(unacceptedItems.length > 0);
        result = unacceptedItems.length === 0;
      } else {
        setHasUnacceptedItems(false);
        result = false;
      }

      toggleDragging(result);

      if (result === false) {
        e.preventDefault();
      }

      return result;
    },
    onDragLeave: function onDragLeave() {
      toggleDragging(false);
    },
    onDrop: function onDrop(acceptedFiles) {
      var fileHandlers = []; // verify all files being dropped are supported

      preparation: for (var i = 0; i < acceptedFiles.length; i++) {
        var file = acceptedFiles[i];

        for (var j = 0; j < dropHandlers.length; j++) {
          if (dropHandlers[j].accepts(file.type)) {
            fileHandlers.push(dropHandlers[j]);
            continue preparation;
          }
        } // if we get here then a file isn't handled


        setHasUnacceptedItems(true);
        toggleDragging(false);
        toggleDraggingError(false);
        return;
      }

      toggleUploadingFiles(true);
      var resolved = [];

      for (var _i2 = 0; _i2 < acceptedFiles.length; _i2++) {
        var _file = acceptedFiles[_i2];
        var handler = fileHandlers[_i2];
        resolved.push(handler.getFormattingForItem(_file));
      }

      Promise.all(resolved).then(function (results) {
        results.forEach(function (_ref) {
          var text = _ref.text,
              config = _ref.config;
          return insertText(text, config);
        });
      }).catch(function () {}).then(function () {
        toggleDragging(false);
        toggleUploadingFiles(false);
        toggleDraggingError(false);
      });
    }
  }),
      getRootProps = _useDropzone.getRootProps,
      getInputProps = _useDropzone.getInputProps,
      open = _useDropzone.open;

  return (0, _react2.jsx)("div", _extends({}, getRootProps(), {
    className: classes
  }), children, (0, _react2.jsx)(_markdown_editor_footer.EuiMarkdownEditorFooter, {
    ref: setEditorFooterRef,
    uiPlugins: uiPlugins,
    openFiles: function openFiles() {
      setHasUnacceptedItems(false);
      open();
    },
    isUploadingFiles: isUploadingFiles,
    hasUnacceptedItems: hasUnacceptedItems,
    dropHandlers: dropHandlers,
    errors: errors
  }), (0, _react2.jsx)("input", getInputProps()));
};

exports.EuiMarkdownEditorDropZone = EuiMarkdownEditorDropZone;
EuiMarkdownEditorDropZone.propTypes = {
  uiPlugins: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    button: _propTypes.default.shape({
      label: _propTypes.default.string.isRequired,
      iconType: _propTypes.default.oneOfType([_propTypes.default.oneOf(["accessibility", "addDataApp", "advancedSettingsApp", "agentApp", "aggregate", "alert", "analyzeEvent", "annotation", "apmApp", "apmTrace", "appSearchApp", "apps", "arrowDown", "arrowLeft", "arrowRight", "arrowUp", "arrowStart", "arrowEnd", "asterisk", "auditbeatApp", "beaker", "bell", "bellSlash", "bolt", "boxesHorizontal", "boxesVertical", "branch", "broom", "brush", "bug", "bullseye", "calendar", "canvasApp", "check", "checkInCircleFilled", "cheer", "classificationJob", "clock", "cloudDrizzle", "cloudStormy", "cloudSunny", "codeApp", "color", "compute", "console", "consoleApp", "continuityAbove", "continuityAboveBelow", "continuityBelow", "continuityWithin", "controlsHorizontal", "controlsVertical", "copy", "copyClipboard", "createAdvancedJob", "createMultiMetricJob", "createPopulationJob", "createSingleMetricJob", "cross", "crossClusterReplicationApp", "crossInACircleFilled", "crosshairs", "currency", "cut", "dashboardApp", "dataVisualizer", "database", "devToolsApp", "discoverApp", "document", "documentEdit", "documentation", "documents", "dot", "doubleArrowLeft", "doubleArrowRight", "download", "editorAlignCenter", "editorAlignLeft", "editorAlignRight", "editorBold", "editorCodeBlock", "editorComment", "editorDistributeHorizontal", "editorDistributeVertical", "editorHeading", "editorItalic", "editorItemAlignBottom", "editorItemAlignCenter", "editorItemAlignLeft", "editorItemAlignMiddle", "editorItemAlignRight", "editorItemAlignTop", "editorLink", "editorOrderedList", "editorPositionBottomLeft", "editorPositionBottomRight", "editorPositionTopLeft", "editorPositionTopRight", "editorRedo", "editorStrike", "editorTable", "editorUnderline", "editorUndo", "editorUnorderedList", "email", "empty", "emsApp", "eql", "eraser", "exit", "expand", "expandMini", "exportAction", "eye", "eyeClosed", "faceHappy", "faceNeutral", "faceSad", "filebeatApp", "filter", "flag", "fleetApp", "fold", "folderCheck", "folderClosed", "folderExclamation", "folderOpen", "frameNext", "framePrevious", "fullScreen", "fullScreenExit", "function", "gear", "gisApp", "glasses", "globe", "grab", "grabHorizontal", "graphApp", "grid", "grokApp", "heart", "heartbeatApp", "heatmap", "help", "home", "iInCircle", "image", "importAction", "indexClose", "indexEdit", "indexFlush", "indexManagementApp", "indexMapping", "indexOpen", "indexPatternApp", "indexRollupApp", "indexRuntime", "indexSettings", "inputOutput", "inspect", "invert", "ip", "keyboardShortcut", "kqlField", "kqlFunction", "kqlOperand", "kqlSelector", "kqlValue", "layers", "lensApp", "lettering", "link", "list", "listAdd", "lock", "lockOpen", "logoAWS", "logoAWSMono", "logoAerospike", "logoApache", "logoAppSearch", "logoAzure", "logoAzureMono", "logoBeats", "logoBusinessAnalytics", "logoCeph", "logoCloud", "logoCloudEnterprise", "logoCode", "logoCodesandbox", "logoCouchbase", "logoDocker", "logoDropwizard", "logoElastic", "logoElasticStack", "logoElasticsearch", "logoEnterpriseSearch", "logoEtcd", "logoGCP", "logoGCPMono", "logoGithub", "logoGmail", "logoGolang", "logoGoogleG", "logoHAproxy", "logoIBM", "logoIBMMono", "logoKafka", "logoKibana", "logoKubernetes", "logoLogging", "logoLogstash", "logoMaps", "logoMemcached", "logoMetrics", "logoMongodb", "logoMySQL", "logoNginx", "logoObservability", "logoOsquery", "logoPhp", "logoPostgres", "logoPrometheus", "logoRabbitmq", "logoRedis", "logoSecurity", "logoSiteSearch", "logoSketch", "logoSlack", "logoUptime", "logoWebhook", "logoWindows", "logoWorkplaceSearch", "logsApp", "logstashFilter", "logstashIf", "logstashInput", "logstashOutput", "logstashQueue", "machineLearningApp", "magnet", "magnifyWithExclamation", "magnifyWithMinus", "magnifyWithPlus", "managementApp", "mapMarker", "memory", "menu", "menuDown", "menuLeft", "menuRight", "menuUp", "merge", "metricbeatApp", "metricsApp", "minimize", "minus", "minusInCircle", "minusInCircleFilled", "mobile", "monitoringApp", "moon", "nested", "node", "notebookApp", "number", "offline", "online", "outlierDetectionJob", "package", "packetbeatApp", "pageSelect", "pagesSelect", "paperClip", "partial", "pause", "payment", "pencil", "percent", "pin", "pinFilled", "pipelineApp", "play", "playFilled", "plus", "plusInCircle", "plusInCircleFilled", "popout", "push", "questionInCircle", "quote", "recentlyViewedApp", "refresh", "regressionJob", "reporter", "reportingApp", "returnKey", "save", "savedObjectsApp", "scale", "search", "searchProfilerApp", "securityAnalyticsApp", "securityApp", "securitySignal", "securitySignalDetected", "securitySignalResolved", "shard", "share", "snowflake", "sortDown", "sortLeft", "sortRight", "sortUp", "sortable", "spacesApp", "sqlApp", "starEmpty", "starEmptySpace", "starFilled", "starFilledSpace", "starMinusEmpty", "starMinusFilled", "starPlusEmpty", "starPlusFilled", "stats", "stop", "stopFilled", "stopSlash", "storage", "string", "submodule", "sun", "swatchInput", "symlink", "tableDensityCompact", "tableDensityExpanded", "tableDensityNormal", "tableOfContents", "tag", "tear", "temperature", "timeline", "timelionApp", "timeRefresh", "timeslider", "training", "trash", "unfold", "unlink", "upgradeAssistantApp", "uptimeApp", "user", "users", "usersRolesApp", "vector", "videoPlayer", "visArea", "visAreaStacked", "visBarHorizontal", "visBarHorizontalStacked", "visBarVertical", "visBarVerticalStacked", "visGauge", "visGoal", "visLine", "visMapCoordinate", "visMapRegion", "visMetric", "visPie", "visTable", "visTagCloud", "visText", "visTimelion", "visVega", "visVisualBuilder", "visualizeApp", "watchesApp", "wordWrap", "wordWrapDisabled", "workplaceSearchApp", "wrench", "tokenClass", "tokenProperty", "tokenEnum", "tokenVariable", "tokenMethod", "tokenAnnotation", "tokenException", "tokenInterface", "tokenParameter", "tokenField", "tokenElement", "tokenFunction", "tokenBoolean", "tokenString", "tokenArray", "tokenNumber", "tokenConstant", "tokenObject", "tokenEvent", "tokenKey", "tokenNull", "tokenStruct", "tokenPackage", "tokenOperator", "tokenEnumMember", "tokenRepo", "tokenSymbol", "tokenFile", "tokenModule", "tokenNamespace", "tokenDate", "tokenIP", "tokenNested", "tokenAlias", "tokenShape", "tokenGeo", "tokenRange", "tokenBinary", "tokenJoin", "tokenPercolator", "tokenFlattened", "tokenRankFeature", "tokenRankFeatures", "tokenKeyword", "tokenTag", "tokenCompletionSuggester", "tokenDenseVector", "tokenText", "tokenTokenCount", "tokenSearchType", "tokenHistogram"]).isRequired, _propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]).isRequired
    }).isRequired,
    helpText: _propTypes.default.node,
    formatting: _propTypes.default.shape({
      prefix: _propTypes.default.string,
      suffix: _propTypes.default.string,
      blockPrefix: _propTypes.default.string,
      blockSuffix: _propTypes.default.string,
      multiline: _propTypes.default.bool,
      replaceNext: _propTypes.default.string,
      prefixSpace: _propTypes.default.bool,
      scanFor: _propTypes.default.string,
      surroundWithNewlines: _propTypes.default.bool,
      orderedList: _propTypes.default.bool,
      trimFirst: _propTypes.default.bool
    }),
    editor: _propTypes.default.elementType
  }).isRequired).isRequired,
  errors: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.any.isRequired, _propTypes.default.any.isRequired]).isRequired).isRequired,
  dropHandlers: _propTypes.default.arrayOf(_propTypes.default.shape({
    supportedFiles: _propTypes.default.arrayOf(_propTypes.default.string.isRequired).isRequired,
    accepts: _propTypes.default.func.isRequired,
    getFormattingForItem: _propTypes.default.func.isRequired
  }).isRequired).isRequired,
  insertText: _propTypes.default.func.isRequired,
  hasUnacceptedItems: _propTypes.default.bool.isRequired,
  setHasUnacceptedItems: _propTypes.default.func.isRequired,
  setEditorFooterHeight: _propTypes.default.func.isRequired,
  isEditing: _propTypes.default.bool.isRequired
};