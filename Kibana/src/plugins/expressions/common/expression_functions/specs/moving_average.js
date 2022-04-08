"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.movingAverage = void 0;

var _i18n = require("@kbn/i18n");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Calculates the moving average of a specified column in the data table.
 *
 * Also supports multiple series in a single data table - use the `by` argument
 * to specify the columns to split the calculation by.
 * For each unique combination of all `by` columns a separate moving average will be calculated.
 * The order of rows won't be changed - this function is not modifying any existing columns, it's only
 * adding the specified `outputColumnId` column to every row of the table without adding or removing rows.
 *
 * Behavior:
 * * Will write the moving average of `inputColumnId` into `outputColumnId`
 * * If provided will use `outputColumnName` as name for the newly created column. Otherwise falls back to `outputColumnId`
 * * Moving average always starts with an undefined value for the first row of a series. Each next cell will contain sum of the last
 * * [window] of values divided by [window] excluding the current bucket.
 * If either of window edges moves outside the borders of data series, the window shrinks to include available values only.
 *
 * Edge cases:
 * * Will return the input table if `inputColumnId` does not exist
 * * Will throw an error if `outputColumnId` exists already in provided data table
 * * If null or undefined value is encountered, skip the current row and do not change the window
 * * For all values besides `null` and `undefined`, the value will be cast to a number before it's used in the
 *   calculation of the current series even if this results in `NaN` (like in case of objects).
 * * To determine separate series defined by the `by` columns, the values of these columns will be cast to strings
 *   before comparison. If the values are objects, the return value of their `toString` method will be used for comparison.
 */
const movingAverage = {
  name: 'moving_average',
  type: 'datatable',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressions.functions.movingAverage.help', {
    defaultMessage: 'Calculates the moving average of a column in a data table'
  }),
  args: {
    by: {
      help: _i18n.i18n.translate('expressions.functions.movingAverage.args.byHelpText', {
        defaultMessage: 'Column to split the moving average calculation by'
      }),
      multi: true,
      types: ['string'],
      required: false
    },
    inputColumnId: {
      help: _i18n.i18n.translate('expressions.functions.movingAverage.args.inputColumnIdHelpText', {
        defaultMessage: 'Column to calculate the moving average of'
      }),
      types: ['string'],
      required: true
    },
    outputColumnId: {
      help: _i18n.i18n.translate('expressions.functions.movingAverage.args.outputColumnIdHelpText', {
        defaultMessage: 'Column to store the resulting moving average in'
      }),
      types: ['string'],
      required: true
    },
    outputColumnName: {
      help: _i18n.i18n.translate('expressions.functions.movingAverage.args.outputColumnNameHelpText', {
        defaultMessage: 'Name of the column to store the resulting moving average in'
      }),
      types: ['string'],
      required: false
    },
    window: {
      help: _i18n.i18n.translate('expressions.functions.movingAverage.args.windowHelpText', {
        defaultMessage: 'The size of window to "slide" across the histogram.'
      }),
      types: ['number'],
      default: 5
    }
  },

  async fn(input, args) {
    const {
      movingAverageFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./moving_average_fn')));
    return movingAverageFn(input, args);
  }

};
exports.movingAverage = movingAverage;