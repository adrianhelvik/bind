"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Tracker = _interopRequireDefault(require("./Tracker.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Manager =
/*#__PURE__*/
function () {
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
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.trackers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tracker = _step.value;
            tracker.updated.add(binding);
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
    }
  }, {
    key: "addAccessed",
    value: function addAccessed(binding) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.trackers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tracker = _step2.value;
          tracker.accessed.add(binding);
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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = transaction.slice().reverse()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
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

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = updated[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var binding = _step4.value;
            this.updatedBindings.add(binding);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
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
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = this.updatedBindings[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var _binding = _step5.value;
              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                for (var _iterator7 = _binding.updateHandlers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  var handler = _step7.value;
                  handlers.add(handler);
                }
              } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                    _iterator7["return"]();
                  }
                } finally {
                  if (_didIteratorError7) {
                    throw _iteratorError7;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                _iterator5["return"]();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = handlers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
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
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                _iterator6["return"]();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
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