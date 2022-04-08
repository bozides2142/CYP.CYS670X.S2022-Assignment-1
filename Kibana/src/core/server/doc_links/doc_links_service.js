"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocLinksService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _docLinks = require("@kbn/doc-links");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class DocLinksService {
  constructor(core) {
    (0, _defineProperty2.default)(this, "kibanaBranch", void 0);
    (0, _defineProperty2.default)(this, "docLinks", void 0);
    this.kibanaBranch = core.env.packageInfo.branch;
  }

  setup() {
    const docMeta = (0, _docLinks.getDocLinksMeta)({
      kibanaBranch: this.kibanaBranch
    });
    const docLinks = (0, _docLinks.getDocLinks)({
      kibanaBranch: this.kibanaBranch
    });
    this.docLinks = { ...docMeta,
      links: docLinks
    };
    return this.docLinks;
  }

  start() {
    if (!this.docLinks) {
      throw new Error('#setup must be called before #start');
    }

    return this.docLinks;
  }

}

exports.DocLinksService = DocLinksService;