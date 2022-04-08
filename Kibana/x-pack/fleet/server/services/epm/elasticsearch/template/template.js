"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateESIndexPatterns = generateESIndexPatterns;
exports.generateMappings = generateMappings;
exports.generateTemplateIndexPattern = generateTemplateIndexPattern;
exports.generateTemplateName = generateTemplateName;
exports.getTemplate = getTemplate;
exports.getTemplatePriority = getTemplatePriority;
exports.updateCurrentWriteIndices = void 0;

var _ = require("../../../");

var _index = require("../index");

var _constants = require("../../../../constants");

var _meta2 = require("../meta");

var _retry = require("../retry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_SCALING_FACTOR = 1000;
const DEFAULT_IGNORE_ABOVE = 1024; // see discussion in https://github.com/elastic/kibana/issues/88307

const DEFAULT_TEMPLATE_PRIORITY = 200;
const DATASET_IS_PREFIX_TEMPLATE_PRIORITY = 150;
const META_PROP_KEYS = ['metric_type', 'unit'];
/**
 * getTemplate retrieves the default template but overwrites the index pattern with the given value.
 *
 * @param indexPattern String with the index pattern
 */

function getTemplate({
  type,
  templateIndexPattern,
  fields,
  mappings,
  pipelineName,
  packageName,
  composedOfTemplates,
  templatePriority,
  hidden
}) {
  var _appContextService$ge;

  const template = getBaseTemplate(type, templateIndexPattern, fields, mappings, packageName, composedOfTemplates, templatePriority, hidden);

  if (pipelineName) {
    template.template.settings.index.default_pipeline = pipelineName;
  }

  if (template.template.settings.index.final_pipeline) {
    throw new Error(`Error template for ${templateIndexPattern} contains a final_pipeline`);
  }

  if ((_appContextService$ge = _.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 && _appContextService$ge.agentIdVerificationEnabled) {
    // Add fleet global assets
    template.composed_of = [...(template.composed_of || []), _constants.FLEET_GLOBAL_COMPONENT_TEMPLATE_NAME];
  }

  return template;
}
/**
 * Generate mapping takes the given nested fields array and creates the Elasticsearch
 * mapping properties out of it.
 *
 * This assumes that all fields with dotted.names have been expanded in a previous step.
 *
 * @param fields
 */


function generateMappings(fields) {
  const props = {}; // TODO: this can happen when the fields property in fields.yml is present but empty
  // Maybe validation should be moved to fields/field.ts

  if (fields) {
    fields.forEach(field => {
      // If type is not defined, assume keyword
      const type = field.type || 'keyword';
      let fieldProps = getDefaultProperties(field);

      switch (type) {
        case 'group':
          fieldProps = { ...generateMappings(field.fields),
            ...generateDynamicAndEnabled(field)
          };
          break;

        case 'group-nested':
          fieldProps = { ...generateMappings(field.fields),
            ...generateNestedProps(field),
            type: 'nested'
          };
          break;

        case 'integer':
          fieldProps.type = 'long';
          break;

        case 'scaled_float':
          fieldProps.type = 'scaled_float';
          fieldProps.scaling_factor = field.scaling_factor || DEFAULT_SCALING_FACTOR;
          break;

        case 'text':
          const textMapping = generateTextMapping(field);
          fieldProps = { ...fieldProps,
            ...textMapping,
            type: 'text'
          };

          if (field.multi_fields) {
            fieldProps.fields = generateMultiFields(field.multi_fields);
          }

          break;

        case 'keyword':
          const keywordMapping = generateKeywordMapping(field);
          fieldProps = { ...fieldProps,
            ...keywordMapping,
            type: 'keyword'
          };

          if (field.multi_fields) {
            fieldProps.fields = generateMultiFields(field.multi_fields);
          }

          break;

        case 'wildcard':
          const wildcardMapping = generateWildcardMapping(field);
          fieldProps = { ...fieldProps,
            ...wildcardMapping,
            type: 'wildcard'
          };

          if (field.multi_fields) {
            fieldProps.fields = generateMultiFields(field.multi_fields);
          }

          break;

        case 'constant_keyword':
          fieldProps.type = field.type;

          if (field.value) {
            fieldProps.value = field.value;
          }

          break;

        case 'object':
          fieldProps = { ...fieldProps,
            ...generateDynamicAndEnabled(field),
            type: 'object'
          };
          break;

        case 'nested':
          fieldProps = { ...fieldProps,
            ...generateNestedProps(field),
            type: 'nested'
          };
          break;

        case 'array':
          // this assumes array fields were validated in an earlier step
          // adding an array field with no object_type would result in an error
          // when the template is added to ES
          if (field.object_type) {
            fieldProps.type = field.object_type;
          }

          break;

        case 'alias':
          // this assumes alias fields were validated in an earlier step
          // adding a path to a field that doesn't exist would result in an error
          // when the template is added to ES.
          fieldProps.type = 'alias';
          fieldProps.path = field.path;
          break;

        default:
          fieldProps.type = type;
      }

      const fieldHasMetaProps = META_PROP_KEYS.some(key => key in field);

      if (fieldHasMetaProps) {
        switch (type) {
          case 'group':
          case 'group-nested':
            break;

          default:
            {
              const meta = {};
              if ('metric_type' in field) Reflect.set(meta, 'metric_type', field.metric_type);
              if ('unit' in field) Reflect.set(meta, 'unit', field.unit);
              fieldProps.meta = meta;
            }
        }
      }

      props[field.name] = fieldProps;
    });
  }

  return {
    properties: props
  };
}

function generateDynamicAndEnabled(field) {
  const props = {};

  if (field.hasOwnProperty('enabled')) {
    props.enabled = field.enabled;
  }

  if (field.hasOwnProperty('dynamic')) {
    props.dynamic = field.dynamic;
  }

  return props;
}

function generateNestedProps(field) {
  const props = generateDynamicAndEnabled(field);

  if (field.hasOwnProperty('include_in_parent')) {
    props.include_in_parent = field.include_in_parent;
  }

  if (field.hasOwnProperty('include_in_root')) {
    props.include_in_root = field.include_in_root;
  }

  return props;
}

function generateMultiFields(fields) {
  const multiFields = {};

  if (fields) {
    fields.forEach(f => {
      const type = f.type;

      switch (type) {
        case 'text':
          multiFields[f.name] = { ...generateTextMapping(f),
            type: f.type
          };
          break;

        case 'keyword':
          multiFields[f.name] = { ...generateKeywordMapping(f),
            type: f.type
          };
          break;

        case 'long':
          multiFields[f.name] = {
            type: f.type
          };
          break;

        case 'double':
          multiFields[f.name] = {
            type: f.type
          };
          break;
      }
    });
  }

  return multiFields;
}

function generateKeywordMapping(field) {
  const mapping = {
    ignore_above: DEFAULT_IGNORE_ABOVE
  };

  if (field.ignore_above) {
    mapping.ignore_above = field.ignore_above;
  }

  if (field.normalizer) {
    mapping.normalizer = field.normalizer;
  }

  return mapping;
}

function generateTextMapping(field) {
  const mapping = {};

  if (field.analyzer) {
    mapping.analyzer = field.analyzer;
  }

  if (field.search_analyzer) {
    mapping.search_analyzer = field.search_analyzer;
  }

  return mapping;
}

function generateWildcardMapping(field) {
  const mapping = {
    ignore_above: DEFAULT_IGNORE_ABOVE
  };

  if (field.null_value) {
    mapping.null_value = field.null_value;
  }

  if (field.ignore_above) {
    mapping.ignore_above = field.ignore_above;
  }

  return mapping;
}

function getDefaultProperties(field) {
  const properties = {};

  if (field.index !== undefined) {
    properties.index = field.index;
  }

  if (field.doc_values) {
    properties.doc_values = field.doc_values;
  }

  if (field.copy_to) {
    properties.copy_to = field.copy_to;
  }

  return properties;
}
/**
 * Generates the template name out of the given information
 */


function generateTemplateName(dataStream) {
  return (0, _index.getRegistryDataStreamAssetBaseName)(dataStream);
}

function generateTemplateIndexPattern(dataStream) {
  // undefined or explicitly set to false
  // See also https://github.com/elastic/package-spec/pull/102
  if (!dataStream.dataset_is_prefix) {
    return (0, _index.getRegistryDataStreamAssetBaseName)(dataStream) + '-*';
  } else {
    return (0, _index.getRegistryDataStreamAssetBaseName)(dataStream) + '.*-*';
  }
} // Template priorities are discussed in https://github.com/elastic/kibana/issues/88307
// See also https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html
//
// Built-in templates like logs-*-* and metrics-*-* have priority 100
//
// EPM generated templates for data streams have priority 200 (DEFAULT_TEMPLATE_PRIORITY)
//
// EPM generated templates for data streams with dataset_is_prefix: true have priority 150 (DATASET_IS_PREFIX_TEMPLATE_PRIORITY)


function getTemplatePriority(dataStream) {
  // undefined or explicitly set to false
  // See also https://github.com/elastic/package-spec/pull/102
  if (!dataStream.dataset_is_prefix) {
    return DEFAULT_TEMPLATE_PRIORITY;
  } else {
    return DATASET_IS_PREFIX_TEMPLATE_PRIORITY;
  }
}
/**
 * Returns a map of the data stream path fields to elasticsearch index pattern.
 * @param dataStreams an array of RegistryDataStream objects
 */


function generateESIndexPatterns(dataStreams) {
  if (!dataStreams) {
    return {};
  }

  const patterns = {};

  for (const dataStream of dataStreams) {
    patterns[dataStream.path] = generateTemplateIndexPattern(dataStream);
  }

  return patterns;
}

const flattenFieldsToNameAndType = (fields, path = '') => {
  let newFields = [];
  fields.forEach(field => {
    const fieldName = path ? `${path}.${field.name}` : field.name;
    newFields.push({
      name: fieldName,
      type: field.type
    });

    if (field.fields && field.fields.length) {
      newFields = newFields.concat(flattenFieldsToNameAndType(field.fields, fieldName));
    }
  });
  return newFields;
};

function getBaseTemplate(type, templateIndexPattern, fields, mappings, packageName, composedOfTemplates, templatePriority, hidden) {
  // Meta information to identify Ingest Manager's managed templates and indices
  const _meta = (0, _meta2.getESAssetMetadata)({
    packageName
  });

  return {
    priority: templatePriority,
    // To be completed with the correct index patterns
    index_patterns: [templateIndexPattern],
    template: {
      settings: {
        index: {}
      },
      mappings: {
        // All the dynamic field mappings
        dynamic_templates: [// This makes sure all mappings are keywords by default
        {
          strings_as_keyword: {
            mapping: {
              ignore_above: 1024,
              type: 'keyword'
            },
            match_mapping_type: 'string'
          }
        }],
        // As we define fields ahead, we don't need any automatic field detection
        // This makes sure all the fields are mapped to keyword by default to prevent mapping conflicts
        date_detection: false,
        // All the properties we know from the fields.yml file
        properties: mappings.properties,
        _meta
      }
    },
    data_stream: {
      hidden
    },
    composed_of: composedOfTemplates,
    _meta
  };
}

const updateCurrentWriteIndices = async (esClient, logger, templates) => {
  if (!templates.length) return;
  const allIndices = await queryDataStreamsFromTemplates(esClient, templates);
  const allUpdatablesIndices = allIndices.filter(indice => {
    if (indice.replicated) {
      logger.warn(`Datastream ${indice.dataStreamName} cannot be updated because this is a replicated datastream.`);
      return false;
    }

    return true;
  });
  if (!allUpdatablesIndices.length) return;
  return updateAllDataStreams(allUpdatablesIndices, esClient, logger);
};

exports.updateCurrentWriteIndices = updateCurrentWriteIndices;

function isCurrentDataStream(item) {
  return item !== undefined;
}

const queryDataStreamsFromTemplates = async (esClient, templates) => {
  const dataStreamPromises = templates.map(template => {
    return getDataStreams(esClient, template);
  });
  const dataStreamObjects = await Promise.all(dataStreamPromises);
  return dataStreamObjects.filter(isCurrentDataStream).flat();
};

const getDataStreams = async (esClient, template) => {
  const {
    indexTemplate
  } = template;
  const {
    body
  } = await esClient.indices.getDataStream({
    name: indexTemplate.index_patterns.join(',')
  });
  const dataStreams = body.data_streams;
  if (!dataStreams.length) return;
  return dataStreams.map(dataStream => ({
    dataStreamName: dataStream.name,
    replicated: dataStream.replicated,
    indexTemplate
  }));
};

const updateAllDataStreams = async (indexNameWithTemplates, esClient, logger) => {
  const updatedataStreamPromises = indexNameWithTemplates.map(({
    dataStreamName,
    indexTemplate
  }) => {
    return updateExistingDataStream({
      dataStreamName,
      esClient,
      logger,
      indexTemplate
    });
  });
  await Promise.all(updatedataStreamPromises);
};

const updateExistingDataStream = async ({
  dataStreamName,
  esClient,
  logger,
  indexTemplate
}) => {
  const {
    settings,
    mappings
  } = indexTemplate.template; // for now, remove from object so as not to update stream or data stream properties of the index until type and name
  // are added in https://github.com/elastic/kibana/issues/66551.  namespace value we will continue
  // to skip updating and assume the value in the index mapping is correct

  delete mappings.properties.stream;
  delete mappings.properties.data_stream; // try to update the mappings first

  try {
    await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putMapping({
      index: dataStreamName,
      body: mappings,
      write_index_only: true
    }), {
      logger
    }); // if update fails, rollover data stream
  } catch (err) {
    try {
      // Do no wrap rollovers in retryTransientEsErrors since it is not idempotent
      const path = `/${dataStreamName}/_rollover`;
      await esClient.transport.request({
        method: 'POST',
        path
      });
    } catch (error) {
      throw new Error(`cannot rollover data stream ${error}`);
    }
  } // update settings after mappings was successful to ensure
  // pointing to the new pipeline is safe
  // for now, only update the pipeline


  if (!settings.index.default_pipeline) return;

  try {
    await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putSettings({
      index: dataStreamName,
      body: {
        default_pipeline: settings.index.default_pipeline
      }
    }), {
      logger
    });
  } catch (err) {
    throw new Error(`could not update index template settings for ${dataStreamName}`);
  }
};