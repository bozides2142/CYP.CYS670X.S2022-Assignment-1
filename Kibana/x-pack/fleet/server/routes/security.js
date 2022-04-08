"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSuperuser = checkSuperuser;
exports.getAuthzFromRequest = getAuthzFromRequest;
exports.makeRouterWithFleetAuthz = makeRouterWithFleetAuthz;

var _common = require("../../common");

var _services = require("../services");

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function checkSecurityEnabled() {
  return _services.appContextService.getSecurityLicense().isEnabled();
}

function checkSuperuser(req) {
  if (!checkSecurityEnabled()) {
    return false;
  }

  const security = _services.appContextService.getSecurity();

  const user = security.authc.getCurrentUser(req);

  if (!user) {
    return false;
  }

  const userRoles = user.roles || [];

  if (!userRoles.includes('superuser')) {
    return false;
  }

  return true;
}

function getAuthorizationFromPrivileges(kibanaPrivileges, searchPrivilege) {
  const privilege = kibanaPrivileges.find(p => p.privilege.includes(searchPrivilege));
  return privilege ? privilege.authorized : false;
}

async function getAuthzFromRequest(req) {
  const security = _services.appContextService.getSecurity();

  if (security.authz.mode.useRbacForRequest(req)) {
    const checkPrivileges = security.authz.checkPrivilegesDynamicallyWithRequest(req);
    const {
      privileges
    } = await checkPrivileges({
      kibana: [security.authz.actions.api.get(`${_constants.PLUGIN_ID}-all`), security.authz.actions.api.get(`${_common.INTEGRATIONS_PLUGIN_ID}-all`), security.authz.actions.api.get(`${_common.INTEGRATIONS_PLUGIN_ID}-read`), security.authz.actions.api.get('fleet-setup')]
    });
    const fleetAllAuth = getAuthorizationFromPrivileges(privileges.kibana, `${_constants.PLUGIN_ID}-all`);
    const intAllAuth = getAuthorizationFromPrivileges(privileges.kibana, `${_common.INTEGRATIONS_PLUGIN_ID}-all`);
    const intReadAuth = getAuthorizationFromPrivileges(privileges.kibana, `${_common.INTEGRATIONS_PLUGIN_ID}-read`);
    const fleetSetupAuth = getAuthorizationFromPrivileges(privileges.kibana, 'fleet-setup');
    return (0, _common.calculateAuthz)({
      fleet: {
        all: fleetAllAuth,
        setup: fleetSetupAuth
      },
      integrations: {
        all: intAllAuth,
        read: intReadAuth
      },
      isSuperuser: checkSuperuser(req)
    });
  }

  return (0, _common.calculateAuthz)({
    fleet: {
      all: false,
      setup: false
    },
    integrations: {
      all: false,
      read: false
    },
    isSuperuser: false
  });
}

function containsRequirement(authz, requirements) {
  if (!authz) {
    return false;
  }

  for (const key of Object.keys(requirements)) {
    if (typeof requirements[key] !== 'undefined' && typeof requirements[key] === 'boolean') {
      if (!authz[key]) {
        return false;
      }
    } else if (!containsRequirement(authz[key], requirements[key])) {
      return false;
    }
  }

  return true;
}

function hasRequiredFleetAuthzPrivilege(authz, {
  fleetAuthz
}) {
  if (!checkSecurityEnabled()) {
    return false;
  }

  if (fleetAuthz && !containsRequirement(authz, fleetAuthz)) {
    return false;
  }

  return true;
}

function shouldHandlePostAuthRequest(req) {
  var _req$route, _req$route$options;

  if (req !== null && req !== void 0 && (_req$route = req.route) !== null && _req$route !== void 0 && (_req$route$options = _req$route.options) !== null && _req$route$options !== void 0 && _req$route$options.tags) {
    return req.route.options.tags.some(tag => tag.match(/^fleet:authz/));
  }

  return false;
}

function deserializeAuthzConfig(tags) {
  let fleetAuthz;

  for (const tag of tags) {
    if (!tag.match(/^fleet:authz/)) {
      continue;
    }

    if (!fleetAuthz) {
      fleetAuthz = {};
    }

    tag.replace(/^fleet:authz:/, '').split(':').reduce((acc, key, idx, keys) => {
      if (idx === keys.length + 1) {
        acc[key] = true;
        return acc;
      }

      if (!acc[key]) {
        acc[key] = {};
      }

      return acc[key];
    }, fleetAuthz);
  }

  return {
    fleetAuthz
  };
}

function serializeAuthzConfig(config) {
  const tags = [];

  if (config.fleetAuthz) {
    function fleetAuthzToTags(requirements, prefix = '') {
      for (const key of Object.keys(requirements)) {
        if (typeof requirements[key] === 'boolean') {
          tags.push(`fleet:authz:${prefix}${key}`);
        } else if (typeof requirements[key] !== 'undefined') {
          fleetAuthzToTags(requirements[key], `${key}:`);
        }
      }
    }

    fleetAuthzToTags(config.fleetAuthz);
  }

  return tags;
}

function makeRouterWithFleetAuthz(router) {
  function buildFleetAuthzRouteConfig({
    fleetAuthz,
    ...routeConfig
  }) {
    var _routeConfig$options$, _routeConfig$options;

    return { ...routeConfig,
      options: { ...routeConfig.options,
        tags: [...((_routeConfig$options$ = routeConfig === null || routeConfig === void 0 ? void 0 : (_routeConfig$options = routeConfig.options) === null || _routeConfig$options === void 0 ? void 0 : _routeConfig$options.tags) !== null && _routeConfig$options$ !== void 0 ? _routeConfig$options$ : []), ...serializeAuthzConfig({
          fleetAuthz
        })]
      }
    };
  }

  const fleetAuthzOnPostAuthHandler = async (req, res, toolkit) => {
    if (!shouldHandlePostAuthRequest(req)) {
      return toolkit.next();
    }

    if (!checkSecurityEnabled()) {
      return res.forbidden();
    }

    const fleetAuthzConfig = deserializeAuthzConfig(req.route.options.tags);

    if (!fleetAuthzConfig) {
      return toolkit.next();
    }

    const authz = await getAuthzFromRequest(req);

    if (!hasRequiredFleetAuthzPrivilege(authz, fleetAuthzConfig)) {
      return res.forbidden();
    }

    return toolkit.next();
  };

  const fleetAuthzRouter = {
    get: (routeConfig, handler) => router.get(buildFleetAuthzRouteConfig(routeConfig), handler),
    delete: (routeConfig, handler) => router.delete(buildFleetAuthzRouteConfig(routeConfig), handler),
    post: (routeConfig, handler) => router.post(buildFleetAuthzRouteConfig(routeConfig), handler),
    put: (routeConfig, handler) => router.put(buildFleetAuthzRouteConfig(routeConfig), handler),
    patch: (routeConfig, handler) => router.patch(buildFleetAuthzRouteConfig(routeConfig), handler),
    handleLegacyErrors: handler => router.handleLegacyErrors(handler),
    getRoutes: () => router.getRoutes(),
    routerPath: router.routerPath
  };
  return {
    router: fleetAuthzRouter,
    onPostAuthHandler: fleetAuthzOnPostAuthHandler
  };
}