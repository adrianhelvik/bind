"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

function autorun(fn, whenTrue, whenFalse) {
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
    if (updated.size) throw Error('Encountered mutation in an autorun function.');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = accessed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var binding = _step.value;
        removers.push(binding.onUpdate(update));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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

var _default = autorun;
exports["default"] = _default;