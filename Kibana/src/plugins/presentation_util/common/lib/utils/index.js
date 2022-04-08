"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getElasticLogo: true,
  getElasticOutline: true,
  defaultTheme$: true
};
Object.defineProperty(exports, "defaultTheme$", {
  enumerable: true,
  get: function () {
    return _default_theme.defaultTheme$;
  }
});
exports.getElasticLogo = getElasticLogo;
exports.getElasticOutline = getElasticOutline;

var _dataurl = require("./dataurl");

Object.keys(_dataurl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dataurl[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dataurl[key];
    }
  });
});

var _httpurl = require("./httpurl");

Object.keys(_httpurl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _httpurl[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _httpurl[key];
    }
  });
});

var _resolve_dataurl = require("./resolve_dataurl");

Object.keys(_resolve_dataurl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _resolve_dataurl[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _resolve_dataurl[key];
    }
  });
});

var _url = require("./url");

Object.keys(_url).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _url[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _url[key];
    }
  });
});

var _default_theme = require("./default_theme");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function getElasticLogo() {
  return await Promise.resolve().then(() => _interopRequireWildcard(require('./elastic_logo')));
}

async function getElasticOutline() {
  return await Promise.resolve().then(() => _interopRequireWildcard(require('./elastic_outline')));
}