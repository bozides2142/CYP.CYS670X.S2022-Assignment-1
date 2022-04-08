"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BUCKET_TYPES", {
  enumerable: true,
  get: function () {
    return _metric_types.BUCKET_TYPES;
  }
});
exports.DATA_FORMATTERS = void 0;
Object.defineProperty(exports, "MODEL_TYPES", {
  enumerable: true,
  get: function () {
    return _model_types.MODEL_TYPES;
  }
});
exports.PALETTES = void 0;
Object.defineProperty(exports, "PANEL_TYPES", {
  enumerable: true,
  get: function () {
    return _panel_types.PANEL_TYPES;
  }
});
Object.defineProperty(exports, "TIME_RANGE_DATA_MODES", {
  enumerable: true,
  get: function () {
    return _timerange_data_modes.TIME_RANGE_DATA_MODES;
  }
});
Object.defineProperty(exports, "TIME_RANGE_MODE_KEY", {
  enumerable: true,
  get: function () {
    return _timerange_data_modes.TIME_RANGE_MODE_KEY;
  }
});
exports.TOOLTIP_MODES = void 0;
Object.defineProperty(exports, "TSVB_METRIC_TYPES", {
  enumerable: true,
  get: function () {
    return _metric_types.TSVB_METRIC_TYPES;
  }
});

var _panel_types = require("./panel_types");

var _model_types = require("./model_types");

var _metric_types = require("./metric_types");

var _timerange_data_modes = require("./timerange_data_modes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let PALETTES;
exports.PALETTES = PALETTES;

(function (PALETTES) {
  PALETTES["GRADIENT"] = "gradient";
  PALETTES["RAINBOW"] = "rainbow";
})(PALETTES || (exports.PALETTES = PALETTES = {}));

let TOOLTIP_MODES;
exports.TOOLTIP_MODES = TOOLTIP_MODES;

(function (TOOLTIP_MODES) {
  TOOLTIP_MODES["SHOW_ALL"] = "show_all";
  TOOLTIP_MODES["SHOW_FOCUSED"] = "show_focused";
})(TOOLTIP_MODES || (exports.TOOLTIP_MODES = TOOLTIP_MODES = {}));

let DATA_FORMATTERS;
exports.DATA_FORMATTERS = DATA_FORMATTERS;

(function (DATA_FORMATTERS) {
  DATA_FORMATTERS["BYTES"] = "bytes";
  DATA_FORMATTERS["CUSTOM"] = "custom";
  DATA_FORMATTERS["DEFAULT"] = "default";
  DATA_FORMATTERS["DURATION"] = "duration";
  DATA_FORMATTERS["NUMBER"] = "number";
  DATA_FORMATTERS["PERCENT"] = "percent";
})(DATA_FORMATTERS || (exports.DATA_FORMATTERS = DATA_FORMATTERS = {}));