"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCaseUserActionWithoutConnectorIdRt = exports.CreateCaseUserActionRt = exports.CommonFieldsRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _common = require("./common");

var _connector = require("./connector");

var _description = require("./description");

var _settings = require("./settings");

var _tags = require("./tags");

var _title = require("./title");

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


const CommonFieldsRt = rt.type({
  type: rt.literal(_common.ActionTypes.create_case)
});
exports.CommonFieldsRt = CommonFieldsRt;
const CommonPayloadAttributesRt = rt.type({
  description: _description.DescriptionUserActionPayloadRt.props.description,
  status: rt.string,
  tags: _tags.TagsUserActionPayloadRt.props.tags,
  title: _title.TitleUserActionPayloadRt.props.title,
  settings: _settings.SettingsUserActionPayloadRt.props.settings,
  owner: rt.string
});
const CreateCaseUserActionRt = rt.intersection([CommonFieldsRt, rt.type({
  payload: rt.intersection([_connector.ConnectorUserActionPayloadRt, CommonPayloadAttributesRt])
})]);
exports.CreateCaseUserActionRt = CreateCaseUserActionRt;
const CreateCaseUserActionWithoutConnectorIdRt = rt.intersection([CommonFieldsRt, rt.type({
  payload: rt.intersection([_connector.ConnectorUserActionPayloadWithoutConnectorIdRt, CommonPayloadAttributesRt])
})]);
exports.CreateCaseUserActionWithoutConnectorIdRt = CreateCaseUserActionWithoutConnectorIdRt;