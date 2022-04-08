"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IlmPolicyManager = void 0;

var _constants = require("../../../../common/constants");

var _constants2 = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Responsible for detecting and provisioning the reporting ILM policy.
 *
 * Uses the provided {@link ElasticsearchClient} to scope request privileges.
 */


class IlmPolicyManager {
  constructor(client) {
    this.client = client;
  }

  static create(opts) {
    return new IlmPolicyManager(opts.client);
  }

  async doesIlmPolicyExist() {
    try {
      await this.client.ilm.getLifecycle({
        name: _constants.ILM_POLICY_NAME
      });
      return true;
    } catch (e) {
      if (e.statusCode === 404) {
        return false;
      }

      throw e;
    }
  }
  /**
   * Create the Reporting ILM policy
   */


  async createIlmPolicy() {
    await this.client.ilm.putLifecycle({
      name: _constants.ILM_POLICY_NAME,
      body: _constants2.reportingIlmPolicy
    });
  }

}

exports.IlmPolicyManager = IlmPolicyManager;