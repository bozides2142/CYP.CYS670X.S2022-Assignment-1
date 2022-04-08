"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultRules = exports.additionalRules = exports.CspDirectives = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The default directives rules that are always applied
 */
const defaultRules = {
  'script-src': [`'unsafe-eval'`, `'self'`],
  'worker-src': [`blob:`, `'self'`],
  'style-src': [`'unsafe-inline'`, `'self'`]
};
/**
 * Per-directive rules that will be added when the configuration contains at least one value
 * Main purpose is to add `self` value to some directives when the configuration specifies other values
 */

exports.defaultRules = defaultRules;
const additionalRules = {
  'connect-src': [`'self'`],
  'default-src': [`'self'`],
  'font-src': [`'self'`],
  'img-src': [`'self'`],
  'frame-ancestors': [`'self'`],
  'frame-src': [`'self'`]
};
exports.additionalRules = additionalRules;

class CspDirectives {
  constructor() {
    (0, _defineProperty2.default)(this, "directives", new Map());
  }

  addDirectiveValue(directiveName, directiveValue) {
    if (!this.directives.has(directiveName)) {
      this.directives.set(directiveName, new Set());
    }

    this.directives.get(directiveName).add(normalizeDirectiveValue(directiveValue));
  }

  clearDirectiveValues(directiveName) {
    this.directives.delete(directiveName);
  }

  getCspHeader() {
    return [...this.directives.entries()].map(([name, values]) => {
      return [name, ...values].join(' ');
    }).join('; ');
  }

  static fromConfig(config) {
    const cspDirectives = new CspDirectives(); // combining `default` directive configurations

    Object.entries(defaultRules).forEach(([key, values]) => {
      values === null || values === void 0 ? void 0 : values.forEach(value => {
        cspDirectives.addDirectiveValue(key, value);
      });
    }); // adding per-directive configuration

    const additiveConfig = parseConfigDirectives(config);
    [...additiveConfig.entries()].forEach(([directiveName, directiveValues]) => {
      var _additionalRules$dire;

      const additionalValues = (_additionalRules$dire = additionalRules[directiveName]) !== null && _additionalRules$dire !== void 0 ? _additionalRules$dire : [];
      [...additionalValues, ...directiveValues].forEach(value => {
        cspDirectives.addDirectiveValue(directiveName, value);
      });
    });
    return cspDirectives;
  }

}

exports.CspDirectives = CspDirectives;

const parseConfigDirectives = cspConfig => {
  var _cspConfig$script_src, _cspConfig$worker_src, _cspConfig$style_src, _cspConfig$connect_sr, _cspConfig$default_sr, _cspConfig$font_src, _cspConfig$frame_src, _cspConfig$img_src, _cspConfig$frame_ance, _cspConfig$report_uri, _cspConfig$report_to;

  const map = new Map();

  if ((_cspConfig$script_src = cspConfig.script_src) !== null && _cspConfig$script_src !== void 0 && _cspConfig$script_src.length) {
    map.set('script-src', cspConfig.script_src);
  }

  if ((_cspConfig$worker_src = cspConfig.worker_src) !== null && _cspConfig$worker_src !== void 0 && _cspConfig$worker_src.length) {
    map.set('worker-src', cspConfig.worker_src);
  }

  if ((_cspConfig$style_src = cspConfig.style_src) !== null && _cspConfig$style_src !== void 0 && _cspConfig$style_src.length) {
    map.set('style-src', cspConfig.style_src);
  }

  if ((_cspConfig$connect_sr = cspConfig.connect_src) !== null && _cspConfig$connect_sr !== void 0 && _cspConfig$connect_sr.length) {
    map.set('connect-src', cspConfig.connect_src);
  }

  if ((_cspConfig$default_sr = cspConfig.default_src) !== null && _cspConfig$default_sr !== void 0 && _cspConfig$default_sr.length) {
    map.set('default-src', cspConfig.default_src);
  }

  if ((_cspConfig$font_src = cspConfig.font_src) !== null && _cspConfig$font_src !== void 0 && _cspConfig$font_src.length) {
    map.set('font-src', cspConfig.font_src);
  }

  if ((_cspConfig$frame_src = cspConfig.frame_src) !== null && _cspConfig$frame_src !== void 0 && _cspConfig$frame_src.length) {
    map.set('frame-src', cspConfig.frame_src);
  }

  if ((_cspConfig$img_src = cspConfig.img_src) !== null && _cspConfig$img_src !== void 0 && _cspConfig$img_src.length) {
    map.set('img-src', cspConfig.img_src);
  }

  if ((_cspConfig$frame_ance = cspConfig.frame_ancestors) !== null && _cspConfig$frame_ance !== void 0 && _cspConfig$frame_ance.length) {
    map.set('frame-ancestors', cspConfig.frame_ancestors);
  }

  if ((_cspConfig$report_uri = cspConfig.report_uri) !== null && _cspConfig$report_uri !== void 0 && _cspConfig$report_uri.length) {
    map.set('report-uri', cspConfig.report_uri);
  }

  if ((_cspConfig$report_to = cspConfig.report_to) !== null && _cspConfig$report_to !== void 0 && _cspConfig$report_to.length) {
    map.set('report-to', cspConfig.report_to);
  }

  return map;
};

const keywordTokens = ['none', 'self', 'strict-dynamic', 'report-sample', 'unsafe-inline', 'unsafe-eval', 'unsafe-hashes', 'unsafe-allow-redirects'];

function normalizeDirectiveValue(value) {
  if (keywordTokens.includes(value)) {
    return `'${value}'`;
  }

  return value;
}