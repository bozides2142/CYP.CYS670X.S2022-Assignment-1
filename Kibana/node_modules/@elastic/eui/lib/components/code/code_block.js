"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCodeBlock = exports.PADDING_SIZES = exports.FONT_SIZES = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactWindow = require("react-window");

var _services = require("../../services");

var _auto_sizer = require("../auto_sizer");

var _button = require("../button");

var _common = require("../common");

var _copy = require("../copy");

var _focus_trap = require("../focus_trap");

var _i18n = require("../i18n");

var _inner_text = require("../inner_text");

var _mutation_observer = require("../observer/mutation_observer");

var _resize_observer = require("../observer/resize_observer");

var _overlay_mask = require("../overlay_mask");

var _utils = require("./utils");

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Based on observed line height for non-virtualized code blocks
var fontSizeToRowHeightMap = {
  s: 18,
  m: 21,
  l: 24
};
var fontSizeToClassNameMap = {
  s: 'euiCodeBlock--fontSmall',
  m: 'euiCodeBlock--fontMedium',
  l: 'euiCodeBlock--fontLarge'
};
var FONT_SIZES = (0, _common.keysOf)(fontSizeToClassNameMap);
exports.FONT_SIZES = FONT_SIZES;
var paddingSizeToClassNameMap = {
  none: '',
  s: 'euiCodeBlock--paddingSmall',
  m: 'euiCodeBlock--paddingMedium',
  l: 'euiCodeBlock--paddingLarge'
};
var PADDING_SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap); // This exclusive union enforces specific props based on isVirtualized

exports.PADDING_SIZES = PADDING_SIZES;

