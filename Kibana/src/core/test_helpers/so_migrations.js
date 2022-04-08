"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestHarness = void 0;

var kbnTestServer = _interopRequireWildcard(require("./kbn_server"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Creates a test harness utility running migrations on a fully configured Kibana and Elasticsearch instance with all
 * Kibana plugins loaded. Useful for testing more complex migrations that have dependencies on other plugins. Should
 * only be used within the jest_integration suite.
 *
 * @example
 * ```ts
 * describe('my migrations', () => {
 *   let testHarness: SavedObjectTestHarness;
 *   beforeAll(async () => {
 *     testHarness = createTestHarness();
 *     await testHarness.start();
 *   });
 *   afterAll(() => testHarness.stop());
 *
 *
 *   it('migrates the documents', async () => {
 *     expect(
 *       await testHarness.migrate(
 *         { type: 'my-type', id: 'my-id', attributes: { ... }, references: [] }
 *       )
 *     ).toEqual([
 *       expect.objectContaining({ type: 'my-type', id: 'my-id', attributes: { ... }, references: [] })
 *     ]);
 *   });
 * });
 * ```
 */
const createTestHarness = () => {
  let started = false;
  let stopped = false;
  let esServer;
  const {
    startES
  } = kbnTestServer.createTestServers({
    adjustTimeout: jest.setTimeout
  });
  const root = kbnTestServer.createRootWithCorePlugins( // Disable reporting due to browser install issue on CI. See https://github.com/elastic/kibana/issues/102919
  {
    xpack: {
      reporting: {
        enabled: false
      }
    }
  }, {
    oss: false
  });
  /**
   * Imports an array of objects into Kibana and applies migrations before persisting to Elasticsearch. Will overwrite
   * any existing objects with the same id.
   * @param objects
   */

  const importObjects = async objects => {
    var _response$body$errors;

    if (!started) throw new Error(`SavedObjectTestHarness must be started before objects can be imported`);
    if (stopped) throw new Error(`SavedObjectTestHarness cannot import objects after stopped`);
    const response = await kbnTestServer // Always use overwrite=true flag so we can isolate this harness to migrations
    .getSupertest(root, 'post', '/api/saved_objects/_import?overwrite=true').set('Content-Type', 'multipart/form-data; boundary=EXAMPLE').send(['--EXAMPLE', 'Content-Disposition: form-data; name="file"; filename="export.ndjson"', 'Content-Type: application/ndjson', '', ...objects.map(o => JSON.stringify(o)), '--EXAMPLE--'].join('\r\n')).expect(200);

    if (((_response$body$errors = response.body.errors) === null || _response$body$errors === void 0 ? void 0 : _response$body$errors.length) > 0) {
      throw new Error(`Errors importing objects: ${JSON.stringify(response.body.errors, undefined, 2)}`);
    }
  };
  /**
   * Exports objects from Kibana with all migrations applied.
   * @param options
   */


  const exportObjects = async options => {
    if (!started) throw new Error(`SavedObjectTestHarness must be started before objects can be imported`);
    if (stopped) throw new Error(`SavedObjectTestHarness cannot import objects after stopped`);
    const response = await kbnTestServer.getSupertest(root, 'post', '/api/saved_objects/_export').send({ ...options,
      excludeExportDetails: true
    }).expect(200);
    return parseNdjson(response.text);
  };

  return {
    /**
     * Start Kibana and Elasticsearch for migration testing. Must be called before `migrate`.
     * In most cases, this can be called during your test's `beforeAll` hook and does not need to be called for each
     * individual test.
     *
     * @param customTypes - Additional SO types to register for this test.
     */
    start: async ({
      customTypes = []
    } = {}) => {
      if (started) throw new Error(`SavedObjectTestHarness already started! Cannot call start again`);
      if (stopped) throw new Error(`SavedObjectTestHarness already stopped! Cannot call start again`);
      esServer = await startES();
      await root.preboot();
      const {
        savedObjects
      } = await root.setup();
      customTypes.forEach(type => savedObjects.registerType(type));
      await root.start();
      await waitForTrue({
        predicate: async () => {
          const statusApi = kbnTestServer.getSupertest(root, 'get', '/api/status');
          const response = await statusApi.send();
          return response.status === 200;
        }
      });
      started = true;
    },

    /**
     * Stop Kibana and Elasticsearch for migration testing. Must be called after `start`.
     * In most cases, this can be called during your test's `afterAll` hook and does not need to be called for each
     * individual test.
     */
    stop: async () => {
      if (!started) throw new Error(`SavedObjectTestHarness not started! Cannot call stop`);
      if (stopped) throw new Error(`SavedObjectTestHarness already stopped! Cannot call stop again`);
      await root.shutdown();
      await esServer.stop();
      stopped = true;
    },

    /**
     * Migrates an array of SavedObjects and returns the results. Assumes that the objects will retain the same type
     * and id after the migration. When testing migrations that may change a document's type or id, use `importObjects`
     * and `exportObjects` directly.
     * @param objects
     */
    migrate: async objects => {
      await importObjects(objects);
      return await exportObjects({
        objects: objects.map(({
          type,
          id
        }) => ({
          type,
          id
        }))
      });
    },
    importObjects,
    exportObjects
  };
};

exports.createTestHarness = createTestHarness;

const waitForTrue = async ({
  predicate
}) => {
  let attempt = 0;

  do {
    attempt++;
    const result = await predicate();

    if (result) {
      return;
    }

    await new Promise(r => setTimeout(r, attempt * 500));
  } while (attempt <= 10);

  throw new Error(`Predicate never resolved after ${attempt} attempts`);
};

const parseNdjson = ndjson => ndjson.split('\n').map(l => JSON.parse(l));