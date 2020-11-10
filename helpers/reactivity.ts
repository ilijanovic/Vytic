

import { ComponentInterface, idCollector, Vytic } from "../vytic";
import { VirtualDomInterface } from "./parser";
import {
    addAttributes, addCSS, addHandlers, deleteElement,
    generateId, insertElement,
    nextTick, removeHandlers, uniqueStylesheet, updateAttributes,
    updateChildrens,
    updateClasses, updateProps, updateStylings
} from "./utils";
export type ComponentType = { [key: string]: ComponentInterface }

export interface UpdateInterface {
    vDom: VirtualDomInterface,
    methods: MethodsInterface,
    components: ComponentType,
    parent: Element,
    once: Boolean,
    styleId?: string,
    skip?: Boolean
}
export interface ReactivityInterface {
    vDom: VirtualDomInterface,
    data: Object,
    methods: MethodsInterface,
    components: ComponentType,
    parent: Element,
    index?: number,
    styleId: string,
    slots: Element[],
    props?: { [key: string]: string }
}

export class Reactivity {
    vDom: VirtualDomInterface;
    methods: MethodsInterface;
    updating: Boolean;
    heap: { [key: string]: any }
    components: ComponentType
    parent: Element
    index: number
    styleId: string
    slots: Element[]
    props: { [key: string]: string }
    constructor({ vDom, slots, data, methods, components, parent, index, styleId, props }: ReactivityInterface) {
        this.methods = methods;
        this.updating = false
        this.components = components;
        this.heap = { ...data, ...this.methods, ...props }
        this.parent = parent
        this.vDom = vDom
        this.index = index
        this.styleId = styleId
        this.slots = slots
        this.props = props
    }
    makeReactive(): Object {
        let reactiveData = new Proxy(this.heap, this.proxyHandler());
        for (let key in this.methods) {
            this.heap[key] = this.heap[key].bind(reactiveData)
        }
        this.heap = reactiveData
        return reactiveData
    }
    proxyHandler(): Object {
        return {
            get: function (obj: any, prop: any) {
                if (
                    ["[object Object]", "[object Array]"].indexOf(
                        Object.prototype.toString.call(obj[prop])
                    ) > -1
                ) {
                    return new Proxy(obj[prop], this.proxyHandler());
                }
                return obj[prop];
            }.bind(this),
            set: async function (obj: { [key: string]: any }, prop: string, newVal: any) {
                obj[prop] = newVal;
                if (!this.updating) {
                    this.updating = true
                    await nextTick()
                    this.update({ vDom: this.vDom, methods: this.methods, components: this.components, parent: this.parent, index: this.index, styleId: this.styleId })
                    updateChildrens(this.vDom)
                    this.updating = false
                }
                return true;
            }.bind(this),
        };
    }
    update({ vDom, methods, skip = false, components, parent, once = false, styleId = "" }: UpdateInterface): HTMLElement {
        if (skip) return
        if (vDom.tag === "SLOT") {
            this.slots.forEach(slotChild => {
                if (slotChild) {
                    parent.append(slotChild)
                }
            })
            return
        }
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
                if (vDom.tag in idCollector) {
                    styleId = idCollector[vDom.tag]
                } else {
                    if (components[vDom.tag].style) {
                        let generatedId = generateId(5)
                        idCollector[vDom.tag] = generatedId
                        styleId = generatedId
                        let scopedStyle = uniqueStylesheet(components[vDom.tag].style, styleId)
                        addCSS(scopedStyle)
                    }
                }
                if (showStat !== null) {
                    let value = !!parseString(showStat, this.heap)
                    if (!value) {
                        vDom.attributes.visible = false
                        return null
                    }
                }

                let slotElements = vDom.children.map(child => this.update({ vDom: child, styleId, parent, once, components, methods }))
                let vytic = new Vytic({ props: this.props, slots: slotElements, styleId, index: vDom.attributes.index, parent, ...components[vDom.tag] })
                vDom.element = vytic.getReactiveElement()
                vDom.componentData = vytic.getReactiveData()
                isComponent = true
            } else {
                vDom.element = document.createElement(vDom.tag)
            }
            if (styleId) {
                vDom.element.setAttribute(styleId, "")
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
                deleteElement(vDom.element, parent)
                vDom.text = ""
                vDom.attributes.visible = false

                return
            }
            if (value && !visible) {
                vDom.attributes.visible = true
                if (vDom.tag in components) {
                    if (vDom.tag in idCollector) {
                        styleId = idCollector[vDom.tag]
                    }
                    let slotElements = vDom.children.map(child => this.update({ vDom: child, styleId, parent, once, components, methods }))

                    let vytic = new Vytic({ slots: slotElements, props: this.props, styleId, index: vDom.attributes.index, parent, ...components[vDom.tag] })
                    vDom.element = vytic.getReactiveElement()

                    vDom.componentData = vytic.getReactiveData()
                    isComponent = true
                } else {
                    vDom.element = document.createElement(vDom.tag)
                }
                if (vDom.staticNode) {
                    if (vDom.originalText) {
                        vDom.element.textContent = vDom.originalText
                    }
                }
                addHandlers(handlers, methods, vDom.element, this.heap)
                addAttributes(attrs, vDom.element)
                insertElement(vDom.element, parent, vDom.attributes.index)
            }
        }


        updateStylings(stylings, this.heap, vDom.element)
        updateClasses(classes, this.heap, vDom.element)
        updateAttributes(bindedAttrs, this.heap, vDom.element)

        updateProps(vDom.attributes.props, vDom.componentData, this.heap)

        if (isComponent) {
            for (let child of vDom.children) {
                this.update({ vDom: child, methods, components, parent: vDom.element, once: false, styleId })
            }
        }

        if (isComponent) return vDom.element
        if (!vDom.attributes.visible) return vDom.element
        for (let child of vDom.children) {
            let childElement = this.update({ skip, vDom: child, methods, components, parent: vDom.element, once, styleId })
            if (once) {
                if (childElement) {
                    vDom.element.appendChild(childElement)
                }
            }
        }
        if (!vDom.staticNode) {
            let parsedText = parseString(vDom.originalText, this.heap)
            if (parsedText !== vDom.text) {
                vDom.element.textContent = parsedText
                vDom.text = parsedText

            }
        } else {
            if (vDom.originalText && once) {
                vDom.element.textContent = vDom.originalText
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
                    ? "''"
                    : JSON.stringify(val)
                };`
        )
        .join("");
    return new Function(`${mappedData} return ${str}; `).call(data);
}