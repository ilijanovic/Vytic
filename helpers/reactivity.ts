
import { ComponentInterface, idCollector, Vytic } from "../vytic";
import { VirtualDomInterface } from "./parser";
import {
    addAttributes, addCSS, addHandlers, deleteElement,
    generateId, getPosition, insertElement,
    nextTick, uniqueStylesheet, updateAttributes,
    updateClasses, updateStylings
} from "./utils";
export type ComponentType = { [key: string]: ComponentInterface }

export interface UpdateInterface {
    vDom: VirtualDomInterface,
    methods: MethodsInterface,
    components: ComponentType,
    parent: Element,
    once: Boolean,
    styleId?: string
}
export interface ReactivityInterface {
    vDom: VirtualDomInterface,
    data: Object,
    methods: MethodsInterface,
    components: ComponentType,
    parent: Element,
    index?: number,
    styleId: string
}

export class Reactivity {
    vDom: VirtualDomInterface;
    methods: MethodsInterface;
    updating: Boolean;
    heap: Object
    components: ComponentType
    parent: Element
    index: number
    styleId: string
    constructor({ vDom, data, methods, components, parent, index, styleId }: ReactivityInterface) {
        this.methods = methods;
        this.updating = false
        this.components = components;
        this.heap = { ...data, ...this.methods }
        this.parent = parent
        this.vDom = vDom
        this.index = index
        this.styleId = styleId
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
                    this.update({ vDom: this.vDom, methods: this.methods, components: this.components, parent: this.parent, index: this.index, styleId: this.styleId })

                    this.updating = false
                }
                return true;
            }.bind(this),
        };
    }
    update({ vDom, methods, components, parent, once = false, styleId = "" }: UpdateInterface): Element {
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
                let vytic = new Vytic({ styleId, index: vDom.attributes.index, parent, ...components[vDom.tag] })
                vDom.element = vytic.getReactiveElement()
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
                deleteElement(vDom.element)
                vDom.attributes.visible = false
                return
            }
            if (value && !visible) {
                vDom.attributes.visible = true
                if (vDom.tag in components) {
                    if (vDom.tag in idCollector) {
                        styleId = idCollector[vDom.tag]
                    }
                    let vytic = new Vytic({ styleId, index: vDom.attributes.index, parent, ...components[vDom.tag] })
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
            let index = this.index !== undefined ? this.index : vDom.attributes.index
            if (getPosition(vDom.element, parent) !== index) {

                insertElement(vDom.element, parent, index)
            }

        }
        for (let child of vDom.children) {
            let childElement = this.update({ vDom: child, methods, components, parent: vDom.element, once, styleId })
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