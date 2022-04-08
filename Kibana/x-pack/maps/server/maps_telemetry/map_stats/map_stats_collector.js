"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapStatsCollector = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../common/constants");

var _common = require("../../../../../../src/plugins/maps_ems/common/");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Use MapStatsCollector instance to track map saved object stats.
 */


class MapStatsCollector {
  constructor() {
    (0, _defineProperty2.default)(this, "_mapCount", 0);
    (0, _defineProperty2.default)(this, "_basemapClusterStats", {});
    (0, _defineProperty2.default)(this, "_joinClusterStats", {});
    (0, _defineProperty2.default)(this, "_layerClusterStats", {});
    (0, _defineProperty2.default)(this, "_resolutionClusterStats", {});
    (0, _defineProperty2.default)(this, "_scalingClusterStats", {});
    (0, _defineProperty2.default)(this, "_emsFileClusterStats", {});
    (0, _defineProperty2.default)(this, "_layerCountStats", void 0);
    (0, _defineProperty2.default)(this, "_layerTypeClusterStats", {});
    (0, _defineProperty2.default)(this, "_sourceCountStats", void 0);
  }

  push(attributes) {
    if (!attributes || !attributes.layerListJSON) {
      return;
    }

    let layerList = [];

    try {
      layerList = JSON.parse(attributes.layerListJSON);
    } catch (e) {
      return;
    }

    this._mapCount++;
    const layerCount = layerList.length;

    if (this._layerCountStats) {
      const layerCountTotal = this._layerCountStats.total + layerCount;
      this._layerCountStats = {
        min: Math.min(layerCount, this._layerCountStats.min),
        max: Math.max(layerCount, this._layerCountStats.max),
        total: layerCountTotal,
        avg: layerCountTotal / this._mapCount
      };
    } else {
      this._layerCountStats = {
        min: layerCount,
        max: layerCount,
        total: layerCount,
        avg: layerCount
      };
    }

    const sourceIdList = layerList.map(layer => {
      return layer.sourceDescriptor && 'id' in layer.sourceDescriptor ? layer.sourceDescriptor.id : null;
    }).filter(id => {
      return id;
    });

    const sourceCount = _lodash.default.uniq(sourceIdList).length;

    if (this._sourceCountStats) {
      const sourceCountTotal = this._sourceCountStats.total + sourceCount;
      this._sourceCountStats = {
        min: Math.min(sourceCount, this._sourceCountStats.min),
        max: Math.max(sourceCount, this._sourceCountStats.max),
        total: sourceCountTotal,
        avg: sourceCountTotal / this._mapCount
      };
    } else {
      this._sourceCountStats = {
        min: sourceCount,
        max: sourceCount,
        total: sourceCount,
        avg: sourceCount
      };
    }

    const basemapCounts = {};
    const joinCounts = {};
    const layerCounts = {};
    const resolutionCounts = {};
    const scalingCounts = {};
    const emsFileCounts = {};
    const layerTypeCounts = {};
    layerList.forEach(layerDescriptor => {
      this._updateCounts(getBasemapKey(layerDescriptor), basemapCounts);

      this._updateCounts(getJoinKey(layerDescriptor), joinCounts);

      this._updateCounts(getLayerKey(layerDescriptor), layerCounts);

      this._updateCounts(getResolutionKey(layerDescriptor), resolutionCounts);

      this._updateCounts(getScalingKey(layerDescriptor), scalingCounts);

      this._updateCounts(getEmsFileId(layerDescriptor), emsFileCounts);

      if (layerDescriptor.type) {
        this._updateCounts(layerDescriptor.type, layerTypeCounts);
      }
    });

    this._updateClusterStats(this._basemapClusterStats, basemapCounts);

    this._updateClusterStats(this._joinClusterStats, joinCounts);

    this._updateClusterStats(this._layerClusterStats, layerCounts);

    this._updateClusterStats(this._resolutionClusterStats, resolutionCounts);

    this._updateClusterStats(this._scalingClusterStats, scalingCounts);

    this._updateClusterStats(this._emsFileClusterStats, emsFileCounts);

    this._updateClusterStats(this._layerTypeClusterStats, layerTypeCounts);
  }

