"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationHasErrors = exports.validatePackagePolicyConfig = exports.validatePackagePolicy = exports.countValidationErrors = void 0;

var _std = require("@kbn/std");

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _ = require("./");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Returns validation information for a given package policy and package info
 * Note: this method assumes that `packagePolicy` is correctly structured for the given package
 */


const validatePackagePolicy = (packagePolicy, packageInfo, safeLoadYaml) => {
  const hasIntegrations = (0, _.doesPackageHaveIntegrations)(packageInfo);
  const validationResults = {
    name: null,
    description: null,
    namespace: null,
    inputs: {}
  };
  const namespaceValidation = (0, _.isValidNamespace)(packagePolicy.namespace);

  if (!packagePolicy.name.trim()) {
    validationResults.name = [_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.nameRequiredErrorMessage', {
      defaultMessage: 'Name is required'
    })];
  }

  if (!namespaceValidation.valid && namespaceValidation.error) {
    validationResults.namespace = [namespaceValidation.error];
  } // Validate package-level vars


  const packageVarsByName = (0, _lodash.keyBy)(packageInfo.vars || [], 'name');
  const packageVars = Object.entries(packagePolicy.vars || {});

  if (packageVars.length) {
    validationResults.vars = packageVars.reduce((results, [name, varEntry]) => {
      results[name] = validatePackagePolicyConfig(varEntry, packageVarsByName[name], name, safeLoadYaml);
      return results;
    }, {});
  }

  if (!packageInfo.policy_templates || packageInfo.policy_templates.length === 0 || !packageInfo.policy_templates.find(policyTemplate => policyTemplate.inputs && policyTemplate.inputs.length > 0)) {
    validationResults.inputs = null;
    return validationResults;
  } // Build cache for fast var definition lookup


  const inputVarDefsByPolicyTemplateAndType = packageInfo.policy_templates.reduce((varDefs, policyTemplate) => {
    (policyTemplate.inputs || []).forEach(input => {
      const varDefKey = hasIntegrations ? `${policyTemplate.name}-${input.type}` : input.type;

      if ((input.vars || []).length) {
        varDefs[varDefKey] = (0, _lodash.keyBy)(input.vars || [], 'name');
      }
    });
    return varDefs;
  }, {});
  const streamsByDatasetAndInput = (packageInfo.data_streams || []).reduce((streams, dataStream) => {
    var _dataStream$streams;

    (_dataStream$streams = dataStream.streams) === null || _dataStream$streams === void 0 ? void 0 : _dataStream$streams.forEach(stream => {
      streams[`${dataStream.dataset}-${stream.input}`] = stream;
    });
    return streams;
  }, {});
  const streamVarDefsByDatasetAndInput = Object.entries(streamsByDatasetAndInput).reduce((varDefs, [path, stream]) => {
    varDefs[path] = (0, _lodash.keyBy)(stream.vars || [], 'name');
    return varDefs;
  }, {}); // Validate each package policy input with either its own var fields and stream vars

  packagePolicy.inputs.forEach(input => {
    if (!input.vars && !input.streams) {
      return;
    }

    const inputKey = hasIntegrations ? `${input.policy_template}-${input.type}` : input.type;
    const inputValidationResults = {
      vars: undefined,
      streams: {}
    }; // Validate input-level var fields

    const inputVars = Object.entries(input.vars || {});

    if (inputVars.length) {
      inputValidationResults.vars = inputVars.reduce((results, [name, configEntry]) => {
        var _inputVarDefsByPolicy;

        results[name] = input.enabled ? validatePackagePolicyConfig(configEntry, ((_inputVarDefsByPolicy = inputVarDefsByPolicyTemplateAndType[inputKey]) !== null && _inputVarDefsByPolicy !== void 0 ? _inputVarDefsByPolicy : {})[name], name, safeLoadYaml) : null;
        return results;
      }, {});
    } else {
      delete inputValidationResults.vars;
    } // Validate each input stream with var definitions


    if (input.streams.length) {
      input.streams.forEach(stream => {
        const streamValidationResults = {};
        const streamVarDefs = streamVarDefsByDatasetAndInput[`${stream.data_stream.dataset}-${input.type}`];

        if (streamVarDefs && Object.keys(streamVarDefs).length) {
          streamValidationResults.vars = Object.keys(streamVarDefs).reduce((results, name) => {
            var _stream$vars;

            const configEntry = stream === null || stream === void 0 ? void 0 : (_stream$vars = stream.vars) === null || _stream$vars === void 0 ? void 0 : _stream$vars[name];
            results[name] = input.enabled && stream.enabled ? validatePackagePolicyConfig(configEntry, streamVarDefs[name], name, safeLoadYaml) : null;
            return results;
          }, {});
        }

        inputValidationResults.streams[stream.data_stream.dataset] = streamValidationResults;
      });
    } else {
      delete inputValidationResults.streams;
    }

    if (inputValidationResults.vars || inputValidationResults.streams) {
      validationResults.inputs[inputKey] = inputValidationResults;
    }
  });

  if (Object.entries(validationResults.inputs).length === 0) {
    validationResults.inputs = null;
  }

  return validationResults;
};

