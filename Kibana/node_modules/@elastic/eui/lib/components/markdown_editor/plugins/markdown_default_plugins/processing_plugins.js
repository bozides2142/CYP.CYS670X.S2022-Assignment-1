"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProcessingPlugins = exports.getDefaultEuiMarkdownProcessingPlugins = void 0;

var _react = _interopRequireWildcard(require("react"));

var _all = _interopRequireDefault(require("mdast-util-to-hast/lib/all"));

var _rehypeReact = _interopRequireDefault(require("rehype-react"));

var _remarkRehype = _interopRequireDefault(require("remark-rehype"));

var MarkdownTooltip = _interopRequireWildcard(require("../markdown_tooltip"));

var MarkdownCheckbox = _interopRequireWildcard(require("../markdown_checkbox"));

var _remark_prismjs = require("../remark/remark_prismjs");

var _link = require("../../../link");

var _code = require("../../../code");

var _horizontal_rule = require("../../../horizontal_rule");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var unknownHandler = function unknownHandler(h, node) {
  return h(node, node.type, node, (0, _all.default)(h, node));
};

var getDefaultEuiMarkdownProcessingPlugins = function getDefaultEuiMarkdownProcessingPlugins() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      exclude = _ref.exclude;

  var excludeSet = new Set(exclude);
  var plugins = [[_remarkRehype.default, {
    allowDangerousHtml: true,
    unknownHandler: unknownHandler,
    handlers: {} // intentionally empty, allows plugins to extend if they need to

  }], [_rehypeReact.default, {
    createElement: _react.createElement,
    Fragment: _react.Fragment,
    components: {
      a: _link.EuiLink,
      code: function code(props) {
        return (// If there are linebreaks use codeblock, otherwise code
          /\r|\n/.exec(props.children) || props.className && props.className.indexOf(_remark_prismjs.FENCED_CLASS) > -1 ? (0, _react2.jsx)(_code.EuiCodeBlock, _extends({
            fontSize: "m",
            paddingSize: "s",
            isCopyable: true
          }, props)) : (0, _react2.jsx)(_code.EuiCode, props)
        );
      },
      // When we use block code "fences" the code tag is replaced by the `EuiCodeBlock`.
      // But there's a `pre` tag wrapping all the `EuiCodeBlock`.
      // We want to replace this `pre` tag with a `div` because the `EuiCodeBlock` has its own children `pre` tag.
      pre: function pre(props) {
        return (0, _react2.jsx)("div", _extends({}, props, {
          className: "euiMarkdownFormat__codeblockWrapper"
        }));
      },
      blockquote: function blockquote(props) {
        return (0, _react2.jsx)("blockquote", _extends({}, props, {
          className: "euiMarkdownFormat__blockquote"
        }));
      },
      table: function table(props) {
        return (0, _react2.jsx)("table", _extends({
          className: "euiMarkdownFormat__table"
        }, props));
      },
      hr: function hr(props) {
        return (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, props);
      },
      checkboxPlugin: MarkdownCheckbox.renderer
    }
  }]];
  if (!excludeSet.has('tooltip')) plugins[1][1].components.tooltipPlugin = MarkdownTooltip.renderer;
  return plugins;
};

exports.getDefaultEuiMarkdownProcessingPlugins = getDefaultEuiMarkdownProcessingPlugins;
var defaultProcessingPlugins = getDefaultEuiMarkdownProcessingPlugins();
exports.defaultProcessingPlugins = defaultProcessingPlugins;