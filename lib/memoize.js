"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

var _track2 = _interopRequireDefault(require("./track.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

        var _iterator = _createForOfIteratorHelper(accessed),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
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

              var _iterator2 = _createForOfIteratorHelper(removers),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var _remover = _step2.value;

                  _remover();
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            });
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
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