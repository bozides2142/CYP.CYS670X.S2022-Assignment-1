"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateExceptionsStream = exports.validateExceptionsLists = exports.validateExceptionsItems = exports.validateExceptions = exports.sortExceptionsStream = exports.sortExceptions = exports.parseNdjsonStrings = exports.manageExceptionComments = exports.isImportExceptionListItemSchema = exports.filterExportedCounts = exports.filterEmptyStrings = exports.exceptionsChecksFromArray = exports.createLimitStream = exports.createExceptionsStreamFromNdjson = exports.checkLimits = void 0;

var _stream = require("stream");

var _fp = require("lodash/fp");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _utils = require("@kbn/utils");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Parses strings from ndjson stream
 */


const parseNdjsonStrings = () => {
  return (0, _utils.createMapStream)(ndJsonStr => {
    try {
      return JSON.parse(ndJsonStr);
    } catch (err) {
      return err;
    }
  });
};
/**
 *
 * Sorting of exceptions logic
 *
 */

/**
 * Helper to determine if exception shape is that of an item vs parent container
 * @param exception
 * @returns {boolean}
 */


exports.parseNdjsonStrings = parseNdjsonStrings;

const isImportExceptionListItemSchema = exception => {
  return (0, _fp.has)('entries', exception) || (0, _fp.has)('item_id', exception);
};
/**
 * Sorts the exceptions into the lists and items.
 * We do this because we don't want the order of the exceptions
 * in the import to matter. If we didn't sort, then some items
 * might error if the list has not yet been created
 * @param exceptions {array} - exceptions to import
 * @returns {stream} incoming exceptions sorted into lists and items
 */


exports.isImportExceptionListItemSchema = isImportExceptionListItemSchema;

const sortExceptions = exceptions => {
  return exceptions.reduce((acc, exception) => {
    if (isImportExceptionListItemSchema(exception)) {
      return { ...acc,
        items: [...acc.items, exception]
      };
    } else {
      return { ...acc,
        lists: [...acc.lists, exception]
      };
    }
  }, {
    items: [],
    lists: []
  });
};
/**
 * Sorts the exceptions into the lists and items.
 * We do this because we don't want the order of the exceptions
 * in the import to matter. If we didn't sort, then some items
 * might error if the list has not yet been created
 * @returns {stream} incoming exceptions sorted into lists and items
 */


exports.sortExceptions = sortExceptions;

const sortExceptionsStream = () => {
  return (0, _utils.createReduceStream)((acc, exception) => {
    if ((0, _fp.has)('entries', exception) || (0, _fp.has)('item_id', exception)) {
      return { ...acc,
        items: [...acc.items, exception]
      };
    } else {
      return { ...acc,
        lists: [...acc.lists, exception]
      };
    }
  }, {
    items: [],
    lists: []
  });
};
/**
 * Updates any comments associated with exception items to resemble
 * comment creation schema.
 * See issue for context https://github.com/elastic/kibana/issues/124742#issuecomment-1033082093
 * @returns {array} comments reformatted properly for import
 */


exports.sortExceptionsStream = sortExceptionsStream;

const manageExceptionComments = comments => {
  if (comments == null || !comments.length) {
    return [];
  } else {
    return comments.map(({
      comment
    }) => ({
      comment
    }));
  }
};
/**
 *
 * Validating exceptions logic
 *
 */

/**
 * Validates exception lists and items schemas incoming as stream
 * @returns {stream} validated lists and items
 */


exports.manageExceptionComments = manageExceptionComments;

const validateExceptionsStream = () => {
  return (0, _utils.createMapStream)(exceptions => ({
    items: validateExceptionsItems(exceptions.items),
    lists: validateExceptionsLists(exceptions.lists)
  }));
};
/**
 * Validates exception lists and items schemas incoming as array
 * @param exceptions {array} - exceptions to import sorted by list/item
 * @returns {object} validated lists and items
 */


exports.validateExceptionsStream = validateExceptionsStream;

const validateExceptions = exceptions => {
  return {
    items: validateExceptionsItems(exceptions.items),
    lists: validateExceptionsLists(exceptions.lists)
  };
};
/**
 * Validates exception lists incoming as array
 * @param lists {array} - exception lists to import
 * @returns {array} validated exception lists and validation errors
 */


exports.validateExceptions = validateExceptions;

