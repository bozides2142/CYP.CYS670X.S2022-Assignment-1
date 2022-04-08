"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = void 0;

var fieldRoutes = _interopRequireWildcard(require("./fields"));

var runtimeRoutes = _interopRequireWildcard(require("./runtime_fields"));

var scriptedRoutes = _interopRequireWildcard(require("./scripted_fields"));

var createRoutes = _interopRequireWildcard(require("./create_data_view"));

var defaultRoutes = _interopRequireWildcard(require("./default_data_view"));

var deleteRoutes = _interopRequireWildcard(require("./delete_data_view"));

var getRoutes = _interopRequireWildcard(require("./get_data_view"));

var hasRoutes = _interopRequireWildcard(require("./has_user_data_view"));

var updateRoutes = _interopRequireWildcard(require("./update_data_view"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const routes = [fieldRoutes.registerUpdateFieldsRoute, fieldRoutes.registerUpdateFieldsRouteLegacy, runtimeRoutes.registerCreateRuntimeFieldRoute, runtimeRoutes.registerCreateRuntimeFieldRouteLegacy, runtimeRoutes.registerDeleteRuntimeFieldRoute, runtimeRoutes.registerDeleteRuntimeFieldRouteLegacy, runtimeRoutes.registerGetRuntimeFieldRoute, runtimeRoutes.registerGetRuntimeFieldRouteLegacy, runtimeRoutes.registerPutRuntimeFieldRoute, runtimeRoutes.registerPutRuntimeFieldRouteLegacy, runtimeRoutes.registerUpdateRuntimeFieldRoute, runtimeRoutes.registerUpdateRuntimeFieldRouteLegacy, createRoutes.registerCreateDataViewRoute, createRoutes.registerCreateDataViewRouteLegacy, defaultRoutes.registerManageDefaultDataViewRoute, defaultRoutes.registerManageDefaultDataViewRouteLegacy, deleteRoutes.registerDeleteDataViewRoute, deleteRoutes.registerDeleteDataViewRouteLegacy, getRoutes.registerGetDataViewRoute, getRoutes.registerGetDataViewRouteLegacy, hasRoutes.registerHasUserDataViewRoute, hasRoutes.registerHasUserDataViewRouteLegacy, updateRoutes.registerUpdateDataViewRoute, updateRoutes.registerUpdateDataViewRouteLegacy, ...Object.values(scriptedRoutes)];
exports.routes = routes;