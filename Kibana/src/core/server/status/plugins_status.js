"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginsStatusService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("util");

var _types = require("./types");

var _get_summary_status = require("./get_summary_status");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const STATUS_TIMEOUT_MS = 30 * 1000; // 30 seconds

class PluginsStatusService {
  constructor(deps) {
    (0, _defineProperty2.default)(this, "pluginStatuses", new Map());
    (0, _defineProperty2.default)(this, "update$", new _rxjs.BehaviorSubject(true));
    (0, _defineProperty2.default)(this, "defaultInheritedStatus$", void 0);
    (0, _defineProperty2.default)(this, "newRegistrationsAllowed", true);
    this.deps = deps;
    this.defaultInheritedStatus$ = this.deps.core$.pipe((0, _operators.map)(coreStatus => {
      return (0, _get_summary_status.getSummaryStatus)(Object.entries(coreStatus), {
        allAvailableSummary: `All dependencies are available`
      });
    }));
  }

  set(plugin, status$) {
    if (!this.newRegistrationsAllowed) {
      throw new Error(`Custom statuses cannot be registered after setup, plugin [${plugin}] attempted`);
    }

    this.pluginStatuses.set(plugin, status$);
    this.update$.next(true); // trigger all existing Observables to update from the new source Observable
  }

  blockNewRegistrations() {
    this.newRegistrationsAllowed = false;
  }

  getAll$() {
    return this.getPluginStatuses$([...this.deps.pluginDependencies.keys()]);
  }

  getDependenciesStatus$(plugin) {
    const dependencies = this.deps.pluginDependencies.get(plugin);

    if (!dependencies) {
      throw new Error(`Unknown plugin: ${plugin}`);
    }

    return this.getPluginStatuses$(dependencies).pipe( // Prevent many emissions at once from dependency status resolution from making this too noisy
    (0, _operators.debounceTime)(25));
  }

  getDerivedStatus$(plugin) {
    return this.update$.pipe((0, _operators.debounceTime)(25), // Avoid calling the plugin's custom status logic for every plugin that depends on it.
    (0, _operators.switchMap)(() => {
      // Only go up the dependency tree if any of this plugin's dependencies have a custom status
      // Helps eliminate memory overhead of creating thousands of Observables unnecessarily.
      if (this.anyCustomStatuses(plugin)) {
        return (0, _rxjs.combineLatest)([this.deps.core$, this.getDependenciesStatus$(plugin)]).pipe((0, _operators.map)(([coreStatus, pluginStatuses]) => {
          return (0, _get_summary_status.getSummaryStatus)([...Object.entries(coreStatus), ...Object.entries(pluginStatuses)], {
            allAvailableSummary: `All dependencies are available`
          });
        }));
      } else {
        return this.defaultInheritedStatus$;
      }
    }));
  }

  getPluginStatuses$(plugins) {
    if (plugins.length === 0) {
      return (0, _rxjs.of)({});
    }

    return this.update$.pipe((0, _operators.switchMap)(() => {
      const pluginStatuses = plugins.map(depName => {
        const pluginStatus = this.pluginStatuses.get(depName) ? this.pluginStatuses.get(depName).pipe((0, _operators.timeoutWith)(STATUS_TIMEOUT_MS, this.pluginStatuses.get(depName).pipe((0, _operators.startWith)({
          level: _types.ServiceStatusLevels.unavailable,
          summary: `Status check timed out after ${STATUS_TIMEOUT_MS / 1000}s`
        })))) : this.getDerivedStatus$(depName);
        return [depName, pluginStatus];
      }).map(([pName, status$]) => status$.pipe((0, _operators.map)(status => [pName, status])));
      return (0, _rxjs.combineLatest)(pluginStatuses).pipe((0, _operators.map)(statuses => Object.fromEntries(statuses)), (0, _operators.distinctUntilChanged)(_util.isDeepStrictEqual));
    }));
  }
  /**
   * Determines whether or not this plugin or any plugin in it's dependency tree have a custom status registered.
   */


  anyCustomStatuses(plugin) {
    if (this.pluginStatuses.get(plugin)) {
      return true;
    }

    return this.deps.pluginDependencies.get(plugin).reduce((acc, depName) => acc || this.anyCustomStatuses(depName), false);
  }

}

exports.PluginsStatusService = PluginsStatusService;