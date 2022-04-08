"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildOtherBucketAgg = exports.OTHER_BUCKET_SEPARATOR = void 0;
exports.constructMultiTermOtherFilter = constructMultiTermOtherFilter;
exports.constructSingleTermOtherFilter = constructSingleTermOtherFilter;
exports.updateMissingBucket = exports.mergeOtherBucketAggResponse = exports.createOtherBucketPostFlightRequest = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

var _agg_groups = require("../agg_groups");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const OTHER_BUCKET_SEPARATOR = '╰┄►';
/**
 * walks the aggregation DSL and returns DSL starting at aggregation with id of startFromAggId
 * @param aggNestedDsl: aggregation config DSL (top level)
 * @param startFromId: id of an aggregation from where we want to get the nested DSL
 */

exports.OTHER_BUCKET_SEPARATOR = OTHER_BUCKET_SEPARATOR;

const getNestedAggDSL = (aggNestedDsl, startFromAggId) => {
  if (aggNestedDsl[startFromAggId]) {
    return aggNestedDsl[startFromAggId];
  }

  const nestedAggs = (0, _lodash.values)(aggNestedDsl);
  let aggs;

  for (let i = 0; i < nestedAggs.length; i++) {
    if (nestedAggs[i].aggs && (aggs = getNestedAggDSL(nestedAggs[i].aggs, startFromAggId))) {
      return aggs;
    }
  }
};
/**
 * returns buckets from response for a specific other bucket
 * @param aggConfigs: configuration for the aggregations
 * @param response: response from elasticsearch
 * @param aggWithOtherBucket: AggConfig of the aggregation with other bucket enabled
 * @param key: key from the other bucket request for a specific other bucket
 */


const getAggResultBuckets = (aggConfigs, response, aggWithOtherBucket, key) => {
  var _responseAgg;

  const keyParts = key.split(OTHER_BUCKET_SEPARATOR);
  let responseAgg = response;

  for (const i in keyParts) {
    if (keyParts[i]) {
      const responseAggs = (0, _lodash.values)(responseAgg); // If you have multi aggs, we cannot just assume the first one is the `other` bucket,
      // so we need to loop over each agg until we find it.

      for (let aggId = 0; aggId < responseAggs.length; aggId++) {
        const aggById = responseAggs[aggId];
        const aggKey = (0, _lodash.keys)(responseAgg)[aggId];
        const aggConfig = (0, _lodash.find)(aggConfigs.aggs, agg => agg.id === aggKey);

        if (aggConfig) {
          const aggResultBucket = (0, _lodash.find)(aggById.buckets, (bucket, bucketObjKey) => {
            const bucketKey = aggConfig.getKey(bucket, (0, _lodash.isNumber)(bucketObjKey) ? undefined : bucketObjKey).toString();
            return bucketKey === keyParts[i];
          });

          if (aggResultBucket) {
            responseAgg = aggResultBucket;
            break;
          }
        }
      }
    }
  }

  if ((_responseAgg = responseAgg) !== null && _responseAgg !== void 0 && _responseAgg[aggWithOtherBucket.id]) {
    return responseAgg[aggWithOtherBucket.id].buckets;
  }

  return [];
};
/**
 * gets all the missing buckets in our response for a specific aggregation id
 * @param responseAggs: array of aggregations from response
 * @param aggId: id of the aggregation with missing bucket
 */


const getAggConfigResultMissingBuckets = (responseAggs, aggId) => {
  const missingKey = '__missing__';
  let resultBuckets = [];

  if (responseAggs[aggId]) {
    const matchingBucket = responseAggs[aggId].buckets.find(bucket => bucket.key === missingKey);
    if (matchingBucket) resultBuckets.push(matchingBucket);
    return resultBuckets;
  }

  (0, _lodash.each)(responseAggs, agg => {
    if (agg.buckets) {
      (0, _lodash.each)(agg.buckets, bucket => {
        resultBuckets = [...resultBuckets, ...getAggConfigResultMissingBuckets(bucket, aggId)];
      });
    }
  });
  return resultBuckets;
};
/**
 * gets all the terms that are NOT in the other bucket
 * @param requestAgg: an aggregation we are looking at
 * @param key: the key for this specific other bucket
 * @param otherAgg: AggConfig of the aggregation with other bucket
 */


