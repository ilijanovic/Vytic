"use strict";
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
var utils_1 = require("./utils");
var Reactivity = /** @class */ (function () {
    function Reactivity(vDom, data, methods) {
        this.vDom = vDom;
        this.data = data;
        this.methods = methods;
        this.updating = false;
    }
    Reactivity.prototype.makeReactive = function () {
        var reactiveData = new Proxy(this.data, this.proxyHandler());
        for (var key in this.methods) {
            this.methods[key] = this.methods[key].bind(reactiveData);
        }
        this.data = reactiveData;
        return reactiveData;
    };
    Reactivity.prototype.proxyHandler = function () {
        return {
            get: function (obj, prop) {
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
                                return [4 /*yield*/, this.update(this.vDom, this.methods)];
                            case 1:
                                _a.sent();
                                this.updating = false;
                                _a.label = 2;
                            case 2: return [2 /*return*/, true];
                        }
                    });
                });
            }.bind(this)
        };
    };
    Reactivity.prototype.update = function (vDom, methods, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        return new Promise(function (res) {
            requestAnimationFrame(function () { return __awaiter(_this, void 0, void 0, function () {
                var stylings, handlers, attrs, showStat, visible, classes, value, value, parsedText, _i, _a, child, childElement;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            stylings = vDom.attributes.bindedStyle;
                            handlers = vDom.attributes.handlers;
                            attrs = vDom.attributes.attr;
                            showStat = vDom.attributes.show;
                            visible = vDom.attributes.visible;
                            classes = vDom.attributes.bindedClasses;
                            if (once) {
                                vDom.element = document.createElement(vDom.tag);
                                if (showStat !== null) {
                                    value = !!parseString(showStat, this.data);
                                    if (!value) {
                                        vDom.attributes.visible = false;
                                        return [2 /*return*/, res(null)];
                                    }
                                }
                                handlers.forEach(function (_a) {
                                    var handler = _a[0], method = _a[1];
                                    vDom.element.addEventListener(handler, methods[method]);
                                });
                                attrs.forEach(function (_a) {
                                    var attribute = _a[0], value = _a[1];
                                    vDom.element.setAttribute(attribute, value);
                                });
                                classes.forEach(function (_a) {
                                    var cl = _a[0], value = _a[1];
                                    var status = !!parseString(value, _this.data);
                                    if (status) {
                                        vDom.element.classList.add(cl);
                                    }
                                    else {
                                        vDom.element.classList.remove(cl);
                                    }
                                });
                            }
                            if (showStat !== null) {
                                value = !!parseString(showStat, this.data);
                                if (!value && visible) {
                                    utils_1.deleteElement(vDom.element);
                                    vDom.attributes.visible = false;
                                    return [2 /*return*/, res()];
                                }
                                if (value && !visible) {
                                    vDom.attributes.visible = true;
                                    vDom.element = document.createElement(vDom.tag);
                                    console.log("inserted", vDom.element);
                                    utils_1.insertElement(vDom.element, vDom.attributes.parent, vDom.attributes.index);
                                }
                            }
                            parsedText = parseString(vDom.originalText, this.data);
                            if (parsedText !== vDom.text) {
                                vDom.element.textContent = parsedText;
                            }
                            stylings.forEach(function (_a) {
                                var style = _a[0], stringVariable = _a[1];
                                var value = parseString(stringVariable, _this.data);
                                vDom.element.style.setProperty(style, value);
                            });
                            _i = 0, _a = vDom.children;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            child = _a[_i];
                            return [4 /*yield*/, this.update(child, methods, once)];
                        case 2:
                            childElement = _b.sent();
                            if (once) {
                                if (childElement !== null) {
                                    vDom.element.appendChild(childElement);
                                }
                            }
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            classes.forEach(function (_a) {
                                var cl = _a[0], value = _a[1];
                                var status = !!parseString(value, _this.data);
                                if (status) {
                                    vDom.element.classList.add(cl);
                                }
                                else {
                                    vDom.element.classList.remove(cl);
                                }
                            });
                            return [2 /*return*/, res(vDom.element)];
                    }
                });
            }); });
        });
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
            ? "function " + val.toString() + ".bind(this)"
            : JSON.stringify(val)) + ";";
    })
        .join("");
    return new Function(mappedData + " return " + str + "; ").call(data);
}
exports.parseString = parseString;
