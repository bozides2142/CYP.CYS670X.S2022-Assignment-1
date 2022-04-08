"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSourceRequiredUiSettings = exports.SearchSource = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _esQuery = require("@kbn/es-query");

var _normalize_sort_request = require("./normalize_sort_request");

var _common = require("../../../../kibana_utils/common");

var _ = require("../..");

var _fetch = require("./fetch");

var _inspect = require("./inspect");

var _common2 = require("../../../common");

var _common3 = require("../../../../field_formats/common");

var _extract_references = require("./extract_references");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @name SearchSource
 *
 * @description A promise-based stream of search results that can inherit from other search sources.
 *
 * Because filters/queries in Kibana have different levels of persistence and come from different
 * places, it is important to keep track of where filters come from for when they are saved back to
 * the savedObject store in the Kibana index. To do this, we create trees of searchSource objects
 * that can have associated query parameters (index, query, filter, etc) which can also inherit from
 * other searchSource objects.
 *
 * At query time, all of the searchSource objects that have subscribers are "flattened", at which
 * point the query params from the searchSource are collected while traversing up the inheritance
 * chain. At each link in the chain a decision about how to merge the query params is made until a
 * single set of query parameters is created for each active searchSource (a searchSource with
 * subscribers).
 *
 * That set of query parameters is then sent to elasticsearch. This is how the filter hierarchy
 * works in Kibana.
 *
 * Visualize, starting from a new search:
 *
 *  - the `savedVis.searchSource` is set as the `appSearchSource`.
 *  - The `savedVis.searchSource` would normally inherit from the `appSearchSource`, but now it is
 *    upgraded to inherit from the `rootSearchSource`.
 *  - Any interaction with the visualization will still apply filters to the `appSearchSource`, so
 *    they will be stored directly on the `savedVis.searchSource`.
 *  - Any interaction with the time filter will be written to the `rootSearchSource`, so those
 *    filters will not be saved by the `savedVis`.
 *  - When the `savedVis` is saved to elasticsearch, it takes with it all the filters that are
 *    defined on it directly, but none of the ones that it inherits from other places.
 *
 * Visualize, starting from an existing search:
 *
 *  - The `savedVis` loads the `savedSearch` on which it is built.
 *  - The `savedVis.searchSource` is set to inherit from the `saveSearch.searchSource` and set as
 *    the `appSearchSource`.
 *  - The `savedSearch.searchSource`, is set to inherit from the `rootSearchSource`.
 *  - Then the `savedVis` is written to elasticsearch it will be flattened and only include the
 *    filters created in the visualize application and will reconnect the filters from the
 *    `savedSearch` at runtime to prevent losing the relationship
 *
 * Dashboard search sources:
 *
 *  - Each panel in a dashboard has a search source.
 *  - The `savedDashboard` also has a searchsource, and it is set as the `appSearchSource`.
 *  - Each panel's search source inherits from the `appSearchSource`, meaning that they inherit from
 *    the dashboard search source.
 *  - When a filter is added to the search box, or via a visualization, it is written to the
 *    `appSearchSource`.
 */

/** @internal */
const searchSourceRequiredUiSettings = ['dateFormat:tz', _common2.UI_SETTINGS.COURIER_CUSTOM_REQUEST_PREFERENCE, _common2.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX, _common2.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS, _common2.UI_SETTINGS.COURIER_SET_REQUEST_PREFERENCE, _common2.UI_SETTINGS.DOC_HIGHLIGHT, _common2.UI_SETTINGS.META_FIELDS, _common2.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS, _common2.UI_SETTINGS.QUERY_STRING_OPTIONS, _common2.UI_SETTINGS.SEARCH_INCLUDE_FROZEN, _common2.UI_SETTINGS.SORT_OPTIONS];
exports.searchSourceRequiredUiSettings = searchSourceRequiredUiSettings;

