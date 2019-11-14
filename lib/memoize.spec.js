"use strict";

var _ = require(".");

it('is run on first call', function () {
  var ran = false;
  var fn = (0, _.memoize)(function () {
    ran = true;
  });
  expect(ran).toBe(false);
  fn();
  expect(ran).toBe(true);
});
it('does not rerun when no state has changed', function () {
  var count = 0;
  var fn = (0, _.memoize)(function () {
    count += 1;
  });
  fn();
  fn();
  expect(count).toBe(1);
});
it('is rerun when it is called again and dependent state has changed', function () {
  var state = (0, _.observable)({});
  var count = 0;
  var fn = (0, _.memoize)(function () {
    state.message;
    count += 1;
  });
  fn();
  state.message = 'Hello world';
  expect(count).toBe(1);
  fn();
  expect(count).toBe(2);
});
it('throws on recursive calls', function () {
  var fn = (0, _.memoize)(function () {
    fn();
  });
  expect(function () {
    fn();
  }).toThrow('Use memoize.skipRecursive to skip recursive calls');
});
it('can skip recursive calls', function () {
  var count = 0;

  var fn = _.memoize.skipRecursive(function () {
    fn();
    count += 1;
  });

  fn();
  expect(count).toBe(1);
});