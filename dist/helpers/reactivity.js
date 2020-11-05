var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Vytic } from "../vytic.js";
import { addAttributes, addHandlers, insertElement, nextTick, updateAttributes, updateClasses, updateStylings } from "./utils.js";
export class Reactivity {
    constructor(vDom, data, methods, components) {
        this.vDom = vDom;
        this.methods = methods;
        this.updating = false;
        this.components = components;
        this.heap = Object.assign(Object.assign({}, data), this.methods);
    }
    makeReactive() {
        let reactiveData = new Proxy(this.heap, this.proxyHandler());
        for (let key in this.methods) {
            this.methods[key] = this.methods[key].bind(reactiveData);
        }
        this.heap = reactiveData;
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
    update(vDom, methods, components, once = false) {
        let isComponent = false;
        let stylings = vDom.attributes.bindedStyle;
        let handlers = vDom.attributes.handlers;
        let attrs = vDom.attributes.attr;
        let showStat = vDom.attributes.show;
        let visible = vDom.attributes.visible;
        let classes = vDom.attributes.bindedClasses;
        let bindedAttrs = vDom.attributes.bindedAttr;
        if (once) {
            if (vDom.tag in components) {
                let vytic = new Vytic(Object.assign({}, components[vDom.tag]));
                vDom.element = vytic.getReactiveElement();
                isComponent = true;
            }
            else {
                vDom.element = document.createElement(vDom.tag);
            }
            if (showStat !== null) {
                let value = !!parseString(showStat, this.heap);
                if (!value) {
                    vDom.attributes.visible = false;
                    return null;
                }
            }
            if (isComponent)
                return vDom.element;
            addHandlers(handlers, methods, vDom.element);
            addAttributes(attrs, vDom.element);
            updateClasses(classes, this.heap, vDom.element);
        }
        if (showStat !== null) {
            let value = !!parseString(showStat, this.heap);
            console.log(value, visible);
            console.log(!value && visible);
            if (!value && visible) {
                console.log(vDom.element);
                //deleteElement(vDom.element)
                vDom.attributes.visible = false;
                return;
            }
            if (value && !visible) {
                vDom.attributes.visible = true;
                vDom.element = document.createElement(vDom.tag);
                addHandlers(handlers, methods, vDom.element);
                addAttributes(attrs, vDom.element);
                insertElement(vDom.element, vDom.attributes.parent, vDom.attributes.index);
            }
        }
        updateStylings(stylings, this.heap, vDom.element);
        updateClasses(classes, this.heap, vDom.element);
        updateAttributes(bindedAttrs, this.heap, vDom.element);
        if (isComponent)
            return vDom.element;
        for (let child of vDom.children) {
            let childElement = this.update(child, methods, components, once);
            if (once) {
                if (childElement !== null) {
                    vDom.element.appendChild(childElement);
                }
            }
        }
        let parsedText = parseString(vDom.originalText, this.heap);
        if (parsedText !== vDom.text) {
            vDom.element.textContent = parsedText;
        }
        return vDom.element;
    }
}
export function parseString(str, data) {
    let variables = Object.entries(data);
    let mappedData = variables
        .map(([prop, val]) => `let ${prop}=${typeof val === "function"
        ? "''"
        : JSON.stringify(val)};`)
        .join("");
    return new Function(`${mappedData} return ${str}; `).call(data);
}
