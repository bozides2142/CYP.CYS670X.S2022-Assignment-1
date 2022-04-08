"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExecutionTimeoutsPerDayCount = getExecutionTimeoutsPerDayCount;
exports.getExecutionsPerDayCount = getExecutionsPerDayCount;
exports.getFailedAndUnrecognizedTasksPerDay = getFailedAndUnrecognizedTasksPerDay;
exports.getTotalCountAggregations = getTotalCountAggregations;
exports.getTotalCountInUse = getTotalCountInUse;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ruleTypeMetric = {
  scripted_metric: {
    init_script: 'state.ruleTypes = [:]; state.namespaces = [:]',
    map_script: `
      String ruleType = doc['alert.alertTypeId'].value;
      String namespace = doc['namespaces'] !== null && doc['namespaces'].size() > 0 ? doc['namespaces'].value : 'default';
      state.ruleTypes.put(ruleType, state.ruleTypes.containsKey(ruleType) ? state.ruleTypes.get(ruleType) + 1 : 1);
      if (state.namespaces.containsKey(namespace) === false) {
        state.namespaces.put(namespace, 1);
      }
    `,
    // Combine script is executed per cluster, but we already have a key-value pair per cluster.
    // Despite docs that say this is optional, this script can't be blank.
    combine_script: 'return state',
    // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
    // This also needs to account for having no data
    reduce_script: `
      Map result = [:];
      for (Map m : states.toArray()) {
        if (m !== null) {
          for (String k : m.keySet()) {
            result.put(k, result.containsKey(k) ? result.get(k) + m.get(k) : m.get(k));
          }
        }
      }
      return result;
    `
  }
};
const ruleTypeExecutionsWithDurationMetric = {
  scripted_metric: {
    init_script: 'state.ruleTypes = [:]; state.ruleTypesDuration = [:];',
    map_script: `
      String ruleType = doc['rule.category'].value;
      long duration = doc['event.duration'].value / (1000 * 1000); 
      state.ruleTypes.put(ruleType, state.ruleTypes.containsKey(ruleType) ? state.ruleTypes.get(ruleType) + 1 : 1);
      state.ruleTypesDuration.put(ruleType, state.ruleTypesDuration.containsKey(ruleType) ? state.ruleTypesDuration.get(ruleType) + duration : duration);
    `,
    // Combine script is executed per cluster, but we already have a key-value pair per cluster.
    // Despite docs that say this is optional, this script can't be blank.
    combine_script: 'return state',
    // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
    // This also needs to account for having no data
    reduce_script: `
      Map result = [:];
      for (Map m : states.toArray()) {
        if (m !== null) {
          for (String k : m.keySet()) {
            result.put(k, result.containsKey(k) ? result.get(k) + m.get(k) : m.get(k));
          }
        }
      }
      return result;
    `
  }
};
const ruleTypeExecutionsMetric = {
  scripted_metric: {
    init_script: 'state.ruleTypes = [:]',
    map_script: `
      String ruleType = doc['rule.category'].value;
      state.ruleTypes.put(ruleType, state.ruleTypes.containsKey(ruleType) ? state.ruleTypes.get(ruleType) + 1 : 1);
    `,
    // Combine script is executed per cluster, but we already have a key-value pair per cluster.
    // Despite docs that say this is optional, this script can't be blank.
    combine_script: 'return state',
    // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
    // This also needs to account for having no data
    reduce_script: `
      Map result = [:];
      for (Map m : states.toArray()) {
        if (m !== null) {
          for (String k : m.keySet()) {
            result.put(k, result.containsKey(k) ? result.get(k) + m.get(k) : m.get(k));
          }
        }
      }
      return result;
    `
  }
};
const taskTypeExecutionsMetric = {
  scripted_metric: {
    init_script: 'state.statuses = [:]',
    map_script: `
      String status = doc['task.status'].value;
      String taskType = doc['task.taskType'].value.replace('alerting:', '');
      Map taskTypes = state.statuses.containsKey(status) ? state.statuses.get(status) : [:];
      taskTypes.put(taskType, taskTypes.containsKey(taskType) ? taskTypes.get(taskType) + 1 : 1);
      state.statuses.put(status, taskTypes);
    `,
    // Combine script is executed per cluster, but we already have a key-value pair per cluster.
    // Despite docs that say this is optional, this script can't be blank.
    combine_script: 'return state',
    // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
    // This also needs to account for having no data
    reduce_script: `
      Map result = [:];
      for (Map m : states.toArray()) {
        if (m !== null) {
          for (String k : m.keySet()) {
            result.put(k, result.containsKey(k) ? result.get(k) + m.get(k) : m.get(k));
          }
        }
      }
      return result;
    `
  }
};
const ruleTypeFailureExecutionsMetric = {
  scripted_metric: {
    init_script: 'state.reasons = [:]',
    map_script: `
      if (doc['event.outcome'].value == 'failure') { 
        String reason = doc['event.reason'].value; 
        String ruleType = doc['rule.category'].value; 
        Map ruleTypes = state.reasons.containsKey(reason) ? state.reasons.get(reason) : [:]; 
        ruleTypes.put(ruleType, ruleTypes.containsKey(ruleType) ? ruleTypes.get(ruleType) + 1 : 1); 
        state.reasons.put(reason, ruleTypes); 
      }
    `,
    // Combine script is executed per cluster, but we already have a key-value pair per cluster.
    // Despite docs that say this is optional, this script can't be blank.
    combine_script: 'return state',
    // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
    // This also needs to account for having no data
    reduce_script: `
      Map result = [:];
      for (Map m : states.toArray()) {
        if (m !== null) {
          for (String k : m.keySet()) {
            result.put(k, result.containsKey(k) ? result.get(k) + m.get(k) : m.get(k));
          }
        }
      }
      return result;
    `
  }
};

