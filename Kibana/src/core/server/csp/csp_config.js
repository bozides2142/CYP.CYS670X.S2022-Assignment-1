"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CspConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _config = require("./config");

var _csp_directives = require("./csp_directives");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

const DEFAULT_CONFIG = Object.freeze(_config.config.schema.validate({}));
/**
 * CSP configuration for use in Kibana.
 * @public
 */

var _directives = /*#__PURE__*/new WeakMap();

/**
 * CSP configuration for use in Kibana.
 * @public
 */
class CspConfig {
  /**
   * Returns the default CSP configuration when passed with no config
   * @internal
   */
  constructor(rawCspConfig) {
    _classPrivateFieldInitSpec(this, _directives, {
      writable: true,
      value: void 0
    });

    (0, _defineProperty2.default)(this, "strict", void 0);
    (0, _defineProperty2.default)(this, "warnLegacyBrowsers", void 0);
    (0, _defineProperty2.default)(this, "disableEmbedding", void 0);
    (0, _defineProperty2.default)(this, "header", void 0);
    (0, _classPrivateFieldSet2.default)(this, _directives, _csp_directives.CspDirectives.fromConfig(rawCspConfig));

    if (rawCspConfig.disableEmbedding) {
      (0, _classPrivateFieldGet2.default)(this, _directives).clearDirectiveValues('frame-ancestors');
      (0, _classPrivateFieldGet2.default)(this, _directives).addDirectiveValue('frame-ancestors', `'self'`);
    }

    this.header = (0, _classPrivateFieldGet2.default)(this, _directives).getCspHeader();
    this.strict = rawCspConfig.strict;
    this.warnLegacyBrowsers = rawCspConfig.warnLegacyBrowsers;
    this.disableEmbedding = rawCspConfig.disableEmbedding;
  }

}

exports.CspConfig = CspConfig;
(0, _defineProperty2.default)(CspConfig, "DEFAULT", new CspConfig(DEFAULT_CONFIG));