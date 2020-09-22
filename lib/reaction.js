"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function reaction(fn, whenTrue, whenFalse) {
  var removers = [];
  var accessed;
  var updated;
  update();

  function update() {
    removers.forEach(function (fn) {
      return fn();
    });
    removers = [];
    var returnValue;

    var _manager$track = _state.manager.track(function () {
      returnValue = fn();
    });

    accessed = _manager$track.accessed;
    updated = _manager$track.updated;

    var _iterator = _createForOfIteratorHelper(accessed),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var binding = _step.value;
        var removeListener = binding.onUpdate(update);
        removers.push(removeListener);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (returnValue && typeof whenTrue === 'function') {
      whenTrue(returnValue);
    }

    if (!returnValue && typeof whenFalse === 'function') {
      whenFalse(returnValue);
    }
  }

  return function () {
    removers.forEach(function (fn) {
      return fn();
    });
  };
}

var _default = reaction;
exports["default"] = _default;