/** @public **/
class SearchSource {
  constructor(fields = {}, dependencies) {
    (0, _defineProperty2.default)(this, "id", (0, _lodash.uniqueId)('data_source'));
    (0, _defineProperty2.default)(this, "shouldOverwriteDataViewType", false);
    (0, _defineProperty2.default)(this, "overwriteDataViewType", void 0);
    (0, _defineProperty2.default)(this, "parent", void 0);
    (0, _defineProperty2.default)(this, "requestStartHandlers", []);
    (0, _defineProperty2.default)(this, "inheritOptions", {});
    (0, _defineProperty2.default)(this, "history", []);
    (0, _defineProperty2.default)(this, "fields", void 0);
    (0, _defineProperty2.default)(this, "dependencies", void 0);
    (0, _defineProperty2.default)(this, "getFieldName", fld => typeof fld === 'string' ? fld : fld.field);
    const {
      parent,
      ...currentFields
    } = fields;
    this.fields = currentFields;
    this.dependencies = dependencies;

    if (parent) {
      this.setParent(new SearchSource(parent, dependencies));
    }
  }
  /** ***
   * PUBLIC API
   *****/

  /**
   * Used to make the search source overwrite the actual data view type for the
   * specific requests done. This should only be needed very rarely, since it means
   * e.g. we'd be treating a rollup index pattern as a regular one. Be very sure
   * you understand the consequences of using this method before using it.
   *
   * @param overwriteType If `false` is passed in it will disable the overwrite, otherwise
   *    the passed in value will be used as the data view type for this search source.
   */


  setOverwriteDataViewType(overwriteType) {
    if (overwriteType === false) {
      this.shouldOverwriteDataViewType = false;
      this.overwriteDataViewType = undefined;
    } else {
      this.shouldOverwriteDataViewType = true;
      this.overwriteDataViewType = overwriteType;
    }
  }
  /**
   * sets value to a single search source field
   * @param field: field name
   * @param value: value for the field
   */


  setField(field, value) {
    if (value == null) {
      return this.removeField(field);
    }

    this.fields[field] = value;
    return this;
  }
  /**
   * remove field
   * @param field: field name
   */


  removeField(field) {
    delete this.fields[field];
    return this;
  }
  /**
   * Internal, do not use. Overrides all search source fields with the new field array.
   *
   * @private
   * @param newFields New field array.
   */


  setFields(newFields) {
    this.fields = newFields;
    return this;
  }
  /**
   * returns search source id
   */


  getId() {
    return this.id;
  }
  /**
   * returns all search source fields
   */


  getFields() {
    return { ...this.fields
    };
  }
  /**
   * Gets a single field from the fields
   */


  getField(field, recurse = true) {
    if (!recurse || this.fields[field] !== void 0) {
      return this.fields[field];
    }

    const parent = this.getParent();
    return parent && parent.getField(field);
  }
  /**
   * Get the field from our own fields, don't traverse up the chain
   */


  getOwnField(field) {
    return this.getField(field, false);
  }
  /**
   * @deprecated Don't use.
   */


  create() {
    return new SearchSource({}, this.dependencies);
  }
  /**
   * creates a copy of this search source (without its children)
   */


  createCopy() {
    const newSearchSource = new SearchSource({}, this.dependencies);
    newSearchSource.setFields({ ...this.fields
    }); // when serializing the internal fields we lose the internal classes used in the index
    // pattern, so we have to set it again to workaround this behavior

    newSearchSource.setField('index', this.getField('index'));
    newSearchSource.setParent(this.getParent());
    return newSearchSource;
  }
  /**
   * creates a new child search source
   * @param options
   */


  createChild(options = {}) {
    const childSearchSource = new SearchSource({}, this.dependencies);
    childSearchSource.setParent(this, options);
    return childSearchSource;
  }
  /**
   * Set a searchSource that this source should inherit from
   * @param  {SearchSource} parent - the parent searchSource
   * @param  {SearchSourceOptions} options - the inherit options
   * @return {this} - chainable
   */


  setParent(parent, options = {}) {
    this.parent = parent;
    this.inheritOptions = options;
    return this;
  }
  /**
   * Get the parent of this SearchSource
   * @return {undefined|searchSource}
   */


