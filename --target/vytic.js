"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.createWebComponent = exports.Vytic = void 0;
var parser_1 = require("./helpers/parser");
var reactivity_1 = require("./helpers/reactivity");
var Vytic = /** @class */ (function () {
    function Vytic(_a) {
        var _b = _a.root, root = _b === void 0 ? null : _b, _c = _a.data, data = _c === void 0 ? {} : _c, _d = _a.methods, methods = _d === void 0 ? {} : _d;
        if (!root)
            throw "No root element passed";
        var vDom = parser_1.parseHTML(root);
        var reactivity = new reactivity_1.Reactivity(vDom, data, methods);
        reactivity.makeReactive();
        reactivity.update(reactivity.vDom, methods, true).then(function (rootElement) {
            root.innerHTML = "";
            Array.from(rootElement.children).forEach(function (child) {
                root.appendChild(child);
            });
        });
    }
    return Vytic;
}());
exports.Vytic = Vytic;
function createWebComponent(_a) {
    var name = _a.name, template = _a.template, data = _a.data, methods = _a.methods;
    var classes = {
        name: name
    };
    classes.name = /** @class */ (function (_super) {
        __extends(name, _super);
        function name() {
            var _this = _super.call(this) || this;
            _this.innerHTML = template;
            new Vytic({
                root: _this,
                data: data,
                methods: methods
            });
            return _this;
        }
        ;
        return name;
    }(HTMLElement));
    window.customElements.define(name, classes.name);
    return name;
}
exports.createWebComponent = createWebComponent;
