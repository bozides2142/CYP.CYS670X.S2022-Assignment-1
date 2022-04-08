"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ColorSchemas: true,
  vislibColorMaps: true,
  colorSchemas: true,
  getHeatmapColors: true,
  truncatedColorMaps: true,
  truncatedColorSchemas: true,
  ColorMode: true,
  LabelRotation: true,
  defaultCountLabel: true,
  checkIsMaxContinuity: true,
  checkIsMinContinuity: true
};
Object.defineProperty(exports, "ColorMode", {
  enumerable: true,
  get: function () {
    return _components.ColorMode;
  }
});
Object.defineProperty(exports, "ColorSchemas", {
  enumerable: true,
  get: function () {
    return _color_maps.ColorSchemas;
  }
});
Object.defineProperty(exports, "LabelRotation", {
  enumerable: true,
  get: function () {
    return _components.LabelRotation;
  }
});
Object.defineProperty(exports, "checkIsMaxContinuity", {
  enumerable: true,
  get: function () {
    return _palette.checkIsMaxContinuity;
  }
});
Object.defineProperty(exports, "checkIsMinContinuity", {
  enumerable: true,
  get: function () {
    return _palette.checkIsMinContinuity;
  }
});
Object.defineProperty(exports, "colorSchemas", {
  enumerable: true,
  get: function () {
    return _color_maps.colorSchemas;
  }
});
Object.defineProperty(exports, "defaultCountLabel", {
  enumerable: true,
  get: function () {
    return _components.defaultCountLabel;
  }
});
Object.defineProperty(exports, "getHeatmapColors", {
  enumerable: true,
  get: function () {
    return _color_maps.getHeatmapColors;
  }
});
Object.defineProperty(exports, "truncatedColorMaps", {
  enumerable: true,
  get: function () {
    return _color_maps.truncatedColorMaps;
  }
});
Object.defineProperty(exports, "truncatedColorSchemas", {
  enumerable: true,
  get: function () {
    return _color_maps.truncatedColorSchemas;
  }
});
Object.defineProperty(exports, "vislibColorMaps", {
  enumerable: true,
  get: function () {
    return _color_maps.vislibColorMaps;
  }
});

var _color_maps = require("./color_maps");

var _components = require("./components");

var _palette = require("./palette");

var _styles = require("./styles");

Object.keys(_styles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _styles[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _styles[key];
    }
  });
});