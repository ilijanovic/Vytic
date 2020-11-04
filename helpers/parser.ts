import { AttributesInterface, collectAttributes, formatText } from "../helpers/utils"

export function parseHTML(html: HTMLElement | Element): VirtualDomInterface {

    return {
        tag: html.tagName,
        text: "",
        originalText: formatText(html.childNodes[0]?.nodeValue),
        element: null,
        children: Array.from(html.children).map(child => parseHTML(child)),
        attributes: collectAttributes(html)
    }
}
export interface VirtualDomInterface {
    tag: string,
    text: string,
    originalText: string,
    attributes: AttributesInterface,
    children: any[],
    element: HTMLElement
}
