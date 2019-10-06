"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = revertTransaction;

var _state = require("./state.js");

function revertTransaction(transaction) {
  _state.manager.revertTransaction(transaction);
}