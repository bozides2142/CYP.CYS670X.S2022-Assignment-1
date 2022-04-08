"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedGlobalConfigKeys = exports.PluginType = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Dedicated type for plugin configuration schema.
 *
 * @public
 */

/**
 * Describes a plugin configuration properties.
 *
 * @example
 * ```typescript
 * // my_plugin/server/index.ts
 * import { schema, TypeOf } from '@kbn/config-schema';
 * import { PluginConfigDescriptor } from 'kibana/server';
 *
 * const configSchema = schema.object({
 *   secret: schema.string({ defaultValue: 'Only on server' }),
 *   uiProp: schema.string({ defaultValue: 'Accessible from client' }),
 * });
 *
 * type ConfigType = TypeOf<typeof configSchema>;
 *
 * export const config: PluginConfigDescriptor<ConfigType> = {
 *   exposeToBrowser: {
 *     uiProp: true,
 *   },
 *   schema: configSchema,
 *   deprecations: ({ rename, unused }) => [
 *     rename('securityKey', 'secret'),
 *     unused('deprecatedProperty'),
 *   ],
 * };
 * ```
 *
 * @public
 */

/**
 * List of configuration values that will be exposed to usage collection.
 * If parent node or actual config path is set to `true` then the actual value
 * of these configs will be reoprted.
 * If parent node or actual config path is set to `false` then the config
 * will be reported as [redacted].
 *
 * @public
 */

/**
 * Dedicated type for plugin name/id that is supposed to make Map/Set/Arrays
 * that use it as a key or value more obvious.
 *
 * @public
 */

/** @public */

/** @public */
let PluginType;
/** @internal */

exports.PluginType = PluginType;

(function (PluginType) {
  PluginType["preboot"] = "preboot";
  PluginType["standard"] = "standard";
})(PluginType || (exports.PluginType = PluginType = {}));

const SharedGlobalConfigKeys = {
  // We can add more if really needed
  elasticsearch: ['shardTimeout', 'requestTimeout', 'pingTimeout'],
  path: ['data'],
  savedObjects: ['maxImportPayloadBytes']
};
/**
 * @public
 */

exports.SharedGlobalConfigKeys = SharedGlobalConfigKeys;