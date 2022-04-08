"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadExpressionsMigrationsFactory = exports.templateWorkpadExpressionsMigrationsFactory = exports.customElementExpressionsMigrationsFactory = void 0;

var _interpreter = require("@kbn/interpreter");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const toAst = expression => (0, _interpreter.fromExpression)(expression);

const fromAst = ast => (0, _interpreter.toExpression)(ast);

const migrateExpr = (expr, migrateFn) => (0, _lodash.flowRight)(fromAst, migrateFn, toAst)(expr);

const migrateWorkpadElement = migrate => ({
  filter,
  expression,
  ...element
}) => ({ ...element,
  filter: filter ? migrateExpr(filter, migrate) : filter,
  expression: expression ? migrateExpr(expression, migrate) : expression
});

const migrateTemplateElement = migrate => ({
  expression,
  ...element
}) => ({ ...element,
  expression: expression ? migrateExpr(expression, migrate) : expression
});

const migrateWorkpadElements = (doc, migrateElementFn) => {
  if (typeof doc.attributes !== 'object' || doc.attributes === null || doc.attributes === undefined) {
    return doc;
  }

  const {
    pages
  } = doc.attributes;
  const newPages = pages === null || pages === void 0 ? void 0 : pages.map(page => {
    const {
      elements
    } = page;
    const newElements = elements === null || elements === void 0 ? void 0 : elements.map(migrateElementFn);
    return { ...page,
      elements: newElements
    };
  });
  return { ...doc,
    attributes: { ...doc.attributes,
      pages: newPages
    }
  };
};

const migrateTemplateWorkpadExpressions = migrate => doc => migrateWorkpadElements(doc, migrateTemplateElement(migrate));

const migrateWorkpadExpressionsAndFilters = migrate => doc => migrateWorkpadElements(doc, migrateWorkpadElement(migrate));

const migrateCustomElementExpressionsAndFilters = migrate => doc => {
  if (typeof doc.attributes !== 'object' || doc.attributes === null || doc.attributes === undefined) {
    return doc;
  }

  const {
    content
  } = doc.attributes;
  const {
    selectedNodes = []
  } = content ? JSON.parse(content) : {
    selectedNodes: []
  };
  const newSelectedNodes = selectedNodes.map(element => {
    const newElement = migrateWorkpadElement(migrate)(element);
    return { ...element,
      ...newElement,
      ast: toAst(newElement.expression)
    };
  });
  const newContent = JSON.stringify({
    selectedNodes: newSelectedNodes
  });
  return { ...doc,
    attributes: { ...doc.attributes,
      content: newContent
    }
  };
};

const workpadExpressionsMigrationsFactory = ({
  expressions
}) => (0, _lodash.mapValues)(expressions.getAllMigrations(), migrateWorkpadExpressionsAndFilters);

exports.workpadExpressionsMigrationsFactory = workpadExpressionsMigrationsFactory;

const templateWorkpadExpressionsMigrationsFactory = ({
  expressions
}) => (0, _lodash.mapValues)(expressions.getAllMigrations(), migrateTemplateWorkpadExpressions);

exports.templateWorkpadExpressionsMigrationsFactory = templateWorkpadExpressionsMigrationsFactory;

const customElementExpressionsMigrationsFactory = ({
  expressions
}) => (0, _lodash.mapValues)(expressions.getAllMigrations(), migrateCustomElementExpressionsAndFilters);

exports.customElementExpressionsMigrationsFactory = customElementExpressionsMigrationsFactory;