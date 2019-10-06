"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

function batch(fn) {
  return _state.manager.batch(fn);
}

var _default = batch;
exports["default"] = _default;