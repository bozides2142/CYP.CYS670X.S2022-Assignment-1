"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollupDataEnricher = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const rollupDataEnricher = async (indicesList, client) => {
  if (!indicesList || !indicesList.length) {
    return Promise.resolve(indicesList);
  }

  try {
    const {
      body: rollupJobData
    } = await client.asCurrentUser.rollup.getRollupIndexCaps({
      index: '_all'
    });
    return indicesList.map(index => {
      const isRollupIndex = !!rollupJobData[index.name];
      return { ...index,
        isRollupIndex
      };
    });
  } catch (e) {
    // swallow exceptions and return original list
    return indicesList;
  }
};

exports.rollupDataEnricher = rollupDataEnricher;