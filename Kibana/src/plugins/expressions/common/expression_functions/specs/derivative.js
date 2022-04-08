"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.derivative = void 0;

var _i18n = require("@kbn/i18n");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Calculates the derivative of a specified column in the data table.
 *
 * Also supports multiple series in a single data table - use the `by` argument
 * to specify the columns to split the calculation by.
 * For each unique combination of all `by` columns a separate derivative will be calculated.
 * The order of rows won't be changed - this function is not modifying any existing columns, it's only
 * adding the specified `outputColumnId` column to every row of the table without adding or removing rows.
 *
 * Behavior:
 * * Will write the derivative of `inputColumnId` into `outputColumnId`
 * * If provided will use `outputColumnName` as name for the newly created column. Otherwise falls back to `outputColumnId`
 * * Derivative always start with an undefined value for the first row of a series, a cell will contain its own value minus the
 *   value of the previous cell of the same series.
 *
 * Edge cases:
 * * Will return the input table if `inputColumnId` does not exist
 * * Will throw an error if `outputColumnId` exists already in provided data table
 * * If there is no previous row of the current series with a non `null` or `undefined` value, the output cell of the current row
 *   will be set to `undefined`.
 * * If the row value contains `null` or `undefined`, it will be ignored and the output cell will be set to `undefined`
 * * If the value of the previous row of the same series contains `null` or `undefined`, the output cell of the current row will be set to `undefined` as well
 * * For all values besides `null` and `undefined`, the value will be cast to a number before it's used in the
 *   calculation of the current series even if this results in `NaN` (like in case of objects).
 * * To determine separate series defined by the `by` columns, the values of these columns will be cast to strings
 *   before comparison. If the values are objects, the return value of their `toString` method will be used for comparison.
 *   Missing values (`null` and `undefined`) will be treated as empty strings.
 */
const derivative = {
  name: 'derivative',
  type: 'datatable',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressions.functions.derivative.help', {
    defaultMessage: 'Calculates the derivative of a column in a data table'
  }),
  args: {
    by: {
      help: _i18n.i18n.translate('expressions.functions.derivative.args.byHelpText', {
        defaultMessage: 'Column to split the derivative calculation by'
      }),
      multi: true,
      types: ['string'],
      required: false
    },
    inputColumnId: {
      help: _i18n.i18n.translate('expressions.functions.derivative.args.inputColumnIdHelpText', {
        defaultMessage: 'Column to calculate the derivative of'
      }),
      types: ['string'],
      required: true
    },
    outputColumnId: {
      help: _i18n.i18n.translate('expressions.functions.derivative.args.outputColumnIdHelpText', {
        defaultMessage: 'Column to store the resulting derivative in'
      }),
      types: ['string'],
      required: true
    },
    outputColumnName: {
      help: _i18n.i18n.translate('expressions.functions.derivative.args.outputColumnNameHelpText', {
        defaultMessage: 'Name of the column to store the resulting derivative in'
      }),
      types: ['string'],
      required: false
    }
  },

  async fn(input, args) {
    const {
      derivativeFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./derivative_fn')));
    return derivativeFn(input, args);
  }

};
exports.derivative = derivative;