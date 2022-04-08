"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRollupIndexPatterns = fetchRollupIndexPatterns;
exports.fetchRollupSavedSearches = fetchRollupSavedSearches;
exports.fetchRollupVisualizations = fetchRollupVisualizations;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// elasticsearch index.max_result_window default value


const ES_MAX_RESULT_WINDOW_DEFAULT_VALUE = 1000;

function getIdFromSavedObjectId(savedObjectId) {
  // The saved object ID is formatted `{TYPE}:{ID}`.
  return savedObjectId.split(':')[1];
}

async function fetchRollupIndexPatterns(kibanaIndex, esClient) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignore_unavailable: true,
    filter_path: ['hits.hits._id'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              'index-pattern.type': 'rollup'
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);
  return (0, _lodash.get)(esResponse, 'hits.hits', []).map(indexPattern => {
    const {
      _id: savedObjectId
    } = indexPattern;
    return getIdFromSavedObjectId(savedObjectId);
  });
}

const getSavedObjectsList = async ({
  esClient,
  searchAfter,
  kibanaIndex,
  filterPath,
  filter
}) => {
  const {
    body: esResponse
  } = await esClient.search({
    body: {
      search_after: searchAfter,
      sort: [{
        updated_at: 'asc'
      }],
      query: {
        bool: {
          filter
        }
      }
    },
    ignore_unavailable: true,
    index: kibanaIndex,
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    _source: filterPath
  });
  return esResponse;
};

async function fetchRollupSavedSearches(kibanaIndex, esClient, rollupIndexPatternToFlagMap) {
  const searchProps = {
    esClient,
    kibanaIndex,
    searchAfter: undefined,
    filterPath: ['references'],
    filter: {
      term: {
        type: 'search'
      }
    }
  };
  let savedSearchesList = await getSavedObjectsList(searchProps);
  const rollupSavedSearchesIds = [];

  while (savedSearchesList.hits.hits && savedSearchesList.hits.hits.length !== 0) {
    const savedSearches = (0, _lodash.get)(savedSearchesList, 'hits.hits', []);
    savedSearches.map(async savedSearch => {
      const {
        _id: savedObjectId
      } = savedSearch;
      const references = (0, _lodash.get)(savedSearch, '_source.references');

      if (references !== null && references !== void 0 && references.length) {
        const rollupSavedSearches = references.filter(({
          type,
          id
        }) => type === 'index-pattern' && rollupIndexPatternToFlagMap[id]);

        if (rollupSavedSearches.length) {
          const id = getIdFromSavedObjectId(savedObjectId);
          rollupSavedSearchesIds.push(id);
        }
      }
    }, []);

    if (savedSearchesList.hits.hits.length < ES_MAX_RESULT_WINDOW_DEFAULT_VALUE) {
      break;
    }

    savedSearchesList = await getSavedObjectsList({ ...searchProps,
      // @ts-expect-error@elastic/elasticsearch SortResults might contain null
      searchAfter: savedSearchesList.hits.hits[savedSearchesList.hits.hits.length - 1].sort
    });
  }

  return rollupSavedSearchesIds;
}

async function fetchRollupVisualizations(kibanaIndex, esClient, rollupIndexPatternToFlagMap, rollupSavedSearchesToFlagMap) {
  let rollupVisualizations = 0;
  let rollupLensVisualizations = 0;
  let rollupVisualizationsFromSavedSearches = 0;
  let rollupLensVisualizationsFromSavedSearches = 0;
  const searchProps = {
    esClient,
    kibanaIndex,
    searchAfter: undefined,
    filterPath: ['type', 'references'],
    filter: {
      terms: {
        type: ['visualization', 'lens']
      }
    }
  };
  let savedVisualizationsList = await getSavedObjectsList(searchProps);

  while (savedVisualizationsList.hits.hits && savedVisualizationsList.hits.hits.length !== 0) {
    const visualizations = (0, _lodash.get)(savedVisualizationsList, 'hits.hits', []);
    const sort = savedVisualizationsList.hits.hits[savedVisualizationsList.hits.hits.length - 1].sort;
    visualizations.forEach(visualization => {
      const references = (0, _lodash.get)(visualization, '_source.references');

      if (references !== null && references !== void 0 && references.length) {
        const visualizationsFromPatterns = references.filter(({
          type,
          id
        }) => type === 'index-pattern' && rollupIndexPatternToFlagMap[id]);
        const visualizationsFromSavedSearches = references.filter(({
          type,
          id
        }) => type === 'search' && rollupSavedSearchesToFlagMap[id]);

        if (visualizationsFromPatterns.length) {
          rollupVisualizations++;

          if (visualization._source.type === 'lens') {
            rollupLensVisualizations++;
          }
        } else if (visualizationsFromSavedSearches.length) {
          rollupVisualizationsFromSavedSearches++;

          if (visualization._source.type === 'lens') {
            rollupLensVisualizationsFromSavedSearches++;
          }
        }
      }
    });

    if (savedVisualizationsList.hits.hits.length < ES_MAX_RESULT_WINDOW_DEFAULT_VALUE) {
      break;
    }

    savedVisualizationsList = await getSavedObjectsList({ ...searchProps,
      // @ts-expect-error@elastic/elasticsearch SortResults might contain null
      searchAfter: sort
    });
  }

  return {
    rollupVisualizations,
    rollupVisualizationsFromSavedSearches,
    rollupLensVisualizations,
    rollupLensVisualizationsFromSavedSearches
  };
}