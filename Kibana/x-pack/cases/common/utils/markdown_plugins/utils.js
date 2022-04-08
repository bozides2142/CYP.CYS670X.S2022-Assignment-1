"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyMarkdownComment = exports.parseCommentString = exports.isLensMarkdownNode = exports.getLensVisualizations = void 0;

var _lodash = require("lodash");

var _remarkParse = _interopRequireDefault(require("remark-parse"));

var _remarkStringify = _interopRequireDefault(require("remark-stringify"));

var _unified = _interopRequireDefault(require("unified"));

var _lens = require("./lens");

var _timeline = require("./timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getLensVisualizations = parsedComment => parsedComment !== null && parsedComment !== void 0 && parsedComment.length ? (0, _lodash.filter)(parsedComment, {
  type: _lens.LENS_ID
}) : [];
/**
 * Converts a text comment into a series of markdown nodes that represent a lens visualization, a timeline link, or just
 * plain markdown.
 */


exports.getLensVisualizations = getLensVisualizations;

const parseCommentString = comment => {
  const processor = (0, _unified.default)().use([[_remarkParse.default, {}], _lens.LensParser, _timeline.TimelineParser]);
  return processor.parse(comment);
};

exports.parseCommentString = parseCommentString;

const stringifyMarkdownComment = comment => (0, _unified.default)().use([[_remarkStringify.default],
/*
  because we're using rison in the timeline url we need
  to make sure that markdown parser doesn't modify the url
*/
_lens.LensSerializer, _timeline.TimelineSerializer]).stringify(comment);

exports.stringifyMarkdownComment = stringifyMarkdownComment;

const isLensMarkdownNode = node => {
  const unsafeNode = node;
  return unsafeNode != null && unsafeNode.timeRange != null && unsafeNode.attributes != null && unsafeNode.type === 'lens';
};

exports.isLensMarkdownNode = isLensMarkdownNode;