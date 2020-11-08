"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vytic = require("../dist/vytic.js");

var root =
/*html */
"\n    <button>\n    <div>\n        <slot></slot>\n    </div>\n    </button>\n";
var style =
/*css */
"\n    button {\n        background: red;\n        padding: 10px;\n        color: white;\n        border-radius: 6px;\n        border: none;\n        cursor: pointer;\n    }\n";
var _default = {
  root: root,
  style: style
};
exports["default"] = _default;