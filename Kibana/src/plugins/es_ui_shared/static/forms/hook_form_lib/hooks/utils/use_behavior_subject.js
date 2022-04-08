"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBehaviorSubject = void 0;

var _react = require("react");

var _rxjs = require("rxjs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const useBehaviorSubject = initialState => {
  const subjectRef = (0, _react.useRef)();
  const getSubject$ = (0, _react.useCallback)(() => {
    if (subjectRef.current === undefined) {
      subjectRef.current = new _rxjs.BehaviorSubject(initialState);
    }

    return subjectRef.current;
  }, [initialState]);
  const hook = (0, _react.useMemo)(() => {
    const subject = getSubject$();
    const observable = subject.asObservable();
    const next = subject.next.bind(subject);
    return [observable, next];
  }, [getSubject$]);
  return hook;
};

exports.useBehaviorSubject = useBehaviorSubject;