  getParent() {
    return this.parent;
  }
  /**
   * Fetch this source from Elasticsearch, returning an observable over the response(s)
   * @param options
   */


  fetch$(options = {}) {
    const s$ = (0, _rxjs.defer)(() => this.requestIsStarting(options)).pipe((0, _operators.switchMap)(() => {
      const searchRequest = this.flatten();
      this.history = [searchRequest];

      if (searchRequest.index) {
        options.indexPattern = searchRequest.index;
      }

      return this.fetchSearch$(searchRequest, options);
    }), (0, _operators.tap)(response => {
      // TODO: Remove casting when https://github.com/elastic/elasticsearch-js/issues/1287 is resolved
      if (!response || response.error) {
        throw new _fetch.RequestFailure(null, response);
      }
    }), (0, _operators.shareReplay)());
    return this.inspectSearch(s$, options);
  }
  /**
   * Fetch this source and reject the returned Promise on error
   * @deprecated Use the `fetch$` method instead
   * @removeBy 8.1
   */


  fetch(options = {}) {
    return this.fetch$(options).toPromise().then(r => {
      return r.rawResponse;
    });
  }
  /**
   *  Add a handler that will be notified whenever requests start
   *  @param  {Function} handler
   *  @return {undefined}
   */


  onRequestStart(handler) {
    this.requestStartHandlers.push(handler);
  }
  /**
   * Returns body contents of the search request, often referred as query DSL.
   */


  getSearchRequestBody() {
    return this.flatten().body;
  }
  /**
   * Completely destroy the SearchSource.
   * @return {undefined}
   */


  destroy() {
    this.requestStartHandlers.length = 0;
  }
  /** ****
   * PRIVATE APIS
   ******/


  inspectSearch(s$, options) {
    const {
      id,
      title,
      description,
      adapter
    } = options.inspector || {
      title: ''
    };
    const requestResponder = adapter === null || adapter === void 0 ? void 0 : adapter.start(title, {
      id,
      description,
      searchSessionId: options.sessionId
    });

    const trackRequestBody = () => {
      try {
        requestResponder === null || requestResponder === void 0 ? void 0 : requestResponder.json(this.getSearchRequestBody());
      } catch (e) {} // eslint-disable-line no-empty

    }; // Track request stats on first emit, swallow errors


    const first$ = s$.pipe((0, _operators.first)(undefined, null), (0, _operators.tap)(() => {
      requestResponder === null || requestResponder === void 0 ? void 0 : requestResponder.stats((0, _inspect.getRequestInspectorStats)(this));
      trackRequestBody();
    }), (0, _operators.catchError)(() => {
      trackRequestBody();
      return _rxjs.EMPTY;
    }), (0, _operators.finalize)(() => {
      first$.unsubscribe();
    })).subscribe(); // Track response stats on last emit, as well as errors

    const last$ = s$.pipe((0, _operators.catchError)(e => {
      requestResponder === null || requestResponder === void 0 ? void 0 : requestResponder.error({
        json: e
      });
      return _rxjs.EMPTY;
    }), (0, _operators.last)(undefined, null), (0, _operators.tap)(finalResponse => {
      if (finalResponse) {
        requestResponder === null || requestResponder === void 0 ? void 0 : requestResponder.stats((0, _inspect.getResponseInspectorStats)(finalResponse.rawResponse, this));
        requestResponder === null || requestResponder === void 0 ? void 0 : requestResponder.ok({
          json: finalResponse
        });
      }
    }), (0, _operators.finalize)(() => {
      last$.unsubscribe();
    })).subscribe();
    return s$;
  }

  hasPostFlightRequests() {
    const aggs = this.getField('aggs');

    if (aggs instanceof _.AggConfigs) {
      return aggs.aggs.some(agg => agg.enabled && typeof agg.type.postFlightRequest === 'function');
    } else {
      return false;
    }
  }

