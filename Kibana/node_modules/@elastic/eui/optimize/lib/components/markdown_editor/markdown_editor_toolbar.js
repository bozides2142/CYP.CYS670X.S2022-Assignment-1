"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiMarkdownEditorToolbar = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _button = require("../button");

var _i18n = require("../i18n");

var _tool_tip = require("../tool_tip");

var _markdown_modes = require("./markdown_modes");

var _markdown_context = require("./markdown_context");

var _markdown_checkmark = _interopRequireDefault(require("./icons/markdown_checkmark"));

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore a react svg
var boldItalicButtons = [{
  id: 'mdBold',
  label: 'Bold',
  name: 'bold',
  iconType: 'editorBold'
}, {
  id: 'mdItalic',
  label: 'Italic',
  name: 'italic',
  iconType: 'editorItalic'
}];
var listButtons = [{
  id: 'mdUl',
  label: 'Unordered list',
  name: 'ul',
  iconType: 'editorUnorderedList'
}, {
  id: 'mdOl',
  label: 'Ordered list',
  name: 'ol',
  iconType: 'editorOrderedList'
}, {
  id: 'mdTl',
  label: 'Task list',
  name: 'tl',
  iconType: _markdown_checkmark.default
}];
var quoteCodeLinkButtons = [{
  id: 'mdQuote',
  label: 'Quote',
  name: 'quote',
  iconType: 'quote'
}, {
  id: 'mdCode',
  label: 'Code',
  name: 'code',
  iconType: 'editorCodeBlock'
}, {
  id: 'mdLink',
  label: 'Link',
  name: 'link',
  iconType: 'editorLink'
}];
var EuiMarkdownEditorToolbar = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var markdownActions = _ref.markdownActions,
      viewMode = _ref.viewMode,
      onClickPreview = _ref.onClickPreview,
      uiPlugins = _ref.uiPlugins,
      selectedNode = _ref.selectedNode;

  var _useContext = (0, _react.useContext)(_markdown_context.EuiMarkdownContext),
      openPluginEditor = _useContext.openPluginEditor;

  var handleMdButtonClick = function handleMdButtonClick(mdButtonId) {
    var actionResult = markdownActions.do(mdButtonId);
    if (actionResult !== true) openPluginEditor(actionResult);
  };

  var isPreviewing = viewMode === _markdown_modes.MODE_VIEWING;
  return (0, _react2.jsx)("div", {
    ref: ref,
    className: "euiMarkdownEditorToolbar"
  }, (0, _react2.jsx)("div", {
    className: "euiMarkdownEditorToolbar__buttons"
  }, boldItalicButtons.map(function (item) {
    return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      key: item.id,
      content: item.label,
      delay: "long"
    }, (0, _react2.jsx)(_button.EuiButtonIcon, {
      color: "text",
      onClick: function onClick() {
        return handleMdButtonClick(item.id);
      },
      iconType: item.iconType,
      "aria-label": item.label,
      isDisabled: isPreviewing
    }));
  }), (0, _react2.jsx)("span", {
    className: "euiMarkdownEditorToolbar__divider"
  }), listButtons.map(function (item) {
    return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      key: item.id,
      content: item.label,
      delay: "long"
    }, (0, _react2.jsx)(_button.EuiButtonIcon, {
      color: "text",
      onClick: function onClick() {
        return handleMdButtonClick(item.id);
      },
      iconType: item.iconType,
      "aria-label": item.label,
      isDisabled: isPreviewing
    }));
  }), (0, _react2.jsx)("span", {
    className: "euiMarkdownEditorToolbar__divider"
  }), quoteCodeLinkButtons.map(function (item) {
    return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      key: item.id,
      content: item.label,
      delay: "long"
    }, (0, _react2.jsx)(_button.EuiButtonIcon, {
      color: "text",
      onClick: function onClick() {
        return handleMdButtonClick(item.id);
      },
      iconType: item.iconType,
      "aria-label": item.label,
      isDisabled: isPreviewing
    }));
  }), uiPlugins.length > 0 ? (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)("span", {
    className: "euiMarkdownEditorToolbar__divider"
  }), uiPlugins.map(function (_ref2) {
    var name = _ref2.name,
        button = _ref2.button;
    var isSelectedNodeType = selectedNode && selectedNode.type === name;
    return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      key: name,
      content: button.label,
      delay: "long"
    }, (0, _react2.jsx)(_button.EuiButtonIcon, (0, _extends2.default)({
      color: "text"
    }, isSelectedNodeType ? {
      style: {
        background: 'rgba(0, 0, 0, 0.15)'
      }
    } : null, {
      onClick: function onClick() {
        return handleMdButtonClick(name);
      },
      iconType: button.iconType,
      "aria-label": button.label,
      isDisabled: isPreviewing
    })));
  })) : null), isPreviewing ? (0, _react2.jsx)(_button.EuiButtonEmpty, {
    iconType: "editorCodeBlock",
    color: "text",
    size: "s",
    onClick: onClickPreview
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiMarkdownEditorToolbar.editor",
    default: "Editor"
  })) : (0, _react2.jsx)(_button.EuiButtonEmpty, {
    iconType: "eye",
    color: "text",
    size: "s",
    onClick: onClickPreview
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiMarkdownEditorToolbar.previewMarkdown",
    default: "Preview"
  })));
});
exports.EuiMarkdownEditorToolbar = EuiMarkdownEditorToolbar;
EuiMarkdownEditorToolbar.displayName = 'EuiMarkdownEditorToolbar';