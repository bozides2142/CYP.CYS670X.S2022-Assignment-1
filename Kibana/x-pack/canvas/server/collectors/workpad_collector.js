"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.summarizeWorkpads = summarizeWorkpads;
exports.workpadSchema = exports.workpadCollector = void 0;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../common/lib/constants");

var _collector_helpers = require("./collector_helpers");

var _common = require("../../../../../src/plugins/expressions/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const workpadSchema = {
  workpads: {
    total: {
      type: 'long',
      _meta: {
        description: 'The total number of Canvas Workpads in the cluster'
      }
    }
  },
  pages: {
    total: {
      type: 'long',
      _meta: {
        description: 'The total number of pages across all Canvas Workpads'
      }
    },
    per_workpad: {
      avg: {
        type: 'float',
        _meta: {
          description: 'The average number of pages across all Canvas Workpads'
        }
      },
      min: {
        type: 'long',
        _meta: {
          description: 'The minimum number of pages found in a Canvas Workpad'
        }
      },
      max: {
        type: 'long',
        _meta: {
          description: 'The maximum number of pages found in a Canvas Workpad'
        }
      }
    }
  },
  elements: {
    total: {
      type: 'long',
      _meta: {
        description: 'The total number of elements across all Canvas Workpads'
      }
    },
    per_page: {
      avg: {
        type: 'float',
        _meta: {
          description: 'The average number of elements per page across all Canvas Workpads'
        }
      },
      min: {
        type: 'long',
        _meta: {
          description: 'The minimum number of elements on a page across all Canvas Workpads'
        }
      },
      max: {
        type: 'long',
        _meta: {
          description: 'The maximum number of elements on a page across all Canvas Workpads'
        }
      }
    }
  },
  functions: {
    total: {
      type: 'long',
      _meta: {
        description: 'The total number of functions in use across all Canvas Workpads'
      }
    },
    in_use: {
      type: 'array',
      items: {
        type: 'keyword',
        _meta: {
          description: 'A function in use in any Canvas Workpad'
        }
      }
    },
    in_use_30d: {
      type: 'array',
      items: {
        type: 'keyword',
        _meta: {
          description: 'A function in use in a Canvas Workpad that has been modified in the last 30 days'
        }
      }
    },
    in_use_90d: {
      type: 'array',
      items: {
        type: 'keyword',
        _meta: {
          description: 'A function in use in a Canvas Workpad that has been modified in the last 90 days'
        }
      }
    },
    per_element: {
      avg: {
        type: 'float',
        _meta: {
          description: 'Average number of functions used per element across all Canvas Workpads'
        }
      },
      min: {
        type: 'long',
        _meta: {
          description: 'The minimum number of functions used in an element across all Canvas Workpads'
        }
      },
      max: {
        type: 'long',
        _meta: {
          description: 'The maximum number of functions used in an element across all Canvas Workpads'
        }
      }
    }
  },
  variables: {
    total: {
      type: 'long',
      _meta: {
        description: 'The total number of variables defined across all Canvas Workpads'
      }
    },
    per_workpad: {
      avg: {
        type: 'float',
        _meta: {
          description: 'The average number of variables set per Canvas Workpad'
        }
      },
      min: {
        type: 'long',
        _meta: {
          description: 'The minimum number variables set across all Canvas Workpads'
        }
      },
      max: {
        type: 'long',
        _meta: {
          description: 'The maximum number of variables set across all Canvas Workpads'
        }
      }
    }
  }
};
/**
  Gather statistic about the given workpads
  @param workpadDocs a collection of workpad documents
  @returns Workpad Telemetry Data
*/

exports.workpadSchema = workpadSchema;