var EuiCodeBlock = function EuiCodeBlock(_ref) {
  var _ref$language = _ref.language,
      _language = _ref$language === void 0 ? _utils.DEFAULT_LANGUAGE : _ref$language,
      _ref$transparentBackg = _ref.transparentBackground,
      transparentBackground = _ref$transparentBackg === void 0 ? false : _ref$transparentBackg,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'l' : _ref$paddingSize,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? 's' : _ref$fontSize,
      _ref$isCopyable = _ref.isCopyable,
      isCopyable = _ref$isCopyable === void 0 ? false : _ref$isCopyable,
      _ref$whiteSpace = _ref.whiteSpace,
      whiteSpace = _ref$whiteSpace === void 0 ? 'pre-wrap' : _ref$whiteSpace,
      children = _ref.children,
      className = _ref.className,
      overflowHeight = _ref.overflowHeight,
      _isVirtualized = _ref.isVirtualized,
      _ref$lineNumbers = _ref.lineNumbers,
      lineNumbers = _ref$lineNumbers === void 0 ? false : _ref$lineNumbers,
      rest = _objectWithoutProperties(_ref, ["language", "transparentBackground", "paddingSize", "fontSize", "isCopyable", "whiteSpace", "children", "className", "overflowHeight", "isVirtualized", "lineNumbers"]);

  var language = (0, _react.useMemo)(function () {
    return (0, _utils.checkSupportedLanguage)(_language);
  }, [_language]);
  var lineNumbersConfig = (0, _react.useMemo)(function () {
    var config = _typeof(lineNumbers) === 'object' ? lineNumbers : {};
    return lineNumbers ? _objectSpread({
      start: 1,
      show: true
    }, config) : {
      start: 1,
      show: false
    };
  }, [lineNumbers]); // Used by `FixedSizeList` when `isVirtualized=true` or `children` is parsable

  var data = (0, _react.useMemo)(function () {
    if (typeof children !== 'string') {
      return [];
    }

    return (0, _utils.highlightByLine)(children, language, lineNumbersConfig);
  }, [children, language, lineNumbersConfig]); // Used by `pre` when `isVirtualized=false` or `children` is not parsable

  var content = (0, _react.useMemo)(function () {
    return (0, _utils.getHtmlContent)(data, children);
  }, [data, children]);
  var isVirtualized = (0, _react.useMemo)(function () {
    return !!(_isVirtualized && Array.isArray(data));
  }, [_isVirtualized, data]);

  var _useCopy = useCopy({
    isCopyable: isCopyable,
    isVirtualized: isVirtualized,
    children: children
  }),
      innerTextRef = _useCopy.innerTextRef,
      showCopyButton = _useCopy.showCopyButton,
      CopyButton = _useCopy.CopyButton;

  var _useOverflowDetection = useOverflowDetection(),
      setWrapperRef = _useOverflowDetection.setWrapperRef,
      tabIndex = _useOverflowDetection.tabIndex;

  var combinedRef = (0, _services.useCombinedRefs)([innerTextRef, setWrapperRef]);

  var _useFullScreen = useFullScreen({
    overflowHeight: overflowHeight
  }),
      showFullScreenButton = _useFullScreen.showFullScreenButton,
      onKeyDown = _useFullScreen.onKeyDown,
      FullScreenButton = _useFullScreen.FullScreenButton,
      FullScreenDisplay = _useFullScreen.FullScreenDisplay; // Classes used in both full-screen and non-full-screen mode


  var wrapperClasses = (0, _classnames.default)(className, 'euiCodeBlock', {
    'euiCodeBlock--hasControl': showCopyButton || showFullScreenButton,
    'euiCodeBlock--hasBothControls': showCopyButton && showFullScreenButton,
    'euiCodeBlock--hasLineNumbers': lineNumbersConfig.show
  }); // Classes used in non-full-screen mode only

  var classes = (0, _classnames.default)(wrapperClasses, fontSizeToClassNameMap[fontSize], paddingSizeToClassNameMap[paddingSize], {
    'euiCodeBlock--transparentBackground': transparentBackground
  });
  var codeProps = (0, _react.useMemo)(function () {
    return _objectSpread({
      className: 'euiCodeBlock__code',
      'data-code-language': language
    }, rest);
  }, [language, rest]);
  var preClasses = (0, _classnames.default)('euiCodeBlock__pre', {
    'euiCodeBlock__pre--whiteSpacePre': whiteSpace === 'pre' || isVirtualized,
    'euiCodeBlock__pre--whiteSpacePreWrap': whiteSpace === 'pre-wrap' && !isVirtualized,
    'euiCodeBlock__pre--isVirtualized': isVirtualized
  });
  var preFullscreenProps = (0, _react.useMemo)(function () {
    return {
      className: preClasses,
      tabIndex: 0,
      onKeyDown: onKeyDown
    };
  }, [preClasses, onKeyDown]);
  var optionalStyles = {};

  if (overflowHeight) {
    var property = typeof overflowHeight === 'string' ? 'height' : 'maxHeight';
    optionalStyles[property] = overflowHeight;
  }

  var wrapperProps = {
    className: classes,
    style: optionalStyles
  };
  var codeBlockControls;

  if (showCopyButton || showFullScreenButton) {
    codeBlockControls = (0, _react2.jsx)("div", {
      className: "euiCodeBlock__controls"
    }, (0, _react2.jsx)(FullScreenButton, null), (0, _react2.jsx)(CopyButton, null));
  }

  return (0, _react2.jsx)("div", wrapperProps, isVirtualized ? (0, _react2.jsx)(VirtualizedCodeBlock, {
    data: data,
    rowHeight: fontSizeToRowHeightMap[fontSize],
    overflowHeight: overflowHeight,
    preProps: preFullscreenProps // Note: the virtualized codeblock always sets a tabIndex of 0
    ,
    codeProps: codeProps
  }) : (0, _react2.jsx)("pre", {
    ref: combinedRef,
    style: optionalStyles,
    className: preClasses,
    tabIndex: tabIndex
  }, (0, _react2.jsx)("code", codeProps, content)), codeBlockControls, (0, _react2.jsx)(FullScreenDisplay, {
    className: wrapperClasses
  }, isVirtualized ? (0, _react2.jsx)(VirtualizedCodeBlock, {
    data: data,
    rowHeight: fontSizeToRowHeightMap.l,
    preProps: preFullscreenProps,
    codeProps: codeProps
  }) : (0, _react2.jsx)("pre", preFullscreenProps, (0, _react2.jsx)("code", codeProps, content)), codeBlockControls));
};
/**
 * Overflow logic
 *
 * Detects whether the code block overflows and returns a tabIndex of 0 if so,
 * which allows keyboard users to use the up/down arrow keys to scroll through
 * the container.
 */


