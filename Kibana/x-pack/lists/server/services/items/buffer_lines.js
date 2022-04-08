"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BufferLines = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _readline = _interopRequireDefault(require("readline"));

var _stream = require("stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class BufferLines extends _stream.Readable {
  constructor({
    input,
    bufferSize
  }) {
    super({
      encoding: 'utf-8'
    });
    (0, _defineProperty2.default)(this, "set", new Set());
    (0, _defineProperty2.default)(this, "boundary", null);
    (0, _defineProperty2.default)(this, "readableText", false);
    (0, _defineProperty2.default)(this, "paused", false);
    (0, _defineProperty2.default)(this, "bufferSize", void 0);

    if (bufferSize <= 0) {
      throw new RangeError('bufferSize must be greater than zero');
    }

    this.bufferSize = bufferSize;

    const readline = _readline.default.createInterface({
      input
    }); // We are parsing multipart/form-data involving boundaries as fast as we can to get
    // * The filename if it exists and emit it
    // * The actual content within the multipart/form-data


    readline.on('line', line => {
      if (this.boundary == null && line.startsWith('--')) {
        this.boundary = `${line}--`;
      } else if (this.boundary != null && !this.readableText && line.trim() !== '') {
        if (line.startsWith('Content-Disposition')) {
          var _matches$groups;

          const fileNameMatch = RegExp('filename="(?<fileName>.+)"');
          const matches = fileNameMatch.exec(line);

          if ((matches === null || matches === void 0 ? void 0 : (_matches$groups = matches.groups) === null || _matches$groups === void 0 ? void 0 : _matches$groups.fileName) != null) {
            this.emit('fileName', matches.groups.fileName);
          }
        }
      } else if (this.boundary != null && !this.readableText && line.trim() === '') {
        // we are ready to be readable text now for parsing
        this.readableText = true;
      } else if (this.readableText && line.trim() === '') {// skip and do nothing as this is either a empty line or an upcoming end is about to happen
      } else if (this.boundary != null && this.readableText && line === this.boundary) {
        // we are at the end of the stream
        this.boundary = null;
        this.readableText = false;
      } else {
        // we have actual content to push
        this.push(line);
      }
    });
    readline.on('close', () => {
      this.push(null);
    });
  }

  _read() {}

  pause() {
    this.paused = true;
    return this;
  }

  resume() {
    this.paused = false;
    return this;
  }

  emptyBuffer() {
    const arrayFromSet = Array.from(this.set);

    if (arrayFromSet.length === 0) {
      this.emit('lines', []);
    } else {
      while (arrayFromSet.length) {
        const spliced = arrayFromSet.splice(0, this.bufferSize);
        this.emit('lines', spliced);
      }
    }

    this.set.clear();
  }

  push(line) {
    if (line != null) {
      this.set.add(line);

      if (this.paused) {
        return false;
      } else {
        if (this.set.size > this.bufferSize) {
          this.emptyBuffer();
        }

        return true;
      }
    } else {
      if (this.paused) {
        // If we paused but have buffered all of the available data
        // we should do wait for 10(ms) and check again if we are paused
        // or not.
        setTimeout(() => {
          this.push(line);
        }, 10);
        return false;
      } else {
        this.emptyBuffer();
        this.emit('close');
        return true;
      }
    }
  }

}

exports.BufferLines = BufferLines;