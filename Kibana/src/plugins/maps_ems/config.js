"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tilemapConfigSchema = exports.mapConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("./common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const tileMapConfigOptionsSchema = _configSchema.schema.object({
  attribution: _configSchema.schema.string({
    defaultValue: ''
  }),
  minZoom: _configSchema.schema.number({
    defaultValue: 0,
    min: 0
  }),
  maxZoom: _configSchema.schema.number({
    defaultValue: 10
  }),
  tileSize: _configSchema.schema.maybe(_configSchema.schema.number()),
  subdomains: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  errorTileUrl: _configSchema.schema.maybe(_configSchema.schema.string()),
  tms: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  reuseTiles: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  bounds: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.number({
    min: 2
  }))),
  default: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const tilemapConfigSchema = _configSchema.schema.object({
  url: _configSchema.schema.maybe(_configSchema.schema.string()),
  options: tileMapConfigOptionsSchema
});

exports.tilemapConfigSchema = tilemapConfigSchema;

const mapConfigSchema = _configSchema.schema.object({
  tilemap: tilemapConfigSchema,
  includeElasticMapsService: _configSchema.schema.boolean({
    defaultValue: true
  }),
  emsUrl: _configSchema.schema.string({
    defaultValue: ''
  }),
  emsFileApiUrl: _configSchema.schema.string({
    defaultValue: _common.DEFAULT_EMS_FILE_API_URL
  }),
  emsTileApiUrl: _configSchema.schema.string({
    defaultValue: _common.DEFAULT_EMS_TILE_API_URL
  }),
  emsLandingPageUrl: _configSchema.schema.string({
    defaultValue: _common.DEFAULT_EMS_LANDING_PAGE_URL
  }),
  emsFontLibraryUrl: _configSchema.schema.string({
    defaultValue: _common.DEFAULT_EMS_FONT_LIBRARY_URL
  }),
  emsTileLayerId: _configSchema.schema.object({
    bright: _configSchema.schema.string({
      defaultValue: _common.DEFAULT_EMS_ROADMAP_ID
    }),
    desaturated: _configSchema.schema.string({
      defaultValue: _common.DEFAULT_EMS_ROADMAP_DESATURATED_ID
    }),
    dark: _configSchema.schema.string({
      defaultValue: _common.DEFAULT_EMS_DARKMAP_ID
    })
  })
});

exports.mapConfigSchema = mapConfigSchema;