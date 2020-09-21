"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

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

    if (updated.size) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = updated[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var binding = _step.value;

          if (accessed.has(binding)) {
            throw Error("The binding \"".concat(binding.name, "\" is both read and mutated in a reaction."));
          }
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
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = accessed[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _binding = _step2.value;

        var removeListener = _binding.onUpdate(update);

        removers.push(removeListener);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
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

var _default = reaction;
exports["default"] = _default;