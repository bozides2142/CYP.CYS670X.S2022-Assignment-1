"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelsProvider = modelsProvider;

var _lodash = require("lodash");

var _memory_overview_service = require("../memory_overview/memory_overview_service");

var _guards = require("../../../common/types/guards");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NODE_FIELDS = ['attributes', 'name', 'roles', 'version'];

function modelsProvider(client, mlClient, memoryOverviewService) {
  return {
    /**
     * Retrieves the map of model ids and aliases with associated pipelines.
     * @param modelIds - Array of models ids and model aliases.
     */
    async getModelsPipelines(modelIds) {
      const modelIdsMap = new Map(modelIds.map(id => [id, null]));

      try {
        const {
          body
        } = await client.asCurrentUser.ingest.getPipeline();

        for (const [pipelineName, pipelineDefinition] of Object.entries(body)) {
          const {
            processors
          } = pipelineDefinition;

          for (const processor of processors) {
            var _processor$inference;

            const id = (_processor$inference = processor.inference) === null || _processor$inference === void 0 ? void 0 : _processor$inference.model_id;

            if (modelIdsMap.has(id)) {
              const obj = modelIdsMap.get(id);

              if (obj === null) {
                modelIdsMap.set(id, {
                  [pipelineName]: pipelineDefinition
                });
              } else {
                obj[pipelineName] = pipelineDefinition;
              }
            }
          }
        }
      } catch (error) {
        if (error.statusCode === 404) {
          // ES returns 404 when there are no pipelines
          // Instead, we should return the modelIdsMap and a 200
          return modelIdsMap;
        }

        throw error;
      }

      return modelIdsMap;
    },

    /**
     * Provides the ML nodes overview with allocated models.
     */
    async getNodesOverview() {
      if (!memoryOverviewService) {
        throw new Error('Memory overview service is not provided');
      }

      const {
        body: {
          trained_model_stats: trainedModelStats
        }
      } = await mlClient.getTrainedModelsStats({
        model_id: '_all',
        size: 10000
      });
      const {
        body: {
          nodes: clusterNodes
        }
      } = await client.asInternalUser.nodes.stats();
      const mlNodes = Object.entries(clusterNodes).filter(([, node]) => {
        var _node$roles;

        return (_node$roles = node.roles) === null || _node$roles === void 0 ? void 0 : _node$roles.includes('ml');
      });
      const adMemoryReport = await memoryOverviewService.getAnomalyDetectionMemoryOverview();
      const dfaMemoryReport = await memoryOverviewService.getDFAMemoryOverview();
      const nodeDeploymentStatsResponses = mlNodes.map(([nodeId, node]) => {
        var _node$os$mem$adjusted, _node$os, _node$os2;

        const nodeFields = (0, _lodash.pick)(node, NODE_FIELDS);
        nodeFields.attributes = (0, _common.isPopulatedObject)(nodeFields.attributes) ? Object.fromEntries(Object.entries(nodeFields.attributes).filter(([id]) => id.startsWith('ml'))) : nodeFields.attributes;
        const allocatedModels = trainedModelStats.filter(d => (0, _guards.isDefined)(d.deployment_stats) && (0, _guards.isDefined)(d.deployment_stats.nodes) && d.deployment_stats.nodes.some(n => Object.keys(n.node)[0] === nodeId)).map(d => {
          const modelSizeState = d.model_size_stats;
          const deploymentStats = d.deployment_stats;

          if (!deploymentStats || !modelSizeState) {
            throw new Error('deploymentStats or modelSizeState not defined');
          }

          const {
            nodes,
            ...rest
          } = deploymentStats;
          const {
            node: tempNode,
            ...nodeRest
          } = nodes.find(v => Object.keys(v.node)[0] === nodeId);
          return {
            model_id: d.model_id,
            ...rest,
            ...modelSizeState,
            node: nodeRest
          };
        });
        const modelsMemoryUsage = allocatedModels.map(v => {
          return {
            model_id: v.model_id,
            model_size: v.required_native_memory_bytes
          };
        });
        const memoryRes = {
          adTotalMemory: (0, _lodash.sumBy)(adMemoryReport.filter(ad => ad.node_id === nodeId), 'model_size'),
          dfaTotalMemory: (0, _lodash.sumBy)(dfaMemoryReport.filter(dfa => dfa.node_id === nodeId), 'model_size'),
          trainedModelsTotalMemory: (0, _lodash.sumBy)(modelsMemoryUsage, 'model_size')
        };

        for (const key of Object.keys(memoryRes)) {
          if (memoryRes[key] > 0) {
            /**
             * The amount of memory needed to load the ML native code shared libraries. The assumption is that the first
             * ML job to run on a given node will do this, and then subsequent ML jobs on the same node will reuse the
             * same already-loaded code.
             */
            memoryRes[key] += _memory_overview_service.NATIVE_EXECUTABLE_CODE_OVERHEAD;
            break;
          }
        }

        return {
          id: nodeId,
          ...nodeFields,
          allocated_models: allocatedModels,
          memory_overview: {
            machine_memory: {
              // TODO remove ts-ignore when elasticsearch client is updated
              // @ts-ignore
              total: Number((_node$os$mem$adjusted = (_node$os = node.os) === null || _node$os === void 0 ? void 0 : _node$os.mem.adjusted_total_in_bytes) !== null && _node$os$mem$adjusted !== void 0 ? _node$os$mem$adjusted : (_node$os2 = node.os) === null || _node$os2 === void 0 ? void 0 : _node$os2.mem.total_in_bytes),
              jvm: Number(node.attributes['ml.max_jvm_size'])
            },
            anomaly_detection: {
              total: memoryRes.adTotalMemory
            },
            dfa_training: {
              total: memoryRes.dfaTotalMemory
            },
            trained_models: {
              total: memoryRes.trainedModelsTotalMemory,
              by_model: modelsMemoryUsage
            }
          }
        };
      });
      return {
        count: nodeDeploymentStatsResponses.length,
        nodes: nodeDeploymentStatsResponses
      };
    }

  };
}