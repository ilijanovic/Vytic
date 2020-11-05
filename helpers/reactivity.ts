
import { ComponentInterface, Vytic } from "../vytic";
import { VirtualDomInterface } from "./parser";
import { addAttributes, addHandlers, deleteElement, insertElement, nextTick, updateAttributes, updateClasses, updateStylings } from "./utils";
export type ComponentType = { [key: string]: ComponentInterface }


export class Reactivity {
    vDom: VirtualDomInterface;
    methods: MethodsInterface;
    updating: Boolean;
    heap: Object
    components: ComponentType
    constructor(vDom: VirtualDomInterface, data: Object, methods: MethodsInterface, components: ComponentType) {
        this.vDom = vDom;
        this.methods = methods;
        this.updating = false
        this.components = components;
        this.heap = { ...data, ...this.methods }
    }

    makeReactive(): Object {
        let reactiveData = new Proxy(this.heap, this.proxyHandler());
        for (let key in this.methods) {
            this.methods[key] = this.methods[key].bind(reactiveData)
        }
        this.heap = reactiveData
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
    update(vDom: VirtualDomInterface, methods: MethodsInterface, components: ComponentType, once: Boolean = false): Element {
        let isComponent = false
        let stylings = vDom.attributes.bindedStyle
        let handlers = vDom.attributes.handlers
        let attrs = vDom.attributes.attr
        let showStat = vDom.attributes.show
        let visible = vDom.attributes.visible
        let classes = vDom.attributes.bindedClasses
        let bindedAttrs = vDom.attributes.bindedAttr

        if (once) {
            if (vDom.tag in components) {
                let vytic = new Vytic({ ...components[vDom.tag] })
                vDom.element = vytic.getReactiveElement()
                isComponent = true
            } else {
                vDom.element = document.createElement(vDom.tag)
            }
            if (showStat !== null) {
                let value = !!parseString(showStat, this.heap)
                if (!value) {
                    vDom.attributes.visible = false
                    return null
                }
            }

            if (isComponent) return vDom.element
            addHandlers(handlers, methods, vDom.element)
            addAttributes(attrs, vDom.element)
            updateClasses(classes, this.heap, vDom.element)

        }
        if (showStat !== null) {
            let value = !!parseString(showStat, this.heap)
            console.log(value, visible)
            console.log(!value && visible)
            if (!value && visible) {
                console.log(vDom.element)
                //deleteElement(vDom.element)
                vDom.attributes.visible = false
                return
            }
            if (value && !visible) {
                vDom.attributes.visible = true
                vDom.element = document.createElement(vDom.tag)
                addHandlers(handlers, methods, vDom.element)
                addAttributes(attrs, vDom.element)
                insertElement(vDom.element, vDom.attributes.parent, vDom.attributes.index)
            }
        }



        updateStylings(stylings, this.heap, vDom.element)
        updateClasses(classes, this.heap, vDom.element)
        updateAttributes(bindedAttrs, this.heap, vDom.element)

        if (isComponent) return vDom.element


        for (let child of vDom.children) {
            let childElement = this.update(child, methods, components, once)
            if (once) {
                if (childElement !== null) {
                    vDom.element.appendChild(childElement)
                }
            }


        }
        let parsedText = parseString(vDom.originalText, this.heap)
        if (parsedText !== vDom.text) {
            vDom.element.textContent = parsedText
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
                    ? "''"
                    : JSON.stringify(val)
                };`
        )
        .join("");
    return new Function(`${mappedData} return ${str}; `).call(data);
}