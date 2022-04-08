"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _tsMorph = require("ts-morph");

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

var _yargs = require("yargs");

var _optimize = require("../optimize_tsconfig/optimize");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error


(0, _optimize.optimizeTsConfig)().then(() => {
  const project = new _tsMorph.Project({
    tsConfigFilePath: _path.default.resolve(__dirname, '../../../../../tsconfig.json')
  });
  const glob = _yargs.argv.glob || 'x-pack/plugins/apm/server/**/route.ts';
  const files = project.getSourceFiles(glob);
  const changedFiles = [];
  files.forEach(file => {
    file.getVariableDeclarations().forEach(declaration => {
      const initializer = declaration.getInitializerIfKind(_tsMorph.SyntaxKind.CallExpression);
      const argument = initializer === null || initializer === void 0 ? void 0 : initializer.getArguments()[0];

      if (_tsMorph.Node.isObjectLiteralExpression(argument)) {
        // this gets the `handler` function
        const handler = argument.getProperty('handler');

        if (!handler) {
          return;
        }

        let fnDeclaration = (_tsMorph.Node.isPropertyAssignment(handler) ? handler.getInitializer() : handler // remove any explicit return type
        ).removeReturnType();
        const signature = fnDeclaration.getSignature();

        if (!signature) {
          return;
        }

        const returnType = signature.getReturnType();
        const txt = returnType.getText(fnDeclaration, _tsMorph.TypeFormatFlags.NoTruncation);
        fnDeclaration = fnDeclaration.setReturnType(txt);
        let hasAny = false;
        fnDeclaration.transform(traversal => {
          const node = traversal.visitChildren();

          if (node.kind === _tsMorph.SyntaxKind.AnyKeyword) {
            hasAny = true;
          }

          if (_tsMorph.ts.isImportTypeNode(node)) {
            const literal = node.argument.literal; // replace absolute paths with relative paths

            return _tsMorph.ts.updateImportTypeNode(node, _tsMorph.ts.createLiteralTypeNode(_tsMorph.ts.createStringLiteral(`./${_path.default.relative(_path.default.dirname(file.getFilePath()), literal.text)}`)), node.qualifier, node.typeArguments);
          }

          return node;
        });

        if (hasAny) {
          // eslint-disable-next-line no-console
          console.warn(`Any type detected in ${file.getFilePath()}: ${txt}`);
        }

        changedFiles.push(file);
      }
    });
  });
  changedFiles.forEach(file => file.saveSync());

  const root = _path.default.join(__dirname, '../../../../..'); // run ESLint on the changed files


  (0, _child_process.execSync)(`node scripts/eslint ${glob} --fix`, {
    cwd: root,
    stdio: 'inherit'
  });
});