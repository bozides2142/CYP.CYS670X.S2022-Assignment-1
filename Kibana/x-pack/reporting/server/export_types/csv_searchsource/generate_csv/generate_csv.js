"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CsvGenerator = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../../../src/plugins/data/common");

var _server = require("../../../../../../../src/plugins/kibana_utils/server");

var _constants = require("../../../../common/constants");

var _schema_utils = require("../../../../common/schema_utils");

var _get_export_settings = require("./get_export_settings");

var _max_size_string_builder = require("./max_size_string_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CsvGenerator {
  constructor(job, config, clients, dependencies, cancellationToken, logger, stream) {
    (0, _defineProperty2.default)(this, "csvContainsFormulas", false);
    (0, _defineProperty2.default)(this, "maxSizeReached", false);
    (0, _defineProperty2.default)(this, "csvRowCount", 0);
    this.job = job;
    this.config = config;
    this.clients = clients;
    this.dependencies = dependencies;
    this.cancellationToken = cancellationToken;
    this.logger = logger;
    this.stream = stream;
  }

  async scan(index, searchSource, settings) {
    const {
      scroll: scrollSettings,
      includeFrozen
    } = settings;
    const searchBody = searchSource.getSearchRequestBody();
    this.logger.debug(`executing search request`);
    const searchParams = {
      params: {
        body: searchBody,
        index: index.title,
        scroll: scrollSettings.duration,
        size: scrollSettings.size,
        ignore_throttled: includeFrozen ? false : undefined // "true" will cause deprecation warnings logged in ES

      }
    };
    const results = (await this.clients.data.search(searchParams, {
      strategy: _common.ES_SEARCH_STRATEGY
    }).toPromise()).rawResponse;
    return results;
  }

  async scroll(scrollId, scrollSettings) {
    this.logger.debug(`executing scroll request`);
    const results = (await this.clients.es.asCurrentUser.scroll({
      scroll: scrollSettings.duration,
      scroll_id: scrollId
    })).body;
    return results;
  }
  /*
   * Load field formats for each field in the list
   */


  getFormatters(table) {
    // initialize field formats
    const formatters = {};
    table.columns.forEach(c => {
      const fieldFormat = this.dependencies.fieldFormatsRegistry.deserialize(c.meta.params);
      formatters[c.id] = fieldFormat;
    });
    return formatters;
  }

  escapeValues(settings) {
    return value => {
      if (settings.checkForFormulas && (0, _common.cellHasFormulas)(value)) {
        this.csvContainsFormulas = true; // set warning if cell value has a formula
      }

      return settings.escapeValue(value);
    };
  }

  getColumnsFromTabify(table) {
    const columnIds = table.columns.map(c => c.id);
    columnIds.sort();
    return columnIds;
  }

  formatCellValues(formatters) {
    return ({
      column: tableColumn,
      data: dataTableCell
    }) => {
      let cell; // check truthiness to guard against _score, _type, etc

      if (tableColumn && dataTableCell) {
        try {
          cell = formatters[tableColumn].convert(dataTableCell);
        } catch (err) {
          this.logger.error(err);
          cell = '-';
        }

        try {
          // expected values are a string of JSON where the value(s) is in an array
          cell = JSON.parse(cell);
        } catch (e) {// ignore
        } // We have to strip singular array values out of their array wrapper,
        // So that the value appears the visually the same as seen in Discover


        if (Array.isArray(cell)) {
          cell = cell.map(c => typeof c === 'object' ? JSON.stringify(c) : c).join(', ');
        } // Check for object-type value (geoip)


        if (typeof cell === 'object') {
          cell = JSON.stringify(cell);
        }

        return cell;
      }

      return '-'; // Unknown field: it existed in searchSource but has no value in the result
    };
  }
  /*
   * Use the list of columns to generate the header row
   */


  generateHeader(columns, builder, settings) {
    this.logger.debug(`Building CSV header row...`);
    const header = columns.map(this.escapeValues(settings)).join(settings.separator) + '\n';

    if (!builder.tryAppend(header)) {
      return {
        content: '',
        maxSizeReached: true,
        warnings: []
      };
    }
  }
  /*
   * Format a Datatable into rows of CSV content
   */


  async generateRows(columns, table, builder, formatters, settings) {
    this.logger.debug(`Building ${table.rows.length} CSV data rows...`);

    for (const dataTableRow of table.rows) {
      if (this.cancellationToken.isCancelled()) {
        break;
      }
      /*
       * Intrinsically, generating the rows is a synchronous process. Awaiting
       * on a setImmediate call here partititions what could be a very long and
       * CPU-intenstive synchronous process into an asychronous process. This
       * give NodeJS to process other asychronous events that wait on the Event
       * Loop.
       *
       * See: https://nodejs.org/en/docs/guides/dont-block-the-event-loop/
       *
       * It's likely this creates a lot of context switching, and adds to the
       * time it would take to generate the CSV. There are alternatives to the
       * chosen performance solution:
       *
       * 1. Partition the synchronous process with fewer partitions, by using
       * the loop counter to call setImmediate only every N amount of rows.
       * Testing is required to see what the best N value for most data will
       * be.
       *
       * 2. Use a C++ add-on to generate the CSV using the Node Worker Pool
       * instead of using the Event Loop
       */


      await new Promise(setImmediate);
      const rowDefinition = [];
      const format = this.formatCellValues(formatters);
      const escape = this.escapeValues(settings);

      for (const column of columns) {
        rowDefinition.push(escape(format({
          column,
          data: dataTableRow[column]
        })));
      }

      if (!builder.tryAppend(rowDefinition.join(settings.separator) + '\n')) {
        this.logger.warn(`Max Size Reached after ${this.csvRowCount} rows.`);
        this.maxSizeReached = true;

        if (this.cancellationToken) {
          this.cancellationToken.cancel();
        }

        break;
      }

      this.csvRowCount++;
    }
  }

  async generateData() {
    const [settings, searchSource] = await Promise.all([(0, _get_export_settings.getExportSettings)(this.clients.uiSettings, this.config, this.job.browserTimezone, this.logger), this.dependencies.searchSourceStart.create(this.job.searchSource)]);
    const index = searchSource.getField('index');

    if (!index) {
      throw new Error(`The search must have a reference to an index pattern!`);
    }

    const {
      maxSizeBytes,
      bom,
      escapeFormulaValues,
      scroll: scrollSettings
    } = settings;
    const builder = new _max_size_string_builder.MaxSizeStringBuilder(this.stream, (0, _schema_utils.byteSizeValueToNumber)(maxSizeBytes), bom);
    const warnings = [];
    let first = true;
    let currentRecord = -1;
    let totalRecords = 0;
    let scrollId; // apply timezone from the job to all date field formatters

    try {
      index.fields.getByType('date').forEach(({
        name
      }) => {
        var _index$fieldFormatMap, _index$fieldFormatMap2;

        this.logger.debug(`setting timezone on ${name}`);
        const format = { ...index.fieldFormatMap[name],
          id: ((_index$fieldFormatMap = index.fieldFormatMap[name]) === null || _index$fieldFormatMap === void 0 ? void 0 : _index$fieldFormatMap.id) || 'date',
          // allow id: date_nanos
          params: { ...((_index$fieldFormatMap2 = index.fieldFormatMap[name]) === null || _index$fieldFormatMap2 === void 0 ? void 0 : _index$fieldFormatMap2.params),
            timezone: settings.timezone
          }
        };
        index.setFieldFormat(name, format);
      });
    } catch (err) {
      this.logger.error(err);
    }

    try {
      do {
        if (this.cancellationToken.isCancelled()) {
          break;
        }

        let results;

        if (scrollId == null) {
          var _results, _results$hits; // open a scroll cursor in Elasticsearch


          results = await this.scan(index, searchSource, settings);
          scrollId = (_results = results) === null || _results === void 0 ? void 0 : _results._scroll_id;

          if (((_results$hits = results.hits) === null || _results$hits === void 0 ? void 0 : _results$hits.total) != null) {
            totalRecords = results.hits.total;
            this.logger.debug(`Total search results: ${totalRecords}`);
          }
        } else {
          // use the scroll cursor in Elasticsearch
          results = await this.scroll(scrollId, scrollSettings);
        }

        if (!results) {
          this.logger.warning(`Search results are undefined!`);
          break;
        } // TODO check for shard failures, log them and add a warning if found


        {
          const {
            hits: {
              hits,
              ...hitsMeta
            },
            ...header
          } = results;
          this.logger.debug('Results metadata: ' + JSON.stringify({
            header,
            hitsMeta
          }));
        }
        let table;

        try {
          table = (0, _common.tabifyDocs)(results, index, {
            shallow: true,
            includeIgnoredValues: true
          });
        } catch (err) {
          this.logger.error(err);
        }

        if (!table) {
          break;
        }

        let columns;

        if (this.job.columns && this.job.columns.length > 0) {
          columns = this.job.columns;
        } else {
          columns = this.getColumnsFromTabify(table);
        }

        if (first) {
          first = false;
          this.generateHeader(columns, builder, settings);
        }

        if (table.rows.length < 1) {
          break; // empty report with just the header
        }

        const formatters = this.getFormatters(table);
        await this.generateRows(columns, table, builder, formatters, settings); // update iterator

        currentRecord += table.rows.length;
      } while (currentRecord < totalRecords - 1); // Add warnings to be logged


      if (this.csvContainsFormulas && escapeFormulaValues) {
        warnings.push(_i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.escapedFormulaValues', {
          defaultMessage: 'CSV may contain formulas whose values have been escaped'
        }));
      }
    } catch (err) {
      this.logger.error(err);

      if (err instanceof _server.KbnServerError && err.errBody) {
        throw JSON.stringify(err.errBody.error);
      }
    } finally {
      // clear scrollID
      if (scrollId) {
        this.logger.debug(`executing clearScroll request`);

        try {
          await this.clients.es.asCurrentUser.clearScroll({
            scroll_id: [scrollId]
          });
        } catch (err) {
          this.logger.error(err);
        }
      } else {
        this.logger.warn(`No scrollId to clear!`);
      }
    }

    this.logger.debug(`Finished generating. Row count: ${this.csvRowCount}.`);

    if (!this.maxSizeReached && this.csvRowCount !== totalRecords) {
      this.logger.warning(`ES scroll returned fewer total hits than expected! ` + `Search result total hits: ${totalRecords}. Row count: ${this.csvRowCount}.`);
    }

    return {
      content_type: _constants.CONTENT_TYPE_CSV,
      csv_contains_formulas: this.csvContainsFormulas && !escapeFormulaValues,
      max_size_reached: this.maxSizeReached,
      warnings
    };
  }

}

exports.CsvGenerator = CsvGenerator;