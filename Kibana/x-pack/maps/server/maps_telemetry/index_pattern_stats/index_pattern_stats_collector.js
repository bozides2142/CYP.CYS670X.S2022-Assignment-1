"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternStatsCollector = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _std = require("@kbn/std");

var _fieldTypes = require("@kbn/field-types");

var _constants = require("../../../common/constants");

var _references = require("../../../common/migrations/references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Use IndexPatternStatsCollector instance to track index pattern geospatial field stats.
 */


class IndexPatternStatsCollector {
  constructor(indexPatternService) {
    (0, _defineProperty2.default)(this, "_geoShapeAggCount", 0);
    (0, _defineProperty2.default)(this, "_indexPatternsService", void 0);
    this._indexPatternsService = indexPatternService;
  }

  async push(savedObject) {
    let layerList = [];

    try {
      const {
        attributes
      } = (0, _references.injectReferences)(savedObject);

      if (!attributes.layerListJSON) {
        return;
      }

      layerList = JSON.parse(attributes.layerListJSON);
    } catch (e) {
      return;
    }

    let geoShapeAggCountPerMap = 0;
    await (0, _std.asyncForEach)(layerList, async layerDescriptor => {
      if (await this._isGeoShapeAggLayer(layerDescriptor)) {
        geoShapeAggCountPerMap++;
      }
    });
    this._geoShapeAggCount += geoShapeAggCountPerMap;
  }

  async getStats() {
    let geoCount = 0;
    let pointCount = 0;
    let shapeCount = 0;
    const indexPatternIds = await this._indexPatternsService.getIds();
    await (0, _std.asyncForEach)(indexPatternIds, async indexPatternId => {
      let indexPattern;

      try {
        indexPattern = await this._indexPatternsService.get(indexPatternId);
      } catch (e) {
        return;
      }

      const pointFields = indexPattern.fields.getByType(_fieldTypes.KBN_FIELD_TYPES.GEO_POINT);
      const shapeFields = indexPattern.fields.getByType(_fieldTypes.KBN_FIELD_TYPES.GEO_SHAPE);

      if (pointFields.length || shapeFields.length) {
        geoCount++;
      }

      if (pointFields.length) {
        pointCount++;
      }

      if (shapeFields.length) {
        shapeCount++;
      }
    });
    return {
      // Tracks whether user uses Gold+ functionality of aggregating on geo_shape field
      geoShapeAggLayersCount: this._geoShapeAggCount,
      indexPatternsWithGeoFieldCount: geoCount,
      indexPatternsWithGeoPointFieldCount: pointCount,
      indexPatternsWithGeoShapeFieldCount: shapeCount
    };
  }

  async _isFieldGeoShape(indexPatternId, geoField) {
    if (!geoField || !indexPatternId) {
      return false;
    }

    let indexPattern;

    try {
      indexPattern = await this._indexPatternsService.get(indexPatternId);
    } catch (e) {
      return false;
    }

    const field = indexPattern.getFieldByName(geoField);
    return !!field && field.type === _fieldTypes.KBN_FIELD_TYPES.GEO_SHAPE;
  }

  async _isGeoShapeAggLayer(layer) {
    if (!layer.sourceDescriptor) {
      return false;
    }

    if (layer.type !== _constants.LAYER_TYPE.GEOJSON_VECTOR && layer.type !== _constants.LAYER_TYPE.BLENDED_VECTOR && layer.type !== _constants.LAYER_TYPE.HEATMAP) {
      return false;
    }

    const sourceDescriptor = layer.sourceDescriptor;

    if (sourceDescriptor.type === _constants.SOURCE_TYPES.ES_GEO_GRID) {
      return await this._isFieldGeoShape(sourceDescriptor.indexPatternId, sourceDescriptor.geoField);
    }

    if (sourceDescriptor.type === _constants.SOURCE_TYPES.ES_SEARCH && sourceDescriptor.scalingType === _constants.SCALING_TYPES.CLUSTERS) {
      return await this._isFieldGeoShape(sourceDescriptor.indexPatternId, sourceDescriptor.geoField);
    }

    return false;
  }

}

exports.IndexPatternStatsCollector = IndexPatternStatsCollector;