"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMetadataDetails = getServiceMetadataDetails;

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");

var _transactions = require("../../lib/helpers/transactions");

var _get_service_metadata_icons = require("./get_service_metadata_icons");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceMetadataDetails({
  serviceName,
  setup,
  searchAggregatedTransactions,
  start,
  end
}) {
  var _response$aggregation, _service$framework, _response$aggregation2, _host$os, _response$aggregation3, _response$aggregation4, _cloud$service, _response$aggregation5, _response$aggregation6, _cloud$project, _cloud$service2, _response$aggregation7, _response$aggregation8, _response$aggregation9;

  const {
    apmEventClient
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, ...(0, _server.rangeQuery)(start, end)];
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
    },
    body: {
      size: 1,
      _source: [_elasticsearch_fieldnames.SERVICE, _elasticsearch_fieldnames.AGENT, _elasticsearch_fieldnames.HOST, _elasticsearch_fieldnames.CONTAINER_ID, _elasticsearch_fieldnames.KUBERNETES, _elasticsearch_fieldnames.CLOUD],
      query: {
        bool: {
          filter,
          should: _get_service_metadata_icons.should
        }
      },
      aggs: {
        serviceVersions: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_VERSION,
            size: 10,
            order: {
              _key: 'desc'
            }
          }
        },
        availabilityZones: {
          terms: {
            field: _elasticsearch_fieldnames.CLOUD_AVAILABILITY_ZONE,
            size: 10
          }
        },
        regions: {
          terms: {
            field: _elasticsearch_fieldnames.CLOUD_REGION,
            size: 10
          }
        },
        cloudServices: {
          terms: {
            field: _elasticsearch_fieldnames.CLOUD_SERVICE_NAME,
            size: 1
          }
        },
        machineTypes: {
          terms: {
            field: _elasticsearch_fieldnames.CLOUD_MACHINE_TYPE,
            size: 10
          }
        },
        faasTriggerTypes: {
          terms: {
            field: _elasticsearch_fieldnames.FAAS_TRIGGER_TYPE,
            size: 10
          }
        },
        faasFunctionNames: {
          terms: {
            field: _elasticsearch_fieldnames.FAAS_ID,
            size: 10
          }
        },
        totalNumberInstances: {
          cardinality: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_service_metadata_details', params);

  if (response.hits.total.value === 0) {
    return {
      service: undefined,
      container: undefined,
      cloud: undefined
    };
  }

  const {
    service,
    agent,
    host,
    kubernetes,
    container,
    cloud
  } = response.hits.hits[0]._source;
  const serviceMetadataDetails = {
    versions: (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.serviceVersions.buckets.map(bucket => bucket.key),
    runtime: service.runtime,
    framework: (_service$framework = service.framework) === null || _service$framework === void 0 ? void 0 : _service$framework.name,
    agent
  };
  const totalNumberInstances = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.totalNumberInstances.value;
  const containerDetails = host || container || totalNumberInstances || kubernetes ? {
    os: host === null || host === void 0 ? void 0 : (_host$os = host.os) === null || _host$os === void 0 ? void 0 : _host$os.platform,
    type: !!kubernetes ? 'Kubernetes' : 'Docker',
    isContainerized: !!(container !== null && container !== void 0 && container.id),
    totalNumberInstances
  } : undefined;
  const serverlessDetails = !!((_response$aggregation3 = response.aggregations) !== null && _response$aggregation3 !== void 0 && (_response$aggregation4 = _response$aggregation3.faasTriggerTypes) !== null && _response$aggregation4 !== void 0 && _response$aggregation4.buckets.length) && cloud ? {
    type: (_cloud$service = cloud.service) === null || _cloud$service === void 0 ? void 0 : _cloud$service.name,
    functionNames: (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.faasFunctionNames.buckets.map(bucket => getLambdaFunctionNameFromARN(bucket.key)).filter(name => name),
    faasTriggerTypes: (_response$aggregation6 = response.aggregations) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.faasTriggerTypes.buckets.map(bucket => bucket.key)
  } : undefined;
  const cloudDetails = cloud ? {
    provider: cloud.provider,
    projectName: (_cloud$project = cloud.project) === null || _cloud$project === void 0 ? void 0 : _cloud$project.name,
    serviceName: (_cloud$service2 = cloud.service) === null || _cloud$service2 === void 0 ? void 0 : _cloud$service2.name,
    availabilityZones: (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : _response$aggregation7.availabilityZones.buckets.map(bucket => bucket.key),
    regions: (_response$aggregation8 = response.aggregations) === null || _response$aggregation8 === void 0 ? void 0 : _response$aggregation8.regions.buckets.map(bucket => bucket.key),
    machineTypes: (_response$aggregation9 = response.aggregations) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.machineTypes.buckets.map(bucket => bucket.key)
  } : undefined;
  return {
    service: serviceMetadataDetails,
    container: containerDetails,
    serverless: serverlessDetails,
    cloud: cloudDetails
  };
}

function getLambdaFunctionNameFromARN(arn) {
  // Lambda function ARN example: arn:aws:lambda:us-west-2:123456789012:function:my-function
  return arn.split(':')[6] || '';
}