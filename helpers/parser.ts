import { AttributesInterface, collectAttributes, formatText } from "../helpers/utils"

/**
 * Compiles HTML down to an virtual DOM.
 * Element will not be deleted
 * 
 * @param {Element} html - Element that will be compiled down to an virtual DOM
 * @returns {Object} - Returns virtual DOM representation of the element 
 */
export function parseHTML(html: Element, styleId: string): VirtualDomInterface {
    return {
        tag: html.tagName,
        text: "",
        styleId,
        originalText: formatText(html.childNodes[0]?.nodeValue),
        element: null,
        children: Array.from(html.children).map(child => parseHTML(child, styleId)),
        attributes: collectAttributes(html)
    }
}
export interface VirtualDomInterface {
    tag: string,
    text: string,
    originalText: string,
    attributes: AttributesInterface,
    children: any[],
    element: HTMLElement,
    styleId: string
}
