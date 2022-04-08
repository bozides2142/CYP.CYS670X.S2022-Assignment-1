"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _collectors = require("./collectors");

var _is_cloud_enabled = require("../common/is_cloud_enabled");

var _utils = require("./utils");

var _fullstory = require("./routes/fullstory");

var _chat = require("./routes/chat");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CloudPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "isDev", void 0);
    this.context = context;
    this.logger = this.context.logger.get();
    this.config = this.context.config.get();
    this.isDev = this.context.env.mode.dev;
  }

  setup(core, {
    usageCollection,
    security
  }) {
    var _this$config$apm, _this$config$apm2;

    this.logger.debug('Setting up Cloud plugin');
    const isCloudEnabled = (0, _is_cloud_enabled.getIsCloudEnabled)(this.config.id);
    (0, _collectors.registerCloudUsageCollector)(usageCollection, {
      isCloudEnabled
    });

    if (this.config.full_story.enabled) {
      (0, _fullstory.registerFullstoryRoute)({
        httpResources: core.http.resources,
        packageInfo: this.context.env.packageInfo
      });
    }

    if (this.config.chat.enabled && this.config.chatIdentitySecret) {
      (0, _chat.registerChatRoute)({
        router: core.http.createRouter(),
        chatIdentitySecret: this.config.chatIdentitySecret,
        security,
        isDev: this.isDev
      });
    }

    return {
      cloudId: this.config.id,
      deploymentId: (0, _utils.parseDeploymentIdFromDeploymentUrl)(this.config.deployment_url),
      isCloudEnabled,
      apm: {
        url: (_this$config$apm = this.config.apm) === null || _this$config$apm === void 0 ? void 0 : _this$config$apm.url,
        secretToken: (_this$config$apm2 = this.config.apm) === null || _this$config$apm2 === void 0 ? void 0 : _this$config$apm2.secret_token
      }
    };
  }

  start() {}

}

exports.CloudPlugin = CloudPlugin;