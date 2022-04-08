"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputIdToUuid = outputIdToUuid;
exports.outputService = void 0;

var _v = _interopRequireDefault(require("uuid/v5"));

var _constants = require("../constants");

var _common = require("../../common");

var _errors = require("../errors");

var _app_context = require("./app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SAVED_OBJECT_TYPE = _constants.OUTPUT_SAVED_OBJECT_TYPE;
const DEFAULT_ES_HOSTS = ['http://localhost:9200']; // differentiate

function isUUID(val) {
  return typeof val === 'string' && val.match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);
}

function outputIdToUuid(id) {
  if (isUUID(id)) {
    return id;
  } // UUID v5 need a namespace (uuid.DNS), changing this params will result in loosing the ability to generate predicable uuid


  return (0, _v.default)(id, _v.default.DNS);
}

function outputSavedObjectToOutput(so) {
  const {
    output_id: outputId,
    ...atributes
  } = so.attributes;
  return {
    id: outputId !== null && outputId !== void 0 ? outputId : so.id,
    ...atributes
  };
}

class OutputService {
  async _getDefaultDataOutputsSO(soClient) {
    return await soClient.find({
      type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
      searchFields: ['is_default'],
      search: 'true'
    });
  }

  async _getDefaultMonitoringOutputsSO(soClient) {
    return await soClient.find({
      type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
      searchFields: ['is_default_monitoring'],
      search: 'true'
    });
  }

  async ensureDefaultOutput(soClient) {
    const outputs = await this.list(soClient);
    const defaultOutput = outputs.items.find(o => o.is_default);
    const defaultMonitoringOutput = outputs.items.find(o => o.is_default_monitoring);

    if (!defaultOutput) {
      const newDefaultOutput = { ..._constants.DEFAULT_OUTPUT,
        hosts: this.getDefaultESHosts(),
        ca_sha256: _app_context.appContextService.getConfig().agents.elasticsearch.ca_sha256,
        is_default_monitoring: !defaultMonitoringOutput
      };
      return await this.create(soClient, newDefaultOutput, {
        id: _constants.DEFAULT_OUTPUT_ID,
        overwrite: true
      });
    }

    return defaultOutput;
  }

  getDefaultESHosts() {
    var _decodeCloudId, _agents, _agents$elasticsearch, _agents$elasticsearch2;

    const cloud = _app_context.appContextService.getCloud();

    const cloudId = (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) && cloud.cloudId;
    const cloudUrl = cloudId && ((_decodeCloudId = (0, _common.decodeCloudId)(cloudId)) === null || _decodeCloudId === void 0 ? void 0 : _decodeCloudId.elasticsearchUrl);
    const cloudHosts = cloudUrl ? [cloudUrl] : undefined;
    const flagHosts = (_agents = _app_context.appContextService.getConfig().agents) !== null && _agents !== void 0 && (_agents$elasticsearch = _agents.elasticsearch) !== null && _agents$elasticsearch !== void 0 && _agents$elasticsearch.hosts && (_agents$elasticsearch2 = _app_context.appContextService.getConfig().agents.elasticsearch.hosts) !== null && _agents$elasticsearch2 !== void 0 && _agents$elasticsearch2.length ? _app_context.appContextService.getConfig().agents.elasticsearch.hosts : undefined;
    return cloudHosts || flagHosts || DEFAULT_ES_HOSTS;
  }

  async getDefaultDataOutputId(soClient) {
    const outputs = await this._getDefaultDataOutputsSO(soClient);

    if (!outputs.saved_objects.length) {
      return null;
    }

    return outputSavedObjectToOutput(outputs.saved_objects[0]).id;
  }

  async getDefaultMonitoringOutputId(soClient) {
    const outputs = await this._getDefaultMonitoringOutputsSO(soClient);

    if (!outputs.saved_objects.length) {
      return null;
    }

    return outputSavedObjectToOutput(outputs.saved_objects[0]).id;
  }

