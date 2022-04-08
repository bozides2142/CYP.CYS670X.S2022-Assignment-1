"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransactionErrorRateAlertType = registerTransactionErrorRateAlertType;

var _configSchema = require("@kbn/config-schema");

var _operators = require("rxjs/operators");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _server = require("../../../../rule_registry/server");

var _alert_types = require("../../../common/alert_types");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _processor_event = require("../../../common/processor_event");

var _formatters = require("../../../common/utils/formatters");

var _environment_query = require("../../../common/utils/environment_query");

var _get_apm_indices = require("../../routes/settings/apm_indices/get_apm_indices");

var _action_variables = require("./action_variables");

var _alerting_es_client = require("./alerting_es_client");

var _aggregated_transactions = require("../../../common/aggregated_transactions");

var _transactions = require("../../lib/helpers/transactions");

var _formatters2 = require("../../../../observability/common/utils/formatters");

var _server2 = require("../../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  transactionType: _configSchema.schema.maybe(_configSchema.schema.string()),
  serviceName: _configSchema.schema.maybe(_configSchema.schema.string()),
  environment: _configSchema.schema.string()
});

const alertTypeConfig = _alert_types.ALERT_TYPES_CONFIG[_alert_types.AlertType.TransactionErrorRate];

function registerTransactionErrorRateAlertType({
  alerting,
  ruleDataClient,
  logger,
  config$
}) {
  const createLifecycleRuleType = (0, _server.createLifecycleRuleTypeFactory)({
    ruleDataClient,
    logger
  });
  alerting.registerType(createLifecycleRuleType({
    id: _alert_types.AlertType.TransactionErrorRate,
    name: alertTypeConfig.name,
    actionGroups: alertTypeConfig.actionGroups,
    defaultActionGroupId: alertTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [_action_variables.apmActionVariables.transactionType, _action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.interval]
    },
    producer: _alert_types.APM_SERVER_FEATURE_ID,
    minimumLicenseRequired: 'basic',
    isExportable: true,
    executor: async ({
      services,
      params: ruleParams
    }) => {
      const config = await config$.pipe((0, _operators.take)(1)).toPromise();
      const indices = await (0, _get_apm_indices.getApmIndices)({
        config,
        savedObjectsClient: services.savedObjectsClient
      }); // only query transaction events when set to 'never',
      // to prevent (likely) unnecessary blocking request
      // in rule execution

      const searchAggregatedTransactions = config.searchAggregatedTransactions !== _aggregated_transactions.SearchAggregatedTransactionSetting.never;
      const index = searchAggregatedTransactions ? indices.metric : indices.transaction;
      const searchParams = {
        index,
        size: 0,
        body: {
          query: {
            bool: {
              filter: [{
                range: {
                  '@timestamp': {
                    gte: `now-${ruleParams.windowSize}${ruleParams.windowUnit}`
                  }
                }
              }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), {
                terms: {
                  [_elasticsearch_fieldnames.EVENT_OUTCOME]: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
                }
              }, ...(0, _server2.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, ruleParams.serviceName), ...(0, _server2.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, ruleParams.transactionType), ...(0, _environment_query.environmentQuery)(ruleParams.environment)]
            }
          },
          aggs: {
            series: {
              multi_terms: {
                terms: [{
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }, {
                  field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                  missing: _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value
                }, {
                  field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                }],
                size: 10000
              },
              aggs: {
                outcomes: {
                  terms: {
                    field: _elasticsearch_fieldnames.EVENT_OUTCOME
                  }
                }
              }
            }
          }
        }
      };
      const response = await (0, _alerting_es_client.alertingEsClient)({
        scopedClusterClient: services.scopedClusterClient,
        params: searchParams
      });

      if (!response.aggregations) {
        return {};
      }

      const results = [];

      for (const bucket of response.aggregations.series.buckets) {
        var _bucket$outcomes$buck, _bucket$outcomes$buck2, _bucket$outcomes$buck3, _bucket$outcomes$buck4;

        const [serviceName, environment, transactionType] = bucket.key;
        const failed = (_bucket$outcomes$buck = (_bucket$outcomes$buck2 = bucket.outcomes.buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.failure)) === null || _bucket$outcomes$buck2 === void 0 ? void 0 : _bucket$outcomes$buck2.doc_count) !== null && _bucket$outcomes$buck !== void 0 ? _bucket$outcomes$buck : 0;
        const succesful = (_bucket$outcomes$buck3 = (_bucket$outcomes$buck4 = bucket.outcomes.buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.success)) === null || _bucket$outcomes$buck4 === void 0 ? void 0 : _bucket$outcomes$buck4.doc_count) !== null && _bucket$outcomes$buck3 !== void 0 ? _bucket$outcomes$buck3 : 0;
        const errorRate = failed / (failed + succesful) * 100;

        if (errorRate >= ruleParams.threshold) {
          results.push({
            serviceName,
            environment,
            transactionType,
            errorRate
          });
        }
      }

      results.forEach(result => {
        const {
          serviceName,
          environment,
          transactionType,
          errorRate
        } = result;
        services.alertWithLifecycle({
          id: [_alert_types.AlertType.TransactionErrorRate, serviceName, transactionType, environment].filter(name => name).join('_'),
          fields: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName,
            ...(0, _environment_filter_values.getEnvironmentEsField)(environment),
            [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType,
            [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction,
            [_ruleDataUtils.ALERT_EVALUATION_VALUE]: errorRate,
            [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: ruleParams.threshold,
            [_ruleDataUtils.ALERT_REASON]: (0, _alert_types.formatTransactionErrorRateReason)({
              threshold: ruleParams.threshold,
              measured: errorRate,
              asPercent: _formatters2.asPercent,
              serviceName,
              windowSize: ruleParams.windowSize,
              windowUnit: ruleParams.windowUnit
            })
          }
        }).scheduleActions(alertTypeConfig.defaultActionGroupId, {
          serviceName,
          transactionType,
          environment: (0, _environment_filter_values.getEnvironmentLabel)(environment),
          threshold: ruleParams.threshold,
          triggerValue: (0, _formatters.asDecimalOrInteger)(errorRate),
          interval: `${ruleParams.windowSize}${ruleParams.windowUnit}`
        });
      });
      return {};
    }
  }));
}