"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAnalyticsJob = validateAnalyticsJob;

var _i18n = require("@kbn/i18n");

var _analytics_utils = require("../../../common/util/analytics_utils");

var _data_frame_analytics = require("../../../common/constants/data_frame_analytics");

var _validation = require("../../../common/constants/validation");

var _errors = require("../../../common/util/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultQuery = {
  match_all: {}
};

const trainingPercentHeading = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.trainingPercentHeading', {
  defaultMessage: 'Training percent'
});

const analysisFieldsHeading = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.analysisFieldsHeading', {
  defaultMessage: 'Analysis fields'
});

const lowFieldCountHeading = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.lowFieldCountHeading', {
  defaultMessage: 'Insufficient fields'
});

const dependentVarHeading = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.dependentVarHeading', {
  defaultMessage: 'Dependent variable'
});

const dependentVarWarningMessage = {
  id: 'dep_var_check',
  text: '',
  status: _validation.VALIDATION_STATUS.WARNING,
  heading: dependentVarHeading
};
const analysisFieldsWarningMessage = {
  id: 'analysis_fields',
  text: '',
  status: _validation.VALIDATION_STATUS.WARNING,
  heading: analysisFieldsHeading
};
const lowFieldCountWarningMessage = {
  id: 'analysis_fields_count',
  text: '',
  status: _validation.VALIDATION_STATUS.WARNING,
  heading: lowFieldCountHeading
};

function getRegressionAndClassificationMessage(analysisConfig, analysisType, totalDocs, depVarCardinality) {
  const messages = [];

  if ((0, _analytics_utils.isRegressionAnalysis)(analysisConfig) || (0, _analytics_utils.isClassificationAnalysis)(analysisConfig)) {
    const trainingPercent = analysisConfig[analysisType].training_percent;
    const featureImportance = analysisConfig[analysisType].num_top_feature_importance_values;
    const topClasses = (0, _analytics_utils.isClassificationAnalysis)(analysisConfig) ? analysisConfig[analysisType].num_top_classes : undefined;

    if (trainingPercent) {
      const trainingDocs = totalDocs * (trainingPercent / 100);
      const trainingPercentMessage = getTrainingPercentMessage(trainingPercent, trainingDocs);

      if (trainingPercentMessage) {
        messages.push(trainingPercentMessage);
      }
    }

    if (featureImportance && featureImportance > 0) {
      messages.push({
        id: 'feature_importance',
        text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.featureImportanceWarningMessage', {
          defaultMessage: 'Enabling feature importance can result in long running jobs when there are a large number of training documents.'
        }),
        status: _validation.VALIDATION_STATUS.WARNING,
        heading: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.featureImportanceHeading', {
          defaultMessage: 'Feature importance'
        })
      });
    }

    if (topClasses !== undefined) {
      if (topClasses === _validation.ALL_CATEGORIES && depVarCardinality && depVarCardinality > _validation.NUM_CATEGORIES_THRESHOLD || topClasses > _validation.NUM_CATEGORIES_THRESHOLD) {
        messages.push({
          id: 'num_top_classes',
          text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.topClassesWarningMessage', {
            defaultMessage: 'Predicted probabilities will be reported for {numCategories, plural, one {# category} other {# categories}}. If you have a large number of categories, there could be a significant effect on the size of your destination index.',
            values: {
              numCategories: topClasses === _validation.ALL_CATEGORIES ? depVarCardinality : topClasses
            }
          }),
          status: _validation.VALIDATION_STATUS.WARNING,
          heading: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.topClassesHeading', {
            defaultMessage: 'Top classes'
          })
        });
      } else {
        messages.push({
          id: 'num_top_classes',
          text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.topClassesSuccessMessage', {
            defaultMessage: 'Predicted probabilities will be reported for {numCategories, plural, one {# category} other {# categories}}.',
            values: {
              numCategories: topClasses === _validation.ALL_CATEGORIES ? depVarCardinality : topClasses
            }
          }),
          status: _validation.VALIDATION_STATUS.SUCCESS,
          heading: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.topClassesHeading', {
            defaultMessage: 'Top classes'
          })
        });
      }
    }
  }

  return messages;
}

