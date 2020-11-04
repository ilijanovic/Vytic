
import { VirtualDomInterface } from "./parser";
import { addAttributes, addHandlers, deleteElement, insertElement, nextTick, updateAttributes, updateClasses, updateStylings } from "./utils";

export class Reactivity {
    vDom: VirtualDomInterface;
    data: Object;
    methods: MethodsInterface;
    updating: Boolean;
    constructor(vDom: VirtualDomInterface, data: Object, methods: MethodsInterface) {
        this.vDom = vDom;
        this.data = data
        this.methods = methods;
        this.updating = false
    }

    makeReactive(): Object {
        let reactiveData = new Proxy(this.data, this.proxyHandler());
        for (let key in this.methods) {
            this.methods[key] = this.methods[key].bind(reactiveData)
        }
        this.data = reactiveData
        return reactiveData
    }
    proxyHandler(): Object {

        return {
            get: function (obj: any, prop: any) {
                return obj[prop];
            }.bind(this),
            set: async function (obj: { [key: string]: any }, prop: string, newVal: any) {
                obj[prop] = newVal;

                if (!this.updating) {
                    this.updating = true
                    await nextTick()
                    this.update(this.vDom, this.methods, this.components)

                    this.updating = false
                }
                return true;
            }.bind(this),
        };
    }
    update(vDom: VirtualDomInterface, methods: MethodsInterface, once: Boolean = false): HTMLElement {

        let stylings = vDom.attributes.bindedStyle
        let handlers = vDom.attributes.handlers
        let attrs = vDom.attributes.attr
        let showStat = vDom.attributes.show
        let visible = vDom.attributes.visible
        let classes = vDom.attributes.bindedClasses
        let bindedAttrs = vDom.attributes.bindedAttr
        if (once) {
            vDom.element = document.createElement(vDom.tag)

            if (showStat !== null) {
                let value = !!parseString(showStat, this.data)
                if (!value) {
                    vDom.attributes.visible = false
                    return null
                }
            }
            addHandlers(handlers, methods, vDom.element)
            addAttributes(attrs, vDom.element)
            updateClasses(classes, this.data, vDom.element)

        }
        if (showStat !== null) {
            let value = !!parseString(showStat, this.data)
            if (!value && visible) {
                deleteElement(vDom.element)
                vDom.attributes.visible = false
                return
            }
            if (value && !visible) {
                vDom.attributes.visible = true
                vDom.element = document.createElement(vDom.tag)
                addHandlers(handlers, methods, vDom.element)
                insertElement(vDom.element, vDom.attributes.parent, vDom.attributes.index)
            }
        }
        let parsedText = parseString(vDom.originalText, this.data)
        if (parsedText !== vDom.text) {
            vDom.element.textContent = parsedText
        }

        updateStylings(stylings, this.data, vDom.element)
        updateClasses(classes, this.data, vDom.element)
        updateAttributes(bindedAttrs, this.data, vDom.element)
        for (let child of vDom.children) {

            let childElement = this.update(child, methods, once)
            if (once) {
                if (childElement !== null) {
                    vDom.element.appendChild(childElement)
                }
            }


        }
        return vDom.element

    }
}
export interface MethodsInterface {
    [key: string]: any
}

export function parseString(str: String, data: Object) {
    let variables = Object.entries(data);
    let mappedData = variables
        .map(
            ([prop, val]) =>
                `let ${prop}=${typeof val === "function"
                    ? "function " + val.toString() + ".bind(this)"
                    : JSON.stringify(val)
                };`
        )
        .join("");
    return new Function(`${mappedData} return ${str}; `).call(data);
}