"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMouseEvent = isMouseEvent;
exports.useMouseMove = useMouseMove;

var _react = require("react");

var _throttle = require("../../services/throttle");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isMouseEvent(event) {
  return _typeof(event) === 'object' && 'pageX' in event && 'pageY' in event;
}

function useMouseMove(handleChange) {
  var interactionConditional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  (0, _react.useEffect)(function () {
    return unbindEventListeners;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  var handleInteraction = function handleInteraction(e, isFirstInteraction) {
    if (e) {
      if (interactionConditional) {
        var x = isMouseEvent(e) ? e.pageX : e.touches[0].pageX;
        var y = isMouseEvent(e) ? e.pageY : e.touches[0].pageY;
        handleChange({
          x: x,
          y: y
        }, isFirstInteraction);
      }
    }
  };

  var handleMouseMove = (0, _throttle.throttle)(function (e) {
    handleChange({
      x: e.pageX,
      y: e.pageY
    }, false);
  });

  var handleMouseDown = function handleMouseDown(e) {
    handleInteraction(e, true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', unbindEventListeners);
  };

  var unbindEventListeners = function unbindEventListeners() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', unbindEventListeners);
  };

  return [handleMouseDown, handleInteraction];
}