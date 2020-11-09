"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buttons = require("./components/buttons.js");

var _box = _interopRequireDefault(require("./components/box.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var style =
/*css */
"\n    .app {\n        max-width: 500px;\n        margin: 30px auto;\n    }\n    .counter {\n        padding: 15px;\n        border: 1px solid #dadada;\n        border-radius: 6px;\n        box-shadow: 0 0 10px -8px black;\n        margin: 20px 0;\n    }\n";
var root =
/*html */
"\n    <div class=\"app\">\n        <div>\n        <button @click=\"add\">Add</button>\n        <input @keyup=\"add\" @input=\"writename\" a:value=\"nameinput\" />\n            <div loop=\"names-name\">\n                <p>Name: {{name}}</p>\n            </div>\n            <p class=\"counter\">Counter: {{counter}}</p>\n        </div>\n       \n        <primary @click=\"this.counter--\">\n            <p>-</p>\n        </primary>\n        <secondary if=\"visible\" @click=\"this.counter++\">\n            <p>+</p>\n        </secondary>\n        <box p:counter=\"counter\" if=\"counter > 5\"></box>\n  \n    </div>\n";
var _default = {
  root: root,
  style: style,
  data: {
    counter: 0,
    visible: true,
    names: ["ilija"],
    nameinput: ""
  },
  methods: {
    add: function add() {
      this.names.push(this.nameinput);
      this.nameinput = "";
    },
    writename: function writename(e) {
      this.nameinput = e.target.value;
    }
  },
  components: {
    primary: _buttons.primary,
    secondary: _buttons.secondary,
    box: _box["default"]
  }
};
exports["default"] = _default;