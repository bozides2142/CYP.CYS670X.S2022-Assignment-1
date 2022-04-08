"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const luceneQueryLanguageLabel = _i18n.i18n.translate('data.advancedSettings.searchQueryLanguageLucene', {
  defaultMessage: 'Lucene'
});

const queryLanguageSettingName = _i18n.i18n.translate('data.advancedSettings.searchQueryLanguageTitle', {
  defaultMessage: 'Query language'
});

const requestPreferenceOptionLabels = {
  sessionId: _i18n.i18n.translate('data.advancedSettings.courier.requestPreferenceSessionId', {
    defaultMessage: 'Session ID'
  }),
  custom: _i18n.i18n.translate('data.advancedSettings.courier.requestPreferenceCustom', {
    defaultMessage: 'Custom'
  }),
  none: _i18n.i18n.translate('data.advancedSettings.courier.requestPreferenceNone', {
    defaultMessage: 'None'
  })
};

function getUiSettings(docLinks) {
  return {
    [_common.UI_SETTINGS.META_FIELDS]: {
      name: _i18n.i18n.translate('data.advancedSettings.metaFieldsTitle', {
        defaultMessage: 'Meta fields'
      }),
      value: ['_source', '_id', '_type', '_index', '_score'],
      description: _i18n.i18n.translate('data.advancedSettings.metaFieldsText', {
        defaultMessage: 'Fields that exist outside of _source to merge into our document when displaying it'
      }),
      schema: _configSchema.schema.arrayOf(_configSchema.schema.string())
    },
    [_common.UI_SETTINGS.DOC_HIGHLIGHT]: {
      name: _i18n.i18n.translate('data.advancedSettings.docTableHighlightTitle', {
        defaultMessage: 'Highlight results'
      }),
      value: true,
      description: _i18n.i18n.translate('data.advancedSettings.docTableHighlightText', {
        defaultMessage: 'Highlight results in Discover and Saved Searches Dashboard. ' + 'Highlighting makes requests slow when working on big documents.'
      }),
      category: ['discover'],
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.QUERY_STRING_OPTIONS]: {
      name: _i18n.i18n.translate('data.advancedSettings.query.queryStringOptionsTitle', {
        defaultMessage: 'Query string options'
      }),
      value: '{ "analyze_wildcard": true }',
      description: _i18n.i18n.translate('data.advancedSettings.query.queryStringOptionsText', {
        defaultMessage: '{optionsLink} for the lucene query string parser. Is only used when "{queryLanguage}" is set ' + 'to {luceneLanguage}.',
        description: 'Part of composite text: data.advancedSettings.query.queryStringOptions.optionsLinkText + ' + 'data.advancedSettings.query.queryStringOptionsText',
        values: {
          optionsLink: `<a href=${docLinks.links.query.luceneQuery} target="_blank" rel="noopener">` + _i18n.i18n.translate('data.advancedSettings.query.queryStringOptions.optionsLinkText', {
            defaultMessage: 'Options'
          }) + '</a>',
          luceneLanguage: luceneQueryLanguageLabel,
          queryLanguage: queryLanguageSettingName
        }
      }),
      type: 'json',
      schema: _configSchema.schema.object({
        default_field: _configSchema.schema.nullable(_configSchema.schema.string()),
        allow_leading_wildcard: _configSchema.schema.nullable(_configSchema.schema.boolean()),
        analyze_wildcard: _configSchema.schema.boolean(),
        analyzer: _configSchema.schema.nullable(_configSchema.schema.string()),
        auto_generate_synonyms_phrase_query: _configSchema.schema.nullable(_configSchema.schema.boolean()),
        boost: _configSchema.schema.nullable(_configSchema.schema.number()),
        default_operator: _configSchema.schema.nullable(_configSchema.schema.string()),
        enable_position_increments: _configSchema.schema.nullable(_configSchema.schema.boolean()),
        fields: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        fuzziness: _configSchema.schema.nullable(_configSchema.schema.string()),
        fuzzy_max_expansions: _configSchema.schema.nullable(_configSchema.schema.number()),
        fuzzy_prefix_length: _configSchema.schema.nullable(_configSchema.schema.number()),
        fuzzy_transpositions: _configSchema.schema.nullable(_configSchema.schema.boolean()),
        lenient: _configSchema.schema.nullable(_configSchema.schema.boolean()),
        max_determinized_states: _configSchema.schema.nullable(_configSchema.schema.number()),
        minimum_should_match: _configSchema.schema.nullable(_configSchema.schema.string()),
        quote_analyzer: _configSchema.schema.nullable(_configSchema.schema.string()),
        phrase_slop: _configSchema.schema.nullable(_configSchema.schema.number()),
        quote_field_suffix: _configSchema.schema.nullable(_configSchema.schema.string()),
        rewrite: _configSchema.schema.nullable(_configSchema.schema.string()),
        time_zone: _configSchema.schema.nullable(_configSchema.schema.string())
      })
    },
    [_common.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS]: {
      name: _i18n.i18n.translate('data.advancedSettings.query.allowWildcardsTitle', {
        defaultMessage: 'Allow leading wildcards in query'
      }),
      value: true,
      description: _i18n.i18n.translate('data.advancedSettings.query.allowWildcardsText', {
        defaultMessage: 'When set, * is allowed as the first character in a query clause. ' + 'Currently only applies when experimental query features are enabled in the query bar. ' + 'To disallow leading wildcards in basic lucene queries, use {queryStringOptionsPattern}.',
        values: {
          queryStringOptionsPattern: _common.UI_SETTINGS.QUERY_STRING_OPTIONS
        }
      }),
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.SEARCH_QUERY_LANGUAGE]: {
      name: queryLanguageSettingName,
      value: _common.DEFAULT_QUERY_LANGUAGE,
      description: _i18n.i18n.translate('data.advancedSettings.searchQueryLanguageText', {
        defaultMessage: 'Query language used by the query bar. KQL is a new language built specifically for Kibana.'
      }),
      type: 'select',
      options: ['lucene', 'kuery'],
      optionLabels: {
        lucene: luceneQueryLanguageLabel,
        kuery: _i18n.i18n.translate('data.advancedSettings.searchQueryLanguageKql', {
          defaultMessage: 'KQL'
        })
      },
      schema: _configSchema.schema.string()
    },
    [_common.UI_SETTINGS.SORT_OPTIONS]: {
      name: _i18n.i18n.translate('data.advancedSettings.sortOptionsTitle', {
        defaultMessage: 'Sort options'
      }),
      value: '{ "unmapped_type": "boolean" }',
      description: _i18n.i18n.translate('data.advancedSettings.sortOptionsText', {
        defaultMessage: '{optionsLink} for the Elasticsearch sort parameter',
        description: 'Part of composite text: data.advancedSettings.sortOptions.optionsLinkText + ' + 'data.advancedSettings.sortOptionsText',
        values: {
          optionsLink: `<a href=${docLinks === null || docLinks === void 0 ? void 0 : docLinks.links.elasticsearch.sortSearch} target="_blank" rel="noopener">` + _i18n.i18n.translate('data.advancedSettings.sortOptions.optionsLinkText', {
            defaultMessage: 'Options'
          }) + '</a>'
        }
      }),
      type: 'json',
      schema: _configSchema.schema.object({
        unmapped_type: _configSchema.schema.string()
      })
    },
    defaultIndex: {
      name: _i18n.i18n.translate('data.advancedSettings.defaultIndexTitle', {
        defaultMessage: 'Default index'
      }),
      value: null,
      type: 'string',
      description: _i18n.i18n.translate('data.advancedSettings.defaultIndexText', {
        defaultMessage: 'The index to access if no index is set'
      }),
      schema: _configSchema.schema.nullable(_configSchema.schema.string())
    },
    [_common.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX]: {
      name: _i18n.i18n.translate('data.advancedSettings.courier.ignoreFilterTitle', {
        defaultMessage: 'Ignore filter(s)'
      }),
      value: false,
      description: _i18n.i18n.translate('data.advancedSettings.courier.ignoreFilterText', {
        defaultMessage: 'This configuration enhances support for dashboards containing visualizations accessing dissimilar indexes. ' + 'When disabled, all filters are applied to all visualizations. ' + 'When enabled, filter(s) will be ignored for a visualization ' + `when the visualization's index does not contain the filtering field.`
      }),
      category: ['search'],
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.COURIER_SET_REQUEST_PREFERENCE]: {
      name: _i18n.i18n.translate('data.advancedSettings.courier.requestPreferenceTitle', {
        defaultMessage: 'Request preference'
      }),
      value: 'sessionId',
      options: ['sessionId', 'custom', 'none'],
      optionLabels: requestPreferenceOptionLabels,
      type: 'select',
      description: _i18n.i18n.translate('data.advancedSettings.courier.requestPreferenceText', {
        defaultMessage: `Allows you to set which shards handle your search requests.
          <ul>
            <li><strong>{sessionId}:</strong> restricts operations to execute all search requests on the same shards.
              This has the benefit of reusing shard caches across requests.</li>
            <li><strong>{custom}:</strong> allows you to define a your own preference.
              Use <strong>'courier:customRequestPreference'</strong> to customize your preference value.</li>
            <li><strong>{none}:</strong> means do not set a preference.
              This might provide better performance because requests can be spread across all shard copies.
              However, results might be inconsistent because different shards might be in different refresh states.</li>
          </ul>`,
        values: {
          sessionId: requestPreferenceOptionLabels.sessionId,
          custom: requestPreferenceOptionLabels.custom,
          none: requestPreferenceOptionLabels.none
        }
      }),
      category: ['search'],
      schema: _configSchema.schema.string()
    },
    [_common.UI_SETTINGS.COURIER_CUSTOM_REQUEST_PREFERENCE]: {
      name: _i18n.i18n.translate('data.advancedSettings.courier.customRequestPreferenceTitle', {
        defaultMessage: 'Custom request preference'
      }),
      value: '_local',
      type: 'string',
      description: _i18n.i18n.translate('data.advancedSettings.courier.customRequestPreferenceText', {
        defaultMessage: '{requestPreferenceLink} used when {setRequestReferenceSetting} is set to {customSettingValue}.',
        description: 'Part of composite text: data.advancedSettings.courier.customRequestPreference.requestPreferenceLinkText + ' + 'data.advancedSettings.courier.customRequestPreferenceText',
        values: {
          setRequestReferenceSetting: `<strong>${_common.UI_SETTINGS.COURIER_SET_REQUEST_PREFERENCE}</strong>`,
          customSettingValue: '"custom"',
          requestPreferenceLink: `<a href=${docLinks.links.apis.searchPreference} target="_blank" rel="noopener">` + _i18n.i18n.translate('data.advancedSettings.courier.customRequestPreference.requestPreferenceLinkText', {
            defaultMessage: 'Request Preference'
          }) + '</a>'
        }
      }),
      category: ['search'],
      schema: _configSchema.schema.string()
    },
    [_common.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS]: {
      name: _i18n.i18n.translate('data.advancedSettings.courier.maxRequestsTitle', {
        defaultMessage: 'Max Concurrent Shard Requests'
      }),
      value: 0,
      type: 'number',
      description: _i18n.i18n.translate('data.advancedSettings.courier.maxRequestsText', {
        defaultMessage: 'Controls the {maxRequestsLink} setting used for _msearch requests sent by Kibana. ' + 'Set to 0 to disable this config and use the Elasticsearch default.',
        values: {
          maxRequestsLink: `<a href=${docLinks.links.apis.multiSearch}
            target="_blank" rel="noopener" >max_concurrent_shard_requests</a>`
        }
      }),
      category: ['search'],
      schema: _configSchema.schema.number()
    },
    [_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN]: {
      name: 'Search in frozen indices',
      description: `Will include <a href=${docLinks.links.elasticsearch.frozenIndices}
        target="_blank" rel="noopener">frozen indices</a> in results if enabled. Searching through frozen indices
        might increase the search time.`,
      value: false,
      deprecation: {
        message: _i18n.i18n.translate('data.advancedSettings.search.includeFrozenTextDeprecation', {
          defaultMessage: 'This setting is deprecated and will be removed in Kibana 9.0.'
        }),
        docLinksKey: 'kibanaSearchSettings'
      },
      category: ['search'],
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.HISTOGRAM_BAR_TARGET]: {
      name: _i18n.i18n.translate('data.advancedSettings.histogram.barTargetTitle', {
        defaultMessage: 'Target buckets'
      }),
      value: 50,
      description: _i18n.i18n.translate('data.advancedSettings.histogram.barTargetText', {
        defaultMessage: 'Attempt to generate around this many buckets when using "auto" interval in date and numeric histograms'
      }),
      schema: _configSchema.schema.number()
    },
    [_common.UI_SETTINGS.HISTOGRAM_MAX_BARS]: {
      name: _i18n.i18n.translate('data.advancedSettings.histogram.maxBarsTitle', {
        defaultMessage: 'Maximum buckets'
      }),
      value: 100,
      description: _i18n.i18n.translate('data.advancedSettings.histogram.maxBarsText', {
        defaultMessage: `
          Limits the density of date and number histograms across Kibana
          for better performance using a test query. If the test query would too many buckets,
          the interval between buckets will be increased. This setting applies separately
          to each histogram aggregation, and does not apply to other types of aggregation.
          To find the maximum value of this setting, divide the Elasticsearch 'search.max_buckets'
          value by the maximum number of aggregations in each visualization.
        `
      }),
      schema: _configSchema.schema.number()
    },
    [_common.UI_SETTINGS.HISTORY_LIMIT]: {
      name: _i18n.i18n.translate('data.advancedSettings.historyLimitTitle', {
        defaultMessage: 'History limit'
      }),
      value: 10,
      description: _i18n.i18n.translate('data.advancedSettings.historyLimitText', {
        defaultMessage: 'In fields that have history (e.g. query inputs), show this many recent values'
      }),
      schema: _configSchema.schema.number()
    },
    [_common.UI_SETTINGS.TIMEPICKER_REFRESH_INTERVAL_DEFAULTS]: {
      name: _i18n.i18n.translate('data.advancedSettings.timepicker.refreshIntervalDefaultsTitle', {
        defaultMessage: 'Time filter refresh interval'
      }),
      value: `{
  "pause": false,
  "value": 0
}`,
      type: 'json',
      description: _i18n.i18n.translate('data.advancedSettings.timepicker.refreshIntervalDefaultsText', {
        defaultMessage: `The timefilter's default refresh interval. The "value" needs to be specified in milliseconds.`
      }),
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        pause: _configSchema.schema.boolean(),
        value: _configSchema.schema.number()
      })
    },
    [_common.UI_SETTINGS.TIMEPICKER_TIME_DEFAULTS]: {
      name: _i18n.i18n.translate('data.advancedSettings.timepicker.timeDefaultsTitle', {
        defaultMessage: 'Time filter defaults'
      }),
      value: `{
  "from": "now-15m",
  "to": "now"
}`,
      type: 'json',
      description: _i18n.i18n.translate('data.advancedSettings.timepicker.timeDefaultsText', {
        defaultMessage: 'The timefilter selection to use when Kibana is started without one'
      }),
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string()
      })
    },
    [_common.UI_SETTINGS.TIMEPICKER_QUICK_RANGES]: {
      name: _i18n.i18n.translate('data.advancedSettings.timepicker.quickRangesTitle', {
        defaultMessage: 'Time filter quick ranges'
      }),
      value: JSON.stringify([{
        from: 'now/d',
        to: 'now/d',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.today', {
          defaultMessage: 'Today'
        })
      }, {
        from: 'now/w',
        to: 'now/w',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.thisWeek', {
          defaultMessage: 'This week'
        })
      }, {
        from: 'now-15m',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last15Minutes', {
          defaultMessage: 'Last 15 minutes'
        })
      }, {
        from: 'now-30m',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last30Minutes', {
          defaultMessage: 'Last 30 minutes'
        })
      }, {
        from: 'now-1h',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last1Hour', {
          defaultMessage: 'Last 1 hour'
        })
      }, {
        from: 'now-24h/h',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last24Hours', {
          defaultMessage: 'Last 24 hours'
        })
      }, {
        from: 'now-7d/d',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last7Days', {
          defaultMessage: 'Last 7 days'
        })
      }, {
        from: 'now-30d/d',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last30Days', {
          defaultMessage: 'Last 30 days'
        })
      }, {
        from: 'now-90d/d',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last90Days', {
          defaultMessage: 'Last 90 days'
        })
      }, {
        from: 'now-1y/d',
        to: 'now',
        display: _i18n.i18n.translate('data.advancedSettings.timepicker.last1Year', {
          defaultMessage: 'Last 1 year'
        })
      }], null, 2),
      type: 'json',
      description: _i18n.i18n.translate('data.advancedSettings.timepicker.quickRangesText', {
        defaultMessage: 'The list of ranges to show in the Quick section of the time filter. This should be an array of objects, ' + 'with each object containing "from", "to" (see {acceptedFormatsLink}), and ' + '"display" (the title to be displayed).',
        description: 'Part of composite text: data.advancedSettings.timepicker.quickRangesText + ' + 'data.advancedSettings.timepicker.quickRanges.acceptedFormatsLinkText',
        values: {
          acceptedFormatsLink: `<a href=${docLinks.links.date.dateMath}
            target="_blank" rel="noopener">` + _i18n.i18n.translate('data.advancedSettings.timepicker.quickRanges.acceptedFormatsLinkText', {
            defaultMessage: 'accepted formats'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.arrayOf(_configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string(),
        display: _configSchema.schema.string()
      }))
    },
    [_common.UI_SETTINGS.FILTERS_PINNED_BY_DEFAULT]: {
      name: _i18n.i18n.translate('data.advancedSettings.pinFiltersTitle', {
        defaultMessage: 'Pin filters by default'
      }),
      value: false,
      description: _i18n.i18n.translate('data.advancedSettings.pinFiltersText', {
        defaultMessage: 'Whether the filters should have a global state (be pinned) by default'
      }),
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.FILTERS_EDITOR_SUGGEST_VALUES]: {
      name: _i18n.i18n.translate('data.advancedSettings.suggestFilterValuesTitle', {
        defaultMessage: 'Filter editor suggest values',
        description: '"Filter editor" refers to the UI you create filters in.'
      }),
      value: true,
      description: _i18n.i18n.translate('data.advancedSettings.suggestFilterValuesText', {
        defaultMessage: 'Set this property to false to prevent the filter editor from suggesting values for fields.'
      }),
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.AUTOCOMPLETE_VALUE_SUGGESTION_METHOD]: {
      name: _i18n.i18n.translate('data.advancedSettings.autocompleteValueSuggestionMethod', {
        defaultMessage: 'Autocomplete value suggestion method'
      }),
      type: 'select',
      value: 'terms_enum',
      description: _i18n.i18n.translate('data.advancedSettings.autocompleteValueSuggestionMethodText', {
        defaultMessage: 'The method used for querying suggestions for values in KQL autocomplete. Select terms_enum to use the ' + 'Elasticsearch terms enum API for improved autocomplete suggestion performance. Select terms_agg to use an ' + 'Elasticsearch terms aggregation. {learnMoreLink}',
        values: {
          learnMoreLink: `<a href=${docLinks.links.kibana.autocompleteSuggestions} target="_blank" rel="noopener">` + _i18n.i18n.translate('data.advancedSettings.autocompleteValueSuggestionMethodLink', {
            defaultMessage: 'Learn more.'
          }) + '</a>'
        }
      }),
      options: ['terms_enum', 'terms_agg'],
      category: ['autocomplete'],
      schema: _configSchema.schema.string()
    },
    [_common.UI_SETTINGS.AUTOCOMPLETE_USE_TIMERANGE]: {
      name: _i18n.i18n.translate('data.advancedSettings.autocompleteIgnoreTimerange', {
        defaultMessage: 'Use time range',
        description: 'Restrict autocomplete results to the current time range'
      }),
      value: true,
      description: _i18n.i18n.translate('data.advancedSettings.autocompleteIgnoreTimerangeText', {
        defaultMessage: 'Disable this property to get autocomplete suggestions from your full dataset, rather than from the current time range. {learnMoreLink}',
        values: {
          learnMoreLink: `<a href=${docLinks.links.kibana.autocompleteSuggestions} target="_blank" rel="noopener">` + _i18n.i18n.translate('data.advancedSettings.autocompleteValueSuggestionMethodLearnMoreLink', {
            defaultMessage: 'Learn more.'
          }) + '</a>'
        }
      }),
      category: ['autocomplete'],
      schema: _configSchema.schema.boolean()
    },
    [_common.UI_SETTINGS.SEARCH_TIMEOUT]: {
      name: _i18n.i18n.translate('data.advancedSettings.searchTimeout', {
        defaultMessage: 'Search Timeout'
      }),
      value: 600000,
      description: _i18n.i18n.translate('data.advancedSettings.searchTimeoutDesc', {
        defaultMessage: 'Change the maximum timeout for a search session or set to 0 to disable the timeout and allow queries to run to completion.'
      }),
      type: 'number',
      category: ['search'],
      schema: _configSchema.schema.number()
    }
  };
}