  postFlightTransform(response) {
    const aggs = this.getField('aggs');

    if (aggs instanceof _.AggConfigs) {
      return aggs.postFlightTransform(response);
    } else {
      return response;
    }
  }

  async fetchOthers(response, options) {
    const aggs = this.getField('aggs');

    if (aggs instanceof _.AggConfigs) {
      for (const agg of aggs.aggs) {
        if (agg.enabled && typeof agg.type.postFlightRequest === 'function') {
          var _options$inspector;

          response = await agg.type.postFlightRequest(response, aggs, agg, this, (_options$inspector = options.inspector) === null || _options$inspector === void 0 ? void 0 : _options$inspector.adapter, options.abortSignal, options.sessionId);
        }
      }
    }

    return response;
  }
  /**
   * Run a search using the search service
   * @return {Observable<SearchResponse<any>>}
   */


  fetchSearch$(searchRequest, options) {
    const {
      search,
      getConfig,
      onResponse
    } = this.dependencies;
    const params = (0, _fetch.getSearchParamsFromRequest)(searchRequest, {
      getConfig
    });
    return search({
      params,
      indexType: searchRequest.indexType
    }, options).pipe((0, _operators.switchMap)(response => {
      return new _rxjs.Observable(obs => {
        if ((0, _common2.isErrorResponse)(response)) {
          obs.error(response);
        } else if ((0, _common2.isPartialResponse)(response)) {
          obs.next(this.postFlightTransform(response));
        } else {
          if (!this.hasPostFlightRequests()) {
            obs.next(this.postFlightTransform(response));
            obs.complete();
          } else {
            // Treat the complete response as partial, then run the postFlightRequests.
            obs.next({ ...this.postFlightTransform(response),
              isPartial: true,
              isRunning: true
            });
            const sub = (0, _rxjs.from)(this.fetchOthers(response.rawResponse, options)).subscribe({
              next: responseWithOther => {
                obs.next(this.postFlightTransform({ ...response,
                  rawResponse: responseWithOther
                }));
              },
              error: e => {
                obs.error(e);
                sub.unsubscribe();
              },
              complete: () => {
                obs.complete();
                sub.unsubscribe();
              }
            });
          }
        }
      });
    }), (0, _operators.map)(response => onResponse(searchRequest, response)));
  }
  /**
   *  Called by requests of this search source when they are started
   *  @param options
   *  @return {Promise<undefined>}
   */


  requestIsStarting(options = {}) {
    const handlers = [...this.requestStartHandlers]; // If callParentStartHandlers has been set to true, we also call all
    // handlers of parent search sources.

    if (this.inheritOptions.callParentStartHandlers) {
      let searchSource = this.getParent();

      while (searchSource) {
        handlers.push(...searchSource.requestStartHandlers);
        searchSource = searchSource.getParent();
      }
    }

    return Promise.all(handlers.map(fn => fn(this, options)));
  }
  /**
   * Used to merge properties into the data within ._flatten().
   * The data is passed in and modified by the function
   *
   * @param  {object} data - the current merged data
   * @param  {*} val - the value at `key`
   * @param  {*} key - The key of `val`
   * @return {undefined}
   */