  async create(soClient, output, options) {
    var _options$id;

    const data = { ...output
    }; // ensure only default output exists

    if (data.is_default) {
      const defaultDataOuputId = await this.getDefaultDataOutputId(soClient);

      if (defaultDataOuputId) {
        var _options$fromPreconfi;

        await this.update(soClient, defaultDataOuputId, {
          is_default: false
        }, {
          fromPreconfiguration: (_options$fromPreconfi = options === null || options === void 0 ? void 0 : options.fromPreconfiguration) !== null && _options$fromPreconfi !== void 0 ? _options$fromPreconfi : false
        });
      }
    }

    if (data.is_default_monitoring) {
      const defaultMonitoringOutputId = await this.getDefaultMonitoringOutputId(soClient);

      if (defaultMonitoringOutputId) {
        var _options$fromPreconfi2;

        await this.update(soClient, defaultMonitoringOutputId, {
          is_default_monitoring: false
        }, {
          fromPreconfiguration: (_options$fromPreconfi2 = options === null || options === void 0 ? void 0 : options.fromPreconfiguration) !== null && _options$fromPreconfi2 !== void 0 ? _options$fromPreconfi2 : false
        });
      }
    }

    if (data.hosts) {
      data.hosts = data.hosts.map(_common.normalizeHostsForAgents);
    }

    if (options !== null && options !== void 0 && options.id) {
      data.output_id = options === null || options === void 0 ? void 0 : options.id;
    }

    const newSo = await soClient.create(SAVED_OBJECT_TYPE, data, {
      overwrite: (options === null || options === void 0 ? void 0 : options.overwrite) || (options === null || options === void 0 ? void 0 : options.fromPreconfiguration),
      id: options !== null && options !== void 0 && options.id ? outputIdToUuid(options.id) : undefined
    });
    return {
      id: (_options$id = options === null || options === void 0 ? void 0 : options.id) !== null && _options$id !== void 0 ? _options$id : newSo.id,
      ...newSo.attributes
    };
  }

  async bulkGet(soClient, ids, {
    ignoreNotFound = false
  } = {
    ignoreNotFound: true
  }) {
    const res = await soClient.bulkGet(ids.map(id => ({
      id: outputIdToUuid(id),
      type: SAVED_OBJECT_TYPE
    })));
    return res.saved_objects.map(so => {
      if (so.error) {
        if (!ignoreNotFound || so.error.statusCode !== 404) {
          throw so.error;
        }

        return undefined;
      }

      return outputSavedObjectToOutput(so);
    }).filter(output => typeof output !== 'undefined');
  }

  async list(soClient) {
    const outputs = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      page: 1,
      perPage: _common.SO_SEARCH_LIMIT,
      sortField: 'is_default',
      sortOrder: 'desc'
    });
    return {
      items: outputs.saved_objects.map(outputSavedObjectToOutput),
      total: outputs.total,
      page: outputs.page,
      perPage: outputs.per_page
    };
  }

  async get(soClient, id) {
    const outputSO = await soClient.get(SAVED_OBJECT_TYPE, outputIdToUuid(id));

    if (outputSO.error) {
      throw new Error(outputSO.error.message);
    }

    return outputSavedObjectToOutput(outputSO);
  }

  async delete(soClient, id, {
    fromPreconfiguration = false
  } = {
    fromPreconfiguration: false
  }) {
    const originalOutput = await this.get(soClient, id);

    if (originalOutput.is_preconfigured && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Preconfigured output ${id} cannot be deleted outside of kibana config file.`);
    }

    if (originalOutput.is_default && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Default output ${id} cannot be deleted.`);
    }

    if (originalOutput.is_default_monitoring && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Default monitoring output ${id} cannot be deleted.`);
    }

    return soClient.delete(SAVED_OBJECT_TYPE, outputIdToUuid(id));
  }

  async update(soClient, id, data, {
    fromPreconfiguration = false
  } = {
    fromPreconfiguration: false
  }) {
    const originalOutput = await this.get(soClient, id);

    if (originalOutput.is_preconfigured && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Preconfigured output ${id} cannot be updated outside of kibana config file.`);
    }

    const updateData = { ...data
    }; // ensure only default output exists

    if (data.is_default) {
      const defaultDataOuputId = await this.getDefaultDataOutputId(soClient);

      if (defaultDataOuputId && defaultDataOuputId !== id) {
        await this.update(soClient, defaultDataOuputId, {
          is_default: false
        }, {
          fromPreconfiguration
        });
      }
    }

    if (data.is_default_monitoring) {
      const defaultMonitoringOutputId = await this.getDefaultMonitoringOutputId(soClient);

      if (defaultMonitoringOutputId && defaultMonitoringOutputId !== id) {
        await this.update(soClient, defaultMonitoringOutputId, {
          is_default_monitoring: false
        }, {
          fromPreconfiguration
        });
      }
    }

    if (updateData.hosts) {
      updateData.hosts = updateData.hosts.map(_common.normalizeHostsForAgents);
    }

    const outputSO = await soClient.update(SAVED_OBJECT_TYPE, outputIdToUuid(id), updateData);

    if (outputSO.error) {
      throw new Error(outputSO.error.message);
    }
  }

}

const outputService = new OutputService();
exports.outputService = outputService;