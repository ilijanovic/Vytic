"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vytic = require("../../dist/vytic");

var root =
/*html */
"\n    <div class=\"sidebar\">\n        <h1  s:width=\"'500px'\">Menu</h1>\n\n    </div>\n";
var style =
/*css */
"\n    .sidebar {\n        width: 300px;\n        position: fixed;\n        left: 0;\n        height: 100vh;\n        background: green;\n        top: 0;\n    }\n";
var _default = {
  root: root,
  style: style,
  data: {
    left: 300
  },
  ready: function ready() {
    return regeneratorRuntime.async(function ready$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};
exports["default"] = _default;