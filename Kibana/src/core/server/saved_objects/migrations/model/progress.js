"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInitialProgress = createInitialProgress;
exports.incrementProcessedProgress = incrementProcessedProgress;
exports.logProgress = logProgress;
exports.setProgressTotal = setProgressTotal;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns an initial state of the progress object (everything undefined)
 */
function createInitialProgress() {
  return {
    processed: undefined,
    total: undefined
  };
}
/**
 * Overwrites the total of the progress if anything provided
 * @param previousProgress
 * @param total
 */


function setProgressTotal(previousProgress, total = previousProgress.total) {
  return { ...previousProgress,
    total
  };
}
/**
 * Returns a new list of MigrationLogs with the info entry about the progress
 * @param previousLogs
 * @param progress
 */


function logProgress(previousLogs, progress) {
  const logs = [...previousLogs];

  if (progress.total) {
    if (typeof progress.processed === 'undefined') {
      logs.push({
        level: 'info',
        message: `Starting to process ${progress.total} documents.`
      });
    } else {
      logs.push({
        level: 'info',
        message: `Processed ${progress.processed} documents out of ${progress.total}.`
      });
    }
  }

  return logs;
}
/**
 * Increments the processed count and returns a new Progress
 * @param previousProgress Previous state of the progress
 * @param incrementProcessedBy Amount to increase the processed count by
 */


function incrementProcessedProgress(previousProgress, incrementProcessedBy = 0) {
  var _previousProgress$pro;

  return { ...previousProgress,
    processed: ((_previousProgress$pro = previousProgress.processed) !== null && _previousProgress$pro !== void 0 ? _previousProgress$pro : 0) + incrementProcessedBy
  };
}