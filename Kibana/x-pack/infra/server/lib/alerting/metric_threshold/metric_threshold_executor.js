"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMetricThresholdExecutor = exports.WARNING_ACTIONS = exports.FIRED_ACTIONS = void 0;

var _i18n = require("@kbn/i18n");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _common = require("../../../../../alerting/common");

var _metrics = require("../../../../common/alerting/metrics");

var _formatters = require("../../../../common/formatters");

var _messages = require("../common/messages");

var _utils = require("../common/utils");

var _evaluate_rule = require("./lib/evaluate_rule");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

const createMetricThresholdExecutor = libs => libs.metricsRules.createLifecycleRuleExecutor(async function (options) {
  var _state$groups$filter, _state$groups;

  const {
    services,
    params,
    state
  } = options;
  const {
    criteria
  } = params;
  if (criteria.length === 0) throw new Error('Cannot execute an alert with 0 conditions');
  const {
    alertWithLifecycle,
    savedObjectsClient
  } = services;

  const alertFactory = (id, reason) => alertWithLifecycle({
    id,
    fields: {
      [_ruleDataUtils.ALERT_REASON]: reason
    }
  });

  const {
    sourceId,
    alertOnNoData,
    alertOnGroupDisappear: _alertOnGroupDisappear
  } = params;

  if (!params.filterQuery && params.filterQueryText) {
    try {
      const {
        fromKueryExpression
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('@kbn/es-query')));
      fromKueryExpression(params.filterQueryText);
    } catch (e) {
      const timestamp = (0, _moment.default)().toISOString();
      const actionGroupId = FIRED_ACTIONS.id; // Change this to an Error action group when able

      const reason = (0, _messages.buildInvalidQueryAlertReason)(params.filterQueryText);
      const alert = alertFactory(_utils.UNGROUPED_FACTORY_KEY, reason);
      alert.scheduleActions(actionGroupId, {
        group: _utils.UNGROUPED_FACTORY_KEY,
        alertState: _messages.stateToAlertMessage[_metrics.AlertStates.ERROR],
        reason,
        timestamp,
        value: null,
        metric: mapToConditionsLookup(criteria, c => c.metric)
      });
      return {
        groups: [],
        groupBy: params.groupBy,
        filterQuery: params.filterQuery
      };
    }
  } // For backwards-compatibility, interpret undefined alertOnGroupDisappear as true


  const alertOnGroupDisappear = _alertOnGroupDisappear !== false;
  const source = await libs.sources.getSourceConfiguration(savedObjectsClient, sourceId || 'default');
  const config = source.configuration;
  const compositeSize = libs.configuration.alerting.metric_threshold.group_by_page_size;
  const previousGroupBy = state.groupBy;
  const previousFilterQuery = state.filterQuery;
  const prevGroups = alertOnGroupDisappear && (0, _lodash.isEqual)(previousGroupBy, params.groupBy) && (0, _lodash.isEqual)(previousFilterQuery, params.filterQuery) ? // Filter out the * key from the previous groups, only include it if it's one of
  // the current groups. In case of a groupBy alert that starts out with no data and no
  // groups, we don't want to persist the existence of the * alert instance
  (_state$groups$filter = (_state$groups = state.groups) === null || _state$groups === void 0 ? void 0 : _state$groups.filter(g => g !== _utils.UNGROUPED_FACTORY_KEY)) !== null && _state$groups$filter !== void 0 ? _state$groups$filter : [] : [];
  const alertResults = await (0, _evaluate_rule.evaluateRule)(services.scopedClusterClient.asCurrentUser, params, config, prevGroups, compositeSize); // Because each alert result has the same group definitions, just grab the groups from the first one.

  const resultGroups = Object.keys((0, _lodash.first)(alertResults)); // Merge the list of currently fetched groups and previous groups, and uniquify them. This is necessary for reporting
  // no data results on groups that get removed

  const groups = [...new Set([...prevGroups, ...resultGroups])];
  const hasGroups = !(0, _lodash.isEqual)(groups, [_utils.UNGROUPED_FACTORY_KEY]);

  for (const group of groups) {
    // AND logic; all criteria must be across the threshold
    const shouldAlertFire = alertResults.every(result => // Grab the result of the most recent bucket
    (0, _lodash.last)(result[group].shouldFire));
    const shouldAlertWarn = alertResults.every(result => (0, _lodash.last)(result[group].shouldWarn)); // AND logic; because we need to evaluate all criteria, if one of them reports no data then the
    // whole alert is in a No Data/Error state

    const isNoData = alertResults.some(result => (0, _lodash.last)(result[group].isNoData));
    const isError = alertResults.some(result => result[group].isError);
    const nextState = isError ? _metrics.AlertStates.ERROR : isNoData ? _metrics.AlertStates.NO_DATA : shouldAlertFire ? _metrics.AlertStates.ALERT : shouldAlertWarn ? _metrics.AlertStates.WARNING : _metrics.AlertStates.OK;
    let reason;

    if (nextState === _metrics.AlertStates.ALERT || nextState === _metrics.AlertStates.WARNING) {
      reason = alertResults.map(result => (0, _messages.buildFiredAlertReason)({ ...formatAlertResult(result[group], nextState === _metrics.AlertStates.WARNING),
        group
      })).join('\n');
      /*
       * Custom recovery actions aren't yet available in the alerting framework
       * Uncomment the code below once they've been implemented
       * Reference: https://github.com/elastic/kibana/issues/87048
       */
      // } else if (nextState === AlertStates.OK && prevState?.alertState === AlertStates.ALERT) {
      // reason = alertResults
      //   .map((result) => buildRecoveredAlertReason(formatAlertResult(result[group])))
      //   .join('\n');
    }
    /* NO DATA STATE HANDLING
     *
     * - `alertOnNoData` does not indicate IF the alert's next state is No Data, but whether or not the user WANTS TO BE ALERTED
     *   if the state were No Data.
     * - `alertOnGroupDisappear`, on the other hand, determines whether or not it's possible to return a No Data state
     *   when a group disappears.
     *
     * This means we need to handle the possibility that `alertOnNoData` is false, but `alertOnGroupDisappear` is true
     *
     * nextState === NO_DATA would be true on both { '*': No Data } or, e.g. { 'a': No Data, 'b': OK, 'c': OK }, but if the user
     * has for some reason disabled `alertOnNoData` and left `alertOnGroupDisappear` enabled, they would only care about the latter
     * possibility. In this case, use hasGroups to determine whether to alert on a potential No Data state
     *
     * If `alertOnNoData` is true but `alertOnGroupDisappear` is false, we don't need to worry about the {a, b, c} possibility.
     * At this point in the function, a false `alertOnGroupDisappear` would already have prevented group 'a' from being evaluated at all.
     */


    if (alertOnNoData || alertOnGroupDisappear && hasGroups) {
      // In the previous line we've determined if the user is interested in No Data states, so only now do we actually
      // check to see if a No Data state has occurred
      if (nextState === _metrics.AlertStates.NO_DATA) {
        reason = alertResults.filter(result => result[group].isNoData).map(result => (0, _messages.buildNoDataAlertReason)({ ...result[group],
          group
        })).join('\n');
      } else if (nextState === _metrics.AlertStates.ERROR) {
        reason = alertResults.filter(result => result[group].isError).map(result => (0, _messages.buildErrorAlertReason)(result[group].metric)).join('\n');
      }
    }

    if (reason) {
      var _ref;

      const firstResult = (0, _lodash.first)(alertResults);
      const timestamp = (_ref = firstResult && firstResult[group].timestamp) !== null && _ref !== void 0 ? _ref : (0, _moment.default)().toISOString();
      const actionGroupId = nextState === _metrics.AlertStates.OK ? _common.RecoveredActionGroup.id : nextState === _metrics.AlertStates.WARNING ? WARNING_ACTIONS.id : FIRED_ACTIONS.id;
      const alert = alertFactory(`${group}`, reason);
      alert.scheduleActions(actionGroupId, {
        group,
        alertState: _messages.stateToAlertMessage[nextState],
        reason,
        timestamp,
        value: mapToConditionsLookup(alertResults, result => formatAlertResult(result[group]).currentValue),
        threshold: mapToConditionsLookup(alertResults, result => formatAlertResult(result[group]).threshold),
        metric: mapToConditionsLookup(criteria, c => c.metric)
      });
    }
  }

  return {
    groups,
    groupBy: params.groupBy,
    filterQuery: params.filterQuery
  };
});

