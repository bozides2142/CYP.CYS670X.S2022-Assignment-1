"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaMigrator = void 0;
exports.mergeTypes = mergeTypes;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _semver = _interopRequireDefault(require("semver"));

var _serialization = require("../serialization");

var _core = require("./core");

var _document_migrator = require("./core/document_migrator");

var _build_index_map = require("./core/build_index_map");

var _run_resilient_migrator = require("./run_resilient_migrator");

var _migrate_raw_docs = require("./core/migrate_raw_docs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * This file contains the logic for managing the Kibana index version
 * (the shape of the mappings and documents in the index).
 */

/**
 * Manages the shape of mappings and documents in the Kibana index.
 */
class KibanaMigrator {
  /**
   * Creates an instance of KibanaMigrator.
   */
  constructor({
    client,
    typeRegistry,
    kibanaIndex,
    soMigrationsConfig,
    kibanaVersion,
    logger
  }) {
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "documentMigrator", void 0);
    (0, _defineProperty2.default)(this, "kibanaIndex", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "mappingProperties", void 0);
    (0, _defineProperty2.default)(this, "typeRegistry", void 0);
    (0, _defineProperty2.default)(this, "serializer", void 0);
    (0, _defineProperty2.default)(this, "migrationResult", void 0);
    (0, _defineProperty2.default)(this, "status$", new _rxjs.BehaviorSubject({
      status: 'waiting_to_start'
    }));
    (0, _defineProperty2.default)(this, "activeMappings", void 0);
    (0, _defineProperty2.default)(this, "soMigrationsConfig", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    this.client = client;
    this.kibanaIndex = kibanaIndex;
    this.soMigrationsConfig = soMigrationsConfig;
    this.typeRegistry = typeRegistry;
    this.serializer = new _serialization.SavedObjectsSerializer(this.typeRegistry);
    this.mappingProperties = mergeTypes(this.typeRegistry.getAllTypes());
    this.log = logger;
    this.kibanaVersion = kibanaVersion;
    this.documentMigrator = new _document_migrator.DocumentMigrator({
      kibanaVersion: this.kibanaVersion,
      typeRegistry,
      log: this.log
    }); // Building the active mappings (and associated md5sums) is an expensive
    // operation so we cache the result

    this.activeMappings = (0, _core.buildActiveMappings)(this.mappingProperties);
  }
  /**
   * Migrates the mappings and documents in the Kibana index. By default, this will run only
   * once and subsequent calls will return the result of the original call.
   *
   * @param rerun - If true, method will run a new migration when called again instead of
   * returning the result of the initial migration. This should only be used when factors external
   * to Kibana itself alter the kibana index causing the saved objects mappings or data to change
   * after the Kibana server performed the initial migration.
   *
   * @remarks When the `rerun` parameter is set to true, no checks are performed to ensure that no migration
   * is currently running. Chained or concurrent calls to `runMigrations({ rerun: true })` can lead to
   * multiple migrations running at the same time. When calling with this parameter, it's expected that the calling
   * code should ensure that the initial call resolves before calling the function again.
   *
   * @returns - A promise which resolves once all migrations have been applied.
   *    The promise resolves with an array of migration statuses, one for each
   *    elasticsearch index which was migrated.
   */


  runMigrations({
    rerun = false
  } = {}) {
    if (this.migrationResult === undefined || rerun) {
      // Reruns are only used by CI / EsArchiver. Publishing status updates on reruns results in slowing down CI
      // unnecessarily, so we skip it in this case.
      if (!rerun) {
        this.status$.next({
          status: 'running'
        });
      }

      this.migrationResult = this.runMigrationsInternal().then(result => {
        // Similar to above, don't publish status updates when rerunning in CI.
        if (!rerun) {
          this.status$.next({
            status: 'completed',
            result
          });
        }

        return result;
      });
    }

    return this.migrationResult;
  }

  prepareMigrations() {
    this.documentMigrator.prepareMigrations();
  }

  getStatus$() {
    return this.status$.asObservable();
  }

  runMigrationsInternal() {
    const indexMap = (0, _build_index_map.createIndexMap)({
      kibanaIndexName: this.kibanaIndex,
      indexMap: this.mappingProperties,
      registry: this.typeRegistry
    });
    this.log.debug('Applying registered migrations for the following saved object types:');
    Object.entries(this.documentMigrator.migrationVersion).sort(([t1, v1], [t2, v2]) => {
      return _semver.default.compare(v1, v2);
    }).forEach(([type, migrationVersion]) => {
      this.log.debug(`migrationVersion: ${migrationVersion} saved object type: ${type}`);
    });
    const migrators = Object.keys(indexMap).map(index => {
      return {
        migrate: () => {
          return (0, _run_resilient_migrator.runResilientMigrator)({
            client: this.client,
            kibanaVersion: this.kibanaVersion,
            targetMappings: (0, _core.buildActiveMappings)(indexMap[index].typeMappings),
            logger: this.log,
            preMigrationScript: indexMap[index].script,
            transformRawDocs: rawDocs => (0, _migrate_raw_docs.migrateRawDocsSafely)({
              serializer: this.serializer,
              migrateDoc: this.documentMigrator.migrateAndConvert,
              rawDocs
            }),
            migrationVersionPerType: this.documentMigrator.migrationVersion,
            indexPrefix: index,
            migrationsConfig: this.soMigrationsConfig,
            typeRegistry: this.typeRegistry
          });
        }
      };
    });
    return Promise.all(migrators.map(migrator => migrator.migrate()));
  }
  /**
   * Gets all the index mappings defined by Kibana's enabled plugins.
   *
   */


  getActiveMappings() {
    return this.activeMappings;
  }
  /**
   * Migrates an individual doc to the latest version, as defined by the plugin migrations.
   *
   * @param doc - The saved object to migrate
   * @returns `doc` with all registered migrations applied.
   */


  migrateDocument(doc) {
    return this.documentMigrator.migrate(doc);
  }

}
/**
 * Merges savedObjectMappings properties into a single object, verifying that
 * no mappings are redefined.
 */


exports.KibanaMigrator = KibanaMigrator;

function mergeTypes(types) {
  return types.reduce((acc, {
    name: type,
    mappings
  }) => {
    const duplicate = acc.hasOwnProperty(type);

    if (duplicate) {
      throw new Error(`Type ${type} is already defined.`);
    }

    return { ...acc,
      [type]: mappings
    };
  }, {});
}