"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  root: "\n      <div>\n          <button @click=\"inc\">Counter: {{counter}}</button>\n      </div>\n      ",
  data: {
    counter: 0
  },
  methods: {
    inc: function inc() {
      this.counter++;
    }
  },
  style: "\n      button {\n          background: green;\n          color: white;\n          padding: 10px;\n          cursor: pointer;\n          border: none\n      }\n    "
};
exports["default"] = _default;