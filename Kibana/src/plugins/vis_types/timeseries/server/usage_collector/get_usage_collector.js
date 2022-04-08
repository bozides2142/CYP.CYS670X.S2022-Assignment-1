"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = void 0;

var _enums = require("../../common/enums");

var _server = require("../../../../dashboard/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const doTelemetryFoVisualizations = async (soClient, calculateTelemetry) => {
  const finder = await soClient.createPointInTimeFinder({
    type: 'visualization',
    perPage: 1000,
    namespaces: ['*']
  });

  for await (const response of finder.find()) {
    (response.saved_objects || []).forEach(({
      attributes
    }) => {
      if (attributes !== null && attributes !== void 0 && attributes.visState) {
        try {
          const visState = JSON.parse(attributes.visState);
          calculateTelemetry(visState);
        } catch {// nothing to be here, "so" not valid
        }
      }
    });
  }

  await finder.close();
};

const doTelemetryForByValueVisualizations = async (soClient, telemetryUseLastValueMode) => {
  const byValueVisualizations = await (0, _server.findByValueEmbeddables)(soClient, 'visualization');

  for (const item of byValueVisualizations) {
    telemetryUseLastValueMode(item.savedVis);
  }
};

const getDefaultTSVBVisualizations = home => {
  var _home$sampleData$getS;

  const titles = [];
  const sampleDataSets = (_home$sampleData$getS = home === null || home === void 0 ? void 0 : home.sampleData.getSampleDatasets()) !== null && _home$sampleData$getS !== void 0 ? _home$sampleData$getS : [];
  sampleDataSets.forEach(sampleDataSet => sampleDataSet.savedObjects.forEach(savedObject => {
    try {
      if (savedObject.type === 'visualization') {
        var _savedObject$attribut;

        const visState = JSON.parse((_savedObject$attribut = savedObject.attributes) === null || _savedObject$attribut === void 0 ? void 0 : _savedObject$attribut.visState);

        if (visState.type === 'metrics') {
          titles.push(visState.title);
        }
      }
    } catch (e) {// Let it go, visState is invalid and we'll don't need to handle it
    }
  }));
  return titles;
};

const getStats = async (soClient, home) => {
  const timeseriesUsage = {
    timeseries_use_last_value_mode_total: 0,
    timeseries_use_es_indices_total: 0,
    timeseries_table_use_aggregate_function: 0,
    timeseries_types: {
      gauge: 0,
      markdown: 0,
      metric: 0,
      table: 0,
      timeseries: 0,
      top_n: 0
    }
  }; // we want to exclude the TSVB Sample Data visualizations from the stats
  // in order to have more accurate results

  const excludedFromStatsVisualizations = getDefaultTSVBVisualizations(home);

  function telemetryUseLastValueMode(visState) {
    if (visState.type === 'metrics' && visState.params.type !== 'timeseries' && (!visState.params.time_range_mode || visState.params.time_range_mode === _enums.TIME_RANGE_DATA_MODES.LAST_VALUE) && !excludedFromStatsVisualizations.includes(visState.title)) {
      timeseriesUsage.timeseries_use_last_value_mode_total++;
    }
  }

  function telemetryUseESIndices(visState) {
    if (visState.type === 'metrics' && !visState.params.use_kibana_indexes && !excludedFromStatsVisualizations.includes(visState.title)) {
      timeseriesUsage.timeseries_use_es_indices_total++;
    }
  }

  function telemetryTableAggFunction(visState) {
    if (visState.type === 'metrics' && visState.params.type === 'table' && visState.params.series && visState.params.series.length > 0 && !excludedFromStatsVisualizations.includes(visState.title)) {
      const usesAggregateFunction = visState.params.series.some(s => s.aggregate_by && s.aggregate_function);

      if (usesAggregateFunction) {
        timeseriesUsage.timeseries_table_use_aggregate_function++;
      }
    }
  }

  function telemetryPanelTypes(visState) {
    if (visState.type === 'metrics' && !excludedFromStatsVisualizations.includes(visState.title)) {
      timeseriesUsage.timeseries_types[visState.params.type]++;
    }
  }

  await Promise.all([// last value usage telemetry
  doTelemetryFoVisualizations(soClient, telemetryUseLastValueMode), doTelemetryForByValueVisualizations(soClient, telemetryUseLastValueMode), // elasticsearch indices usage telemetry
  doTelemetryFoVisualizations(soClient, telemetryUseESIndices), doTelemetryForByValueVisualizations(soClient, telemetryUseESIndices), //  table aggregate function telemetry
  doTelemetryFoVisualizations(soClient, telemetryTableAggFunction), doTelemetryForByValueVisualizations(soClient, telemetryTableAggFunction), //  panel types usage telemetry
  doTelemetryFoVisualizations(soClient, telemetryPanelTypes), doTelemetryForByValueVisualizations(soClient, telemetryPanelTypes)]);
  return timeseriesUsage.timeseries_use_last_value_mode_total || timeseriesUsage.timeseries_use_es_indices_total || timeseriesUsage.timeseries_table_use_aggregate_function || Object.values(timeseriesUsage.timeseries_types).some(visualizationCount => visualizationCount) ? timeseriesUsage : undefined;
};

exports.getStats = getStats;