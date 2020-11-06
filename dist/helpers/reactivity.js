var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { idCollector, Vytic } from "../vytic.js";
import { addAttributes, addHandlers, deleteElement, insertElement, nextTick, updateAttributes, updateClasses, updateStylings } from "./utils.js";
export class Reactivity {
    constructor({ vDom, data, methods, components, parent, index }) {
        this.methods = methods;
        this.updating = false;
        this.components = components;
        this.heap = Object.assign(Object.assign({}, data), this.methods);
        this.parent = parent;
        this.vDom = vDom;
        this.index = index;
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
                        this.update({ vDom: this.vDom, methods: this.methods, components: this.components, parent: this.parent, index: this.index });
                        this.updating = false;
                    }
                    return true;
                });
            }.bind(this),
        };
    }
    update({ vDom, methods, components, parent, once = false }) {
        let isComponent = vDom.tag in components;
        let stylings = vDom.attributes.bindedStyle;
        let handlers = vDom.attributes.handlers;
        let attrs = vDom.attributes.attr;
        let showStat = vDom.attributes.show;
        let visible = vDom.attributes.visible;
        let classes = vDom.attributes.bindedClasses;
        let bindedAttrs = vDom.attributes.bindedAttr;
        if (!parent) {
            parent = vDom.attributes.parent;
        }
        if (once) {
            if (vDom.tag in components) {
                let vytic = new Vytic(Object.assign({ index: vDom.attributes.index, parent }, components[vDom.tag]));
                vDom.element = vytic.getReactiveElement();
                isComponent = true;
                if (vDom.tag in idCollector) {
                    vDom.styleId = idCollector[vDom.tag];
                    vDom.element.setAttribute(vDom.styleId, "");
                }
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
            addHandlers(handlers, methods, vDom.element, this.heap);
            addAttributes(attrs, vDom.element);
            updateClasses(classes, this.heap, vDom.element);
        }
        if (showStat !== null) {
            let value = !!parseString(showStat, this.heap);
            if (!value && visible) {
                deleteElement(vDom.element);
                vDom.attributes.visible = false;
                return;
            }
            if (value && !visible) {
                vDom.attributes.visible = true;
                if (vDom.tag in components) {
                    let vytic = new Vytic(Object.assign({ index: vDom.attributes.index, parent }, components[vDom.tag]));
                    vDom.element = vytic.getReactiveElement();
                    isComponent = true;
                }
                else {
                    vDom.element = document.createElement(vDom.tag);
                }
                addHandlers(handlers, methods, vDom.element, this.heap);
                addAttributes(attrs, vDom.element);
                insertElement(vDom.element, parent, this.index !== undefined ? this.index : vDom.attributes.index);
            }
        }
        updateStylings(stylings, this.heap, vDom.element);
        updateClasses(classes, this.heap, vDom.element);
        updateAttributes(bindedAttrs, this.heap, vDom.element);
        if (vDom.attributes.visible) {
            insertElement(vDom.element, parent, this.index !== undefined ? this.index : vDom.attributes.index);
        }
        for (let child of vDom.children) {
            let childElement = this.update({ vDom: child, methods, components, parent: vDom.element, once });
            if (once) {
                if (childElement !== null) {
                    vDom.element.appendChild(childElement);
                }
            }
        }
        if (isComponent)
            return vDom.element;
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
