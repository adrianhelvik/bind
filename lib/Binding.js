"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state = require("./state.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Binding =
/*#__PURE__*/
function () {
  function Binding(name) {
    _classCallCheck(this, Binding);

    this.updateHandlers = new Set();
    this.name = name || 'untitled';
  }

  _createClass(Binding, [{
    key: "inspect",
    value: function inspect() {
      return "Binding('".concat(this.name.replace(/'/g, "\\'"), "')");
    }
  }, {
    key: "updated",
    value: function updated() {
      _state.manager.addUpdated(this);
    }
  }, {
    key: "accessed",
    value: function accessed() {
      _state.manager.addAccessed(this);
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(fn) {
      var _this = this;

      this.updateHandlers.add(fn);
      return function () {
        _this.updateHandlers["delete"](fn);
      };
    }
  }, {
    key: "callUpdateHandlers",
    value: function callUpdateHandlers() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.updateHandlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handler = _step.value;

          try {
            handler();
          } catch (e) {
            var error = error || e;
          }
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

      if (error) throw error;
    }
  }]);

  return Binding;
}();

var _default = Binding;
exports["default"] = _default;