  mergeProp(data, val, key) {
    val = typeof val === 'function' ? val(this) : val;
    if (val == null || !key) return;

    const addToRoot = (rootKey, value) => {
      data[rootKey] = value;
    };
    /**
     * Add the key and val to the body of the request
     */


    const addToBody = (bodyKey, value) => {
      // ignore if we already have a value
      if (data.body[bodyKey] == null) {
        data.body[bodyKey] = value;
      }
    };

    const {
      getConfig
    } = this.dependencies;

    switch (key) {
      case 'filter':
        return addToRoot('filters', (data.filters || []).concat(val));

      case 'query':
        return addToRoot(key, (data[key] || []).concat(val));

      case 'fields':
        // This will pass the passed in parameters to the new fields API.
        // Also if will only return scripted fields that are part of the specified
        // array of fields. If you specify the wildcard `*` as an array element
        // the fields API will return all fields, and all scripted fields will be returned.
        // NOTE: While the fields API supports wildcards within names, e.g. `user.*`
        //       scripted fields won't be considered for this.
        return addToBody('fields', val);

      case 'fieldsFromSource':
        // preserves legacy behavior
        const fields = [...new Set((data[key] || []).concat(val))];
        return addToRoot(key, fields);

      case 'index':
      case 'type':
      case 'highlightAll':
        return key && data[key] == null && addToRoot(key, val);

      case 'searchAfter':
        return addToBody('search_after', val);

      case 'trackTotalHits':
        return addToBody('track_total_hits', val);

      case 'source':
        return addToBody('_source', val);

      case 'sort':
        const sort = (0, _normalize_sort_request.normalizeSortRequest)(val, this.getField('index'), getConfig(_common2.UI_SETTINGS.SORT_OPTIONS));
        return addToBody(key, sort);

      case 'aggs':
        if (val instanceof _.AggConfigs) {
          return addToBody('aggs', val.toDsl());
        } else {
          return addToBody('aggs', val);
        }

      default:
        return addToBody(key, val);
    }
  }
  /**
   * Walk the inheritance chain of a source and return its
   * flat representation (taking into account merging rules)
   * @returns {Promise}
   * @resolved {Object|null} - the flat data of the SearchSource
   */


  mergeProps(root = this, searchRequest = {
    body: {}
  }) {
    Object.entries(this.fields).forEach(([key, value]) => {
      this.mergeProp(searchRequest, value, key);
    });

    if (this.parent) {
      this.parent.mergeProps(root, searchRequest);
    }

    return searchRequest;
  }

  getIndexType(index) {
    return this.shouldOverwriteDataViewType ? this.overwriteDataViewType : index === null || index === void 0 ? void 0 : index.type;
  }

  getFieldsWithoutSourceFilters(index, bodyFields) {
    var _sourceFilters$exclud;

    if (!index) {
      return bodyFields;
    }

    const {
      fields
    } = index;
    const sourceFilters = index.getSourceFiltering();

    if (!sourceFilters || ((_sourceFilters$exclud = sourceFilters.excludes) === null || _sourceFilters$exclud === void 0 ? void 0 : _sourceFilters$exclud.length) === 0 || bodyFields.length === 0) {
      return bodyFields;
    }

    const sourceFiltersValues = sourceFilters.excludes;
    const wildcardField = bodyFields.find(el => el === '*' || el.field === '*');
    const filter = (0, _common.fieldWildcardFilter)(sourceFiltersValues, this.dependencies.getConfig(_common2.UI_SETTINGS.META_FIELDS));

    const filterSourceFields = fieldName => fieldName && filter(fieldName);

    if (!wildcardField) {
      // we already have an explicit list of fields, so we just remove source filters from that list
      return bodyFields.filter(fld => filterSourceFields(this.getFieldName(fld)));
    } // we need to get the list of fields from an index pattern


    return fields.filter(fld => filterSourceFields(fld.name)).map(fld => ({
      field: fld.name
    }));
  }

  getFieldFromDocValueFieldsOrIndexPattern(docvaluesIndex, fld, index) {
    if (typeof fld === 'string') {
      return fld;
    }

    const fieldName = this.getFieldName(fld);
    const field = { ...docvaluesIndex[fieldName],
      ...fld
    };

    if (!index) {
      return field;
    }

    const {
      fields
    } = index;
    const dateFields = fields.getByType('date');
    const dateField = dateFields.find(indexPatternField => indexPatternField.name === fieldName);

    if (!dateField) {
      return field;
    }

    const {
      esTypes
    } = dateField;

    if (esTypes !== null && esTypes !== void 0 && esTypes.includes('date_nanos')) {
      field.format = 'strict_date_optional_time_nanos';
    } else if (esTypes !== null && esTypes !== void 0 && esTypes.includes('date')) {
      field.format = 'strict_date_optional_time';
    }

    return field;
  }

