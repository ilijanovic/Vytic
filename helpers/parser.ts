import { AttributesInterface, collectAttributes, formatText } from "../helpers/utils"

/**
 * Compiles HTML down to an virtual DOM.
 * Element will not be deleted
 * 
 * @param {Element} html - Element that will be compiled down to an virtual DOM
 * @returns {Object} - Returns virtual DOM representation of the element 
 */
export function parseHTML(html: Element, styleId: string): VirtualDomInterface {
    let { text, staticNode } = formatText(html.childNodes[0]?.nodeValue)
    return {
        tag: html.tagName,
        text: "",
        styleId,
        originalText: text,
        element: null,
        staticNode,
        children: Array.from(html.children).map(child => parseHTML(child, styleId)),
        attributes: collectAttributes(html),
        componentData: {},
    }
}
export interface VirtualDomInterface {
    tag: string,
    text: string,
    originalText: string,
    attributes: AttributesInterface,
    children: any[],
    styleId: string,
    element: HTMLElement,
    staticNode: Boolean,
    componentData: { [key: string]: any }
}
