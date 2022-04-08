"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultParsingPlugins = exports.getDefaultEuiMarkdownParsingPlugins = void 0;

var _remarkParse = _interopRequireDefault(require("remark-parse"));

var _remarkEmoji = _interopRequireDefault(require("remark-emoji"));

var _remarkBreaks = _interopRequireDefault(require("remark-breaks"));

var _remark_prismjs = _interopRequireDefault(require("../remark/remark_prismjs"));

var MarkdownTooltip = _interopRequireWildcard(require("../markdown_tooltip"));

var MarkdownCheckbox = _interopRequireWildcard(require("../markdown_checkbox"));

var _markdown_link_validator = require("../markdown_link_validator");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Importing seemingly unused types from `unified` because the definitions
// are exported for two versions of TypeScript (3.4, 4.0) and implicit
// imports during eui.d.ts generation default to the incorrect version (3.4).
// Explicit imports here resolve the version mismatch.
var getDefaultEuiMarkdownParsingPlugins = function getDefaultEuiMarkdownParsingPlugins() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      exclude = _ref.exclude;

  var excludeSet = new Set(exclude);
  var parsingPlugins = [[_remarkParse.default, {}], [_remark_prismjs.default, {}], [_remarkEmoji.default, {
    emoticon: false
  }], [_remarkBreaks.default, {}], [_markdown_link_validator.markdownLinkValidator, {}], [MarkdownCheckbox.parser, {}]];
  if (!excludeSet.has('tooltip')) parsingPlugins.push([MarkdownTooltip.parser, {}]);
  return parsingPlugins;
};

exports.getDefaultEuiMarkdownParsingPlugins = getDefaultEuiMarkdownParsingPlugins;
var defaultParsingPlugins = getDefaultEuiMarkdownParsingPlugins();
exports.defaultParsingPlugins = defaultParsingPlugins;