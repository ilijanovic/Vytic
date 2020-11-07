"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vytic = require("../dist/vytic.js");

var root =
/*html */
"\n    <div s:transform=\"'translateX(' + left + 'px)'\" class=\"sidebar\">\n        <h1>Menu</h1>\n    </div>\n";
var style =
/*css */
"\n    .sidebar {\n        width: 300px;\n        position: fixed;\n        left: 0;\n        height: 100vh;\n        background: green;\n        top: 0;\n        transition: all 400ms;\n    }\n";
var _default = {
  root: root,
  style: style,
  data: {
    left: -300
  },
  ready: function ready() {
    return regeneratorRuntime.async(function ready$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.left = 0;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  }
};
exports["default"] = _default;