"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMessages = exports.getMessages = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _validation = require("./validation");

var _string_utils = require("../util/string_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This is still consumed by a legacy class based React component.
// Once we migrate that component to use hooks, we may replace `once()` with `useMemo()`.


const getMessages = (0, _lodash.once)(docLinks => {
  return {
    categorizer_detector_missing_per_partition_field: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.categorizerMissingPerPartitionFieldMessage', {
        defaultMessage: 'Partition field must be set for detectors that reference "mlcategory" when per-partition categorization is enabled.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionConfiguringCategories
    },
    categorizer_varying_per_partition_fields: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.categorizerVaryingPerPartitionFieldNamesMessage', {
        defaultMessage: 'Detectors with keyword "mlcategory" cannot have different partition_field_name when per-partition categorization is enabled. Found [{fields}].',
        values: {
          fields: '"{{fields}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionConfiguringCategories
    },
    field_not_aggregatable: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.fieldNotAggregatableMessage', {
        defaultMessage: 'Detector field {fieldName} is not an aggregatable field.',
        values: {
          fieldName: '"{{fieldName}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.aggregrations
    },
    fields_not_aggregatable: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.fieldsNotAggregatableMessage', {
        defaultMessage: 'One of the detector fields is not an aggregatable field.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.aggregrations
    },
    cardinality_no_results: {
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityNoResultsHeading', {
        defaultMessage: 'Field cardinality'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityNoResultsMessage', {
        defaultMessage: `Cardinality checks could not be run. The query to validate fields didn't return any documents.`
      })
    },
    cardinality_field_not_exists: {
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityFieldNotExistsHeading', {
        defaultMessage: 'Field cardinality'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityFieldNotExistsMessage', {
        defaultMessage: `Cardinality checks could not be run for field {fieldName}. The query to validate the field didn't return any documents.`,
        values: {
          fieldName: '"{{fieldName}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.aggregrations
    },
    cardinality_by_field: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityByFieldMessage', {
        defaultMessage: 'Cardinality of {fieldName} is above 1000 and might result in high memory usage.',
        values: {
          fieldName: 'by_field "{{fieldName}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionCardinality
    },
    cardinality_over_field_low: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityOverFieldLowMessage', {
        defaultMessage: 'Cardinality of {fieldName} is below 10 and might not be suitable for population analysis.',
        values: {
          fieldName: 'over_field "{{fieldName}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionCardinality
    },
    cardinality_over_field_high: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityOverFieldHighMessage', {
        defaultMessage: 'Cardinality of {fieldName} is above 1000000 and might result in high memory usage.',
        values: {
          fieldName: 'over_field "{{fieldName}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionCardinality
    },
    cardinality_partition_field: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityPartitionFieldMessage', {
        defaultMessage: 'Cardinality of {fieldName} is above 1000 and might result in high memory usage.',
        values: {
          fieldName: 'partition_field "{{fieldName}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionCardinality
    },
    cardinality_model_plot_high: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.cardinalityModelPlotHighMessage', {
        defaultMessage: 'The estimated cardinality of {modelPlotCardinality} ' + 'of fields relevant to creating model plots might result in resource intensive jobs.',
        values: {
          modelPlotCardinality: '{{modelPlotCardinality}}'
        }
      })
    },
    categorization_filters_valid: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.categorizationFiltersValidMessage', {
        defaultMessage: 'Categorization filters checks passed.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionConfiguringCategories
    },
    categorization_filters_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.categorizationFiltersInvalidMessage', {
        defaultMessage: 'The categorization filters configuration is invalid. ' + 'Make sure filters are valid regular expressions and {categorizationFieldName} is set.',
        values: {
          categorizationFieldName: '"categorization_field_name"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResourceAnalysisConfig
    },
    bucket_span_empty: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanEmptyMessage', {
        defaultMessage: 'The bucket span field must be specified.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResourceAnalysisConfig
    },
    bucket_span_estimation_mismatch: {
      status: _validation.VALIDATION_STATUS.INFO,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanEstimationMismatchHeading', {
        defaultMessage: 'Bucket span'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanEstimationMismatchMessage', {
        defaultMessage: 'Current bucket span is {currentBucketSpan}, but bucket span estimation returned {estimateBucketSpan}.',
        values: {
          currentBucketSpan: '"{{currentBucketSpan}}"',
          estimateBucketSpan: '"{{estimateBucketSpan}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionBucketSpan
    },
    bucket_span_high: {
      status: _validation.VALIDATION_STATUS.INFO,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanHighHeading', {
        defaultMessage: 'Bucket span'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanHighMessage', {
        defaultMessage: 'Bucket span is 1 day or more. Be aware that days are considered as UTC days, not local days.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionBucketSpan
    },
    bucket_span_valid: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanValidHeading', {
        defaultMessage: 'Bucket span'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanValidMessage', {
        defaultMessage: 'Format of {bucketSpan} is valid.',
        values: {
          bucketSpan: '"{{bucketSpan}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResourceAnalysisConfig
    },
    bucket_span_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanInvalidHeading', {
        defaultMessage: 'Bucket span'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.bucketSpanInvalidMessage', {
        defaultMessage: 'The specified bucket span is not a valid time interval format e.g. 10m, 1h. It also needs to be higher than zero.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResourceAnalysisConfig
    },
    detectors_duplicates: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.detectorsDuplicatesMessage', {
        defaultMessage: 'Duplicate detectors were found. Detectors having the same combined configuration for ' + '{functionParam}, {fieldNameParam}, {byFieldNameParam}, {overFieldNameParam} and ' + '{partitionFieldNameParam} are not allowed within the same job.',
        values: {
          functionParam: `'function'`,
          fieldNameParam: `'field_name'`,
          byFieldNameParam: `'by_field_name'`,
          overFieldNameParam: `'over_field_name'`,
          partitionFieldNameParam: `'partition_field_name'`
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionDetectors
    },
    detectors_empty: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.detectorsEmptyMessage', {
        defaultMessage: 'No detectors were found. At least one detector must be specified.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionDetectors
    },
    detectors_function_empty: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.detectorsFunctionEmptyMessage', {
        defaultMessage: 'One of the detector functions is empty.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionDetectors
    },
    detectors_function_not_empty: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.detectorsFunctionNotEmptyHeading', {
        defaultMessage: 'Detector functions'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.detectorsFunctionNotEmptyMessage', {
        defaultMessage: 'Presence of detector functions validated in all detectors.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionDetectors
    },
    index_fields_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.indexFieldsInvalidMessage', {
        defaultMessage: 'Could not load fields from index.'
      })
    },
    index_fields_valid: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.indexFieldsValidMessage', {
        defaultMessage: 'Index fields are present in the datafeed.'
      })
    },
    influencer_high: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.influencerHighMessage', {
        defaultMessage: 'The job configuration includes more than 3 influencers. ' + 'Consider using fewer influencers or creating multiple jobs.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionInfluencers
    },
    influencer_low: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.influencerLowMessage', {
        defaultMessage: 'No influencers have been configured. Picking an influencer is strongly recommended.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionInfluencers
    },
    influencer_low_suggestion: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.influencerLowSuggestionMessage', {
        defaultMessage: 'No influencers have been configured. Consider using {influencerSuggestion} as an influencer.',
        values: {
          influencerSuggestion: '{{influencerSuggestion}}'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionInfluencers
    },
    influencer_low_suggestions: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.influencerLowSuggestionsMessage', {
        defaultMessage: 'No influencers have been configured. Consider using one or more of {influencerSuggestion}.',
        values: {
          influencerSuggestion: '{{influencerSuggestion}}'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionInfluencers
    },
    job_id_empty: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobIdEmptyMessage', {
        defaultMessage: 'Job ID field must not be empty.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    job_id_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobIdInvalidMessage', {
        defaultMessage: 'Job ID is invalid. It can contain lowercase alphanumeric (a-z and 0-9) characters, ' + 'hyphens or underscores and must start and end with an alphanumeric character.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    job_id_invalid_max_length: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobIdInvalidMaxLengthErrorMessage', {
        defaultMessage: 'Job ID must be no more than {maxLength, plural, one {# character} other {# characters}} long.',
        values: {
          maxLength: _validation.JOB_ID_MAX_LENGTH
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    job_id_valid: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobIdValidHeading', {
        defaultMessage: 'Job ID format is valid'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobIdValidMessage', {
        defaultMessage: 'Lowercase alphanumeric (a-z and 0-9) characters, hyphens or underscores, ' + 'starts and ends with an alphanumeric character, and is no more than ' + '{maxLength, plural, one {# character} other {# characters}} long.',
        values: {
          maxLength: _validation.JOB_ID_MAX_LENGTH
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    job_group_id_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobGroupIdInvalidMessage', {
        defaultMessage: 'One of the job group names is invalid. They can contain lowercase ' + 'alphanumeric (a-z and 0-9) characters, hyphens or underscores and must start and end with an alphanumeric character.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    job_group_id_invalid_max_length: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobGroupIdInvalidMaxLengthErrorMessage', {
        defaultMessage: 'Job group name must be no more than {maxLength, plural, one {# character} other {# characters}} long.',
        values: {
          maxLength: _validation.JOB_ID_MAX_LENGTH
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    job_group_id_valid: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobGroupIdValidHeading', {
        defaultMessage: 'Job group id formats are valid'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.jobGroupIdValidMessage', {
        defaultMessage: 'Lowercase alphanumeric (a-z and 0-9) characters, hyphens or underscores, ' + 'starts and ends with an alphanumeric character, and is no more than ' + '{maxLength, plural, one {# character} other {# characters}} long.',
        values: {
          maxLength: _validation.JOB_ID_MAX_LENGTH
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionJobResource
    },
    missing_summary_count_field_name: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.missingSummaryCountFieldNameMessage', {
        defaultMessage: 'A job configured with a datafeed with aggregations must set summary_count_field_name; use doc_count or suitable alternative.'
      })
    },
    skipped_extended_tests: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.skippedExtendedTestsMessage', {
        defaultMessage: 'Skipped additional checks because the basic requirements of the job configuration were not met.'
      })
    },
    success_cardinality: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successCardinalityHeading', {
        defaultMessage: 'Cardinality'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successCardinalityMessage', {
        defaultMessage: 'Cardinality of detector fields is within recommended bounds.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionCardinality
    },
    success_bucket_span: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successBucketSpanHeading', {
        defaultMessage: 'Bucket span'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successBucketSpanMessage', {
        defaultMessage: 'Format of {bucketSpan} is valid and passed validation checks.',
        values: {
          bucketSpan: '"{{bucketSpan}}"'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionBucketSpan
    },
    success_influencers: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successInfluencersMessage', {
        defaultMessage: 'Influencer configuration passed the validation checks.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionInfluencers
    },
    estimated_mml_greater_than_max_mml: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.estimatedMmlGreaterThanMaxMmlMessage', {
        defaultMessage: 'The estimated model memory limit is greater than the max model memory limit configured for this cluster.'
      })
    },
    mml_greater_than_effective_max_mml: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.mmlGreaterThanEffectiveMaxMmlMessage', {
        defaultMessage: 'Job will not be able to run in the current cluster because model memory limit is higher than {effectiveMaxModelMemoryLimit}.',
        values: {
          effectiveMaxModelMemoryLimit: '{{effectiveMaxModelMemoryLimit}}'
        }
      })
    },
    mml_greater_than_max_mml: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.mmlGreaterThanMaxMmlMessage', {
        defaultMessage: 'The model memory limit is greater than the max model memory limit configured for this cluster.'
      })
    },
    mml_value_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.mmlValueInvalidMessage', {
        defaultMessage: '{mml} is not a valid value for model memory limit. The value needs to be at least ' + '1MB and should be specified in bytes e.g. 10MB.',
        values: {
          mml: '{{mml}}'
        }
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionModelMemoryLimits
    },
    half_estimated_mml_greater_than_mml: {
      status: _validation.VALIDATION_STATUS.WARNING,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.halfEstimatedMmlGreaterThanMmlMessage', {
        defaultMessage: 'The specified model memory limit is less than half of the estimated model ' + 'memory limit and will likely hit the hard limit.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionModelMemoryLimits
    },
    estimated_mml_greater_than_mml: {
      status: _validation.VALIDATION_STATUS.INFO,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.estimatedMmlGreaterThanMmlMessage', {
        defaultMessage: 'The estimated model memory limit is greater than the model memory limit you have configured.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionModelMemoryLimits
    },
    success_mml: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successMmlHeading', {
        defaultMessage: 'Model memory limit'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successMmlMessage', {
        defaultMessage: 'Valid and within the estimated model memory limit.'
      }),
      url: docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.ml.anomalyDetectionModelMemoryLimits
    },
    success_time_range: {
      status: _validation.VALIDATION_STATUS.SUCCESS,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successTimeRangeHeading', {
        defaultMessage: 'Time range'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.successTimeRangeMessage', {
        defaultMessage: 'Valid and long enough to model patterns in the data.'
      })
    },
    time_field_invalid: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.timeFieldInvalidMessage', {
        defaultMessage: `{timeField} cannot be used as the time field because it is not a field of type 'date' or 'date_nanos'.`,
        values: {
          timeField: `'{{timeField}}'`
        }
      })
    },
    time_range_short: {
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.timeRangeShortHeading', {
        defaultMessage: 'Time range'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.timeRangeShortMessage', {
        defaultMessage: 'The selected or available time range might be too short. The recommended minimum ' + 'time range should be at least {minTimeSpanReadable} and {bucketSpanCompareFactor} times the bucket span.',
        values: {
          minTimeSpanReadable: '{{minTimeSpanReadable}}',
          bucketSpanCompareFactor: '{{bucketSpanCompareFactor}}'
        }
      })
    },
    time_range_before_epoch: {
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.timeRangeBeforeEpochHeading', {
        defaultMessage: 'Time range'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.timeRangeBeforeEpochMessage', {
        defaultMessage: 'The selected or available time range contains data with timestamps before ' + 'the UNIX epoch beginning. Timestamps before 01/01/1970 00:00:00 (UTC) are not supported for machine learning jobs.'
      })
    },
    datafeed_preview_no_documents: {
      status: _validation.VALIDATION_STATUS.WARNING,
      heading: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.datafeedPreviewNoDocumentsHeading', {
        defaultMessage: 'Datafeed preview'
      }),
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.datafeedPreviewNoDocumentsMessage', {
        defaultMessage: 'Running the datafeed preview over the current job configuration produces no results. ' + 'If the index contains no documents this warning can be ignored, otherwise the job may be misconfigured.'
      })
    },
    datafeed_preview_failed: {
      status: _validation.VALIDATION_STATUS.ERROR,
      text: _i18n.i18n.translate('xpack.ml.models.jobValidation.messages.datafeedPreviewFailedMessage', {
        defaultMessage: 'The datafeed preview failed. This may be due to an error in the job or datafeed configurations.'
      })
    }
  };
});
exports.getMessages = getMessages;

const parseMessages = (validationMessages, docLinks) => {
  const messages = getMessages(docLinks);
  return validationMessages.map(message => {
    const messageId = message.id;
    const messageDef = messages[messageId];

    if (typeof messageDef !== 'undefined') {
      // render the message template with the provided metadata
      if (typeof messageDef.heading !== 'undefined') {
        message.heading = (0, _string_utils.renderTemplate)(messageDef.heading, message);
      }

      message.text = (0, _string_utils.renderTemplate)(messageDef.text, message); // check if the error message provides a link with further information
      // if so, add it to the message to be returned with it

      if (typeof messageDef.url !== 'undefined') {
        message.url = messageDef.url;
      }

      message.status = messageDef.status;
    } else {
      message.text = _i18n.i18n.translate('xpack.ml.models.jobValidation.unknownMessageIdErrorMessage', {
        defaultMessage: '{messageId} (unknown message id)',
        values: {
          messageId
        }
      });
    }

    return message;
  });
};

exports.parseMessages = parseMessages;