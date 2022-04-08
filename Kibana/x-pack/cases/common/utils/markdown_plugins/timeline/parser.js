"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineParser = exports.ID = void 0;

var i18n = _interopRequireWildcard(require("./translations"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ID = 'timeline';
exports.ID = ID;
const PREFIX = '[';

const TimelineParser = function () {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  const tokenizeTimeline = function (eat, value, silent) {
    if (value.startsWith(PREFIX) === false || value.startsWith(PREFIX) === true && !value.includes('timelines?timeline=(id')) {
      return false;
    }

    let index = 0;
    const nextChar = value[index];

    if (nextChar !== PREFIX) {
      return false;
    }

    if (silent) {
      return true;
    }

    function readArg(open, close) {
      if (value[index] !== open) {
        throw new Error(i18n.NO_PARENTHESES);
      }

      index++;
      let body = '';
      let openBrackets = 0;

      for (; index < value.length; index++) {
        const char = value[index];

        if (char === close && openBrackets === 0) {
          index++;
          return body;
        } else if (char === close) {
          openBrackets--;
        } else if (char === open) {
          openBrackets++;
        }

        body += char;
      }

      return '';
    }

    const timelineTitle = readArg(PREFIX, ']');
    const timelineUrl = readArg('(', ')');
    const match = `[${timelineTitle}](${timelineUrl})`;
    return eat(match)({
      type: ID,
      match
    });
  };

  tokenizeTimeline.locator = (value, fromIndex) => {
    return value.indexOf(PREFIX, fromIndex);
  };

  tokenizers.timeline = tokenizeTimeline;
  methods.splice(methods.indexOf('url'), 0, ID);
};

exports.TimelineParser = TimelineParser;