  flatten() {
    var _getConfig, _body$sort;

    const {
      getConfig
    } = this.dependencies;
    const searchRequest = this.mergeProps();
    searchRequest.body = searchRequest.body || {};
    const {
      body,
      index,
      query,
      filters,
      highlightAll
    } = searchRequest;
    searchRequest.indexType = this.getIndexType(index);
    const metaFields = (_getConfig = getConfig(_common2.UI_SETTINGS.META_FIELDS)) !== null && _getConfig !== void 0 ? _getConfig : []; // get some special field types from the index pattern

    const {
      docvalueFields,
      scriptFields,
      storedFields,
      runtimeFields
    } = index ? index.getComputedFields() : {
      docvalueFields: [],
      scriptFields: {},
      storedFields: ['*'],
      runtimeFields: {}
    };
    const fieldListProvided = !!body.fields; // set defaults

    let fieldsFromSource = searchRequest.fieldsFromSource || [];
    body.fields = body.fields || [];
    body.script_fields = { ...body.script_fields,
      ...scriptFields
    };
    body.stored_fields = storedFields;
    body.runtime_mappings = runtimeFields || {}; // apply source filters from index pattern if specified by the user

    let filteredDocvalueFields = docvalueFields;

    if (index) {
      const sourceFilters = index.getSourceFiltering();

      if (!body.hasOwnProperty('_source')) {
        body._source = sourceFilters;
      }

      const filter = (0, _common.fieldWildcardFilter)(body._source.excludes, metaFields); // also apply filters to provided fields & default docvalueFields

      body.fields = body.fields.filter(fld => filter(this.getFieldName(fld)));
      fieldsFromSource = fieldsFromSource.filter(fld => filter(this.getFieldName(fld)));
      filteredDocvalueFields = filteredDocvalueFields.filter(fld => filter(this.getFieldName(fld)));
    } // specific fields were provided, so we need to exclude any others


    if (fieldListProvided || fieldsFromSource.length) {
      const bodyFieldNames = body.fields.map(field => this.getFieldName(field));
      const uniqFieldNames = [...new Set([...bodyFieldNames, ...fieldsFromSource])];

      if (!uniqFieldNames.includes('*')) {
        // filter down script_fields to only include items specified
        body.script_fields = (0, _lodash.pick)(body.script_fields, Object.keys(body.script_fields).filter(f => uniqFieldNames.includes(f)));
      } // request the remaining fields from stored_fields just in case, since the
      // fields API does not handle stored fields


      const remainingFields = (0, _lodash.difference)(uniqFieldNames, [...Object.keys(body.script_fields), ...Object.keys(body.runtime_mappings)]).filter(remainingField => {
        if (!remainingField) return false;
        if (!body._source || !body._source.excludes) return true;
        return !body._source.excludes.includes(remainingField);
      });
      body.stored_fields = [...new Set(remainingFields)]; // only include unique values

      if (fieldsFromSource.length) {
        if (!(0, _lodash.isEqual)(remainingFields, fieldsFromSource)) {
          (0, _saferLodashSet.setWith)(body, '_source.includes', remainingFields, nsValue => (0, _lodash.isObject)(nsValue) ? {} : nsValue);
        } // if items that are in the docvalueFields are provided, we should
        // make sure those are added to the fields API unless they are
        // already set in docvalue_fields


        body.fields = [...body.fields, ...filteredDocvalueFields.filter(fld => {
          return fieldsFromSource.includes(this.getFieldName(fld)) && !(body.docvalue_fields || []).map(d => this.getFieldName(d)).includes(this.getFieldName(fld));
        })]; // delete fields array if it is still set to the empty default

        if (!fieldListProvided && body.fields.length === 0) delete body.fields;
      } else {
        // remove _source, since everything's coming from fields API, scripted, or stored fields
        body._source = false; // if items that are in the docvalueFields are provided, we should
        // inject the format from the computed fields if one isn't given

        const docvaluesIndex = (0, _lodash.keyBy)(filteredDocvalueFields, 'field');
        const bodyFields = this.getFieldsWithoutSourceFilters(index, body.fields);
        body.fields = (0, _lodash.uniqWith)(bodyFields.concat(filteredDocvalueFields), (fld1, fld2) => {
          const field1Name = this.getFieldName(fld1);
          const field2Name = this.getFieldName(fld2);
          return field1Name === field2Name;
        }).filter(fld => {
          return !metaFields.includes(this.getFieldName(fld));
        }).map(fld => {
          const fieldName = this.getFieldName(fld);

          if (Object.keys(docvaluesIndex).includes(fieldName)) {
            // either provide the field object from computed docvalues,
            // or merge the user-provided field with the one in docvalues
            return typeof fld === 'string' ? docvaluesIndex[fld] : this.getFieldFromDocValueFieldsOrIndexPattern(docvaluesIndex, fld, index);
          }

          return fld;
        });
      }
    } else {
      body.fields = filteredDocvalueFields;
    } // If sorting by _score, build queries in the "must" clause instead of "filter" clause to enable scoring


    const filtersInMustClause = ((_body$sort = body.sort) !== null && _body$sort !== void 0 ? _body$sort : []).some(sort => sort.hasOwnProperty('_score'));
    const esQueryConfigs = { ...(0, _common2.getEsQueryConfig)({
        get: getConfig
      }),
      filtersInMustClause
    };
    body.query = (0, _esQuery.buildEsQuery)(index, query, filters, esQueryConfigs);

    if (highlightAll && body.query) {
      body.highlight = (0, _common3.getHighlightRequest)(getConfig(_common2.UI_SETTINGS.DOC_HIGHLIGHT));
      delete searchRequest.highlightAll;
    }

    return searchRequest;
  }
  /**
   * serializes search source fields (which can later be passed to {@link ISearchStartSearchSource})
   */