  getStats() {
    return {
      timeCaptured: new Date().toISOString(),
      mapsTotalCount: this._mapCount,
      basemaps: this._basemapClusterStats,
      joins: this._joinClusterStats,
      layerTypes: this._layerClusterStats,
      resolutions: this._resolutionClusterStats,
      scalingOptions: this._scalingClusterStats,
      attributesPerMap: {
        // Count of data sources per map
        dataSourcesCount: this._sourceCountStats ? this._excludeTotal(this._sourceCountStats) : {
          min: 0,
          max: 0,
          avg: 0
        },
        // Total count of layers per map
        layersCount: this._layerCountStats ? this._excludeTotal(this._layerCountStats) : {
          min: 0,
          max: 0,
          avg: 0
        },
        // Count of layers by type
        layerTypesCount: this._excludeTotalFromKeyedStats(this._layerTypeClusterStats),
        // Count of layer by EMS region
        emsVectorLayersCount: this._excludeTotalFromKeyedStats(this._emsFileClusterStats)
      }
    };
  }

  _updateClusterStats(clusterStats, counts) {
    for (const key in counts) {
      if (!counts.hasOwnProperty(key)) {
        continue;
      }

      if (!clusterStats[key]) {
        clusterStats[key] = {
          min: counts[key],
          max: counts[key],
          total: counts[key],
          avg: 0
        };
      } else {
        clusterStats[key].min = Math.min(counts[key], clusterStats[key].min);
        clusterStats[key].max = Math.max(counts[key], clusterStats[key].max);
        clusterStats[key].total += counts[key];
      }
    }

    for (const key in clusterStats) {
      if (clusterStats.hasOwnProperty(key)) {
        clusterStats[key].avg = clusterStats[key].total / this._mapCount;
      }
    }
  }

  _updateCounts(key, counts) {
    if (key) {
      if (key in counts) {
        counts[key] += 1;
      } else {
        counts[key] = 1;
      }
    }
  } // stats in attributesPerMap do not include 'total' key. Use this method to remove 'total' key from ClusterCountStats


  _excludeTotalFromKeyedStats(clusterStats) {
    const results = {};

    for (const key in clusterStats) {
      if (clusterStats.hasOwnProperty(key)) {
        results[key] = this._excludeTotal(clusterStats[key]);
      }
    }

    return results;
  }

  _excludeTotal(stats) {
    const modifiedStats = { ...stats
    };
    delete modifiedStats.total;
    return modifiedStats;
  }

}

exports.MapStatsCollector = MapStatsCollector;

function getEmsFileId(layerDescriptor) {
  return layerDescriptor.sourceDescriptor !== null && layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_FILE && 'id' in layerDescriptor.sourceDescriptor ? layerDescriptor.sourceDescriptor.id : null;
}

function getBasemapKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor || layerDescriptor.sourceDescriptor.type !== _constants.SOURCE_TYPES.EMS_TMS) {
    return null;
  }

  const descriptor = layerDescriptor.sourceDescriptor;

  if (descriptor.isAutoSelect) {
    return _types.EMS_BASEMAP_KEYS.AUTO;
  }

  if (descriptor.id === _common.DEFAULT_EMS_ROADMAP_ID) {
    return _types.EMS_BASEMAP_KEYS.ROADMAP;
  }

  if (descriptor.id === _common.DEFAULT_EMS_ROADMAP_DESATURATED_ID) {
    return _types.EMS_BASEMAP_KEYS.ROADMAP_DESATURATED;
  }

  if (descriptor.id === _common.DEFAULT_EMS_DARKMAP_ID) {
    return _types.EMS_BASEMAP_KEYS.DARK;
  }

  return null;
}