async function getTotalCountAggregations(esClient, kibanaIndex) {
  const {
    body: results
  } = await esClient.search({
    index: kibanaIndex,
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              type: 'alert'
            }
          }]
        }
      },
      runtime_mappings: {
        alert_action_count: {
          type: 'long',
          script: {
            source: `
              def alert = params._source['alert']; 
              if (alert != null) { 
                def actions = alert.actions; 
                if (actions != null) { 
                  emit(actions.length); 
                } else { 
                  emit(0); 
                }
              }`
          }
        },
        alert_interval: {
          type: 'long',
          script: {
            source: `
              int parsed = 0;
              if (doc['alert.schedule.interval'].size() > 0) {
                def interval = doc['alert.schedule.interval'].value;

                if (interval.length() > 1) {
                    // get last char
                    String timeChar = interval.substring(interval.length() - 1);
                    // remove last char
                    interval = interval.substring(0, interval.length() - 1);

                    if (interval.chars().allMatch(Character::isDigit)) {
                      // using of regex is not allowed in painless language
                      parsed = Integer.parseInt(interval);

                      if (timeChar.equals("s")) {
                        parsed = parsed;
                      } else if (timeChar.equals("m")) {
                        parsed = parsed * 60;
                      } else if (timeChar.equals("h")) {
                        parsed = parsed * 60 * 60;
                      } else if (timeChar.equals("d")) {
                        parsed = parsed * 24 * 60 * 60;
                      }
                      emit(parsed);
                    }
                }
              }
              emit(parsed);
            `
          }
        },
        alert_throttle: {
          type: 'long',
          script: {
            source: `
              int parsed = 0;
              if (doc['alert.throttle'].size() > 0) {
              def throttle = doc['alert.throttle'].value;

              if (throttle.length() > 1) {
                  // get last char
                  String timeChar = throttle.substring(throttle.length() - 1);
                  // remove last char
                  throttle = throttle.substring(0, throttle.length() - 1);

                  if (throttle.chars().allMatch(Character::isDigit)) {
                    // using of regex is not allowed in painless language
                    parsed = Integer.parseInt(throttle);

                    if (timeChar.equals("s")) {
                      parsed = parsed;
                    } else if (timeChar.equals("m")) {
                      parsed = parsed * 60;
                    } else if (timeChar.equals("h")) {
                      parsed = parsed * 60 * 60;
                    } else if (timeChar.equals("d")) {
                      parsed = parsed * 24 * 60 * 60;
                    }
                    emit(parsed);
                  }
              }
            }
            emit(parsed);
            `
          }
        }
      },
      aggs: {
        byRuleTypeId: ruleTypeMetric,
        max_throttle_time: {
          max: {
            field: 'alert_throttle'
          }
        },
        min_throttle_time: {
          min: {
            field: 'alert_throttle'
          }
        },
        avg_throttle_time: {
          avg: {
            field: 'alert_throttle'
          }
        },
        max_interval_time: {
          max: {
            field: 'alert_interval'
          }
        },
        min_interval_time: {
          min: {
            field: 'alert_interval'
          }
        },
        avg_interval_time: {
          avg: {
            field: 'alert_interval'
          }
        },
        max_actions_count: {
          max: {
            field: 'alert_action_count'
          }
        },
        min_actions_count: {
          min: {
            field: 'alert_action_count'
          }
        },
        avg_actions_count: {
          avg: {
            field: 'alert_action_count'
          }
        }
      }
    }
  });
  const aggregations = results.aggregations;
  const totalRulesCount = Object.keys(aggregations.byRuleTypeId.value.ruleTypes).reduce((total, key) => parseInt(aggregations.byRuleTypeId.value.ruleTypes[key], 10) + total, 0);
  return {
    count_total: totalRulesCount,
    count_by_type: replaceDotSymbolsInRuleTypeIds(aggregations.byRuleTypeId.value.ruleTypes),
    throttle_time: {
      min: `${aggregations.min_throttle_time.value}s`,
      avg: `${aggregations.avg_throttle_time.value}s`,
      max: `${aggregations.max_throttle_time.value}s`
    },
    schedule_time: {
      min: `${aggregations.min_interval_time.value}s`,
      avg: `${aggregations.avg_interval_time.value}s`,
      max: `${aggregations.max_interval_time.value}s`
    },
    throttle_time_number_s: {
      min: aggregations.min_throttle_time.value,
      avg: aggregations.avg_throttle_time.value,
      max: aggregations.max_throttle_time.value
    },
    schedule_time_number_s: {
      min: aggregations.min_interval_time.value,
      avg: aggregations.avg_interval_time.value,
      max: aggregations.max_interval_time.value
    },
    connectors_per_alert: {
      min: aggregations.min_actions_count.value,
      avg: aggregations.avg_actions_count.value,
      max: aggregations.max_actions_count.value
    },
    count_rules_namespaces: 0
  };
}

