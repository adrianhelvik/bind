"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObservable = isObservable;
exports.unwrap = unwrap;
exports["default"] = exports.GET_BINDING = void 0;

var _state = require("./state.js");

var _Binding = _interopRequireDefault(require("./Binding.js"));

var _batch = _interopRequireDefault(require("./batch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var IS_OBSERVABLE = Symbol('IS_OBSERVABLE');
var GET_BINDING = Symbol('GET_BINDING');
exports.GET_BINDING = GET_BINDING;
var UNWRAP = Symbol('UNWRAP');
var observables = new WeakMap();

function observable() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (isObservable(source)) {
    return source;
  }

  if (observables.has(source)) {
    return observables.get(source);
  }

  var bindings = new Map();

  var getBinding = function getBinding(key) {
    return bindings.get(key);
  };

  var proxy = new Proxy(source, {
    get: function get(target, property, receiver) {
      if (property === UNWRAP) {
        return source;
      }

      if (property === IS_OBSERVABLE) {
        return true;
      }

      if (property === GET_BINDING) {
        return getBinding;
      }

      if (!bindings.has(property)) {
        bindings.set(property, new _Binding["default"](property));
      }

      bindings.get(property).accessed();
      var value = Reflect.get(target, property, receiver);

      if (value && _typeof(value) === 'object') {
        return observable(value);
      }

      if (typeof value === 'function') {
        return function batchedMethod() {
          var _arguments = arguments,
              _this = this;

          var result;
          (0, _batch["default"])(function () {
            result = value.apply(_this, _arguments);
          });
          return result;
        };
      }

      return value;
    },
    set: function set(target, property, value, receiver) {
      var isNew = !Object.prototype.hasOwnProperty.call(target, property);

      if (!bindings.has(property)) {
        bindings.set(property, new _Binding["default"](property));
      }

      var result;
      var previous;
      var binding = bindings.get(property);
      (0, _batch["default"])(function () {
        previous = target[property];
        result = Reflect.set(target, property, value, receiver);
        binding.updated();

        var _iterator = _createForOfIteratorHelper(_state.manager.transactions),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      return result;
    }
  });
  observables.set(source, proxy);
  return proxy;
}

var _default = observable;
exports["default"] = _default;

function isObservable(object) {
  return object && object[IS_OBSERVABLE];
}

function unwrap(object) {
  if (!isObservable(object)) {
    return object;
  }

  return object[UNWRAP];
}