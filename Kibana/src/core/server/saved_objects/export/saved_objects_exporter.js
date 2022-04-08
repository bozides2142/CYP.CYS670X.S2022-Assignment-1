"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsExporter = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _utils = require("@kbn/utils");

var _sort_objects = require("./sort_objects");

var _errors = require("./errors");

var _collect_exported_objects = require("./collect_exported_objects");

var _utils2 = require("./utils");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

var _savedObjectsClient = /*#__PURE__*/new WeakMap();

var _exportSizeLimit = /*#__PURE__*/new WeakMap();

var _typeRegistry = /*#__PURE__*/new WeakMap();

var _log = /*#__PURE__*/new WeakMap();

/**
 * @public
 */
class SavedObjectsExporter {
  constructor({
    savedObjectsClient,
    typeRegistry,
    exportSizeLimit,
    logger
  }) {
    _classPrivateFieldInitSpec(this, _savedObjectsClient, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _exportSizeLimit, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _typeRegistry, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _log, {
      writable: true,
      value: void 0
    });

    (0, _classPrivateFieldSet2.default)(this, _log, logger);
    (0, _classPrivateFieldSet2.default)(this, _savedObjectsClient, savedObjectsClient);
    (0, _classPrivateFieldSet2.default)(this, _exportSizeLimit, exportSizeLimit);
    (0, _classPrivateFieldSet2.default)(this, _typeRegistry, typeRegistry);
  }
  /**
   * Generates an export stream for given types.
   *
   * See the {@link SavedObjectsExportByTypeOptions | options} for more detailed information.
   *
   * @throws SavedObjectsExportError
   */


  async exportByTypes(options) {
    (0, _classPrivateFieldGet2.default)(this, _log).debug(`Initiating export for types: [${options.types}]`);
    const objects = await this.fetchByTypes(options);
    return this.processObjects(objects, _utils2.byIdAscComparator, {
      request: options.request,
      includeReferencesDeep: options.includeReferencesDeep,
      includeNamespaces: options.includeNamespaces,
      excludeExportDetails: options.excludeExportDetails,
      namespace: options.namespace
    });
  }
  /**
   * Generates an export stream for given object references.
   *
   * See the {@link SavedObjectsExportByObjectOptions | options} for more detailed information.
   *
   * @throws SavedObjectsExportError
   */


  async exportByObjects(options) {
    (0, _classPrivateFieldGet2.default)(this, _log).debug(`Initiating export of [${options.objects.length}] objects.`);

    if (options.objects.length > (0, _classPrivateFieldGet2.default)(this, _exportSizeLimit)) {
      throw _errors.SavedObjectsExportError.exportSizeExceeded((0, _classPrivateFieldGet2.default)(this, _exportSizeLimit));
    }

    const objects = await this.fetchByObjects(options);
    const comparator = (0, _utils2.getPreservedOrderComparator)(objects);
    return this.processObjects(objects, comparator, {
      request: options.request,
      includeReferencesDeep: options.includeReferencesDeep,
      includeNamespaces: options.includeNamespaces,
      excludeExportDetails: options.excludeExportDetails,
      namespace: options.namespace
    });
  }

  async processObjects(savedObjects, sortFunction, {
    request,
    excludeExportDetails = false,
    includeReferencesDeep = false,
    includeNamespaces = false,
    namespace
  }) {
    (0, _classPrivateFieldGet2.default)(this, _log).debug(`Processing [${savedObjects.length}] saved objects.`);
    const {
      objects: collectedObjects,
      missingRefs: missingReferences,
      excludedObjects
    } = await (0, _collect_exported_objects.collectExportedObjects)({
      objects: savedObjects,
      includeReferences: includeReferencesDeep,
      namespace,
      request,
      typeRegistry: (0, _classPrivateFieldGet2.default)(this, _typeRegistry),
      savedObjectsClient: (0, _classPrivateFieldGet2.default)(this, _savedObjectsClient),
      logger: (0, _classPrivateFieldGet2.default)(this, _log)
    }); // sort with the provided sort function then with the default export sorting

    const exportedObjects = (0, _sort_objects.sortObjects)(collectedObjects.sort(sortFunction)); // redact attributes that should not be exported

    const redactedObjects = includeNamespaces ? exportedObjects : exportedObjects.map(({
      namespaces,
      ...object
    }) => object);
    const exportDetails = {
      exportedCount: exportedObjects.length,
      missingRefCount: missingReferences.length,
      missingReferences,
      excludedObjectsCount: excludedObjects.length,
      excludedObjects
    };
    (0, _classPrivateFieldGet2.default)(this, _log).debug(`Exporting [${redactedObjects.length}] saved objects.`);
    return (0, _utils.createListStream)([...redactedObjects, ...(excludeExportDetails ? [] : [exportDetails])]);
  }

  async fetchByObjects({
    objects,
    namespace
  }) {
    const bulkGetResult = await (0, _classPrivateFieldGet2.default)(this, _savedObjectsClient).bulkGet(objects, {
      namespace
    });
    const erroredObjects = bulkGetResult.saved_objects.filter(obj => !!obj.error);

    if (erroredObjects.length) {
      throw _errors.SavedObjectsExportError.objectFetchError(erroredObjects);
    }

    return bulkGetResult.saved_objects;
  }

  async fetchByTypes({
    types,
    namespace,
    hasReference,
    search
  }) {
    const finder = (0, _classPrivateFieldGet2.default)(this, _savedObjectsClient).createPointInTimeFinder({
      type: types,
      hasReference,
      hasReferenceOperator: hasReference ? 'OR' : undefined,
      search,
      namespaces: namespace ? [namespace] : undefined
    });
    const hits = [];

    for await (const result of finder.find()) {
      hits.push(...result.saved_objects);

      if (hits.length > (0, _classPrivateFieldGet2.default)(this, _exportSizeLimit)) {
        await finder.close();
        throw _errors.SavedObjectsExportError.exportSizeExceeded((0, _classPrivateFieldGet2.default)(this, _exportSizeLimit));
      }
    } // sorts server-side by _id, since it's only available in fielddata


    return hits // exclude the find-specific `score` property from the exported objects
    .map(({
      score,
      ...obj
    }) => obj).sort(_utils2.byIdAscComparator);
  }

}

exports.SavedObjectsExporter = SavedObjectsExporter;