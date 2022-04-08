"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseRule = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _fetch_clusters = require("../lib/alerts/fetch_clusters");

var _enums = require("../../common/enums");

var _common = require("../../../alerting/common");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultRuleOptions = () => {
  return {
    id: '',
    name: '',
    throttle: '1d',
    interval: '1m',
    defaultParams: {
      threshold: 85,
      duration: '1h'
    },
    actionVariables: []
  };
};

class BaseRule {
  constructor(sanitizedRule, ruleOptions = defaultRuleOptions()) {
    (0, _defineProperty2.default)(this, "scopedLogger", void 0);
    this.sanitizedRule = sanitizedRule;
    this.ruleOptions = ruleOptions;
    const defaultOptions = defaultRuleOptions();
    defaultOptions.defaultParams = { ...defaultOptions.defaultParams,
      ...this.ruleOptions.defaultParams
    };
    this.ruleOptions = { ...defaultOptions,
      ...this.ruleOptions
    };
    this.scopedLogger = _static_globals.Globals.app.getLogger(ruleOptions.id);
  }

  getRuleType() {
    const {
      id,
      name,
      actionVariables
    } = this.ruleOptions;
    return {
      id,
      name,
      actionGroups: [{
        id: 'default',
        name: _i18n.i18n.translate('xpack.monitoring.alerts.actionGroups.default', {
          defaultMessage: 'Default'
        })
      }],
      defaultActionGroupId: 'default',
      minimumLicenseRequired: 'basic',
      isExportable: false,
      executor: options => this.execute(options),
      producer: 'monitoring',
      actionVariables: {
        context: actionVariables
      }
    };
  }

  getId() {
    var _this$sanitizedRule;

    return (_this$sanitizedRule = this.sanitizedRule) === null || _this$sanitizedRule === void 0 ? void 0 : _this$sanitizedRule.id;
  }

  async createIfDoesNotExist(rulesClient, actionsClient, actions) {
    const existingRuleData = await rulesClient.find({
      options: {
        search: this.ruleOptions.id
      }
    });

    if (existingRuleData.total > 0) {
      return existingRuleData.data[0];
    }

    const ruleActions = [];

    for (const actionData of actions) {
      const action = await actionsClient.get({
        id: actionData.id
      });

      if (!action) {
        continue;
      }

      ruleActions.push({
        group: 'default',
        id: actionData.id,
        params: {
          message: '{{context.internalShortMessage}}',
          ...actionData.config
        }
      });
    }

    const {
      defaultParams: params = {},
      name,
      id: alertTypeId,
      throttle = '1d',
      interval = '1m'
    } = this.ruleOptions;
    return await rulesClient.create({
      data: {
        enabled: true,
        tags: [],
        params,
        consumer: 'monitoring',
        name,
        alertTypeId,
        throttle,
        notifyWhen: null,
        schedule: {
          interval
        },
        actions: ruleActions
      }
    });
  }

  async getStates(rulesClient, id, filters) {
    const states = await rulesClient.getAlertState({
      id
    });

    if (!states || !states.alertInstances) {
      return {};
    }

    return Object.keys(states.alertInstances).reduce((accum, instanceId) => {
      if (!states.alertInstances) {
        return accum;
      }

      const alertInstance = states.alertInstances[instanceId];
      const filteredAlertInstance = this.filterAlertInstance(alertInstance, filters);

      if (filteredAlertInstance) {
        accum[instanceId] = filteredAlertInstance;

        if (filteredAlertInstance.state) {
          accum[instanceId].state = {
            alertStates: filteredAlertInstance.state.alertStates
          };
        }
      }

      return accum;
    }, {});
  }

  filterAlertInstance(alertInstance, filters, filterOnNodes = false) {
    var _alertInstance$state;

    if (!filterOnNodes) {
      return alertInstance;
    }

    const alertInstanceStates = (_alertInstance$state = alertInstance.state) === null || _alertInstance$state === void 0 ? void 0 : _alertInstance$state.alertStates;
    const nodeFilter = filters === null || filters === void 0 ? void 0 : filters.find(filter => filter.nodeUuid);

    if (!filters || !filters.length || !(alertInstanceStates !== null && alertInstanceStates !== void 0 && alertInstanceStates.length) || !(nodeFilter !== null && nodeFilter !== void 0 && nodeFilter.nodeUuid)) {
      return alertInstance;
    }

    const alertStates = alertInstanceStates.filter(({
      nodeId
    }) => nodeId === nodeFilter.nodeUuid);
    return {
      state: {
        alertStates
      }
    };
  }

