"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryReceiver = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class TelemetryReceiver {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "agentClient", void 0);
    (0, _defineProperty2.default)(this, "agentPolicyService", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "soClient", void 0);
    (0, _defineProperty2.default)(this, "clusterInfo", void 0);
    (0, _defineProperty2.default)(this, "max_records", 100);
    this.logger = logger.get('telemetry_events');
  }

  async start(core, osqueryContextService) {
    var _osqueryContextServic;

    this.agentClient = osqueryContextService === null || osqueryContextService === void 0 ? void 0 : (_osqueryContextServic = osqueryContextService.getAgentService()) === null || _osqueryContextServic === void 0 ? void 0 : _osqueryContextServic.asInternalUser;
    this.agentPolicyService = osqueryContextService === null || osqueryContextService === void 0 ? void 0 : osqueryContextService.getAgentPolicyService();
    this.esClient = core === null || core === void 0 ? void 0 : core.elasticsearch.client.asInternalUser;
    this.soClient = core === null || core === void 0 ? void 0 : core.savedObjects.createInternalRepository();
    this.clusterInfo = await this.fetchClusterInfo();
  }

  getClusterInfo() {
    return this.clusterInfo;
  }

  async fetchPacks() {
    var _this$soClient;

    return await ((_this$soClient = this.soClient) === null || _this$soClient === void 0 ? void 0 : _this$soClient.find({
      type: _types.packSavedObjectType,
      page: 1,
      perPage: this.max_records,
      sortField: 'updated_at',
      sortOrder: 'desc'
    }));
  }

  async fetchSavedQueries() {
    var _this$soClient2;

    return await ((_this$soClient2 = this.soClient) === null || _this$soClient2 === void 0 ? void 0 : _this$soClient2.find({
      type: _types.savedQuerySavedObjectType,
      page: 1,
      perPage: this.max_records,
      sortField: 'updated_at',
      sortOrder: 'desc'
    }));
  }

  async fetchFleetAgents() {
    var _this$agentClient;

    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve fleet policy responses');
    }

    return (_this$agentClient = this.agentClient) === null || _this$agentClient === void 0 ? void 0 : _this$agentClient.listAgents({
      perPage: this.max_records,
      showInactive: true,
      sortField: 'enrolled_at',
      sortOrder: 'desc'
    });
  }

  async fetchPolicyConfigs(id) {
    var _this$agentPolicyServ;

    if (this.soClient === undefined || this.soClient === null) {
      throw Error('saved object client is unavailable: cannot retrieve endpoint policy configurations');
    }

    return (_this$agentPolicyServ = this.agentPolicyService) === null || _this$agentPolicyServ === void 0 ? void 0 : _this$agentPolicyServ.get(this.soClient, id);
  }

  async fetchClusterInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve cluster infomation');
    }

    const {
      body
    } = await this.esClient.info();
    return body;
  }

  async fetchLicenseInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve license information');
    }

    try {
      const ret = (await this.esClient.transport.request({
        method: 'GET',
        path: '/_license',
        querystring: {
          local: true
        }
      })).body;
      return (await ret).license;
    } catch (err) {
      this.logger.debug(`failed retrieving license: ${err}`);
      return undefined;
    }
  }

  copyLicenseFields(lic) {
    return {
      uid: lic.uid,
      status: lic.status,
      type: lic.type,
      ...(lic.issued_to ? {
        issued_to: lic.issued_to
      } : {}),
      ...(lic.issuer ? {
        issuer: lic.issuer
      } : {})
    };
  }

}

exports.TelemetryReceiver = TelemetryReceiver;