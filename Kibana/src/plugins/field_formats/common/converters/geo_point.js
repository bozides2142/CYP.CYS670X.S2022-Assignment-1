"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoPointFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _types = require("../types");

var _utils = require("../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const TRANSFORM_OPTIONS = [{
  kind: 'none',
  text: _i18n.i18n.translate('fieldFormats.geoPoint.transformOptions.none', {
    defaultMessage: '- None -'
  })
}, {
  kind: 'lat_lon_string',
  text: _i18n.i18n.translate('fieldFormats.geoPoint.transformOptions.latLonString', {
    defaultMessage: 'string with the format: "lat,lon"'
  })
}, {
  kind: 'wkt',
  text: _i18n.i18n.translate('fieldFormats.geoPoint.transformOptions.wkt', {
    defaultMessage: 'Well-Known Text'
  })
}];
/*
 * Convert value to GeoJson point
 *
 * When value is read from fields API, its a GeoJSON Point geometry
 * When value is ready from source, its as provided during ingest which supports multiple formats
 */

function toPoint(val) {
  let lat = NaN;
  let lon = NaN;

  if (typeof val === 'object' && 'lat' in val && 'lon' in val) {
    lat = val.lat;
    lon = val.lon;
  } else if (typeof val === 'string') {
    if (val.startsWith('POINT (')) {
      const pointArg = val.slice('POINT ('.length, val.length);
      const split = pointArg.split(' ');

      if (split.length === 2) {
        lat = parseFloat(split[1]);
        lon = parseFloat(split[0]);
      }
    } else if (val.includes(',')) {
      const split = val.split(',');
      lat = parseFloat(split[0]);
      lon = parseFloat(split[1]);
    }
  }

  return Number.isNaN(lat) || Number.isNaN(lon) ? null : {
    type: 'Point',
    coordinates: [lon, lat]
  };
}

function isPoint(val) {
  return typeof val === 'object' && 'type' in val && val.type === 'Point' && 'coordinates' in val && val.coordinates.length === 2;
}
/** @public */


class GeoPointFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      if (!val) {
        return '';
      }

      const point = isPoint(val) ? val : toPoint(val);

      if (!point) {
        return (0, _utils.asPrettyString)(val);
      }

      switch (this.param('transform')) {
        case 'lat_lon_string':
          return `${point.coordinates[1]},${point.coordinates[0]}`;

        case 'wkt':
          return `POINT (${point.coordinates[0]} ${point.coordinates[1]})`;

        default:
          return (0, _utils.asPrettyString)(val);
      }
    });
  }

  getParamDefaults() {
    return {
      transform: 'none'
    };
  }

}

exports.GeoPointFormat = GeoPointFormat;
(0, _defineProperty2.default)(GeoPointFormat, "id", _types.FIELD_FORMAT_IDS.GEO_POINT);
(0, _defineProperty2.default)(GeoPointFormat, "title", _i18n.i18n.translate('fieldFormats.geoPoint.title', {
  defaultMessage: 'Geo point'
}));
(0, _defineProperty2.default)(GeoPointFormat, "fieldType", [_fieldTypes.KBN_FIELD_TYPES.GEO_POINT]);
(0, _defineProperty2.default)(GeoPointFormat, "transformOptions", TRANSFORM_OPTIONS);