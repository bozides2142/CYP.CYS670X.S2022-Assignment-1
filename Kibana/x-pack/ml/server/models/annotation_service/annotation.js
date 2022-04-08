"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotationProvider = annotationProvider;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _annotations = require("../../../common/constants/annotations");

var _anomalies = require("../../../common/constants/anomalies");

var _index_patterns = require("../../../common/constants/index_patterns");

var _annotations2 = require("../../../common/types/annotations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function annotationProvider({
  asInternalUser
}) {
  // Find the index the annotation is stored in.
  async function fetchAnnotationIndex(id) {
    const searchParams = {
      index: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_READ,
      size: 1,
      body: {
        query: {
          ids: {
            values: [id]
          }
        }
      }
    };
    const {
      body
    } = await asInternalUser.search(searchParams);
    const totalCount = typeof body.hits.total === 'number' ? body.hits.total : body.hits.total.value;

    if (totalCount === 0) {
      throw _boom.default.notFound(`Cannot find annotation with ID ${id}`);
    }

    return body.hits.hits[0]._index;
  }

  async function indexAnnotation(annotation, username) {
    if ((0, _annotations2.isAnnotation)(annotation) === false) {
      // No need to translate, this will not be exposed in the UI.
      return Promise.reject(new Error('invalid annotation format'));
    }

    if (annotation.create_time === undefined) {
      annotation.create_time = new Date().getTime();
      annotation.create_username = username;
    }

    annotation.modified_time = new Date().getTime();
    annotation.modified_username = username;
    const params = {
      index: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_WRITE,
      body: annotation,
      refresh: 'wait_for',
      require_alias: true
    };

    if (typeof annotation._id !== 'undefined') {
      params.id = annotation._id;
      params.index = await fetchAnnotationIndex(annotation._id);
      params.require_alias = false;
      delete params.body._id;
      delete params.body.key;
    }

    const {
      body
    } = await asInternalUser.index(params);
    return body;
  }

  async function getAnnotations({
    jobIds,
    earliestMs,
    latestMs,
    maxAnnotations,
    detectorIndex,
    entities,
    event
  }) {
    const obj = {
      success: true,
      annotations: {},
      totalCount: 0
    };
    const boolCriteria = []; // Build the criteria to use in the bool filter part of the request.
    // Adds criteria for the time range plus any specified job IDs.
    // The nested must_not time range filter queries make sure that we fetch:
    // - annotations with start and end within the time range
    // - annotations that either start or end within the time range
    // - annotations that start before and end after the given time range
    // - but skip annotation that are completely outside the time range
    //   (the ones that start and end before or after the time range)

    if (earliestMs !== null && latestMs !== null) {
      boolCriteria.push({
        bool: {
          must_not: [{
            bool: {
              filter: [{
                range: {
                  timestamp: {
                    lte: earliestMs,
                    format: 'epoch_millis'
                  }
                }
              }, {
                range: {
                  end_timestamp: {
                    lte: earliestMs,
                    format: 'epoch_millis'
                  }
                }
              }]
            }
          }, {
            bool: {
              filter: [{
                range: {
                  timestamp: {
                    gte: latestMs,
                    format: 'epoch_millis'
                  }
                }
              }, {
                range: {
                  end_timestamp: {
                    gte: latestMs,
                    format: 'epoch_millis'
                  }
                }
              }]
            }
          }]
        }
      });
    }

    boolCriteria.push({
      exists: {
        field: 'annotation'
      }
    });

    if (event) {
      boolCriteria.push({
        term: {
          event
        }
      });
    }

    if (jobIds && jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
      let jobIdFilterStr = '';
      (0, _lodash.each)(jobIds, (jobId, i) => {
        jobIdFilterStr += `${i > 0 ? ' OR ' : ''}job_id:${jobId}`;
      });
      boolCriteria.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    } // Build should clause to further query for annotations in SMV
    // we want to show either the exact match with detector index and by/over/partition fields
    // OR annotations without any partition fields defined


    let shouldClauses;

    if (detectorIndex !== undefined && Array.isArray(entities)) {
      // build clause to get exact match of detector index and by/over/partition fields
      const beExactMatch = [];
      beExactMatch.push({
        term: {
          detector_index: detectorIndex
        }
      });
      entities.forEach(({
        fieldName,
        fieldType,
        fieldValue
      }) => {
        beExactMatch.push({
          term: {
            [(0, _annotations2.getAnnotationFieldName)(fieldType)]: fieldName
          }
        });
        beExactMatch.push({
          term: {
            [(0, _annotations2.getAnnotationFieldValue)(fieldType)]: fieldValue
          }
        });
      }); // clause to get annotations that have no partition fields

      const haveAnyPartitionFields = [];

      _anomalies.PARTITION_FIELDS.forEach(field => {
        haveAnyPartitionFields.push({
          exists: {
            field: (0, _annotations2.getAnnotationFieldName)(field)
          }
        });
        haveAnyPartitionFields.push({
          exists: {
            field: (0, _annotations2.getAnnotationFieldValue)(field)
          }
        });
      });

      shouldClauses = [{
        bool: {
          must_not: haveAnyPartitionFields
        }
      }, {
        bool: {
          must: beExactMatch
        }
      }];
    }

    const params = {
      index: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_READ,
      size: maxAnnotations,
      track_total_hits: true,
      body: {
        query: {
          bool: {
            filter: [{
              query_string: {
                query: `type:${_annotations.ANNOTATION_TYPE.ANNOTATION}`,
                analyze_wildcard: false
              }
            }, {
              bool: {
                must: boolCriteria
              }
            }],
            ...(shouldClauses ? {
              should: shouldClauses,
              minimum_should_match: 1
            } : {})
          }
        }
      }
    };

    try {
      const {
        body
      } = await asInternalUser.search(params); // @ts-expect-error TODO fix search response types

      if (body.error !== undefined && body.message !== undefined) {
        // No need to translate, this will not be exposed in the UI.
        throw new Error(`Annotations couldn't be retrieved from Elasticsearch.`);
      } // @ts-expect-error incorrect search response type


      obj.totalCount = body.hits.total.value; // @ts-expect-error TODO fix search response types

      const docs = (0, _lodash.get)(body, ['hits', 'hits'], []).map(d => {
        var _d$_source$event, _d$_source; // get the original source document and the document id, we need it
        // to identify the annotation when editing/deleting it.
        // if original `event` is undefined then substitute with 'user` by default
        // since annotation was probably generated by user on the UI


        return { ...d._source,
          event: (_d$_source$event = (_d$_source = d._source) === null || _d$_source === void 0 ? void 0 : _d$_source.event) !== null && _d$_source$event !== void 0 ? _d$_source$event : _annotations.ANNOTATION_EVENT_USER,
          _id: d._id
        };
      });

      if ((0, _annotations2.isAnnotations)(docs) === false) {
        // No need to translate, this will not be exposed in the UI.
        throw new Error(`Annotations didn't pass integrity check.`);
      }

      docs.forEach(doc => {
        const jobId = doc.job_id;

        if (typeof obj.annotations[jobId] === 'undefined') {
          obj.annotations[jobId] = [];
        }

        obj.annotations[jobId].push(doc);
      });
      return obj;
    } catch (error) {
      throw _boom.default.badRequest(error);
    }
  }
  /**
   * Fetches the latest delayed data annotation per job.
   * @param jobIds
   * @param earliestMs - Timestamp for the end_timestamp range query.
   */


  async function getDelayedDataAnnotations({
    jobIds,
    earliestMs
  }) {
    const params = {
      index: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_READ,
      size: 0,
      body: {
        query: {
          bool: {
            filter: [...(earliestMs ? [{
              range: {
                end_timestamp: {
                  gte: earliestMs
                }
              }
            }] : []), {
              term: {
                event: {
                  value: 'delayed_data'
                }
              }
            }, {
              terms: {
                job_id: jobIds
              }
            }]
          }
        },
        aggs: {
          by_job: {
            terms: {
              field: 'job_id',
              size: jobIds.length
            },
            aggs: {
              latest_delayed: {
                top_hits: {
                  size: 1,
                  sort: [{
                    end_timestamp: {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          }
        }
      }
    };
    const {
      body
    } = await asInternalUser.search(params);
    const annotations = body.aggregations.by_job.buckets.map(bucket => {
      return bucket.latest_delayed.hits.hits[0]._source;
    });
    return annotations;
  }

  async function deleteAnnotation(id) {
    const index = await fetchAnnotationIndex(id);
    const deleteParams = {
      index,
      id,
      refresh: 'wait_for'
    };
    const {
      body: deleteResponse
    } = await asInternalUser.delete(deleteParams);
    return deleteResponse;
  }

  return {
    getAnnotations,
    indexAnnotation,
    deleteAnnotation,
    getDelayedDataAnnotations
  };
}