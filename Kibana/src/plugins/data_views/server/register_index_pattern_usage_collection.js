"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexPatternTelemetry = getIndexPatternTelemetry;
exports.minMaxAvgLoC = void 0;
exports.registerIndexPatternsUsageCollector = registerIndexPatternsUsageCollector;
exports.updateMin = exports.updateMax = void 0;

var _server = require("../../../core/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const minMaxAvgLoC = scripts => {
  const lengths = scripts.map(script => (script === null || script === void 0 ? void 0 : script.split(/\r\n|\r|\n/).length) || 0).sort();
  return {
    min: lengths[0],
    max: lengths[lengths.length - 1],
    avg: lengths.reduce((col, count) => col + count, 0) / lengths.length
  };
};

exports.minMaxAvgLoC = minMaxAvgLoC;

const updateMin = (currentMin, newVal) => {
  if (currentMin === undefined || currentMin > newVal) {
    return newVal;
  } else {
    return currentMin;
  }
};

exports.updateMin = updateMin;

const updateMax = (currentMax, newVal) => {
  if (currentMax === undefined || currentMax < newVal) {
    return newVal;
  } else {
    return currentMax;
  }
};

exports.updateMax = updateMax;

async function getIndexPatternTelemetry(indexPatterns) {
  const ids = await indexPatterns.getIds();
  const countSummaryDefaults = {
    min: undefined,
    max: undefined,
    avg: undefined
  };
  const results = {
    indexPatternsCount: ids.length,
    indexPatternsWithScriptedFieldCount: 0,
    indexPatternsWithRuntimeFieldCount: 0,
    scriptedFieldCount: 0,
    runtimeFieldCount: 0,
    perIndexPattern: {
      scriptedFieldCount: { ...countSummaryDefaults
      },
      runtimeFieldCount: { ...countSummaryDefaults
      },
      scriptedFieldLineCount: { ...countSummaryDefaults
      },
      runtimeFieldLineCount: { ...countSummaryDefaults
      }
    }
  };
  await ids.reduce(async (col, id) => {
    await col;
    const ip = await indexPatterns.get(id);
    const scriptedFields = ip.getScriptedFields();
    const runtimeFields = ip.fields.filter(fld => !!fld.runtimeField);

    if (scriptedFields.length > 0) {
      // increment counts
      results.indexPatternsWithScriptedFieldCount++;
      results.scriptedFieldCount += scriptedFields.length; // calc LoC

      results.perIndexPattern.scriptedFieldLineCount = minMaxAvgLoC(scriptedFields.map(fld => fld.script || '')); // calc field counts

      results.perIndexPattern.scriptedFieldCount.min = updateMin(results.perIndexPattern.scriptedFieldCount.min, scriptedFields.length);
      results.perIndexPattern.scriptedFieldCount.max = updateMax(results.perIndexPattern.scriptedFieldCount.max, scriptedFields.length);
      results.perIndexPattern.scriptedFieldCount.avg = results.scriptedFieldCount / results.indexPatternsWithScriptedFieldCount;
    }

    if (runtimeFields.length > 0) {
      // increment counts
      results.indexPatternsWithRuntimeFieldCount++;
      results.runtimeFieldCount += runtimeFields.length; // calc LoC

      const runtimeFieldScripts = runtimeFields.map(fld => {
        var _fld$runtimeField, _fld$runtimeField$scr;

        return ((_fld$runtimeField = fld.runtimeField) === null || _fld$runtimeField === void 0 ? void 0 : (_fld$runtimeField$scr = _fld$runtimeField.script) === null || _fld$runtimeField$scr === void 0 ? void 0 : _fld$runtimeField$scr.source) || '';
      });
      results.perIndexPattern.runtimeFieldLineCount = minMaxAvgLoC(runtimeFieldScripts); // calc field counts

      results.perIndexPattern.runtimeFieldCount.min = updateMin(results.perIndexPattern.runtimeFieldCount.min, runtimeFields.length);
      results.perIndexPattern.runtimeFieldCount.max = updateMax(results.perIndexPattern.runtimeFieldCount.max, runtimeFields.length);
      results.perIndexPattern.runtimeFieldCount.avg = results.runtimeFieldCount / results.indexPatternsWithRuntimeFieldCount;
    }
  }, Promise.resolve());
  return results;
}

function registerIndexPatternsUsageCollector(getStartServices, usageCollection) {
  if (!usageCollection) {
    return;
  }

  const indexPatternUsageCollector = usageCollection.makeUsageCollector({
    type: 'index-patterns',
    isReady: () => true,
    fetch: async () => {
      const [{
        savedObjects,
        elasticsearch
      },, {
        indexPatternsServiceFactory
      }] = await getStartServices();
      const indexPatternService = await indexPatternsServiceFactory(new _server.SavedObjectsClient(savedObjects.createInternalRepository()), elasticsearch.client.asInternalUser);
      return await getIndexPatternTelemetry(indexPatternService);
    },
    schema: {
      indexPatternsCount: {
        type: 'long'
      },
      indexPatternsWithScriptedFieldCount: {
        type: 'long'
      },
      indexPatternsWithRuntimeFieldCount: {
        type: 'long'
      },
      scriptedFieldCount: {
        type: 'long'
      },
      runtimeFieldCount: {
        type: 'long'
      },
      perIndexPattern: {
        scriptedFieldCount: {
          min: {
            type: 'long'
          },
          max: {
            type: 'long'
          },
          avg: {
            type: 'float'
          }
        },
        runtimeFieldCount: {
          min: {
            type: 'long'
          },
          max: {
            type: 'long'
          },
          avg: {
            type: 'float'
          }
        },
        scriptedFieldLineCount: {
          min: {
            type: 'long'
          },
          max: {
            type: 'long'
          },
          avg: {
            type: 'float'
          }
        },
        runtimeFieldLineCount: {
          min: {
            type: 'long'
          },
          max: {
            type: 'long'
          },
          avg: {
            type: 'float'
          }
        }
      }
    }
  });
  usageCollection.registerCollector(indexPatternUsageCollector);
}