"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertPrivilegesToArray = exports.WithPrivileges = void 0;

var _authorization_provider = require("./authorization_provider");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const toArray = value => Array.isArray(value) ? value : [value];

const convertPrivilegesToArray = privileges => {
  return toArray(privileges).map(p => {
    // Since an privilege can contain a dot in its name:
    //  * `section` needs to be extracted from the beginning of the string until the first dot
    //  * `privilege` should be everything after the dot
    const indexOfFirstPeriod = p.indexOf('.');

    if (indexOfFirstPeriod === -1) {
      throw new Error('Required privilege must have the format "section.privilege"');
    }

    return [p.slice(0, indexOfFirstPeriod), p.slice(indexOfFirstPeriod + 1)];
  });
};

exports.convertPrivilegesToArray = convertPrivilegesToArray;

const WithPrivileges = ({
  privileges: requiredPrivileges,
  children
}) => {
  const {
    isLoading,
    privileges
  } = (0, _authorization_provider.useAuthorizationContext)();
  const privilegesArray = convertPrivilegesToArray(requiredPrivileges);
  const hasPrivileges = isLoading ? false : privilegesArray.every(privilege => {
    const [section, requiredPrivilege] = privilege;

    if (!privileges.missingPrivileges[section]) {
      // if the section does not exist in our missingPriviledges, everything is OK
      return true;
    }

    if (privileges.missingPrivileges[section].length === 0) {
      return true;
    }

    if (requiredPrivilege === '*') {
      // If length > 0 and we require them all... KO
      return false;
    } // If we require _some_ privilege, we make sure that the one
    // we require is *not* in the missingPrivilege array


    return !privileges.missingPrivileges[section].includes(requiredPrivilege);
  });
  const privilegesMissing = privilegesArray.reduce((acc, [section, privilege]) => {
    if (privilege === '*') {
      acc[section] = privileges.missingPrivileges[section] || [];
    } else if (privileges.missingPrivileges[section] && privileges.missingPrivileges[section].includes(privilege)) {
      const missing = acc[section] || [];
      acc[section] = [...missing, privilege];
    }

    return acc;
  }, {});
  return children({
    isLoading,
    hasPrivileges,
    privilegesMissing
  });
};

exports.WithPrivileges = WithPrivileges;