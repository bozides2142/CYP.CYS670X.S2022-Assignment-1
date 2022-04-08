"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _fieldTypes = require("@kbn/field-types");

var _utils = require("../utils");

var _field_format = require("../field_format");

var _types = require("../types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const templateMatchRE = /{{([\s\S]+?)}}/g;
const allowedUrlSchemes = ['http://', 'https://'];
const URL_TYPES = [{
  kind: 'a',
  text: _i18n.i18n.translate('fieldFormats.url.types.link', {
    defaultMessage: 'Link'
  })
}, {
  kind: 'img',
  text: _i18n.i18n.translate('fieldFormats.url.types.img', {
    defaultMessage: 'Image'
  })
}, {
  kind: 'audio',
  text: _i18n.i18n.translate('fieldFormats.url.types.audio', {
    defaultMessage: 'Audio'
  })
}];
const DEFAULT_URL_TYPE = 'a';
/** @public */

class UrlFormat extends _field_format.FieldFormat {
  constructor(params) {
    super(params);
    (0, _defineProperty2.default)(this, "textConvert", value => this.formatLabel(value));
    (0, _defineProperty2.default)(this, "htmlConvert", (rawValue, options = {}) => {
      const {
        field,
        hit
      } = options;
      const {
        parsedUrl
      } = this._params;
      const {
        basePath,
        pathname,
        origin
      } = parsedUrl || {};
      const url = (0, _lodash.escape)(this.formatUrl(rawValue));
      const label = (0, _lodash.escape)(this.formatLabel(rawValue, url));

      switch (this.param('type')) {
        case 'audio':
          return `<audio controls preload="none" src="${url}">`;

        case 'img':
          // If the URL hasn't been formatted to become a meaningful label then the best we can do
          // is tell screen readers where the image comes from.
          const imageLabel = label === url ? `A dynamically-specified image located at ${url}` : label;
          return this.generateImgHtml(url, imageLabel);

        default:
          const allowed = allowedUrlSchemes.some(scheme => url.indexOf(scheme) === 0);

          if (!allowed && !parsedUrl) {
            return url;
          }

          let prefix = '';
          /**
           * This code attempts to convert a relative url into a kibana absolute url
           *
           * SUPPORTED:
           *  - /app/kibana/
           *  - ../app/kibana
           *  - #/discover
           *
           * UNSUPPORTED
           *  - app/kibana
           */

          if (!allowed) {
            // Handles urls like: `#/discover`
            if (url[0] === '#') {
              prefix = `${origin}${pathname}`;
            } // Handle urls like: `/app/kibana` or `/xyz/app/kibana`
            else if (url.indexOf(basePath || '/') === 0) {
              prefix = `${origin}`;
            } // Handle urls like: `../app/kibana`
            else {
              const prefixEnd = url[0] === '/' ? '' : '/';
              prefix = `${origin}${basePath || ''}/app${prefixEnd}`;
            }
          }

          let linkLabel;

          if (hit && hit.highlight && hit.highlight[field === null || field === void 0 ? void 0 : field.name]) {
            linkLabel = (0, _utils.getHighlightHtml)(label, hit.highlight[field.name]);
          } else {
            linkLabel = label;
          }

          const linkTarget = this.param('openLinkInCurrentTab') ? '_self' : '_blank';
          return `<a href="${prefix}${url}" target="${linkTarget}" rel="noopener noreferrer">${linkLabel}</a>`;
      }
    });
    this.compileTemplate = (0, _lodash.memoize)(this.compileTemplate);
  }

  getParamDefaults() {
    return {
      type: DEFAULT_URL_TYPE,
      urlTemplate: null,
      labelTemplate: null,
      width: null,
      height: null
    };
  }

  formatLabel(value, url) {
    const template = this.param('labelTemplate');
    if (url == null) url = this.formatUrl(value);
    if (!template) return url;
    return this.compileTemplate(template)({
      value,
      url
    });
  }

  formatUrl(value) {
    const template = this.param('urlTemplate');
    if (!template) return value;
    return this.compileTemplate(template)({
      value: encodeURIComponent(value),
      rawValue: value
    });
  }

  compileTemplate(template) {
    // trim all the odd bits, the variable names
    const parts = template.split(templateMatchRE).map((part, i) => i % 2 ? part.trim() : part);
    return function (locals) {
      // replace all the odd bits with their local var
      let output = '';
      let i = -1;

      while (++i < parts.length) {
        if (i % 2) {
          if (locals.hasOwnProperty(parts[i])) {
            const local = locals[parts[i]];
            output += local == null ? '' : local;
          }
        } else {
          output += parts[i];
        }
      }

      return output;
    };
  }

  generateImgHtml(url, imageLabel) {
    const parsedWidth = parseInt(this.param('width'), 10);
    const parsedHeight = parseInt(this.param('height'), 10);
    const isValidWidth = !isNaN(parsedWidth);
    const isValidHeight = !isNaN(parsedHeight);
    const maxWidth = isValidWidth ? `${parsedWidth}px` : 'none';
    const maxHeight = isValidHeight ? `${parsedHeight}px` : 'none';
    return `<img src="${url}" alt="${imageLabel}" style="width:auto; height:auto; max-width:${maxWidth}; max-height:${maxHeight};">`;
  }

}

exports.UrlFormat = UrlFormat;
(0, _defineProperty2.default)(UrlFormat, "id", _types.FIELD_FORMAT_IDS.URL);
(0, _defineProperty2.default)(UrlFormat, "title", _i18n.i18n.translate('fieldFormats.url.title', {
  defaultMessage: 'Url'
}));
(0, _defineProperty2.default)(UrlFormat, "fieldType", [_fieldTypes.KBN_FIELD_TYPES.NUMBER, _fieldTypes.KBN_FIELD_TYPES.BOOLEAN, _fieldTypes.KBN_FIELD_TYPES.DATE, _fieldTypes.KBN_FIELD_TYPES.IP, _fieldTypes.KBN_FIELD_TYPES.STRING, _fieldTypes.KBN_FIELD_TYPES.MURMUR3, _fieldTypes.KBN_FIELD_TYPES.UNKNOWN, _fieldTypes.KBN_FIELD_TYPES.CONFLICT]);
(0, _defineProperty2.default)(UrlFormat, "urlTypes", URL_TYPES);