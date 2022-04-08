"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geoBoundingBoxFunction = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isGeoBox(value) {
  return (value === null || value === void 0 ? void 0 : value.top) != null && (value === null || value === void 0 ? void 0 : value.left) != null && (value === null || value === void 0 ? void 0 : value.bottom) != null && (value === null || value === void 0 ? void 0 : value.right) != null;
}

function isGeoPoints(value) {
  return (value === null || value === void 0 ? void 0 : value.topLeft) != null && (value === null || value === void 0 ? void 0 : value.bottomRight) != null || (value === null || value === void 0 ? void 0 : value.topRight) != null && (value === null || value === void 0 ? void 0 : value.bottomLeft) != null;
}

function isWellKnownText(value) {
  return (value === null || value === void 0 ? void 0 : value.wkt) != null;
}

const geoBoundingBoxFunction = {
  name: 'geoBoundingBox',
  type: 'geo_bounding_box',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.help', {
    defaultMessage: 'Create a geo bounding box'
  }),
  args: {
    top: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.top.help', {
        defaultMessage: 'Specify the top coordinate'
      })
    },
    left: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.left.help', {
        defaultMessage: 'Specify the left coordinate'
      })
    },
    bottom: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.bottom.help', {
        defaultMessage: 'Specify the bottom coordinate'
      })
    },
    right: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.right.help', {
        defaultMessage: 'Specify the right coordinate'
      })
    },
    wkt: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.wkt.help', {
        defaultMessage: 'Specify the Well-Known Text (WKT)'
      })
    },
    topLeft: {
      types: ['geo_point'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.top_left.help', {
        defaultMessage: 'Specify the top left corner'
      })
    },
    bottomRight: {
      types: ['geo_point'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.bottom_right.help', {
        defaultMessage: 'Specify the bottom right corner'
      })
    },
    topRight: {
      types: ['geo_point'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.top_right.help', {
        defaultMessage: 'Specify the top right corner'
      })
    },
    bottomLeft: {
      types: ['geo_point'],
      help: _i18n.i18n.translate('data.search.functions.geoBoundingBox.bottom_left.help', {
        defaultMessage: 'Specify the bottom left corner'
      })
    }
  },

  fn(input, args) {
    if (isWellKnownText(args)) {
      return { ...(0, _lodash.pick)(args, 'wkt'),
        type: 'geo_bounding_box'
      };
    }

    if (isGeoBox(args)) {
      return { ...(0, _lodash.pick)(args, ['top', 'left', 'bottom', 'right']),
        type: 'geo_bounding_box'
      };
    }

    if (isGeoPoints(args)) {
      return { ...(0, _lodash.chain)(args).pick(['topLeft', 'bottomRight', 'topRight', 'bottomLeft']).omitBy(_lodash.isNil).mapKeys((value, key) => (0, _lodash.snakeCase)(key)).mapValues(({
          value
        }) => value).value(),
        type: 'geo_bounding_box'
      };
    }

    throw new Error(_i18n.i18n.translate('data.search.functions.geoBoundingBox.arguments.error', {
      defaultMessage: 'At least one of the following groups of parameters must be provided: {parameters}.',
      values: {
        parameters: [['wkt'], ['top', 'left', 'bottom', 'right'], ['topLeft', 'bottomRight'], ['topRight', 'bottomLeft']].map(parameters => parameters.join(', ')).join('; ')
      }
    }));
  }

};
exports.geoBoundingBoxFunction = geoBoundingBoxFunction;