"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AuthorizationContext", {
  enumerable: true,
  get: function () {
    return _authorization_provider.AuthorizationContext;
  }
});
Object.defineProperty(exports, "AuthorizationProvider", {
  enumerable: true,
  get: function () {
    return _authorization_provider.AuthorizationProvider;
  }
});
Object.defineProperty(exports, "NotAuthorizedSection", {
  enumerable: true,
  get: function () {
    return _not_authorized_section.NotAuthorizedSection;
  }
});
Object.defineProperty(exports, "PageError", {
  enumerable: true,
  get: function () {
    return _page_error.PageError;
  }
});
Object.defineProperty(exports, "SectionError", {
  enumerable: true,
  get: function () {
    return _section_error.SectionError;
  }
});
Object.defineProperty(exports, "WithPrivileges", {
  enumerable: true,
  get: function () {
    return _with_privileges.WithPrivileges;
  }
});
Object.defineProperty(exports, "useAuthorizationContext", {
  enumerable: true,
  get: function () {
    return _authorization_provider.useAuthorizationContext;
  }
});

var _authorization_provider = require("./authorization_provider");

var _with_privileges = require("./with_privileges");

var _not_authorized_section = require("./not_authorized_section");

var _section_error = require("./section_error");

var _page_error = require("./page_error");