function getJoinKey(layerDescriptor) {
  var _joins;

  return layerDescriptor.type === _constants.LAYER_TYPE.GEOJSON_VECTOR && layerDescriptor !== null && layerDescriptor !== void 0 && (_joins = layerDescriptor.joins) !== null && _joins !== void 0 && _joins.length ? _types.JOIN_KEYS.TERM : null;
}

function getLayerKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor) {
    return null;
  }

  if (layerDescriptor.type === _constants.LAYER_TYPE.HEATMAP) {
    return _types.LAYER_KEYS.ES_AGG_HEATMAP;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_FILE) {
    return _types.LAYER_KEYS.EMS_REGION;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_TMS) {
    return _types.LAYER_KEYS.EMS_BASEMAP;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.KIBANA_TILEMAP) {
    return _types.LAYER_KEYS.KBN_TMS_RASTER;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_XYZ) {
    return _types.LAYER_KEYS.UX_TMS_RASTER;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.WMS) {
    return _types.LAYER_KEYS.UX_WMS;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.MVT_SINGLE_LAYER) {
    return _types.LAYER_KEYS.UX_TMS_MVT;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_GEO_LINE) {
    return _types.LAYER_KEYS.ES_TRACKS;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_PEW_PEW) {
    return _types.LAYER_KEYS.ES_POINT_TO_POINT;
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_SEARCH) {
    const sourceDescriptor = layerDescriptor.sourceDescriptor;

    if (sourceDescriptor.scalingType === _constants.SCALING_TYPES.TOP_HITS) {
      return _types.LAYER_KEYS.ES_TOP_HITS;
    } else {
      return _types.LAYER_KEYS.ES_DOCS;
    }
  }

  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_GEO_GRID) {
    const sourceDescriptor = layerDescriptor.sourceDescriptor;

    if (sourceDescriptor.requestType === _constants.RENDER_AS.POINT) {
      return _types.LAYER_KEYS.ES_AGG_CLUSTERS;
    } else if (sourceDescriptor.requestType === _constants.RENDER_AS.GRID) {
      return _types.LAYER_KEYS.ES_AGG_GRIDS;
    }
  }

  return null;
}

function getResolutionKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor || layerDescriptor.sourceDescriptor.type !== _constants.SOURCE_TYPES.ES_GEO_GRID || !layerDescriptor.sourceDescriptor.resolution) {
    return null;
  }

  const descriptor = layerDescriptor.sourceDescriptor;

  if (descriptor.resolution === _constants.GRID_RESOLUTION.COARSE) {
    return _types.RESOLUTION_KEYS.COARSE;
  }

  if (descriptor.resolution === _constants.GRID_RESOLUTION.FINE) {
    return _types.RESOLUTION_KEYS.FINE;
  }

  if (descriptor.resolution === _constants.GRID_RESOLUTION.MOST_FINE) {
    return _types.RESOLUTION_KEYS.MOST_FINE;
  }

  if (descriptor.resolution === _constants.GRID_RESOLUTION.SUPER_FINE) {
    return _types.RESOLUTION_KEYS.SUPER_FINE;
  }

  return null;
}

function getScalingKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor || layerDescriptor.sourceDescriptor.type !== _constants.SOURCE_TYPES.ES_SEARCH || !layerDescriptor.sourceDescriptor.scalingType) {
    return null;
  }

  const descriptor = layerDescriptor.sourceDescriptor;

  if (descriptor.scalingType === _constants.SCALING_TYPES.CLUSTERS) {
    return _types.SCALING_KEYS.CLUSTERS;
  }

  if (descriptor.scalingType === _constants.SCALING_TYPES.MVT) {
    return _types.SCALING_KEYS.MVT;
  }

  if (descriptor.scalingType === _constants.SCALING_TYPES.LIMIT) {
    return _types.SCALING_KEYS.LIMIT;
  }

  return null;
}