async function getTotalCountInUse(esClient, kibanaIndex) {
  const {
    body: searchResult
  } = await esClient.search({
    index: kibanaIndex,
    size: 0,
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              type: 'alert'
            }
          }, {
            term: {
              'alert.enabled': true
            }
          }]
        }
      },
      aggs: {
        byRuleTypeId: ruleTypeMetric
      }
    }
  });
  const aggregations = searchResult.aggregations;
  return {
    countTotal: Object.keys(aggregations.byRuleTypeId.value.ruleTypes).reduce((total, key) => parseInt(aggregations.byRuleTypeId.value.ruleTypes[key], 10) + total, 0),
    countByType: replaceDotSymbolsInRuleTypeIds(aggregations.byRuleTypeId.value.ruleTypes),
    countNamespaces: Object.keys(aggregations.byRuleTypeId.value.namespaces).length
  };
}

async function getExecutionsPerDayCount(esClient, eventLogIndex) {
  const {
    body: searchResult
  } = await esClient.search({
    index: eventLogIndex,
    size: 0,
    body: {
      query: {
        bool: {
          filter: {
            bool: {
              must: [{
                term: {
                  'event.action': 'execute'
                }
              }, {
                term: {
                  'event.provider': 'alerting'
                }
              }, {
                range: {
                  '@timestamp': {
                    gte: 'now-1d'
                  }
                }
              }]
            }
          }
        }
      },
      aggs: {
        byRuleTypeId: ruleTypeExecutionsWithDurationMetric,
        failuresByReason: ruleTypeFailureExecutionsMetric,
        avgDuration: {
          avg: {
            field: 'event.duration'
          }
        }
      }
    }
  });
  const executionsAggregations = searchResult.aggregations;
  const aggsAvgExecutionTime = Math.round( // @ts-expect-error aggegation type is not specified
  // convert nanoseconds to milliseconds
  searchResult.aggregations.avgDuration.value / (1000 * 1000));
  const executionFailuresAggregations = searchResult.aggregations;
  return {
    countTotal: Object.keys(executionsAggregations.byRuleTypeId.value.ruleTypes).reduce((total, key) => parseInt(executionsAggregations.byRuleTypeId.value.ruleTypes[key], 10) + total, 0),
    countByType: replaceDotSymbolsInRuleTypeIds(executionsAggregations.byRuleTypeId.value.ruleTypes),
    countTotalFailures: Object.keys(executionFailuresAggregations.failuresByReason.value.reasons).reduce((total, reason) => {
      const byRuleTypesRefs = executionFailuresAggregations.failuresByReason.value.reasons[reason];
      const countByRuleTypes = Object.keys(byRuleTypesRefs).reduce((totalByType, ruleType) => parseInt(byRuleTypesRefs[ruleType] + totalByType, 10), 0);
      return countByRuleTypes + total;
    }, 0),
    countFailuresByReason: Object.keys(executionFailuresAggregations.failuresByReason.value.reasons).reduce( // ES DSL aggregations are returned as `any` by esClient.search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj, reason) => {
      const byRuleTypesRefs = executionFailuresAggregations.failuresByReason.value.reasons[reason];
      const countByRuleTypes = Object.keys(byRuleTypesRefs).reduce((totalByType, ruleType) => parseInt(byRuleTypesRefs[ruleType] + totalByType, 10), 0);
      return { ...obj,
        [replaceDotSymbols(reason)]: countByRuleTypes
      };
    }, {}),
    countFailuresByReasonByType: Object.keys(executionFailuresAggregations.failuresByReason.value.reasons).reduce( // ES DSL aggregations are returned as `any` by esClient.search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj, key) => ({ ...obj,
      [key]: replaceDotSymbolsInRuleTypeIds(executionFailuresAggregations.failuresByReason.value.reasons[key])
    }), {}),
    avgExecutionTime: aggsAvgExecutionTime,
    avgExecutionTimeByType: Object.keys(executionsAggregations.byRuleTypeId.value.ruleTypes).reduce( // ES DSL aggregations are returned as `any` by esClient.search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj, key) => ({ ...obj,
      [replaceDotSymbols(key)]: Math.round(executionsAggregations.byRuleTypeId.value.ruleTypesDuration[key] / parseInt(executionsAggregations.byRuleTypeId.value.ruleTypes[key], 10))
    }), {})
  };
}

