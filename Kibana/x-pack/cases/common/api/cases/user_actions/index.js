"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  UserActionsRt: true,
  UserActionsWithoutConnectorIdRt: true,
  CaseUserActionAttributesRt: true,
  CaseUserActionsResponseRt: true
};
exports.UserActionsWithoutConnectorIdRt = exports.UserActionsRt = exports.CaseUserActionsResponseRt = exports.CaseUserActionAttributesRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

var _create_case = require("./create_case");

Object.keys(_create_case).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _create_case[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_case[key];
    }
  });
});

var _description = require("./description");

Object.keys(_description).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _description[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _description[key];
    }
  });
});

var _comment = require("./comment");

Object.keys(_comment).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _comment[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _comment[key];
    }
  });
});

var _connector = require("./connector");

Object.keys(_connector).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _connector[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _connector[key];
    }
  });
});

var _pushed = require("./pushed");

Object.keys(_pushed).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _pushed[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pushed[key];
    }
  });
});

var _tags = require("./tags");

Object.keys(_tags).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _tags[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tags[key];
    }
  });
});

var _title = require("./title");

Object.keys(_title).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _title[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _title[key];
    }
  });
});

var _settings = require("./settings");

Object.keys(_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings[key];
    }
  });
});

var _status = require("./status");

Object.keys(_status).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _status[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _status[key];
    }
  });
});

var _delete_case = require("./delete_case");

Object.keys(_delete_case).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _delete_case[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _delete_case[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CommonUserActionsRt = rt.union([_description.DescriptionUserActionRt, _comment.CommentUserActionRt, _tags.TagsUserActionRt, _title.TitleUserActionRt, _settings.SettingsUserActionRt, _status.StatusUserActionRt]);
const UserActionsRt = rt.union([CommonUserActionsRt, _create_case.CreateCaseUserActionRt, _connector.ConnectorUserActionRt, _pushed.PushedUserActionRt, _delete_case.DeleteCaseUserActionRt]);
exports.UserActionsRt = UserActionsRt;
const UserActionsWithoutConnectorIdRt = rt.union([CommonUserActionsRt, _create_case.CreateCaseUserActionRt, _connector.ConnectorUserActionRt, _pushed.PushedUserActionRt, _delete_case.DeleteCaseUserActionRt]);
exports.UserActionsWithoutConnectorIdRt = UserActionsWithoutConnectorIdRt;
const CaseUserActionBasicRt = rt.intersection([UserActionsRt, _common.UserActionCommonAttributesRt]);
const CaseUserActionBasicWithoutConnectorIdRt = rt.intersection([UserActionsWithoutConnectorIdRt, _common.UserActionCommonAttributesRt]);
const CaseUserActionResponseRt = rt.intersection([CaseUserActionBasicRt, _common.CaseUserActionSavedObjectIdsRt]);
const CaseUserActionAttributesRt = CaseUserActionBasicRt;
exports.CaseUserActionAttributesRt = CaseUserActionAttributesRt;
const CaseUserActionsResponseRt = rt.array(CaseUserActionResponseRt);
exports.CaseUserActionsResponseRt = CaseUserActionsResponseRt;