"use strict";

var _observable = _interopRequireDefault(require("./observable.js"));

var _reaction = _interopRequireDefault(require("./reaction.js"));

var _Binding = _interopRequireDefault(require("./Binding.js"));

var _batch = _interopRequireDefault(require("./batch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  var Todo =
  /*#__PURE__*/
  function () {
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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = state.todos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var todo = _step.value;
        todo.done;
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
  state.todos[0].done = false;
  expect(result).toEqual(['reaction 1', 'reaction 2']);
});