exports.createMetricThresholdExecutor = createMetricThresholdExecutor;
const FIRED_ACTIONS = {
  id: 'metrics.threshold.fired',
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.fired', {
    defaultMessage: 'Alert'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;
const WARNING_ACTIONS = {
  id: 'metrics.threshold.warning',
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warning', {
    defaultMessage: 'Warning'
  })
};
exports.WARNING_ACTIONS = WARNING_ACTIONS;

const mapToConditionsLookup = (list, mapFn) => list.map(mapFn).reduce((result, value, i) => ({ ...result,
  [`condition${i}`]: value
}), {});

const formatAlertResult = (alertResult, useWarningThreshold) => {
  const {
    metric,
    currentValue,
    threshold,
    comparator,
    warningThreshold,
    warningComparator
  } = alertResult;

  const noDataValue = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.noDataFormattedValue', {
    defaultMessage: '[NO DATA]'
  });

  if (!metric.endsWith('.pct')) return { ...alertResult,
    currentValue: currentValue !== null && currentValue !== void 0 ? currentValue : noDataValue
  };
  const formatter = (0, _formatters.createFormatter)('percent');
  const thresholdToFormat = useWarningThreshold ? warningThreshold : threshold;
  const comparatorToFormat = useWarningThreshold ? warningComparator : comparator;
  return { ...alertResult,
    currentValue: currentValue !== null && typeof currentValue !== 'undefined' ? formatter(currentValue) : noDataValue,
    threshold: Array.isArray(thresholdToFormat) ? thresholdToFormat.map(v => formatter(v)) : thresholdToFormat,
    comparator: comparatorToFormat
  };
};