const validateExceptionsLists = lists => {
  const onLeft = errors => {
    return new _securitysolutionEsUtils.BadRequestError((0, _securitysolutionIoTsUtils.formatErrors)(errors).join());
  };

  const onRight = schemaList => {
    return schemaList;
  };

  return lists.map(obj => {
    if (!(obj instanceof Error)) {
      const decodedList = _securitysolutionIoTsListTypes.importExceptionsListSchema.decode(obj);

      const checkedList = (0, _securitysolutionIoTsUtils.exactCheck)(obj, decodedList);
      return (0, _pipeable.pipe)(checkedList, (0, _Either.fold)(onLeft, onRight));
    } else {
      return obj;
    }
  });
};
/**
 * Validates exception items incoming as array
 * @param items {array} - exception items to import
 * @returns {array} validated exception items and validation errors
 */


exports.validateExceptionsLists = validateExceptionsLists;

const validateExceptionsItems = items => {
  const onLeft = errors => {
    return new _securitysolutionEsUtils.BadRequestError((0, _securitysolutionIoTsUtils.formatErrors)(errors).join());
  };

  const onRight = itemSchema => {
    return itemSchema;
  };

  return items.map(item => {
    if (!(item instanceof Error)) {
      const itemWithUpdatedComments = { ...item,
        comments: manageExceptionComments(item.comments)
      };

      const decodedItem = _securitysolutionIoTsListTypes.importExceptionListItemSchema.decode(itemWithUpdatedComments);

      const checkedItem = (0, _securitysolutionIoTsUtils.exactCheck)(itemWithUpdatedComments, decodedItem);
      return (0, _pipeable.pipe)(checkedItem, (0, _Either.fold)(onLeft, onRight));
    } else {
      return item;
    }
  });
};
/**
 *
 * Validating import limits logic
 *
 */

/**
 * Validates max number of exceptions allowed to import
 * @param limit {number} - max number of exceptions allowed to import
 * @returns {array} validated exception items and validation errors
 */


exports.validateExceptionsItems = validateExceptionsItems;

const checkLimits = limit => {
  return exceptions => {
    if (exceptions.length >= limit) {
      throw new Error(`Can't import more than ${limit} exceptions`);
    }

    return exceptions;
  };
};
/**
 * Validates max number of exceptions allowed to import
 * Adaptation from: saved_objects/import/create_limit_stream.ts
 * @param limit {number} - max number of exceptions allowed to import
 * @returns {stream}
 */


exports.checkLimits = checkLimits;

const createLimitStream = limit => {
  return new _stream.Transform({
    objectMode: true,

    async transform(obj, _, done) {
      if (obj.lists.length + obj.items.length >= limit) {
        done(new Error(`Can't import more than ${limit} exceptions`));
      } else {
        done(undefined, obj);
      }
    }

  });
};
/**
 *
 * Filters
 *
 */

/**
 * Filters out the counts metadata added on export
 */


exports.createLimitStream = createLimitStream;

const filterExportedCounts = () => {
  return (0, _utils.createFilterStream)(obj => obj != null && !(0, _fp.has)('exported_exception_list_count', obj));
};
/**
 * Filters out empty strings from ndjson stream
 */


exports.filterExportedCounts = filterExportedCounts;

const filterEmptyStrings = () => {
  return (0, _utils.createFilterStream)(ndJsonStr => ndJsonStr.trim() !== '');
};
/**
 *
 * Set of helpers to run exceptions through on import
 *
 */

/**
 * Takes an array of exceptions and runs it through a set of helpers
 * to check max number of exceptions, the shape of the data and sorts
 * it into items and lists
 * @param exceptionsToImport {array} - exceptions to be imported
 * @param exceptionsLimit {number} - max nuber of exception allowed to import
 * @returns {object} sorted items and lists
 */


exports.filterEmptyStrings = filterEmptyStrings;

const exceptionsChecksFromArray = (exceptionsToImport, exceptionsLimit) => {
  return (0, _pipeable.pipe)(exceptionsToImport, checkLimits(exceptionsLimit), sortExceptions, validateExceptions);
};
/**
 * Takes an array of exceptions and runs it through a set of helpers
 * to check max number of exceptions, the shape of the data and sorts
 * it into items and lists
 * Inspiration and the pattern of code followed is from:
 * saved_objects/lib/create_saved_objects_stream_from_ndjson.ts
 * @param exceptionsToImport {array} - exceptions to be imported
 * @param exceptionsLimit {number} - max nuber of exception allowed to import
 * @returns {object} sorted items and lists
 */


exports.exceptionsChecksFromArray = exceptionsChecksFromArray;

const createExceptionsStreamFromNdjson = exceptionsLimit => {
  return [(0, _utils.createSplitStream)('\n'), filterEmptyStrings(), parseNdjsonStrings(), filterExportedCounts(), sortExceptionsStream(), validateExceptionsStream(), createLimitStream(exceptionsLimit), (0, _utils.createConcatStream)([])];
};

exports.createExceptionsStreamFromNdjson = createExceptionsStreamFromNdjson;