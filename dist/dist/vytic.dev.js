"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWebComponent = createWebComponent;
exports.Vytic = void 0;

var _parser = require("./helpers/parser.js");

var _reactivity = require("./helpers/reactivity.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vytic = function Vytic(_ref) {
  var _ref$root = _ref.root,
      root = _ref$root === void 0 ? null : _ref$root,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      _ref$methods = _ref.methods,
      methods = _ref$methods === void 0 ? {} : _ref$methods;

  _classCallCheck(this, Vytic);

  if (!root) throw "No root element passed";
  var vDom = (0, _parser.parseHTML)(root);
  var reactivity = new _reactivity.Reactivity(vDom, data, methods);
  reactivity.makeReactive();
  reactivity.update(reactivity.vDom, methods, true).then(function (rootElement) {
    root.innerHTML = "";
    Array.from(rootElement.children).forEach(function (child) {
      root.appendChild(child);
    });
  });
};

exports.Vytic = Vytic;

function createWebComponent(_ref2) {
  var name = _ref2.name,
      template = _ref2.template,
      data = _ref2.data,
      methods = _ref2.methods;
  var classes = {
    name: name
  };

  classes.name =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
      _this.innerHTML = template;
      _this.shadowRoot = _this.attachShadow({
        mode: "open"
      });
      new Vytic({
        root: _this.shadowRoot,
        data: data,
        methods: methods
      });
      return _this;
    }

    return _class;
  }(_wrapNativeSuper(HTMLElement));

  window.customElements.define(name, classes.name);
  return name;
}