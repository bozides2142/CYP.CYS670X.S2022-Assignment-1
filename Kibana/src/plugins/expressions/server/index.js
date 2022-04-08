"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  plugin: true,
  Plugin: true,
  buildExpression: true,
  buildExpressionFunction: true,
  Execution: true,
  Executor: true,
  ExpressionFunction: true,
  ExpressionFunctionParameter: true,
  ExpressionRenderer: true,
  ExpressionRendererRegistry: true,
  ExpressionType: true,
  FontStyle: true,
  FontWeight: true,
  format: true,
  formatExpression: true,
  FunctionsRegistry: true,
  isExpressionAstBuilder: true,
  Overflow: true,
  parse: true,
  parseExpression: true,
  TextAlignment: true,
  TextDecoration: true,
  TypesRegistry: true
};
Object.defineProperty(exports, "Execution", {
  enumerable: true,
  get: function () {
    return _common.Execution;
  }
});
Object.defineProperty(exports, "Executor", {
  enumerable: true,
  get: function () {
    return _common.Executor;
  }
});
Object.defineProperty(exports, "ExpressionFunction", {
  enumerable: true,
  get: function () {
    return _common.ExpressionFunction;
  }
});
Object.defineProperty(exports, "ExpressionFunctionParameter", {
  enumerable: true,
  get: function () {
    return _common.ExpressionFunctionParameter;
  }
});
Object.defineProperty(exports, "ExpressionRenderer", {
  enumerable: true,
  get: function () {
    return _common.ExpressionRenderer;
  }
});
Object.defineProperty(exports, "ExpressionRendererRegistry", {
  enumerable: true,
  get: function () {
    return _common.ExpressionRendererRegistry;
  }
});
Object.defineProperty(exports, "ExpressionType", {
  enumerable: true,
  get: function () {
    return _common.ExpressionType;
  }
});
Object.defineProperty(exports, "FontStyle", {
  enumerable: true,
  get: function () {
    return _common.FontStyle;
  }
});
Object.defineProperty(exports, "FontWeight", {
  enumerable: true,
  get: function () {
    return _common.FontWeight;
  }
});
Object.defineProperty(exports, "FunctionsRegistry", {
  enumerable: true,
  get: function () {
    return _common.FunctionsRegistry;
  }
});
Object.defineProperty(exports, "Overflow", {
  enumerable: true,
  get: function () {
    return _common.Overflow;
  }
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.ExpressionsServerPlugin;
  }
});
Object.defineProperty(exports, "TextAlignment", {
  enumerable: true,
  get: function () {
    return _common.TextAlignment;
  }
});
Object.defineProperty(exports, "TextDecoration", {
  enumerable: true,
  get: function () {
    return _common.TextDecoration;
  }
});
Object.defineProperty(exports, "TypesRegistry", {
  enumerable: true,
  get: function () {
    return _common.TypesRegistry;
  }
});
Object.defineProperty(exports, "buildExpression", {
  enumerable: true,
  get: function () {
    return _common.buildExpression;
  }
});
Object.defineProperty(exports, "buildExpressionFunction", {
  enumerable: true,
  get: function () {
    return _common.buildExpressionFunction;
  }
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function () {
    return _common.format;
  }
});
Object.defineProperty(exports, "formatExpression", {
  enumerable: true,
  get: function () {
    return _common.formatExpression;
  }
});
Object.defineProperty(exports, "isExpressionAstBuilder", {
  enumerable: true,
  get: function () {
    return _common.isExpressionAstBuilder;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _common.parse;
  }
});
Object.defineProperty(exports, "parseExpression", {
  enumerable: true,
  get: function () {
    return _common.parseExpression;
  }
});
exports.plugin = plugin;

var _plugin = require("./plugin");

Object.keys(_plugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _plugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _plugin[key];
    }
  });
});

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// TODO: https://github.com/elastic/kibana/issues/109902

/* eslint-disable @kbn/eslint/no_export_all */
// Kibana Platform.
function plugin(initializerContext) {
  return new _plugin.ExpressionsServerPlugin(initializerContext);
} // Static exports.