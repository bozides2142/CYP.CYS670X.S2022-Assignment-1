"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCALING_KEYS = exports.RESOLUTION_KEYS = exports.LAYER_KEYS = exports.JOIN_KEYS = exports.EMS_BASEMAP_KEYS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let EMS_BASEMAP_KEYS;
exports.EMS_BASEMAP_KEYS = EMS_BASEMAP_KEYS;

(function (EMS_BASEMAP_KEYS) {
  EMS_BASEMAP_KEYS["ROADMAP_DESATURATED"] = "roadmap_desaturated";
  EMS_BASEMAP_KEYS["ROADMAP"] = "roadmap";
  EMS_BASEMAP_KEYS["AUTO"] = "auto";
  EMS_BASEMAP_KEYS["DARK"] = "dark";
})(EMS_BASEMAP_KEYS || (exports.EMS_BASEMAP_KEYS = EMS_BASEMAP_KEYS = {}));

let JOIN_KEYS;
exports.JOIN_KEYS = JOIN_KEYS;

(function (JOIN_KEYS) {
  JOIN_KEYS["TERM"] = "term";
})(JOIN_KEYS || (exports.JOIN_KEYS = JOIN_KEYS = {}));

let LAYER_KEYS;
exports.LAYER_KEYS = LAYER_KEYS;

(function (LAYER_KEYS) {
  LAYER_KEYS["ES_DOCS"] = "es_docs";
  LAYER_KEYS["ES_TOP_HITS"] = "es_top_hits";
  LAYER_KEYS["ES_TRACKS"] = "es_tracks";
  LAYER_KEYS["ES_POINT_TO_POINT"] = "es_point_to_point";
  LAYER_KEYS["ES_AGG_CLUSTERS"] = "es_agg_clusters";
  LAYER_KEYS["ES_AGG_GRIDS"] = "es_agg_grids";
  LAYER_KEYS["ES_AGG_HEATMAP"] = "es_agg_heatmap";
  LAYER_KEYS["EMS_REGION"] = "ems_region";
  LAYER_KEYS["EMS_BASEMAP"] = "ems_basemap";
  LAYER_KEYS["KBN_TMS_RASTER"] = "kbn_tms_raster";
  LAYER_KEYS["UX_TMS_RASTER"] = "ux_tms_raster";
  LAYER_KEYS["UX_TMS_MVT"] = "ux_tms_mvt";
  LAYER_KEYS["UX_WMS"] = "ux_wms";
})(LAYER_KEYS || (exports.LAYER_KEYS = LAYER_KEYS = {}));

let RESOLUTION_KEYS;
exports.RESOLUTION_KEYS = RESOLUTION_KEYS;

(function (RESOLUTION_KEYS) {
  RESOLUTION_KEYS["COARSE"] = "coarse";
  RESOLUTION_KEYS["FINE"] = "fine";
  RESOLUTION_KEYS["MOST_FINE"] = "most_fine";
  RESOLUTION_KEYS["SUPER_FINE"] = "super_fine";
})(RESOLUTION_KEYS || (exports.RESOLUTION_KEYS = RESOLUTION_KEYS = {}));

let SCALING_KEYS;
exports.SCALING_KEYS = SCALING_KEYS;

(function (SCALING_KEYS) {
  SCALING_KEYS["LIMIT"] = "limit";
  SCALING_KEYS["MVT"] = "mvt";
  SCALING_KEYS["CLUSTERS"] = "clusters";
})(SCALING_KEYS || (exports.SCALING_KEYS = SCALING_KEYS = {}));