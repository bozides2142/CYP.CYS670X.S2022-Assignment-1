"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectReferences = exports.extractReferences = void 0;

var _interpreter = require("@kbn/interpreter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extractReferences = (workpad, expressions) => {
  // We need to find every element in the workpad and extract references
  const references = [];
  const pages = workpad.pages.map(page => {
    const elements = page.elements.map(element => {
      const extract = expressions.extract((0, _interpreter.fromExpression)(element.expression)); // Prefix references with the element id so we will know later which element it goes with

      references.push(...extract.references.map(reference => ({ ...reference,
        name: `${element.id}:${reference.name}`
      })));
      return { ...element,
        expression: (0, _interpreter.toExpression)(extract.state, {
          source: element.expression
        })
      };
    });
    return { ...page,
      elements
    };
  });
  return {
    workpad: { ...workpad,
      pages
    },
    references
  };
};

exports.extractReferences = extractReferences;

const injectReferences = (workpad, references, expressions) => {
  const pages = workpad.pages.map(page => {
    const elements = page.elements.map(element => {
      const referencesForElement = references.filter(({
        name
      }) => name.indexOf(element.id) === 0).map(reference => ({ ...reference,
        name: reference.name.replace(`${element.id}:`, '')
      }));
      const injectedAst = expressions.inject((0, _interpreter.fromExpression)(element.expression), referencesForElement);
      return { ...element,
        expression: (0, _interpreter.toExpression)(injectedAst, {
          source: element.expression
        })
      };
    });
    return { ...page,
      elements
    };
  });
  return { ...workpad,
    pages
  };
};

exports.injectReferences = injectReferences;