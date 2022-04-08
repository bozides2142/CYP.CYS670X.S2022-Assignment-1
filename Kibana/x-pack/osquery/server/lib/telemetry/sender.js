"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryEventsSender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _url = require("url");

var _securitysolutionUtils = require("@kbn/securitysolution-utils");

var _tasks = require("./tasks");

var _helpers = require("./helpers");

var _constants = require("./constants");

var _task = require("./task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const usageLabelPrefix = ['osquery_telemetry', 'sender'];

class TelemetryEventsSender {
  // Assume true until the first check
  constructor(logger) {
    (0, _defineProperty2.default)(this, "initialCheckDelayMs", 10 * 1000);
    (0, _defineProperty2.default)(this, "checkIntervalMs", 60 * 1000);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "maxQueueSize", _constants.TELEMETRY_MAX_BUFFER_SIZE);
    (0, _defineProperty2.default)(this, "telemetryStart", void 0);
    (0, _defineProperty2.default)(this, "telemetrySetup", void 0);
    (0, _defineProperty2.default)(this, "intervalId", void 0);
    (0, _defineProperty2.default)(this, "isSending", false);
    (0, _defineProperty2.default)(this, "receiver", void 0);
    (0, _defineProperty2.default)(this, "queue", []);
    (0, _defineProperty2.default)(this, "isOptedIn", true);
    (0, _defineProperty2.default)(this, "telemetryUsageCounter", void 0);
    (0, _defineProperty2.default)(this, "telemetryTasks", void 0);
    this.logger = logger.get('telemetry_events');
  }

  setup(telemetryReceiver, telemetrySetup, taskManager, telemetryUsageCounter) {
    this.telemetrySetup = telemetrySetup;
    this.telemetryUsageCounter = telemetryUsageCounter;

    if (taskManager) {
      this.telemetryTasks = (0, _tasks.createTelemetryTaskConfigs)().map(config => {
        const task = new _task.OsqueryTelemetryTask(config, this.logger, this, telemetryReceiver);
        task.register(taskManager);
        return task;
      });
    }
  }

  getClusterID() {
    var _this$receiver, _this$receiver$getClu;

    return (_this$receiver = this.receiver) === null || _this$receiver === void 0 ? void 0 : (_this$receiver$getClu = _this$receiver.getClusterInfo()) === null || _this$receiver$getClu === void 0 ? void 0 : _this$receiver$getClu.cluster_uuid;
  }

  start(telemetryStart, taskManager, receiver) {
    this.telemetryStart = telemetryStart;
    this.receiver = receiver;

    if (taskManager && this.telemetryTasks) {
      this.logger.debug(`Starting osquery telemetry tasks`);
      this.telemetryTasks.forEach(task => task.start(taskManager));
    }

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

  queueTelemetryEvents(events) {
    const qlength = this.queue.length;

    if (events.length === 0) {
      return;
    }

    this.logger.debug(`Queue events`);

    if (qlength >= this.maxQueueSize) {
      // we're full already
      return;
    }

    if (events.length > this.maxQueueSize - qlength) {
      var _this$telemetryUsageC, _this$telemetryUsageC2;

      (_this$telemetryUsageC = this.telemetryUsageCounter) === null || _this$telemetryUsageC === void 0 ? void 0 : _this$telemetryUsageC.incrementCounter({
        counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['queue_stats'])),
        counterType: 'docs_lost',
        incrementBy: events.length
      });
      (_this$telemetryUsageC2 = this.telemetryUsageCounter) === null || _this$telemetryUsageC2 === void 0 ? void 0 : _this$telemetryUsageC2.incrementCounter({
        counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['queue_stats'])),
        counterType: 'num_capacity_exceeded',
        incrementBy: 1
      });
      this.queue.push(...this.processEvents(events.slice(0, this.maxQueueSize - qlength)));
    } else {
      this.queue.push(...this.processEvents(events));
    }
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

    if (this.queue.length === 0) {
      return;
    }

    try {
      var _this$receiver2, _this$receiver3, _clusterInfo$version;

      this.isSending = true;
      this.isOptedIn = await this.isTelemetryOptedIn();

      if (!this.isOptedIn) {
        this.logger.debug(`Telemetry is not opted-in.`);
        this.queue = [];
        this.isSending = false;
        return;
      }

      const clusterInfo = (_this$receiver2 = this.receiver) === null || _this$receiver2 === void 0 ? void 0 : _this$receiver2.getClusterInfo();
      const [telemetryUrl, licenseInfo] = await Promise.all([this.fetchTelemetryUrl('alerts-endpoint'), (_this$receiver3 = this.receiver) === null || _this$receiver3 === void 0 ? void 0 : _this$receiver3.fetchLicenseInfo()]);
      this.logger.debug(`Telemetry URL: ${telemetryUrl}`);
      this.logger.debug(`cluster_uuid: ${clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid} cluster_name: ${clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name}`);
      const toSend = this.queue.slice().map(event => {
        var _this$receiver4;

        return { ...event,
          ...(licenseInfo ? {
            license: (_this$receiver4 = this.receiver) === null || _this$receiver4 === void 0 ? void 0 : _this$receiver4.copyLicenseFields(licenseInfo)
          } : {}),
          cluster_uuid: clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid,
          cluster_name: clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name
        };
      });
      this.queue = [];
      await this.sendEvents(toSend, telemetryUrl, 'alerts-endpoint', clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid, clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name, clusterInfo === null || clusterInfo === void 0 ? void 0 : (_clusterInfo$version = clusterInfo.version) === null || _clusterInfo$version === void 0 ? void 0 : _clusterInfo$version.number, licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid);
    } catch (err) {
      this.queue = [];
    }

    this.isSending = false;
  }

  processEvents(events) {
    return events;
  }
  /**
   * This function sends events to the elastic telemetry channel. Caution is required
   * because it does no allowlist filtering at send time. The function call site is
   * responsible for ensuring sure no sensitive material is in telemetry events.
   *
   * @param channel the elastic telemetry channel
   * @param toSend telemetry events
   */


  async sendOnDemand(channel, toSend) {
    var _this$receiver5;

    const clusterInfo = (_this$receiver5 = this.receiver) === null || _this$receiver5 === void 0 ? void 0 : _this$receiver5.getClusterInfo();

    try {
      var _this$receiver6, _clusterInfo$version2;

      const [telemetryUrl, licenseInfo] = await Promise.all([this.fetchTelemetryUrl(channel), (_this$receiver6 = this.receiver) === null || _this$receiver6 === void 0 ? void 0 : _this$receiver6.fetchLicenseInfo()]);
      this.logger.debug(`Telemetry URL: ${telemetryUrl}`);
      this.logger.debug(`cluster_uuid: ${clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid} cluster_name: ${clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name}`);
      await this.sendEvents(toSend, telemetryUrl, channel, clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid, clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name, clusterInfo === null || clusterInfo === void 0 ? void 0 : (_clusterInfo$version2 = clusterInfo.version) === null || _clusterInfo$version2 === void 0 ? void 0 : _clusterInfo$version2.number, licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid); // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  async fetchTelemetryUrl(channel) {
    var _this$telemetrySetup;

    const telemetryUrl = await ((_this$telemetrySetup = this.telemetrySetup) === null || _this$telemetrySetup === void 0 ? void 0 : _this$telemetrySetup.getTelemetryUrl());

    if (!telemetryUrl) {
      throw Error("Couldn't get telemetry URL");
    }

    return this.getV3UrlFromV2(telemetryUrl.toString(), channel);
  } // Forms URLs like:
  // https://telemetry.elastic.co/v3/send/my-channel-name or
  // https://telemetry-staging.elastic.co/v3-dev/send/my-channel-name


  getV3UrlFromV2(v2url, channel) {
    const url = new _url.URL(v2url);

    if (!url.hostname.includes('staging')) {
      url.pathname = `/v3/send/${channel}`;
    } else {
      url.pathname = `/v3-dev/send/${channel}`;
    }

    return url.toString();
  }

  async sendEvents(events, telemetryUrl, channel, clusterUuid, clusterName, clusterVersionNumber, licenseId) {
    const ndjson = (0, _securitysolutionUtils.transformDataToNdjson)(events);

    try {
      var _this$telemetryUsageC3, _this$telemetryUsageC4;

      this.logger.debug(`Sending ${events.length} telemetry events to ${channel}`);
      const resp = await _axios.default.post(telemetryUrl, ndjson, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'X-Elastic-Cluster-ID': clusterUuid,
          'X-Elastic-Cluster-Name': clusterName,
          'X-Elastic-Stack-Version': clusterVersionNumber ? clusterVersionNumber : '8.0.0',
          ...(licenseId ? {
            'X-Elastic-License-ID': licenseId
          } : {})
        }
      });
      (_this$telemetryUsageC3 = this.telemetryUsageCounter) === null || _this$telemetryUsageC3 === void 0 ? void 0 : _this$telemetryUsageC3.incrementCounter({
        counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['payloads', channel])),
        counterType: resp.status.toString(),
        incrementBy: 1
      });
      (_this$telemetryUsageC4 = this.telemetryUsageCounter) === null || _this$telemetryUsageC4 === void 0 ? void 0 : _this$telemetryUsageC4.incrementCounter({
        counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['payloads', channel])),
        counterType: 'docs_sent',
        incrementBy: events.length
      });
      this.logger.debug(`Events sent!. Response: ${resp.status} ${JSON.stringify(resp.data)}`);
    } catch (err) {
      var _this$telemetryUsageC5, _this$telemetryUsageC6;

      this.logger.debug(`Error sending events: ${err}`);
      (_this$telemetryUsageC5 = this.telemetryUsageCounter) === null || _this$telemetryUsageC5 === void 0 ? void 0 : _this$telemetryUsageC5.incrementCounter({
        counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['payloads', channel])),
        counterType: 'docs_lost',
        incrementBy: events.length
      });
      (_this$telemetryUsageC6 = this.telemetryUsageCounter) === null || _this$telemetryUsageC6 === void 0 ? void 0 : _this$telemetryUsageC6.incrementCounter({
        counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['payloads', channel])),
        counterType: 'num_exceptions',
        incrementBy: 1
      });
    }
  }

}

exports.TelemetryEventsSender = TelemetryEventsSender;