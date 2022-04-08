"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overallMetric = void 0;

var _i18n = require("@kbn/i18n");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Calculates the overall metric of a specified column in the data table.
 *
 * Also supports multiple series in a single data table - use the `by` argument
 * to specify the columns to split the calculation by.
 * For each unique combination of all `by` columns a separate overall metric will be calculated.
 * The order of rows won't be changed - this function is not modifying any existing columns, it's only
 * adding the specified `outputColumnId` column to every row of the table without adding or removing rows.
 *
 * Behavior:
 * * Will write the overall metric of `inputColumnId` into `outputColumnId`
 * * If provided will use `outputColumnName` as name for the newly created column. Otherwise falls back to `outputColumnId`
 * * Each cell will contain the calculated metric based on the values of all cells belonging to the current series.
 *
 * Edge cases:
 * * Will return the input table if `inputColumnId` does not exist
 * * Will throw an error if `outputColumnId` exists already in provided data table
 * * If the row value contains `null` or `undefined`, it will be ignored and overwritten with the overall metric of
 *   all cells of the same series.
 * * For all values besides `null` and `undefined`, the value will be cast to a number before it's added to the
 *   overall metric of the current series - if this results in `NaN` (like in case of objects), all cells of the
 *   current series will be set to `NaN`.
 * * To determine separate series defined by the `by` columns, the values of these columns will be cast to strings
 *   before comparison. If the values are objects, the return value of their `toString` method will be used for comparison.
 *   Missing values (`null` and `undefined`) will be treated as empty strings.
 */
const overallMetric = {
  name: 'overall_metric',
  type: 'datatable',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressions.functions.overallMetric.help', {
    defaultMessage: 'Calculates the overall sum, min, max or average of a column in a data table'
  }),
  args: {
    by: {
      help: _i18n.i18n.translate('expressions.functions.overallMetric.args.byHelpText', {
        defaultMessage: 'Column to split the overall calculation by'
      }),
      multi: true,
      types: ['string'],
      required: false
    },
    metric: {
      help: _i18n.i18n.translate('expressions.functions.overallMetric.metricHelpText', {
        defaultMessage: 'Metric to calculate'
      }),
      types: ['string'],
      options: ['sum', 'min', 'max', 'average']
    },
    inputColumnId: {
      help: _i18n.i18n.translate('expressions.functions.overallMetric.args.inputColumnIdHelpText', {
        defaultMessage: 'Column to calculate the overall metric of'
      }),
      types: ['string'],
      required: true
    },
    outputColumnId: {
      help: _i18n.i18n.translate('expressions.functions.overallMetric.args.outputColumnIdHelpText', {
        defaultMessage: 'Column to store the resulting overall metric in'
      }),
      types: ['string'],
      required: true
    },
    outputColumnName: {
      help: _i18n.i18n.translate('expressions.functions.overallMetric.args.outputColumnNameHelpText', {
        defaultMessage: 'Name of the column to store the resulting overall metric in'
      }),
      types: ['string'],
      required: false
    }
  },

  async fn(input, args) {
    const {
      overallMetricFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./overall_metric_fn')));
    return overallMetricFn(input, args);
  }

};
exports.overallMetric = overallMetric;