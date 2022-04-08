"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeprecationsInfo = getDeprecationsInfo;

var _i18n = require("@kbn/i18n");

var _deprecations = require("../lib/deprecations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const REPORTING_USER_ROLE_NAME = 'reporting_user';

const getDocumentationUrl = branch => {
  // TODO: remove when docs support "main"
  const docBranch = branch === 'main' ? 'master' : branch;
  return `https://www.elastic.co/guide/en/kibana/${docBranch}/kibana-privileges.html`;
};

async function getDeprecationsInfo({
  esClient
}, {
  reportingCore
}) {
  const client = esClient.asCurrentUser;
  const {
    security
  } = reportingCore.getPluginSetupDeps(); // Nothing to do if security is disabled

  if (!(security !== null && security !== void 0 && security.license.isEnabled())) {
    return [];
  }

  const config = reportingCore.getConfig();
  const deprecatedRoles = config.get('roles', 'allow') || ['reporting_user'];
  return [...(await getUsersDeprecations(client, reportingCore, deprecatedRoles)), ...(await getRoleMappingsDeprecations(client, reportingCore, deprecatedRoles))];
}

async function getUsersDeprecations(client, reportingCore, deprecatedRoles) {
  const usingDeprecatedConfig = !reportingCore.getContract().usesUiCapabilities();
  const strings = {
    title: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.title', {
      defaultMessage: `The "{reportingUserRoleName}" role is deprecated: check user roles`,
      values: {
        reportingUserRoleName: REPORTING_USER_ROLE_NAME
      }
    }),
    message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.description', {
      defaultMessage: `The default mechanism for Reporting privileges will work differently in future versions, and` + ` this cluster has users who have a deprecated role for this privilege.` + ` Set "xpack.reporting.roles.enabled" to "false" to adopt the future behavior before upgrading.`
    }),
    manualSteps: usersRoles => [...(usingDeprecatedConfig ? [_i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.manualStepOne', {
      defaultMessage: `Set "xpack.reporting.roles.enabled" to "false" in kibana.yml.`
    }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.manualStepTwo', {
      defaultMessage: `Remove "xpack.reporting.roles.allow" in kibana.yml, if present.`
    })] : []), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.manualStepThree', {
      defaultMessage: `Go to Management > Security > Roles to create one or more roles that grant` + ` the Kibana application privilege for Reporting.`
    }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.manualStepFour', {
      defaultMessage: `Grant Reporting privileges to users by assigning one of the new roles.`
    }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleUsers.manualStepFive', {
      defaultMessage: `Remove the "reporting_user" role from all users and add the custom role.` + ` The affected users are: {usersRoles}.`,
      values: {
        usersRoles
      }
    })]
  };
  let users;

  try {
    users = (await client.security.getUser()).body;
  } catch (err) {
    const {
      logger
    } = reportingCore.getPluginSetupDeps();

    if (_deprecations.deprecations.getErrorStatusCode(err) === 403) {
      logger.warn(`Failed to retrieve users when checking for deprecations:` + ` the "manage_security" cluster privilege is required.`);
    } else {
      logger.error(`Failed to retrieve users when checking for deprecations,` + ` unexpected error: ${_deprecations.deprecations.getDetailedErrorMessage(err)}.`);
    }

    return _deprecations.deprecations.deprecationError(strings.title, err);
  }

  const reportingUsers = Object.entries(users).reduce((userSet, current) => {
    const [userName, user] = current;
    const foundRole = user.roles.find(role => deprecatedRoles.includes(role));
    return foundRole ? [...userSet, `${userName}[${foundRole}]`] : userSet;
  }, []);

  if (reportingUsers.length === 0) {
    return [];
  }

  return [{
    title: strings.title,
    message: strings.message,
    correctiveActions: {
      manualSteps: strings.manualSteps(reportingUsers.join(', '))
    },
    level: 'warning',
    deprecationType: 'feature',
    documentationUrl: getDocumentationUrl(reportingCore.getKibanaPackageInfo().branch)
  }];
}

async function getRoleMappingsDeprecations(client, reportingCore, deprecatedRoles) {
  const usingDeprecatedConfig = !reportingCore.getContract().usesUiCapabilities();
  const strings = {
    title: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.title', {
      defaultMessage: `The "{reportingUserRoleName}" role is deprecated: check role mappings`,
      values: {
        reportingUserRoleName: REPORTING_USER_ROLE_NAME
      }
    }),
    message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.description', {
      defaultMessage: `The default mechanism for Reporting privileges will work differently in future versions, and` + ` this cluster has role mappings that are mapped to a deprecated role for this privilege.` + ` Set "xpack.reporting.roles.enabled" to "false" to adopt the future behavior before upgrading.`
    }),
    manualSteps: roleMappings => [...(usingDeprecatedConfig ? [_i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.manualStepOne', {
      defaultMessage: `Set "xpack.reporting.roles.enabled" to "false" in kibana.yml.`
    }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.manualStepTwo', {
      defaultMessage: `Remove "xpack.reporting.roles.allow" in kibana.yml, if present.`
    })] : []), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.manualStepThree', {
      defaultMessage: `Go to Management > Security > Roles to create one or more roles that grant` + ` the Kibana application privilege for Reporting.`
    }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.manualStepFour', {
      defaultMessage: `Grant Reporting privileges to users by assigning one of the new roles.`
    }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoleMappings.manualStepFive', {
      defaultMessage: `Remove the "reporting_user" role from all role mappings and add the custom role.` + ` The affected role mappings are: {roleMappings}.`,
      values: {
        roleMappings
      }
    })]
  };
  let roleMappings;

  try {
    roleMappings = (await client.security.getRoleMapping()).body;
  } catch (err) {
    const {
      logger
    } = reportingCore.getPluginSetupDeps();

    if (_deprecations.deprecations.getErrorStatusCode(err) === 403) {
      logger.warn(`Failed to retrieve role mappings when checking for deprecations:` + ` the "manage_security" cluster privilege is required.`);
    } else {
      logger.error(`Failed to retrieve role mappings when checking for deprecations,` + ` unexpected error: ${_deprecations.deprecations.getDetailedErrorMessage(err)}.`);
    }

    return _deprecations.deprecations.deprecationError(strings.title, err);
  }

  const roleMappingsWithReportingRole = Object.entries(roleMappings).reduce((roleSet, current) => {
    const [roleName, role] = current;
    const foundMapping = role.roles.find(roll => deprecatedRoles.includes(roll));
    return foundMapping ? [...roleSet, `${roleName}[${foundMapping}]`] : roleSet;
  }, []);

  if (roleMappingsWithReportingRole.length === 0) {
    return [];
  }

  return [{
    title: strings.title,
    message: strings.message,
    correctiveActions: {
      manualSteps: strings.manualSteps(roleMappingsWithReportingRole.join(', '))
    },
    level: 'warning',
    deprecationType: 'feature',
    documentationUrl: getDocumentationUrl(reportingCore.getKibanaPackageInfo().branch)
  }];
}