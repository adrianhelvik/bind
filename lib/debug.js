"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

var _default = function _default(fn) {
  _state.manager.debugging += 1;

  try {
    fn();
  } finally {
    _state.manager.debugging -= 1;
  }
};

exports["default"] = _default;