async function getExecutionTimeoutsPerDayCount(esClient, eventLogIndex) {
  const {
    body: searchResult
  } = await esClient.search({
    index: eventLogIndex,
    size: 0,
    body: {
      query: {
        bool: {
          filter: {
            bool: {
              must: [{
                term: {
                  'event.action': 'execute-timeout'
                }
              }, {
                term: {
                  'event.provider': 'alerting'
                }
              }, {
                range: {
                  '@timestamp': {
                    gte: 'now-1d'
                  }
                }
              }]
            }
          }
        }
      },
      aggs: {
        byRuleTypeId: ruleTypeExecutionsMetric
      }
    }
  });
  const executionsAggregations = searchResult.aggregations;
  return {
    countTotal: Object.keys(executionsAggregations.byRuleTypeId.value.ruleTypes).reduce((total, key) => parseInt(executionsAggregations.byRuleTypeId.value.ruleTypes[key], 10) + total, 0),
    countByType: replaceDotSymbolsInRuleTypeIds(executionsAggregations.byRuleTypeId.value.ruleTypes)
  };
}

async function getFailedAndUnrecognizedTasksPerDay(esClient, taskManagerIndex) {
  const {
    body: searchResult
  } = await esClient.search({
    index: taskManagerIndex,
    size: 0,
    body: {
      query: {
        bool: {
          must: [{
            bool: {
              should: [{
                term: {
                  'task.status': 'unrecognized'
                }
              }, {
                term: {
                  'task.status': 'failed'
                }
              }]
            }
          }, {
            wildcard: {
              'task.taskType': {
                value: 'alerting:*'
              }
            }
          }, {
            range: {
              'task.runAt': {
                gte: 'now-1d'
              }
            }
          }]
        }
      },
      aggs: {
        byTaskTypeId: taskTypeExecutionsMetric
      }
    }
  });
  const executionsAggregations = searchResult.aggregations;
  return {
    countTotal: Object.keys(executionsAggregations.byTaskTypeId.value.statuses).reduce((total, status) => {
      const byRuleTypesRefs = executionsAggregations.byTaskTypeId.value.statuses[status];
      const countByRuleTypes = Object.keys(byRuleTypesRefs).reduce((totalByType, ruleType) => parseInt(byRuleTypesRefs[ruleType] + totalByType, 10), 0);
      return countByRuleTypes + total;
    }, 0),
    countByStatus: Object.keys(executionsAggregations.byTaskTypeId.value.statuses).reduce( // ES DSL aggregations are returned as `any` by esClient.search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj, status) => {
      const byRuleTypesRefs = executionsAggregations.byTaskTypeId.value.statuses[status];
      const countByRuleTypes = Object.keys(byRuleTypesRefs).reduce((totalByType, ruleType) => parseInt(byRuleTypesRefs[ruleType] + totalByType, 10), 0);
      return { ...obj,
        [status]: countByRuleTypes
      };
    }, {}),
    countByStatusByRuleType: Object.keys(executionsAggregations.byTaskTypeId.value.statuses).reduce( // ES DSL aggregations are returned as `any` by esClient.search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj, key) => ({ ...obj,
      [key]: replaceDotSymbolsInRuleTypeIds(executionsAggregations.byTaskTypeId.value.statuses[key])
    }), {})
  };
}

function replaceDotSymbols(strToReplace) {
  return strToReplace.replaceAll('.', '__');
}

function replaceDotSymbolsInRuleTypeIds(ruleTypeIdObj) {
  return Object.keys(ruleTypeIdObj).reduce((obj, key) => ({ ...obj,
    [replaceDotSymbols(key)]: ruleTypeIdObj[key]
  }), {});
}