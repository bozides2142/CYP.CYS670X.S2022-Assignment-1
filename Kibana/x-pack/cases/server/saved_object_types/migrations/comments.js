"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyCommentWithoutTrailingNewline = exports.removeRuleInformation = exports.removeAssociationType = exports.migrateByValueLensVisualizations = exports.mergeMigrationFunctionMaps = exports.createCommentsMigrations = void 0;

var _lodash = require("lodash");

var _api = require("../../../common/api");

var _utils = require("../../../common/utils/markdown_plugins/utils");

var _ = require(".");

var _utils2 = require("./utils");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


var AssociationType;

(function (AssociationType) {
  AssociationType["case"] = "case";
})(AssociationType || (AssociationType = {}));

const createCommentsMigrations = migrationDeps => {
  const lensMigrations = migrationDeps.lensEmbeddableFactory().migrations;
  const lensMigrationObject = typeof lensMigrations === 'function' ? lensMigrations() : lensMigrations || {};
  const embeddableMigrations = (0, _lodash.mapValues)(lensMigrationObject, migrateByValueLensVisualizations);
  const commentsMigrations = {
    '7.11.0': doc => {
      return { ...doc,
        attributes: { ...doc.attributes,
          type: _api.CommentType.user
        },
        references: doc.references || []
      };
    },
    '7.12.0': doc => {
      let attributes = { ...doc.attributes,
        associationType: AssociationType.case
      }; // only add the rule object for alert comments. Prior to 7.12 we only had CommentType.alert, generated alerts are
      // introduced in 7.12.

      if (doc.attributes.type === _api.CommentType.alert) {
        attributes = { ...attributes,
          rule: {
            id: null,
            name: null
          }
        };
      }

      return { ...doc,
        attributes,
        references: doc.references || []
      };
    },
    '7.14.0': doc => {
      return (0, _.addOwnerToSO)(doc);
    },

    /*
     * This is to fix the issue here: https://github.com/elastic/kibana/issues/123089
     * Instead of migrating the rule information in the references array which was risky for 8.0
     * we decided to remove the information since the UI will do the look up for the rule information if
     * the backend returns it as null.
     *
     * The downside is it incurs extra query overhead.
     **/
    '8.0.0': removeRuleInformation,
    '8.1.0': removeAssociationType
  };
  return mergeMigrationFunctionMaps(commentsMigrations, embeddableMigrations);
};

exports.createCommentsMigrations = createCommentsMigrations;

const migrateByValueLensVisualizations = (migrate, version) => (doc, context) => {
  if (doc.attributes.comment == null) {
    return doc;
  }

  try {
    const parsedComment = (0, _utils.parseCommentString)(doc.attributes.comment);
    const migratedComment = parsedComment.children.map(comment => {
      if ((0, _utils.isLensMarkdownNode)(comment)) {
        // casting here because ts complains that comment isn't serializable because LensMarkdownNode
        // extends Node which has fields that conflict with SerializableRecord even though it is serializable
        return migrate(comment);
      }

      return comment;
    });
    const migratedMarkdown = { ...parsedComment,
      children: migratedComment
    };
    return { ...doc,
      attributes: { ...doc.attributes,
        comment: stringifyCommentWithoutTrailingNewline(doc.attributes.comment, migratedMarkdown)
      }
    };
  } catch (error) {
    (0, _utils2.logError)({
      id: doc.id,
      context,
      error,
      docType: 'comment',
      docKey: 'comment'
    });
    return doc;
  }
};

exports.migrateByValueLensVisualizations = migrateByValueLensVisualizations;

const stringifyCommentWithoutTrailingNewline = (originalComment, markdownNode) => {
  const stringifiedComment = (0, _utils.stringifyMarkdownComment)(markdownNode); // if the original comment already ended with a newline then just leave it there

  if (originalComment.endsWith('\n')) {
    return stringifiedComment;
  } // the original comment did not end with a newline so the markdown library is going to add one, so let's remove it
  // so the comment stays consistent


  return (0, _lodash.trimEnd)(stringifiedComment, '\n');
};
/**
 * merge function maps adds the context param from the original implementation at:
 * src/plugins/kibana_utils/common/persistable_state/merge_migration_function_map.ts
 *  */


exports.stringifyCommentWithoutTrailingNewline = stringifyCommentWithoutTrailingNewline;

const mergeMigrationFunctionMaps = (obj1, obj2) => {
  const customizer = (objValue, srcValue) => {
    if (!srcValue || !objValue) {
      return srcValue || objValue;
    }

    return (doc, context) => objValue(srcValue(doc, context), context);
  };

  return (0, _lodash.mergeWith)({ ...obj1
  }, obj2, customizer);
};

exports.mergeMigrationFunctionMaps = mergeMigrationFunctionMaps;

const removeRuleInformation = doc => {
  var _doc$references2;

  if (doc.attributes.type === _api.CommentType.alert || doc.attributes.type === _constants.GENERATED_ALERT) {
    var _doc$references;

    return { ...doc,
      attributes: { ...doc.attributes,
        rule: {
          id: null,
          name: null
        }
      },
      references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
    };
  }

  return { ...doc,
    references: (_doc$references2 = doc.references) !== null && _doc$references2 !== void 0 ? _doc$references2 : []
  };
};

exports.removeRuleInformation = removeRuleInformation;

const removeAssociationType = doc => {
  var _docCopy$references$f, _docCopy$references;

  const docCopy = (0, _lodash.cloneDeep)(doc);
  (0, _lodash.unset)(docCopy, 'attributes.associationType');
  return { ...docCopy,
    references: (_docCopy$references$f = (_docCopy$references = docCopy.references) === null || _docCopy$references === void 0 ? void 0 : _docCopy$references.filter(reference => reference.type !== _constants.SUB_CASE_SAVED_OBJECT)) !== null && _docCopy$references$f !== void 0 ? _docCopy$references$f : []
  };
};

exports.removeAssociationType = removeAssociationType;