function getTrainingPercentMessage(trainingPercent, trainingDocs) {
  if (trainingPercent === 100) {
    return {
      id: 'training_percent_hundred',
      text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.noTestingDataTrainingPercentWarning', {
        defaultMessage: 'All eligible documents will be used for training the model. In order to evaluate the model, provide testing data by reducing the training percent.'
      }),
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: trainingPercentHeading
    };
  }

  if (trainingDocs >= _validation.TRAINING_DOCS_UPPER) {
    return {
      id: 'training_percent_high',
      text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.highTrainingPercentWarning', {
        defaultMessage: 'A high number of training docs may result in long running jobs. Try reducing the training percent.'
      }),
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: trainingPercentHeading
    };
  } else if (trainingDocs <= _validation.TRAINING_DOCS_LOWER) {
    return {
      id: 'training_percent_low',
      text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.lowTrainingPercentWarning', {
        defaultMessage: 'A low number of training docs may result in inaccurate models. Try increasing the training percent or using a larger data set.'
      }),
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: trainingPercentHeading
    };
  } else {
    return {
      id: 'training_percent',
      text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.trainingPercentSuccess', {
        defaultMessage: 'The training percent is high enough to model patterns in the data.'
      }),
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: trainingPercentHeading
    };
  }
}

async function getValidationCheckMessages(asCurrentUser, analyzedFields, analysisConfig, source) {
  const analysisType = (0, _analytics_utils.getAnalysisType)(analysisConfig);
  const depVar = (0, _analytics_utils.getDependentVar)(analysisConfig);
  const index = source.index;
  const query = source.query || defaultQuery;
  const messages = [];
  const emptyFields = [];
  const percentEmptyLimit = _validation.FRACTION_EMPTY_LIMIT * 100;
  let depVarValid = true;
  let depVarCardinality;
  let analysisFieldsNumHigh = false;
  let analysisFieldsEmpty = false;
  const fieldLimit = analyzedFields.length <= _validation.MINIMUM_NUM_FIELD_FOR_CHECK ? analyzedFields.length : _validation.MINIMUM_NUM_FIELD_FOR_CHECK;
  let aggs = analyzedFields.slice(0, fieldLimit).reduce((acc, curr) => {
    acc[curr] = {
      missing: {
        field: curr
      }
    };
    return acc;
  }, {});

  if (depVar !== '') {
    const depVarAgg = {
      [`${depVar}_const`]: {
        cardinality: {
          field: depVar
        }
      }
    };
    aggs = { ...aggs,
      ...depVarAgg
    };
  }

  try {
    const {
      body
    } = await asCurrentUser.search({
      index,
      size: 0,
      track_total_hits: true,
      body: { ...(source.runtime_mappings ? {
          runtime_mappings: source.runtime_mappings
        } : {}),
        query,
        aggs
      }
    }); // @ts-expect-error incorrect search response type

    const totalDocs = body.hits.total.value;

    if (body.aggregations) {
      // @ts-expect-error incorrect search response type
      Object.entries(body.aggregations).forEach(([aggName, {
        doc_count: docCount,
        value
      }]) => {
        if (docCount !== undefined) {
          const empty = docCount / totalDocs;

          if (docCount > 0 && empty > _validation.FRACTION_EMPTY_LIMIT) {
            emptyFields.push(aggName);

            if (aggName === depVar) {
              depVarValid = false;
              dependentVarWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.depVarEmptyWarning', {
                defaultMessage: 'The dependent variable has at least {percentEmpty}% empty values. It may be unsuitable for analysis.',
                values: {
                  percentEmpty: percentEmptyLimit
                }
              });
            }
          }
        }

        if (aggName === `${depVar}_const`) {
          depVarCardinality = value;

          if (value === 1) {
            depVarValid = false;
            dependentVarWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.depVarContsWarning', {
              defaultMessage: 'The dependent variable is a constant value. It may be unsuitable for analysis.'
            });
          }

          if (depVarValid === true) {
            if (analysisType === _data_frame_analytics.ANALYSIS_CONFIG_TYPE.REGRESSION) {
              messages.push({
                id: 'dep_var_check',
                text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.depVarRegSuccess', {
                  defaultMessage: 'The dependent variable field contains continuous values suitable for regression analysis.'
                }),
                status: _validation.VALIDATION_STATUS.SUCCESS,
                heading: dependentVarHeading
              });
            } else {
              messages.push({
                id: 'dep_var_check',
                text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.depVarClassSuccess', {
                  defaultMessage: 'The dependent variable field contains discrete values suitable for classification.'
                }),
                status: _validation.VALIDATION_STATUS.SUCCESS,
                heading: dependentVarHeading
              });
            }
          } else {
            messages.push(dependentVarWarningMessage);
          }
        }
      });
    }

    const regressionAndClassificationMessages = getRegressionAndClassificationMessage(analysisConfig, analysisType, totalDocs, depVarCardinality);
    messages.push(...regressionAndClassificationMessages);

    if (analyzedFields.length && analyzedFields.length > _validation.INCLUDED_FIELDS_THRESHOLD) {
      analysisFieldsNumHigh = true;
    } else {
      if (analysisType === _data_frame_analytics.ANALYSIS_CONFIG_TYPE.OUTLIER_DETECTION && analyzedFields.length < 1) {
        lowFieldCountWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.lowFieldCountOutlierWarningText', {
          defaultMessage: 'Outlier detection requires that at least one field is included in the analysis.'
        });
        messages.push(lowFieldCountWarningMessage);
      } else if (analysisType !== _data_frame_analytics.ANALYSIS_CONFIG_TYPE.OUTLIER_DETECTION && analyzedFields.length < 2) {
        lowFieldCountWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.lowFieldCountWarningText', {
          defaultMessage: '{analysisType} requires that at least two fields are included in the analysis.',
          values: {
            analysisType: analysisType === _data_frame_analytics.ANALYSIS_CONFIG_TYPE.REGRESSION ? 'Regression' : 'Classification'
          }
        });
        messages.push(lowFieldCountWarningMessage);
      }
    }

    if (emptyFields.length) {
      analysisFieldsEmpty = true;
    }

    if (analysisFieldsEmpty || analysisFieldsNumHigh) {
      if (analysisFieldsEmpty && analysisFieldsNumHigh) {
        analysisFieldsWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.analysisFieldsWarningText', {
          defaultMessage: 'Some fields included for analysis have at least {percentEmpty}% empty values. There are more than {includedFieldsThreshold} fields selected for analysis. This may result in increased resource usage and long-running jobs.',
          values: {
            percentEmpty: percentEmptyLimit,
            includedFieldsThreshold: _validation.INCLUDED_FIELDS_THRESHOLD
          }
        });
      } else if (analysisFieldsEmpty && !analysisFieldsNumHigh) {
        analysisFieldsWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.analysisFieldsEmptyWarningText', {
          defaultMessage: 'Some fields included for analysis have at least {percentEmpty}% empty values and may not be suitable for analysis.',
          values: {
            percentEmpty: percentEmptyLimit
          }
        });
      } else {
        analysisFieldsWarningMessage.text = _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.analysisFieldsHighWarningText', {
          defaultMessage: 'There are more than {includedFieldsThreshold} fields selected for analysis. This may result in increased resource usage and long-running jobs.',
          values: {
            includedFieldsThreshold: _validation.INCLUDED_FIELDS_THRESHOLD
          }
        });
      }

      messages.push(analysisFieldsWarningMessage);
    } else {
      messages.push({
        id: 'analysis_fields',
        text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.analysisFieldsSuccessText', {
          defaultMessage: 'The selected analysis fields are at least {percentPopulated}% populated.',
          values: {
            percentPopulated: (1 - _validation.FRACTION_EMPTY_LIMIT) * 100
          }
        }),
        status: _validation.VALIDATION_STATUS.SUCCESS,
        heading: analysisFieldsHeading
      });
    }
  } catch (e) {
    const error = (0, _errors.extractErrorMessage)(e);
    messages.push({
      id: 'validation_error',
      text: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.validationErrorText', {
        defaultMessage: 'An error occurred attempting to validate job. {error}',
        values: {
          error
        }
      }),
      status: _validation.VALIDATION_STATUS.ERROR,
      heading: _i18n.i18n.translate('xpack.ml.models.dfaValidation.messages.validationErrorHeading', {
        defaultMessage: 'Unable to validate job.'
      })
    });
  }

  return messages;
}

async function validateAnalyticsJob(client, job) {
  var _job$analyzed_fields;

  const messages = await getValidationCheckMessages(client.asCurrentUser, (job === null || job === void 0 ? void 0 : (_job$analyzed_fields = job.analyzed_fields) === null || _job$analyzed_fields === void 0 ? void 0 : _job$analyzed_fields.includes) || [], job.analysis, job.source);
  return messages;
}