"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageCountersService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Rx = _interopRequireWildcard(require("rxjs"));

var rxOp = _interopRequireWildcard(require("rxjs/operators"));

var _moment = _interopRequireDefault(require("moment"));

var _usage_counter = require("./usage_counter");

var _saved_objects = require("./saved_objects");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class UsageCountersService {
  constructor({
    logger,
    retryCount,
    bufferDurationMs
  }) {
    (0, _defineProperty2.default)(this, "stop$", new Rx.Subject());
    (0, _defineProperty2.default)(this, "retryCount", void 0);
    (0, _defineProperty2.default)(this, "bufferDurationMs", void 0);
    (0, _defineProperty2.default)(this, "counterSets", new Map());
    (0, _defineProperty2.default)(this, "source$", new Rx.Subject());
    (0, _defineProperty2.default)(this, "counter$", this.source$.pipe(rxOp.multicast(new Rx.Subject()), rxOp.refCount()));
    (0, _defineProperty2.default)(this, "flushCache$", new Rx.Subject());
    (0, _defineProperty2.default)(this, "stopCaching$", new Rx.Subject());
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "setup", core => {
      const cache$ = new Rx.ReplaySubject();
      const storingCache$ = new Rx.BehaviorSubject(false); // flush cache data from cache -> source

      this.flushCache$.pipe(rxOp.exhaustMap(() => cache$), rxOp.takeUntil(this.stop$)).subscribe(data => {
        storingCache$.next(true);
        this.source$.next(data);
      }); // store data into cache when not paused

      storingCache$.pipe(rxOp.distinctUntilChanged(), rxOp.switchMap(isStoring => isStoring ? Rx.EMPTY : this.source$), rxOp.takeUntil(Rx.merge(this.stopCaching$, this.stop$))).subscribe(data => {
        cache$.next(data);
        storingCache$.next(false);
      });
      (0, _saved_objects.registerUsageCountersSavedObjectType)(core.savedObjects);
      return {
        createUsageCounter: this.createUsageCounter,
        getUsageCounterByType: this.getUsageCounterByType
      };
    });
    (0, _defineProperty2.default)(this, "start", ({
      savedObjects
    }) => {
      this.stopCaching$.next();
      const internalRepository = savedObjects.createInternalRepository();
      this.counter$.pipe(
      /* buffer source events every ${bufferDurationMs} */
      rxOp.bufferTime(this.bufferDurationMs),
      /**
       * bufferTime will trigger every ${bufferDurationMs}
       * regardless if source emitted anything or not.
       * using filter will stop cut the pipe short
       */
      rxOp.filter(counters => Array.isArray(counters) && counters.length > 0), rxOp.map(counters => Object.values(this.mergeCounters(counters))), rxOp.takeUntil(this.stop$), rxOp.concatMap(counters => this.storeDate$(counters, internalRepository))).subscribe(results => {
        this.logger.debug('Store counters into savedObjects', {
          kibana: {
            usageCounters: {
              results
            }
          }
        });
      });
      this.flushCache$.next();
    });
    (0, _defineProperty2.default)(this, "stop", () => {
      this.stop$.next();
    });
    (0, _defineProperty2.default)(this, "createUsageCounter", type => {
      if (this.counterSets.get(type)) {
        throw new Error(`Usage counter set "${type}" already exists.`);
      }

      const counterSet = new _usage_counter.UsageCounter({
        domainId: type,
        counter$: this.source$
      });
      this.counterSets.set(type, counterSet);
      return counterSet;
    });
    (0, _defineProperty2.default)(this, "getUsageCounterByType", type => {
      return this.counterSets.get(type);
    });
    (0, _defineProperty2.default)(this, "mergeCounters", counters => {
      const date = _moment.default.now();

      return counters.reduce((acc, counter) => {
        const {
          counterName,
          domainId,
          counterType
        } = counter;
        const key = (0, _saved_objects.serializeCounterKey)({
          domainId,
          counterName,
          counterType,
          date
        });
        const existingCounter = acc[key];

        if (!existingCounter) {
          acc[key] = counter;
          return acc;
        }

        return { ...acc,
          [key]: { ...existingCounter,
            ...counter,
            incrementBy: existingCounter.incrementBy + counter.incrementBy
          }
        };
      }, {});
    });
    this.logger = logger;
    this.retryCount = retryCount;
    this.bufferDurationMs = bufferDurationMs;
  }

  storeDate$(counters, internalRepository) {
    return Rx.forkJoin(counters.map(counter => Rx.defer(() => (0, _saved_objects.storeCounter)(counter, internalRepository)).pipe(rxOp.retry(this.retryCount), rxOp.catchError(error => {
      this.logger.warn(error);
      return Rx.of(error);
    }))));
  }

}

exports.UsageCountersService = UsageCountersService;