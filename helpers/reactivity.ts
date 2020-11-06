
import { ComponentInterface, idCollector, Vytic } from "../vytic";
import { VirtualDomInterface } from "./parser";
import { addAttributes, addHandlers, deleteElement, insertElement, nextTick, updateAttributes, updateClasses, updateStylings } from "./utils";
export type ComponentType = { [key: string]: ComponentInterface }

export interface UpdateInterface {
    vDom: VirtualDomInterface,
    methods: MethodsInterface,
    components: ComponentType,
    parent: Element,
    once: Boolean
}
export interface ReactivityInterface {
    vDom: VirtualDomInterface,
    data: Object,
    methods: MethodsInterface,
    components: ComponentType,
    parent: Element,
    index?: number
}

export class Reactivity {
    vDom: VirtualDomInterface;
    methods: MethodsInterface;
    updating: Boolean;
    heap: Object
    components: ComponentType
    parent: Element
    index: number
    constructor({ vDom, data, methods, components, parent, index }: ReactivityInterface) {
        this.methods = methods;
        this.updating = false
        this.components = components;
        this.heap = { ...data, ...this.methods }
        this.parent = parent
        this.vDom = vDom
        this.index = index
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
                    this.update({ vDom: this.vDom, methods: this.methods, components: this.components, parent: this.parent, index: this.index })

                    this.updating = false
                }
                return true;
            }.bind(this),
        };
    }
    update({ vDom, methods, components, parent, once = false }: UpdateInterface): Element {
        let isComponent = vDom.tag in components;
        let stylings = vDom.attributes.bindedStyle
        let handlers = vDom.attributes.handlers
        let attrs = vDom.attributes.attr
        let showStat = vDom.attributes.show
        let visible = vDom.attributes.visible
        let classes = vDom.attributes.bindedClasses
        let bindedAttrs = vDom.attributes.bindedAttr
        if (!parent) {
            parent = vDom.attributes.parent
        }
        if (once) {
            if (vDom.tag in components) {
                let vytic = new Vytic({ index: vDom.attributes.index, parent, ...components[vDom.tag] })
                vDom.element = vytic.getReactiveElement()
                isComponent = true
                if (vDom.tag in idCollector) {
                    vDom.styleId = idCollector[vDom.tag]
                    vDom.element.setAttribute(vDom.styleId, "")
                }
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

            addHandlers(handlers, methods, vDom.element, this.heap)
            addAttributes(attrs, vDom.element)
            updateClasses(classes, this.heap, vDom.element)

        }
        if (showStat !== null) {
            let value = !!parseString(showStat, this.heap)
            if (!value && visible) {
                deleteElement(vDom.element)
                vDom.attributes.visible = false
                return
            }
            if (value && !visible) {
                vDom.attributes.visible = true
                if (vDom.tag in components) {
                    let vytic = new Vytic({ index: vDom.attributes.index, parent, ...components[vDom.tag] })
                    vDom.element = vytic.getReactiveElement()
                    isComponent = true
                } else {
                    vDom.element = document.createElement(vDom.tag)
                }
                addHandlers(handlers, methods, vDom.element, this.heap)
                addAttributes(attrs, vDom.element)
                insertElement(vDom.element, parent, this.index !== undefined ? this.index : vDom.attributes.index)
            }
        }


        updateStylings(stylings, this.heap, vDom.element)
        updateClasses(classes, this.heap, vDom.element)
        updateAttributes(bindedAttrs, this.heap, vDom.element)
        if (vDom.attributes.visible) {

            insertElement(vDom.element, parent, this.index !== undefined ? this.index : vDom.attributes.index)
        }
        for (let child of vDom.children) {
            let childElement = this.update({ vDom: child, methods, components, parent: vDom.element, once })
            if (once) {
                if (childElement !== null) {
                    vDom.element.appendChild(childElement)
                }
            }
        }
        if (isComponent) return vDom.element
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