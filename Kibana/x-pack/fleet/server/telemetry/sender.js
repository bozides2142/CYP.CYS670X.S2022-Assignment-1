"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryEventsSender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _axios = _interopRequireDefault(require("axios"));

var _queue = require("./queue");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Simplified version of https://github.com/elastic/kibana/blob/master/x-pack/plugins/security_solution/server/lib/telemetry/sender.ts
 * Sends batched events to telemetry v3 api
 */


class TelemetryEventsSender {
  // Assume true until the first check
  constructor(logger) {
    (0, _defineProperty2.default)(this, "initialCheckDelayMs", 10 * 1000);
    (0, _defineProperty2.default)(this, "checkIntervalMs", 30 * 1000);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "telemetryStart", void 0);
    (0, _defineProperty2.default)(this, "telemetrySetup", void 0);
    (0, _defineProperty2.default)(this, "intervalId", void 0);
    (0, _defineProperty2.default)(this, "isSending", false);
    (0, _defineProperty2.default)(this, "queuesPerChannel", {});
    (0, _defineProperty2.default)(this, "isOptedIn", true);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "clusterInfo", void 0);
    (0, _defineProperty2.default)(this, "transformDataToNdjson", data => {
      if (data.length !== 0) {
        const dataString = data.map(dataItem => JSON.stringify(dataItem)).join('\n');
        return `${dataString}\n`;
      } else {
        return '';
      }
    });
    this.logger = logger;
  }

  setup(telemetrySetup) {
    this.telemetrySetup = telemetrySetup;
  }

  async start(telemetryStart, core) {
    this.telemetryStart = telemetryStart;
    this.esClient = core === null || core === void 0 ? void 0 : core.elasticsearch.client.asInternalUser;
    this.clusterInfo = await this.fetchClusterInfo();
    this.logger.debug(`Starting local task`);
    setTimeout(() => {
      this.sendIfDue();
      this.intervalId = setInterval(() => this.sendIfDue(), this.checkIntervalMs);
    }, this.initialCheckDelayMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  queueTelemetryEvents(channel, events) {
    if (!this.queuesPerChannel[channel]) {
      this.queuesPerChannel[channel] = new _queue.TelemetryQueue();
    }

    this.queuesPerChannel[channel].addEvents((0, _lodash.cloneDeep)(events));
  }

  async isTelemetryOptedIn() {
    var _this$telemetryStart;

    this.isOptedIn = await ((_this$telemetryStart = this.telemetryStart) === null || _this$telemetryStart === void 0 ? void 0 : _this$telemetryStart.getIsOptedIn());
    return this.isOptedIn === true;
  }

  async sendIfDue() {
    if (this.isSending) {
      return;
    }

    this.isSending = true;
    this.isOptedIn = await this.isTelemetryOptedIn();

    if (!this.isOptedIn) {
      this.logger.debug(`Telemetry is not opted-in.`);

      for (const channel of Object.keys(this.queuesPerChannel)) {
        this.queuesPerChannel[channel].clearEvents();
      }

      this.isSending = false;
      return;
    }

    for (const channel of Object.keys(this.queuesPerChannel)) {
      await this.sendEvents(await this.fetchTelemetryUrl(channel), this.clusterInfo, this.queuesPerChannel[channel]);
    }

    this.isSending = false;
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

  async sendEvents(telemetryUrl, clusterInfo, queue) {
    const events = queue.getEvents();

    if (events.length === 0) {
      return;
    }

    try {
      var _clusterInfo$version;

      this.logger.debug(`Telemetry URL: ${telemetryUrl}`);
      queue.clearEvents();
      this.logger.debug(JSON.stringify(events));
      await this.send(events, telemetryUrl, clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid, clusterInfo === null || clusterInfo === void 0 ? void 0 : (_clusterInfo$version = clusterInfo.version) === null || _clusterInfo$version === void 0 ? void 0 : _clusterInfo$version.number);
    } catch (err) {
      this.logger.debug(`Error sending telemetry events data: ${err}`);
      queue.clearEvents();
    }
  } // Forms URLs like:
  // https://telemetry.elastic.co/v3/send/my-channel-name or
  // https://telemetry-staging.elastic.co/v3/send/my-channel-name


  async fetchTelemetryUrl(channel) {
    var _this$telemetrySetup;

    const telemetryUrl = await ((_this$telemetrySetup = this.telemetrySetup) === null || _this$telemetrySetup === void 0 ? void 0 : _this$telemetrySetup.getTelemetryUrl());

    if (!telemetryUrl) {
      throw Error("Couldn't get telemetry URL");
    }

    telemetryUrl.pathname = `/v3/send/${channel}`;
    return telemetryUrl.toString();
  }

  async send(events, telemetryUrl, clusterUuid, clusterVersionNumber) {
    // using ndjson so that each line will be wrapped in json envelope on server side
    // see https://github.com/elastic/infra/blob/master/docs/telemetry/telemetry-next-dataflow.md#json-envelope
    const ndjson = this.transformDataToNdjson(events);

    try {
      const resp = await _axios.default.post(telemetryUrl, ndjson, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'X-Elastic-Cluster-ID': clusterUuid,
          'X-Elastic-Stack-Version': clusterVersionNumber ? clusterVersionNumber : '7.16.0'
        }
      });
      this.logger.debug(`Events sent!. Response: ${resp.status} ${JSON.stringify(resp.data)}`);
    } catch (err) {
      var _err$response;

      this.logger.debug(`Error sending events: ${err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status} ${JSON.stringify(err.response.data)}`);
    }
  }

}

exports.TelemetryEventsSender = TelemetryEventsSender;