"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Tracker = _interopRequireDefault(require("./Tracker.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Manager = /*#__PURE__*/function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.trackers = new Set();
    this.transactions = new Set();
    this.activeActions = 0;
    this.debugging = 0;
  }

  _createClass(Manager, [{
    key: "addUpdated",
    value: function addUpdated(binding) {
      if (this.trackers.size === 0) {
        var updateHandlers = _toConsumableArray(binding.updateHandlers);

        updateHandlers.forEach(function (fn) {
          fn();
        });
      } else {
        var _iterator = _createForOfIteratorHelper(this.trackers),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var tracker = _step.value;
            tracker.updated.add(binding);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "addAccessed",
    value: function addAccessed(binding) {
      var _iterator2 = _createForOfIteratorHelper(this.trackers),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var tracker = _step2.value;
          tracker.accessed.add(binding);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "track",
    value: function track(fn) {
      var tracker = new _Tracker["default"](this);
      this.trackers.add(tracker);
      tracker.track(fn);
      this.trackers["delete"](tracker);
      return tracker;
    }
  }, {
    key: "transaction",
    value: function transaction(fn) {
      var transaction = [];
      this.transactions.add(transaction);

      try {
        var result = fn();
      } catch (error) {
        this.transactions["delete"](transaction);
        return {
          result: null,
          transaction: transaction,
          error: error
        };
      }

      this.transactions["delete"](transaction);
      return {
        result: result,
        transaction: transaction
      };
    }
  }, {
    key: "revertTransaction",
    value: function revertTransaction(transaction) {
      var _this = this;

      this.batch(function () {
        var _iterator3 = _createForOfIteratorHelper(transaction.slice().reverse()),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var action = _step3.value;

            if (_this.debugging) {
              console.log('Reverting action:', action);
            }

            var isNew = action.isNew,
                target = action.target,
                property = action.property,
                previous = action.previous;

            if (Array.isArray(target) && property === 'length') {
              while (target.length >= previous) {
                target.pop();
              }
            } else if (isNew) {
              delete target[property];
            } else {
              target[property] = previous;
            }

            if (_this.debugging) {
              console.log('Target after reverting:', target);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      });
    }
  }, {
    key: "batch",
    value: function batch(fn) {
      // When the first batch is executed,
      // create a set for the affected bindings.
      if (this.activeActions === 0) this.updatedBindings = new Set(); // We want to know whether there are
      // actions executing at a given time,
      // so we'll simply track the number
      // of active actions.

      this.activeActions += 1;

      try {
        // Find out which bindings are updated
        var result;

        var _this$track = this.track(function () {
          result = fn();
        }),
            updated = _this$track.updated;

        var _iterator4 = _createForOfIteratorHelper(updated),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var binding = _step4.value;
            this.updatedBindings.add(binding);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return result;
      } finally {
        this.activeActions -= 1; // And finally, when all actions are
        // completed, we want to run all
        // reactions for the affected bindings.

        if (this.activeActions === 0) {
          // Store the handlers in a set, so that
          // if multiple bindings stored the same
          // handlers, we only call those
          // functions once.
          var handlers = new Set();

          var _iterator5 = _createForOfIteratorHelper(this.updatedBindings),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _binding = _step5.value;

              var _iterator7 = _createForOfIteratorHelper(_binding.updateHandlers),
                  _step7;

              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  var handler = _step7.value;
                  handlers.add(handler);
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          var _iterator6 = _createForOfIteratorHelper(handlers),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var _handler = _step6.value;

              try {
                _handler();
              } catch (e) {
                // Capture the first error that
                // is thrown, so that we can
                // rethrow it after we know that
                // all handlers have been executed
                var error = error || e;
              }
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }

        if (error) throw error;
      }
    }
  }]);

  return Manager;
}();

var _default = Manager;
exports["default"] = _default;