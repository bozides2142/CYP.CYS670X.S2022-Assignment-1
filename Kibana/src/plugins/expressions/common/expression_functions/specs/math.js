"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = void 0;

var _i18n = require("@kbn/i18n");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const TINYMATH = '`TinyMath`';
const TINYMATH_URL = 'https://www.elastic.co/guide/en/kibana/current/canvas-tinymath-functions.html';
const math = {
  name: 'math',
  type: undefined,
  inputTypes: ['number', 'datatable'],
  help: _i18n.i18n.translate('expressions.functions.mathHelpText', {
    defaultMessage: 'Interprets a {TINYMATH} math expression using a {TYPE_NUMBER} or {DATATABLE} as {CONTEXT}. ' + 'The {DATATABLE} columns are available by their column name. ' + 'If the {CONTEXT} is a number it is available as {value}.',
    values: {
      TINYMATH,
      CONTEXT: '_context_',
      DATATABLE: '`datatable`',
      value: '`value`',
      TYPE_NUMBER: '`number`'
    }
  }),
  args: {
    expression: {
      aliases: ['_'],
      types: ['string'],
      help: _i18n.i18n.translate('expressions.functions.math.args.expressionHelpText', {
        defaultMessage: 'An evaluated {TINYMATH} expression. See {TINYMATH_URL}.',
        values: {
          TINYMATH,
          TINYMATH_URL
        }
      })
    },
    onError: {
      types: ['string'],
      options: ['throw', 'false', 'zero', 'null'],
      help: _i18n.i18n.translate('expressions.functions.math.args.onErrorHelpText', {
        defaultMessage: "In case the {TINYMATH} evaluation fails or returns NaN, the return value is specified by onError. When `'throw'`, it will throw an exception, terminating expression execution (default).",
        values: {
          TINYMATH
        }
      })
    }
  },
  fn: async (input, args) => {
    const {
      mathFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./math_fn')));
    return mathFn(input, args);
  }
};
exports.math = math;