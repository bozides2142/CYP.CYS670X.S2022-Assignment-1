"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ = require("./");

var _migrations = require("./migrations");

var _saved_objects_config = require("./saved_objects_config");

var _repository = require("./service/lib/repository");

var _saved_objects_type_registry = require("./saved_objects_type_registry");

var _serialization = require("./serialization");

var _export = require("./export");

var _import = require("./import");

var _routes = require("./routes");

var _status = require("./status");

var _object_types = require("./object_types");

var _deprecations = require("./deprecations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const kibanaIndex = '.kibana';
/**
 * Saved Objects is Kibana's data persistence mechanism allowing plugins to
 * use Elasticsearch for storing and querying state. The SavedObjectsServiceSetup API exposes methods
 * for registering Saved Object types, creating and registering Saved Object client wrappers and factories.
 *
 * @remarks
 * When plugins access the Saved Objects client, a new client is created using
 * the factory provided to `setClientFactory` and wrapped by all wrappers
 * registered through `addClientWrapper`.
 *
 * @example
 * ```ts
 * import { SavedObjectsClient, CoreSetup } from 'src/core/server';
 *
 * export class Plugin() {
 *   setup: (core: CoreSetup) => {
 *     core.savedObjects.setClientFactory(({ request: KibanaRequest }) => {
 *       return new SavedObjectsClient(core.savedObjects.scopedRepository(request));
 *     })
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * import { SavedObjectsClient, CoreSetup } from 'src/core/server';
 * import { mySoType } from './saved_objects'
 *
 * export class Plugin() {
 *   setup: (core: CoreSetup) => {
 *     core.savedObjects.registerType(mySoType);
 *   }
 * }
 * ```
 *
 * @public
 */

class SavedObjectsService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "setupDeps", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "clientFactoryProvider", void 0);
    (0, _defineProperty2.default)(this, "clientFactoryWrappers", []);
    (0, _defineProperty2.default)(this, "migrator$", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "typeRegistry", new _saved_objects_type_registry.SavedObjectTypeRegistry());
    (0, _defineProperty2.default)(this, "started", false);
    this.coreContext = coreContext;
    this.logger = coreContext.logger.get('savedobjects-service');
    this.kibanaVersion = SavedObjectsService.stripVersionQualifier(this.coreContext.env.packageInfo.version);
  }

  async setup(setupDeps) {
    this.logger.debug('Setting up SavedObjects service');
    this.setupDeps = setupDeps;
    const {
      http,
      elasticsearch,
      coreUsageData,
      deprecations
    } = setupDeps;
    const savedObjectsConfig = await this.coreContext.configService.atPath('savedObjects').pipe((0, _operators.first)()).toPromise();
    const savedObjectsMigrationConfig = await this.coreContext.configService.atPath('migrations').pipe((0, _operators.first)()).toPromise();
    this.config = new _saved_objects_config.SavedObjectConfig(savedObjectsConfig, savedObjectsMigrationConfig);
    deprecations.getRegistry('savedObjects').registerDeprecations((0, _deprecations.getSavedObjectsDeprecationsProvider)({
      kibanaIndex,
      savedObjectsConfig: this.config,
      kibanaVersion: this.kibanaVersion,
      typeRegistry: this.typeRegistry
    }));
    coreUsageData.registerType(this.typeRegistry);
    (0, _routes.registerRoutes)({
      http,
      coreUsageData,
      logger: this.logger,
      config: this.config,
      migratorPromise: this.migrator$.pipe((0, _operators.first)()).toPromise(),
      kibanaIndex,
      kibanaVersion: this.kibanaVersion
    });
    (0, _object_types.registerCoreObjectTypes)(this.typeRegistry);
    return {
      status$: (0, _status.calculateStatus$)(this.migrator$.pipe((0, _operators.switchMap)(migrator => migrator.getStatus$())), elasticsearch.status$),
      setClientFactoryProvider: provider => {
        if (this.started) {
          throw new Error('cannot call `setClientFactoryProvider` after service startup.');
        }

        if (this.clientFactoryProvider) {
          throw new Error('custom client factory is already set, and can only be set once');
        }

        this.clientFactoryProvider = provider;
      },
      addClientWrapper: (priority, id, factory) => {
        if (this.started) {
          throw new Error('cannot call `addClientWrapper` after service startup.');
        }

        this.clientFactoryWrappers.push({
          priority,
          id,
          factory
        });
      },
      registerType: type => {
        if (this.started) {
          throw new Error('cannot call `registerType` after service startup.');
        }

        this.typeRegistry.registerType(type);
      },
      getTypeRegistry: () => this.typeRegistry,
      getKibanaIndex: () => kibanaIndex
    };
  }

  async start({
    elasticsearch,
    pluginsInitialized = true
  }) {
    if (!this.setupDeps || !this.config) {
      throw new Error('#setup() needs to be run first');
    }

    this.logger.debug('Starting SavedObjects service');
    const client = elasticsearch.client;
    const migrator = this.createMigrator(this.config.migration, elasticsearch.client.asInternalUser);
    this.migrator$.next(migrator);
    /**
     * Note: We want to ensure that migrations have completed before
     * continuing with further Core start steps that might use SavedObjects
     * such as running the legacy server, legacy plugins and allowing incoming
     * HTTP requests.
     *
     * However, our build system optimize step and some tests depend on the
     * HTTP server running without an Elasticsearch server being available.
     * So, when the `migrations.skip` is true, we skip migrations altogether.
     *
     * We also cannot safely run migrations if plugins are not initialized since
     * not plugin migrations won't be registered.
     */

    const skipMigrations = this.config.migration.skip || !pluginsInitialized;
    /**
     * Note: Prepares all migrations maps. If a saved object type was registered with property `migrations`
     * of type function; this function will be called to get the type's SavedObjectMigrationMap.
     */

    migrator.prepareMigrations();

    if (skipMigrations) {
      this.logger.warn('Skipping Saved Object migrations on startup. Note: Individual documents will still be migrated when read or written.');
    } else {
      this.logger.info('Waiting until all Elasticsearch nodes are compatible with Kibana before starting saved objects migrations...'); // The Elasticsearch service should already ensure that, but let's double check just in case.
      // Should it be replaced with elasticsearch.status$ API instead?

      const compatibleNodes = await this.setupDeps.elasticsearch.esNodesCompatibility$.pipe((0, _operators.filter)(nodes => nodes.isCompatible), (0, _operators.take)(1)).toPromise(); // Running migrations only if we got compatible nodes.
      // It may happen that the observable completes due to Kibana shutting down
      // and the promise above fulfils as undefined. We shouldn't trigger migrations at that point.

      if (compatibleNodes) {
        this.logger.info('Starting saved objects migrations');
        await migrator.runMigrations();
      }
    }

    const createRepository = (esClient, includedHiddenTypes = []) => {
      return _repository.SavedObjectsRepository.createRepository(migrator, this.typeRegistry, kibanaIndex, esClient, this.logger.get('repository'), includedHiddenTypes);
    };

    const repositoryFactory = {
      createInternalRepository: includedHiddenTypes => createRepository(client.asInternalUser, includedHiddenTypes),
      createScopedRepository: (req, includedHiddenTypes) => createRepository(client.asScoped(req).asCurrentUser, includedHiddenTypes)
    };
    const clientProvider = new _.SavedObjectsClientProvider({
      defaultClientFactory({
        request,
        includedHiddenTypes
      }) {
        const repository = repositoryFactory.createScopedRepository(request, includedHiddenTypes);
        return new _.SavedObjectsClient(repository);
      },

      typeRegistry: this.typeRegistry
    });

    if (this.clientFactoryProvider) {
      const clientFactory = this.clientFactoryProvider(repositoryFactory);
      clientProvider.setClientFactory(clientFactory);
    }

    this.clientFactoryWrappers.forEach(({
      id,
      factory,
      priority
    }) => {
      clientProvider.addClientWrapperFactory(priority, id, factory);
    });
    this.started = true;
    return {
      getScopedClient: clientProvider.getClient.bind(clientProvider),
      createScopedRepository: repositoryFactory.createScopedRepository,
      createInternalRepository: repositoryFactory.createInternalRepository,
      createSerializer: () => new _serialization.SavedObjectsSerializer(this.typeRegistry),
      createExporter: savedObjectsClient => new _export.SavedObjectsExporter({
        savedObjectsClient,
        typeRegistry: this.typeRegistry,
        exportSizeLimit: this.config.maxImportExportSize,
        logger: this.logger.get('exporter')
      }),
      createImporter: savedObjectsClient => new _import.SavedObjectsImporter({
        savedObjectsClient,
        typeRegistry: this.typeRegistry,
        importSizeLimit: this.config.maxImportExportSize
      }),
      getTypeRegistry: () => this.typeRegistry
    };
  }

  async stop() {}

  createMigrator(soMigrationsConfig, client) {
    return new _migrations.KibanaMigrator({
      typeRegistry: this.typeRegistry,
      logger: this.logger,
      kibanaVersion: this.kibanaVersion,
      soMigrationsConfig,
      kibanaIndex,
      client
    });
  }
  /**
   * Coerce a semver-like string (x.y.z-SNAPSHOT) or prerelease version (x.y.z-alpha)
   * to regular semver (x.y.z).
   */


  static stripVersionQualifier(version) {
    return version.split('-')[0];
  }

}

exports.SavedObjectsService = SavedObjectsService;