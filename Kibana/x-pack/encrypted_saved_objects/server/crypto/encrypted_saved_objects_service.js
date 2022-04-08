"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedSavedObjectsService = void 0;
exports.descriptorToArray = descriptorToArray;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _typeDetect = _interopRequireDefault(require("type-detect"));

var _encrypted_saved_object_type_definition = require("./encrypted_saved_object_type_definition");

var _encryption_error = require("./encryption_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Utility function that gives array representation of the saved object descriptor respecting
 * optional `namespace` property.
 * @param descriptor Saved Object descriptor to turn into array.
 */


function descriptorToArray(descriptor) {
  return descriptor.namespace ? [descriptor.namespace, descriptor.type, descriptor.id] : [descriptor.type, descriptor.id];
}
/**
 * Represents the service that tracks all saved object types that might contain attributes that need
 * to be encrypted before they are stored and eventually decrypted when retrieved. The service
 * performs encryption only based on registered saved object types that are known to contain such
 * attributes.
 */


class EncryptedSavedObjectsService {
  /**
   * Map of all registered saved object types where the `key` is saved object type and the `value`
   * is the definition (names of attributes that need to be encrypted etc.).
   */
  constructor(options) {
    (0, _defineProperty2.default)(this, "typeDefinitions", new Map());
    this.options = options;
  }
  /**
   * Registers saved object type as the one that contains attributes that should be encrypted.
   * @param typeRegistration Saved object type registration parameters.
   * @throws Will throw if `attributesToEncrypt` is empty.
   * @throws Will throw if the type is already registered.
   * @throws Will throw if the type is not known saved object type.
   */


  registerType(typeRegistration) {
    if (typeRegistration.attributesToEncrypt.size === 0) {
      throw new Error(`The "attributesToEncrypt" array for "${typeRegistration.type}" is empty.`);
    }

    if (this.typeDefinitions.has(typeRegistration.type)) {
      throw new Error(`The "${typeRegistration.type}" saved object type is already registered.`);
    }

    this.typeDefinitions.set(typeRegistration.type, new _encrypted_saved_object_type_definition.EncryptedSavedObjectAttributesDefinition(typeRegistration));
  }
  /**
   * Checks whether specified saved object type is registered as the one that contains attributes
   * that should be encrypted.
   * @param type Saved object type.
   */


  isRegistered(type) {
    return this.typeDefinitions.has(type);
  }
  /**
   * Takes saved object attributes for the specified type and, depending on the type definition,
   * either decrypts or strips encrypted attributes (e.g. in case AAD or encryption key has changed
   * and decryption is no longer possible).
   * @param descriptor Saved object descriptor (ID, type and optional namespace)
   * @param attributes Object that includes a dictionary of __ALL__ saved object attributes stored
   * in Elasticsearch.
   * @param [originalAttributes] An optional dictionary of __ALL__ saved object original attributes
   * that were used to create that saved object (i.e. values are NOT encrypted).
   * @param [params] Parameters that control the way encrypted attributes are handled.
   */


  async stripOrDecryptAttributes(descriptor, attributesToStripOrDecrypt, originalAttributes, params) {
    const {
      attributes,
      attributesToDecrypt
    } = this.prepareAttributesForStripOrDecrypt(descriptor, attributesToStripOrDecrypt, originalAttributes);

    try {
      const decryptedAttributes = attributesToDecrypt ? await this.decryptAttributes(descriptor, attributesToDecrypt, params) : {};
      return {
        attributes: { ...attributes,
          ...decryptedAttributes
        }
      };
    } catch (error) {
      return {
        attributes,
        error
      };
    }
  }
  /**
   * Takes saved object attributes for the specified type and, depending on the type definition,
   * either decrypts or strips encrypted attributes (e.g. in case AAD or encryption key has changed
   * and decryption is no longer possible).
   * @param descriptor Saved object descriptor (ID, type and optional namespace)
   * @param attributesToStripOrDecrypt Object that includes a dictionary of __ALL__ saved object attributes stored
   * in Elasticsearch.
   * @param [originalAttributes] An optional dictionary of __ALL__ saved object original attributes
   * that were used to create that saved object (i.e. values are NOT encrypted).
   * @param [params] Parameters that control the way encrypted attributes are handled.
   */


  stripOrDecryptAttributesSync(descriptor, attributesToStripOrDecrypt, originalAttributes, params) {
    const {
      attributes,
      attributesToDecrypt
    } = this.prepareAttributesForStripOrDecrypt(descriptor, attributesToStripOrDecrypt, originalAttributes);

    try {
      const decryptedAttributes = attributesToDecrypt ? this.decryptAttributesSync(descriptor, attributesToDecrypt, params) : {};
      return {
        attributes: { ...attributes,
          ...decryptedAttributes
        }
      };
    } catch (error) {
      return {
        attributes,
        error
      };
    }
  }
  /**
   * Takes saved object attributes for the specified type and, depending on the type definition,
   * either strips encrypted attributes, replaces with original decrypted value if available, or
   * prepares them for decryption.
   * @private
   */


  prepareAttributesForStripOrDecrypt(descriptor, attributes, originalAttributes) {
    const typeDefinition = this.typeDefinitions.get(descriptor.type);

    if (typeDefinition === undefined) {
      return {
        attributes,
        attributesToDecrypt: null
      };
    }

    let attributesToDecrypt;
    const clonedAttributes = {};

    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
      // We should strip encrypted attribute if definition explicitly mandates that.
      if (typeDefinition.shouldBeStripped(attributeName)) {
        continue;
      } // If attribute isn't supposed to be encrypted, just copy it to the resulting attribute set.


      if (!typeDefinition.shouldBeEncrypted(attributeName)) {
        clonedAttributes[attributeName] = attributeValue;
      } else if (originalAttributes) {
        // If attribute should be decrypted, but we have original attributes used to create object
        // we should get raw unencrypted value from there to avoid performance penalty.
        clonedAttributes[attributeName] = originalAttributes[attributeName];
      } else if (!attributesToDecrypt) {
        // Decrypt only attributes that are supposed to be exposed.
        attributesToDecrypt = Object.fromEntries(Object.entries(attributes).filter(([key]) => !typeDefinition.shouldBeStripped(key)));
      }
    }

    return {
      attributes: clonedAttributes,
      attributesToDecrypt: attributesToDecrypt && Object.keys(attributesToDecrypt).length > 0 ? attributesToDecrypt : null
    };
  }

  *attributesToEncryptIterator(descriptor, attributes, params) {
    const typeDefinition = this.typeDefinitions.get(descriptor.type);

    if (typeDefinition === undefined) {
      return attributes;
    }

    let encryptionAAD;
    const encryptedAttributes = {};

    for (const attributeName of typeDefinition.attributesToEncrypt) {
      const attributeValue = attributes[attributeName];

      if (attributeValue != null) {
        if (!encryptionAAD) {
          encryptionAAD = this.getAAD(typeDefinition, descriptor, attributes);
        }

        try {
          encryptedAttributes[attributeName] = yield [attributeValue, encryptionAAD];
        } catch (err) {
          this.options.logger.error(`Failed to encrypt "${attributeName}" attribute: ${err.message || err}`);
          throw new _encryption_error.EncryptionError(`Unable to encrypt attribute "${attributeName}"`, attributeName, _encryption_error.EncryptionErrorOperation.Encryption, err);
        }
      }
    } // Normally we expect all registered to-be-encrypted attributes to be defined, but if it's
    // not the case we should collect and log them to make troubleshooting easier.


    const encryptedAttributesKeys = Object.keys(encryptedAttributes);

    if (encryptedAttributesKeys.length !== typeDefinition.attributesToEncrypt.size) {
      this.options.logger.debug(`The following attributes of saved object "${descriptorToArray(descriptor)}" should have been encrypted: ${Array.from(typeDefinition.attributesToEncrypt)}, but found only: ${encryptedAttributesKeys}`);
    }

    if (encryptedAttributesKeys.length === 0) {
      return attributes;
    }

    return { ...attributes,
      ...encryptedAttributes
    };
  }
  /**
   * Takes saved object attributes for the specified type and encrypts all of them that are supposed
   * to be encrypted if any and returns that __NEW__ attributes dictionary back. If none of the
   * attributes were encrypted original attributes dictionary is returned.
   * @param descriptor Descriptor of the saved object to encrypt attributes for.
   * @param attributes Dictionary of __ALL__ saved object attributes.
   * @param [params] Additional parameters.
   * @throws Will throw if encryption fails for whatever reason.
   */


  async encryptAttributes(descriptor, attributes, params) {
    const iterator = this.attributesToEncryptIterator(descriptor, attributes, params);
    let iteratorResult = iterator.next();

    while (!iteratorResult.done) {
      const [attributeValue, encryptionAAD] = iteratorResult.value; // We check this inside of the iterator to throw only if we do need to encrypt anything.

      if (this.options.primaryCrypto) {
        try {
          iteratorResult = iterator.next(await this.options.primaryCrypto.encrypt(attributeValue, encryptionAAD));
        } catch (err) {
          iterator.throw(err);
        }
      } else {
        iterator.throw(new Error('Encryption is disabled because of missing encryption key.'));
      }
    }

    return iteratorResult.value;
  }
  /**
   * Takes saved object attributes for the specified type and encrypts all of them that are supposed
   * to be encrypted if any and returns that __NEW__ attributes dictionary back. If none of the
   * attributes were encrypted original attributes dictionary is returned.
   * @param descriptor Descriptor of the saved object to encrypt attributes for.
   * @param attributes Dictionary of __ALL__ saved object attributes.
   * @param [params] Additional parameters.
   * @throws Will throw if encryption fails for whatever reason.
   */


  encryptAttributesSync(descriptor, attributes, params) {
    const iterator = this.attributesToEncryptIterator(descriptor, attributes, params);
    let iteratorResult = iterator.next();

    while (!iteratorResult.done) {
      const [attributeValue, encryptionAAD] = iteratorResult.value; // We check this inside of the iterator to throw only if we do need to encrypt anything.

      if (this.options.primaryCrypto) {
        try {
          iteratorResult = iterator.next(this.options.primaryCrypto.encryptSync(attributeValue, encryptionAAD));
        } catch (err) {
          iterator.throw(err);
        }
      } else {
        iterator.throw(new Error('Encryption is disabled because of missing encryption key.'));
      }
    }

    return iteratorResult.value;
  }
  /**
   * Takes saved object attributes for the specified type and decrypts all of them that are supposed
   * to be encrypted if any and returns that __NEW__ attributes dictionary back. If none of the
   * attributes were decrypted original attributes dictionary is returned.
   * @param descriptor Descriptor of the saved object to decrypt attributes for.
   * @param attributes Dictionary of __ALL__ saved object attributes.
   * @param [params] Additional parameters.
   * @throws Will throw if decryption fails for whatever reason.
   * @throws Will throw if any of the attributes to decrypt is not a string.
   */


  async decryptAttributes(descriptor, attributes, params) {
    const decrypters = this.getDecrypters(params === null || params === void 0 ? void 0 : params.omitPrimaryEncryptionKey);
    const iterator = this.attributesToDecryptIterator(descriptor, attributes, params);
    let iteratorResult = iterator.next();

    while (!iteratorResult.done) {
      const [attributeValue, encryptionAADs] = iteratorResult.value; // We check this inside of the iterator to throw only if we do need to decrypt anything.

      let decryptionError = decrypters.length === 0 ? new Error('Decryption is disabled because of missing decryption keys.') : undefined;
      const decryptersPerAAD = decrypters.flatMap(decr => encryptionAADs.map(aad => [decr, aad]));

      for (const [decrypter, encryptionAAD] of decryptersPerAAD) {
        try {
          iteratorResult = iterator.next(await decrypter.decrypt(attributeValue, encryptionAAD));
          decryptionError = undefined;
          break;
        } catch (err) {
          // Remember the error thrown when we tried to decrypt with the primary key.
          if (!decryptionError) {
            decryptionError = err;
          }
        }
      }

      if (decryptionError) {
        iterator.throw(decryptionError);
      }
    }

    return iteratorResult.value;
  }
  /**
   * Takes saved object attributes for the specified type and decrypts all of them that are supposed
   * to be encrypted if any and returns that __NEW__ attributes dictionary back. If none of the
   * attributes were decrypted original attributes dictionary is returned.
   * @param descriptor Descriptor of the saved object to decrypt attributes for.
   * @param attributes Dictionary of __ALL__ saved object attributes.
   * @param [params] Additional parameters.
   * @throws Will throw if decryption fails for whatever reason.
   * @throws Will throw if any of the attributes to decrypt is not a string.
   */


  decryptAttributesSync(descriptor, attributes, params) {
    const decrypters = this.getDecrypters(params === null || params === void 0 ? void 0 : params.omitPrimaryEncryptionKey);
    const iterator = this.attributesToDecryptIterator(descriptor, attributes, params);
    let iteratorResult = iterator.next();

    while (!iteratorResult.done) {
      const [attributeValue, encryptionAADs] = iteratorResult.value; // We check this inside of the iterator to throw only if we do need to decrypt anything.

      let decryptionError = decrypters.length === 0 ? new Error('Decryption is disabled because of missing decryption keys.') : undefined;
      const decryptersPerAAD = decrypters.flatMap(decr => encryptionAADs.map(aad => [decr, aad]));

      for (const [decrypter, encryptionAAD] of decryptersPerAAD) {
        try {
          iteratorResult = iterator.next(decrypter.decryptSync(attributeValue, encryptionAAD));
          decryptionError = undefined;
          break;
        } catch (err) {
          // Remember the error thrown when we tried to decrypt with the primary key.
          if (!decryptionError) {
            decryptionError = err;
          }
        }
      }

      if (decryptionError) {
        iterator.throw(decryptionError);
      }
    }

    return iteratorResult.value;
  }

  *attributesToDecryptIterator(descriptor, attributes, params) {
    const typeDefinition = this.typeDefinitions.get(descriptor.type);

    if (typeDefinition === undefined) {
      return attributes;
    }

    const encryptionAADs = [];
    const decryptedAttributes = {};

    for (const attributeName of typeDefinition.attributesToEncrypt) {
      const attributeValue = attributes[attributeName];

      if (attributeValue == null) {
        continue;
      }

      if (typeof attributeValue !== 'string') {
        throw new Error(`Encrypted "${attributeName}" attribute should be a string, but found ${(0, _typeDetect.default)(attributeValue)}`);
      }

      if (!encryptionAADs.length) {
        if (params !== null && params !== void 0 && params.isTypeBeingConverted) {
          // The object is either pending conversion to a multi-namespace type, or it was just converted. We may need to attempt to decrypt
          // it with several different descriptors depending upon how the migrations are structured, and whether this is a full index
          // migration or a single document migration. Note that the originId is set either when the document is converted _or_ when it is
          // imported with "createNewCopies: false", so we have to try with and without it.
          const decryptDescriptors = params.originId ? [{ ...descriptor,
            id: params.originId
          }, descriptor] : [descriptor];

          for (const decryptDescriptor of decryptDescriptors) {
            encryptionAADs.push(this.getAAD(typeDefinition, decryptDescriptor, attributes));

            if (descriptor.namespace) {
              const {
                namespace,
                ...alternateDescriptor
              } = decryptDescriptor;
              encryptionAADs.push(this.getAAD(typeDefinition, alternateDescriptor, attributes));
            }
          }
        } else {
          encryptionAADs.push(this.getAAD(typeDefinition, descriptor, attributes));
        }
      }

      try {
        decryptedAttributes[attributeName] = yield [attributeValue, encryptionAADs];
      } catch (err) {
        this.options.logger.error(`Failed to decrypt "${attributeName}" attribute: ${err.message || err}`);
        throw new _encryption_error.EncryptionError(`Unable to decrypt attribute "${attributeName}"`, attributeName, _encryption_error.EncryptionErrorOperation.Decryption, err);
      }
    } // Normally we expect all registered to-be-encrypted attributes to be defined, but if it's
    // not the case we should collect and log them to make troubleshooting easier.


    const decryptedAttributesKeys = Object.keys(decryptedAttributes);

    if (decryptedAttributesKeys.length !== typeDefinition.attributesToEncrypt.size) {
      this.options.logger.debug(`The following attributes of saved object "${descriptorToArray(descriptor)}" should have been decrypted: ${Array.from(typeDefinition.attributesToEncrypt)}, but found only: ${decryptedAttributesKeys}`);
    }

    if (decryptedAttributesKeys.length === 0) {
      return attributes;
    }

    return { ...attributes,
      ...decryptedAttributes
    };
  }
  /**
   * Generates string representation of the Additional Authenticated Data based on the specified saved
   * object type and attributes.
   * @param typeDefinition Encrypted saved object type definition.
   * @param descriptor Descriptor of the saved object to get AAD for.
   * @param attributes All attributes of the saved object instance of the specified type.
   */


  getAAD(typeDefinition, descriptor, attributes) {
    // Collect all attributes (both keys and values) that should contribute to AAD.
    const attributesAAD = {};

    for (const [attributeKey, attributeValue] of Object.entries(attributes)) {
      if (!typeDefinition.shouldBeExcludedFromAAD(attributeKey)) {
        attributesAAD[attributeKey] = attributeValue;
      }
    }

    if (Object.keys(attributesAAD).length === 0) {
      this.options.logger.debug(`The AAD for saved object "${descriptorToArray(descriptor)}" does not include any attributes.`);
    }

    return (0, _jsonStableStringify.default)([...descriptorToArray(descriptor), attributesAAD]);
  }
  /**
   * Returns list of NodeCrypto instances used for decryption.
   * @param omitPrimaryEncryptionKey Specifies whether returned decrypters shouldn't include primary
   * encryption/decryption crypto.
   */


  getDecrypters(omitPrimaryEncryptionKey) {
    var _this$options$decrypt;

    if (omitPrimaryEncryptionKey) {
      if (!this.options.decryptionOnlyCryptos || this.options.decryptionOnlyCryptos.length === 0) {
        throw new Error(`"omitPrimaryEncryptionKey" cannot be set when secondary keys aren't configured.`);
      }

      return this.options.decryptionOnlyCryptos;
    }

    return [...(this.options.primaryCrypto ? [this.options.primaryCrypto] : []), ...((_this$options$decrypt = this.options.decryptionOnlyCryptos) !== null && _this$options$decrypt !== void 0 ? _this$options$decrypt : [])];
  }

}

exports.EncryptedSavedObjectsService = EncryptedSavedObjectsService;