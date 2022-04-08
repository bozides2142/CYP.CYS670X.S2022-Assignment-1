"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePdfObservable = generatePdfObservable;

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _pdf = require("../../common/pdf");

var _get_full_redirect_app_url = require("../../common/v2/get_full_redirect_app_url");

var _tracker = require("./tracker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTimeRange = urlScreenshots => {
  const grouped = (0, _lodash.groupBy)(urlScreenshots.map(u => u.timeRange));
  const values = Object.values(grouped);

  if (values.length === 1) {
    return values[0][0];
  }

  return null;
};

function generatePdfObservable(reporting, logger, job, title, locatorParams, options, logo) {
  const tracker = (0, _tracker.getTracker)();
  tracker.startScreenshots();
  /**
   * For each locator we get the relative URL to the redirect app
   */

  const urls = locatorParams.map(locator => [(0, _get_full_redirect_app_url.getFullRedirectAppUrl)(reporting.getConfig(), job.spaceId, job.forceNow), locator]);
  const screenshots$ = reporting.getScreenshots({ ...options,
    urls
  }).pipe((0, _operators.mergeMap)(async ({
    layout,
    metrics$,
    results
  }) => {
    metrics$.subscribe(({
      cpu,
      memory
    }) => {
      tracker.setCpuUsage(cpu);
      tracker.setMemoryUsage(memory);
    });
    tracker.endScreenshots();
    tracker.startSetup();
    const pdfOutput = new _pdf.PdfMaker(layout, logo);

    if (title) {
      const timeRange = getTimeRange(results);
      title += timeRange ? ` - ${timeRange}` : '';
      pdfOutput.setTitle(title);
    }

    tracker.endSetup();
    results.forEach(r => {
      r.screenshots.forEach(screenshot => {
        var _screenshot$title, _screenshot$descripti;

        logger.debug(`Adding image to PDF. Image base64 size: ${screenshot.data.byteLength}`); // prettier-ignore

        tracker.startAddImage();
        tracker.endAddImage();
        pdfOutput.addImage(screenshot.data, {
          title: (_screenshot$title = screenshot.title) !== null && _screenshot$title !== void 0 ? _screenshot$title : undefined,
          description: (_screenshot$descripti = screenshot.description) !== null && _screenshot$descripti !== void 0 ? _screenshot$descripti : undefined
        });
      });
    });
    let buffer = null;

    try {
      var _buffer$byteLength, _buffer;

      tracker.startCompile();
      logger.info(`Compiling PDF using "${layout.id}" layout...`);
      pdfOutput.generate();
      tracker.endCompile();
      tracker.startGetBuffer();
      logger.debug(`Generating PDF Buffer...`);
      buffer = await pdfOutput.getBuffer();
      const byteLength = (_buffer$byteLength = (_buffer = buffer) === null || _buffer === void 0 ? void 0 : _buffer.byteLength) !== null && _buffer$byteLength !== void 0 ? _buffer$byteLength : 0;
      logger.debug(`PDF buffer byte length: ${byteLength}`);
      tracker.setByteLength(byteLength);
      tracker.endGetBuffer();
    } catch (err) {
      logger.error(`Could not generate the PDF buffer!`);
      logger.error(err);
    }

    tracker.end();
    return {
      buffer,
      warnings: results.reduce((found, current) => {
        if (current.error) {
          found.push(current.error.message);
        }

        if (current.renderErrors) {
          found.push(...current.renderErrors);
        }

        return found;
      }, [])
    };
  }));
  return screenshots$;
}