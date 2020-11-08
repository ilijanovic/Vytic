"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _primary = _interopRequireDefault(require("./primary.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var root =
/*html */
"\n    <div class=\"navigation\">\n        <primary @click=\"inc\">\n           <p>Toggle</p>\n        </primary>\n        <p if=\"visible\">Counter: {{counter}}</p>\n        <p >Second counter: {{counter}}</p>\n    </div>\n";
var style =
/*css */
"\n    .navigation{\n        padding: 20px;\n        background: lightgrey\n    }\n";
var _default = {
  root: root,
  style: style,
  data: {
    counter: 0,
    visible: true
  },
  methods: {
    inc: function inc() {
      this.counter++;
      this.visible = !this.visible;
    }
  },
  components: {
    primary: _primary["default"]
  }
};
exports["default"] = _default;