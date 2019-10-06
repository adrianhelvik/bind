"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.GET_BINDING = void 0;

var _state = require("./state.js");

var _Binding = _interopRequireDefault(require("./Binding.js"));

var _batch = _interopRequireDefault(require("./batch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var GET_BINDING = Symbol('GET_BINDING');
exports.GET_BINDING = GET_BINDING;

function observable() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var bindings = new Map();

  var getBinding = function getBinding(key) {
    return bindings.get(key);
  };

  var proxy = new Proxy(source, {
    get: function get(target, property, receiver) {
      if (property === GET_BINDING) {
        return getBinding;
      }

      if (!bindings.has(property)) bindings.set(property, new _Binding["default"](property));
      bindings.get(property).accessed();
      var value = Reflect.get(target, property, receiver);
      if (value && _typeof(value) === 'object') return observable(value);
      if (typeof value === 'function') return function batchedMethod() {
        var _this = this,
            _arguments = arguments;

        var result;
        (0, _batch["default"])(function () {
          result = value.apply(_this, _arguments);
        });
        return result;
      };
      return value;
    },
    set: function set(target, property, value, receiver) {
      var isNew = !Object.prototype.hasOwnProperty.call(target, property);
      if (!bindings.has(property)) bindings.set(property, new _Binding["default"](property));
      var result;
      var previous;
      var binding = bindings.get(property);
      (0, _batch["default"])(function () {
        previous = target[property];
        result = Reflect.set(target, property, value, receiver);
        binding.updated();

        if (_state.manager.debugging) {
          console.log("[debug]: Updated observable property '".concat(property, "' to:"), value);
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _state.manager.transactions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var transaction = _step.value;
            transaction.push({
              target: proxy,
              property: property,
              previous: previous,
              current: value,
              isNew: isNew
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
      });
      return result;
    }
  });
  return proxy;
}

var _default = observable;
exports["default"] = _default;