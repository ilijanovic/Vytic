var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addAttributes, addHandlers, deleteElement, insertElement, nextTick, updateAttributes, updateClasses, updateStylings } from "./utils.js";
export class Reactivity {
    constructor(vDom, data, methods) {
        this.vDom = vDom;
        this.data = data;
        this.methods = methods;
        this.updating = false;
    }
    makeReactive() {
        let reactiveData = new Proxy(this.data, this.proxyHandler());
        for (let key in this.methods) {
            this.methods[key] = this.methods[key].bind(reactiveData);
        }
        this.data = reactiveData;
        return reactiveData;
    }
    proxyHandler() {
        return {
            get: function (obj, prop) {
                return obj[prop];
            }.bind(this),
            set: function (obj, prop, newVal) {
                return __awaiter(this, void 0, void 0, function* () {
                    obj[prop] = newVal;
                    if (!this.updating) {
                        this.updating = true;
                        yield nextTick();
                        this.update(this.vDom, this.methods, this.components);
                        this.updating = false;
                    }
                    return true;
                });
            }.bind(this),
        };
    }
    update(vDom, methods, once = false) {
        let stylings = vDom.attributes.bindedStyle;
        let handlers = vDom.attributes.handlers;
        let attrs = vDom.attributes.attr;
        let showStat = vDom.attributes.show;
        let visible = vDom.attributes.visible;
        let classes = vDom.attributes.bindedClasses;
        let bindedAttrs = vDom.attributes.bindedAttr;
        if (once) {
            vDom.element = document.createElement(vDom.tag);
            if (showStat !== null) {
                let value = !!parseString(showStat, this.data);
                if (!value) {
                    vDom.attributes.visible = false;
                    return null;
                }
            }
            addHandlers(handlers, methods, vDom.element);
            addAttributes(attrs, vDom.element);
            updateClasses(classes, this.data, vDom.element);
        }
        if (showStat !== null) {
            let value = !!parseString(showStat, this.data);
            if (!value && visible) {
                deleteElement(vDom.element);
                vDom.attributes.visible = false;
                return;
            }
            if (value && !visible) {
                vDom.attributes.visible = true;
                vDom.element = document.createElement(vDom.tag);
                addHandlers(handlers, methods, vDom.element);
                insertElement(vDom.element, vDom.attributes.parent, vDom.attributes.index);
            }
        }
        let parsedText = parseString(vDom.originalText, this.data);
        if (parsedText !== vDom.text) {
            vDom.element.textContent = parsedText;
        }
        updateStylings(stylings, this.data, vDom.element);
        updateClasses(classes, this.data, vDom.element);
        updateAttributes(bindedAttrs, this.data, vDom.element);
        for (let child of vDom.children) {
            let childElement = this.update(child, methods, once);
            if (once) {
                if (childElement !== null) {
                    vDom.element.appendChild(childElement);
                }
            }
        }
        return vDom.element;
    }
}
export function parseString(str, data) {
    let variables = Object.entries(data);
    let mappedData = variables
        .map(([prop, val]) => `let ${prop}=${typeof val === "function"
        ? "function " + val.toString() + ".bind(this)"
        : JSON.stringify(val)};`)
        .join("");
    return new Function(`${mappedData} return ${str}; `).call(data);
}