exports.EuiCodeBlock = EuiCodeBlock;
EuiCodeBlock.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Sets the syntax highlighting for a specific language
       * @see [https://prismjs.com/#supported-languages](https://prismjs.com/#supported-languages) for options
       */
  language: _propTypes.default.string,
  transparentBackground: _propTypes.default.bool,
  paddingSize: _propTypes.default.oneOf(["none", "s", "m", "l"]),
  fontSize: _propTypes.default.oneOf(["s", "m", "l"]),

  /**
     * Specify how `white-space` inside the element is handled.
     * `pre` respects line breaks/white space but doesn't force them to wrap the line
     * `pre-wrap` respects line breaks/white space but does force them to wrap the line when necessary.
     */
  whiteSpace: _propTypes.default.oneOfType([_propTypes.default.oneOf(["pre", "pre-wrap"]), _propTypes.default.oneOfType([_propTypes.default.oneOf(["pre"]), _propTypes.default.oneOf(["pre", "pre-wrap"])])]),

  /**
     * Displays an icon button to copy the code snippet to the clipboard.
     */
  isCopyable: _propTypes.default.bool,

  /**
     * Displays line numbers.
     * Optionally accepts a configuration object for setting the starting number and visual highlighting ranges:
     * `{ start: 100, highlight: '1, 5-10, 20-30, 40' }`
     */
  lineNumbers: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.shape({
    start: _propTypes.default.number,
    highlight: _propTypes.default.string
  }).isRequired]),

  /**
     * Sets the maximum container height.
     * Accepts a pixel value (`300`) or a percentage (`'100%'`)
     * Ensure the container has calcuable height when using a percentage
     */
  overflowHeight: _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired]), _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired]).isRequired, _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired])])]),

  /**
     * Renders code block lines virtually.
     * Useful for improving load times of large code blocks.
     *
     * When using this configuration, `overflowHeight` is required and
     * `whiteSpace` can only be `pre`.
     */
  isVirtualized: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.oneOfType([_propTypes.default.oneOf([true]).isRequired, _propTypes.default.oneOf([false])])])
};

var useOverflowDetection = function useOverflowDetection() {
  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      wrapperRef = _useState2[0],
      setWrapperRef = _useState2[1];

  var _useState3 = (0, _react.useState)(-1),
      _useState4 = _slicedToArray(_useState3, 2),
      tabIndex = _useState4[0],
      setTabIndex = _useState4[1];

  var _useResizeObserver = (0, _resize_observer.useResizeObserver)(wrapperRef),
      width = _useResizeObserver.width,
      height = _useResizeObserver.height;

  var doesOverflow = function doesOverflow() {
    if (!wrapperRef) return;
    var clientWidth = wrapperRef.clientWidth,
        clientHeight = wrapperRef.clientHeight,
        scrollWidth = wrapperRef.scrollWidth,
        scrollHeight = wrapperRef.scrollHeight;
    var doesOverflow = scrollHeight > clientHeight || scrollWidth > clientWidth;
    setTabIndex(doesOverflow ? 0 : -1);
  };

  (0, _mutation_observer.useMutationObserver)(wrapperRef, doesOverflow, {
    subtree: true,
    childList: true
  });
  (0, _react.useEffect)(doesOverflow, [width, height, wrapperRef]);
  return {
    setWrapperRef: setWrapperRef,
    tabIndex: tabIndex
  };
};
/**
 * Copy logic
 */


var useCopy = function useCopy(_ref2) {
  var isCopyable = _ref2.isCopyable,
      isVirtualized = _ref2.isVirtualized,
      children = _ref2.children;

  var _useInnerText = (0, _inner_text.useInnerText)(''),
      _useInnerText2 = _slicedToArray(_useInnerText, 2),
      innerTextRef = _useInnerText2[0],
      _innerText = _useInnerText2[1];

  var innerText = (0, _react.useMemo)(function () {
    return (_innerText === null || _innerText === void 0 ? void 0 : _innerText.replace(/[\r\n?]{2}|\n\n/g, '\n')) || '';
  }, [_innerText]);
  var textToCopy = isVirtualized ? "".concat(children) : innerText; // Virtualized code blocks do not have inner text

  var showCopyButton = isCopyable && textToCopy;

  var CopyButton = function CopyButton() {
    if (!showCopyButton) return null;
    return (0, _react2.jsx)("div", {
      className: "euiCodeBlock__copyButton"
    }, (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiCodeBlock.copyButton",
      default: "Copy"
    }, function (copyButton) {
      return (0, _react2.jsx)(_copy.EuiCopy, {
        textToCopy: textToCopy
      }, function (copy) {
        return (0, _react2.jsx)(_button.EuiButtonIcon, {
          onClick: copy,
          iconType: "copyClipboard",
          color: "text",
          "aria-label": copyButton
        });
      });
    }));
  };

  return {
    innerTextRef: innerTextRef,
    showCopyButton: showCopyButton,
    CopyButton: CopyButton
  };
};
/**
 * Fullscreen logic
 */


