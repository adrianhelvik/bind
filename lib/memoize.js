"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

var _track2 = _interopRequireDefault(require("./track.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var staticSkipRecursive = false;
var upToDate = 'upToDate';
var dirty = 'dirty';
var tracking = new WeakSet();

function memoize(fn) {
  var skipRecursive = staticSkipRecursive;
  var status = dirty;
  var removePrevious;
  var value;
  return function () {
    if (status === dirty) {
      (function () {
        var _track = (0, _track2["default"])(function () {
          if (tracking.has(fn)) {
            if (skipRecursive) {
              return;
            }

            throw Error('Use memoize.skipRecursive to skip recursive calls');
          }

          tracking.add(fn);

          try {
            value = fn();
          } finally {
            tracking["delete"](fn);
          }
        }),
            accessed = _track.accessed;

        var removers = new Set();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = accessed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var binding = _step.value;
            var remover = binding.onUpdate(function () {
              if (_state.manager.debugging) {
                console.log('[debug]: Cache reset for memoized function');
              }

              status = dirty; // We only need to know that
              // the value is dirty once,
              // so we can safely remove
              // further tracking until
              // the value is clean again.

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = removers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _remover = _step2.value;

                  _remover();
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
            });
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

        status = upToDate;
      })();
    }

    if (skipRecursive) return;
    return value;
  };
}

memoize.skipRecursive = function (fn) {
  staticSkipRecursive = true;

  try {
    return memoize(fn);
  } finally {
    staticSkipRecursive = false;
  }
};

var _default = memoize;
exports["default"] = _default;