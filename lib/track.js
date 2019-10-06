"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

function track(fn) {
  return _state.manager.track(fn);
}

var _default = track;
exports["default"] = _default;