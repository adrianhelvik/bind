"use strict";

var _observable = _interopRequireDefault(require("./observable.js"));

var _track2 = _interopRequireDefault(require("./track.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

it('can track methods on prototypes', function () {
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

  var _track = (0, _track2["default"])(function () {
    state.todos[0].toggle();
  }),
      updated = _track.updated;

  expect(updated.size).toBe(1);
});