  async execute({
    services,
    params,
    state
  }) {
    this.scopedLogger.debug(`Executing alert with params: ${JSON.stringify(params)} and state: ${JSON.stringify(state)}`);
    const esClient = services.scopedClusterClient.asCurrentUser;
    const clusters = await this.fetchClusters(esClient, params);
    const data = await this.fetchData(params, esClient, clusters);
    return await this.processData(data, clusters, services, state);
  }

  async fetchClusters(esClient, params) {
    if (!params.limit) {
      return await (0, _fetch_clusters.fetchClusters)(esClient);
    }

    const limit = (0, _common.parseDuration)(params.limit);
    const rangeFilter = this.ruleOptions.fetchClustersRange ? {
      timestamp: {
        format: 'epoch_millis',
        gte: String(+new Date() - limit - this.ruleOptions.fetchClustersRange)
      }
    } : undefined;
    return await (0, _fetch_clusters.fetchClusters)(esClient, rangeFilter);
  }

  async fetchData(params, esClient, clusters) {
    throw new Error('Child classes must implement `fetchData`');
  }

  async processData(data, clusters, services, state) {
    const currentUTC = +new Date(); // for each cluster filter the nodes that belong to this cluster

    for (const cluster of clusters) {
      const nodes = data.filter(node => node.clusterUuid === cluster.clusterUuid);

      if (!nodes.length) {
        continue;
      }

      const key = this.ruleOptions.accessorKey; // for each node, update the alert's state with node state

      for (const node of nodes) {
        const newAlertStates = []; // quick fix for now so that non node level alerts will use the cluster id

        const instance = services.alertInstanceFactory(node.meta.nodeId || node.meta.instanceId || cluster.clusterUuid);

        if (node.shouldFire) {
          const {
            meta
          } = node; // create a default alert state for this node and add data from node.meta and other data

          const nodeState = this.getDefaultAlertState(cluster, node);

          if (key) {
            nodeState[key] = meta[key];
          }

          nodeState.nodeId = meta.nodeId || node.nodeId || meta.instanceId; // TODO: make these functions more generic, so it's node/item agnostic

          nodeState.nodeName = meta.itemLabel || meta.nodeName || node.nodeName || nodeState.nodeId;
          nodeState.itemLabel = meta.itemLabel;
          nodeState.meta = meta;
          nodeState.ui.triggeredMS = currentUTC;
          nodeState.ui.isFiring = true;
          nodeState.ui.severity = node.severity;
          nodeState.ui.message = this.getUiMessage(nodeState, node); // store the state of each node in array.

          newAlertStates.push(nodeState);
        }

        const alertInstanceState = {
          alertStates: newAlertStates
        }; // update the alert's state with the new node states

        instance.replaceState(alertInstanceState);

        if (newAlertStates.length) {
          this.executeActions(instance, alertInstanceState, null, cluster);
          state.lastExecutedAction = currentUTC;
        }
      }
    }

    state.lastChecked = currentUTC;
    return state;
  }

  getDefaultAlertState(cluster, item) {
    return {
      cluster,
      ccs: item.ccs,
      ui: {
        isFiring: false,
        message: null,
        severity: _enums.AlertSeverity.Success,
        triggeredMS: 0,
        lastCheckedMS: 0
      }
    };
  }

  getUiMessage(alertState, item) {
    throw new Error('Child classes must implement `getUiMessage`');
  }

  executeActions(instance, instanceState, item, cluster) {
    throw new Error('Child classes must implement `executeActions`');
  }

  createGlobalStateLink(link, clusterUuid, ccs) {
    const globalState = [`cluster_uuid:${clusterUuid}`];

    if (ccs) {
      globalState.push(`ccs:${ccs}`);
    }

    return `${_static_globals.Globals.app.url}/app/monitoring#/${link}?_g=(${globalState.toString()})`;
  }

}

exports.BaseRule = BaseRule;