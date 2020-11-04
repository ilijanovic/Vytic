import { parseHTML } from "./parser.js";
import { deleteElement, insertElement } from "./utils.js";
export class Reactivity {
    constructor(vDom, data, methods, components) {
        this.vDom = vDom;
        this.data = data;
        this.methods = methods;
        this.updating = false;
        this.components = components;
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
            set: async function (obj, prop, newVal) {
                obj[prop] = newVal;
                if (!this.updating) {
                    this.updating = true;
                    await this.update(this.vDom, this.methods, this.components);
                    this.updating = false;
                }
                return true;
            }.bind(this),
        };
    }
    update(vDom, methods, components, once = false) {
        return new Promise(res => {
            requestAnimationFrame(async () => {
                if (once) {
                    for (let component in components) {
                        if (component.toUpperCase() === vDom.tag) {
                            vDom = parseHTML(components[component]);
                            console.log(vDom);
                        }
                    }
                }
                let stylings = vDom.attributes.bindedStyle;
                let handlers = vDom.attributes.handlers;
                let attrs = vDom.attributes.attr;
                let showStat = vDom.attributes.show;
                let visible = vDom.attributes.visible;
                let classes = vDom.attributes.bindedClasses;
                if (once) {
                    vDom.element = document.createElement(vDom.tag);
                    if (showStat !== null) {
                        let value = !!parseString(showStat, this.data);
                        if (!value) {
                            vDom.attributes.visible = false;
                            return res(null);
                        }
                    }
                    handlers.forEach(([handler, method]) => {
                        vDom.element.addEventListener(handler, methods[method]);
                    });
                    attrs.forEach(([attribute, value]) => {
                        vDom.element.setAttribute(attribute, value);
                    });
                    classes.forEach(([cl, value]) => {
                        let status = !!parseString(value, this.data);
                        if (status) {
                            vDom.element.classList.add(cl);
                        }
                        else {
                            vDom.element.classList.remove(cl);
                        }
                    });
                }
                if (showStat !== null) {
                    let value = !!parseString(showStat, this.data);
                    if (!value && visible) {
                        deleteElement(vDom.element);
                        vDom.attributes.visible = false;
                        return res();
                    }
                    if (value && !visible) {
                        vDom.attributes.visible = true;
                        vDom.element = document.createElement(vDom.tag);
                        insertElement(vDom.element, vDom.attributes.parent, vDom.attributes.index);
                    }
                }
                let parsedText = parseString(vDom.originalText, this.data);
                if (parsedText !== vDom.text) {
                    console.log(vDom);
                    vDom.element.textContent = parsedText;
                }
                stylings.forEach(([style, stringVariable]) => {
                    let value = parseString(stringVariable, this.data);
                    vDom.element.style.setProperty(style, value);
                });
                for (const child of vDom.children) {
                    let childElement = await this.update(child, methods, components, once);
                    if (once) {
                        if (childElement !== null) {
                            vDom.element.appendChild(childElement);
                        }
                    }
                }
                classes.forEach(([cl, value]) => {
                    let status = !!parseString(value, this.data);
                    if (status) {
                        vDom.element.classList.add(cl);
                    }
                    else {
                        vDom.element.classList.remove(cl);
                    }
                });
                return res(vDom.element);
            });
        });
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
