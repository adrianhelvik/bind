"use strict";

var _observable = _interopRequireDefault(require("./observable.js"));

var _reaction = _interopRequireDefault(require("./reaction.js"));

var _Binding = _interopRequireDefault(require("./Binding.js"));

var _batch = _interopRequireDefault(require("./batch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

it('can react to an updated binding', function () {
  var binding = new _Binding["default"]();
  var updated = 0;
  binding.onUpdate(function () {
    updated += 1;
  });
  (0, _reaction["default"])(function () {
    binding.accessed();
  });
  binding.updated();
  expect(updated).toBe(1);
});
it('can react to updated bindings within a batch', function () {
  var binding = new _Binding["default"]();
  var updated = 0;
  binding.onUpdate(function () {
    updated += 1;
  });
  (0, _reaction["default"])(function () {
    binding.accessed();
  });
  (0, _batch["default"])(function () {
    binding.updated();
    binding.updated();
  });
  expect(updated).toBe(1);
});
test('update bug', function () {
  var Todo = /*#__PURE__*/function () {
    function Todo(values) {
      _classCallCheck(this, Todo);

      this.done = false;
      this.text = '';
      Object.assign(this, values);
    }

    _createClass(Todo, [{
      key: "toggle",
      value: function toggle() {
        this.done = !this.done;
      }
    }]);

    return Todo;
  }();

  var state = (0, _observable["default"])({
    todos: [new Todo({
      text: 'make todo list',
      done: true
    })]
  });
  var result = [];
  var i = 0;
  (0, _reaction["default"])(function () {
    result.push("reaction ".concat(++i));

    var _iterator = _createForOfIteratorHelper(state.todos),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var todo = _step.value;
        todo.done;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  state.todos[0].done = false;
  expect(result).toEqual(['reaction 1', 'reaction 2']);
});
it('does not error when updating unrelated state in a reaction', function () {
  var state = (0, _observable["default"])({
    a: true
  });
  (0, _reaction["default"])(function () {
    if (state.a) state.b = true;
  });
  expect(state.b).toBe(true);
});
xit('throws if a dependency is updated in a reaction', function () {
  var state = (0, _observable["default"])({
    count: 0
  });
  expect(function () {
    (0, _reaction["default"])(function () {
      state.count += 1;
      console.log("The count is: ".concat(state.count));
    });
  }).not.toThrow();
});
it('does not throw if a reaction triggers a reaction', function () {
  var state = (0, _observable["default"])({
    message: '',
    greetings: 0
  });
  (0, _reaction["default"])(function () {
    console.log("Greetings delivered: ".concat(state.greetings));
  });
  (0, _reaction["default"])(function () {
    console.log(state.message);
    state.greetings += 1;
  });
});