function summarizeWorkpads(workpadDocs) {
  const functionCollection = {
    all: new Set(),
    '30d': new Set(),
    '90d': new Set()
  };
  const functionSet = new Set();

  if (workpadDocs.length === 0) {
    return {};
  } // make a summary of info about each workpad


  const workpadsInfo = workpadDocs.map(workpad => {
    let this30Days = false;
    let this90Days = false;

    if (workpad['@timestamp'] !== undefined) {
      const lastReadDaysAgo = (0, _moment.default)().diff((0, _moment.default)(workpad['@timestamp']), 'days');

      if (lastReadDaysAgo < 30) {
        this30Days = true;
      }

      if (lastReadDaysAgo < 90) {
        this90Days = true;
      }
    }

    let pages = {
      count: 0
    };

    try {
      pages = {
        count: workpad.pages.length
      };
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err, workpad);
    }

    const elementCounts = workpad.pages.reduce((accum, page) => accum.concat(page.elements.length), []);
    const functionCounts = workpad.pages.reduce((accum, page) => {
      return page.elements.map(element => {
        const ast = (0, _common.parseExpression)(element.expression);
        (0, _collector_helpers.collectFns)(ast, cFunction => {
          functionCollection.all.add(cFunction);

          if (this30Days) {
            functionCollection['30d'].add(cFunction);
          }

          if (this90Days) {
            functionCollection['90d'].add(cFunction);
          }

          functionSet.add(cFunction);
        });
        return ast.chain.length; // get the number of parts in the expression
      });
    }, []);
    const variableCount = workpad.variables && workpad.variables.length ? workpad.variables.length : 0;
    return {
      pages,
      elementCounts,
      functionCounts,
      variableCount
    };
  }); // combine together info from across the workpads

  const combinedWorkpadsInfo = workpadsInfo.reduce((accum, pageInfo) => {
    const {
      pages,
      elementCounts,
      functionCounts,
      variableCount
    } = pageInfo;
    return {
      pageMin: pages.count < accum.pageMin ? pages.count : accum.pageMin,
      pageMax: pages.count > accum.pageMax ? pages.count : accum.pageMax,
      pageCounts: accum.pageCounts.concat(pages.count),
      elementCounts: accum.elementCounts.concat(elementCounts),
      functionCounts: accum.functionCounts.concat(functionCounts),
      variableCounts: accum.variableCounts.concat([variableCount])
    };
  }, {
    pageMin: Infinity,
    pageMax: -Infinity,
    pageCounts: [],
    elementCounts: [],
    functionCounts: [],
    variableCounts: []
  });
  const {
    pageCounts,
    pageMin,
    pageMax,
    elementCounts,
    functionCounts,
    variableCounts
  } = combinedWorkpadsInfo;
  const pageTotal = (0, _lodash.sum)(pageCounts);
  const elementsTotal = (0, _lodash.sum)(elementCounts);
  const functionsTotal = (0, _lodash.sum)(functionCounts);
  const variableTotal = (0, _lodash.sum)(variableCounts);
  const pagesInfo = workpadsInfo.length > 0 ? {
    total: pageTotal,
    per_workpad: {
      avg: pageTotal / pageCounts.length,
      min: pageMin,
      max: pageMax
    }
  } : undefined;
  const elementsInfo = pageTotal > 0 ? {
    total: elementsTotal,
    per_page: {
      avg: elementsTotal / elementCounts.length,
      min: (0, _lodash.min)(elementCounts) || 0,
      max: (0, _lodash.max)(elementCounts) || 0
    }
  } : undefined;
  const functionsInfo = elementsTotal > 0 ? {
    total: functionsTotal,
    in_use: Array.from(functionCollection.all),
    in_use_30d: Array.from(functionCollection['30d']),
    in_use_90d: Array.from(functionCollection['90d']),
    per_element: {
      avg: functionsTotal / functionCounts.length,
      min: (0, _lodash.min)(functionCounts) || 0,
      max: (0, _lodash.max)(functionCounts) || 0
    }
  } : undefined;
  const variableInfo = {
    total: variableTotal,
    per_workpad: {
      avg: variableTotal / variableCounts.length,
      min: (0, _lodash.min)(variableCounts) || 0,
      max: (0, _lodash.max)(variableCounts) || 0
    }
  };
  return {
    workpads: {
      total: workpadsInfo.length
    },
    pages: pagesInfo,
    elements: elementsInfo,
    functions: functionsInfo,
    variables: variableInfo
  };
}

const workpadCollector = async function (kibanaIndex, esClient) {
  const searchParams = {
    size: 10000,
    // elasticsearch index.max_result_window default value
    index: kibanaIndex,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.canvas-workpad', '-hits.hits._source.canvas-workpad.assets'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: _constants.CANVAS_TYPE
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);

  if ((0, _lodash.get)(esResponse, 'hits.hits.length') > 0) {
    const workpads = esResponse.hits.hits.map(hit => hit._source[_constants.CANVAS_TYPE]);
    return summarizeWorkpads(workpads);
  }

  return {};
};

exports.workpadCollector = workpadCollector;