"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = transaction;

var _state = require("./state.js");

var _batch = _interopRequireDefault(require("./batch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function transaction(fn) {
  var result;
  (0, _batch["default"])(function () {
    var _manager$transaction = _state.manager.transaction(fn),
        error = _manager$transaction.error,
        transaction = _manager$transaction.transaction;

    if (error) {
      _state.manager.revertTransaction(transaction);

      throw error;
    }

    result = transaction;
  });
  return result;
}