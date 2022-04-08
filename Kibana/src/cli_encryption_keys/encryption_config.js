"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptionConfig = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = require("path");

var _lodash = require("lodash");

var _fs = require("fs");

var _jsYaml = require("js-yaml");

var _utils = require("@kbn/utils");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

var _config = /*#__PURE__*/new WeakMap();

var _encryptionKeyPaths = /*#__PURE__*/new WeakMap();

var _encryptionMeta = /*#__PURE__*/new WeakMap();

class EncryptionConfig {
  constructor() {
    _classPrivateFieldInitSpec(this, _config, {
      writable: true,
      value: (0, _jsYaml.safeLoad)((0, _fs.readFileSync)((0, _path.join)((0, _utils.getConfigDirectory)(), 'kibana.yml')))
    });

    _classPrivateFieldInitSpec(this, _encryptionKeyPaths, {
      writable: true,
      value: ['xpack.encryptedSavedObjects.encryptionKey', 'xpack.reporting.encryptionKey', 'xpack.security.encryptionKey']
    });

    _classPrivateFieldInitSpec(this, _encryptionMeta, {
      writable: true,
      value: {
        'xpack.encryptedSavedObjects.encryptionKey': {
          docs: 'https://www.elastic.co/guide/en/kibana/current/xpack-security-secure-saved-objects.html#xpack-security-secure-saved-objects',
          description: 'Used to encrypt stored objects such as dashboards and visualizations'
        },
        'xpack.reporting.encryptionKey': {
          docs: 'https://www.elastic.co/guide/en/kibana/current/reporting-settings-kb.html#general-reporting-settings',
          description: 'Used to encrypt saved reports'
        },
        'xpack.security.encryptionKey': {
          docs: 'https://www.elastic.co/guide/en/kibana/current/security-settings-kb.html#security-session-and-cookie-settings',
          description: 'Used to encrypt session information'
        }
      }
    });
  }

  _getEncryptionKey(key) {
    return (0, _lodash.get)((0, _classPrivateFieldGet2.default)(this, _config), key);
  }

  _hasEncryptionKey(key) {
    return !!(0, _lodash.get)((0, _classPrivateFieldGet2.default)(this, _config), key);
  }

  _generateEncryptionKey() {
    return _crypto.default.randomBytes(16).toString('hex');
  }

  docs({
    comment
  } = {}) {
    const commentString = comment ? '#' : '';
    let docs = '';
    (0, _classPrivateFieldGet2.default)(this, _encryptionKeyPaths).forEach(key => {
      docs += `${commentString}${key}
    ${commentString}${(0, _classPrivateFieldGet2.default)(this, _encryptionMeta)[key].description}
    ${commentString}${(0, _classPrivateFieldGet2.default)(this, _encryptionMeta)[key].docs}
\n`;
    });
    return docs;
  }

  generate({
    force = false
  }) {
    const output = {};
    (0, _classPrivateFieldGet2.default)(this, _encryptionKeyPaths).forEach(key => {
      if (force || !this._hasEncryptionKey(key)) {
        output[key] = this._generateEncryptionKey();
      }
    });
    return output;
  }

}

exports.EncryptionConfig = EncryptionConfig;