var useFullScreen = function useFullScreen(_ref3) {
  var overflowHeight = _ref3.overflowHeight;

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isFullScreen = _useState6[0],
      setIsFullScreen = _useState6[1];

  var toggleFullScreen = function toggleFullScreen() {
    setIsFullScreen(!isFullScreen);
  };

  var onKeyDown = (0, _react.useCallback)(function (event) {
    if (event.key === _services.keys.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
      setIsFullScreen(false);
    }
  }, []);
  var showFullScreenButton = !!overflowHeight;

  var FullScreenButton = function FullScreenButton() {
    if (!showFullScreenButton) return null;
    return (0, _react2.jsx)(_i18n.EuiI18n, {
      tokens: ['euiCodeBlock.fullscreenCollapse', 'euiCodeBlock.fullscreenExpand'],
      defaults: ['Collapse', 'Expand']
    }, function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          fullscreenCollapse = _ref5[0],
          fullscreenExpand = _ref5[1];

      return (0, _react2.jsx)(_button.EuiButtonIcon, {
        className: "euiCodeBlock__fullScreenButton",
        onClick: toggleFullScreen,
        iconType: isFullScreen ? 'fullScreenExit' : 'fullScreen',
        color: "text",
        "aria-label": isFullScreen ? fullscreenCollapse : fullscreenExpand
      });
    });
  };

  var FullScreenDisplay = function FullScreenDisplay(_ref6) {
    var children = _ref6.children,
        className = _ref6.className;
    if (!isFullScreen) return null; // Force fullscreen to use large font and padding.

    var fullScreenClasses = (0, _classnames.default)(className, 'euiCodeBlock--fontLarge', 'euiCodeBlock--paddingLarge', 'euiCodeBlock-isFullScreen'); // Attaches to the body because of EuiOverlayMask's React portal usage.

    return (0, _react2.jsx)(_overlay_mask.EuiOverlayMask, null, (0, _react2.jsx)(_focus_trap.EuiFocusTrap, {
      clickOutsideDisables: true
    }, (0, _react2.jsx)("div", {
      className: fullScreenClasses
    }, children)));
  };

  return {
    showFullScreenButton: showFullScreenButton,
    FullScreenButton: FullScreenButton,
    FullScreenDisplay: FullScreenDisplay,
    onKeyDown: onKeyDown
  };
};
/**
 * Virtualization logic
 */


var ListRow = function ListRow(_ref7) {
  var data = _ref7.data,
      index = _ref7.index,
      style = _ref7.style;
  var row = data[index];
  row.properties.style = style;
  return (0, _utils.nodeToHtml)(row, index, data, 0);
};

var VirtualizedCodeBlock = function VirtualizedCodeBlock(_ref8) {
  var data = _ref8.data,
      rowHeight = _ref8.rowHeight,
      overflowHeight = _ref8.overflowHeight,
      preProps = _ref8.preProps,
      codeProps = _ref8.codeProps;
  var VirtualizedOuterElement = (0, _react.useMemo)(function () {
    return /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
      return (0, _react2.jsx)("pre", _extends({}, props, {
        ref: ref
      }, preProps));
    });
  }, [preProps]);
  var VirtualizedInnerElement = (0, _react.useMemo)(function () {
    return /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
      return (0, _react2.jsx)("code", _extends({}, props, {
        ref: ref
      }, codeProps));
    });
  }, [codeProps]);
  return (0, _react2.jsx)(_auto_sizer.EuiAutoSizer, {
    disableHeight: typeof overflowHeight === 'number'
  }, function (_ref9) {
    var height = _ref9.height,
        width = _ref9.width;
    return (0, _react2.jsx)(_reactWindow.FixedSizeList, {
      height: height !== null && height !== void 0 ? height : overflowHeight,
      width: width,
      itemData: data,
      itemSize: rowHeight,
      itemCount: data.length,
      outerElementType: VirtualizedOuterElement,
      innerElementType: VirtualizedInnerElement
    }, ListRow);
  });
};