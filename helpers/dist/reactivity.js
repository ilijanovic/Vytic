"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.parseString = exports.Reactivity = void 0;
var vytic_1 = require("../vytic");
var utils_1 = require("./utils");
var Reactivity = /** @class */ (function () {
    function Reactivity(_a) {
        var vDom = _a.vDom, slots = _a.slots, data = _a.data, methods = _a.methods, components = _a.components, parent = _a.parent, index = _a.index, styleId = _a.styleId, props = _a.props;
        this.methods = methods;
        this.updating = false;
        this.components = components;
        this.heap = __assign(__assign(__assign({}, data), this.methods), props);
        this.parent = parent;
        this.vDom = vDom;
        this.index = index;
        this.styleId = styleId;
        this.slots = slots;
        this.props = props;
    }
    Reactivity.prototype.makeReactive = function () {
        var reactiveData = new Proxy(this.heap, this.proxyHandler());
        for (var key in this.methods) {
            this.heap[key] = this.heap[key].bind(reactiveData);
        }
        this.heap = reactiveData;
        return reactiveData;
    };
    Reactivity.prototype.proxyHandler = function () {
        return {
            get: function (obj, prop) {
                if (["[object Object]", "[object Array]"].indexOf(Object.prototype.toString.call(obj[prop])) > -1) {
                    return new Proxy(obj[prop], this.proxyHandler());
                }
                return obj[prop];
            }.bind(this),
            set: function (obj, prop, newVal) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                obj[prop] = newVal;
                                if (!!this.updating) return [3 /*break*/, 2];
                                this.updating = true;
                                return [4 /*yield*/, utils_1.nextTick()];
                            case 1:
                                _a.sent();
                                this.update({ vDom: this.vDom, methods: this.methods, components: this.components, parent: this.parent, index: this.index, styleId: this.styleId });
                                utils_1.updateChildrens(this.vDom);
                                this.updating = false;
                                _a.label = 2;
                            case 2: return [2 /*return*/, true];
                        }
                    });
                });
            }.bind(this)
        };
    };
    Reactivity.prototype.update = function (_a) {
        var _this = this;
        var vDom = _a.vDom, methods = _a.methods, components = _a.components, parent = _a.parent, _b = _a.once, once = _b === void 0 ? false : _b, _c = _a.styleId, styleId = _c === void 0 ? "" : _c;
        if (vDom.loopitem) {
            this.heap[vDom.loopitem.name] = vDom.loopitem.value;
        }
        if (vDom.tag === "SLOT") {
            this.slots.forEach(function (slotChild) {
                if (slotChild) {
                    parent.append(slotChild);
                }
            });
            return;
        }
        var isComponent = vDom.tag in components;
        var stylings = vDom.attributes.bindedStyle;
        var handlers = vDom.attributes.handlers;
        var attrs = vDom.attributes.attr;
        var showStat = vDom.attributes.show;
        var visible = vDom.attributes.visible;
        var classes = vDom.attributes.bindedClasses;
        var bindedAttrs = vDom.attributes.bindedAttr;
        if (!parent) {
            parent = vDom.attributes.parent;
        }
        if (vDom.attributes.loop) {
            var _d = vDom.attributes.loop, strArr = _d[0], strItem_1 = _d[1], strIndex = _d[2];
            var arr = this.heap[strArr];
            var child_1 = vDom.children[0];
            vDom.children.length = 0;
            arr.forEach(function (el) {
                child_1.loopitem = { name: strItem_1, value: el };
                child_1.text = null;
                vDom.children.push(__assign({}, child_1));
            });
        }
        if (once) {
            if (vDom.tag in components) {
                if (vDom.tag in vytic_1.idCollector) {
                    styleId = vytic_1.idCollector[vDom.tag];
                }
                else {
                    if (components[vDom.tag].style) {
                        var generatedId = utils_1.generateId(5);
                        vytic_1.idCollector[vDom.tag] = generatedId;
                        styleId = generatedId;
                        var scopedStyle = utils_1.uniqueStylesheet(components[vDom.tag].style, styleId);
                        utils_1.addCSS(scopedStyle);
                    }
                }
                if (showStat !== null) {
                    var value = !!parseString(showStat, this.heap);
                    if (!value) {
                        vDom.attributes.visible = false;
                        return null;
                    }
                }
                var slotElements = vDom.children.map(function (child) { return _this.update({ vDom: child, styleId: styleId, parent: parent, once: once, components: components, methods: methods }); });
                var vytic = new vytic_1.Vytic(__assign({ props: this.props, slots: slotElements, styleId: styleId, index: vDom.attributes.index, parent: parent }, components[vDom.tag]));
                vDom.element = vytic.getReactiveElement();
                vDom.componentData = vytic.getReactiveData();
                isComponent = true;
            }
            else {
                vDom.element = document.createElement(vDom.tag);
            }
            if (styleId) {
                vDom.element.setAttribute(styleId, "");
            }
            if (showStat !== null) {
                var value = !!parseString(showStat, this.heap);
                if (!value) {
                    vDom.attributes.visible = false;
                    return null;
                }
            }
            utils_1.addHandlers(handlers, methods, vDom.element, this.heap);
            utils_1.addAttributes(attrs, vDom.element);
            utils_1.updateClasses(classes, this.heap, vDom.element);
        }
        if (vDom.attributes.loop) {
            vDom.element.innerHTML = "";
        }
        if (showStat !== null) {
            var value = !!parseString(showStat, this.heap);
            if (!value && visible) {
                utils_1.deleteElement(vDom.element, parent);
                vDom.text = "";
                vDom.attributes.visible = false;
                return;
            }
            if (value && !visible) {
                vDom.attributes.visible = true;
                if (vDom.tag in components) {
                    if (vDom.tag in vytic_1.idCollector) {
                        styleId = vytic_1.idCollector[vDom.tag];
                    }
                    var slotElements = vDom.children.map(function (child) { return _this.update({ vDom: child, styleId: styleId, parent: parent, once: once, components: components, methods: methods }); });
                    var vytic = new vytic_1.Vytic(__assign({ slots: slotElements, props: this.props, styleId: styleId, index: vDom.attributes.index, parent: parent }, components[vDom.tag]));
                    vDom.element = vytic.getReactiveElement();
                    vDom.componentData = vytic.getReactiveData();
                    isComponent = true;
                }
                else {
                    vDom.element = document.createElement(vDom.tag);
                }
                if (vDom.staticNode) {
                    if (vDom.originalText) {
                        vDom.element.textContent = vDom.originalText;
                    }
                }
                utils_1.addHandlers(handlers, methods, vDom.element, this.heap);
                utils_1.addAttributes(attrs, vDom.element);
                utils_1.insertElement(vDom.element, parent, vDom.attributes.index);
            }
        }
        utils_1.updateStylings(stylings, this.heap, vDom.element);
        utils_1.updateClasses(classes, this.heap, vDom.element);
        utils_1.updateAttributes(bindedAttrs, this.heap, vDom.element);
        utils_1.updateProps(vDom.attributes.props, vDom.componentData, this.heap);
        if (isComponent) {
            for (var _i = 0, _e = vDom.children; _i < _e.length; _i++) {
                var child = _e[_i];
                this.update({ vDom: child, methods: methods, components: components, parent: vDom.element, once: false, styleId: styleId });
            }
        }
        if (isComponent)
            return vDom.element;
        if (!vDom.attributes.visible)
            return vDom.element;
        if (vDom.attributes.loop)
            once = true;
        for (var _f = 0, _g = vDom.children; _f < _g.length; _f++) {
            var child = _g[_f];
            var childElement = this.update({ vDom: child, methods: methods, components: components, parent: vDom.element, once: once, styleId: styleId });
            if (once) {
                if (childElement) {
                    vDom.element.appendChild(childElement);
                }
            }
        }
        if (!vDom.staticNode) {
            var parsedText = parseString(vDom.originalText, this.heap);
            if (parsedText !== vDom.text) {
                vDom.element.textContent = parsedText;
                vDom.text = parsedText;
            }
        }
        else {
            if (vDom.originalText && once) {
                vDom.element.textContent = vDom.originalText;
            }
        }
        return vDom.element;
    };
    return Reactivity;
}());
exports.Reactivity = Reactivity;
function parseString(str, data) {
    var variables = Object.entries(data);
    var mappedData = variables
        .map(function (_a) {
        var prop = _a[0], val = _a[1];
        return "let " + prop + "=" + (typeof val === "function"
            ? "''"
            : JSON.stringify(val)) + ";";
    })
        .join("");
    return new Function(mappedData + " return " + str + "; ").call(data);
}
exports.parseString = parseString;
