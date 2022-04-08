"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsImporter = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _import_saved_objects = require("./import_saved_objects");

var _resolve_import_errors = require("./resolve_import_errors");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

var _savedObjectsClient = /*#__PURE__*/new WeakMap();

var _typeRegistry = /*#__PURE__*/new WeakMap();

var _importSizeLimit = /*#__PURE__*/new WeakMap();

var _importHooks = /*#__PURE__*/new WeakMap();

/**
 * @public
 */
class SavedObjectsImporter {
  constructor({
    savedObjectsClient,
    typeRegistry,
    importSizeLimit
  }) {
    _classPrivateFieldInitSpec(this, _savedObjectsClient, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _typeRegistry, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _importSizeLimit, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _importHooks, {
      writable: true,
      value: void 0
    });

    (0, _classPrivateFieldSet2.default)(this, _savedObjectsClient, savedObjectsClient);
    (0, _classPrivateFieldSet2.default)(this, _typeRegistry, typeRegistry);
    (0, _classPrivateFieldSet2.default)(this, _importSizeLimit, importSizeLimit);
    (0, _classPrivateFieldSet2.default)(this, _importHooks, typeRegistry.getAllTypes().reduce((hooks, type) => {
      var _type$management;

      if ((_type$management = type.management) !== null && _type$management !== void 0 && _type$management.onImport) {
        return { ...hooks,
          [type.name]: [type.management.onImport]
        };
      }

      return hooks;
    }, {}));
  }
  /**
   * Import saved objects from given stream. See the {@link SavedObjectsImportOptions | options} for more
   * detailed information.
   *
   * @throws SavedObjectsImportError
   */


  import({
    readStream,
    createNewCopies,
    namespace,
    overwrite
  }) {
    return (0, _import_saved_objects.importSavedObjectsFromStream)({
      readStream,
      createNewCopies,
      namespace,
      overwrite,
      objectLimit: (0, _classPrivateFieldGet2.default)(this, _importSizeLimit),
      savedObjectsClient: (0, _classPrivateFieldGet2.default)(this, _savedObjectsClient),
      typeRegistry: (0, _classPrivateFieldGet2.default)(this, _typeRegistry),
      importHooks: (0, _classPrivateFieldGet2.default)(this, _importHooks)
    });
  }
  /**
   * Resolve and return saved object import errors.
   * See the {@link SavedObjectsResolveImportErrorsOptions | options} for more detailed information.
   *
   * @throws SavedObjectsImportError
   */


  resolveImportErrors({
    readStream,
    createNewCopies,
    namespace,
    retries
  }) {
    return (0, _resolve_import_errors.resolveSavedObjectsImportErrors)({
      readStream,
      createNewCopies,
      namespace,
      retries,
      objectLimit: (0, _classPrivateFieldGet2.default)(this, _importSizeLimit),
      savedObjectsClient: (0, _classPrivateFieldGet2.default)(this, _savedObjectsClient),
      typeRegistry: (0, _classPrivateFieldGet2.default)(this, _typeRegistry),
      importHooks: (0, _classPrivateFieldGet2.default)(this, _importHooks)
    });
  }

}

exports.SavedObjectsImporter = SavedObjectsImporter;