exports.validatePackagePolicy = validatePackagePolicy;

const validatePackagePolicyConfig = (configEntry, varDef, varName, safeLoadYaml) => {
  const errors = [];
  const value = configEntry === null || configEntry === void 0 ? void 0 : configEntry.value;
  let parsedValue = value;

  if (typeof value === 'string') {
    parsedValue = value.trim();
  }

  if (varDef === undefined) {
    // TODO return validation error here once https://github.com/elastic/kibana/issues/125655 is fixed
    // eslint-disable-next-line no-console
    console.debug(`No variable definition for ${varName} found`);
    return null;
  }

  if (varDef.required) {
    if (parsedValue === undefined || varDef.type === 'yaml' && parsedValue === '') {
      errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.requiredErrorMessage', {
        defaultMessage: '{fieldName} is required',
        values: {
          fieldName: varDef.title || varDef.name
        }
      }));
    }
  }

  if (varDef.type === 'yaml') {
    try {
      parsedValue = safeLoadYaml(value);
    } catch (e) {
      errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.invalidYamlFormatErrorMessage', {
        defaultMessage: 'Invalid YAML format'
      }));
    }
  }

  if (varDef.multi) {
    if (parsedValue && !Array.isArray(parsedValue)) {
      errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.invalidArrayErrorMessage', {
        defaultMessage: 'Invalid format'
      }));
    }

    if (varDef.required && Array.isArray(parsedValue) && parsedValue.length === 0) {
      errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.requiredErrorMessage', {
        defaultMessage: '{fieldName} is required',
        values: {
          fieldName: varDef.title || varDef.name
        }
      }));
    }

    if (varDef.type === 'text' && parsedValue && Array.isArray(parsedValue)) {
      const invalidStrings = parsedValue.filter(cand => /^[*&]/.test(cand)); // only show one error if multiple strings in array are invalid

      if (invalidStrings.length > 0) {
        errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.quoteStringErrorMessage', {
          defaultMessage: 'Strings starting with special YAML characters like * or & need to be enclosed in double quotes.'
        }));
      }
    }
  }

  if (varDef.type === 'text' && parsedValue && !Array.isArray(parsedValue)) {
    if (/^[*&]/.test(parsedValue)) {
      errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.quoteStringErrorMessage', {
        defaultMessage: 'Strings starting with special YAML characters like * or & need to be enclosed in double quotes.'
      }));
    }
  }

  if (varDef.type === 'bool' && parsedValue && !['true', 'false'].includes(parsedValue.toString())) {
    errors.push(_i18n.i18n.translate('xpack.fleet.packagePolicyValidation.boolValueError', {
      defaultMessage: 'Boolean values must be either true or false'
    }));
  }

  return errors.length ? errors : null;
};

exports.validatePackagePolicyConfig = validatePackagePolicyConfig;

const countValidationErrors = validationResults => {
  const flattenedValidation = (0, _std.getFlattenedObject)(validationResults);
  const errors = Object.values(flattenedValidation).filter(value => Boolean(value)) || [];
  return errors.length;
};

exports.countValidationErrors = countValidationErrors;

const validationHasErrors = validationResults => {
  return countValidationErrors(validationResults) > 0;
};

exports.validationHasErrors = validationHasErrors;