const getOtherAggTerms = (requestAgg, key, otherAgg) => {
  return requestAgg['other-filter'].filters.filters[key].bool.must_not.filter(filter => filter.match_phrase && filter.match_phrase[otherAgg.params.field.name]).map(filter => filter.match_phrase[otherAgg.params.field.name]);
};

const buildOtherBucketAgg = (aggConfigs, aggWithOtherBucket, response) => {
  const bucketAggs = aggConfigs.aggs.filter(agg => agg.type.type === _agg_groups.AggGroupNames.Buckets && agg.enabled);
  const index = bucketAggs.findIndex(agg => agg.id === aggWithOtherBucket.id);
  const aggs = aggConfigs.toDsl();
  const indexPattern = aggWithOtherBucket.aggConfigs.indexPattern; // create filters aggregation

  const filterAgg = aggConfigs.createAggConfig({
    type: 'filters',
    id: 'other',
    params: {
      filters: []
    },
    enabled: false
  }, {
    addToAggConfigs: false
  }); // nest all the child aggregations of aggWithOtherBucket

  const resultAgg = {
    aggs: getNestedAggDSL(aggs, aggWithOtherBucket.id).aggs,
    filters: filterAgg.toDsl()
  };
  let noAggBucketResults = false;
  let exhaustiveBuckets = true; // recursively create filters for all parent aggregation buckets

  const walkBucketTree = (aggIndex, aggregations, aggId, filters, key) => {
    var _aggregations$aggId, _aggWithOtherBucket$p;

    // make sure there are actually results for the buckets
    if (((_aggregations$aggId = aggregations[aggId]) === null || _aggregations$aggId === void 0 ? void 0 : _aggregations$aggId.buckets.length) < 1) {
      noAggBucketResults = true;
      return;
    }

    const agg = aggregations[aggId];
    const newAggIndex = aggIndex + 1;
    const newAgg = bucketAggs[newAggIndex];
    const currentAgg = bucketAggs[aggIndex];

    if (aggIndex === index && agg && agg.sum_other_doc_count > 0) {
      exhaustiveBuckets = false;
    }

    if (aggIndex < index) {
      (0, _lodash.each)(agg.buckets, (bucket, bucketObjKey) => {
        const bucketKey = currentAgg.getKey(bucket, (0, _lodash.isNumber)(bucketObjKey) ? undefined : bucketObjKey);
        const filter = (0, _lodash.cloneDeep)(bucket.filters) || currentAgg.createFilter(bucketKey);
        const newFilters = (0, _lodash.flatten)([...filters, filter]);
        walkBucketTree(newAggIndex, bucket, newAgg.id, newFilters, `${key}${OTHER_BUCKET_SEPARATOR}${bucketKey.toString()}`);
      });
      return;
    }

    const hasScriptedField = !!((_aggWithOtherBucket$p = aggWithOtherBucket.params.field) !== null && _aggWithOtherBucket$p !== void 0 && _aggWithOtherBucket$p.scripted);
    const hasMissingBucket = !!aggWithOtherBucket.params.missingBucket;
    const hasMissingBucketKey = agg.buckets.some(bucket => bucket.key === '__missing__');

    if (aggWithOtherBucket.params.field && !hasScriptedField && (!hasMissingBucket || hasMissingBucketKey)) {
      filters.push((0, _esQuery.buildExistsFilter)(aggWithOtherBucket.params.field, aggWithOtherBucket.aggConfigs.indexPattern));
    } // create not filters for all the buckets


    (0, _lodash.each)(agg.buckets, bucket => {
      if (bucket.key === '__missing__') return;
      const filter = currentAgg.createFilter(currentAgg.getKey(bucket, bucket.key));
      filter.meta.negate = true;
      filters.push(filter);
    });
    resultAgg.filters.filters[key] = {
      bool: (0, _esQuery.buildQueryFromFilters)(filters, indexPattern)
    };
  };

  walkBucketTree(0, response.aggregations, bucketAggs[0].id, [], ''); // bail if there were no bucket results

  if (noAggBucketResults || exhaustiveBuckets) {
    return false;
  }

  return () => {
    return {
      'other-filter': resultAgg
    };
  };
};

