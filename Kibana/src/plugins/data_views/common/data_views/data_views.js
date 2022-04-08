"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternsService = exports.DataViewsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _fieldTypes = require("@kbn/field-types");

var _ = require("..");

var _2 = require(".");

var _data_view = require("./data_view");

var _ensure_default_data_view = require("./ensure_default_data_view");

var _common = require("../../../field_formats/common/");

var _common2 = require("../../common");

var _common3 = require("../../../kibana_utils/common");

var _lib = require("../lib");

var _utils = require("../utils");

var _errors = require("../errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
const MAX_ATTEMPTS_TO_RESOLVE_CONFLICTS = 3;

class DataViewsService {
  /**
   * @deprecated Use `getDefaultDataView` instead (when loading data view) and handle
   *             'no data view' case in api consumer code - no more auto redirect
   */
  constructor({
    uiSettings,
    savedObjectsClient,
    apiClient,
    fieldFormats,
    onNotification,
    onError,
    onRedirectNoIndexPattern = () => {},
    getCanSave = () => Promise.resolve(false)
  }) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsCache", void 0);
    (0, _defineProperty2.default)(this, "apiClient", void 0);
    (0, _defineProperty2.default)(this, "fieldFormats", void 0);
    (0, _defineProperty2.default)(this, "onNotification", void 0);
    (0, _defineProperty2.default)(this, "onError", void 0);
    (0, _defineProperty2.default)(this, "dataViewCache", void 0);
    (0, _defineProperty2.default)(this, "getCanSave", void 0);
    (0, _defineProperty2.default)(this, "ensureDefaultDataView", void 0);
    (0, _defineProperty2.default)(this, "getIds", async (refresh = false) => {
      if (!this.savedObjectsCache || refresh) {
        await this.refreshSavedObjectsCache();
      }

      if (!this.savedObjectsCache) {
        return [];
      }

      return this.savedObjectsCache.map(obj => obj === null || obj === void 0 ? void 0 : obj.id);
    });
    (0, _defineProperty2.default)(this, "getTitles", async (refresh = false) => {
      if (!this.savedObjectsCache || refresh) {
        await this.refreshSavedObjectsCache();
      }

      if (!this.savedObjectsCache) {
        return [];
      }

      return this.savedObjectsCache.map(obj => {
        var _obj$attributes;

        return obj === null || obj === void 0 ? void 0 : (_obj$attributes = obj.attributes) === null || _obj$attributes === void 0 ? void 0 : _obj$attributes.title;
      });
    });
    (0, _defineProperty2.default)(this, "find", async (search, size = 10) => {
      const savedObjects = await this.savedObjectsClient.find({
        type: _.DATA_VIEW_SAVED_OBJECT_TYPE,
        fields: ['title'],
        search,
        searchFields: ['title'],
        perPage: size
      });
      const getIndexPatternPromises = savedObjects.map(async savedObject => {
        return await this.get(savedObject.id);
      });
      return await Promise.all(getIndexPatternPromises);
    });
    (0, _defineProperty2.default)(this, "getIdsWithTitle", async (refresh = false) => {
      if (!this.savedObjectsCache || refresh) {
        await this.refreshSavedObjectsCache();
      }

      if (!this.savedObjectsCache) {
        return [];
      }

      return this.savedObjectsCache.map(obj => {
        var _obj$attributes2, _obj$attributes3, _obj$attributes4, _obj$attributes5;

        return {
          id: obj === null || obj === void 0 ? void 0 : obj.id,
          title: obj === null || obj === void 0 ? void 0 : (_obj$attributes2 = obj.attributes) === null || _obj$attributes2 === void 0 ? void 0 : _obj$attributes2.title,
          type: obj === null || obj === void 0 ? void 0 : (_obj$attributes3 = obj.attributes) === null || _obj$attributes3 === void 0 ? void 0 : _obj$attributes3.type,
          typeMeta: (obj === null || obj === void 0 ? void 0 : (_obj$attributes4 = obj.attributes) === null || _obj$attributes4 === void 0 ? void 0 : _obj$attributes4.typeMeta) && JSON.parse(obj === null || obj === void 0 ? void 0 : (_obj$attributes5 = obj.attributes) === null || _obj$attributes5 === void 0 ? void 0 : _obj$attributes5.typeMeta)
        };
      });
    });
    (0, _defineProperty2.default)(this, "clearCache", id => {
      this.savedObjectsCache = null;

      if (id) {
        this.dataViewCache.clear(id);
      } else {
        this.dataViewCache.clearAll();
      }
    });
    (0, _defineProperty2.default)(this, "getCache", async () => {
      if (!this.savedObjectsCache) {
        await this.refreshSavedObjectsCache();
      }

      return this.savedObjectsCache;
    });
    (0, _defineProperty2.default)(this, "getDefault", async () => {
      const defaultIndexPatternId = await this.getDefaultId();

      if (defaultIndexPatternId) {
        return await this.get(defaultIndexPatternId);
      }

      return null;
    });
    (0, _defineProperty2.default)(this, "getDefaultId", async () => {
      const defaultIndexPatternId = await this.config.get('defaultIndex');
      return defaultIndexPatternId !== null && defaultIndexPatternId !== void 0 ? defaultIndexPatternId : null;
    });
    (0, _defineProperty2.default)(this, "setDefault", async (id, force = false) => {
      if (force || !(await this.config.get('defaultIndex'))) {
        await this.config.set('defaultIndex', id);
      }
    });
    (0, _defineProperty2.default)(this, "getFieldsForWildcard", async options => {
      const metaFields = await this.config.get(_common2.META_FIELDS);
      return this.apiClient.getFieldsForWildcard({
        pattern: options.pattern,
        metaFields,
        type: options.type,
        rollupIndex: options.rollupIndex,
        allowNoIndex: options.allowNoIndex,
        filter: options.filter
      });
    });
    (0, _defineProperty2.default)(this, "getFieldsForIndexPattern", async (indexPattern, options) => {
      var _indexPattern$typeMet, _indexPattern$typeMet2;

      return this.getFieldsForWildcard({
        type: indexPattern.type,
        rollupIndex: indexPattern === null || indexPattern === void 0 ? void 0 : (_indexPattern$typeMet = indexPattern.typeMeta) === null || _indexPattern$typeMet === void 0 ? void 0 : (_indexPattern$typeMet2 = _indexPattern$typeMet.params) === null || _indexPattern$typeMet2 === void 0 ? void 0 : _indexPattern$typeMet2.rollup_index,
        ...options,
        pattern: indexPattern.title
      });
    });
    (0, _defineProperty2.default)(this, "refreshFields", async indexPattern => {
      try {
        const fields = await this.getFieldsForIndexPattern(indexPattern);
        fields.forEach(field => field.isMapped = true);
        const scripted = indexPattern.getScriptedFields().map(field => field.spec);
        const fieldAttrs = indexPattern.getFieldAttrs();
        const fieldsWithSavedAttrs = Object.values(this.fieldArrayToMap([...fields, ...scripted], fieldAttrs));
        indexPattern.fields.replaceAll(fieldsWithSavedAttrs);
      } catch (err) {
        if (err instanceof _lib.DataViewMissingIndices) {
          this.onNotification({
            title: err.message,
            color: 'danger',
            iconType: 'alert'
          });
        }

        this.onError(err, {
          title: _i18n.i18n.translate('dataViews.fetchFieldErrorTitle', {
            defaultMessage: 'Error fetching fields for data view {title} (ID: {id})',
            values: {
              id: indexPattern.id,
              title: indexPattern.title
            }
          })
        });
      }
    });
    (0, _defineProperty2.default)(this, "refreshFieldSpecMap", async (fields, id, title, options, fieldAttrs = {}) => {
      const fieldsAsArr = Object.values(fields);
      const scriptedFields = fieldsAsArr.filter(field => field.scripted);

      try {
        let updatedFieldList;
        const newFields = await this.getFieldsForWildcard(options);
        newFields.forEach(field => field.isMapped = true); // If allowNoIndex, only update field list if field caps finds fields. To support
        // beats creating index pattern and dashboard before docs

        if (!options.allowNoIndex || newFields && newFields.length > 5) {
          updatedFieldList = [...newFields, ...scriptedFields];
        } else {
          updatedFieldList = fieldsAsArr;
        }

        return this.fieldArrayToMap(updatedFieldList, fieldAttrs);
      } catch (err) {
        if (err instanceof _lib.DataViewMissingIndices) {
          this.onNotification({
            title: err.message,
            color: 'danger',
            iconType: 'alert'
          });
          return {};
        }

        this.onError(err, {
          title: _i18n.i18n.translate('dataViews.fetchFieldErrorTitle', {
            defaultMessage: 'Error fetching fields for data view {title} (ID: {id})',
            values: {
              id,
              title
            }
          })
        });
        throw err;
      }
    });
    (0, _defineProperty2.default)(this, "fieldArrayToMap", (fields, fieldAttrs) => fields.reduce((collector, field) => {
      var _fieldAttrs$field$nam, _fieldAttrs$field$nam2;

      collector[field.name] = { ...field,
        customLabel: fieldAttrs === null || fieldAttrs === void 0 ? void 0 : (_fieldAttrs$field$nam = fieldAttrs[field.name]) === null || _fieldAttrs$field$nam === void 0 ? void 0 : _fieldAttrs$field$nam.customLabel,
        count: fieldAttrs === null || fieldAttrs === void 0 ? void 0 : (_fieldAttrs$field$nam2 = fieldAttrs[field.name]) === null || _fieldAttrs$field$nam2 === void 0 ? void 0 : _fieldAttrs$field$nam2.count
      };
      return collector;
    }, {}));
    (0, _defineProperty2.default)(this, "savedObjectToSpec", savedObject => {
      const {
        id,
        version,
        attributes: {
          title,
          timeFieldName,
          fields,
          sourceFilters,
          fieldFormatMap,
          runtimeFieldMap,
          typeMeta,
          type,
          fieldAttrs,
          allowNoIndex
        }
      } = savedObject;
      const parsedSourceFilters = sourceFilters ? JSON.parse(sourceFilters) : undefined;
      const parsedTypeMeta = typeMeta ? JSON.parse(typeMeta) : undefined;
      const parsedFieldFormatMap = fieldFormatMap ? JSON.parse(fieldFormatMap) : {};
      const parsedFields = fields ? JSON.parse(fields) : [];
      const parsedFieldAttrs = fieldAttrs ? JSON.parse(fieldAttrs) : {};
      const parsedRuntimeFieldMap = runtimeFieldMap ? JSON.parse(runtimeFieldMap) : {};
      return {
        id,
        version,
        title,
        timeFieldName,
        sourceFilters: parsedSourceFilters,
        fields: this.fieldArrayToMap(parsedFields, parsedFieldAttrs),
        typeMeta: parsedTypeMeta,
        type,
        fieldFormats: parsedFieldFormatMap,
        fieldAttrs: parsedFieldAttrs,
        allowNoIndex,
        runtimeFieldMap: parsedRuntimeFieldMap
      };
    });
    (0, _defineProperty2.default)(this, "getSavedObjectAndInit", async id => {
      const savedObject = await this.savedObjectsClient.get(_.DATA_VIEW_SAVED_OBJECT_TYPE, id);

      if (!savedObject.version) {
        throw new _common3.SavedObjectNotFound('data view', id, 'management/kibana/dataViews');
      }

      return this.initFromSavedObject(savedObject);
    });
    (0, _defineProperty2.default)(this, "initFromSavedObject", async savedObject => {
      const spec = this.savedObjectToSpec(savedObject);
      const {
        title,
        type,
        typeMeta,
        runtimeFieldMap
      } = spec;
      spec.fieldAttrs = savedObject.attributes.fieldAttrs ? JSON.parse(savedObject.attributes.fieldAttrs) : {};

      try {
        var _typeMeta$params;

        spec.fields = await this.refreshFieldSpecMap(spec.fields || {}, savedObject.id, spec.title, {
          pattern: title,
          metaFields: await this.config.get(_common2.META_FIELDS),
          type,
          rollupIndex: typeMeta === null || typeMeta === void 0 ? void 0 : (_typeMeta$params = typeMeta.params) === null || _typeMeta$params === void 0 ? void 0 : _typeMeta$params.rollup_index,
          allowNoIndex: spec.allowNoIndex
        }, spec.fieldAttrs); // CREATE RUNTIME FIELDS

        for (const [key, value] of Object.entries(runtimeFieldMap || {})) {
          // do not create runtime field if mapped field exists
          if (!spec.fields[key]) {
            var _spec$fieldAttrs, _spec$fieldAttrs$key, _spec$fieldAttrs2, _spec$fieldAttrs2$key;

            spec.fields[key] = {
              name: key,
              type: (0, _fieldTypes.castEsToKbnFieldTypeName)(value.type),
              runtimeField: value,
              aggregatable: true,
              searchable: true,
              readFromDocValues: false,
              customLabel: (_spec$fieldAttrs = spec.fieldAttrs) === null || _spec$fieldAttrs === void 0 ? void 0 : (_spec$fieldAttrs$key = _spec$fieldAttrs[key]) === null || _spec$fieldAttrs$key === void 0 ? void 0 : _spec$fieldAttrs$key.customLabel,
              count: (_spec$fieldAttrs2 = spec.fieldAttrs) === null || _spec$fieldAttrs2 === void 0 ? void 0 : (_spec$fieldAttrs2$key = _spec$fieldAttrs2[key]) === null || _spec$fieldAttrs2$key === void 0 ? void 0 : _spec$fieldAttrs2$key.count
            };
          }
        }
      } catch (err) {
        if (err instanceof _lib.DataViewMissingIndices) {
          this.onNotification({
            title: err.message,
            color: 'danger',
            iconType: 'alert'
          });
        } else {
          this.onError(err, {
            title: _i18n.i18n.translate('dataViews.fetchFieldErrorTitle', {
              defaultMessage: 'Error fetching fields for data view {title} (ID: {id})',
              values: {
                id: savedObject.id,
                title
              }
            })
          });
        }
      }

      spec.fieldFormats = savedObject.attributes.fieldFormatMap ? JSON.parse(savedObject.attributes.fieldFormatMap) : {};
      const indexPattern = await this.create(spec, true);
      indexPattern.resetOriginalSavedObjectBody();
      return indexPattern;
    });
    (0, _defineProperty2.default)(this, "get", async id => {
      const indexPatternPromise = this.dataViewCache.get(id) || this.dataViewCache.set(id, this.getSavedObjectAndInit(id)); // don't cache failed requests

      indexPatternPromise.catch(() => {
        this.dataViewCache.clear(id);
      });
      return indexPatternPromise;
    });
    this.apiClient = apiClient;
    this.config = uiSettings;
    this.savedObjectsClient = savedObjectsClient;
    this.fieldFormats = fieldFormats;
    this.onNotification = onNotification;
    this.onError = onError;
    this.ensureDefaultDataView = (0, _ensure_default_data_view.createEnsureDefaultDataView)(uiSettings, onRedirectNoIndexPattern);
    this.getCanSave = getCanSave;
    this.dataViewCache = (0, _2.createDataViewCache)();
  }
  /**
   * Refresh cache of index pattern ids and titles
   */


  async refreshSavedObjectsCache() {
    const so = await this.savedObjectsClient.find({
      type: _.DATA_VIEW_SAVED_OBJECT_TYPE,
      fields: ['title', 'type', 'typeMeta'],
      perPage: 10000
    });
    this.savedObjectsCache = so;
  }
  /**
   * Get list of index pattern ids
   * @param refresh Force refresh of index pattern list
   */


  /**
   * Checks if current user has a user created index pattern ignoring fleet's server default index patterns
   */
  async hasUserDataView() {
    return this.apiClient.hasUserIndexPattern();
  }
  /**
   * Get field list by providing { pattern }
   * @param options
   * @returns FieldSpec[]
   */


  /**
   * Create a new index pattern instance
   * @param spec
   * @param skipFetchFields
   * @returns IndexPattern
   */
  async create(spec, skipFetchFields = false) {
    const shortDotsEnable = await this.config.get(_common.FORMATS_UI_SETTINGS.SHORT_DOTS_ENABLE);
    const metaFields = await this.config.get(_common2.META_FIELDS);
    const indexPattern = new _data_view.DataView({
      spec,
      fieldFormats: this.fieldFormats,
      shortDotsEnable,
      metaFields
    });

    if (!skipFetchFields) {
      await this.refreshFields(indexPattern);
    }

    return indexPattern;
  }
  /**
   * Create a new index pattern and save it right away
   * @param spec
   * @param override Overwrite if existing index pattern exists.
   * @param skipFetchFields Whether to skip field refresh step.
   */


  async createAndSave(spec, override = false, skipFetchFields = false) {
    const indexPattern = await this.create(spec, skipFetchFields);
    const createdIndexPattern = await this.createSavedObject(indexPattern, override);
    await this.setDefault(createdIndexPattern.id);
    return createdIndexPattern;
  }
  /**
   * Save a new index pattern
   * @param indexPattern
   * @param override Overwrite if existing index pattern exists
   */


  async createSavedObject(indexPattern, override = false) {
    if (!(await this.getCanSave())) {
      throw new _errors.DataViewInsufficientAccessError();
    }

    const dupe = await (0, _utils.findByTitle)(this.savedObjectsClient, indexPattern.title);

    if (dupe) {
      if (override) {
        await this.delete(dupe.id);
      } else {
        throw new _errors.DuplicateDataViewError(`Duplicate index pattern: ${indexPattern.title}`);
      }
    }

    const body = indexPattern.getAsSavedObjectBody();
    const response = await this.savedObjectsClient.create(_.DATA_VIEW_SAVED_OBJECT_TYPE, body, {
      id: indexPattern.id
    });
    const createdIndexPattern = await this.initFromSavedObject(response);
    this.dataViewCache.set(createdIndexPattern.id, Promise.resolve(createdIndexPattern));

    if (this.savedObjectsCache) {
      this.savedObjectsCache.push(response);
    }

    return createdIndexPattern;
  }
  /**
   * Save existing index pattern. Will attempt to merge differences if there are conflicts
   * @param indexPattern
   * @param saveAttempts
   */


  async updateSavedObject(indexPattern, saveAttempts = 0, ignoreErrors = false) {
    if (!indexPattern.id) return;

    if (!(await this.getCanSave())) {
      throw new _errors.DataViewInsufficientAccessError(indexPattern.id);
    } // get the list of attributes


    const body = indexPattern.getAsSavedObjectBody();
    const originalBody = indexPattern.getOriginalSavedObjectBody(); // get changed keys

    const originalChangedKeys = [];
    Object.entries(body).forEach(([key, value]) => {
      if (value !== originalBody[key]) {
        originalChangedKeys.push(key);
      }
    });
    return this.savedObjectsClient.update(_.DATA_VIEW_SAVED_OBJECT_TYPE, indexPattern.id, body, {
      version: indexPattern.version
    }).then(resp => {
      indexPattern.id = resp.id;
      indexPattern.version = resp.version;
    }).catch(async err => {
      var _err$res;

      if ((err === null || err === void 0 ? void 0 : (_err$res = err.res) === null || _err$res === void 0 ? void 0 : _err$res.status) === 409 && saveAttempts++ < MAX_ATTEMPTS_TO_RESOLVE_CONFLICTS) {
        const samePattern = await this.get(indexPattern.id); // What keys changed from now and what the server returned

        const updatedBody = samePattern.getAsSavedObjectBody(); // Build a list of changed keys from the server response
        // and ensure we ignore the key if the server response
        // is the same as the original response (since that is expected
        // if we made a change in that key)

        const serverChangedKeys = [];
        Object.entries(updatedBody).forEach(([key, value]) => {
          if (value !== body[key] && value !== originalBody[key]) {
            serverChangedKeys.push(key);
          }
        });
        let unresolvedCollision = false;

        for (const originalKey of originalChangedKeys) {
          for (const serverKey of serverChangedKeys) {
            if (originalKey === serverKey) {
              unresolvedCollision = true;
              break;
            }
          }
        }

        if (unresolvedCollision) {
          if (ignoreErrors) {
            return;
          }

          const title = _i18n.i18n.translate('dataViews.unableWriteLabel', {
            defaultMessage: 'Unable to write data view! Refresh the page to get the most up to date changes for this data view.'
          });

          this.onNotification({
            title,
            color: 'danger'
          });
          throw err;
        } // Set the updated response on this object


        serverChangedKeys.forEach(key => {
          indexPattern[key] = samePattern[key];
        });
        indexPattern.version = samePattern.version; // Clear cache

        this.dataViewCache.clear(indexPattern.id); // Try the save again

        return this.updateSavedObject(indexPattern, saveAttempts, ignoreErrors);
      }

      throw err;
    });
  }
  /**
   * Deletes an index pattern from .kibana index
   * @param indexPatternId: Id of kibana Index Pattern to delete
   */


  async delete(indexPatternId) {
    if (!(await this.getCanSave())) {
      throw new _errors.DataViewInsufficientAccessError(indexPatternId);
    }

    this.dataViewCache.clear(indexPatternId);
    return this.savedObjectsClient.delete(_.DATA_VIEW_SAVED_OBJECT_TYPE, indexPatternId);
  }
  /**
   * Returns the default data view as an object.
   * If no default is found, or it is missing
   * another data view is selected as default and returned.
   * If no possible data view found to become a default returns null
   *
   * @returns default data view
   */


  async getDefaultDataView() {
    const patterns = await this.getIdsWithTitle();
    let defaultId = await this.config.get('defaultIndex');
    const exists = defaultId ? patterns.some(pattern => pattern.id === defaultId) : false;

    if (defaultId && !exists) {
      await this.config.remove('defaultIndex');
      defaultId = undefined;
    }

    if (!defaultId && patterns.length >= 1 && (await this.hasUserDataView().catch(() => true))) {
      var _userDataViews$0$id, _userDataViews$;

      // try to set first user created data view as default,
      // otherwise fallback to any data view
      const userDataViews = patterns.filter(pattern => pattern.title !== _.DEFAULT_ASSETS_TO_IGNORE.LOGS_INDEX_PATTERN && pattern.title !== _.DEFAULT_ASSETS_TO_IGNORE.METRICS_INDEX_PATTERN);
      defaultId = (_userDataViews$0$id = (_userDataViews$ = userDataViews[0]) === null || _userDataViews$ === void 0 ? void 0 : _userDataViews$.id) !== null && _userDataViews$0$id !== void 0 ? _userDataViews$0$id : patterns[0].id;
      await this.config.set('defaultIndex', defaultId);
    }

    if (defaultId) {
      return this.get(defaultId);
    } else {
      return null;
    }
  }

}
/**
 * @deprecated Use DataViewsService. All index pattern interfaces were renamed.
 */


exports.DataViewsService = DataViewsService;

class IndexPatternsService extends DataViewsService {}

exports.IndexPatternsService = IndexPatternsService;