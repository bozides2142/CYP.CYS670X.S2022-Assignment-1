"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsSerializer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeDetect = _interopRequireDefault(require("type-detect"));

var _object_types = require("../object_types");

var _version = require("../version");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * A serializer that can be used to manually convert {@link SavedObjectsRawDoc | raw} or
 * {@link SavedObjectSanitizedDoc | sanitized} documents to the other kind.
 *
 * @remarks Serializer instances should only be created and accessed by calling {@link SavedObjectsServiceStart.createSerializer}
 *
 * @public
 */
class SavedObjectsSerializer {
  /**
   * @internal
   */
  constructor(registry) {
    (0, _defineProperty2.default)(this, "registry", void 0);
    this.registry = registry;
  }
  /**
   * Determines whether or not the raw document can be converted to a saved object.
   *
   * @param {SavedObjectsRawDoc} doc - The raw ES document to be tested
   * @param {SavedObjectsRawDocParseOptions} options - Options for parsing the raw document.
   */


  isRawSavedObject(doc, options = {}) {
    try {
      this.checkIsRawSavedObject(doc, options);
      return true;
    } catch (error) {// do nothing
    }

    return false;
  }

  checkIsRawSavedObject(doc, options = {}) {
    const {
      namespaceTreatment = 'strict'
    } = options;
    const {
      _id,
      _source
    } = doc;
    const {
      type,
      namespace
    } = _source;

    if (!type) {
      throw new Error(`Raw document '${_id}' is missing _source.type field`);
    }

    const {
      idMatchesPrefix,
      prefix
    } = this.parseIdPrefix(namespace, type, _id, namespaceTreatment);

    if (!idMatchesPrefix) {
      throw new Error(`Raw document '${_id}' does not start with expected prefix '${prefix}'`);
    }

    return idMatchesPrefix;
  }
  /**
   * Converts a document from the format that is stored in elasticsearch to the saved object client format.
   *
   * @param {SavedObjectsRawDoc} doc - The raw ES document to be converted to saved object format.
   * @param {SavedObjectsRawDocParseOptions} options - Options for parsing the raw document.
   */


  rawToSavedObject(doc, options = {}) {
    this.checkIsRawSavedObject(doc, options); // throws a descriptive error if the document is not a saved object

    const {
      namespaceTreatment = 'strict'
    } = options;
    const {
      _id,
      _source,
      _seq_no,
      _primary_term
    } = doc;
    const {
      type,
      namespaces,
      originId,
      migrationVersion,
      references,
      coreMigrationVersion
    } = _source;
    const version = _seq_no != null || _primary_term != null ? (0, _version.encodeVersion)(_seq_no, _primary_term) : undefined;
    const {
      id,
      namespace
    } = this.trimIdPrefix(_source.namespace, type, _id, namespaceTreatment);
    const includeNamespace = namespace && (namespaceTreatment === 'lax' || this.registry.isSingleNamespace(type));
    const includeNamespaces = this.registry.isMultiNamespace(type);
    return {
      type,
      id,
      ...(includeNamespace && {
        namespace
      }),
      ...(includeNamespaces && {
        namespaces
      }),
      ...(originId && {
        originId
      }),
      attributes: _source[type],
      references: references || [],
      ...(migrationVersion && {
        migrationVersion
      }),
      ...(coreMigrationVersion && {
        coreMigrationVersion
      }),
      ...(_source.updated_at && {
        updated_at: _source.updated_at
      }),
      ...(version && {
        version
      })
    };
  }
  /**
   * Converts a document from the saved object client format to the format that is stored in elasticsearch.
   *
   * @param {SavedObjectSanitizedDoc} savedObj - The saved object to be converted to raw ES format.
   */


  savedObjectToRaw(savedObj) {
    const {
      id,
      type,
      namespace,
      namespaces,
      originId,
      attributes,
      migrationVersion,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      updated_at,
      version,
      references,
      coreMigrationVersion
    } = savedObj;
    const source = {
      [type]: attributes,
      type,
      references,
      ...(namespace && this.registry.isSingleNamespace(type) && {
        namespace
      }),
      ...(namespaces && this.registry.isMultiNamespace(type) && {
        namespaces
      }),
      ...(originId && {
        originId
      }),
      ...(migrationVersion && {
        migrationVersion
      }),
      ...(coreMigrationVersion && {
        coreMigrationVersion
      }),
      ...(updated_at && {
        updated_at
      })
    };
    return {
      _id: this.generateRawId(namespace, type, id),
      _source: source,
      ...(version != null && (0, _version.decodeVersion)(version))
    };
  }
  /**
   * Given a saved object type and id, generates the compound id that is stored in the raw document.
   *
   * @param {string} namespace - The namespace of the saved object
   * @param {string} type - The saved object type
   * @param {string} id - The id of the saved object
   */


  generateRawId(namespace, type, id) {
    const namespacePrefix = namespace && this.registry.isSingleNamespace(type) ? `${namespace}:` : '';
    return `${namespacePrefix}${type}:${id}`;
  }
  /**
   * Given a saved object type and id, generates the compound id that is stored in the raw document for its legacy URL alias.
   *
   * @param {string} namespace - The namespace of the saved object
   * @param {string} type - The saved object type
   * @param {string} id - The id of the saved object
   */


  generateRawLegacyUrlAliasId(namespace, type, id) {
    return `${_object_types.LEGACY_URL_ALIAS_TYPE}:${namespace}:${type}:${id}`;
  }
  /**
   * Given a document's source namespace, type, and raw ID, trim the ID prefix (based on the namespaceType), returning the object ID and the
   * detected namespace. A single-namespace object is only considered to exist in a namespace if its raw ID is prefixed by that *and* it has
   * the namespace field in its source.
   */


  trimIdPrefix(sourceNamespace, type, id, namespaceTreatment) {
    assertNonEmptyString(id, 'document id');
    assertNonEmptyString(type, 'saved object type');
    const {
      prefix,
      idMatchesPrefix,
      namespace
    } = this.parseIdPrefix(sourceNamespace, type, id, namespaceTreatment);
    return {
      id: idMatchesPrefix ? id.slice(prefix.length) : id,
      namespace
    };
  }

  parseIdPrefix(sourceNamespace, type, id, namespaceTreatment) {
    let prefix; // the prefix that is used to validate this raw object ID

    let namespace; // the namespace that is in the raw object ID (only for single-namespace objects)

    const parseFlexibly = namespaceTreatment === 'lax' && this.registry.isMultiNamespace(type);

    if (sourceNamespace && (this.registry.isSingleNamespace(type) || parseFlexibly)) {
      prefix = `${sourceNamespace}:${type}:`;

      if (parseFlexibly && !checkIdMatchesPrefix(id, prefix)) {
        prefix = `${type}:`;
      } else {
        // this is either a single-namespace object, or is being converted into a multi-namespace object
        namespace = sourceNamespace;
      }
    } else {
      // there is no source namespace, OR there is a source namespace but this is not a single-namespace object
      prefix = `${type}:`;
    }

    return {
      prefix,
      idMatchesPrefix: checkIdMatchesPrefix(id, prefix),
      namespace
    };
  }

}

exports.SavedObjectsSerializer = SavedObjectsSerializer;

function checkIdMatchesPrefix(id, prefix) {
  return id.startsWith(prefix) && id.length > prefix.length;
}

function assertNonEmptyString(value, name) {
  if (!value || typeof value !== 'string') {
    throw new TypeError(`Expected ${name} to be a string but given [${(0, _typeDetect.default)(value)}] with [${value}] value.`);
  }
}