exports.buildOtherBucketAgg = buildOtherBucketAgg;

const mergeOtherBucketAggResponse = (aggsConfig, response, otherResponse, otherAgg, requestAgg, otherFilterBuilder) => {
  const updatedResponse = (0, _lodash.cloneDeep)(response);
  (0, _lodash.each)(otherResponse.aggregations['other-filter'].buckets, (bucket, key) => {
    if (!bucket.doc_count || key === undefined) return;
    const bucketKey = key.replace(new RegExp(`^${OTHER_BUCKET_SEPARATOR}`), '');
    const aggResultBuckets = getAggResultBuckets(aggsConfig, updatedResponse.aggregations, otherAgg, bucketKey);
    const otherFilter = otherFilterBuilder(requestAgg, key, otherAgg);
    bucket.filters = [otherFilter];
    bucket.key = '__other__';

    if (aggResultBuckets.some(aggResultBucket => aggResultBucket.key === '__missing__')) {
      bucket.filters.push((0, _esQuery.buildExistsFilter)(otherAgg.params.field, otherAgg.aggConfigs.indexPattern));
    }

    aggResultBuckets.push(bucket);
  });
  return updatedResponse;
};

exports.mergeOtherBucketAggResponse = mergeOtherBucketAggResponse;

const updateMissingBucket = (response, aggConfigs, agg) => {
  const updatedResponse = (0, _lodash.cloneDeep)(response);
  const aggResultBuckets = getAggConfigResultMissingBuckets(updatedResponse.aggregations, agg.id);
  aggResultBuckets.forEach(bucket => {
    bucket.key = '__missing__';
  });
  return updatedResponse;
};

exports.updateMissingBucket = updateMissingBucket;

function constructSingleTermOtherFilter(requestAgg, key, otherAgg) {
  const requestFilterTerms = getOtherAggTerms(requestAgg, key, otherAgg);
  const phraseFilter = (0, _esQuery.buildPhrasesFilter)(otherAgg.params.field, requestFilterTerms, otherAgg.aggConfigs.indexPattern);
  phraseFilter.meta.negate = true;
  return phraseFilter;
}

function constructMultiTermOtherFilter(requestAgg, key) {
  return {
    query: requestAgg['other-filter'].filters.filters[key],
    meta: {}
  };
}

const createOtherBucketPostFlightRequest = otherFilterBuilder => {
  const postFlightRequest = async (resp, aggConfigs, aggConfig, searchSource, inspectorRequestAdapter, abortSignal, searchSessionId) => {
    if (!resp.aggregations) return resp;
    const nestedSearchSource = searchSource.createChild();

    if (aggConfig.params.otherBucket) {
      const filterAgg = buildOtherBucketAgg(aggConfigs, aggConfig, resp);
      if (!filterAgg) return resp;
      nestedSearchSource.setField('aggs', filterAgg);
      const {
        rawResponse: response
      } = await nestedSearchSource.fetch$({
        abortSignal,
        sessionId: searchSessionId,
        inspector: {
          adapter: inspectorRequestAdapter,
          title: _i18n.i18n.translate('data.search.aggs.buckets.terms.otherBucketTitle', {
            defaultMessage: 'Other bucket'
          }),
          description: _i18n.i18n.translate('data.search.aggs.buckets.terms.otherBucketDescription', {
            defaultMessage: 'This request counts the number of documents that fall ' + 'outside the criterion of the data buckets.'
          })
        }
      }).toPromise();
      resp = mergeOtherBucketAggResponse(aggConfigs, resp, response, aggConfig, filterAgg(), otherFilterBuilder);
    }

    if (aggConfig.params.missingBucket) {
      resp = updateMissingBucket(resp, aggConfigs, aggConfig);
    }

    return resp;
  };

  return postFlightRequest;
};

exports.createOtherBucketPostFlightRequest = createOtherBucketPostFlightRequest;