  getSerializedFields(recurse = false) {
    const {
      filter: originalFilters,
      aggs: searchSourceAggs,
      parent,
      size: omit,
      sort,
      index,
      ...searchSourceFields
    } = this.getFields();
    let serializedSearchSourceFields = { ...searchSourceFields
    };

    if (index) {
      serializedSearchSourceFields.index = index.id;
    }

    if (sort) {
      serializedSearchSourceFields.sort = !Array.isArray(sort) ? [sort] : sort;
    }

    if (originalFilters) {
      const filters = this.getFilters(originalFilters);
      serializedSearchSourceFields = { ...serializedSearchSourceFields,
        filter: filters
      };
    }

    if (searchSourceAggs) {
      let aggs = searchSourceAggs;

      if (typeof aggs === 'function') {
        aggs = searchSourceAggs();
      }

      if (aggs instanceof _.AggConfigs) {
        serializedSearchSourceFields.aggs = aggs.getAll().map(agg => agg.serialize());
      } else {
        serializedSearchSourceFields.aggs = aggs;
      }
    }

    if (recurse && this.getParent()) {
      serializedSearchSourceFields.parent = this.getParent().getSerializedFields(recurse);
    }

    return serializedSearchSourceFields;
  }
  /**
   * Serializes the instance to a JSON string and a set of referenced objects.
   * Use this method to get a representation of the search source which can be stored in a saved object.
   *
   * The references returned by this function can be mixed with other references in the same object,
   * however make sure there are no name-collisions. The references will be named `kibanaSavedObjectMeta.searchSourceJSON.index`
   * and `kibanaSavedObjectMeta.searchSourceJSON.filter[<number>].meta.index`.
   *
   * Using `createSearchSource`, the instance can be re-created.
   * @public */


  serialize() {
    const [searchSourceFields, references] = (0, _extract_references.extractReferences)(this.getSerializedFields());
    return {
      searchSourceJSON: JSON.stringify(searchSourceFields),
      references
    };
  }

  getFilters(filterField) {
    if (!filterField) {
      return [];
    }

    if (Array.isArray(filterField)) {
      return filterField;
    }

    if ((0, _lodash.isFunction)(filterField)) {
      return this.getFilters(filterField());
    }

    return [filterField];
  }

}

exports.SearchSource = SearchSource;