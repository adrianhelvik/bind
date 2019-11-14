"use strict";

var _observable = _interopRequireDefault(require("./observable.js"));

var _reaction = _interopRequireDefault(require("./reaction.js"));

var _track3 = _interopRequireDefault(require("./track.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

it('wraps the real object', function () {
  var unwrapped = {};
  var wrapped = (0, _observable["default"])(unwrapped);
  unwrapped.message = 'Hello world';
  expect(wrapped.message).toBe('Hello world');
});
it('makes the object observable', function () {
  var state = (0, _observable["default"])({});

  var _track = (0, _track3["default"])(function () {
    state.message = 'Hello world';
  }),
      updated = _track.updated;

  expect(updated.size).toBe(1);
});
it('makes children observable', function () {
  var state = (0, _observable["default"])({});
  state.container = {};

  var _track2 = (0, _track3["default"])(function () {
    state.container.message = 'Hello world';
  }),
      updated = _track2.updated;

  expect(updated.size).toBe(1);
});